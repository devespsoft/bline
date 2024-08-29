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


export default class nft extends Component {

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
                key: "name",
                text: "Name",
                sortable: true
            },

            {
                key: "description",
                text: "Description",
                sortable: true
            },
            {
                key: "image",
                text: "image",
                cell: (item) => {
                    return (
                        <>
                            {item.image === null || item.image === '' || item.image === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl}${item.image}`} target="_blank">

                                    <img src={`${config.imageUrl}${item.image}`} className="product-img" />
                                </a>
                            }
                        </>
                    );
                }
            },
        
            {
                key: "start_date",
                text: "Start Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            {item.start_date.slice(0, 10)}
                        </td>
                    );
                }
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
        this.getUser();
        this.userItem();
        // this.userItem();
    }



    getUser = async e => {

        let data = {
            id: this.userid
        }

        await axios.post(`${config.apiUrl}userDetail`, data, { headers })
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        dob: result.data.response.dob,
                        phone: result.data.response.phone,
                        description: result.data.response.description,
                        googleAuthCode: result.data.response.googleAuthCode,

                    })


                }
            })
    }
    async userItem() {
        let data = {
            user_id: this.userid,
            login_user_id: 0,
            user_collection_id: 0,
            is_trending: 0,
            recent: 0,
            limit: 0
        }
        await axios.post(`${config.apiUrl}getUserItem`, data, { headers })
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

            <div className="theme-loader">
                <div className="loader-track">
                    <div className="preloader-wrapper">
                        <div className="spinner-layer spinner-blue">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>
                        <div className="spinner-layer spinner-red">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-yellow">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>

                        <div className="spinner-layer spinner-green">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <!-- Pre-loader end --> */}
            <div id="pcoded" className="pcoded">
                <div className="pcoded-overlay-box"></div>
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
                                <div className="pcoded-inner-content">
                                    {/* <!-- Main-body start --> */}
                                    <div className="main-body">
                                        <div className="page-wrapper">

                                            {/* <!-- Page body start --> */}
                                            <div className="page-body">
                                                <div className="row">

                                                    {/* ------------------ */}
                                                    <div className="col-md-1"></div>
                                                    <div className="col-md-10">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                {/* <h5>User Details</h5> */}

                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                    {/* ///////////////////////////////////////// */}
                                                    <div className="col-md-1"></div>
                                                </div>

                                            </div>
                                            {/* <!-- Page body end --> */}
                                        </div>
                                    </div>
                                </div>
                                <ul class="nav nav-tabs">
                                    <li ><a href={`${config.baseUrl}userDetail/${this.userid}`}>User Collection</a></li>
                                    <li ><a  href={`${config.baseUrl}userTransaction/${this.userid}`}>User Transaction</a></li>
                                    {/* <li class="active"><a data-toggle="tab">NFT's</a></li> */}
                                    <li class="active"><a  >NFT's</a></li>
                                </ul>
{/* 
                                <div class="tab-content">
                                    <div id="home" class="tab-pane fade in active">
                                        <h3>User transaction Details</h3>
                                        <p></p>
                                    </div>
                                    <div id="menu1" class="tab-pane fade">
                                        <h3>User Collection</h3>
                                        <p></p>
                                    </div>
                                    <div id="menu2" class="tab-pane fade">
                                        <h3>NFT's</h3>
                                        <p></p>
                                    </div>

                                </div> */}
                                <h3>NFT's</h3>
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
        </>
    )

}
}

