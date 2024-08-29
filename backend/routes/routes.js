const jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var config = require('../config');
var db = require('../utils/connection');
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
router.use(bodyParser.json());
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        var filetype = '';
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'image/jpg') {
            filetype = 'jpg';
        }
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });
var userupload = upload.fields([{ name: 'profile_pic', maxCount: 1 }])
var bannerupload = upload.fields([{ name: 'image', maxCount: 1 }])

var sliderUpload = upload.fields([{ name: 'slider1', maxCount: 1 }, { name: 'slider2', maxCount: 8 }, { name: 'slider3', maxCount: 8 }, { name: 'logo', maxCount: 8 }, { name: 'favicon', maxCount: 8 }, { name: 'realEstateImage', maxCount: 8 }])
var realEstateImage = upload.fields([{ name: 'slider1', maxCount: 1 }, { name: 'slider2', maxCount: 8 }, { name: 'slider3', maxCount: 8 }])
var addnftImage = upload.fields([{ name: 'image', maxCount: 1 }])
var profileImages = upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'banner', maxCount: 1 }])
var collectionImages = upload.fields([{ name: 'profile_pic', maxCount: 1 }, { name: 'banner', maxCount: 1 }]);
var blogImage = upload.fields([{ image: 'profile_pic', maxCount: 1 }, { title: 'title', maxCount: 1 }, { description: 'description', maxCount: 1 }]);

// ---------------Controllers--------
const signup = require('../controllers/signup');
const admin = require('../controllers/admin/admin');
const getFile = require('../controllers/getFile');
const marketplace = require('../controllers/marketplace');

