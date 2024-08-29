import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';

export default class userprofile extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      userData: {},
      getWalletData: {},
      myNftData: [],
      collectionData: [],
      userData:[],
      isActive: 1
    };
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

  }



  async getUserDataAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserDetails`,
      data: { "id": this.id }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          userData: response.data.response
        })
      }
    })
  }

  async getWalletDataAPI() {
    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}getWalletDetail`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getWalletData: response.data
        })
      }
    })
  }



  //  ========================================== Portfolio API's Start==========================================

  async getMyNftAPI(nftType = null) {
    if (!nftType) {
      var nftType = 1
      this.setState({
        isActive: 1
      })
    } else {
      var nftType = nftType
      this.setState({
        isActive: nftType
      })
    }

    this.setState({
      'saleHistory': [],
      'nftType': nftType,
      'FavouritesHistory': []
    })

    const token = this.token
    await axios({
      method: 'post',
      url: `${config.apiUrl}portfolio`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': this.loginData.id }
      // data: { "user_id": 262, 'email': this.loginData?.user_email, 'type': nftType, 'login_user_id': 262 }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          myNftData: response.data.response,
          saleHistory: response.data.response,
          FavouritesHistory: response.data.response
        })
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


  async likeCount(item) {
    if (this.loginData && this.loginData.id) {
      await axios({
        method: 'post',
        url: `${config.apiUrl}likeitem`,
        data: {
          "user_id": this.loginData.id,
          "item_id": item.item_id
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.getMyNftAPI(this.state.nftType)
        }

      }).catch((error) => {

      })
    } else {
      toast.error('Please Login First')
    }
  }


  // ==============================   Collections API's Start =================================================

  async getCollectionDataAPI() {
    const token = this.token
    this.setState({
      isActive: 3
    })
    await axios({
      method: 'post',
      url: `${config.apiUrl}getUserCollection`,
      headers: { authorization: token },
      data: { "user_id": this.id, 'email': this.loginData?.user_email }
      // data: { "user_id": 262, 'email': this.loginData?.user_email }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response
        })
      }
    })
  }


  userShow(id) {

    setTimeout(() => {
      window.location.href = `${config.baseUrl}UserProfile/` + id.owner_id
    });
  }

  componentDidMount() {
    this.getUserDataAPI()
    this.getWalletDataAPI()
    this.getMyNftAPI()
    this.getCollectionDataAPI()
  }

  render() {
    return (

      <>
        <Header />
        <ToastContainer />

        <div className="no-bottom no-top" id="content">
          <div id="top" />
          {/* section begin */}
          <section id="profile_banner" aria-label="section" className="text-light"
            style={{
              backgroundImage: !this.state.userData.banner || this.state.userData.banner === '' || this.state.userData.banner === null || this.state.userData.banner === undefined || this.state.userData.banner === 'null'
                ?
                 `url(images/banner-image-default.jpg)` :
                `url(${config.imageUrl1}${this.state.userData.banner})`
            }}>
          </section>
          {/* section close */}
          <section aria-label="section" className="d_coll no-top userprofile-page">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile" style={{ marginBottom: '0px' }}>
                    <div className="profile_avatar">
                      <div className="d_profile_img">
                        <img src={this.state.userData.profile_pic != 'null' ?
                           config.imageUrl1+this.state.userData.profile_pic :
                          "images/default-user-icon.jpg"} alt="" />
                        {this.state.userData?.is_verified == '1' ?
                          <i className="fa fa-check"></i>
                          : ""}
                        <i className="fa fa-check" />
                      </div>
                      <div className="profile_name">
                        <h4>
                        {this.state.userData && this.state.userData.full_name ? this.state.userData.full_name : ''}
                          <div className="clearfix" />
                          {this.state.userData?.address ?
                            <>
                              <span id="wallet" className="profile_wallet">{this.state.userData?.address.toString().substring(0, 4) + '...' + this.state.userData?.address.toString().substr(this.state.userData?.address.length - 4)}</span>
                              <button id="btn_copy" title="Copy Text"><span className='fa fa-clone blue' style={{ fontSize: "15px" }}></span></button> </>
                            :
                            ""

                          }

                          <div className="social-icons mt-0" style={{ backgroundSize: 'cover' }}>
                            {/* <h5 /> */}

                            {!this.state.userData.facebook ? '' : <a href={this.state.userData && this.state.userData.facebook}><img src="images/facebook-logo.png" className="social-icons-collection" /></a>}
                            {!this.state.userData.twitter ? '' :
                              <a href={this.state.userData && this.state.userData.twitter}><img src="images/twitter.png" className="social-icons-collection" /></a>}
                            {!this.state.userData.discord ? '' :
                              <a href={this.state.userData && this.state.userData.discord}><img src="images/discord-blue.png" className="social-icons-collection" /></a>}
                            {!this.state.userData.insta ? '' :
                              <a href={this.state.userData && this.state.userData.insta}><img src="images/instagram.png" className="social-icons-collection" /></a>}
                            {!this.state.userData.telegram ? '' :
                              <a href={this.state.userData && this.state.userData.telegram}><img src="images/telegram.png" className="social-icons-collection" /></a>}
                          </div>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              {/* <div className='collection_stats'>
                                <ul className=" mb-4">
                              
                                  <li className="">
                                     <h5>{this.state.userData.item_count}</h5>
                                    <p>Items</p>
                                  </li>
                                  <li className="">
                                    <h5>{this.state.userData.owner_count}</h5>
                                    <p>Owner</p>
                                  </li>
                                  <li className="">
                                    <h5><img src='images/eth.png' width="26px" style={{marginTop: '-6px'}}/>{this.state.userData.floor_price}</h5>
                                    <p>Floor Price</p>
                                  </li>
                                  <li className="">
                                    <h5><img src='images/eth.png' width="26px" style={{marginTop: '-6px'}}/>{this.state.userData.trad_volume}</h5>
                                    <p>Volume traded</p>
                                  </li>
                               
                                </ul>

                              </div> */}
                              {/* <div className="row mb-4">
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.item_count}</h5>
                                    <p>Items</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.owner_count}</h5>
                                    <p>Owner</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.floor_price}</h5>
                                    <p>Floor Price</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.trad_volume}</h5>
                                    <p>Volume traded</p>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                            </div>
                            <div className='col-sm-2'></div>
                            <div className='col-sm-8 text-center'>
                              <p>{this.state.userData.description}</p>

                            </div>
                            <div className='col-sm-2'></div>
                            {/* <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            </div>
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                       
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.item_count}</h5>
                                    <p>Items</p>
                                 
                                </div>
                             
                                  <div className="collection_stats">
                                    <h5>{this.state.userData.owner_count}</h5>
                                    <p>Owners</p>
                                 
                                </div>
                                
                                  <div className="collection_stats">
                                  <img width={20} height={20} src="images/eth-icon.png" alt="" />
                                    <h5>{this.state.userData.floor_price}</h5>
                                    <p>Floor Price</p>
                                  </div>
                                </div>
                               
                                  <div className="collection_stats">
                                  <img width={20} height={20} src="images/eth-icon.png" alt="" />
                                    <h5>{this.state.userData.user_trade_volume}</h5>
                                    <p>Volume traded</p>
                                  </div>
                              
                             
                     
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            </div> */}
                          </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                      {/* <ul className="de_nav">
                        <li className={this.state.isActive === 1 ? "active" : ''} onClick={this.getMyNftAPI.bind(this, 1)}><span>Collection Details</span></li>
                      </ul> */}
                      <div className="de_tab_content">
                        <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                          <div className="row">
                            {/* nft item begin */}
                            {this.state.collectionData.length > 0?
                            this.state.collectionData.map(item => (
                              <div className="col-lg-4 col-md-6">
                                <div className="nft__item">
                                  <div className="author_list_pp">
                                    {!item.profile_pic ?
                                      <a href={`${config.baseUrl}collections/${item.collection_id}`}>
                                        <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                      </a>
                                      :
                                      <a href={`${config.baseUrl}collections/${item.collection_id}`}>
                                        <img className="lazy" src={`${config.imageUrl1}` + item.profile_pic} alt="" />
                                      </a>
                                    }
                                  </div>

                                  <div className="nft__item_wrap">
                                    <a style={{ color: '#000' }} href={`${config.baseUrl}collections/${item.collection_id}`}>
                                      {!item.banner ?
                                        <img src="images/collections/coll-item-3.jpg"  className="lazy nft__item_preview" alt="" />
                                        :
                                        <img className="lazy nft__item_preview"  src={`${config.imageUrl1}` + item.banner} alt="" />
                                      }
                                    </a>
                                  </div>
                                  <div className="nft__item_info">
                                    <h4>{item.name}</h4>
                                  </div>
                                </div>
                              </div>
                            )):
                            <div style={{textAlign:'center'}}>
                              <img style={{width:'150px',height:'150px'}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU'/><br/><br/>
                              <p><b>No Items To Display</b></p>
                            </div>
                            }

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div></section>
        </div>


        <Footer />
      </>
    )
  }
}