import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { callback_url, verify_token, extra_verify_token } = body;
  if (!callback_url || !verify_token) {
    return NextResponse.json({ error: 'Parameters missing' }, { status: 400 });
  }
  const client_id = searchParams.get('client_id');
  const client_secret = searchParams.get('client_secret');
  const form = new URLSearchParams({
    client_id: client_id,
    client_secret: client_secret,
    callback_url,
    verify_token,
  });
  if (extra_verify_token) {
    form.set('extra_verify_token', extra_verify_token);
  }
  const res = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const data = await res.json();
  if (res.ok) return NextResponse.json({ data });
  return NextResponse.json({ error: data }, { status: res.status });
}
