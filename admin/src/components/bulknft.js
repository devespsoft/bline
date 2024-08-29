import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import config from '../config/config'
import Cookies from 'js-cookie';
import ReactDatatable from '@ashvin27/react-datatable'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import $ from 'jquery'; 

export default class bulknft extends Component {
    constructor(props) {
        super(props)
        this.loginData = (!Cookies.get('loginSuccessblineAdmin')) ? [] : JSON.parse(Cookies.get('loginSuccessblineAdmin'))
        this.state = {
            item_id: '',
            name: '',
            description: '',
            image: '',
            owner_id: '',
            owner_profile_pic: '',
            file_type: '',
            item_category_id: '',
            price: '',
            collection_id: '',
            user_id: '',
            is_sold: '',
            expiry_date: '',
            start_date: '',
            sell_type: '',
            sell_type_text: '',
            bid_list: [],
            quantity: '',
            loader: '',
            category_list: [],
            item_list1: []

        }
        console.log(this.loginData?.data?.user_email, this.loginData?.data);
        this.editDataAPI = this.editDataAPI.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChange = this.itemDetail.bind(this)
        this.updateItemData = this.updateItemData.bind(this)
        this.addBulkSellAPI = this.addBulkSellAPI.bind(this)
        this.zipfileSelect = this.zipfileSelect.bind(this)
        this.excelfileSelect = this.excelfileSelect.bind(this)
        this.columns = [
            {
                key: '#',
                text: 'Sr. No.',
                cell: (row, index) => index + 1
            },

            {
                key: "name",
                text: "Name",
                cell: (item) => {
                    return (
                        <>
                            <a href={`https://espsofttech.org/bline/nftDetails/${item.id}`} target="_blank" >
                                {item.name}
                            </a>

                        </>
                    );
                }
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
                            {item.local_image === null || item.local_image === '' || item.local_image === undefined
                                ?
                                <img src='images/noimage.png' className="product-img" />
                                :
                                <a href={`${config.imageUrl}${item.image}`} target="_balnk">
                                <img width="80px" src={`${config.imageUrl1}` + item.folder_name + '/' + item.local_image} />
                                </a>
                            }


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
                    )
                }
            },
            {
                key: "quantity",
                text: "Quantity",
                sortable: true
            },
            {
                key: "is_minted",
                text: "Mint",
                cell: (item) => {
                    return (
                        <button id={'mintId'+item.id} onClick={this.createNftConfirmAPI.bind(this, item)} className="btn-sm btn btn-primary">Mint</button>
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

        this.categoryList();
        this.getBulkNFTAPI();
        this.getAdminCollectionAPI();
        // this.addBulkSellAPI();
    }
    async getAdminCollectionAPI() {
        axios.get(`${config.apiUrl}getAdminCollection`, {},)
            .then(response => {
                if (response.data.success === true) {
                    this.setState({
                        item_list1: response.data.response
                    })
                }
                else if (response.data.success === false) {
                }
            })
            .catch(err => {
            })
    }
    async getBulkNFTAPI() {
        axios.post(`${config.apiUrl}getBulkSellList`, {user_id:1},)
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
                url: `${config.apiUrl}getDigitalCategory`,
                data: {}
            })
                // axios.get(`${config.apiUrl}getDigitalCategory`, {}, )
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            category_list: result.data.response
                        })
                        // console.log('category',this.state.category_list)
                    }
                    else if (result.data.success === false) {
                    }
                })
                .catch(err => {
                })
    }


    async getBidDetailAPI(id) {

        axios.post(`${config.apiUrl}getBidDetail`, { 'item_id': id.id },)
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
                this.setState({
                    bid_list: []
                })
            })
    }

    async BidAcceptAPI(id) {
        axios({
            method: 'post',
            url: `${config.apiUrl}bidAccept`,
            headers: { "Authorization": this.loginData?.Token },
            data: { 'email': this.loginData?.data.user_email, "user_id": id.user_id, "item_id": id.item_id }
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

    handleChange1 = e => {

        this.setState({
            [e.target.name]: e.target.value
        })


        if (e.target.checked === true && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (e.target.checked === false && e.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
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

    // handleSubmit = async (event) => {
    //     event.preventDefault();
    //     this.setState({
    //         loader: '1'
    //     })
    //     if (this.state.item_name == '') {
    //         toast.error('Item name Required', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     else if (this.state.description == '') {
    //         toast.error('Item Description Required', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     else if (!this.state.image_file) {
    //         toast.error('Item Image Required', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     else if (this.state.owner == '') {
    //         toast.error('Owner Name Required', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     else if (!this.state.item_category_id) {
    //         toast.error('Please Select Category', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     else if (this.state.price == '') {
    //         toast.error('Item price Required', {
    //             position: toast.POSITION.TOP_CENTER
    //         });
    //     }
    //     // else if (this.state.edition_type == '') {
    //     //     toast.error('Item edition required', {
    //     //         position: toast.POSITION.TOP_CENTER
    //     //     });
    //     // }
    //     else {

    //         // if (this.state.edition_type === '2') {
    //         //     this.state.quantity = '0'
    //         // }
    //         let formData = new FormData();

    //         let formData1 = new FormData();

    //         formData1.append('file', this.state.image_file);


    //         formData.append('name', this.state.item_name);
    //         formData.append('description', this.state.description);
    //         if (this.state.image_file === null) {
    //             formData.append('avatar', this.state.item_list.avatar);
    //         }
    //         else {
    //             formData.append('avatar', this.state.image_file);
    //         }
    //         formData.append('owner', this.state.owner);
    //         formData.append('item_category_id', this.state.item_category_id);
    //         formData.append('price', this.state.price);
    //         formData.append('start_date', this.state.start_date);
    //         formData.append('end_date', this.state.end_date);
    //         formData.append('sell_type', this.state.sell_type);
    //         formData.append('quantity', this.state.quantity);
    //         formData.append('file_type', this.state.file_type);
    //         formData.append('email', this.loginData?.data.user_email);
    //         formData.append('user_id', this.loginData?.data.id);

    //         //  formData.append('IPFShash',resIPF.data.ipfsHash);


    //         const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //         var resIPF = await axios.post(url,
    //             formData1,
    //             {
    //                 headers: {
    //                     'Content-Type': `multipart/form-data; boundary= ${formData1._boundary}`,
    //                     'pinata_api_key': 'b26a087893e3f0033bbf',
    //                     'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
    //                 }
    //             }
    //         );

    //         formData.append('image', resIPF.data.IpfsHash);

    //         const obj = Object.fromEntries(formData);

    //         axios({
    //             method: 'post',
    //             url: `${config.apiUrl}addNftByUser1`,
    //             headers: { "Authorization": this.loginData?.Token },
    //             data: obj
    //         })
    //             //   axios.post(`${config.apiUrl}insertitem`,obj)
    //             .then(result => {

    //                 if (result.data.success === true) {
    //                     this.setState({
    //                         loader: ''
    //                     })
    //                     toast.success(result.data.msg, {
    //                         position: toast.POSITION.TOP_CENTER
    //                     }, setTimeout(() => {
    //                         window.location.reload();
    //                     }, 500));
    //                     this.state = {
    //                         item_name: '',
    //                         description: '',
    //                         image: '',
    //                         owner: '',
    //                         item_category_id: '',
    //                         price: '',
    //                         sell_type: '',
    //                         quantity: ''
    //                     }
    //                     this.getItemAPI();

    //                 }
    //             })
    //         // .catch(err => {

    //         //     toast.error(err.response.data?.msg, {
    //         //         position: toast.POSITION.TOP_CENTER, autoClose: 1500

    //         //     }, setTimeout(() => {

    //         //     }, 500));

    //         // })
    //     }
    // }

    itemDetail = event => {
        event.preventDefault()
        let value = event.target.value;
        this.setState(prevState => ({
            getItemData: { ...prevState.getItemData, [event.target.name]: value }
        }))

        if (event.target.checked === true && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 1
            })
        }
        else if (event.target.checked === false && event.target.name === 'end_start_date') {
            this.setState({
                dateShow: 0
            })
        }
    }

    async editDataAPI(id) {

        await axios.post(`${config.apiUrl}ItemDetailForEdit`, { item_id: id.id },)
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


    async updateItemData(e) {
        e.preventDefault()
        this.setState({
            loader: '1'
        })

        if (this.state.getItemData?.item_name == '') {
            toast.error('Item name Required', {
                position: toast.POSITION.TOP_CENTER
            });
        }


        else if (!this.state.getItemData?.item_category_id) {
            toast.error('Please Select Category', {
                position: toast.POSITION.TOP_CENTER
            });
        }
        else if (this.state.getItemData?.price == '') {
            toast.error('Item price Required', {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            let formData = new FormData();

            let formData1 = new FormData();

            formData1.append('file', this.state.image_file);

            formData.append('id', this.state.update_id)
            formData.append('name', this.state.item_name);
            formData.append('description', this.state.description);
            if (this.state.image_file === null) {
                formData.append('image', this.state.image);
            }
            else {
                const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                var resIPF = await axios.post(url,
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
                if (resIPF.data.IpfsHash !== '' || resIPF.data.IpfsHash !== null) {

                    this.state.getItemData.image = resIPF.data.IpfsHash
                    this.state.getItemData.file_type = this.state.file_type

                }
            }
            this.state.getItemData.email = this.loginData?.data.user_email
            //  formData.append('IPFShash',resIPF.data.ipfsHash);

            axios({
                method: 'post',
                url: `${config.apiUrl}updateitem`,
                headers: { "Authorization": this.loginData?.Token },
                data: this.state.getItemData
            })
                //   axios.post(`${config.apiUrl}updateitem`,this.state.getItemData)
                .then(result => {

                    if (result.data.success === true) {
                        this.setState({
                            loader: ''
                        })
                        toast.success(result.data.msg, {
                            position: toast.POSITION.TOP_CENTER
                        },
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500));

                        this.getItemAPI();

                    }
                }).catch(err => {

                    toast.error(err.response.data?.msg, {
                        position: toast.POSITION.TOP_CENTER, autoClose: 1500

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
                            data: { 'email': this.loginData?.data.user_email, id: id.id }
                        })
                            //  axios.post(`${config.apiUrl}deleteitem`,{item_edition_id :  id.item_edition_id} )
                            .then(result => {
                                if (result.data.success === true) {
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




    hideNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to hide this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}hideNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
                        })

                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data?.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }


    showNFTAPI(id) {
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure to show this NFT..',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        axios({
                            method: 'post',
                            url: `${config.apiUrl}showNFT`,
                            headers: { "Authorization": this.loginData?.Token },
                            data: { 'email': this.loginData?.data.user_email, item_id: id.id }
                        })
                            //    axios.post(`${config.apiUrl}showNFT`,
                            //  {item_id :  id.id} )
                            .then(result => {

                                toast.success(result.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                                this.componentDidMount();
                            }).catch((error) => {
                                toast.danger(error.data.msg, {
                                    position: toast.POSITION.TOP_CENTER
                                });
                            })
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    async updateAdminNftFeature(id, featured) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}addUserNftFeatured`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (featured == 0) {
                        toast.success('Added in featured!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From featured!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.userCollection();

                }
            }).catch(err => {
            })
    }

    async addOnSale(id, featured) {
        console.log('id', id)
        axios({
            method: 'post',
            url: `${config.apiUrl}addOnSale`,
            headers: { "Authorization": this.loginData?.Token },
            data: { id: id, is_featured: featured === 0 ? '1' : '0' }
        })
            .then(result => {

                if (result.data.success === true) {

                    if (featured == 0) {
                        toast.success('Added on sale!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    else if (featured == 1) {
                        toast.error('Removed From sale!!', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                    this.userCollection();

                }
            }).catch(err => {
            })
    }

    addBulkSellAPI(e) {
        // e.preventDefault();
        let formData = new FormData();
        this.setState({
            loader: 1
        })
        formData.append('excel_file', this.state.excel_file);
        formData.append('zip_file', this.state.zip_file);
        formData.append('royalty_percent', this.state.royalty_percent);
        formData.append('price', this.state.price);
        formData.append('start_date', this.state.starting_date);
        formData.append('is_on_sale', this.state.project_launch);
        formData.append('user_id', 1);
        formData.append('item_category_id', this.state.item_category_id);
        formData.append('user_collection_id', this.state.user_collection_id);
        formData.append('sell_type', this.state.sell_type);

        axios.post(`${config.apiUrl}addBulkNftByAdmin`, formData)
            .then(result => {
                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
                } else {
                    toast.error(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'red',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                }
                this.setState({
                    loader: ''
                })
            }).catch(err => {
                toast.error(err.response.data?.msg,
                    this.setState({
                        loader: ''
                    })
                );
            })
    }

    zipfileSelect = (e) => {
        this.setState({
            zipError: '',
            zip_file_name: ''
        })

        if (e.target.files[0]) {
            let zip_as_files = e.target.files[0];
            if (zip_as_files.type == 'application/zip') {
                this.setState({
                    zip_file_name: zip_as_files.name,
                    zip_file: zip_as_files,
                    file_type: 'zip',
                    image_type: e.target.files[0].type,
                    imageError: ""
                })
            } else {
                this.setState({
                    zipError: 'File not supported please select only zip file!!'
                })
            }
        }
    }
    excelfileSelect = (e) => {

        this.setState({   
            excel_file_name: '',
            excelError : ''
        })

        if (e.target.files[0]) {
            let excel_as_files = e.target.files[0];
            if (excel_as_files.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                this.setState({
                    excel_file_name: excel_as_files.name,
                    excel_file: excel_as_files,
                    file_type: 'excel',
                    image_type: e.target.files[0].type,
                })
            }else{
                this.setState({
                    excelError: 'File not supported please select only xlsx file!!'
                })
            }
        }
    }

















    async createNftConfirmAPI(nftData) {

        $('#mintId'+nftData.id).text('Processing...');
        $("#mintId"+nftData.id).prop("disabled", true);
        console.log('nft',nftData)
        const token = this.token
        var localImage = './uploads/' + nftData.folder_name + '/' + nftData.local_image
        confirmAlert({
            title: 'Confirm to submit',
            message: 'Are you sure you want to mint?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>

                        axios({
                            method: 'post',
                            url: `${config.apiUrl}getLocalImageHash`,
                            headers: { authorization: token },
                            data: { "user_id": this.loginData?.id, 'email': this.loginData?.user_email, 'localImage': localImage }
                        }).then(response => {
                            if (response.data.success === true) {
                                nftData.ipfsHash = response.data.response
                                this.createNftAPI(nftData)
                            } else {
                                toast.error(response.data.msg,
                                );
                                $('#mintId'+nftData.id).text('Mint');
                                $("#mintId"+nftData.id).prop("disabled", false);                                
                            }
                        }).catch(err => {
                            // toast.error(err.response.data?.msg,
                            // );
                            $('#mintId'+nftData.id).text('Mint');
                            $("#mintId"+nftData.id).prop("disabled", false);                             
                        })

                },
                {
                    label: 'No',
                }
            ]
        });
    }

    async createNftAPI(nftData) {

        var localFile = nftData.local_image;
        var fileType = localFile.split('.').pop();
        fileType = fileType.toUpperCase();
        console.log(fileType);
        if (fileType == 'JPEG' || fileType == 'GIF' || fileType == 'PNG' || fileType == 'JPG') {
            var filetype = 'image'
        } else {
            var filetype = 'video'
        }

        let formData = new FormData();
        formData.append('nft_id', nftData.id);
        formData.append('name', nftData.name);
        formData.append('description', nftData.description);
        formData.append('user_collection_id', nftData.user_collection_id);
        formData.append('image', nftData.ipfsHash);
        formData.append('file_type', 'image');
        formData.append('user_id', this.loginData.data?.id);
        formData.append('email', this.loginData.data?.user_email);
        formData.append('filetype', filetype);

        axios.post(`${config.apiUrl}bulkNftMint`, formData)
            .then(result => {

                $('#mintId'+nftData.id).text('Mint');
                $("#mintId"+nftData.id).prop("disabled", false); 

                if (result.data.success === true) {
                    toast.success(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'white',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    toast.error(result.data.msg, {
                        style: {
                            border: '1px solid #713200',
                            padding: '20px',
                            color: 'red',
                        },
                        iconTheme: {
                            primary: 'purple',
                            secondary: '#FFFAEE',
                        },
                    });
                }
            }).catch(err => {
                toast.error(err.response.data?.msg,

                );
                this.setState({
                    spinLoader: '0'
                })
            })

    }




    render() {

        return (


            <>

                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                <ToastContainer />
                <div className="wrapper theme-6-active pimary-color-green">

                    <Header />

                    <Leftsidebar />

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

                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="right-sidebar-backdrop"></div>

                    <div className="page-wrapper nft-user">
                        <div className="container-fluid pt-25">
                            <div className="row heading-bg">
                                <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                                    <h5 className="txt-dark">add-products</h5>
                                </div>

                            </div>

                            <div className="row">

                                <div className="col-sm-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">

                                                <button type='button' data-toggle="modal" data-target="#responsive-modal1" className="btn btn-primary pb-4">Add Bulk NFTs </button>
                                                <br />
                                                <br />

                                                <div className="form-wrap">
                                                    <div class="table-responsive">

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


                            <div id="responsive-modal1" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">

                                        <div class="modal-body">
                                            <div className="form-wrap">
                                                <form action="#">
                                                    <h6 className="txt-dark capitalize-font"><i className="zmdi zmdi-info-outline mr-10"></i>Add Product</h6>
                                                    <hr className="light-grey-hr" />
                                                    <div className="row">

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Zip of NFT's</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.zipfileSelect} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Excel (Metadata)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.excelfileSelect} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">
                                                                    <select name="item_category_id" onChange={this.handleChange1} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">SALE</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="sell_type" onChange={this.handleChange1} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Fixed Price</option>
                                                                        <option value="2">Not on Sale</option>


                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Price</label>
                                                                <input type="text" onChange={this.handleChange1} name="price" className="form-control" placeholder="Price" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Royalties</label>
                                                                <input type="text" onChange={this.handleChange1} name="royalty_percent" className="form-control" placeholder="Royalty Percent" />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Project Launch</label>
                                                                <div className="customSelectHolder">
                                                                    <select class="form-control  basic" name="project_launch" onChange={this.handleChange1} >

                                                                        <option selected="selected" value="">Select Options</option>

                                                                        <option value="1">Yes</option>
                                                                        <option value="2">No</option>


                                                                    </select>

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Add Collection</label>
                                                                <div className="customSelectHolder">

                                                                    <select onChange={this.handleChange1} className="form-control" name="user_collection_id">
                                                                        <option value="">Select Collection</option>
                                                                        {this.state.item_list1.map((item) => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div class="col-md-6"><h6>Starting date</h6>
                                                            <input type="date" name="starting_date" id="starting_date" onChange={this.handleChange1} class="form-control" min="2021-11-19" />
                                                            <span class="error-asterick">
                                                            </span>
                                                        </div>

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
                                                <button type='submit' onClick={this.addBulkSellAPI} className="btn btn-primary">Add </button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                            }

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
                                                                <input type="text" onChange={this.itemDetail} name="name" className="form-control" placeholder="Item Name" value={this.state.getItemData?.name} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Description</label>
                                                                <input type="text" onChange={this.itemDetail} name="description" className="form-control" placeholder="Description" value={this.state.getItemData?.description} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Zip of NFT's</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Excel (Metadata)</label>
                                                                <input type="file" accept=".jpg,.jpeg,.png,.gif,.mp3,.mp4" onChange={this.handleImagePreview} className="form-control" placeholder="Image File" />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">

                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Select Category</label>
                                                                <div className="customSelectHolder">

                                                                    <select name="item_category_id" onChange={this.itemDetail} value={this.state.getItemData?.item_category_id} class="form-control  basic">
                                                                        <option selected="selected" value="">Select Category</option>
                                                                        {this.state.category_list.map(item => (
                                                                            <option value={item.id}>{item.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Fixed price (in USD)</label>
                                                                <input type="text" onChange={this.itemDetail} name="price" className="form-control" placeholder="Price" value={this.state.getItemData?.price} />
                                                            </div>
                                                        </div>






                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Expiry Date</label>
                                                                <input type="date" onChange={this.itemDetail} className="form-control" name="expiry_date" value={this.state.getItemData?.expiry_date} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label className="control-label mb-10">Quantity</label>
                                                                <input type="text" onChange={this.itemDetail}
                                                                    disabled={this.state.getItemData?.edition_type === '2'}
                                                                    name="quantity" className="form-control" placeholder="" value={this.state.getItemData?.quantity} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <label className="control-label mb-10">
                                                                <input className="input-checkbox100" id="ckb1" type="checkbox" name="end_start_date" onChange={this.itemDetail} /> &nbsp;

                                                                click here to create Upcoming NFTs </label>

                                                        </div>
                                                        {(this.state.dateShow === 1) ?
                                                            <>
                                                                <div className="col-md-6">
                                                                    <div className="form-group">
                                                                        <label className="control-label mb-10">Start Date</label>
                                                                        <input type="date" onChange={this.itemDetail} className="form-control" name="start_date" value={this.state.getItemData?.start_date} />
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : ''}


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
                                                <button type='submit' onClick={this.updateItemData} className="btn btn-primary">Update</button>
                                                :
                                                <button type='submit' disabled className="btn btn-primary">Loading... </button>


                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>




                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="exampleModalLongTitle">Item Bid Details</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-25px' }}>
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

                                                    {this.state.bid_list.length === 0 ?
                                                        <tr >
                                                            <td colspan="6" className="text-center"><p>No data found!!</p></td></tr> :
                                                        this.state.bid_list.map(item => (
                                                            <tr>

                                                                <td>{item.user_name}</td>
                                                                <td >
                                                                    {item.profile_pic === null || item.profile_pic === '' || item.profile_pic === undefined
                                                                        ?
                                                                        <img src='images/noimage.png' className="product-img" />

                                                                        :
                                                                        <img src={`${config.imageUrl1}${item.profile_pic}`} className="product-img" />}

                                                                </td>
                                                                <td>{item.item_name}</td>
                                                                <td>{item.bid_price}</td>
                                                                <td><button type='submit' onClick={this.BidAcceptAPI.bind(this, item)} className="btn btn-primary">Accept</button>
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


                        </div>
                        <Footer />

                    </div>

                </div>
            </>


        )

    }
}