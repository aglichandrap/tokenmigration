import Web3 from "web3";

export function Web3Instance() {
  const testnet = 'https://rpc.ankr.com/bsc_testnet_chapel';

  let instance = new Web3(testnet);
  return instance;
};
