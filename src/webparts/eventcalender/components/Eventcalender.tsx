import React, { useEffect, useState } from "react";
import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import FeatherIcon from "feather-icons-react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Eventcalender.scss";
import { fetchEventdata } from "../../../APISearvice/EventCalendarService";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { IEventcalenderProps } from "./IEventcalenderProps";
import { Bookmark, Share2 } from "react-feather";
import { getCurrentUserProfileEmail } from "../../../APISearvice/CustomService";
import AvtarComponents from "../../../CustomJSComponents/AvtarComponents/AvtarComponents";
const EventcalenderContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const [itemsToShow, setItemsToShow] = useState(2);
  const [copySuccess, setCopySuccess] = useState("");
  const [show, setShow] = useState(false);
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  console.log("This function is called only once", useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const siteUrl = props.siteUrl;
  const copyToClipboard = (Id:number) => {
    const link = `${siteUrl}/SitePages/EventDetailsCalendar.aspx?${Id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy link');
      });
  };

  const [eventDetails, setEventDetails] = useState({
    Id: '',
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    image: '',
    Overview:'',
    Attendees:[],
    eventLink:''
  }); // Initialize with a blank object
  console.log(eventDetails);


  //#region Breadcrumb
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Events",
      ChildComponentURl: `${siteUrl}/SitePages/EventCalendar.aspx`,
    },
  ];
  //#endregion
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

  const [activeTab, setActiveTab] = useState<"listView" | "calendarView">(
    "listView"
  );

  // Explicitly define the parameter type as the same union type
  const handleTabChange = (tab: "listView" | "calendarView") => {
    setActiveTab(tab);
  };
  useEffect(() => {
    // fetchDynamicdata();
    ApiCall();
  }, [props]);

  const [dataofevent, setDataofEvent] = useState<any[]>([]);
  const [myEventsList, setMyEventsList] = useState([]);

  const ApiCall = async () => {
    const eventdata = await fetchEventdata(sp);
    setDataofEvent(eventdata);
    console.log("check-data-of--event", eventdata);

    const events = eventdata.map((event) => ({
      Id: event.ID,
      title: event.EventName,
      start: new Date(event.EventDate),
      end: new Date(new Date(event.EventDate).getTime() + 60 * 60 * 1000), // Assuming 1 hour duration
      allDay: false,
      image:event.image== undefined || event.image == null ? "" : JSON.parse(event.image),
      Overview:event.Overview,
      Attendees:event.Attendees,
      eventLink:`${SiteUrl}/SitePages/EventDetailsCalendar.aspx?${event.Id}`
    }));

    setMyEventsList(events);
  };

  const localizer = momentLocalizer(moment);
  const SiteUrl = props.siteUrl;

  const gotoNewsDetails = (valurArr: any) => {
    debugger;
    localStorage.setItem("EventId", valurArr.Id);
    localStorage.setItem("EventArr", JSON.stringify(valurArr));
    setTimeout(() => {
      window.location.href = `${SiteUrl}/SitePages/EventDetailsCalendar.aspx?${valurArr.Id}`;
    }, 1000);
  };

  const handleEventHover = (event:any) => {
    if (event) {
      var img1=event.image == undefined || event.image == null ? "" : event.image;
      if(img1 == null){
        img1 =''
 
      }
      setEventDetails({
        Id: event.Id || '',
        title: event.title || '',
        start: event.start || new Date(),
        end: event.end || new Date(),
        allDay: event.allDay || false,
        image: img1.serverRelativeUrl,
        Overview:event.Overview,
        Attendees:event.Attendees,
        eventLink:`${SiteUrl}/SitePages/EventDetailsCalendar.aspx?${event.Id}`
      });
     // console.log(event.image);
    }
    
  };
 
  const truncateText = (text: string, maxLength: number) => {
    if(text!=null)
    {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    }
};
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [currentEmail, setEmail] = useState("");

  const sendanEmail = () => {
    window.open("https://outlook.office.com/mail/inbox");
  };

  const toggleDropdown = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
    }
  };
  const loadMore = () => {
    event.preventDefault()
    event.stopImmediatePropagation()
    setItemsToShow(itemsToShow + 2); // Increase the number by 8
  };
   
  const[currentmonth , SetCurrentmonth] = useState<any>("");
  const[currentmonthevents , SetCurrentmonthevents] = useState<any>([]);
  useEffect(()=>{

    const currentDate = new Date();
    
    const monthNumber = currentDate.getMonth() + 1;
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentDate.getMonth()];
    SetCurrentmonth(monthName)
    console.log("Current Month Number:", monthNumber); 
    console.log("Current Month Name:", monthName); 
    
    async function eventthismonth () { 
       const eventofthismonth = await sp.web.lists.getByTitle("ARGEventMaster").items.select("*")()
       console.log(eventofthismonth , "eventofthismonth")
       const filteredData = eventofthismonth.filter((item:any) => {
        if (item.EventDate) {
            const eventDate = new Date(item.EventDate);
            return eventDate.getMonth() + 1 === currentmonth; // getMonth() returns 0-based month, so add 1
    
        }
        return false;
    });
    SetCurrentmonthevents(filteredData)
    console.log(filteredData, "filteredData")
       }
       eventthismonth()
    })
  return (
    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
          <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '1rem' }}>
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-4">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              {/* <div className="col-lg-8">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  <label htmlFor="search" className="visually-hidden">
                    Search
                  </label>
                  <div className="me-3 position-relative">
                    <input
                      type="search"
                      className="form-control my-1 my-md-0"
                      id="search"
                      placeholder="Search..."
                    />
                    <span
                      style={{
                        position: "absolute",
                        right: "11px",
                        top: "11px",
                        fontSize: "20px",
                      }}
                      className="fe-search"
                    ></span>
                  </div>
 
                  <label htmlFor="StartEventDateId" className="me-2">
                    From
                  </label>
                  <div className="me-3">
                    <input
                      type="date"
                      className="form-control my-1 my-md-0"
                      id="StartEventDateId"
                      max="9999-12-31"
                    />
                  </div>
 
                  <label htmlFor="EventEndDateId" className="me-2">
                    To
                  </label>
                  <div className="me-0">
                    <input
                      type="date"
                      className="form-control my-1 my-md-0"
                      id="EventEndDateId"
                      max="9999-12-31"
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="row justify-content-between">
                      <div className="col-md-12">
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                          <ul
                            className="nav nav-pills navtab-bg float-end"
                            role="tablist"
                            style={{ gap: "5px" }}
                          >
                            <li className="nav-item" role="presentation">
                              <a
                                className={`nav-link ${activeTab === "listView" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "listView"}
                                role="tab"
                                onClick={() => handleTabChange("listView")}
                              >
                                List View
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a
                                className={`nav-link ${activeTab === "calendarView" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "calendarView"}
                                role="tab"
                                onClick={() => handleTabChange("calendarView")}
                              >
                                Calendar View
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* end card */}
              </div>{" "}
              {/* end col */}
            </div>
            <div className="row mt-3">
              {/* Tab content */}
              <div className="tab-content mt-0">
                <div
                  className={`tab-pane fade ${activeTab === "listView" ? "show active" : ""
                    }`}
                  id="listView"
                  role="tabpanel"
                >
                   {dataofevent.slice(0, itemsToShow).map((item) => {
                    const ImageUrl1 =
                      item.image == undefined || item.image == null
                        ? ""
                        : JSON.parse(item.image);

                    const EventDate = new Date(item.EventDate);
                    const formattedEventDate = EventDate.toLocaleDateString(
                      "default",
                      {
                        day: "2-digit", // 2-digit day format (e.g., 01, 15)
                        month: "short", // Abbreviated month name (e.g., Jan, Feb)
                        year: "numeric", // Full year (e.g., 2024)
                      }
                    );
                    return (
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row align-items-start">
                            <div className="col-sm-2">
                              <a style={{ cursor: "pointer" }}>
                                <div
                                  className="imagehright">
                                  <img
                                    className="d-flex align-self-center me-3 w-100"
                                    style={{
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    src={
                                      ImageUrl1?.serverUrl +
                                      ImageUrl1?.serverRelativeUrl
                                    }
                                    alt="Event"
                                    onClick={() => gotoNewsDetails(item)}
                                  />
                                </div>
                              </a>
                            </div>

                            <div className="col-sm-9">
                              <div className="row">
                                <div className="col-sm-12">
                                  <span className="font-13 float-start mt-0 mb-1">
                                    {formattedEventDate}
                                  </span>
                                </div>
                              </div>

                              <a href={item.link} style={{ cursor: "pointer" }}>
                                <div
                                  className="w-100"
                                  onClick={() => gotoNewsDetails(item)}
                                >
                                  <h4
                                    className="mt-0 mb-1 font-16 fw-bold text-dark-new"
                                    style={{ fontSize: "16px" }}
                                  >
                                    {truncateText(item.EventName, 90)}
                                  </h4>
                                  <p
                                    style={{ color: "#6b6b6b" }}
                                    className="mb-2 font-14 text-muted"
                                  >
                                    {truncateText(item.Overview, 200)}
                                  </p>
                                </div>
                              </a>

                              <div className="row">
                                <div className="col-sm-6">
                                  <div id="tooltip-container">
                                    {/* <div className="avatar-group">
                                      {event.attendees.map(
                                        (attendee, attendeeIndex) => (
                                          <a
                                            key={attendeeIndex}
                                            href="javascript: void(0);"
                                            className="avatar-group-item"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            aria-label={attendee.name}
                                            title={attendee.name}
                                          >
                                            <img
                                              src={attendee.avatar}
                                              className="rounded-circle avatar-xs"
                                              alt={attendee.name}
                                            />
                                          </a>
                                        )
                                      )}
                                      <span className="font-14">Attending</span>
                                    </div> */}
                                    <div className="avatar-group">
                                      {/* <a
                                        // key={attendeeIndex}
                                        href="javascript: void(0);"
                                        className="avatar-group-item"
                                        data-bs-container="#tooltip-container"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        // aria-label={attendee.name}
                                        // title={attendee.name}
                                      >
                                        <img
                                          src={require("../../../Assets/ExtraImage/userimg.png")}
                                          className="rounded-circle avatar-xs"
                                          // alt={attendee.name}
                                        />
                                      </a> */}

                                      <span style={{ display: 'flex', gap: '0.2rem', alignItems:'center' }}>
                                        {
                                          item?.Attendees != undefined && item?.Attendees.length > 0 ? item?.Attendees.map((item1: any,index:any) => {

                                            return (
                                              <>
                                                {item1.EMail ? <span style={{ margin: index==0 ? '0 0 0 0' : '0 0 0px -12px' }}><img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`} className="attendeesImg" /> </span> :
                                                  <span> <AvtarComponents Name={item1.Title} /> </span>
                                                }
                                              </>
                                            )
                                          }):<img
                                          src={require("../../../Assets/ExtraImage/userimg.png")}
                                          className="rounded-circle avatar-xs"
                                          // alt={attendee.name}
                                        />
                                        }
                                        Attending
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-sm-1">
                              <div
                                className="d-flex"
                                style={{
                                  justifyContent: "end",
                                  cursor: "pointer",
                                  marginRight:"3px"
                                }}
                              >
                                <div
                                  className=""
                                  style={{ position: "relative" }}
                                >
                                  <div
                                    className=""
                                    onClick={() => toggleDropdown(item.Id)}
                                    key={item.Id}
                                  >
                                    <Share2
                                      size={20}
                                      color="#6c757d"
                                      strokeWidth={2}
                                      style={{ fontWeight: "400" }}
                                    />
                                  </div>
                                  {showDropdownId === item.Id && (
                                    <div className="dropdown-menu dropcss">
                                      <a
                                        className="dropdown-item dropcssItem"
                                        onClick={sendanEmail}
                                      >
                                        Share by email
                                      </a>
                                      <a
                                        className="dropdown-item dropcssItem"
                                        onClick={() => copyToClipboard(item.Id)}
                                      >
                                        Copy Link
                                      </a>
                                      <a>
                                      {copySuccess && <span className="text-success">{copySuccess}</span>}
                                      </a>
                                    </div>
                                  )}
                                </div>
                                {/* <Bookmark
                                  size={20}
                                  color="#6c757d"
                                  strokeWidth={2}
                                  style={{ fontWeight: "400" }}
                                /> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                       	 {itemsToShow < dataofevent.length && (
                   <div className="col-12 text-center mt-3">
                        <button  onClick={loadMore} className="btn btn-primary">
                          Load More 
                        </button>
                      </div>
                     )}
                </div>
                <div
                  className={`tab-pane fade ${activeTab === "calendarView" ? "show active" : ""
                    }`}
                  id="calendarView"
                  role="tabpanel"
                >
                  {/* Content for Calendar View */}
                  <div
                    style={{
                      // width: "100% ",
                      // height: "500px",
                      // backgroundColor: "white",

                    }}
                  >
                    <div className="row backwhite" style={{ display: "flex" }}>
                      <div
                        className="col-md-3"
                      // style={{ border: "1px solid green" }}


                      >
                        <h3 className="font-16 mb-3 text-dark fw-bold">{`Event for ${currentmonth} Month`}</h3>
                        {/* <div >
                          <div >
                          <div style={{padding:'10px'}} className="gal-box">
                          <a style={{float:'left',marginBottom:'15px'}} className="image-popup newhimg span57" >
        <img  src={require("../assets/ICAEvent.jpg")} className="d-block w-100" />
      </a>
      <a href={eventDetails.eventLink}>
        <div className="gall-info">
          <h4 className="font-16 mb-2 mt-2 text-dark fw-bold mt-0">Press Releases and Events</h4>
          <p className="font-14 text-muted">Al Rostamani Group, one of the UAE’s leading conglomerates, has once again demonstrated its steadfast commitment to Emiratisationfollowing its successful participation in the Ru’ya Careers UAE 2024, w...</p>
          <span style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            
                      <span  className="">
                      <img
                                          src={require("../../../Assets/ExtraImage/userimg.png")}
                                          className="rounded-circle avatar-xs"
                                          // alt={attendee.name}
                                        />
                      </span>
                   
                    <span className="font-12 text-muted">&nbsp;Attending</span>
                 
              
          </span>
        </div>
      </a>
                            </div>
                            </div>
                          </div> */}
                        {eventDetails?.title !== '' ? (
                          <div className="">
                          <div className="">
                          <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                         
                          <div className="carousel-inner">
  <div className="carousel-item active">
  <div style={{padding:'10px'}} className="gal-box">
  
    <>
      <a className="image-popup newhimg span57" title={eventDetails.title} href={eventDetails.eventLink}>
        <img src={eventDetails.image} className="d-block w-100" alt={eventDetails.title} />
      </a>
      <a href={eventDetails.eventLink}>
        <div className="gall-info">
          <h4 className="font-16 mb-2 mt-2 text-dark fw-bold mt-0">{truncateText(eventDetails.title, 90)}</h4>
          <p className="font-14 text-muted">{truncateText(eventDetails.Overview, 200)}</p>
          <span style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
            {eventDetails?.Attendees !== undefined && eventDetails?.Attendees.length > 0
              ? eventDetails.Attendees.map((item1: any, index: any) => (
                  <React.Fragment key={index}>
                    {item1.EMail ? (
                      <span style={{ margin: index === 0 ? '0' : '0 0 0px -12px' }} className="">
                        <img
                          src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`}
                          className="attendeesImg"
                          alt={item1.EMail}
                        />
                      </span>
                    ) : (
                      <span>
                        <AvtarComponents Name={item1.Title} />
                      </span>
                    )}
                    <span className="font-12 text-muted">&nbsp;Attending</span>
                  </React.Fragment>
                ))
              : null}
          </span>
        </div>
      </a>
    </>
 
</div>
 
     
     
    </div> </div>
 
  
  {/* <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div> */}
  {/* <div className="carousel-inner">
  {currentmonthevents.map((event:any, index:any) => {
    // Parse the image JSON string
    let imageUrl = '';
    if (event.image) {
      try {
        const imageObj = JSON.parse(event.image);
        imageUrl = `${imageObj.serverUrl}${imageObj.serverRelativeUrl}`;
        console.log("Image URL:", imageUrl);
      } catch (error) {
        console.error("Error parsing image JSON:", error);
      }
    }

    // return (
    //   <div
    //     className={`carousel-item ${index === 0 ? 'active' : ''}`}
    //     key={event.Id}
    //   >
    //     <div className="gal-box">
    //       <a
    //         className="image-popup newhimg"
    //         title={`Screenshot of ${event.EventName}`}
    //       >
    //         <img
    //           src={imageUrl}
    //           className="d-block w-100"
    //           alt={event.EventName || "Event image"}
    //         />
    //       </a>
    //       <div className="gall-info">
    //         <h4 className="font-16 twolinewrap mb-2 text-dark fw-bold mt-0">
    //           {event.EventName || "No Event Name"}
    //         </h4>
    //         <p className="font-14 text-muted">
    //           {event.Overview || "No overview available."}
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // );
  })}
</div> */}
  {/* <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button> */}
</div>

                          </div>

                        </div>

                      ) : <div></div>}
                      </div>
                      <div
                        className="col-md-9 position-relative p-3"
                      // style={{ border: "1px solid red" }}
                      >
                        <Calendar  style={{paddingTop:'0px'}}
                          localizer={localizer}
                          events={myEventsList}
                          startAccessor="start"
                          endAccessor="end"
                          onSelectEvent={(event) => handleEventHover(event)}
                        // style={{ height: 500 }}
                        />
                      </div>
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

const Eventcalender: React.FC<IEventcalenderProps> = (props) => (
  <Provider>
    <EventcalenderContext props={props} />
  </Provider>
);

export default Eventcalender;