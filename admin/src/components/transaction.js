import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default class transaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from_address: '',
            to_address: '',
            hash: '',
            amount: '',
            currency: '',
            datetime: '',
            getAllTransaction: [],
            user_list: [],
            transaction_type: '',
            from_date: '',
            to_date: '',
            from_amount: '',
            to_amount: ''
        };
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.userTransaction = this.userTransaction.bind(this);
        this.onChange = this.onChange.bind(this)
        // this.columns = [
        //     {
        //         key: '#',
        //         text: 'Sr. No.',
        //         cell: (row, index) => index + 1
        //     },

        //     {
        //         key: "from_address",
        //         text: "From Address",
        //         cell: (item) => {
        //             return (
        //                 <td nowrap="nowrap">
        //                     <span>
        //                         <p title={item.from_address}>{item.from_address == null ? '' : item.from_address.toString().substring(0, 8) + '...' + item.from_address.toString().substr(item.from_address.length - 8)}</p>
        //                     </span>
        //                 </td>
        //             )
        //         }
        //     },

        //     {
        //         key: "to_address",
        //         text: "To Address",
        //         cell: (item) => {
        //             return (
        //                 <td nowrap="nowrap">
        //                     <span>
        //                         <p title={item.to_address}>{item.to_address == null ? '' : item.to_address.toString().substring(0, 8) + '...' + item.to_address.toString().substr(item.to_address.length - 8)}</p>
        //                     </span>
        //                 </td>
        //             )
        //         }
        //     },

        //     {
        //         key: "hash",
        //         text: "Hash",
        //         cell: (item) => {
        //             return (
        //                 <td nowrap="nowrap">
        //                     <span>

        //                     </span>
        //                     <>
        //                         <a href={`https:/ropsten.etherscan.io/tx/${item.hash}`} target="_blank" >
        //                             <p title={item.hash}>{item.hash == null ? '' : item.hash.toString().substring(0, 8) + '...' + item.hash.toString().substr(item.hash.length - 8)}</p>
        //                         </a>

        //                     </>
        //                 </td>
        //             )
        //         }
        //     },

        //     {
        //         key: "amount",
        //         text: "AMOUNT",
        //         sortable: true,

        //     },
        //     {
        //         key: "currency",
        //         text: "Currency",
        //         sortable: true,

        //     },
        //     {
        //         key: "transaction_type",
        //         text: "Transaction Type",
        //         sortable: true,
        //         cell: (item) => {
        //             return (
        //                 item.transaction_type == 'Sell' ?
        //                     <td nowrap="nowrap" style={{ 'color': 'red' }}>
        //                         {item.transaction_type}
        //                     </td>
        //                     :
        //                     item.transaction_type == 'Buy' ?
        //                         <td nowrap="nowrap" style={{ 'color': 'blue' }}>
        //                             {item.transaction_type}
        //                         </td>
        //                         :
        //                         item.transaction_type == 'Withdrawal' ?
        //                             <td nowrap="nowrap" style={{ 'color': 'Green' }}>
        //                                 {item.transaction_type}
        //                             </td>
        //                             :
        //                             item.transaction_type == 'Royalty Received' ?
        //                                 <td nowrap="nowrap" style={{ 'color': 'black' }}>
        //                                     {item.transaction_type}
        //                                 </td>
        //                                 :
        //                                 <td nowrap="nowrap">
        //                                     {item.transaction_type}
        //                                 </td>
        //             );
        //         }

        //     },
        //     {
        //         key: "transaction_status",
        //         text: "Transaction Status",
        //         sortable: true,

        //     },
        //     {
        //         key: "datetime",
        //         text: "Date",
        //         cell: (item) => {
        //             return (
        //                 <td nowrap="nowrap">
        //                     {item.datetime.slice(0, 10)}
        //                 </td>
        //             );
        //         }
        //     },
        // ];

        this.columns = [
            {
                key: '#',
                text: '#',
                cell: (row, index) => index + 1
            },

            {
                key: "full_name",
                text: "User Name"
            },

            {
                key: "item_name",
                text: "NFT Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl + 'nftDetails/' + item.item_id}`} target="_blank" >
                                {item.item_name}
                            </a>

                        </>
                    );
                }
            },           

            {
                key: "amount",
                text: "AMOUNT",
                sortable: true,

            },
            // {
            //     key: "currency",
            //     text: "Currency",
            //     sortable: true,

            // },
            {
                key: "transaction_type",
                text: "Transaction Type",
                sortable: true,
                cell: (item) => {
                    return (
                        item.transaction_type == 'Sell' ?
                            <td nowrap="nowrap" style={{ 'color': 'red' }}>
                                {item.transaction_type}
                            </td>
                            :
                            item.transaction_type == 'Buy' ?
                                <td nowrap="nowrap" style={{ 'color': 'blue' }}>
                                    {item.transaction_type}
                                </td>
                                :
                                item.transaction_type == 'Withdrawal' ?
                                    <td nowrap="nowrap" style={{ 'color': 'Green' }}>
                                        {item.transaction_type}
                                    </td>
                                    :
                                    item.transaction_type == 'Royalty Received' ?
                                        <td nowrap="nowrap" style={{ 'color': 'black' }}>
                                            {item.transaction_type}
                                        </td>
                                        :
                                        <td nowrap="nowrap">
                                            {item.transaction_type}
                                        </td>
                    );
                }

            },
            {
                key: "transaction_status",
                text: "Transaction Status",
                sortable: true,

            },
            {
                key: "datetime",
                text: "Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            {item.datetime.slice(0, 10)}
                        </td>
                    );
                }
            },
            {
                key: "hash",
                text: "Hash",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>

                            </span>
                            <>
                                <a href={config.blockchainUrltrx + item.hash} target="_blank" >
                                    <p title={item.hash}>{item.hash == null ? '' : item.hash.toString().substring(0, 8) + '...' + item.hash.toString().substr(item.hash.length - 8)}</p>
                                </a>

                            </>
                        </td>
                    )
                }
            },            
        ];
        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            }
        }
    }

    onChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.target.name === 'transaction_type') {
            this.userTransaction(e.target.value, this.state.from_date, this.state.to_date, this.state.from_amount, this.state.to_amount)
        }
        if (e.target.name === 'from_date') {
            this.userTransaction(this.state.transaction_type, e.target.value, this.state.to_date, this.state.from_amount, this.state.to_amount)
        } if (e.target.name === 'to_date') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, e.target.value, this.state.from_amount, this.state.to_amount)
        } if (e.target.name === 'from_amount') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, this.state.to_date, e.target.value, this.state.to_amount)
        } if (e.target.name === 'to_amount') {
            this.userTransaction(this.state.transaction_type, this.state.from_date, this.state.to_date, this.state.from_amount, e.target.value)
        }
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.userTransaction();
    }
    // async filterData(transaction_type) {
    //     alert(transaction_type)
    // }
    async userTransaction(transaction_type, from_date, to_date, from_amount, to_amount) {
        console.log(this.state.transaction_type);

        if (transaction_type === undefined) {
            transaction_type = ''
        }
        else if (from_date === undefined) {
            from_date = ''
        }
        else if (to_date === undefined) {
            to_date = ''
        }
        else if (from_amount === undefined) {
            from_amount = ''
        }
        else if (to_amount === undefined) {
            to_amount = ''
        }

        await axios.post(`${config.apiUrl}getAllTransaction`, {'is_admin':this.loginData.data.is_admin, 'transaction_type_id': transaction_type, 'from_date': from_date, 'to_date': to_date, 'from_amount': from_amount, 'to_amount': to_amount }, {})
            .then(result => {
                console.log(result)
                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response
                    })
                }
                else if (result.data.success === false) {
                }
            })
            .catch(err => {
                this.setState({
                    user_list:[]
                })
            })
    }
    render() {

        return (

            <>
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="setting-panel">
                        <ul className="right-sidebar nicescroll-bar pa-0">
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Users Transaction</h5>
                                </div>
                            </div>
                            {/* <div className="row mb-4">
                                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                    <div className='bannerimage'>
                                        {console.log(this.state.transaction_type)}
                                        <label for="email" class="pt-2">Transaction Type</label>
                                        <select id="transaction_type" name="transaction_type" value={this.state.transaction_type} class="form-control" onChange={this.onChange} >
                                            <option>All</option>
                                            <option value="1">Sell </option>
                                            <option value="6">Withdrawal</option>
                                            <option value="3">Buy</option>
                                            <option value="11">Deposit</option>
                                            <option value="14">Minting Fees</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-9 col-md-8 col-sm-8 col-xs-12">
                                    <div className="row">
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">From</label>

                                                <input type="date" className="form-control" name="from_date" value={this.state.from_date} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">To</label>

                                                <input type="date" className="form-control" name="to_date" value={this.state.to_date} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">From Amount</label>

                                                <input type="text" className="form-control" name="from_amount" value={this.state.from_amount} onChange={this.onChange} />
                                            </div>
                                        </div>
                                        <div class="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                            <div className='date'>
                                                <label for="email" class="pt-2">To Amount</label>
                                                <input type="text" className="form-control" name="to_amount" value={this.state.to_amount} onChange={this.onChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </div> */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">
                                        <ReactDatatable
                                            config={this.config}
                                            records={this.state.user_list}
                                            columns={this.columns}
                                        />
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
