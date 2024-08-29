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

export default class categoryCollectionList extends Component {
  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.id = params.id
    this.state = {
      getCollectionCategoryNft: []
    };
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
  }

  async getCollectionCategoryNftAPI() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getCollectionCategoryNft`,
      data: {
        "collection_category_id": this.id,
        "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
      }
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          getCollectionCategoryNft: response.data.response,
        })
      }
    })
  }

  componentDidMount() {
    this.getCollectionCategoryNftAPI()
  }

  getTimeOfStartDate(dateTime) {
    var date = new Date(dateTime);
    var milliseconds = date.getTime();
    return milliseconds;
  }

  CountdownTimer({ days, hours, minutes, seconds, completed }) {
    if (completed) {
      return "Starting";
    } else {
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
          this.getCollectionCategoryNftAPI()
        }

      }).catch((error) => {

      })
    } else {
      this.connectMetasmask()
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
          <section id="profile_banner" aria-label="section" className="text-light"
            style={{ backgroundImage: "url('images/background/bg-3.jpg')" }}>
          </section>
          {/* section close */}
          <section aria-label="section" className="d_coll no-top userprofile-page">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <div className="items_filter" style={{ backgroundSize: 'cover' }}>
                      <div className="de_tab_content">
                        <div className="tab-1" style={{ display: this.state.isActive === 1 ? 'block' : 'none' }}>
                          <div className="row">
                            {/* nft item begin */}
                            {console.log(this.state.getCollectionCategoryNft)}
                            {this.state.getCollectionCategoryNft.length === 0 ?
                              <p className="nonft">No NFT found!</p> :
                              this.state.getCollectionCategoryNft.slice(0, this.state.limit).map(item => {
                                return (

                                  <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item">

                                      {(item.sell_type === 2 && new Date(item.start_date) > new Date()) && item.start_date != '0000-00-00 00:00:00' && item.start_date !== null && item.start_date != '' ?
                                        <div className="de_countdown is-countdown" >
                                          <Countdown
                                            date={this.getTimeOfStartDate(item.start_date)}
                                            renderer={this.CountdownTimer}
                                          />
                                        </div>
                                        :
                                        item.expiry_date != '0000-00-00 00:00:00' && item.expiry_date !== null && item.expiry_date != '' ?
                                          <div className="de_countdown is-countdown" >
                                            <Countdown
                                              date={this.getTimeOfStartDate(item.expiry_date)}
                                              renderer={this.CountdownTimer}
                                            />
                                          </div> : ""
                                      }
                                      <div className="author_list_pp">
                                        {item.collection_profile_pic === null || !item.collection_profile_pic ?
                                          ""
                                          :
                                          <a href={`${config.baseUrl}collections/${item.collection_id}`}>
                                            <img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                            {item.is_verified == '1' ?
                                              <i className="fa fa-check"></i>
                                              : ""}
                                          </a>
                                        }
                                      </div>
                                      <div className="nft__item_wrap">
                                        <Link to={item.file_type === 'video' ? '#' : `${config.baseUrl}nftDetails/${item.item_id}`}>
                                          {item.file_type === 'image' ?
                                            <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" /> :
                                            item.file_type === 'video' ?
                                              <Player className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} /> :
                                              <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" />
                                          }
                                        </Link>

                                      </div>
                                      <div className="nft__item_info" style={{ backgroundSize: 'cover' }}>
                                        <Link to={`${config.baseUrl}nftDetails/${item.item_id}`}>
                                          <h4>{item.name}<small className="pull-right">Price</small></h4>
                                        </Link>
                                        <div className="nft__item_price" style={{ backgroundSize: 'cover' }}>
                                          <Link style={{ color: '#727272' }} to={`${config.baseUrl}collections/${item.collection_id}`}>
                                            {!item.collection_name ? 'NA' : item.collection_name}
                                          </Link>
                                          <div className="pull-right" style={{ backgroundSize: 'cover' }}>${item.price}</div>
                                        </div>
                                        <div className="nft__item_action">
                                          <Link to={`${config.baseUrl}nftDetails/${item.item_id}`}>{!item.sell_type_text ? 'NA' : item.sell_type_text}</Link>
                                        </div>
                                        <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                          <i className="fa fa-heart" onClick={e => this.likeCount(item)}></i><span >{item.like_count}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>)
                              })
                            }


                            {this.state.getCollectionCategoryNft.length > 15 ?
                              <div className="col-md-12 text-center">
                                <a className="btn-main wow fadeInUp lead" style={{ cursor: "pointer" }} onClick={e => this.loadMore(e)}>Load more</a>
                              </div> : ''
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