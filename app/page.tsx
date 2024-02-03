import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import 'dotenv/config';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Get random Wikipedia article',
    },
  ],
  image: `${NEXT_PUBLIC_URL}/head.png`,
  // input: {
  //   text: 'Tell me a boat story',
  // },
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'joshcrites.com',
  description: 'testing out some frames',
  openGraph: {
    title: 'joshcrites.com',
    description: 'test',
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>joshcrites.com</h1>
    </>
  );
}
