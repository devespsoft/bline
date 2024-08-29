import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from  'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
export default class realestateslider extends Component {

    constructor(props) {
        super(props)
       this.state = {
           image_file:null,
           image_preview: '',
           image_file1:null,
           image_preview1: '',
           image_file2:null,
           image_preview2:'' ,
           image_file3:null,
           image_preview3: '',
           image_file4:null,
           image_preview4: '',
           image_file5:null,
           image_preview5: '',
           updateform: '',
           update_id:1,
           image_list:[],
           slider1 : '',
           slider2 :'',
           slider3 : '',
           logo : '',
           favicon : '',
           text1:'',
           text2:'',
           text3:''
            
       }
       this.editDataAPI = this.editDataAPI.bind(this);
       this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
       this.updateDataAPI = this.updateDataAPI.bind(this);
      
    }



    componentDidMount() {
        if(!Cookies.get('loginSuccessInfinityAdmin')){
            window.location.href = `${config.baseUrl}`
            return false;
         }
         this.getWebImageAPI();
    }

async getWebImageAPI() {
        axios.get(`${config.apiUrl}getRealEstateImage`, {}, )
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        image_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }
    
 

handleImagePreview = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview: image_as_base64,
        image_file: image_as_files,
        file_type: file_type,
    })
}


handleImagePreview1 = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview1: image_as_base64,
        image_file1: image_as_files,
        file_type: file_type,
    })
}

handleImagePreview2 = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview2: image_as_base64,
        image_file2: image_as_files,
        file_type: file_type,
    })
}

handleImagePreview3 = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview3: image_as_base64,
        image_file3: image_as_files,
        file_type: file_type,
    })
}

handleImagePreview4 = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview4: image_as_base64,
        image_file4: image_as_files,
        file_type: file_type,
    })
}


handleImagePreview5 = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else {
        file_type = 'video';
    }

    this.setState({
        image_preview5: image_as_base64,
        image_file5: image_as_files,
        file_type: file_type,
    })
}





 

editDataAPI(id){
  
    this.setState({
    
    
     update_id:id.id,
     updateform : "123"     
   }); 
 
}




async updateDataAPI(){

    let formData = new FormData();

    formData.append('id',this.state.update_id)
    formData.append('slider1',this.state.image_file)
    formData.append('slider2',this.state.image_file1)
    formData.append('slider3',this.state.image_file2)
    // formData.append('logo',this.state.image_file3)
    // formData.append('favicon',this.state.image_file4)
    // formData.append('realEstateImage',this.state.image_file5)
    formData.append('text1',this.state.text1)
    formData.append('text2',this.state.text2)
    formData.append('text3',this.state.text3)
    formData.append('email',this.loginData?.data.user_email)

    

    axios({
        method: 'post',
        url: `${config.apiUrl}updateRealEstateImage`,
        headers: { "Authorization": this.loginData?.Token },
        data: formData
     })

        .then(result=>{
    
    if(result.data.success === true ){
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
        }, setTimeout(() => {
            window.location.reload()
        }, 1500));
         
        this.getWebImageAPI();
           
     }
    }).catch(err=>{
    
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })

}




// async updateDataAPI(){

//     let formData = new FormData();

//     formData.append('id',this.state.update_id)

//     let formData1 = new FormData();

//     formData1.append('file', this.state.image_file);

//     if(this.state.image_file === null){
//        formData.append('slider1', this.state.slider1);
// }
//     else{
//         const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//       var resIPF =  await axios.post(url,
//             formData1,
//             {
//                 headers: {
//                     'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
//                     'pinata_api_key': 'e10dd09a651a1450d32e',
//                     'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
//                 }
//             }
//         );
       
//       console.log('ipfshahs',resIPF.data.IpfsHash);
//       formData.append('slider1', resIPF.data.IpfsHash);
      
//     }    
 
//     let formData2 = new FormData();

//     formData2.append('file', this.state.image_file1);

//     if(this.state.image_file1 === null){
//        formData.append('slider2', this.state.slider2);
// }
//     else{
//         const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//       var resIPF =  await axios.post(url,
//             formData2,
//             {
//                 headers: {
//                     'Content-Type': `multipart/form-data; boundary= ${formData2._boundary}`,
//                     'pinata_api_key': 'e10dd09a651a1450d32e',
//                     'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
//                 }
//             }
//         );
//       console.log('ipfshahs',resIPF.data.IpfsHash);
//       formData.append('slider2', resIPF.data.IpfsHash);     
//     }    
//        let formData3 = new FormData();