router.post('/login', signup.login.bind(this, db));
router.post('/getAboutDetail', signup.getAboutDetail.bind(this, db));
router.post('/updateAboutDetail', profileImages, signup.updateAboutDetail.bind(this, db));
router.post('/insertUserCollection', collectionImages, marketplace.insertUserCollection.bind(this, db));
router.post('/updateUserCollection', collectionImages, marketplace.updateUserCollection.bind(this, db));
// router.post('/deleteUserCollection',  marketplace.deleteUserCollection.bind(this, db));
router.post('/getSingleUserCollection', ensureWebToken, marketplace.getSingleUserCollection.bind(this, db));
router.post('/getUserCollection', marketplace.getUserCollection.bind(this, db));
router.post('/addNftByUser', addnftImage, marketplace.addNftByUser.bind(this, db));
router.get('/getSallerAddress', marketplace.getSallerAddress.bind(this, db));
router.get('/getGamesCategory', marketplace.getGamesCategory.bind(this, db));
router.post('/ItemDetailForEdit', marketplace.ItemDetailForEdit.bind(this, db))
router.get('/getCollection', marketplace.getCollection.bind(this, db));
router.post('/getUserDetails', signup.getUserDetails.bind(this, db));
router.post('/walletDeposit', ensureWebToken, marketplace.walletDeposit.bind(this, db));
router.post('/walletWithdraw', ensureWebToken, marketplace.walletWithdraw.bind(this, db));
router.post('/withdrawDepositList', ensureWebToken, marketplace.withdrawDepositList.bind(this, db));
router.post('/transactionDetail', marketplace.transactionDetail.bind(this, db));
router.get('/getcategory', marketplace.getCategory.bind(this, db));
router.post('/getUserItem', marketplace.getUserItem.bind(this, db));
router.post('/marketplace', marketplace.marketplace.bind(this, db));
router.post('/portfolio', marketplace.portfolio.bind(this, db));
router.post('/getAllUserCollection', marketplace.getAllUserCollection.bind(this, db));
router.post('/getCollectionById', marketplace.getCollectionById.bind(this, db));
router.post('/addSubscriber', marketplace.addSubscriber.bind(this, db));
router.post('/itemdetail', marketplace.itemDetails.bind(this, db));
router.post('/getPropertyDetails', marketplace.getPropertyDetails.bind(this, db));
router.post('/insertContact', marketplace.insertContact.bind(this, db));
router.get('/getContact', marketplace.getContact.bind(this, db));
router.get('/faqlist',admin.getfaqlist.bind(this,db))
router.post('/faqadd',admin.faqadd.bind(this,db))
router.post('/faqdelete',admin.faqdelete.bind(this,db))
router.post('/insertHelp', marketplace.insertHelp.bind(this, db));
router.get('/getHelp', marketplace.getHelp.bind(this, db));
// router.post('/userSaleList', marketplace.userSaleList.bind(this, db));
router.post('/nftPurchase', marketplace.nftPurchase.bind(this, db));
router.post('/getUserPurchase', ensureWebToken, marketplace.getUserPurchase.bind(this, db));
router.post('/getUserSale', marketplace.getUserSale.bind(this, db));
router.post('/insertBid', marketplace.insertBid.bind(this, db));
router.post('/putOnSale', marketplace.putOnSale.bind(this, db));
// router.post('/removeOnSale',ensureWebToken, marketplace.removeOnSale.bind(this, db));
// router.post('/deleteNFT',ensureWebToken, marketplace.deleteNFT.bind(this, db));
router.post('/allSearch', marketplace.allSearch.bind(this, db));
router.post('/getUserBids', marketplace.getUserBids.bind(this, db));
router.post('/myBidItem', marketplace.myBidItem.bind(this, db));
router.post('/getMarketActivity', marketplace.getMarketActivity.bind(this, db));
router.post('/itemView', marketplace.itemView.bind(this, db));
// router.post('/cancelBid', ensureWebToken, marketplace.cancelBid.bind(this, db));
router.post('/getBidDetail', marketplace.getBidDetail.bind(this, db));
router.post('/supportListByCategory', marketplace.supportListByCategory.bind(this, db));
router.post('/getItemBidDetail', marketplace.getItemBidDetail.bind(this, db));
router.post('/checkExpiry', marketplace.checkExpiry.bind(this, db));
router.post('/bidAccept', marketplace.bidAccept.bind(this, db));
router.post('/bidAcceptCron', marketplace.bidAcceptCron.bind(this, db));
router.post('/rankingCollection', marketplace.rankingCollection.bind(this, db));
router.post('/getUserTransaction', marketplace.getUserTransaction.bind(this, db));
router.get('/getWithdrawHistory', admin.getWithdrawHistory.bind(this, db));
router.get('/bidCron', marketplace.bidCron.bind(this, db));
router.post('/createNewPolicy', ensureWebToken, marketplace.createNewPolicy.bind(this, db));
router.post('/checkPolicyId', ensureWebToken, marketplace.checkPolicyId.bind(this, db));
router.post('/getCollectionCategoryNft', marketplace.getCollectionCategoryNft.bind(this, db));
router.post('/likeItem', marketplace.likeItem.bind(this, db));
router.post('/createMetadata', marketplace.createMetadata.bind(this, db));



