import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ 
    authenticated: true, 
    user: {
      id: session.customer_id,
      email: session.email,
      role: session.role,
      first_name: session.first_name,
      last_name: session.last_name
    } 
  });
}
