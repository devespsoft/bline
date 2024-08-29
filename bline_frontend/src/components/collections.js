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

export default class collection extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      collectionDetail: {},
      getWalletData: {},
      myNftData: [],
      collectionData: [],
      isActive: 1
    };
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));

  }

  // ==============================   Collections API's Start =================================================

  async getMyNftAPI(id) {
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
    await axios({
      method: 'post',
      url: `${config.apiUrl}getCollectionById`,
      data: { "collection_id": this.id, "login_user_id": this.loginData.id }
    }).then(response => {

      if (response.data.success === true) {
        this.setState({
          collectionDetail: response.data.collectionData,
          myNftData: response.data.itemDetail
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






  componentDidMount() {

    this.getMyNftAPI()
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
              backgroundImage: this.state.collectionDetail.banner === '' || this.state.collectionDetail.banner === null || this.state.collectionDetail.banner === undefined
                ?
                "url('images/background/bg-3.jpg')" :
                `url(${config.imageUrl1}${this.state.collectionDetail.banner})`,backgroundPosition:"center"
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
                        <img src={this.state.collectionDetail.collection_profile_pic ?
                          config.imageUrl1 + this.state.collectionDetail.collection_profile_pic :
                          "images/default-user-icon.jpg"} alt="" />
                        {/* {this.state.collectionDetail?.is_verified == '1' ?
                          <i className="fa fa-check"></i>
                          : ""}
                        <i className="fa fa-check" /> */}
                      </div>
                      <div className="profile_name">
                        <h4>
                          {this.state.collectionDetail && this.state.collectionDetail.collection_name ? this.state.collectionDetail.collection_name : ''}
                          <div className="clearfix" />


                          <div className="social-icons collec mt-0" style={{ backgroundSize: 'cover' }}>
                            {/* <h5 /> */}

                            {!this.state.collectionDetail.facebook ? '' : <a href={this.state.collectionDetail && this.state.collectionDetail.facebook}><i className='fa fa-facebook'></i></a>}
                            {!this.state.collectionDetail.twitter ? '' :
                              <a href={this.state.collectionDetail && this.state.collectionDetail.twitter}><i class="fa fa-twitter" aria-hidden="true"></i></a>}
                            {!this.state.collectionDetail.discord ? '' :
                              <a href={this.state.collectionDetail && this.state.collectionDetail.discord}><i class="fa fa-instagram" aria-hidden="true"></i></a>}
                            {!this.state.collectionDetail.insta ? '' :
                              <a href={this.state.collectionDetail && this.state.collectionDetail.insta}><i class="fa fa-telegram" aria-hidden="true"></i></a>}
                            {!this.state.collectionDetail.telegram ? '' :
                              <a href={this.state.collectionDetail && this.state.collectionDetail.telegram}><img src="images/discord2.png" className="social-icons-collection" style={{marginTop:"12px"}} /></a>}
                          </div>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-5">
                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                              <div className='collection_stats'>
                                <ul className="mb-4">
                              
                                  <li className="">
                                    <h5>{this.state.collectionDetail.item_count}</h5>
                                    <p>Items</p>
                                  </li>
                                  <li className="">
                                    <h5>{this.state.collectionDetail.owner_count}</h5>
                                    <p>Owner</p>
                                  </li>
                                  <li className="">
                                    <h5><img src='https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg' width="26px" style={{marginTop: '-14px'}}/>{this.state.collectionDetail.floor_price}</h5>
                                    <p>Floor Price</p>
                                  </li>
                                  <li className="">
                                    <h5><img src='https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg' width="26px" style={{marginTop: '-14px'}}/>{this.state.collectionDetail.trad_volume}</h5>
                                    <p>Volume traded</p>
                                  </li>
                               
                                </ul>

                              </div>
                              {/* <div className="row mb-4">
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.collectionDetail.item_count}</h5>
                                    <p>Items</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.collectionDetail.owner_count}</h5>
                                    <p>Owner</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.collectionDetail.floor_price}</h5>
                                    <p>Floor Price</p>
                                  </div>
                                </div>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                  <div className="collection_stats">
                                    <h5>{this.state.collectionDetail.trad_volume}</h5>
                                    <p>Volume traded</p>
                                  </div>
                                </div>
                              </div> */}
                            </div>
                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                            </div>
                            <div className='col-sm-2'></div>
                            <div className='col-sm-8 text-center'>
                              <p>{this.state.collectionDetail.description}</p>

                            </div>
                            <div className='col-sm-2'></div>
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
                            {this.state.myNftData.length === 0 ? 
                            <div style={{textAlign:'center'}}>
                              <img style={{width:'150px',height:'150px'}} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKd2o9atcvkhYF6qRh-6-vfcThr1SR0hnW0DmFSZ56otUyCKtKN_oeUbht4WmVl5JKsj4&usqp=CAU'/><br/><br/>
                              <p><b>No Items To Display</b></p>
                            </div>
                             : this.state.myNftData.map(item => (
                              <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                                <div className="nft__item">
                                {(item.sell_type === 2 && new Date(item.start_date) > new Date()) && item.start_date != '0000-00-00 00:00:00' && item.start_date !== null && item.start_date != '' ?
                                  <div className="de_countdown is-countdown" >
                                    <Countdown
                                      date={this.getTimeOfStartDate(item.start_date)}
                                      renderer={this.CountdownTimer}
                                    />
                                  </div>
                                  : 
                                  item.expiry_date != '0000-00-00 00:00:00' && item.expiry_date !== null && item.expiry_date != ''?
                                  <div className="de_countdown is-countdown" >
                                    <Countdown
                                      date={this.getTimeOfStartDate(item.expiry_date)}
                                      renderer={this.CountdownTimer}
                                    />
                                  </div> : ""
                                }
                                  <div className="author_list_pp">
                                    {!item.collection_profile_pic ?
                                      <a href={`${config.baseUrl}collections/${item.collection_id}`}>
                                        <img className="lazy" src="images/default-user-icon.jpg" alt="" />
                                      </a>
                                      :
                                      <a href={`${config.baseUrl}collections/${item.collection_id}`}>
                                        <img className="lazy" src={`${config.imageUrl1}`+item.collection_profile_pic} alt="" />
                                      </a>
                                    }
                                  </div>

                                  <div className="nft__item_wrap">
                                    <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}nftDetails/${item.item_id}`}>
                                      {item.file_type === 'image' ?
                                        !item.image ?
                                          <img src="images/collections/coll-item-3.jpg" className="lazy nft__item_preview" alt="" />
                                          :
                                          <img className="lazy nft__item_preview" src={`https://ipfs.io/ipfs/` + item.image} alt="" /> :

                                        item.file_type === 'video' ?
                                          <Player className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} /> :
                                          <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" />
                                      }
                                    </Link>

                                  </div>

                                  <div className="nft__item_info" style={{ backgroundSize: 'cover' }}>
                                    <a href={`${config.baseUrl}nftDetails/${item.item_id}`}>
                                      <h4>{item.name}<small className="pull-right">Price</small></h4>
                                    </a>
                                    <div className="nft__item_price" style={{ backgroundSize: 'cover' }}>
                                      <a style={{ color: '#727272' }} href={`${config.baseUrl}collections/${item.collection_id}`}>
                                        {item.collection_name}
                                      </a>
                                      <div className="pull-right" style={{ backgroundSize: 'cover' }}>ETH {item.price}</div>
                                    </div>
                                    <div className="nft__item_action">
                                      <a href={`${config.baseUrl}nftDetails/${item.item_id}`}>{item.sell_type_text}</a>
                                    </div>
                                    <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd' } : { color: '#EC7498' }}>
                                      <i style={{ cursor: 'pointer' }} onClick={e => this.likeCount(item)} className="fa fa-heart"></i><span>{item.like_count}</span>
                                    </div>
                                  </div>

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
            </div></section>
        </div>


        <Footer />
      </>
    )
  }
}