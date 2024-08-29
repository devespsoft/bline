; const CryptoJS = require("crypto-js");
var fetch = require('node-fetch');
const config = require('../config');
var validator = require("email-validator");
var ipfsCompress = require('./ipfsCompress/imagecompress');
var pgpEncryption = require('./pgpEncription/pgpEncryption');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const axios = require('axios');
var nodemailer = require('nodemailer')
const key = require('../mail_key.json');
var speakeasy = require('speakeasy');
/* stripe includes*/
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();
const stripe = require("stripe")(`${config.stripe_key}`);
const bodyParser = require("body-parser");
const cors = require("cors");
var FormData = require('form-data');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const { base64encode, base64decode } = require('nodejs-base64');
var reverse = require('reverse-string');
/*-------------------*/

const marketplaceQueries = require("../services/marketplaceQueries");
const adminQueries = require("../services/adminQueries");
const { json } = require("body-parser");
const { compileFunction } = require("vm");

const mysql = require('mysql2');
const { JWT_SECRET_KEY } = require("../config");
const { end } = require("../utils/connection");
// create the pool
const pool = mysql.createPool({ host: config.mysqlHost, user: config.user, password: config.password, database: config.database, port: config.mysqlPort });
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();
// query database using promises
var emailActivity = require('./emailActivity');
const { start } = require("repl");
var AdmZip = require('adm-zip');
const reader = require('xlsx')

exports.insertUserCollection = async (db, req, res) => {
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;
    var name = req.body.name;
    var description = req.body.description;
    var user_id = req.body.user_id;
    var website = req.body.website;
    var games_category = req.body.games_category;

    // if(!games_category){
    //     res.status(400).send({
    //         success: false,
    //         msg: "Games category required!"
    //     });        
    // }

    var dataArr = {
        "user_id": user_id,
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "banner": banner,
        "website": website,
        "facebook": req.body.facebook,
        "insta": req.body.insta,
        "telegram": req.body.telegram,
        "twitter": req.body.twitter,
        "discord": req.body.discord,
        "games_category" : games_category
    }
    await db.query(marketplaceQueries.insertUserCollection, [dataArr], function (error, data) {
        if (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection created successfully!"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!"
            });
        }
    });
}

exports.updateUserCollection = async (db, req, res) => {
    var profile_pic = (!req.files['profile_pic']) ? null : req.files['profile_pic'][0].filename;
    var banner = (!req.files['banner']) ? null : req.files['banner'][0].filename;
    var old_profile_pic = req.body.old_profile_pic;
    var old_banner = req.body.old_banner;
    var collection_id = req.body.collection_id;
    var name = req.body.name;
    var description = req.body.description;
    var website = req.body.website;

    if (!profile_pic) {
        profile_pic = old_profile_pic
    }

    if (!banner) {
        banner = old_banner
    }

    var dataArr = {
        "name": name,
        "description": description,
        "profile_pic": profile_pic,
        "banner": banner,
        "website": website,
        "facebook": req.body.facebook,
        "insta": req.body.insta,
        "telegram": req.body.telegram,
        "twitter": req.body.twitter,
        "discord": req.body.discord,
        "games_category": req.body.games_category
    }
    console.log(dataArr);
    await db.query(marketplaceQueries.updateUserCollection, [dataArr, collection_id], function (error, data) {
        if (error) {
            console.log(error);
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Collection Details Updated Successfully!"
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!"
            });
        }
    });
}

exports.deleteUserCollection = async (db, req, res) => {
    console.log("in deleteUserCollection");
    var collection_id = req.body.collection_id;
    var email = req.body.email;
    var user_id = req.body.user_id;


    await db.query(marketplaceQueries.getCollectionItemCount, [collection_id], async function (error, cnt) {
        if (cnt[0].itemCount > 0) {
            return res.status(400).send({
                success: false,
                msg: "You can't delete collection if any NFT exists in it !!"
            });
        }
        await db.query(marketplaceQueries.deleteUserCollection, [collection_id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data) {
                res.status(200).send({
                    success: true,
                    msg: "User Collection Deleted!!",

                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Something Wrong due to internal Error"
                });
            }
        });
    });
}


exports.getSingleUserCollection = async (db, req, res) => {
    console.log("in getSingleUserCollection");
    var user_id = req.body.user_id;
    var email = req.body.email;
    var collection_id = req.body.collection_id;
    if (!collection_id) {
        return res.status(400).send({
            success: false,
            msg: "collection_id required!!"
        });
    }
    await db.query(marketplaceQueries.getSingleUserCollection, [collection_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getUserCollection = async (db, req, res) => {
    console.log("in getUserCollection");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getUserCollection, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!"
            });
        }
    });
}

exports.getCollection = async (db, req, res) => {
    await db.query(marketplaceQueries.getPublicCollection, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Collection Details",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!"
            });
        }
    });
}

exports.getSallerAddress = async (db, req, res) => {
    console.log("getSallerAddress ");
    const item_id = req.query.item_id
    await db.query(`select u.address,u.full_name,u.id,i.owner_id,i.id as item_id from users as u left join item as i on i.id=${item_id} where u.id=i.owner_id`, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getGamesCategory = async (db, req, res) => {
    await db.query(`SELECT * FROM games_category`, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Games Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}
// ==================================================================================================================================
exports.addNftByUser = async (db, req, res) => {
    let user_id = req.body.user_id;
    let name = req.body.name;
    let description = req.body.description;
    let image = req.body.image;
    let file_type = req.body.file_type;
    let item_category_id = req.body.item_category_id;
    let item_subcategory_id = req.body.item_subcategory_id;
    let price = req.body.price;
    let sell_type = req.body.sell_type;
    let user_collection_id = req.body.user_collection_id;
    let start_date = req.body.start_date;
    let expiry_date = req.body.expiry_date;
    let image_low = req.body.image;
    let transaction_id = req.body.transaction_id;
    let to_address = req.body.to_address;
    let royalty_percent = req.body.royalty_percent;
    let blockchainType = req.body.blockchainType;
    let hash = req.body.hash;
    let tokenId = req.body.tokenId;
    let metadata = req.body.metadata;
    try {
        if (!name) {
            return res.status(400).send({
                success: false,
                msg: "name required!! "
            });
        }
        if (!image) {
            return res.status(400).send({
                success: false,
                msg: "image required!! "
            });
        }
        if (!file_type) {
            return res.status(400).send({
                success: false,
                msg: "file_type required!! "
            });
        }
        if (!description) {
            return res.status(400).send({
                success: false,
                msg: "description required!! "
            });
        }

        if (!tokenId || tokenId == 0) {
            return res.status(400).send({
                success: false,
                msg: "Something went wrong please try again!! "
            });
        }

        if (!hash || hash == 0) {
            return res.status(400).send({
                success: false,
                msg: "Something went wrong please try again!! "
            });
        }

        if (!sell_type) {
            return res.status(400).send({
                success: false,
                msg: "Sell type required!! "
            });
        }
        if (sell_type != 3) {
            if (!price || price === '0') {
                return res.status(400).send({
                    success: false,
                    msg: "Price required!! "
                });
            }
        }

        if (sell_type === '2') {
            if (start_date.length === 0) {
                return res.status(400).send({
                    success: false,
                    msg: "Start date required!! "
                });
            }

            if (expiry_date.length === 0) {
                return res.status(400).send({
                    success: false,
                    msg: "Expiry date required!! "
                });
            }
        }
        if (sell_type == 3) {
            var is_on_sale = '0'
            sell_type = '1';
            price = '0';
            start_date = null;
            expiry_date = null;
        } else {
            var is_on_sale = '0';
        }
        console.log('12')

        var nftData = {
            "name": name,
            "description": description,
            "image": image_low,
            "image_original": image,
            "file_type": file_type,
            "item_category_id": item_category_id,
            "user_collection_id": user_collection_id,
            "start_date": start_date,
            "price": price,
            "owner_id": user_id,
            "created_by": user_id,
            "sell_type": sell_type,
            "is_on_sale": is_on_sale,
            "expiry_date": expiry_date,
            "is_sold": 0,
            "metadata" : metadata,
            'token_id': tokenId,
            'token_hash': hash,
            'blockchainType': blockchainType,
            "transaction_id": transaction_id,
            "royalty_percent": royalty_percent,
            "item_subcategory_id":item_subcategory_id
        }
        await db.query(marketplaceQueries.insertItem, [nftData], async function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in item insert",
                    error
                });
            }
            return res.status(200).send({
                success: true,
                msg: "NFT created successfully!!"
            });
        })


    } catch (e) {
        return res.status(400).send({
            success: false,
            msg: e
        });
    }
}
            
    



// =====================================================================================================================================



function closeNFT(code) {
    try {
        var encoded = base64encode(code);
        for (let i = 0; i < 5; i++) {
            encoded = base64encode(reverse(encoded));
        }
        encoded = Buffer.from(encoded);
        let json = JSON.stringify(encoded);
        var data = base64encode(json);
        return {
            data: reverse(data)
        }
    } catch (e) {
        return {
            data: ''
        }
    }
}

function openNFT(code) {
    try {
        var json = base64decode(reverse(code));
        let bufferOriginal = Buffer.from(JSON.parse(json).data);
        var decode = base64decode(bufferOriginal.toString('utf8'));
        for (let i = 0; i < 5; i++) {
            decode = base64decode(reverse(decode));
        }
        return decode

    } catch (e) {
        return e
    }
}

exports.test = async (db, req, res) => {
    console.log("in test");
    var apiData = await openNFT(config.apiKey);

    res.send(apiData);
}

exports.testmail = async (id, name) => {

    emailActivity.Activity('amit.espsofttech@gmail.com', 'test mail', 'test mail', 'fdsfsdf', 'fdsfsdfdsf');
}


exports.walletDeposit = async (db, req, res) => {
    console.log("in walletDeposit");
    var user_id = req.body.user_id;
    var amount = req.body.amount;
    var from_address = req.body.from_address;
    var to_address = req.body.to_address;
    var hash = req.body.hash;
    var datetime = new Date();

    if (!user_id) {
        res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }
    if (!amount) {
        res.status(400).send({
            success: false,
            msg: "amount required!!"
        });
    }


    await db.query(marketplaceQueries.adminWallet, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        await db.query(marketplaceQueries.userWallet, [user_id], async function (error, data1) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            var transaction = {
                user_id: user_id,
                transaction_type_id: "11",
                from_address: from_address,//Admin From Address
                to_address: to_address, // User To Address
                hash: hash,
                amount: amount,
                status: 0,
                datetime: datetime,
                currency: "ADA"
            }

            await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured",
                        error
                    });
                }

                if (data1) {
                    res.status(200).send({
                        success: true,
                        msg: "Deposit Succesfull",
                        transaction_id: data1.insertId

                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Error"
                    });
                }
            });
        });
    });
}


exports.walletWithdraw = async (db, req, res) => {
    console.log("in userWithdraw");
    var user_id = req.body.user_id;
    var amount = req.body.amount;
    var address = req.body.address;
    var datetime = new Date();

    if (!user_id) {
        res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }
    if (!amount) {
        res.status(400).send({
            success: false,
            msg: "amount required!!"
        });
    }
    if (!address) {
        res.status(400).send({
            success: false,
            msg: "address required!!"
        });
    }

    await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        if (walletData[0].balance <= amount) {
            return res.status(400).send({
                success: false,
                msg: "You don't have sufficient balance to withdraw!!",
                error
            });
        }

        var wallet_password = walletData[0].wallet_password
        var apiData = await openNFT(wallet_password);
        var postPara = JSON.stringify({
            "wallet_name": walletData[0].wallet_name,
            "wallet_password": apiData,
            "amount": amount,
            "receiverAddress": address
        })
        console.log("Post Param", postPara);
        var adaTransfer = await fetch(`${config.cardanoAPI}transfer`, {
            method: 'POST', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: postPara
        });
        const adaTransferRes = await adaTransfer.json();
        console.log(adaTransferRes);
        if (adaTransferRes.code == 200 && adaTransfer.status == true) {
            var transaction = {
                user_id: user_id,
                transaction_type_id: "3",
                from_address: walletData[0].public,//Admin From Address
                to_address: address, // User To Address
                hash: adaTransferRes.txHash,
                amount: amount * -1,
                status: 1,
                datetime: datetime,
                currency: "ADA"
            }

            await db.query(marketplaceQueries.insertTransaction, transaction)
            res.status(200).send({
                success: true,
                msg: "Withdraw Succesfully!!"
            });
        } else if (adaTransferRes.code == 400) {
            return res.status(400).send({
                success: false,
                msg: "You don't have sufficient balance, Please try again!",
                error
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error!!",
                error
            });
        }
    });
}

exports.getWalletDetail = async (db, req, res) => {
    console.log("in getWalletDetail");
    var user_id = req.body.user_id
    const response1 = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ADAUSDT', {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data1 = await response1.json();

    await db.query(marketplaceQueries.getWalletDetail, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User's wallet detail!!",
                user_id: user_id,
                balance: data[0].balance,
                usd_balance: (data[0].balance * data1['price']).toFixed(6),
                public: data[0].public,
                private: ''
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error!!"
            });
        }
    });
}


exports.withdrawDepositList = async (db, req, res) => {
    console.log("in withdrawDepositList");
    var user_id = req.body.user_id
    const response1 = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ADAUSDT', {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const data1 = await response1.json();

    await db.query(marketplaceQueries.withdrawDepositList, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User's wallet detail!!",
                data: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Data not found!!"
            });
        }
    });
}


exports.transactionDetail = async (db, req, res) => {
    console.log("in transactionDetail");
    var transaction_id = req.body.transaction_id

    await db.query(marketplaceQueries.getTransactionDetail, [transaction_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Transactions Detail",
                response: data[0]
            });
        } else {
            await db.query(marketplaceQueries.getTransactionDetail1, [transaction_id], function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }

                res.status(200).send({
                    success: true,
                    msg: "Transactions Detail",
                    response: data1[0]
                });
            });

        }
    });
}


exports.addNftByUser_testnet = async (db, req, res) => {
    console.log("in addNftByUser");
    var user_id = req.body.user_id;
    var name = req.body.name;
    var description = req.body.description;
    var image = req.body.image;
    var file_type = req.body.file_type;
    var item_category_id = req.body.item_category_id;
    var price = req.body.price;
    var sell_type = req.body.sell_type;
    var user_collection_id = req.body.user_collection_id;
    var start_date = req.body.start_date;
    var expiry_date = req.body.expiry_date;
    var image_low = req.body.image;
    var royalty_percent = req.body.royalty_percent;
    var transaction_id = req.body.transaction_id;

    var recCompress = await ipfsCompress.compressImages(["https://ipfs.io/ipfs/" + image], file_type);
    console.log(recCompress.images[0]);
    if (recCompress.success == false) {
        console.log("compress false");
        var image_low = image;
    } else {
        console.log("compressed")
        var image_low = recCompress.imageHash[0];
    }

    if (!name) {
        return res.status(400).send({
            success: false,
            msg: "name required!! "
        });
    }
    if (!image) {
        return res.status(400).send({
            success: false,
            msg: "image required!! "
        });
    }
    if (!file_type) {
        return res.status(400).send({
            success: false,
            msg: "file_type required!! "
        });
    }
    if (!description) {
        return res.status(400).send({
            success: false,
            msg: "description required!! "
        });
    }
    if (!sell_type) {
        return res.status(400).send({
            success: false,
            msg: "Sell type required!! "
        });
    }
    if (sell_type != 3) {
        if (!price || price === '0') {
            return res.status(400).send({
                success: false,
                msg: "Price required!! "
            });
        }
    }

    if (sell_type === '2') {
        if (start_date.length === 0) {
            return res.status(400).send({
                success: false,
                msg: "Start date required!! "
            });
        }

        if (expiry_date.length === 0) {
            return res.status(400).send({
                success: false,
                msg: "Expiry date required!! "
            });
        }
    }
    if (sell_type == 3) {
        var is_on_sale = '0'
        sell_type = '1';
        price = '0';
        start_date = null;
        expiry_date = null;
    } else {
        var is_on_sale = '1';
    }

    var users = {
        "name": name,
        "description": description,
        "image": image_low,
        "image_original": image,
        "file_type": file_type,
        "item_category_id": item_category_id,
        "user_collection_id": user_collection_id,
        "start_date": start_date,
        "price": price,
        "owner_id": user_id,
        "created_by": user_id,
        "sell_type": sell_type,
        "is_on_sale": is_on_sale,
        "expiry_date": expiry_date,
        "local_image": recCompress.images[0],
        "transaction_id": transaction_id,
        "royalty_percent": royalty_percent,
        "policy_id": '',
        "asset_id": '',
        "txHash": ''
    }
    console.log(users);
    await db.query(marketplaceQueries.insertItem, [users], async function (error, data) {
        if (error) {

            return res.status(400).send({
                success: false,
                msg: "error occured in item insert",
                error
            });
        }
        var transactionData = {
            "item_id": data.insertId
        }
        db.query(marketplaceQueries.updateTransaction, [transactionData, transaction_id]);

        await db.query(marketplaceQueries.getSettings, async function (error, settingData) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }

            var transaction = {
                user_id: user_id,
                transaction_type_id: 14,
                item_id: data.insertId,
                amount: settingData[0].single_nft_fee * -1,
                status: 1,
                currency: "ADA"
            }

            await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data1) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured",
                        error
                    });
                }
            });
        });
        /**---------------------------IPFS Json ---------------------------------- */
        var additem = {
            "name": name,
            "description": description,
            "image": 'https://nxft.mypinata.cloud/ipfs/' + image
        }
        var userfile = 'item_'.concat(data.insertId, '.json');
        try {
            fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {
                if (err) throw err;
                const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                let formdata = new FormData();
                console.log("Done writing"); // Success
                formdata.append('file', fs.createReadStream('./metadata/' + userfile))
                const response2 = await fetch(url, {
                    method: 'POST', headers: {
                        // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
                        'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
                        'pinata_api_key': 'b26a087893e3f0033bbf',
                        'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                    },
                    body: formdata
                });
                const filedata = await response2.json();

                db.query(marketplaceQueries.updatemeta, [filedata.IpfsHash, data.insertId], (error, data235) => {

                })

                /* ---------------------------------------------------------- */
                /// SEND MAIL STARTS
                qry = `select * from users where id =${user_id}`;

                await db.query(qry, async function (error, mailData) {
                    emailActivity.Activity(mailData[0].email, 'NFT Created', `You have created NFT (${name}) for $${price}.`, `nftDetails/data.insertId`, `https://ipfs.io/ipfs/${image}`);

                });
                /// SEND MAIL ENDS    
                res.status(200).send({
                    success: true,
                    msg: "NFT created successfully!!",
                    item_id: data.insertId
                });

            });


        } catch (e) {
            return res.status(200).send({
                success: false,
                e
            });
        }
    })


}


exports.updateNftByUser = async (db, req, res) => {
    console.log("in updateNftByUser");
    var id = req.body.id;
    var price = req.body.price;
    var sell_type = req.body.sell_type;
    var start_date = req.body.start_date;
    var expiry_date = req.body.expiry_date;

    var itemDetails = {
        sell_type: sell_type,
        price: price,
        start_date: start_date,
        expiry_date: expiry_date
    }
    console.log(itemDetails);
    await db.query(marketplaceQueries.updateItem, [itemDetails, id], async function (error, data) {
        if (error) {

            return res.status(400).send({
                success: false,
                msg: "error occured in item insert",
                error
            });
        }

        try {

            res.status(200).send({
                success: true,
                msg: "NFT Details Updated!",
                item_id: data.insertId
            });
        } catch (e) {
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!",
                e
            });
        }

    })
}

exports.bulkNftMint = async (db, req, res) => {
    console.log("in bulkNftMint");
    var user_id = req.body.user_id;
    var nft_id = req.body.nft_id;
    var image = req.body.image;
    var file_type = req.body.file_type;
    var name = req.body.name;
    var description = req.body.description;
    var user_collection_id = req.body.user_collection_id;
    var filetype = req.body.filetype;

    var syncPolicy = await fetch(`${config.cardanoAPI}get-node-status`, {
        method: 'GET', headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const syncPolicyRes = await syncPolicy.json();

    if (syncPolicyRes.code == 200) {
        if (syncPolicyRes.response.syncProgress == 100) {

        } else {
            return res.status(400).send({
                success: false,
                msg: "Please wait while syncing is in progress!!"
            });
        }
    }

    await db.query(marketplaceQueries.getSingleCollectionDetails, [user_collection_id], async function (error, userCollections) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Something want wrong, Please try again!"
            });
        }

        if (!userCollections[0].policy_id) {
            return res.status(400).send({
                success: false,
                msg: "Policy id not valid!!"
            });
        } else {
            await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Something want wrong, Please try again!",
                        error
                    });
                }
                if (walletData.length > 0) {
                    var wallet_password = walletData[0].wallet_password
                    var apiData = await openNFT(wallet_password);
                    var postPara = JSON.stringify({
                        "wallet_name": walletData[0].wallet_name,
                        "wallet_password": apiData,
                        "asset_name": name,
                        "asset_description": description,
                        "asset_image_url": "ipfs://" + image,
                        "asset_metadata_url": "ipfs://" + image,
                        "author_name": walletData[0].user_name,
                        'policy_id': userCollections[0].policy_id
                    })
                    console.log("Post Param", postPara);
                    var createWallet = await fetch(`${config.cardanoAPI}mint`, {
                        method: 'POST', headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: postPara
                    });
                    const mintRes = await createWallet.json();
                    console.log(mintRes);
                    if (mintRes.code == 200 && mintRes.status == true) {
                        var nftData = {
                            "name": name,
                            "description": description,
                            "image": image,
                            "image_original": image,
                            "file_type": file_type,
                            "policy_id": mintRes.policy_id,
                            "asset_id": mintRes.asset_id,
                            "txHash": mintRes.txHash,
                            "file_type": filetype,
                            "is_minted": '1'
                        }
                        // console.log(nftData);
                        await db.query(marketplaceQueries.putOnSale1, [nftData, nft_id], async function (error, data) {
                            if (error) {

                                return res.status(400).send({
                                    success: false,
                                    msg: "error occured in item insert",
                                    error
                                });
                            }

                            await db.query(marketplaceQueries.getSettings, async function (error, settingData) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "error occured",
                                        error
                                    });
                                }

                                var transaction = {
                                    user_id: user_id,
                                    transaction_type_id: 14,
                                    item_id: nft_id,
                                    amount: settingData[0].single_nft_fee * -1,
                                    status: 1,
                                    currency: "ADA"
                                }

                                await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data1) {
                                    if (error) {
                                        return res.status(400).send({
                                            success: false,
                                            msg: "error occured",
                                            error
                                        });
                                    }
                                });
                            });
                            /**---------------------------IPFS Json ---------------------------------- */
                            var additem = {
                                "name": name,
                                "description": description,
                                "image": 'https://nxft.mypinata.cloud/ipfs/' + image
                            }
                            var userfile = 'item_'.concat(data.insertId, '.json');
                            try {
                                fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {
                                    if (err) throw err;
                                    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
                                    let formdata = new FormData();
                                    console.log("Done writing"); // Success
                                    formdata.append('file', fs.createReadStream('./metadata/' + userfile))
                                    const response2 = await fetch(url, {
                                        method: 'POST', headers: {
                                            // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
                                            'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
                                            'pinata_api_key': 'b26a087893e3f0033bbf',
                                            'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
                                        },
                                        body: formdata
                                    });
                                    const filedata = await response2.json();

                                    db.query(marketplaceQueries.updatemeta, [filedata.IpfsHash, data.insertId], (error, data235) => {

                                    })

                                    /* ---------------------------------------------------------- */
                                    /// SEND MAIL STARTS
                                    qry = `select * from users where id =${user_id}`;

                                    await db.query(qry, async function (error, mailData) {
                                        emailActivity.Activity(mailData[0].email, 'NFT Created', `You have created NFT (${name}) for $${price}.`, `featurescreator/${user_id}`, `https://ipfs.io/ipfs/${image}`);

                                    });
                                    /// SEND MAIL ENDS    
                                    res.status(200).send({
                                        success: true,
                                        msg: "NFT created successfully!!",
                                        item_id: data.insertId
                                    });

                                });

                            } catch (e) {
                                return res.status(200).send({
                                    success: false,
                                    e
                                });
                            }
                        })
                    } else if (mintRes.code == 400) {
                        return res.status(400).send({
                            success: false,
                            msg: "You don't have sufficient balance, Please try again!"
                        });
                    } else {
                        return res.status(400).send({
                            success: false,
                            msg: "NFT creation faild, Please try again!"
                        });
                    }
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "NFT creation faild, Please try again!"
                    });
                }
            });
        }

    })
}

exports.getLocalImageHash = async (db, req, res) => {
    console.log("in getLocalImageHash");
    var localImage = req.body.localImage
    console.log(localImage);

    // return res.status(200).send({
    //     success: true, 
    //     msg: "Data get successfully!!",
    //     response: "Qmd4VdHiTrCn1dvYyC12ZB793khKgpovZ31VXcydNUYP3m"
    // });

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let formdata = new FormData();
    formdata.append('file', fs.createReadStream(localImage))
    const response2 = await fetch(url, {
        method: 'POST', headers: {
            // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
            'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
            'pinata_api_key': 'b26a087893e3f0033bbf',
            'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
        },
        body: formdata
    });
    const filedata = await response2.json();
    if (filedata.IpfsHash) {
        return res.status(200).send({
            success: true,
            msg: "Data get successfully!!",
            response: filedata.IpfsHash
        });
    } else {
        return res.status(400).send({
            success: false,
            msg: "Error occured!!"
        });
    }
}

