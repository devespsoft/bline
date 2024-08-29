import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import config from '../config/config'
import Leftsidebar from '../directives/leftsidebar';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class faqs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            user_id: '',
            question: '',
            answer: '',
            faq_list: [],
            data: [],
            index: 0

        };
        this.faqDelete = this.faqDelete.bind(this);
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        this.handleChange1 = this.handleChange1.bind(this);


        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                sortable: true,
                cell: (row, index) => index + 1
            },
            {
                key: "question",
                text: "Question",
                sortable: true
            },
            {
                key: "answer",
                text: "Answer",
                sortable: true
            },

            {
                key: "user_status",
                text: "Action",
                sortable: true,
                cell: (item) => {
                    return (
                        <>
                            {/* <a class="btn btn-danger btn-sm" data-original-title="Close" data-toggle="tooltip"> */}
                            &nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-trash" style={{cursor:'pointer'}} onClick={this.faqDelete.bind(this, item)}>
                                </i>
                                {/* Delete */}
                            {/* </a> */}
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

        this.faqList();
    }

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })
    }

    //  ============================================Get FAQ List====================================     

    async faqList() {

        await axios.get(`${config.apiUrl}/faqlist`, {},)
            .then(result => {
                const data = result.data;
                console.log(result.data);
                if (result.data.success === true) {
                    this.setState({
                        faq_list: result.data.response,
                        pageCount: Math.ceil(data.length / this.state.perPage),

                    })
                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

    //  ============================================Delete FAQ ====================================         

    faqDelete(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Que and Ans!.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}/faqdelete`, { 'id': id.id })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {

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


    //  ============================================Add FAQ ====================================  

    handleSubmit = async (event) => {
        event.preventDefault();
        axios.post(`${config.apiUrl}/faqadd`, { 'question': this.state.question, 'answer': this.state.answer })
            .then(result => {
                toast.success(result.data.msg, {
                },
                );
                this.setState({
                    question: '',
                    answer: '',
                })
                this.faqList();
            }).catch(err => {
                toast.error(err.data?.msg, {
                }, setTimeout(() => {
                }, 500));
            });
    }








    render() {
        return (
            <>


<ToastContainer />

<div className="wrapper theme-6-active pimary-color-green">
    <Header />
    <Leftsidebar />

    <div className="page-wrapper">

        <div className="content container-fluid pt-25">

            <div className="row heading-bg">
                <div className="col-md-10">

                    <h3 className="page-title">Add Faqs</h3>
                </div>
                <div className="col-md-2">
                <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add </button>
                </div>
            </div>

            <div className="row">

                <div className="col-sm-12">

                    <div className="panel panel-default card-view">
                        <div className="panel-wrapper collapse in">

                            <div className="panel-body">

                                <div className="form-wrap">



                                    <div class="table-responsive">
                                    <ReactDatatable
                                            config={this.config}
                                            records={this.state.faq_list}
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


    </div>

    <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{ display: "none" }}>
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    {/* <div class="modal-header">
														<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
														<h5 class="modal-title">Modal Content is Responsive</h5>
													</div> */}
                                    <div class="modal-body">
                                        <form action="#">
                                            <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add Que and Ans</h6>
                                            <hr className="light-grey-hr" />
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Question</label>
                                                        <textarea type="text" onChange={this.handleChange1} name="question" className="form-control" placeholder="Type New Question" value={this.state.question} />
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Answer</label>
                                                        <textarea type="text" onChange={this.handleChange1} name="answer" className="form-control" placeholder="Type New Answer" value={this.state.answer}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-actions">
                                                {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                                <div className="clearfix"></div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer pt-0">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                        <button type='submit' onClick={this.handleSubmit} data-dismiss="modal" className="btn btn-primary">Add</button>

                                    </div>
                                </div>
                            </div>
                        </div>

    {/*end add dialog */}
</div>

               
              
                <Footer />

            </>
        )
    }
}