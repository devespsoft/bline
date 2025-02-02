
var db = require('../utils/connection');


module.exports = {


  addBlog : "insert into blog SET ?",



    getUsersEmail: "SELECT * FROM users WHERE email = ? and is_admin=1",
    getFooter : "SELECT * FROM web_footer",
    getWebContent : "SELECT * FROM web_content",
    updateFooter : "update web_footer SET description=?,email=?,contact=?", 
    updateWallet : "update user_wallet set ? where user_id =?",
    updateWebContent : "update web_content SET ?",
    getUsers : "SELECT us.id,us.full_name,us.email,us.is_email_verify,us.country_id,us.user_name,us.deactivate_account, ct.id as country_id,ct.name as country_name,us.is_featured,case when us.telent_status=0 then 'Pending' when us.telent_status=1 then 'Approved' when us.telent_status=2 then 'Rejected' else 'Not Applied' end as telent_status_name, us.telent_status from users as us  LEFT JOIN country as ct ON ct.id = us.country_id  where us.deactivate_account=0 and us.id<>1", 
    getSingleUser : "Select * from users where id =?",
    getOrderDetail : "SELECT u.*,o.* FROM users as u LEFT JOIN  orders as o ON u.id=o.user_id  where ? ",
    insertMarketPlace : "insert into marketplace SET ?",
    getMarketPlace : "Select id,title,author,price,item_image,price from marketplace",
    insertCategory : "insert into item_category SET ?",
    deleteCategory : "DELETE FROM item_category WHERE id =?",
    updateCategory : "update item_category SET ? where id =?",
    updateUser : "update users SET ? where id =?",
    Category : "Select ic.id,ic.name,nt.name as nft_type,nt.id as nft_type_id from item_category as ic left join nft_type as nt on nt.id=ic.nft_type_id",
    getDigitalCategory : "Select ic.id,ic.name,nt.name as nft_type,nt.id as nft_type_id from item_category as ic left join nft_type as nt on nt.id=ic.nft_type_id where ic.nft_type_id=1 and ic.id in (1,2,3)",
    getUserDigitalCategory : "Select ic.id,ic.name,nt.name as nft_type,nt.id as nft_type_id from item_category as ic left join nft_type as nt on nt.id=ic.nft_type_id where ic.nft_type_id=1 and ic.id in (1,2,3)",
    getRealEstateCategory :"Select id,name from item_category where nft_type_id=2 limit 8",
    getUserRealEstateCategory :"Select id,name from item_category where nft_type_id=2 and id in(5,6,7,8)",
    singleCategory : "Select ic.id,ic.name,nt.name as nft_type,nt.id as nft_type_id from item_category as ic left join nft_type as nt on nt.id=ic.nft_type_id where ic.id=?",
    getNftType : "select * from nft_type",
    insertItem : "insert into item SET ?",
    deleteItem : "Delete from item where id =?",
    updateItem : "update item SET ? where id =?",
    getItem : "Select i.id,ie.id as item_edition_id,ie.edition_text,i.name,i.description,i.image,i.file_type,i.owner,i.item_category_id,i.quantity,ic.name as item_category,i.token_id,ie.price,i.is_active,ie.is_sold,ie.expiry_date from item_edition as ie left join item as i on i.id=ie.item_id left join item_category as ic on ic.id=i.item_category_id where ie.id in (select min(id) from item_edition where is_sold=0 group by item_id,owner_id) and i.is_active=1 and (ie.expiry_date >= now() or ie.expiry_date is null) and i.nft_type_id=1 and coalesce(ie.start_date,now())<=now() ORDER BY i.id DESC", 
    getAdminItem : "Select i.id,i.name,i.description,i.image,i.file_type,i.owner,i.item_category_id,i.quantity,ic.name as item_category,i.token_id,i.price,i.is_active,i.is_sold,i.expiry_date from  item as i left join item_category as ic on ic.id=i.item_category_id where  (i.expiry_date >= now() or i.expiry_date is null)  and coalesce(i.start_date,now())<=now() ORDER BY i.id DESC", 
  //  listSingleItem : "Select i.id,i.name,i.description,i.image,i.owner,i.item_category_id,ic.name as category_name,i.token_id,i.price from item as i left join item_category as ic on ic.id=i.item_category_id where i.id = ? ",
     listSingleItem : "Select ie.id as item_edition_id,i.id as item_id,i.name,i.description,i.image,i.file_type,i.owner,i.item_category_id,ic.name as category_name,i.token_id,i.price from item_edition as ie left join item as i on i.id=ie.item_id left join item_category as ic on ic.id=i.item_category_id where ie.id = ? and (ie.expiry_date >= now() or i.expiry_date is null)",   
    dashItem : "select sum(category_count) as category_count,sum(user_count) as user_count,sum(item_count) as item_count,sum(sold_item) as sold_item,sum(trending_item) as trending_item,sum(telent_count) as telent_count from ( select count(id) as category_count,0 as user_count,0 as item_count, 0 as sold_item, 0 as trending_item,0 as telent_count from item_category UNION ALL select 0 as category_count,count(id) as user_count,0 as item_count, 0 as sold_item, 0 as trending_item,0 as telent_count from users where deactivate_account=0 UNION ALL select 0 as category_count,0 as user_count,count(id) as item_count, sum(is_sold) as sold_item, 0 as trending_item,0 as telent_count from item union all select 0 as category_count,0 as user_count,0 as item_count,0 as sold_item, 0 as trending_item,count(id) as telent_count from telent ) as dashboard_data",
    deleteUser : "Update users set deactivate_account=1,email=concat(email,'_Deleted') WHERE id =?",
    getProfile :  "Select profile_pic from users where email=? and  is_admin=1",
    updateProfile : "update users SET profile_pic=? where email=? and is_admin=1",
    getPassword : "Select password from users where email =? and is_admin=1",
    updatepassword : "update users SET password=? where email=? and is_admin=1",
    getTelentUsers : "Select u.id as user_id,coalesce(t.first_name,u.full_name) as first_name,t.last_name,coalesce(t.email,u.email) as email,t.description,t.nft_hash,t.city,t.follower,ct.name as country_name,u.telent_status,u.profile_pic from users as u left join telent as t on t.user_id=u.id  LEFT JOIN country as ct ON ct.id = t.country_id where (u.telent_status=1 or t.id is not null) and u.deactivate_account=0 order by t.id desc",
    getRealEstateUsers: "Select u.id as user_id,coalesce(r.first_name,u.full_name) as first_name,r.last_name,coalesce(r.email,u.email) as email,r.description,r.city,ct.name as country_name,u.real_estate_status,u.profile_pic from users as u left join real_estate_user as r on r.user_id=u.id  LEFT JOIN country as ct ON ct.id = r.country_id where (u.real_estate_status=1 or r.id is not null) and u.deactivate_account=0 order by r.id desc",
    getWebImage : "Select * from web_images",
    getRealEstateImage : "Select * from real_estate_images",
    updateWebImage : "update web_images SET ? where id =?",
    updateRealEstateImage : "update real_estate_images SET ? where id =?",
    createUserWallet : "insert into user_wallet SET ?",
    insertEdition : "insert into item_edition SET ?",
    getAllCollection : "SELECT name, description, datetime, website, profile_pic, banner FROM user_collection ",
    getAdminCollection : "SELECT * from admin_collection",
    updateAdminCollection : "UPDATE admin_collection SET ? where id = ?",
    deleteAdminCollection : "DELETE from admin_collection WHERE id = ?",
    getTransactionHistory : "SELECT amount, currency, to_address from transaction",
    getPrivacypolicy : "SELECT * From privacy_policy",
    updateprivacyAndPolicy : "UPDATE privacy_policy SET ? WHERE id = ?",
    getTermsConditions : "SELECT * from terms_conditions",
    updateTermsConditions : "UPDATE terms_conditions SET ? WHERE id = ?",
    getAbout : "SELECT * from about",
    updateAbout : "UPDATE about SET ? WHERE id = ?"
    
    
}