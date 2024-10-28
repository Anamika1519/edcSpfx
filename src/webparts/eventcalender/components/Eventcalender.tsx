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
  }, []);

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
                  {dataofevent.map((item) => {
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
                                  justifyContent: "space-evenly",
                                  cursor: "pointer",
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
                                <Bookmark
                                  size={20}
                                  color="#6c757d"
                                  strokeWidth={2}
                                  style={{ fontWeight: "400" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                        className="col-md-3 p-2"
                      // style={{ border: "1px solid green" }}
                      >
                        <div className="">
                          <div className="card-body">
                            {/* <div className="row">
                              <div
                                className="col-lg-3"
                                style={{ width: "100%" }}
                              >
                                <button
                                  className="btn btn-lg font-16 btn-secondary w-100"
                                  id="btn-new-event"
                                >
                                  <i className="fe-plus-circle"></i> Create New
                                  Event
                                </button>

                                <div id="external-events">
                                  <br />
                                  <p className="text-muted">
                                    Drag and drop your event or click in the
                                    calendar
                                  </p>
                                  <div
                                    className="external-event rounded-pill bg-success"
                                    data-class="bg-success"
                                  >
                                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>
                                    New Theme Release
                                  </div>
                                  <div
                                    className="external-event rounded-pill bg-info"
                                    data-class="bg-info"
                                  >
                                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>
                                    My Event
                                  </div>
                                  <div
                                    className="external-event rounded-pill bg-warning"
                                    data-class="bg-warning"
                                  >
                                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>
                                    Meet manager
                                  </div>
                                  <div
                                    className="external-event rounded-pill bg-danger"
                                    data-class="bg-danger"
                                  >
                                    <i className="mdi mdi-checkbox-blank-circle me-2 vertical-middle"></i>
                                    Create New theme
                                  </div>
                                </div>

                                <div className="mt-3 d-none d-xl-block">
                                  <h5 className="text-center text-dark font-16 fw-bold">
                                    How It Works ?
                                  </h5>

                                  <ul className="ps-3">
                                    <li className="text-muted mb-3">
                                      It has survived not only five centuries,
                                      but also the leap into electronic
                                      typesetting, remaining essentially
                                      unchanged.
                                    </li>
                                    <li className="text-muted mb-3">
                                      Richard McClintock, a Latin professor at
                                      Hampden-Sydney College in Virginia, looked
                                      up one of the more obscure Latin words,
                                      consectetur, from a Lorem Ipsum passage.
                                    </li>
                                    <li className="text-muted mb-3">
                                      It has survived not only five centuries,
                                      but also the leap into electronic
                                      typesetting, remaining essentially
                                      unchanged.
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-9 position-relative p-3"
                      // style={{ border: "1px solid red" }}
                      >
                        <Calendar
                          localizer={localizer}
                          events={myEventsList}
                          startAccessor="start"
                          endAccessor="end"
                          onSelectEvent={(event) => gotoNewsDetails(event)}
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