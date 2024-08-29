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
            password: '',
            password2: ''
        };
        const { match: { params } } = this.props;
        this.token = params.token
    }

    componentDidMount() {

    }

    handleSubmit = event => {
        event.preventDefault();
        const { password, password2 } = this.state;
        const data = this.state

        axios.post(`${config.apiUrl}/resetpassword/` + this.token, { token: this.token, password: password, password2: password2 }, { headers })
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
                        window.location.href = `${config.baseUrl}login`
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
                toast.error(err.response.data?.msg, {
                })
            })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        const { password, password2 } = this.state;
        return (

            <>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
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
                                                <h3 className="mb10">Reset Password</h3>
                                                <form onSubmit={this.handleSubmit} className="form-border">

                                                    <div className="form-group">
                                                        <label for="exampleInputsymbol">New Password</label>
                                                        <input className="form-control" type="password" value={this.state.password} onChange={this.handleChange} name="password" id="exampleInputsymbol" aria-describedby="emailHelp" placeholder="Enter New Password" />
                                                    </div>

                                                    <div className="form-group">
                                                        <label for="exampleInputsymbol">Confirm Password</label>
                                                        <input className="form-control" type="password" value={this.state.password2} onChange={this.handleChange} name="password2" id="exampleInputsymbol" aria-describedby="emailHelp" placeholder="Enter Confirm Password" />
                                                    </div>

                                                    <div class="field-set">
                                                        <button type="submit" disabled={!this.state.password || !this.state.password2} class="btn btn-main btn-fullwidth color-2">Submit</button>
                                                    </div>
                                                    <div className="clearfix" />
                                                    <div className="spacer-single" />
                                                    <ul className="list s3">
                                                        <li><a href={`${config.baseUrl}login`}>login</a></li>
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