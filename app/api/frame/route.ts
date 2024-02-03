import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = 'not set';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  let imageUrl = `${NEXT_PUBLIC_URL}/park-1.png`
  let title = "PLACEHOLDER"
  let pageUrl = `${NEXT_PUBLIC_URL}/api/frame`

  // if (body?.untrustedData?.inputText) {
  //   text = body.untrustedData.inputText;
  // }

  if (body.untrustedData.buttonIndex == 1) {
    console.log("in 1")
  } else {
    console.log("in 2")
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Another random article`,
        },
        {
          label: `Visit ${title}`,
        }
      ],
      image: imageUrl,
      post_url: pageUrl,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
