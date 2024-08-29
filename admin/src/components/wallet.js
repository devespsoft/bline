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
export default class wallet extends Component {

    constructor(props) {
        super(props)
        this.state = {

            // amount: '',
            // currency: '',
            // to_address: '',
            transaction_list: [],
            withdrawAmount: '',
            withdrawRecepientAddress: '',
            // contact_list: ''



        };
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        // this.getTransactionHistory = this.getTransactionHistory.bind(this)
        this.depositeWithdrawHistoryAPI = this.depositeWithdrawHistoryAPI.bind(this)
        this.getWithdrawHistoryAPI = this.getWithdrawHistoryAPI.bind(this)
        // this.updatAdminWalletAPI = this.updatAdminWalletAPI.bind(this)
        this.withdrawAda = this.withdrawAda.bind(this)

        this.columns = [
            // {
            //     key: "to_address",
            //     text: "To Address",
            //     sortable: true
            // },
            {
                key: "to_address",
                text: "To Address",
                sortable: true,
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                <p title={item.to_address}>{item.to_address == null ? '' : item.to_address.toString().substring(0, 8) + '...' + item.to_address.toString().substr(item.to_address.length - 8)}</p>
                                {item.to_address == null ? '' : <i onClick={this.copyToClipboard.bind(this, item.to_address)} className="fa fa-copy" style={{ color: 'grey', cursor: 'pointer' }}></i>}
                            </span>
                        </td>
                    )
                }
            },

            {
                key: "amount",
                text: "Amount",
                sortable: true
            },
            {
                key: "currency",
                text: "Currency",
                sortable: true
            },

            {
                key: "datetime",
                text: "Transaction Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">

                            {item.datetime.slice(0, 10)}
                        </td>
                    );
                }
            },

        ];

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
        console.log("-----=====", this.loginData);
        // this.getTransactionHistory();

        // this.getTransactionHistory();
        this.depositeWithdrawHistoryAPI();
        this.getWithdrawHistoryAPI();
        // this.getPromoCoin();
    }

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })
    }


    async withdrawAda(e) {
        e.preventDefault()
        // this.setState({
        //   spinLoader: '1'
        // })
        const token = this.loginData?.Token
        await axios({
            method: 'post',
            url: `${config.apiUrl}walletWithdraw`,
            headers: { authorization: token },
            data: { "user_id": this.loginData.data?.id, 'is_admin':this.loginData.data.is_admin,'email': this.loginData.data?.user_email, 'amount': this.state.withdrawAmount, 'address': this.state.withdrawRecepientAddress }
        }).then(response => {
            if (response.data.success === true) {
                toast.success('Withdraw successfully!!', {

                });
                this.depositeWithdrawHistoryAPI()
            } else {
                toast.error(response.data.msg?.msg,

                );
            }
        }).catch(err => {
            toast.error(err.response.data?.msg,

            );
        })
    }


    async depositeWithdrawHistoryAPI() {
        const token = this.loginData?.Token
        await axios({
            method: 'post',
            url: `${config.apiUrl}withdrawDepositList`,
            headers: { authorization: token },
            data: { "user_id": this.loginData.data?.id,'is_admin':this.loginData.data.is_admin, 'email': this.loginData.data?.user_email }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    depositeWithdrawHistory: response.data.data
                })
            }
        })
    }

    async getWithdrawHistoryAPI() {
        axios.get(`${config.apiUrl}getWithdrawHistory`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        transaction_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }














    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };





    copyToClipboard(id) {
        copy(id);

        toast.success("Copied", {

        });


    }

    render() {

        return (

            <>


                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <br/>
                    <div className="page-wrapper nft-user" id="charges_update">
                        <div className="container" style={{border:'1px solid #ddd',padding:'30px',marginTop:'20px'}}>
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h4 className=""><b>Wallet History</b></h4>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">

                                    <div className="form-group">
                                        <label for="email">Receipent ADA Address:</label>
                                        <input type="email" className="form-control" id="public_key" placeholder="0xB45F05cBC7614f50f31409Bec10e06cdFa0Bc168
                                        " value={this.state.withdrawRecepientAddress} onChange={this.onChange} name='withdrawRecepientAddress' className="form-control" />
                                    </div>

                                </div>

                            </div>

                            <div className="row mt-5">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">

                                    <div className="form-group">
                                        <label for="email">Amount:</label>
                                        <input type="text" className="form-control" id="withdrawAmount" placeholder="0.55" value={this.state.withdrawAmount} onChange={this.onChange} name='withdrawAmount' className="form-control" />
                                    </div>

                                </div>
                                {/* <img src="https://chart.googleapis.com/chart?chs=350x350&amp;cht=qr&amp;chl=addr1qxxspg3xvku29evzyteczyrt6t2569j9hcqxnjvzyumlwe48up75lr7x492len8a235v0qgxdp80gs377qehajx7em7qtk9ntm" class="qr-code-img"></img> */}
                            </div>

                            <div className="row">
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12"></div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">

                                    <div className="">
                                        <center>
                                            <button type="submit" disabled={!this.state.withdrawAmount || !this.state.withdrawRecepientAddress} onClick={this.withdrawAda} className="btn btn-primary update_btn">Withdraw</button>&nbsp;
                                        </center>
                                    </div>

                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12"></div>
                            </div>

                        </div>
                       



                    </div>
                    <div className="wrapper theme-6-active pimary-color-green">

                  
                        <div className="" style={{background:'#edf1f5'}}>
                            <div className="container" style={{marginTop:'-57px',marginLeft:'100px'}}>
                                <div className="row heading-bg">
                                    <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                        <h4 className="txt-dark"><b>Withdraw History</b></h4>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="panel panel-default card-view">
                                            <div className="panel-wrapper collapse in">
                                                <div className="panel-body">
                                                    <div className="form-wrap">
                                                        <form action="#">
                                                            <div className="row">
                                                            </div>
                                                            <div className="form-actions">

                                                                <div className="clearfix"></div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="form-wrap">
                                                        <div class="table-responsive">
                                                            <ReactDatatable
                                                                config={this.config}
                                                                records={this.state.transaction_list}
                                                                columns={this.columns}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </div>
            </>


        )

    }
}
