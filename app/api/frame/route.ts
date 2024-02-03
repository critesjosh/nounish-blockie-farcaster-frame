import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';
import { createPublicClient, http, fallback } from 'viem'
import { mainnet } from 'viem/chains'
import * as artifact from '../../../artifacts/NounishBlockies.json' assert { type: "json" }
import * as seedArtifact from '../../../artifacts/INounsSeeder.json' assert { type: "json" }

import sharp from 'sharp'

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = 'not set';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

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
    args: [rand]
  })

  const data = await client.readContract({
    address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
    abi,
    functionName: "renderNounishBlockie",
    args: [accountAddress, seed]
  })

  const base64Data = data.split(",")[1];
  const svgContent = Buffer.from(base64Data, 'base64').toString();
  sharp(Buffer.from(svgContent)).png().toFile('../../../public/tmp-head.png')


  let imageUrl = `${NEXT_PUBLIC_URL}/tmp-head.png`
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
          label: `Render my head`,
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

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min); // Ensures the minimum is inclusive
  max = Math.floor(max); // Ensures the maximum is exclusive
  return Math.floor(Math.random() * (max - min) + min);
}