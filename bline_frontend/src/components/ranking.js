import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import Cookies from 'js-cookie'
import config from '../config/config'

export default class createnft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      collectionData: [],
      nftData : []
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
  }

  componentDidMount() {
    this.getCollectionAPI();
    this.getNFTAPI();
  }

  async getCollectionAPI(days) {
    if (!days) {
      var daysLimit = 0
    } else {
      var daysLimit = days
    }

    this.setState({
      collectionData: []
    })

    await axios({
      method: 'post',
      url: `${config.apiUrl}rankingCollection`,
      data: { "days": daysLimit }
    }).then(response => {
      const data = response.data;
      if (response.data.success === true) {
        this.setState({
          collectionData: response.data.response,
        })
      }
      else if (response.data.success === false) {
        this.setState({
          collectionData: []
        })
      }
    })
      .catch(err => {
        this.setState({
          collectionData: []
        })
      })
  }

  onChangeOption(e) {
    this.getCollectionAPI(e.target.value)
  }

  async getNFTAPI(days) {
    if (!days) {
      var daysLimit = 0
    } else {
      var daysLimit = days
    }

    this.setState({
      nftData: []
    })

    await axios({
      method: 'post',
      url: `${config.apiUrl}rankingCollection`,
      data: { "days": daysLimit }
    }).then(response => {
      const data = response.data;
      if (response.data.success === true) {
        this.setState({
          nftData: response.data.response,
        })
      }
      else if (response.data.success === false) {
        this.setState({
          nftData: []
        })
      }
    })
      .catch(err => {
        this.setState({
          nftData: []
        })
      })
  }

  render() {
    return (
      <>
        <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <section id="subheader" className="text-light"
            style={{ backgroundImage: `url("images/background/bg-3.jpg")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Ranking</h1>
                    <p>Top Projects and NFTs ranked</p>
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section ">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist" style={{ justifyContent: 'center' }}>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Top NFT</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Top Project</button>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab"><div className="row mb-5">
                      <div className="col-sm-3">
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group">
                          <select className="form-control">
                            <option>Last 7 days</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        <div className="form-group">
                          <select className="form-control">
                            <option>All Categories</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-3">
                      </div>
                    </div>
                      <div className="row mt-3 top-nft">
                        <div className="table-responsive ">
                          <table width="100%">
                            <thead>
                              <tr><th>Collection</th>
                                <th>Volume</th>
                                <th>24h %</th>
                                <th>7d%</th>
                                <th>Floor Price</th>
                                <th>Owners</th>
                                <th>Assets</th>
                              </tr></thead>
                            <tbody>
                              <tr>
                                <td>1.&nbsp;<span className="img-col"><img src="images/f1.png" width="32px" /></span>&nbsp;Crypto punks</td>
                                <td>11.987.57</td>
                                <td><div className="text-green">+684.70%</div></td>
                                <td><div className="text-red">-18.72%</div></td>
                                <td>----</td>
                                <td>3.1k</td>
                                <td>10.0k</td>
                              </tr>
                              <tr>
                                <td>2.&nbsp;<span className="img-col"><img src="images/f2.jpg" width="32px" /></span>&nbsp;Art Blocks Curated</td>
                                <td>11.987.57</td>
                                <td><div className="text-green">+684.70%</div></td>
                                <td><div className="text-green">+40.57%</div></td>
                                <td>----</td>
                                <td>3.1k</td>
                                <td>10.0k</td>
                              </tr>
                              <tr>
                                <td>3.&nbsp;<span className="img-col"><img src="images/f3.png" width="32px" /></span>&nbsp;CrypToadz by Gremplin</td>
                                <td>11.987.57</td>
                                <td><div className="text-red">-36.01%</div></td>
                                <td><div className="text-red">-18.72%</div></td>
                                <td>----</td>
                                <td>3.1k</td>
                                <td>10.0k</td>
                              </tr>
                              <tr>
                                <td>4.&nbsp;<span className="img-col"><img src="images/f4.png" width="32px" /></span>&nbsp;Speaky Vampire Syndic</td>
                                <td>11.987.57</td>
                                <td><div className="text-red">-69.25%</div></td>
                                <td><div className="text-green">+3282.62%</div></td>
                                <td>----</td>
                                <td>3.1k</td>
                                <td>10.0k</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div></div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab"><div className="row mb-5">
                      <div className="col-sm-4">
                      </div>
                      <div className="col-sm-4">
                        <div className="form-group">
                          <select onClick={this.onChangeOption.bind(this)} className="form-control">
                            <option value="0">All</option>
                            <option value="1">Last 7 days</option>
                            <option value="2">Last 15 days</option>
                            <option value="3">Last Month</option>
                            <option value="4">Last 3 Month</option>
                            <option value="5">Last 6 Month</option>
                          </select>
                        </div>
                      </div>
                    </div>
                      <div className="row mt-3 top-nft">
                        <div className="table-responsive ">
                          <table width="100%">
                            <thead>
                              <tr><th>Collection</th>
                              <th>Creator</th>
                                <th>Create Date</th>
                                <th style={{textAlign:'right'}}>Volume</th>
                                <th style={{textAlign:'right'}}>Floor Price</th>
                                <th style={{textAlign:'right'}}>Owners</th>
                                <th style={{textAlign:'right'}}>Assets</th>
                              </tr></thead>
                            <tbody>
                              {this.state.collectionData.map((item, i) => (
                                <tr>
                                  <td>{i+1}.&nbsp;<span className="img-col"><img src={item.profile_pic} width="32px" /></span>&nbsp;{item.collection_name}</td>
                                  <td>{item.user_name}</td>
                                  <td>{item.create_date}</td>                                  
                                  <td style={{textAlign:'right'}}>{item.trade_volume?item.trade_volume : '0'}</td>
                                  <td style={{textAlign:'right'}}>{item.floor_price?item.floor_price:'0'}</td>
                                  <td style={{textAlign:'right'}}>{item.owner_count?item.owner_count:'0'}</td>
                                  <td style={{textAlign:'right'}}>{item.collection_nft_price?item.collection_nft_price: '0'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div></div>
                  </div>
                </div>
              </div>
              <br />
            </div>
          </section>
        </div>
        <br /> <br />
        <Footer />
      </>
    )
  }
}