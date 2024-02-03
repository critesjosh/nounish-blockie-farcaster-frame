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

  let imageUrl = ''
  let title
  let pageUrl = `${NEXT_PUBLIC_URL}/api/frame`

  // if (body?.untrustedData?.inputText) {
  //   text = body.untrustedData.inputText;
  // }

  if (body.untrustedData.buttonIndex == 1) {
    await fetch('https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&origin=*')
      .then(response => response.json())
      .then(async (data) => {
        const page = data.query.random[0]; // Get the first random article from the response
        title = page.title;
        const pageId = page.id;

        // Construct the URL to the random article
        pageUrl = `https://en.wikipedia.org/wiki?curid=${pageId}`;

        console.log(`Title: ${title}`);
        console.log(`URL: ${pageUrl}`);

        await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pageids=${pageId.toString()}&format=json&pithumbsize=500&origin=*`)
          .then(response => response.json())
          .then(data => {
            const page = data.query.pages[pageId];
            if (page.thumbnail && page.thumbnail.source) {
              imageUrl = page.thumbnail.source
            } else {
              console.log("No thumbnail available for this page.");
            }
          })
          .catch(error => console.error('Error fetching page image:', error));
      })
      .catch(error => console.error('Error fetching random Wikipedia article:', error));
  } else {

  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Another random`,
        },
        {
          label: `Visit ${title}`,
          action: 'post_redirect'
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
