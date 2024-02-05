// @ts-check

export default (phase, { defaultConfig }) => {

    // For building on vercel: https://github.com/Automattic/node-canvas/issues/1779
    if (
        process.env.LD_LIBRARY_PATH == null ||
        !process.env.LD_LIBRARY_PATH.includes(
            `${process.env.PWD}/node_modules/canvas/build/Release:`,
        )
    ) {
        process.env.LD_LIBRARY_PATH = `${process.env.PWD
            }/node_modules/canvas/build/Release:${process.env.LD_LIBRARY_PATH || ''}`;
    }
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        async redirects() {
            return [
                {
                    source: '/github',
                    destination: "https://github.com/critesjosh/nounish-blockies",
                    permanent: false
                },
                {
                    source: '/mint',
                    destination: "https://abi.ninja/0x76152c311630bBE2b472afE779f478B293CFAed3/mainnet?functions=mint",
                    permanent: false
                }
            ]
        }
    }
    return nextConfig
}