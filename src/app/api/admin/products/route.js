import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key");

async function verifyAdmin(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "admin") return null;
    return payload;
  } catch (err) {
    return null;
  }
}

export async function GET(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const pool = await getDbConnection();
    const [rows] = await pool.execute(`SELECT * FROM Product ORDER BY product_id DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const body = await request.json();
    const { name, description, price, stock_quantity, category_id, image_url } = body;

    const pool = await getDbConnection();
    const [result] = await pool.execute(
      `INSERT INTO Product (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, stock_quantity, category_id || null, image_url || null]
    );

    return NextResponse.json({ success: true, product_id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
