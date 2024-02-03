import { createPublicClient, http, fallback } from 'viem'
import { mainnet } from 'viem/chains'
import * as artifact from '../artifacts/NounishBlockies.json' assert { type: "json" }
import sharp from 'sharp'

async function main() {
    const alchemy = http(process.env.ALCHEMY_URL)
    const infura = http(process.env.INFURA_URL)


    const client = createPublicClient({
        chain: mainnet,
        transport: fallback([alchemy, infura]),
    })

    const addressToRender = '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
    const seed = [0, 27, 81, 123, 4]

    // @ts-ignore
    let abi = artifact.default.abi

    const seeds = await client.readContract({
        address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
        // @ts-ignore
        abi,
        functionName: "seeds",
        args: [2]
    })

    const data = await client.readContract({
        address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
        // @ts-ignore
        abi,
        functionName: "renderNounishBlockie",
        args: [addressToRender, seed]
    })

    // const data = await client.readContract({
    //     address: "0x76152c311630bBE2b472afE779f478B293CFAed3",
    //     // @ts-ignore
    //     abi,
    //     functionName: "getHeadSvg",
    //     args: [addressToRender]
    // })

    const base64Data = data.split(",")[1];
    const svgContent = Buffer.from(base64Data, 'base64').toString();
    sharp(Buffer.from(svgContent)).png().toFile('./public/head.png')
}

main()

