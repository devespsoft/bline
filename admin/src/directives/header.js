import React, { Component, createContext } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'
import config from '../config/config'
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// const FirstName = createContext()

export default class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            profile_pic: '',
            navBarStatus:1
        }

        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        console.log(this.loginData);


    }

    async getUserProfilePicAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}adminprofilepic`,
            headers: { "Authorization": this.loginData.message },
            data: { 'email': this.loginData.data.user_email, 'is_admin': this.loginData.data.is_admin }
        })
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        profile_pic: response.data.response
                    })
                    //  alert(JSON.stringify(this.state.profile_pic))

                }
            })
    }


    componentDidMount() {

        this.getUserProfilePicAPI();
    }


    logout() {
        Cookies.remove('loginSuccessInfinityAdmin')
    }


    navClick(id) {
        if(id === 1){
            this.setState({
                navBarStatus:0
            })
        }
        else if(id === 0){
            this.setState({
                navBarStatus:1
            })
        }
        localStorage.setItem('navBarStatus',this.state.navBarStatus)
    }


    render() {
        return (
            <>
            {/* <FirstName.Provider value={this.state.navBarStatus}>
                
            </FirstName.Provider> */}
             <div className="wrapper theme-6-active pimary-color-green ">
             <div className="sp-header">
                 <nav className="navbar navbar-inverse navbar-fixed-top">
                     <ToastContainer />
                     <>
                 
                     </>
                     <div className="mobile-only-brand pull-left">
                         <div className="nav-header pull-left">
                             <div className="logo-wrap">
                                 <a href={`${config.baseUrl}dashboard`}>
                                     <img className="brand-img" src="images/bline.png" alt="brand" style={{ width: "135px" }} />
                                     <span className="brand-text"></span>
                                 </a>
                             </div>
                         </div>
                         {/* <i className="fa fa-bars scrollable" aria-hidden="true" style={{ cursor: 'pointer' }} onClick={this.navClick.bind(this,this.state.navBarStatus)}></i> */}

                         <a id="mobileMenuBtn" className="toggle-left-nav-btn hidden-lg hidden-md  ml-20 pull-left1" href="javascript:void(0);"><i className="zmdi zmdi-menu"></i></a>
                         {/* <a id="toggle_mobile_search" data-toggle="collapse" data-target="#search_form" className="mobile-only-view" href="javascript:void(0);"><i className="zmdi zmdi-search"></i></a> */}
                         <a id="toggle_mobile_nav" className="mobile-only-view" href="javascript:void(0);"><i className="zmdi zmdi-more"></i></a>


                     </div>
                     <div id="mobile_only_nav" className="mobile-only-nav pull-right">
                         <ul className="nav navbar-right top-nav pull-right">

                             <li className="dropdown auth-drp">
                                 <a href="#" className="dropdown-toggle pr-0" data-toggle="dropdown"><img src={`${config.imageUrl1}/${this.state.profile_pic.profile_pic}`} alt="user_auth" className="user-auth-img img-circle" /><span className="user-online-status"></span></a>
                                 <ul className="dropdown-menu user-auth-dropdown" data-dropdown-in="flipInX" data-dropdown-out="flipOutX">

                                     <li>
                                         <a href={`${config.baseUrl}changeprofile`}  ><i className="zmdi zmdi-account-o "></i>
                                             <span>Edit Profile Pic</span></a>
                                     </li>

                                     <li>
                                         <a href={`${config.baseUrl}changepassword`}  ><i className="zmdi zmdi-key"></i>
                                             <span>Change Password</span></a>
                                     </li>


                                     <li>
                                         <a href={`${config.baseUrl}`} onClick={this.logout.bind(this)}><i className="zmdi zmdi-power"></i>
                                             <span>Log Out</span></a>
                                     </li>
                                 </ul>
                             </li>
                         </ul>

                         {/* 
             <div className="bottomLinksOption clr">
                     <div>

                        <div className="modal fade" id="reset-password-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                           <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                 <div className="modal-body">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                    <h5 className="modal-title">Reset Your Password</h5>
                                    <p></p>
                                    <form>
                                       <div className="input_row"><span className="reveal_pass">Old Password</span><input className="form-control input-lg" type="password" placeholder="Old Password" onChange={this.handleChange1} name="currentPassword" id="old_password" value={this.state.currentPassword}/></div>
                                       <div className="input_row"><span className="reveal_pass">New Password</span><input className="form-control input-lg" type="password" placeholder="New Password" onChange={this.handleChange1} name="password" id="new_password" value={this.state.password}/></div>
                                       <div className="input_row"><span className="reveal_pass">Confirm New Password</span><input className="form-control input-lg" type="password" placeholder="Confirm New Password" onChange={this.handleChange1} id="confirm_new_password" name="password2" value={this.state.password2}/></div>
                                       <div className="form-group last-child"><button type="button" onClick={this.changePasswordAPI} className="btn mt-3 btn-primary custom-btn gradient md" style={{width:"100"}}><span>Update Password</span></button></div>         
                                   </form>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                         </div> */}

                         {/* Edit Profile  */}
                     </div>
                 </nav>
             </div>
         </div>
         </>
        )

    }
}