///////////admin apis
router.get('/getAllCollection', admin.getAllCollection.bind(this, db));
router.get('/getAdminCollection', admin.getAdminCollection.bind(this, db));
router.post('/updateAdminCollection', admin.updateAdminCollection.bind(this, db));
router.post('/deleteAdminCollection', admin.deleteAdminCollection.bind(this, db));
router.get('/getTransactionHistory', admin.getTransactionHistory.bind(this, db));
router.get('/getPrivacypolicy', admin.getPrivacypolicy.bind(this, db));
router.post('/updateprivacyAndPolicy', admin.updateprivacyAndPolicy.bind(this, db));
router.get('/getTermsConditions', admin.getTermsConditions.bind(this, db));
router.post('/updateTermsConditions', admin.updateTermsConditions.bind(this, db));
router.get('/getAbout', admin.getAbout.bind(this, db));
router.post('/updateAbout', admin.updateAbout.bind(this, db));
//router.post('/addBlog',blogImage, admin.addBlog.bind(this, db));
router.post('/insertSupport', admin.insertSupport.bind(this, db));
router.post('/updateSupport', admin.updateSupport.bind(this, db));
router.post('/deleteSupport', admin.deleteSupport.bind(this, db));
router.get('/getSupportCategory', admin.getSupportCategory.bind(this, db));
router.get('/supportList', admin.supportList.bind(this, db));
router.post('/supportListById', admin.supportListById.bind(this, db));
router.get('/getFees', admin.getFees.bind(this, db));
router.post('/updateFees', admin.updateFees.bind(this, db));
router.post('/getAllTransaction', admin.getAllTransaction.bind(this, db));
router.post('/deleteUserCollection', admin.deleteUserCollection.bind(this, db));
router.post('/insertAdminCollection', collectionImages, admin.insertAdminCollection.bind(this, db));
router.get('/getTransactionFilter', admin.getTransactionFilter.bind(this, db));
router.post('/addUserCollectionFeatured', admin.addUserCollectionFeatured.bind(this, db));
router.post('/addAdminCollectionFeatured', admin.addAdminCollectionFeatured.bind(this, db));
router.post('/addUserNftFeatured', admin.addUserNftFeatured.bind(this, db));
router.post('/userInativate', admin.userInativate.bind(this, db));
router.post('/userActive', admin.userActive.bind(this, db));
//router.post('/userNftVerifiedTag', admin.userNftVerifiedTag.bind(this, db));
router.post('/updateNftByUser', addnftImage, marketplace.updateNftByUser.bind(this, db));
router.post('/addOnSale', admin.addOnSale.bind(this, db));
router.get('/getOnSale', admin.getOnSale.bind(this, db));
router.post('/getUserNftById', admin.getUserNftById.bind(this, db));
router.post('/hideCollection', admin.hideCollection.bind(this, db));
router.post('/showCollection', admin.showCollection.bind(this, db));
router.get('/getFees', admin.getFees.bind(this, db));
router.post('/updateFees', admin.updateFees.bind(this, db));
router.get('/getTransactionFee', admin.getTransactionFee.bind(this, db));
router.post('/updateTransactionFee', admin.updateTransactionFee.bind(this, db));
router.post('/addAdminNftFeatured', admin.addAdminNftFeatured.bind(this, db));
router.get('/getGamesCategory', admin.getGamesCategory.bind(this, db));
router.post('/updateGamesCategory', admin.updateGamesCategory.bind(this, db));
router.post('/deleteGamesCategory', admin.deleteGamesCategory.bind(this, db));
router.post('/singleGamesCategory', admin.singleGamesCategory.bind(this, db));
router.post('/insertGamesCategory', admin.insertGamesCategory.bind(this, db));




//////////////////////////////////////////////////





//==============Post Status API ===================================
router.post('/adminlogin', admin.login.bind(this, db));
router.get('/getfooter', admin.getFooter.bind(this, db));

router.get('/getwebcontent', admin.getWebContent.bind(this, db));
router.get('/getmarketplace', admin.getMarketPlace.bind(this, db));

router.post('/insertmarketplace', ensureWebToken, admin.insertMarketPlace.bind(this, db));

router.post('/updatefooter', ensureWebToken, admin.updateFooter.bind(this, db));
router.post('/updatewebcontent', ensureWebToken, admin.updateWebContent.bind(this, db));


/*--------- Item Category ---------*/
router.post('/insertcategory', admin.insertCategory.bind(this, db));

router.get('/getDigitalCategory', admin.getDigitalCategory.bind(this, db));
router.get('/getUserDigitalCategory', admin.getUserDigitalCategory.bind(this, db));
router.get('/getRealEstateCategory', admin.getRealEstateCategory.bind(this, db));
router.get('/getUserRealEstateCategory', admin.getUserRealEstateCategory.bind(this, db));
router.post('/singlecategory', admin.singleCategory.bind(this, db));
router.post('/singlecategory', admin.singleCategory.bind(this, db));
router.get('/getNftType', admin.getNftType.bind(this, db));
router.post('/updatecategory', admin.updateCategory.bind(this, db));
router.post('/deletecategory', admin.deleteCategory.bind(this, db));
router.get('/getuser', admin.getUsers.bind(this, db));
router.get('/dashboarditem', admin.dashboardItem.bind(this, db));
router.get('/getUserTelent', admin.getTelentUsers.bind(this, db));
router.get('/getRealEstateUsers', admin.getRealEstateUsers.bind(this, db));


