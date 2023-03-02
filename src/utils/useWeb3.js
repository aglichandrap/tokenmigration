import Web3 from "web3";

export function Web3Instance() {
  const mainnet = 'https://cosmological-attentive-gadget.bsc.discover.quiknode.pro/71a7f0c442df3f18cf6281459dfc6eb845c62e12/';

  let instance = new Web3(mainnet);
  return instance;
};
