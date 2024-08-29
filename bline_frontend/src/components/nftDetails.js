import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon, EmailIcon, EmailShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'js-cookie';
// import toast, { Toaster } from 'react-hot-toast';
import { Player } from 'video-react';
import { Dialog, Classes } from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import BarLoader from 'react-bar-loader'
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Countdown, { zeroPad } from 'react-countdown';
import { default as ReactSelect } from "react-select";
// import { colourOptions } from "data.js";
import { components } from "react-select";

import Web3 from 'web3';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
import { createHashHistory } from 'history'
import ReactTooltip from 'react-tooltip';

const history = createHashHistory()
const now = moment()

export default class liveauction extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bnbtousd: '',
      usdtobnb: '',
      cryptoPayBtnDesable: 0,
      ethtousd: '',
      usdtoeth: '',
      paymentSelectError: '',
      nftPurchaseBtn: 0,
      selectCurrency: 0,
      Collapsible: [],
      nftDetails: {},
      isActive: 1,
      isSocial: 0,
      loadingData: '',
      modalopen: '',
      copied: false,
      modalopen1: '',
      bid_price: '',
      Biderror: '',
      maxBid: '',
      timerStart: false,
      startTimerStart: false,
      isResponse: false,
      isDialogOpen: false,
      ConnectWalletAddress: '',
      spinLoader: 0,
      getMarketActivityList: [],
      getBidDetailDataPrint: [],
      setAnchorEl: null
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.onChange = this.onChange.bind(this)

  }


  handleClick = (event) => {
    this.setState({
      setAnchorEl: event.currentTarget

    })
  };
  handleClose = () => {
    this.setState({
      setAnchorEl: null

    })
  };

  async getDetail(itemLike) {

    this.setState({
      isResponse: true
    })

    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: {
        "user_id": this.loginData.id ? this.loginData.id : "0",
        "item_id": this.props.match.params.id,
        "itemLike": itemLike
      }
    }).then((res) => {
      if (res.data.success === true) {

        let time = res.data.response.expiry_date;
        time = new Date(time);
        time = time.getTime();
        let cc = new Date();
        cc = cc.getTime();
        var diff = Math.round(parseInt(time) / 1000) - (parseInt(cc) / 1000);

        if (diff <= (24 * 3600)) {
          this.setState({
            timerStart: true
          })
        }

        let startTime = res.data.response.start_date;
        startTime = new Date(startTime);
        startTime = startTime.getTime();
        let curDate = new Date();
        curDate = curDate.getTime();
        var diff1 = Math.round(parseInt(startTime) / 1000) - (parseInt(curDate) / 1000);

        if (diff1 <= (24 * 3600)) {
          this.setState({
            startTimerStart: true
          })
        }

        this.setState({
          nftDetails: res.data.response,
          maxBid: parseFloat((res.data.response?.max_bid * res.data.settingData?.bid_increase_percentage / 100) + parseFloat(res.data.response?.max_bid)).toFixed(6),
          bidIncreasePercentage: res.data.settingData?.bid_increase_percentage,
          isResponse: false
        })
      }

    }).catch((error) => {

    })
  }

  //=======================================  Bid details  =====================

  async getBidDetailAPIData() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getItemBidDetail`,
      data: { "item_id": this.props.match.params.id }
    })
      .then(result => {
        if (result.data.success === true) {
          this.setState({
            getBidDetailDataPrint: result.data.response,

          })
        }
        else if (result.data.success === false) {
        }
      }).catch(err => {
        this.setState({
          getBidDetailDataPrint: []

        })

      });
  }

  //=====================================  change event ===============================

  async getBnbPriceAPI() {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`,
    }).then(response => {
      this.setState({
        bnbtousd: response.data.price,
        usdtobnb: 1 / response.data.price
      })
    })
  }

  async getEthPriceAPI() {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`,
    }).then(response => {
      this.setState({
        ethtousd: response.data.price,
        usdtoeth: 1 / response.data.price
      })
    })
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  selectCur(type) {
    this.setState({
      selectCurrency: type,
      paymentSelectError: ''
    })
  }

  componentDidMount() {
    this.getDetail(0)
    this.getBnbPriceAPI();
    this.getEthPriceAPI();
    this.getMarketplaceActivityAPI();
    this.getBidDetailAPIData()

    setTimeout(() => {
      if (window.ethereum) {
        const { ethereum } = window;
        this.setState({
          ConnectWalletAddress: ethereum.selectedAddress
        })
      }
    }, 1000);

  }

  getEthlivePrice = async () => {
    await axios({
      method: 'get',
      url: `https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`,
    }).then(response => {
      this.setState({ ETHlivePrice: parseFloat(response.data.price).toFixed(2) })
    })

  }

  isActiveTab(id) {
    if (id === 1) {
      this.setState({
        isActive: 1
      })
    }
    else if (id === 2) {
      this.setState({
        isActive: 2
      })
    }
    else if (id === 3) {
      this.setState({
        isActive: 3
      })
    }
  }

  modalShow(id) {
    if (id === 1) {

      this.setState({
        isSocial: 1
      })
    }
    else if (id === 0) {

      this.setState({
        isSocial: 0
      })
    }
  }

  async checkExpiryAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}checkExpiry`,
      data: { "item_id": this.props.match.params.id }
    })
      .then(result => {
        if (result.data.success === true) {
          window.location.href = 'marketplace'
        }
        else if (result.data.success === false) {

        }
      }).catch(err => {


      });
  }

  async getMarketplaceActivityAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getMarketActivity`,
      data: { "item_id": this.props.match.params.id }
    }).then(result => {
      if (result.data.success === true) {
        this.setState({
          getMarketActivityList: result.data.response
        })
      }
      else if (result.data.success === false) {

      }
    }).catch(err => {


    });
  }

  //========================================================  check for bid  ==============================================

  async bidItem(id) {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    }
    else if (id === 2) {
      this.setState({
        modalopen: 1
      })
    }
  }

  async nftPurchaseModel(id) {
    if (this.loginData.length === 0) {
      window.location.href = `${config.baseUrl}login`
    }
    else if (id === 1) {
      this.setState({
        modalopen1: 1
      })
    }
  }

  closebutton() {
    this.setState({
      modalopen: '',
      modalopen1: ''
    })
  }

  //=========================================================  purchase/Bid the item  =======================================

  async purchaseItem() {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    } else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = this.state.nftDetails.price;
      let coin = this.state.nftDetails.blockchainType;
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;
        // let eth_mainnet = 0x1;
        // let eth_testnet = 0x3;

        // let matic_mainnet = 137;
        // let matic_testnet = 80001;

        if (currentNetwork !== '0x3') {
          toast.error('Please select ETH testnet network!');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
        try {
          tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          let from_address = accounts[0];
          var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
          var currentBal = parseFloat(getBalace).toFixed(6)
          if (currentBal < this.state.nftDetails.price) {
            toast.error(`Insufficient fund for transfer`);
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }

          this.setState({
            spinLoader: 1,
            isDialogOpen: true
          })
          await this.trnasferNFT(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: 0,
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }

  async trnasferNFT(tokenId, coin, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = web3.currentProvider.chainId;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        let cryptoAmount = tokenPrice;
        let itemPrice = 0;

        itemPrice = tokenPrice / 10 ** 18;
        tx_builder = await contract.methods.buy(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(cryptoAmount),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            txHash: txData.transactionHash,
            itemPrice: itemPrice,
            from_address: contractAddress,
            to_address: from_address,
            paymentType: coin
          }
          console.log('>>>', paymentArr);
          this.buyItemAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
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
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }

    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async buyItemAPI(paymentArr) {
    const token = this.token

    await axios({
      method: 'post',
      headers: { authorization: token },
      url: `${config.apiUrl}nftPurchase`,
      data: {
        "item_id": this.state.nftDetails?.item_id,
        "sell_type": this.state.nftDetails?.sell_type,
        "user_id": this.loginData?.id,
        "owner_id": this.state.nftDetails?.owner_id,
        "user_name": this.loginData?.first_name + ' ' + this.loginData?.last_name,
        "price": paymentArr.itemPrice,
        "cryptoPrice": paymentArr.cryptoPrice,
        "buyerAddress": paymentArr.from_address,
        "to_address": paymentArr.to_address,
        "tokenId": this.state.nftDetails?.token_id,
        "trx_amount": paymentArr.trx_amount,
        "trx_currency": this.state.paymentType,
        "trx_hash": paymentArr.txHash,
        "itemName": this.state.nftDetails?.name,
        "itemimage": this.state.nftDetails?.image,
        "owner_address": this.state.nftDetails?.owner_address,
        "trx_type": "Crypto"
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          this.props.history.push({
            pathname: `${config.baseUrl}accountsetting`,
            state: { detail: 1 }
          })
          // window.location.href = `${config.baseUrl}marketplace`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again.`);
      }
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again.`);
      this.setState({
        nftPurchaseBtn: 0
      })
    });
  }

  getTimeOfStartDate(dateTime) {
    var date = new Date(dateTime); // some mock date
    var milliseconds = date.getTime();
    return milliseconds;
  }

  CountdownTimer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      // Render a completed state
      return "Starting";
    } else {
      // Render a countdowns
      var dayPrint = (days > 0) ? days + 'd' : '';
      return <span>{dayPrint} {zeroPad(hours)}h {zeroPad(minutes)}m {zeroPad(seconds)}s</span>;
    }
  };

  async likeCount(item_id) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getDetail(1);
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please connect metamask!!');
    }
  }

  async bidPlaced() {
    if (!this.loginData?.id) {
      toast.error('Please connect wallet!!');
    } else {
      let tokenId = this.state.nftDetails.token_id;
      let tokenPrice = parseFloat(this.state.bid_price).toFixed(6);
      console.log(parseFloat(this.state.nftDetails.max_bid).toFixed(6), tokenPrice);
      if ((parseFloat(this.state.nftDetails.max_bid).toFixed(6)) > tokenPrice) {
        toast.error('Bid amount should be higher than max bid amount!!');
        return false;
      }
      let coin = this.state.nftDetails.blockchainType;

      if (window.ethereum) {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let web3 = new Web3(window.ethereum);
        let currentNetwork = web3.currentProvider.chainId;
        // let eth_mainnet = 0x1;
        // let eth_testnet = 0x3;

        // let matic_mainnet = 137;
        // let matic_testnet = 80001;

        if (coin == 1) {
          if (currentNetwork !== '0x3') {

            toast.error('Please select BNB Testnet network!');
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }
        } else {
          if (currentNetwork !== '80001') {

            toast.error('Please select Matic Testnet network!');
            this.setState({
              spinLoader: '0',
              isDialogOpen: false
            })
            return false;
          }
        }

        try {
          this.setState({
            spinLoader: '0',
            modalopen: '',
            isDialogOpen: true
          })

          if (coin == 1) {
            tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          } else {
            tokenPrice = parseInt((parseFloat(tokenPrice)) * 10 ** 18);
          }

          await this.placeBidNow(tokenId, coin, tokenPrice);
        } catch (error) {
          toast.error('Something went wrong please try again2.');
          this.setState({
            spinLoader: '0',
            isDialogOpen: false
          })
          return false;
        }
      } else {
        toast.error('Please Connect to MetaMask.');
        this.setState({
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    }
  }


  async placeBidNow(tokenId, coin, tokenPrice) {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      let web3 = new Web3(window.ethereum);
      var chainId = config.bnb_chain;
      try {

        let contractAddress = `${config.marketplaceContract}`
        let from_address = accounts[0];

        const contract = await new web3.eth.Contract(config.abiMarketplace, contractAddress);
        let tx_builder = '';
        tx_builder = await contract.methods.placeBid(tokenId.toString());

        let encoded_tx = tx_builder.encodeABI();
        let gasPrice = await web3.eth.getGasPrice();

        let gasLimit = await web3.eth.estimateGas({
          gasPrice: web3.utils.toHex(gasPrice),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        const txData = await web3.eth.sendTransaction({
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gasLimit),
          to: contractAddress,
          from: from_address,
          chainId: chainId,
          value: web3.utils.toHex(tokenPrice),
          data: encoded_tx
        });

        if (txData.transactionHash) {
          var paymentArr = {
            bidAmount: parseFloat(this.state.bid_price).toFixed(6),
            txHash: txData.transactionHash,
          }
          this.bidPlaceAPI(paymentArr)
        } else {
          toast.error('Something went wrong please try again3.');
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
          spinLoader: '0',
          isDialogOpen: false
        })
        return false;
      }
    } else {
      toast.error('Please Connect to MetaMask.');
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      return false;
    }
  }

  async bidPlaceAPI(paymentArr) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}insertBid`,
      data: {
        "bid_price": paymentArr.bidAmount,
        "user_id": this.loginData?.id,
        "item_id": this.state.nftDetails?.item_id,
        "txhash": paymentArr.txHash,
      }
    }).then(async response => {
      if (response.data.success === true) {
        toast.success(response.data.msg);
        setTimeout(() => {
          window.location.href = `${config.baseUrl}marketplace`
        }, 2000);
      } else {
        toast.error(`Something went wrong! Please try again6.`);
      }
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    }).catch(err => {
      toast.error(`Something went wrong! Please try again7.`);
      this.setState({
        spinLoader: '0',
        isDialogOpen: false
      })
      this.setState({
        nftPurchaseBtn: 0
      })
    });
  }


  refresh() {
    window.location.reload()
  }

  render() {
    const open = Boolean(this.state.setAnchorEl);

    return (

      <>
        <div id="wrapper">
          <Header />
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
          <div className="no-bottom no-top product-detail" id="content">
            <div id="top" />
            <section aria-label="section" className="mt90">
              <div className='container'>
                <div className='row'>
                  <div className='col-sm-5'>
                    <div className='product-detail-image'>
                      {this.state.nftDetails.file_type === 'image' ?
                        <img style={{ width: '100%', height: '364px' }} src={`${config.imageUrl}${this.state.nftDetails.image}`} className="img-fluid img-rounded mb-sm-30" alt="" /> :
                        this.state.nftDetails.file_type === 'video' ?
                          <Player style={{ width: '546px', height: '364px' }} className="img-fluid img-rounded mb-sm-30" src={`${config.imageUrl}${this.state.nftDetails.image}`} /> :
                          <img style={{ width: '100%', height: '364px' }} src={`${config.imageUrl}${this.state.nftDetails.image}`} className="img-fluid img-rounded mb-sm-30" alt="" />
                      }
                      {/* <img src='https://lh3.googleusercontent.com/YC6rTwQ0xmiuQ3jXooImL8bihV5Rb5QvFN_cBj4gj9eTcjHwZaveI63RmPVOYfcYj0hPpP0n2uriRKo12QPN43T6E4cxCnMe5L4v6Q=w600' width='100%' /> */}

                    </div>
                    <div className='list-accordion description-box'>
                      <div className='item-detail'>
                        <ul>
                          <li><i className='fa fa-align-justify'></i>&nbsp;&nbsp;Description </li>
                          <hr className='mb-0 mt-0' />
                            <li>
                              <div className='col-sm-12'>
                                <p className="mt-3 mb-0">Created by <Link to={`${config.baseUrl}UserProfile/${this.state.nftDetails.created_by}`}> {this.state.nftDetails.creator}</Link></p>
                                <p>
                              {this.state.nftDetails.description}
                            </p>


                              </div>


                            </li>
                        </ul>
                      </div>
                      <Accordion>
                        <AccordionItem style={{ borderTopLeftRadius: "0", borderTopRightRadius: "0", borderTop: "0px solid #000" }}>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              <img src="images/details.png" class="accordian_icon" width="16px" />&nbsp;About {this.state.nftDetails.collection_name}
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                           
                            <div className='col-sm-12 text-center'>
                              <div className='list-line-icon '>
                                <a href={this.state.nftDetails.collection_pic} target="_blank">
                                <img src={this.state.nftDetails.collection_pic} className="collection-pic-nft"/></a>
                                {/* <a href='javascript:void(0)' onClick={this.refresh.bind(this)} className='btn links'><span className='icon_refresh'></span></a> */}
                                {/* <a className='btn links'><span className='material-icons'>&#xe89e;</span></a> */}
                                {/* <a className='btn links'><span className='social_share'></span></a> */}
                                {/* <a className='btn links' ><span className='fa fa-ellipsis-v'></span></a> */}
                              </div>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                        <AccordionItem>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              <i className='fa fa-th-list'></i>&nbsp;Details
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <div className='table-responsive'>
                              <table className='table text-left'>
                                <thead>
                                  <tr>
                                    <th>Contract Address</th>
                                    {this.state.nftDetails.contract_address != undefined ?
                                      <td className='text-right'>
                                        <a href={config.blockchinUrl+ this.state.nftDetails.contract_address} target="_blank">
                                        {this.state.nftDetails.contract_address.toString().substring(0, 5) + '...' + this.state.nftDetails.contract_address.toString().substr(this.state.nftDetails.contract_address.length - 5)}</a></td>
                                      : ""}
                                  </tr>
                                  <tr>
                                    <th>Token ID</th>
                                    <td className='text-right'>{this.state.nftDetails.token_id ? this.state.nftDetails.token_id : '0'}</td>
                                  </tr>
                                  <tr>
                                    <th>Token Standard</th>
                                    <td className='text-right'>ERC-721</td>
                                  </tr>
                                  <tr>
                                    <th>Blockchain</th>
                                    {/* <td className='text-right'>{this.state.nftDetails.blockchain}</td> */}
                                    <td className='text-right'>ETH</td>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </AccordionItemPanel>
                        </AccordionItem>
                      </Accordion>


                    </div>

                  </div>
                  <div className='col-sm-7'>
                    <div className='product-detail-summary details_sec'>
                      <div className='row'>
                        <div className='col-sm-6'>
                          {/* <a className='links'>MZI CLUB</a> */}

                        </div>
                        <div className='col-sm-6 text-right'>
                          <div className='list-line-icon pull-right'>
                            <a href='javascript:void(0)' onClick={this.refresh.bind(this)} className='btn links'><span className='icon_refresh'></span></a>
                            {/* <a className='btn links'><span className='material-icons'>&#xe89e;</span></a> */}
                            {/* <a className='btn links'><span className='social_share'></span></a> */}
                            {/* <a className='btn links' ><span className='fa fa-ellipsis-v'></span></a> */}
                            <a className='btn links' id="fade-button"
                              aria-controls={open ? 'fade-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? 'true' : undefined}
                              onClick={this.handleClick.bind(this)}><span className='social_share'></span></a>
                            {/* <Button
                              id="fade-button"
                              aria-controls={open ? 'fade-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open ? 'true' : undefined}
                              onClick={this.handleClick.bind(this)}
                            >
                              Dashboard
                            </Button> */}
                            <Menu
                              id="fade-menu"
                              MenuListProps={{
                                'aria-labelledby': 'fade-button',
                              }}
                              anchorEl={this.state.setAnchorEl}
                              open={open}
                              onClose={this.handleClose.bind(this)}
                              TransitionComponent={Fade}
                              style={{ position: 'absolute' }}
                            >
                              <MenuItem>
                                <CopyToClipboard text={window.location.href}
                                  onCopy={() => this.setState({ copied: true })}>
                                  <img src="images/icon.png" style={{ cursor: 'pointer', height: '30px', width: '30px' }} className="link-copy" />
                                  {/* <span>Copy to clipboard with span</span> */}
                                </CopyToClipboard>&nbsp;&nbsp;&nbsp;
                                {this.state.copied ? <span className="mt-1 d-block" >Copied!</span> : <span className="mt-1 d-block" text={window.location.href}
                                  onClick={() => this.setState({ copied: true })}>Copy link</span>}
                              </MenuItem>

                              <FacebookShareButton
                                url={`${config.sharingUrl}${this.id}`}
                                // url={`${config.imageUrl}${this.state.nftDetails?.image}`}
                                quote={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                                style={{ display: 'flex', marginLeft: '17px' }}
                                className="Demo__some-network__share-button">
                                <FacebookIcon target="_blank"
                                  size={30}
                                  round />
                                <MenuItem> Share on Facebook</MenuItem>
                              </FacebookShareButton>



                              <TwitterShareButton
                                url={window.location.href}
                                //  url={`${config.imageUrl}${this.state.nftDetails?.image}`}
                                title={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                                className="Demo__some-network__share-button" style={{ display: 'flex', marginLeft: '17px' }}>
                                <TwitterIcon
                                  size={30}
                                  round />
                                <MenuItem> Share on Twitter</MenuItem>
                              </TwitterShareButton>
                            </Menu>

                          </div>

                        </div>

                      </div>
                      <div className='product-box-detail'>
                        <h3>{this.state.nftDetails && this.state.nftDetails.name}</h3>
                        <div className='item-counts'>
                          <div className='list-line'>
                            Owned by <Link to={`${config.baseUrl}UserProfile/${this.state.nftDetails.owner_id}`} className=''>{this.state.nftDetails.owner}</Link>

                          </div>
                          <div className='list-line'>
                            <span><i className='fa fa-eye'></i>&nbsp;{this.state.nftDetails.view_count} views</span>


                          </div>
                          <br/>
                          {this.state.nftDetails.is_on_sale === 0 ? '' :
                          this.state.nftDetails.sell_type === 1 || this.state.nftDetails.expiry_date === null ? '' : <div style={{marginTop:'10px'}} className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />&nbsp;&nbsp;
                            {new Date(this.state.nftDetails.start_date) > new Date() ?
                              <>
                                Sale start in <br />
                                {(this.state.nftDetails.start_date && this.state.startTimerStart) ?
                                <span style={{fontSize:'20px'}}>
                                  <Countdown
                                    date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                    renderer={this.CountdownTimer}
                                    
                                  />
                                  </span>
                                   :
                                  <>
                                    {/* <span className="days">{moment(this.state.nftDetails.start_date).diff(moment(), 'days')} day </span> */}
                                    <span style={{fontSize:'20px'}}>
                                    <Countdown
                                    date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                    renderer={this.CountdownTimer}
                                  />
                                  </span>

                                  </>
                                }
                                &nbsp;
                                ({moment(this.state.nftDetails.start_date).format('LLL')})
                              </>
                              :
                              new Date(this.state.nftDetails.expiry_date) > new Date() ?
                                <>
                                  Sale ends in &nbsp; <br />
                                  {(this.state.nftDetails.expiry_date && this.state.timerStart) ?
                                    <span style={{fontSize:'20px'}}>
                                    <Countdown
                                      date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                      renderer={this.CountdownTimer}
                                    /> </span> :
                                    <>
                                      {/* <span className="days">{moment(this.state.nftDetails.expiry_date).diff(moment(), 'days')} day </span> */}
                                      <span style={{fontSize:'20px'}}>
                                      <Countdown
                                      date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                      renderer={this.CountdownTimer}
                                    />   </span>                                    
                                    </>
                                  }
                                  &nbsp;
                                  ({moment(this.state.nftDetails.expiry_date).format('LLL')})
                                </>
                                :
                                "Sale ends"
                            }

                          </div>}

                        </div>
                        <div className='item-detail'>
                          <ul>

                            <li>
                              <div className='col-sm-8'>
                                <span style={{ fontSize: '20px' }}>Price</span>
                                <div className='row'>
                                  <div className="nft-item-price" style={{ marginTop: '10px' }}>
                                    {this.state.nftDetails?.blockchainType == 1 ?
                                      <img src="images/eth.svg" style={{ width: '15px' }} alt />
                                      :
                                      <img src="images/eth.svg" style={{ width: '15px' }} alt />
                                    }
                                    &nbsp;
                                    <span>{this.state.nftDetails?.price ? this.state.nftDetails?.price : '0.00'}</span>&nbsp;(${parseFloat(this.state.ethtousd * this.state.nftDetails?.price).toFixed(2)})</div>
                                  <div className='col-sm-10 mt-2'>
                                    {this.state.nftDetails.is_sold === 1 ?
                                      <p style={{ color: 'red' }}>Sold Out</p> :
                                      this.state.nftDetails.sell_type === 1 ?
                                        <button className='btn btn-primary buy-now-btn' disabled={this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><i className='fa fa-tag'></i>&nbsp;
                                          {this.state.nftDetails.sell_type === 1 ?
                                            'Buy' : "Place Bid"}</button>
                                        :
                                        <button className='btn btn-primary buy-now-btn' disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><i className='fa fa-tag'></i>&nbsp;
                                          {this.state.nftDetails.sell_type === 1 ?
                                            'Buy' : "Place Bid"}</button>
                                    }
                                    {/* <button  className='btn btn-primary buy-now-btn'><i className='fa fa-tag'></i>&nbsp; Place Bid</button> */}

                                  </div>
                                  <div className='col-sm-2 mt-2'>
                                  {this.loginData.id == this.state.nftDetails.owner_id ?
                                    <>
                                    <span className='tooltip-small'>
                                      <i style={{ fontSize: '25px' }} class="fa fa-exclamation-circle" data-tip={'You are the owner of this NFT.'} aria-hidden="true"></i>
                                      <ReactTooltip />
                                      </span>
                                    </> : ''
                                  }
                                  </div>

                                </div>


                              </div>


                            </li>
                          </ul>
                        </div>
                        <div className='row'>
                          <div className='col-sm-12'>
                            <div className='list-accordion'>
                              <Accordion>
                                <AccordionItem>
                                  <AccordionItemHeading>
                                    <AccordionItemButton>
                                      <img src='images/graph.png' width="16px" /> Price History
                                    </AccordionItemButton>
                                  </AccordionItemHeading>
                                  <AccordionItemPanel>
                                    <div className='row'>
                                      <div className='col-sm-4'>
                                        <select className='form-control'>
                                          <option>Last 7 Days</option>
                                          <option>Last 14 Days</option>
                                          <option>Last 30 Days</option>
                                          <option>Last 60 Days</option>
                                          <option>Last 90 Days</option>
                                          <option>Last Year</option>
                                          <option>All Time</option>

                                        </select>

                                      </div>
                                      <div className='col-sm-8'>


                                      </div>
                                      <div className='col-sm-4'>


                                      </div>
                                      <div className='col-sm-4 mt-4 text-center'>
                                        <img src='images/no-chart-data.svg' /><br />
                                        No item activity yet

                                      </div>
                                      <div className='col-sm-4'>

                                      </div>
                                    </div>
                                  </AccordionItemPanel>
                                </AccordionItem>
                                {/* <AccordionItem>
                          <AccordionItemHeading>
                              <AccordionItemButton>
                                  <i className='fa fa-tag'></i> &nbsp;Listings
                              </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                              <p>
                                  In ad velit in ex nostrud dolore cupidatat consectetur
                                  ea in ut nostrud velit in irure cillum tempor laboris
                                  sed adipisicing eu esse duis nulla non.
                              </p>
                          </AccordionItemPanel>
                      </AccordionItem> */}
                                {/* <AccordionItem>
                                  <AccordionItemHeading>
                                    <AccordionItemButton>
                                      <i className='fa fa-list-ul'></i>&nbsp;Offers
                                    </AccordionItemButton>
                                  </AccordionItemHeading>
                                  <AccordionItemPanel>
                                    <div className='offer'>
                                      <div className='table-responsive'>
                                        <table className='table'>
                                          <thead>
                                            <tr>
                                              <th>Price</th>
                                              <th>USD Price</th>
                                              <th>Floor difference</th>
                                              <th>Expiration</th>
                                              <th>From</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td><div><img src='images/eth.svg' width="16px" />&nbsp;<strong>0.219</strong> WETH</div></td>


                                              <td><div>$789.93</div></td>


                                              <td><div>39% below</div></td>


                                              <td><a href='#'>in 15 hours</a></td>


                                              <td>560825</td>

                                            </tr>
                                            <tr>
                                              <td><div><img src='images/eth.svg' width="16px" />&nbsp;<strong>0.219</strong> WETH</div></td>


                                              <td><div>$789.93</div></td>


                                              <td><div>39% below</div></td>


                                              <td><a href='#'>in 15 hours</a></td>


                                              <td>560825</td>

                                            </tr>


                                          </tbody>
                                        </table>
                                      </div>

                                    </div>
                                  </AccordionItemPanel>
                                </AccordionItem> */}
                              </Accordion>
                              {/* <div class="accordion" id="accordionExample">
                                <div class="accordion-item">
                                  <h2 class="accordion-header" id="headingOne">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                      Price History
                                    </button>
                                  </h2>
                                  <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                      <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item">
                                  <h2 class="accordion-header" id="headingTwo">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                      <i className='fa fa-tag'></i> &nbsp;Listings
                                    </button>
                                  </h2>
                                  <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                      <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item">
                                  <h2 class="accordion-header" id="headingThree">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                      <i className='fa fa-list-ul'></i>&nbsp;Offers
                                    </button>
                                  </h2>
                                  <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                      <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                    </div>
                                  </div>
                                </div>
                              </div> */}

                            </div>

                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                </div>
                {/* {this.state.nftDetails.sell_type === 2 ?
                  <div className='row'>
                    <div className='col-sm-12'>
                      <div className='list-accordion'>
                        <Accordion>
                          <AccordionItem>
                            <AccordionItemHeading>
                              <AccordionItemButton>
                                <i className='fa fa-exchange' style={{ transform: 'rotate(90deg)' }}></i>&nbsp;Trading History
                              </AccordionItemButton>
                            </AccordionItemHeading>
                            <AccordionItemPanel>
                              <div className='col-sm-12'>
                                <span
                                  class="d-inline-block"
                                  data-toggle="popover"
                                  data-trigger="focus"
                                  data-content="Please selecet account(s)"
                                >
                                  <ReactSelect
                                    options={this.state.colourOptions}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    styles={{ width: "100%" }}
                                    onChange={this.handleChange}
                                    allowSelectAll={true}

                                  />
                                </span>
                              

                              </div>
                              <div className='col-sm-12 mt-4'>
                                <div className='table-responsive'>
                                  <table className='table'>
                                    <thead>
                                      <tr>
                                        <th>Event</th>
                                        <th>Price</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {this.state.getBidDetailDataPrint.map((item) => <tr>
                                        <td><div><i className='fa fa-tag'></i>&nbsp;List</div></td>
                                        <td><div><img src='images/eth.svg' width="16px" />&nbsp;{parseFloat(item.amount / this.state.ETHlivePrice).toFixed(5)}</div></td>
                                        <td><div><a href='#'>MZIBRO</a></div></td>
                                        <td><div></div></td>
                                        <td><div>{moment(item.transaction_date).diff(now, 'days')} days ago</div></td>
                                      </tr>)}
                                     
                                    </tbody>

                                  </table>
                                </div>

                              </div>

                            </AccordionItemPanel>
                          </AccordionItem>

                        </Accordion>

                      </div>


                    </div>


                  </div> : ''} */}

              </div>

            </section>

            {/* {this.state.nftDetails.sell_type == 2 ? */}
              <div className='container mb-4'>
                <div className='col-sm-12'>
                  <div className='table-responsive'>
                    <table className='table table-striped' width="100%">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Event</th>
                          <th>Price</th>
                          <th>From</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.getMarketActivityList.map((item, i) => {
                          return (
                            <tr>
                              <td>{i + 1}</td>
                              <td>
                                {item.transaction_type}
                              </td>
                              <td>
                                {item.amount} {item.blockchainType == 1 ? 'ETH' : 'ETH'}
                              </td>
                              <td>
                                <Link to={`${config.baseUrl}UserProfile/` + item.user_id}>
                                  {item.full_name}
                                </Link>
                              </td>
                              <td>
                                {item.transaction_date}
                              </td>
                            </tr>
                          )
                        })}

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* : ""} */}


          </div>
          <Footer />
        </div>

        <div className={this.state.isSocial === 0 ? "modal fade" : "modal fade show"} id="productShareSheet" style={{ display: this.state.isSocial === 0 ? 'none' : 'block' }} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Share this Creation</h5>
                <button type="button" className="close" data-dismiss="modal" style={{
                  fontSize: '26px'
                }} aria-label="Close" onClick={this.modalShow.bind(this, 0)} >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-sm-12">
                  <div className="row text-center">


                    <div className="col-sm-2">

                    </div>
                    <div className="col-sm-8">

                      <div className="row">

                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3">

                          <FacebookShareButton
                            // url={`${config.sharingUrl}${this.id}`}
                            url={`${config.imageUrl}${this.state.nftDetails?.image}`}
                            quote={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}

                            className="Demo__some-network__share-button">
                            <FacebookIcon target="_blank"
                              size={32}
                              round />
                          </FacebookShareButton>

                          <br />
                          <span className="mt-1 d-block">Facebook</span>
                        </div>

                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-1">

                          <TwitterShareButton
                            url={window.location.href}
                            //  url={`${config.imageUrl}${this.state.nftDetails?.image}`}
                            title={this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            className="Demo__some-network__share-button">
                            <TwitterIcon
                              size={32}
                              round />
                          </TwitterShareButton>
                          <br />
                          <span className="mt-1 d-block">Twitter</span>
                        </div>



                        <div className="d-inline-block col-sm-4 col-xs-4 text-center mb-3 pb-4">

                          <EmailShareButton
                            url={window.location.href}

                            subject={"Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.nftDetails?.name + '-' + "\n" + this.state.nftDetails?.description}
                            body={"hey there, pls share my link" + <a href={window.location.href}></a>}
                            className="Demo__some-network__share-button">
                            <EmailIcon
                              size={32}
                              round />
                          </EmailShareButton>
                          <br />
                          <span className="mt-1 d-block">Email</span>
                        </div>


                      </div>
                    </div>
                    <div className="col-sm-2"></div>







                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-sm-3"></div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1">
                    <WhatsappShareButton
                      url={window.location.href}
                      title={this.state.nftDetails?.name + '-' + "\n" + "Check out this Rare Digital Art Work from Infinity 8" + "\n" + this.state.nftDetails?.description + "\n"}
                      className="Demo__some-network__share-button">
                      <WhatsappIcon
                        size={32}
                        round />
                    </WhatsappShareButton>
                    <br />
                    <span className="mt-1 d-block">WhatsApp</span>
                  </div>
                  <div className="d-inline-block col-sm-3 col-xs-6 text-center mb-3 pb-1" style={{ margin: '-24px', marginLeft: '2px' }}>

                    <br />
                    <CopyToClipboard text={window.location.href}
                      onCopy={() => this.setState({ copied: true })}>
                      <img src="images/copy-link.png" style={{ cursor: 'pointer' }} className="link-copy" />
                      {/* <span>Copy to clipboard with span</span> */}
                    </CopyToClipboard>
                    {this.state.copied ? <span className="mt-1 d-block">Copied!</span> : <span className="mt-1 d-block">Copy link</span>}

                    {/* <span className="mt-1 d-block">Copy link</span> */}
                  </div>
                  <div className="col-sm-3"></div>


                </div>


              </div>

            </div>
          </div>
        </div>

        {/* //=======================================  Bid modal =================================================================== */}

        <div id="myModal" className={this.state.modalopen === '' ? "modal fade cart-modal" : "modal fade cart-modal show"} role="dialog" style={{ background: 'rgb(6, 6, 6)', display: this.state.modalopen === '' ? 'none' : 'block' }}
          data-backdrop="false">
          <div className="modal-dialog modal-lg" style={{ margin: 'auto', marginTop: '15px' }}>
            <div className="modal-content" style={{ width: '160%', marginLeft: '-150px' }}>
              <div className="modal-header" style={{ borderBottom: "1px solid transparent" }}>
                <button type="button" onClick={this.closebutton.bind(this)} className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body" style={{ padding: '0px' }}>
                <div className="row">
                  <div className="col-md-6  " style={{ borderRight: "1px solid #E0E0E0" }}>
                    <div className="row p-3">
                      <div className="col-sm-12 mb-2 pl-0">
                        <h4 className="strong">{this.state.nftDetails?.name}</h4>
                      </div>
                      <div className="col-md-6 mb-2 pl-0">
                        <span className="h8 weak">
                          <span className="collab-storename">{this.state.nftDetails?.owner}</span>
                        </span>
                      </div>

                      <div className="col-12">
                        <div className="text-center mt-3">
                          {this.state.nftDetails?.file_type === 'audio' ?
                            <img src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" style={{ width: '100%', height: '341px', objectFit: 'fill' }} alt="omg" /> : ''
                          }

                          {this.state.nftDetails?.file_type === 'image' ?
                            <img src={`${config.imageUrl}${this.state.nftDetails?.image}`} style={{ width: '100%', height: '341px', objectFit: 'fill' }} className="img-responsive pr-5 pad-right" /> :
                            this.state.nftDetails?.file_type === 'video' ?
                              <Player className="preview_image_data" src={`${config.imageUrl}${this.state.nftDetails?.image}`} style={{ width: '100%', height: '341px', objectFit: 'fill' }} />
                              : ''
                          }
                          {/* <img src={`${config.imageUrl}${this.state.nftDetails?.image}`} style={{width: "100%"}}/> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="row p-4">
                      <div className="heading-wrapper d-md-block mb-4">
                        <h4 className="strong payment-method-options">Offer Method</h4>
                      </div>
                      <div className="tab-wrapper style-1">

                        <div className="tabs-content clearfix">

                          <div class="tab-info active" style={{ display: 'block' }}>
                            <div className="col-12 mt-3">
                              {this.state.nftDetails?.sell_type_name === 'Price' ?
                                <strong>Price : {parseFloat(parseFloat(this.state.getUsdBalance?.price_eth).toFixed(6)
                                  * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(6)} ETH
                                  ~ ${parseFloat(parseFloat(this.state.nftDetails?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2)).toFixed(2)} <br />
                                  Gas fee : {this.state.getUsdBalance?.txn_fee_eth} ETH ~ ${this.state.getUsdBalance?.txn_fee_usd} <br />
                                  Total payable : {parseFloat((parseFloat(this.state.getUsdBalance?.price_eth).toFixed(6)
                                    * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2))
                                    + parseFloat(this.state.getUsdBalance?.txn_fee_eth)).toFixed(6)} ETH ~ ${parseFloat(parseFloat(this.state.nftDetails?.price).toFixed(2) * parseFloat(this.state.purchased_quantity === '' ? 1 : this.state.purchased_quantity).toFixed(2) + parseFloat(this.state.getUsdBalance?.txn_fee_usd)).toFixed(2)}</strong> :
                                <strong>Your offer must be equal or greater than: {this.state.nftDetails?.max_bid} </strong>}
                            </div>
                            <div className="col-12 mt-3">
                              <div className="input-group">
                                {this.state.nftDetails?.sell_type_name === 'Price' ?
                                  <>
                                    <div className="row">

                                      <div className="col-md-12">
                                        <div class="input-group">
                                          <span class="input-group-btn" style={{ marginRight: '31px' }}>
                                            <button type="button" onClick={this.minusQuantity.bind(this)} class="btn btn-primary btn-number" data-type="minus" data-field="quant[2]">
                                              <span class="glyphicon glyphicon-minus"></span>
                                            </button>
                                          </span>
                                          <input type="text" onKeyPress={(event) => {
                                            if (!/^\d*[]?\d{0,1}$/.test(event.key)) {
                                              event.preventDefault();
                                            }
                                          }} className="form-control border-form" name="purchased_quantity" placeholder="Quantity" value={this.state.purchased_quantity}
                                            onChange={this.onChange} style={{ fontSize: '12px', height: '28px', width: '53px' }} />


                                          <span class="input-group-btn">
                                            <button type="button" onClick={this.plusQuantity.bind(this)} class="btn btn-primary btn-number" data-type="plus" data-field="quant[2]">
                                              <span class="glyphicon glyphicon-plus"></span>
                                            </button>
                                          </span>

                                        </div>
                                      </div>
                                    </div>
                                    <br />
                                  </> :
                                  <>
                                    <div className="input-group-prepend" style={{ backgroundColor: "#fff" }}>
                                      <span className="input-group-text">ETH</span>
                                    </div>
                                    <input type="text" className="form-control currency  ccbid-price"
                                      placeholder="Offer amount" onKeyPress={(event) => {
                                        if (!/^\d*[.]?\d{0,1}$/.test(event.key)) {
                                          event.preventDefault();
                                        }
                                      }} id="bidAmountCC" name="bid_price" value={this.state.bid_price} onChange={this.onChange} required="" />
                                  </>
                                }
                              </div>
                              {this.state.Biderror === 1 ?
                                <p style={{ color: 'red' }}>Bid price should be greater than {this.state.nftDetails?.max_bid}</p> : ''

                              }

                              {this.state.errorAvailable === '1' ?
                                <p style={{ color: 'red' }}>Quantity must be less than Edition</p>
                                :
                                this.state.errorAvailable === '2' ? <p style={{ color: 'red' }}>Quantity must be Greater than 0</p> :
                                  ''
                              }

                            </div>

                            <div className="mt-4">
                              <div className="col-12 nopadding">
                                <span style={{ color: 'red', fontFamily: 'cursive', textAlign: 'center' }}>{this.state.ErrorMessage}</span>

                                <div className="my-3 text-center">
                                  {(this.state.cryptoPayBtnDesable) ?
                                    <button className="btn btn-primary size-1 " title="Place Bid"
                                      mptrackaction="nux:giveapproval" disabled>Processing...</button>
                                    :
                                    this.state.nftDetails?.sell_type_name === 'Price' ?
                                      <button className="btn btn-primary size-1 " title="Place Bid"
                                        mptrackaction="nux:giveapproval"
                                        onClick={this.approvalAPI}>Pay</button> :
                                      <button className="btn btn-primary size-1 " title="Place Bid"
                                        mptrackaction="nux:giveapproval" disabled={!this.state.bid_price}
                                        onClick={this.bidPlaced.bind(this, 2)}>Place Bid</button>
                                  }

                                </div>
                              </div>
                            </div>
                          </div>



                        </div>
                      </div>
                    </div>
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