import React, { useState, useEffect } from "react";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { SPFI } from "@pnp/sp";
import UserContext from "../../../GlobalContext/context";
import { IAddannouncementProps } from "../../addannouncement/components/IAddannouncementProps";
import Provider from "../../../GlobalContext/provider";
import "./NotificationDetails.scss";
import { getSP } from "../loc/pnpjsConfig";
import { getlastSevenDaysARGNotificationHistory, getOlderARGNotificationHistory, getTodayARGNotificationHistory } from "../../../APISearvice/CustomService";
import moment from "moment";
import Avatar from "@mui/material/Avatar";
type NotificationType = "new" | "previous" | "old";
const NotificationDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { useHide }: any = React.useContext(UserContext);
  const [TodayNotificationArray, setTodayNotificationArray] = useState([])
  const [OlderNotificationArray, setOlderNotificationArray] = useState([])

  const [lastSevenDaysNotificationArray, setlastSevenDaysNotificationArray] = useState([])

  const siteUrl = props.siteUrl;
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Notification",
      ChildComponentURl: `${siteUrl}/SitePages/NotificationDetails.aspx`,
    },
  ];



  const notificationsData: Record<NotificationType, { id: number; author: string; message: string; time: string }[]> = {
    new: [
      { id: 1, author: "User 1", message: "Hi, How are you? Meeting at Al Roastamani.", time: "1 hour ago" },
      { id: 2, author: "User 2", message: "Don't forget our meeting tomorrow.", time: "2 hours ago" },
    ],
    previous: [
      { id: 3, author: "User 3", message: "Great job on the project!", time: "1 day ago" },
      { id: 4, author: "User 4", message: "Reminder to check your email.", time: "2 days ago" },
    ],
    old: [
      { id: 5, author: "User 5", message: "Congratulations on the promotion!", time: "1 week ago" },
      { id: 6, author: "User 6", message: "Please submit your report.", time: "2 weeks ago" },
    ]
  };

  const [OldactiveTab, setOldactiveTab] = useState(false);
  const [TodayactiveTab, setTodayactiveTab] = useState(true);

  const [PreviousactiveTab, setPreviousactiveTab] = useState(false);
  useEffect(() => {
    getTodayNotificationList(); // runs only once on initial render
    getLastSevenDateNotificationList(); // runs only once on initial render
    getOldNotificationList(); // runs only once on initial render  
  }, []);
  const getTodayNotificationList = async () => {
    setTodayNotificationArray(await getTodayARGNotificationHistory(sp))
  }
  const getLastSevenDateNotificationList = async () => {
    setlastSevenDaysNotificationArray(await getlastSevenDaysARGNotificationHistory(sp))
  }

  const getOldNotificationList = async () => {
    setOlderNotificationArray(await getOlderARGNotificationHistory(sp))
  }
  const handleTodayactiveTab = () => {
    setTodayactiveTab(true);
    setOldactiveTab(false);
    setPreviousactiveTab(false);
    getTodayNotificationList()
  };
  const handlePreviousactiveTab = () => {
    setPreviousactiveTab(true);
    setOldactiveTab(false);
    setTodayactiveTab(false);
    getLastSevenDateNotificationList()
  };
  const handleOldactiveTab = () => {
    setOldactiveTab(true);
    setPreviousactiveTab(false);
    setTodayactiveTab(false);
    getOldNotificationList()
  };
  const handleNotificationClick = async (result: any) => {
    debugger
    setTimeout(() => {
      window.location.href =
        `${siteUrl}/SitePages/${result.DeatilPage}.aspx?${result.ContentId}`
    }, 500);

  };
  return (
    <div>
      <div id="wrapper" ref={elementRef}>
        <div className="app-menu" id="myHeader">
          <VerticalSideBar _context={sp} />
        </div>
        <div className="content-page">
          <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
          <div
            className="content"
            style={{
              marginLeft: `${!useHide ? "240px" : "80px"}`,
              marginTop: "0rem",
            }}
          >
            <div className="container-fluid  paddb">
              <div className="row">
                <div className="col-lg-5">
                  <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                </div>
              </div>
              {/* <div className="row">
                <div className="col-lg-5">
                  <div className="list-group list-group-flush mt-3 font-15">
                    <a
                      style={{ padding: "10px 20px" }}
                      href="#"
                      className="list-group-item-action active text-muted fw-semibold border-0"
                    >
                      <i className="fe-rss font-16 me-1"></i>
                      New Notification
                    </a>
                    <a
                      style={{ padding: "10px 20px" }}
                      href="#"
                      className="list-group-item list-group-item-action text-muted border-0"
                    >
                      <i className="fe-user-plus font-16 me-1"></i>
                      Previous Notification
                    </a>
                    <a
                      style={{ padding: "10px 20px" }}
                      href="#"
                      className="list-group-item list-group-item-action text-muted border-0"
                    >
                      <i className="fe-users font-16 me-1"></i>
                      Old Notification
                    </a>
                  </div>
                </div>
              </div> */}
              <div className="notification-container">
                <div className="row">
                  <div className="col-xl-3 col-lg-6 notification-sidebar">
                    <div style={{ position: 'sticky', top: '90px' }} className="">
                      <div className="list-group list-group-flush font-15">
                        <a

                          onClick={() => handleTodayactiveTab()}
                          className={`list-group-item ${TodayactiveTab === true ? "active" : ""}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="bx bx-bell desktoView dropcssBell" style={{ position: 'relative' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> New Notification
                        </a>
                        <a

                          onClick={() => handlePreviousactiveTab()}
                          className={`list-group-item ${PreviousactiveTab === true ? "active" : ""}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="bx bx-bell desktoView dropcssBell" style={{ position: 'relative' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> Last 7 Days Notification
                        </a>
                        <a

                          onClick={() => handleOldactiveTab()}
                          className={`list-group-item ${OldactiveTab === true ? "active" : ""}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="bx bx-bell desktoView dropcssBell" style={{ position: 'relative' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg> Old Notification
                        </a>
                      </div>
                    </div>
                  </div>
                  {
                    TodayactiveTab && (
                      <div className="col-xl-9 col-lg-12 notification-content">
                        <div className="card notification-card" >
                          <div className="card-body p-0">
                            <div className="inbox-widget">
                              <div className="simplebar-content">
                                {/* <h3 className="font-20">Today Notifications</h3> */}
                                {/* Heading for the active tab */}

                                {console.log("TodayNotificationArray", TodayNotificationArray, lastSevenDaysNotificationArray, OlderNotificationArray)}
                                {TodayNotificationArray != null && TodayNotificationArray.length > 0 && TodayNotificationArray.map((notification) => (
                                  <div className="inbox-item" key={notification.Id} style={{ justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex' }}>
                                      <div className="inbox-item-img">
                                        {/* <img
                                        src={
                                        `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification.EMail}`  
                                        } /> */}
                                        {notification.ActionUser?.SPSPicturePlaceholderState == 0 ?
                                          <img
                                            src={

                                              `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification?.ActionUser?.EMail}`

                                            }
                                            className="rounded-circle"
                                            width="50"
                                            alt={notification.ActionUser.Title}
                                          />
                                          :
                                          notification?.ActionUser.EMail !== null &&
                                          <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circle avatar-xl">
                                            {`${notification?.ActionUser.EMail?.split('.')[0]?.charAt(0)}${notification?.ActionUser.EMail?.split('.')[1]?.charAt(0)}`.toUpperCase()}
                                          </Avatar>
                                        }
                                      </div>
                                      <div className="inbox-item-details">
                                        <p className="inbox-item-author mb-1"><span className="me-4"> {notification?.ActionUser?.Title} </span>  <span className="text-info font-12">
                                          {/* {moment(notification.Created).fromNow()} */}
                                          {moment(notification.Created).format("DD/MMM/YYYY")}
                                        </span></p>
                                        
                                        <p
                                          className="inbox-item-text clickable-text mb-1"
                                          onClick={() => handleNotificationClick(notification)} // your function here
                                        >
                                          {notification.ContentName}
                                        </p>
                                        <small className="noti-item-subtitle text-muted">{notification?.ActionUser?.Title} {notification.ContentType0} on {notification?.NotifiedUser?.Title}</small>

                                      </div>
                                    </div>
                                    {/* <p className="inbox-item-date me-3">
                                     
                                    </p> */}
                                  </div>
                                ))}


                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  {
                    PreviousactiveTab && (
                      <div className="col-xl-9 col-lg-12 notification-content">
                        <div className="card notification-card">
                          <div className="card-body p-0">
                            <div className="inbox-widget">
                              <div className="simplebar-content">
                                {/* <h3 className="font-20">Previous Notifications</h3>  */}

                                {/* Heading for the active tab */}

                                {lastSevenDaysNotificationArray != null && lastSevenDaysNotificationArray.length > 0 && lastSevenDaysNotificationArray.map((notification) => (
                                  <div className="inbox-item" key={notification.Id} style={{ justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex' }}>
                                      <div className="inbox-item-img">
                                        {/* <img
                                        src={
                                        `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification.EMail}`  
                                        } /> */}
                                        {notification?.ActionUser.SPSPicturePlaceholderState == 0 ?
                                          <img
                                            src={

                                              `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification.ActionUser?.EMail}`

                                            }
                                            className="rounded-circle"
                                            width="50"
                                            alt={notification.ActionUser.Title}
                                          />
                                          :
                                          notification.ActionUser?.EMail !== null &&
                                          <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circle avatar-xl">
                                            {`${notification.ActionUser?.EMail?.split('.')[0]?.charAt(0)}${notification.ActionUser?.EMail?.split('.')[1]?.charAt(0)}`.toUpperCase()}
                                          </Avatar>
                                        }
                                      </div>
                                      <div className="inbox-item-details">
                                        <p className="inbox-item-author mb-1"><span className="me-4">{notification?.ActionUser?.Title}</span>  <span style={{ fontWeight: '400' }} className="text-info font-12">
                                          {/* {moment(notification.Created).fromNow()} */}
                                          {moment(notification.Created).format("DD/MMM/YYYY")}

                                        </span></p>
                                        <p
                                          className="inbox-item-text clickable-text mb-1"
                                          onClick={() => handleNotificationClick(notification)} // your function here
                                        >
                                          {notification.ContentName}
                                        </p>
                                        <small className="noti-item-subtitle text-muted">{notification?.ActionUser?.Title} {notification.ContentType0} on {notification?.NotifiedUser?.Title}</small>

                                      </div>
                                    </div>

                                  </div>
                                ))}

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  {
                    OldactiveTab && <div className="col-xl-9 col-lg-12 notification-content">
                      <div className="card notification-card">
                        <div className="card-body p-0">
                          <div className="inbox-widget">
                            <div className="simplebar-content">
                              {/* <h3 className="font-20">Old Notifications</h3>  */}

                              {/* Heading for the active tab */}


                              {OlderNotificationArray != null && OlderNotificationArray.length > 0 && OlderNotificationArray.map((notification) => (
                                <div className="inbox-item" key={notification.Id} style={{ justifyContent: 'space-between' }}>
                                  <div style={{ display: 'flex' }}>
                                    <div className="inbox-item-img">

                                      {/* <img
                                        src={
                                        `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification.EMail}`  
                                        } /> */}
                                      {notification.ActionUser.SPSPicturePlaceholderState == 0 ?
                                        <img
                                          src={

                                            `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${notification.ActionUser?.EMail}`

                                          }
                                          className="rounded-circle"
                                          width="50"
                                          alt={notification.ActionUser.Title}
                                        />
                                        :
                                        notification.ActionUser?.EMail !== null &&
                                        <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circle avatar-xl">
                                          {`${notification?.EMail?.split('.')[0]?.charAt(0)}${notification.ActionUser?.EMail?.split('.')[1]?.charAt(0)}`.toUpperCase()}
                                        </Avatar>
                                      }
                                    </div>
                                    <div className="inbox-item-details">
                                      <p className="inbox-item-author mb-1"> <span className="me-4"> {notification?.ActionUser?.Title} </span>  <span className="text-info font-12">
                                        {/* {moment(notification.Created).fromNow()} */}
                                        {moment(notification.Created).format("DD/MMM/YYYY")}

                                      </span></p>
                                      <p
                                          className="inbox-item-text clickable-text mb-1"
                                          onClick={() => handleNotificationClick(notification)} // your function here
                                        >
                                          {notification.ContentName}
                                        </p>
                                      <small className="noti-item-subtitle text-muted">{notification?.ActionUser?.Title} {notification.ContentType0} on {notification?.NotifiedUser?.Title}</small>

                                    </div>
                                  </div>
                                  {/* <p className="inbox-item-date me-3">
                                  
                                  </p> */}
                                </div>
                              ))}
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const NotificationDetails: React.FC<IAddannouncementProps> = (props) => {
  return (
    <Provider>
      <NotificationDetailsContext props={props} />
    </Provider>
  );
};

export default NotificationDetails;