/*--------- End Category ---------*/

/*--------- Item  ---------*/
router.post('/insertitem', addnftImage, admin.insertItem.bind(this, db));
router.post('/deleteitem', ensureWebToken, admin.deleteItem.bind(this, db));
router.post('/updateitem', admin.updateItem.bind(this, db));
router.post('/updateNftItem', ensureWebToken, admin.updateNftItem.bind(this, db));



router.get('/getitem', admin.getItem.bind(this, db));
router.get('/getAdminItem', admin.getAdminItem.bind(this, db));
router.get('/getAdminNFT', admin.getAdminNFT.bind(this, db));
router.post('/removeFeatured', ensureWebToken, admin.removeFeatured.bind(this, db));
router.post('/addFeatured', ensureWebToken, admin.addFeatured.bind(this, db));

router.post('/showNFT', ensureWebToken, admin.showNFT.bind(this, db));
router.post('/hideNFT', ensureWebToken, admin.hideNFT.bind(this, db));

router.post('/listitem', admin.listItem.bind(this, db));
router.post('/listAdminItem', admin.listAdminItem.bind(this, db));
router.post('/listSingleItem', admin.listSingleItem.bind(this, db));
router.get('/getWebImage', admin.getWebImage.bind(this, db));
router.get('/getRealEstateImage', admin.getRealEstateImage.bind(this, db));
//router.post('/updateWebImage',admin.updateWebImage.bind(this, db));
router.post('/updateWebImage', sliderUpload, ensureWebToken, admin.updateWebImage.bind(this, db));
router.post('/updateRealEstateImage', realEstateImage, ensureWebToken, admin.updateRealEstateImage.bind(this, db));


/*--------- End Item ---------*/

/*--------- Marketplace ---------*/
router.post('/testmail', marketplace.testmail.bind(this, db));
router.post('/test', marketplace.test.bind(this, db));


// router.post('/getjwttoken', marketplace.getJWTToken.bind(this, db));


// router.post('/addTelent', marketplace.addTelent.bind(this, db));
// router.post('/addRealEstateUser', ensureWebToken, marketplace.EstateUser.bind(this, db));

// router.post('/addWishlist', ensureWebToken, marketplace.addWishlist.bind(this, db));
// router.post('/listWishlist', marketplace.listWishlist.bind(this, db));
// router.post('/removeWishlist', ensureWebToken, marketplace.removeWishlist.bind(this, db));

// router.post('/addCart', ensureWebToken, marketplace.addCart.bind(this, db));
// router.post('/listCart', marketplace.listCart.bind(this, db));
// router.post('/removeCart', ensureWebToken, marketplace.removeCart.bind(this, db));

// router.post('/ItemDetailForEdit', marketplace.ItemDetailForEdit.bind(this, db));
// router.post('/getUserTelent', marketplace.getUserTelent.bind(this, db));








// router.post('/updateTelentForApproved', marketplace.updateTelentForApproved.bind(this, db));
// router.post('/updateTelentForReject', marketplace.updateTelentForReject.bind(this, db));
// router.post('/realEstateUserReject', marketplace.realEstateUserReject.bind(this, db));
// router.post('/realEstateUserApprove', marketplace.realEstateUserApprove.bind(this, db));
// router.post('/getRealEstateStatus', marketplace.getRealEstateStatus.bind(this, db));

router.post('/bulkNftMint', addnftImage, marketplace.bulkNftMint.bind(this, db));
router.post('/getLocalImageHash', marketplace.getLocalImageHash.bind(this, db));
router.post('/addBulkNftByUser', marketplace.addBulkNftByUser.bind(this, db));
router.post('/getBulkSellList', marketplace.getBulkSellList.bind(this, db));
// router.post('/insertRealEstateCollection', ensureWebToken, marketplace.insertRealEstateCollection.bind(this, db));
// router.post('/getRealEstateCollection', marketplace.getRealEstateCollection.bind(this, db));
// router.post('/getPayoutAddress', marketplace.getPayoutAddress.bind(this, db));
router.post('/getRoyaltyTransaction', marketplace.getRoyaltyTransaction.bind(this, db));
// router.get('/getAllRoyaltyTransaction', marketplace.getAllRoyaltyTransaction.bind(this, db));
// router.post('/resaleNFT', ensureWebToken, marketplace.resaleNFT.bind(this, db));



