import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Cookies from 'js-cookie';
import Countdown, { zeroPad } from 'react-countdown';
import { ToastContainer, toast } from 'react-toastify';
import { Player } from 'video-react';
import { Link } from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

const MAX_LENGTH = 15;

export default class marketplace extends Component {

  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.subcategory_id = params.subcategory_id
    this.state = {
      marketPlaces: [],
      getItemAllNfts:[],
      allMarketPlaces: [],
      collections: [],
      categories: [],
      searchCollection: '',
      searchAnything: "",
      selectType: '',
      priceType: 'ADA',
      minPrice: 0,
      maxPrice: 0,
      limit: 15,
      collectionIds: [],
      itemCategoryIds: [],
      GamesitemCategoryIds: [],
      gamesResponse: []
    };
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
    this.CollectionHandler = this.CollectionHandler.bind(this)
    this.CategoryHandler = this.CategoryHandler.bind(this)
    this.connectMetasmask = this.connectMetasmask.bind(this)

  }


  async marketPlaceList() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}marketplace`,
      data: {
        "user_id": "0",
        "user_collection_id": "0",
        "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
        "is_featured": "0",
        "recent": "0",
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          marketPlaces: this.subcategory_id != undefined ? res.data.response.filter(item => item.item_category_id == parseInt(this.subcategory_id)) : res.data.response
        })
      }
      // alert(this.state.marketPlaces)
    }).catch((error) => {

    })
  }

  async collectionList() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}getAllUserCollection`,
      data: {
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          collections: res.data.response
        })
      }

    }).catch((error) => {

    })
  }

  async getCategories() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getCategory`,
      params: {
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          categories: res.data.response
        })
      }

    }).catch((error) => {

    })
  }

  async allMarketPlaces() {
    await axios({
      method: 'post',
      url: `${config.apiUrl}marketplace`,
      data: {
        "user_id": "0",
        "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
        "user_collection_id": "0",
        "is_featured": "0",
        "recent": "0",
        "limit": "0"
      }
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          allMarketPlaces: res.data.response
        })
      }

    }).catch((error) => {

    })

  }

  searchCollection = (e) => {
    const { value } = e.target
    this.setState({ searchCollection: value })
    var regex = new RegExp(value);
    const matchedCollection = this.state.collections.filter(item => item.collection_name.match(regex));
    if (matchedCollection.length > 0) {
      this.setState({ collections: matchedCollection })
    } else {
      this.collectionList()
    }

  }

  searchAnything = (e) => {
    const { value } = e.target
    this.setState({ searchAnything: value })
    var regex = new RegExp(value.toUpperCase());
    const matchedData = this.state.allMarketPlaces.filter(item => item.name != null && item.expiry_date != '0000-00-00 00:00:00' && item.name.toUpperCase().match(regex));
    if (matchedData.length > 0) {
      this.setState({ marketPlaces: matchedData })
    } else {
      this.setState({ marketPlaces: [] })
    }
  }

  // CollectionHandler = (selectitem) => {
  //   selectitem = JSON.parse(selectitem);
  //   const filterItems = this.state.allMarketPlaces.filter(item => item.collection_id == selectitem.collection_id);
  //   if (filterItems.length > 0) {
  //     this.setState({ marketPlaces: filterItems })
  //   } else {
  //     this.setState({ marketplaces: [] })
  //   }
  // }

  // CategoryHandler = (selectcategory) => {
  //   selectcategory = JSON.parse(selectcategory);
  //   const filterItems = this.state.allMarketPlaces.filter(item => selectcategory.id == item.item_category_id);
  //   if (filterItems.length > 0) {
  //     this.setState({ marketPlaces: filterItems })
  //   } else {
  //     this.setState({ marketplaces: [] })
  //   }
  //   if (selectcategory.length == 0) {
  //     this.setState({ marketplaces: this.state.allMarketPlaces })
  //   }
  // }

  CollectionHandler = (e, selectitem) => {
    e.preventDefault()
    let collectionIds = [...this.state.collectionIds];

    const index = collectionIds.indexOf(selectitem.collection_id);

    if (index > -1) {
      collectionIds.splice(index, 1);
    } else {
      collectionIds.push(selectitem.collection_id);
    }

    this.setState({ collectionIds });
    const filterItems = this.state.allMarketPlaces.filter(item => collectionIds.includes(item.collection_id));
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketplace: [] })
    }
    if (collectionIds.length == 0) {
      // this.setState({ marketplace: this.state.allMarketPlaces })
        this.componentDidMount()
    }
    
  }

  CategoryHandler = (e, selectcategory) => {
    e.preventDefault()
    let itemCategoryIds = [...this.state.itemCategoryIds];

    const index = itemCategoryIds.indexOf(selectcategory.id);

    if (index > -1) {
      itemCategoryIds.splice(index, 1);
    } else {
      itemCategoryIds.push(selectcategory.id);
    }

    this.setState({ itemCategoryIds });
    const filterItems = this.state.allMarketPlaces.filter(item => itemCategoryIds.includes(item.item_category_id));
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketplace: [] })
    }
    if (itemCategoryIds.length == 0) {
      // this.setState({ marketplace: this.state.allMarketPlaces })
      this.componentDidMount()
    }

    // const filterItems = this.state.allMarketPlaces.filter(item => item.item_category_id === selectcategory.id);
    // if (filterItems.length > 0) {
    //   this.setState({ marketPlaces: filterItems })
    // } else {
    //   this.setState({ marketplace: [] })
    // }
  }


  GamesCategoryHandler = (e, selectcategory) => {
    e.preventDefault()
    let GamesitemCategoryIds = [...this.state.GamesitemCategoryIds];
    const index = GamesitemCategoryIds.indexOf(selectcategory.id);

    if (index > -1) {
      GamesitemCategoryIds.splice(index, 1);
    } else {
      GamesitemCategoryIds.push(selectcategory.id);
    }



    this.setState({ GamesitemCategoryIds });
    const filterItems = this.state.allMarketPlaces.filter(item => GamesitemCategoryIds.includes(item.item_subcategory_id));



    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketPlaces: [] })
    }
    if (GamesitemCategoryIds.length == 0) {
      this.setState({ marketPlaces: this.state.allMarketPlaces })
    }
  }

  selectTypeHandler = (value) => {
    const filterItems = this.state.allMarketPlaces.filter(item => item.sell_type == value);
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems, selectType: value })
    } else {
      this.setState({ marketplace: [] })
    }
  }


  PriceFilter = (e) => {
    this.setState({ priceType: e.target.value })
  }

  PriceHeaderFilter = async (e) => {
    if (e.target.value === 'Lowtohigh') {
      var lowtohigh = this.state.marketPlaces.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      this.setState({ marketPlaces: lowtohigh })
    } else if (e.target.value === 'Hightolow') {
      var hightolow = this.state.marketPlaces.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      this.setState({ marketPlaces: hightolow })
    }
    else if (e.target.value === 'newesttooldest') {
      var newesttooldest = this.state.marketPlaces.sort((a, b) => new Date((b.datetime)) - new Date((a.datetime)));
      this.setState({ marketPlaces: newesttooldest })
    }
    else if (e.target.value === 'oldesttonewest') {
      var oldesttonewest = this.state.marketPlaces.sort((a, b) => new Date((a.datetime)) - new Date((b.datetime)));
      this.setState({ marketPlaces: oldesttonewest })
    }
    else if (e.target.value === 'AtoZ') {
      var AtoZ = this.state.marketPlaces.sort((a, b) => a.name.localeCompare(b.name))
      this.setState({ marketPlaces: AtoZ })
    }
    else if (e.target.value === 'ZtoA') {
      var ZtoA = this.state.marketPlaces.sort((a, b) => b.name.localeCompare(a.name))
      this.setState({ marketPlaces: ZtoA })
    }
    else if (e.target.value === 'trending') {
      var trending = this.state.marketPlaces.filter((item) => item.is_featured == 1)

      this.setState({ marketPlaces: trending })
    }
    else if (e.target.value === 'itemssold') {
      var itemssold = this.state.marketPlaces.filter((item) => item.is_sold == 1)
      this.setState({ marketPlaces: itemssold })
    }
    else if (e.target.value === 'onsale') {
      var onsale = this.state.marketPlaces.filter((item) => item.is_on_sale == 1)
      this.setState({ marketPlaces: onsale })
    }







    else {
      await axios({
        method: 'post',
        url: `${config.apiUrl}marketplace`,
        data: {
          "user_id": "0",
          "user_collection_id": "0",
          "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
          "is_featured": "0",
          "recent": "0",
          "limit": "0"
        }
      }).then((res) => {
        if (res.data.success === true) {
          this.setState({
            marketPlaces: res.data.response
          })
        }

      }).catch((error) => {

      })
    }


  }

  applyPriceFilter = () => {
    if (this.state.priceType === 'ADA') {
      var filterItems = this.state.minPrice > 0 && !this.state.maxPrice ?
        this.state.allMarketPlaces.filter(item => item.price >= parseInt(this.state.minPrice))
        : this.state.maxPrice > 0 && !this.state.minPrice
          ? this.state.allMarketPlaces.filter(item => item.price <= parseInt(this.state.maxPrice))
          :
          this.state.allMarketPlaces.filter(item => item.price >= parseInt(this.state.minPrice) && item.price <= parseInt(this.state.maxPrice));

      if (this.state.minPrice === '' || this.state.maxPrice === '') {
        this.setState({ marketPlaces: this.state.allMarketPlaces })
      }
    } else if (this.state.priceType === 'USD') {

      var filterItems = this.state.minPrice > 0 && !this.state.maxPrice ?
        this.state.allMarketPlaces.filter(item => item.usd_price >= parseInt(this.state.minPrice))
        : this.state.maxPrice > 0 && !this.state.minPrice
          ? this.state.allMarketPlaces.filter(item => item.usd_price <= parseInt(this.state.maxPrice))
          :
          this.state.allMarketPlaces.filter(item => item.usd_price >= parseInt(this.state.minPrice) && item.usd_price <= parseInt(this.state.maxPrice));
    }
    if (filterItems.length > 0) {
      this.setState({ marketPlaces: filterItems })
    } else {
      this.setState({ marketplace: [] })
    }

  }

  loadMore = () => {
    this.setState({ limit: parseInt(this.state.limit) + 6 })
  }

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
          // toast.success(res.data.msg)

          this.marketPlaceList()
          this.allMarketPlaces()
        }

      }).catch((error) => {

      })
    } else {
      this.connectMetasmask()
    }

  }

  componentDidMount() {
    this.marketPlaceList();
    this.collectionList()
    this.getCategories()
    this.getGamesCategoryAPI()
    this.allMarketPlaces()
    this.totalNfts()
  }

  async getGamesCategoryAPI() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getGamesCategory`,
    }).then(response => {
      if (response.data.success === true) {
        this.setState({
          gamesResponse: response.data.response
        })
      }
    })
  }

  async connectMetasmask() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.loginAPI(accounts[0])
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
            window.location.href = `${config.baseUrl}accountSetting`
          }, 3000);
        }
        else if (response.data.data.enableTwoFactor === 1) {
          Cookies.set('loginSuccessBlineAuth', JSON.stringify(response.data.data));
          setTimeout(() => {
            window.location.href = `${config.baseUrl}googleAuth`
          }, 1000);
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

  async resetButton() {
    this.componentDidMount()
  }


  async totalNfts() {
    await axios({
      method: 'get',
      url: `${config.apiUrl}getItemAll`,
      data: {}
    }).then((res) => {
      if (res.data.success === true) {
        this.setState({
          getItemAllNfts: res.data.response
        })
      }
    }).catch((error) => {

    })
  }


  render() {

    return (

      <>
        <div id="wrapper">
          <Header />
          <ToastContainer />
          <div className="no-bottom" id="content">
            <div id="top" />
            {/* section begin */}
            <section aria-label="section" className="marketplace">
              <div className="container">
              <div className="row mt-3 mb-5" style={{ backgroundSize: 'cover' }}>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12" style={{ backgroundSize: 'cover' }}>
                    <form className="form-inline">
                      <div className="form" style={{ backgroundSize: 'cover' }}> <i className="fa fa-search" /> <input type="text" onChange={e => this.searchAnything(e)} value={this.state.searchAnything} className="form-control form-input" placeholder="Search anything..." />
                      </div>
                    </form>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                    <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                      <select onChange={e => this.PriceHeaderFilter(e)} className="form-control">
                        <option value='All'>Sorting</option>
                        <option value='newesttooldest'>Newest to oldest</option>
                        <option value='oldesttonewest'> Oldest to newest</option>
                        <option value='AtoZ'>Order A to Z</option>
                        <option value='ZtoA'>Order Z to A</option>
                        <option value='Lowtohigh'>Price: Low to High</option>
                        <option value='Hightolow'>Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}>
                    <div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                      <select onChange={e => this.PriceHeaderFilter(e)} className="form-control">
                        <option value='All'>Filter</option>
                        <option value='trending'>Trending</option>
                        {/* <option value='itemssold'>Items Sold</option> */}
                        <option value='onsale'>On sale</option>
                      </select>
                    </div>
                  </div>

                </div>
                <div className="row wow fadeIn">
                <aside className="col-md-3">
                    <a href={`${config.baseUrl}marketplace`}><button className="btn btn-primary btn-sm">Reset</button></a>
                    <div className="accordion accordion-flush" id="accordionFlushExample" >

                      <div className="accordion-item" >
                        <h2 className="accordion-header" id="flush-headingOne">
                          <button className="market-place accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Status
                          </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">
                            <div className={`FeaturedFilter-item ${this.state.selectType === 1 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(1)}>Buy Now</div>
                            <div className={`FeaturedFilter-item ${this.state.selectType === 2 ? 'FeaturedFilter--isSelected' : ""}`} onClick={e => this.selectTypeHandler(2)}>On Auction</div>

                          </div>
                        </div>
                      </div>


                      <div className="accordion-item" >
                        <h2 className="accordion-header" id="flush-headingTwo">
                          <button className="market-place accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            Price
                          </button>
                        </h2>
                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">
                            <select onChange={e => this.PriceFilter(e)} className="form-control">
                              <option value={'ADA'}>Ethereum (ETH)</option>
                              {/* <option value={'USD'}>United States Dollar (USD)</option> */}
                            </select>
                            <div className="min-max-field">
                              <div className>
                                <input type="text" onChange={e => this.setState({ minPrice: e.target.value })} className="form-control" name placeholder="Min" />
                              </div>
                              <div className="to">to</div>
                              <div className>
                                <input type="text" onChange={e => this.setState({ maxPrice: e.target.value })} className="form-control" name placeholder="Max" />
                              </div>
                            </div>
                            <button className="btn btn-primary mt-3" onClick={e => this.applyPriceFilter()}>Apply</button>

                          </div>
                        </div>
                      </div>



                      <div className="accordion-item collection-filter" >
                        <h2 className="accordion-header" id="flush-headingThird">
                          <button className="market-place accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThird" aria-expanded="false" aria-controls="flush-collapseThird">
                            Collections
                          </button>
                        </h2>
                        <div id="flush-collapseThird" className="accordion-collapse collapse collection" aria-labelledby="flush-headingThird" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">

                            <div className="input-group ">
                              <span className="search-icon" id><i className="fa fa-search" /></span>
                              <input type="text" onChange={e => this.searchCollection(e)} value={this.state.searchCollection} className="form-control" placeholder="Filter" aria-label="Username" aria-describedby="basic-addon1" />
                            </div>
                            <div className="collections-list">
                              <div className=" ddtCpj CollectionFilter--results">
                                <div className="Scrollbox--content">
                                  {this.state.collections.map(item => {
                                    return (
                                      item.nft_count > 0 ?
                                        <div className="CollectionFilter--item">
                                          <div className=" hezVSt Image--isImageLoaded Image--isImageLoaderVisible CollectionFilter--item-image" style={{ height: '32px', width: '32px' }}><img className="Image--image" src={`${config.imageUrl1}${item.banner}`} style={{ objectFit: 'cover' }} /></div>
                                          <label className="CollectionFilter--item-name" style={{ padding: '5px', width: '110%', cursor: 'pointer', backgroundColor: (this.state.collectionIds.includes(item.collection_id)) ? '#ddd' : '' }} onClick={e => this.CollectionHandler(e, item)}>
                                            {item.collection_name}
                                          </label>
                                          <div className="VerificationIconreact__DivContainer-sc-gswf1z-0 fKAnqp">
                                            <div className="VerificationIcon--icon">
                                              <svg className="VerifiedIconreact__StyledSvg-sc-50keu7-0 ljSZXh" fill="none" viewBox="0 0 30 30">
                                                <path className="VerifiedIcon--background" d="M13.474 2.80108C14.2729 1.85822 15.7271 1.85822 16.526 2.80108L17.4886 3.9373C17.9785 4.51548 18.753 4.76715 19.4892 4.58733L20.9358 4.23394C22.1363 3.94069 23.3128 4.79547 23.4049 6.0278L23.5158 7.51286C23.5723 8.26854 24.051 8.92742 24.7522 9.21463L26.1303 9.77906C27.2739 10.2474 27.7233 11.6305 27.0734 12.6816L26.2903 13.9482C25.8918 14.5928 25.8918 15.4072 26.2903 16.0518L27.0734 17.3184C27.7233 18.3695 27.2739 19.7526 26.1303 20.2209L24.7522 20.7854C24.051 21.0726 23.5723 21.7315 23.5158 22.4871L23.4049 23.9722C23.3128 25.2045 22.1363 26.0593 20.9358 25.7661L19.4892 25.4127C18.753 25.2328 17.9785 25.4845 17.4886 26.0627L16.526 27.1989C15.7271 28.1418 14.2729 28.1418 13.474 27.1989L12.5114 26.0627C12.0215 25.4845 11.247 25.2328 10.5108 25.4127L9.06418 25.7661C7.86371 26.0593 6.6872 25.2045 6.59513 23.9722L6.48419 22.4871C6.42773 21.7315 5.94903 21.0726 5.24777 20.7854L3.86969 20.2209C2.72612 19.7526 2.27673 18.3695 2.9266 17.3184L3.70973 16.0518C4.10824 15.4072 4.10824 14.5928 3.70973 13.9482L2.9266 12.6816C2.27673 11.6305 2.72612 10.2474 3.86969 9.77906L5.24777 9.21463C5.94903 8.92742 6.42773 8.26854 6.48419 7.51286L6.59513 6.0278C6.6872 4.79547 7.86371 3.94069 9.06418 4.23394L10.5108 4.58733C11.247 4.76715 12.0215 4.51548 12.5114 3.9373L13.474 2.80108Z" />
                                                <path d="M13.5 17.625L10.875 15L10 15.875L13.5 19.375L21 11.875L20.125 11L13.5 17.625Z" fill="white" stroke="white" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div> : '')
                                  })}
                                  <div className="Blockreact__Block-sc-1xf18x6-0 Flexreact__Flex-sc-1twd32i-0 FlexColumnreact__FlexColumn-sc-1wwz3hp-0 VerticalAlignedreact__VerticalAligned-sc-b4hiel-0 CenterAlignedreact__CenterAligned-sc-cjf6mn-0 ctiaqU jYqxGr ksFzlZ iXcsEj cgnEmv">
                                    <div height="1px" width="1px" className="Blockreact__Block-sc-1xf18x6-0 cqowQV" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="accordion-item " >
                        <h2 className="accordion-header" id="flush-headingFour">
                          <button className="market-place accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                            Games Categories
                          </button>
                        </h2>
                        <div id="flush-collapseFour" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">

                            <div className=" gUuGNP CategoryFilter--panel">
                              <div className="Scrollbox--content">
                                {this.state.categories.map(item => {
                                  return (
                                    item.nft_count > 0 ?
                                      <div className="CategoryFilter--item">

                                        <label className="CategoryFilter--name" style={{ padding: '5px', width: '100%', cursor: 'pointer', background: (this.state.itemCategoryIds.includes(item.id)) ? '#ddd' : '' }} onClick={e => this.CategoryHandler(e, item)}>{item.name}</label>
                                      </div> : ''
                                  )
                                })}
                                {/* {this.state.gamesResponse.map(item => {
                                  return (
                                    <div className="CategoryFilter--item">
                                      <label className="CategoryFilter--name" style={{ padding: '5px', width: '100%', cursor: 'pointer', background: (this.state.GamesitemCategoryIds.includes(item.id)) ? '#ddd' : '' }} onClick={e => this.GamesCategoryHandler(e, item)}>{item.name}</label>
                                    </div>
                                  )
                                })} */}

                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item " >
                        <h2 className="accordion-header" id="flush-headingFour">
                          <button className="market-place accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                            Games
                          </button>
                        </h2>
                        <div id="flush-collapseFive" className="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body Panel--isContentPadded FeaturedFilter--items">

                            <div className=" gUuGNP CategoryFilter--panel">
                              <div className="Scrollbox--content">
                                {this.state.gamesResponse.map(item => {
                                  return (
                                    <div className="CategoryFilter--item">
                                      <label className="CategoryFilter--name" style={{ padding: '5px', width: '100%', cursor: 'pointer', background: (this.state.GamesitemCategoryIds.includes(item.id)) ? '#ddd' : '' }} onClick={e => this.GamesCategoryHandler(e, item)}>{item.name}</label>
                                    </div>
                                  )
                                })}

                              </div>

                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </aside>
                  <div className="col-md-9">
                
                    <div className="row">
                      
                      {/* nft item begin */}
                      {this.state.marketPlaces.length === 0 ?
                        <p className="nonft">No NFT found!</p> :
                        this.state.marketPlaces.slice(0, this.state.limit).map(item => {
                          return (

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
                                    <a href={`${config.baseUrl}collections/${item.collection_id}`} className='title-tip title-tip-up' title='Creator : Creator Name'>
                                      <img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                      {item.is_verified == '1' ?
                                        <i className="fa fa-check"></i>
                                        : ""}
                                    </a>
                                  }
                                </div>
                                <div className="nft__item_wrap">
                                <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}nftDetails/${item.item_id}`} >
                                                      {item.file_type === 'audio' ?
                                                         <img effect="blur" src="https://ipfs.io/ipfs/QmcwrJKCnvNuxKP22TpYptN3hM76jmwL6kt4BbieBgCCba" alt="omg" /> : ''
                                                      }

                                                      {item.file_type === 'image' ?
                                                         <img effect="blur"  className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} alt="omg" /> :
                                                         item.file_type === 'video' ?
                                                            <Player  className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} /> :
                                                            <ReactAudioPlayer  className="lazy nft__item_preview"
                                                               src={`${config.imageUrl}${item.image}`}

                                                               controls
                                                            />
                                                      }

                                                   </Link>
                                  {/* <a href={item.file_type === 'video' ? '#' : `${config.baseUrl}nftDetails/${item.item_id}`}>
                                    {item.file_type === 'image' ?
                                      <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" /> :
                                      item.file_type === 'video' ?
                                        <Player className="lazy nft__item_preview" src={`${config.imageUrl}${item.image}`} /> :
                                        <img effect="blur" src={`${config.imageUrl}${item.image}`} className="lazy nft__item_preview" alt="omg" />
                                    }
                                  </a> */}

                                </div>
                                <div className="nft__item_info" style={{ backgroundSize: 'cover' }}>
                                  <a href={`${config.baseUrl}nftDetails/${item.item_id}`}>
                                    <h4>
                                      {item.name.length > MAX_LENGTH ?
                                        (
                                          `${item.name.substring(0, MAX_LENGTH)}...`
                                        ) :
                                        item.name
                                      }
                                      <small className="pull-right">Price</small></h4>
                                  </a>
                                  <div className="nft__item_price" style={{ backgroundSize: 'cover' }}>
                                    <Link style={{ color: '#727272' }} to={`${config.baseUrl}collections/${item.collection_id}`}>
                                      {!item.collection_name ? 'NA' : item.collection_name}
                                    </Link>
                                    <div className="pull-right" style={{ backgroundSize: 'cover' }}>{item.usd_price}ETH</div>
                                  </div>
                                  <div className="nft__item_action">
                                    <a href={`${config.baseUrl}nftDetails/${item.item_id}`}>{!item.sell_type_text ? 'NA' : item.sell_type_text}</a>
                                  </div>
                                  <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                    <i className="fa fa-heart" onClick={e => this.likeCount(item)}></i><span >{item.like_count}</span>
                                  </div>
                                </div>
                              </div>
                            </div>)
                        })
                      }


                      {this.state.marketPlaces.length > 15 ?
                        <div className="col-md-12 text-center">
                          <a className="btn-main wow fadeInUp lead" style={{ cursor: "pointer" }} onClick={e => this.loadMore(e)}>Load more</a>
                        </div> : ''
                      }

                    </div>
              
                  </div>
                </div>
              </div>
            </section>
          </div>
          <Footer />
        </div>
      </>
    )
  }
}