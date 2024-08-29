import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
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


export default class bannerImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            about: '',


        }
        //  this.loginData = (!Cookies.get('loginSuccessblineAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        this.onChange = this.onChange.bind(this);
        this.updateDataAPI = this.updateDataAPI.bind(this);
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
        this.getBanner();
        // alert('33')
        // if(!Cookies.get('loginSuccess')){
        //     window.location.href = `${config.baseUrl}`
        //     return false;
        //  }
    }

    async getBanner() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/getBanner`
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

    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        let file_type = '';
        if (image_as_files.type.indexOf('image') === 0) {
            file_type = 'image';
        } else {
            file_type = 'video';
        }

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
        })
    }


    async updateDataAPI(e) {
        e.preventDefault()
        let formData = new FormData();

        formData.append('id', this.state.landingPage.id)
        formData.append('image', this.state.image_file)

        formData.append('content', this.state.about)

        axios({
            method: 'post',
            url: `${config.apiUrl}updateBanner`,
            data: formData
        })


            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    },

                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                    );


                }
            }).catch(err => {

                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500

                }, setTimeout(() => {

                }, 500));

            })

    }

    updateContent = (value) => {
        this.setState({ 'about': value })
    }

    render() {
        // alert('ye')
        return (
            <>
                {/* <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div> */}
                {/* <p>asfsdfsd</p>   */}
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    {/* <div className="right-sidebar-backdrop"></div> */}
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Banner</h5>
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
                                                                    <label className="control-label mb-10">Banner Image</label>
                                                                    <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                                    <br/>
                                                                    <a href={config.imageUrl1 + this.state.landingPage?.image} target="_blank">
                                                                    <img src={config.imageUrl1 + this.state.landingPage?.image} style={{width:'100px',height:'100px'}}/></a>
                                                                </div>

                                                                <div className="form-group">
                                                                    <label className="control-label mb-10">Content</label>
                                                                    <JoditEditor
                                                                        editorRef={this.setRef} style={{ color: '#000' }}
                                                                        value={this.state.landingPage?.content}
                                                                        config={this.config}
                                                                        onChange={this.updateContent}
                                                                    />
                                                                </div>


                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10"></label>
                                                                        <button type="submit" onClick={this.updateDataAPI.bind(this)} className="btn btn-primary">Update</button>
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
                        <Footer />
                    </div>
                </div>
            </>
        )
    }
}

