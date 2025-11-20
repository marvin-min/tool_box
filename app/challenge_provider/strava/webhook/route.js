import { NextResponse } from 'next/server';

// 处理 Strava webhook 验证和事件
export async function GET(request) {
  // 验证请求（Strava webhook 验证）
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // 你可以自定义 verify_token
  const VERIFY_TOKEN = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN || 'strava_verify_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': challenge });
  }
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(request) {
  // 处理 Strava webhook 事件数据
  const body = await request.json();
  // 打印 Event Data
  console.log('Strava Event Data:', JSON.stringify(body, null, 2));
  // 返回 200 响应
  return new Response('OK', { status: 200 });
}