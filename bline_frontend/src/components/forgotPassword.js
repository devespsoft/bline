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

export default class login extends Component {

  constructor(props) {
    super(props);
    this.state = {
        email: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this)
}

onChange = e => {
    this.setState({
        [e.target.name]: e.target.value
    })
}

componentDidMount() {

}

handleSubmit = event => {
    event.preventDefault();
    const { email} = this.state;
    axios.post(`${config.apiUrl}forgot`, { email })
        .then(result => {
            if (result.data.success === true) {
                toast.success(result.data.msg, {
                    style: {
                        border: '1px solid #713200',
                        padding: '20px',
                        color: 'green',
                    },
                    iconTheme: {
                        primary: 'purple',
                        secondary: '#FFFAEE',
                    },
                });
                setTimeout(() => {
                  window.location.reload()
              }, 3000);                
            } else {
                toast.error(result.data.msg,
                    {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'red',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
            }
        }).catch(err => {
            toast.error(err.result?.msg,
                {
                    style: {
                        border: '1px solid #713200',
                        padding: '20px',
                        color: 'red',
                    },
                    iconTheme: {
                        primary: 'purple',
                        secondary: '#FFFAEE',
                    },
                });
        })
}

  render() {
    const { email} = this.state;
    return (

      <>
        <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <section className="full-height relative no-top no-bottom vertical-center" style={{ backgroundImage: `url("images/background/header-banner.jpg")`, backgroundSize: 'cover' }} data-stellar-background-ratio=".5">
            <div id="particles-js" />
            <div className="overlay-gradient t50">
              <div className="center-y relative">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-lg-5 mx-auto wow fadeIn" data-wow-delay=".5s">
                      <div className="box-rounded padding40" data-bgcolor="#ffffff">
                        <h3 className="mb10">Forgot Password</h3>
                        <p>Enter your email address below to reset your password.</p>
                        <form onSubmit={this.handleSubmit} className="form-border">
                          <Toaster
                            position="top-center"
                            reverseOrder={false}
                          />
                          <div className="field-set">
                            <input type="text" value={this.state.email}
                              onChange={this.onChange} name="email" id="email" className="form-control" placeholder="Enter email address" />
                          </div>
                          <div class="field-set">
                            <button type="submit" disabled={!this.state.email} class="btn btn-main btn-fullwidth color-2">Submit</button>
                          </div>
                          <div className="clearfix" />
                          <div className="spacer-single" />
                          <ul className="list s3">
                            <li><a  href={`${config.baseUrl}login`}>login</a></li>
                          </ul>
                        </form>
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