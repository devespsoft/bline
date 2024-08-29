// import React, { Component } from 'react';
// import Header from '../directives/header'
// import Leftsidebar from '../directives/leftsidebar'
// import Footer from '../directives/footer'
// export default class addproduct extends Component {

//     constructor(props) {
//         super(props)
//                        }


//     componentDidMount() {
//                         }


//     render() {
//         return (

//             <>
               
         
//                 <div className="wrapper theme-6-active pimary-color-green">
//                    <Header />
                  
//                     <Leftsidebar />
//                     <div className="page-wrapper">
//                         <div className="container-fluid pt-25">
                        
//                             <div className="row heading-bg">
//                                 <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
//                                     <h5 className="txt-dark">add-products</h5>
//                                 </div>
                             
//                                 <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
//                                     <ol className="breadcrumb">
//                                         <li><a href="index.html">Dashboard</a></li>
//                                         <li><a href="#"><span>e-commerce</span></a></li>
//                                         <li className="active"><span>add-products</span></li>
//                                     </ol>
//                                 </div>
                            
//                             </div>
                          
//                             <div className="row">
//                                 <div className="col-sm-12">
//                                     <div className="panel panel-default card-view">
//                                         <div className="panel-wrapper collapse in">
//                                             <div className="panel-body">
//                                                 <div className="form-wrap">
//                                                     <form action="#">
//                                                         <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>about product</h6>
//                                                         <hr className="light-grey-hr" />
//                                                         <div className="row">
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Product Name</label>
//                                                                     <input type="text" id="firstName" className="form-control" placeholder="Rounded Chair" />
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Sub text</label>
//                                                                     <input type="text" id="lastName" className="form-control" placeholder="globe type chair for rest" />
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                         </div>
//                                                         {/* <!-- Row --> */}
//                                                         <div className="row">
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Category</label>
//                                                                     <select className="form-control" data-placeholder="Choose a Category" tabindex="1">
//                                                                         <option value="Category 1">Category 1</option>
//                                                                         <option value="Category 2">Category 2</option>
//                                                                         <option value="Category 3">Category 5</option>
//                                                                         <option value="Category 4">Category 4</option>
//                                                                     </select>
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Status</label>
//                                                                     <div className="radio-list">
//                                                                         <div className="radio-inline pl-0">
//                                                                             <div className="radio radio-info">
//                                                                                 <input type="radio" name="radio" id="radio1" value="option1" />
//                                                                                 <label for="radio1">Published</label>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="radio-inline">
//                                                                             <div className="radio radio-info">
//                                                                                 <input type="radio" name="radio" id="radio2" value="option2" />
//                                                                                 <label for="radio2">Draft</label>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                         </div>
//                                                         {/* <!--/row--> */}
//                                                         <div className="row">
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Price</label>
//                                                                     <div className="input-group">
//                                                                         <div className="input-group-addon"><i className="ti-money"></i></div>
//                                                                         <input type="text" className="form-control" id="exampleInputuname" placeholder="153" />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Discount</label>
//                                                                     <div className="input-group">
//                                                                         <div className="input-group-addon"><i className="ti-cut"></i></div>
//                                                                         <input type="text" className="form-control" id="exampleInputuname_1" placeholder="36%" />
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                         </div>
//                                                         <div className="seprator-block"></div>
//                                                         <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-comment-text mr-10"></i>Product Description</h6>
//                                                         <hr className="light-grey-hr" />
//                                                         <div className="row">
//                                                             <div className="col-md-12">
//                                                                 <div className="form-group">
//                                                                     <textarea className="form-control" rows="4">Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. but the majority have suffered alteration in some form, by injected humour</textarea>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         {/* <!--/row--> */}
//                                                         <div className="row">
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Meta Title</label>
//                                                                     <input type="text" className="form-control" />
//                                                                 </div>
//                                                             </div>
//                                                             {/* <!--/span--> */}
//                                                             <div className="col-md-6">
//                                                                 <div className="form-group">
//                                                                     <label className="control-label mb-10">Meta Keyword</label>
//                                                                     <input type="text" className="form-control" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="seprator-block"></div>
//                                                         <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-collection-image mr-10"></i>upload image</h6>
//                                                         <hr className="light-grey-hr" />
//                                                         <div className="row">
//                                                             <div className="col-lg-12">
//                                                                 <div className="img-upload-wrap">
//                                                                     <img className="img-responsive" src="img/chair.jpg" alt="upload_img" />
//                                                                 </div>
//                                                                 <div className="fileupload btn btn-info btn-anim"><i className="fa fa-upload"></i><span className="btn-text">Upload new image</span>
//                                                                     <input type="file" className="upload" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="seprator-block"></div>
//                                                         <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-calendar-note mr-10"></i>general info</h6>
//                                                         <hr className="light-grey-hr" />

//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Brand" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Stellar" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Delivery Condition" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Knock Down" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Seat Lock Included" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Yes" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Type" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Office Chair" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Style" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Contemporary & Modern" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Wheels Included" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Yes" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="row">
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Upholstery Included" />
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-sm-6">
//                                                                 <div className="form-group">
//                                                                     <input type="text" className="form-control" placeholder="Yes" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="form-actions">
//                                                             <button className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button>
//                                                             <button type="button" className="btn btn-warning pull-left">Cancel</button>
//                                                             <div className="clearfix"></div>
//                                                         </div>
//                                                     </form>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* <!-- /Row --> */}

//                         </div>

//                         {/* <!-- Footer --> */}
//                         <Footer/>
//                         {/* <!-- /Footer --> */}

//                     </div>
//                     {/* <!-- /Main Content --> */}

//                 </div>
//             </>


//         )

//     }
// }