exports.getBulkSellList = async (db, req, res) => {
    console.log("in bulk sell list");
    var user_id = req.body.user_id;

    await db.query(marketplaceQueries.getBulkSellList, [user_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Data get successfully!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.addBulkNftByUser = async (db, req, res) => {
    console.log("in addBulkNftByUser");
    var folderName = Math.random().toString(36).slice(2);
    var form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {

        var zip_file_upload = (!files.zip_file) ? null : (!files.zip_file.name) ? null : files.zip_file;
        if (!zip_file_upload) {
            return res.status(400).send({
                success: false,
                msg: "Please select zip file!! "
            });
        } else {
            var dir = './uploads/' + folderName
            fs.mkdirSync(dir);
            var oldpath = files.zip_file.path;
            var filePath = dir + '/'
            let newfilename = filePath + files.zip_file.name
            await fs.readFile(oldpath, async function (err, data) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: "Please select zip file!! "
                    });
                }
                await fs.writeFile(newfilename, data, function (err) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            msg: "Please select zip file!! "
                        });
                    }
                    var zip = new AdmZip(newfilename);
                    zip.extractAllTo(filePath);
                });
            });
        }


        var excel_file_upload = (!files.excel_file) ? null : (!files.excel_file.name) ? null : files.excel_file;
        if (!excel_file_upload) {
            return res.status(400).send({
                success: false,
                msg: "Please select excel file!! "
            });
        } else {
            var dir = './uploads/' + folderName
            var oldpath = files.excel_file.path;
            var filePath = dir + '/'
            let newExlFilename = filePath + files.excel_file.name
            await fs.readFile(oldpath, async function (err, data) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: "Something want wrong, Please try again!"
                    });
                }
                await fs.writeFile(newExlFilename, data, function (err) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            msg: "Something want wrong, Please try again!"
                        });
                    } else {
                        var excel_file = files.excel_file.name
                        if (excel_file) {
                            var filepath = path.join('uploads/' + folderName + '/', excel_file);
                            const file = reader.readFile(filepath)
                            const sheets = file.SheetNames
                            db.query(marketplaceQueries.getSingleCollectionDetails, [fields.user_collection_id], async function (error, userCollections) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "Something want wrong, Please try again!"
                                    });
                                }

                                var totalNftCount = userCollections[0].totalNft + sheets.length
                                if (userCollections[0].max_nft_supply < totalNftCount) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "Collection limit exceeded!!"
                                    });
                                } else {
                                    const temp1 = reader.utils.sheet_to_json(
                                        file.Sheets[file.SheetNames[0]])

                                    if (temp1.length == '0') {
                                        return res.status(400).send({
                                            success: false,
                                            msg: "No data found in excel file!!"
                                        });
                                    } else {

                                        var title = Object.keys(temp1[0])[0]
                                        if (title != 'Title') {
                                            return res.status(400).send({
                                                success: false,
                                                msg: "Excel File not valid Please select valid file!!"
                                            });
                                        }

                                        var createFolderData = {
                                            'folder_name': folderName
                                        }
                                        db.query(marketplaceQueries.createFolder, [createFolderData], async function (error, createFolderRes) {
                                            var p = 0;
                                            for (let i = 0; i < sheets.length; i++) {
                                                const temp = reader.utils.sheet_to_json(
                                                    file.Sheets[file.SheetNames[i]])
                                                temp.forEach((resExl) => {
                                                    var singleData = {
                                                        'bulk_nft_master_id': createFolderRes.insertId,
                                                        'owner_id': fields.user_id,
                                                        'created_by': fields.user_id,
                                                        'name': resExl.Title,
                                                        'description': resExl.Description,
                                                        'local_image': resExl.Image,
                                                        'royalty_percent': fields.royaltie,
                                                        'price': fields.price,
                                                        'start_date': fields.starting_date,
                                                        'expiry_date': null,
                                                        'is_on_sale': fields.project_launch,
                                                        'item_category_id': fields.item_category_id,
                                                        'user_collection_id': fields.user_collection_id,
                                                        'sell_type': fields.sell_type,
                                                        'is_minted': '0'
                                                    }

                                                    db.query(marketplaceQueries.insertItem, [singleData], async function (error, data) {
                                                        if (error) {
                                                            return res.status(400).send({
                                                                success: false,
                                                                msg: "Something want wrong, Please try again!!"
                                                            });
                                                        } else {

                                                            var t = 1;
                                                            for (var s = 3; s < 1500; s++) {
                                                                var attr = Object.keys(resExl)
                                                                if (attr[s] != 'attributes_name_' + t) {
                                                                    break
                                                                }
                                                                var key1 = attr[s]
                                                                s = s + 1

                                                                if (attr[s] != 'attributes_value_' + t) {
                                                                    break
                                                                }

                                                                var value = attr[s]
                                                                attrArr = {
                                                                    'item_id': data.insertId,
                                                                    'type': resExl[key1],
                                                                    'value': resExl[value]
                                                                }

                                                                db.query(marketplaceQueries.insertItemAttr, [attrArr], async function (error, data12) {

                                                                })

                                                                t = t + 1
                                                            }

                                                            if (p == sheets.length) {
                                                                return res.status(200).send({
                                                                    success: true,
                                                                    msg: "NFTs data imported successfully!!"
                                                                });
                                                            }
                                                        }
                                                    })
                                                })
                                                p = p + 1
                                            }
                                        })
                                    }
                                }

                            })
                        } else {
                            return res.status(400).send({
                                success: false,
                                msg: "Please select excel file!! "
                            });
                        }
                    }
                });
            });
        }


    });

}





exports.getCategory = async (db, req, res) => {
    await db.query(marketplaceQueries.category, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Category Item Details",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getUserItem = async (db, req, res) => {
    console.log("in getUserItem");
    var user_id = req.body.user_id;
    var login_user_id = req.body.login_user_id;
    var user_collection_id = req.body.user_collection_id;
    var is_featured = req.body.is_featured;
    var recent = req.body.recent;
    var limit = req.body.limit;
    try {
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,u.full_name as owner,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price,i.is_featured,cl.id as collection_id,cl.name as collection_name,cl.user_id,cl.profile_pic as collection_profile_pic, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') and i.is_active=1 and  i.is_on_sale=1 and i.is_minted = 1 and i.is_featured =${is_featured} `;

        if (user_id > 0) {
            qry = qry + ` and i.owner_id=${user_id} `;
        }

        if (user_collection_id > 0) {
            qry = qry + ` and cl.id=${user_collection_id}`;
        }
        if (recent > 0) {
            qry = qry + ` order by i.datetime desc`
        }
        else {
            qry = qry + ` order by i.datetime desc `;
        }
        if (limit > 0) {
            qry = qry + ` limit ${limit}`;
        }


        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.rankingNFT = async (db, req, res) => {
    console.log("in rankingNFT");
    var category_id = req.body.category_id;
    var login_user_id = 0;
    if (!login_user_id) {
        login_user_id = 0;
    }

    try {
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name,cl.user_id,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') `;

        if (category_id > 0) {
            qry = qry + ` where i.item_category_id=${category_id} order by i.price desc `;
        }

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.marketplace = async (db, req, res) => {
    console.log("in marketplace");
    var login_user_id = req.body.login_user_id;
    var user_id = req.body.user_id;
    var user_collection_id = req.body.user_collection_id;
    var is_trending = req.body.is_trending;
    var recent = req.body.recent;
    var limit = req.body.limit;
    try {
        var qry = `SELECT i.id as item_id, i.token_id ,i.is_featured,i.datetime,i.item_subcategory_id,i.is_trending,i.name,i.is_on_sale,i.blockchainType,i.user_collection_id, i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,case when mod(i.price,1)=0 then round(i.price) else round(i.price,2) end as price ,i.price  as usd_price, u.full_name as owner_name, u.profile_pic as owner_profile_pic , cl.id as collection_id,cl.name as collection_name,cl.user_id ,cl.profile_pic as collection_image, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,coalesce(getCollectionItems(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and i.is_minted = 1 and i.sell_type<>3 and i.is_on_sale<>0  and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') and (i.start_date='0000-00-00 00:00:00' or i.start_date<=now() or i.start_date is null)`;

        if (is_trending == '1') {
            qry = qry + ` and  i.is_trending =1 `;
        }

        if (user_id > 0) {
            qry = qry + ` and i.owner_id=${user_id} `;
        }

        if (user_collection_id > 0) {
            qry = qry + ` and cl.id=${user_collection_id}`;
        }
        if (recent > 0) {
            qry = qry + ` order by i.datetime desc`
        }
        else {
            qry = qry + ` order by i.datetime desc `;
        }
        if (limit > 0) {
            qry = qry + ` limit ${limit}`;
        }

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


exports.portfolio = async (db, req, res) => {
    console.log("in marketplace");
    var user_id = req.body.user_id;
    var login_user_id = req.body.login_user_id;
    var type = req.body.type;
    if (!login_user_id) {
        login_user_id = 0;
    }
    try {
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,case when i.is_on_sale=0 then '' else case when mod(i.price,1)=0 then round(i.price) else round(price,6) end end as price,cl.name as collection_name, cl.id as collection_id,cl.user_id,cl.profile_pic as collection_profile_pic, cl.is_verified,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.is_on_sale=0 then 'Not for sale' else case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,i.is_on_sale  from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join item_like as il on il.item_id=i.id and il.user_id=${login_user_id} left join users as u on u.id=i.owner_id where i.is_minted = 1 and i.is_active=1 `;

        if (type === 1) {
            qry = qry + ` and i.owner_id=${user_id} `;
            var orderby = ` order by i.id desc `;
        }

        if (type === 2) {
            qry = qry + ` and i.created_by=${user_id} `;
            var orderby = ` order by i.id desc `;
        }
        if (type === 3) {
            qry = qry + ` and i.owner_id=${user_id} and i.is_on_sale=1 `;
            var orderby = ` order by i.id desc `;
        }
        if (type === 4) {
            qry = qry + ` and i.id in (select item_id from item_like where user_id=${user_id})`;
            var orderby = ` order by i.id desc `;
        }

        qry = qry + orderby;



        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "User Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}



exports.getAllUserCollection = async (db, req, res) => {
    console.log("in getAllUserCollection");
    var limit = req.body.limit;

    if (limit > 0) {
        limit = `limit ${limit}`;
    }
    else {
        limit = `limit 999999999`;
    }
    var qry = `Select uc.id as collection_id,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name,uc.is_featured,uc.is_hide,uc.description,uc.profile_pic as collection_profile_pic, uc.is_verified,date_format(uc.datetime,'%d-%M-%y')as create_date,getCollectionItems(uc.id) as nft_count,getCollectionOwners(uc.id) as owner_count,getCollectionFloorPrice(uc.id) as floor_price,getCollectionTradeVolume(uc.id) as trade_volume,getCollectionNFTVolume(uc.id) as collection_nft_price from user_collection as uc left join users as u on u.id=uc.user_id where uc.is_hide=0 order by uc.id desc ${limit}`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All user Collection Detail!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.rankingCollection = async (db, req, res) => {
    console.log("in rankingCollection");

    var days = req.body.days;
    var diff = '';
    if (days == 1) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 7 day) `;
    }
    if (days == 2) {
        diff = ` where date(uc.datetime)>=DATE_SUB(CURDATE(),INTERVAL 15 day) `;
    }
    if (days == 3) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 1 month) `;
    }
    if (days == 4) {
        diff = ` where date(uc.datetime)>= DATE_SUB(CURDATE(),INTERVAL 3 month) `;
    }
    if (days == 5) {
        diff = ` where date(uc.datetime)>=  DATE_SUB(CURDATE(),INTERVAL 6 month) `;
    }
    var qry = `Select uc.id as collection_id,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name, uc.description,date_format(uc.datetime,'%d-%M-%y')as create_date,uc.profile_pic as collection_profile_pic, uc.is_verified,getCollectionItems(uc.id) as nft_count,getCollectionOwners(uc.id) as owner_count,getCollectionFloorPrice(uc.id) as floor_price,getCollectionTradeVolume(uc.id) as trade_volume,getCollectionNFTVolume(uc.id) as collection_nft_price from user_collection as uc left join users as u on u.id=uc.user_id  ${diff} order by uc.id desc limit 10`;

    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "All user Collection Detail!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getCollectionById = async (db, req, res) => {
    console.log("in getCollectionById");
    var collection_id = req.body.collection_id;
    var login_user_id = req.body.login_user_id;
    if (!login_user_id) {
        login_user_id = 0;
    }


    var qry = `Select uc.id as collection_id, uc.is_verified,uc.profile_pic as collection_profile_pic,u.id as user_id,u.full_name as user_name,concat('${config.mailUrl}','backend/uploads/', u.profile_pic)  as user_profile_pic,concat('${config.mailUrl}','backend/uploads/', uc.profile_pic) as profile_pic, uc.banner,u.email,uc.name as collection_name,uc.description,date_format(uc.datetime,'%d-%M-%y')as create_date,count(i.id) as nft_count,uc.facebook,uc.insta,uc.telegram,uc.twitter,uc.discord,coalesce(getCollectionItems(uc.id),0)as item_count,coalesce(getCollectionOwners(uc.id),0) as owner_count,coalesce(getCollectionFloorPrice(uc.id),0) as floor_price,coalesce(getCollectionTradeVolume(uc.id),0) as trad_volume from user_collection as uc left join users as u on u.id=uc.user_id left join item as i on i.user_collection_id=uc.id where uc.id =${collection_id} group by uc.id,u.id,u.full_name,user_profile_pic,profile_pic,uc.banner,u.email,uc.name,uc.description,create_date order by uc.id desc`;



    await db.query(qry, async function (error, collectionData) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        var qry = `Select i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,i.price,cl.id as collection_id,cl.name as collection_name,cl.profile_pic as collection_profile_pic,cl.is_verified, cl.user_id,i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.user_collection_id=${collection_id} and i.is_active=1 and i.is_sold=0 and (i.expiry_date is null or i.expiry_date>now() or i.expiry_date='0000-00-00 00:00:00') `;
        console.log(qry)
        await db.query(qry, async function (error, collectionItem) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }

            if (collectionData.length > 0) {
                res.status(200).send({
                    success: true,
                    msg: "All user Collection Detail!!",
                    collectionData: collectionData[0],
                    itemDetail: collectionItem
                });
            } else {
                res.status(400).send({
                    success: false,
                    msg: "Something Wrong due to internal Error"
                });
            }
        });
    });
}



exports.likeItem = async (db, req, res) => {
    console.log("in likeItem");
    //required fields
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }

    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }

    var itemlike = {
        "item_id": item_id,
        "user_id": user_id
    }
    await db.query(marketplaceQueries.getItemLike, [item_id, user_id], async function (err, result1) {

        if (err) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                err
            });
        }
        if (result1.length > 0) {
            await db.query(marketplaceQueries.deleteItemLike, [item_id, user_id], async function (err, result) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });
                }
            });
            return res.status(200).send({
                success: true,
                msg: "Like removed!!",

            });
        }
        else {
            await db.query(marketplaceQueries.insertItemLike, itemlike, async function (err, result2) {

                if (err) {
                    return res.status(400).send({
                        success: false,
                        msg: err
                    });

                }
                return res.status(200).send({
                    success: true,
                    msg: "Item liked successfully!!",

                });
            })
        }
    });
}


exports.addSubscriber = async (db, req, res) => {
    console.log("in addSubscriber");
    var email = req.body.email;

    if (!email) {
        return res.status(400).send({
            success: false,
            msg: "Email required!!"
        });
    }

    if (!validator.validate(email)) {
        return res.status(400).send({
            success: false,
            msg: "Email is not validate"
        });
    }

    await db.query(marketplaceQueries.getSubscriber, email, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        if (data.length > 0) {
            res.status(400).send({
                success: false,
                msg: "This email is already Subscribed!!",
            });
        } else {
            var sub = {
                "email": email,
                "ip": null,
                "datetime": new Date()
            }

            await db.query(marketplaceQueries.addSubscriber, [sub], function (error, result) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                if (result) {
                    res.status(200).send({
                        success: true,
                        msg: "You are subscribed successfully!!",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Insertion Error!! "
                    });
                }
            });
        }
    });
}



exports.itemDetails = async (db, req, res) => {
    console.log("in itemDetails");
    var item_id = req.body.item_id;
    var user_id = req.body.user_id;
    var itemLike = req.body.itemLike;

    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }
    if (!user_id) {
        user_id = 0;
    }

    var views = {
        "user_id": user_id,
        'item_id': item_id
    }

    if (itemLike == 0) {
        await db.query(marketplaceQueries.itemView, [views], async function (error, data) { });
    }

    await db.query(marketplaceQueries.itemdetail, [item_id, user_id, item_id, item_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            await db.query(marketplaceQueries.getSettingData, async function (error, settingData) {
                return res.status(200).send({
                    success: true,
                    response: data[0],
                    settingData: settingData[0]
                });
            })
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}

exports.getPropertyDetails = async (db, req, res) => {
    console.log("in getPropertyDetails");
    var item_id = req.body.item_id;
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }

    await db.query(marketplaceQueries.propertyDetails, [item_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                response: data
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


exports.insertContact = async (db, req, res) => {
    console.log("in insertContact");
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    if (!validator.validate(email)) {
        return res.status(200).send({
            success: false,
            msg: "Email is not validate"
        });
    }

    var contact_us = {
        "name": name,
        "email": email,
        "message": message
    }
    await db.query(marketplaceQueries.insertContacts, [contact_us], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Your request has been updated Successfully, admin will contact you soon!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getContact = async (db, req, res) => {
    console.log("in getContact");
    await db.query(marketplaceQueries.getContact, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Contacts Records",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.insertHelp = async (db, req, res) => {
    console.log("in insertHelp");
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;

    var help_center = {
        "name": name,
        "email": email,
        "message": message
    }
    await db.query(marketplaceQueries.insertHelp, [help_center], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Your request has been updated Successfully, admin will contact you soon!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Something Wrong due to internal Error"
            });
        }
    });
}


exports.getHelp = async (db, req, res) => {
    console.log("in getHelp");
    await db.query(marketplaceQueries.getHelp, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Help Records",
                response: data
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.nftPurchase = async (db, req, res) => {
    console.log("in nftPurchase");
    var user_id = req.body.user_id;
    var to_address = req.body.to_address;
    var item_id = req.body.item_id;
    var trx_currency = req.body.trx_currency;
    var amounTrxHash = req.body.trx_hash;
    var price = req.body.price;
    var cryptoPrice = req.body.cryptoPrice;
    console.log(req.body);

    try {
        await db.query(marketplaceQueries.itemdetail, [item_id, 0, 0, item_id, item_id], async function (error, trx) {

            await db.query(marketplaceQueries.insertSellTransactionByItemId, [trx[0].price, amounTrxHash, trx_currency, to_address, item_id], async function (error, selldata) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in sell transaction!!",
                        error
                    });
                }
            });
        });

        await db.query(marketplaceQueries.insertBuyTransactionByItemId, [user_id, price * -1, amounTrxHash, trx_currency, to_address, item_id], async function (error, buydata) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in insert Buy Transaction By Item Id",
                    error
                });
            }

            await db.query(marketplaceQueries.updateSold, [1, user_id, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in udpateSold",
                        error
                    });
                }

                qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item as i left join users as u on u.id=i.owner_id where i.id=${item_id}`;

                await db.query(qry, async function (error, mailData) {
                    emailActivity.Activity(mailData[0].ownerEmail, `NFT purchased by ${mailData[0].name}`, `Your NFT ${mailData[0].name} has been purchased by ${mailData[0].name} in $ ${price}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                    emailActivity.Activity(mailData[0].bidderEmail, 'NFT Purchased', `You have purchased NFT ${mailData[0].name} in $ ${price}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                });
                /// SEND MAIL ENDS
                return res.status(200).send({
                    success: true,
                    msg: "NFT purchased successfully!!",
                    transaction_id: buydata.insertId

                });
            });
        });
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({
            success: false,
            msg: "Unexpected internal error!!",
            err
        });
    }
}


exports.getfaq = async (db, req, res) => {
    console.log("in getfaq");
    await db.query(marketplaceQueries.getfaq, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data
            });
        } else {
            return res.status(200).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


exports.getUserPurchase = async (db, req, res) => {
    console.log("in getUserPurchase");
    var user_id = req.body.user_id

    var qry = `select  t.id as transaction_id,u.id as user_id,i.is_sold,i.owner_id,u.full_name,u.email,i.id as item_id, i.name as item_name,i.description,i.image,i.file_type,abs(t.amount) as price,date_format(i.datetime,'%d-%M-%y') as nft_datetime,date_format(t.datetime,'%d-%M-%y') as purchase_datetime,concat('https://ropsten.etherscan.io/tx/',t.hash) as transfer_hash,cu.full_name as creator,uc.name as collection_name from transaction as t left join  item as i on i.id=t.item_id left join users as u on u.id=i.created_by left join users as cu on cu.id=i.created_by left join user_collection as uc on uc.id=i.user_collection_id where t.user_id=${user_id} and t.transaction_type_id in (3) and t.status<>3   order by t.id desc`;
    await db.query(qry, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User purchase detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.getUserSale = async (db, req, res) => {
    console.log("in getUserSale");
    var user_id = req.body.user_id

    var qry = `select u.id as user_id,u.full_name,u.email,i.id as item_id,i.name as item_name,i.description,i.image,i.file_type,round(t.amount,2) as price,date_format(i.datetime,'%d-%M-%y') as nft_datetime,date_format(t.datetime,'%d-%M-%y') as purchase_datetime,concat('https://ropsten.etherscan.io/tx/',t.hash) as transfer_hash,cu.full_name as creator,uc.name as collection_name from item as i inner join transaction as t on t.item_id=i.id and t.user_id=${user_id} and t.transaction_type_id in (1,12) and t.status=1 left join users as u on u.id=i.owner_id left join users as cu on cu.id=i.created_by left join user_collection as uc on uc.id=i.user_collection_id where t.user_id=${user_id} and t.transaction_type_id in (1,12)  order by t.id desc`;
    await db.query(qry, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User Sale detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found"
            });
        }
    });
}


