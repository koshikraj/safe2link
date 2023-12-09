import { Contract, ZeroAddress, parseEther } from "ethers";
import { ethers } from 'ethersv5';
import { BaseTransaction } from '@safe-global/safe-apps-sdk';
import { getSafeInfo, isConnectedToSafe, submitTxs } from "./safeapp";
import { isModuleEnabled, buildEnableModule, isGuardEnabled, buildEnableGuard } from "./safe";
import { getJsonRpcProvider, getProvider } from "./web3";
import Safe2LinkModule from "./Safe2LinkModule.json"
import { sendTransaction } from "./permissionless";




const getLinkCount = async (module: string): Promise<number> => {


    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()
    const bProvider = await getJsonRpcProvider(chainId)


    const safe2link = new Contract(
        module,
        Safe2LinkModule.abi,
        bProvider
    )

    return await safe2link.getDepositCount()

}


export const getLinkDetails = async (module: string, chainId: string, index: number): Promise<{}> => {


    const bProvider = await getJsonRpcProvider(chainId)


    const safe2link = new Contract(
        module,
        Safe2LinkModule.abi,
        bProvider
    )

    return await safe2link.getDeposit(index)

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





const buildCreateLink = async (module: string, publicAddress: string, token: string, amount: string): Promise<BaseTransaction> => {


    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()
    const bProvider = await getJsonRpcProvider(chainId)

    const safeInfo = await getSafeInfo()


    const safe2link = new Contract(
        module,
        Safe2LinkModule.abi,
        bProvider
    )

    return {
        to: module,
        value: "0",
        data: (await safe2link.createLink.populateTransaction(token, parseEther(amount), publicAddress)).data
    }
}


export const claimLink = async(chainId: string, module: string, index: number, seed: string, recipient: string) => {
    

    const bProvider = await getJsonRpcProvider(chainId)

    const { address, privateKey } = generateKeysFromString(seed)

    const addressHash = solidityHashAddress(recipient)
	const addressHashBinary = ethers.utils.arrayify(addressHash) // v5
	const addressHashEIP191 = solidityHashBytesEIP191(addressHashBinary)


	const signature = signAddress(recipient, privateKey) // sign with link keys

    const safe2link = new Contract(
        module,
        Safe2LinkModule.abi,
        bProvider
    )

    const data = await safe2link.claimLink.populateTransaction(index, recipient, addressHashEIP191, signature)

    console.log(data)

    await sendTransaction(chainId, module, data.data)
} 



export const createLink = async (module: string, token: string, amount: string) => {

    if (!await isConnectedToSafe()) throw Error("Not connected to a Safe")

    const info = await getSafeInfo()
    const txs: BaseTransaction[] = []

    const randomSeed = generateRandomString(18)

    const { address, privateKey } = generateKeysFromString(randomSeed)


    if (!await isModuleEnabled(info.safeAddress, module)) {
        txs.push(await buildEnableModule(info.safeAddress, module))
    }

    txs.push(await buildCreateLink(module, address, token, amount))

    const provider = await getProvider()
    // Updating the provider RPC if it's from the Safe App.
    const chainId = (await provider.getNetwork()).chainId.toString()

    const index = await getLinkCount(module)


    if (txs.length == 0) return
    await submitTxs(txs)

    return { i: Number(index), p: randomSeed, c: chainId }
}




