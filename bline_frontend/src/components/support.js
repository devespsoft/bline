import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
import { Link } from 'react-router-dom';
export default class support extends Component {

  constructor(props) {
    super(props)
    this.state = {
      supportdetail: ''

    }
  }

  render() {
    return (

      <>
        <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />
          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/support.png")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Support</h1>
                    {/* <p>Anim pariatur cliche reprehenderit</p> */}
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>
          <section aria-label="section ">
            <div className="container">
              <div className="row mb-5 text-center">

                <div className="col-sm-4 mt-2">
                  <div className="blocks-item border ">
                    <Link to={`${config.baseUrl}supportdetail/1`} className="blocks-item-link">
                      <div className="box-title ">
                        <h3 className="blocks-item-title">Getting Started</h3>
                        <span className="blocks-item-description">Learn how to create an account, set up your wallet, and what you can do on Bline</span>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="col-sm-4 mt-2">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/2`} className="blocks-item-link">
                      <div className="box-title">
                        <h3 className="blocks-item-title">Buying</h3>
                        <span className="blocks-item-description">Learn how to purchase your first NFT and understand gas fees and what's gas free on Bline</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-4 mt-2">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/3`} className="blocks-item-link">
                      <div className="box-title ">
                        <h3 className="blocks-item-title">Selling</h3>
                        <span className="blocks-item-description">Learn how list your NFTs for sale and understand the different ways to list your NFTs</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-4 mt-4">
                  <div className="blocks-item border ">
                    <Link to={`${config.baseUrl}supportdetail/4`} className="blocks-item-link">
                      <div className="box-title ">
                        <h3 className="blocks-item-title">Creating</h3>
                        <span className="blocks-item-description">Learn how to create your very first NFT and how to create your NFT collections so you can begin selling and sharing</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-4 mt-4">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/5`} className="blocks-item-link">
                      <div className="box-title">
                        <h3 className="blocks-item-title">FAQ</h3>
                        <span className="blocks-item-description">Learn answers to frequently asked questions on Bline</span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-4 mt-4">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/6`} className="blocks-item-link">
                      <div className="box-title ">
                        <h3 className="blocks-item-title">User Safety</h3>
                        <span className="blocks-item-description">Learn more about anti-fraud and user safety processes on Bline </span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-6 mt-4">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/7`} className="blocks-item-link">
                      <div className="box-title">
                        <h3 className="blocks-item-title">Partners</h3>
                        <span className="blocks-item-description">Learn how you can partner with us to showcase your NFT drops </span>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-sm-6 mt-4">
                  <div className="blocks-item border">
                    <Link to={`${config.baseUrl}supportdetail/8`} className="blocks-item-link">
                      <div className="box-title ">
                        <h3 className="blocks-item-title">Developers</h3>
                        <span className="blocks-item-description">Learn how you can develop with Bline</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <br /> <br />
        <Footer />

      </>
    )
  }
}