const INFURA_API_KEY = "05d830413c5a4ac8873c84319679c7b2";
const ETHERSCAN_API_KEY = "H8IGZCCS8XCJYSXIA3GUUKW6CDECYYMNPG";
const POLYGONSCAN_API_KEY = "GVZS4QAMWFBGS5PK2BR76FNFPJ7X2GR44I";

const accountAddress = "";

export enum Network {
  localhost = "localhost",
  mainnet = "mainnet",
  goerli = "goerli",
  polygontestnet = "polygontestnet",
  base = "base",
  polygon = "polygon",
  gnosis = "gnosis",
}

export const networks = {
  localhost: {
    name: 'Local Chain',
    chainId: 31337,
    type: 'Testnet',
    url: "http://localhost:8545",
    safeService: "",
    blockExplorer: "",
    api: "",
    easExplorer: "",
  },
  mainnet: {
    name: 'Ethereum',
    type: 'Mainnet',
    chainId: 1,
    url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    safeService: "https://safe-transaction-mainnet.safe.global",
    blockExplorer: "https://etherscan.io",
    api: `https://api.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "",
  },
  goerli: {
    name: 'Goerli',
    type: 'Testnet',
    chainId: 5,
    url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    safeService: "https://safe-transaction-goerli.safe.global",
    blockExplorer: "https://goerli.etherscan.io",
    api: `https://api-goerli.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "",
  },
  sepolia: {
    name: 'Sepolia',
    type: 'Testnet',
    chainId: 11155111,
    url: `https://eth-sepolia.g.alchemy.com/v2/eCr9bFDzgYgDrox-mnXPPh7_koP-agKo`,
    safeService: "https://safe-transaction-sepolia.safe.global",
    blockExplorer: "https://sepolia.etherscan.io",
    api: `https://api-sepolia.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "",
  },
  basegoerli: {
    name: 'Base',
    type: 'Testnet',
    chainId: 84531,
    url: `https://base-goerli.g.alchemy.com/v2/K1GZzIiF6-PthdjPtfzvTOMcej2zOWWA`,
    blockExplorer: "https://goerli.basescan.org",
    safeService: "https://safe-transaction-base-testnet.safe.global",
    api: `https://api-goerli.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "https://base-goerli.easscan.org/attestation/view/",
  },

  base: {
    name: 'Base',
    type: 'Testnet',
    chainId: 84531,
    url: `https://rpc.ankr.com/base_goerli`,
    blockExplorer: "https://basescan.org",
    safeService: "https://safe-transaction-base-testnet.safe.global",
    api: `https://api-goerli.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "",
  },
  optimism: {
    name: 'Optimism',
    type: 'Mainnet',
    chainId: 10,
    url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
    blockExplorer: "https://optimistic.etherscan.io",
    safeService: "https://safe-transaction-optimism.safe.global",
    api: `https://api-optimistic.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "https://optimism.easscan.org/attestation/view/",
  },
  gnosis: {
    name: 'Gnosis',
    type: 'Mainnet',
    chainId: 100,
    url: `https://rpc.ankr.com/gnosis`,
    safeService: "https://safe-transaction-gnosis-chain.safe.global",
    blockExplorer: "https://gnosisscan.io",
    api: `https://api-goerli.etherscan.io/api?apikey=${ETHERSCAN_API_KEY}`,
    easExplorer: "",
  },
  polygontestnet: {
    name: 'Polygon',
    type: 'Testnet',
    chainId: 80001,
    url: "https://matic-mumbai.chainstacklabs.com",
    safeService: "",
    blockExplorer: "https://mumbai.polygonscan.com",
    api: `https://api-testnet.polygonscan.com/api?module=account&action=balance&address=${accountAddress}&apikey=${POLYGONSCAN_API_KEY}`,
    easExplorer: "",
  },
  polygon: {
    name: 'Polygon',
    type: 'Mainnet',
    chainId: 137,
    url: "https://rpc.ankr.com/polygon",
    safeService: "https://safe-transaction-polygon.safe.global",
    blockExplorer: "https://polygonscan.com",
    api: "",
    easExplorer: "",
  },


};

export class NetworkUtil {
  static getNetworkById(chainId: number) {
    const network = Object.values(networks).find(
      (network) => chainId === network.chainId
    );
    return network;
  }

  static getNetworkByName(chain: keyof typeof Network) {
    return networks[chain];
  }
}
