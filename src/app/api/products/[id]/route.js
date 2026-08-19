import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const pool = await getDbConnection();
    
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM Product p 
       LEFT JOIN Category c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category_id, name, description, price, stock_qty, image_url } = body;

    const pool = await getDbConnection();
    
    await pool.execute(
      `UPDATE Product 
       SET category_id = COALESCE(?, category_id), 
           name = COALESCE(?, name), 
           description = COALESCE(?, description), 
           price = COALESCE(?, price), 
           stock_qty = COALESCE(?, stock_qty), 
           image_url = COALESCE(?, image_url)
       WHERE product_id = ?`,
      [category_id, name, description, price, stock_qty, image_url, id]
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const pool = await getDbConnection();
    
    await pool.execute(
      `DELETE FROM Product WHERE product_id = ?`,
      [id]
    );

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
