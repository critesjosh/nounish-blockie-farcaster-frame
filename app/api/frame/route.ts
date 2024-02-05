import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';
import { createPublicClient, http, fallback, isAddress } from 'viem'
import { mainnet } from 'viem/chains'
import * as artifact from '../../../artifacts/NounishBlockies.json' assert { type: "json" }
import * as seedArtifact from '../../../artifacts/INounsSeeder.json' assert { type: "json" }
import canvas, { createCanvas, CanvasRenderingContext2D } from 'canvas';
import {
  Canvg,
  presets
} from 'canvg'
import { DOMParser } from 'xmldom'

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

// for canvg
const preset = presets.node({
  DOMParser,
  canvas,
  fetch
});

// async function getResponse(req: NextRequest): Promise<NextResponse> {
//   // let accountAddress: string | undefined = 'not set';
//   // let text: string | undefined = '';

//   // const body: FrameRequest = await req.json();
//   // const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });

//   // if (body?.untrustedData?.inputText && isAddress(body?.untrustedData?.inputText)) {
//   //   text = body.untrustedData.inputText;
//   // }

//   // if (isValid && !isAddress(text)) {
//   //   accountAddress = message.interactor.verified_accounts[0];
//   // }

//   // const alchemy = http(process.env.ALCHEMY_URL)
//   // const infura = http(process.env.INFURA_URL)

//   // const client = createPublicClient({
//   //   chain: mainnet,
//   //   transport: fallback([alchemy, infura]),
//   // })

//   // // @ts-ignore
//   // let abi = artifact.default.abi
//   // // @ts-ignore
//   // let seederAbi = seedArtifact.default.abi

//   // let rand = getRandomInt(1, 1000)

//   // const seed = await client.readContract({
//   //   address: "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
//   //   abi: seederAbi,
//   //   functionName: "generateSeed",
//   //   args: [rand, "0x6229c811D04501523C6058bfAAc29c91bb586268"]
//   // })

//   // const data = await client.readContract({
//   //   address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
//   //   abi,
//   //   functionName: "renderNounishBlockie",
//   //   args: [accountAddress, seed]
//   // })

//   // const base64Data = data.split(",")[1];
//   // const svgContent = Buffer.from(base64Data, 'base64');
//   // const scaleFactor = 0.5
//   // const svgString = svgContent.toString().replace('<svg ', `<svg transform="scale(${scaleFactor})" `);

//   // const width: number = 1000; // Example width
//   // const height: number = 1000; // Example height
//   // const encodedPng = await convertSvgToPng(svgString, width, height)
//   // const dataUri = `data:image/png;base64,${encodedPng}`;


//   // let imageUrl = dataUri
//   // let pageUrl = `${NEXT_PUBLIC_URL}/api/`

//   // let path
//   // const buttonIndex = body.untrustedData.buttonIndex
//   // if (buttonIndex == 1) {
//   //   path = "frame"
//   // } else if (buttonIndex == 2) {
//   //   path = "github"
//   //   pageUrl = "https://github.com/critesjosh/nounish-blockies"
//   // } else {
//   //   path = "mint"
//   //   pageUrl = "https://abi.ninja/0x76152c311630bBE2b472afE779f478B293CFAed3/mainnet?functions=mint"
//   // }
//   // pageUrl = pageUrl + path

//   // return new NextResponse(
//   //   getFrameHtmlResponse({
//   //     buttons: [
//   //       {
//   //         label: `Render another`,
//   //       },
//   //       {
//   //         label: "Learn more",
//   //         action: "post_redirect"
//   //       },
//   //       {
//   //         label: "Mint one",
//   //         action: "post_redirect"
//   //       }
//   //     ],
//   //     input: {
//   //       text: "Enter an Eth address to render"
//   //     },
//   //     image: imageUrl,
//   //     post_url: pageUrl,
//   //   }),
//   // );
// }

export async function POST(req: NextRequest): Promise<Response> {
  let accountAddress: string | undefined = 'not set';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });

  if (body?.untrustedData?.inputText && isAddress(body?.untrustedData?.inputText)) {
    text = body.untrustedData.inputText;
  }
  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  const addressToRender = isAddress(text) ? text : accountAddress
  const png = await getImage(addressToRender)

  // return getResponse(req);

  let pageUrl = `${NEXT_PUBLIC_URL}/api/`

  let path
  const buttonIndex = body.untrustedData.buttonIndex
  if (buttonIndex == 1) {
    path = "frame"
  } else if (buttonIndex == 2) {
    path = "github"
    pageUrl = "https://github.com/critesjosh/nounish-blockies"
  } else {
    path = "mint"
    pageUrl = "https://abi.ninja/0x76152c311630bBE2b472afE779f478B293CFAed3/mainnet?functions=mint"
  }
  pageUrl = pageUrl + path

  if (buttonIndex == 2 || buttonIndex == 3) {
    const headers = new Headers()
    return NextResponse.redirect(pageUrl, {
      headers,
      status: 302
    })
  }

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        label: `Render another`,
      },
      {
        label: "Learn more",
        action: "post_redirect"
      },
      {
        label: "Mint one",
        action: "post_redirect"
      }
    ],
    input: {
      text: "Enter an Eth address to render"
    },
    image: png,
    post_url: pageUrl,
  }),)
}

export const dynamic = 'force-dynamic';


//// UTILS

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min); // Ensures the minimum is inclusive
  max = Math.floor(max); // Ensures the maximum is exclusive
  return Math.floor(Math.random() * (max - min) + min);
}

async function convertSvgToPng(svgString: string, width: number, height: number): Promise<string> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  // const scaleFactor = 0.5;
  // ctx.scale(scaleFactor, scaleFactor);
  // @ts-ignore
  const v = await Canvg.from(ctx, svgString, preset);

  v.start();

  // Get PNG buffer from canvas
  const pngBuffer: Buffer = canvas.toBuffer('image/png');
  console.log(pngBuffer.toString('base64url'))
  return pngBuffer.toString('base64');
}

async function getImage(accountAddress: string): Promise<string> {
  const alchemy = http(process.env.ALCHEMY_URL)
  const infura = http(process.env.INFURA_URL)

  const client = createPublicClient({
    chain: mainnet,
    transport: fallback([alchemy, infura]),
  })

  // @ts-ignore
  let abi = artifact.default.abi
  // @ts-ignore
  let seederAbi = seedArtifact.default.abi

  let rand = getRandomInt(1, 1000)

  const seed = await client.readContract({
    address: "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
    abi: seederAbi,
    functionName: "generateSeed",
    args: [rand, "0x6229c811D04501523C6058bfAAc29c91bb586268"]
  })

  const data = await client.readContract({
    address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
    abi,
    functionName: "renderNounishBlockie",
    args: [accountAddress, seed]
  })

  const base64Data = data.split(",")[1];
  const svgContent = Buffer.from(base64Data, 'base64');
  const scaleFactor = 0.5
  const svgString = svgContent.toString().replace('<svg ', `<svg transform="scale(${scaleFactor})" `);

  const width: number = 1000; // Example width
  const height: number = 1000; // Example height
  const encodedPng = await convertSvgToPng(svgString, width, height)
  const dataUri = `data:image/png;base64,${encodedPng}`;

  return dataUri
}
