import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const client_id = searchParams.get('client_id');
  const client_secret = searchParams.get('client_secret');
  if (!client_id || !client_secret) {
    return NextResponse.json({ data: [] });
  }
  const url = new URL('https://www.strava.com/api/v3/push_subscriptions');
  url.searchParams.set('client_id', client_id);
  url.searchParams.set('client_secret', client_secret);
  const res = await fetch(url.toString());
  const data = await res.json();
  return NextResponse.json({ data });
}
