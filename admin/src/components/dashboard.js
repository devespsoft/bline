import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';

export default class dashboard extends Component {

    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.state = {
            dashboard_list: ''
        }
    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.dashboardList();
    }

    async dashboardList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}dashboarditem`,
                data: {}
            })
                .then(result => {
                    if (result.data.success === true) {
                        this.setState({
                            dashboard_list: result.data.response
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
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="fixed-sidebar-right">
                        <ul className="right-sidebar">
                            <li>
                                <div className="tab-struct custom-tab-1">
                                    <ul role="tablist" className="nav nav-tabs" id="right_sidebar_tab">
                                        <li className="active" role="presentation"><a aria-expanded="true" data-toggle="tab" role="tab" id="chat_tab_btn" href="#chat_tab">chat</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="messages_tab_btn" role="tab" href="#messages_tab" aria-expanded="false">messages</a></li>
                                        <li role="presentation" className=""><a data-toggle="tab" id="todo_tab_btn" role="tab" href="#todo_tab" aria-expanded="false">todo</a></li>
                                    </ul>
                                    <div className="tab-content" id="right_sidebar_content">
                                        <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                            <div className="chat-cmplt-wrap">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop "></div>
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            <div className="row dashboar-main">
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                            <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash1.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.nft_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total NFT's </span>
                    
                                                            </div>
                                                            <div className='col-xs-12'>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash1.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100  counter">{this.state.dashboard_list.today_nft_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Today's Total NFT's </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash2.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-100 counter">{this.state.dashboard_list.total_sale_ada}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Sales  </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash2.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75  counter ">{this.state.dashboard_list.today_sale_ada}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Today's Total Sale </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash3.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.sold_nft}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total NFT sold </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash3.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.sold_nft_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's Total Sold NFT's </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash4.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.user_count}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total User</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash4.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.user_count_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's User</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash5.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.total_fee}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Total Fees</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 box-counter col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pa-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box">
                                                    <div className="container-fluid" >
                                                        <div className="row">
                                                        <div className='col-xs-12'>
                                                                <div className='dash-img'><img src='images/dash5.png ' />
                                                                </div>
                                                            </div>
                                                            <div className="col-xs-12 text-center pl-0 pr-0 data-wrap-left">
                                                                <span className="weight-500 uppercase-font block font-75 counter ">{this.state.dashboard_list.total_fee_today}</span>
                                                                <span className="weight-500 uppercase-font block font-13 ">Todays's Total Fees</span>
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
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}