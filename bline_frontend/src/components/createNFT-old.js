import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import { Dialog, Classes } from "@blueprintjs/core";
import BarLoader from 'react-bar-loader'
import { Player } from 'video-react';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
import reactImageSize from 'react-image-size';
import { createHashHistory } from 'history'

const history = createHashHistory()

const date = require('date-and-time')
export default class createnft extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      user_collection_id: '0',
      item_category_id: '0',
      royaltie: '0',
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
      currentDate: '',
      endDate: '',
      spinLoader: '0',
      blockchainType: '1',
      isDialogOpen: false,
      SingleCategoryData: [],
      currentTrxFee: '0.00',

      isCollectionModelOpen : 0,

      cl_name: '',
      cl_image_file : '',
      cl_image_preview: '',
      cl_banner_preview: '',
      facebook: "",
      insta: "",
      twitter: "",
      pinterest: "",
      website: "",
      youtube: "",
      discord: "",
      cl_coverPhoto: '',
      cl_description: '',
      telegram: ''     
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.createNftAPI = this.createNftAPI.bind(this)
    this.onChange = this.handleChange.bind(this);
    this.createCollectionAPI = this.createCollectionAPI.bind(this)

  }

  componentDidMount() {

    var startDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var array = startDate.split(' ');
    if (array[0]) {
      this.setState({
        currentDate: array[0],
        endDate: array[0]
      })
    }

    // if (!this.loginData?.id) {
    //   window.location.href = `${config.baseUrl}`
    // }
    this.getCategoryAPI()
    this.getUserCollectionAPI()
    
    this.getAboutDetailAPI()
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

  async getAboutDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAboutDetail`,
      data: { "id": this.loginData.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          aboutData: response.data.response
        })
      }
    })
  }


  profilePicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        cl_image_preview: image_as_base64,
        cl_image_file: image_as_files,
        imageError: ""
      })
    }
  }

  bannerPicChange = (e) => {
    if (e.target.files[0]) {
      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      this.setState({
        cl_banner_preview: image_as_base64,
        cl_coverPhoto: image_as_files,
        coverError: ""
      })
    }
  }

  collectionValidate = () => {
    let clnameError = ""
    let cldescError = ""
    let imageError = ""
    let coverError = ""

    if (this.state.cl_name === '') {
      clnameError = "Name is required."
    }
    if (this.state.cl_description === '') {
      cldescError = "Description is required."
    }
    if (this.state.cl_image_file === '') {
      imageError = "Image is required."
    }
    if (this.state.cl_coverPhoto === '') {
      coverError = "Cover photo is required."
    }
    if (clnameError || cldescError || imageError || coverError) {
      window.scrollTo(0, 260)
      this.setState({
        clnameError, cldescError, imageError, coverError
      })
      return false
    }
    return true
  } 

  createCollectionAPI(e) {
    e.preventDefault();

    const isValid = this.collectionValidate()
    if (!isValid) {
    }
    else {
      let formData = new FormData();
      formData.append('profile_pic', this.state.cl_image_file);
      formData.append('banner', this.state.cl_coverPhoto);
      formData.append('name', this.state.cl_name);
      formData.append('description', this.state.cl_description);
      formData.append('website', this.state.website);
      formData.append('facebook', this.state.facebook);
      formData.append('twitter', this.state.twitter);
      formData.append('insta', this.state.insta);
      formData.append('telegram', this.state.telegram);
      formData.append('discord', this.state.discord);
      formData.append('user_id', this.loginData?.id);
      
      axios.post(`${config.apiUrl}insertUserCollection`, formData)
        .then(result => {
          if (result.data.success === true) {

            this.setState({
              isCollectionModelOpen : 0
            })

            toast.success(result.data.msg);
            this.componentDidMount()
          } else {
            toast.error(result.data.msg);
          }
        }).catch(err => {
          toast.error(err.response.data?.msg,

          );
        })
    }
  }

  async closeModel(){
    this.setState({
      isCollectionModelOpen : 0
    })
  }

  async openModel(){
    this.setState({
      isCollectionModelOpen : 1
    })
  }
  //=============================================  Single category get  ============================

  async singleGamesCategoryAPI(id) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}singleGamesCategory`,
      data: { "category_id": id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          SingleCategoryData: response.data.response
        })
        console.log(this.state.SingleCategoryData);
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  nftimageChange = async (e) => {
    if (e.target.files[0]) {

      let image_as_base64 = URL.createObjectURL(e.target.files[0])
      let image_as_files = e.target.files[0];
      let file_type = '';
      if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
      } else {
        file_type = 'video';
      }
      // let dd = await this.toBase64(e.target.files[0]);
      // const { width, height } = await reactImageSize(dd);
      // if (height >= 600 && width >= 600) {
      this.setState({
        image_preview: image_as_base64,
        image_type: e.target.files[0].type,
        image_file: image_as_files,
        file_type: file_type,
        imageSizeError: ''
      })
      // } else {
      //   this.setState({
      //     imageSizeError: 'Height and width must be 600px and 600px!!'
      //   })
      // }
    }
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
        'categoryError': "",
      })
      this.singleGamesCategoryAPI(e.target.value)
    }

    if (e.target.name == 'item_subcategory_id') {
      this.setState({
        'singlecategoryError': "",
      })
    }

    if (e.target.name == 'blockchainType') {
      this.setState({
        'blockchainTypeError': ""
      })
    }

    if (e.target.name == 'start_date') {
      this.setState({
        endDate: e.target.value
      })
    }



    this.setState({
      [e.target.name]: e.target.value
    })


    if (e.target.name == 'price') {
      this.gasPriceFees()
    }
    if(e.target.name == 'minimum_bid_amount'){
      this.gasPriceFees()
    }

  }

  sellType(type) {
    this.setState({
      'sell_type': type
    })
  }

  async imageUpload() {
    let formData1 = new FormData();
    formData1.append('file', this.state.image_file);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let resIPF = await axios.post(url,
      formData1,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
          'pinata_api_key': '13a09709ea30dc4fcc31',
          'pinata_secret_api_key': 'b6f2e00b393de9902ead2fb02dfc4a6325df8c7cfe8734e1493f918e7f7aa7c9'
        }
      }
    );
    let ipfsImg = resIPF.data.IpfsHash;
    this.setState({
      ImageFileHash: ipfsImg
    })
    return ipfsImg;
  }

  async metaDataUpload(file) {
    let resIPF = await axios({
      method: 'post',
      url: `${config.apiUrl}createMetadata`,
      data: {
        "name": this.state.name,
        "description": this.state.description,
        "image": `https://meme.mypinata.cloud/ipfs/${this.state.ImageFileHash}`
      }
    });
    let ipfsImg = resIPF.data.hash.IpfsHash;
    this.setState({
      MetadataFileHash: ipfsImg
    })
    return ipfsImg;

  }

  validate = () => {
    let nameError = "";
    let descError = "";
    let imageError = "";
    let collectionError = "";
    let categoryError = "";
    let singlecategoryError = ""
    let blockchainTypeError = "";

    if (this.state.name === '') {
      nameError = "Title field is required."
    }
    // if (this.state.imageSizeError != '') {
    //   toast.error('Height and width must be 600px and 600px!!');
    // }
    if (this.state.description === '') {
      descError = "Description field is required."
    }
    if (this.state.user_collection_id === '0' || this.state.user_collection_id === '') {
      collectionError = "Collection field is required."
    }
    if (this.state.item_category_id === '0' || this.state.item_category_id == '') {
      categoryError = "Category field is required."
    }

    console.log(this.state.item_subcategory_id);
    if (this.state.item_subcategory_id === '0' || this.state.item_subcategory_id == '' || this.state.item_subcategory_id == undefined) {
      singlecategoryError = "Sub Category field is required."
    }

    if (this.state.blockchainType === '0' || this.state.blockchainType == '') {
      blockchainTypeError = "Type field is required."
    }

    if (this.state.image_file === '') {
      imageError = "Image field is required."
    }
    if (nameError || descError || imageError || collectionError || categoryError || singlecategoryError || blockchainTypeError) {

      window.scrollTo(0, 220)

      this.setState({
        nameError, descError, categoryError, singlecategoryError, collectionError, imageError, blockchainTypeError
      })
      return false
    }
    return true
  }


  //========================================  fees calculate   =======================================

  async gasPriceFees() {
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];

      let contractAddress = `${config.marketplaceContract}`
      let from_address = accounts[0];
      const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

      let tx_builder = await contract.methods._mint("0x000000000000", "1111111", (this.state.royaltie * 100).toString(), this.state.sell_type.toString(), 0, 0);

      let encoded_tx = tx_builder.encodeABI();
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = parseInt(gasPrice) + parseInt(10000000000);

      // var chainId = '0x1';
      var chainId = '0x3';

      let gasLimit = await web3.eth.estimateGas({
        gasPrice: web3.utils.toHex(gasPrice),
        to: contractAddress,
        from: from_address,
        value: web3.utils.toHex(100000000000),
        data: encoded_tx,
        chainId: chainId,
      });
      // alert( (gasPrice * parseInt(gasLimit)) / 10 ** 18)
      // alert((gasPrice * parseInt(gasLimit)) / 10 ** 18)

      this.setState({
        currentTrxFee: (gasPrice * parseInt(gasLimit)) / 10 ** 18
      })
      // console.log('currentTrxFee', this.state.currentTrxFee);
      // alert(this.state.currentTrxFee)
    }
  }

  async createUserNft(e) {
    e.preventDefault();
    const isValid = this.validate()
    if (!isValid) {
    }
    else {

      this.setState({
        spinLoader: '1',
        isDialogOpen: true
      })

      let ImageFileHash = this.state.ImageFileHash;
      if (!ImageFileHash) {
        ImageFileHash = await this.imageUpload();
      }
      let MetadataFileHash = this.state.MetadataFileHash;
      if (!MetadataFileHash) {
        MetadataFileHash = await this.metaDataUpload();
      }
      let metaHash = MetadataFileHash;
      MetadataFileHash = `https://meme.mypinata.cloud/ipfs/${MetadataFileHash}`

      if (window.ethereum) {

        this.setState({
          spinLoader: '1',
          isDialogOpen: true
        })

        var web3 = '';
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        let currentNetwork = await web3.currentProvider.chainId;
        web3.eth.defaultAccount = accounts[0];

        // var ETH_mainnet = 0x1;
        // var ETH_testnet = 0x3;

        // let matic_mainnet = 137;
        // let matic_testnet = 80001;
        if (this.state.blockchainType == 1) {
          if (currentNetwork !== '0x3') {
            toast.error('Please select ETh Network!!');
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }
          var chainId = '0x3';
        }

        if (this.state.blockchainType == 2) {
          toast.error('In Progress');
          return;
        }

        try {
          let mintFee = 0;
          let SalePrice;
          let start_date = 0;
          let expiry_date = 0;

          if (this.state.sell_type == 1) {
            SalePrice = parseInt(parseFloat(this.state.price) * (10 ** 18)).toString()
            this.setState({
              start_date: 0,
              expiry_date: 0
            })
          }

          else if (this.state.sell_type == 2) {
            SalePrice = parseInt(parseFloat(this.state.minimum_bid_amount) * (10 ** 18)).toString();
            start_date = Math.round(new Date(this.state.start_date).getTime() / 1000);
            expiry_date = Math.round(new Date(this.state.expiry_date).getTime() / 1000);
          }

          let contractAddress = `${config.marketplaceContract}`
          let from_address = accounts[0];
          const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);

          await contract.methods._mint(MetadataFileHash.toString(), SalePrice.toString(), (this.state.royaltie * 100).toString(), this.state.sell_type.toString(), start_date.toString(), expiry_date.toString()).call();

          let tx_builder = await contract.methods._mint(MetadataFileHash.toString(), SalePrice.toString(), (this.state.royaltie * 100).toString(), this.state.sell_type.toString(), start_date.toString(), expiry_date.toString());

          let encoded_tx = tx_builder.encodeABI();
          let gasPrice = await web3.eth.getGasPrice();
          gasPrice = parseInt(gasPrice) + parseInt(10000000000);

          let gasLimit = await web3.eth.estimateGas({
            gasPrice: web3.utils.toHex(gasPrice),
            to: contractAddress,
            from: from_address,
            value: web3.utils.toHex(mintFee),
            chainId: chainId,
            data: encoded_tx
          });

          // const txData = await web3.currentProvider.request({
          //     method: 'eth_sendTransaction',
          //     params: [{
          //         gasPrice: web3.utils.toHex(gasPrice),
          //         gas: web3.utils.toHex(gasLimit),
          //         to: contractAddress,
          //         from: from_address,
          //         value: web3.utils.toHex(mintFee),
          //         chainId: chainId,
          //         data: encoded_tx
          //     }],
          // });

          const txData = await web3.eth.sendTransaction({
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gasLimit),
            to: contractAddress,
            from: from_address,
            value: web3.utils.toHex(mintFee),
            chainId: chainId,
            data: encoded_tx
          });
          const result = await web3.eth.getTransactionReceipt(txData.transactionHash);
          let tokenId = await web3.utils.hexToNumber(result.logs[0].topics[3]);
          // alert(tokenId)
          if (txData.transactionHash) {

            let mintRes = {
              'ImageFileHash': ImageFileHash,
              'MetadataFileHash': metaHash,
              'hash': txData.transactionHash,
              'tokenId': tokenId,
              'from_address': from_address,
              'minting_fee': parseInt(mintFee) / 10 ** 18
            }
            this.createNftAPI(mintRes);
          } else {
            toast.error('Something went wrong please try again.');
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }

        } catch (err) {

          if (err.message.toString().split('insufficient funds')[1]) {
            toast.error('Transaction reverted : ' + err.message)
          } else {
            if (err.toString().split('execution reverted:')[1]) {
              toast.error('Transaction reverted : ' + (err.toString().split('execution reverted:')[1]).toString().split('{')[0])

            } else {
              toast.error(err.message);
            }
          }

          this.setState({
            spinLoader: 0,
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: 0,
          isDialogOpen: false
        })
        return false;
      }
    }
  }

  async createNftAPI(mintRes) {
    let formData = new FormData();
    if (this.state.sell_type == 2) {
      formData.append('price', this.state.minimum_bid_amount);
    } else {
      formData.append('price', this.state.price);
    }

    formData.append('image', mintRes.ImageFileHash);
    formData.append('metadata', mintRes.MetadataFileHash);
    formData.append('name', this.state.name);
    formData.append('file_type', this.state.file_type);
    formData.append('royalty_percent', this.state.royaltie);
    formData.append('image_type', this.state.image_type);
    formData.append('description', this.state.description);
    formData.append('start_date', this.state.start_date);
    formData.append('expiry_date', this.state.expiry_date);
    formData.append('item_category_id', this.state.item_category_id);
    formData.append('item_subcategory_id', this.state.item_subcategory_id);
    formData.append('user_collection_id', this.state.user_collection_id);
    formData.append('sell_type', this.state.sell_type);
    formData.append('user_id', this.loginData?.id);
    formData.append('email', this.loginData?.user_email);
    formData.append('to_address', this.state.aboutData?.address);
    formData.append('blockchainType', this.state.blockchainType);
    formData.append('hash', mintRes.hash);
    formData.append('tokenId', mintRes.tokenId);

    axios.post(`${config.apiUrl}addNftByUser`, formData)
      .then(result => {

        this.setState({
          spinLoader: '0'
        })

        if (result.data.success === true) {
          toast.success(result.data.msg);
          setTimeout(() => {
            this.props.history.push({
              pathname: `${config.baseUrl}accountsetting`,
              state: { detail: 1 }
            })
            // window.location.href = `${config.baseUrl}accountsetting`
          }, 2000);
        } else {
          toast.error(result.data.msg);
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

  render() {
    return (

      <>
        <Header />
        <Toaster />

        <Dialog
            title="Please Wait..."
            // icon="warning-sign"
            style={{
              color: '#3fa1f3',
              textAlign:"center"
            }}
            isOpen={this.state.isDialogOpen}
            isCloseButtonShown={false}
          >
            <div className="text-center">
              {/* <BarLoader color="#e84747" height="2" /> */}
              <br />
              <h4 style={{ color: '#3fa1f3' }}>Transaction under process...</h4>
              <p style={{ color: '#091f3f' }}>
                Please do not refresh page or close tab.
              </p>
              <div>
              <div class="spinner-border"></div>
              </div>
            </div>
          </Dialog>

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {/* section begin */}
          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/6013544.jpg")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Create NFT</h1>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section">
            <div className="container">
              <div className="row wow fadeIn">
                <div className="col-lg-2 col-sm-6 col-xs-12">
                </div>
                <div className="col-lg-8">
                  <form id="form-create-item" className="form-border" method="post" action="email.php">
                    <div className="field-set">
                      <h5>Upload file</h5>
                      <div className="d-create-file">
                        {this.state.file_type == 'image' ?
                          this.state.image_preview === '' ?
                            ""
                            :
                            <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.image_preview} />

                          :
                          this.state.file_type == 'video' ?
                            <a target="_blank" href={this.state.image_preview}>
                              <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src="images/video-icon.png" />
                            </a>
                            // <Player id="image" className="object-cover w-full h-32-video-data" src={this.state.image_preview} /> 
                            : ""
                        }

                        <p id="file_name">PNG, JPG, GIF, WEBP or MP4</p>
                        <input type="button" id="get_file" className="btn-main" defaultValue="Browse" />
                        <input type="file" accept=".png,.jpg,.gif,.webo,.mp4" onChange={this.nftimageChange.bind(this)} id="upload_file" name="image" />
                        <span className="error-asterick"> {this.state.imageSizeError}</span>
                      </div>
                      <div className="spacer-single" />
                      <h5>Title</h5>
                      <input type="text" name="name" onChange={this.handleChange} id="item_title" className="form-control" placeholder="e.g. 'Crypto Funk" />
                      <span className="error-asterick"> {this.state.nameError}</span>
                      <div className="spacer-10" />
                      <h5>Description</h5>
                      <textarea data-autoresize name="description" onChange={this.handleChange} id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" />
                      <span className="error-asterick"> {this.state.descError}</span>
                      <div className="spacer-10" />
                      <div className="collection-drop">
                        <h5>Collection &nbsp;
                          <a href="javascript:void(0)">
                            <i class="fa fa-plus" onClick={this.openModel.bind(this)} style={{float:'right'}} aria-hidden="true"></i>
                          </a>
                        </h5>
                        <select onChange={this.handleChange} className="form-control" name="user_collection_id">
                          <option value="">Select Collection</option>
                          {this.state.collectionData.map((item) => (
                            <option value={item.collection_id}>{item.name}</option>
                          ))}
                        </select>
                        <span className="error-asterick"> {this.state.collectionError}</span>
                        <h5>Games Categories</h5>
                        <select onChange={this.handleChange} value={this.state.item_category_id} className="form-control" name="item_category_id">
                          <option value="">Select Category</option>
                          {this.state.categoryData.map((item) => (
                            <option value={item.id}>{item.name}</option>
                          ))}
                        </select>
                        <span className="error-asterick"> {this.state.categoryError}</span>
                      </div>

                      <h5>Games</h5>
                      <select onChange={this.handleChange} value={this.state.item_subcategory_id} className="form-control" name="item_subcategory_id">
                        <option value="">Select Sub Category</option>
                        {this.state.SingleCategoryData.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                      <span className="error-asterick"> {this.state.singlecategoryError}</span>

                      {/* <div className="">
                        <span className="error-asterick"> {this.state.blockchainTypeError}</span>
                        <h5>Blockchain Type</h5>
                        <select onChange={this.handleChange} value={this.state.blockchainType} className="form-control" name="blockchainType">
                          <option value="">Select type</option>
                          <option value="1">Ethereum</option>
                          <option value="2">Polygon</option>
                        </select>
                        <span className="error-asterick"> {this.state.categoryError}</span>
                      </div> */}

                      <div className="spacer-10" />
                      <h5>Royalties(% in ETH)</h5>
                      <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="royaltie" id="item_royalties" className="form-control" placeholder="suggested: 0%, 5%, 10%, 20%" />
                      <div className="spacer-10" />
                      <h5>Select sale method</h5>
                      <div className="de_tab tab_methods">
                        <ul className="de_nav">
                          <li onClick={this.sellType.bind(this, 1)} className={this.state.sell_type == '1' ? "active" : ''}><span><i className="fa fa-tag" />Price</span>
                          </li>
                          <li onClick={this.sellType.bind(this, 2)} className={this.state.sell_type == '2' ? "active" : ''}><span><i className="fa fa-hourglass-1" />Timed auction</span>
                          </li>
                        </ul>
                        <div className="de_tab_content">
                          <div id="tab_opt_1" style={{ display: this.state.sell_type == '1' ? 'block' : 'none' }}>
                            <h5>Price{this.state.blockchainType == 1 ? '(ETH)' : this.state.blockchainType == 2 ? '(Matic)' : ''} </h5>
                            <input type="text" onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} name="price" id="item_price_bid" className="form-control" placeholder="Enter Price" />
                            <p>Approx Gas price:{parseFloat(this.state.currentTrxFee).toFixed(6)}</p>
                          </div>
                          <div id="tab_opt_2" style={{ display: this.state.sell_type == '2' ? 'block' : 'none' }}>
                            <h5>Minimum bid{this.state.blockchainType == 1 ? '(ETH)' : this.state.blockchainType == 2 ? '(Matic)' : ''}</h5>
                            <input type="text" name="minimum_bid_amount" value={this.state.minimum_bid_amount} onKeyPress={(event) => { if (!/^\d*[.]?\d{0,1}$/.test(event.key)) { event.preventDefault(); } }} onChange={this.handleChange} id="item_price_bid" className="form-control" placeholder="Enter Minimum Bid" />
                            <p>Approx Gas price:{parseFloat(this.state.currentTrxFee).toFixed(6)}</p>
                            <div className="spacer-10" />
                            <div className="row">
                              <div className="col-md-6">
                                <h5>Starting date</h5>
                                <input type="date" onChange={this.handleChange} name="start_date" id="bid_starting_date" className="form-control" min={this.state.currentDate} />
                              </div>
                              <div className="col-md-6">
                                <h5>Expiration date</h5>
                                <input type="date" onChange={this.handleChange} min={this.state.endDate} name="expiry_date" id="bid_expiration_date" className="form-control" />
                              </div>
                              <div className="spacer-single" />
                            </div>
                          </div>
                          <div id="tab_opt_3" style={{ display: this.state.sell_type == '3' ? 'block' : 'none' }}>
                          </div>
                        </div>
                      </div>
                      <div className="spacer-10" />
                      {this.state.spinLoader === '0' ?
                        <input type="submit" onClick={this.createUserNft.bind(this)} id="submit" className="btn-main" defaultValue="Create Item" />
                        :
                        <input type="submit" onClick={this.createUserNft.bind(this)} id="submit" className="btn-main" defaultValue="Create Item" />
                        // <button disabled className="btn-main" id="deposit-page" >Creating NFT &nbsp;<i className="fa fa-spinner fa-spin validat"></i></button>
                      }
                      <div className="spacer-single" />
                    </div></form>
                </div>
                <div className="col-lg-2 col-sm-6 col-xs-12">
                </div>
              </div>
            </div>
          </section>
        </div>


        <div className={this.state.isCollectionModelOpen == 1 ? 'modal fade in show' : 'modal fade'} style={{display:  this.state.isCollectionModelOpen == 1 ? 'block' : 'none'}} id="createCollection" tabindex="-1" aria-labelledby="createCollectionLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg" id='create_nft_modal'>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createCollectionLabel">Add Collection</h5>
                <button type="submit" className="btn-close" onClick={this.closeModel.bind(this)}></button>
              </div>
              <div className="modal-body" >
              <div className="row">
                  <div className="col-sm-12 col-xs-12">
                    <div className="tab-content create-collection" id="v-pills-tabContent">
                      <div className="be-large-post">
                        <div className="row">
                          <div className="col-sm-4">
                            <h4>Image</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">
                              {this.state.cl_image_preview === '' ?
                                <img style={{ height: '150px', width: '150px' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '150px' }} id="image" className="object-cover w-full h-32" src={this.state.cl_image_preview} />
                              }

                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" onclick="document.getElementById('fileInput').click()">
                                {this.state.cl_image_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                              </div>

                              <input name="cl_profile_pic" onChange={this.profilePicChange.bind(this)} id="fileInput" accept="image/*" className="hidden" type="file" />
                            </div>
                            <span className="error-asterick"> {this.state.imageError}</span>
                          </div>
                          <div className="col-sm-8 upload-cover">
                            <h4>Cover Photo</h4>
                            <div className="w-32 h-32 mb-1  rounded-lg overflow-hidden relative bg-gray-100">

                              {this.state.cl_banner_preview === '' ?
                                <img style={{ height: '150px', width: '100%' }} className="object-cover w-full h-32" src="https://placehold.co/300x300/e2e8f0/e2e8f0" alt="" /> :
                                <img style={{ height: '150px', width: '100%' }} id="image" className="object-cover w-full h-32" src={this.state.cl_banner_preview} />
                              }
                              <div className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center" type="file" >
                                {this.state.cl_banner_preview === '' ?
                                  <button type="button" style={{ backgroundColor: '#ffffff6e' }} className="hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-camera" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x={0} y={0} width={24} height={24} stroke="none" />
                                      <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                      <circle cx={12} cy={13} r={3} />
                                    </svg>
                                  </button>
                                  : ""}
                                <input id="fileInput" onChange={this.bannerPicChange.bind(this)} className="hidden" type="file" name="cl_coverPhoto" accept=".png,.jpg,.jpeg" />
                              </div>
                              <span className="error-asterick"> {this.state.coverError}</span>
                            </div>
                          </div>
                        </div>

                        <div className="spacer-single" />
                        <div className="socail_news">
                          <h5>Name</h5>
                          <input type="text" name="cl_name" onChange={this.handleChange} value={this.state.cl_name} className="form-control mb-4" placeholder="e.g. 'Crypto Funk" />
                          <span className="error-asterick"> {this.state.clnameError}</span>
                        </div>
                        <div class="socail_news">
                          <h5>Description</h5>
                          <textarea name="cl_description" onChange={this.handleChange} value={this.state.cl_description} id="item_desc" class="form-control" placeholder="e.g. 'This is very limited item'" style={{ height: '66px' }}></textarea>
                          <span className="error-asterick"> {this.state.cldescError}</span>
                        </div>
                        <div class="socail_news mt-3">
                          <h5>Website Link</h5>
                          <input type="text" name="website" onChange={this.handleChange} value={this.state.website} id="item_title" class="form-control mb-4" placeholder="e.g. https://example.com" />
                        </div>
                        <div className="social-icons mt-1" style={{ backgroundSize: 'cover' }}>
                          <h5>Link social media</h5>
                          <div className="be-large-post-align">
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-1" href="#"><i className="fa fa-facebook" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="facebook" onChange={this.handleChange} value={this.state.facebook} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-2" href="#"><i className="fa fa-twitter" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="twitter" onChange={this.handleChange} value={this.state.twitter} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-3" href="#"><i className="fa fa-telegram " /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="telegram" onChange={this.handleChange} value={this.state.telegram} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-5" href="#"><i className="fa fa-instagram" /></a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="insta" onChange={this.handleChange} value={this.state.insta} placeholder="e.g. https://example.com" />
                              </div>
                            </div>
                            <div className="social-input form-group focus-2">
                              <div className="s_icon">
                                <a className="social-btn color-5" href="#">
                                  <div className="discord-img"><img src="images/discord.png" /></div>
                                </a>
                              </div>
                              <div className="s_input">
                                <input className="form-control" type="text" name="discord" onChange={this.handleChange} value={this.state.discord} placeholder="e.g. https://example.com" />
                              </div>
                            </div>

                            <div className="socail_news mt-4">
                              <button id="submit" className="btn-main" type="submit" onClick={this.createCollectionAPI}  >Create Collection</button>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={this.closeModel.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
        <Footer />

      </>
    )
  }
}