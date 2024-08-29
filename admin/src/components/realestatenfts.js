import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from  'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default class realestatenfts extends Component {

    constructor(props) {
        super(props)
        // this.loginData = (!Cookies.get('loginSuccessInfinityAdmin'))? [] : JSON.parse(Cookies.get('loginSuccessInfinityAdmin'));
       this.state = {
           user_id:1,
           name : '',
           description : '',
           image : '',
           owner : '',
           item_category_id : '',
           category_name : '' ,
           price : '',
           start_date : '',
           image_previewMain:'',
           image_fileMain: null,
           expiry_date : '',
           item_list : [],
           category_list:[],
           image_file: null,
           image_preview: '',
           image_file2: null,
           image_preview2: '',
           image_file3: null,
           image_preview3: '',
           updateform: '',
           update_id:'',
           bid_list : [],
           sell_type : '',
           
           dateShow:0,
           index : 0,
           title_deed:'',
           passport:'',
           loader:'',
           file_type:'',
           getItemData:'',
           image1:''

       }
       this.editDataAPI = this.editDataAPI.bind(this);
       this.deleteItem = this.deleteItem.bind(this);
       this.onChange = this.itemDetail.bind(this)
       this.updateItemData = this.updateItemData.bind(this)
       this.columns = [
        {
            key: '#',
            text: 'Sr. No.',
            cell: (row, index) => index + 1
          },
        {
            key: "item_id",
            text: "ID",
            sortable: true
        },
        {
            key: "name",
            text: "Name",
            sortable: true
        },
        {
            key: "description",
            text: "Description",
            sortable: true
        },
        {
            key: "image",
            text: "Image",
            cell: (item) => {
                return (
                    <>
                       <img src={`${config.imageUrl}${item.image}`} className="product-img"/>
                        
                       
                    </>
                );
            }
        },
        {
            key: "owner",
            text: "Owner",
            sortable: true
        },
         {
            key: "item_category",
            text: "Category Name",
            sortable: true
        },
        {
            key: "bid_price",
            text: "Bid Detail",
            cell: (item) => {
                return (
                    <>
                    <button
                       type='button'  onClick={this.getBidDetailAPI.bind(this,item)} data-toggle="modal" data-target="#exampleModalCenter" className="btn btn-primary">
                       View Bid</button>
                        
                       
                    </>
                );
            }
        },
        {
            key: "price",
            text: "Price",
            cell: (item) => {
                return (
                    <>
                    <span>$ {item.price}</span>
                    </>
                    )}
        },
        {
            key: "id",
            text: "Action",
            cell: (item) => {
                return (
                    <>
<button type="submit"    onClick={this.editDataAPI.bind(this,item)}  data-toggle="modal" data-target="#responsive-modal2" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;
                    
                     <button type="submit"   onClick={this.deleteItem.bind(this,item)}  data-toggle="tooltip" data-target="#responsive-modal1"  data-original-title="Close" className=" btn-danger"> <i class="fa fa-close m-r-10"></i> </button>
                        
                       
                    </>
                );
            }
        },

    ];

       this.config = {
        page_size: 10,
        length_menu: [10, 20, 50,],
        show_filter: true,
        show_pagination: true,
        pagination: 'advance',
        button: {
            excel: false,
            print: false
        }
    } 


    }



    componentDidMount() {
        // if(!Cookies.get('loginSuccessInfinityAdmin')){
        //     window.location.href = `${config.baseUrl}`
        //     return false;
        //  }
        this.categoryList();
        this.getItemAPI();
    }

    
//==================================  for Main Image ======================================

handleImagePreviewMain = (e) => {
    let image_as_base64 = URL.createObjectURL(e.target.files[0])
    let image_as_files = e.target.files[0];
    let file_type = '';
    if (image_as_files.type.indexOf('image') === 0) {
        file_type = 'image';
    } else if(image_as_files.type.indexOf('video') === 0){
       file_type = 'video';
 }else if(image_as_files.type.indexOf('audio') === 0){
    file_type = 'audio';
 }
 
    this.setState({
        image_previewMain: image_as_base64,
        image_fileMain: image_as_files,
        file_type:file_type
    })
 }
 

