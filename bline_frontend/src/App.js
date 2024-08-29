import './App.css';
import React, { components } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config/config'
import home from './components/home'
import marketplace from './components/marketplace'
import createNFT from './components/createNFT'
import support from './components/support'
import contactus from './components/contactus'
import helpcenter from './components/helpcenter'
import accountsetting from './components/account-setting'
import createCollection from './components/createCollection'
import editcollection from './components/editcollection'
import demo from './components/demo'
import aboutus from './components/aboutus'
import technology from './components/technology'
import termsandcondition from './components/terms&condition'
import privacyandpolicy from './components/privacy&policy'
import nftDetails from './components/nftDetails'
import faq from './components/faq'
import googleAuth from './components/googleAuth'
import collections from './components/collections'
import userprofile from './components/userprofile'
import forgotPassword from './components/forgotPassword'
import resetpassword from './components/resetpassword'
import editNft from './components/editNft'
import supportdetail from './components/supportdetail'
import CollectionsList from './components/CollectionsList'
import categoryCollectionList from './components/categoryCollectionList'

function App() {
  return (
    <BrowserRouter>
        <Switch>
        <Route path={`${config.baseUrl}`} exact component={home} />
        <Route path={`${config.baseUrl}marketplace`} exact component={marketplace} />
        <Route path={`${config.baseUrl}marketplace/:subcategory_id`} exact component={marketplace} />
        <Route path={`${config.baseUrl}CollectionsList`} exact component={CollectionsList} />
        <Route path={`${config.baseUrl}categoryCollectionList/:id`} exact component={categoryCollectionList} />
        <Route path={`${config.baseUrl}createnft`} exact component={createNFT} />
        <Route path={`${config.baseUrl}helpcenter`} exact component={helpcenter} />
        <Route path={`${config.baseUrl}support`} exact component={support} />
        <Route path={`${config.baseUrl}contactus`} exact component={contactus} />
        <Route path={`${config.baseUrl}accountsetting`} exact component={accountsetting} />
        <Route path={`${config.baseUrl}createcollection`} exact component={createCollection} />
        <Route path={`${config.baseUrl}editcollection/:id`} exact component={editcollection} />
        <Route path={`${config.baseUrl}collections/:id`} exact component={collections} />
        <Route path={`${config.baseUrl}demo`} exact component={demo} />
        <Route path={`${config.baseUrl}aboutus`} exact component={aboutus} />
        <Route path={`${config.baseUrl}technology`} exact component={technology} />
        <Route path={`${config.baseUrl}termsandcondition`} exact component={termsandcondition} />
        <Route path={`${config.baseUrl}privacyandpolicy`} exact component={privacyandpolicy} />
        <Route path={`${config.baseUrl}nftDetails/:id`} exact component={nftDetails} />
        <Route path={`${config.baseUrl}faq`} exact component={faq} />
        <Route path={`${config.baseUrl}googleAuth`} exact component={googleAuth} />
        <Route path={`${config.baseUrl}UserProfile/:id`} exact component={userprofile} />
        <Route path={`${config.baseUrl}forgotPassword`} exact component={forgotPassword} />
        <Route path={`${config.baseUrl}resetpassword/:token`} exact component={resetpassword} />
        <Route path={`${config.baseUrl}editNft/:id`} exact component={editNft} />
        <Route path={`${config.baseUrl}supportdetail/:category_id`} exact component={supportdetail} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