exports.insertBid = async (db, req, res) => {
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var bid_price = req.body.bid_price;
    var txhash = req.body.txhash;
    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "User ID required!!"
        });
    }
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_edition_id required!!"
        });
    }

    if (!bid_price) {
        return res.status(400).send({
            success: false,
            msg: "bid_price required!!"
        });
    }

    var transaction = {
        user_id: user_id,
        transaction_type_id: 4,
        item_id: item_id,
        amount: bid_price * -1,
        status: 1,
        hash: txhash,
        currency: "ETH"
    }

    await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, transactionInsert) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }
        await db.query(marketplaceQueries.bidStatusChange, [4, item_id], async function (error, data1) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }

            var insertdata = {
                user_id: user_id,
                item_id: item_id,
                bid_price: bid_price,
                transaction_id: transactionInsert.insertId
            }
            await db.query(marketplaceQueries.insertBid, [insertdata], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                if (data) {
                    /// SEND MAIL STARTS
                    qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item as i left join users as u on u.id=i.owner_id where i.id=${item_id}`;

                    await db.query(qry, async function (error, mailData) {
                        emailActivity.Activity(mailData[0].ownerEmail, 'Bid Placed', `Bid Placed on ${mailData[0].name} for $${bid_price}.`, `salehistory`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                        emailActivity.Activity(mailData[0].bidderEmail, 'Bid Placed', `You have placed bid on ${mailData[0].name} for $${bid_price}.`, `accountsetting`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                    });
                    /// SEND MAIL ENDS

                    /// SEND MAIL FOR PURCHASING NFT ENDS
                    return res.status(200).send({
                        success: true,
                        msg: "Bid placed successfully!!",
                    });
                } else {
                    res.status(400).send({
                        success: false,
                        msg: "Something Wrong due to internal Error"
                    });
                }
            });
        });
    });

}


exports.allSearch = async (
    db, req, res) => {
    console.log("in allSearch");

    var search = (!req.body.search) ? '' : req.body.search;


    if (!search) {
        return res.status(400).send({
            success: false,
            msg: "Search parameter required"
        });
    }
    qry = "select uc.id as id,'' as email,uc.name as user_name,uc.name as full_name,uc.profile_pic,'' as file_type,'collection' as type from user_collection as uc where uc.name like '" + `${search}` + "%' or uc.description like '" + `${search}` + "%' and is_hide=0  union all select id,email,full_name as user_name,full_name as name,profile_pic,'' as file_type,'talent' as type from users where email like '" + `${search}` + "%' or full_name like '" + `${search}` + "%' union all select i.id,u.email,u.user_name,i.name,i.image as profile_pic,i.file_type as file_type,'nft' as type from  item as i left join users as u on u.id=i.created_by where i.name like '" + `${search}` + "%' and i.is_active=1 ";

    try {
        await db.query(qry, async function (err, result) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured ",
                    error
                });
            }
            else if (result.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: 'data  found',
                    response: result

                });
            }
            else {
                return res.status(400).send({
                    success: false,
                    msg: "No data found ",
                    data: []
                });
            }
        })



    } catch (err) {
        return res.status(500).send({
            success: false,
            msg: `unable to add customer address due to internal error :${err}`
        });
    }
}


exports.getUserBids = async (db, req, res) => {
    console.log("in getUserBids");
    var user_id = req.body.user_id

    await db.query(marketplaceQueries.getUserBids, [user_id, user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "User bids detail",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.myBidItem = async (db, req, res) => {
    console.log("in myBidItem");
    var user_id = req.body.user_id
    await db.query(marketplaceQueries.myBidItem, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Item bid detail!!",
                response: data
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.itemView = async (db, req, res) => {
    console.log("in itemView");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;

    if (!user_id) {
        return res.status(400).send({
            success: false,
            msg: "user_id required!!"
        });
    }
    if (!item_id) {
        return res.status(400).send({
            success: false,
            msg: "item_id required!!"
        });
    }
    var views = {
        "user_id": user_id,
        'item_id': item_id
    }

    await db.query(marketplaceQueries.itemView, [views], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data) {
            res.status(200).send({
                success: true,
                msg: "Insert item view successfully!!",
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Error in insertion!!"
            });
        }
    });
}


exports.getMarketActivity = async (db, req, res) => {
    console.log("in getMarketActivity");
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.getMarketActivity, [item_id, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Activity details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getItemBidDetail = async (db, req, res) => {
    console.log("in getItemBidDetail");
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.getItemBidDetail, [item_id, item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Bid details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getBidDetail = async (db, req, res) => {
    console.log("in getBidDetail");
    var item_id = req.body.item_id

    await db.query(marketplaceQueries.getBidDetail, [item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item Bid Details",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.checkExpiry = async (db, req, res) => {
    console.log("in checkExpiry");
    var item_id = req.body.item_id

    await db.query(marketplaceQueries.checkExpiry, [item_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data[0].is_expired == 1) {
            res.status(200).send({
                success: true,
                msg: "Item expired",
                response: data[0]
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "Item not expired yet!!",
                response: data[0]

            });
        }
    });
}


exports.supportListByCategory = async (db, req, res) => {
    var category_id = req.body.category_id;
    await db.query(marketplaceQueries.supportListByCategory, [category_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            return res.status(200).send({
                success: true,
                msg: "Support List!! ",
                data: data
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "No data found!!",
                error
            });
        }
    });
}


exports.bidAccept_testnet = async (db, req, res) => {
    console.log("in bidAccept");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var bid_id = req.body.bid_id;
    var is_sold = 1;

    await db.query(marketplaceQueries.getBidRecord, [bid_id], async function (error, biddata) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured in getWalletDetail",
                error
            });
        }
        await db.query(marketplaceQueries.getWalletDetail, [biddata[0].user_id], async function (error, walletDetail) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in getWalletDetail",
                    error
                });
            }
            var publickey = walletDetail[0].public;

            await db.query(marketplaceQueries.ownerDetail, [item_id, item_id], async function (error, ownerData) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in udpateSold",
                        error
                    });
                }
                var apiData = await openNFT(config.apiKey);
                var from = config.contractOwnerAddress;
                var fromprivate = apiData;
                var tokenowner = config.contractOwnerAddress;
                if (ownerData[0].is_resale === '1') {
                    var from = ownerData[0].public;
                    var fromprivate = ownerData[0].private;
                    var tokenowner = ownerData[0].public;
                }

                var hash = null;
                await db.query(marketplaceQueries.insertSellTransactionByBidId, [hash, bid_id], async function (error, data3) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in insertSellTransactionByBidId!!",
                            error
                        });
                    }
                });

                await db.query(marketplaceQueries.updateSold2, [is_sold, biddata[0].user_id, item_id], async function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured!!",
                            error
                        });
                    }

                    await db.query(marketplaceQueries.updateItemBid, [item_id, bid_id], async function (error, data) {
                        if (error) {
                            return res.status(400).send({
                                success: false,
                                msg: "Error occured updateItemBid!!",
                                error
                            });
                        }

                        await db.query(marketplaceQueries.updateItemBid2, [bid_id], async function (error, data) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "Error occured in updateItemBid2!!",
                                    error
                                });
                            }

                            await db.query(marketplaceQueries.insertBuyTransactionByBidId, [biddata[0].user_id, hash, bid_id], async function (error, data3) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "Error occured in insertBuyTransactionByBidId!!",
                                        error
                                    });
                                }



                                /// SEND MAIL STARTS
                                qry = `select i.name,i.description,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(${user_id}) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail,ib.bid_price from item_bid as ib left join  item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

                                await db.query(qry, async function (error, mailData) {
                                    emailActivity.Activity(mailData[0].ownerEmail, `Bid Accepted`, `You have accepted bid of $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                                    emailActivity.Activity(mailData[0].bidderEmail, 'Bid Accepted', `Your bid has been accepted for $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                                });
                                /// SEND MAIL ENDS    


                                if (data) {
                                    return res.status(200).send({
                                        success: true,
                                        msg: "Bid accepted successfully!!",
                                    });
                                } else {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "Something Wrong due to internal Error"
                                    });
                                }

                            });
                        });
                    });
                });
            });
        });
    });
}

exports.bidAccept = async (db, req, res) => {
    console.log("in bidAccept");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var bid_id = req.body.bid_id;
    let hash = req.body.hash;
    var is_sold = 1;

    await db.query(marketplaceQueries.getBidRecord, [bid_id], async function (error, biddata) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured in getWalletDetail",
                error
            });
        }

        await db.query(marketplaceQueries.insertSellTransactionByBidId, [hash, hash, bid_id], async function (error, data3) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured in insertSellTransactionByBidId!!",
                    error
                });
            }
        });

        await db.query(marketplaceQueries.updateSold2, [is_sold, biddata[0].user_id, item_id], async function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }

            await db.query(marketplaceQueries.updateItemBid, [item_id, bid_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured updateItemBid!!",
                        error
                    });
                }

                await db.query(marketplaceQueries.updateItemBid2, [bid_id], async function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in updateItemBid2!!",
                            error
                        });
                    }

                    await db.query(marketplaceQueries.insertBuyTransactionByBidId, [biddata[0].user_id, hash, bid_id], async function (error, data3) {
                        if (error) {
                            return res.status(400).send({
                                success: false,
                                msg: "Error occured in insertBuyTransactionByBidId!!",
                                error
                            });
                        }



                        /// SEND MAIL STARTS
                        qry = `select i.name,i.description,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(${user_id}) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail,ib.bid_price from item_bid as ib left join  item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

                        await db.query(qry, async function (error, mailData) {
                            emailActivity.Activity(mailData[0].ownerEmail, `Bid Accepted`, `You have accepted bid of $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                            emailActivity.Activity(mailData[0].bidderEmail, 'Bid Accepted', `Your bid has been accepted for $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                        });
                        /// SEND MAIL ENDS    


                        if (data) {
                            return res.status(200).send({
                                success: true,
                                msg: "Bid accepted successfully!!",
                            });
                        } else {
                            return res.status(400).send({
                                success: false,
                                msg: "Something Wrong due to internal Error"
                            });
                        }

                    });
                });
            });
        });
    });
}

exports.bidAcceptCron = async (db, req, res) => {
    console.log("in bidAccept Cron");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var bid_id = req.body.bid_id;
    var is_sold = 1;

    await db.query(marketplaceQueries.getBidRecord, [bid_id], async function (error, biddata) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured in getWalletDetail",
                error
            });
        }
        await db.query(marketplaceQueries.getWalletDetail, [biddata[0].user_id], async function (error, walletDetail) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured in getWalletDetail",
                    error
                });
            }
            var publickey = walletDetail[0].public;

            await db.query(marketplaceQueries.ownerDetail, [item_id, item_id], async function (error, ownerData) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "error occured in udpateSold",
                        error
                    });
                }

                await db.query(marketplaceQueries.itemdetail, [item_id, 0, 0, item_id, item_id], async function (error, itemData) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured!!",
                            error
                        });
                    }

                    var wallet_password = ownerData[0].wallet_password
                    var apiData = await openNFT(wallet_password);
                    var postPara = JSON.stringify({
                        "wallet_name": ownerData[0].wallet_name,
                        "wallet_password": apiData,
                        "asset_id": itemData[0].asset_id,
                        "receiver": publickey
                    })
                    console.log("Post Param", postPara);
                    var adaTransfer = await fetch(`${config.cardanoAPI}nft-transfer`, {
                        method: 'POST', headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: postPara
                    });
                    const ownerTransfer = await adaTransfer.json();
                    console.log(ownerTransfer);
                    if (ownerTransfer.code == 200 && ownerTransfer.status == true) {
                        await db.query(marketplaceQueries.insertSellTransactionByBidId, [ownerTransfer.txHash, bid_id], async function (error, data3) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "Error occured in insertSellTransactionByBidId!!",
                                    error
                                });
                            }
                        });

                        await db.query(marketplaceQueries.updateSold2, [is_sold, biddata[0].user_id, item_id], async function (error, data) {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    msg: "Error occured!!",
                                    error
                                });
                            }

                            await db.query(marketplaceQueries.updateItemBid, [item_id, bid_id], async function (error, data) {
                                if (error) {
                                    return res.status(400).send({
                                        success: false,
                                        msg: "Error occured updateItemBid!!",
                                        error
                                    });
                                }

                                await db.query(marketplaceQueries.updateItemBid2, [bid_id], async function (error, data) {
                                    if (error) {
                                        return res.status(400).send({
                                            success: false,
                                            msg: "Error occured in updateItemBid2!!",
                                            error
                                        });
                                    }

                                    await db.query(marketplaceQueries.insertBuyTransactionByBidId, [biddata[0].user_id, ownerTransfer.txHash, bid_id], async function (error, data3) {
                                        if (error) {
                                            return res.status(400).send({
                                                success: false,
                                                msg: "Error occured in insertBuyTransactionByBidId!!",
                                                error
                                            });
                                        }



                                        /// SEND MAIL STARTS
                                        qry = `select i.name,i.description,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(${user_id}) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail,ib.bid_price from item_bid as ib left join  item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

                                        await db.query(qry, async function (error, mailData) {
                                            emailActivity.Activity(mailData[0].ownerEmail, `Bid Accepted`, `You have accepted bid of $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

                                            emailActivity.Activity(mailData[0].bidderEmail, 'Bid Accepted', `Your bid has been accepted for $${mailData[0].bid_price} for ${mailData[0].name}.`, `nftDetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
                                        });
                                        /// SEND MAIL ENDS    


                                        if (data) {
                                            return res.status(200).send({
                                                success: true,
                                                msg: "Bid accepted successfully!!",
                                            });
                                        } else {
                                            return res.status(400).send({
                                                success: false,
                                                msg: "Something Wrong due to internal Error"
                                            });
                                        }

                                    });
                                });
                            });
                        });
                    } else {
                        return res.status(400).send({
                            success: false,
                            msg: "Something Wrong due to internal Error"
                        });
                    }
                })

            });
        });
    });
}

exports.transferNFT = async (db, req, res) => {
    console.log("in transferNFT");
    var user_id = req.body.user_id;
    var item_id = req.body.item_id;
    var address = req.body.address;
    var is_sold = 1;

    var qry = `select * from user_wallet where public='${address}'`;
    await db.query(qry, async function (error, walletData) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured in walletData",
                error
            });
        }

        if (walletData.length > 0) {


            await db.query(marketplaceQueries.updateSold2, [is_sold, walletData[0].user_id, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                var transaction = {
                    user_id: walletData[0].user_id,
                    item_id: item_id,
                    to_address: address,
                    transaction_type_id: "13",
                    amount: 0,
                    status: 1,
                    currency: 'ADA'
                }
                console.log("transaction", transaction)

                await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data3) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in insertSellTransactionByBidId!!",
                            error
                        });
                    }
                });
                var transaction = {
                    user_id: user_id,
                    item_id: item_id,
                    to_address: address,
                    transaction_type_id: "12",
                    amount: 0,
                    status: 1,
                    currency: 'ADA'
                }

                await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data3) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in insertSellTransactionByBidId!!",
                            error
                        });
                    }
                });
            });
            // /// SEND MAIL STARTS
            // qry = `select i.name,i.description,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(${user_id}) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail,ib.bid_price from item_bid as ib left join  item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

            // await db.query(qry, async function (error, mailData) {
            //     emailActivity.Activity(mailData[0].ownerEmail, `Bid Accepted`, `You have accepted bid of $${mailData[0].bid_price} for ${mailData[0].name}.`, `itemdetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

            //     emailActivity.Activity(mailData[0].bidderEmail, 'Bid Accepted', `Your bid has been accepted for $${mailData[0].bid_price} for ${mailData[0].name}.`, `itemdetails/${item_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
            // });
            // /// SEND MAIL ENDS    
        }
        else {

            await db.query(marketplaceQueries.updateSold2, [is_sold, null, item_id], async function (error, data) {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        msg: "Error occured!!",
                        error
                    });
                }
                var transaction = {
                    user_id: user_id,
                    item_id: item_id,
                    to_address: address,
                    transaction_type_id: "12",
                    amount: 0,
                    status: 1,
                    currency: 'ADA'
                }

                await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, data3) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in insertSellTransactionByBidId!!",
                            error
                        });
                    }
                });
            });

        }
        return res.status(200).send({
            success: true,
            msg: "NFT transfered successfully!!",
        });
    });
}




exports.getUserTransaction = async (db, req, res) => {
    console.log("in getUserTransaction");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getUserTransaction, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "User transaction details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}


exports.getRoyaltyTransaction = async (db, req, res) => {
    console.log("in getRoyaltyTransaction");
    var user_id = req.body.user_id;
    await db.query(marketplaceQueries.getRoyaltyTransaction, [user_id], function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Royalty transaction details!!",
                response: data
            });
        } else {
            res.status(400).send({
                success: false,
                msg: "No data found!!"
            });
        }
    });
}

exports.bidCron = async (db, req, res) => {
    console.log("in bidCron");
    await db.query(marketplaceQueries.getExpiredBid, async function (error, bidData) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error in getExpiredBid!!"
            });
        }
        for (var i = 0; i < bidData.length; i++) {
            if (bidData[i].bid_count == 0) {
                await db.query(marketplaceQueries.removeOnSale, [bidData[i].item_id], function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured!!",
                            error
                        });
                    }
                });
            } else {
                await db.query(marketplaceQueries.getBidData, [bidData[i].max_bid_id], async function (error, data) {
                    if (error) {
                        return res.status(400).send({
                            success: false,
                            msg: "Error occured in getBidData!!",
                            error
                        });
                    }
                    console.log("biddata", data)
                    var url = `${config.apiUrl}bidAcceptCron`;
                    console.log("api begins ", url);
                    const response2 = await fetch(url, {
                        method: 'POST', headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "user_id": `${data[0].user_id}`,
                            "item_id": `${data[0].item_id}`,
                            "bid_id": `${data[0].id}`
                        })
                    });
                    const data2 = await response2.json();
                });
            }
            return res.status(200).send({
                success: true,
                msg: "Data updated!!",
                error
            });
        }

    });
}

exports.createNewPolicy = async (db, req, res) => {
    console.log("in createNewPolicy");
    var user_id = req.body.user_id;

    try {
        await db.query(marketplaceQueries.userWallet, [user_id], async function (error, walletDetails) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Wallet not found!!"
                });
            } else if (walletDetails.length > 0) {
                var walletName = walletDetails[0].wallet_name
                const response1 = await fetch(`${config.cardanoAPI}create-policyid`, {
                    method: 'POST', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "wallet_name": walletName
                    })
                });
                const data1 = await response1.json();
                if (data1.code == 200 && data1.status == true) {
                    return res.status(200).send({
                        success: true,
                        msg: "Policy id ceated!!",
                        policy_id: data1.policy_id
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "Something Wrong due to internal Error!!"
                    });
                }
            } else {
                return res.status(400).send({
                    success: false,
                    msg: "Wallet not found!!"
                });
            }


        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            msg: "Wallet not found!!"
        });
    }
}

exports.checkPolicyId = async (db, req, res) => {
    console.log("in checkPolicyId");
    var user_id = req.body.user_id;
    var policy_id = req.body.policy_id;

    try {
        await db.query(marketplaceQueries.userWallet, [user_id], async function (error, walletDetails) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Wallet not found!!"
                });
            } else if (walletDetails.length > 0) {
                var walletName = walletDetails[0].wallet_name
                const response1 = await fetch(`${config.cardanoAPI}verify-policyid`, {
                    method: 'POST', headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "wallet_name": walletName,
                        "policy_id": policy_id
                    })
                });
                const data1 = await response1.json();
                if (data1.code == 200 && data1.status == true) {
                    return res.status(200).send({
                        success: true,
                        msg: "Policy id valid!!!",
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        msg: "Invalid policy id!!"
                    });
                }
            } else {
                return res.status(400).send({
                    success: false,
                    msg: "Policy id not found!!"
                });
            }


        });
    } catch (err) {
        return res.status(400).send({
            success: false,
            msg: "Wallet not found!!"
        });
    }
}

exports.getCollectionCategoryNft = async (db, req, res) => {
    var collection_category_id = req.body.collection_category_id;
    var login_user_id = req.body.login_user_id;
    try {
        var qry = `SELECT i.id as item_id,i.name,i.description,u.id as owner_id,concat('${config.mailUrl}','backend/uploads/', u.profile_pic) as owner_profile_pic,i.image,i.file_type,i.item_category_id,case when mod(i.price,1)=0 then round(i.price) else round(i.price,2) end as price,cl.id as collection_id, cl.games_category ,cl.name as collection_name,cl.user_id, cl.games_category ,cl.profile_pic as collection_profile_pic, cl.is_verified, i.is_sold,i.expiry_date,i.start_date,i.sell_type,case when i.sell_type=1 then 'Buy' when i.sell_type=2 then 'Place a bid' else '' end as sell_type_text, i.sell_type,case when il.id is not null then 1 else 0 end as is_liked,itemLikeCount(i.id) as like_count,coalesce(getCollectionItems(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume from item as i LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id left join users as u on u.id=i.owner_id left join item_like as il on il.item_id=i.id and il.user_id = ${login_user_id} where i.is_active=1 and i.is_sold=0 and i.is_minted = 1 and i.sell_type<>3 and i.is_on_sale<>0  and (i.expiry_date is null or i.expiry_date>now() or start_date='0000-00-00 00:00:00') AND cl.games_category = ${collection_category_id}`;

        await db.query(qry, function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            if (data.length > 0) {
                return res.status(200).send({
                    success: true,
                    msg: "Item Details",
                    response: data
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: "No Data"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}


// ========================================================================================================================================


exports.createMetadata = async (db, req, res) => {
    console.log(" in createMetadata");
    var additem = req.body;
    var userfile = 'item_'.concat('metadata.json');


    fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {

        // Checking for errors
        if (err) throw err;
        console.log("Done writing"); // Success
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        let formdata = new FormData();
        formdata.append('file', fs.createReadStream('./metadata/' + userfile));
        const response2 = await fetch(url, {
            method: 'POST', headers: {
                // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
                'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
                'pinata_api_key': '856f580ed9c0f2715b45',
                'pinata_secret_api_key': '2dd1305d32198f643db71dd781fa8c1269f5afede54cfcccf9e8647a71114b40'
            },
            body: formdata
        });
        const filedata = await response2.json();
        if (filedata) {
            return res.status(200).send({
                success: true,
                msg: "Metadata uploaded !!",
                hash: filedata
            });
        }
        else {
            return res.status(400).send({
                success: false,
                msg: "Unexpected internal error!!",
                err
            });
        }
    });
}

exports.putOnSale = async (db, req, res) => {
    var item_id = req.body.item_id;
    var arr = {
        "is_on_sale": '1',
        "is_sold": '0',
        "is_minted" : 1
    }

    try {
        await db.query(marketplaceQueries.putOnSale1, [arr, item_id], function (error, data) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "Error occured!!",
                    error
                });
            }
            else {
                return res.status(200).send({
                    success: true,
                    msg: "Item put on sale!!"
                });
            }
        });
    } catch (ee) {
        return res.status(200).send({
            success: false,
            msg: "No Data",
            error: ee
        });
    }
}




// =========================================================================================================================================




























































































// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports.imageSave = async (db, req, res) => {

//     var limit = 1
//     var qry = `select * from item where image is not null and local_image is null ORDER BY id`;
//     await db.query(qry, async function (error, data) {
//         if (error) {
//             // https://ipfs.io/ipfs/QmWBB2sY9CYKehoKRmjhZgJ7UHhrFNfBjDKzcToM1S7yTQ
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }


//         for (var i = 0; i < data.length; i++) {


//             var img = data[i].image;
//             const resData = await ipfsCompress.compressImages1('https://ipfs.io/ipfs/' + img);

//             let local_image = resData.images[0];
//             await db.query(`UPDATE item set local_image='${local_image}' WHERE id = ${data[i].id}`);
//         }
//     });
// }

// exports.getJWTToken = async (db, req, res) => {
//     console.log("in getJWTToken");
//     const jwtToken = jwt.sign({
//         email: req.body.email,
//         id: req.body.user_id,
//     }, config.JWT_SECRET_KEY, {
//         expiresIn: config.SESSION_EXPIRES_IN
//     })
//     return res.status(200).send({
//         success: true,
//         responce: jwtToken
//     })
// }

// exports.addTelent = async (db, req, res) => {
//     console.log("in addTelent");
//     var user_id = req.body.user_id;
//     var first_name = req.body.first_name;
//     var last_name = req.body.last_name;
//     var email = req.body.email;
//     var description = req.body.description;
//     var facebook = req.body.facebook;
//     var youtube = req.body.youtube;
//     var twitter = req.body.twitter;
//     var insta = req.body.insta;
//     var nft_hash = req.body.nft_hash;
//     var country_id = req.body.country_id;
//     var city = req.body.city;
//     var follower = req.body.follower;

//     if (!first_name) {
//         return res.status(400).send({
//             success: false,
//             msg: "First Name required"
//         });
//     }

//     if (!last_name) {
//         return res.status(400).send({
//             success: false,
//             msg: "Last Name required"
//         });
//     }

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }

//     if (!email) {
//         return res.status(400).send({
//             success: false,
//             msg: "email required"
//         });
//     }

//     var insertData = {
//         "user_id": user_id,
//         "first_name": first_name,
//         "last_name": last_name,
//         "email": email,
//         "description": description,
//         "facebook": facebook,
//         "youtube": youtube,
//         "twitter": twitter,
//         "insta": insta,
//         "country_id": country_id,
//         "city": city,
//         "follower": follower
//     }

//     await db.query(marketplaceQueries.addTelent, [insertData], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured in!!",
//                 error
//             });
//         }
//         if (data) {

//             /* update telent_status in users */
//             var updateData = {
//                 "telent_status": "0"
//             }
//             await db.query(marketplaceQueries.updateUser, [updateData, user_id], function (error, data) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }
//             })
//             /* ------------------*/

//             res.status(200).send({
//                 success: true,
//                 msg: "Your request submitted successfully!! ",

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }

// exports.EstateUser = async (db, req, res) => {
//     console.log("in EstateUser");
//     var user_id = req.body.user_id;
//     var first_name = req.body.first_name;
//     var last_name = req.body.last_name;
//     var email = req.body.email;
//     var country_id = req.body.country_id;
//     var city = req.body.city;
//     var description = req.body.description;
//     var website = req.body.website;
//     var insta = req.body.insta;

//     if (!first_name) {
//         return res.status(400).send({
//             success: false,
//             msg: "First Name required"
//         });
//     }

//     if (!last_name) {
//         return res.status(400).send({
//             success: false,
//             msg: "Last Name required"
//         });
//     }

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }

//     if (!email) {
//         return res.status(400).send({
//             success: false,
//             msg: "email required"
//         });
//     }

//     var insertData = {
//         "user_id": user_id,
//         "first_name": first_name,
//         "last_name": last_name,
//         "email": email,
//         "country_id": country_id,
//         "city": city,
//         "description": description,
//         "website": website,
//         "insta": insta,

//     }

//     await db.query(marketplaceQueries.addRealEstateUser, [insertData], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {

//             /* update telent_status in users */
//             var updateData = {
//                 "real_estate_status": "0"
//             }
//             await db.query(marketplaceQueries.updateUser, [updateData, user_id], function (error, data) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }
//             })
//             /* ------------------*/

//             res.status(200).send({
//                 success: true,
//                 msg: "Your request submitted successfully!! ",

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }


// exports.listWishlist = async (db, req, res) => {

//     var user_id = req.body.user_id;

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }
//     await db.query(marketplaceQueries.listWishlist, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Your Wishlist ",
//                 data: data

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }


// exports.addWishlist = async (db, req, res) => {

//     var item_id = req.body.item_id;
//     var user_id = req.body.user_id;

//     if (!item_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "Item ID required"
//         });
//     }

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }
//     var insertData = {
//         "user_id": user_id,
//         "item_id": item_id
//     }

//     await db.query(marketplaceQueries.addWishlist, [insertData], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Item added to your wishlist ",

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }


// exports.listWishlist = async (db, req, res) => {

//     var user_id = req.body.user_id;

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }
//     await db.query(marketplaceQueries.listWishlist, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Your Wishlist ",
//                 data: data

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }

