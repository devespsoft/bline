import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
// import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
const headers = {
    'Content-Type': 'application/json'
};

export default class collection extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userData : [],
            collectionData : []
        }

        this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    }

    componentDidMount() {
        if (!this.loginData?.id) {
            window.location.href = `${config.baseUrl}`
        }
        this.getCollectionDataAPI()
        this.getUserDataAPI()
    }

    async getUserDataAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getAboutDetail`,
            data: { "email": this.loginData.user_email }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    userData: response.data.response
                })
            }
        })
    }

    async getCollectionDataAPI() {
        const token = this.token
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            headers: { authorization: token },
            data: { "user_id": this.loginData?.id, 'email': this.loginData?.user_email }
        }).then(response => {
            console.log('abc', response.data);
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }


    render() {
        return (

            <>
                <Header />
                <div className="no-bottom no-top" id="content">
                    <div id="top" />
                    {/* section begin */}
                    <section id="profile_banner" aria-label="section" className="text-light" data-bgimage="url(images/background/4.jpg) top">
                    </section>
                    {/* section close */}
                    <section aria-label="section" className="d_coll no-top">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="d_profile">
                                        <div className="profile_avatar">
                                            <div className="d_profile_img">
                                                {this.state.userData?.profile_pic?
                                                    <img src={`${config.imageUrl1}`+this.state.userData?.profile_pic} alt="" />
                                                :
                                                    <img src="images/default-user-icon.jpg" alt="" />
                                                }   
                                                    
                                                {/* <i className="fa fa-check" /> */}
                                            </div>
                                            <div className="profile_name">
                                                <h4>
                                                    {this.state.userData?.full_name}
                                                    <div className="clearfix" />
                                                    <span id="wallet" className="profile_wallet">DdzFFzCqrhshMSxb9oW3mRo4MJrQkusV3fGFSTwaiu4wPBqMryA9DYVJCkW9n7twCffG5f5wX2sSkoDXGiZB1HPa7K7f865Kk4LqnrME</span>
                                                    <button id="btn_copy" title="Copy Text">Copy</button>
                                                    <br /><br />
                                                    <div className="social-icons mt-4" style={{ backgroundSize: 'cover' }}>
                                                        <a target="_blank" href={this.state.userData?.facebook}><img src="images/facebook-logo.png" className="social-icons-collection" /></a>
                                                        <a target="_blank" href={this.state.userData?.twitter}><img src="images/twitter.png" className="social-icons-collection" /></a>
                                                        <a target="_blank" href={this.state.userData?.discord}><img src="images/discord-blue.png" className="social-icons-collection" /></a>
                                                        <a target="_blank" href={this.state.userData?.insta}><img src="images/instagram.png" className="social-icons-collection" /></a>
                                                        <a target="_blank" href={this.state.userData?.telegram}><img src="images/telegram.png" className="social-icons-collection" /></a>
                                                    </div>
                                                </h4>
                                            </div>
                                            <div className="row">
                                                <div className="de_tab tab_simple mt-4" style={{ backgroundSize: 'cover' }}>
                                                    <ul className="de_nav">
                                                        <li className="active" style={{ opacity: 1 }}><span>Collection Details</span></li>
                                                        {/* <li ><span>Bids</span></li> */}
                                                        <li className style={{ opacity: 1 }}><span>Collection Stats</span></li>
                                                    </ul>
                                                    <div className="de_tab_content" style={{ backgroundSize: 'cover' }}>
                                                        <div className="tab-1" style={{ backgroundSize: 'cover', display: 'none' }}>
                                                            <p className="collection_detail_para"> CryptoBots is a game centered around cryptographically unique collectible bots on the Ethereum blockchain.</p>
                                                        </div>
                                                        <div className="tab-2" style={{ backgroundSize: 'cover' }}>
                                                            <div className="row mb-5">
                                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                                                </div>
                                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                                                    <div className="row mb-4">
                                                                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                                            <div className="collection_stats">
                                                                                <h5>8.0K</h5>
                                                                                <p>Items</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                                            <div className="collection_stats">
                                                                                <h5>2.2K</h5>
                                                                                <p>Owner</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                                            <div className="collection_stats">
                                                                                <h5>0.22</h5>
                                                                                <p>Floor Price</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                                            <div className="collection_stats">
                                                                                <h5>8.0K</h5>
                                                                                <p>Volume traded</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div id="chartContainer" style={{ height: '300px', width: '100%' }} />
                                                                </div>
                                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="de_tab tab_simple">
                                        <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <form className="form-inline">
                                                        <div className="form"> <i className="fa fa-search" /> <input type="text" className="form-control form-input" placeholder="Search anything..." />
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                    <div id="items_type" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                                                        <a href="#" className="btn-selector">All Items</a>
                                                        <ul style={{ display: 'none' }}>
                                                            <li className="active"><span>All Items</span></li>
                                                            <li><span>Single Items</span></li>
                                                            <li><span>Bundles</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                    <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                                                        <a href="#" className="btn-selector">Price: low to high</a>
                                                        <ul style={{ display: 'none' }}>
                                                            <li className="active"><span>$200</span></li>
                                                            <li><span>$500</span></li>
                                                            <li><span>$500</span></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="de_tab_content">
                                            <div className="tab-1">
                                                <div className="row">
                                                    {/* nft item begin */}
                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="de_countdown" data-year={2021} data-month={10} data-day={16} data-hour={8} />
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-1.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #256</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.08 ADA<span>1/20</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>50</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* nft item begin */}
                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-2.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #128</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.06 ADA<span>1/22</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>80</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* nft item begin */}
                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="de_countdown" data-year={2021} data-month={10} data-day={14} data-hour={8} />
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-3.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #712</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.05 ADA<span>1/11</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>97</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* nft item begin */}
                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-4.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #525</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.02 ADA<span>1/15</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>73</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-2">
                                                <div className="row">
                                                    {/* nft item begin */}
                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-3.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #256</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.05 ADA<span>1/11</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>97</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-1.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #256</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.08 ADA<span>1/20</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>50</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-2.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction 128</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.06 ADA<span>1/22</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>80</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/collections/coll-item-4.jpg" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Abstraction #525</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.02 ADA<span>1/15</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>73</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-3">
                                                <div className="row">

                                                    <div className="col-lg-3 col-md-6">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/items/anim-4.webp" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>The Truth</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.06 ADA<span>1/20</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>26</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6">
                                                        <div className="nft__item">
                                                            <div className="de_countdown" data-year={2021} data-month={10} data-day={6} data-hour={8} />
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/items/anim-2.webp" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Running Puppets</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.03 ADA<span>1/24</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>45</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6">
                                                        <div className="nft__item">
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/items/anim-1.webp" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>USA Wordmation</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.09 ADA<span>1/25</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>76</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-3 col-md-6">
                                                        <div className="nft__item">
                                                            <div className="de_countdown" data-year={2021} data-month={9} data-day={29} data-hour={8} />
                                                            <div className="author_list_pp">
                                                                <a href="author.html">
                                                                    <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                                                    <i className="fa fa-check" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_wrap">
                                                                <a href="item-details.html">
                                                                    <img src="images/items/anim-5.webp" className="lazy nft__item_preview" alt="" />
                                                                </a>
                                                            </div>
                                                            <div className="nft__item_info">
                                                                <a href="item-details.html">
                                                                    <h4>Loop Donut</h4>
                                                                </a>
                                                                <div className="nft__item_price">
                                                                    0.09 ADA<span>1/14</span>
                                                                </div>
                                                                <div className="nft__item_action">
                                                                    <a href="#">Place a bid</a>
                                                                </div>
                                                                <div className="nft__item_like">
                                                                    <i className="fa fa-heart" /><span>94</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        )
    }

}