// router.post('/getQR', marketplace.getQR.bind(this, db));
// router.post('/twoAuthenticationVerify', marketplace.twoAuthenticationVerify.bind(this, db));
// router.post('/getCategoryById', marketplace.getCategoryById.bind(this, db));


// router.post('/paypalPurchase', marketplace.paypalPurchase.bind(this, db));
// router.post('/circlePurchase', marketplace.circlePurchase.bind(this, db));




// router.post('/getTelentStatus', marketplace.getTelentStatus.bind(this, db));
// router.post('/paymentReceived', marketplace.paymentReceived.bind(this, db));
// router.post('/cryptoTrxCanceled', ensureWebToken, marketplace.cryptoTrxCanceled.bind(this, db));
// router.post('/onlinetrx_start', ensureWebToken, marketplace.onlinetrx_start.bind(this, db));
// router.post('/nftTrx_start', ensureWebToken, marketplace.nftTrx_start.bind(this, db));


// router.post('/charge', ensureWebToken, marketplace.charge.bind(this, db));
//router.post('/stripe_success',marketplace.stripe_success.bind(this,db));
// router.post('/stripePayment', ensureWebToken, marketplace.stripePayment.bind(this, db));
// router.post('/paypalMintPayment', marketplace.paypalMintPayment.bind(this, db));
// router.post('/circleMintPayment', marketplace.circleMintPayment.bind(this, db));
// router.post('/paypalResalePayment', marketplace.paypalResalePayment.bind(this, db));
// router.post('/circleResalePayment', marketplace.circleResalePayment.bind(this, db));
// router.post('/walletPayment', ensureWebToken, marketplace.walletPayment.bind(this, db));
// router.post('/walletResalePayment', ensureWebToken, marketplace.walletResalePayment.bind(this, db));



// router.get('/getRecentWorks', marketplace.getRecentWorks.bind(this, db));
// router.post('/allTalentList', marketplace.allTalentList.bind(this, db));



// router.post('/getItemLikeCount', marketplace.getItemLikeCount.bind(this, db));
// router.post('/getWalletDetail', marketplace.getWalletDetail.bind(this, db));



// router.get('/allCategoryItem', marketplace.allCategoryItem.bind(this, db));
// router.post('/addRealEstate', marketplace.addRealEstate.bind(this, db));
// router.post('/getRealEstateItem', marketplace.getRealEstateItem.bind(this, db));
// router.get('/getAllRealEstateCollection', marketplace.getAllRealEstateCollection.bind(this, db));

// router.post('/updateRealEstateUser', ensureWebToken, marketplace.updateRealEstateUser.bind(this, db));
// router.post('/updateTalentUser', ensureWebToken, marketplace.updateTalentUser.bind(this, db));
// router.get('/getRealEstate', marketplace.getRealEstate.bind(this, db));
// router.post('/getUserRealEstate', marketplace.getUserRealEstate.bind(this, db));
// router.post('/getUserTalentById', marketplace.getUserTalentById.bind(this, db));
// router.post('/updatePayoutAddress', ensureWebToken, marketplace.updatePayoutAddress.bind(this, db));
// router.get('/getContractDeatils', marketplace.getContractDeatils.bind(this, db));
// router.get('/getRoyaltyList', marketplace.getRoyaltyList.bind(this, db));
// router.post('/getWalletTransaction', ensureWebToken, marketplace.getWalletTransaction.bind(this, db));
// router.post('/resaleTrxStart', ensureWebToken, marketplace.resaleTrxStart.bind(this, db));

//router.post('/imageSave',marketplace.imageSave.bind(this,db));



/*--------- End Marketplace ---------*/


