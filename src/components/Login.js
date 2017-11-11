import React, {Component} from 'react'
import {
  Image,
  Container,
  Grid,
  Button,
  Segment,
  Dimmer
} from 'semantic-ui-react'
import mapboxgl from 'mapbox-gl'
import './styles/Login.css'
import shittyQs from 'shitty-qs';

import pLogoBlue from '../assets/pLogoBlue.png'
import LogoBlueWhite from '../assets/LogoBlueWhite.png'
import butterflyBlue from '../assets/butterflyBlue.png'

const clientId = "20906"
// const redirectUrl = "https://prspctv-1508732770742.firebaseapp.com/afterauth"
const redirectUrl = "https://localhost:3000/afterauth"


export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      code: null
    }
  }

  render() {
    const {active} = this.state

    const onConnect = e => {
      e.preventDefault();
      window.location = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}`;
    }

    return (
      <div className="bodyLogin">
        <div className='topLogin'>
        <div className='logoContainer'>
            <Image className='logo' src={LogoBlueWhite}/>
        </div>
        <div className='quoteText'>
          Instead of trying to make your life perfect, give yourself the freedom to make it an adventure, and go ever upward.
        </div>
        </div>
        <div className='bottomLogin'>
          <div className='loginContainer'>
            <Button inverted color='blue' size='massive' onClick={onConnect}>Login</Button>
          </div>
          <div className='aboutText'>
            To explore your adventures with an enhanced PRSPCTV login here with your STRAVA account
          </div>
        </div>
      </div>
    )
  }
}
