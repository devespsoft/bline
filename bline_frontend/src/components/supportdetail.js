import React, { Component } from 'react';
import axios from 'axios';
import Header from '../directives/header'
import Footer from '../directives/footer'
import config from '../config/config'

export default class supportdetail extends Component {

  constructor(props) {
    super(props)
    const { match: { params } } = this.props;
    this.category_id = params.category_id
    this.state = {
      supportdetail: []
    }
  }

  componentDidMount() {
    this.supportactivity()
  }

  async supportactivity(category_id) {
    console.log("category_id", category_id);
    axios.post(`${config.apiUrl}supportListByCategory`, { 'category_id': this.category_id })
      .then(response => {
        if (response.data.success === true) {
          this.setState({
            supportdetail: response.data.data,
          })
        }
        else if (response.data.success === false) {
        }
      }).catch(err => {
      });
  }

  render() {
    return (

      <>
        <Header />
        <div className="no-bottom no-top" id="content">
          <div id="top" />

          <section id="subheader" className="text-light" style={{ backgroundImage: `url("images/background/bg-3.jpg")`, backgroundSize: 'cover' }}>
            <div className="center-y relative text-center">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Support</h1>

                  </div>
                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </section>

          <section aria-label="section ">
            <div className="container">
              <div className="row mb-5 text-center">
                <div className="col-md-1" style={{ backgroundSize: 'cover' }} />
                <div className="col-md-10" style={{ backgroundSize: 'cover' }}>
                  <h3>{this.state.supportdetail[0]?.support_category}</h3>
                  <div className="accordion accordion-flush" id="accordionFlushExample" style={{ backgroundSize: 'cover' }}>

                    {this.state.supportdetail.map(item => (
                      <div className="accordion-item" style={{ backgroundSize: 'cover' }}>
                        <h2 className="accordion-header" id={`flush-headingOne${item.support_id}`}>
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapseOne${item.support_id}`} aria-expanded="false" aria-controls={`flush-collapseOne${item.support_id}`}>
                            {item.question}
                          </button>
                        </h2>
                        <div id={`flush-collapseOne${item.support_id}`} className="accordion-collapse collapse" aria-labelledby={`flush-headingOne${item.support_id}`} data-bs-parent="#accordionFlushExample" style={{ backgroundSize: 'cover' }}>
                          <div className="accordion-body" style={{ backgroundSize: 'cover', textAlign: 'justify' }}>{item.answer}</div>

                        </div>
                      </div>
                    ))}

                  </div>
                </div>
                <div className="col-md-1" style={{ backgroundSize: 'cover' }} />
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
