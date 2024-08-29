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

// Demo styles, see 'Styles' section below for some notes on use.
import 'react-accessible-accordion/dist/fancy-example.css';
const now = moment()
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
      ETHlivePrice: '',
      colourOptions: [{ value: "ocean", label: "Ocean", color: "#00B8D9" },
      { value: "blue", label: "Blue", color: "#0052CC" },
      { value: "purple", label: "Purple", color: "#5243AA" },
      { value: "red", label: "Red", color: "#FF5630" },
      { value: "orange", label: "Orange", color: "#FF8B00" },
      { value: "yellow", label: "Yellow", color: "#FFC400" },
      { value: "green", label: "Green", color: "#36B37E" },
      { value: "forest", label: "Forest", color: "#00875A" },
      { value: "slate", label: "Slate", color: "#253858" },
      { value: "silver", label: "Silver", color: "#666666" }]
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    this.onChange = this.onChange.bind(this)
  }
  handleChange = (selected) => {
    this.setState({
      optionSelected: selected
    });
  };


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
      this.setState({ ETHlivePrice: parseFloat(response.data.price).toFixed(2) })
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

  async Transaferownership(sell_type, from_address, txhash, cryptoAmount) {

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
        url: `${config.apiUrl}insertBid`,
        data: { "user_id": this.loginData?.id, 'address': this.loginData?.address, "item_id": this.props.match.params.id, 'bid_price': this.state.bid_price, 'txhash': txhash, 'cryptoAmount': cryptoAmount },
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
        data: { "user_id": this.loginData?.id, 'address': this.loginData?.address, "item_id": this.props.match.params.id, 'amount': this.state.nftDetails.price, 'to_address': from_address, 'txhash': txhash, 'cryptoAmount': cryptoAmount }
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

    if (sell_type == 2) {
      if (parseFloat(this.state.bid_price) < parseFloat(this.state.nftDetails?.max_bid)) {
        this.setState({
          Biderror: 1
        })
        return false;
      }
    }

    const token = this.token
    var amount = sell_type === 1 ? this.state.nftDetails.price : this.state.bid_price
    if (this.loginData.length === 0) {
      this.openMetamask()
    } else {
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


              var trx_amount = usdvalue * (10 ** 18);
              var to_address = result.data.response[0].address === '' ? '0xD317E8c2c20F26cb9Ba403f137Fd1D01E93b52E1' : result.data.response[0].address;
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
              if (txHash) {
                this.Transaferownership(sell_type, from_address, txHash, usdvalue)
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

  async openMetamask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.loginAPI(accounts[0], 'accountSetting')
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
    console.log(this.state.nftDetails)
    return (

      <>
        <div id="wrapper">
          <Header />
          <div className="no-bottom no-top product-detail" id="content">
            <div id="top" />
            <section aria-label="section" className="mt90 sm-mt-0">
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
                          {/* <hr className='mb-0 mt-0' />
                            <li>
                              <div className='col-sm-8'>
                                <p className="mt-3 mb-0">Created by <a href='#'>MZIBRO</a></p>
                                


                              </div>


                            </li> */}
                        </ul>
                      </div>
                      <Accordion>
                        <AccordionItem style={{ borderTopLeftRadius: "0", borderTopRightRadius: "0", borderTop: "0px solid #000" }}>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              <img src="images/details.png" class="accordian_icon" width="16px" />&nbsp;About {this.state.nftDetails.name}
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel>
                            <p>
                              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                            </p>
                            <div className='col-sm-12 text-center'>
                              <div className='list-line-icon '>
                                <a className='btn links'><span className='icon_refresh'></span></a>
                                {/* <a className='btn links'><span className='material-icons'>&#xe89e;</span></a> */}
                                <a className='btn links'><span className='social_share'></span></a>
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
                                    {console.log(this.state.nftDetails.contract_address)}
                                    {this.state.nftDetails.contract_address != undefined ?
                                      <td className='text-right'>{this.state.nftDetails.contract_address.toString().substring(0, 5) + '...' + this.state.nftDetails.contract_address.toString().substr(this.state.nftDetails.contract_address.length - 5)}</td>
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
                    <div className='product-detail-summary'>
                      <div className='row'>
                        <div className='col-sm-6'>
                          <a className='links'>MZI CLUB</a>

                        </div>
                        <div className='col-sm-6 text-right'>
                          <div className='list-line-icon pull-right'>
                            <a className='btn links'><span className='icon_refresh'></span></a>
                            {/* <a className='btn links'><span className='material-icons'>&#xe89e;</span></a> */}
                            <a className='btn links'><span className='social_share'></span></a>
                            {/* <a className='btn links' ><span className='fa fa-ellipsis-v'></span></a> */}
                          </div>

                        </div>

                      </div>
                      <div className='product-box-detail'>
                        <h3>{this.state.nftDetails && this.state.nftDetails.name}</h3>
                        <div className='item-counts'>
                          <div className='list-line'>
                            Owned by <a href='#' className=''>{this.state.nftDetails.owner}</a>

                          </div>
                          <div className='list-line'>
                            <span><i className='fa fa-eye'></i>&nbsp;{this.state.nftDetails.view_count} views</span>


                          </div>

                        </div>
                        <div className='item-detail'>
                          <ul>

                            <li>
                              <div className='col-sm-8'>
                                <span>Highest offer</span>
                                <div className='row'>
                                  <div className='col-sm-12'>
                                    <span className='d-flex'><img src='images/eth.svg' width="22" /> &nbsp;<h2 class="mt-1 mb-0">{this.state.nftDetails.max_bid}</h2>&nbsp;<small class="mt-3">($23.77)</small></span>
                                  </div>
                                  <div className='col-sm-12 mt-2'>
                                    {this.state.nftDetails.is_sold === 1 ?
                                      <p style={{ color: 'red' }}>Sold Out</p> :
                                      this.state.nftDetails.sell_type === 1 ?
                                        <button className='btn btn-primary buy-now-btn' disabled={this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><i className='fa fa-tag'></i>&nbsp;
                                          {this.state.nftDetails.sell_type === 1 ?
                                            'Buy' : "Make offer"}</button>
                                        :
                                        <button className='btn btn-primary buy-now-btn' disabled={new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? true : false} style={{ cursor: new Date(this.state.nftDetails.start_date) > new Date() || new Date(this.state.nftDetails.expiry_date) < new Date() || this.state.nftDetails.is_sold === 1 || this.loginData.id == this.state.nftDetails.owner_id ? 'not-allowed' : '' }} onClick={this.state.nftDetails.sell_type === 1 ? this.purchaseItem.bind(this, this.state.nftDetails.sell_type) : this.bidItem.bind(this, this.state.nftDetails.sell_type)}><i className='fa fa-tag'></i>&nbsp;
                                          {this.state.nftDetails.sell_type === 1 ?
                                            'Buy' : "Make offer"}</button>
                                    }
                                    {/* <button  className='btn btn-primary buy-now-btn'><i className='fa fa-tag'></i>&nbsp; Make offer</button> */}

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
                                <AccordionItem>
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
                                </AccordionItem>
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
                {this.state.nftDetails.sell_type === 2 ?
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
                                {/* <select className='form-control'>
                                    <option>Filter</option>
                                    <option>Listings</option>
                                    <option>Sales</option>
                                    <option>Bids</option>
                                    <option>Transfer</option>
                                  </select> */}

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
                                      {this.state.getBidDetailDataPrint.map((item)=><tr>
                                        <td><div><i className='fa fa-tag'></i>&nbsp;List</div></td>
                                        <td><div><img src='images/eth.svg' width="16px" />&nbsp;{parseFloat( item.amount/this.state.ETHlivePrice).toFixed(5)}</div></td>
                                        <td><div><a href='#'>MZIBRO</a></div></td>
                                        <td><div></div></td>
                                        <td><div>{moment(item.transaction_date).diff(now, 'days')} days ago</div></td>
                                      </tr>)}
                                      {/* <tr>
                                        <td><div><i className='fa fa-tag'></i>&nbsp;List</div></td>
                                        <td><div><img src='images/eth.svg' width="16px" />&nbsp;0.006</div></td>
                                        <td><div><a href='#'>MZIBRO</a></div></td>
                                        <td><div></div></td>
                                        <td><div>2 day ago</div></td>
                                      </tr>
                                      <tr>
                                        <td><div><i className='fa fa-tag'></i>&nbsp;List</div></td>
                                        <td><div><img src='images/eth.svg' width="16px" />&nbsp;0.006</div></td>
                                        <td><div><a href='#'>MZIBRO</a></div></td>
                                        <td><div></div></td>
                                        <td><div>6 day ago</div></td>
                                      </tr>
                                      <tr>
                                        <td><div><i className='fa fa-tag'></i>&nbsp;List</div></td>
                                        <td><div><img src='images/eth.svg' width="16px" />&nbsp;0.006</div></td>
                                        <td><div><a href='#'>MZIBRO</a></div></td>
                                        <td><div></div></td>
                                        <td><div>10 day ago</div></td>
                                      </tr> */}
                                    </tbody>

                                  </table>
                                </div>

                              </div>

                            </AccordionItemPanel>
                          </AccordionItem>

                        </Accordion>

                      </div>


                    </div>


                  </div> : ''}

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