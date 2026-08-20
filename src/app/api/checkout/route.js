import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to checkout' }, { status: 401 });
  }

  const customerId = session.customer_id;
  let pool;
  
  try {
    const { payment_method = 'credit_card', cart_items = [] } = await request.json().catch(() => ({}));
    
    if (!cart_items || cart_items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    pool = await getDbConnection();

    // Verify stock and calculate total from DB directly to prevent tampering
    let totalAmount = 0;
    const verifiedItems = [];
    
    for (const item of cart_items) {
      const [productRows] = await pool.execute('SELECT price, stock_quantity FROM Product WHERE product_id = ?', [item.product_id]);
      if (productRows.length === 0) {
        return NextResponse.json({ error: `Product ID ${item.product_id} not found` }, { status: 400 });
      }
      
      const product = productRows[0];
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ID ${item.product_id}` }, { status: 400 });
      }
      
      totalAmount += parseFloat(product.price) * item.quantity;
      verifiedItems.push({
        ...item,
        price: product.price
      });
    }

    // Get or Create Cart ID for this customer
    let cartId;
    const [carts] = await pool.execute('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId]);
    if (carts.length > 0) {
      cartId = carts[0].cart_id;
    } else {
      const [newCart] = await pool.execute('INSERT INTO Cart (customer_id) VALUES (?)', [customerId]);
      cartId = newCart.insertId;
    }

    // START TRANSACTION
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Commit CartItems to the DB to satisfy "Core Tables" rule before the order
      for (const item of verifiedItems) {
        await connection.execute(
          'INSERT INTO CartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)',
          [cartId, item.product_id, item.quantity]
        );
      }

      // 2. Create Order
      const [orderResult] = await connection.execute(
        'INSERT INTO `Order` (customer_id, total_amount, status) VALUES (?, ?, ?)',
        [customerId, totalAmount, 'Processing']
      );
      const orderId = orderResult.insertId;

      // 3. Create OrderItems & Reduce Stock
      for (const item of verifiedItems) {
        // Insert into OrderItem
        await connection.execute(
          'INSERT INTO OrderItem (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Reduce stock in Product
        await connection.execute(
          'UPDATE Product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
          [item.quantity, item.product_id]
        );
      }

      // 4. Create Payment
      await connection.execute(
        'INSERT INTO Payment (order_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
        [orderId, totalAmount, payment_method, 'Completed']
      );

      // 5. Clear Cart (delete the CartItems we just inserted because the order is placed)
      await connection.execute('DELETE FROM CartItem WHERE cart_id = ?', [cartId]);
      
      // COMMIT
      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true, orderId });
    } catch (err) {
      // ROLLBACK on error
      await connection.rollback();
      connection.release();
      throw err; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to process checkout transaction' }, { status: 500 });
  }
}
