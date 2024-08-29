import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Player } from 'video-react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
export default class createnft extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            description: '',
            user_collection_id: '0',
            item_category_id: '0',
            royalty_percent: '0',
            methodType: '1',
            sell_type: '1',
            price: '0',
            minimum_bid: '0',
            start_date: '',
            expiry_date: '',
            image_file: '',
            image_preview: '',
            categoryData: [],
            collectionData: [],
            spinLoader: '0',
            currentDate : '',
            endDate : '',            
        }
        this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
        this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
        this.updateNftAPI = this.updateNftAPI.bind(this)
        this.onChange = this.handleChange.bind(this);

        const { match: { params } } = this.props;
        this.id = params.id
    }

    componentDidMount() {

        var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        var array = startDate.split(' ');
        if(array[0]){
          this.setState({
            currentDate : array[0],
            endDate : array[0]
          })
        }

        Cookies.set('selectedTab', '1');

        if (!this.loginData?.id) {
            window.location.href = `${config.baseUrl}`
        }
        this.getCategoryAPI()
        this.getUserCollectionAPI()
        this.getNftDetailsAPI()
    }

    async getNftDetailsAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}itemDetail`,
            data: { 'item_id': this.id, 'user_id': '0' }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    nftData: response.data.response
                })
            }
        })
    }

    async getCategoryAPI() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}getCategory`,
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    categoryData: response.data.response
                })
            }
        })
    }

    async getUserCollectionAPI() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserCollection`,
            data: { "user_id": this.loginData?.id }
        }).then(response => {
            if (response.data.success === true) {
                this.setState({
                    collectionData: response.data.response
                })
            }
        })
    }

    nftimageChange = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        if (image_as_files.type.indexOf('image') === 0) {
            var file_type = 'image';
        } else {
            var file_type = 'video';
        }

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['file_type']: file_type }
        }))

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
            file_type: file_type,
            image_type: e.target.files[0].type,
            imageError: ""
        })
    }

    handleChange = e => {

        if (e.target.name == 'name') {
            this.setState({
                'nameError': ""
            })
        }

        if (e.target.name == 'description') {
            this.setState({
                'descError': ""
            })
        }

        if (e.target.name == 'user_collection_id') {
            this.setState({
                'collectionError': ""
            })
        }

        if (e.target.name == 'item_category_id') {
            this.setState({
                'categoryError': ""
            })
        }

        if (e.target.name == 'start_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['start_date1']: e.target.value }
            }))

            this.setState({
                endDate : e.target.value
              })

        }

        if (e.target.name == 'expiry_date') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['expiry_date1']: e.target.value }
            }))
        }

        if (e.target.name == 'minimum_bid_amount') {
            this.setState(prevState => ({
                nftData: { ...prevState.nftData, ['price']: e.target.value }
            }))
        }

        this.setState({
            [e.target.name]: e.target.value
        })

        let value = e.target.value;
        this.setState(prevState => ({
            nftData: { ...prevState.nftData, [e.target.name]: value }
        }))
    }

    sellType(type) {
        this.setState({
            'sell_type': type
        })

        this.setState(prevState => ({
            nftData: { ...prevState.nftData, ['sell_type']: type }
        }))
    }

    validate = () => {
        let nameError = ""
        let descError = ""
        let imageError = ""
        let collectionError = ""
        let categoryError = ""

        if (this.state.nftData?.name === '') {
            nameError = "Title is required."
        }
        if (this.state.nftData?.description === '') {
            descError = "Description is required."
        }
        if (this.state.nftData?.user_collection_id === '0' || this.state.nftData?.user_collection_id === '') {
            collectionError = "Collection is required."
        }
        if (this.state.nftData?.item_category_id === '0' || this.state.nftData?.item_category_id == '') {
            categoryError = "Category is required."
        }
        if (this.state.nftData?.image_file === '') {
            imageError = "Image is required."
        }
        if (nameError || descError || imageError || collectionError || categoryError) {

            window.scrollTo(0, 220)

            this.setState({
                nameError, descError, categoryError, collectionError, imageError
            })
            return false
        }
        return true
    }

    async updateNftAPI(e) {
        e.preventDefault();

        const isValid = this.validate()
        if (!isValid) {
        }
        else {

            this.setState({
                spinLoader: '1'
            })

            let formData = new FormData();
            // let formData1 = new FormData();
            // if (this.state.image_file) {
            //     formData1.append('file', this.state.image_file);
            //     const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            //     var resIPF = await axios.post(url,
            //         formData1,
            //         {
            //             headers: {
            //                 'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
            //                 'pinata_api_key': '13a09709ea30dc4fcc31',
            //                 'pinata_secret_api_key': 'b6f2e00b393de9902ead2fb02dfc4a6325df8c7cfe8734e1493f918e7f7aa7c9'
            //             }
            //         }
            //     );
            //     formData.append('image', resIPF.data.IpfsHash);
            //     formData.append('file_type', this.state.file_type);
            // } else {
            //     formData.append('image', "");
            //     formData.append('file_type', this.state.nftData?.file_type);
            // }

            if (this.state.nftData?.sell_type == 2) {
                formData.append('start_date', this.state.nftData?.start_date1);
                formData.append('expiry_date', this.state.nftData?.expiry_date1);
            } else {
                formData.append('start_date', "");
                formData.append('expiry_date', "");
            }

            formData.append('id', this.state.nftData?.item_id);
            // formData.append('old_image', this.state.nftData?.image);
            // formData.append('name', this.state.nftData?.name);
            formData.append('royaltie', this.state.nftData?.royalty_percent);
            // formData.append('description', this.state.nftData?.description);
            // formData.append('item_category_id', this.state.nftData?.item_category_id);
            // formData.append('user_collection_id', this.state.nftData?.user_collection_id);
            formData.append('price', this.state.nftData?.price);
            formData.append('sell_type', this.state.nftData?.sell_type);
            formData.append('user_id', this.loginData?.id);
            formData.append('email', this.loginData?.user_email);
            axios.post(`${config.apiUrl}updateNftByUser`, formData)
                .then(result => {

                    this.setState({
                        spinLoader: '0'
                    })

                    if (result.data.success === true) {
                        toast.success(result.data.msg, {
                        });
                        setTimeout(() => {
                          window.location.href = `${config.baseUrl}accountsetting`
                        }, 2000);
                    } else {
                        toast.error(result.data.msg, {

                        });
                        this.setState({
                            spinLoader: '0'
                        })
                    }
                }).catch(err => {
                    toast.error(err.response.data?.msg,

                    );
                    this.setState({
                        spinLoader: '0'
                    })
                })
        }
    }

    render() {
        return (

            <>
                <Header />
                <ToastContainer />
                <div className="no-bottom no-top" id="content">
                    <div id="top" />
                    {/* section begin */}
                    <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/header-banner.jpg")`, backgroundSize: 'cover' }}>
                        <div className="center-y relative text-center">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h1>Edit NFT</h1>
                                    </div>
                                    <div className="clearfix" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section aria-label="section">
                        <div className="container">
                            <div className="row wow fadeIn">
                                <div className="col-lg-8 offset-lg-1">
                                    <form id="form-create-item" className="form-border" method="post" action="email.php">
                                        <div className="field-set">
                                            <h5>Image</h5>
                                            <div className="d-create-file">

                                                {this.state.nftData?.file_type === 'image' ?
                                                    this.state.image_preview === '' ?
                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                        :
                                                        <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                                                    :
                                                    this.state.nftData?.file_type === 'video' ?
                                                        this.state.image_preview != '' ?
                                                        <Player style={{ height: '50px', width: '50px' }} id="image" className="" src={this.state.image_preview} />
                                                        :
                                                        <Player  id="image" className="" src={`${config.imageUrl}` + this.state.nftData?.image} />
                                                        :""
                                                }

                                                {/* <p id="file_name">PNG, JPG, GIF, WEBP or MP4</p> */}
                                                {/* <input type="button" id="get_file" className="btn-main" defaultValue="Browse" /> */}
                                                {/* <input type="file" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" /> */}
                                                <span className="error-asterick"> {this.state.imageError}</span>
                                            </div>
                                            <div className="spacer-single" />
                                            <h5>Title</h5>
                                            <input type="text" disabled name="name" onChange={this.handleChange} id="item_title" value={this.state.nftData?.name} className="form-control" placeholder="e.g. 'Crypto Funk" />
                                            <span className="error-asterick"> {this.state.nameError}</span>
                                            <div className="spacer-10" />
                                            <h5>Description</h5>
                                            <textarea disabled data-autoresize name="description" onChange={this.handleChange} id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" value={this.state.nftData?.description} ></textarea>
                                            <span className="error-asterick"> {this.state.descError}</span>
                                            <div className="spacer-10" />
                                            <div className="collection-drop">
                                                <h5>Collection</h5>
                                                <select disabled onChange={this.handleChange} value={this.state.nftData?.user_collection_id} className="form-control" name="user_collection_id">
                                                    <option value="">Select Collection</option>
                                                    {this.state.collectionData.map((item) => (
                                                        <option value={item.collection_id}>{item.name}</option>
                                                    ))}
                                                </select>
                                                <span  className="error-asterick"> {this.state.collectionError}</span>
                                                <h5>Categories</h5>
                                                <select disabled onChange={this.handleChange} value={this.state.nftData?.item_category_id} className="form-control" name="item_category_id">
                                                    <option value="">Select Category</option>
                                                    {this.state.categoryData.map((item) => (
                                                        <option value={item.id}>{item.name}</option>
                                                    ))}
                                                </select>
                                                <span className="error-asterick"> {this.state.categoryError}</span>
                                            </div>
                                            <div className="spacer-10" />
                                            <h5>Royalties</h5>
                                            <input onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} type="text" value={this.state.nftData?.royalty_percent} onChange={this.handleChange} name="royalty_percent" id="item_royalties" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%. Maximum is 25%" />
                                            <div className="spacer-10" />
                                            <h5>Select sale method</h5>
                                            <div className="de_tab tab_methods">
                                                <ul className="de_nav">
                                                    <li onClick={this.sellType.bind(this, 1)} className={this.state.nftData?.sell_type == 1 ? 'active' : ''}><span><i className="fa fa-tag" />Price</span>
                                                    </li>
                                                    <li className={this.state.nftData?.sell_type == 2 ? 'active' : ''} onClick={this.sellType.bind(this, 2)}><span><i className="fa fa-hourglass-1" />Timed auction</span>
                                                    </li>
                                                    <li className={this.state.nftData?.sell_type == 3 ? 'active' : ''} onClick={this.sellType.bind(this, 3)}><span><i className="fa fa-users" />Not on sale</span>
                                                    </li>
                                                </ul>
                                                <div className="de_tab_content">
                                                    {this.state.nftData?.sell_type === 1 ?
                                                        <>
                                                            <h5>Price</h5>
                                                            <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} value={this.state.nftData?.price} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                                                        </>

                                                        :
                                                        this.state.nftData?.sell_type === 2 ?
                                                            <>
                                                                <h5>Minimum bid</h5>
                                                                <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} name="minimum_bid_amount" onChange={this.handleChange} value={this.state.nftData?.price} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                                                                <div className="spacer-10" />
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5>Starting date</h5>
                                                                        <input type="date" value={this.state.nftData?.start_date1} onChange={this.handleChange} name="start_date" id="bid_starting_date" className="form-control" min={this.state.currentDate} />
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <h5>Expiration date</h5>
                                                                        <input type="date" value={this.state.nftData?.expiry_date1} onChange={this.handleChange} name="expiry_date" id="bid_expiration_date"  min={this.state.endDate} className="form-control" />
                                                                    </div>
                                                                    <div className="spacer-single" />
                                                                </div>
                                                            </>
                                                            :

                                                            ""

                                                    }

                                                </div>
                                            </div>
                                            <div className="spacer-10" />
                                            {this.state.spinLoader === '0' ?
                                                <input type="submit" onClick={this.updateNftAPI} value="Update" id="submit" className="btn-main" defaultValue="Create Item" />
                                                :
                                                <button disabled className="btn-main" id="deposit-page" >Updating NFT &nbsp; <i className="fa fa-spinner fa-spin validat"></i></button>
                                            }
                                            <div className="spacer-single" />
                                        </div></form>
                                </div>
                                <div className="col-lg-3 col-sm-6 col-xs-12">
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />

            </>
        )
    }
}