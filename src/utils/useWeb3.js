import Web3 from "web3";

export function Web3Instance() {
  const mainnet = 'https://wiser-dark-replica.bsc.discover.quiknode.pro/704242ae47933cc6fd6a7ea718571aed82564340/';

  let instance = new Web3(mainnet);
  return instance;
};
