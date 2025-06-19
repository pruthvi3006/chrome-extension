import { CHAIN_NAMESPACES } from "@web3auth/base";

export const clientId = "BCU6qYdYUad5TLmmJwLE3k4TGml3cVUgQRAuGcBmBpIKzQpw3pnr7DcxaKU5e5wGH_WXMFS5tj5wJBKuvuc2WkU"; // Replace with your Web3Auth Client ID

export const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
};
