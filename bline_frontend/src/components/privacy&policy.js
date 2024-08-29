import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class privacyandpolicy extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name : '',
        privacyandpolicy : [],
       
                 }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleChange = this.handleChange.bind(this)  
    }

    componentDidMount() {
      this.getPandPList();
  }


    async getPandPList() {
       
      await axios.get(`${config.apiUrl}getPrivacypolicy`, {},)
          .then(result => {
              const data = result.data;
               console.log(result.data);
              if (result.data.success === true) {
                  this.setState({
                      privacyandpolicy: result.data.response[0],
                              })


              }

              else if (result.data.success === false) {

              }
          })

          .catch(err => {
          })
  }


    render() {
        return (    
 
            <>
            <Header/>
            <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/contact.jpg")`, backgroundSize: 'cover' }}>
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                   <h1>Privacy Policy</h1>
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </section>
                                          
        <section aria-label="section">
          <div className="container">
            <div className="term-condition">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-12">
                  <p dangerouslySetInnerHTML={{__html: this.state.privacyandpolicy.privacy_policy}} className="privency_text"></p>
                  <p dangerouslySetInnerHTML={{__html: this.state.privacyandpolicy.privacy_policy}} className="privency_text"></p>
                  <p dangerouslySetInnerHTML={{__html: this.state.privacyandpolicy.privacy_policy}} className="privency_text"></p>

                </div>  
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer/>

            </>
        )
    }
}