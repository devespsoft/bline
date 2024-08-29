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
export default class feessetting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            token_name: '',
            token_description: '',
            token_price: '',
            lottery: ''
           
        };
        this.getFeesAPI = this.getFeesAPI.bind(this)
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
        this.getFeesAPI();
    }

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getFeesAPI = async e => {


        await axios.get(`${config.apiUrl}getFees`, {})
            .then(result => {

                if (result.data.success === true) {

                    this.setState({
                        single_nft_fee: result.data.response[0].single_nft_fee,
                        bulk_nft_fee: result.data.response[0].bulk_nft_fee,
                        bulk_nft_count: result.data.response[0].bulk_nft_count

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

            single_nft_fee: this.state.single_nft_fee,
            bulk_nft_fee: this.state.bulk_nft_fee,
            bulk_nft_count: this.state.bulk_nft_count
           

        }

        axios.post(`${config.apiUrl}updateFees`, data, {})
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
                                <h5 className="txt-dark">Fees</h5>
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-2 col-lg-2 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Single NFT Mint Fees: (ADA)</label>
                                        <input type="number" className="form-control" id="single_nft_fee" placeholder="Single NFT Fees" value={this.state.single_nft_fee} onChange={this.onChange} name='single_nft_fee' className="form-control" />
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
                                        <label for="email">Bulk NFT Mint Fees: (ADA)</label>
                                        <input type="number" className="form-control" id="bulk_nft_fee" placeholder="Bulk NFT Fees" value={this.state.bulk_nft_fee} onChange={this.onChange} name='bulk_nft_fee' className="form-control" />
                                    </div>
                                </div>
                               
                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" style={{marginTop: "21px"}} onClick={this.updateFeesAPI.bind(this, '2')} className="btn btn-primary update_btn">Update</button>&nbsp;
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1"></div>
                                <div className="col-xl-2 col-lg-2 col-md-3 col-12">
                                    <div className="form-group">
                                        <label for="email">Bulk NFT Count:</label>
                                        <input type="number" className="form-control" id="bulk_nft_count" placeholder="Bulk NFT Count" value={this.state.bulk_nft_count} onChange={this.onChange} name='bulk_nft_count' className="form-control" />
                                    </div>
                                </div>
                                <div className="col-xl-1 col-lg-1 col-md-3 col-12">
                                    <div className="">
                                        <button type="submit" style={{marginTop: "21px"}} onClick={this.updateFeesAPI.bind(this, '2')} className="btn btn-primary update_btn">Update</button>&nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}
