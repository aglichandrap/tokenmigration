import styled from 'styled-components';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom'
import selendra from '../assets/sel-logo.png';
import { ReactComponent as Facebook } from '../assets/facebook.svg';
import { ReactComponent as Twitter } from '../assets/twitter.svg';
import { ReactComponent as Medium } from '../assets/medium.svg';
import { ReactComponent as Telegram } from '../assets/telegram.svg';

export default function FooterComponent() {
  return (
    <div>
      <SeparateLine />
      <Footer>
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Row justify='center'>
              <FooterLogo src={selendra} alt='mars' />
            </Row>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>

          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Row justify='space-around' align='middle' style={{height: '100%'}}>
              <a href='https://facebook.com/marsupilamiitoken'>
                <Facebook />
              </a>
              <a href='https://twitter.com/marsupilamiitkn'>
                <Twitter />
              </a>

              <a href='https://medium.com/@marsupilamiitoken'>
                <Medium />
              </a>
              <a href='https://t.me/MarsupilamiiGlobal'>
                <Telegram />
              </a>
            </Row>
          </Col>
        </Row>
      </Footer>
    </div>
  )
}

const Footer = styled.div`
  max-width: 1216px;
  height: 80px;
  margin: 0 auto;
  padding: 24px 50px;
  color: #FFF;
  font-size: 14px;
  background: #131a35;
`
const FooterLogo = styled.img`
  height: 44px;
  width: auto;
`
const SeparateLine = styled.div`
  height: 1px; 
  background: rgba(0, 0, 0, 0) linear-gradient(90deg, rgba(90, 196, 190, 0) 0%, rgb(55, 114, 255) 50%, rgba(194, 0, 251, 0) 100%) repeat scroll 0% 0%;
`
const NavLinkStyled = styled(NavLink)`
  color: #fff;
  font-weight: 600;
`