import React, {Component} from 'react'
import {Button, Container, Header} from 'semantic-ui-react'
import shittyQs from 'shitty-qs';

const clientId = "20906"

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
      console.log(query.code);
      if (query.code) {
        this.setState({code: query.code})
        localStorage.setItem('code', query.code)
        this.props.history.push('/mydashboard')
      }
    }

      render() {
        return (
          <div>Hi</div>
        )
      }
    }
