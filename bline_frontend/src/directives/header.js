import React, { Component } from 'react';
import config from '../config/config'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';
import Web3 from 'web3';
export default class header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      gamesCategoryRes: [],
      profileData: '',
      profilepic: '',
      userAddress: '',
      lastSeg: '',
      searchData: '',
      searchDataList: [],
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
    this.onChange = this.onChange.bind(this)
    this.connectMetasmask = this.connectMetasmask.bind(this)
    this.setTabAPI = this.setTabAPI.bind(this)

  }

  componentDidMount() {
    this.getGamesCategoryAPI()

    window.scrollTo({ top: 0 });
    var url = window.location.href;
    var result = url.split('/');
    var Param = result[result.length - 2];
    //   console.log(window.location.href.includes("marketplace"))
    this.setState({
      'lastSeg': Param
    })
    this.getUserData()



    // this.connectMetasmask()
    if (Cookies.get('loginSuccessBline')) {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', function (accounts) {
          Cookies.remove('loginSuccessBline')
          setTimeout(() => {
            window.location.href = `${config.baseUrl}`
          });
        })
      }
    }

  }

  async setTabAPI(type) {
    localStorage.setItem('type', type)

    // e.preventDefault()
    // console.log("lll",e.target.id,this.props);

    // this.props.headerData(e.target.id)
  }

  // async connectMetasmask() {
  //   if (window.ethereum) {
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     this.loginAPI(accounts[0])
  //   }
  //   else {
  //     toast.error(`Please use dApp browser to connect wallet!`, {

  //     });
  //   }
  //   setTimeout(() => {
  //     window.location.reload()
  //   }, 500);
  // }



  async connectMetasmask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('accounts[0]', accounts[0]);
      this.loginAPI(accounts[0])
    }
    else {
      // toast.error(`Please use dApp browser to connect wallet!`, {
      window.open('https://metamask.io/download/', '_blank');

      //       });
      //       setTimeout(() => {
      // }, );
    }
  }



  async loginAPI(address) {
    await axios({
      method: 'post',
      url: `${config.apiUrl}login`,
      data: { "address": address }
    }).then(response => {
      if (response.data.success === true) {
        toast.success('Wallet Connected!!.');
        Cookies.set('loginSuccessBline', JSON.stringify(response.data.data));
        Cookies.set('token', JSON.stringify(response.data.Token));
        setTimeout(() => {
          window.location.href = `${config.baseUrl}`
        }, 3000);
      } else {
        toast.error(response.data.msg);
      }
    }).catch(err => {
      toast.error(err.response.data.msg);
    })


  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })

    if (e.target.name === 'searchData') {
      this.allSearchAPI(e.target.value)
    }
  }

  async getUserData() {

    let userdata = this.loginData;
    this.setState({
      profilepic: userdata.profile_pic
    })
  }

  async getUserData() {
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


  logout() {
    Cookies.remove('loginSuccessBline')
    setTimeout(() => {
      window.location.href = `${config.baseUrl}`
    });
  }


  //======================================= all search API c ========================================

  async allSearchAPI(id) {
    // e.preventDefault()
    await axios({
      method: 'post',
      url: `${config.apiUrl}allSearch`,
      headers: { "Authorization": this.loginData?.message },
      data: { "search": id }
    }).then(response => {

      // console.log("response.data.success", response.data.response);

      if (response.data.success === true) {
        var collection = (response.data.response.findIndex(o => o.type === 'collection'));
        var obj1 = (response.data.response.findIndex(o => o.type === 'talent'));
        var obj = (response.data.response.findIndex(o => o.type === 'nft'));

        this.setState({
          talentIndex: obj1,
          nftIndex: obj,
          collectionData: collection,
          searchDataList: response.data.response
        })

      }
      else if (response.data.success === false) {
      }
    }).catch(err => {
      this.setState({
        searchDataList: []
      })


    })
  }

  loading(id) {
    setTimeout(() => {
      window.location.href = `${config.baseUrl}UserProfile/${id}`
      window.location.reload(true)
    }, 500);
  }

  loadingGroup(id) {
    setTimeout(() => {
      window.location.href = `${config.baseUrl}nftDetails/${id}`
      window.location.reload(true)
    }, 500);
  }


  async getGamesCategoryAPI() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCategory`,
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          gamesCategoryRes: response.data.response
        })

      }
    })
  }

  loadingpage() {
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }

  render() {


    return (
      <>
        <Toaster />

        <header className="transparent" style={{ background: window.location.href.substring(window.location.href.includes("marketplace")) || window.location.href.substring(window.location.href.includes("nftDetails")) || window.location.href.substring(window.location.href.includes("UserProfile")) || window.location.href.substring(window.location.href.includes("collections")) ? '#081F3F' : 'transparent' }}>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="de-flex sm-pt10">
                  <div className="de-flex-col">
                    <div className="de-flex-col">
                      <div id="logo">
                        <a href={`${config.baseUrl}`}>
                          <img alt="" className="logo" src="images/logo_white_transparent.png" width="200px" />
                          <img alt="" className="logo-2" src="images/logo_white_transparent.png" />
                        </a>
                      </div>

                    </div>
                    <div className="de-flex-col">
                      <form className="input-search" onSubmit={(e => e.preventDefault())}>
                        <input id="quick_search" autoComplete="off" className="xs-hide" value={this.state.searchData} name="searchData" onChange={this.onChange} placeholder="Search here..." type="text" />
                        <ul className="search_ul" style={{ display: this.state.searchDataList.length === 0 ? 'none' : 'block', overflowX: 'hidden' }}>
                          {this.state.searchDataList.map((item, i) => {

                            return (
                              (item.type == 'talent') ?
                                <>
                                  {(this.state.talentIndex == i) ?
                                    <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >Accounts</li>
                                    : ''}

                                  {/* <p style={{color:'#000'}}>People</p> */}
                                  <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                    <Link to={`${config.baseUrl}UserProfile/${item.id}`} onClick={this.loading.bind(this, item.id)}>
                                      <img src={item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                        ? 'images/default-user-icon.jpg'
                                        :
                                        `${config.imageUrl1}${item.profile_pic}`} style={{ height: '35px', width: '35px', borderRadius: '50%' }} alt="" />
                                      <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                      <br />

                                    </Link>
                                  </li></>
                                : item.type == 'collection' ?

                                  <>
                                    {(this.state.collectionData == i) ?
                                      <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >Collections</li>
                                      : ''}
                                    <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                      <a href={`${config.baseUrl}collections/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                        {item.profile_pic ?
                                          <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl1}${item.profile_pic}`} alt="omg" /> :
                                          <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl1}${item.profile_pic}`} alt="omg" />
                                        }
                                        <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                        <br />

                                      </a>
                                    </li>
                                  </>

                                  :
                                  <>
                                    {(this.state.nftIndex == i) ?
                                      <li className="mobile-font" style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: 'auto', paddingTop: '20px', borderBottom: '1px solid #ddd', marginBottom: '15px' }} >NFT</li>
                                      : ''}
                                    <li style={{ cursor: 'pointer', textAlign: 'left', width: '100%', color: '#000', height: '48px' }} title={item.full_name} >
                                      <Link to={`${config.baseUrl}nftDetails/${item.id}`} onClick={this.loadingGroup.bind(this, item.id)}>
                                        {item.file_type === 'image' ?
                                          <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" /> :
                                          item.file_type === 'video' ?
                                            <img src="images/youtube-logo2.jpg" style={{ height: '35px', width: '35px', borderRadius: '50%' }} />
                                            :
                                            <img effect="blur" style={{ height: '35px', width: '35px', borderRadius: '50%' }} src={`${config.imageUrl}${item.profile_pic}`} alt="omg" />
                                        }
                                        <span data-id={item.id} style={{ marginLeft: "10px", position: "relative", top: "-7px", color: "rgba(0, 0, 0, 0.87)" }}>{item.full_name}</span>
                                        <br />

                                      </Link>
                                    </li>
                                  </>
                            )
                          })}
                        </ul>
                      </form>
                    </div>
                  </div>


                  {Cookies.get('loginSuccessBline') ?
                    <div className="de-flex-col header-col-mid">
                      <ul id="mainmenu">
                        {/* <li>
                          <Link to={`${config.baseUrl}marketplace`}>Marketplace<span /></Link>
                        </li> */}
                        <li className="dropdown-profile">
                          <Link to={`${config.baseUrl}marketplace`}> Explore </Link>
                          <ul className="explore-menu">
                            <li>
                              <a href={`${config.baseUrl}marketplace`}>
                                All NFT's
                              </a>
                            </li>
                            {/* <li>
                              <a href to={`${config.baseUrl}marketplace`}>
                                New
                              </a>
                            </li> */}

                            {this.state.gamesCategoryRes.map(item => {
                              return (
                                <li>
                                  {/* <a href={`${config.baseUrl}categoryCollectionList/`+item.id}>
                                  {item.name}
                                </a> */}
                                  <a href={`${config.baseUrl}marketplace/${item.id}`}>
                                    {item.name}
                                  </a>
                                </li>
                              )
                            })}

                          </ul>
                        </li>
                        <li>
                          {this.loginData.length === 0 ?
                            <Link onClick={e => this.connectMetasmask()} href="javascript:void(0)"> Create NFT </Link>
                            :
                            <a href={`${config.baseUrl}createnft`}> Create NFT </a>
                          }
                        </li>
                        {/* <li>
                          <Link to={`${config.baseUrl}support`}>Support<span /></Link>
                        </li> */}

                        <li>
                          <a href={`${config.baseUrl}CollectionsList`}>Collections<span /></a>
                        </li>

                        <li>
                          <a target="_blank" href={`${config.blockchinUrl}${this.loginData?.address}`}>
                            <button className="btn-main">{this.loginData?.address?.toString().substring(0, 5) + '...' + this.loginData?.address?.toString().substr(this.loginData?.address?.length - 5)}</button></a>
                        </li>
                        <li className="dropdown-profile">
                          <a href="#">
                            {!this.state.aboutData?.profile_pic || this.state.aboutData?.profile_pic === '' || this.state.aboutData?.profile_pic === null || this.state.aboutData?.profile_pic === 'null' ?
                              <img src="images/default-user-icon.jpg" className="" alt="" width="50px" /> : <img className="image-auth login-user" style={{ height: '40px', width: '40px' }} src={`${config.imageUrl1}${this.state.aboutData?.profile_pic}`} alt="" />}
                            &nbsp;Profile</a>
                          <ul>
                            <li><a onClick={this.loadingpage.bind(this)} href={`${config.baseUrl}UserProfile/` + this.loginData?.id}><i className="fa fa-user diff" aria-hidden="true"></i>My profile</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 1)} href={`${config.baseUrl}accountsetting`}><i className="fa fa-briefcase" aria-hidden="true"></i>Portfolio</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 2)} href={`${config.baseUrl}accountsetting`}><i className="fa fa-gavel" aria-hidden="true"></i>Bids</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 3)} href={`${config.baseUrl}accountsetting`}><i className="fa fa-exchange" aria-hidden="true"></i>Transaction History</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 5)} href={`${config.baseUrl}accountsetting`}><i className="fa fa-user-circle" aria-hidden="true"></i>Account Setting</a></li>
                            <li><a onClick={this.setTabAPI.bind(this, 6)} href={`${config.baseUrl}accountsetting`}><i className="fa fa-window-restore" aria-hidden="true"></i>Collections</a></li>
                            {/* {/ <li><a onClick={this.setTabAPI.bind(this, 7)} href={`${config.baseUrl}accountsetting`}>Royalties</a></li> /} */}
                            <li><Link to={`${config.baseUrl}`} onClick={this.logout.bind(this)}><i className="fa fa-sign-out" aria-hidden="true"></i>Logout</Link></li>
                          </ul>
                        </li>

                      </ul>
                      <div className="menu_side_area">
                        <span id="menu-btn" />
                      </div>
                    </div>
                    :
                    <div className="de-flex-col header-col-mid">
                      <ul id="mainmenu">
                        <li className="dropdown-profile">
                          <Link to={`${config.baseUrl}marketplace`}> Explore </Link>
                          <ul>
                            <li>
                              <a href={`${config.baseUrl}marketplace`}>
                                All NFT's
                              </a>
                            </li>
                            {/* <li>
                              <a href={`${config.baseUrl}marketplace`}>
                                New
                              </a>
                            </li> */}

                            {this.state.gamesCategoryRes.map(item => {
                              return (
                                <li>
                                  {/* <a href={`${config.baseUrl}categoryCollectionList/`+item.id}>
                                  {item.name}
                                </a> */}
                                  <a href={`${config.baseUrl}marketplace/${item.id}`}>
                                    {item.name}
                                  </a>
                                </li>
                              )
                            })}

                          </ul>
                        </li>
                        <li>
                          {this.loginData.length === 0 ?
                            <a onClick={this.connectMetasmask} href="javascript:void(0)"> Create NFT </a>
                            :
                            <a href={`${config.baseUrl}createnft`}> Create NFT </a>
                          }
                        </li>
                        {/* <li>
                          <Link to={`${config.baseUrl}support`}>Support<span /></Link>
                        </li> */}

                        <li>
                          <a href={`${config.baseUrl}CollectionsList`}>Collections<span /></a>
                        </li>


                        <li>
                          <button className="btn-main" type='submit' onClick={this.connectMetasmask}>Connect</button>
                        </li>
                      </ul>
                      <div className="menu_side_area">
                        <span id="menu-btn" ></span>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    )
  }
}