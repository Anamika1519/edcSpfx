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
    window.location.href = `${siteUrl}/SitePages/MediaGallery.aspx`;
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
                src={require("../../../CustomAsset/birdloader.gif")}
                className="alignrightl"
                alt="Loading..."
              />
            </div>
            <span>Loading </span>{" "}
            <span>
              <img
                src={require("../../../CustomAsset/argloader.gif")}
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
                            Latest Announcement
                            <a
                              style={{ float: "right", cursor: "pointer" }}
                              className="font-11 fw-normal btn  rounded-pill waves-effect waves-light view-all"
                              onClick={(e) => GotoNextPagefour(e)}
                            >
                              View All
                            </a>
                          </h5>
                          {dataofann.length === 0 ?
                            <div className="align-items-center newiconsvg text-center mt25"
                            >

                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>

                              <p className="font-12 text-muted text-center">No Announcement Available </p>

                            </div>
                            :
                            dataofann.map((announcement, index) => {
                              const eventDate = new Date(announcement.Modified);
                              const formattedDate = eventDate.toLocaleDateString(
                                "default",
                                {
                                  day: "2-digit", // To display the day with two digits
                                  month: "short", // To display the abbreviated month (e.g., Jul, Sep)
                                  year: "numeric", // To display the full year (e.g., 2024)
                                }
                              );
                              return (
                                <div key={index} className="border-bottom mt-2">
                                  <h4
                                    className="mb-0 twolinewrapone text-dark fw-bold font-14 mt-0"
                                    style={{ fontSize: "14px", fontWeight: "bold", cursor: "pointer" }}
                                    onClick={(e) => NavigatetoAnnouncement(e, announcement.ID)}
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
                                    className="mb-2 font-13"
                                  >
                                    {announcement.Overview}
                                  </p>
                                  <p className="mb-1 font-12">
                                    {moment(announcement.Modified).format("DD-MMM-YYYY")}
                                  </p>
                                  <div className="mt-1 d-flex justify-between mb-0">
                                    <span

                                      className="text-muted mb-0 font-18 ps-0"
                                    >
                                      <ThumbsUp size={15} color="#4fc6e1" />
                                      <span className="font-12  mx-1 margin01 float-right floatl">{announcement.LikeCount} Likes</span>
                                    </span>
                                    <span

                                      className="text-muted mb-0 font-18 clcom"
                                    >
                                      <MessageSquare size={15} color="#f7b84b" />
                                      <span className="font-12 margin01 mx-1  float-right floatl">
                                        {announcement.CommentCount} Comments
                                      </span>
                                    </span>
                                  </div>

                                </div>
                              )
                            }
                            )}






                        </div>
                      </div>
                    </div>
                  </div>



                  <div className="row mt-0">
                    {/* Corporate Directory */}
                    <div className="col-xl-5 col-lg-5">
                      <div className="card" style={{ borderRadius: "1rem" }}>
                        <div className="card-body pb-0 gheightnew">
                          <h4 className="header-title font-16 text-dark fw-bold mb-0">
                            Corporate Directory
                            <a
                              style={{ float: "right", cursor: "pointer" }}
                              className="font-11 view-all fw-normal btn  rounded-pill waves-effect waves-light"
                              onClick={(e) => GotoNextPageone(e)}
                            >
                              View All
                            </a>
                          </h4>

                          <div className="inbox-widget" style={{ marginTop: '1rem' }}>
                            {console.log("pinUsersitempinUsersitem",pinUsersitem)}
                            {pinUsersitem.length === 0 ?
                              <div className="align-items-center newiconsvg  text-center mt-22"
                              >

                                {/* <img style={{ cursor: "pointer", marginTop: '50px', width: '32px' }} src={require("../assets/noun-pin-7368310.png")} className="mb-3"
                                alt="pin"

                              /> */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>

                                <p className="font-14 text-muted text-center">Pin users from Corporate Directory </p>

                              </div>
                              : pinUsersitem.map((user, index) => (
                                
                                <div
                                  key={index}
                                  className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between mb-1"
                                >
                                  <div className="col-sm-2">
                                    <a>
                                      {/* <img
                                        // src={user.Picture != null ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.EMail}` : require("../assets/users.jpg")}
                                        src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.Pinned.EMail}`}
                                        className="rounded-circle"
                                        width="50"
                                        alt={user.Pinned.Title}
                                      /> */}
                                      { user.Pinned.SPSPicturePlaceholderState == 0 ?
                                        <img
                                          src={

                                            `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.Pinned.EMail}`

                                          }
                                          className="rounded-circle"
                                          width="50"
                                          alt={user.Pinned.Title}
                                        />
                                        :
                                        user.Pinned.EMail !== null &&
                                        <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circle avatar-xl">
                                          {`${user.Pinned.EMail.split('.')[0].charAt(0)}${user.Pinned.EMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                        </Avatar>
                                      }
                                    </a>
                                  </div>
                                  <div className="col-sm-8">

                                    <p className="fw-bold mt-1 font-14 mb-1 text-dark">
                                      {user.Pinned.Title}
                                    </p>
                                    <a href="#" style={{ marginLeft: '15px' }} className="onelinenewd font-12 mb-0 text-muted">
                                      <span onClick={() =>

                                        openEmailDialog(user.Pinned.EMail)

                                      }>
                                        {user.Pinned.EMail != null ? user.Pinned.EMail : 'NA'}
                                      </span>
                                    </a>

                                    <p
                                      style={{
                                        color: "#6b6b6b",
                                        fontWeight: "500",
                                      }}
                                      className="font-12"
                                    >
                                      {user.Pinned.MobilePhone}
                                      {/* Mob: {user.mobile} */}
                                    </p>
                                  </div>
                                  <div className="col-sm-2">
                                    <img
                                      src={require("../assets/calling.png")}
                                      onClick={() =>

                                        window.open(

                                          `https://teams.microsoft.com/l/call/0/0?users=${user.Pinned.EMail}`,

                                          "_blank"

                                        )

                                      }
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
                    <div className="col-xl-7 col-lg-7">
                      {/* Upcoming Events */}
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
                              // href="SitePages/Mediadetails.aspx"
                              onClick={(e) => GotoNextPage(e)}
                            >
                              View All
                            </a>
                          </h4>

                          {dataofevent.length === 0 ?
                            <div className="align-items-center newiconsvg text-center mt-14"
                            >

                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>

                              <p className="font-14 text-muted text-center">No Events Available </p>

                            </div>
                            :
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
                                      className="col-sm-2"
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
                                    <div style={{ padding: "0px" }} className="col-sm-9 upcom2">
                                      <div className="w-100 ps-0 mt-3">
                                        <h4
                                          className=" text-dark font-14 fw-bold"
                                          style={{
                                            fontSize: "14px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 1,
                                            cursor: "pointer"
                                          }}
                                          onClick={(e) => NavigatetoEvent(e, event.ID)}
                                        >
                                          {event.EventName} {/* Event title */}
                                        </h4>
                                        <p className=" font-12">
                                          <i className="fe-calendar me-1"></i>
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

                    {/* gallery  */}
                    <div className="col-xl-12 col-lg-12">
                      <div
                        style={{ float: "left", width: "100%" }}
                        className="card newt desknewview"
                      >
                        <div className="card-body heifgtgal pb-2">
                          <h4 className="header-title text-dark font-16 fw-bold mb-0">
                            Gallery
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

                              <p className="font-14 text-muted text-center">No Media Available </p>

                            </div>
                            :
                            <div className="tab-content pt-1 margint50 pb-1" style={{ marginTop: '0.6rem' }}>

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
                                          <span className="twolinewrap mb-1 fw-bold font-14 text-dark" onClick={() => GotoNextPageMediaDetails(item)}>  {item.Title} <br /> </span>
                                          <span style={{ paddingTop: "2px" }} className="font-12">
                                            <i className="fa fa-clock-o"></i>&nbsp;
                                            {moment(item.Created).format("DD-MMM-YYYY")}
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
                                          {moment(item.Created).format("DD-MMM-YYYY")}
                                        </p>
                                        <p style={{ cursor: "pointer" }} onClick={() => GotoNextPageMediaDetails(item)}>{item.Title}</p>
                                      </div>
                                    </div>
                                  );
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
                                  {moment(news.Modified).format("DD-MMM-YYYY")}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                      }


                    </div>
                  </div>

                  {/* Leaderboard  */}
                  <div>
                    <div className="card" style={{ borderRadius: "1rem" }}>
                      <div className="card-body pb-3 gheightl">
                        <h4 className="header-title font-16 text-dark fw-bold mb-0">
                          Leaderboard
                          <a
                            style={{ float: "right", cursor: "pointer" }}
                            className="font-11 view-all fw-normal btn  rounded-pill waves-effect waves-light"
                            onClick={(e) => GotoNextPageLeaderboard(e)}
                          >
                            View All
                          </a>
                        </h4>

                        {leaderboard.length === 0 ?
                          <div className="align-items-center newiconsvg text-center mt33"
                          >

                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>

                            <p className="font-14 text-muted text-center">No Leaderboard Available </p>

                          </div>
                          : <div className="d-flex align-items-start pt-1 justify-content-between border-radius mb-2">
                            <div className="row mt-0 ipadt">
                              {leaderboard.length > 0 && leaderboard.slice(0, 3).map((user, index) => {
                                {console.log("leaderboardleaderboard",leaderboard)}
                                <div className="row border-bottom heit9"
                                  key={index}

                                >
                                  <div style={{ paddingLeft: "0px" }} className="col-sm-2">
                                    {/* <img
                                      className="rounded-circle"
                                      src={
                                        `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.AuthorEMail}`
                                      }
                                      width="50"
                                      alt={user.AuthorTitle}
                                    /> */}
                                    {user.SPSPicturePlaceholderState == 0 ?
                                      <img
                                        src={

                                          `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.AuthorEMail}`

                                        }
                                        className="rounded-circle"
                                        //alt="profile-image"
                                        alt={user.AuthorTitle}
                                        //style={{ cursor: "auto" }}
                                        width="50"
                                      />
                                      :
                                      user.AuthorEMail !== null &&
                                      <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circlecss img-thumbnail
                                  avatar-xl">

                                        {`${user.AuthorEMail.split('.')[0].charAt(0)}${user.AuthorEMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                      </Avatar>
                                    }
                                  </div>

                                  <div className="col-sm-10 ps-2">
                                    <div className="row">
                                      <div className="col-lg-8">
                                        <div className="w-100 ps-1 pt-0">
                                          <h5 className="inbox-item-text fw-bold font-14 mb-0 text-dark">
                                            {user.AuthorTitle}
                                          </h5>
                                          <span
                                            style={{ color: "#6b6b6b", lineHeight: "15px", float: "left" }}
                                            className="font-12"
                                          >
                                            {user.AuthorDepartment ? user.AuthorDepartment : 'NA'}
                                          </span>
                                        </div>

                                      </div>
                                      <div style={{ paddingLeft: "0px" }} className="col-lg-4">
                                        <a
                                          style={{ marginTop: "3px", display: 'flex', gap: '2px', cursor: 'auto' }}
                                          href="javascript:void(0);"
                                          className="btn btn-sm btn-link text-muted ps-0 pe-0"
                                        >
                                          {Array(user.Ratting)
                                            .fill(null)
                                            .map((_, index) => (
                                              <img
                                                key={index}
                                                src={require("../assets/nounachievement.png")}
                                                title="Badges"
                                                alt="badge"
                                                className="me-0 ipaddw"
                                              />
                                            ))}
                                        </a>
                                      </div>

                                    </div>
                                    <div className="row">

                                      <div className="col-sm-3">
                                        <div
                                          className="product-price-tag positiont text-primary rounded-circle newc"
                                          title="Position"
                                        >
                                          {user.position < 10
                                            ? `0${user.position}`
                                            : user.position}
                                          {index + 1}
                                        </div>
                                      </div>

                                      <div className="col-sm-9">
                                        <span
                                          style={{
                                            padding: "5px",
                                            borderRadius: "4px",
                                            background: "#cce7dc",
                                            fontWeight: "600",
                                            color: "#008751",
                                            position: "relative",
                                            top: "-3px",
                                            width: "100%",
                                            textAlign: "center",
                                          }}
                                          className="posnew font-12  float-end mt-2 mb-2"
                                        >
                                          Points Earned {user.TotalPoints < 1000 ? user.TotalPoints : (user.TotalPoints / 1000).toFixed(1).replace(/\.0$/, '') + 'K'}
                                        </span>
                                      </div>

                                    </div>

                                  </div>


                                </div>
                              })}
                            </div>
                          </div>
                        }




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
                    <div className="pb-0 paddlright">
                      <h4 className="header-title font-16 text-dark fw-bold mb-0">
                        Projects
                        <a
                          href={`${siteUrl}/SitePages/Project.aspx`}
                          className="font-11 view-all fw-normal btn rounded-pill waves-effect waves-light"
                          style={{ float: "right", top: "0", cursor: "pointer" }}
                        >
                          View All
                        </a>
                      </h4>
                      {projects.length === 0 ?
                        <div className="align-items-center card card-body newiconsvg text-center mt-4"
                        >

                          <svg className="mt-3" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>

                          <p className="font-14 text-muted text-center">No Projects Available </p>

                        </div>
                        :
                        <div className="row mt-2">
                          {projects.map((project, index) => (
                            <div className="col-lg-4 col-sm-6 mb-2" key={project.Id}>
                              <div className="card project-box mb-0">
                                <div className="card-body">
                                  <div className="dropdown mt-3 float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                    >
                                      <img className="morealign" src={require('../assets/more.png')} />

                                    </a>
                                    <div style={{ cursor: "pointer", padding: "0px", top: "15px", minWidth: "auto", textAlign: "center" }} className="dropdown-menu newheight dropdown-menu-end">
                                      <a className="dropdown-item font-12" onClick={() => GotoNextPageProject(project)} >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>
                                  <h4 className="mt-0 mb-1 newalignv">
                                    <a
                                      style={{ textTransform: 'capitalize', cursor: "pointer" }}
                                      className="text-dark fw-bold font-16" onClick={() => GotoNextPageProject(project)}
                                    >
                                      {project.ProjectName}
                                    </a>
                                  </h4>
                                  <div
                                    className="finish  mb-3"

                                  >
                                    {project?.ProjectStatus}
                                  </div>
                                  <p
                                    className="date-color para8 font-12 mb-3"
                                    style={{ color: "#98a6ad", height: "40px", }}
                                  >
                                    {truncateString(project.ProjectOverview, project)}
                                    {/* <a   className="fw-bold text-muted">
                                    view more
                                  </a> */}
                                  </p>

                                  <p style={{ display: 'flex', color: '#6e767e', gap: '10px' }} className="mb-1 mt-2 font-12">
                                    <span

                                      className="pe-2 text-nowrap"
                                    >
                                      <img className="newimg1" src={require("../assets/docunew.png")} />
                                      {/* {project?.ProjectsDocsId?.length} */}
                                      {project?.FileCount || 0}
                                      &nbsp;Documents
                                    </span>
                                    <span>
                                      <img className="newimg2" src={require("../assets/commnew.png")} />
                                      {/* Display fetched comment count */}
                                      {/* {commentsData[project.ID] !== undefined ? (
                                    `${commentsData[project.ID]} Comments`
                                  ) : (
                                    'Loading comments...'
                                  )} */}
                                      {project.CommentsCount || 0}  Comments
                                    </span>

                                  </p>
                                  <div className="avatar-group mt-3 ms-2 mb-2">
                                    <div style={{ display: 'flex' }}

                                    >
                                      <div style={{ display: 'flex' }} >
                                        {project?.TeamMembers?.length > 0 && project?.TeamMembers?.map(
                                          (id: any, idx: any) => {
                                            console.log("project?.TeamMembers 12", project?.TeamMembers)
                                            if (idx < 3) {
                                              return (
                                                <div style={{ marginLeft: '-12px' }} className="gfg_tooltip">
                                                  {id?.SPSPicturePlaceholderState == 0 ?
                                                    <img
                                                      style={{
                                                        margin:
                                                          index == 0
                                                            ? "0 0 0 0"
                                                            : "0 0 0px -12px",
                                                      }}
                                                      src={

                                                        `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`

                                                      }
                                                      className="rounded-circlecss newminus img-thumbnail avatar-xl "
                                                      alt="profile-image"
                                                    />
                                                    :
                                                    id?.EMail !== null &&
                                                    <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circlecss img-thumbnail
                                  avatar-xl">
                                                      {`${id?.EMail.split('.')[0].charAt(0)}${id?.EMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                                    </Avatar>
                                                  }

                                                  {/* <img
                                                    style={{
                                                      margin:
                                                        index == 0
                                                          ? "0 0 0 0"
                                                          : "0 0 0px -12px",
                                                    }}
                                                    src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                    className="rounded-circlecss newminus img-thumbnail avatar-xl "
                                                    alt="profile-image"
                                                  /> */}
                                                  <span className="gfg_text">
                                                    {id?.Title}
                                                  </span>

                                                </div>


                                              );


                                            }
                                          }
                                        )}
                                        {
                                          project?.TeamMembers?.length > 3 &&

                                          <div
                                            className=""
                                            onClick={() =>
                                              toggleDropdown(project.Id)
                                            }
                                            key={project.Id}
                                          >

                                            <div
                                              style={{
                                                margin:
                                                  index == 0
                                                    ? "0 0 0 0"
                                                    : "0 0 0px -12px",
                                              }}
                                              className="rounded-circlecss newminus  text-center img-thumbnail avatar-xl"
                                            >
                                              +
                                            </div>
                                          </div>
                                        }
                                      </div>
                                      <div
                                        className=""
                                        style={{ position: "relative" }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.length > 0 && project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              console.log("project?.TeamMembers", project?.TeamMembers)
                                              return (
                                                <div>
                                                  {id?.Picture != null && id?.SPSPicturePlaceholderState == 0 ?
                                                    <img
                                                      style={{
                                                        margin:
                                                          idx == 0
                                                            ? "0 0 0 0"
                                                            : "0 0 0px -12px",
                                                      }}
                                                      src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                      className="rounded-circlecss newminus img-thumbnail avatar-xl"
                                                      alt="profile-image"
                                                    />
                                                    :
                                                    id?.EMail !== null &&
                                                    <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circlecss img-thumbnail
                              avatar-xl">
                                                      {`${id?.EMail.split('.')[0].charAt(0)}${id?.EMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                                    </Avatar>
                                                  }
                                                </div>

                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      }

                    </div>
                  </div>
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
