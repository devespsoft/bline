import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import axios from 'axios'
import config from '../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Cookies from 'js-cookie';

export default class categorylist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            category_list: [],
            name: '',
            nft_type_id: '',
            getNftType_list: [],
            update_id: '',
            getCategoryData: ''
        };
        this.deleteCategory = this.deleteCategory.bind(this);
      
        this.onChange = this.nftUserDetail.bind(this)
        this.updateNftUser = this.updateNftUser.bind(this)


    }

    componentDidMount() {
        this.categoryList();
        this.getNftTypeList()
    }


    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getcategory`,
                data: {}
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.response
                        })


                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }


    //==============================================  getnft type  =====================================

    async getNftTypeList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getNftType`,
                data: {}
            })

                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            getNftType_list: result.data.response
                        })


                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }


    nftUserDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getCategoryData: { ...prevState.getCategoryData, [event.target.name]: value }
        }))
    }


    async editCategory(id) {


        await
            axios({
                method: 'post',
                url: `${config.apiUrl}singlecategory`,
                data: { id: id.id }
            })


                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            getCategoryData: result.data.response
                        })


                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }

    async deleteCategory(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Games Category..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deletecategory`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, id: id.id }
                        })
                           
                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.categoryList()
                            }).catch(err => {
                                toast.error(err.response.data?.msg, {
                                    position: toast.POSITION.TOP_CENTER,

                                }, setTimeout(() => {

                                }, 500));
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    async updateNftUser(e) {
        e.preventDefault()
        this.state.getCategoryData.email = this.loginData?.data.user_email
        await axios({
            method: 'post',
            url: `${config.apiUrl}updatecategory`,
            data: this.state.getCategoryData
        }).then(response => {
            if (response.data.success === true) {
                toast.success(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
                window.location.reload()
            }
            else if (response.data.success === false) {
                toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
            .catch(err => {
                toast.error(err?.response?.data?.msg, {
                    position: toast.POSITION.TOP_CENTER
                });

            })
    }


    handleChange = e => {

        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        axios({
            method: 'post',
            url: `${config.apiUrl}insertcategory`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, 'name': this.state.name, 'nft_type_id': this.state.nft_type_id }
        })
            .then(result => {

                if (result.data.success === true) {
                    toast.success('Add Games Category!', {
                        position: toast.POSITION.TOP_CENTER,
                    }, setTimeout(() => {
                       
                    },));
                    this.categoryList();
                    this.setstate({
                        name: ''
                    })
                   

                }
            }).catch((error) => {
                toast.error(error.data?.msg, {
                    position: toast.POSITION.TOP_CENTER,

                }, setTimeout(() => {

                }, 500));

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

                    <div className="fixed-sidebar-right">
                        <ul className="right-sidebar">
                            <li>
                                <div className="tab-struct custom-tab-1">
                              
                                    <div className="tab-content" id="right_sidebar_content">
                                        <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                            <div className="chat-cmplt-wrap">
                                                <div className="chat-box-wrap">
                                                   
                                                    <div id="chat_list_scroll">
                                                        <div className="nicescroll-bar">
                                                            <ul className="chat-list-wrap">
                                                                <li className="chat-list">
                                                                    
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="recent-chat-box-wrap">
                                                    <div className="recent-chat-wrap">
                                                        
                                                        <div className="panel-wrapper collapse in">
                                                            <div className="panel-body pa-0">
                                                                <div className="chat-content">
                                                                    <ul className="nicescroll-bar pt-20">
                                                                       
                                                                    </ul>
                                                                </div>
                                                              
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="messages_tab" className="tab-pane fade" role="tabpanel">
                                            <div className="message-box-wrap">
                                               
                                                <div className="set-height-wrap">
                                                   
                                                </div>
                                            </div>
                                        </div>
                                        <div id="todo_tab" className="tab-pane fade" role="tabpanel">
                                            <div className="todo-box-wrap">
                                               
                                                <div className="set-height-wrap">
                                                 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="right-sidebar-backdrop"></div>

                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Games Category</h5>
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

                                                            <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary">Add Games Category </button>

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                    <div class="table-responsive">
                                                        <table class="table table-striped mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Name</th>
                                                                    <th>Action</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.category_list.map(item => (
                                                                    <tr>

                                                                        <td>{item.id}</td>
                                                                        <td>{item.name}</td>
                                                                        <td class="text-nowrap">
                                                                            <button type="submit" data-toggle="modal" onClick={this.editCategory.bind(this, item)} data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;&nbsp;
                                                                            <button className=" btn-danger" onClick={this.deleteCategory.bind(this, item)} data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>

                                                                    </tr>
                                                                ))}

                                                            </tbody>
                                                        </table>
                                                    </div>

                                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                          
                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <form>

                                                <div>
                                                   


                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Games Category Name</label>
                                                        <input type="text" id="firstName" onChange={this.handleChange} name="name" className="form-control" placeholder="Games Category Name" value={this.state.name} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            <button type='submit' onClick={this.handleSubmit} data-dismiss="modal" className="btn btn-primary">Add </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <form>

                                                <div>
                                                    <div className="form-group mb-0">
                                                       
                                                    </div>


                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category Name</label>
                                                        <input type="text" id="firstName" onChange={this.nftUserDetail} name="name" className="form-control" placeholder="Category Name" value={this.state.getCategoryData?.name} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            <button type='submit' onClick={this.updateNftUser} className="btn btn-primary">Update </button>
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
