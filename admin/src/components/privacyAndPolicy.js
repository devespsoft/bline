import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from  'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";



const headers = {
   'Content-Type': 'application/json'
};


export default class privacyAndPolicy extends Component {

    constructor(props) {
        super(props)
        this.state = {
            privacy_policy : '',
           

        }
        //  this.loginData = (!Cookies.get('loginSuccess'))? [] : JSON.parse(Cookies.get('loginSuccess'))
         this.onChange = this.onChange.bind(this);
         this.submitLandingForm = this.submitLandingForm.bind(this);
    }

/**
 * @property Jodit jodit instance of native Jodit
 */
 jodit;
 setRef = jodit => this.jodit = jodit;
 
 config = {
     readonly: false // all options from https://xdsoft.net/jodit/doc/
 }    

    onChange(e) {
        this.setState({
           [e.target.name]: e.target.value
        })

        this.setState(prevState => ({
            landingPage: { ...prevState.landingPage, [e.target.name]: e.target.value }
        }))

     }

    componentDidMount() {
        this.getPrivacyPolicy();
        
    }    

   async getPrivacyPolicy() {
    await axios({
        method: 'get',
        url: `${config.apiUrl}/getPrivacypolicy`
    })
        .then(response => {
            if (response.data.success === true) {
                // alert('333')
                this.setState({
                    landingPage: response.data.response[0]
                }) 
                
            }
        })
    }

   
    async submitLandingForm(e) {
        e.preventDefault()
        var data = {
            // private_key: this.state.private_key,
            // public_key: this.state.public_key
            privacy_policy: this.state.privacy_policy
            
        }
        await axios({
           method: 'post', 
           url: `${config.apiUrl}/updateprivacyAndPolicy`, data,
        
        })
           .then(result => {
               if (result.data.success === true) {
                 
                 toast.success(result.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                    });
                    // setTimeout(() =>{
                    //     window.location.reload()
                    // }, 2000)
             } 
     
               else if (result.data.success === false) {
                 toast.error(result.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                    });
          
             }
    
            }).catch(err => {
           console.log(err);
           
        });
     }

 updateContent = (value) => {
    this.setState({'privacy_policy':value})
}  
 
    render() {
// alert('ye')
        return (
            <>
                {/* <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div> */}
            {/* <p>asfsdfsd</p>   */}
                <ToastContainer/>
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    {/* <div className="right-sidebar-backdrop"></div> */}
                    <div className="page-wrapper"> 
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Privacy And Policy</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                            <div className="form-wrap">
                                                    <form>
                                                        <hr className="light-grey-hr" />
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                            
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Content</label>
                                                                    <JoditEditor
                                                                        editorRef={this.setRef} style={{color:'#000'}}
                                                                        value={this.state.landingPage?.privacy_policy}
                                                                        config={this.config}
                                                                        onChange={this.updateContent}
                                                                    />
                                                                </div>  


                                                             <div className="col-md-6">
                                                                <div className="form-group">
                                                                    <label className="control-label mb-10"></label>
                                                                    <button type="submit" onClick={this.submitLandingForm} className="btn btn-primary">Update</button>
                                                               </div> 
                                                            </div>
                                                        </div>
                                                        <div className="form-actions">
                                                            <div className="clearfix"></div>
                                                        </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        <Footer/>
                    </div>
                </div>
            </>
        )
    }
}