// /*--------- explorer start ---------*/
// router.post('/listItemexplorer',explorer.listItemexplorer.bind(this,db));
// router.post('/itemdetails',explorer.itemdetails.bind(this,db));
// router.post('/userwallet',explorer.userwallet.bind(this,db));
// router.post('/useritem',explorer.useritem.bind(this,db));
// router.post('/getCreatorItem',explorer.getCreatorItem.bind(this,db));
// router.post('/userholder',explorer.userHolder.bind(this,db));
// router.post('/useritemdetail',explorer.userItems.bind(this,db));
// router.post('/getWalletTrx',explorer.getWalletTrx.bind(this,db));
// router.post('/hashdetail',explorer.hashDetail.bind(this,db));
// router.post('/explorerSearch',explorer.explorerSearch.bind(this,db));
// /*--------- End explorer ---------*/


router.get("/uploads/:image", getFile.getImage);

router.post('/updateProfilePic', userupload, signup.updateProfilePic.bind(this, db));
router.post('/getProfilePic', signup.getProfilePic.bind(this, db));


router.post('/follow', signup.follow.bind(this, db))
router.post('/insertView', signup.insertView.bind(this, db));
router.post('/getUserDetail', signup.getUserDetail.bind(this, db))





router.post('/deleteuser', ensureWebToken, admin.deleteUser.bind(this, db));
router.post('/updateprofilepic', ensureWebToken, admin.insertProfilePic.bind(this, db));
router.post('/adminprofilepic', admin.getProfilePic.bind(this, db));
router.post('/adminpassword', admin.changePassword.bind(this, db));
router.post('/updateWallet', ensureWebToken, admin.updateWallet.bind(this, db));

router.post('/register', userupload, signup.register.bind(this, db));
router.post('/verifyAccount/:token', signup.activateAccount.bind(this, db));

router.get('/getItemAll',marketplace.getItemAll.bind(this,db))
router.get('/getBanner', marketplace.getBanner.bind(this, db));
router.post('/updateBanner', bannerupload, marketplace.updateBanner.bind(this, db));


// router.post('/login', login.login.bind(this, db));
router.post('/forgot', signup.forgot.bind(this, db));
router.post('/resetpassword/:token', signup.Resetpassword.bind(this, db));
router.post('/getuserprofile', signup.getUserProfile.bind(this, db));
router.post('/updateuserprofile', signup.userProfile.bind(this, db));
router.post('/deactivate', ensureWebToken, signup.deActivateAccount.bind(this, db));
router.post('/changepassword', signup.changePassword.bind(this, db));
router.get('/getcountries', signup.getCountry.bind(this, db));
router.get("/", function (request, response) {
    response.contentType("routerlication/json");
    response.end(JSON.stringify("Node is running"));
});

router.get("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

router.post("*", function (req, res) {
    return res.status(200).json({
        code: 404,
        data: null,
        msg: "Invalid Request {URL Not Found}",
    });
});

function ensureWebToken(req, res, next) {

    const x_access_token = req.headers['authorization'];
    if (typeof x_access_token !== undefined) {
        req.token = x_access_token;
        verifyJWT(req, res, next);
    } else {
        console.log('4444444')
        res.sendStatus(403);

    }
}

// async function verifyJWT(req, res, next) {

//     jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
//         if (err) {
//             res.sendStatus(401);
//         } else {
//             const _data = await jwt.decode(req.token, {
//                 complete: true,
//                 json: true
//             });
//             req.user = _data['payload'];
//             next();
//         }
//     })
// }

async function verifyJWT(req, res, next) {
    jwt.verify(req.token, config.JWT_SECRET_KEY, async function (err, data) {
        if (err) {
            console.log('66666666')
            res.sendStatus(403);
        } else {
            const _data = await jwt.decode(req.token, {
                complete: true,
                json: true
            });
            req.user = _data['payload'];
            if (req.body.is_admin == 1) {
                if (req.user.email != req.body.email) {
                    console.log('66666668886')
                    return res.sendStatus(403);
                }
                next();
            } else {
                if (req.user.email != req.body.address) {
                    console.log('66666668886')
                    return res.sendStatus(403);
                }
                next();
            }
            // console.log


        }
    })
}

module.exports.routes = router;
