import abi from '../contract/abi.json';
import { Web3Instance } from './useWeb3';

export function ContractInstance() {
  const contractAddress = '0xFDe2d90409b8C934593E4aFb934Cd9F21A5F4B1E'; //old token

  const web3 = Web3Instance();
  let contract = new web3.eth.Contract(abi, contractAddress);
  return contract;
}
