import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  const session = await getSession();
  
  // They must be logged in to checkout (but we could allow guest checkout if we wanted, for now let's enforce login)
  if (!session) {
    return NextResponse.json({ error: 'You must be logged in to checkout' }, { status: 401 });
  }

  const customerId = session.customer_id;
  let pool;
  try {
    pool = await getDbConnection();

    // Find the cart for this customer
    const [carts] = await pool.execute('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId]);
    if (carts.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }
    const cartId = carts[0].cart_id;
    
    // Get cart items to calculate total and verify stock
    const [cartItems] = await pool.execute(`
      SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity 
      FROM CartItem ci
      JOIN Product p ON ci.product_id = p.product_id
      WHERE ci.cart_id = ?
    `, [cartId]);

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ID ${item.product_id}` }, { status: 400 });
      }
      totalAmount += parseFloat(item.price) * item.quantity;
    }

    const { payment_method = 'credit_card' } = await request.json().catch(() => ({}));

    // START TRANSACTION
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Create Order
      const [orderResult] = await connection.execute(
        'INSERT INTO Orders (customer_id, total_amount, status) VALUES (?, ?, ?)',
        [customerId, totalAmount, 'Processing']
      );
      const orderId = orderResult.insertId;

      // 2. Create OrderItems & Reduce Stock
      for (const item of cartItems) {
        // Insert into OrderItem
        await connection.execute(
          'INSERT INTO OrderItem (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Reduce stock in Product
        await connection.execute(
          'UPDATE Product SET stock_quantity = stock_quantity - ? WHERE product_id = ?',
          [item.quantity, item.product_id]
        );
      }

      // 3. Create Payment
      await connection.execute(
        'INSERT INTO Payment (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
        [orderId, totalAmount, payment_method, 'Completed']
      );

      // 4. Clear Cart
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
