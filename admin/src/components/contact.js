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




export default class contact extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            name: '',
            message: '',
            comments: '',
            contact_list: '',
            index: 0,


        };
        // this.loginData = (!Cookies.get('loginSuccessInfinityAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
        // this.onChange = this.onChange.bind(this);

        this.columns = [

            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "name",
                text: "name",
                sortable: true
            },
            {
                key: "email",
                text: "email",
                sortable: true
            },
            {
                key: "message",
                text: "Message",
                sortable: true
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

        this.contactList();
    }

    async contactList() {
        await axios.get(`${config.apiUrl}getContact`, {},)
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        contact_list: result.data.response
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
                <ToastContainer />
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">
                    <Header />
                    <Leftsidebar />
                    <div className="right-sidebar-backdrop"></div>
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">Contact Us</h5>
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

                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="form-wrap">
                                                    <div class="table-responsive">
                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.contact_list}
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
