import React, {Component} from 'react'
import {Button, Container, Header} from 'semantic-ui-react'
import shittyQs from 'shitty-qs';

const clientId = "20906"
const redirectUrl = "https://localhost:3000/"

export default class AfterAuth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: null
    }
  }

  componentDidMount() {
     this.handleLinkingUrl()
  }

  handleLinkingUrl() {
      var query = shittyQs(window.location.search)
      if (query.code) {
        this.setState({code: query.code})
        localStorage.setItem('code', query.code)
        this.props.history.push('/dashboard')
      }
    }

      render() {
        return (
          <div>Hi</div>
        )
      }
    }
