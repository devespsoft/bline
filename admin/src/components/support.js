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
            category_names: [],
            // updateform: '',
            update_id: '',
            getCategoryData: ''
        };
        this.deleteCategory = this.deleteCategory.bind(this);
        this.onChange = this.nftUserDetail.bind(this)
        this.updateSupport = this.updateSupport.bind(this)

        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));

    }

    componentDidMount() {
        // if(!Cookies.get('loginSuccessInfinityAdmin')){
        //     window.location.href = `${config.baseUrl}`
        //     return false;
        //  }
        this.categoryList();
        this.categoryName();
    }


    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}supportList`,
                data: {}
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.data
                        })
                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }


    async categoryName() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getSupportCategory`,
                data: {}
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            category_names: result.data.data
                        })
                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }

    async editCategory(support_id) {
        await axios({
            method: 'post',
            url: `${config.apiUrl}supportListById`,
            // headers: { "Authorization": this.loginData.Token },
            data: { "email": this.loginData?.data.user_email, 'is_admin':this.loginData.data.is_admin,"support_id": support_id.support_id, "user_id": this.state.user_id }
        })
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        getCategoryData: result.data.data
                    })
                }
                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

    async deleteCategory(support_id) {

        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Category..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios.post(`${config.apiUrl}/deleteSupport`, { 'is_admin':this.loginData.data.is_admin,'support_id': support_id.support_id })

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


    nftUserDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getCategoryData: { ...prevState.getCategoryData, [event.target.name]: value }
        }))
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
            url: `${config.apiUrl}insertSupport`,
            // headers: { "Authorization": this.loginData?.Token },
            data: {'is_admin':this.loginData.data.is_admin, 'category_id': this.state.category_id, 'question': this.state.question, 'answer': this.state.answer }
        })
            .then(result => {

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        position: toast.POSITION.TOP_CENTER,
                    }, setTimeout(() => {
                        // window.location.reload();
                    }));
                    
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


    async updateSupport(e) {
        e.preventDefault()
        this.state.getCategoryData.email = this.loginData?.data.user_email
        await axios({
            method: 'post',
            url: `${config.apiUrl}updateSupport`,
            // headers: { "Authorization": this.loginData.Token },
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
                    <div className="right-sidebar-backdrop"></div>

                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Support</h5>
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
                                                            {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}

                                                            <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary">Add Category </button>

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
                                                                    <th>Category</th>
                                                                    <th>Question</th>
                                                                    <th>Answer</th>
                                                                    <th>Action</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.category_list.map(item => (
                                                                    <tr>

                                                                        <td>{item.support_id}</td>
                                                                        <td>{item.support_category}</td>
                                                                        <td>{item.question}</td>
                                                                        <td>{item.answer}</td>
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
                            {/* <!-- /Row --> */}
                            {/* //Edit Model */}
                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <form>

                                                <div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category</label>
                                                        <select name="category_id" onChange={this.handleChange} value={this.state.category_id} class="form-control  basic">
                                                            <option selected="selected" value="">Select Category</option>
                                                            {this.state.category_names.map(item => (
                                                                <option value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Question</label>
                                                        <input type="text" id="firstName" onChange={this.handleChange} name="question" className="form-control" placeholder="Question" value={this.state.question} />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Answer</label>
                                                        <input type="text" id="firstName" onChange={this.handleChange} name="answer" className="form-control" placeholder="Answer" value={this.state.answer} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            <button type='submit' disabled={!this.state.answer || !this.state.question || !this.state.category_id} onClick={this.handleSubmit} data-dismiss="modal" className="btn btn-primary">Add </button>
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
                                                        <label className="control-label mb-10">Category Type</label>

                                                    </div>

                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Category</label>
                                                        <select name="category_id" onChange={this.handleChange} value={this.state.getCategoryData?.category_id} class="form-control  basic">
                                                            <option selected="selected" value="">Select Category</option>
                                                            {this.state.category_names.map(item => (
                                                                <option value={item.id}>{item.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>


                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Question</label>
                                                        <input type="text" id="firstName" onChange={this.nftUserDetail} name="question" className="form-control" placeholder="Queston" value={this.state.getCategoryData?.question} />
                                                    </div>
                                                    <div className="form-group mb-0">
                                                        <label className="control-label mb-10">Answer</label>
                                                        <input type="text" id="firstName" onChange={this.nftUserDetail} name="answer" className="form-control" placeholder="Answer" value={this.state.getCategoryData?.answer} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            <button type='submit' onClick={this.updateSupport} className="btn btn-primary">Update </button>
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