// exports.removeWishlist = async (db, req, res) => {

//     var wishlist_id = req.body.wishlist_id;

//     await db.query(marketplaceQueries.removeWishlist, [wishlist_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Item Removed from your wishlist "
//             });
//         } else {
//             res.status(200).send({
//                 success: false,
//                 msg: "Deletion Failed"
//             });
//         }
//     });
// }


// exports.addCart = async (db, req, res) => {

//     var item_id = req.body.item_id;
//     var user_id = req.body.user_id;

//     if (!item_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "Item ID required"
//         });
//     }

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }
//     var insertData = {
//         "user_id": user_id,
//         "item_id": item_id,
//         "quantity": 1
//     }

//     await db.query(marketplaceQueries.addCart, [insertData], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Item added to your cart ",

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }


// exports.listCart = async (db, req, res) => {

//     var user_id = req.body.user_id;
//     var cart_id = 0;


//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }
//     await db.query(marketplaceQueries.listCart, [user_id, user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Your Wishlist ",
//                 cart_total: data[0].cart_total,
//                 data: data

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }

// exports.removeCart = async (db, req, res) => {

//     var cart_id = req.body.cart_id;

//     await db.query(marketplaceQueries.removeCart, [cart_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Item Removed from your wishlist "
//             });
//         } else {
//             res.status(200).send({
//                 success: false,
//                 msg: "Deletion Failed"
//             });
//         }
//     });
// }



exports.ItemDetailForEdit = async (db, req, res) => {
    console.log("in ItemDetailForEdit");
    var item_id = req.body.item_id;
    await db.query(marketplaceQueries.ItemDetailForEdit, [item_id], async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                response: data[0]
            });
        }
        else {
            res.status(400).send({
                success: false,
                msg: "No Data"
            });
        }
    });
}


// exports.getUserTelent = async (db, req, res) => {
//     console.log("in getUserTelent");
//     var limit = req.body.limit;
//     var is_featured = req.body.is_feature;
//     var qry = `Select t.*, u.user_name,u.banner,u.profile_pic,u.telent_status from telent as t inner Join users as u ON t.user_id=u.id and u.deactivate_account=0 inner join (select * from item where id in (select max(id) from item group by created_by)) as i on i.created_by=t.user_id where u.is_featured=${is_featured}`;

//     if (limit > 0) {
//         qry = qry + ' limit ' + limit;
//     }
//     await db.query(qry, async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 response: data

//             });

//         }
//         else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data"
//             });
//         }
//     });
// }


// exports.updateTelentForApproved = async (db, req, res) => {
//     console.log("in updateTelentForApproved");
//     var email = req.body.email;
//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.updateTelentForApproved, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         /// SEND MAIL STARTS
//         qry = `select * from users where id =${user_id}`;

//         await db.query(qry, async function (error, mailData) {
//             emailActivity.Activity(mailData[0].email, 'Verified', `Dear applicant, You are now verfied by admin , You can add your NFTs.`, `featurescreator/${user_id}`, `images/logo-new.png`);

//         });
//         /// SEND MAIL ENDS    
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Email has been Sent",
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }

// exports.realEstateUserApprove = async (db, req, res) => {
//     console.log("in realEstateUserApprove");
//     var email = req.body.email;
//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.realEstateUserApprove, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         var transporter = nodemailer.createTransport({
//             host: 'espsofttechnologies.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'developer@espsofttechnologies.com',
//                 pass: 'Espsoft123#'
//             },
//             tls: {
//                 rejectUnauthorized: false
//             }
//         });


//         var mailOptions = {
//             from: 'no-reply@espsofttech.tech',
//             //   from : 'rajat.espsofttech@gmail.com', 
//             to: `${email}`,
//             subject: 'Account item Verified Link',
//             html: `<div style="background-color:#f4f4f4">
//         <div>
//         <div style="margin:0px auto;max-width:800px">
//         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
//         <tbody>
//         <tr>
//         <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
//         </td>
//         </tr>
//         </tbody>
//         </table>

//         </div>
//         <div style="background:black;background-color:#6f43ec;margin:0px auto;border-radius:5px;max-width:800px">
//         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
//         <tbody>
//         <tr>
//         <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
//         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//         <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//         <tbody>
//         <tr>
//         <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
//         <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
//         <tbody>
//         <tr>
//         <td style="width:126px">
//         <img height="auto" src="https://espsofttech.tech/images/logo-new.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150"  class="CToWUd">
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </div>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </div>
//         <div style="height:20px">
//         &nbsp;
//         </div>
//         <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
//         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
//         <tbody>
//         <tr>
//         <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
//         <div style="margin:0px auto;max-width:800px">
//         <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
//         <tbody>
//         <tr>
//         <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
//         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//         <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//         <tbody>
//         <tr>
//         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${email}</b></div>
//         </td>
//         </tr>
//         <tr>
//         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
//         <h3> You are Verified, Now Add Item </h3>
//         <h4>Please Click on given link </h4>
//         <a href='${config.mailUrl}featurescreator/${user_id}'>Click here </a>
//         </div>
//         </td>
//         </tr>
//         <tr>
//         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//         <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
//         Thanks <br>
//         Infinity8 Team
//         </div>
//         </td>
//         </tr>

//         </tbody>
//         </table>
//         </div>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </div>
//         </td>
//         </tr>
//         </tbody>
//         </table>
//         </div>
//         <div style="height:20px">
//         &nbsp;
//         </div>
//         <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
//         <font color="#888888">
//         </font><font color="#888888">
//         </font><font color="#888888">
//         </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#b09af7;background-color:#000;width:100%;border-radius:5px">
//         <tbody>
//         <tr>
//         <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
//         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//         <font color="#888888">
//         </font><font color="#888888">
//         </font><font color="#888888">
//         </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//         <tbody>
//         <tr>
//         <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
//         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>Infinity8 Team

//         </b></div>
//         </td>
//         <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
//         <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:support@espsofttech.tech" target="_blank">support@espsofttech.tech</a></b></div><font color="#888888">
//         </font></td></tr></tbody></table><font color="#888888">
//         </font></div><font color="#888888">
//         </font></td></tr></tbody></table><font color="#888888">
//         </font></div><font color="#888888">
//         </font></div><font color="#888888">
//         </font></div>`
//         };

//         transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 //   console.log(error);
//             } else {
//                 //console.log('Email sent: ' + info.response);
//             }
//         });

//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Real estate user approved successfully!!",
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }



// exports.updateTelentForReject = async (db, req, res) => {
//     console.log("in updateTelentForReject");
//     var email = req.body.email;
//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.updateTelentForReject, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         await db.query(marketplaceQueries.DeleteTelent, [user_id], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             /// SEND MAIL STARTS
//             qry = `select * from users where id =${user_id}`;

//             await db.query(qry, async function (error, mailData) {
//                 emailActivity.Activity(mailData[0].email, 'Talent application rejected', `Dear applicant, your Request Rejected By Admin , Please Again fill form`, `featurescreator/${user_id}`, `images/logo-new.png`);

//             });
//             /// SEND MAIL ENDS    


//             if (data) {
//                 res.status(200).send({
//                     success: true,
//                     msg: "Email has been Sent",
//                 });
//             } else {
//                 res.status(400).send({
//                     success: false,
//                     msg: "Something Wrong due to internal Error"
//                 });
//             }
//         });
//     });
// }

// exports.realEstateUserReject = async (db, req, res) => {
//     console.log("in realEstateUserReject");
//     var email = req.body.email;
//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.realEstateUserReject, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         await db.query(marketplaceQueries.DeleteRealEstateUser, [user_id], async function (error, data2) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }


//             var transporter = nodemailer.createTransport({
//                 host: 'espsofttechnologies.com',
//                 port: 465,
//                 secure: true,
//                 auth: {
//                     user: 'developer@espsofttechnologies.com',
//                     pass: 'Espsoft123#'
//                 },
//                 tls: {
//                     rejectUnauthorized: false
//                 }
//             });


//             var mailOptions = {
//                 from: 'no-reply@espsofttech.tech',
//                 //   from : 'rajat.espsofttech@gmail.com', 
//                 to: `${email}`,
//                 subject: 'Account item Verified Link',
//                 html: `<div style="background-color:#f4f4f4">
//         <div>
//             <div style="margin:0px auto;max-width:800px">
//                 <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
//                     <tbody>
//                     <tr>
//                         <td style="direction:ltr;font-size:0px;padding:10px 0px;text-align:center">
//                         </td>
//                     </tr>
//                     </tbody>
//                 </table>
            
//             </div>
//         <div style="background:black;background-color:#6f43ec;margin:0px auto;border-radius:5px;max-width:800px">
//             <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
//                 <tbody>
//                 <tr>
//                     <td style="direction:ltr;font-size:0px;padding:8px 0;text-align:center">
//                         <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//                             <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//                             <tbody>
//                                 <tr>
//                                     <td align="center" style="font-size:0px;padding:0px 25px 0px 25px;word-break:break-word">
//                                         <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px">
//                                         <tbody>
//                                             <tr>
//                                                 <td style="width:126px">
//                                                     <img height="auto" src="https://espsofttech.tech/images/logo-new.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="150"  class="CToWUd">
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                         </table>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                             </table>
//                         </div>
//                     </td>
//                 </tr>
//                 </tbody>
//             </table>
//         </div>
//             <div style="height:20px">
//                 &nbsp;
//             </div>
//             <div style="background:#fff;margin:0px auto;border-radius:5px;max-width:800px">
//                 <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-radius:5px">
//                     <tbody>
//                     <tr>
//                         <td style="direction:ltr;font-size:0px;padding:0px;text-align:center">
//                             <div style="margin:0px auto;max-width:800px">
//                                 <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%">
//                                 <tbody>
//                                     <tr>
//                                         <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
//                                             <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//                                             <table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//                     <tbody>
//                     <tr>
//                         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//                             <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1;text-align:left;color:#000"><b>Dear ${email}</b></div>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//                             <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
//                             <h3> Your Request Rejected By Admin , Please Again fill form </h3>
//                             </div>
//                         </td>
//                     </tr>
//                     <tr>
//                         <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word">
//                             <div style="font-family:Arial,sans-serif;font-size:15px;line-height:25px;text-align:left;color:#000">
//                             Thanks <br>
//                             Infinity8 Team
//                             </div>
//                         </td>
//                     </tr>
                    
//                     </tbody>
//                 </table>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                                 </table>
//                             </div>
//                         </td>
//                     </tr>
//                     </tbody>
//                 </table>
//             </div>
//             <div style="height:20px">
//                 &nbsp;
//             </div>
//             <div style="background:#000;background-color:#000;margin:0px auto;border-radius:5px;max-width:800px">
//                 <font color="#888888">
//                     </font><font color="#888888">
//                     </font><font color="#888888">
//                 </font><table align="center" border="0" cellpadding="0" cellspacing="0" style="background:#b09af7;background-color:#000;width:100%;border-radius:5px">
//                     <tbody>
//                     <tr>
//                         <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center">
//                             <div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
//                                 <font color="#888888">
//                                     </font><font color="#888888">
//                                 </font><font color="#888888">
//                                 </font><table border="0" cellpadding="0" cellspacing="0" style="vertical-align:top" width="100%">
//                                 <tbody>
//                                     <tr>
//                                         <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
//                                             <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:left;color:#fff"><b>Infinity8 Team

//                                             </b></div>
//                                         </td>
//                                         <td align="center" style="font-size:0px;padding:0px 25px;word-break:break-word">
//                                             <div style="font-family:Arial,sans-serif;font-size:13px;line-height:25px;text-align:right;color:#fff"><b style="color:white"><a href="mailto:support@espsofttech.tech" target="_blank">support@espsofttech.tech</a></b></div><font color="#888888">
//                                         </font></td></tr></tbody></table><font color="#888888">
//                             </font></div><font color="#888888">
//                         </font></td></tr></tbody></table><font color="#888888">
//             </font></div><font color="#888888">
//         </font></div><font color="#888888">
//         </font></div>`
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                 }
//             });

//             if (data) {
//                 res.status(200).send({
//                     success: true,
//                     msg: "Real estate user rejected!!",
//                 });
//             } else {
//                 res.status(400).send({
//                     success: false,
//                     msg: "Something Wrong due to internal Error"
//                 });
//             }
//         });
//     });
// }


// exports.insertRealEstateCollection = async (db, req, res) => {
//     console.log("in insertRealEstateCollection");
//     var user_id = req.body.user_id;
//     var name = req.body.name;
//     var description = req.body.description;
//     var nft_type_id = 2;

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "user_id required!!"

//         });
//     }
//     if (!name) {
//         return res.status(400).send({
//             success: false,
//             msg: "name required!!"
//         });
//     }
//     if (!description) {
//         return res.status(400).send({
//             success: false,
//             msg: "description required!!"
//         });
//     }
//     var users = {
//         user_id: user_id,
//         name: name,
//         description: description,
//         nft_type_id: nft_type_id
//     }

//     await db.query(marketplaceQueries.insertUserCollection, [users], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             var qry = `Select id ,user_id,name,description,nft_type_id from user_collection where id=${data.insertId}`;
//             db.query(qry, [data.insertId, user_id], async function (error, data2) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }

//                 res.status(200).send({
//                     success: true,
//                     msg: "Collection Inserted Successfully",
//                     data: data2[0]
//                 });
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }

// exports.getAllRealEstateCollection = async (db, req, res) => {
//     console.log("in getAllRealEstateCollection");
//     await db.query(marketplaceQueries.getAllRealEstateCollection, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "All user Collection Detail!!",
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }

// exports.getRealEstateCollection = async (db, req, res) => {
//     console.log("in getRealEstateCollection");
//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.getRealEstateCollection, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Collection Details",
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No data found!!"
//             });
//         }
//     });
// }








// exports.getRealEstateItem = async (db, req, res) => {
//     console.log("in getRealEstateItem");
//     var user_id = req.body.user_id;
//     var user_collection_id = req.body.user_collection_id;
//     var limit = req.body.limit;
//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required!!"
//         });
//     }

//     if (!user_collection_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "user_collection_id required!!"
//         });
//     }

//     if (!limit) {
//         return res.status(400).send({
//             success: false,
//             msg: "limit required!!"
//         });
//     }
//     var qry = "Select it.id as item_id,ie.id as item_edition_id,case when length(it.name)>=30 then concat(left(it.name,30),'...')  else it.name end as name,it.description,it.image,it.file_type,u.full_name as owner,it.item_category_id,coalesce(it.start_date,it.datetime) as start_date,it.token_id,it.price,cl.id as collection_id,cl.user_id,ic.name as item_category,ie.is_sold,ie.expiry_date from item_edition as ie left join item as it on it.id=ie.item_id LEFT JOIN user_collection as cl ON cl.id = it.user_collection_id left join users as u on u.id=it.owner_id left join item_category as ic on ic.id=it.item_category_id where ie.id in (select min(id) from item_edition where is_sold=0 group by item_id) and it.nft_type_id=2 and it.is_active=1"

//     if (user_id > 0) {
//         qry = qry + ` and cl.user_id=${user_id}`
//     }

//     if (user_collection_id > 0) {
//         qry = qry + ` and cl.id=${user_collection_id}`
//     }
//     if (limit > 0) {
//         qry = qry + ` order by rand() limit ${limit}`
//     }

//     await db.query(qry, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "User Item Details",
//                 response: data
//             });
//         } else {
//             res.status(200).send({
//                 success: false,
//                 msg: "No data found!!"
//             });
//         }
//     });
// }

// exports.addRealEstate = async (db, req, res) => {
//     console.log("in addRealEstate");
//     var user_id = req.body.user_id;
//     var name = req.body.name;
//     var description = req.body.description;
//     var image = req.body.image;
//     var image1 = req.body.image1;
//     var file_type = req.body.file_type;
//     var title_deed = req.body.title_deed;
//     var passport = req.body.passport;
//     var item_category_id = req.body.item_category_id;
//     var price = req.body.price;
//     var edition_type = 1;
//     var quantity = 1;
//     var nft_type_id = 2;
//     var sell_type = req.body.sell_type;
//     var edition_type = 1;
//     var user_collection_id = req.body.user_collection_id;
//     var start_date = req.body.start_date;
//     var end_date = req.body.end_date;
//     var expiry_date = req.body.expiry_date;
//     var image_low = req.body.image;
//     var user_address = req.body.user_address;
//     if (file_type === 'image') {
//         var recCompress = await ipfsCompress.compressImages(["https://nxft.mypinata.cloud/ipfs/" + image]);
//         if (recCompress.success == false) {
//             // return res.status(400).send({
//             //     success: false,
//             //     msg: "Image compress issue "
//             // });
//             var image_low = image;
//         } else {
//             var image_low = recCompress.imageHash[0];
//         }
//         //  return res.json({
//         //     image_low:image_low,
//         //     image:image
//         //  })        
//     }


//     if (!name) {
//         return res.status(400).send({
//             success: false,
//             msg: "name required!! "
//         });
//     }
//     if (!image) {
//         return res.status(400).send({
//             success: false,
//             msg: "image required!! "
//         });
//     }
//     if (!description) {
//         return res.status(400).send({
//             success: false,
//             msg: "description required!! "
//         });
//     }

//     if (!price) {
//         return res.status(400).send({
//             success: false,
//             msg: "Price required!! "
//         });
//     }
//     if (!sell_type) {
//         return res.status(400).send({
//             success: false,
//             msg: "Sell type required!! "
//         });
//     }
//     if (!title_deed) {
//         return res.status(400).send({
//             success: false,
//             msg: "title_deed required!! "
//         });
//     }

//     if (!passport) {
//         return res.status(400).send({
//             success: false,
//             msg: "passport required!! "
//         });
//     }

//     var users = {
//         "name": name,
//         "description": description,
//         "image": image_low,
//         "image_original": image,
//         "file_type": file_type,
//         "title_deed": title_deed,
//         "passport": passport,
//         "item_category_id": item_category_id,
//         "user_collection_id": user_collection_id,
//         "start_date": start_date,
//         "end_date": end_date,
//         "price": price,
//         "owner_id": user_id,
//         "created_by": user_id,
//         "sell_type": sell_type,
//         "edition_type": edition_type,
//         "expiry_date": expiry_date,
//         "quantity": quantity,
//         "nft_type_id": nft_type_id
//     }

//     var mint_quantity = quantity;


//     await db.query(marketplaceQueries.insertItem, [users], async function (error, data) {
//         if (error) {
//             console.log("error in insertItem");
//             return res.status(400).send({
//                 success: false,
//                 msg: "error occured in item insert",
//                 error
//             });
//         }
//         /**---------------------------IPFS Json ---------------------------------- */
//         var additem = {
//             "name": name,
//             "description": description,
//             "image": 'https://ipfs.io/ipfs/' + image
//         }
//         var userfile = 'item_'.concat(data.insertId, '.json');



//         fs.writeFile(`./metadata/${userfile}`, JSON.stringify(additem), async (err, fd) => {

//             // Checking for errors
//             if (err) throw err;

//             console.log("Done writing"); // Success




//             const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

//             let formdata = new FormData();

//             //console.log("Done writing"); // Success
//             formdata.append('file', fs.createReadStream('./metadata/' + userfile));


//             //   console.log(fs.createReadStream('./metadata/'+userfile)); // Success
//             // var filedata = await axios.post(url,
//             //     formdata,
//             //     {
//             //         maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
//             //         headers: {
//             //             // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
//             //             'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
//             //             'pinata_api_key': 'b26a087893e3f0033bbf',
//             //             'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
//             //         }
//             //     }
//             // )
//             // console.log(filedata.data.IpfsHash);

//             const response2 = await fetch(url, {
//                 method: 'POST', headers: {
//                     // 'Content-Type' : `application/json;boundary=${formdata._boundary}`,
//                     'Content-Type': `multipart/form-data; boundary=${formdata._boundary}`,
//                     'pinata_api_key': 'b26a087893e3f0033bbf',
//                     'pinata_secret_api_key': '269ca812d8e34ee37b44b09e966b4be8a13c01921e892438f3d3d834ee0a4681'
//                 },
//                 body: formdata
//             });
//             const filedata = await response2.json();


//             db.query(marketplaceQueries.updatemeta, [filedata.IpfsHash, data.insertId], (error, data235) => {

//             })




//             /*-------------------------------------------------------------------------------------*/

//             /**------------------------------------------ Insert-into Item_Images------------------- */


//             for (let i = 0; i < image1.length; i++) {

//                 if (i >= 0) {

//                     var insertData = {
//                         "item_id": data.insertId,
//                         "name": image1[i],
//                         "ip": null,
//                         "datetime": new Date()
//                     }
//                     await db.query(marketplaceQueries.additemimages, [insertData])
//                 };

//             }


//             /**--------------------------------------------------------------------------------------- */
//             /**  -----------------------------------Insertinto Edition */

//             for (var i = 1; i <= quantity; i++) {


//                 var item_ed = {
//                     "edition_text": `${i} of ${quantity}`,
//                     "edition_no": i,
//                     "item_id": data.insertId,
//                     "is_sold": 0,
//                     "owner_id": user_id,
//                     "price": price,
//                     "start_date": start_date,
//                     "expiry_date": expiry_date,
//                     "end_date": end_date,
//                     "user_collection_id": user_collection_id,
//                     "user_address": user_address,
//                     "ip": null,
//                     "datetime": new Date()
//                 };

//                 await db.query(marketplaceQueries.insertEdition, [item_ed])
//             }
//             /** ---------------------------------------------------------- */
//             if (data) {

//                 await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletData) {
//                     /* create NFT and update into table */

