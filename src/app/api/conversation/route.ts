import { sendMessage } from '@/lib/webhook';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import { getPageTokens } from '@/lib/facebookSdk';
import Conversations from '@/models/Conversations';

export async function POST(req: NextRequest) {
  try {
    const { recipientId, pageId, message, page_token } = await req.json();

    if (!recipientId || !pageId || !message || !page_token) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 },
      );
    }
    await sendMessage(recipientId, pageId, message, page_token);
    return NextResponse.json({ message: 'Message sent' });
  } catch (err) {
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const access_token = searchParams.get('access_token');
    const pageTokens = await getPageTokens(access_token);
    console.log(pageTokens.data.map((page: any) => page.id));
    await connectDB();

    const conversations = await Conversations.find({
      pageId: { $in: pageTokens.data.map((page: any) => page.id) },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ message: 'Something went wrong' });
  }
}
