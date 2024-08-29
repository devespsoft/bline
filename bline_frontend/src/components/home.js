import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import Carousel from "react-multi-carousel";
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import "react-multi-carousel/lib/styles.css";
import Countdown, { zeroPad } from 'react-countdown';
import { Player } from 'video-react';
import Web3 from 'web3';

export default class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tredingNfts: [],
            recentNfts: [],
            collections: [],
            ETHlivePrice: '',
            landingPage: [],
            
            responsive: {
                superLargeDesktop: {
                    // the naming can be any, depends on you.
                    breakpoint: { max: 4000, min: 3000 },
                    items: 3
                },
                desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 3
                },
                tablet: {
                    breakpoint: { max: 1024, min: 464 },
                    items: 2
                },
                mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1
                }
            }
        };

        this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'))
        this.connectMetasmask = this.connectMetasmask.bind(this)
    }

    async trandingnftsList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserItem`,
            data: {
                "user_id": "0",
                "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
                "user_collection_id": "0",
                "is_featured": "1",
                "recent": "0",
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                // filter(item => item.collection_id != null && item.is_featured == 1)
                this.setState({
                    tredingNfts: res.data.response
                })
            }
        }).catch((error) => {

        })
    }

    async recentnftList() {
        await axios({
            method: 'post',
            url: `${config.apiUrl}getUserItem`,
            data: {
                "user_id": "0",
                "login_user_id": this.loginData && this.loginData.id ? this.loginData.id : '0',
                "user_collection_id": "0",
                "is_featured": "0",
                "recent": "1",
                "limit": "0"
            }
        }).then((res) => {
            if (res.data.success === true) {
                this.setState({
                    recentNfts: res.data.response.filter(item => item.collection_id != null)
                })
            }

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
                    collections: res.data.response.filter(item => item.is_featured == 1)
                })
            }
            console.log('.............',this.state.collections);

        }).catch((error) => {

        })
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
                    this.trandingnftsList()
                    this.recentnftList()
                }

            }).catch((error) => {

            })
        } else {
            this.connectMetasmask()
        }

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


    componentDidMount() {
        this.trandingnftsList();
        this.recentnftList()
        this.collectionList()
        this.getEthlivePrice()
        this.getBanner()
    }

    async connectMetasmask() {
        if (window.ethereum) {
            var web3 = new Web3(window.ethereum);
            var currentNetwork = web3.currentProvider.chainId;
            if (currentNetwork != '0x4') {
                toast.error(`Please select ETH network!!`, {

                });
            } else {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.loginAPI(accounts[0])
            }
        }
        else {
            // toast.error(`Please use dApp browser to connect wallet!`, {

            // });
            window.open('https://metamask.io/download/', '_blank');
        }
    }

    async getBanner() {
        await axios({
            method: 'get',
            url: `${config.apiUrl}/getBanner`
        })
            .then(response => {
                if (response.data.success === true) {
                    // alert('333')
                    this.setState({
                        landingPage: response.data.response[0]
                    })

                }
            })
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

    getEthlivePrice = async () => {
        await axios({
            method: 'get',
            url: `https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`,
        }).then(response => {
            this.setState({ ETHlivePrice: parseFloat(response.data.price).toFixed(2) })
        })

    }

    render() {



        return (

            <>
                <div id="wrapper">
                    <Header />
                    <ToastContainer />
                    <div className="no-bottom no-top" id="content">
                        <div id="top"></div>

                        <section id="section-hero" aria-label="section" className="text-light overflow-hidden" style={{ backgroundImage: this.state.landingPage.image ? `url(${config.imageUrl1 + this.state.landingPage.image})`: `url(images/background/4.jpg)`, backgroundSize: 'cover' }}>

                            <div id="particles-js"></div>
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-lg-6">
                                        <div className="text_top">
                                            {/* <div className="spacer-double"></div> */}
                                            {/* <h1>Create and sell your own unique NFTs.</h1>
                                            <p className="lead">Easiest place to buy and sell NFT.<br />Connect and get started today.</p> */}
                                            {/* <p dangerouslySetInnerHTML={{_html:this.state.landingPage?.content}}>

                                            </p> */}
                                              <div dangerouslySetInnerHTML={{__html: this.state.landingPage.content}}></div>
                                            <div className="spacer-20"></div>
                                            <Link to={`${config.baseUrl}marketplace`} className="btn-main">Explore</Link>&nbsp;&nbsp;
                                            {this.loginData.length === 0 ?
                                                <Link onClick={this.connectMetasmask} href="javascript:void(0)" className="btn-main btn-white">Create</Link> :
                                                <Link to={`${config.baseUrl}createnft`} className="btn-main btn-white">Create</Link>
                                            }
                                            <div className="spacer-double"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <iframe className="CARD_NFT_ANIMATION" src="https://embed.lottiefiles.com/animation/81487"></iframe>
                                    </div>
                                </div>
                            </div>
                        </section>


                        <section id="section-nfts" className="trending-nft trends_nft">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2>Trending NFTs</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                </div>
                                {console.log(this.state.tredingNfts)}
                                <div className="row wow fadeIn">
                                <Carousel responsive={this.state.responsive}
                                        swipeable={true}
                                        draggable={true}
                                        showDots={true}
                                        ssr={true} // means to render carousel on server-side.
                                        infinite={true}
                                        autoPlay={this.props.deviceType !== "mobile" ? true : false}
                                        autoPlaySpeed={2000}
                                        keyBoardControl={true}
                                        customTransition="all .5"
                                        transitionDuration={500}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        deviceType={this.props.deviceType}

                                    >
                                    {this.state.tredingNfts.map((item) => {
                                        return (<div className='row'>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="nft__item" >
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
                                                        "" :
                                                        <a href={`${config.baseUrl}collections/${item.collection_id}`} className='title-tip title-tip-up' title="Creator : Creator Name">
                                                            <img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                                            {item.is_verified == '1' ?
                                                                <i className="fa fa-check"></i>
                                                                : ""}
                                                        </a>
                                                    }
                                                </div>
                                                <div className="nft__item_wrap shimmerBG">
                                                    <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}nftDetails/${item.item_id}`}>
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
                                                        <h4>{item.name.toString().substring(0, 15)}<small className="pull-right">Price</small></h4>
                                                    </Link>
                                                    <div className="nft__item_price" style={{ backgroundSize: 'cover' }}>
                                                        <Link style={{ color: '#727272' }} to={`${config.baseUrl}collections/${item.collection_id}`}>
                                                            {!item.collection_name ? 'NA' : item.collection_name}
                                                        </Link>
                                                        <div className="pull-right" style={{ backgroundSize: 'cover' }}>ETH{parseFloat(item.price / this.state.ETHlivePrice).toFixed(5)}</div>
                                                    </div>
                                                    <div className="nft__item_action">
                                                        <Link to={`${config.baseUrl}nftDetails/${item.item_id}`}>{item.sell_type_text}</Link>
                                                    </div>
                                                    <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                                        <i className="fa fa-heart" onClick={e => this.likeCount(item)}></i><span >{item.like_count}</span>
                                                    </div>
                                                </div>




                                            </div>

                                        </div>
                                        </div>)
                                    })}
