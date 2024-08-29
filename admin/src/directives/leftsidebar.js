import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import config from '../config/config'
import  {FirstName}  from './header';

export default class Leftsidebar extends Component {

    constructor(props) {
        super(props)
        console.log('dsfdsf',localStorage.getItem('navBarStatus'));

    }

    componentDidMount() {
        

    }


    render() {

        return (
            <>
            
            {/* <FirstName.Consumer>{(fname)=>{
                    {console.log('33333',fname)}
                return 
                 */}
                 {/* style={{width:fname==undefined || fname == 0 ?'225px':'50px'}} */}
                 <div >
                 <div className="fixed-sidebar-left mobileLeftShow">
                <ul className="nav navbar-nav side-nav nicescroll-bar">
                    <li className="navigation-header">
                        <span>Main</span>
                    
                        <i className="zmdi zmdi-more"></i>
                    </li>

                    <li>
                        <Link to={`${config.baseUrl}dashboard`}><div className="pull-left"><i className="zmdi zmdi-view-dashboard mr-20"></i><span className="right-nav-text">Dashboard</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    
                    <li>
                        <Link to={`${config.baseUrl}users`}><div className="pull-left"><i className="zmdi zmdi-account mr-20"></i><span className="right-nav-text">Users</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>

                    <li>
                        <Link to={`${config.baseUrl}usercollection`}><div className="pull-left"><i className="zmdi zmdi-accounts mr-20"></i><span className="right-nav-text">User Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}myCollection`}><div className="pull-left"><i className="zmdi zmdi-accounts mr-20"></i><span className="right-nav-text">Admin Collections</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}product`}><div className="pull-left"><i className="zmdi  zmdi-toys mr-20"></i><span className="right-nav-text">User NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}adminnft`}><div className="pull-left"><i className="zmdi zmdi-toys mr-20"></i><span className="right-nav-text">Admin NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>

                    {/* <li>
                        <Link to={`${config.baseUrl}bulkNFT`}><div className="pull-left"><i class="zmdi zmdi-widgets mr-20"></i><span className="right-nav-text">Bulk NFTs</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li> */}
                    <li>
                        <Link to={`${config.baseUrl}categoryList`}><div className="pull-left"><i className="zmdi zmdi-collection-image mr-20"></i><span className="right-nav-text">Games Category</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>

                    <li>
                        <Link to={`${config.baseUrl}gamescategory`}><div className="pull-left"><i class="zmdi zmdi-gamepad mr-20"></i><span className="right-nav-text">Games</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>


                    <li>
                        <Link to={`${config.baseUrl}transaction`}><div className="pull-left"><i class="zmdi zmdi-refresh-sync mr-20"></i><span className="right-nav-text">Transaction</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>

                    {/* <li>
                        <Link to={`${config.baseUrl}wallet`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Wallet Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}feessetting`}><div className="pull-left"><i class="zmdi zmdi-money-box mr-20"></i><span className="right-nav-text">Fees Setting</span></div><div className="pull-right"><i></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}transactionfees`}><div className="pull-left"><i class="zmdi zmdi-arrows mr-20"></i><span className="right-nav-text">Transaction Fees</span></div><div className="pull-right"><i></i></div><div className="clearfix"></div></Link>

                    </li> */}

                    <li>
                        <Link to={`${config.baseUrl}support`}><div className="pull-left"><i class="zmdi zmdi-pin-help mr-20"></i><span className="right-nav-text">Support</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <Link to={`${config.baseUrl}contact`}><div className="pull-left"><i className="zmdi  zmdi-accounts-list mr-20"></i><span className="right-nav-text">Contact Us</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

                    </li>
                    <li>
                        <a href="javascript:void(0);" disabled data-toggle="collapse" data-target="#app_dr" class="collapsed" aria-expanded="false"><span className=""> <i class="zmdi zmdi-layers mr-20"></i> Website Content <i class="zmdi zmdi-chevron-down zmdi-hc-fw mr-20" style={{ float: "right", marginTop: "3px" }}></i></span></a>



                        <ul id="app_dr" class="collapse collapse-level-1" aria-expanded="false">

                            <li className="">
                                <Link to={`${config.baseUrl}faqs`} class="dropdown-item waves-light waves-effect">

                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-list-bulleted mr-20"></i></span>
                                    <span className="pcoded-mtext">FAQ's</span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>

                            </li>

                            <li className="">
                                <Link to={`${config.baseUrl}privacyAndPolicy`} class="dropdown-item waves-light waves-effect">

                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-list-bulleted mr-20"></i></span>
                                    <span className="pcoded-mtext">  Privacy Policy</span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>

                            </li>

                            <li className="">
                                <Link to={`${config.baseUrl}termsAndCondition`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-format-indent-increase mr-20"></i></span>
                                    <span className="pcoded-mtext">  Terms & condition</span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>
                            </li>

                            <li className="">
                                <Link to={`${config.baseUrl}about`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> About</span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>
                            </li>

                            <li className="">
                                <Link to={`${config.baseUrl}bannerImage`} class="dropdown-item waves-light waves-effect">
                                    <span className="pcoded-micon"><i class="zmdi zmdi-spinner mr-20"></i></span>
                                    <span className="pcoded-mtext"> Banner Image </span>
                                    <span className="pcoded-mcaret"></span>
                                </Link>
                            </li>
                        </ul>

                    </li>
                    {/* <li>
                    <Link to={`${config.baseUrl}royalty`}><div className="pull-left"><i className="zmdi zmdi-balance-wallet mr-20"></i><span className="right-nav-text">Royalty Setting</span></div><div className="pull-right"><i ></i></div><div className="clearfix"></div></Link>

					</li> */}
                </ul>
           
                 </div>
            </div>
                
                
                
            {/* }}</FirstName.Consumer> */}
            
            </>

        )

    }
}