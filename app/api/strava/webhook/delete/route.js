import { NextResponse } from 'next/server';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const client_id = searchParams.get('client_id');
  const client_secret = searchParams.get('client_secret');
  if (!id || !client_id || !client_secret) return NextResponse.json({ error: 'Parameters missing' }, { status: 400 });
  const url = new URL(`https://www.strava.com/api/v3/push_subscriptions/${id}`);
  url.searchParams.set('client_id', client_id);
  url.searchParams.set('client_secret', client_secret);
  const res = await fetch(url.toString(), {
    method: 'DELETE',
  });
  if (res.status === 204) return NextResponse.json({ ok: true });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json({ error: data || 'Failed to delete subscription' }, { status: res.status });
}
