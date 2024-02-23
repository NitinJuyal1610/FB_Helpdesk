import { NextRequest, NextResponse } from 'next/server';
import { handleMessage } from '@/lib/webhook';
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');

      return NextResponse.json(Number(challenge));
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      return NextResponse.json({}, { status: 403 });
    }
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log(body);
  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      const webhook_event = entry.messaging[0];
      console.log(webhook_event);

      if (webhook_event.message) {
        handleMessage(
          webhook_event.sender.id,
          webhook_event.recipient.id,
          webhook_event.timestamp,
          webhook_event.message,
        );
      }
    });

    return NextResponse.json({ message: 'EVENT_RECIEVED' });
  } else {
    return NextResponse.json({}, { status: 404 });
  }
}