async getItemAPI() {
        axios.post(`${config.apiUrl}getRealEstateItem`, {  "user_id" : "0","user_collection_id":"0","limit":"0"}, )
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list: response.data.response
                    })
                }

                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }
    
    async categoryList() {
        await   
        axios({
            method: 'get',
            url: `${config.apiUrl}getRealEstateCategory`,
            data: {}
         })
        // axios.get(`${config.apiUrl}getRealEstateCategory`, {}, )
                .then(result => {
                    
                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.response
                        })
                        
                       
                    }
    
                    else if (result.data.success === false) {
    
                    }
                })
    
                .catch(err => {
                })
        }
 

        async getBidDetailAPI(id) {
       
        axios.post(`${config.apiUrl}getBidDetail`, {'item_id': id.id }, )
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        bid_list: response.data.response
                    })
                }
            
                else if (response.data.success === false) {

                }
            })

            .catch(err => {
            })
    }

      async BidAcceptAPI(id) {
        axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { "Authorization": this.loginData?.Token },
            data: {'email':this.loginData?.data.user_email,"user_id":id.user_id,"item_id" : id.item_id}
         })
       
            .then(response => {
                if (response.data.success === true) {
                    toast.success(response.data.msg, {
                        position: toast.POSITION.TOP_CENTER
                    }, setTimeout(() => {
                       window.location.reload();
                    }, 500));
                   
                }
            
                else if (response.data.success === false) {

                }
            })

            .catch(err => {
                
            })
    }


 handleChange = event => {
  
    event.persist();

    let value = event.target.value;

    this.setState(prevState => ({
        item_list: { ...prevState.item_list, [event.target.name]: value }
    }))
};

handleChange1 = e =>{
       
    this.setState({
        [e.target.name] : e.target.value 
     })
 
    
 if (e.target.checked === true && e.target.name === 'end_start_date') {
    this.setState({
       dateShow:1
    })
 }
 else if (e.target.checked === false && e.target.name === 'end_start_date') {
    this.setState({
       dateShow:0
    })
 }
}

