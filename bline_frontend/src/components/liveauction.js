import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class liveauction extends Component {



    render() {
        return (    
 
            <>
          <div id="wrapper">
<Header/>
<div className="no-bottom no-top" id="content">
        <div id="top" />
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img src="images/items/big-1.jpg" className="img-fluid img-rounded mb-sm-30" alt="" />
                <div className="mobile_view_panel">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-12">
                      <div className="item_info">
                        <div className="name_verify">
                          <div className="row">
                            <div className="col-lg-1 col-xl-1 col-md-1 col-6">
                              <div className="author_list_pp" style={{backgroundSize: 'cover'}}>
                                <a href="03_grey-author.html">                                    
                                  <img className="lazy" src="images/author/author-1.jpg" alt="" />
                                  <i className="fa fa-check" />
                                </a>
                              </div>
                            </div>
                            <div className="col-lg-5 col-xl-5 col-md-5 col-6">
                              <a href="#" className="verify_nft">Pinky Ocean<img src="images/correct.png" className="verify_icon" /></a>
                            </div>
                            <div className="col-lg-6 col-xl-6 col-md-6 col-6">
                              <div className="edit_icons">
                                {/* <a href="#"><i class="fa fa-repeat" aria-hidden="true"></i></a> */}
                                <a href="#"><i className="fa fa-pencil-square-o" aria-hidden="true" /></a>
                                <a href="#"> <i className="fa fa-share-alt" aria-hidden="true" /></a>
                                {/* <a href="#"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i></a> */}
                              </div>
                            </div>
                          </div>
                        </div>
                        <h2>Pinky Ocean<span className="nft_rank">#120</span></h2>
                        <div className="item_info_counts">
                          <div className="item_info_type">Owned by<a href="#">FlowChaser444</a> </div>
                          <div className="item_info_views"><i className="fa fa-eye" />250k view</div>
                          <div className="item_info_like"><i className="fa fa-heart" />18k favorites</div>
                        </div>
                        <div className="top_bids mt-1">
                          <p>Top bid --- Reserve price not met.</p>
                          <h4 className="price_bids"><img src="images/eth-icon.png" className="coin_img" />0.185<small>($564.26)</small><i className="fa fa-arrow-circle-up" aria-hidden="true" /></h4>
                          <button className="place_bids"><img src="images/wallet.png" className="wallet_icon" />Place Bid</button>
                        </div>
                        <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />&nbsp;&nbsp;Sale ends in <span className="days">3 day</span>(September 19,2021 at 6:07pm +08)  <i className="fa fa-question-circle" aria-hidden="true" /></div>
                        <div className="de_tab tab_simple mt-4">
                          <ul className="de_nav">
                            <li className="active"><span>Collection Stats</span></li>
                            {/* <li ><span>Bids</span></li> */}
                            <li><span>History</span></li>
                          </ul>
                          <div className="de_tab_content">
                            <div className="tab-1">
                              <div className="row mt-2 mb-5" style={{backgroundSize: 'cover'}}>
                                <div className="row">
                                  <div className="col-lg-5 col-xl-5 col-md-5 col-12"> 
                                    <div className="row">
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                        <div className="collection_stats mt-3" style={{backgroundSize: 'cover'}}>
                                          <h5>8.0K</h5>
                                          <p>Items</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                        <div className="collection_stats mt-3" style={{backgroundSize: 'cover'}}>
                                          <h5>2.2K</h5>
                                          <p>Owner</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                        <div className="collection_stats mt-5" style={{backgroundSize: 'cover'}}>
                                          <h5><img src className="nft_coin" />0.22</h5>
                                          <p>Floor Price</p>
                                        </div>
                                      </div>
                                      <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                        <div className="collection_stats mt-5" style={{backgroundSize: 'cover'}}>
                                          <h5>8.0K</h5>
                                          <p>Volume traded</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-7 col-xl-7 col-md-7 col-12">
                                    <div id="chartContainers" style={{height: '200px', width: '100%'}} />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="tab-2">
                              <div className="p_list">
                                <div className="p_list_pp">
                                  <a href="author.html">
                                    <img className="lazy" src="images/author/author-5.jpg" alt="" />
                                    <i className="fa fa-check" />
                                  </a>
                                </div>                                    
                                <div className="p_list_info">
                                  Bid <b>0.005 ETH</b>
                                  <span>by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM</span>
                                </div>
                              </div>
                              <div className="p_list">
                                <div className="p_list_pp">
                                  <a href="author.html">
                                    <img className="lazy" src="images/author/author-1.jpg" alt="" />
                                    <i className="fa fa-check" />
                                  </a>
                                </div>                                    
                                <div className="p_list_info">
                                  Bid accepted <b>0.005 ETH</b>
                                  <span>by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM</span>
                                </div>
                              </div>
                              <div className="p_list">
                                <div className="p_list_pp">
                                  <a href="author.html">
                                    <img className="lazy" src="images/author/author-2.jpg" alt="" />
                                    <i className="fa fa-check" />
                                  </a>
                                </div>                                    
                                <div className="p_list_info">
                                  Bid <b>0.005 ETH</b>
                                  <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                                </div>
                              </div>
                              <div className="p_list">
                                <div className="p_list_pp">
                                  <a href="author.html">
                                    <img className="lazy" src="images/author/author-3.jpg" alt="" />
                                    <i className="fa fa-check" />
                                  </a>
                                </div>                                    
                                <div className="p_list_info">
                                  Bid <b>0.004 ETH</b>
                                  <span>by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM</span>
                                </div>
                              </div>
                              <div className="p_list">
                                <div className="p_list_pp">
                                  <a href="author.html">
                                    <img className="lazy" src="images/author/author-4.jpg" alt="" />
                                    <i className="fa fa-check" />
                                  </a>
                                </div>                                    
                                <div className="p_list_info">
                                  Bid <b>0.003 ETH</b>
                                  <span>by <b>Lori Hart</b> at 6/12/2021, 12:57 AM</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="distcription">
                  <div className="distcription_header">
                    <img src="images/right-menu-bars.png" className="accordian_icon" />Project Description
                  </div>
                  <div className="distcription_body">
                    <h5><span className="Create_by">Create by </span>&nbsp;<a href="#"> DDAJ7A</a></h5>
                    <p>Pinky Ocean Painting are a collection of 9,999 Pinky Ocean the Ethereum Blockchain </p>
                  </div>
                </div>
                <div className="accordion mt-0" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <img src="images/pentagon.png" className="accordian_icon" />Properties
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-xl-4 col-lg-4 col-md-4 col-12">
                            <div className="properties_box">
                              <a href="#">BACKGROUND</a>
                              <h4>Mix Color</h4>
                              <p>24% have this trait</p>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-12">
                            <div className="properties_box">
                              <a href="#">BACKGROUND</a>
                              <h4>Purple Spotted</h4>
                              <p>24% have this trait</p>
                            </div>
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-12">
                            <div className="properties_box">
                              <a href="#">BACKGROUND</a>
                              <h4>Water Color</h4>
                              <p>24% have this trait</p>
                            </div>
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
                              <p>Contract Address</p>
                              <p>Token ID</p>
                              <p>Token Standard</p>
                              <p>Blockchain</p>
                            </div>
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-6 col-6">
                            <div className="detail_add">
                              <p className="contract_add">00016310...26546232</p>
                              <p>5204</p>
                              <p>ERC-721</p>
                              <p>Ethereum</p>
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
                        <div className="author_list_pp" style={{backgroundSize: 'cover'}}>
                          <a href="03_grey-author.html">                                    
                            <img className="lazy" src="images/author/author-1.jpg" alt="" />
                            <i className="fa fa-check" />
                          </a>
                        </div>
                      </div>
                      <div className="col-lg-5 col-xl-5 col-md-5 col-6">
                        <a href="#" className="verify_nft">Pinky Ocean<img src="images/correct.png" className="verify_icon" /></a>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-6">
                        <div className="edit_icons">
                          {/* <a href="#"><i class="fa fa-repeat" aria-hidden="true"></i></a> */}
                          <a href="#"><i className="fa fa-pencil-square-o" aria-hidden="true" /></a>
                          <a href="#"> <i className="fa fa-share-alt" aria-hidden="true" /></a>
                          {/* <a href="#"> <i class="fa fa-ellipsis-v" aria-hidden="true"></i></a> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2>Pinky Ocean<span className="nft_rank">#120</span></h2>
                  <div className="item_info_counts">
                    <div className="item_info_type">Owned by<a href="#">FlowChaser444</a> </div>
                    <div className="item_info_views"><i className="fa fa-eye" />250k view</div>
                    <div className="item_info_like"><i className="fa fa-heart" />18k favorites</div>
                  </div>
                  <div className="top_bids mt-1">
                    <p>Top bid --- Reserve price not met.</p>
                    <h4 className="price_bids"><img src="images/eth-icon.png" className="coin_img" />0.185<small>($564.26)</small><i className="fa fa-arrow-circle-up" aria-hidden="true" /></h4>
                    <button className="place_bids"><img src="images/wallet.png" className="wallet_icon" />Place Bid</button>
                  </div>
                  <div className="item_info_like"><i className="fa fa-clock-o" aria-hidden="true" />&nbsp;&nbsp;Sale ends in <span className="days">3 day</span>(September 19,2021 at 6:07pm +08)  <i className="fa fa-question-circle" aria-hidden="true" /></div>
                  <div className="de_tab tab_simple mt-4">
                    <ul className="de_nav">
                      <li className="active"><span>Collection Stats</span></li>
                      {/* <li ><span>Bids</span></li> */}
                      <li><span>History</span></li>
                    </ul>
                    <div className="de_tab_content">
                      <div className="tab-1">
                        <div className="row mt-2 mb-5" style={{backgroundSize: 'cover'}}>
                          <div className="row">
                            <div className="col-lg-5 col-xl-5 col-md-5 col-12"> 
                              <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                  <div className="collection_stats mt-3" style={{backgroundSize: 'cover'}}>
                                    <h5>8.0K</h5>
                                    <p>Items</p>
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                  <div className="collection_stats mt-3" style={{backgroundSize: 'cover'}}>
                                    <h5>2.2K</h5>
                                    <p>Owner</p>
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                  <div className="collection_stats mt-5" style={{backgroundSize: 'cover'}}>
                                    <h5><img src className="nft_coin" />0.22</h5>
                                    <p>Floor Price</p>
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-12" style={{backgroundSize: 'cover'}}>
                                  <div className="collection_stats mt-5" style={{backgroundSize: 'cover'}}>
                                    <h5>8.0K</h5>
                                    <p>Volume traded</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-7 col-xl-7 col-md-7 col-12">
                              <div id="chartContainer" style={{height: '200px', width: '100%'}} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="tab-2">
                        <div className="p_list">
                          <div className="p_list_pp">
                            <a href="author.html">
                              <img className="lazy" src="images/author/author-5.jpg" alt="" />
                              <i className="fa fa-check" />
                            </a>
                          </div>                                    
                          <div className="p_list_info">
                            Bid <b>0.005 ETH</b>
                            <span>by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM</span>
                          </div>
                        </div>
                        <div className="p_list">
                          <div className="p_list_pp">
                            <a href="author.html">
                              <img className="lazy" src="images/author/author-1.jpg" alt="" />
                              <i className="fa fa-check" />
                            </a>
                          </div>                                    
                          <div className="p_list_info">
                            Bid accepted <b>0.005 ETH</b>
                            <span>by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM</span>
                          </div>
                        </div>
                        <div className="p_list">
                          <div className="p_list_pp">
                            <a href="author.html">
                              <img className="lazy" src="images/author/author-2.jpg" alt="" />
                              <i className="fa fa-check" />
                            </a>
                          </div>                                    
                          <div className="p_list_info">
                            Bid <b>0.005 ETH</b>
                            <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                          </div>
                        </div>
                        <div className="p_list">
                          <div className="p_list_pp">
                            <a href="author.html">
                              <img className="lazy" src="images/author/author-3.jpg" alt="" />
                              <i className="fa fa-check" />
                            </a>
                          </div>                                    
                          <div className="p_list_info">
                            Bid <b>0.004 ETH</b>
                            <span>by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM</span>
                          </div>
                        </div>
                        <div className="p_list">
                          <div className="p_list_pp">
                            <a href="author.html">
                              <img className="lazy" src="images/author/author-4.jpg" alt="" />
                              <i className="fa fa-check" />
                            </a>
                          </div>                                    
                          <div className="p_list_info">
                            Bid <b>0.003 ETH</b>
                            <span>by <b>Lori Hart</b> at 6/12/2021, 12:57 AM</span>
                          </div>
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
      <Footer/>
      </div>  
    </>
        )
    }
}