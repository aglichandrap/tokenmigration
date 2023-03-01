import abi from '../contract/abi.json';
import { Web3Instance } from './useWeb3';

export function ContractInstance() {
  const contractAddress = '0x6E53E24f0f7B273d27D92a909A30762d5734B649'; //old token

  const web3 = Web3Instance();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}
