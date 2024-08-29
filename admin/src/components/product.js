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

export default class product extends Component {
    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        this.state = {
            item_id: '',
            name: '',
            description: '',
            image: '',
            owner_id: '',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            price: '',
            collection_id: '',
            user_id: '',
            is_sold: '',
            expiry_date: '',
            start_date: '0',
            sell_type: '0',
            sell_type_text: '',
            bid_list: [],
            quantity: '0',
            loader: '',
            category_list: [],
            item_list: [],
            item_list1: [],
            item_list2: [],
            gamesCategoryRes: [],


        }
        console.log(this.loginData?.data?.user_email, this.loginData?.data);
        this.editDataAPI = this.editDataAPI.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChange = this.itemDetail.bind(this)
        this.updateItemData = this.updateItemData.bind(this)
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },

            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`https://espsofttech.org/bline/nftDetails/${item.id}`} target="_blank" >
                                {item.name}
                            </a>

                        </>
                    );
                }
            },
            // {
            //     key: "description",
            //     text: "Description",
            //     sortable: true
            // },

            {
                key: "image",
                text: "Image",
                cell: (item) => {
                    return (
                        <>
                            {item.image === null || item.image === '' || item.image === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl}${item.image}`} target="_balnk">
                                    <img src={`${config.imageUrl}${item.image}`} className="product-img" />
                                </a>
                            }


                        </>
                    );
                }
            },
            {
                key: "owner_name",
                text: "NFT Owner",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}UserProfile/` + item.owner_id} target="_blank" >
                                {item.owner_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "creator_name",
                text: "NFT Creator",
                cell: (item) => {
                    return (
                        <>
                            <a href={`${config.redirectUrl}UserProfile/` + item.creator_id} target="_blank" >
                                {item.creator_name}
                            </a>

                        </>
                    );
                }
            },
            {
                key: "royalty_percent",
                text: "Royalty",
                sortable: true
            },
            {
                key: "item_category",
                text: "Games Category Name",
                sortable: true
            },

            {
                key: "price",
                text: "Price",
                cell: (item) => {
                    return (
                        <>
                            <span>{item.price}ETH</span>
                        </>
                    )
                }
            },
            {
                key: "is_featured",
                text: "Trending",
                sortable: true,
                cell: (item) => {
                    return (
                        <>

                            <input type='checkbox' checked={item.is_featured === 0 ? '' : 'checked'} onClick={this.updateUserNftFeature.bind(this, item.id, item.is_featured)} />
                        </>
                    )
                }

            },
            // {
            //     key: "verified_tag",
            //     text: "Verified Tag",
            //     sortable: true,
            //     cell: (item) => {
            //         return (
            //             <>

            //                 <input type='checkbox' checked={item.verified_tag === 0 ? '' : 'checked'} onClick={this.updateUserNftTag.bind(this, item.id, item.verified_tag)} />
            //             </>
            //         )
            //     }

            // },
            {
                key: "id",
                text: "Action",
                cell: (item) => {
                    return (
                        <>
                            {/* <button type="submit" onClick={this.editDataAPI.bind(this, item)} data-toggle="modal" title="Edit" data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp; */}

                            {item.is_active == 1 ?
                                <button type="submit" onClick={this.hideNFTAPI.bind(this, item)} title="Hide NFT" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-minus-square m-r-10"></i> </button> :
                                <button type="submit" onClick={this.showNFTAPI.bind(this, item)} title="Show NFT" data-toggle="tooltip" data-original-title="Close" className=" btn-primary"> <i class="fa fa-plus-square m-r-10"></i> </button>

                            }
                        </>
                    );
                }
            },

        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50,],
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

        this.categoryList();
        this.getItemAPI();
        this.getAdminCollectionAPI();
        this.getOnSaleAPI()
        //  this.getGamesCategoryAPI()
    }

    async getGamesCategoryAPI(value) {
        // console.log('item_subcategory_id',value)
        await axios({
            method: 'get',
            url: `${config.apiUrl}getGamesCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    gamesCategoryRes: response.data.response.filter(item => item.category_id == parseInt(value))
                })
                //  console.log("................", this.state.gamesCategoryRes);
            }
        })
    }

    async getAdminCollectionAPI() {
        axios.get(`${config.apiUrl}getAdminCollection`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list1: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }



    async getOnSaleAPI() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getOnSale`,
                data: {}
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            item_list2: result.data.response
                        })

                    }

                    else if (result.data.success === false) {

                    }
                })

                .catch(err => {
                })
    }



    async getItemAPI() {
        axios.get(`${config.apiUrl}getAdminItem`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

    async categoryList() {
        await
            axios({
                method: 'get',
                url: `${config.apiUrl}getDigitalCategory`,
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


    async getBidDetailAPI(id) {

        axios.post(`${config.apiUrl}getBidDetail`, { 'item_id': id.id },)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        bid_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
                this.setState({
                    bid_list: []
                })
            })
    }

    async BidAcceptAPI(id) {
        axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, "user_id": id.user_id, 'is_admin': this.loginData?.data.is_admin, "item_id": id.item_id }
        })

            .then(response => {
                if (response.data.success === true) {
                    toast.success(response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    }, setTimeout(() => {
                        window.location.reload();
                    }, 500));

                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {

            })
    }


    handleChange = event => {

        event.persist();

        let value = event.target.value;

        this.setState(prevState => ({
            item_list: { ...prevState.item_list, [event.target.name]: value }
        }))
    };

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
            this.getGamesCategoryAPI(e.target.value)
        }

        if (e.target.checked === true && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (e.target.checked === false && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
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

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            loader: '1'
        })
        if (this.state.item_name == '') {
            toast.error('Item name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.description == '') {
            toast.error('Item Description Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!this.state.image_file) {
            toast.error('Item Image Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.owner == '') {
            toast.error('Owner Name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (!this.state.item_category_id) {
            toast.error('Please Select Category', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.price == '') {
            toast.error('Item price Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }

        else {


            let formData = new FormData();

            let formData1 = new FormData();

            formData1.append('file', this.state.image_file);


            formData.append('name', this.state.item_name);
            formData.append('description', this.state.description);
            if (this.state.image_file === null) {
                formData.append('avatar', this.state.item_list.avatar);
            }
            else {
                formData.append('avatar', this.state.image_file);
            }
            formData.append('owner', this.state.owner);
            formData.append('item_category_id', this.state.item_category_id);
            formData.append('item_subcategory_id', this.state.item_subcategory_id);
            formData.append('price', this.state.price);
            formData.append('start_date', this.state.start_date);
            formData.append('sell_type', this.state.sell_type);
            formData.append('quantity', this.state.quantity);
            formData.append('file_type', this.state.file_type);
            formData.append('email', this.loginData?.data.user_email);
            formData.append('user_id', this.loginData?.data.id);
            formData.append('is_on_sale', this.state.is_sale_id);



            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            var resIPF = await axios.post(url,
                formData1,
                {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                        'pinata_api_key': 'b26a087893e3f0033bbf',
                        'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                    }
                }
            );

            formData.append('image', resIPF.data.IpfsHash);

            const obj = Object.fromEntries(formData);

            axios({
                method: 'post',
                url: `${config.apiUrl}addNftByUser`,
                headers: { "Authorization": this.loginData?.Token },
                data: obj
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            loader: ''
                        })
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                        }, setTimeout(() => {
                            window.location.reload();
                        }, 500));
                        this.state = {
                            item_name: '',
                            description: '',
                            image: '',
                            owner: '',
                            item_category_id: '',
                            price: '',
                            sell_type: '',
                            quantity: ''
                        }
                        this.getItemAPI();

                    }
                })

        }
    }

    itemDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [event.target.name]: value }
        }))

        if (event.target.checked === true && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (event.target.checked === false && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    async editDataAPI(id) {

        await axios.post(`${config.apiUrl}ItemDetailForEdit`, { item_id: id.id },)
            .then(result => {

                if (result.data.success === true) {
                    this.setState({
                        getItemData: result.data.response
                    })


                }

                else if (result.data.success === false) {

                }
            })

            .catch(err => {
            })
    }


    async updateItemData(e) {
        e.preventDefault()
        this.setState({
            loader: '1'
        })

        if (this.state.getItemData?.item_name == '') {
            toast.error('Item name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.getItemData?.description == '') {
            toast.error('Item Description Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }


        else if (!this.state.getItemData?.item_category_id) {
            toast.error('Please Select Category', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.getItemData?.price == '') {
            toast.error('Item price Required', {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            let formData = new FormData();

            let formData1 = new FormData();

            formData1.append('file', this.state.image_file);

            formData.append('id', this.state.update_id)
            formData.append('name', this.state.item_name);
            formData.append('description', this.state.description);

            this.state.getItemData.email = this.loginData?.data.user_email

            axios({
                method: 'post',
                url: `${config.apiUrl}updateitem`,
                headers: { "Authorization": this.loginData?.Token },
                data: this.state.getItemData
            })
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            loader: ''
                        })
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                        },
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500));

                        this.getItemAPI();

                    }
                }).catch(err => {

                    toast.error(err.response.data?.msg, {
                        position: toast.POSITION.TOP_CENTER, autoClose: 1500

                    }, setTimeout(() => {

                    }, 500));

                })
        }
    }

    deleteItem = (id) => {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to delete this NFTs.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}deleteitem`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, 'is_admin': this.loginData?.data.is_admin, id: id.id }
                        })
                            .then(result => {
                                if (result.data.success === true) {
                                    toast.success(result.data.msg, {
                                        position: toast.POSITION.TOP_CENTER
                                    });
                                    this.getItemAPI();
                                }

                            }).catch(err => {
                                toast.warning(err.response.data?.msg, {
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




    hideNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'is_admin': this.loginData?.data.is_admin, 'email': this.loginData?.data.user_email, item_id: id.id }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {

                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    showNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'is_admin': this.loginData?.data.is_admin, 'email': this.loginData?.data.user_email, item_id: id.id }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
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
    async updateUserNftFeature(id, featured) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserNftFeatured`,
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
                    this.getItemAPI();

                }
            }).catch(err => {

                // toast.error(err.response.data?.msg, {
                //     position: toast.POSITION.TOP_CENTER, autoClose: 1500
                // }, setTimeout(() => {
                // }, 500));

            })
    }


    async updateUserNftTag(id, verified) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}userNftVerifiedTag`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, verified_tag: verified === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (verified == 0) {
                        toast.success('Added in Verified Tag!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (verified == 1) {
                        toast.error('Removed From Verified Tag!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }

                    this.userCollection();

                }
            }).catch(err => {


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
                                    <h5 className="txt-dark">User NFT's</h5>
                                </div>

                            </div>

                            <div className="row">

                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">

                                                {/* <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add NFTs </button> */}
                                                {/* <br />
                                                <br /> */}

                                                <div className="form-wrap">
                                                    <div class="table-responsive">

                                                        <ReactDatatable
                                                            config={this.config}
                                                            records={this.state.item_list}
                                                            columns={this.columns}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>User NFT's</h6>
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
                                                                <label className="control-label mb-10">Image(jpg, jpeg, png, gif, mp3, mp4)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
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
                                                                <label className="control-label mb-10">Fixed price11 (in USD)</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" value={this.state.price} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Sub-Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select onChange={this.handleChange} value={this.state.item_subcategory_id} className="form-control" name="item_subcategory_id">
                                                                        <option value="">Select Subcategory</option>
                                                                        {this.state.gamesCategoryRes.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Sale Option</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="is_sale_id" onChange={this.handleChange1} value={this.state.is_sale_id} class="form-control basic">
                                                                        <option selected="selected" value="">Select Sale option</option>
                                                                        {this.state.item_list2.map(item => (
                                                                            <option value={item.type}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>






                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Add Collection</label>
                                                                <div className="customSelectHolder">

                                                                    <select onChange={this.handleChange1} className="form-control" name="user_id">
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.item_list1.map((item) => (
                                                                            <option value={item.user_id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>






                                                    </div>


                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {this.state.loader === '' ?
                                                <button type='submit' onClick={this.handleSubmit} className="btn btn-primary">Add </button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Update Product</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">


                                                        <div className="col-md-6">

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">

                                                                    <select name="item_category_id" onChange={this.itemDetail} value={this.state.getItemData?.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (in USD)</label>
                                                                <input type="text" onChange={this.itemDetail} name="price" className="form-control" placeholder="Price" value={this.state.getItemData?.price} />
                                                            </div>
                                                        </div>




                                                        {(this.state.dateShow === 1) ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.itemDetail} className="form-control" name="start_date" value={this.state.getItemData?.start_date} />
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : ''}
                                                    </div>

                                                    <div className="form-actions">

                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="modal-footer pt-0">
                                            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

                                            {this.state.loader === '' ?
                                                <button type='submit' onClick={this.updateItemData} className="btn btn-primary">Update</button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>

                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-25px' }}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div class="table-responsive">
                                            <table class="table table-striped mb-0">
                                                <thead>
                                                    <tr>

                                                        <th>UserName</th>
                                                        <th>Profile Pic</th>
                                                        <th>Item Name</th>
                                                        <th>Bid Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {this.state.bid_list.length === 0 ?
                                                        <tr >
                                                            <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                                        this.state.bid_list.map(item => (
                                                            <tr>

                                                                <td>{item.user_name}</td>
                                                                <td >
                                                                    {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                        ?
                                                                        <img src='images/noimage.png' className="product-img" />

                                                                        :
                                                                        <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}

                                                                </td>
                                                                <td>{item.item_name}</td>
                                                                <td>{item.bid_price}</td>
                                                                <td><button type='submit' onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary">Accept</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div class="modal-footer">


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