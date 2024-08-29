import logo from './logo.svg';
import './App.css';
//==================================  Import all dependencies  ============================

import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import login from './components/login'
import dashboard from './components/dashboard'
import Header from './directives/header'
import Leftsidebar from './directives/leftsidebar'
import Footer from './directives/footer'
import ecommerce from './components/ecommerce'
import addproduct from './components/addproduct'
import product from './components/product'
import productCart from './components/productcart'
import productcheckout from './components/productcheckout'
import productdetail from './components/productdetail'
import productorder from './components/productorder'
import categoryList from './components/categoryList'
import users from './components/users'
import nftsusers from './components/nftsusers'
import changePassword from './components/changepassword'
import changeProfile from './components/changeprofile'
// import icon from './components/icons'
import contact from './components/contact'
import realestateusers from './components/realestateusers'
import realestatenfts from './components/realestatenfts'
import usercollection from './components/usercollection'
import myCollection from './components/myCollection'
import realestatecollection from './components/realestatecollection'
import wallet from './components/wallet'
import privacyAndPolicy from './components/privacyAndPolicy'
import termsAndCondition from './components/termsAndCondition'
import about from './components/about'
import support from './components/support'
import userDetail from './components/userDetail'
import transaction from './components/transaction'
import nft from './components/nft'
import feessetting from './components/feessetting'
import transactionfees from './components/transactionfees'
// import transactionfees from './components/'
import adminnft from './components/adminnft'
import bulknft from './components/bulknft'
import user1 from './components/user1'
import userTransaction from './components/userTransaction'
import realestateslider from './components/realestateslider'
import royalty from './components/royalty'
import gamescategory from './components/gamescategory'
import bannerImage from './components/bannerImage';
import faqs from './components/faqs';
function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <Menu /> */}
        <Switch>

          <Route path={`${config.baseUrl}`} exact component={login} />
          <Route path={`${config.baseUrl}dashboard`} exact component={dashboard} />
          <Route path={`${config.baseUrl}ecommerce`} exact component={ecommerce} />
          <Route path={`${config.baseUrl}addproduct`} exact component={addproduct} />
          <Route path={`${config.baseUrl}product`} exact component={product} />
          <Route path={`${config.baseUrl}productCart`} exact component={productCart} />
          <Route path={`${config.baseUrl}productcheckout`} exact component={productcheckout} />
          <Route path={`${config.baseUrl}productdetail`} exact component={productdetail} />
          <Route path={`${config.baseUrl}productorder`} exact component={productorder} />
          <Route path={`${config.baseUrl}categoryList`} exact component={categoryList} />
          <Route path={`${config.baseUrl}users`} exact component={users} />
          <Route path={`${config.baseUrl}nftsusers`} exact component={nftsusers} />
          <Route path={`${config.baseUrl}changepassword`} exact component={changePassword} />
          <Route path={`${config.baseUrl}changeprofile`} exact component={changeProfile} />
          {/* <Route path={`${config.baseUrl}icons`} exact component={icon}/> */}
          <Route path={`${config.baseUrl}contact`} exact component={contact}/>
          <Route path={`${config.baseUrl}realestateusers`} exact component={realestateusers}/>
          <Route path={`${config.baseUrl}realestatenfts`} exact component={realestatenfts}/>
          <Route path={`${config.baseUrl}usercollection`} exact component={usercollection}/>
          <Route path={`${config.baseUrl}myCollection`} exact component={myCollection}/>
          <Route path={`${config.baseUrl}realestatecollection`} exact component={realestatecollection}/>
          <Route path={`${config.baseUrl}wallet`} exact component={wallet}/>
          <Route path={`${config.baseUrl}privacyAndPolicy`} exact component={privacyAndPolicy}/>
          <Route path={`${config.baseUrl}termsAndCondition`} exact component={termsAndCondition}/>
          <Route path={`${config.baseUrl}about`} exact component={about}/>
          <Route path={`${config.baseUrl}support`} exact component={support}/>
          <Route path={`${config.baseUrl}feessetting`} exact component={feessetting}/>
          <Route path={`${config.baseUrl}transactionfees`} exact component={transactionfees}/>

          <Route path={`${config.baseUrl}transaction`} exact component={transaction}/>
          <Route path={`${config.baseUrl}userDetail/:id`} exact component={userDetail}/>
          <Route path={`${config.baseUrl}nft/:id`} exact component={nft}/>
          <Route path={`${config.baseUrl}adminnft`} exact component={adminnft}/>
          <Route path={`${config.baseUrl}bulknft`} exact component={bulknft}/>
          <Route path={`${config.baseUrl}user1/:id`} exact component={user1}/>
          <Route path={`${config.baseUrl}userTransaction/:id`} exact component={userTransaction}/>
          <Route path={`${config.baseUrl}realestateslider`} exact component={realestateslider}/>
          <Route path={`${config.baseUrl}royalty`} exact component={royalty}/>
          <Route path={`${config.baseUrl}gamescategory`} exact component={gamescategory}/>
          <Route path={`${config.baseUrl}bannerImage`} exact component={bannerImage}/>
          <Route path={`${config.baseUrl}faqs`} exact component={faqs}/>


          
          </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
