import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Input, Form, message, Modal, Row } from 'antd';
import styled from 'styled-components';
import swapContract from '../contract/swapContract.json';
import { ContractInstance } from '../utils/useContract';
import {Web3Instance} from '../utils/useWeb3'

export default function HomePage() {
  const modalCustom = {
    background: "#131a35",
    borderRadius: "4px",
    padding: '20px'
  }
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [modal, setModal] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [balance, setBalance] = useState('');
  const [allowance, setAllowance] = useState('');
  const SwapContractAddress = "0xD5C7B84261aac554433B6152B0C6F4430D299a3a"; //swapcontract
  const SwapContractABI = swapContract;

  let signer;
  if(window.ethereum) {
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    window.ethereum.on('accountsChanged', (accounts) => window.location.reload());
  }

  async function Validate() {
    if(window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        getBepTokenBalance(accounts[0]);
      });
      await window.ethereum.request({ method: 'eth_chainId' }).then(chainId => {
     //   if(chainId !== '0x38') setModal(true); //change chain id
     if(chainId !== '0x13881') setModal(true);
      })
    } else {
      message.error("Metamask not detected!!")
    }
  }

  useEffect(() => {
    Validate();
  }, []);

  const getBepTokenBalance = async(fromAddress) => {
    let contract = ContractInstance();
    let decimal = 9;
    let balance = await contract.methods.balanceOf(fromAddress).call();
    let allowance = await contract.methods.allowance(fromAddress, SwapContractAddress).call();
    setAllowance(allowance / Math.pow(10, decimal));
    setBalance(balance / Math.pow(10, decimal));
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider.listAccounts()
    .then(function(accounts) {
      signer = provider.getSigner(accounts[0]);
      new ethers.Contract(
        SwapContractAddress,
        SwapContractABI,
        signer
      );
    });
  } catch (error) {
    console.log(error);
  }

  async function approve() {
    try {
      let abi = [
        "function approve(address _spender, uint256 _value) public returns (bool success)",
      ];
      //Old ERC20 Contract: 0x288d3A87a87C284Ed685E0490E5C4cC0883a060a 
      let TokenContract = new ethers.Contract(
        "0xFDe2d90409b8C934593E4aFb934Cd9F21A5F4B1E", //old token contract
        abi,
        signer
      );
      // Approve Spending from Swap contract
      const result = await TokenContract.approve(
        SwapContractAddress,
        ethers.utils.parseUnits(Math.pow(10, 18).toString(), 18)
      )
      console.log("Approving Old Mars contract to spend");

      setLoading(true);
      async function PendingApprove() {
        const web3 = Web3Instance();
        await web3.eth.getTransactionReceipt(result.hash, async function (error, result) { 
          if(result === null || error) {
            setTimeout(() => {
              PendingApprove();
            }, 2000);
          } else if(result !== null || !error) { 
            migrate();
          }
        })
        
      }

      setTimeout(() => {
        PendingApprove();
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function migrate() {
    try {
      let SwapContract = new ethers.Contract(
        SwapContractAddress,
        SwapContractABI,
        signer
      );
      console.log("Start Swapping Amount: ", amount); 
      setLoading(true);
      const data = await SwapContract.migrate(ethers.utils.parseUnits(amount, 9));

      async function PendingSwap() {
        const web3 = Web3Instance();
        await web3.eth.getTransactionReceipt(data.hash, async function (error, result) { 
          if(result === null || error) {
            setTimeout(() => {
              PendingSwap();
            }, 2000);
          } else if(result !== null || !error) { 
            setLoading(false);
            setModalConfirm(false);
            Validate();
          }
        })
      }

      setTimeout(() => {
        PendingSwap();
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  function handleSwap() {
    if(!amount) return message.error("Input the amount!!");
    if(!balance) return message.error("Please check your balance!!");
    if(!allowance) {
      message.error("Please approve to be able to swap!!");
      return approve();
    }
    setModalConfirm(true);
  }

  return (
    <Home>
      <Container>
        <Modal
          open={modal}
          footer=""
          title=""
          bodyStyle={modalCustom}
        >
          <Title>Alert!</Title>
          <Subtitle>Make sure you are connected to Binance Smart Chain</Subtitle>
          <ButtonSwap type='ghost' onClick={() => setModal(false)}>Confirm</ButtonSwap>
        </Modal>
        <Modal
          open={modalConfirm}
          footer=""
          title=""
          bodyStyle={modalCustom}
          onCancel={()=>setModalConfirm(false)}
        >
          <div style={{textAlign: 'center'}}>
            <Title>Refund</Title>
            <CardStyled>
              <CardBody>
                <Subtitle>MARS ➡️ USDT</Subtitle>
                <Text>{amount} of MARS</Text>
              </CardBody>
            </CardStyled>
            <ButtonSwap type='ghost' onClick={migrate} loading={loading}>Confirm</ButtonSwap>
          </div>
        </Modal>
        <Title>Refund your Mars to USDT</Title>
        <CardStyled>
          <CardBody>
            <Form layout="vertical" color="white">
              <FormItem label='Amount'>
                <InputStyled placeholder="0.00" addonAfter={`Max: ${balance}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
              </FormItem>
            </Form>
            <ButtonSwap type='ghost' onClick={handleSwap} loading={loading}>Refund</ButtonSwap>
          </CardBody>
        </CardStyled>
        <br/>
        <Subtitle>What is Marsupilamii ?</Subtitle>
        <p>Marsupilamii is a cryptocurrency based in Indonesia with diverse users and several subprojects. </p>
          <p>Marsupilamii was developed to make cryptocurrency more accessible to everyone. 
            <p>With its subprojects, dating & live streaming apps, Marsupilamii tries to gain users among men and women through human needs. </p>
            <p>Human needs to get social, have a partner, and gain a friend. Data from Business of Apps shows over 323 million people worldwide are using dating apps. Tinder and Bumble were the most download apps in 2021. About 20 million users are paying for premium features. </p>
          Dating apps are one of the must-have apps for the young generation to fulfill their needs. It is the main reason Marsupilamii jumped to this trend. It will help Marsupilamii to gain a wider audience and penetrates better in the crypto market. It helps us to reach control over our money and eliminate centralized finance models.</p>
      </Container>
    </Home>
  );
}

const Home = styled.div`
  width: 100vw;
  min-height: calc(100vh - 146px);  
`
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
`
const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-weight: 800;
  padding-top: 20px;
  padding-bottom: 40px;
`
const CardStyled = styled.div`
  background: linear-gradient(245.22deg,#c200fb 7.97%,#3772ff 49.17%,#3773fe 0,#5ac4be 92.1%);
  border-radius: 4px;
  padding: 1px;
  margin: 10px 0;
`
const CardBody = styled.div`
  background-color: #131a35;
  opacity: .9;
  padding: 24px;
  border-radius: 4px ;
`
const FormItem = styled(Form.Item)`
  background: #000829;
  border-radius: 6px;
  label {
    font-weight: 700;
    color: #85858D;  
    padding: 10px 15px;
  }
`
const InputStyled = styled(Input)`
  font-size: 20px;
  font-weight: 800;
  color: #FFF;
  background: #000829;
  border-radius: 8px;
  border: none;
  padding: .75rem .75rem .75rem 1rem;
  &:focus {
    box-shadow: none!important;
  }
`
const ButtonSwap = styled(Button)`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  color: #fff;
  border: 1px solid #82d1ca;
  margin: 10px 0;
  &:hover {
    border: 1px solid #82d1ca;
    color: #82d1ca;
  }
`
const Subtitle = styled.h2`
  color: #FFF;
  font-weight: 600;
`
const Text = styled.p`
  color: #FFF;
  font-weight:600;
  font-size: 18px;
  margin: 0;
`