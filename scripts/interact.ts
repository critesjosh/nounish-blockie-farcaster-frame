import { createPublicClient, http, fallback } from 'viem'
import { mainnet } from 'viem/chains'
import * as artifact from '../artifacts/NounishBlockies.json' assert { type: "json" }
import * as seedArtifact from '../artifacts/INounsSeeder.json' assert { type: "json" }

async function main() {
    const alchemy = http(process.env.ALCHEMY_URL)
    const infura = http(process.env.INFURA_URL)


    const client = createPublicClient({
        chain: mainnet,
        transport: fallback([alchemy, infura]),
    })

    // @ts-ignore
    let seederAbi = seedArtifact.default.abi
    let rand = getRandomInt(1, 1000)

    const addressToRender = '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515'
    const seed = await client.readContract({
        address: "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
        abi: seederAbi,
        functionName: "generateSeed",
        args: [rand, "0x6229c811D04501523C6058bfAAc29c91bb586268"]
    })

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

    console.log(svgContent)
    // sharp(Buffer.from(svgContent)).png().toFile('./public/head.png')
}

main()

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min); // Ensures the minimum is inclusive
    max = Math.floor(max); // Ensures the maximum is exclusive
    return Math.floor(Math.random() * (max - min) + min);
}