//        formData3.append('file', this.state.image_file2);
   
//        if(this.state.image_file2 === null){
//           formData.append('slider3', this.state.slider3);
//    }
//        else{
//            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//          var resIPF =  await axios.post(url,
//                formData3,
//                {
//                    headers: {
//                        'Content-Type': `multipart/form-data; boundary= ${formData3._boundary}`,
//                        'pinata_api_key': 'e10dd09a651a1450d32e',
//                        'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
//                    }
//                }
//            );
          
//          console.log('ipfshahs',resIPF.data.IpfsHash);
//          formData.append('slider3', resIPF.data.IpfsHash);
         
//        }    
//     let formData4 = new FormData();       

//     formData4.append('file', this.state.image_file3);

//     if(this.state.image_file3 === null){
//        formData.append('logo', this.state.logo);
// }
//     else{
//         const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//       var resIPF =  await axios.post(url,
//             formData4,
//             {
//                 headers: {
//                     'Content-Type': `multipart/form-data; boundary= ${formData4._boundary}`,
//                     'pinata_api_key': 'e10dd09a651a1450d32e',
//                     'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
//                 }
//             }
//         );
       
//       console.log('ipfshahs',resIPF.data.IpfsHash);
//       formData.append('logo', resIPF.data.IpfsHash);
      
//     }    
//        let formData5 = new FormData();

//        formData5.append('file', this.state.image_file4);
   
//        if(this.state.image_file4 === null){
//           formData.append('favicon', this.state.favicon);
//    }
//        else{
//            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
//          var resIPF =  await axios.post(url,
//                formData5,
//                {
//                    headers: {
//                        'Content-Type': `multipart/form-data; boundary= ${formData5._boundary}`,
//                        'pinata_api_key': 'e10dd09a651a1450d32e',
//                        'pinata_secret_api_key': '292a2ff0c5e3ddeea1f3d80444624b9302137401debc9aabdc630d7d990438fc'
//                    }
//                }
//            );
          
//          console.log('ipfshahs',resIPF.data.IpfsHash);
//          formData.append('favicon', resIPF.data.IpfsHash);
         
//        }    
    
//        const obj = Object.fromEntries(formData);
       
//       axios.post(`${config.apiUrl}updateWebImage`,obj)
//         .then(result=>{
    
//     if(result.data.success === true ){
//         toast.success(result.data.msg, {
//             position: toast.POSITION.TOP_CENTER
//         }, setTimeout(() => {
//         }, 1500));
         
//         this.getWebImageAPI();
           
//      }
//     }).catch(err=>{
    
//     toast.error(err.response.data?.msg, {
//         position: toast.POSITION.TOP_CENTER, autoClose:1500
    
//     }, setTimeout(() => {
            
//     }, 500));
 
//     })

// }


updateContent = (value) => {
    this.setState({text1:value})
}

updateContent1 = (value) => {
    this.setState({text2:value})
}

