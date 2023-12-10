import { Contract, ZeroAddress, parseEther } from "ethers";
import { ethers } from 'ethersv5';
import { BaseTransaction } from '@safe-global/safe-apps-sdk';
import { getSafeInfo, isConnectedToSafe, submitTxs } from "./safeapp";
import { isModuleEnabled, buildEnableModule, isGuardEnabled, buildEnableGuard } from "./safe";
import { getJsonRpcProvider, getProvider } from "./web3";
import Safe2LinkModule from "./Safe2LinkModule.json"
import { createSafeAccount, sendTransaction } from "./permissionless";


const moduleAddress = "0xaB83F7041C82D5a915E608D887073B6C52a28459"

const getLinkCount = async (): Promise<number> => {


    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()
    const bProvider = await getJsonRpcProvider(chainId)


    const safe2link = new Contract(
        moduleAddress,
        Safe2LinkModule.abi,
        bProvider
    )

    return await safe2link.getLinkCount()

}


export const getLinkDetails = async (chainId: string, index: number): Promise<{}> => {


    const bProvider = await getJsonRpcProvider(chainId)


    const safe2link = new Contract(
        moduleAddress,
        Safe2LinkModule.abi,
        bProvider
    )

    return await safe2link.getLink(index)

}


function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}


/**
 * Generates a deterministic key pair from an arbitrary length string
 *
 * @param {string} string - The string to generate a key pair from
 * @returns {Object} - An object containing the address and privateKey
 */
export function generateKeysFromString(string: string) {
    const privateKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(string)) // v5
    const wallet = new ethers.Wallet(privateKey)
    return {
        address: wallet.address,
        privateKey: privateKey,
    }
}

/**
 * Hashes an address to a 32 byte hex string
 */
export function solidityHashAddress(address: string) {
    return ethers.utils.solidityKeccak256(['address'], [address]) // v5
}

/**
 * Adds the EIP191 prefix to a message and hashes it same as solidity
 */
export function solidityHashBytesEIP191(bytes: any) {
    return ethers.utils.hashMessage(bytes) // v5
}



/**
 * Hashes a plain address, adds an Ethereum message prefix, hashes it again and then signs it
 */
export async function signAddress(string: string, privateKey: string) {
    const stringHash = ethers.utils.solidityKeccak256(['address'], [string]) // v5
    const stringHashbinary = ethers.utils.arrayify(stringHash) // v5
    const signer = new ethers.Wallet(privateKey)
    const signature = await signer.signMessage(stringHashbinary) // this calls ethers.hashMessage and prefixes the hash
    return signature
}





const buildCreateLink = async (publicAddress: string, token: string, amount: string): Promise<BaseTransaction> => {


    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()
    const bProvider = await getJsonRpcProvider(chainId)

    const safeInfo = await getSafeInfo()


    const safe2link = new Contract(
        moduleAddress,
        Safe2LinkModule.abi,
        bProvider
    )

    return {
        to: moduleAddress,
        value: "0",
        data: (await safe2link.createLink.populateTransaction(token, parseEther(amount), publicAddress)).data
    }
}


export const claimLink = async(chainId: string, index: number, seed: string, signer: any) => {
    

    const bProvider = await getJsonRpcProvider(chainId)

    const { address, privateKey } = generateKeysFromString(seed)

    console.log(address)

    // const safeAccount =  await createSafeAccount(chainId, signer)

    const safeAccount = {address: '0x2A6bFFF57F87f8D865CfDA6F304f0F58231Af921'}

    console.log(safeAccount.address)


    const addressHash = solidityHashAddress(safeAccount.address)
	const addressHashBinary = ethers.utils.arrayify(addressHash) // v5
	const addressHashEIP191 = solidityHashBytesEIP191(addressHashBinary)


	const signature = signAddress(safeAccount.address, privateKey) // sign with link keys

    const safe2link = new Contract(
        moduleAddress,
        Safe2LinkModule.abi,
        bProvider
    )

    const data = await safe2link.claimLink.populateTransaction(index, safeAccount.address, addressHashEIP191, signature)

    console.log(data)

    await sendTransaction(chainId, moduleAddress, data.data, signer)

    return safeAccount;
} 



export const createLink = async (token: string, amount: string) => {

    if (!await isConnectedToSafe()) throw Error("Not connected to a Safe")

    const info = await getSafeInfo()
    const txs: BaseTransaction[] = []

    const randomSeed = generateRandomString(18)

    const { address, privateKey } = generateKeysFromString(randomSeed)


    if (!await isModuleEnabled(info.safeAddress, moduleAddress)) {
        txs.push(await buildEnableModule(info.safeAddress, moduleAddress))
    }

    txs.push(await buildCreateLink(address, token, amount))

    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()

    const index = await getLinkCount()


    if (txs.length == 0) return
    await submitTxs(txs)

    return { i: Number(index), p: randomSeed, c: chainId }
}




