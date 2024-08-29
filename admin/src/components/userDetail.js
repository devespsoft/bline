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

const headers = {
    'Content-Type': 'application/json'
};

const MAX_LENGTH = 20;
export default class userDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_list_transaction: [],
            userDetailData: '',
            user_list: [],
            tabActive: 1,
            user_list_getUserItem: []
        }

        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

        const { match: { params } } = this.props;
        this.userid = params.id
        // alert(this.userid)


        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1,
            },
            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>

                            {item?.name.length > MAX_LENGTH ?
                                (
                                    <a href={`${config.redirectPath}/collections/${item?.collection_id}`} target="_blank">
                                        {`${item?.name.substring(0, MAX_LENGTH)}...`}
                                    </a>
                                ) :
                                <a href={`${config.redirectPath}/collections/${item?.collection_id}`} target="_blank">{item?.name}</a>
                            }

                        </>
                    );
                }

            },
            {
                key: "website",
                text: "Website",
                cell: (item) => {
                    return (
                        <>

                            {item?.website?.length > MAX_LENGTH ?
                                (
                                    <a href={item?.website} target="_blank">
                                        {`${item?.website.substring(0, MAX_LENGTH)}...`}
                                    </a>
                                ) :
                                <p>{item?.website}</p>
                            }

                        </>
                    );
                }

            },
            {
                key: "description",
                text: "Description",
                cell: (item) => {
                    return (
                        <>

                            {item?.description.length > MAX_LENGTH ?
                                (
                                    <p>
                                        {`${item?.description.substring(0, MAX_LENGTH)}...`}
                                    </p>
                                ) :
                                <p>{item?.description}</p>
                            }

                        </>
                    );
                }
            },
            {
                key: "profile_pic",
                text: "Profile Pic",
                cell: (item) => {
                    return (
                        <>

                            {item?.profile_pic === null || item?.profile_pic === '' || item?.profile_pic === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />

                                :
                                <a href={`${config.imageUrl1}${item?.profile_pic}`} target="_blank">
                                    <img src={`${config.imageUrl1}${item?.profile_pic}`} className="product-img" /></a>}

                        </>
                    );
                }
            },
            {
                key: "banner",
                text: "Banner",
                cell: (item) => {
                    return (
                        <>

                            {item?.banner === null || item?.banner === '' || item?.banner === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />

                                :
                                <a href={`${config.imageUrl1}${item?.banner}`} target="_blank">

                                    <img src={`${config.imageUrl1}${item?.banner}`} className="product-img" /></a>}

                        </>
                    );
                }
            },
            {
                text: "Social Icons",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <p className='circle-icon'>{item?.facebook === '' && item?.insta === '' && item?.telegram === '' && item?.twitter === '' && item?.discord === '' ? 'N/A' :

                                item?.facebook ? <a href={item?.facebook} target="_blank"> <i className="fa fa-facebook" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.insta ? <a href={item?.insta} target="_blank"> <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.telegram ? <a href={item?.telegram} target="_blank"> <i className="fa fa-telegram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.twitter ? <a href={item?.twitter} target="_blank"> <i className="fa fa-twitter" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.discord ? <a href={item?.discord} target="_blank">
                                    <span className="discord-img"><img src="images/discord.png" /></span></a> : ''}
                            </p>                        </td>
                    );
                }
            },
            {
                key: "datetime",
                text: "Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            {item?.datetime.slice(0, 10)}
                        </td>
                    );
                }
            },

        ]

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



        this.columns1 = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "item_name",
                text: "NFT Title",
                cell: (item) => {
                    return (
                        <>

                            {item?.item_name?.length > MAX_LENGTH ?
                                (
                                    <a href={`${config.redirectPath}/nftDetails/${item?.item_id}`} target="_blank">
                                        {`${item?.item_name.substring(0, MAX_LENGTH)}...`}
                                    </a>
                                ) :
                                <a href={`${config.redirectPath}/nftDetails/${item?.item_id}`} target="_blank">{item?.item_name}</a>
                            }

                        </>
                    );
                }

            },
            {
                key: "description",
                text: "Description",
                cell: (item) => {
                    return (
                        <>

                            {item?.description?.length > MAX_LENGTH ?
                                (
                                    <p>
                                        {`${item?.description.substring(0, MAX_LENGTH)}...`}
                                    </p>
                                ) :
                                <p>{item?.description}</p>
                            }

                        </>
                    );
                }

            },
            {
                key: "amount",
                text: "NFT PRICE",
                cell: (item) => {
                    return (
                        <>

                            {item?.amount?.length > MAX_LENGTH ?
                                (
                                    <p>
                                        {`${item?.amount.substring(0, MAX_LENGTH)}...`}
                                    </p>
                                ) :
                                <p>{item?.amount}</p>
                            }

                        </>
                    );
                }
            },
            // {
            //     key: "currency",
            //     text: "Currency",

            // },
            {
                key: "transaction_type",
                text: "Transaction Type",

            },
            {
                key: "creater_name",
                text: "NFT Creator",

            },
            {
                key: "owner_name",
                text: "NFT Owner",

            },
            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>

                            {item?.image === null || item?.image === '' || item?.image === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />

                                :
                                <a href={`${config.imageUrl}${item?.image}`} target="_blank">

                                    <img src={`${config.imageUrl}${item?.image}`} className="product-img" /></a>}

                        </>
                    );
                }
            },

            {
                key: "transaction_date",
                text: "Transaction Date",

            },


        ]

        this.config1 = {
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


        this.columns2 = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectPath}/nftDetails/${item.item_id}`} target="_blank" >
                                {item.name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "description",
                text: "Description",

            },

            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {item.file_type === 'image' ?
                                <img src={`${config.imageUrl}${item.image}`} className="product-img" /> :

                                item.file_type === 'video' ?
                                    <a href={`${config.imageUrl}${item.image}`} target="_blank">
                                        <img className="video-css" src="https://www.roadtovr.com/wp-content/uploads/2015/03/youtube-logo2.jpg" />
                                    </a> :
                                    <a href={`${config.imageUrl}${item.image}`} target="_blank">
                                        <img className="video-css" src="https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-high-sound-vector-icon-png-image_470307.jpg" />
                                    </a>
                            }
                        </>
                    );
                }
            },
            {
                key: "price",
                text: "Price (ETH)",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price}</span>
                        </>
                    )
                }
            },
            {
                text: "NFT Type",
                cell: (item) => {
                    return (
                        <>
                            <p>

                                {item.sell_type === 1 ? 'Purchase' : 'Auction'}
                            </p>

                        </>
                    );
                }

            },
            {

                text: "Collection Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectPath}/collections/${item.collection_id}`} target="_blank" >
                                {item.collection_name}
                            </a>

                        </>
                    );
                }

            },



        ];

        this.config2 = {
            page_size: 10,
            length_menu: [10, 20, 50,],
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
        this.getUser();
        this.userCollection();
        this.userTransaction();
        this.usergetUserItem()
    }



    getUser = async e => {

        let data = {
            id: this.userid
        }

        await axios.post(`${config.apiUrl}getUserDetails`, data, { headers })
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        userDetailData: result.data.response,

                    })


                }
            })
    }


    async userCollection() {
        let data = {
            user_id: this.userid
        }
        await axios.post(`${config.apiUrl}getUserCollection`, data, { headers })
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response,
                        pageCount: Math.ceil(data.length / this.state.perPage),
                    })
                }
                else if (result.data.success === false) { }
            })
            .catch(err => { })
    }

    //==============================================  transaction ======================================

    async userTransaction() {

        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserTransaction`,
            headers: { "Authorization": this.loginData?.Token },
            data: { user_id: this.userid, 'is_admin': this.loginData.data.is_admin }
        })
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {

                    this.setState({
                        user_list_transaction: result.data.response,
                    })

                }
                else if (result.data.success === false) { }
            })
            .catch(err => { })
    }

    //==============================================  transaction ======================================

    async usergetUserItem() {

        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserItem`,
            headers: { "Authorization": this.loginData?.Token },
            data: { user_id: this.userid, 'is_admin': this.loginData.data.is_admin, "login_user_id": 0, "user_collection_id": 0, "is_trending": 0, "recent": 0, "limit": 0 }
        })
            .then(result => {
                const data = result.data;
                if (result.data.success === true) {

                    this.setState({
                        user_list_getUserItem: result.data.response,
                    })

                }
                else if (result.data.success === false) { }
            })
            .catch(err => { })
    }



    tabClick(id) {
        if (id === 1) {
            this.setState({
                tabActive: 1
            })
        }
        else if (id === 2) {
            this.setState({
                tabActive: 2
            })
        }
        else if (id === 3) {
            this.setState({
                tabActive: 3
            })
        }
        else if (id === 4) {
            this.setState({
                tabActive: 4
            })
        }
        else if (id === 5) {
            this.setState({
                tabActive: 5
            })
        }
    }

    render() {

        return (
            <>
                <div className="wrapper theme-6-active pimary-color-green">
                    <div className="pcoded-container navbar-wrapper">
                        <Header />
                        <div className="pcoded-main-container">
                            <div className="pcoded-wrapper">
                                <Leftsidebar />
                                <div className="page-wrapper nft-user" style={{ marginLeft: '216px' }}>
                                    <br />
                                    <ul className="nav nav-tabs">
                                        <li className={this.state.tabActive === 1 ? "active" : ''} ><a href="javascript:void(0)" onClick={this.tabClick.bind(this, 1)}>Detail</a></li>
                                        <li className={this.state.tabActive === 2 ? "active" : ''}><a href="javascript:void(0)" onClick={this.tabClick.bind(this, 2)}>Collection</a></li>
                                        <li className={this.state.tabActive === 3 ? "active" : ''}><a href="javascript:void(0)" onClick={this.tabClick.bind(this, 3)}>Transaction</a></li>
                                        <li className={this.state.tabActive === 4 ? "active" : ''}><a href="javascript:void(0)" onClick={this.tabClick.bind(this, 4)}>NFT's</a></li>
                                        {/* <li className={this.state.tabActive === 5 ? "active" : ''}><a href="javascript:void(0)" onClick={this.tabClick.bind(this, 5)}>Deposit/ Withdraw</a></li> */}

                                    </ul>

                                    <div className="row user-info-css" style={{ display: this.state.tabActive === 1 ? 'block' : 'none' }}>
                                        <div className='col-md-6'>                                          
                                                <div className="row">
                                                    <div className="col-md-4 col-4">
                                                        <p>Full Name:</p>
                                                    </div>
                                                    <div className="col-md-6 col-6">
                                                        <p>{this.state.userDetailData?.full_name}</p>
                                                    </div>

                                                </div>                               
                                            {/* <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <p>Email Verify:</p>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    {(this.state.userDetailData?.is_email_verify === 0) ? <span style={{ color: "#dc6767" }}>Not Verified</span> : <span style={{ color: "#1eb91e" }}>Verified</span>}
                                                </div>

                                            </div>

                                        </div> */}
                                            {/* <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <p>Phone:</p>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    <p>{this.state.userDetailData?.phone}</p>
                                                </div>

                                            </div>

                                        </div> */}
                                            {/* <div className="col-sm-6">
                                            <div className="row">
                                                <div className="col-md-6 col-6">
                                                    <p>Two Factor Status:</p>
                                                </div>
                                                <div className="col-md-6 col-6">
                                                    {(this.state.userDetailData?.enableTwoFactor === 0) ? <span style={{ color: "#dc6767" }}>Not Active</span> : <span style={{ color: "#1eb91e" }}>Active</span>}
                                                </div>

                                            </div>

                                        </div> */}
                                                <div className="row">
                                                    <div className="col-md-4 col-4">
                                                        <p>Social Icons:</p>
                                                    </div>
                                                    <div className="col-md-6 col-6">
                                                        <p className='circle-icon'>{this.state.userDetailData?.facebook === '' && this.state.userDetailData?.insta === '' && this.state.userDetailData?.telegram === '' && this.state.userDetailData?.twitter === '' && this.state.userDetailData?.discord === '' ? 'N/A' :

                                                            this.state.userDetailData?.facebook ? <a href={this.state.userDetailData?.facebook} target="_blank"> <i className="fa fa-facebook-square" aria-hidden="true"></i>&nbsp;</a> : ''}
                                                            {this.state.userDetailData?.insta ? <a href={this.state.userDetailData?.insta} target="_blank"> <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                                            {this.state.userDetailData?.telegram ? <a href={this.state.userDetailData?.telegram} target="_blank"> <i className="fa fa-telegram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                                            {this.state.userDetailData?.twitter ? <a href={this.state.userDetailData?.twitter} target="_blank"> <i className="fa fa-twitter" aria-hidden="true"></i>&nbsp;</a> : ''}
                                                            {this.state.userDetailData?.discord ? <a href={this.state.userDetailData?.discord} target="_blank">
                                                                <span className="discord-img"><img src="images/discord2.png" /></span></a> : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4 col-4">
                                                        <p>Profile Image:</p>
                                                    </div>
                                                    <div className="col-md-6 col-6">
                                                        {this.state.userDetailData?.profile_pic ?
                                                            <a href={`${config.imageUrl1}${this.state.userDetailData?.profile_pic}`} target="_blank">
                                                                <p><img src={`${config.imageUrl1}${this.state.userDetailData?.profile_pic}`} style={{ width: "100px", height: "100px" }} /> </p>
                                                            </a> : 'N/A'
                                                        }

                                                    </div>
                                                </div>
                                            </div>

                                        <div className="col-sm-6">
                                            <div className="col-md-4 col-4">
                                                <p>Banner Image:</p>
                                            </div>
                                            <div className="col-md-6 col-6">
                                                <div className='bnr_img'>
                                                {this.state.userDetailData?.banner ?
                                                    <a href={`${config.imageUrl1}${this.state.userDetailData?.banner}`} target="_blank">
                                                    <img src={`${config.imageUrl1}${this.state.userDetailData?.banner}`}  />
                                                    </a> : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="table-responsive" style={{ display: this.state.tabActive === 2 ? 'block' : 'none'}}>

                                        <ReactDatatable
                                            config={this.config}
                                            records={this.state.user_list}
                                            columns={this.columns}
                                        />

                                    </div>


                                    <div className="table-responsive" style={{ display: this.state.tabActive === 3 ? 'block' : 'none' }}>

                                        <ReactDatatable
                                            config={this.config1}
                                            records={this.state?.user_list_transaction.filter((item) => item.transaction_type_id !== 11 && item.transaction_type_id !== 3)}
                                            columns={this.columns1}
                                        />

                                    </div>

                                    <div className="table-responsive" style={{ display: this.state.tabActive === 4 ? 'block' : 'none' }}>

                                        <ReactDatatable
                                            config={this.config2}
                                            records={this.state?.user_list_getUserItem}
                                            columns={this.columns2}
                                        />

                                    </div>


                                    <div className="table-responsive" style={{ display: this.state.tabActive === 5 ? 'block' : 'none' }}>

                                        <ReactDatatable
                                            config={this.config1}
                                            records={this.state?.user_list_transaction.filter((item) => item.transaction_type_id === 11 || item.transaction_type_id === 3)}
                                            columns={this.columns1}
                                        />

                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )

    }
}