updateContent2 = (value) => {
    this.setState({text3:value})
}

    render() {

        return (

            
            <>

            <div className="preloader-it">
                <div className="la-anim-1"></div>
            </div>
            <ToastContainer/>
            {/* <!--/Preloader--> */}
            <div className="wrapper theme-6-active pimary-color-green">

                {/* <!-- Top Menu Items --> */}
                <Header />
                {/* <!-- /Top Menu Items --> */}

                {/* <!-- Left Sidebar Menu --> */}
                <Leftsidebar />
                {/* <!-- /Left Sidebar Menu --> */}

                {/* <!-- Right Sidebar Menu --> */}
                <div className="fixed-sidebar-right">
                    <ul className="right-sidebar">
                        <li>
                            <div className="tab-struct custom-tab-1">
                                <ul role="tablist" className="nav nav-tabs" id="right_sidebar_tab">
                                    <li className="active" role="presentation"><a aria-expanded="true" data-toggle="tab" role="tab" id="chat_tab_btn" href="#chat_tab">chat</a></li>
                                    <li role="presentation" className=""><a data-toggle="tab" id="messages_tab_btn" role="tab" href="#messages_tab" aria-expanded="false">messages</a></li>
                                    <li role="presentation" className=""><a data-toggle="tab" id="todo_tab_btn" role="tab" href="#todo_tab" aria-expanded="false">todo</a></li>
                                </ul>
                                <div className="tab-content" id="right_sidebar_content">
                                    <div id="chat_tab" className="tab-pane fade active in" role="tabpanel">
                                        <div className="chat-cmplt-wrap">
                                            <div className="chat-box-wrap">
                                                <div className="add-friend">
                                                    <a href="javascript:void(0)" className="inline-block txt-grey">
                                                        <i className="zmdi zmdi-more"></i>
                                                    </a>
                                                    <span className="inline-block txt-dark">users</span>
                                                    <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-plus"></i></a>
                                                    <div className="clearfix"></div>
                                                </div>
                                                <form role="search" className="chat-search pl-15 pr-15 pb-15">
                                                    <div className="input-group">
                                                        <input type="text" id="example-input1-group2" name="example-input1-group2" className="form-control" placeholder="Search" />
                                                        <span className="input-group-btn">
                                                            <button type="button" className="btn  btn-default"><i className="zmdi zmdi-search"></i></button>
                                                        </span>
                                                    </div>
                                                </form>
                                                <div id="chat_list_scroll">
                                                    <div className="nicescroll-bar">
                                                        <ul className="chat-list-wrap">
                                                            <li className="chat-list">
                                                                <div className="chat-body">
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Clay Masse</span>
                                                                                <span className="time block truncate txt-grey">No one saves us but ourselves.</span>
                                                                            </div>
                                                                            <div className="status away"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user1.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Evie Ono</span>
                                                                                <span className="time block truncate txt-grey">Unity is strength</span>
                                                                            </div>
                                                                            <div className="status offline"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user2.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Madalyn Rascon</span>
                                                                                <span className="time block truncate txt-grey">Respect yourself if you would have others respect you.</span>
                                                                            </div>
                                                                            <div className="status online"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user3.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Mitsuko Heid</span>
                                                                                <span className="time block truncate txt-grey">I’m thankful.</span>
                                                                            </div>
                                                                            <div className="status online"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Ezequiel Merideth</span>
                                                                                <span className="time block truncate txt-grey">Patience is bitter.</span>
                                                                            </div>
                                                                            <div className="status offline"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user1.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Jonnie Metoyer</span>
                                                                                <span className="time block truncate txt-grey">Genius is eternal patience.</span>
                                                                            </div>
                                                                            <div className="status online"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user2.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Angelic Lauver</span>
                                                                                <span className="time block truncate txt-grey">Every burden is a blessing.</span>
                                                                            </div>
                                                                            <div className="status away"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user3.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Priscila Shy</span>
                                                                                <span className="time block truncate txt-grey">Wise to resolve, and patient to perform.</span>
                                                                            </div>
                                                                            <div className="status online"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                    <a href="javascript:void(0)">
                                                                        <div className="chat-data">
                                                                            <img className="user-img img-circle" src="img/user4.png" alt="user" />
                                                                            <div className="user-data">
                                                                                <span className="name block capitalize-font">Linda Stack</span>
                                                                                <span className="time block truncate txt-grey">Our patience will achieve more than our force.</span>
                                                                            </div>
                                                                            <div className="status away"></div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="recent-chat-box-wrap">
                                                <div className="recent-chat-wrap">
                                                    <div className="panel-heading ma-0">
                                                        <div className="goto-back">
                                                            <a id="goto_back" href="javascript:void(0)" className="inline-block txt-grey">
                                                                <i className="zmdi zmdi-chevron-left"></i>
                                                            </a>
                                                            <span className="inline-block txt-dark">ryan</span>
                                                            <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-more"></i></a>
                                                            <div className="clearfix"></div>
                                                        </div>
                                                    </div>
                                                    <div className="panel-wrapper collapse in">
                                                        <div className="panel-body pa-0">
                                                            <div className="chat-content">
                                                                <ul className="nicescroll-bar pt-20">
                                                                    <li className="friend">
                                                                        <div className="friend-msg-wrap">
                                                                            <img className="user-img img-circle block pull-left" src="img/user.png" alt="user" />
                                                                            <div className="msg pull-left">
                                                                                <p>Hello Jason, how are you, it's been a long time since we last met?</p>
                                                                                <div className="msg-per-detail text-right">
                                                                                    <span className="msg-time txt-grey">2:30 PM</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="self mb-10">
                                                                        <div className="self-msg-wrap">
                                                                            <div className="msg block pull-right"> Oh, hi Sarah I'm have got a new job now and is going great.
                                                                        <div className="msg-per-detail text-right">
                                                                                    <span className="msg-time txt-grey">2:31 pm</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="self">
                                                                        <div className="self-msg-wrap">
                                                                            <div className="msg block pull-right">  How about you?
                                                                        <div className="msg-per-detail text-right">
                                                                                    <span className="msg-time txt-grey">2:31 pm</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </li>
                                                                    <li className="friend">
                                                                        <div className="friend-msg-wrap">
                                                                            <img className="user-img img-circle block pull-left" src="img/user.png" alt="user" />
                                                                            <div className="msg pull-left">
                                                                                <p>Not too bad.</p>
                                                                                <div className="msg-per-detail  text-right">
                                                                                    <span className="msg-time txt-grey">2:35 pm</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="clearfix"></div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="input-group">
                                                                <input type="text" id="input_msg_send" name="send-msg" className="input-msg-send form-control" placeholder="Type something" />
                                                                <div className="input-group-btn emojis">
                                                                    <div className="dropup">
                                                                        <button type="button" className="btn  btn-default  dropdown-toggle" data-toggle="dropdown" ><i className="zmdi zmdi-mood"></i></button>
                                                                        <ul className="dropdown-menu dropdown-menu-right">
                                                                            <li><a href="javascript:void(0)">Action</a></li>
                                                                            <li><a href="javascript:void(0)">Another action</a></li>
                                                                            <li className="divider"></li>
                                                                            <li><a href="javascript:void(0)">Separated link</a></li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div className="input-group-btn attachment">
                                                                    <div className="fileupload btn  btn-default"><i className="zmdi zmdi-attachment-alt"></i>
                                                                        <input type="file" className="upload" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="messages_tab" className="tab-pane fade" role="tabpanel">
                                        <div className="message-box-wrap">
                                            <div className="msg-search">
                                                <a href="javascript:void(0)" className="inline-block txt-grey">
                                                    <i className="zmdi zmdi-more"></i>
                                                </a>
                                                <span className="inline-block txt-dark">messages</span>
                                                <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-search"></i></a>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="set-height-wrap">
                                                <div className="streamline message-box nicescroll-bar">
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item unread-message">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Clay Masse</span>
                                                                <span className="inline-block font-11  pull-right message-time">12:28 AM</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Themeforest message sent via your envato market profile</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsu messm quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user1.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Evie Ono</span>
                                                                <span className="inline-block font-11  pull-right message-time">1 Feb</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Pogody theme support</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user2.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Madalyn Rascon</span>
                                                                <span className="inline-block font-11  pull-right message-time">31 Jan</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Congratulations from design nominees</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item unread-message">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user3.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Ezequiel Merideth</span>
                                                                <span className="inline-block font-11  pull-right message-time">29 Jan</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Themeforest item support message</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item unread-message">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user4.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Jonnie Metoyer</span>
                                                                <span className="inline-block font-11  pull-right message-time">27 Jan</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Help with beavis contact form</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Priscila Shy</span>
                                                                <span className="inline-block font-11  pull-right message-time">19 Jan</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject">Your uploaded theme is been selected</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0)">
                                                        <div className="sl-item">
                                                            <div className="sl-avatar avatar avatar-sm avatar-circle">
                                                                <img className="img-responsive img-circle" src="img/user1.png" alt="avatar" />
                                                            </div>
                                                            <div className="sl-content">
                                                                <span className="inline-block capitalize-font   pull-left message-per">Linda Stack</span>
                                                                <span className="inline-block font-11  pull-right message-time">13 Jan</span>
                                                                <div className="clearfix"></div>
                                                                <span className=" truncate message-subject"> A new rating has been received</span>
                                                                <p className="txt-grey truncate">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="todo_tab" className="tab-pane fade" role="tabpanel">
                                        <div className="todo-box-wrap">
                                            <div className="add-todo">
                                                <a href="javascript:void(0)" className="inline-block txt-grey">
                                                    <i className="zmdi zmdi-more"></i>
                                                </a>
                                                <span className="inline-block txt-dark">todo list</span>
                                                <a href="javascript:void(0)" className="inline-block text-right txt-grey"><i className="zmdi zmdi-plus"></i></a>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="set-height-wrap">
                                                {/* <!-- Todo-List --> */}
                                                <ul className="todo-list nicescroll-bar">
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-default">
                                                            <input type="checkbox" id="checkbox01" />
                                                            <label for="checkbox01">Record The First Episode</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-pink">
                                                            <input type="checkbox" id="checkbox02" />
                                                            <label for="checkbox02">Prepare The Conference Schedule</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-warning">
                                                            <input type="checkbox" id="checkbox03" checked />
                                                            <label for="checkbox03">Decide The Live Discussion Time</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-success">
                                                            <input type="checkbox" id="checkbox04" checked />
                                                            <label for="checkbox04">Prepare For The Next Project</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-danger">
                                                            <input type="checkbox" id="checkbox05" checked />
                                                            <label for="checkbox05">Finish Up AngularJs Tutorial</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                    <li className="todo-item">
                                                        <div className="checkbox checkbox-purple">
                                                            <input type="checkbox" id="checkbox06" checked />
                                                            <label for="checkbox06">Finish Infinity Project</label>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <hr className="light-grey-hr" />
                                                    </li>
                                                </ul>
                                                {/* <!-- /Todo-List --> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* <!-- /Right Sidebar Menu --> */}

                {/* <!-- Right Setting Menu --> */}
                <div className="setting-panel">
                    <ul className="right-sidebar nicescroll-bar pa-0">
                        <li className="layout-switcher-wrap">
                            <ul>
                                <li>
                                    <span className="layout-title">Scrollable header</span>
                                    <span className="layout-switcher">
                                        <input type="checkbox" id="switch_3" className="js-switch" data-color="#2ecd99" data-secondary-color="#dedede" data-size="small" />
                                    </span>
                                    <h6 className="mt-30 mb-15">Theme colors</h6>
                                    <ul className="theme-option-wrap">
                                        <li id="theme-1" className="active-theme"><i className="zmdi zmdi-check"></i></li>
                                        <li id="theme-2"><i className="zmdi zmdi-check"></i></li>
                                        <li id="theme-3"><i className="zmdi zmdi-check"></i></li>
                                        <li id="theme-4"><i className="zmdi zmdi-check"></i></li>
                                        <li id="theme-5"><i className="zmdi zmdi-check"></i></li>
                                        <li id="theme-6"><i className="zmdi zmdi-check"></i></li>
                                    </ul>
                                    <h6 className="mt-30 mb-15">Primary colors</h6>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-green" checked value="pimary-color-green" />
                                        <label for="pimary-color-green"> Green </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-red" value="pimary-color-red" />
                                        <label for="pimary-color-red"> Red </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-blue" value="pimary-color-blue" />
                                        <label for="pimary-color-blue"> Blue </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-yellow" value="pimary-color-yellow" />
                                        <label for="pimary-color-yellow"> Yellow </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-pink" value="pimary-color-pink" />
                                        <label for="pimary-color-pink"> Pink </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-orange" value="pimary-color-orange" />
                                        <label for="pimary-color-orange"> Orange </label>
                                    </div>
                                    <div className="radio mb-5">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-gold" value="pimary-color-gold" />
                                        <label for="pimary-color-gold"> Gold </label>
                                    </div>
                                    <div className="radio mb-35">
                                        <input type="radio" name="radio-primary-color" id="pimary-color-silver" value="pimary-color-silver" />
                                        <label for="pimary-color-silver"> Silver </label>
                                    </div>
                                    <button id="reset_setting" className="btn  btn-success btn-xs btn-outline btn-rounded mb-10">reset</button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                {/* <button id="setting_panel_btn" className="btn btn-success btn-circle setting-panel-btn shadow-2dp"><i className="zmdi zmdi-settings"></i></button> */}
                {/* <!-- /Right Setting Menu --> */}

                {/* <!-- Right Sidebar Backdrop --> */}
                <div className="right-sidebar-backdrop"></div>
                {/* <!-- /Right Sidebar Backdrop --> */}

                {/* <!-- Main Content --> */}
                <div className="page-wrapper">
                    <div className="container-fluid pt-25">
                        {/* <!-- Title --> */}
                        <div className="row heading-bg">
                            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                <h5 className="txt-dark">Real Estate Slider</h5>
                            </div>
                            {/* <!-- Breadcrumb --> */}
                            {/* <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                                <ol className="breadcrumb">
                                    <li><a href="index.html">Dashboard</a></li>
                                    <li><a href="#"><span>e-commerce</span></a></li>
                                    <li className="active"><span>add-products</span></li>
                                </ol>
                            </div> */}
                            {/* <!-- /Breadcrumb --> */}
                        </div>
                        {/* <!-- /Title --> */}

                        {/* <!-- Row --> */}
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="panel panel-default card-view">
                                    <div className="panel-wrapper collapse in">
                                        <div className="panel-body">
                              
               
                                            
                                            <div className="form-wrap">
                                            <div class="table-responsive">
                                            <table class="table table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th> 
                                                            <th>Slider1</th>
                                                            <th>Slider2</th>                                                          
                                                            <th>Slider3</th>
                                                          
                                                            <th>Action</th>
                                                            
                                                        </tr>
                                                    </thead>
														
														<tbody>
                                                        {this.state.image_list.map(item=>(
                                                        <tr>
                                                           
                                                            <td>{item.id}</td>
                                                            <td ><img src={`${config.imageUrl1}${item.slider1}`} className="product-img"/></td>
                                                            <td ><img src={`${config.imageUrl1}${item.slider2}`} className="product-img"/></td>
                                                            <td ><img src={`${config.imageUrl1}${item.slider3}`} className="product-img"/></td>
                                                            
                                                            <td>
                                                            <td class="text-nowrap"><button type="submit"    onClick={this.editDataAPI.bind(this,item)}  data-toggle="modal" data-target="#responsive-modal1" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;
                                                             </td>
											
                                                            </td> 
                                                        </tr>
                                                       ))}
																					</tbody>
													</table>
												
												</div>
                                       
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            {/* <!-- /Row --> */}
                            

                            <div>Slider1 Title</div>
                        <br/>
                        <JoditEditor
            	editorRef={this.setRef} style={{color:'#000'}}
                value={this.state.image_list[0]?.text1}
                config={this.config}
                onChange={this.updateContent}
            />
<br/>
<div>Slider2 Title</div>
<br/>
                        <JoditEditor
            	editorRef={this.setRef} style={{color:'#000'}}
                value={this.state.image_list[0]?.text2}
                config={this.config}
                onChange={this.updateContent1}
            />
<br/>
<div>Slider3 Title</div>
<br/>
                        <JoditEditor
            	editorRef={this.setRef} style={{color:'#000'}}
                value={this.state.image_list[0]?.text3}
                config={this.config}
                onChange={this.updateContent2}
            />
            <br/>

            <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button>
                                           {/* //Edit Model */}
                                           <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style={{display: "none"}}>
											<div class="modal-dialog">
												<div class="modal-content">
													{/* <div class="modal-header">
														<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
														<h5 class="modal-title">Modal Content is Responsive</h5>
													</div> */}
													<div class="modal-body">
                                                    <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Update Slider</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                    <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Slider1 Image</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Slider2 Image</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview1}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Slider3 Image</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview2}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Logo </label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview3}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div> 
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Favicon</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview4}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">REal Estate</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview5}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div> */}

                                                  
                                                                                                      
                                                        {/* <!--/span--> */}
                                                    </div>
                                                    {/* <!-- Row --> */}
                                                    
                                                    {/* <!--/row--> */}
                                                   
                                                   
                                                    {/* <!--/row--> */}
                                                   
                                                                <div className="form-actions">
                                                        {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </form>
                                            </div>
													</div>
													<div class="modal-footer pt-0">
														<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button>
              										</div>
												</div>
											</div>
										</div>
										{/* </div> */}
                        {/* <!-- /Row --> */}

                    </div>

                    {/* <!-- Footer --> */}
                    <Footer/>
                    {/* <!-- /Footer --> */}

                </div>
                {/* <!-- /Main Content --> */}

            </div>
        </>
       

        )

    }
}