handleImagePreview = (e) => {
    var newImage_as_base64 = []
    var new_image_as_files = []
    let imageLenght = e.target.files.length
    let file_type = e.target.files[0];
    for (var i = 0; i < imageLenght; i++) {
       let image_as_base64 = URL.createObjectURL(e.target.files[i])
       let image_as_files = e.target.files[i];
       let file_type = '';
       if (image_as_files.type.indexOf('image') === 0) {
          file_type = 'image';
       }else if(image_as_files.type.indexOf('video') === 0){
             file_type = 'video';
       }else if(image_as_files.type.indexOf('audio') === 0){
          file_type = 'audio';
       }
       newImage_as_base64.push(image_as_base64);
       new_image_as_files.push(image_as_files);
    }
 
    this.setState({
        image_preview: newImage_as_base64,
        image_file: new_image_as_files,
        // file_type: file_type,
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
    })
}



  handleSubmit = async (event) =>{
      
   event.preventDefault();
   this.setState({
    loader:'1'
   })
   if(this.state.name==''){
    toast.error('Item name Required', {
        position: toast.POSITION.TOP_CENTER
        });
} 
else if(this.state.description==''){
    toast.error('Item Description Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(!this.state.image_file){
    toast.error('Item Image Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(!this.state.image_file2){
    toast.error('Title Deed Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(!this.state.image_file3){
    toast.error('Passport Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(!this.state.image_fileMain){
    toast.error('Main Image is Required', {
        position: toast.POSITION.TOP_CENTER
        });
}

else if(!this.state.item_category_id){
    toast.error('Please Select Category', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(this.state.price==''){
    toast.error('Item price Required', {
        position: toast.POSITION.TOP_CENTER
        });
}

else{

   
    let formData = new FormData();

    let formData1 = new FormData();
    let formData2 = new FormData();
    let formData4 = new FormData();

   let allImages = []
    
   let filesLength = this.state.image_file.length
   for (var j = 0; j < filesLength; j++) {
      let formData = new FormData();
      
      formData.append('file', this.state.image_file[j]);
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      var resIPF =  await axios.post(url,
           formData,
           {
              headers: {
                 'Content-Type': `multipart/form-data; boundary= ${formData._boundary}`,
                 'pinata_api_key': 'b26a087893e3f0033bbf',
                 'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
              }
           }
        );
        
      allImages.push(resIPF.data.IpfsHash);
      this.state.image1 = allImages        
   }


formData1.append('file', this.state.image_file2);


    const url1 = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  var resIPF =  await axios.post(url1,
        formData1,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                'pinata_api_key': 'b26a087893e3f0033bbf',
                'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
            }
        }
    );

// formData.append('image', resIPF.data.IpfsHash);
this.state.title_deed = resIPF.data.IpfsHash


formData2.append('file', this.state.image_file3);

    const url2 = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  var resIPF =  await axios.post(url2,
        formData2,
        {
            headers: {
                'Content-Type': `multipart/form-data; boundary= ${formData2._boundary}`,
                'pinata_api_key': 'b26a087893e3f0033bbf',
                'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
            }
        }
    );

// formData.append('image', resIPF.data.IpfsHash);
this.state.passport = resIPF.data.IpfsHash
// const obj = Object.fromEntries(formData);
       
formData4.append('file', this.state.image_fileMain);
    
const url4 = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
var resIPF =  await axios.post(url4,
     formData4,
     {
        headers: {
           'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
           'pinata_api_key': 'b26a087893e3f0033bbf',
           'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
        }
     }
  );
// this.state.title_deed = resIPF.data.IpfsHash
this.state.image = resIPF.data.IpfsHash

axios({
    method: 'post',
    url: `${config.apiUrl}addRealEstate`,
    headers: { "Authorization": this.loginData?.Token },
    data: this.state
 })
        .then(result=>{
    
    if(result.data.success === true ){
        this.setState({
            loader:''
        })
        // this.state.loader = ''
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
        }, setTimeout(() => {
           window.location.reload();
        }, 500));
          this.state = {
            name : '',
            description : '',
            image : '',
            
            item_category_id : '',  
            price : '',
            sell_type : '',
            
          }
          this.getItemAPI();
           
     }
    }).catch(err=>{
      
        toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
}
}

editDataAPI(id){
  
    this.setState({
    
     name : id.name,
     description : id.description,
     
     image : id.image,
     item_category_id : id.item_category_id,
     price : id.price,
     
     update_id:id.id,
     updateform : "123"     
   }); 
 
}


async updateDataAPI(){
   

if(this.state.name==''){
    toast.error('Item name Required', {
        position: toast.POSITION.TOP_CENTER
        });
} 
else if(this.state.description==''){
    toast.error('Item Description Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
// else if(!this.state.image_file){
//     toast.error('Item Image Required', {
//         position: toast.POSITION.TOP_CENTER
//         });
// }
else if(!this.state.item_category_id){
    toast.error('Please Select Category', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(this.state.price==''){
    toast.error('Item price Required', {
        position: toast.POSITION.TOP_CENTER
        });
}else{
    let formData = new FormData();

    let formData1 = new FormData();

    formData1.append('file', this.state.image_file);

    formData.append('id',this.state.update_id)
    formData.append('name', this.state.name);
    formData.append('description', this.state.description);
    if(this.state.image_file === null){
       formData.append('image', this.state.image);
}
    else{
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      var resIPF =  await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': 'b26a087893e3f0033bbf',
                    'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                }
            }
        );
       
      
      formData.append('image', resIPF.data.IpfsHash);
      
    }    
    formData.append('item_category_id', this.state.item_category_id);
    formData.append('price', this.state.price);
    formData.append('email', this.loginData?.data.user_email);

  //  formData.append('IPFShash',resIPF.data.ipfsHash);
 
  axios({
    method: 'post',
    url: `${config.apiUrl}updateitem`,
    headers: { "Authorization": this.loginData?.Token },
    data: formData
 })

    //   axios.post(`${config.apiUrl}updateitem`,formData)
        .then(result=>{
    
    if(result.data.success === true ){
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
        }, setTimeout(() => {
           window.location.reload();
        }, 1500));
          this.state = {
            name : '',
            description : '',
            image : '',
            
            item_category_id : '',  
            price : '',
          }
          this.getItemAPI();
           
     }
    }).catch(err=>{
    
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
}
}

 deleteItem = (id) => {
    confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to delete this NFTs.',
        buttons: [
            {
                label: 'Yes',
                onClick: () =>
                axios({
                    method: 'post',
                    url: `${config.apiUrl}deleteitem`,
                    headers: { "Authorization": this.loginData?.Token },
                    data: {'email':this.loginData?.data.user_email,
                    item_edition_id :  id.item_edition_id}
                 })
        //  axios.post(`${config.apiUrl}deleteitem`,{item_edition_id :  id.item_edition_id} )
            .then(result => {
                if (result.data.success === true){
                toast.success(result.data.msg, {
               position: toast.POSITION.TOP_CENTER
                                            });
                                            this.getItemAPI();
                                        }
                                   
                                        }).catch(err => {
                                            toast.warning(err.response.data?.msg, {
                                                position: toast.POSITION.TOP_CENTER,
                                            
                                            }, setTimeout(() => {
                                                    
                                            }, 500));
                                        })
                                },
    {
        label: 'No',
    }
]
});
}

itemDetail = event => {
    event.preventDefault()
    let value = event.target.value;  
    this.setState(prevState => ({
      getItemData: { ...prevState.getItemData, [event.target.name]: value }
    }))

    if (event.target.checked === true && event.target.name === 'end_start_date') {
        this.setState({
           dateShow:1
        })
     }
     else if (event.target.checked === false && event.target.name === 'end_start_date') {
        this.setState({
           dateShow:0
        })
     }
  }

async editDataAPI(id){
    
    await axios.post(`${config.apiUrl}ItemDetailForEdit`, {item_id:id.item_id}, )
        .then(result => {
            
            if (result.data.success === true) {
                this.setState({
                    getItemData: result.data.response
                })
                
                
            }

            else if (result.data.success === false) {

            }
        })

        .catch(err => {
        })
}


async updateItemData(e){
    e.preventDefault()
    this.setState({
        loader:'1'
       })

if(this.state.getItemData?.item_name==''){
    toast.error('Item name Required', {
        position: toast.POSITION.TOP_CENTER
        });
} 
else if(this.state.getItemData?.description==''){
    toast.error('Item Description Required', {
        position: toast.POSITION.TOP_CENTER
        });
}
// else if(!this.state.getItemData?.image_file){
//     toast.error('Item Image Required', {
//         position: toast.POSITION.TOP_CENTER
//         });
// }

else if(!this.state.getItemData?.item_category_id){
    toast.error('Please Select Category', {
        position: toast.POSITION.TOP_CENTER
        });
}
else if(this.state.getItemData?.price==''){
    toast.error('Item price Required', {
        position: toast.POSITION.TOP_CENTER
        });
}else{
    let formData = new FormData();

    let formData1 = new FormData();

    formData1.append('file', this.state.image_file);

    formData.append('id',this.state.update_id)
    formData.append('name', this.state.item_name);
    formData.append('description', this.state.description);
    if(this.state.image_file === null){
       formData.append('image', this.state.image);
}
    else{
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      var resIPF =  await axios.post(url,
            formData1,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
                    'pinata_api_key': 'b26a087893e3f0033bbf',
                    'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                }
            }
        );
       
      
      formData.append('image', resIPF.data.IpfsHash);
      if(resIPF.data.IpfsHash !== '' || resIPF.data.IpfsHash !== null){

          this.state.getItemData.image = resIPF.data.IpfsHash
          this.state.getItemData.file_type = this.state.file_type

      }
    }    

  //  formData.append('IPFShash',resIPF.data.ipfsHash);
  this.state.getItemData.email = this.loginData?.data.user_email
 
  axios({
    method: 'post',
    url: `${config.apiUrl}updateitem`,
    headers: { "Authorization": this.loginData?.Token },
    data: this.state.getItemData
 })
    //   axios.post(`${config.apiUrl}updateitem`,this.state.getItemData)
        .then(result=>{
    
    if(result.data.success === true ){
        this.setState({
            loader:''
           })
        toast.success(result.data.msg, {
            position: toast.POSITION.TOP_CENTER
        },
         setTimeout(() => {
           window.location.reload();
        }, 1500));

          this.getItemAPI();
           
     }
    }).catch(err=>{
    
    toast.error(err.response.data?.msg, {
        position: toast.POSITION.TOP_CENTER, autoClose:1500
    
    }, setTimeout(() => {
            
    }, 500));
 
    })
}
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
                <div className="page-wrapper nft-user">
                    <div className="container-fluid pt-25">
                        {/* <!-- Title --> */}
                        <div className="row heading-bg">
                            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                <h5 className="txt-dark">add real estate product</h5>
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
                            {/* <div className="table-responsive"> */}
                                <div className="panel panel-default card-view">
                                    <div className="panel-wrapper collapse in">
                                        <div className="panel-body">
                              
                                            <button type='button'    data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add Real Estate NFTs</button>
                                             <br/>
                                             <br/>
                                            
                                            <div className="form-wrap">
                                            <div class="table-responsive">
                                            {/* <table class="table table-striped mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th> 
                                                            <th>Name</th>
                                                            <th>Description</th>                                                          
                                                            <th>Image</th>
                                                            <th>owner</th>
                                                            <th>Category Name</th>
                                                            <th>Bid Detail</th>
                                                            <th>price</th>
                                                            <th>Action</th>
                                                            
                                                        </tr>
                                                    </thead>
														
														<tbody>
                                                        {this.state.item_list.map(item=>(
                                                        <tr>
                                                           
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.description}</td>
                                                            <td ><img src={`${config.imageUrl}${item.image}`} className="product-img"/></td>
                                                            <td>{item.owner}</td>
                                                            <td style={{textAlign:"center"}}>{item.category_name}</td>
                                                            <td>   <button type='button'  onClick={this.getBidDetailAPI.bind(this,item)}  data-toggle="modal" data-target="#exampleModalCenter" className="btn btn-primary">View Bid </button>
               </td>
                                                            <td>{item.price}</td>
                                                            <td>
                                                            <td class="text-nowrap"><button type="submit"    onClick={this.editDataAPI.bind(this,item)}  data-toggle="modal" data-target="#responsive-modal1" className="btn-primary" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </button>&nbsp;
                                                             <button  className=" btn-danger" onClick={this.deleteItem.bind(this,item)}  data-toggle="tooltip" data-original-title="Close"> <i class="fa fa-close m-r-10"></i> </button> </td>
											
                                                            </td> 
                                                        </tr>
                                                       ))}
																					</tbody>
													</table> */}
                                                    <ReactDatatable
                                               config={this.config}
                                               records={this.state.item_list}
                                             columns={this.columns}
                                                                   /> 
												</div>
                                       
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                                           <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" data-backdrop="false"  aria-labelledby="myModalLabel" aria-hidden="true" >
											<div class="modal-dialog">
												<div class="modal-content">
													
													<div class="modal-body">
                                                    <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add Real Estate NFTs</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Item Name</label>
                                                                <input type="text" onChange={this.handleChange1} name="name" className="form-control" placeholder="Item Name"  value={this.state.name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.handleChange1} name="description" className="form-control" placeholder="Description"  value={this.state.description} />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Main Image(jpg, jpeg, png, gif, mp3, mp4)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreviewMain}  className="form-control" placeholder="Image File"  multiple />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Gallery Image(jpg, jpeg, png, gif)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={this.handleImagePreview}  className="form-control" placeholder="Image File"  multiple />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Title Deed(Zip)</label>
                                                                <input type="file" accept=".zip" onChange={this.handleImagePreview2}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Passport(jpg, jpeg, png)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png" onChange={this.handleImagePreview3}  className="form-control" placeholder="Image File"   />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Owner</label>
                                                                <input type="text" onChange={this.handleChange1} name="owner" className="form-control" placeholder="Owner Name"  value={this.state.owner} />
                                                            </div>
                                                        </div>  */}
                                                        <div className="col-md-6">
                                                             
                                 <div className="form-group">
                                    <label className="control-label mb-10">Select Category</label>
                                    <div className="customSelectHolder">
                                    
                                    <select name="item_category_id" onChange={this.handleChange1} value={this.state.item_category_id} class="form-control  basic">
                                       <option selected="selected" value="">Select Category</option>
                                       {this.state.category_list.map(item=>(
                                       <option value={item.id}>{item.name}</option>
                                          ))}
                                             </select>
                                    </div>
                                 </div>
                                                        </div>
                                                       
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (in USD)</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price"  value={this.state.price} />
                                                            </div>
                                                        </div>

                                
                                                        
           
                                     <div className="col-md-6">
                                     <div className="form-group">
                                    <label className="control-label mb-10">Sell Type</label>
                                    <div className="customSelectHolder">
                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} value={this.state.sell_type} >
                                   
                                    <option selected="selected" value="">Select Options</option>
                                    
                                        <option value="1">Price</option>
                                       <option value="2">Auction</option>
                                          

                                    </select>

                                     </div>
                                     </div>
                                  
                                     </div>  
                                     {/* <div className="col-md-6">
                                     <div className="form-group">
                                    <label className="control-label mb-10">Edition Type</label>
                                    <div className="customSelectHolder">
                                    <select class="form-control  basic" name="edition_type" onChange={this.handleChange1} value={this.state.edition_type} >
                                   
                                    <option selected="selected" value="">Select Options</option>
                                    
                                        <option value="1">Limited Edition</option>
                                       <option value="2">Open Edition</option>
                                          

                                    </select>

                                     </div>
                                     </div>
                                  
                                     </div>  */}
                                     <div className="col-md-6">
                                     <div className="form-group">
                                     <label className="control-label mb-10">Expiry Date</label>
                                      <input type="date" onChange={this.handleChange1} className="form-control"  name="expiry_date"  value={this.state.expiry_date} />
                                     </div>
                                     </div> 
                                      
                                                        <div className="col-md-12">
                                                        <label className="control-label mb-10">
                                                        <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.handleChange1}/> &nbsp;
                                                        
                                                        click here to create Upcoming NFTs </label>
                                                            
                                                        </div>
                                                        {(this.state.dateShow===1)?
                                                        <>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Start Date</label>
                                                                <input type="date" onChange={this.handleChange1} className="form-control"  name="start_date"  value={this.state.start_date} />
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">End Date</label>
                                                                <input type="date" onChange={this.handleChange1} name="end_date" className="form-control" placeholder="End Date"  value={this.state.end_date} />
                                                                
                                                            </div>
                                                        </div> */}
                                                        </>
                                                        :''}


                                     </div>                
                                                   
                                     <div className="form-actions">
                                 {/* <button type="submit" onClick={this.handleSubmit} className="btn btn-success btn-icon left-icon mr-10 pull-left"> <i className="fa fa-check"></i> <span>save</span></button> */}
                                     <div className="clearfix"></div>
                                     </div>
                                                </form>
                                            </div>
													</div>
													<div class="modal-footer pt-0">
														<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                        {/* {(this.state.updateform)?
                <button type='button' onClick={this.updateDataAPI.bind(this)} className="btn btn-success btn-icon left-icon mr-10 pull-left">Update</button> */}
                
                {this.state.loader === '' ? 
                <button type='submit'  onClick={this.handleSubmit} className="btn btn-primary">Add </button>
                :
                <button type='submit'  disabled  className="btn btn-primary">Loading... </button>

                
                }
                {/* } */}
													</div>
												</div>
											</div>
										</div>

                    {/* View Bid */}
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="table-responsive">
        <table class="table table-striped mb-0">
        <thead>
            <tr>

                <th>UserName</th>
                <th>Profile Pic</th>
                <th>Item Name</th>
                <th>Bid Price</th>
                <th>Action</th>
                </tr>
                </thead>
       	
                <tbody>
                            {this.state.bid_list.map(item=>(
                 <tr>
                                                           
                 <td>{item.user_name}</td>
                 <td >
                 {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined 
                             ? 
                             <img src= 'images/noimage.png' className="product-img"/> 
                             
                             :
                             <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img"/> }
              
                 </td>
                 <td>{item.name}</td>
                 <td>{item.bid_price}</td>
                 <td><button type='submit'  onClick={this.BidAcceptAPI.bind(this,item)}  className="btn btn-primary">Accept</button>
             </td>
             </tr>
                 ))}
			</tbody>
													
            </table>
      </div>
      <div class="modal-footer">
       
       
      </div>
    </div>
  </div>
</div>




<div id="responsive-modal2" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            
                                            <div class="modal-body">
                                            <div className="form-wrap">
                                        <form action="#">
                                            <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Update Product</h6>
                                            <hr className="light-grey-hr" />
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Item Name</label>
                                                        <input type="text" onChange={this.itemDetail} name="name" className="form-control" placeholder="Item Name"  value={this.state.getItemData?.name} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Description</label>
                                                        <input type="text" onChange={this.itemDetail} name="description" className="form-control" placeholder="Description"  value={this.state.getItemData?.description} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Image(jpg, jpeg, png, gif, mp3, mp4)</label>
                                                        <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview}  className="form-control" placeholder="Image File"   />
                                                    </div>
                                                </div>
                                                 
                                                <div className="col-md-6">
                                                        
                            <div className="form-group">
                            <label className="control-label mb-10">Select Category</label>
                            <div className="customSelectHolder">
                            
                            <select name="item_category_id" onChange={this.itemDetail} value={this.state.getItemData?.item_category_id} class="form-control  basic">
                                <option selected="selected" value="">Select Category</option>
                                {this.state.category_list.map(item=>(
                                <option value={item.id}>{item.name}</option>
                                    ))}
                                        </select>
                            </div>
                            </div>
                                                </div>
                                                
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Fixed price (in USD)</label>
                                                        <input type="text" onChange={this.itemDetail} name="price" className="form-control" placeholder="Price"  value={this.state.getItemData?.price} />
                                                    </div>
                                                </div>

                        
                                                
                                <div className="col-md-6">
                                <div className="form-group">
                                <label className="control-label mb-10">Expiry Date</label>
                                <input type="date" onChange={this.itemDetail} className="form-control"  name="expiry_date"  value={this.state.getItemData?.expiry_date} />
                                </div>
                                </div> 
                                {/* <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Quantity</label>
                                                        <input type="text" onChange={this.itemDetail}
                                                        disabled={this.state.getItemData?.edition_type === '2'}
                                                            name="quantity" className="form-control" placeholder=""  value={this.state.getItemData?.quantity} />
                                                    </div>
                                                </div>  */}
                                                <div className="col-md-12">
                                                <label className="control-label mb-10">
                                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.itemDetail}/> &nbsp;
                                                
                                                click here to create Upcoming NFTs </label>
                                                    
                                                </div>
                                                {(this.state.dateShow===1)?
                                                <>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label mb-10">Start Date</label>
                                                        <input type="date" onChange={this.itemDetail} className="form-control"  name="start_date"  value={this.state.getItemData?.start_date} />
                                                    </div>
                                                </div>
                                                </>
                                                :''}


                                </div>                
                                            
                                <div className="form-actions">

                                <div className="clearfix"></div>
                                </div>
                                        </form>
                                    </div>
                                            </div>
                                            <div class="modal-footer pt-0">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

        {this.state.loader === '' ? 
            <button type='submit'  onClick={this.updateItemData}  className="btn btn-primary">Update</button>
        :
        <button type='submit'  disabled  className="btn btn-primary">Loading... </button>

        
        }
        
                                            </div>
                                        </div>
                                    </div>
                                </div>




										{/* </div> */}
                        {/* <!-- /Row --> */}
                       
                    {/* </div> */}
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