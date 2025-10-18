import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const { name, email, clerkId } = await request.json();

  try {
    if (!name || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: 'missing required fields' }),
        {
          status: 400,
        },
      );
    }
    const response = await sql`
  INSERT INTO users (name,email,clerk_id) VALUES (${name},${email},${clerkId})
  `;
    return new Response(JSON.stringify({ value: { data: response } }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error); // Log the error for debugging
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
