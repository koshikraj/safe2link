import axios from "axios";
import {
  createActivityPoller,
  TSignedRequest,
  TurnkeyApiTypes,
  TurnkeyClient,
  getWebAuthnAttestation
} from "@turnkey/http";
import { ApiKeyStamper } from "@turnkey/api-key-stamper";
import { THttpError, TWalletDetails } from "./types";
import { base64UrlEncode, generateRandomBuffer, passkeyHttpClient, publicClient, refineNonNull } from "./utils";
import { formatEther } from "viem";


type TAttestation = TurnkeyApiTypes["v1Attestation"];

export type CreateSubOrgWithPrivateKeyRequest = {
  subOrgName: string;
  challenge: string;
  privateKeyName?: string;
  attestation: TAttestation;
};

type ErrorMessage = {
  message: string;
};

// Default path for the first Ethereum address in a new HD wallet.
// See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki, paths are in the form:
//     m / purpose' / coin_type' / account' / change / address_index
// - Purpose is a constant set to 44' following the BIP43 recommendation.
// - Coin type is set to 60 (ETH) -- see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
// - Account, Change, and Address Index are set to 0
const ETHEREUM_WALLET_DEFAULT_PATH = "m/44'/60'/0'/0/0";


export  async function loginUser(
  
) {

  try {
    const signedRequest = await passkeyHttpClient.stampGetWhoami({
      organizationId: import.meta.env.VITE_ORGANIZATION_ID!,
  });

    const whoamiResponse = await axios.post(
      signedRequest.url,
      signedRequest.body,
      {
        headers: {
          [signedRequest.stamp.stampHeaderName]:
            signedRequest.stamp.stampHeaderValue,
        },
      }
    );


    const subOrgId = whoamiResponse.data.organizationId;

    const stamper = new ApiKeyStamper({
      apiPublicKey: import.meta.env.VITE_API_PUBLIC_KEY!,
      apiPrivateKey: import.meta.env.VITE_API_PRIVATE_KEY!,
    });
    const client = new TurnkeyClient(
      { baseUrl: import.meta.env.VITE_TURNKEY_API_BASE_URL! },
      stamper
    );

    const walletsResponse = await client.getWallets({
      organizationId: subOrgId,
    });
    const accountsResponse = await client.getWalletAccounts({
      organizationId: subOrgId,
      walletId: walletsResponse.wallets[0].walletId,
    });
    const walletId = accountsResponse.accounts[0].walletId;
    const walletAddress = accountsResponse.accounts[0].address;

    return ({
      id: walletId,
      address: walletAddress,
      subOrgId: subOrgId,
      balance: formatEther(0n)
    });
  } catch (e) {
    console.error(e);

  }
}


export async function createUser(
  walletName: string
) {

  const subOrgName = walletName;

  try {

    const challenge = generateRandomBuffer();
   
    const authenticatorUserId = generateRandomBuffer();
  
    const attestation = await getWebAuthnAttestation({
        publicKey: {
            rp: {
                id: process.env.NEXT_PUBLIC_RPID!,
                name: "Turnkey Viem Passkey Demo",
            },
            challenge,
            pubKeyCredParams: [
                {
                    type: "public-key",
                    alg: -7,
                },
                {
                    type: "public-key",
                    alg: -257,
                },
            ],
            user: {
                id: authenticatorUserId,
                name: subOrgName.split(" ").join("-"),
                displayName: subOrgName,
            },
            authenticatorSelection: {
                requireResidentKey: true,
            }
        },
    });

    
    const turnkeyClient = new TurnkeyClient(
      { baseUrl: import.meta.env.VITE_TURNKEY_API_BASE_URL! },
      new ApiKeyStamper({
        apiPublicKey: import.meta.env.VITE_API_PUBLIC_KEY!,
        apiPrivateKey: import.meta.env.VITE_API_PRIVATE_KEY!,
      })
    );

    const activityPoller = createActivityPoller({
      client: turnkeyClient,
      requestFn: turnkeyClient.createSubOrganization,
    });

    const walletName = `Default ETH Wallet`;

    const completedActivity = await activityPoller({
      type: "ACTIVITY_TYPE_CREATE_SUB_ORGANIZATION_V4",
      timestampMs: String(Date.now()),
      organizationId: import.meta.env.VITE_ORGANIZATION_ID!,
      parameters: {
        subOrganizationName: subOrgName,
        rootQuorumThreshold: 1,
        rootUsers: [
          {
            userName: "New user",
            apiKeys: [],
            authenticators: [
              {
                authenticatorName: "Passkey",
                challenge: base64UrlEncode(challenge),
                attestation: attestation,
              },
            ],
          },
        ],
        wallet: {
          walletName: walletName,
          accounts: [
            {
              curve: "CURVE_SECP256K1",
              pathFormat: "PATH_FORMAT_BIP32",
              path: ETHEREUM_WALLET_DEFAULT_PATH,
              addressFormat: "ADDRESS_FORMAT_ETHEREUM",
            }
          ]
        },
      },
    });

    const subOrgId = refineNonNull(
      completedActivity.result.createSubOrganizationResultV4?.subOrganizationId
    );
    const wallet = refineNonNull(
      completedActivity.result.createSubOrganizationResultV4?.wallet
    );
    const walletId = wallet.walletId;
    const walletAddress = wallet.addresses[0]

    const client = publicClient(5);

    return({
      id: walletId,
      address: walletAddress,
      subOrgId: subOrgId,
      balance: formatEther(0n)
    });
  } catch (e) {
    console.error(e);


  }
}

