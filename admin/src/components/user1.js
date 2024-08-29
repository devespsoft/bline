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


export default class userDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dob: '',
            phone: '',
            description: '',
            googleAuthCode: '',
            user_list: []

        }
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },

            {
                key: "dob",
                text: "Date of Birth",
                sortable: true
            },

            {
                key: "phone",
                text: "Phone",
                sortable: true
            },
            {
                key: "description",
                text: "Description",
                sortable: true
            },
            {
                key: "googleAuthCode",
                text: "Google Auth Code",
                sortable: true
            },
           

        ]
        const { match: { params } } = this.props;
        this.userid = params.id

        // this.loginData = JSON.parse(!Cookies.get('loginSuccess') ? null : Cookies.get('loginSuccess'));
        this.onChange = this.onChange.bind(this)
        this.updateUser = this.updateUser.bind(this)
        // this.UpdateCoin = this.updateCoin.bind(this)
    }

    componentDidMount() {
        this.userDetail();
        // this.userCollection();
        // this.userItem();
    }



   
    async userDetail() {
        let data = {
            user_id: this.userid
        }
        await axios.post(`${config.apiUrl}userDetail`, data, { headers })
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


 
onChange = event => {
    event.preventDefault()
    let value = event.target.value;
    this.setState(prevState => ({
        user_list: { ...prevState.user_list, [event.target.name]: value }
    }))
}
//     async updateCoin(e) {
//     e.preventDefault()

//     console.log(this.state.user_list);
//     axios.post(`${config.apiUrl}updateSingleCoin`, this.state.user_list, { headers })
//         .then(response => {


//             if (response.data.success === true) {
//                 toast.success('Update Coin Detail Successfully', {




//                     position: toast.POSITION.TOP_CENTER
//                 });
//                 // setTimeout(() => {
//                 //     window.location.href = `${config.baseUrl}users`

//                 // }, 2000);
//             }

//             else if (response.data.success === false) {
//                 toast.error(response.data.msg, {
//                     position: toast.POSITION.TOP_CENTER
//                 });


//             }
//         })

//         .catch(err => {
//             toast.error(err.response.data?.msg, {
//                 position: toast.POSITION.TOP_CENTER
//             });

//         })
// }

    //================================================  Update User API integrate  =============

    async updateUser(e) {
    e.preventDefault()

    console.log(this.state.user_list);
    axios.post(`${config.apiUrl}adminUpdateUserById`, this.state.user_list, { headers })
        .then(response => {


            if (response.data.success === true) {
                toast.success('update User Successfully', {




                    position: toast.POSITION.TOP_CENTER
                });
                // setTimeout(() => {
                //     window.location.href = `${config.baseUrl}users`

                // }, 2000);
            }

            else if (response.data.success === false) {
                toast.error(response.data.msg, {
                    position: toast.POSITION.TOP_CENTER
                });


            }
        })

        .catch(err => {
            toast.error(err.response.data?.msg, {
                position: toast.POSITION.TOP_CENTER
            });

        })
}





render() {
    console.log(this.state.user_list)
    return (
        <>

          
            {/* <!-- Pre-loader end --> */}
            <div id="pcoded" className="pcoded">
                {/* <div className="pcoded-overlay-box"></div> */}
                <div className="pcoded-container navbar-wrapper">
                    <Header />
                    <div className="pcoded-main-container">
                        <div className="pcoded-wrapper">
                            <Leftsidebar />
                            <div className="page-wrapper nft-user">
                                {/* <!-- Page-header start --> */}
                                <div className="page-header">
                                    <div className="page-block">
                                        <div className="row align-items-center">
                                            <div className="col-md-8">
                                                <div className="page-header-title">
                                                    <h5 className="m-b-10">User Details</h5>
                                                    <p className="m-b-0">Nxft</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <ul className="breadcrumb">
                                                    <li className="breadcrumb-item">
                                                        <a href="#/"> <i className="fa fa-home"></i> </a>
                                                    </li>
                                                    <li className="breadcrumb-item"><a href={`${config.baseUrl}dashboard`}>Dashboard</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- Page-header end --> */}
                                {/* <div className="pcoded-inner-content">
                                    {/* <!-- Main-body start --> */}
                                    {/* <div className="main-body">
                                        <div className="page-wrapper"> */}

                                            {/* <!-- Page body start --> */}
                                            {/* <div className="page-body">
                                                <div className="row"> */}

                                                    {/* ------------------ */}
                                                    {/* <div className="col-md-1"></div>
                                                    <div className="col-md-10">
                                                        <div className="card">
                                                            <div className="card-header"> */}
                                                                {/* <h5>User Details</h5> */}

                                                            {/* </div> */}
                                                            {/* <div className="card-block">
                                                                <form className="form-material" >
                                                                    <ToastContainer />
                                                                    <div class="row"></div>

                                                                    <label className="float-label">DOB</label>
                                                                    <div className="form-group form-default form-static-label">
                                                                        <input type="text" name="dob" placeholder="DOB" value={this.state.dob} onChange={this.onChange} className="form-control" />
                                                                        <span className="form-bar"></span>

                                                                    </div>

                                                                    <label className="float-label">Contact Number</label>
                                                                    <div className="form-group form-default form-static-label">
                                                                        <input type="text" name="phone" placeholder="Contact Number" value={this.state.phone} onChange={this.onChange} className="form-control" />
                                                                        <span className="form-bar"></span>

                                                                    </div>

                                                                    <label className="float-label">Description</label>
                                                                    <div className="form-group form-default form-static-label">
                                                                        <input type="text" name="description" placeholder="Description" value={this.state.description} onChange={this.onChange} className="form-control" />
                                                                        <span className="form-bar"></span>

                                                                    </div>


                                                                    <label className="float-label">Google Auth</label>
                                                                    <div className="form-group form-default form-static-label">
                                                                        <input type="text" name="googleAuthCode" placeholder="Google Auth" value={this.state.googleAuthCode} onChange={this.onChange} className="form-control" />
                                                                        <span className="form-bar"></span>

                                                                    </div> */}

                                                                    {/* <div className="">
                                                                            <button type="submit" onClick={this.updateCoin.bind(this)} className="btn btn-primary update_btn">Update</button>&nbsp;
                                                                        </div> */}

                                                                {/* </form> */}
                                                            {/* </div>
                                                        </div>
                                                    </div> */}
                                                    {/* ///////////////////////////////////////// */}
                                                    {/* <div className="col-md-1"></div>
                                                </div> */}

                                            {/* </div> */}
                                            {/* <!-- Page body end --> */}
                                        {/* </div> */}
                                    {/* </div>
                                </div> */} *
                                <ul class="nav nav-tabs">
                                <li ><a href={`${config.baseUrl}userDetail/${this.userid}`}>User Collection</a></li>
                                    <li class="active"><a >User Details</a></li>
                                    <li><a href={`${config.baseUrl}userTransaction/${this.userid}`}>User Transaction</a></li>
                                    <li><a  href={`${config.baseUrl}nft/${this.userid}`}>NFT's</a></li>

                                </ul>

                                <div class="tab-content">
                                <div id="home" class="tab-pane fade in active">
                                        <h3>Users Details</h3>
                                        <p></p>
                                    </div>
                                    <div id="home" class="tab-pane fade in active">
                                        <h3>User Collection</h3>
                                        <p></p>
                                    </div>
                                    <div id="menu1" class="tab-pane fade">
                                        <h3>User Transaction</h3>
                                        <p></p>
                                    </div>
                                    <div id="menu2" class="tab-pane fade">
                                        <h3>NFT's</h3>
                                        <p></p>
                                    </div>

                                </div>
                                <div class="table-responsive">
                                    {/* <table class="table table-striped mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>User Name</th>
                                                                    <th>Full Name</th>

                                                                    <th>Email</th>
                                                                    <th>Email Verify</th>
                                                                    <th>Talent Status</th>
                                                                    <th>Talent Action</th>
                                                                    <th>Action</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {this.state.user_list.map(item => (
                                                                    <tr>

                                                                        <td>{item.id}</td>
                                                                        <td>{item.user_name}</td>
                                                                        <td>{item.your_name}</td>

                                                                        <td>{item.email}</td>
                                                                        <td>{(item.is_email_verify === 0) ? 'Not Verified' : "Verified"}</td>
                                                                        <td class="text-nowrap">

                                                                            {item.telent_status === 0 ? <span style={{ color: 'yellow' }}>Pending</span> :
                                                                                item.telent_status === 1 ? <span style={{ color: 'green' }}>Approve</span> :
                                                                                    <span style={{ color: 'red' }}>Reject</span>}
                                

                                                                        </td>


                                                                        <td class="text-nowrap">
                                                                       
                                                                        {item.telent_status === 0 ? 
                                                                        <>
                                                                      
                                                                            <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>&nbsp;&nbsp;
                                                                            <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Approve </button> 
                                                                 </>
                                                                 
                                                                            :item.telent_status === 1 ?
                                                                            <button type="submit" className=" btn-danger" onClick={this.updateRejectAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Reject </button>:
                                                                 <button type="submit" className=" btn-success" onClick={this.updateApprovedAPI.bind(this, item)} data-toggle="tooltip" data-original-title=""> Approve </button> 


                                                                        }
                                                                        
                                                                    
        
                                                             </td>

                                                                        <td class="text-nowrap"><button className=" btn-danger" onClick={this.deleteUser.bind(this, item)} data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>
                                                                        
                                                                    </tr>
                                                                ))}
                                                               
                                                                
                                                              
                                                                </tbody>
                                                        </table> */}

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
        </>
    )

}
}

