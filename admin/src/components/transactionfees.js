import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import copy from 'copy-to-clipboard';
const headers = {
    'Content-Type': 'application/json'
};
export default class transactionfees extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            token_name: '',
            token_description: '',
            token_price: '',
            lottery: ''
           
        };
        this.getTransactionAPI = this.getTransactionAPI.bind(this)
        this.updateFeesAPI = this.updateFeesAPI.bind(this)

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 30],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }


    }



    componentDidMount() {
        // if (!Cookies.get('loginSuccess')) {
        //     window.location.href = `${config.baseUrl}`
        //     return false;
        // }
        this.getTransactionAPI();
    }

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getTransactionAPI = async e => {


        await axios.get(`${config.apiUrl}getTransactionFee`, {})
            .then(result => {

                if (result.data.success === true) {

                    this.setState({
                        sale_price_percent: result.data.response[0].sale_price_percent,
                        minimum_transaction_fee: result.data.response[0].minimum_transaction_fee,

                    })

                }
            })
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    async updateFeesAPI(type) {

        var data = {

            sale_price_percent: this.state.sale_price_percent,
            minimum_transaction_fee: this.state.minimum_transaction_fee,
            
           

        }

        axios.post(`${config.apiUrl}updateTransactionFee`, data, {})
            .then(response => {


                if (response.data.success === true) {
                    toast.success('Updated Successfully', {
                        position: toast.POSITION.TOP_CENTER
                    });

                }

                else if (response.data.success === false) {
                    toast.error(response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
            .catch(err => {
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
            })
    }
    handleSubmit = async (event) => {
        event.preventDefault();
    }
    render() {
        return (
            <>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <h5 className="txt-dark">Transaction Fees</h5>
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-2 col-lg-2 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Percent of Sale Price:</label>
                                        <input type="number" className="form-control" id="sale_price_percent" placeholder="Percent of Sale Price" value={this.state.sale_price_percent} onChange={this.onChange} name='sale_price_percent' className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" style={{marginTop: "21px"}} onClick={this.updateFeesAPI.bind(this, '1')} className="btn btn-primary update_btn">Update</button>&nbsp;
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1"></div>
                                <div className="col-xl-2 col-lg-2 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Mnimum Transaction Fees: (ADA)</label>
                                        <input type="number" className="form-control" id="minimum_transaction_fee" placeholder="Minimum Transaction Fees" value={this.state.minimum_transaction_fee} onChange={this.onChange} name='minimum_transaction_fee' className="form-control" />
                                    </div>
                                </div>
                               
                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" style={{marginTop: "21px"}} onClick={this.updateFeesAPI.bind(this, '2')} className="btn btn-primary update_btn">Update</button>&nbsp;
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1"></div>
                               
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}
