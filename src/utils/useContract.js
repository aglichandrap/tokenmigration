import abi from '../contract/abi.json';
import { Web3Instance } from './useWeb3';

export function ContractInstance() {
  const contractAddress = '0x2E46bf098Fb08244b4159e4c95D4edc407033a36'; //old token

  const web3 = Web3Instance();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}
