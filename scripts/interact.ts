import { createPublicClient, http, publicActions } from 'viem'
import { mainnet } from 'viem/chains'
import * as artifact from '../artifacts/NounishBlockies.json' assert { type: "json" }
import sharp from 'sharp'

async function main() {
    const client = createPublicClient({
        chain: mainnet,
        transport: http(process.env.ALCHEMY_URL)
    })

    const addressToRender = '0x76152c311630bBE2b472afE779f478B293CFAed3'
    const seed = [1, 12, 139, 61, 10]


    // @ts-ignore
    let abi = artifact.default.abi

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

