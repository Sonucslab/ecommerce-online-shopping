import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';
import { hashPassword, encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { first_name, last_name, email, password, phone, address } = await request.json();

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pool = await getDbConnection();
    
    // Check if email exists
    const [existing] = await pool.execute('SELECT customer_id FROM Customer WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    
    // Create customer (default role 'customer')
    const [result] = await pool.execute(
      'INSERT INTO Customer (first_name, last_name, email, password_hash, phone, address, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, passwordHash, phone || null, address || null, 'customer']
    );

    // Create session token
    const customerId = result.insertId;
    const sessionToken = await encrypt({ customer_id: customerId, email, role: 'customer' });
    
    // Set cookie
    (await cookies()).set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
