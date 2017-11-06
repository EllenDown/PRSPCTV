import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Login from './Login'
import AfterAuth from './AfterAuth'
import Dashboard from './Dashboard'
import MapView from './MapView'

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={ Login }></Route>
          <Route path='/afterauth' component={AfterAuth}></Route>
          <Route exact path='/dashboard' component={ Dashboard }></Route>
          <Route path='/mapview' component={ MapView }></Route>
        </Switch>
      </div>
    );
  }
}

export default App;
