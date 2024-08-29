
import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
// import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

// A simple component that shows the pathname of the current location
export default class demo extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  render() {
    const { match, location, history } = this.props

    console.log('location',location)

    const headerColor = location && location.pathname === 'transparent' ? { background: 'blue'} : { background: 'none' }
    return (
  <div style={headerColor}>You are now at {location && location.pathname}</div>
  )
}
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
const AdaptiveHeader = withRouter(Header)

