import React, { Component } from 'react';
import config from '../config/config'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export default class footer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      subscricbeSuccess: '0',
      subscricbeFAilure: '0',
      subscribeMsg: '',

    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.addSubscriberAPI = this.addSubscriberAPI.bind(this)
    this.onChange = this.onChange.bind(this)
    this.connectMetasmask = this.connectMetasmask.bind(this)
  }


  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async connectMetasmask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.loginAPI(accounts[0])
    }
    else {
      toast.error(`Please use dApp browser to connect wallet!`, {

      });
    }
  }

  async loginAPI(address) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}login`,
      data: { "address": address }
    }).then(response => {
      if (response.data.success === true) {
        if (!response.data.data.enableTwoFactor) {
          toast.success('Wallet Connected!!.');
          Cookies.set('loginSuccessBline', JSON.stringify(response.data.data));
          Cookies.set('token', JSON.stringify(response.data.Token));
          setTimeout(() => {
            window.location.href = `${config.baseUrl}accountSetting`
          }, 3000);
        }
        else if (response.data.data.enableTwoFactor === 1) {
          Cookies.set('loginSuccessBlineAuth', JSON.stringify(response.data.data));
          setTimeout(() => {
            window.location.href = `${config.baseUrl}googleAuth`
          }, 1000);
        }
      }
    })
  }


  async addSubscriberAPI(e) {
    e.preventDefault()

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}addSubscriber`,
      headers: { authorization: token },
      data: { 'email': this.state.email }
    })
      .then(result => {

        if (result.data.success === true) {
          toast.success('You Subscribe successfully!!', {
            position: toast.POSITION.TOP_CENTER
          });
          //window.location.href = `${config.baseUrl}`
        }
        else if (result.data.success === false) {
          this.setState({
            email: '',
          })

        }
      }).catch(err => {
        toast.error(err.response?.data?.msg, {
          position: toast.POSITION.TOP_CENTER
        })

      })
  }





  render() {
    return (

      <>
        <ToastContainer />
        <footer className="footer-light">
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-6 col-xs-1">
                <div className="widget">
                  <h5>Social Link</h5>
                  <ul>
                    <li> <a target="_blank" href="https://www.twitter.com/Bline_io"><i className="fa fa-twitter fa-lg" /></a></li>
                    <li> <a target="_blank" href="https://www.instagram.com/Bline_io"><i className="fa fa-instagram fa-lg" /></a></li>
                    <li><a target="_blank" href="https://t.me/Bline_io"><i className="fa fa-telegram fa-lg" /></a></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-1">
                <div className="widget">
                  <h5>Users</h5>
                  <ul>
                  <li><a href={`${config.baseUrl}`}>Home</a></li>
                  <li><a href={`${config.baseUrl}aboutus`}>About us</a></li>

                    <li><a href={`${config.baseUrl}marketplace`}>Marketplace</a></li>
                    <li>
                      {this.loginData.length === 0 ?
                        <Link onClick={this.connectMetasmask} href="javascript:void(0)">Create<span /></Link> :
                        <Link to={`${config.baseUrl}createnft`}>Create Nft<span /></Link>}
                    </li>
                    <li><a href={`${config.baseUrl}CollectionsList`}>Collections</a></li>
                    <li>
                      {this.loginData.length === 0 ?
                        <Link onClick={this.connectMetasmask} href="javascript:void(0)" >Account<span /></Link> :
                        <Link to={`${config.baseUrl}accountsetting`}>Account<span /></Link>}
                    </li>                    
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-1">
                <div className="widget">
                  <h5>Support</h5>
                  <ul>
                    <li><Link to={`${config.baseUrl}support`}>Help Center</Link></li>
                    <li><Link to={`${config.baseUrl}faq`}>FAQ's</Link></li>

                    <li><Link to={`${config.baseUrl}contactus`} >Contact Us</Link></li>
                    <li><Link to={`${config.baseUrl}termsandcondition`} >Terms and Condition</Link></li>
                    <li><Link to={`${config.baseUrl}privacyandpolicy`} >Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-1">
                <div className="widget">
                  <h5>Newsletter</h5>
                  <p>Signup for our newsletter to get the latest news in your inbox.</p>
                  <form className="row form-dark" id="form_subscribe" name="form_subscribe">
                    <div className="col text-center">
                      <input className="form-control" id="txt_subscribe" name="email" value={this.state.email} onChange={this.onChange} placeholder="enter your email" type="text" />
                      <a onClick={this.addSubscriberAPI} href="javascript:void(0)" id="btn-subscribe" >
                        <i className="arrow_right bg-color-secondary" />
                      </a>
                      <div className="clearfix" />
                    </div>
                  </form>
                  <div className="spacer-10" />
                  <small>Your email is safe with us. We don't spam.</small>
                </div>
              </div>
            </div>
          </div>
          <div className="subfooter">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="text-center">
                    <div className="de-flex-col">
                      <a href="">
                        <img alt="" className="f-logo" src="images/logo_white_transparent.png" /><span className="copy">© Copyright 2021 - Bline NFT Marketplace </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </>
    )
  }

}

