import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

// Helper to get or create a cart for a customer
async function getOrCreateCart(pool, customerId) {
  const [carts] = await pool.execute('SELECT cart_id FROM Cart WHERE customer_id = ?', [customerId]);
  if (carts.length > 0) {
    return carts[0].cart_id;
  }
  
  const [result] = await pool.execute('INSERT INTO Cart (customer_id) VALUES (?)', [customerId]);
  return result.insertId;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customer_id') || 1; // Default to 1 for demo purposes

    const pool = await getDbConnection();
    const cartId = await getOrCreateCart(pool, customerId);

    const [items] = await pool.execute(
      `SELECT ci.cart_item_id, ci.quantity, p.product_id, p.name, p.price, p.image_url 
       FROM CartItem ci
       JOIN Product p ON ci.product_id = p.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    return NextResponse.json({ cartId, items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_id = 1, product_id, quantity = 1 } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const pool = await getDbConnection();
    const cartId = await getOrCreateCart(pool, customer_id);

    // Check if item already exists in cart
    const [existing] = await pool.execute(
      'SELECT cart_item_id, quantity FROM CartItem WHERE cart_id = ? AND product_id = ?',
      [cartId, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await pool.execute(
        'UPDATE CartItem SET quantity = quantity + ? WHERE cart_item_id = ?',
        [quantity, existing[0].cart_item_id]
      );
    } else {
      // Add new item
      await pool.execute(
        'INSERT INTO CartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, product_id, quantity]
      );
    }

    return NextResponse.json({ message: 'Added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { cart_item_id, quantity } = body;

    if (!cart_item_id || quantity === undefined) {
      return NextResponse.json({ error: 'Cart item ID and quantity are required' }, { status: 400 });
    }

    const pool = await getDbConnection();
    
    if (quantity <= 0) {
      await pool.execute('DELETE FROM CartItem WHERE cart_item_id = ?', [cart_item_id]);
      return NextResponse.json({ message: 'Item removed from cart' });
    } else {
      await pool.execute(
        'UPDATE CartItem SET quantity = ? WHERE cart_item_id = ?',
        [quantity, cart_item_id]
      );
      return NextResponse.json({ message: 'Quantity updated successfully' });
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return NextResponse.json({ error: 'Failed to update cart quantity' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cartitemId = searchParams.get('cart_item_id');

    if (!cartitemId) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 });
    }

    const pool = await getDbConnection();
    await pool.execute('DELETE FROM CartItem WHERE cart_item_id = ?', [cartitemId]);

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