//                     //var contract=`${config.contractAddress}`; // TEST CONTRACT
//                     var contract = `${config.contractAddress}`; //LIVE CONTRACT
//                     var apiData = await openNFT(config.apiKey);
//                     const response1 = await fetch(`${config.blockchainApiUrl}mint`, {
//                         method: 'POST', headers: {
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({
//                             "from_address": `${config.contractOwnerAddress}`,
//                             "from_private_key": `${apiData}`,
//                             "to_address": `${config.contractOwnerAddress}`,
//                             "contract_address": `${contract}`,
//                             "MetaDataHash": `${filedata.IpfsHash}`,
//                             "TokenName": `${name}`,
//                             "TokenId": `${data.insertId}`,
//                             "totalSupply": `${mint_quantity}`
//                         })
//                     });

//                     const data1 = await response1.json();
//                     console.log("minted.");
//                     if (!data1.hash) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in mint NFT",
//                             error
//                         });
//                     }

//                     var updateData = {
//                         "token_hash": data1.hash,
//                         "token_id": data.insertId
//                     }

//                     await db.query(marketplaceQueries.updateItem, [updateData, data.insertId], async function (error, data3) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in update item table",
//                                 error
//                             });
//                         }
//                     });
//                 })
//                 await db.query(marketplaceQueries.getItemEdition, [data.insertId], async function (error, iedata) {
//                     if (error) {

//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in item insert",
//                             error
//                         });
//                     }
//                     return res.status(200).send({
//                         success: true,
//                         msg: "Item Inserted Successfully",
//                         item_edition_id: iedata[0].id
//                     });
//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Something Wrong due to internal Error"
//                 });
//             }
//         });
//     });

// }

// exports.walletResalePayment = async (db, req, res) => {
//     console.log("in walletResalePayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var item_id = req.body.item_id;
//     var item_edition_id = req.body.item_edition_id;
//     var resale_quantity = req.body.resale_quantity;

//     await db.query(marketplaceQueries.adminWallet, async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "error occured",
//                 error
//             });
//         }

//         await db.query(marketplaceQueries.userWallet, [user_id], async function (error, data1) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "error occured",
//                     error
//                 });
//             }
//             var transaction = {
//                 user_id: user_id,
//                 item_id: item_id,
//                 item_edition_id: item_edition_id,
//                 purchased_quantity: resale_quantity,
//                 transaction_type_id: "9",
//                 from_address: data1[0].public,//user From Address
//                 to_address: data[0].public, // admin To Address
//                 amount: amount * -1,
//                 status: 1,
//                 currency: 'USD'
//             }

//             await db.query(marketplaceQueries.insertTransaction, transaction)

//             if (data1) {
//                 res.status(200).send({
//                     success: true,
//                     msg: "Resell fee paid Succesfully",

//                 });
//             } else {
//                 res.status(400).send({
//                     success: false,
//                     msg: "Resell fee payment error Error"
//                 });
//             }
//         });
//     });
// }



// exports.walletPayment = async (db, req, res) => {
//     console.log("in walletPayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;

//     await db.query(marketplaceQueries.adminWallet, async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "error occured",
//                 error
//             });
//         }

//         await db.query(marketplaceQueries.userWallet, [user_id], async function (error, data1) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "error occured",
//                     error
//                 });
//             }
//             var transaction = {
//                 user_id: user_id,
//                 transaction_type_id: "5",
//                 from_address: data1[0].public,//user From Address
//                 to_address: data[0].public, // admin To Address
//                 amount: amount * -1,
//                 status: 1,
//                 currency: 'USD'
//             }

//             await db.query(marketplaceQueries.insertTransaction, transaction, async function (error, trxData) {

//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "error occured",
//                         error
//                     });
//                 }
//                 else {
//                     res.status(200).send({
//                         success: true,
//                         msg: "User Withdraw Succesfull",
//                         transaction_id: trxData.insertId
//                     });
//                 }
//             });
//         });
//     });
// }

// /* ---------------------------  STRIPE PAYMENT GATEWAY IMPLEMENTATION ---------------*/
// exports.stripePayment = async (db, req, res) => {
//     console.log("in stripePayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var cardNumber = req.body.cardNumber;
//     var expMonth = req.body.expMonth;
//     var expYear = req.body.expYear;
//     var cvc = req.body.cvc;

//     try {
//         await db.query(marketplaceQueries.getUserDetail, [user_id], async function (error, userData) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured in userData!!",
//                     error
//                 });
//             }

//             const response4 = await fetch('https://espsofttech.tech:7007/stripe/create-card', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "cardNumber": `${cardNumber}`,
//                     "expMonth": `${expMonth}`,
//                     "expYear": `${expYear}`,
//                     "cvc": `${cvc}`
//                 })
//             });

//             const data4 = await response4.json();
//             var cardid = data4.CardID;

//             if (data4.success == false) {
//                 return res.status(400).send({
//                     success: false,
//                     data: data4,
//                     msg: data4.message
//                 });
//             }
//             const response1 = await fetch('https://espsofttech.tech:7007/stripe/create-customer', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "name": `${userData[0].user_name}`,
//                     "email": `${userData[0].email}`,
//                     "address": {
//                         line1: 'Infinity8',
//                         postal_code: 'Infinity8',
//                         city: 'Infinity8',
//                         state: 'CA',
//                         country: 'US',

//                     }
//                 })
//             });

//             const data1 = await response1.json();
//             var customerID = data1.CustomerID;

//             const response2 = await fetch('https://espsofttech.tech:7007/stripe/capture-payment', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "cardId": `${cardid}`,
//                     "customerId": `${customerID}`,
//                     "amount": `${Math.round(amount * 100)}`,
//                     "currency": "USD",
//                     "description": "Amount"
//                 })
//             });
//             const data2 = await response2.json();

//             if (data2.success == 'false') {
//                 return res.status(400).send({
//                     success: false,
//                     msg: data2.message
//                 });
//             }

//             const response3 = await fetch('https://espsofttech.tech:7007/stripe/confirm-capture-payment', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "paymentId": `${data2.paymentId}`
//                 })
//             });
//             const data3 = await response3.json();


//             if (data3.success) {

//                 return res.status(200).send({
//                     success: true,
//                     msg: data3.message
//                 });

//             }
//             else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: data3.message
//                 });
//             }

//         });
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err
//         });
//     }
// }

// exports.paypalMintPayment = async (db, req, res) => {
//     console.log("in paypalMintPayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var payment_id = req.body.payment_id;

//     try {
//         var insertdata = {
//             user_id: user_id,
//             amount: amount,
//             payment_id: payment_id,
//             transaction_type_id: 7,
//             currency: "USD",
//             status: 1,

//         }

//         await db.query(marketplaceQueries.insertTransaction, [insertdata], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error: error
//                 });
//             }
//             else {
//                 return res.status(200).send({
//                     success: true,
//                     msg: 'Payment captured!!',
//                     transaction_id: data.insertId
//                 });

//             }
//         });
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err: err
//         });
//     }
// }


// exports.circleMintPayment = async (db, req, res) => {
//     console.log("in circleMintPayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var number = req.body.number;
//     var cvv = req.body.cvv;
//     var expMonth = req.body.expMonth;
//     var expYear = req.body.expYear;

//     try {

//         const { v4: uuidv4 } = require('uuid');

//         const response0 = await uuidv4();

//         const response1 = await fetch(`${config.circleApiUrl}encryption/public`, {
//             method: 'GET', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             }
//         });
//         const data1 = await response1.json();


//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//              "number": ${number},
//              "cvv": ${cvv}
//         }`);



//         const response2 = await fetch(`${config.circleApiUrl}cards`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "encryptedData": encriptData.encrypted,
//                 "billingDetails": {
//                     "name": "Infinity 8",
//                     "city": "Infinity8",
//                     "country": "US",
//                     "postalCode": "4569",
//                     "line1": "Infinity8",
//                     "line2": "",
//                     "district": "NA"
//                 },
//                 "metadata": {
//                     "email": "info@espsofttech.tech",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "idempotencyKey": `${response0}`,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "expMonth": `${expMonth}`,
//                 "expYear": `${expYear}`
//             })
//         });
//         const data2 = await response2.json();


//         var source_id = data2.data.id;

//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//          "number": ${number},
//          "cvv": ${cvv}
//      }`);

//         const response3 = await fetch(`${config.circleApiUrl}payments`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "metadata": {
//                     "email": "info@infinity.io",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "amount": {
//                     "amount": `${amount}`,
//                     "currency": "USD"
//                 },
//                 "source": {
//                     "id": source_id,
//                     "type": "card"
//                 },
//                 "encryptedData": encriptData.encrypted,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "idempotencyKey": `${response0}`,
//                 "verification": "cvv",
//                 "verificationSuccessUrl": "na",
//                 "verificationFailureUrl": "na",
//                 "description": "Payment"
//             })
//         });
//         const data3 = await response3.json();

//         if (data3.code) {

//             return res.status(400).send({
//                 success: false,
//                 msg: data3.message
//             });

//         }
//         if (!data3.code) {

//             var insertdata = {
//                 user_id: user_id,
//                 amount: amount,
//                 transaction_type_id: 7,
//                 currency: "USD",
//                 status: 1,

//             }

//             await db.query(marketplaceQueries.insertTransaction, [insertdata], async function (error, data) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error: error
//                     });
//                 }

//                 return res.status(200).send({
//                     success: true,
//                     msg: 'Payment captured!!',
//                     transaction_id: data.insertId
//                 });


//             });

//         } else {
//             return res.status(400).send({
//                 success: false,
//                 msg: data3.message,
//                 err: err
//             });
//         }
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err: err
//         });
//     }
// }


// exports.paypalResalePayment = async (db, req, res) => {
//     console.log("in paypalResalePayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var payment_id = req.body.payment_id;
//     var item_id = req.body.item_id;
//     var item_edition_id = req.body.item_edition_id;
//     var resale_quantity = req.body.resale_quantity;

//     try {
//         var insertdata = {
//             user_id: user_id,
//             amount: amount,
//             purchased_quantity: resale_quantity,
//             payment_id: payment_id,
//             item_id: item_id,
//             item_edition_id: item_edition_id,
//             transaction_type_id: 9,
//             currency: "USD",
//             status: 1,

//         }

//         await db.query(marketplaceQueries.insertTransaction, [insertdata], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error: error
//                 });
//             }
//             else {
//                 return res.status(200).send({
//                     success: true,
//                     msg: 'Payment captured!!',
//                     transaction_id: data.insertId
//                 });

//             }
//         });
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err: err
//         });
//     }
// }

// exports.circleResalePayment = async (db, req, res) => {
//     console.log("in paypalResalePayment");
//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var item_id = req.body.item_id;
//     var item_edition_id = req.body.item_edition_id;
//     var resale_quantity = req.body.resale_quantity;
//     var number = req.body.number;
//     var cvv = req.body.cvv;
//     var expMonth = req.body.expMonth;
//     var expYear = req.body.expYear;

//     try {

//         const { v4: uuidv4 } = require('uuid');

//         const response0 = await uuidv4();


//         const response1 = await fetch(`${config.circleApiUrl}encryption/public`, {
//             method: 'GET', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             }
//         });
//         const data1 = await response1.json();


//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//              "number": ${number},
//              "cvv": ${cvv}
//         }`);



//         const response2 = await fetch(`${config.circleApiUrl}cards`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "encryptedData": encriptData.encrypted,
//                 "billingDetails": {
//                     "name": "Infinity 8",
//                     "city": "Infinity8",
//                     "country": "US",
//                     "postalCode": "4569",
//                     "line1": "Infinity8",
//                     "line2": "",
//                     "district": "NA"
//                 },
//                 "metadata": {
//                     "email": "info@espsofttech.tech",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "idempotencyKey": `${response0}`,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "expMonth": `${expMonth}`,
//                 "expYear": `${expYear}`
//             })
//         });
//         const data2 = await response2.json();


//         var source_id = data2.data.id;

//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//          "number": ${number},
//          "cvv": ${cvv}
//      }`);
//         const response3 = await fetch(`${config.circleApiUrl}payments`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "metadata": {
//                     "email": "info@infinity.io",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "amount": {
//                     "amount": `${amount}`,
//                     "currency": "USD"
//                 },
//                 "source": {
//                     "id": source_id,
//                     "type": "card"
//                 },
//                 "encryptedData": encriptData.encrypted,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "idempotencyKey": `${response0}`,
//                 "verification": "cvv",
//                 "verificationSuccessUrl": "na",
//                 "verificationFailureUrl": "na",
//                 "description": "Payment"
//             })
//         });
//         const data3 = await response3.json();

//         if (data3.code) {

//             return res.status(400).send({
//                 success: false,
//                 msg: data3.message
//             });

//         }
//         if (!data3.code) {

//             var insertdata = {
//                 user_id: user_id,
//                 amount: amount,
//                 purchased_quantity: resale_quantity,
//                 item_id: item_id,
//                 item_edition_id: item_edition_id,
//                 transaction_type_id: 9,
//                 currency: "USD",
//                 status: 1,

//             }

//             await db.query(marketplaceQueries.insertTransaction, [insertdata], async function (error, data) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error: error
//                     });
//                 }
//                 else {
//                     return res.status(200).send({
//                         success: true,
//                         msg: 'Payment captured!!',
//                         transaction_id: data.insertId
//                     });

//                 }
//             });
//         }
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err: err
//         });
//     }
// }


// exports.getJWTToken = async (db, req, res) => {
//     console.log("in getJWTToken");
//     const jwtToken = jwt.sign({
//         email: req.body.email,
//         id: req.body.user_id,
//     }, config.JWT_SECRET_KEY, {
//         expiresIn: config.SESSION_EXPIRES_IN
//     })
//     return res.status(200).send({
//         success: true,
//         responce: jwtToken
//     })
// }

// /* ---------------------------  STRIPE PAYMENT GATEWAY IMPLEMENTATION ---------------*/

// exports.getQR = async (db, req, res) => {
//     console.log("in getQR");

//     var user_id = req.body.user_id;

//     await db.query(marketplaceQueries.getUserAuth, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }


//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "QR Code",
//                 response: data[0]
//             });

//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No Data Found"
//             });
//         }

//     });
// }

// exports.twoAuthenticationVerify = async (db, req, res) => {
//     console.log("in twoAuthenticationVerify");
//     var user_id = req.body.user_id;
//     var userToken = req.body.SecretKey;
//     var enableTwoFactor = req.body.enableTwoFactor;
//     if (enableTwoFactor == '0') {
//         enableTwoFactor = '1'
//     } else {
//         enableTwoFactor = '0'
//     }

//     await db.query(marketplaceQueries.getUserAuth, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         var abc = data[0].googleAuthCode;
//         var tokenValidates = speakeasy.totp.verify({
//             secret: abc,
//             encoding: 'base32',
//             token: userToken,
//             window: 0
//         });

//         if (tokenValidates) {
//             await db.query(marketplaceQueries.updateUsersAuth, [enableTwoFactor, user_id]);

//             res.status(200).send({
//                 success: true,
//                 msg: "Result",
//                 response: tokenValidates
//             });

//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Token misMatch"
//             });
//         }

//     });
// }

// exports.getUserRealEstate = async (db, req, res) => {
//     console.log("in getUserRealEstate");
//     var user_id = req.body.user_id;
//     await db.query(marketplaceQueries.getUserRealEstate, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Real estate users detail!!",
//                 response: data[0]
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.getUserTalentById = async (db, req, res) => {
//     console.log("in getUserTalentById");
//     var user_id = req.body.user_id;
//     await db.query(marketplaceQueries.getUserTalentById, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "User talent detail!!",
//                 response: data[0]
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Data not found!!"
//             });
//         }
//     });
// }


// exports.getRealEstate = async (db, req, res) => {
//     console.log("in getRealEstate");
//     await db.query(marketplaceQueries.getRealEstate, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Real estate users detail!!",
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }
// exports.updateRealEstateUser = async (db, req, res) => {
//     console.log("in updateRealEstateUser");
//     var id = req.body.id;
//     var first_name = req.body.first_name;
//     var last_name = req.body.last_name;
//     var email = req.body.email;
//     var country_id = req.body.country_id;
//     var city = req.body.city;
//     var description = req.body.description;
//     var website = req.body.website;
//     var insta = req.body.insta;


//     await db.query(marketplaceQueries.updateRealEstateUser, [first_name, last_name, email, country_id, city, description, website, insta, id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "error occured",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Real estate user Updated!!"
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Updation Error"
//             });
//         }
//     });
// }

// exports.updateTalentUser = async (db, req, res) => {
//     console.log("in updateTalentUser");
//     var id = req.body.id;
//     var first_name = req.body.first_name;
//     var last_name = req.body.last_name;
//     var email = req.body.email;
//     var talent_email = req.body.talent_email;
//     var description = req.body.description;
//     var facebook = req.body.facebook;
//     var youtube = req.body.youtube;
//     var twitter = req.body.twitter;
//     var insta = req.body.insta;
//     var country_id = req.body.country_id;
//     var city = req.body.city;
//     var follower = req.body.follower;


//     await db.query(marketplaceQueries.updateTalentUser, [first_name, last_name, talent_email, description, facebook, youtube, twitter, insta, country_id, city, follower, id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "error occured",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Talent user Updated!!"
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Updation Error"
//             });
//         }
//     });
// }


// exports.getCategoryById = async (db, req, res) => {
//     console.log("in getCategoryById");
//     var item_category_id = req.body.item_category_id;
//     var limit = req.body.limit;


//     var qry = "Select i.id as item_id,ie.id as item_edition_id,i.image,i.file_type,case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,i.name as item_fullname,i.price,i.description from item_edition as ie left join item as i on i.id=ie.item_id where ie.is_sold=0 and ie.id in (select min(id) from item_edition where is_sold=0 and (expiry_date >= now() or expiry_date is null) group by item_id) ";

//     if (item_category_id > 0) {
//         qry = qry + ` and i.item_category_id=${item_category_id}`
//     }
//     qry = qry + " order by rand() ";
//     if (limit > 0) {
//         qry = qry + ` limit ${limit}`
//     }


//     await db.query(qry, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Category Item Detail",
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// /* -------------------End Item -------------------------*/

// /* Bid process methods */





// exports.getRealEstateStatus = async (db, req, res) => {
//     console.log("in getRealEstateStatus");
//     var user_id = req.body.user_id

//     await db.query(marketplaceQueries.getRealEstateStatus, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         if (data.length > 0) {
//             return res.status(200).send({
//                 success: true,
//                 msg: "Users Telent Status",
//                 response: data
//             });
//         } else {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.getTelentStatus = async (db, req, res) => {
//     console.log("in getTelentStatus");
//     var user_id = req.body.user_id

//     await db.query(marketplaceQueries.getTelentStatus, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         if (data.length > 0) {
//             return res.status(200).send({
//                 success: true,
//                 msg: "Users Telent Status",
//                 response: data
//             });
//         } else {
//             return res.status(204).send({
//                 success: false,
//                 msg: "No data found!!"
//             });
//         }
//     });
// }


// exports.resaleTrxStart = async (db, req, res) => {
//     console.log("in resaleTrxStart");

//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var trx_type = 'resale';
//     var user_address = req.body.user_address;
//     var item_id = req.body.item_id;
//     var item_edition_id = req.body.item_edition_id;
//     var resale_quantity = req.body.resale_quantity;

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }

//     if (!user_address) {
//         return res.status(400).send({
//             success: false,
//             msg: "user_address required"
//         });
//     }

//     if (!amount) {
//         return res.status(400).send({
//             success: false,
//             msg: "amount required"
//         });
//     }
//     var transaction = {
//         "user_id": user_id,
//         "transaction_type_id": 9,
//         "amount": amount * -1,
//         "purchased_quantity": resale_quantity,
//         "currency": "USD",
//         "status": 0,
//         "user_address": user_address,
//         "item_id": item_id,
//         "item_edition_id": item_edition_id
//     }

//     await db.query(marketplaceQueries.insertTransaction, [transaction], async function (error, trxdata) {

//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured in insertTransaction!!",
//                 error
//             });
//         }

//         var insertData = {
//             "bid_price": amount,
//             "transaction_status": 'begin',
//             "trx_type": trx_type,
//             "transaction_id": trxdata.insertId,
//             "user_address": user_address,
//             "item_id": item_id,
//             "item_edition_id": item_edition_id,
//             "purchased_quantity": resale_quantity
//         }

//         await db.query(marketplaceQueries.onlinetrx_start, [insertData], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (data) {

//                 /* run token api */
//                 // console.log(JSON.stringify({
//                 //     "external_id": `${trxdata.insertId}`,
//                 //     "hosted_payment_id": `${config.netCentshostedPaymentId}`,
//                 //     "amount": `${amount}`,
//                 //     "email": "",
//                 //     "first_name": "",
//                 //     "last_name": ""
//                 // }));
//                 //console.log(config.netCentshostedPaymentId);
//                 //console.log(config.netCentsAuthorization);
//                 const response1 = await fetch('https://api.net-cents.com/merchant/v2/widget_payments', {
//                     method: 'POST', headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Authorization': `${config.netCentsAuthorization}`
//                     },
//                     body: JSON.stringify({
//                         "external_id": `${trxdata.insertId}`,
//                         "hosted_payment_id": `${config.netCentshostedPaymentId}`,
//                         "amount": `${amount}`,
//                         "email": "",
//                         "first_name": "",
//                         "last_name": ""
//                     })
//                 });
//                 const data1 = await response1.json();

//                 if (!data1.token) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }

//                 /* end token api */
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Your request submitted successfully!! ",
//                     external_id: trxdata.insertId,
//                     token: data1.token,
//                     id: data1.id,
//                     status: data1.status

//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "No Data"
//                 });
//             }
//         });
//     });
// }


// exports.nftTrx_start = async (db, req, res) => {
//     console.log("in nftTrx_start");

//     var user_id = req.body.user_id;
//     var amount = req.body.amount;
//     var trx_type = 'create';
//     var user_address = req.body.user_address;
//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }

//     if (!user_address) {
//         return res.status(400).send({
//             success: false,
//             msg: "user_address required"
//         });
//     }

//     if (!amount) {
//         return res.status(400).send({
//             success: false,
//             msg: "amount required"
//         });
//     }
//     var transaction = {
//         "user_id": user_id,
//         "transaction_type_id": 7,
//         "amount": amount * -1,
//         "currency": "USD",
//         "status": 0,
//         "user_address": user_address
//     }
//     await db.query(marketplaceQueries.insertTransaction, [transaction], async function (error, trxdata) {

//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured in insertTransaction!!",
//                 error
//             });
//         }

//         var insertData = {
//             "bid_price": amount,
//             "transaction_status": 'begin',
//             "trx_type": trx_type,
//             "transaction_id": trxdata.insertId,
//             "user_address": user_address
//         }

//         await db.query(marketplaceQueries.onlinetrx_start, [insertData], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (data) {

//                 /* run token api */


//                 const response1 = await fetch('https://api.net-cents.com/merchant/v2/widget_payments', {
//                     method: 'POST', headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Authorization': `${config.netCentsAuthorization}`
//                     },
//                     body: JSON.stringify({
//                         "external_id": `${trxdata.insertId}`,
//                         "hosted_payment_id": `${config.netCentshostedPaymentId}`,
//                         "amount": `${amount}`,
//                         "email": "",
//                         "first_name": "",
//                         "last_name": ""
//                     })
//                 });
//                 const data1 = await response1.json();

//                 if (!data1.token) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }

//                 /* end token api */
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Your request submitted successfully!! ",
//                     external_id: trxdata.insertId,
//                     token: data1.token,
//                     id: data1.id,
//                     status: data1.status

//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "No Data"
//                 });
//             }
//         });
//     });
// }


// exports.onlinetrx_start = async (db, req, res) => {
//     console.log("in onlinetrx_start");
//     var user_id = req.body.user_id;
//     var item_id = req.body.item_id;
//     var item_edition_id = req.body.item_edition_id;
//     var bid_id = req.body.bid_id;
//     var amount = req.body.amount;
//     var sell_type = req.body.sell_type;
//     var user_address = req.body.user_address;
//     var purchased_quantity = req.body.purchased_quantity;

//     if (!user_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "User ID required"
//         });
//     }

//     if (!item_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "Item ID required"
//         });
//     }

//     if (!amount) {
//         return res.status(400).send({
//             success: false,
//             msg: "amount required"
//         });
//     }
//     if (!sell_type) {
//         return res.status(400).send({
//             success: false,
//             msg: "sell_type required"
//         });
//     }
//     if (!item_edition_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "item_edition_id required"
//         });
//     }
//     if (!user_address) {
//         return res.status(400).send({
//             success: false,
//             msg: "user_address required"
//         });
//     }

//     if (!purchased_quantity) {
//         return res.status(400).send({
//             success: false,
//             msg: "purchased_quantity required"
//         });
//     }

//     var transactiontypeid = 4;
//     if (sell_type === 'Price') {
//         transactiontypeid = 6;
//     }

//     var transaction = {
//         "user_id": user_id,
//         "transaction_type_id": transactiontypeid,
//         "amount": amount * -1,
//         "purchased_quantity": purchased_quantity,
//         "item_id": item_id,
//         "item_edition_id": item_edition_id,
//         "item_edition_bid_id": bid_id,
//         "user_address": user_address,
//         "currency": "USD",
//         "status": 0
//     }
//     await db.query(marketplaceQueries.insertTransaction, [transaction], async function (error, trxdata) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured in insertTransaction!!",
//                 error
//             });
//         }

//         var qry2 = `update transaction set edition_text=concat(getEditionNo(${item_edition_id}),'-',${purchased_quantity}+getEditionNo(${item_edition_id})-1,' of ',getEditionCount(${item_id})) where id =${trxdata.insertId}`;

//         await db.query(qry2);


//         var insertData = {
//             "user_id": user_id,
//             "item_id": item_id,
//             "item_edition_id": item_edition_id,
//             "item_edition_bid_id": bid_id,
//             "bid_price": amount,
//             "purchased_quantity": purchased_quantity,
//             "transaction_status": 'begin',
//             "transaction_id": trxdata.insertId,
//             "user_address": user_address
//         }
//         await db.query(marketplaceQueries.onlinetrx_start, [insertData], async function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (data) {

//                 /* run token api */
//                 const response1 = await fetch('https://api.net-cents.com/merchant/v2/widget_payments', {
//                     method: 'POST', headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Authorization': `${config.netCentsAuthorization}`
//                     },
//                     body: JSON.stringify({
//                         "external_id": `${trxdata.insertId}`,
//                         "hosted_payment_id": `${config.netCentshostedPaymentId}`,
//                         "amount": `${amount}`,
//                         "email": "",
//                         "first_name": "",
//                         "last_name": ""
//                     })
//                 });
//                 const data1 = await response1.json();

//                 if (!data1.token) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }

//                 /* end token api */
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Your request submitted successfully!! ",
//                     external_id: trxdata.insertId,
//                     token: data1.token,
//                     id: data1.id,
//                     status: data1.status

//                 });
//             } else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "No Data"
//                 });
//             }
//         });
//     });
// }

// exports.cryptoTrxCanceled = async (db, req, res) => {
//     console.log("in cryptoTrxCanceled");
//     var external_id = req.body.external_id;

//     var udpateData = {
//         "status": 3
//     }

//     await db.query(marketplaceQueries.updateTransaction, [udpateData, external_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         else {
//             res.status(200).send({
//                 success: true,
//                 msg: "Transaction updated successfully"
//             });
//         }
//     });
// }

// exports.paymentReceived = async (db, req, res) => {
//     console.log("in paymentReceived");
//     var amount_due = req.body.amount_due;
//     var amount_received = req.body.amount_received;
//     var exchange_rate = req.body.exchange_rate;
//     var exchange_rate_currency = req.body.exchange_rate_currency;
//     var external_id = req.body.external_id;
//     var invoice_number = req.body.invoice_number;
//     var transaction_currency = req.body.transaction_currency;
//     var transaction_status = req.body.transaction_status;
//     var payment_id = req.body.payment_id;
//     var transaction_id = req.body.transaction_id;
//     var txid = req.body.txid;
//     var blockchain_transactions = req.body.blockchain_transactions;


//     var udpateData = {
//         "amount_due": amount_due,
//         "amount_received": amount_received,
//         "exchange_rate": exchange_rate,
//         "exchange_rate_currency": exchange_rate_currency,
//         "invoice_number": invoice_number,
//         "transaction_currency": transaction_currency,
//         "transaction_status": transaction_status,
//         "api_transaction_id": transaction_id,
//         "payment_id": payment_id,
//         "txid": txid,
//         "blockchain_id": blockchain_transactions[0].id,
//         "blockchain_status": blockchain_transactions[0].status,
//         "blockchain_amount_received": blockchain_transactions[0].amount_received,
//         "blockchain_find_time": blockchain_transactions[0].find_time,
//         "blockchain_txid": blockchain_transactions[0].trxid,
//     }
//     console.log('external_id : ', external_id);


//     await db.query(marketplaceQueries.updateOnlinetrx, [udpateData, external_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         //    else{
//         //     res.status(200).send({
//         //             success:true,
//         // msg:"Transaction updated successfully"
//         //                 });            
//         //         }
//     });
//     await db.query(marketplaceQueries.getOnlineTrx, [external_id], async function (error, checktrx) {

//         if (checktrx[0].trx_type === 'create') {

//             if (blockchain_transactions[0].status === 'confirmed') {
//                 var updateData = {
//                     "status": "1"
//                 }
//                 console.log("udpate trx");
//                 await db.query(marketplaceQueries.updateTransaction, [updateData, external_id])

//                 return res.status(200).send({
//                     success: true,
//                     msg: "Payment successfull!!",

//                 });
//             }
//             else {

//                 return res.status(400).send({
//                     success: false,
//                     msg: "Payment failed",
//                 });
//             }
//         }


//         if (checktrx[0].trx_type === 'resale') {

//             if (blockchain_transactions[0].status === 'confirmed') {

//                 var updateData = {
//                     "status": "1"
//                 }
//                 console.log("udpate trx");
//                 await db.query(marketplaceQueries.updateTransaction, [updateData, external_id])
//                 return res.status(200).send({
//                     success: true,
//                     msg: "NFT resell payment successfull!!",

//                 });
//             }
//             else {

//                 return res.status(400).send({
//                     success: false,
//                     msg: "NFT resell Payment failed",
//                 });
//             }
//         }


//         if (blockchain_transactions[0].status === 'confirmed') {

//             /* check sell type of item */



//             await db.query(marketplaceQueries.itemDetailByonlinetrx, [external_id], async function (error, itemdata2) {

//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "error occured in itemDetailByonlinetrx",
//                         error
//                     });
//                 }

//                 var publickey = itemdata2[0].public;
//                 if (itemdata2[0].sell_type === 1) {




//                     await db.query(marketplaceQueries.getOnlineTrx, [external_id], async function (error, trx) {

//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in getonlinetrx",
//                                 error
//                             });
//                         }


//                         await db.query(marketplaceQueries.ownerDetail, [trx[0].item_edition_id, trx[0].item_edition_id], async function (error, ownerData) {

//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in udpateSold",
//                                     error
//                                 });
//                             }
//                             var apiData = await openNFT(config.apiKey);

//                             var from = config.contractOwnerAddress;
//                             var fromprivate = apiData;
//                             var tokenowner = config.contractOwnerAddress;
//                             if (ownerData[0].is_resale === '1') {
//                                 var from = ownerData[0].public;
//                                 var fromprivate = ownerData[0].private;
//                                 var tokenowner = ownerData[0].public;
//                             }



//                             /* run ownership changes api */
//                             const response1 = await fetch(`${config.blockchainApiUrl}transfer`, {
//                                 method: 'POST', headers: {
//                                     'Accept': 'application/json',
//                                     'Content-Type': 'application/json'
//                                 },
//                                 body: JSON.stringify({
//                                     "from_address": `${from}`,
//                                     "from_private_key": `${fromprivate}`,
//                                     "contract_address": `${config.contractAddress}`,
//                                     "to_address": `${trx[0].user_address}`,
//                                     "token_owner_address": `${tokenowner}`,
//                                     "tokenId": `${itemdata2[0].token_id}`,
//                                     "amount": trx[0].purchased_quantity
//                                 })
//                             });
//                             const data1 = await response1.json();

//                             if (!data1.hash) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in ownership transfer",
//                                     apidata: data1
//                                 });
//                             }
//                             /// SEND MAIL FOR PURCHASING NFT STARTS
//                             await db.query(marketplaceQueries.getUserDetail, [checktrx[0].user_id], async function (error, mailData) {
//                                 /// SEND MAIL STARTS
//                                 qry = `select i.name,i.description,i.image,getUserFullName(${itemdata2[0].user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${itemdata2[0].user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${itemdata2[0].item_edition_id}`;

//                                 await db.query(qry, async function (error, mailData) {
//                                     emailActivity.Activity(mailData[0].ownerEmail, `NFT purchased by ${mailData[0].bidderName}`, `Your NFT  ${mailData[0].name} has been purchased by ${mailData[0].bidderName} in $ ${itemdata2[0].price}.`, `nftDetails/${itemdata2[0].item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                     emailActivity.Activity(mailData[0].bidderEmail, 'NFT Purchased', `You have purchased NFT  ${mailData[0].name} in $ ${itemdata2[0].price}.`, `nftDetails/${itemdata2[0].item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                 });
//                                 /// SEND MAIL ENDS    


//                                 if (trx[0].is_resale === 0) {
//                                     var sellerPercent = 0.8;
//                                 }
//                                 else {
//                                     var sellerPercent = 0.9;
//                                     ///////// INSERT ROYALTY TRX
//                                     console.log("insert royalty trx");
//                                     await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [(trx[0].purchased_quantity * itemdata2[0].price * .05), trx[0].item_edition_id], async function (error, selldata) {
//                                         if (error) {
//                                             return res.status(400).send({
//                                                 success: false,
//                                                 msg: "error occured in insertRoyaltyTransactionByItemId",
//                                                 error
//                                             });
//                                         }
//                                     });
//                                 }
//                                 ///////// INSERT SELL TRX
//                                 await db.query(marketplaceQueries.insertSellTransactionByItemId, [trx[0].purchased_quantity * itemdata2[0].price * sellerPercent, trx[0].user_address, trx[0].item_edition_id], async function (error, selldata) {
//                                     if (error) {
//                                         return res.status(400).send({
//                                             success: false,
//                                             msg: "error occured in insertSellTransactionByItemId",
//                                             error
//                                         });
//                                     }
//                                 });




//                                 var updateData = {
//                                     "status": "1"
//                                 }
//                                 console.log("udpate trx");
//                                 await db.query(marketplaceQueries.updateTransaction, [updateData, external_id], async function (error, trxid) {




//                                     var qry = `select id from item_edition where item_id=${trx[0].item_id} and owner_id=getOwnerId(${trx[0].item_edition_id}) order by id limit ${trx[0].purchased_quantity}`;
//                                     await db.query(qry, async function (error, loop1) {
//                                         for (var i = 0; i < loop1.length; i++) {
//                                             await db.query(marketplaceQueries.updateSold2, [1, trx[0].user_id, data1.hash, trx[0].user_address, loop1[i].id]);

//                                             var qry2 = `insert into transaction_edition_purchase(transaction_id,item_edition_id)values(${trx[0].transaction_id},${loop1[i].id})`;
//                                             db.query(qry2);

//                                         }
//                                     });
//                                     var qry2 = `update transaction set edition_text=concat(getEditionNo(${trx[0].item_edition_id}),'-',${trx[0].purchased_quantity}+getEditionNo(${trx[0].item_edition_id})-1,' of ',getEditionCount(${trx[0].item_id})) where id =${trx[0].transaction_id}`;

//                                     await db.query(qry2);

//                                     var updateData = {
//                                         "hash": data1.hash,
//                                         "purchased_quantity": trx[0].purchased_quantity
//                                     }
//                                     console.log("udpate trx");
//                                     await db.query(marketplaceQueries.updateTransaction, [updateData, external_id]);
//                                     /* end ownership change api */

//                                     return res.status(200).send({
//                                         success: true,
//                                         msg: "Ownership changed successfully",
//                                         transaction_id: external_id

//                                     });
//                                 });
//                             });

//                         });
//                     });
//                 }
//                 else {
//                     console.log("in bid else");
//                     await db.query(marketplaceQueries.placeBidByOnlinetrx, [external_id], async function (error, trxdata) {

//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in place bid",
//                                 error
//                             });
//                         }
//                         else {
//                             var updateData = {
//                                 "status": "1",
//                                 "item_edition_bid_id": trxdata.insertId
//                             }
//                             await db.query(marketplaceQueries.updateTransaction, [updateData, external_id], async function (error, bidtrx) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in updateTransaction",
//                                         error
//                                     });
//                                 }

//                                 /// SEND MAIL STARTS
//                                 qry = `select i.name,i.description,i.image,getUserFullName(${itemdata2[0].user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${itemdata2[0].user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${itemdata2[0].item_edition_id}`;

//                                 await db.query(qry, async function (error, mailData) {
//                                     emailActivity.Activity(mailData[0].ownerEmail, 'Bid Placed', `Bid Placed on  ${mailData[0].name} for $${itemdata2[0].bid_price}.`, `nftDetails/${itemdata2[0].item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                     emailActivity.Activity(mailData[0].bidderEmail, 'Bid Placed', `You have placed bid on  ${mailData[0].name} for $${itemdata2[0].bid_price}.`, `nftDetails/${itemdata2[0].item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                 });
//                                 /// SEND MAIL ENDS
//                                 return res.status(200).send({
//                                     success: true,
//                                     msg: "Placed bid successfully",
//                                     transaction_id: external_id
//                                 });


//                             });
//                         }
//                     })
//                 }

//             });

//         }
//     });
// }


// /* ---------------------------  STRIPE PAYMENT GATEWAY IMPLEMENTATION ---------------*/
// exports.charge = async (db, req, res) => {
//     console.log("in charge");
//     var amount = req.body.amount;
//     var id = req.body.id;
//     var user_id = req.body.user_id
//     var item_id = req.body.item_id
//     var item_edition_id = req.body.item_edition_id
//     var sell_type = req.body.sell_type
//     var user_address = req.body.user_address;

//     try {
//         await db.query(marketplaceQueries.getUserDetail, [user_id], async function (error, userData) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured in userData!!",
//                     error
//                 });
//             }
//             const response1 = await fetch('https://espsofttech.tech:7007/stripe/create-customer', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "name": `${userData[0].user_name}`,
//                     "email": `${userData[0].email}`,
//                     "address": {
//                         line1: 'Infinity8',
//                         postal_code: 'Infinity8',
//                         city: 'Infinity8',
//                         state: 'CA',
//                         country: 'US',

//                     }
//                 })
//             });

//             const data1 = await response1.json();
//             var customerID = data1.CustomerID;



//             const response2 = await fetch('https://espsofttech.tech:7007/stripe/capture-payment', {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                     'Authorization': `${config.stripe_key}`
//                 },
//                 body: JSON.stringify({
//                     "cardId": `${id}`,
//                     "customerId": `${customerID}`,
//                     "amount": `${(amount * 100).toFixed(0)}`,
//                     "currency": "USD",
//                     "description": "Amount"
//                 })
//             });
//             const data2 = await response2.json();

//             if (data2.success == 'false') {
//                 return res.status(400).send({
//                     success: false,
//                     msg: data2.message
//                 });
//             }
//             if (sell_type === 'Price') {
//                 const response3 = await fetch('https://espsofttech.tech:7007/stripe/confirm-capture-payment', {
//                     method: 'POST', headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json',
//                         'Authorization': `${config.stripe_key}`
//                     },
//                     body: JSON.stringify({
//                         "paymentId": `${data2.paymentId}`
//                     })
//                 });
//                 const data3 = await response3.json();

//                 if (data3.message === 'Payment Successful') {
//                     console.log('data3.message===Payment Successful');

//                     //// transactoin for sell product start
//                     await db.query(marketplaceQueries.insertSellTransactionByItemId, [user_address, item_edition_id], async function (error, selldata) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in insertSellTransactionByItemId",
//                                 error
//                             });
//                         }
//                     });


//                     //// transactoin for sell product ends

//                     //// ROYALTY TRX start
//                     await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [item_edition_id], async function (error, selldata) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in insertRoyaltyTransactionByItemId",
//                                 error
//                             });
//                         }



//                         //// ROYALTY TRX ends
//                         await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletDetail) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in getWalletDetail",
//                                     error
//                                 });
//                             }

//                             await db.query(marketplaceQueries.updateSoldStripe, [1, user_id, data2.paymentId, data2.receipt_url, user_address, item_edition_id], async function (error, data) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in udpateSold",
//                                         error
//                                     });
//                                 }



//                                 await db.query(marketplaceQueries.insertBuyTransactionByItemId, [user_address, item_edition_id], async function (error, buydata) {
//                                     if (error) {
//                                         return res.status(400).send({
//                                             success: false,
//                                             msg: "error occured in udpateSold",
//                                             error
//                                         });
//                                     }

//                                     var publickey = walletDetail[0].public;

//                                     var apiData = await openNFT(config.apiKey);

//                                     const response1 = await fetch(`${config.blockchainApiUrl}transfer`, {
//                                         method: 'POST', headers: {
//                                             'Accept': 'application/json',
//                                             'Content-Type': 'application/json'
//                                         },
//                                         body: JSON.stringify({
//                                             "from_address": `${config.contractOwnerAddress}`,
//                                             "from_private_key": `${apiData}`,
//                                             "contract_address": `${config.contractAddress}`,
//                                             "to_address": `${user_address}`,
//                                             "token_owner_address": `${config.contractOwnerAddress}`,
//                                             "tokenId": `${item_id}`,
//                                             "amount": 1
//                                         })
//                                     });
//                                     const data1 = await response1.json();

//                                     if (!data1.hash) {
//                                         return res.status(400).send({
//                                             success: false,
//                                             msg: "error occured in ownership transfer",
//                                             apidata: data1
//                                         });
//                                     }

//                                     await db.query(marketplaceQueries.updateTransferHash, [data1.hash, item_edition_id], async function (error, data) {
//                                         if (error) {
//                                             return res.status(400).send({
//                                                 success: false,
//                                                 msg: "Error occured in updateTransferHash!!",
//                                                 error
//                                             });
//                                         }
//                                         else {

//                                         }


//                                         /* end ownership change api */

//                                         return res.status(200).send({
//                                             success: true,
//                                             msg: "Ownership changed successfully",
//                                             transaction_id: buydata.insertId

//                                         });
//                                     });
//                                 });
//                             });
//                         })
//                     });
//                 }
//             }
//             else {


//                 if (data2.message === 'Payment successfully authorized') {



//                     var insertData = {
//                         "user_id": user_id,
//                         "item_edition_id": item_edition_id,
//                         "bid_price": amount,
//                         "payment_id": data2.paymentId,
//                         "receipt_url": data2.receipt_url
//                     }
//                     await db.query(marketplaceQueries.insertBid, [insertData], async function (error, trxdata) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in place bid",
//                                 error
//                             });
//                         }
//                         else {
//                             /// RETURN OLD BID PAYMENT STARTS
//                             await db.query(marketplaceQueries.getPendingBid, [item_edition_id, trxdata.insertId], async function (error, returndata) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in getWalletDetail",
//                                         error
//                                     });
//                                 }
//                                 if (returndata.length > 0) {
//                                     const response2 = await fetch('https://espsofttech.tech:7007/stripe/cancel-payment', {
//                                         method: 'POST', headers: {
//                                             'Accept': 'application/json',
//                                             'Content-Type': 'application/json',
//                                             'Authorization': `${config.stripe_key}`
//                                         },
//                                         body: JSON.stringify({
//                                             "paymentId": `${returndata[0].payment_id}`
//                                         })
//                                     });
//                                     const data2 = await response2.json();

//                                     await db.query(marketplaceQueries.rejectBid, returndata[0].id);
//                                 }
//                             });

//                             //// RETURN OLD BID PAYMENT ENDS
//                             await db.query(marketplaceQueries.insertBidTransactionByItemId, [trxdata.insertId], async function (error, dataId) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "Error occured5!!",
//                                         error
//                                     });
//                                 }


//                                 // /*------------------------------- Email Sent */

//                                 await db.query(marketplaceQueries.getUsersByEmail, [user_id], async function (error, result) {

//                                     await db.query(marketplaceQueries.getitems, [item_id], async function (error, data) {


//                                         if (error) {
//                                             return res.status(400).send({
//                                                 success: false,
//                                                 msg: "error occured in UserDetail",
//                                                 error
//                                             });
//                                         }
//                                         var transporter = nodemailer.createTransport({
//                                             host: 'espsofttechnologies.com',
//                                             port: 465,
//                                             secure: true,
//                                             auth: {
//                                                 user: 'developer@espsofttechnologies.com',
//                                                 pass: 'Espsoft123#'

//                                             },
//                                             tls: {
//                                                 rejectUnauthorized: false
//                                             }
//                                         });
//                                         console.log(result[0].email);
//                                         var mailOptions = {
//                                             from: 'no-reply@espsofttech.tech',
//                                             to: result[0].email,
//                                             subject: 'Bid Status',
//                                             html: ` 
//     <div style="FONT-FAMILY:Helvetica-Neue,Helvetica,Arial,sans-serif">
//         <table cellspacing="0" cellpadding="6" width="100%" style="background:#ffffff">
//             <tbody>
//                 <tr>
//                     <td style="border:#ffffff 1px solid">
//                         <table cellspacing="0" cellpadding="0" width="640px" style="margin:0 auto" bgcolor="white">
//                             <tbody>
//                                 <tr>
//                                     <td>
//                                         <table cellspacing="0" cellpadding="0" width="100%">
//                                             <tbody>
//                                                 <tr valign="middle">
//                                                     <td colspan="2" align="center" style="text-align:center;width:100%;padding:12px 0px;border-bottom:1px solid #eaeaea">
//                                                         <div>
//                                                             <a href="#" target="_blank" >
//                                                                 <img align="left" alt="Infinity 8 Logo" src="http://13.126.99.244/infinity8-admin/images/logo-new.png" width="180" style="max-width:400px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="CToWUd">
//                                                                 </a>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td colspan="2">
//                                                             <table style="text-align:left;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;padding-top:20px;color:#37393a" width="100%" cellspacing="0" cellpadding="10" border="0" align="left">
//                                                                 <tbody>
//                                                                     <tr>
//                                                                         <td align="center">
//                                                                             <span style="font-size:26px;display:block;font-weight:normal;padding:16px 0 8px 0">
//                                                       Your bid of  
//                                                                                 <strong>${amount}</strong>
//                                                       was Placed.
                                                      
//                                                                             </span>
//                                                                         </td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td align="center">
//                                                                             <span style="font-size:16px;display:block;font-weight:normal;padding:0">
//                                                       Your offer is only valid till  ${data[0].expiry_date} or before you will outbid, and you'll only be charged if your offer is accepted.
//                                                       </span>
//                                                                         </td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td align="center" style="padding:16px">
//                                                                             <div>
//                                                                                 <a href="${config.mailUrl}purchasedetail/${dataId.insertId}" style="background-color:#0d58c8;color:#ffffff;display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;font-size:16px;font-weight:normal;line-height:40px;text-align:center;text-decoration:none;width:200px" target="_blank" >View your Bids</a>
//                                                                             </div>
//                                                                         </td>
//                                                                     </tr>
//                                                                     <tr>
//                                                                         <td>
//                                                                             <table width="100%" cellspacing="0" cellpadding="10" style="background:#f8f8f8;margin-top:10px">
//                                                                                 <tbody>
//                                                                                     <tr>
//                                                                                         <td align="center" style="padding:0 0 20px 0">
//                                                                                             <table cellspacing="0" cellpadding="0">
//                                                                                                 <tbody>
//                                                                                                     <tr>
//                                                                                                         <td align="center" width="580">
//                                                                                                             <div style="text-align:left;font-size:26px;font-weight:400;padding-top:30px">
//                                                                                  ${data[0].name}
//                                                                               </div>
//                                                                                                             <div style="text-align:left;font-size:18px;padding-bottom:30px">
//                                                                                  by 
//                                                                                                                 <a style="color:#808080;text-decoration:none" href="#" target="_blank">${data[0].owner}</a>
//                                                                                                             </div>
//                                                                                                             <a href="${config.mailUrl}purchasedetail/${dataId.insertId}" target="_blank" >
//                                                                                                                 <img width="580" src="${config.imageUrl}${data[0].image}" class="CToWUd">
//                                                                                                                 </a>
//                                                                                                             </td>
//                                                                                                         </tr>
//                                                                                                         <tr>
//                                                                                                             <td align="center" width="580">
//                                                                                                                 <table cellpadding="0" cellspacing="0">
//                                                                                                                     <tbody>
//                                                                                                                         <tr>
//                                                                                                                             <td width="580" style="padding-top:10px">
//                                                                                                                                 <span style="text-align:left;font-size:26px;font-weight:400">
//                                                                                           Details
//                                                                                           </span>
//                                                                                                                             </td>
//                                                                                                                         </tr>
//                                                                                                                         <tr>
//                                                                                                                             <td width="580" style="padding-top:6px">
//                                                                                                                                 <span style="text-align:left;font-size:16px;font-weight:300">
//                                                                                           Edition 21 of 35
//                                                                                           </span>
//                                                                                                                             </td>
//                                                                                                                         </tr>
//                                                                                                                         <tr>
//                                                                                                                             <td width="580" style="padding-top:6px">
//                                                                                                                                 <span style="text-align:left;font-size:16px;font-weight:300">
//                                                                                           ${data[0].description}
//                                                                                           A gateway to the unknown. Will our 3 little explorers dare to enter?
//                                                                                           </span>
//                                                                                                                             </td>
//                                                                                                                         </tr>
//                                                                                                                         <tr>
//                                                                                                                             <td align="center" style="padding:16px">
//                                                                                                                                 <div>
//                                                                                                                                     <a href="${config.mailUrl}purchasedetail/${dataId.insertId}" style="background-color:#0d58c8;color:#ffffff;display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;font-size:16px;font-weight:normal;line-height:40px;text-align:center;text-decoration:none;width:200px" target="_blank" >View your Bids</a>
//                                                                                                                                 </div>
//                                                                                                                             </td>
//                                                                                                                         </tr>
//                                                                                                                     </tbody>
//                                                                                                                 </table>
//                                                                                                             </td>
//                                                                                                         </tr>
//                                                                                                     </tbody>
//                                                                                                 </table>
//                                                                                             </td>
//                                                                                         </tr>
//                                                                                     </tbody>
//                                                                                 </table>
//                                                                             </td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td style="text-align:left">
//                                                                                 <span style="color:#37393a;font-size:1em;display:block;font-weight:normal;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif">— Infinity8 Team</span>
//                                                                             </td>
//                                                                         </tr>
//                                                                         <tr>
//                                                                             <td style="text-align:left;padding-top:0">
                                                                               
//                                                                                 </td>
//                                                                             </tr>
//                                                                         </tbody>
//                                                                     </table>
//                                                                 </td>
//                                                             </tr>
//                                                             <tr>
//                                                                 <td colspan="2" style="padding:60px 10px;text-align:left;font-size:12px;color:#808080">
                                         
//                                                                             <a style="color:#808080" href="#" target="_blank" ></a>
//                                                                         </td>
//                                                                     </tr>
//                                                                 </tbody>
//                                                             </table>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                             <img src="https://ci4.googleusercontent.com/proxy/0euvWLzznUAdrrGW6axQu9EsfXL7_6GxTkwJXcHMuspzeRNp8FcjggNNSiY-JGDJ8z4DbOXNQp4KIPTZGVU1rxrMwTDYTuQi_8byNugrg1teFLBDeSl-qzOQlrLf_5J09vckt8nuI2XdYRyBtc51W8-MtkRh6exxSbukw1tjdhyhvMvjDg4Km59N4U3mO6S4-d8_qLLADYjFCESLB7XgLben3uVL4vcgREVoCHPLX6k3tMUx_FICjsmAUoTqIEH2GMf5wgZievaPA2FQOsBv4s_5yQ8C8XOv0k5NOqjY2urKBqyOq4G918U_MsrE-E3O0QXlCZiNFMR4DS4XsZfIO7jkNZNjY1fmhbbJ5FmqHSpFOVjPj-L0nDeH1Aa9yyLBjJ8RUt5mreprdNhk7hv3wgqbGqA6IEDjln3sjelbl0HCClCvviJF3ImLBwtYrS_qya6aceNru1Yu8h5K36tjqdlYk05fH1VZgaFH2SnzfmoMSRZh6_24w61qjJmllDy5lyanOd0W7ata=s0-d-e1-ft#http://url7878.makersplace.com/wf/open?upn=-2BPV2hBq-2FD7DUfRz313ixDR4OP7mK3ScXbRYQPgG4McsDWBvGxOavCkt0egDMf4b2MzJOqSn6f8bSm0zGobt5IGcNocHC4GA5YoQaHHfw1RO7GmjU08o22B1HLW-2Fq-2FN3jJKNDg1SS-2BSCtQWUppObUIwIZAn1dnxWCpXLKq7tqll-2B8rhp45PZ-2FNrigL7mTnNsMQJBbqpQ-2F1l39X0wIMXhjb-2B-2BPdbUuwbBmXLgH4uU4sqgvdtK88KY3UvGN12jSTb-2FB-2BSps-2FmbaghPBh0Pipfp5DQL4Qmdp-2BJ9AzYB2PBiDsEc-3D" alt="" width="1" height="1" border="0" style="height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important" class="CToWUd">
//                                 <font color="#888888"></font>
//                             </div>`
//                                         };

//                                         transporter.sendMail(mailOptions, function (error, info) {
//                                             if (error) {
//                                                 console.log(error);
//                                             } else {
//                                                 console.log('Email sent: ' + info.response);
//                                             }
//                                         });

//                                     });

//                                 });
//                                 // ------------------------------------------------------


//                                 await db.query(marketplaceQueries.updateTrxidInBid, [dataId.insertId, trxdata.insertId]);
//                                 return res.status(200).send({
//                                     success: true,
//                                     msg: "Placed bid successfully",
//                                     transaction_id: dataId.insertId
//                                 });
//                             }
//                             )
//                         }
//                     })

//                 }
//             }
//         });
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err
//         });
//     }
// }

// exports.paypalPurchase = async (db, req, res) => {
//     console.log("in paypalPurchase");
//     var amount = req.body.amount;
//     var id = req.body.id;
//     var user_id = req.body.user_id
//     var item_id = req.body.item_id
//     var item_edition_id = req.body.item_edition_id
//     var sell_type = req.body.sell_type
//     var user_address = req.body.user_address;
//     var purchased_quantity = req.body.purchased_quantity;

//     try {


//         if (sell_type === 'Price') {
//             /// transactoin for sell product start
//             await db.query(marketplaceQueries.ownerDetail, [item_edition_id, item_edition_id], async function (error, ownerData) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "error occured in ownerDetail",
//                         error
//                     });
//                 }
//                 var apiData = await openNFT(config.apiKey);

//                 var from = config.contractOwnerAddress;
//                 var fromprivate = apiData;
//                 var tokenowner = config.contractOwnerAddress;
//                 if (ownerData[0].is_resale === '1') {
//                     var from = ownerData[0].public;
//                     var fromprivate = ownerData[0].private;
//                     var tokenowner = ownerData[0].public;
//                 }


//                 const response1 = await fetch(`${config.blockchainApiUrl}transfer`, {
//                     method: 'POST', headers: {
//                         'Accept': 'application/json',
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         "from_address": `${from}`,
//                         "from_private_key": `${fromprivate}`,
//                         "contract_address": `${config.contractAddress}`,
//                         "to_address": `${user_address}`,
//                         "token_owner_address": `${tokenowner}`,
//                         "tokenId": `${item_id}`,
//                         "amount": purchased_quantity
//                     })
//                 });
//                 const data1 = await response1.json();

//                 if (!data1.hash) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "error occured in ownership transfer",
//                         apidata: data1
//                     });
//                 }

//                 await db.query(marketplaceQueries.itemdetail, [item_edition_id, 0, item_edition_id, item_edition_id], async function (error, trx) {
//                     if (error) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in insertSellTransactionByItemId",
//                             error
//                         });
//                     }

//                     if (trx[0].is_resale === 0) {
//                         var sellerPercent = 0.8;
//                     }
//                     else {
//                         var sellerPercent = 0.9;
//                         ///////// INSERT ROYALTY TRX
//                         console.log("insert royalty trx");
//                         await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [trx[0].price * purchased_quantity * .05, trx[0].item_edition_id], async function (error, selldata) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in insertRoyaltyTransactionByItemId",
//                                     error
//                                 });
//                             }
//                         });
//                     }
//                     await db.query(marketplaceQueries.insertSellTransactionByItemId, [trx[0].price * purchased_quantity * sellerPercent, user_address, item_edition_id], async function (error, selldata) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in insertSellTransactionByItemId",
//                                 error
//                             });
//                         }
//                     });
//                 });


//                 //// transactoin for sell product ends

//                 // //// ROYALTY TRX start
//                 // await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [item_edition_id], async function (error, selldata) {
//                 //     if (error) {
//                 //         return res.status(400).send({
//                 //             success: false,
//                 //             msg: "error occured in insertRoyaltyTransactionByItemId",
//                 //             error
//                 //         });
//                 //     }

//                 //     //// ROYALTY TRX ends

//                 await db.query(marketplaceQueries.insertBuyTransactionByItemId, [user_id, amount * -1, user_address, item_edition_id], async function (error, buydata) {
//                     if (error) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in insertBuyTransactionByItemId",
//                             error
//                         });
//                     }
//                     await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletDetail) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in getWalletDetail",
//                                 error
//                             });
//                         }

//                         var publickey = walletDetail[0].public;
//                         console.log("udpate itemedition to sold");

//                         var qry = `select id from item_edition where item_id=${item_id} and owner_id=getOwnerId(${item_edition_id}) order by id limit ${purchased_quantity}`;
//                         await db.query(qry, async function (error, loop1) {
//                             for (var i = 0; i < loop1.length; i++) {
//                                 await db.query(marketplaceQueries.updateSold2, [1, user_id, data1.hash, user_address, loop1[i].id]);
//                                 // var qry2=`update transaction set edition_text=concat(coalesce(edition_text,''),', ',getEditionText(${loop1[i].id}))`;

//                                 // await db.query(qry2);
//                                 var qry2 = `insert into transaction_edition_purchase(transaction_id,item_edition_id)values(${buydata.insertId},${loop1[i].id})`;
//                                 db.query(qry2);
//                                 console.log("updated ie_id ", loop1[i].id);
//                             }
//                         });
//                         var qry2 = `update transaction set purchased_quantity=${purchased_quantity},edition_text=concat(getEditionNo(${item_edition_id}),'-',${purchased_quantity}+getEditionNo(${item_edition_id})-1,' of ',getEditionCount(${item_id})) where id =${buydata.insertId}`;

//                         await db.query(qry2);


//                         await db.query(marketplaceQueries.updateSoldPaypal, [1, user_id, item_edition_id], async function (error, data) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in udpateSold",
//                                     error
//                                 });
//                             }

//                             await db.query(marketplaceQueries.updateTransferHash, [data1.hash, item_edition_id], async function (error, data) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "Error occured in updateTransferHash!!",
//                                         error
//                                     });
//                                 }
//                                 else {

//                                 }


//                                 /* end ownership change api */
//                                 /// SEND MAIL STARTS
//                                 qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${item_edition_id}`;

//                                 await db.query(qry, async function (error, mailData) {
//                                     emailActivity.Activity(mailData[0].ownerEmail, `NFT purchased by ${mailData[0].name}`, `Your NFT  ${mailData[0].name} has been purchased by ${mailData[0].name} in $ ${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                     emailActivity.Activity(mailData[0].bidderEmail, 'NFT Purchased', `You have purchased NFT  ${mailData[0].name} in $ ${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                 });
//                                 /// SEND MAIL ENDS    
//                                 return res.status(200).send({
//                                     success: true,
//                                     msg: "Ownership changed successfully",
//                                     transaction_id: buydata.insertId

//                                 });
//                             });
//                         });
//                     });
//                 });
//             })
//             //});

//         }
//         else {


//             var insertData = {
//                 "user_id": user_id,
//                 "item_edition_id": item_edition_id,
//                 "bid_price": amount
//             }
//             await db.query(marketplaceQueries.insertBid, [insertData], async function (error, trxdata) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "error occured in place bid",
//                         error
//                     });
//                 }
//                 else {

//                     await db.query(marketplaceQueries.insertBidTransactionByItemId, [trxdata.insertId], async function (error, dataId) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "Error occured5!!",
//                                 error
//                             });
//                         }


//                         // /*------------------------------- Email Sent */

//                         await db.query(marketplaceQueries.getUsersByEmail, [user_id], async function (error, result) {

//                             await db.query(marketplaceQueries.getitems, [item_id], async function (error, data) {


//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in UserDetail",
//                                         error
//                                     });
//                                 }
//                                 /// SEND MAIL STARTS
//                                 qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${item_edition_id}`;

//                                 await db.query(qry, async function (error, mailData) {
//                                     emailActivity.Activity(mailData[0].ownerEmail, 'Bid Placed', `Bid Placed on  ${mailData[0].name} for $${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                     emailActivity.Activity(mailData[0].bidderEmail, 'Bid Placed', `You have placed bid on  ${mailData[0].name} for $${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                 });
//                                 /// SEND MAIL ENDS
//                             });

//                         });
//                         // ------------------------------------------------------


//                         await db.query(marketplaceQueries.updateTrxidInBid, [dataId.insertId, trxdata.insertId]);
//                         return res.status(200).send({
//                             success: true,
//                             msg: "Placed bid successfully",
//                             transaction_id: dataId.insertId
//                         });
//                     }
//                     )
//                 }
//             })
//         }

//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err
//         });
//     }
// }


// exports.circlePurchase = async (db, req, res) => {
//     console.log("in circlePurchase");
//     var amount = req.body.amount;
//     var id = req.body.id;
//     var user_id = req.body.user_id
//     var item_id = req.body.item_id
//     var item_edition_id = req.body.item_edition_id
//     var sell_type = req.body.sell_type
//     var user_address = req.body.user_address;
//     var purchased_quantity = req.body.purchased_quantity;
//     var number = req.body.number;
//     var cvv = req.body.cvv;
//     var expMonth = req.body.expMonth;
//     var expYear = req.body.expYear;

//     try {



//         const { v4: uuidv4 } = require('uuid');

//         const response0 = await uuidv4();
//         const response1 = await fetch(`${config.circleApiUrl}encryption/public`, {
//             method: 'GET', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             }
//         });
//         const data1 = await response1.json();


//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//         "number": ${number},
//         "cvv": ${cvv}
//    }`);

//         const response2 = await fetch(`${config.circleApiUrl}cards`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "encryptedData": encriptData.encrypted,
//                 "billingDetails": {
//                     "name": "Infinity 8",
//                     "city": "Infinity8",
//                     "country": "US",
//                     "postalCode": "4569",
//                     "line1": "Infinity8",
//                     "line2": "",
//                     "district": "NA"
//                 },
//                 "metadata": {
//                     "email": "info@espsofttech.tech",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "idempotencyKey": `${response0}`,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "expMonth": `${expMonth}`,
//                 "expYear": `${expYear}`
//             })
//         });
//         const data2 = await response2.json();

//         var source_id = data2.data.id;

//         var encriptData = await pgpEncryption.pgpEncrypt(data1.data.publicKey, `{
//     "number": ${number},
//     "cvv": ${cvv}
// }`);
//         const response3 = await fetch(`${config.circleApiUrl}payments`, {
//             method: 'POST', headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${config.circleApiKey}`
//             },
//             body: JSON.stringify({
//                 "metadata": {
//                     "email": "info@infinity.io",
//                     "phoneNumber": "+919999999999",
//                     "ipAddress": "192.168.1.1",
//                     "sessionId": "DE6FA86F60BB47B379307F851E238617"
//                 },
//                 "amount": {
//                     "amount": `${amount}`,
//                     "currency": "USD"
//                 },
//                 "source": {
//                     "id": source_id,
//                     "type": "card"
//                 },
//                 "encryptedData": encriptData.encrypted,
//                 "keyId": `${config.circleApiKeyId}`,
//                 "idempotencyKey": `${response0}`,
//                 "verification": "cvv",
//                 "verificationSuccessUrl": "na",
//                 "verificationFailureUrl": "na",
//                 "description": "Payment"
//             })
//         });
//         const data3 = await response3.json();

//         if (data3.code) {

//             return res.status(400).send({
//                 success: false,
//                 msg: data3.message
//             });

//         }
//         if (!data3.code) {
//             if (sell_type === 'Price') {
//                 /// transactoin for sell product start
//                 await db.query(marketplaceQueries.ownerDetail, [item_edition_id, item_edition_id], async function (error, ownerData) {
//                     if (error) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in ownerDetail",
//                             error
//                         });
//                     }
//                     var apiData = await openNFT(config.apiKey);

//                     var from = config.contractOwnerAddress;
//                     var fromprivate = apiData;
//                     var tokenowner = config.contractOwnerAddress;
//                     if (ownerData[0].is_resale === '1') {
//                         var from = ownerData[0].public;
//                         var fromprivate = ownerData[0].private;
//                         var tokenowner = ownerData[0].public;
//                     }


//                     const response1 = await fetch(`${config.blockchainApiUrl}transfer`, {
//                         method: 'POST', headers: {
//                             'Accept': 'application/json',
//                             'Content-Type': 'application/json'
//                         },
//                         body: JSON.stringify({
//                             "from_address": `${from}`,
//                             "from_private_key": `${fromprivate}`,
//                             "contract_address": `${config.contractAddress}`,
//                             "to_address": `${user_address}`,
//                             "token_owner_address": `${tokenowner}`,
//                             "tokenId": `${item_id}`,
//                             "amount": purchased_quantity
//                         })
//                     });
//                     const data1 = await response1.json();

//                     if (!data1.hash) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in ownership transfer",
//                             apidata: data1
//                         });
//                     }

//                     await db.query(marketplaceQueries.itemdetail, [item_edition_id, 0, item_edition_id, item_edition_id], async function (error, trx) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in insertSellTransactionByItemId",
//                                 error
//                             });
//                         }

//                         if (trx[0].is_resale === 0) {
//                             var sellerPercent = 0.8;
//                         }
//                         else {
//                             var sellerPercent = 0.9;
//                             ///////// INSERT ROYALTY TRX
//                             console.log("insert royalty trx");
//                             await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [trx[0].price * purchased_quantity * .05, trx[0].item_edition_id], async function (error, selldata) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in insertRoyaltyTransactionByItemId",
//                                         error
//                                     });
//                                 }
//                             });
//                         }
//                         await db.query(marketplaceQueries.insertSellTransactionByItemId, [trx[0].price * purchased_quantity * sellerPercent, user_address, item_edition_id], async function (error, selldata) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in insertSellTransactionByItemId",
//                                     error
//                                 });
//                             }
//                         });
//                     });


//                     //// transactoin for sell product ends

//                     // //// ROYALTY TRX start
//                     // await db.query(marketplaceQueries.insertRoyaltyTransactionByItemId, [item_edition_id], async function (error, selldata) {
//                     //     if (error) {
//                     //         return res.status(400).send({
//                     //             success: false,
//                     //             msg: "error occured in insertRoyaltyTransactionByItemId",
//                     //             error
//                     //         });
//                     //     }

//                     //     //// ROYALTY TRX ends

//                     await db.query(marketplaceQueries.insertBuyTransactionByItemId, [user_id, amount * -1, user_address, item_edition_id], async function (error, buydata) {
//                         if (error) {
//                             return res.status(400).send({
//                                 success: false,
//                                 msg: "error occured in insertBuyTransactionByItemId",
//                                 error
//                             });
//                         }
//                         await db.query(marketplaceQueries.getWalletDetail, [user_id], async function (error, walletDetail) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "error occured in getWalletDetail",
//                                     error
//                                 });
//                             }

//                             var publickey = walletDetail[0].public;
//                             console.log("udpate itemedition to sold");

//                             var qry = `select id from item_edition where item_id=${item_id} and owner_id=getOwnerId(${item_edition_id}) order by id limit ${purchased_quantity}`;
//                             await db.query(qry, async function (error, loop1) {
//                                 for (var i = 0; i < loop1.length; i++) {
//                                     await db.query(marketplaceQueries.updateSold2, [1, user_id, data1.hash, user_address, loop1[i].id]);

//                                     var qry2 = `insert into transaction_edition_purchase(transaction_id,item_edition_id)values(${buydata.insertId},${loop1[i].id})`;
//                                     db.query(qry2);

//                                 }
//                             });
//                             var qry2 = `update transaction set purchased_quantity=${purchased_quantity},edition_text=concat(getEditionNo(${item_edition_id}),'-',${purchased_quantity}+getEditionNo(${item_edition_id})-1,' of ',getEditionCount(${item_id})) where id =${buydata.insertId}`;

//                             await db.query(qry2);

//                             //console.log('updating updateSold-edition_id' + item_edition_id);
//                             await db.query(marketplaceQueries.updateSoldPaypal, [1, user_id, item_edition_id], async function (error, data) {
//                                 if (error) {
//                                     return res.status(400).send({
//                                         success: false,
//                                         msg: "error occured in udpateSold",
//                                         error
//                                     });
//                                 }



//                                 //console.log(data1.hash);
//                                 await db.query(marketplaceQueries.updateTransferHash, [data1.hash, item_edition_id], async function (error, data) {
//                                     if (error) {
//                                         return res.status(400).send({
//                                             success: false,
//                                             msg: "Error occured in updateTransferHash!!",
//                                             error
//                                         });
//                                     }
//                                     else {
//                                         //console.log('without error 2273');
//                                     }


//                                     /* end ownership change api */
//                                     /// SEND MAIL STARTS
//                                     qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${item_edition_id}`;

//                                     await db.query(qry, async function (error, mailData) {
//                                         emailActivity.Activity(mailData[0].ownerEmail, `NFT purchased by ${mailData[0].name}`, `Your NFT  ${mailData[0].name} has been purchased by ${mailData[0].name} in $ ${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                         emailActivity.Activity(mailData[0].bidderEmail, 'NFT Purchased', `You have purchased NFT  ${mailData[0].name} in $ ${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                     });
//                                     /// SEND MAIL ENDS    
//                                     return res.status(200).send({
//                                         success: true,
//                                         msg: "Ownership changed successfully",
//                                         transaction_id: buydata.insertId

//                                     });
//                                 });
//                             });
//                         });
//                     });
//                 })
//                 //});

//             }
//             else {

//                 //console.log('after mail 2322');
//                 var insertData = {
//                     "user_id": user_id,
//                     "item_edition_id": item_edition_id,
//                     "bid_price": amount
//                 }
//                 await db.query(marketplaceQueries.insertBid, [insertData], async function (error, trxdata) {
//                     if (error) {
//                         return res.status(400).send({
//                             success: false,
//                             msg: "error occured in place bid",
//                             error
//                         });
//                     }
//                     else {

//                         await db.query(marketplaceQueries.insertBidTransactionByItemId, [trxdata.insertId], async function (error, dataId) {
//                             if (error) {
//                                 return res.status(400).send({
//                                     success: false,
//                                     msg: "Error occured5!!",
//                                     error
//                                 });
//                             }


//                             // /*------------------------------- Email Sent */

//                             await db.query(marketplaceQueries.getUsersByEmail, [user_id], async function (error, result) {

//                                 await db.query(marketplaceQueries.getitems, [item_id], async function (error, data) {


//                                     if (error) {
//                                         return res.status(400).send({
//                                             success: false,
//                                             msg: "error occured in UserDetail",
//                                             error
//                                         });
//                                     }
//                                     /// SEND MAIL STARTS
//                                     qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${item_edition_id}`;

//                                     await db.query(qry, async function (error, mailData) {
//                                         emailActivity.Activity(mailData[0].ownerEmail, 'Bid Placed', `Bid Placed on  ${mailData[0].name} for $${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);

//                                         emailActivity.Activity(mailData[0].bidderEmail, 'Bid Placed', `You have placed bid on  ${mailData[0].name} for $${amount}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                                     });
//                                     /// SEND MAIL ENDS
//                                 });

//                             });
//                             // ------------------------------------------------------


//                             await db.query(marketplaceQueries.updateTrxidInBid, [dataId.insertId, trxdata.insertId]);
//                             return res.status(200).send({
//                                 success: true,
//                                 msg: "Placed bid successfully",
//                                 transaction_id: dataId.insertId
//                             });
//                         }
//                         )
//                     }
//                 })
//             }
//         }
//         else {
//             return res.status(400).send({
//                 success: false,
//                 msg: data3.message

//             });
//         }
//     }
//     catch (err) {
//         console.log(err)
//         return res.status(400).send({
//             success: false,
//             msg: "Unexpected internal error!!",
//             err
//         });
//     }
// }

// /* ---------------------------  STRIPE PAYMENT GATEWAY IMPLEMENTATION ---------------*/

// exports.charge2 = async (db, req, res) => {
//     console.log("in charge2");
//     //exports.getfaq= async (db,req,res)=>{
//     //app.post("/stripe/charge", cors(), async (req, res) => {
//     //console.log("stripe-routes.js 9 | route reached", req.body);
//     //let { amount, id } = req.body;

//     var amount = req.body.amount
//     var id = req.body.id
//     //console.log("stripe-routes.js 10 | amount and id", amount, id);
//     try {
//         var customer = await stripe.customers.create({
//             name: 'Jenny Rosen',
//             address: {
//                 line1: '510 Townsend St',
//                 postal_code: '98140',
//                 city: 'San Francisco',
//                 state: 'CA',
//                 country: 'US',
//             }
//         });
//         //console.log('customer.id', customer.id)
//         const payment = await stripe.paymentIntents.create({
//             customer: customer.id,
//             amount: amount,
//             currency: "USD",
//             description: "Your Company Description",
//             payment_method: id,
//             confirm: true,
//         });
//         //console.log("stripe-routes.js 19 | payment", payment);
//         res.json({
//             message: "Payment Successful",
//             success: true,
//         });
//     } catch (error) {
//         //console.log("stripe-routes.js 17 | error", error);
//         res.json({
//             message: "Payment Failed",
//             success: false,
//             error: error,
//         });
//     }
// };
// /* ----------------------------------------------------------------------------------*/

// exports.stripe_success = async (db, req, res) => {
//     console.log("in stripe_success");
//     var user_id = req.body.user_id;
//     var item_edition_id = req.body.item_edition_id;
//     var item_id = req.body.item_id;
//     var bid_price = req.body.bid_price;
//     var sell_type = req.body.sell_type;

//     //     if(!user_id){
//     //         res.status(400).send({
//     //             success : false,
//     //             msg : "user_id required!!"
//     //         });
//     //     }
//     //     if(!item_edition_id){
//     //         res.status(400).send({
//     //             success : false,
//     //             msg : "item_edition_id required!!"
//     //         });
//     //     }
//     //     if(!item_id){
//     //         res.status(400).send({
//     //             success : false,
//     //             msg : "item_id required!!"
//     //         });
//     //     } if(!bid_price){
//     //         res.status(400).send({
//     //             success : false,
//     //             msg : "bid_price required!!"
//     //         });
//     //     } if(!sell_type){
//     //         res.status(400).send({
//     //             success : false,
//     //             msg : "sell_type required!!"
//     //         });
//     //     }
//     //     if(sell_type==='Price'){
//     //         await db.query(marketplaceQueries.getWalletDetail,[user_id],async function(error,walletDetail){
//     //             if(error){
//     //             return res.status(400).send({
//     //             success: false,
//     //         msg: "error occured in getWalletDetail",
//     //             error
//     //         });
//     //             }
//     //             await db.query(marketplaceQueries.updateSold,[1,user_id,item_edition_id], async function(error,data){
//     //                 if(error){
//     //      return res.status(400).send({
//     //                 success: false,
//     //             msg: "error occured in udpateSold",
//     //                       error
//     //                    });
//     //              }
//     //             })

//     //             await db.query(marketplaceQueries.insertBuyTransactionByItemId,[item_edition_id], async function(error,data){
//     //                 if(error){
//     //      return res.status(400).send({
//     //                 success: false,
//     //             msg: "error occured in udpateSold",
//     //                       error
//     //                    });
//     //              }
//     //             })

//     //         var publickey=walletDetail[0].public;
//     //         //console.log("public Key");
//     //       //  console.log(publickey);
//     //                 /* run ownership changes api */
//     //                 const response1 = await fetch(`${config.blockchainApiUrl}transfer`,{ method:'POST', headers: {
//     //                     'Accept': 'application/json',
//     //                     'Content-Type': 'application/json'
//     //                 },
//     //                 body: JSON.stringify( {
//     //                     "from_address": `${config.contractOwnerAddress}`,
//     //                     "from_private_key": `${apiKey}`,
//     //                     "contract_address": `${config.contractAddress}`,
//     //                     "to_address": `${publickey}`,
//     //                     "tokenId": item_id,
//     //                     "amount": 1
//     //                 })
//     //                 });
//     //                 const data1 = await response1.json();
//     //             //    console.log(data1);
//     //                 if(!data1.hash){
//     //                     return res.status(400).send({
//     //                         success: false,
//     //                         msg: "error occured in ownership transfer",
//     //                         apidata : data1
//     //                     });
//     //                 }
//     //             //    console.log(data1.hash);
//     //                 await db.query(marketplaceQueries.updateTransferHash,[data1.hash,item_edition_id], async function(error,data){
//     //                     if(error){
//     //          return res.status(400).send({
//     //                     success: false,
//     //                 msg: "Error occured in updateTransferHash!!",
//     //                           error
//     //                        });
//     //                  }
//     //                 })

//     //                 /* end ownership change api */
//     //             })
//     //             res.status(200).send({
//     //                 success:true,
//     //         msg : "Ownership changed successfully",

//     //         });
//     //         }
//     //         else{



//     // /*------------------------------- Email Sent */


//     //  db.query(marketplaceQueries.getitemBy,[item_id],async function(error,result){

//     //  var data = await  db.query(marketplaceQueries.getUsersByEmail,[user_id])

//     //     if(error){
//     //     return res.status(400).send({
//     //     success: false,
//     // msg: "error occured in UserDetail",
//     //     error
//     // });
//     //     }


//     // var transporter = nodemailer.createTransport({
//     //     host: 'espsofttechnologies.com',
//     //     port:465,
//     //     secure: true,
//     //     auth: {
//     //       user: 'developer@espsofttechnologies.com',
//     //       pass:  'Espsoft123#'
//     //     },
//     //     tls: {
//     //         rejectUnauthorized: false
//     //     }
//     //   });


//     // var mailOptions = {
//     // from: 'no-reply@espsofttech.tech',
//     // to: data[0].email,
//     // subject: 'Bid On this item',
//     // html : `  <div style="FONT-FAMILY:Helvetica-Neue,Helvetica,Arial,sans-serif">
//     // <table cellspacing="0" cellpadding="6" width="100%" style="background:#ffffff">
//     //    <tbody>
//     //       <tr>
//     //          <td style="border:#ffffff 1px solid">
//     //             <table cellspacing="0" cellpadding="0" width="640px" style="margin:0 auto" bgcolor="white">
//     //                <tbody>
//     //                   <tr>
//     //                      <td>
//     //                         <table cellspacing="0" cellpadding="0" width="100%">
//     //                            <tbody>
//     //                               <tr valign="middle">
//     //                                  <td colspan="2" align="center" style="text-align:center;width:100%;padding:12px 0px;border-bottom:1px solid #eaeaea">
//     //                                     <div><a href="#" target="_blank" ><img align="left" alt="MakersPlace Logo" src="https://ci6.googleusercontent.com/proxy/YkfORi10H1b77f9VCRO8EjkzzrpXzQxzFiH__voSSA64eyQyBGnMfhfwX_XHjTL2q-HdU-PzZy2M4ZiPa-LCRjjCNg=s0-d-e1-ft#https://makersplace.com/static/img/logo-main.png" width="180" style="max-width:400px;padding-bottom:0;display:inline!important;vertical-align:bottom;border:0;height:auto;outline:none;text-decoration:none" class="CToWUd"></a></div>
//     //                                  </td>
//     //                               </tr>
//     //                               <tr>
//     //                                  <td colspan="2">
//     //                                     <table style="text-align:left;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;padding-top:20px;color:#37393a" width="100%" cellspacing="0" cellpadding="10" border="0" align="left">
//     //                                        <tbody>
//     //                                           <tr>
//     //                                              <td align="center">
//     //                                                 <span style="font-size:26px;display:block;font-weight:normal;padding:16px 0 8px 0">
//     //                                                 Your bid of <strong>$${bid_price}</strong>
//     //                                                 was placed.
//     //                                                 </span>
//     //                                              </td>
//     //                                           </tr>
//     //                                           <tr>
//     //                                              <td align="center">
//     //                                                 <span style="font-size:16px;display:block;font-weight:normal;padding:0">
//     //                                                 Your offer is only valid for ${result[0].expiry_date} days, and you'll only be charged if your offer is accepted.
//     //                                                 </span>
//     //                                              </td>
//     //                                           </tr>
//     //                                           <tr>
//     //                                              <td align="center" style="padding:16px">
//     //                                                 <div><a href="#" style="background-color:#0d58c8;color:#ffffff;display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;font-size:16px;font-weight:normal;line-height:40px;text-align:center;text-decoration:none;width:200px" target="_blank" >View your Bids</a></div>
//     //                                              </td>
//     //                                           </tr>
//     //                                           <tr>
//     //                                              <td>
//     //                                                 <table width="100%" cellspacing="0" cellpadding="10" style="background:#f8f8f8;margin-top:10px">
//     //                                                    <tbody>
//     //                                                       <tr>
//     //                                                          <td align="center" style="padding:0 0 20px 0">
//     //                                                             <table cellspacing="0" cellpadding="0">
//     //                                                                <tbody>
//     //                                                                   <tr>
//     //                                                                      <td align="center" width="580">
//     //                                                                         <div style="text-align:left;font-size:26px;font-weight:400;padding-top:30px">
//     //                                                                           ${result[0].name}
//     //                                                                         </div>
//     //                                                                         <div style="text-align:left;font-size:18px;padding-bottom:30px">
//     //                                                                            by <a style="color:#808080;text-decoration:none" href="#" target="_blank">${result[0].owner}</a>
//     //                                                                         </div>
//     //                                                                         <a href="#" target="_blank" ><img width="580" src="${config.imageUrl}${result[0].image}" class="CToWUd"></a>
//     //                                                                      </td>
//     //                                                                   </tr>
//     //                                                                   <tr>
//     //                                                                      <td align="center" width="580">
//     //                                                                         <table cellpadding="0" cellspacing="0">
//     //                                                                            <tbody>
//     //                                                                               <tr>
//     //                                                                                  <td width="580" style="padding-top:10px">
//     //                                                                                     <span style="text-align:left;font-size:26px;font-weight:400">
//     //                                                                                     Details
//     //                                                                                     </span>
//     //                                                                                  </td>
//     //                                                                               </tr>
//     //                                                                               <tr>
//     //                                                                                  <td width="580" style="padding-top:6px">
//     //                                                                                     <span style="text-align:left;font-size:16px;font-weight:300">
//     //                                                                                     Edition 21 of 35
//     //                                                                                     </span>
//     //                                                                                  </td>
//     //                                                                               </tr>
//     //                                                                               <tr>
//     //                                                                                  <td width="580" style="padding-top:6px">
//     //                                                                                     <span style="text-align:left;font-size:16px;font-weight:300">
//     //                                                                                     ${result[0].description}
//     //                                                                                     A gateway to the unknown. Will our 3 little explorers dare to enter?
//     //                                                                                     </span>
//     //                                                                                  </td>
//     //                                                                               </tr>
//     //                                                                               <tr>
//     //                                                                                  <td align="center" style="padding:16px">
//     //                                                                                     <div><a href="#" style="background-color:#0d58c8;color:#ffffff;display:inline-block;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif;font-size:16px;font-weight:normal;line-height:40px;text-align:center;text-decoration:none;width:200px" target="_blank" >View your Bids</a></div>
//     //                                                                                  </td>
//     //                                                                               </tr>
//     //                                                                            </tbody>
//     //                                                                         </table>
//     //                                                                      </td>
//     //                                                                   </tr>
//     //                                                                </tbody>
//     //                                                             </table>
//     //                                                          </td>
//     //                                                       </tr>
//     //                                                    </tbody>
//     //                                                 </table>
//     //                                              </td>
//     //                                           </tr>
//     //                                           <tr>
//     //                                              <td style="text-align:left">
//     //                                                 <span style="color:#37393a;font-size:1em;display:block;font-weight:normal;font-family:'Helvetica Neue',Helvetica,Arial,Geneva,sans-serif">— MakersPlace Team</span>
//     //                                              </td>
//     //                                           </tr>
//     //                                           <tr>
//     //                                              <td style="text-align:left;padding-top:0">
//     //                                                
//     //                                              </td>
//     //                                           </tr>
//     //                                        </tbody>
//     //                                     </table>
//     //                                  </td>
//     //                               </tr>
//     //                               <tr>
//     //                                  <td colspan="2" style="padding:60px 10px;text-align:left;font-size:12px;color:#808080">
//     //                                     Onchain Labs, Inc.<br>
//     //                                     1150 Folsom St, San Francisco, CA 94103<br>
//     //                                     <a style="color:#808080" href="#" target="_blank" >Unsubscribe from emails like this.</a>
//     //                                  </td>
//     //                               </tr>
//     //                            </tbody>
//     //                         </table>
//     //                      </td>
//     //                   </tr>
//     //                </tbody>
//     //             </table>
//     //          </td>
//     //       </tr>
//     //    </tbody>
//     // </table>
//     // <img src="https://ci4.googleusercontent.com/proxy/0euvWLzznUAdrrGW6axQu9EsfXL7_6GxTkwJXcHMuspzeRNp8FcjggNNSiY-JGDJ8z4DbOXNQp4KIPTZGVU1rxrMwTDYTuQi_8byNugrg1teFLBDeSl-qzOQlrLf_5J09vckt8nuI2XdYRyBtc51W8-MtkRh6exxSbukw1tjdhyhvMvjDg4Km59N4U3mO6S4-d8_qLLADYjFCESLB7XgLben3uVL4vcgREVoCHPLX6k3tMUx_FICjsmAUoTqIEH2GMf5wgZievaPA2FQOsBv4s_5yQ8C8XOv0k5NOqjY2urKBqyOq4G918U_MsrE-E3O0QXlCZiNFMR4DS4XsZfIO7jkNZNjY1fmhbbJ5FmqHSpFOVjPj-L0nDeH1Aa9yyLBjJ8RUt5mreprdNhk7hv3wgqbGqA6IEDjln3sjelbl0HCClCvviJF3ImLBwtYrS_qya6aceNru1Yu8h5K36tjqdlYk05fH1VZgaFH2SnzfmoMSRZh6_24w61qjJmllDy5lyanOd0W7ata=s0-d-e1-ft#http://url7878.makersplace.com/wf/open?upn=-2BPV2hBq-2FD7DUfRz313ixDR4OP7mK3ScXbRYQPgG4McsDWBvGxOavCkt0egDMf4b2MzJOqSn6f8bSm0zGobt5IGcNocHC4GA5YoQaHHfw1RO7GmjU08o22B1HLW-2Fq-2FN3jJKNDg1SS-2BSCtQWUppObUIwIZAn1dnxWCpXLKq7tqll-2B8rhp45PZ-2FNrigL7mTnNsMQJBbqpQ-2F1l39X0wIMXhjb-2B-2BPdbUuwbBmXLgH4uU4sqgvdtK88KY3UvGN12jSTb-2FB-2BSps-2FmbaghPBh0Pipfp5DQL4Qmdp-2BJ9AzYB2PBiDsEc-3D" alt="" width="1" height="1" border="0" style="height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important" class="CToWUd"><font color="#888888">
//     // </font>
//     // </div>`
//     // };

//     // transporter.sendMail(mailOptions, function(error, info){
//     // if (error) {
//     // //   console.log(error);
//     // } else {
//     // console.log('Email sent: ' + info.response);
//     // }
//     // });

//     // });
//     // /*-------------------------------  */

//     //             var insertData={
//     //                 "user_id":user_id,
//     //                 "item_edition_id": item_edition_id,
//     //                 "bid_price": bid_price
//     //             }
//     //         await db.query(marketplaceQueries.insertBid,[insertData],async function(error,trxdata){
//     //                     if(error){
//     //         return res.status(400).send({
//     //                     success: false,
//     //                 msg: "error occured in place bid",
//     //                     error
//     //                 });
//     //                     }
//     //                     else{
//     //                         await db.query(marketplaceQueries.insertBidTransactionByItemId,[trxdata.insertId])
//     //                         return res.status(200).send({
//     //                             success: true,
//     //                         msg: "Placed bid successfully",
//     //                             error
//     //                         });
//     //                     }
//     //                 })
//     //             }
// }

// exports.allCategoryItem = async (db, req, res) => {
//     console.log("in allCategoryItem");

//     try {
//         let i = 0;
//         const [result, fields] = await promisePool.query(marketplaceQueries.getDigitalCategory);
//         let MainArr1 = [];
//         for (const item of result) {
//             let MainArr = {
//                 category: '',
//                 data: ''
//             };
//             const [result1, fields1] = await promisePool.query(marketplaceQueries.allCategoryItem, [item.id, 5]);

//             MainArr.category = item.name;
//             MainArr.data = result1;
//             await MainArr1.push(MainArr);
//             i++;
//         }
//         await db.query(marketplaceQueries.getUpcomingNft, 5, function (error, data3) {

//             let MainArr2 = {
//                 category: '',
//                 data: ''
//             };
//             MainArr2.category = 'Upcoming';
//             MainArr2.data = data3;
//             MainArr1.push(MainArr2);

//             if (result.length == i) {
//                 if (MainArr1.length > 0) {
//                     return res.status(200).send({
//                         success: true,
//                         msg: "Item bid detail!!",
//                         response: MainArr1
//                     });
//                 } else {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "No data found!!"
//                     });
//                 }

//             }
//         });
//     } catch (ee) {
//         return res.status(400).send({
//             success: false,
//             msg: "No data found!!",
//             error: ee
//         });
//     }
// }

// exports.getRecentWorks = async (db, req, res) => {
//     console.log("in getRecentWorks");
//     await db.query(marketplaceQueries.getRecentWorks, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             return res.status(200).send({
//                 success: true,
//                 msg: "Recent works details",
//                 response: data
//             });
//         } else {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }

// exports.allTalentList = async (db, req, res) => {
//     console.log("in allTalentList");
//     var is_feature = req.body.is_feature;

//     await db.query(marketplaceQueries.allTalentList1, [is_feature], async function (error, circle) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         await db.query(marketplaceQueries.allTalentList2, [is_feature], function (error, square) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (circle.length > 0) {
//                 return res.status(200).send({
//                     success: true,
//                     circle: circle,
//                     square: square

//                 });

//             }
//             else {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "No Data"
//                 });
//             }
//         });
//     });
// }

// exports.cancelBid = async (db, req, res) => {
//     console.log("in rejectBid");
//     var bid_id = req.body.bid_id;
//     //await db.query(marketplaceQueries.updateTransactionStatus, [bid_id]);
//     await db.query(marketplaceQueries.cancelBid, [bid_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }

//         var qry = `insert into transaction(user_id,transaction_type_id,amount,status,currency,item_bid_id)SELECT user_id,12 as transaction_type_id,bid_price,1 as status,'ADA' as currency,id as bid_id from item_bid where id=${bid_id}`;
//         await db.query(qry, async function (error, data1) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "error occured",
//                     error
//                 });
//             }

//             if (data) {
//                 /// SEND MAIL STARTS
//                 qry = `select i.name,i.description,ib.bid_price,i.image,getUserFullName(ib.user_id) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(ib.user_id) as bidderEmail from item_bid as ib left join  item as i on i.id=ib.item_id left join users as u on u.id=i.owner_id where ib.id=${bid_id}`;

//                 await db.query(qry, async function (error, mailData) {
//                     emailActivity.Activity(mailData[0].ownerEmail, 'Bid Cancelled', `Bid Cancelled on  ${mailData[0].name} for $${mailData[0].bid_price}.`, `salehistory`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                     emailActivity.Activity(mailData[0].bidderEmail, 'You have cancelled a bid', `You have cancelled bid ${mailData[0].name} for $${mailData[0].bid_price}.`, `accountsetting`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//                 });
//                 /// SEND MAIL ENDS    
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Your bid has been cancelled!! "
//                 });
//             } else {
//                 return res.status(200).send({
//                     success: false,
//                     msg: "cancellation Failed"
//                 });
//             }
//         });
//     });
// }


// exports.getItemLikeCount = async (db, req, res) => {
//     console.log("in getItemLikeCount");
//     var item_edition_id = req.body.item_edition_id
//     var user_id = req.body.user_id

//     await db.query(marketplaceQueries.getItemLikeCount, [user_id, item_edition_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Item like count",
//                 response: data[0]
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }









