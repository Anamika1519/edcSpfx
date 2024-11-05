  import React, { useEffect, useRef, useState } from "react";
  import { SPFI } from "@pnp/sp";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS + Popper.js
  import "./Dasboard.scss";
  import "../../../CustomCss/mainCustom.scss";
  import "../../verticalSideBar/components/VerticalSidebar.scss";
  import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
  import UserContext from "../../../GlobalContext/context";
  import Provider from "../../../GlobalContext/provider";
  import { useMediaQuery } from "react-responsive";
  import context from "../../../GlobalContext/context";
  import CustomCarousel from "../../../CustomJSComponents/carousel/CustomCarousel";
  import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
  import FeatherIcon from "feather-icons-react";
  import {
    fetchDynamicdata,
    fetchMediaGallerydata,
  } from "../../../APISearvice/MediaDetailsServies";
  import { getSP } from "../loc/pnpjsConfig";
  import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
  import {
    fetchEventdataone,
    fetchUserInformationList,
    getAnncouncementone,
    getNewsone,
  } from "../../../APISearvice/Dasborddetails";
  import { encryptId } from "../../../APISearvice/CryptoService";
  import { MessageSquare, ThumbsUp } from "react-feather";
  import moment from "moment";
import { addActivityLeaderboard } from "../../../APISearvice/CustomService";

  const HelloWorldContext = ({ props }: any) => {
    const sp: SPFI = getSP();
    console.log(sp, "sp");
    // const { useHide }: any = React.useContext(UserContext);
    // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const { useHide }: any = React.useContext(UserContext);
    console.log("This function is called only once", useHide);
    const elementRef = React.useRef<HTMLDivElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const { setHide }: any = context;
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    React.useEffect(() => {
      console.log("This function is called only once", useHide);

      const showNavbar = (
        toggleId: string,
        navId: string,
        bodyId: string,
        headerId: string
      ) => {
        const toggle = document.getElementById(toggleId);
        const nav = document.getElementById(navId);
        const bodypd = document.getElementById(bodyId);
        const headerpd = document.getElementById(headerId);

        if (toggle && nav && bodypd && headerpd) {
          toggle.addEventListener("click", () => {
            nav.classList.toggle("show");
            toggle.classList.toggle("bx-x");
            bodypd.classList.toggle("body-pd");
            headerpd.classList.toggle("body-pd");
          });
        }
      };
      showNavbar("header-toggle", "nav-bar", "body-pd", "header");

      const linkColor = document.querySelectorAll(".nav_link");

      function colorLink(this: HTMLElement) {
        if (linkColor) {
          linkColor.forEach((l) => l.classList.remove("active"));
          this.classList.add("active");
        }
      }

      linkColor.forEach((l) => l.addEventListener("click", colorLink));
    }, [useHide]);
    // Media query to check if the screen width is less than 768px
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const handleSidebarToggle = (bol: boolean) => {
      setIsSidebarOpen((prevState: any) => !prevState);
      setHide(!bol);
      document.querySelector(".sidebar")?.classList.toggle("close");
    };

    const users = [
      {
        name: "Atul Sharma",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        mobile: "4585658565",
      },
      {
        name: "Nitin Gupta",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        mobile: "4585658565",
      },
      {
        name: "Varun Kumar",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        mobile: "4585658565",
      },
      {
        name: "Varun Kumar one",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        mobile: "4585658565",
      },
    ];

    const leaderboard = [
      {
        position: 1,
        name: "Atul Sharma",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        points: "10k",
      },
      {
        position: 2,
        name: "Rohit Sharma",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        points: "10k",
      },
      {
        position: 3,
        name: "Nitin Gupta",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        points: "10k",
      },
      {
        position: 4,
        name: "Nitin Gupta one",
        department: "IT Department",
        imgSrc: require("../../../Assets/ExtraImage/userimg.png"),
        points: "10k",
      }
      
    ];

    const handleTabClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      tabId: React.SetStateAction<string>
    ) => {
      e.preventDefault();
      setActiveTab(tabId);
    };


    const headerRef = useRef(null); // Reference to the header
    const [isSticky, setIsSticky] = useState(false);
    const _sp: SPFI = getSP();
    const [dynamicbanners, setDynamicBanners] = useState<any[]>([]);
    const [gallerydata, setGalleryData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = React.useState("");
    const [dataofann, setDataofAnn] = useState<any[]>([]);
    const [dataofnews, setDataofNews] = useState<any[]>([]);
    const [dataofevent, setDataofEvent] = useState<any[]>([]);
    const [usersitem, setUsersArr] = useState<any[]>([]);
    const scrollContainerRef = useRef(null);
    const handleScroll = () => {
      if (headerRef.current) {
        const sticky = headerRef.current.offsetTop;
        if (window.scrollY > sticky) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };
    useEffect(() => {
      // fetchDynamicdata();
      ApiCall();


      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", handleScroll);
        window.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", handleScroll);
          window.removeEventListener("scroll", handleScroll);
        }
      };


    }, []);

    const addActivity=async ()=>
      { 
        await addActivityLeaderboard(sp,"Banner Button Clicks");
      }
    const ApiCall = async () => {
      const galleryItemsone = await fetchMediaGallerydata(sp);
      setGalleryData(galleryItemsone);
      setActiveTab(galleryItemsone[0]?.ID);
      // console.log("galleryItems--data--check", galleryItemsone);

      const dynamicbannerdata = await fetchDynamicdata(sp);
      setDynamicBanners(dynamicbannerdata);

      const announcemetdata = await getAnncouncementone(sp);
      setDataofAnn(announcemetdata);

      const newsdata = await getNewsone(sp);
      // console.log("check--data--of-getNewsone", newsdata);

      setDataofNews(newsdata);

      const eventdata = await fetchEventdataone(sp);
      console.log("event-of-data--cheking", eventdata);
      setDataofEvent(eventdata);

      setUsersArr(await fetchUserInformationList(sp))
    };

    const [projects, setProjects] = useState([
      {
        id: 1,
        title: "Project 1",
        status: "Finished",
        documents: 1,
        comments: 0,
        team: [
          {
            name: "Mat Helme",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
          {
            name: "Michael Zenaty",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
          {
            name: "James Anderson",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
        ],
      },
      {
        id: 2,
        title: "Project 2",
        status: "Ongoing",
        documents: 1,
        comments: 0,
        team: [
          {
            name: "Mat Helme",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
          {
            name: "Michael Zenaty",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
        ],
      },
      {
        id: 3,
        title: "Project 3",
        status: "Ongoing",
        documents: 1,
        comments: 0,
        team: [
          {
            name: "Mat Helme",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
          {
            name: "Michael Zenaty",
            image: require("../../../Assets/ExtraImage/userimg.png"),
          },
        ],
      },
    ]);

    const siteUrl = props.siteUrl;
  
    const truncateText = (text: string, maxLength: number) => {
      if(text!=null)
      {
          return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

      }
  };

    const GotoNextPage = (item: any) => {
      console.log("item-->>>>", item)
      const encryptedId = encryptId(String(item.ID));
      // sessionStorage.setItem("mediaId", encryptedId);
      // sessionStorage.setItem("dataID", item.Id)
      window.location.href = `${siteUrl}/SitePages/EventCalendar.aspx`;
    };
    const GotoNextPageone = (item: any) => {
      console.log("item-->>>>",item)
      const encryptedId = encryptId(String(item.ID));
      window.location.href = `${siteUrl}/SitePages/CorporateDirectory.aspx`;
    };
    const GotoNextPagetwo = (item: any) => {
      console.log("item-->>>>",item)
      const encryptedId = encryptId(String(item.ID));
      window.location.href = `${siteUrl}/SitePages/News.aspx`;
    };
    const GotoNextPagethree = (item: any) => {
      console.log("item-->>>>",item)
      const encryptedId = encryptId(String(item.ID));
      window.location.href = `${siteUrl}/SitePages/MediaGallery.aspx`;
    };
    const GotoNextPagefour = (item: any) => {
      console.log("item-->>>>",item)
      const encryptedId = encryptId(String(item.ID));
      window.location.href = `${siteUrl}/SitePages/Announcements.aspx`;
    };

    return (


      <div id="wrapper" ref={elementRef}>
        <div 
          className="app-menu"
          id="myHeader">
          <VerticalSideBar _context={sp} />
        </div>
        <div className="content-page">
            <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
          <div className="content mt-4" style={{marginLeft: `${!useHide ? '240px' : '80px'}`}}>
            <div className="container-fluid  paddb">
              <div className="row">
                <div
                  //  className=" col-md-10"
                  className="col-xl-9 col-lg-9 tabview1"
                >
                  <div className="row">
                    {/* Carousel Section */}
                    <div className="col-xl-8 col-lg-8 order-lg-2 order-xl-1">
                      <div className="carousel1">
                        <div
                          id="carouselExampleIndicators"
                          className="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <ol className="carousel-indicators">
                            {dynamicbanners.map((item, index) => (
                              <li
                                key={index}
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                              ></li>
                            ))}
                          </ol>
                          <div
                            className="carousel-inner"
                            role="listbox"
                            style={{ borderRadius: "1rem" }} 
                          >
                            {dynamicbanners.map((item, index) => {
                              const ImageUrl1 =
                                item.BannerImage == undefined ||
                                  item.BannerImage == null
                                  ? ""
                                  : JSON.parse(item.BannerImage);
                              return (
                                <div
                                  key={item.id}
                                  className={`carousel-item ${index === 0 ? "active" : ""
                                    }`} onClick={()=>addActivity()}
                                >
                                  <img
                                    style={{ width: "100%" }}
                                    src={
                                      ImageUrl1?.serverUrl +
                                      ImageUrl1?.serverRelativeUrl
                                    }
                                    alt={`Slide ${index + 1}`}
                                    className="d-block img-fluid"
                                  />
                                  <div className="carousel-caption d-none d-md-block">
                                    <p className="font-18 mb-1 mt-1 ps-4 pe-4 py-0">
                                      {item.Description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Announcement Section */}
                    <div className="col-xl-4 col-lg-4 order-lg-1 order-xl-1">
                      <div
                        className="card announcementner"
                        style={{ borderRadius: "1rem" }}
                      >
                        <div className="card-body p-3 height">
                          <h4
                            className="header-title font-8 text-dark fw-bold mb-0"
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                          >
                            Latest Announcement
                            <a
                              style={{ float: "right" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              onClick={(e)=>GotoNextPagefour(e)}
                            >
                              View All
                            </a>
                          </h4>

                          {dataofann.map((announcement, index) => (
                            <div key={index} className="border-bottom mt-2">
                              <h4
                                className="mb-0 twolinewrap text-dark fw-bold font-14 mt-0"
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                {announcement.Title}
                              </h4>
                              <p
                                // style={{ marginTop: "5px", lineHeight: "18px" }}
                                style={{
                                  marginTop: "5px",
                                  lineHeight: "18px",
                                  //   height: "54px",  18px line height * 2 lines
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 2, // Limit to 2 lines
                                }}
                                className="mb-0 font-13"
                              >
                                {announcement.Overview}
                              </p>
                              <div className="mt-1 d-flex justify-between mb-0">
                                <a
                                
                                  className="btn btn-sm btn-link text-muted mb-0 font-18 ps-0"
                                >
                                  <ThumbsUp size={15} color="#4fc6e1"/>
                                  <span className="font-12  mx-1 margin01 float-right floatl">{announcement.LikeCount} Likes</span>
                                </a>
                                <a
                                
                                  className="btn btn-sm btn-link text-muted mb-0 font-18"
                                >
                                  <MessageSquare size={15} color="#f7b84b"/>
                                  <span className="font-12 margin01 mx-1  float-right floatl">
                                  {announcement.CommentCount} Comments
                                  </span>
                                </a>
                              </div>

                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-0">
                    {/* Corporate Directory */}
                    <div className="col-xl-5 col-lg-5">
                      <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="card-body pb-0 gheight">
                          <h4 className="header-title font-16 text-dark fw-bold mb-0">
                            Corporate Directory
                            <a
                              style={{ float: "right" }}
                              className="font-11 view-all fw-normal btn  rounded-pill waves-effect waves-light"
                              onClick={(e)=>GotoNextPageone(e)}
                            >
                              View All
                            </a>
                          </h4>
                          <div className="inbox-widget" style={{marginTop: '1rem'}}>
                            {usersitem.map((user, index) => (
                              <div
                                key={index}
                                className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between mb-1"
                              >
                                <div className="col-sm-2">
                                  <a href="contacts-profile.html">
                                    <img
                                      src={user.Picture != null ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.EMail}` : require("../assets/users.jpg")}
                                      className="rounded-circle"
                                      width="50"
                                      alt={user.name}
                                    />
                                  </a>
                                </div>
                                <div className="col-sm-8">
                                  <a href="contacts-profile.html">
                                    <p className="fw-bold font-14 mb-0 text-dark">
                                      {user.Title} | {user.Department != null ? user.Department : 'NA'}
                                    </p>
                                  </a>
                                  <p
                                    style={{
                                      color: "#6b6b6b",
                                      fontWeight: "500",
                                    }}
                                    className="font-12"
                                  >
                                    NA
                                    {/* Mob: {user.mobile} */}
                                  </p>
                                </div>
                                <div className="col-sm-2">
                                  <img
                                    src={require("../assets/calling.png")}
                                    className="alignright"
                                    alt="call"
                                    width="25"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leaderboard  */}
                    <div className="col-xl-7 col-lg-7">
                      <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="card-body pb-3 gheight">
                          <h4 className="header-title font-16 text-dark fw-bold mb-0">
                            Leaderboard
                            <a
                              style={{ float: "right" }}
                              className="font-11 view-all fw-normal btn  rounded-pill waves-effect waves-light"
                              href="#"
                            >
                              View All
                            </a>
                          </h4>
                          <div className="row mt-3 ipadt">
                            {leaderboard.map((user, index) => (
                              <div
                                key={index}
                                className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between border-radius mb-2"
                              >
                                <div className="col-sm-1">
                                  <div
                                    className="product-price-tag positiont text-primary rounded-circle newc"
                                    title="Position"
                                  >
                                    {user.position < 10
                                      ? `0${user.position}`
                                      : user.position}
                                  </div>
                                </div>
                                <div className="col-sm-1 ps-2">
                                  <img
                                    className="rounded-circle"
                                    src={require("../../../Assets/ExtraImage/userimg.png")}
                                    width="50"
                                    alt={user.name}
                                  />
                                </div>
                                <div className="col-sm-3">
                                  <div className="w-100 ps-1 pt-0">
                                    <h5 className="inbox-item-text fw-bold font-14 mb-0 text-dark">
                                      {user.name}
                                    </h5>
                                    <span
                                      style={{ color: "#6b6b6b" }}
                                      className="font-12"
                                    >
                                      {user.department}
                                    </span>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <a
                                    style={{ marginTop: "3px" }}
                                    href="javascript:void(0);"
                                    className="btn btn-sm btn-link text-muted ps-3 pe-0"
                                  >
                                    <img
                                      src={require("../assets/nounachievement.png")}
                                      title="Badges"
                                      alt="badge"
                                      className="me-0 ipaddw"
                                    />
                                    <img
                                      src={require("../assets/nounachievement.png")}
                                      title="Badges"
                                      alt="badge"
                                      className="me-0 ipaddw"
                                    />
                                    <img
                                      src={require("../assets/nounachievement.png")}
                                      title="Badges"
                                      alt="badge"
                                      className="me-0 ipaddw"
                                    />
                                  </a>
                                </div>
                                <div className="col-sm-2">
                                  <span
                                    style={{
                                      padding: "5px",
                                      borderRadius: "4px",
                                      background: "#cce7dc",
                                      fontWeight: "600",
                                      color: "#008751",
                                    }}
                                    className="posnew font-12  float-end mt-2 mb-2"
                                  >
                                    Points Earned {user.points}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* gallery  */}
                    <div className="col-xl-12 col-lg-12">
                      <div
                        style={{ float: "left", width: "100%" }}
                        className="card newt desknewview"
                      >
                        <div className="card-body pb-2">
                          <h4 className="header-title text-dark font-16 fw-bold mb-0">
                            Gallery
                            <a
                              style={{ float: "right" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              onClick={(e)=>GotoNextPagethree(e)}
                            >
                              View All
                            </a>  
                          </h4>

                          <div className="tab-content pt-1 margint50 pb-1" style={{marginTop:'0.6rem'}}>
                            <div className="tab-pane show active" id="profile1">
                              <div className="tabv">
                                {/* Dynamically generate the tab buttons */}
                                {gallerydata.map((item) => {
                                  const ImageUrl2 =
                                    item.Image == undefined || item.Image == null
                                      ? ""
                                      : JSON.parse(item.Image);
                                  return (
                                    <button
                                      key={item.ID}
                                      className="tablinks"
                                      onClick={(e) => handleTabClick(e, item.ID)}
                                    >
                                      <span className="tav-image">
                                        <img
                                          style={{ height: "70px" }}
                                          src={
                                            ImageUrl2?.serverUrl +
                                            ImageUrl2?.serverRelativeUrl
                                          }
                                          alt="Gallery"
                                        />
                                        {/* <div className="lspe1">
                                  <img
                                    style={{ width: "21px" }}
                                    src={item.videoIcon}
                                    alt="video icon"
                                  />
                                </div> */}
                                      </span>
                                      <span className="tabvtext">
                                        {item.Title} <br />
                                        <span style={{ paddingTop: "2px" }}>
                                          <i className="fa fa-clock-o"></i>&nbsp;
                                        {moment(item.Created).format("DD-MMM-YYYY HH:mm") }
                                        </span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Dynamically generate the tab content */}
                              {gallerydata.map((item) => {
                                const ImageUrl2 =
                                  item.Image == undefined || item.Image == null
                                    ? ""
                                    : JSON.parse(item.Image);
                                return (
                                  <div
                                    key={item.ID}
                                    id={item.ID}
                                    className="tabcontentv"
                                    style={{
                                      display:
                                        activeTab === item.ID ? "block" : "none",
                                    }}
                                  >
                                    <img
                                      src={
                                        ImageUrl2?.serverUrl +
                                        ImageUrl2?.serverRelativeUrl
                                      }
                                      width="100%"
                                      alt="Gallery"
                                    />
                                    {/* <div className="lspe">
                              <img src={item.videoIcon} alt="video icon" />
                            </div> */}
                                    <div className="cptext">
                                      <p>
                                        <i className="fa fa-clock-o"></i>&nbsp;
                                        {item.Created}
                                      </p>
                                      <p>{item.Title}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6 tabview2">
                  {/* Profile Info */}
                  <div className="card" style={{ borderRadius: "1rem " }}>
                    <div className="card-body news-feed">
                      <h4
                        className="header-title font-8 text-dark fw-bold mb-0"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Latest News
                        <a
                          style={{ float: "right" }}
                          className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                          onClick={(e)=>GotoNextPagetwo(e)}
                        >
                          View All
                        </a>
                      </h4>
                      <div
                        style={{
                          paddingTop: "0px",
                          boxSizing: "border-box",
                          display: "block",
                          unicodeBidi: "isolate",
                        }}
                      >
                        {dataofnews.map((news, index) => {
                          const ImageUrl5 =
                            news.AnnouncementandNewsBannerImage == undefined ||
                              news.AnnouncementandNewsBannerImage == null
                              ? ""
                              : JSON.parse(news.AnnouncementandNewsBannerImage);

                          const submittedDate = new Date(news.Created);
                          const formattedSubmittedDate =
                            submittedDate.toLocaleDateString("default", {
                              day: "2-digit", // 2-digit day format (e.g., 01, 15)
                              month: "short", // Abbreviated month name (e.g., Jan, Feb)
                              year: "numeric", // Full year (e.g., 2024)
                            });

                          return (
                            <div
                              key={index}
                              className="mt-3  border-bottom newpadd pt-0 ng-scope"
                              style={{ marginBottom: "7px" }}
                            >
                              <div className="imgh">
                                <img
                                  src={
                                    ImageUrl5?.serverUrl +
                                    ImageUrl5?.serverRelativeUrl
                                  }
                                  width="100%"
                                  alt={news.title}
                                />
                                {/* <img
                            src={require("../../../Assets/ExtraImage/NodataFound.png")}
                            width="100%"
                            alt={news.title}
                          /> */}
                              </div>
                              <h4
                                style={{
                                  lineHeight: "22px",
                                  fontSize: "16px",
                                }}
                                className="fw-bold font-16 mt-2 mb-2 twolinewrap text-dark"
                              >
                                {news.Title}
                              </h4>
                              <p
                                style={{ lineHeight: "22px" }}
                                className="mb-2 twolinewrap1 font-14"
                              >
                                {news.Overview}
                              </p>
                              <p className="mb-3 font-12">
                                {moment(news.Created).format("DD-MMM-YYYY HH:mm") }
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Upcoming Events */}
                  <div className="card" style={{ borderRadius: "1rem" }}>
                    <div className="card-body">
                      <h4
                        className="header-title text-dark fw-bold mb-0"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Upcoming Events
                        <a

                          style={{ float: "right" }}
                          className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                          // href="SitePages/Mediadetails.aspx"
                          onClick={(e) => GotoNextPage(e)}
                        >
                          View All
                        </a>
                      </h4>
                      <div className="mt-0">
                        {dataofevent.map((event, index) => {
                          // Parse the EventDate to get the day, month, and year
                          const eventDate = new Date(event.EventDate);
                          const formattedDate = eventDate.toLocaleDateString(
                            "default",
                            {
                              day: "2-digit", // To display the day with two digits
                              month: "short", // To display the abbreviated month (e.g., Jul, Sep)
                              year: "numeric", // To display the full year (e.g., 2024)
                            }
                          );

                          return (
                            <div
                              key={index}
                              style={{
                                padding: "0px 0px 0px 0px",
                                margin: "auto",
                                width: "100%",
                              }}
                              className="row align-items-start border-bottom mb-0 ng-scope"
                            >
                              <div
                                style={{ padding: "0px" }}
                                className="col-sm-3"
                              >
                                <div className="icon-1 event me-0">
                                  <h4
                                    className="ng-binding"
                                    style={{ color: "#1fb0e5" }}
                                  >
                                    {eventDate.getDate()} {/* Display the day */}
                                  </h4>
                                  <p
                                    className="ng-binding"
                                    style={{
                                      backgroundColor: "#1fb0e5",
                                      color: "white",
                                    }}
                                  >
                                    {eventDate.toLocaleString("default", {
                                      month: "short",
                                      year: "numeric",
                                    })}{" "}
                                    {/* Display the abbreviated month and year */}
                                  </p>
                                </div>
                              </div>
                              <div className="col-sm-9 upcom2">
                                <div className="w-100 ps-0 mt-3">
                                  <h4
                                    className=" text-dark font-14 fw-bold"
                                    style={{
                                      fontSize: "14px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 1
                                    }}
                                  >
                                    {event.EventName} {/* Event title */}
                                  </h4>
                                  <p className=" font-12">
                                    <i className="fe-calendar me-1"></i>
                                {moment(formattedDate).format("DD-MMM-YYYY HH:mm") }
                                    {/* Display the full formatted date (22 Jul 2024) */}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Project  */}
                <div
                  className="col-xl-12 col-lg-12"
                  style={{
                    border: "1px solid #54ade0 !important",
                    borderRadius: "20px",
                  }}
                >
                  <div
                    className="card projectb"
                    style={{
                      background: "transparent",
                      boxShadow: "none",
                      border: "none",
                      padding: "0",
                      marginBottom: "0px",
                    }}
                  >
                    <div className="card-body pb-3 paddlright">
                      <h4 className="header-title font-16 text-dark fw-bold mb-0">
                        Projects
                        <a
                          href="/projects"
                          className="font-11 view-all fw-normal btn rounded-pill waves-effect waves-light"
                          style={{ float: "right" }}
                        >
                          View All
                        </a>
                      </h4>
                      <div className="row mt-2">
                        {projects.map((project) => (
                          <div className="col-lg-4" key={project.id}>
                            <div className="card project-box">
                              <div className="card-body">
                                <div className="dropdown float-end">
                                  <a
                                    href="#"
                                    className="dropdown-toggle card-drop arrow-none"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="fe-more-horizontal- m-0 text-muted h3"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <a className="dropdown-item" href="#">
                                      Delete
                                    </a>
                                    <a className="dropdown-item" href="#">
                                      View Detail
                                    </a>
                                  </div>
                                </div>
                                <h4 className="mt-0 mb-1">
                                  <a
                                    href="#"
                                    className="text-dark fw-bold font-16"
                                  >
                                    {project.title}
                                  </a>
                                </h4>
                                <div
                                  className={
                                    project.status === "Finished"
                                      ? "finish mb-2"
                                      : "ongoing mb-2"
                                  }
                                >
                                  {project.status}
                                </div>
                                <p
                                  className="date-color font-12 mb-3"
                                  style={{ color: "#98a6ad" }}
                                >
                                  Some description...{" "}
                                  <a href="#" className="fw-bold text-muted">
                                    view more
                                  </a>
                                </p>
                                <p className="mb-1 font-12">
                                  <span
                                    style={{ color: "#6e767e" }}
                                    className="pe-2 text-nowrap"
                                  >
                                    <i className="fe-file-text text-muted"></i>
                                    <b>{project.documents}</b> Documents
                                  </span>
                                  <span
                                    style={{ color: "#6e767e" }}
                                    className="text-nowrap"
                                  >
                                    <i className="fe-message-square text-muted"></i>
                                    <b>{project.comments}</b> Comments
                                  </span>
                                </p>
                                <div className="avatar-group mb-2">
                                  {project.team.map((member, index) => (
                                    <a
                                      href="#"
                                      key={index}
                                      className="avatar-group-item"
                                    >
                                      <img
                                        src={member.image}
                                        className="rounded-circle avatar-sm"
                                        alt={member.name}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = (props: any) => {
    return (
      <Provider>
        <HelloWorldContext props={props} />
      </Provider>
    );
  };

  export default Dashboard;
