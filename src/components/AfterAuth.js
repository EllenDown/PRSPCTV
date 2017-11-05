import React, {Component} from 'react'
import {Button, Container, Header} from 'semantic-ui-react'
import shittyQs from 'shitty-qs';

const clientId = "20906"
const redirectUrl = "https://localhost:3000/"

export default class AfterAuth extends Component {
  constructor() {
    super()
    this.state = {
      code: null
    }
  }

  componentDidMount() {
    window.addEventListener('url', (event) => this.handleLinkingUrl(), false)
  }

  componentWillUnmount() {
    window.removeEventListener('url', (event) => this.handleLinkingUrl(event));
  }

  handleLinkingUrl() {

    let url = new URL(window.location)
    let params = new URLSearchParams(url)
    params.get('code')
    console.log(params);

    // if (window.location.query > 3) {
    //   let hash = window.location.hash
    //   console.log(hash);
    //   var query = shittyQs(hash)
    //   console.log(query);
    //   if (query.code) {
        // this.setState({code: query.code})
        // localStorage.setItem('code', query.code)
        window.location.href = '/dashboard'
      }

      render() {
        return (
          <div>Hi</div>
        )
      }
    }