// exports.updatePayoutAddress = async (db, req, res) => {
//     console.log("in updatePayoutAddress");
//     var user_id = req.body.user_id;
//     var payout_address = req.body.payout_address;

//     var updateData = {
//         "payout_address": payout_address
//     }

//     await db.query(marketplaceQueries.updatePayoutAddress, [updateData, user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Payout address updated!!",

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.getPayoutAddress = async (db, req, res) => {

//     var user_id = req.body.user_id

//     await db.query(marketplaceQueries.getPayoutAddress, [user_id], function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         //console.log(data);
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Payout Address!!",
//                 response: data[0]
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }


// exports.getRoyaltyList = async (db, req, res) => {
//     console.log("in getRoyaltyList");
//     await db.query(marketplaceQueries.getRoyaltyList, async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         //console.log(data);
//         if (data.length > 0) {
//             const response2 = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
//                 method: 'GET', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const usdPrice = await response2.json();

//             res.status(200).send({
//                 success: true,
//                 msg: "Royalty List!!",
//                 ETH_price: usdPrice['data']['amount'],
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error"
//             });
//         }
//     });
// }

// exports.getAllRoyaltyTransaction = async (db, req, res) => {
//     console.log("in getAllRoyaltyTransaction");
//     await db.query(marketplaceQueries.getAllRoyaltyTransaction, function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             res.status(200).send({
//                 success: true,
//                 msg: "Royalty transaction details!!",
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No data found!!"
//             });
//         }
//     });
// }


