import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class technology extends Component {



    render() {
        return (    
 
            <>
     <Header/>
     <div className="no-bottom no-top" id="content">
        <div id="top" />
        {/* section begin */}
        <section id="subheader" className="text-light" data-bgimage="url(images/background/bg-1.jpg) top">
          <div className="center-y relative text-center">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h1>Technology</h1>
                  <p>Anim pariatur cliche reprehenderit</p>
                </div>
                <div className="clearfix" />
              </div>
            </div>
          </div>
        </section>
        {/* section close */}
        {/* section begin */}
        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-7.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-8.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-9.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-13.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-11.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb30">
                <div className="bloglist item">
                  <div className="post-content">
                    <div className="post-image">
                      <img alt="" src="images/news/news-12.jpg" className="lazy" />
                    </div>
                    <div className="post-text">
                      <span className="p-tagline">Tips &amp; Tricks</span>
                      <span className="p-date">October 28, 2020</span>
                      <h4><a href="news-single.html">The next big trend in crypto<span /></a></h4>
                      <p>Dolore officia sint incididunt non excepteur ea mollit commodo ut enim reprehenderit cupidatat labore ad laborum consectetur consequat...</p>
                      <a className="btn-main" href="news-single.html">Read more</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacer-single" />
              <ul className="pagination">
                <li><a href="#">Prev</a></li>
                <li className="active"><a href="#">1</a></li>
                <li><a href="#">2</a></li>
                <li><a href="#">3</a></li>
                <li><a href="#">4</a></li>
                <li><a href="#">5</a></li>
                <li><a href="#">Next</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <Footer/>

     </>
        )
    }
}