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

            description: '',
            datetime: '',
            description: '',
            profile_pic: '',
            banner: '',

            user_list: [],
            name: '',
            profileData: '',
            image_file: '',
            image_preview: '',
            banner_preview: '',
            image_file1: null,
            games_category: 'text',
            image_preview1: '',
            facebook: "",
            insta: "",
            twitter: "",
            pinterest: "",
            website: "",
            youtube: "",
            discord: "",
            loader: '',
            policy_id: '',
            policy_type: '0',
            description: '',
            gamesResponse: []

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
                sortable: true
            },


            {
                key: "description",
                text: "Description",
                sortable: true
            },
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
                                <a href={`${config.imageUrl1}${item.banner}`} target="_balnk">
                                    <img src={`${config.imageUrl1}${item.banner}`} className="product-img" />
                                </a>
                            }
                        </>
                    );
                }
            },
            {
                key: "is_featured",
                text: "Featured",
                sortable: true,
                cell: (item) => {
                    return (
                        <>

                            <input type='checkbox' checked={item.is_featured === 0 ? '' : 'checked'} onClick={this.updateAdminFeature.bind(this, item.id, item.is_featured)} />
                        </>
                    )
                }

            },
            {
                key: "website",
                text: "Social Links",
                cell: (item) => {
                    return (
                        <>
                            <p>{item?.facebook === '' && item?.insta === '' && item?.telegram === '' && item?.twitter === '' && item?.discord === '' ? 'N/A' :

                                item?.facebook ? <a href={item?.facebook} target="_blank"> <i className="fa fa-facebook-square" aria-hidden="true"></i>&nbsp;</a> : ''}
                                {item?.insta ? <a href={item?.insta} target="_blank"> <i className="fa fa-instagram" aria-hidden="true"></i>&nbsp;</a> : ''}
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
                key: "is_active",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            <button type="submit" className=" btn-danger" onClick={this.deleteUserAPI.bind(this, item)} data-original-title=""> <i class="fa fa-trash" aria-hidden="true"></i></button>
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

        this.createCollectionAPI = this.createCollectionAPI.bind(this)
        this.onChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        if (!Cookies.get('loginSuccessblineAdmin')) {
            window.location.href = `${config.baseUrl}`
            return false;
        }
        this.adminCollection();
        this.getGamesCategoryAPI()

    }

    closeModal() {
       this.setState({
        description: '',
        datetime: '',
        description: '',
        profile_pic: '',
        banner: '',
        telegram:'',
        user_list: [],
        name: '',
        profileData: '',
        image_file: '',
        image_preview: '',
        banner_preview: '',
        image_file1: null,
        games_category: '',
        image_preview1: '',
        facebook: "",
        insta: "",
        twitter: "",
        pinterest: "",
        website: "",
        youtube: "",
        discord: "",
        loader: '',
        policy_id: '',
        policy_type: '0',
        description: '',
        
       })
    }

    async getGamesCategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getGamesCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    gamesResponse: response.data.response
                })
            }
        })
    }

    async adminCollection() {
        await axios.get(`${config.apiUrl}getAdminCollection`, {},)
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


    deleteUserAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this Collection',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios.post(`${config.apiUrl}deleteAdminCollection`, { 'id': id.id })
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

    async createNewPolicyAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}createNewPolicy`,
            headers: { authorization: this.loginData?.Token },
            data: { "user_id": this.loginData.data?.id, 'email': this.loginData.data?.user_email }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    policy_id: response.data.policy_id,
                    policy_idError: ''
                })
            } else {
                toast.error(response.data?.msg)
            }
        }).catch(err => {
            toast.error(err.response.data?.msg);
        })
    }




















    profilePicChange = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
        })
    }

    bannerPicChange = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];
        this.setState({
            banner_preview: image_as_base64,
            coverPhoto: image_as_files,
        })
    }

    handleChange = e => {

        if (e.target.name == 'policy_type') {
            if (e.target.value == '1') {
                this.createNewPolicyAPI()
            } else {
                this.setState({
                    'policy_id': ''
                })
            }
        }

        this.setState({
            [e.target.name]: e.target.value
        })
    }

    createCollectionAPI(e) {
        e.preventDefault();
        let formData = new FormData();
        this.setState({
            loader: 1
        })
        formData.append('profile_pic', this.state.image_file);
        formData.append('banner', this.state.coverPhoto);
        formData.append('name', this.state.name);
        formData.append('description', this.state.description);
        formData.append('website', this.state.website);
        formData.append('facebook', this.state.facebook);
        formData.append('twitter', this.state.twitter);
        formData.append('insta', this.state.insta);
        formData.append('telegram', this.state.telegram);
        formData.append('discord', this.state.discord);
        formData.append('games_category', this.state.games_category);
        formData.append('user_id', 1);
        formData.append('policy_type', this.state.policy_type);
        formData.append('policy_id', this.state.policy_id);
        formData.append('signing_key', this.state.signing_key);
        formData.append('verification_key', this.state.verification_key);
        formData.append('max_nft_supply', this.state.max_nft_supply);
        formData.append('token_name_prefix', this.state.token_name_prefix);



        axios.post(`${config.apiUrl}insertAdminCollection`, formData)
            .then(result => {
                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                    // setTimeout(() => {
                    //          window.location.reload()
                    // }, 2000);
                } else {
                    toast.error(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'red',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                }
                this.setState({
                    loader: ''
                })
            }).catch(err => {
                toast.error(err.response.data?.msg,
                    this.setState({
                        loader: ''
                    })
                );
            })
    }

    async updateAdminFeature(id, featured) {
        console.log('featured', featured)
        axios({
            method: 'post',
            url: `${config.apiUrl}addAdminCollectionFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (featured == 0) {
                        toast.success('Added in trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From trending!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }

                    this.adminCollection();

                }
            }).catch(err => {

                // toast.error(err.response.data?.msg, {
                //     position: toast.POSITION.TOP_CENTER, autoClose: 1500

                // }, setTimeout(() => {

                // }, 500));

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
                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">My Collection</h5>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add Collection </button>
                                    <div className="table-responsive">
                                        <br />
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
                <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div className="form-wrap">
                                    <form action="#">
                                        <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add Collection</h6>
                                        <hr className="light-grey-hr" />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Collection Name</label>
                                                    <input type="text" onChange={this.handleChange} value={this.state.name} className="form-control" name="name" placeholder="Collection Name" maxlength="50" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Description</label>
                                                    <input type="text" name="description" onChange={this.handleChange} value={this.state.description} className="form-control" placeholder="Description" maxlength="300"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Profile Image(jpg, jpeg, png)</label>
                                                    <input type="file" accept=".jpg,.jpeg,.png" name="profile_pic" onChange={this.profilePicChange.bind(this)} className="form-control" placeholder="Image File" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Banner Image(jpg, jpeg, png)</label>
                                                    <input type="file" accept=".jpg,.jpeg,.png" name="coverPhoto" onChange={this.bannerPicChange.bind(this)} className="form-control" placeholder="Image File" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Website Link</label>
                                                    <input type="text" name="website" onChange={this.handleChange} value={this.state.website} className="form-control" placeholder="Website Link" />
                                                </div>
                                            </div>

                                            {/* <div class="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Games Category</label>
                                                    <select onChange={this.handleChange} className="form-control" name="games_category" >
                                                        <option value="">Select Games Category</option>
                                                        {this.state.gamesResponse.map((item) => (
                                                            <option value={item.id}>{item.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div> */}

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Facebook Link </label>
                                                    <input type="text" name="facebook" onChange={this.handleChange} value={this.state.facebook} className="form-control" placeholder="Facebook Link" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Twitter Link </label>
                                                    <input type="text" name="twitter" onChange={this.handleChange} value={this.state.twitter} className="form-control" placeholder="Twitter Link" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Telegram Link </label>
                                                    <input type="text" name="telegram" onChange={this.handleChange} value={this.state.telegram} className="form-control" placeholder="Telegram Link" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">insta Link </label>
                                                    <input type="text" name="insta" onChange={this.handleChange} value={this.state.insta} className="form-control" placeholder="insta Link" />
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label mb-10">Discord Link </label>
                                                    <input type="text" name="discord" onChange={this.handleChange} value={this.state.discord} className="form-control" placeholder="Discord Link" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-actions">

                                            <div className="clearfix"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="modal-footer pt-0">
                                <button type="button" class="btn btn-default" data-dismiss="modal" onClick={e => this.closeModal()}>Close</button>

                                {this.state.loader === '' ?
                                    <button type='submit' disabled={!this.state.name || !this.state.image_file || !this.state.coverPhoto} onClick={this.createCollectionAPI} className="btn btn-primary" >Add </button>
                                    :
                                    <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                }

                            </div>
                        </div>
                    </div>
                </div>

            </>


        )

    }
}
