// import { NextResponse } from "next/server";
// import { Pool } from "pg";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "test_db",
//   password: "123",
//   port: 5432 // default PostgreSQL port
// });

// export async function GET(req: Request) {
//   const dt = await pool.query("SELECT * FROM Messages");

//   return NextResponse.json({ message: "Hello from test.", data: dt.rows });
// }

// export async function POST(req: Request) {
//   const { text } = await req.json();

//   await pool.query("INSERT INTO test_table (text) VALUES ($1)", [text]);

//   return NextResponse.json({ message: "Success post method." });
// }
