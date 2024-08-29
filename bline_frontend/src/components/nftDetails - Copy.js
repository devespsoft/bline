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
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Countdown, { zeroPad } from 'react-countdown';
import Web3 from 'web3';
export default class liveauction extends Component {

  constructor(props) {
    super(props)
    this.state = {
      Collapsible: [],
      nftDetails: {},
      isActive: 1,
      isSocial: 0,
      getBidDetailData: [],
      loadingData: '',
      modalopen: '',
      bid_price: '',
      getBidDetailDataPrint: [],
      Biderror: '',
      timerStart: false,
      startTimerStart: false,
      ETHlivePrice:''
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.onChange = this.onChange.bind(this)
  }


  async getDetail() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}itemDetail`,
      data: {
        "user_id": this.loginData.id ? this.loginData.id : "0",
        "item_id": this.props.match.params.id
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

        // timerStart
        this.setState({
          nftDetails: res.data.response
        })
      }

    }).catch((error) => {

    })
  }

  //=====================================  change event ===============================

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  getEthlivePrice = async () => {
    await axios({
        method: 'get',
        url: `https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`,
    }).then(response => {
       this.setState({ETHlivePrice:parseFloat(response.data.price).toFixed(2)})
    })

}

  componentDidMount() {
    this.getDetail()
    this.getBidDetailAPI()
    this.getBidDetailAPIData()
this.getEthlivePrice()
    // setInterval(() => {
    //   this.checkExpiryAPI()
    // }, 60000);

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

  //=======================================  Bid details  =====================

  async getBidDetailAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getMarketActivity`,
      data: { "item_id": this.props.match.params.id }
    })
      .then(result => {
        if (result.data.success === true) {
          this.setState({
            getBidDetailData: result.data.response,

          })
        }
        else if (result.data.success === false) {
        }
      }).catch(err => {


      });
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


  //========================================================  check for bid  ==============================================

  async bidItem(id) {

    if (this.loginData.length === 0) {
      this.openMetamask()
    }
    else if (id === 2) {
      this.setState({
        modalopen: 1
      })
    }
  }


  closebutton() {
    this.setState({
      modalopen: ''
    })
  }

  async likeCount(item) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": this.props.match.params.id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.componentDidMount()
        }

      }).catch((error) => {

      })
    } else {
      window.location.href = `${config.baseUrl}login`;
    }

  }

  ///add nft api after wallet intrigation

  async Transaferownership(sell_type,from_address, txhash, cryptoAmount) {

    if (sell_type === 2) {
      // if (parseFloat(this.state.bid_price) <= parseFloat(this.state.nftDetails?.max_bid)) {
      //   this.setState({
      //     Biderror: 1
      //   })
      //   return false
      // }
      // else {
        const token = this.token
        this.setState({
          loadingData: 1
        })
        console.log('this.loginData', this.loginData)
        await axios({
          method: 'post',
          headers: { authorization: token },
          url:  `${config.apiUrl}insertBid`,
          data: { "user_id": this.loginData?.id, 'address': this.loginData?.address, "item_id": this.props.match.params.id, 'bid_price': this.state.bid_price, 'txhash' : txhash, 'cryptoAmount' : cryptoAmount },
        })
          .then(result => {
            if (result.data.success === true) {
              this.setState({
                loadingData: '',
                modalopen: ''
              })
              toast.success(result.data?.msg);
              this.componentDidMount()
            }
            else if (result.data.success === false) {
            }
          }).catch(err => {
            this.setState({
              loadingData: '',
              modalopen: ''
            })
            toast.error(err.response.data?.msg);
          });
      // }
    }
    else {
      const token = this.token
      this.setState({
        loadingData: 1
      })
      axios({
        method: 'post',
        headers: { authorization: token },
        url: `${config.apiUrl}nftPurchase`,
        data:  { "user_id": this.loginData?.id, 'address': this.loginData?.address, "item_id": this.props.match.params.id, 'amount': this.state.nftDetails.price ,'to_address':from_address, 'txhash' : txhash, 'cryptoAmount' : cryptoAmount} 
      })
        .then(result => {
          if (result.data.success === true) {
            this.setState({
              loadingData: '',
              modalopen: ''
            })
            toast.success(result.data?.msg);
            this.componentDidMount()
          }
          else if (result.data.success === false) {
          }
        }).catch(err => {
          this.setState({
            loadingData: '',
            modalopen: ''
          })

          toast.error(err.response.data?.msg);
        })
    }
  }

  //=========================================================  purchase/Bid the item  =======================================

  async purchaseItem(sell_type) {
    
    if(sell_type == 2){
      if(parseFloat(this.state.bid_price) < parseFloat(this.state.nftDetails?.max_bid)){
        this.setState({
          Biderror: 1
        })
        return false;
      }
    }
 
    const token = this.token
    var amount = sell_type === 1 ? this.state.nftDetails.price :this.state.bid_price 
    if (this.loginData.length === 0) {
      this.openMetamask()
    }else{
    await axios({
      method: 'get',
      headers: { authorization: token },
      url: `${config.apiUrl}getSallerAddress`,
      params: { "item_id": this.props.match.params.id }
    }).then(async result => {
      if (result.data.success === true) {
        if (window.ethereum) {
           const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
           console.log(accounts[0])
           this.setState({
              ConnectWalletAddress: accounts
           })
           var web3 = new Web3(window.ethereum);
     
           var currentNetwork = web3.currentProvider.chainId;
           console.log(currentNetwork)
           // var eth_mainnet = 0x1;
           // var eth_testnet = 0x3;
           if (currentNetwork !== '0x3') {
              toast.error(`Please select ETH network!`);         
              return false;
           }
     
           let livePriceAPI = await axios({ url: 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH' });
           var usdInEth = livePriceAPI.data.ETH
           var usdvalue = (parseFloat(usdInEth) * parseFloat(amount)).toFixed(6);
           try {
     
              
              var trx_amount = usdvalue*(10 ** 18);
              var to_address = result.data.response[0].address===''?'0xD317E8c2c20F26cb9Ba403f137Fd1D01E93b52E1':result.data.response[0].address;
              var from_address = accounts[0];
     
              var getBalace = await web3.eth.getBalance(from_address) / (10 ** 18);
              var currentBal = parseFloat(getBalace).toFixed(6)
     
              if (currentBal < usdvalue) {
                 toast.error(`insufficient funds for transfer`, {
                    position: toast.POSITION.TOP_CENTER
                 });
                 return;
              }
     
              let gasPrice = await web3.eth.getGasPrice();
              let gasLimit = await web3.eth.estimateGas({
                 gasPrice: web3.utils.toHex(gasPrice),
                 to: to_address,
                 from: from_address,
                 value: web3.utils.toHex(trx_amount),
                 chainId: '0x3',
              });
     
              const transactionParameters = {
                 gasPrice: web3.utils.toHex(gasPrice),
                 gas: web3.utils.toHex(30000),
                 to: to_address,
                 from: from_address,
                 value: web3.utils.toHex(trx_amount),
                 chainId: '0x3',
              };
              
              const txHash = await window.ethereum.request({
                 method: 'eth_sendTransaction',
                 params: [transactionParameters],
              });
              console.log("txxxxx", txHash);
              if(txHash){
                this.Transaferownership(sell_type,from_address, txHash, usdvalue)            
              }
           } catch (error) {
             console.log(error)
              toast.error(`Something went wrong! Please try again later.`, {
                 position: toast.POSITION.TOP_CENTER
              });
           }
        } else {
           this.openMetamask() 
        }
      }
    }).catch(err => {

    })
  }

  }

 async openMetamask(){
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.loginAPI(accounts[0],'accountSetting')
    }
    else {
      toast.error(`Please use dApp browser to connect wallet!`, {

      });
    }
  }

  async loginAPI(address) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}login`,
      data: { "address": address }
    }).then(response => {
      if (response.data.success === true) {
        if (!response.data.data.enableTwoFactor) {
          toast.success('Wallet Connected!!.');
          Cookies.set('loginSuccessBline', JSON.stringify(response.data.data));
          Cookies.set('token', JSON.stringify(response.data.Token));
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    })
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

  render() {
    return (

      <>
        <div id="wrapper">
          <Header />
          <div className="no-bottom no-top" id="content">
            <div id="top" />
            <section aria-label="section" className="mt90 sm-mt-0">
              {/* <Toaster
                position="top-right"
                reverseOrder={false}
              /> */}

              <div className="container">
                <div className="row">
                  <div className="col-md-6 text-center nftDetailPlayer">
                    {this.state.nftDetails.file_type === 'image' ?
                      <img style={{ width: '100%', height: '364px' }} src={`${config.imageUrl}${this.state.nftDetails.image}`} className="img-fluid img-rounded mb-sm-30" alt="" /> :
                      this.state.nftDetails.file_type === 'video' ?
                        <Player style={{ width: '546px', height: '364px' }} className="img-fluid img-rounded mb-sm-30" src={`${config.imageUrl}${this.state.nftDetails.image}`} /> :
                        <img style={{ width: '100%', height: '364px' }} src={`${config.imageUrl}${this.state.nftDetails.image}`} className="img-fluid img-rounded mb-sm-30" alt="" />
                    }

                    <div className="mobile_view_panel">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                          <div className="item_info">
                            <div className="name_verify">
                              <div className="row">
                                <div className="col-lg-1 col-xl-1 col-md-1 col-6">
                                  <div className="author_list_pp" style={{ backgroundSize: 'cover' }}>
                                    <Link to={`${config.baseUrl}collections/${this.state.nftDetails.collection_id}`}>
                                      <img className="lazy" style={{ width: '50px', height: '50px' }} src={this.state.nftDetails.collection_pic} alt="" />
                                      <i className="fa fa-check" />
                                    </Link>
                                  </div>
                                </div>
                                <div className="col-lg-5 col-xl-5 col-md-5 col-6">
                                  <Link to={`${config.baseUrl}collections/${this.state.nftDetails.collection_id}`} className="verify_nft" style={{ marginLeft: '10px' }}>{this.state.nftDetails.collection_name}<img src="images/correct.png" className="verify_icon" /></Link>
                                </div>
                                <div className="col-lg-6 col-xl-6 col-md-6 col-6">
                                  <div className="edit_icons">
                                    {/* <a href="#"><i class="fa fa-repeat" aria-hidden="true"></i></a> */}
                                    {/* <a href="#"><i className="fa fa-pencil-square-o" aria-hidden="true" /></a> */}
                                    <a href="javascript:void(0)" data-toggle="modal" onClick={this.modalShow.bind(this, 1)} data-target="#productShareSheet"> <i className="fa fa-share-alt" aria-hidden="true" /></a >
                                    {/* <a href="#"> <i className="fa fa-share-alt" aria-hidden="true" /></a> */}
                                    {/* <a href="#"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i></a> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <h2>{this.state.nftDetails.name}<span className="nft_rank">#120</span></h2>


                            <div className="item_info_counts">
                              <div className="item_info_type">Owned by <Link to={`${config.baseUrl}UserProfile/${this.state.nftDetails.owner_id}`}>{this.state.nftDetails.owner}</Link></div>
                              <div className="item_info_views"><i className="fa fa-eye" />{this.state.nftDetails.view_count} view</div>
                              <div className="item_info_like"><i className="fa fa-heart" style={this.state.nftDetails.is_liked === 0 ? { color: '#ddd' } : { color: '#EC7498' }} />{this.state.nftDetails.like_count} favorites</div>
                            </div>
                            {this.state.nftDetails.is_on_sale === 0 && this.state.nftDetails.is_sold === 0 ? <p style={{ color: 'red' }}>Not For Sale</p> :
                              <div className="top_bids mt-1">
                                {this.state.nftDetails.sell_type === 1 ? ''
                                  :
                                  this.state.getBidDetailDataPrint.length === 0 ?
                                    <p>Top bid - Reserve price not met.</p> : <p>Top bid - {this.state.nftDetails?.max_bid} </p>}
                                <h4 className="price_bids"><img src="images/eth-icon.png" className="coin_img" />${this.state.nftDetails.price}<small>({parseFloat((this.state.nftDetails.price) / parseFloat(this.state.ETHlivePrice).toFixed(6)).toFixed(6)} ETH)</small>
                                  {/* <i className="fa fa-arrow-circle-up" aria-hidden="true" /> */}
                                </h4>
                                {this.state.nftDetails.is_sold === 1 ?
                                  <p style={{ color: 'red' }}>Sold Out</p> :
                                  this.state.nftDetails.sell_type === 1 ?
                                    <button className="place_bids" disabled={this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><img src="images/wallet.png" className="wallet_icon" />
                                      {this.state.nftDetails.sell_type === 1 ?
                                        'Buy' : "Place Bid"}</button>
                                    :
                                    <button className="place_bids" disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><img src="images/wallet.png" className="wallet_icon" />
                                      {this.state.nftDetails.sell_type === 1 ?
                                        'Buy' : "Place Bid"}</button>
                                }

                              </div>
                            }

                            {this.state.nftDetails.is_on_sale === 0 ? '' :
                              this.state.nftDetails.sell_type === 1 || this.state.nftDetails.expiry_date === null ? '' : <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />&nbsp;&nbsp;
                                {new Date(this.state.nftDetails.start_date) > new Date() ?
                                  <>
                                    Sale start in
                                    {(this.state.nftDetails.start_date && this.state.startTimerStart) ?
                                      <Countdown
                                        date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                        renderer={this.CountdownTimer}
                                      /> :
                                      <>
                                        <span className="days">{moment(this.state.nftDetails.start_date).diff(moment(), 'days')} day </span>
                                      </>
                                    }
                                    &nbsp;
                                    ({moment(this.state.nftDetails.start_date).format('LLL')})
                                  </>
                                  :
                                  new Date(this.state.nftDetails.expiry_date) > new Date() ?
                                    <>
                                      Sale ends in
                                      {(this.state.nftDetails.expiry_date && this.state.timerStart) ?
                                        <Countdown
                                          date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                          renderer={this.CountdownTimer}
                                        /> :
                                        <>
                                          <span className="days">{moment(this.state.nftDetails.expiry_date).diff(moment(), 'days')} day </span>
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
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="accordion mt-0" id="accordionExample">

                      <br />
                      <div className="distcription">

                        <div className="accordion-item">
                          <h2 className="accordion-header" id="headingOne1">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne1" aria-expanded="true" aria-controls="collapseOne">
                              <img src="images/right-menu-bars.png" className="accordian_icon" />Project Description
                            </button>
                          </h2>
                          <div id="collapseOne1" className="accordion-collapse collapse show" aria-labelledby="headingOne1" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                              <div className="row" style={{ textAlign: 'initial' }}>
                                <h5><span className="Create_by">Created by </span>&nbsp;<Link to={`${config.baseUrl}UserProfile/${this.state.nftDetails.created_by}`}>{this.state.nftDetails.creator}</Link></h5>
                                <p>{this.state.nftDetails.description} </p>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <img src="images/details.png" className="accordian_icon" />Details
                          </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                                <div className="details_label">
                                  <p>Token ID</p>
                                  <p>Blockchain</p>
                                </div>
                              </div>
                              <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                                <div className="detail_add">
                                  <p>{this.state.nftDetails.token_id ? this.state.nftDetails.token_id : '0'}</p>
                                  <p>ETH</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="col-md-6">
                    <div className="item_info" id="desktop_views">
                      <div className="name_verify">
                        <div className="row">
                          <div className="col-lg-1 col-xl-1 col-md-1 col-6">
                            <div className="author_list_pp" style={{ backgroundSize: 'cover' }}>
                              <Link to={`${config.baseUrl}collections/${this.state.nftDetails.collection_id}`}>
                                <img className="lazy" style={{ width: '50px', height: '50px' }} src={this.state.nftDetails.collection_pic} alt="" />
                                <i className="fa fa-check" />
                              </Link>
                            </div>
                          </div>
                          <div className="col-lg-5 col-xl-5 col-md-5 col-6">
                            <Link to={`${config.baseUrl}collections/${this.state.nftDetails.collection_id}`} className="verify_nft" style={{ marginLeft: '10px' }}>{this.state.nftDetails.collection_name}<img src="images/correct.png" className="verify_icon" /></Link>
                          </div>

                          <div className="col-lg-3 col-xl-3 col-md-3 col-3">
                            <div className="edit_icons">
                              <a style={this.state.nftDetails.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                <i className="fa fa-heart" style={this.state.nftDetails.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }} onClick={e => this.likeCount(this.state.nftDetails)}></i><span >{this.state.nftDetails.like_count}</span>
                              </a>

                              <a href="javascript:void(0)" data-toggle="modal" onClick={this.modalShow.bind(this, 1)} data-target="#productShareSheet"> <i className="fa fa-share-alt" aria-hidden="true" /></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h2>{this.state.nftDetails.name}</h2>

                      <div className="border p-2">
                        <div className="item_info_counts">
                          <div className="item_info_type">Owned by <Link to={`${config.baseUrl}UserProfile/${this.state.nftDetails.owner_id}`}>{this.state.nftDetails.owner}</Link></div>
                          <div className="item_info_views"><i className="fa fa-eye" />{this.state.nftDetails.view_count} view</div>
                          <div className="item_info_like"><i className="fa fa-heart" style={this.state.nftDetails.is_liked === 0 ? { color: '#ddd' } : { color: '#EC7498' }} />{this.state.nftDetails.like_count} favorites</div>
                        </div>
                        {this.state.nftDetails.is_on_sale === 0 && this.state.nftDetails.is_sold === 0 ? <p style={{ color: 'red' }}>Not For Sale</p> :
                          <div className="top_bids mt-1">
                            {this.state.nftDetails.sell_type === 1 ? ''
                              :
                              this.state.getBidDetailDataPrint.length === 0 ?
                                <p>Top bid - Reserve price not met.</p> : <p>Top bid - {this.state.nftDetails?.max_bid}</p>}
                            <h4 className="price_bids"><img src="images/eth-icon.png" className="coin_img" />${this.state.nftDetails.price}<small>({parseFloat((this.state.nftDetails.price) / parseFloat(this.state.ETHlivePrice).toFixed(6)).toFixed(6)} ETH)</small>
                              {/* <i className="fa fa-arrow-circle-up" aria-hidden="true" /> */}
                            </h4>
                            {this.state.nftDetails.is_sold === 1 ?
                              <p style={{ color: 'red' }}>Sold Out</p> :
                              this.state.nftDetails.sell_type === 1 ?
                                <button className="place_bids" disabled={this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><img src="images/wallet.png" className="wallet_icon" />
                                  {this.state.nftDetails.sell_type === 1 ?
                                    'Buy' : "Place Bid"}</button>
                                :
                                <button className="place_bids" disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><img src="images/wallet.png" className="wallet_icon" />
                                  {this.state.nftDetails.sell_type === 1 ?
                                    'Buy' : "Place Bid"}</button>
                            }

                          </div>
                        }

                        {this.state.nftDetails.is_on_sale === 0 ? '' :
                          this.state.nftDetails.sell_type === 1 || this.state.nftDetails.expiry_date === null ? '' : <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />&nbsp;&nbsp;
                            {new Date(this.state.nftDetails.start_date) > new Date() ?
                              <>
                                Sale start in
                                {(this.state.nftDetails.start_date && this.state.startTimerStart) ?
                                  <Countdown
                                    date={this.getTimeOfStartDate(this.state.nftDetails.start_date)}
                                    renderer={this.CountdownTimer}
                                  /> :
                                  <>
                                    <span className="days">{moment(this.state.nftDetails.start_date).diff(moment(), 'days')} day </span>
                                  </>
                                }
                                &nbsp;
                                ({moment(this.state.nftDetails.start_date).format('LLL')})
                              </>
                              :
                              new Date(this.state.nftDetails.expiry_date) > new Date() ?
                                <>
                                  Sale ends in
                                  {(this.state.nftDetails.expiry_date && this.state.timerStart) ?
                                    <Countdown
                                      date={this.getTimeOfStartDate(this.state.nftDetails.expiry_date)}
                                      renderer={this.CountdownTimer}
                                    /> :
                                    <>
                                      <span className="days">{moment(this.state.nftDetails.expiry_date).diff(moment(), 'days')} day </span>
                                    </>
                                  }
                                  &nbsp;
                                  ({moment(this.state.nftDetails.expiry_date).format('LLL')})
                                </> : "Sale End"
                            }

                          </div>}

                      </div>

                      {/* <div className="border mt-2 p-2">
                        <div className="de_tab tab_simple mt-4">
                          <ul className="de_nav">
                            <li className={this.state.isActive === 1 ? "active" : ''} onClick={this.isActiveTab.bind(this, 2)}><span>Transaction History</span></li>
                            {this.state.nftDetails.sell_type === 1 ? <li className={this.state.isActive === 3 ? "active" : ''} onClick={this.isActiveTab.bind(this, 3)}><span>Bid History</span></li> : ''
                            }
                          </ul>
                          <div className="de_tab_content">
                            <div className="tab-2" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                              {this.state.getBidDetailData.map(item => (
                                <div className="p_list">
                                  <div className="p_list_pp">
                                    <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                      <img className="lazy" style={{ width: '50px', height: '50px' }} src={!item.profile_pic ? "images/author/author-5.jpg" : `${config.imageUrl1}${item.profile_pic}`} alt="" />
                                      <i className="fa fa-check" />
                                    </Link>
                                  </div>
                                  <div className="p_list_info">
                                    {item.transaction_type}
                                    <b>{item.transaction_type != 'Minted NFT' ? item.amount + ' ' : ""}</b>
                                    <span>by
                                      <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                        <b> {item.full_name} </b>
                                      </Link>
                                      at {item.transaction_date}</span>
                                  </div>
                                </div>
                              ))}

                            </div>
                            <div className="tab-3" style={{ display: this.state.isActive === 3 ? 'block' : 'none' }}>
                              {this.state.getBidDetailDataPrint.length === 0 ?
                                <div className="p_list">
                                  <p>No Bid Found</p>
                                </div>
                                : this.state.getBidDetailDataPrint.map(item => (
                                  <div className="p_list">
                                    <div className="p_list_pp">
                                      <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                        <img className="lazy" style={{ width: '50px', height: '50px' }} src={!item.profile_pic ? "images/author/author-5.jpg" : `${config.imageUrl1}${item.profile_pic}`} alt="" />
                                        <i className="fa fa-check" />
                                      </Link>
                                    </div>
                                    <div className="p_list_info">
                                      {item.transaction_type} <b>{item.amount} </b>
                                      <span>by
                                        <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                          <b> {item.full_name} </b>
                                        </Link>
                                        at {item.transaction_date}</span>
                                    </div>
                                  </div>
                                ))}



                            </div>
                          </div>
                        </div>
                      </div>
 */}

<div className="border mt-2 p-2">
                        <div className="de_tab tab_simple mt-4">
                          <ul className="de_nav">
                            <li className={this.state.isActive === 1 ? "active" : ''} onClick={this.isActiveTab.bind(this, 1)}><span>Collection Stats</span></li>
                            {/* <li ><span>Bids</span></li> */}
                            <li className={this.state.isActive === 2 ? "active" : ''} onClick={this.isActiveTab.bind(this, 2)}><span>Transaction History</span></li>
                            {this.state.nftDetails.sell_type === 2 ? <li className={this.state.isActive === 3 ? "active" : ''} onClick={this.isActiveTab.bind(this, 3)}><span>Bid History</span></li> : ''
                            }
                          </ul>
                          <div className="de_tab_content">
                            <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                              <div className="row mt-2 mb-5" style={{ backgroundSize: 'cover' }}>
                                <div className="row">
                                  <div className="col-lg-5 col-xl-5 col-md-5 col-12">
                                    <div className="row">
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="collection_stats mt-3" style={{ backgroundSize: 'cover' }}>
                                          <h5>{this.state.nftDetails.item_count}</h5>
                                          <p>Items</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="collection_stats mt-3" style={{ backgroundSize: 'cover' }}>
                                          <h5>{this.state.nftDetails.owner_count}</h5>
                                          <p>Owner</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="collection_stats mt-5" style={{ backgroundSize: 'cover' }}>
                                          <h5><img src className="nft_coin" />{this.state.nftDetails.floor_price}</h5>
                                          <p>Floor Price</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{ backgroundSize: 'cover' }}>
                                        <div className="collection_stats mt-5" style={{ backgroundSize: 'cover' }}>
                                          <h5>{this.state.nftDetails.trad_volume}</h5>
                                          <p>Volume traded</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-xl-7 col-md-7 col-12">
                                    <div id="chartContainer" style={{ height: '200px', width: '100%' }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="tab-2" style={{ display: this.state.isActive === 2 ? 'block' : 'none' }}>
                              {this.state.getBidDetailData.map(item => (
                                <div className="p_list">
                                  <div className="p_list_pp">
                                    <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                      <img className="lazy" style={{ width: '50px', height: '50px' }} src={!item.profile_pic ? "images/default-user-icon.jpg" : `${config.imageUrl1}${item.profile_pic}`} alt="" />
                                      <i className="fa fa-check" />
                                    </Link>
                                  </div>
                                  <div className="p_list_info">
                                    {item.transaction_type}
                                    <b>{item.transaction_type != 'Minted NFT' ? item.amount + ' ADA' : ""}</b>
                                    <span>by
                                      <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                        <b> {item.full_name} </b>
                                      </Link>
                                      at {item.transaction_date}</span>
                                  </div>
                                </div>
                              ))}



                            </div>
                            <div className="tab-3" style={{ display: this.state.isActive === 3 ? 'block' : 'none' }}>
                              {this.state.getBidDetailDataPrint.length === 0 ?
                                <div className="p_list">
                                  <p>No Bid Found</p>
                                </div>
                                : this.state.getBidDetailDataPrint.map(item => (
                                  <div className="p_list">
                                    <div className="p_list_pp">
                                      <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                        <img className="lazy" style={{ width: '50px', height: '50px' }} src={!item.profile_pic ? "images/default-user-icon.jpg" : `${config.imageUrl1}${item.profile_pic}`} alt="" />
                                        <i className="fa fa-check" />
                                      </Link>
                                    </div>
                                    <div className="p_list_info">
                                      {item.transaction_type} <b>{item.amount} ADA</b>
                                      <span>by
                                        <Link to={`${config.baseUrl}UserProfile/${item.user_id}`}>
                                          <b> {item.full_name} </b>
                                        </Link>
                                        at {item.transaction_date}</span>
                                    </div>
                                  </div>
                                ))}



                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </section>




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
                                <strong>Your offer must be greater than: {this.state.nftDetails?.max_bid} </strong>}
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
                                      <span className="input-group-text"></span>
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
                                        onClick={this.purchaseItem.bind(this, 2)}>Place Bid</button>
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