</Carousel>
                                </div>
                            </div>
                        </section>





                        <section id="section-collections" className="trending-collection recent-nft" data-bgcolor="#F7F4FD">
                            <div className="container">
                                <div className="row tranding-coll">
                                    <div className="col-lg-12">

                                        <div className="row mt-3 mb-5" style={{ backgroundSize: 'cover' }}
                                        ><div className="col-xl-9 col-lg-9 col-md-9 col-sm-12" style={{ backgroundSize: 'cover' }}>
                                                <div className="text-left">
                                                    <h2>Trending Collection</h2>
                                                    <div className="small-border bg-color-2"></div>

                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12" style={{ backgroundSize: 'cover' }}><div id="buy_category" className="dropdown2" style={{ backgroundSize: 'cover' }}>
                                                {/* <select className="form-control">
                                            <option value="All">Today</option>
                                            <option value="Lowtohigh">Morning</option>
                                            <option value="Hightolow">Dinner</option>
                                            <option value="Hightolow">Evening</option>
                                            </select> */}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Carousel responsive={this.state.responsive}
                                      swipeable={true}
                                      draggable={true}
                                      showDots={true}
                                      ssr={true} // means to render carousel on server-side.
                                      infinite={true}
                                      autoPlay={this.props.deviceType !== "mobile" ? true : false}
                                      autoPlaySpeed={2000}
                                      keyBoardControl={true}
                                      customTransition="all .5"
                                      transitionDuration={500}
                                      containerClass="carousel-container"
                                      removeArrowOnDeviceType={["tablet", "mobile"]}
                                      deviceType={this.props.deviceType}

                                    >

                                        {this.state.collections.map((item) => {
                                            return (
                                                <div className="nft_coll" id="treading_collections">

                                                    <div className="nft_coll_pp" >
                                                        <a href={`${config.baseUrl}collections/${item.collection_id}`}><img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" /></a>
                                                        {/* {item.is_verified == '1' ?
                                                            <img src="images/content/reward-1.svg" className="raward_1" alt="Collections" />
                                                            : ""} */}
                                                    </div>
                                                    <div className='treading_profile' id='creator_treading'>
                                                        <div className="author_list_pp ">
                                                            {item.banner === null || !item.banner ?
                                                                "" :
                                                                <a href={`${config.baseUrl}collections/${item.collection_id}`} style={{ marginLeft: '-122px' }}>
                                                                    <img className="lazy" src={`${config.imageUrl1}` + item.banner} alt="" /><i className="fa fa-check" aria-hidden="true" style={{ marginRight: '60px' }}></i>
                                                                    {item.is_verified == '1' ?
                                                                        <img src="images/content/reward-1.svg" className="raward_1 d-none" alt="Collections" />
                                                                        : ""}
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="nft_wrap">
                                                        <div className="popular__head">
                                                            {/* <div className="popular__rating" style={{
                                                                backgroundColor:
                                                                    index === 0 ? '#3772FF' :
                                                                        index === 1 ? '#23262F ' :
                                                                            index === 2 ? '#9757D7 ' :
                                                                                index === 3 ? '#45B26B ' :
                                                                                    index === 4 ? '#ddd414 ' :
                                                                                        index === 5 ? '#23262F ' :
                                                                                            index === 6 ? '#9757D7 ' :
                                                                                                index === 7 ? '#45B26B ' :

                                                                                                    ''
                                                            }}>
                                                                <div className="popular__icon">
                                                                    {index === 0 ?
                                                                        <img src="images/content/cup.svg" alt="Rating" />
                                                                        : index === 1 ?
                                                                            <img src="images/content/donut.svg" alt="Rating" />
                                                                            : index === 2 ?
                                                                                <img src="images/content/lightning.svg" alt="Rating" />
                                                                                : index === 3 ?
                                                                                    <img src="images/content/donut.svg" alt="Rating" />
                                                                                    : index === 4 ?
                                                                                        <img src="images/content/donut.svg" alt="Rating" />
                                                                                        : index === 6 ?
                                                                                            <img src="images/content/lightning.svg" alt="Rating" />
                                                                                            : index === 6 ?
                                                                                                <img src="images/content/donut.svg" alt="Rating" />
                                                                                                : index === 7 ?
                                                                                                    <img src="images/content/donut.svg" alt="Rating" />

                                                                                                    : ''
                                                                    }
                                                                </div>
                                                                <div className="popular__number">#{index + 1}
                                                                </div>
                                                            </div> */}

                                                        </div>
                                                        {/* <Link style={{ color: '#727272' }} to={`${config.baseUrl}collections/${item.collection_id}`}><img style={{ height: '219px' }} src={`${config.imageUrl1}${item.banner}`} className="lazy img-fluid" alt="" /></Link> */}
                                                    </div>
                                                    <div className="nft_coll_info">
                                                        <a style={{ color: '#727272' }} href={`${config.baseUrl}collections/${item.collection_id}`}><h4>{item.collection_name}</h4></a>
                                                        {/* <span>ERC-192</span> */}
                                                        {/* <p className="eth_point">2.041<span>Eth</span></p> */}
                                                    </div>

                                                </div>)

                                        })}
                                    </Carousel>

                                </div>
                            </div>

                        </section>

                        {/* <div className="section-bg collections">
                            <div className="collections__center center">
                                <div className="collections__wrapper container">
                                    <h3 className="collections__title h3">Hot collections</h3>
                                    <div className="collections__inner">
                                        <div className="collections__slider js-slider-collections slick-initialized slick-slider"><div className="slick-list draggable"><div className="slick-track" style={{ opacity: 1, width: '1210px', transform: 'translate3d(0px, 0px, 0px)' }}>
                                            <div className="row">
                                                <div className="col-lg-4 col-md-4 col-xl-4">
                                                <a className="collections__item slick-slide slick-current slick-active" href="profile.html" data-slick-index={0} aria-hidden="false" style={{ width: '400px' }} tabIndex={0}>
                                            <div className="collections__gallery">
                                                <div className="collections__preview"><img src="images/content/photo-1.1.jpg" alt="Collections" /></div>
                                            </div>
                                            <div className="collections__subtitle">Awesome collection</div>
                                            <div className="collections__line">
                                                <div className="collections__user">
                                                    <div className="collections__avatar"><img src="images/content/avatar-1.jpg" alt="Avatar" /></div>
                                                    <div className="collections__author">By <span>Kennith Olson</span></div>
                                                </div>
                                                <div className="status-stroke-black collections__counter"><span>28 items</span></div>
                                            </div></a>
                                                </div>
                                      
                                            <div className="col-lg-4 col-md-4 col-xl-4">
                                            <a className="collections__item slick-slide slick-active" href="profile.html" data-slick-index={1} aria-hidden="false" style={{ width: '400px' }} tabIndex={0}>
                                                <div className="collections__gallery">
                                                    <div className="collections__preview"><img src="images/content/photo-2.1.jpg" alt="Collections" /></div>
                                                </div>
                                                <div className="collections__subtitle">Awesome collection</div>
                                                <div className="collections__line">
                                                    <div className="collections__user">
                                                        <div className="collections__avatar"><img src="images/content/avatar-3.jpg" alt="Avatar" /></div>
                                                        <div className="collections__author">By <span>Willie Barton</span></div>
                                                    </div>
                                                    <div className="status-stroke-black collections__counter"><span>28 items</span></div>
                                                </div></a>
                                            </div>
                                            
                                                <div className="col-lg-4 col-md-4 col-xl-4">
                                                <a className="collections__item slick-slide slick-active" href="profile.html" data-slick-index={2} aria-hidden="false" style={{ width: '400px' }} tabIndex={0}>
                                                <div className="collections__gallery">
                                                    <div className="collections__preview"><img src="images/content/photo-3.1.jpg" alt="Collections" /></div>
                                                </div>
                                                <div className="collections__subtitle">Awesome collection</div>
                                                <div className="collections__line">
                                                    <div className="collections__user">
                                                        <div className="collections__avatar"><img src="images/content/avatar-4.jpg" alt="Avatar" /></div>
                                                        <div className="collections__author">By <span>Halle Jakubowski</span></div>
                                                    </div>
                                                    <div className="status-stroke-black collections__counter"><span>28 items</span></div>
                                                </div></a>
                                                </div>
                                                </div>
                                                </div></div></div>
                                    </div>
                                </div>
                            </div>
                        </div> */}




                        <section id="section-nfts">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2>Recent NFTs</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row wow fadeIn">

                                    {this.state.recentNfts.slice(0, 3).map((item) => {
                                        return (
                                            <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                                                <div className="nft__item" >
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
                                                    <div className="author_list_pp " >
                                                        {item.collection_profile_pic === null || !item.collection_profile_pic ?
                                                            "" :
                                                            <a href={`${config.baseUrl}collections/${item.collection_id}`} className='title-tip title-tip-up' title="Creator : Creator Name">
                                                                <img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                                                {item.is_verified == '1' ?
                                                                    <img src="images/content/reward-1.svg" className="raward_1" alt="Collections" />
                                                                    : ""}
                                                            </a>
                                                        }

                                                    </div>
                                                    <div className="nft__item_wrap">
                                                        <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}nftDetails/${item.item_id}`}>
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
                                                            <div className="pull-right" style={{ backgroundSize: 'cover' }}>ETH{parseFloat(item.price / this.state.ETHlivePrice).toFixed(5)}</div>
                                                        </div>
                                                        <div className="nft__item_action">
                                                            <Link to={`${config.baseUrl}nftDetails/${item.item_id}`}>{!item.sell_type_text ? 'NA' : item.sell_type_text}</Link>
                                                        </div>
                                                        <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                                            <i className="fa fa-heart" onClick={e => this.likeCount(item)}></i><span >{item.like_count}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        )
                                    })}

                                </div>
                                <div className="row wow fadeIn">

                                    {this.state.recentNfts.slice(3, 6).map((item) => {
                                        return (
                                            <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                                                <div className="nft__item" >
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
                                                            "" :
                                                            <a href={`${config.baseUrl}collections/${item.collection_id}`} className='title-tip title-tip-up' title="Creator : Creator Name">
                                                                <img className="lazy" src={`${config.imageUrl1}` + item.collection_profile_pic} alt="" />
                                                                {item.is_verified == '1' ?
                                                                    <img src="images/content/reward-1.svg" className="raward_1" alt="Collections" />
                                                                    : ""}
                                                            </a>
                                                        }
                                                    </div>
                                                    <div className="nft__item_wrap">
                                                        <Link to={item.file_type === 'video' ? '#/' : `${config.baseUrl}nftDetails/${item.item_id}`}>
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
                                                            <div className="pull-right" style={{ backgroundSize: 'cover' }}>ETH{parseFloat(item.price / this.state.ETHlivePrice).toFixed(5)}</div>
                                                        </div>
                                                        <div className="nft__item_action">
                                                            <Link to={`${config.baseUrl}nftDetails/${item.item_id}`}>{!item.sell_type_text ? 'NA' : item.sell_type_text}</Link>
                                                        </div>
                                                        <div className="nft__item_like" style={item.is_liked === 0 ? { color: '#ddd', cursor: 'pointer' } : { color: '#EC7498', cursor: 'pointer' }}>
                                                            <i className="fa fa-heart" onClick={e => this.likeCount(item)}></i><span >{item.like_count}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        )
                                    })}

                                </div>
                            </div>
                        </section>



                        <section id="section-steps" data-bgcolor="#F7F4FD">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="text-left">
                                            <h2>How to get started:</h2>
                                            <div className="small-border bg-color-2"></div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-sm-30">
                                        <div className="feature-box f-boxed style-3">
                                            {this.loginData.length === 0 ?
                                                <Link onClick={this.connectMetasmask}>
                                                    <i className="wow fadeInUp bg-color-2 i-boxed icon_wallet"></i>
                                                    <div className="text">
                                                        <h4 className="wow fadeInUp">Set up your wallet</h4>
                                                        <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                    </div>
                                                    <i className="wm icon_wallet"></i>
                                                </Link>
                                                :
                                                <>
                                                    <i className="wow fadeInUp bg-color-2 i-boxed icon_wallet"></i>
                                                    <div className="text">
                                                        <h4 className="wow fadeInUp">Set up your wallet</h4>
                                                        <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                    </div>
                                                    <i className="wm icon_wallet"></i>
                                                </>
                                            }

                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-sm-30">
                                        {this.loginData.length === 0 ?
                                            <Link onClick={this.connectMetasmask}>
                                                <div className="feature-box f-boxed style-3">
                                                    <i className="wow fadeInUp bg-color-2 i-boxed icon_cloud-upload_alt"></i>
                                                    <div className="text">
                                                        <h4 className="wow fadeInUp">Add your NFT's</h4>
                                                        <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                    </div>
                                                    <i className="wm icon_cloud-upload_alt"></i>
                                                </div>
                                            </Link> : <Link to={`${config.baseUrl}createnft`}>
                                                <div className="feature-box f-boxed style-3">
                                                    <i className="wow fadeInUp bg-color-2 i-boxed icon_cloud-upload_alt"></i>
                                                    <div className="text">
                                                        <h4 className="wow fadeInUp">Add your NFT's</h4>
                                                        <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                    </div>
                                                    <i className="wm icon_cloud-upload_alt"></i>
                                                </div>
                                            </Link>}
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-sm-30">
                                        <Link to={`${config.baseUrl}marketplace`}>
                                            <div className="feature-box f-boxed style-3">
                                                <i className="wow fadeInUp bg-color-2 i-boxed icon_tags_alt"></i>
                                                <div className="text">
                                                    <h4 className="wow fadeInUp">Sell your NFT's</h4>
                                                    <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                </div>
                                                <i className="wm icon_tags_alt"></i>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-sm-30">
                                        <Link to={`${config.baseUrl}marketplace`}>
                                            <div className="feature-box f-boxed style-3">
                                                <i className="wow fadeInUp bg-color-2 i-boxed icon_tags_alt"></i>
                                                <div className="text">
                                                    <h4 className="wow fadeInUp">Sell your NFT's</h4>
                                                    <p className="wow fadeInUp" data-wow-delay=".25s" style={{ color: '#000' }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                                </div>
                                                <i className="wm icon_tags_alt"></i>
                                            </div>
                                        </Link>
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





// 12-01-22
