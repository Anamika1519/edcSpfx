


import { escape, set } from "@microsoft/sp-lodash-subset";

import React, { useEffect, useState } from "react";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

// import "../components/MyApproval.scss";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
// import "./CustomTable.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";

import Provider from "../../../GlobalContext/provider";

import UserContext from "../../../GlobalContext/context";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
let currentItemID = ''
import {

  faEdit,

  faPaperclip,

  faSort,

  faEye,

  faTrashAlt,
  faSearch,

} from "@fortawesome/free-solid-svg-icons";

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

import * as XLSX from "xlsx";

import moment from "moment";



// import {

//   addItem,

//   GetCategory,

//   getChoiceFieldOption,

//   getDiscussionComments,

//   getDiscussionFilter,

//   getDiscussionFilterAll,

//   getDiscussionForum,

//   getDiscussionMe,

//   getDiscussionMeAll,

//   updateItem,

// } from "../../../APISearvice/DiscussionForumService";

import { encryptId } from "../../../APISearvice/CryptoService";



import Swal from "sweetalert2";

import { getCategory, getEntity } from "../../../APISearvice/CustomService";

import ReactQuill from "react-quill";

import { uploadFileToLibrary } from "../../../APISearvice/MediaService";

import "react-quill/dist/quill.snow.css";

import { SPFI } from "@pnp/sp/presets/all";

// import { fetchUserInformationList } from "../../../APISearvice/GroupTeamService";

// import Multiselect from "multiselect-react-dropdown";

import { Eye } from "react-feather";

import { getDataByID, getMyRequest, getRequestListsData, gteDMSApproval } from "../../../APISearvice/ApprovalService";

import { getSP } from '../loc/pnpjsConfig';

import { IMyRequestProps } from "./IMyRequestProps";

import { getAnncouncementByID } from "../../../APISearvice/AnnouncementsService";
// import DMSMyApprovalAction from "./ApprovalAction";
import DMSMyrequestLog from "./DMSMyrequestLog";
// import { WorkflowAuditHistory } from "../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory";
import { Button, Modal } from "react-bootstrap";
import { WorkflowAuditHistory } from "../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory";

