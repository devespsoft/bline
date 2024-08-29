import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default class usercollection extends Component {


    constructor(props) {
        super(props)
        this.state = {

            name: '',
            description: '',
            datetime: '',
            description: '',
            profile_pic: '',
            banner: '',

            user_list: [],


        };
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'));
        //  this.updateTelentForApproved = this.updateTelentForApproved.bind(this);
        //  this.updateTelentForReject = this.updateTelentForReject.bind(this);
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },
            {
                key: "name",
                text: "Name",
                sortable: true,
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">
                            <a target="_blank" href={`${config.redirectUrl}collections/${item.id}`}>{item.name}</a>
                            
                        </td>
                    );
                }
            },


            // {
            //     key: "description",
            //     text: "Description",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <td nowrap="nowrap">
            //                 <span>
            //                     <p title={item.description}> {item.description.toString().substring(0, 50) + '...'}</p>
            //                 </span>
            //             </td>
            //         )
            //     }
            // },
            {
                key: "datetime",
                text: "Date",
                cell: (item) => {
                    return (
                        <td nowrap="nowrap">

                            {item.datetime.slice(0, 10)}
                        </td>
                    );
                }
            },

            {
                key: "profile_pic",
                text: "image",
                cell: (item) => {
                    return (
                        <>
                            {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl1}${item.profile_pic}`} target="_blank">
                                    <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />
                                </a>
                            }
                        </>
                    );
                }
            },
            {
                key: "banner",
                text: "Banner",
                cell: (item) => {
                    return (
                        <>
                            {item.banner === null || item.banner === '' || item.banner === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl1}${item.banner}`} target="_blank">

                                    <img src={`${config.imageUrl1}${item.banner}`} className="product-img" />
                                </a>
                            }
                        </>
                    );
                }
            },
            {
                key: "is_featured",
                text: "Trending",
                sortable: true,
                cell: (item) => {
                    return (
                        <>

                            <input type='checkbox' checked={item.is_featured === 0 ? '' : 'checked'} onClick={this.updateItemFeature.bind(this, item.id, item.is_featured)} />
                        </>
                    )
                }

            },
            // {
            //     key: "is_verified",
            //     text: "Verified Tag",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <>

            //                 <input type='checkbox' checked={item.is_verified === 0 ? '' : 'checked'} onClick={this.updateUserCollectionTag.bind(this, item.id, item.is_verified)} />
            //             </>
            //         )
            //     }

            // },
            {
                key: "website",
                text: "Social Links",
                cell: (item) => {
                    return (
                        <>
                            <p className='circle-icon'>{item?.facebook === '' && item?.insta === '' && item?.telegram === '' && item?.twitter === '' && item?.discord === '' ? 'N/A' :

                                item?.facebook ? <a href={item?.facebook} target="_blank"> <i className="fa fa-facebook" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.instagram ? <a href={item?.instagram} target="_blank"> <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.telegram ? <a href={item?.telegram} target="_blank"> <i className="fa fa-telegram" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.twitter ? <a href={item?.twitter} target="_blank"> <i className="fa fa-twitter" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.discord ? <a href={item?.discord} target="_blank">
                                    <span className="discord-img"><img src="images/discord.png" /></span></a> : ''}
                            </p>
                        </>
                    );
                }
            },

            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            {/* <button type="submit" className=" btn-danger" onClick={this.deleteUserCollectionAPI.bind(this, item)} data-original-title=""> <i class="fa fa-trash" aria-hidden="true"></i></button> */}
                            {item.is_hide == 1 ?
                                <button type="submit" onClick={this.showCollectionAPI.bind(this, item)} title="Show Collections" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-plus-square m-r-10"></i> </button> :

                                <button type="submit" onClick={this.hideCollectionAPI.bind(this, item)} title="Hide Collections" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-minus-square m-r-10"></i> </button>

                            }
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
        this.userCollection();
        // this.addUserCollectionFeatured();

    }

    async userCollection() {
        await axios.get(`${config.apiUrl}getAllCollection`, {},)
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        user_list: result.data.response
                    })


                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }




    deleteItem = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Collection.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteUserCollection`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, collection_id: id.collection_id, 'is_admin': this.loginData.data.is_admin }
                        })

                            .then(result => {
                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.componentDidMount()
                                }

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

    deleteUserCollectionAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Collection',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}deleteUserCollection`, { 'collection_id': id.id, 'is_admin': this.loginData.data.is_admin })
                            .then(result => {

                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });

                                    this.componentDidMount();

                                }

                                else if (result.data.success === false) {
                                    toast.error(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });

                                    this.componentDidMount();
                                }
                            })

                            .catch(err => {
                                toast.error(err.response.data?.msg, {
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


    hideCollectionAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide Collection..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideCollection`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'id': id.id, 'is_admin': this.loginData.data.is_admin }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                // toast.danger(error.data?.msg, {
                                //     position: toast.POSITION.TOP_CENTER
                                // });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    showCollectionAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show collection..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showCollection`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'id': id.id, 'is_admin': this.loginData.data.is_admin }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                // toast.danger(error.data.msg, {
                                //     position: toast.POSITION.TOP_CENTER
                                // });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    async updateItemFeature(user_id, featured) {
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserCollectionFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: user_id, 'is_admin': this.loginData.data.is_admin, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {
                if (result.data.success === true) {
                    if (featured == 0) {
                        toast.success('Add in trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Remove from trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.userCollection();
                }
            }).catch(err => {
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500
                }, setTimeout(() => {
                }, 500));
            })
    }

    async updateUserCollectionTag(id, verified) {
        console.log('id', verified)
        axios({
            method: 'post',
            url: `${config.apiUrl}userCollectionVerifiedTag`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, 'is_admin': this.loginData.data.is_admin, is_verified: verified === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (verified == 0) {
                        toast.success('Added in trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (verified == 1) {
                        toast.error('Removed from trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }

                    this.userCollection();

                }
            }).catch(err => {
                toast.error(err.response.data?.msg, {
                    position: toast.POSITION.TOP_CENTER, autoClose: 1500
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
                {/* <!--/Preloader--> */}
                <div className="wrapper theme-6-active pimary-color-green">


                    <Header />

                    <Leftsidebar />

                    <div className="setting-panel">
                        <ul className="right-sidebar nicescroll-bar pa-0">

                        </ul>
                    </div>



                    <div className="right-sidebar-backdrop"></div>

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">

                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">User Collection</h5>
                                </div>

                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="table-responsive">

                                        <ReactDatatable
                                            config={this.config}
                                            records={this.state.user_list}
                                            columns={this.columns}
                                        />
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
