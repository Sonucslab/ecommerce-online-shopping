import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    const pool = await getDbConnection();
    
    let query = `
      SELECT p.*, c.name as category_name 
      FROM Product p 
      LEFT JOIN Category c ON p.category_id = c.category_id
    `;
    const queryParams = [];

    if (category) {
      query += ` WHERE c.name = ?`;
      queryParams.push(category);
    }
    
    query += ` ORDER BY p.product_id DESC`;
    
    if (limit) {
      query += ` LIMIT ?`;
      queryParams.push(Number(limit));
    }

    const [rows] = await pool.execute(query, queryParams);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { category_id, name, description, price, stock_qty, image_url } = body;

    if (!category_id || !name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pool = await getDbConnection();
    const [result] = await pool.execute(
      `INSERT INTO Product (category_id, name, description, price, stock_qty, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [category_id, name, description, price, stock_qty || 0, image_url || null]
    );

    return NextResponse.json(
      { message: 'Product created successfully', productId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