const MyRequestContext = ({ props }: any) => {

  const sp: SPFI = getSP();

  const { useHide }: any = React.useContext(UserContext);

  const [announcementData, setAnnouncementData] = React.useState([]);

  const [myApprovalsData, setMyApprovalsData] = React.useState([]);

  const elementRef = React.useRef<HTMLDivElement>(null);

  const SiteUrl = props.siteUrl;

  const [newsData, setNewsData] = React.useState([]);

  const [TypeData, setTypeData] = React.useState([]);

  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);

  const [DocumentpostArr, setDocumentpostArr] = React.useState([]);

  const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);

  const [ImagepostArr, setImagepostArr] = React.useState([]);

  const [ImagepostArr1, setImagepostArr1] = React.useState([]);

  const [GrouTypeData, setGroupTypeData] = React.useState([]);

  const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);

  const [selectedValue, setSelectedValue] = useState([]);

  const [EnityData, setEnityData] = React.useState([]);

  const [options, setOpions] = useState([]);

  const [approved, setApproved] = useState('yes');

  const [MainCardBody, setMainCardBody] = useState('');

  const [filters, setFilters] = React.useState({

    SNo: "",

    RequestID: "",

    ProcessName: "",

    RequestedBy: "",

    RequestedDate: "",

    Status: "",
    Title: ""
  });



  const [isOpen, setIsOpen] = React.useState(false);

  const [IsinvideHide, setIsinvideHide] = React.useState(false);

  const toggleDropdown = () => {

    setIsOpen(!isOpen);

  };



  const [sortConfig, setSortConfig] = React.useState({

    key: "",

    direction: "ascending",

  });







  const [formData, setFormData] = React.useState({

    topic: "",

    category: "",

    entity: "",

    Type: "",

    GroupType: "",

    description: "",

    overview: "",

    FeaturedAnnouncement: false,

  });

  const [approveData, setApproveData] = useState([]);

  const [myRequestDataAll, setmyRequestDataAll] = useState([]);

  const [myRequestDataAllDMS, setMyRequestDataAllDMS] = useState<any[]>([]);

  const [AutomationData, setAutomationData] = useState([]);

  const [isActivedata, setisActivedata] = useState(false)

  const [DiscussionData, setDiscussion] = useState([]);

  const [CategoryData, setCategoryData] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);
  const [showModal2, setShowModal2] = React.useState(false);

  const [showDocTable, setShowDocTable] = React.useState(false);

  const [showImgModal, setShowImgTable] = React.useState(false);

  const [showBannerModal, setShowBannerTable] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState(null);

  const [editForm, setEditForm] = React.useState(false);

  const [richTextValues, setRichTextValues] = React.useState<{

    [key: string]: string;

  }>({});

  const [activeTab, setActiveTab] = useState("Intranet");
  const [StatusTypeData, setStatusTypeData] = useState([
    { id: "Pending", name: "Pending" },
    { id: "Approved", name: "Approved" },
    { id: "Rejected", name: "Rejected" },
    { id: "Auto Approved", name: "Auto Approved" },
  ]);
  const handleTabClick = async (tab: React.SetStateAction<string>) => {
    setShowNestedDMSTable("");
    setActiveTab(tab);

    console.log("tab", tab)
    // alert(activeTab);
    if (tab == "Intranet") {

      setMyApprovalsData(myRequestDataAll);
      console.log(myApprovalsData, "myApprovalsData");
    } else if (tab == "DMS") {

      setMyApprovalsData(myRequestDataAllDMS);

      console.log(myRequestDataAllDMS, "myRequestDataAllDMS");
    } else if (tab == "Automation") {

      setMyApprovalsData(AutomationData);

    }

  };



  React.useEffect(() => {

    sessionStorage.removeItem("announcementId");

    ApiCall("Pending");

  }, [useHide]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const myrequestdatadms:any = await gteDMSApproval(sp);
  //       console.log("myrequestdatadms", myrequestdatadms);
  //       setMyRequestDataAllDMS(myrequestdatadms);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);


  const ApiCall = async (status: String) => {

    let myrequestdata = await getMyRequest(sp, status);

    console.log(myrequestdata, "myrequestdata");
    let myrequestdatadms: any = await gteDMSApproval(sp, status)
    console.log(myrequestdatadms, "myrequestdatadms");
    setMyApprovalsData(await getMyRequest(sp, status));

    setmyRequestDataAll(myrequestdata);
    setMyRequestDataAllDMS(myrequestdatadms);

    let Automationdata = await getRequestListsData(sp, status);

    setAutomationData(Automationdata);

    console.log("AutomationdataAutomationdata", Automationdata, myrequestdata);

  };
  const getcurrentuserwithfileUID = async (fileUid: any) => {
    let currentuser = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items
      .select("*", "FileUID/FileUID", "fileUid/ID").expand("FileUID").filter(`FileUID/FileUID eq '${fileUid}' and Log eq null`).getAll().then((res) => {

      })

  }
  // const FilterDiscussionData = async (optionFilter: string) => {

  //   setAnnouncementData(await getDiscussionFilterAll(sp, optionFilter));

  // };

  const handleFilterChange = (

    e: React.ChangeEvent<HTMLInputElement>,

    field: string

  ) => {

    console.log("eee", e);

    setFilters({

      ...filters,

      [field]: e.target.value,

    });

  };



  const applyFiltersAndSorting = (data: any[]) => {

    // Filter data

    console.log(

      "filters",

      data,

      filters,

      filters.ProcessName,

      filters.RequestID

    );

    const filteredData = data?.filter((item, index) => {



      return (

        (filters.SNo === "" || String(index + 1).includes(filters.SNo)) &&

        (filters.ProcessName === "" ||

          (item.SourceName != undefined &&

            item.SourceName.toLowerCase().includes(

              filters.ProcessName.toLowerCase()

            ))) &&

        (filters.RequestID === "" ||

          (item.SourceName != undefined &&

            (item.SourceName.toLowerCase().includes(

              filters.RequestID.toLowerCase()

            ) || item.ContentID.toLowerCase().includes(

              filters.RequestID.toLowerCase()

            )))) &&

        // (filters.ProcessName === "" ||

        //   item.ProcessName.toLowerCase().includes(filters.ProcessName.toLowerCase())) &&

        (filters.Status === "" ||

          item.Status.toLowerCase().includes(filters.Status.toLowerCase())) &&
        (filters.RequestedDate === "" ||

          new Date(item.Created).toLocaleDateString()
            .startsWith(filters.RequestedDate + ""))
        &&
        (filters.Title === "" ||

          item.Title.toLowerCase().includes(filters.Title.toLowerCase()))
        // (filters.RequestedBy === "" ||
        //   (activeTab == "Automation" ? (item?.Author?.Title?.toLowerCase().includes(
        //     filters.RequestedBy.toLowerCase()
        //   )) : (item?.Requester?.Title?.toLowerCase().includes(
        //     filters.RequestedBy.toLowerCase()
        //   ))))

      );

    });



    const sortedData = filteredData?.sort((a, b) => {

      if (sortConfig.key === "SNo") {

        // Sort by index

        const aIndex = data.indexOf(a);

        const bIndex = data.indexOf(b);

        return sortConfig.direction === "ascending"

          ? aIndex - bIndex

          : bIndex - aIndex;

      } else if (sortConfig.key == "RequestedDate") {

        // Sort by other keys

        const aValue = a['Created'] ? new Date(a['Created']) : "";

        const bValue = b['Created'] ? new Date(b['Created']) : "";

        if (aValue < bValue) {

          return sortConfig.direction === "ascending" ? -1 : 1;

        }

        if (aValue > bValue) {

          return sortConfig.direction === "ascending" ? 1 : -1;

        }

      }
      else if (sortConfig.key) {

        // Sort by other keys

        const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : "";

        const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : "";

        if (aValue < bValue) {

          return sortConfig.direction === "ascending" ? -1 : 1;

        }

        if (aValue > bValue) {

          return sortConfig.direction === "ascending" ? 1 : -1;

        }

      }

      return 0;

    });

    return sortedData;

  };



  const filteredMyApprovalData = applyFiltersAndSorting(myApprovalsData);

  const filteredNewsData = applyFiltersAndSorting(newsData);

  const [currentPage, setCurrentPage] = React.useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredMyApprovalData?.length / itemsPerPage);



  const [ContentData, setContentData] = React.useState<any>([]);

  const [currentItem, setCurrentItem] = React.useState<any>([]);







  const handlePageChange = (pageNumber: any) => {

    if (pageNumber > 0 && pageNumber <= totalPages) {

      setCurrentPage(pageNumber);

    }

  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredMyApprovalData?.slice(startIndex, endIndex);

  const newsCurrentData = filteredNewsData?.slice(startIndex, endIndex);

  const [editID, setEditID] = React.useState(null);
  const [contenttype, setContentType] = React.useState(null);

  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);

  const siteUrl = props.siteUrl;



  const Breadcrumb = [

    {

      MainComponent: "Home",

      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,

    },

    {

      ChildComponent: "My Request",

      ChildComponentURl: `${siteUrl}/SitePages/MyRequests.aspx`,

    },

  ];

  console.log(announcementData, "announcementData");



  const exportToExcel = (data: any[], fileName: string) => {

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);

  };

  // const fetchOptions = async () => {

  //   try {

  //     const items = await fetchUserInformationList(sp);

  //     console.log(items, "itemsitemsitems");



  //     const formattedOptions = items.map((item: { Title: any; Id: any }) => ({

  //       name: item.Title, // Adjust according to your list schema

  //       id: item.Id,

  //     }));

  //     setOpions(formattedOptions);

  //   } catch (error) {

  //     console.error("Error fetching options:", error);

  //   }

  // };



  const handleSortChange = (key: string) => {

    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {

      direction = "descending";

    }

    setSortConfig({ key, direction });

  };



  React.useEffect(() => {

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

      UserGet();

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



  const UserGet = async () => {

    const users = await sp.web.siteUsers();

    console.log(users, "users");

  };

  const handleStatusChange = async (name: string, value: string) => {
    if (value === "") {
      // Show all records if no type is selected
      console.log("No status selected");
    } else {
      console.log("name,value", value, name);
      // Filter records based on the selected type
      let Myrequestdata = await getMyRequest(sp, value);
      let Automationdata = await getRequestListsData(sp, value);
      let mydmsData = await gteDMSApproval(sp, value);
      //let MyDMSAPPROVALDATA:any = await MyDMSAPPROVALDATASTATUS(sp, value)
      setmyRequestDataAll(await getMyRequest(sp, value));
      setAutomationData(await getRequestListsData(sp, value));
      if (activeTab == "Intranet") {

        setMyApprovalsData(await getMyRequest(sp, value));
        console.log(myApprovalsData, "myApprovalsData");
      } else if (activeTab == "DMS") {

        setMyApprovalsData(mydmsData);

        console.log(myRequestDataAllDMS, "myRequestDataAllDMS");
      } else if (activeTab == "Automation") {

        setMyApprovalsData(await getRequestListsData(sp, value));

      }

      // else if (activeTab == "Automation") {
      //   setMyApprovalsData(null);
      //   //setMyApprovalsData(MyDMSAPPROVALDATA);
      //   setMyApprovalsData(Mylistdata);
      //   console.log("Automationdata", Automationdata);
      // }
    }
  };

  const handleRedirect = async (Item: any) => {
    console.log(Item, "----Item");
    let redirecturl = "";
    if (activeTab == "Automation") {
      window.open(Item.RedirectionLink, "_blank");
      //location.href = `${Item.RedirectionLink}`;
    } else if (activeTab == "Intranet") {
      // if (Item.ProcessName == "Event") {
      //   location.href = `${siteUrl}/SitePages/EventDetailsCalendar.aspx?${Item.ContentId}`;
      // }
      // else if (Item.ProcessName == "Media") {
      //   location.href = `${siteUrl}/SitePages/Mediadeatils.aspx`;
      // }
      // else {
      //   let id = Item.ContentId;
      //   const redirectUrl = `${siteUrl}/SitePages/${Item.ProcessName}Details1.aspx?${Item.ContentId}`;
      //   console.log("Redirect URL:", redirectUrl);
      //   location.href = redirectUrl;
      // }
      let sessionkey = "";
      debugger
      if (Item?.SourceName) {
        switch (Item?.SourceName) {
          case "Announcement":
            sessionkey = "announcementId";
            redirecturl = `${siteUrl}/SitePages/AddAnnouncement.aspx` + "?requestid=" + Item?.Id + "&mode=view";
            break;
          case "News":
            sessionkey = "announcementId";
            redirecturl = `${siteUrl}/SitePages/AddAnnouncement.aspx` + "?requestid=" + Item?.Id + "&mode=view";
            break;
          case "Event":
            sessionkey = "EventId";
            redirecturl = `${siteUrl}/SitePages/EventMasterForm.aspx` + "?requestid=" + Item?.Id + "&mode=view";
            break;
          case "Media":
            sessionkey = "mediaId";
            redirecturl = `${siteUrl}/SitePages/MediaGalleryForm.aspx` + "?requestid=" + Item?.Id + "&mode=view";
            break;
          default: ;
        }

        const encryptedId = encryptId(String(Item?.ContentID));
        sessionStorage.setItem(sessionkey, encryptedId);
        location.href = redirecturl;

      }
    } else if (activeTab == "DMS") {

      // window.location.href = `${siteUrl}/SitePages/DMS.aspx?${Item?.ContentId}`;
    }
  };
  const getTaskItemsbyID = async (itemid: any) => {
    // currentItemID = itemid
    // setDMSMyreq("false");

    currentItemID = itemid
    // alert(DMSMyreq)
    // setMainCardBody('DMS')
    console.log("itemid", itemid)
    const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select("CurrentUser", "FileUID/FileUID", "Log").expand("FileUID").filter(`FileUID/RequestNo eq '${itemid}'`)();
    console.log(items, "items")
  }
  let DMSMyreq = 'true'
  // const [DMSMyreq , setDMSMyreq] = useState('true')
  const handleReturnToMain = (Name: any) => {
    DMSMyreq = 'true'
    // setDMSMyreq("true"); // Reset to show the main component
    console.log(DMSMyreq, "activeComponent updated")
  };
  // const [showNestedDMSTable, setShowNestedDMSTable] = useState(false); // Tracks nested table for DMS
  // const handleTabClick = (tab: string) => {
  //   setActiveTab(tab);
  //   if (tab !== "DMS") {
  //     setShowNestedDMSTable(false); // Reset nested DMS table if another tab is clicked
  //   }
  // };
  //  DMS My Request 
  const [showNestedDMSTable, setShowNestedDMSTable] = useState("");
  const openAuditModal = (item: any) => {
    console.log("iteiiiii", item);
    setEditID(item.ContentID);
    setContentType(item.SourceName);
    setShowModal(true);
  }

  const handleShowNestedDMSTable = (value: string) => {

    setShowNestedDMSTable(value); // Show nested table within DMS
    if (value == "") {
      setShowModal2(true);
    };
  }
  const handleCloseModal = () => {
    setShowModal2(false);
    setShowNestedDMSTable("");
  };

  return (

    <div id="wrapper" ref={elementRef}>

      <div className="app-menu" id="myHeader">

        <VerticalSideBar _context={sp} />

      </div>



      <div className="content-page">

        <HorizontalNavbar />

        <div

          className="content"

          style={{

            marginLeft: `${!useHide ? "240px" : "80px"}`,

            marginTop: "0rem",

          }}>

          <div className="container-fluid paddb">

            <div className="row" style={{ paddingLeft: "0.5rem" }}>

              <div className="col-lg-8">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>
              <div className="col-md-4">
                <div className="row">
                  <div style={{ textAlign: "right" }} className="col-md-4 newtexleft">
                    <div className="mb-0">
                      <label htmlFor="Status" className="form-label mt-2">
                        Filter By
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <select
                      id="Type"
                      name="Type"
                      onChange={(e) =>
                        handleStatusChange(e.target.name, e.target.value)
                      }
                      className="form-select"
                    >
                      {/* <option value="">Pending</option> */}
                      {StatusTypeData.map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">

              <div className="col-12">

                <div className="card mb-0 cardcsss">

                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-center">

                      <ul

                        className="nav nav-pills navtab-bg float-end"

                        role="tablist"

                      >

                        <li className="nav-item" role="presentation">

                          <a


                            onClick={() => handleTabClick("Intranet")}

                            className={`nav-link ${activeTab === "Intranet" ? "active" : ""

                              }`}

                            aria-selected={activeTab === "Intranet"}

                            role="tab"

                          >

                            <span className="lenbg1">Intranet</span>
                            <span className="lenbg">
                              {myRequestDataAll.length}
                            </span>

                          </a>

                        </li>

                        <li className="nav-item" role="presentation">

                          <a


                            onClick={() => handleTabClick("DMS")}

                            className={`nav-link ${activeTab === "DMS" ? "active" : ""

                              }`}

                            aria-selected={activeTab === "DMS"}

                            role="tab"

                            tabIndex={-1}

                          >

                            <span className="lenbg1">DMS </span>
                            <span className="lenbg">
                              {myRequestDataAllDMS.length}
                            </span>

                          </a>

                        </li>

                        <li className="nav-item" role="presentation">

                          <a


                            onClick={() => handleTabClick("Automation")}

                            className={`nav-link ${activeTab === "Automation" ? "active" : ""

                              }`}

                            aria-selected={activeTab === "Automation"}

                            role="tab"

                            tabIndex={-1}

                          >

                            <span className="lenbg1">Automation </span>
                            <span className="lenbg">
                              {AutomationData.length}
                            </span>

                          </a>

                        </li>

                      </ul>

                    </div>
                  </div></div></div> </div>
            <div className="card cardCss mt-2">

              <div className="card-body">

                <div id="cardCollpase4" className="collapse show">

                  <div className="table-responsive pt-0">
                    {
                      activeTab === "Intranet" || activeTab === "Automation" ? (

                        <>
                          <table

                            className="mt-0 mtbalenew table-centered table-nowrap table-borderless mb-0"

                            style={{ position: "relative" }}

                          >

                            <thead>

                              <tr>

                                <th

                                  style={{



                                    minWidth: "40px",

                                    maxWidth: "40px",



                                  }}

                                >

                                  <div

                                    className="d-flex pb-2"

                                    style={{ justifyContent: "space-between" }}

                                  >

                                    <span>S.No.</span>

                                    <span onClick={() => handleSortChange("SNo")}>

                                      <FontAwesomeIcon icon={faSort} />

                                    </span>

                                  </div>

                                  <div className="bd-highlight">

                                    <input

                                      type="text"

                                      placeholder="index"

                                      onChange={(e) => handleFilterChange(e, "SNo")}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault(); // Prevents the new line in textarea
                                        }
                                      }}
                                      className="inputcss"

                                      style={{ width: "100%" }}

                                    />

                                  </div>

                                </th>

                                <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Request ID</span>

                                      <span

                                        onClick={() => handleSortChange("RequestID")}

                                      >

                                        <FontAwesomeIcon icon={faSort} />

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Request ID"

                                        onChange={(e) =>

                                          handleFilterChange(e, "RequestID")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th>
                                <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Title</span>

                                      <span

                                        onClick={() => handleSortChange("Title")}

                                      >

                                        <FontAwesomeIcon icon={faSort} />

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Title"

                                        onChange={(e) =>

                                          handleFilterChange(e, "Title")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th>
                                <th style={{ minWidth: "120px", maxWidth: "120px" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex  pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Process Name</span>{" "}

                                      <span

                                        onClick={() =>

                                          handleSortChange("ProcessName")

                                        }

                                      >

                                        <FontAwesomeIcon icon={faSort} />{" "}

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Process Name"

                                        onChange={(e) =>

                                          handleFilterChange(e, "ProcessName")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th>

                                {/* <th style={{ minWidth: "100px", maxWidth: "100px" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex  pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Requested By</span>{" "}

                                      <span

                                        onClick={() =>

                                          handleSortChange("RequestedBy")

                                        }

                                      >

                                        <FontAwesomeIcon icon={faSort} />{" "}

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Approver By"

                                        onChange={(e) =>

                                          handleFilterChange(e, "RequestedBy")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th> */}
                                <th style={{ minWidth: "100px", maxWidth: "100px", verticalAlign: "Top" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex  pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Requested Date</span>{" "}

                                      <span

                                        onClick={() =>

                                          handleSortChange("RequestedDate")

                                        }

                                      >

                                        <FontAwesomeIcon icon={faSort} />{" "}

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Requested Date"

                                        onChange={(e) =>

                                          handleFilterChange(e, "RequestedDate")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th>
                                <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex  pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>Status</span>{" "}

                                      <span

                                        onClick={() => handleSortChange("Status")}

                                      >

                                        <FontAwesomeIcon icon={faSort} />{" "}

                                      </span>

                                    </div>

                                    <div className=" bd-highlight">

                                      <input

                                        type="text"

                                        placeholder="Filter by Status"

                                        onChange={(e) =>

                                          handleFilterChange(e, "Status")

                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault(); // Prevents the new line in textarea
                                          }
                                        }}
                                        className="inputcss"

                                        style={{ width: "100%" }}

                                      />

                                    </div>

                                  </div>

                                </th>





                                <th

                                  style={{

                                    minWidth: "50px",

                                    maxWidth: "50px",
                                    textAlign: "center",

                                    verticalAlign: "top",

                                  }}

                                >

                                  <div className="d-flex flex-column bd-highlight ">

                                    <div

                                      className="d-flex  pb-2"

                                      style={{ justifyContent: "space-between" }}

                                    >

                                      <span>View Details</span>{" "}


                                    </div>



                                  </div>

                                </th>

                              </tr>

                            </thead>

                            <tbody>

                              {currentData?.length === 0 ? (

                                <div

                                  className="no-results card card-body align-items-center  annusvg text-center "

                                  style={{

                                    display: "flex",

                                    justifyContent: "center",
                                    position: 'relative',
                                    marginTop: '10px',
                                    height: '450px'

                                  }}

                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>

                                  <p className="font-14 text-muted text-center">No Request found </p>

                                </div>

                              ) : (

                                currentData?.map((item: any, index: number) => (

                                  <tr

                                    onClick={() =>

                                      handleRedirect(item.RedirectionLink)

                                    }

                                    key={index}

                                    style={{ cursor: "pointer" }}

                                  >

                                    <td

                                      style={{ minWidth: "40px", maxWidth: "40px" }}

                                    >

                                      <div style={{ marginLeft: '3px' }} className="indexdesign">{startIndex + index + 1}</div>

                                    </td>

                                    <td

                                      style={{

                                        minWidth: "80px",

                                        maxWidth: "80px",

                                        textTransform: "capitalize",

                                      }}

                                    >

                                      {/* {item.RequestID} */}
                                      {activeTab == "Automation" ? item?.ProcessName : item?.SourceName}_{item?.ContentID}

                                    </td>
                                    <td

                                      style={{

                                        minWidth: "80px",

                                        maxWidth: "80px",

                                        textTransform: "capitalize",

                                      }}
                                      title= {item.Title}
                                    >

                                      {/* {item.RequestID} */}
                                      {item.Title}

                                    </td>
                                    <td

                                      style={{ minWidth: "120px", maxWidth: "120px" }}

                                    >

                                      {/* {item.ProcessName} */}
                                      {activeTab == "Automation" ? item?.ProcessName : item?.SourceName}

                                    </td>

                                    {/* <td

                                      style={{ minWidth: "100px", maxWidth: "100px" }}

                                    >
                                      {item?.Author.Title}
                                      {/* 
                                      {activeTab == "Automation" ? item?.Author.Title : item?.Requester?.Title} */}

                                    {/* </td> */}


                                    <td

                                      style={{ minWidth: "100px", maxWidth: "100px" }}

                                    >

                                      {new Date(item?.Created).toLocaleDateString()}

                                    </td>
                                    <td

                                      style={{ minWidth: "80px", maxWidth: "80px", textAlign: 'center' }}

                                    >
                                      <div className="btn btn-status">
                                        <a onClick={() => openAuditModal(item)}> {item?.Status}</a>
                                      </div>

                                    </td>



                                    <td

                                      style={{ minWidth: "50px", maxWidth: "50px", textAlign: 'center' }}

                                      className="fe-eye font-18"

                                    >

                                      <img style={{ cursor: 'pointer' }} onClick={() => handleRedirect(item)} src={require('../../../CustomAsset/Eye.png')} />
                                      {/* <Eye onClick={() => handleRedirect(item)}

                                        style={{

                                          minWidth: "20px",

                                          maxWidth: "20px",

                                          marginLeft: "15px",

                                          cursor: "pointer",

                                        }} /> */}



                                    </td>

                                  </tr>

                                ))

                              )}

                            </tbody>

                          </table>
                        </>
                      ) :
                        null
                    }
                    {activeTab === "DMS" && (
                      <div>
                        {
                          showNestedDMSTable === "" ? (
                            <div>
                              <table
                                className="mt-0 mtbalenew table-centered table-nowrap table-borderless mb-0"
                                style={{ position: "relative" }}
                              >
                                <thead>

                                  <tr>
                                    {/*Table sr no */}
                                    <th

                                      style={{



                                        minWidth: "40px",

                                        maxWidth: "40px",



                                      }}

                                    >

                                      <div

                                        className="d-flex pb-2"

                                        style={{ justifyContent: "space-between" }}

                                      >

                                        <span>S.No.</span>

                                        <span onClick={() => handleSortChange("SNo")}>

                                          <FontAwesomeIcon icon={faSort} />

                                        </span>

                                      </div>

                                      <div className="bd-highlight">

                                        <input

                                          type="text"

                                          placeholder="index"

                                          onChange={(e) => handleFilterChange(e, "SNo")}

                                          className="inputcss"

                                          style={{ width: "100%" }}

                                        />

                                      </div>

                                    </th>
                                    {/*Table req ID */}
                                    <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>Request ID</span>

                                          <span

                                            onClick={() => handleSortChange("RequestID")}

                                          >

                                            <FontAwesomeIcon icon={faSort} />

                                          </span>

                                        </div>

                                        <div className=" bd-highlight">

                                          <input

                                            type="text"

                                            placeholder="Filter by Request ID"

                                            onChange={(e) =>

                                              handleFilterChange(e, "RequestID")

                                            }

                                            className="inputcss"

                                            style={{ width: "100%" }}

                                          />

                                        </div>

                                      </div>

                                    </th>
                                    {/*Table Title*/}
                                    <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>Title</span>

                                          <span

                                            onClick={() => handleSortChange("Title")}

                                          >

                                            <FontAwesomeIcon icon={faSort} />

                                          </span>

                                        </div>

                                        <div className=" bd-highlight">

                                          <input

                                            type="text"

                                            placeholder="Filter by Title"

                                            onChange={(e) =>

                                              handleFilterChange(e, "Title")

                                            }

                                            className="inputcss"

                                            style={{ width: "100%" }}

                                          />

                                        </div>

                                      </div>

                                    </th>
                                    <th style={{ minWidth: "120px", maxWidth: "120px" }}>

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex  pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>Process Name</span>{" "}

                                          <span

                                            onClick={() =>

                                              handleSortChange("ProcessName")

                                            }

                                          >

                                            <FontAwesomeIcon icon={faSort} />{" "}

                                          </span>

                                        </div>

                                        <div className=" bd-highlight">

                                          <input

                                            type="text"

                                            placeholder="Filter by Process Name"

                                            onChange={(e) =>

                                              handleFilterChange(e, "ProcessName")

                                            }

                                            className="inputcss"

                                            style={{ width: "100%" }}

                                          />

                                        </div>

                                      </div>

                                    </th>




                                    <th style={{ minWidth: "100px", maxWidth: "100px" }}>

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex  pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>Requested Date</span>{" "}

                                          <span

                                            onClick={() =>

                                              handleSortChange("RequestedBy")

                                            }

                                          >

                                            <FontAwesomeIcon icon={faSort} />{" "}

                                          </span>

                                        </div>

                                        <div className=" bd-highlight">

                                          <input

                                            type="text"

                                            placeholder="Filter by Approver By"

                                            onChange={(e) =>

                                              handleFilterChange(e, "RequestedBy")

                                            }

                                            className="inputcss"

                                            style={{ width: "100%" }}

                                          />

                                        </div>

                                      </div>

                                    </th>
                                    <th style={{ minWidth: "80px", maxWidth: "80px" }}>

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex  pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>Status</span>{" "}

                                          <span

                                            onClick={() => handleSortChange("Status")}

                                          >

                                            <FontAwesomeIcon icon={faSort} />{" "}

                                          </span>

                                        </div>

                                        <div className=" bd-highlight">

                                          <input

                                            type="text"

                                            placeholder="Filter by Status"

                                            onChange={(e) =>

                                              handleFilterChange(e, "Status")

                                            }

                                            className="inputcss"

                                            style={{ width: "100%" }}

                                          />

                                        </div>

                                      </div>

                                    </th>

                                    <th

                                      style={{

                                        minWidth: "50px",

                                        maxWidth: "50px",
                                        textAlign: "center",

                                        verticalAlign: "top",

                                      }}

                                    >

                                      <div className="d-flex flex-column bd-highlight ">

                                        <div

                                          className="d-flex  pb-2"

                                          style={{ justifyContent: "space-between" }}

                                        >

                                          <span>View Details</span>{" "}


                                        </div>



                                      </div>

                                    </th>
                                  </tr>

                                </thead>

                                <tbody>

                                  {currentData?.length === 0 ? (

                                    <div

                                      className="no-results card card-body align-items-center  annusvg text-center "

                                      style={{

                                        display: "flex",

                                        justifyContent: "center",
                                        position: 'relative',
                                        marginTop: '10px',
                                        height: '300px'

                                      }}

                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>

                                      <p className="font-14 text-muted text-center">No Request found </p>

                                    </div>

                                  ) : (

                                    currentData?.map((item: any, index: number) => (

                                      <tr

                                        onClick={() =>

                                          handleRedirect(item.RedirectionLink)

                                        }

                                        key={index}

                                        style={{ cursor: "pointer" }}

                                      >

                                        <td

                                          style={{ minWidth: "40px", maxWidth: "40px" }}

                                        >

                                          {startIndex + index + 1}

                                        </td>

                                        <td

                                          style={{

                                            minWidth: "80px",

                                            maxWidth: "80px",

                                            textTransform: "capitalize",

                                          }}

                                        >

                                          {/* {item.RequestID} */}
                                          {item.FileUID}

                                        </td>

                                        <td

                                          style={{

                                            minWidth: "80px",

                                            maxWidth: "80px",

                                            textTransform: "capitalize",

                                          }}

                                        >

                                          {/* {item.RequestID} */}
                                          {item.FileName}

                                        </td>

                                        <td

                                          style={{ minWidth: "120px", maxWidth: "120px" }}

                                        >

                                          {/* {item.ProcessName} */}
                                          DMS

                                        </td>




                                        <td

                                          style={{ minWidth: "100px", maxWidth: "100px" }}

                                        >

                                          {new Date(item?.Created).toLocaleDateString()}

                                        </td>
                                        <td

                                          style={{ minWidth: "80px", maxWidth: "80px" }}

                                        >
                                          <div className="btn btn-status">
                                            <a onClick={() => { getTaskItemsbyID(item.FileUID); handleShowNestedDMSTable("") }}> {item?.Status}</a>
                                          </div>
                                          <div className="btn btn-status">
                                            {item?.Status}</div>

                                        </td>



                                        <td

                                          style={{ minWidth: "50px", maxWidth: "50px" }}

                                          className="fe-eye font-18"

                                        >



                                          <Eye onClick={() => { getTaskItemsbyID(item.FileUID); handleShowNestedDMSTable("DMSAuditHistory") }}

                                            style={{

                                              minWidth: "20px",

                                              maxWidth: "20px",

                                              marginLeft: "15px",

                                              cursor: "pointer",

                                            }} />



                                        </td>


                                      </tr>

                                    ))

                                  )}

                                </tbody>
                              </table>
                              <Modal show={showModal2} onHide={handleCloseModal} id="audittable">
                                <Modal.Header closeButton>
                                  <Modal.Title className="modal-title">DMS Audit History</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <DMSMyrequestLog props={currentItemID} />
                                </Modal.Body>
                                <Modal.Footer>
                                  {/* <Button variant="secondary" onClick={handleCloseModal}>
                                    Close
                                  </Button> */}
                                </Modal.Footer>
                              </Modal>
                            </div>
                          )
                            //              : 
                            //              showNestedDMSTable === "DMSFilePreview" ? 
                            //  (
                            //    <Modal show={showModal2} onHide={handleCloseModal}>
                            //      <Modal.Header closeButton>
                            //        <Modal.Title>DMS Audit History</Modal.Title>
                            //      </Modal.Header>
                            //      <Modal.Body>
                            //        <DMSMyrequestLog props={currentItemID} />
                            //      </Modal.Body>
                            //      <Modal.Footer>
                            //        <Button variant="secondary" onClick={handleCloseModal}>
                            //          Close
                            //        </Button>
                            //      </Modal.Footer>
                            //    </Modal>
                            //  )
                            :
                            showNestedDMSTable === "DMSAuditHistory" ?
                              (
                                <div>
                                  <div>
                                    <div>
                                      <button style={{ float: 'right' }} type="button" className="btn btn-secondary" onClick={() => setShowNestedDMSTable("")}> Back </button>
                                      <DMSMyrequestLog props={currentItemID} />
                                    </div>
                                  </div>
                                </div>
                              )

                              :
                              null}
                      </div>
                    )}
                  </div>
                  {currentData?.length > 0 ? (

                    <nav className="pagination-container">

                      <ul className="pagination">

                        <li style={{ margin: '0px' }}

                          className={`page-item ${currentPage === 1 ? "disabled" : ""

                            }`}

                        >

                          <a

                            className="page-link"

                            onClick={() => handlePageChange(currentPage - 1)}

                            aria-label="Previous"

                          >

                            «

                          </a>

                        </li>

                        {Array.from({ length: totalPages }, (_, num) => (

                          <li style={{ margin: '0px' }}

                            key={num}

                            className={`page-item ${currentPage === num + 1 ? "active" : ""

                              }`}

                          >

                            <a

                              className="page-link"

                              onClick={() => handlePageChange(num + 1)}

                            >

                              {num + 1}

                            </a>

                          </li>

                        ))}



                        <li style={{ margin: '0px' }}

                          className={`page-item ${currentPage === totalPages ? "disabled" : ""

                            }`}

                        >

                          <a

                            className="page-link"

                            onClick={() => handlePageChange(currentPage + 1)}

                            aria-label="Next"

                          >

                            »

                          </a>

                        </li>

                      </ul>

                    </nav>

                  ) : (

                    <></>
                  )}
                </div>
              </div>
            </div>
            {/* Modal to display uploaded files */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size='lg' id="audittable">
              <Modal.Header closeButton> <h5 style={{ margin: 'inherit' }} className="modal-title">Audit History</h5>
              </Modal.Header>
              <Modal.Body >
                {
                  <WorkflowAuditHistory ContentItemId={editID} ContentType={contenttype} ctx={props.context} />
                }

              </Modal.Body>

            </Modal>
          </div>

        </div>

      </div>

    </div>

  );

};





const MyRequest: React.FC<IMyRequestProps> = (props) => (

  <Provider>

    <MyRequestContext props={props} />

  </Provider>

);

export default MyRequest;
