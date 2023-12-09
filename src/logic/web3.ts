import { AbstractProvider, ethers } from "ethers"
import { getSafeAppsProvider, isConnectedToSafe } from "./safeapp"
import { PROTOCOL_CHAIN_ID } from "./constants"
import { NetworkUtil } from "./networks";

export const getProvider = async(): Promise<AbstractProvider> => {
    if (await isConnectedToSafe()) {
        console.log("Use SafeAppsProvider")
        return await getSafeAppsProvider()
    }
    console.log("Use JsonRpcProvider")
    return new ethers.JsonRpcProvider(NetworkUtil.getNetworkById(PROTOCOL_CHAIN_ID)?.url)
}

export const getJsonRpcProvider = async(chainId: string): Promise<AbstractProvider> => {

    console.log("Use JsonRpcProvider")

    console.log(NetworkUtil.getNetworkById(parseInt(chainId))?.url)
    
    return new ethers.JsonRpcProvider(NetworkUtil.getNetworkById(parseInt(chainId))?.url)
}