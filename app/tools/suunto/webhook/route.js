export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid Suunto Webhook JSON:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw error;
  }

  // Log the event
  console.log('==============Received Suunto Webhook Event:==============');
  console.log(JSON.stringify(payload, null, 2));
  console.log('==========================================================');

  // Return 200 OK
  return new Response(
    JSON.stringify({ status: 'ok' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function GET(request) {
  return new Response(
    JSON.stringify({ message: 'Suunto webhook endpoint - POST only' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}
