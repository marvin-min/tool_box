import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { callback_url, verify_token, client_id, client_secret } = body;
  console.log('Received webhook add request with body:', body);
  if (!callback_url || !verify_token || !client_id || !client_secret) {
    return NextResponse.json({ error: 'Parameters missing' }, { status: 400 });
  }
  const form = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    callback_url,
    verify_token,
  });

  const res = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const data = await res.json();
  if (res.ok) return NextResponse.json({ data });
  return NextResponse.json({ error: data }, { status: res.status });
}
