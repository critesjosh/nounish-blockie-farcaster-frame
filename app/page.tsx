import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import 'dotenv/config';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Render your blockie',
    },
  ],
  image: `${NEXT_PUBLIC_URL}/head.png`,
  post_url: `${NEXT_PUBLIC_URL}/api/render`,
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
      <a href="https://github.com/critesjosh/nounish-blockies">Project on Github</a>
    </>
  );
}
