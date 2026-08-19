import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbConnection();
    const [rows] = await pool.execute('SELECT * FROM Category ORDER BY name ASC');
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing category name' },
        { status: 400 }
      );
    }

    const pool = await getDbConnection();
    const [result] = await pool.execute(
      'INSERT INTO Category (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    return NextResponse.json(
      { message: 'Category created successfully', categoryId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