// exports.getWalletTransaction = async (db, req, res) => {
//     console.log("in getWalletTransaction");
//     var user_id = req.body.user_id;
//     await db.query(marketplaceQueries.getWalletTransaction, [user_id], async function (error, data) {
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Error occured!!",
//                 error
//             });
//         }
//         if (data.length > 0) {
//             const response2 = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
//                 method: 'GET', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const usdPrice = await response2.json();

//             res.status(200).send({
//                 success: true,
//                 msg: "Wallet transaction details!!",
//                 eth_usd_price: usdPrice['data']['amount'],
//                 response: data
//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "No data found!!"
//             });
//         }
//     });
// }


// exports.resaleNFT = async (db, req, res) => {
//     console.log("in resaleNFT");
//     var user_id = req.body.user_id;
//     var item_edition_id = req.body.item_edition_id;
//     var price = req.body.price;
//     var price_eth = req.body.price_eth;
//     var expiry_date = req.body.expiry_date;
//     var hash = req.body.hash;
//     var user_address = req.body.user_address;
//     var transaction_id = req.body.transaction_id;
//     if (req.body.resale_quantity) {
//         var resale_quantity = req.body.resale_quantity;
//     }
//     else {
//         var resale_quantity = 1;
//     }
//     if (!transaction_id) {
//         return res.status(400).send({
//             success: false,
//             msg: "transaction_id required!!"
//         });
//     }
//     console.log("transaction_id=", transaction_id);
//     var qry = `select id from item_edition where id in (select item_edition_id from transaction_edition_purchase where transaction_id=${transaction_id}) and owner_id=${user_id} and is_sold=1 order by id limit ${resale_quantity}`;
//     await db.query(qry, async function (error, loop1) {
//         console.log(loop1.length);
//         for (var i = 0; i < loop1.length; i++) {

