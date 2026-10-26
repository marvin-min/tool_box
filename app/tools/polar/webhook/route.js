export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    console.error('Invalid Polar Webhook JSON:', error);
    return Response.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  console.log('==============Received Polar Webhook Event:==============');
  console.log(JSON.stringify(body, null, 2));
  return new Response('OK', { status: 200 });
}
