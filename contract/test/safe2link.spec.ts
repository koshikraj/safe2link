import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import {  parseUnits, ZeroAddress, toUtf8Bytes } from 'ethers'
import { BigNumber, ethers } from 'ethersv5'
import hre from 'hardhat'

// import execAllowanceTransfer from './test-helpers/execAllowanceTransfer'
import execSafeTransaction from './test-helpers/execSafeTransaction'
import setup from './test-helpers/setup'

const OneEther = parseUnits('1', 'ether')

describe('Safe2Link Module', () => {
  it('Execute allowance with delegate', async () => {
    const { safe, safe2linkeModule, token, owner, alice, bob } =
      await loadFixture(setup)

    const safeAddress = await safe.getAddress()
    const tokenAddress = await token.getAddress()
    const safe2linkAddress = await safe2linkeModule.getAddress()

    expect(await safe.isModuleEnabled(safe2linkAddress)).to.equal(true)


    var privateKey = ethers.utils.keccak256(
			toUtf8Bytes('asdasdasdasd'))
    var wallet = new ethers.Wallet(privateKey)

    await execSafeTransaction(
      safe,
      await safe2linkeModule.createLink.populateTransaction(tokenAddress, 60,  wallet.address),
      owner
    )


    const results = await safe2linkeModule.getLink(0)


    const stringHash = ethers.utils.solidityKeccak256(['address'], ['0xEC829272ebc505FE07e8f582BDD65aDC5Ec90DeD']) // v5
	  const stringHashbinary = ethers.utils.arrayify(stringHash) // v5
    const addrHash = ethers.utils.hashMessage(stringHashbinary)

    const signature = await wallet.signMessage(stringHashbinary);
    

    await safe2linkeModule.claimLink(0, '0xEC829272ebc505FE07e8f582BDD65aDC5Ec90DeD', addrHash, signature)

    expect(940).to.equal(await token.balanceOf(safeAddress))
    expect(60).to.equal(await token.balanceOf('0xEC829272ebc505FE07e8f582BDD65aDC5Ec90DeD'))



  })

})
