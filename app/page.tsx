import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import 'dotenv/config';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Get your blockie',
    },
  ],
  image: `${NEXT_PUBLIC_URL}/head.png`,
  // input: {
  //   text: 'Tell me a boat story',
  // },
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'Nounish blockie renderer',
  description: 'explore blockies in frames',
  openGraph: {
    title: 'Nounish blockie renderer',
    description: 'explore blockies in frames',
    images: [{
      url: `${NEXT_PUBLIC_URL}/head.png`,
    }],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Nounish blockie renderer</h1>
    </>
  );
}
