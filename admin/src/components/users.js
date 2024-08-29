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
// import ReactDatatable from 'react-datatable';




export default class userlist extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            user_id: '',
            user_list: [],
            data: [],
            index: 0,
            checkSelect: ''

        };
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        // this.onChange = this.onChange.bind(this);

        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },


            {
                key: "full_name",
                text: "Name",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.full_name === null || item.full_name === 'null' || item.full_name === 'unnamed'  ? 'N/A' : item.full_name}
                            </span>

                        </td>
                    )
                }
            },
            // {
            //     key: "full_name",
            //     text: "full name",
            //     sortable: true
            // },
            {
                key: "email",
                text: "email",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>
                                {item.email === null || item.email === 'null' ? 'N/A' : item.email}
                            </span>

                        </td>
                    )
                }            },

            {
                key: "address",
                text: "Address",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <span>

                            </span>
                            <>
                                <a style={{ cursor: 'pointer' }} onClick={e => window.open(`https:/ropsten.etherscan.io/address/${item.address}`)} target="_blank" >
                                    <p title={item.address}>{item.address == null ? '' : item.address.toString().substring(0, 8) + '...' + item.address.toString().substr(item.address.length - 8)}</p>
                                </a>

                            </>
                        </td>
                    )
                }
            },

            {
                key: "Action",
                text: "Action",
                cell: (item) => {
                    return (
                        <>

                            {/* {item.is_active == 0 ? <button type="submit" onClick={this.deleteUser.bind(this, item)} data-toggle="tooltip" data-target="#responsive-modal1" data-original-title="Close" className=" btn-danger"> <i class="fa fa-minus-square m-r-10"></i> </button>
                                : <button type="submit" onClick={this.deleteUser.bind(this, item)} data-toggle="tooltip" data-target="#responsive-modal1" data-original-title="Close" className=" btn-danger"> <i class="fa fa-plus-square m-r-10"></i> </button>
                            } */}

                            <Link to={`${config.baseUrl}userDetail/${item.id}`} data-toggle="tooltip" data-original-title="" style={{ margin: "5px" }} >
                                <button type='button' className="btn-info" ><i class="fa fa-eye"></i> </button>

                            </Link>

                        </>
                    );
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



    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.userList();
    }



    checkData(id) {


        if (id.is_featured === 0) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to Feature creator this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
                            axios({
                                method: 'post',
                                url: `${config.apiUrl}addFeatured`,
                                headers: { "Authorization": this.loginData?.Token },
                                data: { 'email': id.email, 'user_id': id.id, 'is_admin': this.loginData.data.is_admin }
                            })
                                // axios.post(`${config.apiUrl}addFeatured`, { 'user_id': id.id })
                                .then((res) => {
                                    toast.success(res.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.componentDidMount()
                                }).catch((error) => {
                                    toast.danger(error.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                })
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
        else if (id.is_featured === 1) {
            confirmAlert({
                title: 'Confirm to submit',
                message: 'Are you sure to remove Feature creator this.',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () =>
                            axios({
                                method: 'post',
                                url: `${config.apiUrl}removeFeatured`,
                                headers: { "Authorization": this.loginData?.Token },
                                data: { 'email': id.email, 'user_id': id.id, 'is_admin': this.loginData.data.is_admin }
                            })
                                .then((res) => {
                                    toast.success(res.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.componentDidMount()
                                }).catch((error) => {
                                    toast.danger(error.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                })
                    },
                    {
                        label: 'No',
                    }
                ]
            });
        }
    }


    async userList() {

        await axios.get(`${config.apiUrl}getuser`, {},)
            .then(result => {
                const data = result.data;
                console.log('result', result)
                // const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)


                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response.filter(item => item.is_admin !== 1),
                        // pageCount: Math.ceil(data.length / this.state.perPage),

                    })

                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }
    async userList() {

        await axios.get(`${config.apiUrl}getuser`, {},)
            .then(result => {
                const data = result.data;
                console.log('result', result)
                // const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)


                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response,
                        // pageCount: Math.ceil(data.length / this.state.perPage),

                    })

                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }



    updateApprovedAPI = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to approve him.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}updateTelentForApproved`,
                            data: { 'email': id.email, 'user_id': id.id, 'is_admin': this.loginData.data.is_admin }
                        })
                            .then((res) => {
                                toast.success(res.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount()
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    updateRejectAPI = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to reject him.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}updateTelentForReject`,
                            data: { 'email': id.email, 'user_id': id.id, 'is_admin': this.loginData.data.is_admin }
                        })

                            .then((res) => {
                                toast.success(res.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount()
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    async deleteUser(id) {
        console.log(this.loginData)
        confirmAlert({
            title: 'Confirm to submit',
            message: `Are you sure to ${id.is_active == 0 ? 'Deactive' : 'Active'} this User?`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteuser`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, id: id.id, status: id.is_active == 0 ? 1 : 0, 'is_admin': this.loginData.data.is_admin }
                        })
                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.userList();
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    updateDeactiveAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to Active the user.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}userInativate`, { 'id': id.id, 'is_admin': this.loginData.data.is_admin })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.componentDidMount();

                                }

                                else if (result.data.success === false) {

                                }
                            })

                            .catch(err => {
                            })
                },
                {

                    label: 'No',
                }
            ]
        });
    }
    updateActivateAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to Inactive the user .',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}/userActive`, { 'id': id.id, 'is_admin': this.loginData.data.is_admin })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });

                                    this.componentDidMount();

                                }

                                else if (result.data.success === false) {

                                }
                            })

                            .catch(err => {
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }





    render() {

        return (

            <>


                <ToastContainer />

                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            {/* <!-- Title --> */}
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Users Details</h5>
                                </div>

                            </div>
                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>about Product</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.handleChange1} name="item_name" className="form-control" placeholder="Item Name" value={this.state.item_name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description" value={this.state.description} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Image</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Owner</label>
                                                                <input type="text" onChange={this.handleChange1} name="owner" className="form-control" placeholder="Owner Name" value={this.state.owner} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">

                                                                    <select name="item_category_id" class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {/* {this.state.category_list.map(item=>(
                                       <option value={item.id}>{item.name}</option>
                                          ))} */}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Price</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Sell Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} value={this.state.sell_type} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Price</option>
                                                                        <option value="2">Auction</option>

                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Edition Type</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="edition_type" onChange={this.handleChange1} value={this.state.edition_type} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Limited Edition</option>
                                                                        <option value="2">Open Edition</option>


                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Expiry Date</label>
                                                                <input type="date" onChange={this.handleChange1} className="form-control" name="expiry_date" value={this.state.expiry_date} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Quantity</label>
                                                                <input type="text" onChange={this.handleChange1}
                                                                    disabled={this.state.edition_type === '2'}
                                                                    name="quantity" className="form-control" placeholder="" value={this.state.quantity} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <label className="control-label mb-10">
                                                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.handleChange1} /> &nbsp;

                                                                click here to create Upcoming NFTs </label>

                                                        </div>
                                                        {(this.state.dateShow === 1) ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.handleChange1} className="form-control" name="start_date" value={this.state.start_date} />
                                                                    </div>
                                                                </div>

                                                            </>
                                                            : ''}


                                                    </div>

                                                    <div className="form-actions">
                                                        {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {/* <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button> */}

                                            <button type='submit' onClick={this.handleSubmit} data-dismiss="modal" className="btn btn-primary">Add </button>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="form-wrap">
                                                    <form action="#">

                                                        {/* <hr className="light-grey-hr" /> */}
                                                        <div className="row">

                                                        </div>



                                                        <div className="form-actions">

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">

                                                    <div class="table-responsive">
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.user_list}
                                                            columns={this.columns}
                                                        />

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
