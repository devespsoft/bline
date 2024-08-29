import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer, toast } from 'react-toastify';
import toast, { Toaster } from 'react-hot-toast';

export default class contactus extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name : '',
        email: '',
        message : ''
    }
    this.loginData = (!Cookies.get('loginSuccessBline')) ? [] : JSON.parse(Cookies.get('loginSuccessBline'));
    this.token = (!Cookies.get('token')) ? [] : JSON.parse(Cookies.get('token'));
    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.handleChange = this.handleChange.bind(this)  
}

  handleChange = (e)=>{
    this.setState({
      [e.target.name] : e.target.value
   })  }

    
handleSubmit = async  (e)=> {
  e.preventDefault()
  
  const token = this.token
   await axios({
       method: 'post',
       url: `${config.apiUrl}insertContact`,
       headers: { authorization: token},
       data: {"name":this.state.name,"email":this.state.email,"message":this.state.message} })
       .then(result => {
          if (result.data.success === true) {
              toast.success(result.data.msg, {
                  // position: toast.POSITION.TOP_CENTER , 
                      })
                  setTimeout(() => {
                    window.location.href = `${config.baseUrl}`
                  }, 2000);
             this.setState({
                name:'',
                email:'',
                message:'',
             
             })
          }
          else if (result.data.success === false) {
            toast.error(result.data.msg, {

            });
          }
       }).catch(err => {
       });
  }




    render() {
        return (    
 
            <>
     <Header/>
     <Toaster
                            position="top-center"
                            reverseOrder={false}
                          />
     <div className="no-bottom no-top" id="content">
        <div id="top" />
        <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/bg-3.jpg")`, backgroundSize: 'cover' }}>
          <div className="center-y relative text-center" style={{backgroundSize: 'cover'}}>
            <div className="container" style={{backgroundSize: 'cover'}}>
              <div className="row" style={{backgroundSize: 'cover'}}>
                <div className="col-md-12 text-center" style={{backgroundSize: 'cover'}}>
                  <h1>Contact Us</h1>
                </div>
                <div className="clearfix" style={{backgroundSize: 'cover'}} />
              </div>
            </div>
            <div className="row" style={{backgroundSize: 'cover'}}>
              <div className="col-xl-2 col-lg-2 col-md-2 col-12" style={{backgroundSize: 'cover'}} />
              <div className="col-xl-8 col-lg-8 col-md-8 col-12" style={{backgroundSize: 'cover'}}>
                <div className="contact_form_2" style={{backgroundSize: 'cover'}}>
                  <div className="container" style={{backgroundSize: 'cover'}}>
                    <div className="row" style={{backgroundSize: 'cover'}}>
                      <div className="col-lg-8 mb-sm-30" style={{backgroundSize: 'cover'}}>
                        <h3>Do you have any question?</h3>
                        <form  id="contact_form" className="form-border" onSubmit={this.handleSubmit} >
                          <div className="field-set" style={{backgroundSize: 'cover'}}>
                            <input type="text" name="name" onChange={this.handleChange} value={this.state.name} id="name" className="form-control" placeholder="Your Name" />
                          </div>
                          <div className="field-set" style={{backgroundSize: 'cover'}}>
                            <input type="text" name="email" onChange={this.handleChange} value={this.state.email} id="email" className="form-control" placeholder="Your Email" />
                          </div>
                          <div className="field-set" style={{backgroundSize: 'cover'}}>
                            <textarea name="message" onChange={this.handleChange} value={this.state.message} id="message" className="form-control" placeholder="Your Message" />
                          </div>
                          <div className="spacer-half" style={{backgroundSize: 'cover'}} />
                     
                          <div   id="submit" style={{backgroundSize: 'cover'}}>
                            <input type="submit" onClick={this.handleSubmit}   id="send_message"  className="btn btn-main" disabled= {!this.state.name || !this.state.email || !this.state.message} />
                          </div>
                          <div id="mail_success" className="success" style={{backgroundSize: 'cover'}}>Your message has been sent successfully.</div>
                          <div id="mail_fail" className="error" style={{backgroundSize: 'cover'}}>Sorry, error occured this time sending your message.</div>
                        </form>
                      </div>
                      <div className="col-lg-4" style={{backgroundSize: 'cover'}}>
                        <br /><br />
                        <div className="padding40 bg-color text-light box-rounded" style={{backgroundSize: 'cover', background: '#2327498f'}}>
                          <h3>Connect with us</h3>
                          <address className="s1">
                            <span><i className="fa fa-twitter fa-lg" /><a href="https://www.twitter.com/Bline_io">Follow us on Twitter</a></span>
                            <span><i className="fa fa-instagram fa-lg" /><a href="https://www.instagram.com/Bline_io">Follow us on Instragram</a></span>
                            <span><i className="fa fa-telegram fa-lg" /><a href="https://t.me/Bline_io">Join our Telegram group</a></span>
                            <span><i className="fa fa-envelope-o fa-lg" /><a href="mailto:hello@Bline.io">Email us: hello@Bline.io</a></span>
                          </address>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-2 col-md-2 col-12" style={{backgroundSize: 'cover'}} />
            </div>
          </div>
        </section>
      </div>
    <Footer/>
</>
        )
    }
}
