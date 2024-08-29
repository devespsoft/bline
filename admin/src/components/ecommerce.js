import React, { Component } from 'react';
import Header from '../directives/header'
import Leftsidebar from '../directives/leftsidebar'
import Footer from '../directives/footer'
export default class ecommerce extends Component {

    constructor(props) {
        super(props)

    }

    componentDidMount() {


    }


    render() {

        return (

            <>
                {/* <!-- Preloader --> */}
                <div className="preloader-it">
                    <div className="la-anim-1"></div>
                </div>
                {/* <!-- /Preloader --> */}
                <div className="wrapper theme-3-active pimary-color-green">
                    {/* <!-- Top Menu Items --> */}
                    <Header/>
                    {/* <!-- /Top Menu Items --> */}

                    {/* <!-- Left Sidebar Menu --> */}
                    <Leftsidebar/>
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
                                            <li id="theme-1"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-2"><i className="zmdi zmdi-check"></i></li>
                                            <li id="theme-3" className="active-theme"><i className="zmdi zmdi-check"></i></li>
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
                    <button id="setting_panel_btn" className="btn btn-success btn-circle setting-panel-btn shadow-2dp"><i className="zmdi zmdi-settings"></i></button>
                    {/* <!-- /Right Setting Menu --> */}

                    {/* <!-- Right Sidebar Backdrop --> */}
                    <div className="right-sidebar-backdrop"></div>
                    {/* <!-- /Right Sidebar Backdrop --> */}

                    {/* <!-- Main Content --> */}
                    <div className="page-wrapper">
                        <div className="container-fluid pt-25">

                            {/* <!-- Row --> */}
                            <div className="row">
                                <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12">
                                    <div className="panel panel-default card-view">
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">sales analytics</h6>
                                            </div>
                                            <div className="pull-right">
                                                <div className="pull-left form-group mb-0 sm-bootstrap-select mr-15">
                                                    <select className="selectpicker" data-style="form-control">
                                                        <option selected value='1'>Janaury</option>
                                                        <option value='2'>February</option>
                                                        <option value='3'>March</option>
                                                        <option value='4'>April</option>
                                                        <option value='5'>May</option>
                                                        <option value='6'>June</option>
                                                        <option value='7'>July</option>
                                                        <option value='8'>August</option>
                                                        <option value='9'>September</option>
                                                        <option value='10'>October</option>
                                                        <option value='11'>November</option>
                                                        <option value='12'>December</option>
                                                    </select>
                                                </div>
                                                <a href="#" className="pull-left inline-block full-screen">
                                                    <i className="zmdi zmdi-fullscreen"></i>
                                                </a>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <ul className="flex-stat mb-10 ml-15">
                                                    <li className="text-left auto-width mr-60">
                                                        <span className="block">Traffic</span>
                                                        <span className="block txt-dark weight-500 font-18"><span className="counter-anim">3,24,222</span></span>
                                                        <span className="block txt-success mt-5">
                                                            <i className="zmdi zmdi-caret-up pr-5 font-20"></i><span className="weight-500">+15%</span>
                                                        </span>
                                                        <div className="clearfix"></div>
                                                    </li>
                                                    <li className="text-left auto-width mr-60">
                                                        <span className="block">Orders</span>
                                                        <span className="block txt-dark weight-500 font-18"><span className="counter-anim">1,23,432</span></span>
                                                        <span className="block txt-success mt-5">
                                                            <i className="zmdi zmdi-caret-up pr-5 font-20"></i><span className="weight-500">+4%</span>
                                                        </span>
                                                        <div className="clearfix"></div>
                                                    </li>
                                                    <li className="text-left auto-width">
                                                        <span className="block">Revenue</span>
                                                        <span className="block txt-dark weight-500 font-18">$<span className="counter-anim">324,222</span></span>
                                                        <span className="block txt-danger mt-5">
                                                            <i className="zmdi zmdi-caret-down pr-5 font-20"></i><span className="weight-500">-5%</span>
                                                        </span>
                                                        <div className="clearfix"></div>
                                                    </li>
                                                </ul>
                                                <div id="chart_1" className="morris-chart" style={{height:"345px"}}>

                                                    

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
                                    <div className="panel panel-default card-view panel-refresh">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">top 5 products</h6>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row">
                                                <div className="col-sm-6 pa-0">
                                                    <canvas id="chart_7" height="164"></canvas>
                                                </div>
                                                <div className="col-sm-6 pr-0 pt-25">
                                                    <div className="label-chatrs">
                                                        <div className="mb-5">
                                                            <span className="clabels inline-block bg-yellow mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Paleo Bars</span>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="clabels inline-block bg-pink mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Bow Ties</span>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="clabels inline-block bg-blue mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Pocket Squares</span>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="clabels inline-block bg-red mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Wood Sunglasses</span>
                                                        </div>
                                                        <div className="">
                                                            <span className="clabels inline-block bg-green mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Leggings</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default card-view sm-data-box-3">
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">conversion rate</h6>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                <div className="col-sm-6 pa-0">
                                                    <span id="pie_chart_4" className="easypiechart" data-percent="33">
                                                        <span className="percent block txt-dark weight-500"></span>
                                                        <span className="block txt-success text-center">
                                                            <i className="zmdi zmdi-caret-up pr-5 font-20"></i><span className="weight-500">+33%</span>
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="col-sm-6 pr-0">
                                                    <ul className="flex-stat mb-15">
                                                        <li className="text-left block no-float full-width mb-15">
                                                            <span className="block">Cart Abandonment</span>
                                                            <span className="block txt-dark weight-500  font-18"><span className="counter-anim">73</span>%</span>
                                                            <span className="block txt-success pull-left mt-5">
                                                                <i className="zmdi zmdi-caret-up pr-5 font-20 pull-left"></i><span className="weight-500 pull-left">+15%</span>
                                                            </span>
                                                            <div className="clearfix"></div>
                                                        </li>
                                                        <li className="text-left block no-float full-width">
                                                            <span className="block">Revenue Left</span>
                                                            <span className="block txt-dark weight-500  font-18">$<span className="counter-anim">12,432</span></span>
                                                            <span className="block txt-success pull-left mt-5">
                                                                <i className="zmdi zmdi-caret-up pr-5 font-20 pull-left"></i><span className="weight-500 pull-left">+4%</span>
                                                            </span>
                                                            <div className="clearfix"></div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /Row --> */}

                            {/* <!-- Row --> */}
                            <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view panel-refresh">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">earnings by item type</h6>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row">
                                                <div className="col-sm-6 pa-0">
                                                    <canvas id="chart_8" height="185"></canvas>
                                                </div>
                                                <div className="col-sm-6 pr-0 pt-30">
                                                    <div className="label-chatrs">
                                                        <div className="mb-5">
                                                            <span className="clabels circular-clabels inline-block bg-yellow mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Paleo Bars</span>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="clabels circular-clabels inline-block bg-green mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Bow Ties</span>
                                                        </div>
                                                        <div className="mb-5">
                                                            <span className="clabels circular-clabels inline-block bg-blue mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Pocket Squares</span>
                                                        </div>
                                                        <div className="">
                                                            <span className="clabels circular-clabels inline-block bg-red mr-5"></span>
                                                            <span className="clabels-text font-12 inline-block txt-dark capitalize-font">Wood Sunglasses</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default card-view">
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">Top Keywords</h6>
                                            </div>
                                            <div className="pull-right">
                                                <a href="#" className="pull-left inline-block mr-15">
                                                    <i className="zmdi zmdi-download"></i>
                                                </a>
                                                <a href="#" className="pull-left inline-block close-panel" data-effect="fadeOut">
                                                    <i className="zmdi zmdi-close"></i>
                                                </a>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">
                                                <div className="table-wrap sm-data-box-2">
                                                    <div className="table-responsive">
                                                        <table className="table table-striped mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Keyword</th>
                                                                    <th>Revenue</th>
                                                                    <th>Conversion Rate</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>adidas</td>
                                                                    <td>$49,897</td>
                                                                    <td>8.61%</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>men's park</td>
                                                                    <td>$15,478</td>
                                                                    <td>2.10%</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>nutiva coconut oil</td>
                                                                    <td>$23,546</td>
                                                                    <td>4.35%</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>cart software</td>
                                                                    <td>$36,589</td>
                                                                    <td>1.58%</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>where to buy</td>
                                                                    <td>$55,467</td>
                                                                    <td>56%</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>pink adhesive</td>
                                                                    <td>$71,245</td>
                                                                    <td>47.6%</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                                    <div className="panel panel-default card-view pt-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box bg-white">
                                                    <div className="container-fluid pt-25">
                                                        <div className="row">
                                                            <div className="col-xs-6 text-left pl-0 pr-0 data-wrap-left">
                                                                <span className="txt-dark block counter">$<span className="counter-anim">15,678</span></span>
                                                                <span className="block"><span className="weight-500 uppercase-font txt-grey font-13">Visits</span><i className="zmdi zmdi-caret-down txt-danger font-21 ml-5 vertical-align-middle"></i></span>
                                                            </div>
                                                            <div className="col-xs-6 text-left  pl-0 pr-0 pt-25 data-wrap-right">
                                                                <div id="sparkline_4" style={{width: "100px", overflow: "hidden", margin: "0px auto"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default card-view pt-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box bg-white">
                                                    <div className="container-fluid pt-25">
                                                        <div className="row">
                                                            <div className="col-xs-6 text-left pl-0 pr-0 data-wrap-left">
                                                                <span className="txt-dark block counter"><span className="counter-anim">46.41</span>%</span>
                                                                <span className="block"><span className="weight-500 uppercase-font txt-grey font-13">Bounce Rate</span><i className="zmdi zmdi-caret-up txt-success font-21 ml-5 vertical-align-middle"></i></span>
                                                            </div>
                                                            <div className="col-xs-6 text-left  pl-0 pr-0 pt-25 data-wrap-right">
                                                                <div id="sparkline_5" style={{width: "100px", overflow: "hidden", margin: "0px auto"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default card-view pt-0">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body pa-0">
                                                <div className="sm-data-box bg-white">
                                                    <div className="container-fluid pt-25">
                                                        <div className="row">
                                                            <div className="col-xs-6 text-left pl-0 pr-0 data-wrap-left">
                                                                <span className="txt-dark block counter"><span className="counter-anim">142,357</span></span>
                                                                <span className="block"><span className="weight-500 uppercase-font txt-grey font-13">Products</span><i className="zmdi zmdi-caret-down txt-danger font-21 ml-5 vertical-align-middle"></i></span>
                                                            </div>
                                                            <div className="col-xs-6 text-left  pl-0 pr-0 pt-25 data-wrap-right">
                                                                <div id="sparkline_6" style={{width: "100px", overflow: "hidden", margin: "0px auto"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="panel panel-default card-view">
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body">
                                                {/* <!-- START carousel--> */}
                                                <div id="testimonial_slider" data-ride="carousel" className="carousel slide testimonial-slider-wrap text-slider">
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#testimonial_slider" data-slide-to="0" className="active"></li>
                                                        <li data-target="#testimonial_slider" data-slide-to="1"></li>
                                                        <li data-target="#testimonial_slider" data-slide-to="2"></li>
                                                    </ol>
                                                    <div role="listbox" className="carousel-inner mb-50">
                                                        <div className="item active">
                                                            <div className="testimonial-wrap text-center  pl-30 pr-30">
                                                                <img className="img-circle" src="img/user1.png" alt="First slide image" />
                                                                <p className="mt-20 font-16">"Activist, criteria planned giving dignity, committed democratizing the global financial system progressive."</p>
                                                                <span className="testi-pers-name block mt-15  txt-dark capitalize-font head-font">
                                                                    Jens Brincker
													</span>
                                                                <span className="testi-pers-desg block capitalize-font">
                                                                    Interaction Designer
													</span>
                                                            </div>
                                                        </div>
                                                        <div className="item">
                                                            <div className="testimonial-wrap text-center  pl-30 pr-30">
                                                                <img className="img-circle" src="img/user2.png" alt="First slide image" />
                                                                <p className="mt-20 font-16">"Nelson Mandela equal opportunity change accelerate pathway to a better life invest our ambitions catalyst."</p>
                                                                <span className="testi-pers-name block mt-15  txt-dark capitalize-font head-font">
                                                                    Mark Hay
													</span>
                                                                <span className="testi-pers-desg block capitalize-font">
                                                                    Interface Designer
													</span>
                                                            </div>
                                                        </div>

                                                        <div className="item">
                                                            <div className="testimonial-wrap text-center  pl-30 pr-30">
                                                                <img className="img-circle" src="img/user3.png" alt="First slide image" />
                                                                <p className="pt-20 font-16">"Making progress contribution compassion Ford Foundation, cross-agency coordination Bill development."</p>
                                                                <span className="testi-pers-name block mt-15  txt-dark capitalize-font head-font">
                                                                    Anthony Davie
													</span>
                                                                <span className="testi-pers-desg block capitalize-font">
                                                                    Project Manager
													</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                {/* <!-- END carousel--> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                    <div className="panel panel-default border-panel  review-box card-view">
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">recent reviews</h6>
                                            </div>
                                            <div className="pull-right">
                                                <div className="form-group mb-0 sm-bootstrap-select">
                                                    <select className="selectpicker" data-style="form-control">
                                                        <option>Sort by Newest</option>
                                                        <option>Sort by Highest Rating</option>
                                                        <option>Sort by Lowest Rating</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">
                                                <div className="streamline">
                                                    <div className="sl-item">
                                                        <div className="sl-content">
                                                            <div className="per-rating inline-block pull-left">
                                                                <a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star-outline"></a>
                                                                <span className="inline-block">for Paleo Bars</span>
                                                            </div>
                                                            <a href="javascript:void(0);" className=" pull-right txt-grey"><i className="zmdi zmdi-mail-reply"></i></a>
                                                            <div className="clearfix"></div>
                                                            <div className="inline-block pull-left">
                                                                <span className="reviewer font-13">
                                                                    <span>By</span>
                                                                    <a href="javascript:void(0)" className="inline-block capitalize-font  mb-5">Jens Brincker</a>
                                                                </span>
                                                                <span className="inline-block font-13  mb-5">11 day ago</span>
                                                            </div>
                                                            <div className="clearfix"></div>
                                                            <p className="mt-5">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
                                                        </div>
                                                    </div>
                                                    <hr className="light-grey-hr" />
                                                    <div className="sl-item">
                                                        <div className="sl-content">
                                                            <div className="per-rating inline-block pull-left">
                                                                <a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a>
                                                                <span className="inline-block">for Bow Ties</span>
                                                            </div>
                                                            <a href="javascript:void(0);" className=" pull-right txt-grey"><i className="zmdi zmdi-mail-reply"></i></a>
                                                            <div className="clearfix"></div>
                                                            <div className="inline-block pull-left">
                                                                <span className="reviewer font-13">
                                                                    <span>By</span>
                                                                    <a href="javascript:void(0)" className="inline-block capitalize-font  mb-5">Madalyn Rascon</a>
                                                                </span>
                                                                <span className="inline-block font-13  mb-5">11 day ago</span>
                                                            </div>
                                                            <div className="clearfix"></div>
                                                            <p className="mt-5">Neque porro quisquam est qui dolorem ipsum quiipsum quia dolor sit amet.</p>
                                                        </div>
                                                    </div>
                                                    <hr className="light-grey-hr" />
                                                    <div className="sl-item">
                                                        <div className="sl-content">
                                                            <div className="per-rating inline-block pull-left">
                                                                <a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star-outline"></a>
                                                                <span className="inline-block">for Pocket Squares</span>
                                                            </div>
                                                            <a href="javascript:void(0);" className=" pull-right txt-grey"><i className="zmdi zmdi-mail-reply"></i></a>
                                                            <div className="clearfix"></div>
                                                            <div className="inline-block pull-left">
                                                                <span className="reviewer font-13">
                                                                    <span>By</span>
                                                                    <a href="javascript:void(0)" className="inline-block capitalize-font  mb-5">Evie Ono</a>
                                                                </span>
                                                                <span className="inline-block font-13  mb-5">13 day ago</span>
                                                            </div>
                                                            <div className="clearfix"></div>
                                                            <p className="mt-5">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.ipsum quia dolor sit amet.</p>
                                                        </div>
                                                    </div>
                                                    <hr className="light-grey-hr" />
                                                    <div className="sl-item">
                                                        <div className="sl-content">
                                                            <div className="per-rating inline-block pull-left">
                                                                <a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star"></a><a href="javascript:void(0);" className="zmdi zmdi-star-outline"></a>
                                                                <span className="inline-block">for Wood Sunglasses</span>
                                                            </div>
                                                            <a href="javascript:void(0);" className=" pull-right txt-grey"><i className="zmdi zmdi-mail-reply"></i></a>
                                                            <div className="clearfix"></div>
                                                            <div className="inline-block pull-left">
                                                                <span className="reviewer font-13">
                                                                    <span>By</span>
                                                                    <a href="javascript:void(0)" className="inline-block capitalize-font  mb-5">Evie Ono</a>
                                                                </span>
                                                                <span className="inline-block font-13  mb-5">13 day ago</span>
                                                            </div>
                                                            <div className="clearfix"></div>
                                                            <p className="mt-5">Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur.ipsum quia dolor sit amet, consectetur.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /Row --> */}

                            {/* <!-- Row --> */}
                            <div className="row">
                                <div className="col-lg-8 col-md-6 col-xs-12">
                                    <div className="panel panel-default card-view panel-refresh">
                                        <div className="refresh-container">
                                            <div className="la-anim-1"></div>
                                        </div>
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">Invoice List</h6>
                                            </div>
                                            <div className="pull-right">
                                                <a href="javascript:void(0)" className="pull-left btn btn-primary btn-xs mr-15">view all</a>
                                                <a href="#" className="pull-left inline-block refresh mr-15">
                                                    <i className="zmdi zmdi-replay"></i>
                                                </a>
                                                <a href="#" className="pull-left inline-block full-screen mr-15">
                                                    <i className="zmdi zmdi-fullscreen"></i>
                                                </a>
                                                <div className="pull-left inline-block dropdown">
                                                    <a className="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false" role="button"><i className="zmdi zmdi-more-vert"></i></a>
                                                    <ul className="dropdown-menu bullet dropdown-menu-right" role="menu">
                                                        <li role="presentation"><a href="javascript:void(0)" role="menuitem"><i className="icon wb-reply" aria-hidden="true"></i>option 1</a></li>
                                                        <li role="presentation"><a href="javascript:void(0)" role="menuitem"><i className="icon wb-share" aria-hidden="true"></i>option 2</a></li>
                                                        <li role="presentation"><a href="javascript:void(0)" role="menuitem"><i className="icon wb-trash" aria-hidden="true"></i>option 3</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper collapse in">
                                            <div className="panel-body row pa-0">
                                                <div className="table-wrap">
                                                    <div className="table-responsive">
                                                        <table id="datable_1" className="table  display table-hover border-none">
                                                            <thead>
                                                                <tr>
                                                                    <th>#Invoice</th>
                                                                    <th>Description</th>
                                                                    <th>Amount</th>
                                                                    <th>Status</th>
                                                                    <th>issue date</th>
                                                                    <th>due date</th>
                                                                    <th>View</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                <tr>
                                                                    <td>#5012</td>
                                                                    <td>System Architect</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-danger">unpaid</span>
                                                                    </td>
                                                                    <td>2011/04/25</td>
                                                                    <td>2012/12/02</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>#5013</td>
                                                                    <td>Accountant</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-success">paid</span>
                                                                    </td>
                                                                    <td>2011/07/25</td>
                                                                    <td>2012/12/02</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>#5014</td>
                                                                    <td>Junior Technical Author</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-warning">pending</span>
                                                                    </td>
                                                                    <td>2009/01/12</td>
                                                                    <td>2012/12/02</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>#5015</td>
                                                                    <td>Senior Javascript Developer</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-success">paid</span>
                                                                    </td>
                                                                    <td>2012/03/29</td>
                                                                    <td>2012/12/02</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>#5010</td>
                                                                    <td>Integration Specialist</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-success">paid</span>
                                                                    </td>
                                                                    <td>2010/10/14</td>
                                                                    <td>2014/09/15</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>#5011</td>
                                                                    <td>Javascript Developer</td>
                                                                    <td>$205,500</td>
                                                                    <td>
                                                                        <span className="label label-success">paid</span>
                                                                    </td>
                                                                    <td>2009/09/15</td>
                                                                    <td>2013/09/15</td>
                                                                    <td>
                                                                        <a href="#">
                                                                            <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                                                        </a>
                                                                    </td>
                                                                </tr>

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-xs-12">
                                    <div className="panel panel-default border-panel card-view">
                                        <div className="panel-heading">
                                            <div className="pull-left">
                                                <h6 className="panel-title txt-dark">recent activity</h6>
                                            </div>
                                            <a className="txt-danger pull-right right-float-sub-text inline-block" href="javascript:void(0)"> clear all </a>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="panel-wrapper task-panel collapse in">
                                            <div className="panel-body row pa-0">
                                                <div className="list-group mb-0">
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-info capitalize-font">just now</span>
                                                        <i className="zmdi zmdi-calendar-check pull-left"></i><p className="pull-left">Calendar updated</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-success capitalize-font">4 min</span>
                                                        <i className="zmdi zmdi-comment-alert pull-left"></i><p className=" pull-left">Commented on a post</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-warning capitalize-font">23 min </span>
                                                        <i className="zmdi zmdi-truck pull-left"></i><p className=" pull-left">Order 392 shipped</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-success capitalize-font">46 min</span>
                                                        <i className="zmdi zmdi-money pull-left"></i><p className=" pull-left">Invoice 653 has been paid</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-danger capitalize-font">1 hr</span>
                                                        <i className="zmdi zmdi-account pull-left"></i><p className="pull-left">A new user has been added</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-warning capitalize-font">just now</span>
                                                        <i className="zmdi zmdi-picture-in-picture pull-left"></i><p className=" pull-left">Finance report has been released</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                    <a href="#" className="list-group-item">
                                                        <span className="badge transparent-badge badge-success capitalize-font">1 hr</span>
                                                        <i className="zmdi zmdi-device-hub pull-left"></i><p className="pull-left">Web server hardware updated</p>
                                                        <div className="clearfix"></div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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