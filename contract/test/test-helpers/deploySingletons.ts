import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers'
import {
  getSingletonFactoryInfo,
  SingletonFactoryInfo,
} from '@safe-global/safe-singleton-factory'
import { getCreate2Address, keccak256, parseUnits, ZeroHash } from 'ethers'

import {
  ArtifactSafe2LinkModule,
  ArtifactGnosisSafe,
  ArtifactGnosisSafeProxyFactory,
} from './artifacts'

export default async function deploySingletons(deployer: SignerWithAddress) {
  const factoryAddress = await deploySingletonFactory(deployer)

  const safeMastercopyAddress = await deploySingleton(
    factoryAddress,
    ArtifactGnosisSafe.bytecode,
    deployer
  )

  const safeProxyFactoryAddress = await deploySingleton(
    factoryAddress,
    ArtifactGnosisSafeProxyFactory.bytecode,
    deployer
  )

  const safe2linkModuleAddress = await deploySingleton(
    factoryAddress,
    ArtifactSafe2LinkModule.bytecode,
    deployer
  )

  return {
    safeMastercopyAddress,
    safeProxyFactoryAddress,
    safe2linkModuleAddress,
  }
}

async function deploySingletonFactory(signer: SignerWithAddress) {
  const { chainId } = await signer.provider.getNetwork()
  const { address, signerAddress, transaction } = getSingletonFactoryInfo(
    Number(chainId)
  ) as SingletonFactoryInfo

  // fund the presined transaction signer
  await signer.sendTransaction({
    to: signerAddress,
    value: parseUnits('1', 18),
  })

  // shoot the presigned transaction
  await signer.provider.broadcastTransaction(transaction)

  return address
}

async function deploySingleton(
  factory: string,
  bytecode: string,
  signer: SignerWithAddress
) {
  const salt = ZeroHash

  await signer.sendTransaction({
    to: factory,
    data: `${salt}${bytecode.slice(2)}`,
    value: 0,
  })

  return getCreate2Address(factory, salt, keccak256(bytecode))
}