//             var updateData = {
//                 "price": price,
//                 "expiry_date": expiry_date,
//                 "end_date": expiry_date,
//                 "is_sold": 0,
//                 "resale_hash": hash,
//                 "user_address": user_address,
//                 "start_date": new Date(),
//                 "datetime": new Date()
//             }

//             await db.query(marketplaceQueries.resaleNFT, [updateData, loop1[i].id]);
//             var qry2 = `insert into transaction_edition_resale(transaction_id,item_edition_id)values(${transaction_id},${loop1[i].id})`;
//             db.query(qry2);
//             console.log("Resale ie_id ", loop1[i].id);

//         }


//         if (loop1) {
//             console.log(config.ethTransferApiUrl);
//             // console.log({
//             //     "from_address": config.contractOwnerAddress, //Admin Public Address
//             //     "from_private_key": apiKey,  //Admin Private Address
//             //     "to_address": user_address, //User To Address        
//             //     "value": price_eth
//             // });
//             var apiData = await openNFT(config.apiKey);

//             const response1 = await fetch(`${config.ethTransferApiUrl}`, {
//                 method: 'POST', headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     "from_address": config.contractOwnerAddress, //Admin Public Address
//                     "from_private_key": apiData,  //Admin Private Address
//                     "to_address": user_address, //User To Address        
//                     "value": price_eth
//                 })
//             });

//             /// SEND MAIL STARTS
//             qry = `select i.name,i.description,i.image,getUserFullName(${user_id}) as bidderName,getUserEmail(u.id) as ownerEmail,getUserEmail(${user_id}) as bidderEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=${item_edition_id}`;

//             await db.query(qry, async function (error, mailData) {
//                 emailActivity.Activity(mailData[0].ownerEmail, 'NFT published for resell.', `Your NFT ${mailData[0].name} if published for resell in $${price}.`, `itemdetails/${item_edition_id}`, `https://ipfs.io/ipfs/${mailData[0].image}`);
//             });
//             /// SEND MAIL ENDS    


//             res.status(200).send({
//                 success: true,
//                 msg: "NFT has been published for resell!",
//                 item_edition_id: item_edition_id

//             });
//         } else {
//             res.status(400).send({
//                 success: false,
//                 msg: "Something Wrong due to internal Error!"
//             });
//         }
//     });
// }


// exports.getContractDeatils = async (db, req, res) => {
//     console.log("in getContractDeatils");
//     res.status(200).send({
//         success: true,
//         msg: "Contract details!!",
//         adminAddress: config.contractOwnerAddress,
//         contractAddress: config.contractAddress,
//         blockchainNetwork: config.blockchainNetwork
//     });

// }


// exports.userSaleList = async (db, req, res) => {
//     console.log("in userSaleList");
//     var user_id = req.body.user_id;
//     console.log(user_id)
//     try {
//         await db.query('select item.name as name,user_collection.name as collection_name, image, price, sell_type, expiry_date from item LEFT JOIN user_collection ON item.user_collection_id = user_collection.id where owner_id=265 and is_sold=1 ORDER BY item.id', [user_id], function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (data.length > 0) {
//                 return res.status(200).send({
//                     success: true,
//                     msg: "User Item Details",
//                     response: data
//                 });
//             } else {
//                 return res.status(200).send({
//                     success: false,
//                     msg: "No Data"
//                 });
//             }
//         });
//     } catch (ee) {
//         return res.status(200).send({
//             success: false,
//             msg: "No Data",
//             error: ee
//         });
//     }
// }


// exports.putOnSale = async (db, req, res) => {
//     console.log("in userSaleList");
//     var item_id = req.body.item_id;
//     var sell_type = req.body.sell_type;
//     var price = req.body.price;

//     if (sell_type == 3 || !sell_type) {
//         return res.status(400).send({
//             success: false,
//             msg: "Sale method required!! "
//         });
//     }

//     if (sell_type != 3) {
//         if (!price || price === '0') {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Price required!! "
//             });
//         }
//     }

//     if (sell_type === '2') {
//         if (start_date.length === 0) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Start date required!! "
//             });
//         }

//         if (expiry_date.length === 0) {
//             return res.status(400).send({
//                 success: false,
//                 msg: "Expiry date required!! "
//             });
//         }
//     }

//     if (sell_type == '1') {
//         var start_date = null;
//         var expiry_date = null;
//         price = price;
//     } else {
//         price = price;
//         var start_date = req.body.start_date;
//         var expiry_date = req.body.expiry_date;
//     }

//     var arr = {
//         'sell_type': sell_type,
//         'price': price,
//         'start_date': start_date,
//         'expiry_date': expiry_date,
//         "is_on_sale": '1',
//         "is_sold": '0'
//     }
//     console.log(arr);
//     try {
//         await db.query(marketplaceQueries.putOnSale1, [arr, item_id], function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             else {
//                 return res.status(200).send({
//                     success: true,
//                     msg: "Item put on sale!!"
//                 });
//             }
//         });
//     } catch (ee) {
//         return res.status(200).send({
//             success: false,
//             msg: "No Data",
//             error: ee
//         });
//     }
// }


// exports.removeOnSale = async (db, req, res) => {
//     console.log("in userSaleList");
//     var item_id = req.body.item_id;
//     try {
//         await db.query(marketplaceQueries.checkBid, [item_id], async function (error, bidData) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             if (bidData.length > 0) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "You cannot delete this NFT as a bid is placed on it!!",
//                     error
//                 });
//             }

//             await db.query(marketplaceQueries.removeOnSale, [item_id], function (error, data) {
//                 if (error) {
//                     return res.status(400).send({
//                         success: false,
//                         msg: "Error occured!!",
//                         error
//                     });
//                 }
//                 else {
//                     return res.status(200).send({
//                         success: true,
//                         msg: "Item removed from sale!!"
//                     });
//                 }
//             });
//         });
//     } catch (ee) {
//         return res.status(200).send({
//             success: false,
//             msg: "No Data",
//             error: ee
//         });
//     }
// }


// exports.deleteNFT = async (db, req, res) => {
//     console.log("in deleteNFT");
//     var item_id = req.body.item_id;
//     try {
//         await db.query(marketplaceQueries.deleteNFT, [item_id], function (error, data) {
//             if (error) {
//                 return res.status(400).send({
//                     success: false,
//                     msg: "Error occured!!",
//                     error
//                 });
//             }
//             else {
//                 return res.status(200).send({
//                     success: true,
//                     msg: "NFT deleted!!"
//                 });
//             }
//         });
//     } catch (ee) {
//         return res.status(200).send({
//             success: false,
//             msg: "No Data",
//             error: ee
//         });
//     }
// }

exports.getItemAll = async (db, req, res) => {
    await db.query(marketplaceQueries.getItemAll, function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error Occured"
            })
        }
        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "Item Details",
                response: data[0]
            });
        } else {
            res.status(200).send({
                success: false,
                msg: "No data found!!"
            });
        }
    })
}

//=========================================== GET Help ================================================

exports.getBanner = async (db, req, res) => {
    await db.query(marketplaceQueries.getBanner, async function (error, data) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "Error occured!!",
                error
            });
        }

        if (data.length > 0) {
            res.status(200).send({
                success: true,
                msg: "BAnner Details !!",
                response: data
            });

        } else {
            res.status(400).send({
                success: false,
                msg: "No Data Found"
            });
        }

    });
}


//=================================  Update profile pic =====================================

exports.updateBanner = async (db, req, res) => {
    let content = req.body.content;
    let image = (!req.files['image']) ? null : req.files['image'][0].filename;
    db.query(marketplaceQueries.getBanner, [content], function (error, result1) {
        if (error) {
            return res.status(400).send({
                success: false,
                msg: "error occured",
                error
            });
        }

        if (!image) {
            image = result1[0].image;
        }

        let userData = {
            image: image,
            content:content
        }
        db.query(marketplaceQueries.updateBanner, [userData], function (error, result) {
            if (error) {
                return res.status(400).send({
                    success: false,
                    msg: "error occured",
                    error
                });
            }
            if (result) {
                res.status(200).send({
                    success: true,
                    msg: "Update Banner Successfully",
                });
            } else {
                res.status(200).send({
                    success: true,
                    msg: "update Profile Failed",
                });
            }
        })
    });
}
