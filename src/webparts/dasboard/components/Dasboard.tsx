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
  fetchPinnedUser
} from "../../../APISearvice/Dasborddetails";
import { encryptId } from "../../../APISearvice/CryptoService";
import { MessageSquare, ThumbsUp } from "react-feather";
import moment from "moment";
import { addActivityLeaderboard, getLeaderTop } from "../../../APISearvice/CustomService";
import { fertchprojectcomments, fetchprojectdataTop } from "../../../APISearvice/ProjectsService";
import Avatar from "@mui/material/Avatar";
let siteID: any;
let response: any;
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
  const [showDropdownId, setShowDropdownId] = React.useState(null);
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
  const openEmailDialog = (email: string) => {
    const subject = "Let's Connect!";
    const body = "Hi, I’d like to discuss something important.";
    // const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    //window.location.href = mailtoLink;
    const outlook365Url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the email in a new tab
    window.open(outlook365Url, "_blank");

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

  const [leaderboard, setLeaderboard] = useState([]);

  const handleTabClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    tabId: React.SetStateAction<string>
  ) => {
    e.preventDefault();
    setActiveTab(tabId);
  };

  const toggleDropdown = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
    }
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
  const [pinUsersitem, setPinUsersArr] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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


  }, [props]);

  const addActivity = async () => {
    await addActivityLeaderboard(sp, "Banner Button Clicks");
  }
  const ApiCall = async () => {
    setLoading(true);
    try {
      let listTitle = 'quicklinks'
      let CurrentsiteID = props.context.pageContext.site.id;
      siteID = CurrentsiteID;
      response = await sp.web.lists.getByTitle(listTitle).select('Id')();
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
      setPinUsersArr(await fetchPinnedUser(sp))
      setLoading(false);
      //console.log("pin", pinUsersitem)
      setLeaderboard(await getLeaderTop(sp))
      updateProjects(sp);

    } catch (error) {
      console.error('Error toggling like:', error);
    }
    finally {
      setLoading(false); // Enable the button after the function completes
    }

  };
  async function updateProjects(sp: SPFI) {
    // Fetch and set projects first
    const projects = await fetchprojectdataTop(sp);
    setProjects(projects);

    // Then fetch and set project comments
    const projectsComments = await fertchprojectcomments(sp);
    setProjectscomments(projectsComments);
  }

  const [projects, setProjects] = useState([]);
  const [projectscomments, setProjectscomments] = useState([]);
  const siteUrl = props.siteUrl;
  const videositeurl = props.siteUrl?.split("/sites")[0];
  const truncateText = (text: string, maxLength: number) => {
    if (text != null) {
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    }
  };
  const GotoNextPageProject = (item: any) => {
    console.log("item-->>>>", item);
    const encryptedId = encryptId(String(item.ID));
    // sessionStorage.setItem("mediaId", encryptedId);
    // sessionStorage.setItem("dataID", item.Id)
    window.location.href = `${siteUrl}/SitePages/ProjectDetails.aspx?${item.ID}`;
  };
  const GotoNextPageMediaDetails = (item: any) => {
    console.log("item-->>>>", item);
    const encryptedId = encryptId(String(item.ID));
    sessionStorage.setItem("mediaId", encryptedId);
    sessionStorage.setItem("dataID", item.Id)
    window.location.href = `${siteUrl}/SitePages/MediaDetails.aspx?${item.ID}`;
  };
  const GotoNextPage = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    // sessionStorage.setItem("mediaId", encryptedId);
    // sessionStorage.setItem("dataID", item.Id)
    window.location.href = `${siteUrl}/SitePages/EventCalendar.aspx`;
  };
  const GotoNextPageone = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    window.location.href = `${siteUrl}/SitePages/CorporateDirectory.aspx`;
  };
  const GotoNextPagetwo = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    window.location.href = `${siteUrl}/SitePages/News.aspx`;
  };
  const GotoNextPagethree = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    window.location.href = `${siteUrl}/SitePages/QuickLinksMaster.aspx`;
  };
  const GotoNextPageApp = (e:any,item: any) => {
    console.log("item-->>>>appppp", item)

    window.location.href = `${item}`;
  };

  const GotoNextPagefour = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    window.location.href = `${siteUrl}/SitePages/Announcements.aspx`;
  };
  const GotoNextPageLeaderboard = (item: any) => {
    console.log("item-->>>>", item)
    const encryptedId = encryptId(String(item.ID));
    window.location.href = `${siteUrl}/SitePages/Leaderboard.aspx`;
  };
  const NavigatetoAnnouncement = (e: any, item: number) => {
    console.log("NavigatetoAnnouncement-->>>>", item)
    debugger

    const encryptedId = encryptId(String(item));
    window.location.href = `${siteUrl}/SitePages/AnnouncementDetails.aspx?${item}`;
  };
  const NavigatetoEvent = (e: any, item: number) => {
    console.log("NavigatetoEvent-->>>>", item)
    const encryptedId = encryptId(String(item));
    window.location.href = `${siteUrl}/SitePages/EventDetailsCalendar.aspx?${item}`;
  };
  const Navigatetonews = (e: any, item: number) => {
    console.log("Navigatetonews-->>>>", item)
    const encryptedId = encryptId(String(item));
    window.location.href = `${siteUrl}/SitePages/NewsDetails.aspx?${item}`;
  };
  console.log(leaderboard, 'leaderboard');

  function truncateString(str: any, project: any) {
    const maxLength = 87; // The number of characters before truncation
    if (str) {
      if (str && str.length > maxLength) {
        const truncatedString = str.substring(0, maxLength);
        return (
          <>
            {truncatedString}
            <button
              className="view-more-button text-muted fw-bold"
              onClick={() => GotoNextPageProject(project)}
              style={{ marginLeft: "0px", paddingLeft: "0px", border: "none", background: "none", cursor: "pointer" }}
            >
              ...view more
            </button>
          </>
        );
      }
    }
    return str;
  }

  const [commentsData, setCommentsData] = useState<Record<string, number>>({});

  // Function to fetch data for each project ID
  const fetchProjectComments = async (projectId: any) => {
    try {
      const response = await _sp.web.lists.getByTitle("ARGProjectComments")
        .items.filter(`ARGProjectId eq ${projectId}`)();
      console.log(response, "here is our response")
      if (response.length > 0) {
        // Update the state with the fetched comment count
        return { [projectId]: response[0].CommentsCount || 0 };
      } else {
        // If no comments, set to 0
        return { [projectId]: 0 };
      }
    } catch (error) {
      console.error('Error fetching project comments:', error);
      return { [projectId]: 0 }; // In case of error, set 0
    }
  };

  useEffect(() => {
    // Use a function to fetch comments for each project and set the state
    const fetchCommentsForProjects = async () => {
      // Create an object to hold all the comment counts
      const commentCounts: any = {};

      // Fetch comments for all projects
      for (let project of projects) {
        const projectComment = await fetchProjectComments(project.ID);
        commentCounts[project.ID] = projectComment[project.ID];
      }

      // Once all comments are fetched, update the state at once
      setCommentsData(commentCounts);
    };

    fetchCommentsForProjects();
  }, [projects]);
  return (


    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div className="content mt-4" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          {loading ? <div style={{ minHeight: '100vh', marginTop: '20%' }} className="loadernewadd mt-10">
            <div>
              <img
                src={require("../../../CustomAsset/edc-gif.gif")}
                className="alignrightl"
                alt="Loading..."
              />
            </div>
            <span>Loading </span>{" "}
            <span>
              <img
                src={require("../../../CustomAsset/edcnew.gif")}
                className="alignrightbird"
                alt="Loading..."
              />
            </span>
          </div> :
            <div className="container-fluid pb-0  paddbnew">
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
                            {dynamicbanners.length == 0 &&
                              <div

                                className="no-results align-items-center  newiconsvg text-center mt25 "

                                style={{



                                  justifyContent: "center",
                                  position: 'relative',
                                  marginTop: '10px',
                                  height: '300px',
                                  top: '70px'

                                }}

                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>

                                <p className="font-14 text-muted text-center">No Banner found </p>

                              </div>}
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
                                    }`} onClick={() => addActivity()}
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
                                    <p style={{ width: '100%' }} className="font-18 mb-0 mt-0 ps-4 pe-4 py-0">
                                      {item.Title}
                                    </p>
                                    <div className="newpos1"><span style={{padding:'5px 10px'}} className="badge bg-warning">Global</span></div>
                                    <span style={{ width: '100%' }} className="font-14 nwdescrp mb-1 mt-0 ps-4 pe-4 py-0">
                                      {item.Description}
                                    </span>
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
                        <div className="card-body height">
                          <h5
                            className="header-title line18 font-8 text-dark newtextdark fw-bold mb-0"
                            style={{ fontSize: "16px", fontWeight: "bold", marginTop: '2px' }}
                          >
                            Upcoming Events
                            <a
                              style={{ float: "right", cursor: "pointer" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              onClick={(e) => GotoNextPage(e)}
                            >
                              View All
                            </a>
                          </h5>

                          {dataofevent.length === 0 ?
                            <div className="align-items-center newiconsvg text-center mt-14"
                            >

                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>

                              <p className="font-14 text-muted text-center">No Events Available </p>

                            </div>
                            :
                            <div className="mt-1">
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
                                    className="row align-items-start border-bottom mb-0 pt-2 pb-1 ng-scope"
                                  >
                                    <div
                                      style={{ padding: "0px" }}
                                      className="col-sm-3"
                                    >
                                      <div className="icon-1 event me-0">
                                        <h4
                                          className="ng-binding"
                                          style={{ color: "#f37421 " }}
                                        >
                                          {eventDate.getDate()} {/* Display the day */}
                                        </h4>
                                        <p
                                          className="ng-binding"
                                          style={{
                                            backgroundColor: "#f37421 ",
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
                                      <div className="w-100 ps-0 mt-1">
                                        <h4
                                          className="mb-0 text-dark lin30 fw-bold"
                                          style={{
                                            fontSize: "14px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            cursor: "pointer"
                                          }}
                                          onClick={(e) => NavigatetoEvent(e, event.ID)}
                                        >
                                          {event.EventName} {/* Event title */}
                                        </h4>
                                        <p className="font-12 mt-0 mb-0 text-primary">Sales</p>
                                        <p className=" font-12 mb-0 mt-1">

                                          {moment(formattedDate).format("DD-MMM-YYYY")}
                                          {/* Display the full formatted date (22 Jul 2024) */}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>}






                        </div>
                      </div>
                    </div>
                  </div>



                  <div className="row mt-0">
                    {/* Corporate Directory */}

                    {/* <div className="col-xl-7 col-lg-7">
                     
                      <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="card-body gheightnew pb-0">
                          <h4
                            className="header-title text-dark fw-bold mb-0"
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            Upcoming Events
                            <a

                              style={{ float: "right", cursor: "pointer" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              
                              onClick={(e) => GotoNextPage(e)}
                            >
                              View All
                            </a>
                          </h4>

                        </div>
                      </div>
                    </div> */}

                    {/* gallery  */}
                    <div className="col-xl-12 col-lg-12 mb-2">
                      <div
                        style={{ float: "left", width: "100%" }}
                        className="card newt desknewview mb-3"
                      >
                        <div className="card-body heifgtgal pb-2">
                          <h4 className="header-title text-dark font-16 fw-bold mb-0">
                            Application Link
                            <a
                              style={{ float: "right", cursor: "pointer" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              onClick={(e) => GotoNextPagethree(e)}
                            >
                              View All
                            </a>
                          </h4>
                          {gallerydata.length === 0 ?
                            <div className="align-items-center newiconsvg text-center mt-10"
                            >

                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>

                              <p className="font-14 text-muted text-center">No Application Link Available </p>

                            </div>
                            :
                            <div className="tab-content pt-1  pb-1" style={{ marginTop: '0.6rem' }}>

                              <div className="row">


                                {console.log("tytyty", gallerydata)}
                                {gallerydata.map((item) => {
                                  const imageData = item.QuickLinkImage == undefined || item.QuickLinkImage == null ? "" : JSON.parse(item.QuickLinkImage);
                                  let siteId = siteID;
                                  let listID = response.Id;
                                  let img1 = imageData != "" && imageData.fileName != "" ? `${siteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize` : ""
                                  let img = imageData != "" && imageData.serverRelativeUrl != "" ? `https://officeindia.sharepoint.com${imageData.serverRelativeUrl}` : img1
                                  const imageUrl = imageData != ""
                                    ? img
                                    : null;
                                  { console.log("imageData", imageData, imageUrl, item, siteUrl, img) }
                                  // const ImageUrl2 =
                                  //   item.QuickLinkImage == undefined || item.QuickLinkImage == null
                                  //     ? ""
                                  //     : JSON.parse(item.QuickLinkImage);

                                  return (
                                    <div className="col-sm-3 newwidth6" key={item.ID}
                                      id={item.ID} onClick={(e) => GotoNextPageApp(e,item.URL)}>
                                      <div>
                                        <div>
                                          <div className="aaplnbg">
                                            <img
                                              src={imageUrl}
                                              // videositeurl +
                                              // ImageUrl2?.serverRelativeUrl

                                              width="100%"
                                              alt="Gallery"
                                            />
                                            <div className="appltext font-14 mb-1">
                                              {item.Title}

                                            </div>
                                            <p className="font-12 mb-2 text-primary">Sales</p>


                                          </div>

                                        </div>


                                      </div>

                                      {/* <div className="lspe">
                                <img src={item.videoIcon} alt="video icon" />
                              </div> */}
                                      {/* <div className="cptext">
                                        <p>
                                          <i className="fa fa-clock-o"></i>&nbsp;
                                          {moment(item.Created).format("DD-MMM-YYYY")}
                                        </p>
                                        <p style={{ cursor: "pointer" }} onClick={() => GotoNextPageMediaDetails(item)}>{item.Title}</p>
                                      </div> */}
                                    </div>
                                  )
                                })}

                              </div>
                            </div>}


                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-6 tabview2">
                  {/* Profile Info */}
                  <div className="card" style={{ borderRadius: "1rem " }}>
                    <div className="card-body news-feed">
                      <h5
                        className="header-title line18 font-8 text-dark fw-bold mb-0"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        Latest News
                        <a
                          style={{ float: "right", cursor: "pointer" }}
                          className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                          onClick={(e) => GotoNextPagetwo(e)}
                        >
                          View All
                        </a>
                      </h5>
                      {dataofnews.length === 0 ?
                        <div className="align-items-center newiconsvg text-center mt100"
                        >

                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>

                          <p className="font-14 text-muted text-center">No News Available </p>

                        </div>
                        :
                        // dataofnews.map((user, index) => (

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

                            // const submittedDate = new Date(news.Modified);
                            // const formattedSubmittedDate =
                            //   submittedDate.toLocaleDateString("default", {
                            //     day: "2-digit", // 2-digit day format (e.g., 01, 15)
                            //     month: "short", // Abbreviated month name (e.g., Jan, Feb)
                            //     year: "numeric", // Full year (e.g., 2024)
                            //   });
                            const eventDate = new Date(news.Modified);
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
                                    cursor: "pointer"
                                  }}
                                  className="fw-bold font-16 mt-2 mb-2 twolinewrap text-dark"
                                  onClick={(e) => Navigatetonews(e, news.ID)}
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
                              <span>{moment(news.Modified).format("DD-MMM-YYYY")}</span> <span>&nbsp;|&nbsp;</span> <span className="text-primary">Finance</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>

                      }


                    </div>
                  </div>

                  {/* Leaderboard  */}

                </div>
              </div>

            </div>
          }
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
