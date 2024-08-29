
var db = require('../utils/connection');
const config = require('../config');

module.exports = {
   getWalletDetail: "select u.user_name, uw.user_id,uw.wallet_name,uw.wallet_password,uw.public,uw.private,coalesce(sum(t.amount),0) as balance from user_wallet as uw left join transaction as t on t.user_id=uw.user_id and t.status=1 and transaction_type_id in (1,6,3,5,10,8,11) left join users as u on uw.user_id=u.id where uw.user_id= ? group by uw.user_id,uw.public ",
   userWallet: "Select * from user_wallet where user_id =?",

   propertyDetails: "SELECT * FROM item_attributes WHERE item_id = ?",
   getBulkSellList: 'Select item.*, bulk_nft_master.folder_name from item LEFT JOIN bulk_nft_master ON item.bulk_nft_master_id = bulk_nft_master.id where item.owner_id =? AND item.bulk_nft_master_id != 0 and item.is_minted  = 0 ORDER BY item.id DESC ',
   adminWallet: "Select * from admin_wallet",
   insertTransaction: "insert into transaction SET ?",
   withdrawDepositList: "SELECT t.id as transaction_id,t.amount,tt.name as transaction_type,t.transaction_type_id,u.full_name,t.to_address,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date,ts.name as status,t.hash   FROM transaction as t left join transaction_status as ts on ts.id=t.status left join users as u on u.id=t.user_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? and t.transaction_type_id in(3,11) and t.amount<>0 order by t.id desc",
   getTransactionDetail: "Select i.name as item_name,i.image,i.file_type,case when i.transfer_hash is not null then concat('https://etherscan.io/tx/',i.transfer_hash) else t.receipt_url end as transfer_hash,u.user_name,u.profile_pic,t.*,'' as edition_text,abs(t.amount) as amount,date_format(t.datetime,'%d-%M-%y %H:%i:%s') as datetime,case when t.status=0 then 'Pending' when t.status=1 then 'Completed' else 'Rejected' end as status,tc.name as type_name from transaction as t left join item as i ON i.id=t.item_id  LEFT JOIN users as u ON i.owner_id=u.id LEFT JOIN transaction_type as tc ON t.transaction_type_id=tc.id where t.id=? ORDER BY t.id DESC limit 1",
   insertUserCollection: "insert into user_collection SET ?",
   deleteUserCollection: "Delete from user_collection  where id=?",
   updateUserCollection: "update user_collection SET ?  where id=? ",
   getSingleUserCollection: "Select *,id as collection_id from user_collection where id=?",
   getSingleCollectionDetails: "SELECT user_collection.max_nft_supply , COUNT(item.id) as totalNft, user_collection.policy_id FROM user_collection LEFT JOIN item on user_collection.id = item.user_collection_id WHERE user_collection.id = ? ",
   category: "select ic.id,ic.name,getCategoryItem(ic.id) as nft_count from item_category as ic order by ic.name",
   insertItem: "insert into item SET ?",
   insertItemAttr: "insert into item_attributes SET ?",
   deleteAttribute: "DELETE from item_attributes WHERE item_id = ? ",
   getItemLike: "select * from item_like where item_id= ? and user_id = ?",
   deleteItemLike: "DELETE from item_like where item_id= ? and user_id = ?",
   insertItemLike: "INSERT INTO item_like SET ?",
   getSubscriber: "Select * from subscriber where email=?",
   addSubscriber: "insert into subscriber SET ?",
   createFolder: "insert into bulk_nft_master SET ?",
   itemdetail: `SELECT i.id as item_id, i.blockchainType ,i.asset_id, i.minimum_bid ,i.user_collection_id, i.file_type ,date_format(i.expiry_date,'%d %M %Y %H:%i:%s') as expiry_date,date_format(i.expiry_date,'%Y-%m-%d') as expiry_date1, i.start_date, i.is_sold,i.owner_id as user_id,itemViewCount(i.id) as view_count,case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,imageArray(?) as image_array,i.description,i.image,i.image_original,i.metadata,i.file_type,uo.full_name as owner,uo.profile_pic as owner_profile_pic,i.owner_id,i.created_by,uc.full_name as creator,uc.profile_pic as creator_profile_pic,i.item_category_id,i.sell_type, case when i.sell_type=1 then 'Buy' else 'Place a bid' end as sell_type_name,ic.name as category_name,i.token_id,concat('https://etherscan.io/tx/',i.token_hash) as token_hash,i.price, case when iel.id is null then 0 else 1 end as is_liked,itemLikeCount(i.id) as like_count,concat(case when i.price>coalesce(bi.bid_price,0) then i.price else bi.bid_price end,'') as max_bid,case when i.start_date<=CURRENT_DATE or i.start_date is null  then 'Live' else 'Upcoming' end as nft_type,date_format(i.start_date,'%Y-%m-%d') as start_date1,i.end_date,isResale(i.id) as is_resale,concat('${config.mailUrl}backend/uploads/',i.local_image) as local_image,itemViewCount(i.id) as view_count,itemLikeCount(i.id) as like_count,'${config.contractAddress}' as contract_address,round(i.price,2) as usd_price,'BEP-721' as standard, 'Cardano' as blockchain,i.royalty_percent,coalesce(getAllCollectionItem(cl.id),0)as item_count,coalesce(getCollectionOwners(cl.id),0) as owner_count,coalesce(getCollectionFloorPrice(cl.id),0) as floor_price,coalesce(getCollectionTradeVolume(cl.id),0) as trad_volume,cl.id as collection_id,cl.name as collection_name,cl.policy_id as collection_policy_id, concat('${config.mailUrl}backend/uploads/',cl.profile_pic) as collection_pic,i.is_on_sale,i.txHash from item as i left join item_category as ic on ic.id=i.item_category_id  LEFT JOIN item_like as iel on iel.item_id=i.id and iel.user_id= ? left join (select item_id,max(bid_price) as bid_price from  item_bid where item_id=? and status=0) as bi on bi.item_id=i.id left join users as uo on uo.id=i.owner_id left join users as uc on uc.id=i.created_by LEFT JOIN user_collection as cl ON cl.id = i.user_collection_id  where i.id = ? and i.is_active=1`,

   insertContacts: "insert into contact_us SET ?",
   getContact: "Select * from contact_us",
   insertHelp: "insert into help_center SET ?",
   getHelp: "Select * from help_center",
   insertRoyaltyTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,currency,status) select i.created_by,i.id,8 as transaction_type_id,? as price,'ETH' AS currency,1 as status from item as i where i.id=?",
   bidReversal: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,currency,status) select ib.user_id,ib.item_id,16 as transaction_type_id,ib.bid_price as price,'ETH' AS currency,1 as status from item_bid as ib where ib.item_id=? and status=0",
   insertBuyTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,status,hash,transfer_hash, crypto_amount )select ?,i.id,3,? as price, 1, ?, ?, ? from item as i where i.id =?",
   updateSold: "update item  SET  is_sold = ?,owner_id=?,is_on_sale=0 where id=?",
   insertSellTransactionByItemId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,hash ,currency,status, to_address) select i.owner_id,i.id,1 as transaction_type_id, ? as price,? as hash,? AS currency,1  as status, ? as to_address from item as i where i.id=?",
   getSettingData: "select * from settings",
   insertBid: "insert into item_bid SET ?",
   putOnSale: "update item set is_on_sale=1 , is_sold=0 where id=?",
   putOnSale1: "update item set ? where id=?",
   removeOnSale: "update item set is_on_sale=0, is_sold=1 where id=?",
   deleteNFT: "update item set is_active=0 where id=?",
   getUserBids: "select ib.id as bid_id,t.id as transaction_id,u.id as user_id,u.full_name,u.email,i.id as item_id,i.name as item_name,i.description,i.image,i.file_type,ib.bid_price,case when ib.status=2 then 'Cancelled' else case when getMaxBid(i.id)> ib.bid_price then 'Outbid' else  case when ib.status=0 then 'Pending' when ib.status=1 then 'Accepted' else 'Outbid' end end end as status,ib.status as status_id,date_format(ib.datetime,'%d-%M-%y') as bid_datetime,date_format(i.datetime,'%d-%M-%y') as nft_datetime,cu.full_name as creator,ou.full_name as owner_name,i.price as item_price,getMaxBid(i.id) as max_bid,ou.id as owner_id from transaction as t inner join  item_bid as ib on ib.transaction_id=t.id  and ib.user_id=? left join item as i on i.id=ib.item_id left join users as u on u.id=ib.user_id  left join users as cu on cu.id=i.created_by left join users as ou on ou.id=i.owner_id  where t.user_id=? and t.transaction_type_id=4  order by ib.id desc",
   myBidItem: "SELECT i.id as item_id,i.name as item_name,i.description,i.image,i.file_type,ic.name as item_category,i.price,date_format(i.datetime,'%d-%M-%y') as create_date,uc.id as collection_id,uc.name as collection_name,getMaxBid(i.id) as max_bid from  item as i left join item_category as ic on ic.id=i.item_category_id left join user_collection as uc on uc.id=i.user_collection_id where i.owner_id=? and i.is_sold=0 and i.id in (select distinct item_id from item_bid where status=0 ) order by i.id desc",
   itemView: "insert into item_view set ?",
   cancelBid: "UPDATE item_bid set status=2 where id = ?",
   getMarketActivity: "select t.id as transaction_id,case when tt.id=6 then 'Purchased for ' when tt.id=4 then 'Placed an offer for ' when tt.id=2 then 'Accepted bid offer for  ' when tt.id=9 then 'Published for resell ' when tt.id=12 then 'Transafer NFT ' when tt.id=13 then 'Received NFT ' when tt.id=1 then 'Accept Bid ' end as transaction_type,abs(t.amount) as amount,date_format(t.datetime,'%d %M %Y') as transaction_date,t.item_id,i.name,i.image, i.blockchainType,u.full_name,u.profile_pic,u.id as user_id From transaction as t left join transaction_type as tt on tt.id=t.transaction_type_id left join item as i on i.id =t.item_id left join users as u on u.id=t.user_id where i.id=? and transaction_type_id in (1, 3,4) and t.status=1 union ALL select 0 as transaction_id,'Minted NFT' as transaction_type,i.price,date_format(i.datetime,'%d %M %Y') as transaction_date,i.id as item_id,i.name,i.image,i.blockchainType,u.full_name,u.profile_pic,u.id as user_id from item as i left join users as u on u.id=i.created_by where i.id=? order by transaction_id desc",
   checkBid: "select * from item_bid where item_id=? and status=0",
   getItemBidDetail: "select t.id as transaction_id,case when tt.id=6 then 'Purchased for ' when tt.id=4 then 'Placed an offer for ' when tt.id=2 then 'Accepted bid offer for  ' when tt.id=9 then 'Published for resell ' end as transaction_type,abs(t.amount) as amount,date_format(t.datetime,'%d %M %Y') as transaction_date,t.item_id,i.name,i.image,u.full_name,u.profile_pic,u.id as user_id From transaction as t left join transaction_type as tt on tt.id=t.transaction_type_id left join item as i on i.id =t.item_id left join users as u on u.id=t.user_id where i.id=? and transaction_type_id in (4) and t.status=1 order by t.id desc",
   getBidDetail: "Select bd.id as bid_id,u.id as user_id, i.token_id ,u.user_name,u.address,u.full_name,u.profile_pic,i.id as item_id,i.name as item_name,bd.bid_price,DATE_FORMAT(bd.datetime,'%d-%M-%Y %H:%i:%s') AS datetime from item_bid as bd left join item as i ON i.id = bd.item_id LEFT JOIN users as u ON bd.user_id=u.id  where bd.id in (select max(id) from item_bid where item_id= ? and status=0 group by user_id) order by bd.id desc, bd.user_id Desc",
   supportListByCategory: "select s.id as support_id,sc.id as category_id,sc.name as support_category, s.question,s.answer from support as s left join support_category as sc on sc.id=s.category_id where sc.id=?",
   getBidRecord: "select *,isResale(item_id) as is_resale, users.address as to_address from item_bid LEFT JOIN users on item_bid.user_id = users.id where item_bid.id = ?",
   ownerDetail: "select uw.user_id,uw.wallet_name,uw.wallet_password,uw.public,uw.private,isResale(?) as is_resale from user_wallet as uw where uw.user_id in (select owner_id from item where id=?)",
   insertSellTransactionByBidId: "INSERT INTO transaction (user_id,item_id,transaction_type_id,amount,hash,transfer_hash,currency,status,item_bid_id)select i.owner_id as user_id,i.id as item_id,1 as transaction_type_id,ib.bid_price*.1 as amount,?,?, 'ETH' as currency,1 as status,ib.id as item_bid_id from item_bid  as ib left join item as i on i.id=ib.item_id where ib.id =?",
   updateSold2: "update item SET  is_sold = ?, is_on_sale=0, owner_id=? where id=?",
   updateItemBid: "update item_bid set status=3  where item_id=? and id<>? and status=0",
   updateItemBid2: "update item_bid set status=1  where  id=?",
   insertBuyTransactionByBidId: "INSERT INTO transaction (user_id,item_id,item_bid_id,transaction_type_id,hash,currency,status,amount)select ?,item_id,id,2,?,'ETH',1,bid_price*-1 from item_bid where id =?",
   getUserTransaction: "SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,i.id as item_id,i.name as item_name,i.description,i.image,t.amount,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date  FROM transaction as t left join users as u on u.id=t.user_id left join  item as i on i.id=t.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? order by t.id desc limit 20",
   getRoyaltyTransaction: "SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,i.id as item_id,i.name as item_name,i.description,i.image,t.amount,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date,i.file_type,concat(i.royalty_percent,'%') as royalty_percent  FROM transaction as t left join users as u on u.id=t.user_id left join item as i on i.id=t.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? and t.transaction_type_id=8 and amount>0 order by t.id desc",
   bidStatusChange: "Update item_bid set status=? where item_id=? and status=0",
   getExpiredBid: "select i.id as item_id,i.name,i.description,i.expiry_date,count(ib.id) as bid_count,max(bid_price) as bid_price,max(ib.id) as max_bid_id  from item as i left join item_bid as ib on ib.item_id=i.id where  i.sell_type=2 and i.expiry_date<now() and i.is_sold=0 group by i.id,i.name,i.description,i.expiry_date;",
   getBidData: "select * from item_bid where id =?",
   checkExpiry: "select sum(is_expired) as is_expired from (select 0 as is_expired union all select case when (expiry_date>now() or expiry_date is null or expiry_date='0000-00-00 00:00:00') then 0 else 1 end as is_expired from item where id =?) as a;",
   updateTransaction: "update transaction SET ? where id =?",
   getSettings: "select * from settings",
   getPublicCollection: "SELECT * FROM user_collection where is_hide=0 order by id desc",
   getCollectionCategoryNft: "SELECT * FROM user_collection  where is_hide=0",
   getUserCollection: "Select *,id as collection_id from user_collection where user_id =? and is_hide=0 order by id desc ",
   getBanner: "Select * from banner_image",
   updateBanner: "update banner_image SET ?",
   updateItem: "update item set ? where id =?",

















   //     updateSoldStripe :  "update item_edition SET  is_sold = ?,owner_id=?,payment_id=?,receipt_url=?,user_address=? where id=?",


   //     getUserDetail:"select * from users where id =?",
   //     addTelent : "insert into telent SET ?",
   //     addRealEstateUser : "insert into real_estate_user SET ?",
   //     listWishlist : "select uw.id as wishlist_id,u.id as user_id,u.email,i.name,i.edition_type,i.description,i.image,i.file_type,ic.name as item_category,i.token_id,i.price,i.is_sold,i.is_trending from user_wishlist as uw left join users as u on u.id=uw.user_id left join item as i on i.id=uw.item_id left join item_category as ic on ic.id=i.item_category_id where uw.user_id = ?",
   //     removeWishlist: "DELETE FROM user_wishlist where id= ?",
   //     addCart : "insert into user_cart SET ?",
   //     listCart : "select uc.id as cart_id,u.id as user_id,u.email,i.name,i.edition_type,i.owner,i.description,i.image,i.file_type,ic.name as item_category,i.token_id,i.price,i.is_sold,i.is_trending,cart_total(?) as cart_total from user_cart as uc left join users as u on u.id=uc.user_id left join item as i on i.id=uc.item_id left join item_category as ic on ic.id=i.item_category_id where uc.user_id = ?",
   //     removeCart: "DELETE FROM user_cart where id= ?",

   ItemDetailForEdit: "SELECT i.id as item_id,i.name,i.description,i.image,i.file_type,ic.name as item_category_name,i.item_category_id,i.item_subcategory_id,i.price,i.sell_type,date_format(i.expiry_date,'%m/%d/%Y') as expiry_date,i.quantity,date_format(i.start_date,'%m/%d/%Y') as start_date from item as i left join item_category as ic on ic.id=i.item_category_id where i.id=?",
   //    itemCategory:"Select i.*,case when length(i.name)>=30 then concat(left(i.name,30),'...')  else i.name end as name,ie.id as item_edition_id,ie.is_sold from item_edition as ie left join item as i on i.id=ie.item_id where i.item_category_id = ? and ie.id !=? and i.is_active=1 and ie.id in (select min(id) from item_edition where is_sold=0 group by item_id) limit 3 ",
   //    updateRealEstateUser :  "Update real_estate_user SET  first_name=?,last_name=?,email=?,country_id=?,city=?,description=?,website=?,insta=?  where id = ?",
   //    getRealEstate :"select rs.id,u.full_name,rs.first_name,rs.last_name,rs.email,rs.country_id,c.name as country_name,rs.city,rs.description,rs.website,rs.insta from real_estate_user as rs left join users as u on u.id=rs.user_id left join country as c on c.id=rs.country_id order by rs.id desc",
   //    getUserRealEstate :"select rs.id,u.full_name,rs.first_name,rs.last_name,rs.email,rs.country_id,c.name as country_name,rs.city,rs.description,rs.website,rs.insta from real_estate_user as rs left join users as u on u.id=rs.user_id left join country as c on c.id=rs.country_id where user_id=?",
   //    getUserTalentById : "Select t.*, u.user_name,u.banner,u.profile_pic,u.telent_status from telent as t left Join users as u ON t.user_id=u.id where t.user_id=?",
   //    updateTalentUser :  "Update telent SET  first_name=?,last_name=?,email=?,description=?,facebook=?,youtube=?,twitter=?,insta=?,country_id=?,city=?,follower=? where id = ?",

   //     getImages : "SELECT * from (select file_type,image from item where id in (select item_id from item_edition where id =?) union all select 'image' as file_type,name as image from item_images where item_id in (select item_id from item_edition where id =?) limit 4 )as a",




   //     getAllRoyaltyTransaction :"SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,i.id as item_id,t.item_edition_id,i.name as item_name,i.description,i.image,t.amount,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date  FROM transaction as t left join users as u on u.id=t.user_id left join item_edition as ie on ie.id=t.item_edition_id left join item as i on i.id=ie.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.transaction_type_id=8 order by t.id desc",
   //     getWalletTransaction :"SELECT t.id as transaction_id,tt.name as transaction_type,t.transaction_type_id,u.full_name,t.to_address,i.id as item_id,t.item_edition_id,i.name as item_name,i.file_type,i.description,i.image,abs(t.amount) as amount,t.currency,date_format(t.datetime,'%d-%M-%y') as transaction_date  FROM transaction as t left join users as u on u.id=t.user_id left join item_edition as ie on ie.id=t.item_edition_id left join item as i on i.id=ie.item_id left join transaction_type as tt on tt.id=t.transaction_type_id where t.user_id=? and t.transaction_type_id in(3) and t.amount<>0 order by t.id desc",

   //     getRealEstateCollection : "Select id,user_id,name,description from user_collection where user_id =? and nft_type_id=2",
   //     resaleNFT : "update item_edition set ? where id =?",
   //     getAllRealEstateCollection : "Select uc.id as collection_id,u.id as user_id,u.full_name as user_name,u.profile_pic,u.email,uc.name as collection_name,uc.description,date_format(uc.datetime,'%d-%M-%y')as create_date from user_collection as uc left join users as u on u.id=uc.user_id where uc.nft_type_id=2 order by uc.id desc",
   //     updateTelentForApproved : "update users SET telent_status=1 where id = ?",
   //     realEstateUserApprove: "update users SET real_estate_status=1 where id = ?",
   //     updateTelentForReject : "update users SET telent_status=2 where id = ?",
   //     realEstateUserReject : "update users SET real_estate_status=2 where id = ?",
   //     DeleteTelent :  "DELETE FROM telent WHERE user_id=?",
   //     DeleteRealEstateUser :  "DELETE FROM real_estate_user WHERE user_id=?",

   //     getItemEdition :"select id from item_edition where item_id=? order by id limit 1",
   //     updateUsersAuth : "update users SET enableTwoFactor=? where id=?",
   //     getUserAuth : "Select googleAuthCode,enableTwoFactor,QR_code from users where id =?", 
   //     allSearch : "select t.user_id as id,t.email,concat(t.first_name,' ',t.last_name) as full_name,u.profile_pic,'image' as file_type,talent' as type from telent as t left join users as u on u.id=t.user_id where t.first_name like ? or t.last_name like ? union all select ie.id,null as email,i.name,i.image as profile_pic,i.file_type,'nft' as type from item_edition as ie left join item as i on i.id=ie.item_id where name like ?  and i.is_active=1",



   //     updateTransactionStatus : "UPDATE transaction set status=2 where item_edition_bid_id = ?",



   //     updateSoldMultiple : "update item_edition SET  is_sold = ?,owner_id=?,transfer_hash=?, user_address=? where id in (select id from item_edition where item_id=? and owner_id=? order by id limit ?)",
   //     updateTransferHash : "update item_edition SET  transfer_hash= ? where id=?",
   //     //getItemDetails : "Select it.created_by,it.id,u.user_name from item as it LEFT JOIN users as u ON it.created_by=u.id where it.id =?", 

   //     getItemDetails : "Select i.created_by,i.edition_type,ie.id as item_edition_id,ie.is_sold,ie.expiry_date,ie.id as id,u.user_name from item_edition as ie left join item as i on i.id=ie.item_id LEFT JOIN users as u ON i.created_by=u.id where ie.id =?  and (ie.expiry_date >= now() or ie.expiry_date is null)",
   //     bidMailData :"select i.name,i.description,i.image,getUserFullName(?) as bidderName,getUserEmail(u.id) as ownerEmail from item_edition as ie left join item as i on i.id=ie.item_id left join users as u on u.id=ie.owner_id where ie.id=?",
   //     insertOwnerHistory : "insert into product_owner_history SET ?",

   //     getTelentStatus : "Select telent_status from users where id =?",
   //     getRealEstateStatus:"Select real_estate_status from users where id =?",
   //     getPayoutAddress:"Select id as user_id,full_name,payout_address,getRoyaltyAmount(id) as royalty_amount from users where id =?",
   //     getRoyaltyList :"Select id as user_id,full_name,email,profile_pic,payout_address,getRoyaltyAmount(id) as royalty_amount from users where getRoyaltyAmount(id)>0",
   //     onlinetrx_start : "insert into onlinetrx SET ?",
   //     getUser : "Select * from users where id =?",
   //     updateOnlinetrx : "update onlinetrx set ? where transaction_id = ?",
   //     updateItem : "update item set ? where id = ?",
   //     placeBidByOnlinetrx : "INSERT INTO item_edition_bid(item_edition_id,user_id,bid_price,status,transaction_id)SELECT item_edition_id,user_id,bid_price,0,transaction_id from onlinetrx where transaction_id= ?",
   //     updateUser : "update users set ? where id= ?",

   //     //getUserBids : "select ib.id as bid_id,t.id as transaction_id,u.id as user_id,u.full_name,u.email,i.id as item_id,ie.id as item_edition_id,i.name as item_name,i.edition_type,i.description,i.image,i.file_type,ib.bid_price,case when getMaxBid(ie.id)> ib.bid_price then 'Outbid' else  case when ib.status=0 then 'Pending' when ib.status=1 then 'Accepted' else 'Outbid' end end as status,ib.status as status_id,case when i.sell_type=1 then 'Open Edition' else 'Auction' end as bid_type,date_format(ib.datetime,'%d-%M-%y') as bid_datetime,date_format(i.datetime,'%d-%M-%y') as nft_datetime,cu.full_name as creator from item_edition_bid as ib left join item_edition as ie on ie.id=ib.item_edition_id left join item as i on i.id=ie.item_id left join users as u on u.id=ib.user_id inner join transaction as t on  t.item_edition_bid_id=ib.id and t.user_id=? left join users as cu on cu.id=i.created_by where ib.user_id=? and ie.is_sold=0 order by ib.id desc",   



   //     itemDetailByonlinetrx : "SELECT o.item_edition_id,o.user_id,o.bid_price,i.*,uw.public,ie.price from onlinetrx as o left join item as i on i.id=o.item_id left join item_edition as ie on ie.id=o.item_edition_id left join user_wallet as uw on uw.user_id=o.user_id where o.transaction_id=?",
   //     changeOwnership : "UPDATE item set ? where id =?",
   //     getfaq : "select id,question,answer from faq",
   //     getRecentWorks : "SELECT i.id,ie.id as item_edition_id,i.edition_type, i.name,i.image,i.file_type from item_edition as ie left join item as i on i.id=ie.item_id where ie.id in (select min(id) from item_edition where is_sold=0 group by item_id) and i.file_type='image' and i.is_active=1 order by rand() limit 15",
   //     allTalentList1 : "Select t.user_id,t.first_name,t.last_name,t.email,t.description,t.city,t.follower,ct.name as country_name,u.telent_status,u.profile_pic,ie.id as item_id,ie.item_edition_id,ie.image as image,ie.file_type from users as u left join telent as t on t.user_id=u.id  LEFT JOIN country as ct ON ct.id = t.country_id INNER join (select i.*,ie.id as item_edition_id from item_edition as ie left join item as i on i.id=ie.item_id where ie.item_id in (select max(id) from item group by created_by) and ie.id in (select min(id) from item_edition group by item_id )) as ie on ie.created_by=u.id where u.telent_status=1 and u.is_featured=? order by rand() limit 10",
   //     allTalentList2 : "Select t.user_id,t.first_name,t.last_name,t.email,t.description,t.city,t.follower,ct.name as country_name,u.telent_status,u.profile_pic,ie.id as item_id,ie.item_edition_id,ie.image as image,ie.file_type from users as u left join telent as t on t.user_id=u.id  LEFT JOIN country as ct ON ct.id = t.country_id INNER join (select i.*,ie.id as item_edition_id from item_edition as ie left join item as i on i.id=ie.item_id where ie.item_id in (select max(id) from item group by created_by) and ie.id in (select min(id) from item_edition group by item_id )) as ie on ie.created_by=u.id where u.telent_status=1 and u.is_featured=? order by rand()",







   //     insertBidTransactionByItemId : "INSERT INTO transaction (user_id,item_edition_id,item_edition_bid_id,transaction_type_id,amount,payment_id,receipt_url,status)select user_id,item_edition_id,id,4,bid_price*-1,payment_id,receipt_url,0 from item_edition_bid where id =?",
   //     updateTrxidInBid :"update item_edition_bid set transaction_id=? where id=?",


   //     getItemLikeCount : "select count(iel.id) as count,case when i.id is null then 0 else 1 end as is_liked from item_edition_like as iel left join item_edition_like as i on i.item_edition_id=iel.item_edition_id and i.user_id=? where iel.item_edition_id=?",



   //     updatemeta  :"update item SET metadata =? where id=?",


   //     getUserDetails  : "SELECT bd.*,it.name,it.edition_type,it.description,it.image,it.file_type,it.owner,it.expiry_date,u.user_name,u.email FROM item_edition_bid as bd LEFT JOIN item_edition as ie on ie.id=bd.item_edition_id left join item as it ON it.id=ie.item_id LEFT JOIN users as u ON u.id = bd.user_id WHERE bd.id=?",
   //     getitemBy : "SELECT name,description,image,owner,expiry_date FROM item WHERE id=?",

   //     getTransactionDetail1  : "Select i.name as item_name,i.edition_type,case when i.edition_type=2 then 'Open' when t.edition_text is not null then t.edition_text else ie.edition_text end as edition_text,i.image,i.file_type,case when ie.transfer_hash is not null then concat('https://etherscan.io/tx/',ie.transfer_hash) else t.receipt_url end as transfer_hash,u.user_name,u.profile_pic,t.*,ie.price  as amount,date_format(coalesce(t.datetime,now()),'%d-%M-%y %H:%i:%s') as datetime,case when t.status=2 then 'Rejected' when t.status=1 then 'Completed' else 'Pending' end as status,tc.name as type_name from item_edition as ie left join transaction as t on ie.id=t.item_edition_id  LEFT JOIN users as u ON ie.owner_id=u.id left join item as i ON i.id=ie.item_id LEFT JOIN transaction_type as tc ON t.transaction_type_id=tc.id where ie.id=? ORDER BY t.id DESC limit 1",
   //     insertEdition : "insert into item_edition SET ?",


   //     getOnlineTrx : "select *,isResale(item_edition_id)as is_resale from onlinetrx where transaction_id =?",
   //     getUsersByEmail : "Select id,user_name,email from users where  id =?",
   //     allCategoryItem : "Select i.id as item_id,i.edition_type,i.item_category_id,i.price,concat('Edition : ',ie.edition_text) as edition_text, ie.id as item_edition_id,i.image,date_format(COALESCE(i.start_date,CURRENT_DATE),'%Y-%m-%d') as start_date,i.file_type,i.name,i.description from item_edition as ie left join item as i on i.id=ie.item_id where i.item_category_id= ? and i.is_active=1 and ie.is_sold=0 and ie.id in (select min(id) from item_edition where is_sold=0 group by item_id)  and (ie.expiry_date >= now() or ie.expiry_date is null) limit ?",
   //     getUpcomingNft : "Select i.id as item_id,i.edition_type,i.item_category_id,i.price,concat('Edition : ',ie.edition_text) as edition_text, ie.id as item_edition_id,i.image,date_format(coalesce(i.start_date,CURRENT_DATE),'%Y-%m-%d') as start_date,i.file_type,i.name,i.description from item_edition as ie left join item as i on i.id=ie.item_id where  i.is_active=1 ie.is_sold=0 and ie.id in (select min(id) from item_edition where is_sold=0 group by item_id)and i.start_date>CURRENT_DATE limit ?",


   //     getCollectionItemCount : "select count(id) as itemCount from item where user_collection_id=?",
   //     getitems : "SELECT i.id,i.name,i.description,i.edition_type,i.image,i.file_type,u.full_name as owner,date_format(i.expiry_date,'%d-%M-%y %H:%i:%s') as expiry_date FROM `item` as i left join users as u on u.id=i.owner_id where i.id=?",
   //     getCategory : "Select id,name from item_category",
   //     getDigitalCategory : "Select id,name from item_category where nft_type_id=1",
   //     getUserDigitalCategory : "Select id,name from item_category where id in (1,2,3)",
   //     getPendingBid : "select * from item_edition_bid where item_edition_id=? and id <>? order by id desc limit 1",
   //     additemimages : "insert into item_images SET ?",
   //     updatePayoutAddress : "update users set ? where id =?"
   getItemAll: "select count(id) as nft_count, sum(case when sell_type=2 then 1 else 0 end) as auction_count,count(distinct created_by)  as creator_count from item",
}

