import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const headers = {
  'Content-Type': 'application/json'
};

export default class googleAuth extends Component {

  constructor(props) {
    super(props)
    this.state = {
      SecretKey: '',
      enableTwoFactor: "",
      user_id: ''
    };
    this.loginData = (!Cookies.get('loginSuccessBlineAuth')) ? [] : JSON.parse(Cookies.get('loginSuccessBlineAuth'));
    this.twoAuthenticationVerifyAPI = this.twoAuthenticationVerifyAPI.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {

  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async twoAuthenticationVerifyAPI(e) {
    e.preventDefault()
    await axios({
      method: 'post',
      url: `${config.apiUrl}twoAuthenticationVerify `,
      headers: { "Authorization": this.loginData?.message },
      data: { "user_id": this.loginData?.id, 'SecretKey': this.state.SecretKey, 'enableTwoFactor': 0 }
    }).then(response => {
      if (response.data.success === true) {
        toast.success('Login succesfully!', {

        });
        Cookies.set('loginSuccessBline', JSON.stringify(this.loginData));
        setTimeout(() => {
          window.location.href = `${config.baseUrl}accountsetting`
        }, 2500);
      }
    }).catch(err => {
      toast.error('Token mismatch! Please try again.', {

      });
    })
  }
  render() {
    return (

      <>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
        <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <section className="full-height relative no-top no-bottom vertical-center" data-bgimage="url(images/background/header-banner.jpg) top" data-stellar-background-ratio=".5">
            <div id="particles-js" />
            <div className="overlay-gradient t50">
              <div className="center-y relative">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-6 offset-lg-3 wow fadeIn" data-wow-delay=".5s">
                      <div className="box-rounded padding40" data-bgcolor="#ffffff">
                        <h3 className="mb10">Google Authentication</h3>
                        <p>Please Type code to continue</p>

                        <div className="field-set">
                          <input type="number" value={this.state.SecretKey}
                            onChange={this.onChange} name="SecretKey" className="form-control" placeholder="Secret Key" />
                        </div>
                        <br />
                        <div class="field-set">
                          <button type="submit" disabled={!this.state.SecretKey} onClick={this.twoAuthenticationVerifyAPI} disabled={!this.state.SecretKey} class="btn btn-main btn-fullwidth color-2">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  }
}