
import { escape } from "@microsoft/sp-lodash-subset";

import React, { useState } from "react";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

// import "../components/MyApproval.scss";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "../../../CustomJSComponents/CustomTable/CustomTable.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";

import { IMyApprovalProps } from "./IMyApprovalProps";

import Provider from "../../../GlobalContext/provider";

import UserContext from "../../../GlobalContext/context";

import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {

  faEdit,

  faPaperclip,

  faSort,

  faEye,

  faTrashAlt,

} from "@fortawesome/free-solid-svg-icons";

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

import * as XLSX from "xlsx";

import moment from "moment";

// import { getApprovalListsData } from "../../../APISearvice/AnnouncementsService";

import {

  addItem,

  GetCategory,

  getChoiceFieldOption,

  getDiscussionComments,

  getDiscussionFilter,

  getDiscussionFilterAll,

  getDiscussionForum,

  getDiscussionMe,

  getDiscussionMeAll,

  updateItem,

} from "../../../APISearvice/DiscussionForumService";

import { encryptId } from "../../../APISearvice/CryptoService";

import { getNews } from "../../../APISearvice/NewsService";

import Swal from "sweetalert2";

import { getCategory, getEntity } from "../../../APISearvice/CustomService";

import ReactQuill from "react-quill";

import { uploadFileToLibrary } from "../../../APISearvice/MediaService";

import "react-quill/dist/quill.snow.css";

import { SPFI } from "@pnp/sp/presets/all";

import { fetchUserInformationList } from "../../../APISearvice/GroupTeamService";

import Multiselect from "multiselect-react-dropdown";

import { getSP } from "../loc/pnpjsConfig";

import { Eye } from "react-feather";

import { getDataByID, getMyApproval, getMyRequest, updateItemApproval } from "../../../APISearvice/ApprovalService";

const MyApprovalContext = ({ props }: any) => {

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

  const [filters, setFilters] = React.useState({

    SNo: "",

    RequestID: "",

    ProcessName: "",

    RequestedBy: "",

    RequestedDate: "",

    Status: "",

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

    Remark: '',

  })

  //#region OnchangeData

  const onChange = (name: string, value: string) => {

    debugger

    setFormData((prevData) => ({

      ...prevData,

      [name]: value,

    }));

  };

  //#endregion

  // const [formData, setFormData] = React.useState({

  //   topic: "",

  //   category: "",

  //   entity: "",

  //   Type: "",

  //   GroupType: "",

  //   description: "",

  //   overview: "",

  //   FeaturedAnnouncement: false,

  // });

  const [approveData, setApproveData] = useState([]);

  const [isActivedata, setisActivedata] = useState(false)

  const [DiscussionData, setDiscussion] = useState([]);

  const [CategoryData, setCategoryData] = React.useState([]);

  const [showModal, setShowModal] = React.useState(false);

  const [showDocTable, setShowDocTable] = React.useState(false);

  const [showImgModal, setShowImgTable] = React.useState(false);

  const [showBannerModal, setShowBannerTable] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState(null);

  const [editForm, setEditForm] = React.useState(false);

  const [richTextValues, setRichTextValues] = React.useState<{

    [key: string]: string;

  }>({});

  const [activeTab, setActiveTab] = useState("home1");

  const handleTabClick = async (tab: React.SetStateAction<string>) => {

    setActiveTab(tab);

    if (tab == "profile11") {

      FilterDiscussionData("Today");

    } else if (tab == "profile1") {

      setAnnouncementData(await getDiscussionMeAll(sp));

    } else {

      const announcementArr = await getDiscussionForum(sp);

      let lengArr: any;

      for (var i = 0; i < announcementArr.length; i++) {

        lengArr = await getDiscussionComments(sp, announcementArr[i].ID);

        console.log(lengArr, "rrr");

        (announcementArr[i].commentsLength = lengArr.arrLength),

          (announcementArr[i].Users = lengArr.arrUser);

      }

      setAnnouncementData(announcementArr);

    }

  };


  React.useEffect(() => {

    sessionStorage.removeItem("announcementId");

    ApiCall();

  }, [useHide]);


  const ApiCall = async () => {


    setMyApprovalsData(await getMyApproval(sp))


    // const announcementArr = await getDiscussionForum(sp);


    // // const MyApprovalsArr = await getApprovalListsData(sp);

    // // console.log("MyApprovalsArr", MyApprovalsArr);

    // // setMyApprovalsData(MyApprovalsArr);

    // let lengArr: any;

    // for (var i = 0; i < announcementArr.length; i++) {

    //   lengArr = await getDiscussionComments(sp, announcementArr[i].ID);

    //   console.log(lengArr, "rrr");

    //   (announcementArr[i].commentsLength = lengArr.arrLength),

    //     (announcementArr[i].Users = lengArr.arrUser);

    // }

    // fetchOptions();

    // // const categorylist = await GetCategory(sp);

    // setCategoryData(await GetCategory(sp));

    // setEnityData(await getEntity(sp)); //Entity

    // setAnnouncementData(announcementArr);

    // const NewsArr = await getNews(sp);

    // setNewsData(NewsArr);

    // setGroupTypeData(

    //   await getChoiceFieldOption(sp, "ARGDiscussionForum", "GroupType")

    // );

  };

  const FilterDiscussionData = async (optionFilter: string) => {

    setAnnouncementData(await getDiscussionFilterAll(sp, optionFilter));

  };

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

    const filteredData = data.filter((item, index) => {


      return (

        (filters.SNo === "" || String(index + 1).includes(filters.SNo)) &&

        (filters.ProcessName === "" ||

          (item.ProcessName != undefined &&

            item.ProcessName.toLowerCase().includes(

              filters.ProcessName.toLowerCase()

            ))) &&

        (filters.RequestID === "" ||

          (item.RequestID != undefined &&

            item.RequestID.toLowerCase().includes(

              filters.RequestID.toLowerCase()

            ))) &&

        // (filters.ProcessName === "" ||

        //   item.ProcessName.toLowerCase().includes(filters.ProcessName.toLowerCase())) &&

        (filters.Status === "" ||

          item.Status.toLowerCase().includes(filters.Status.toLowerCase())) &&

        (filters.RequestedBy === "" ||

          item?.Requester?.Title?.toLowerCase().includes(

            filters.RequestedBy.toLowerCase()

          ))

      );

    });


    const sortedData = filteredData.sort((a, b) => {

      if (sortConfig.key === "SNo") {

        // Sort by index

        const aIndex = data.indexOf(a);

        const bIndex = data.indexOf(b);

        return sortConfig.direction === "ascending"

          ? aIndex - bIndex

          : bIndex - aIndex;

      } else if (sortConfig.key) {

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

  const totalPages = Math.ceil(filteredMyApprovalData.length / itemsPerPage);


  const [ContentData, setContentData] = React.useState<any>([]);

  const [currentItem, setCurrentItem] = React.useState<any>([]);



  const handlePageChange = (pageNumber: any) => {

    if (pageNumber > 0 && pageNumber <= totalPages) {

      setCurrentPage(pageNumber);

    }

  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredMyApprovalData.slice(startIndex, endIndex);

  const newsCurrentData = filteredNewsData.slice(startIndex, endIndex);

  const [editID, setEditID] = React.useState(null);

  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);

  const siteUrl = props.siteUrl;


  const Breadcrumb = [

    {

      MainComponent: "Home",

      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,

    },

    {

      ChildComponent: "My Approve",

      ChildComponentURl: `${siteUrl}/SitePages/MyApprovals.aspx`,

    },

  ];

  console.log(announcementData, "announcementData");


  const exportToExcel = (data: any[], fileName: string) => {

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);

  };

  const fetchOptions = async () => {

    try {

      const items = await fetchUserInformationList(sp);

      console.log(items, "itemsitemsitems");


      const formattedOptions = items.map((item: { Title: any; Id: any }) => ({

        name: item.Title, // Adjust according to your list schema

        id: item.Id,

      }));

      setOpions(formattedOptions);

    } catch (error) {

      console.error("Error fetching options:", error);

    }

  };


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


  const handleRedirect = async (e: React.MouseEvent<SVGElement, MouseEvent>, Item: any) => {

    e.preventDefault()

    let arr = []


    setCurrentItem(Item)


    setContentData(await getDataByID(sp, Item?.ContentId, Item?.ContentName))

    setisActivedata(true)

    let sessionkey="";
    let redirecturl="";
    if(Item?.ProcessName)
    {
      switch(Item?.ProcessName)
      {
        case "Announcement":
          sessionkey="announcementId";
          redirecturl=`${siteUrl}/SitePages/AddAnnouncement.aspx`+"?requestid="+Item?.Id+"&mode=approval";
          break;
        case "Event":
          sessionkey="EventId";
          redirecturl=`${siteUrl}/SitePages/EventMasterForm.aspx`+"?requestid="+Item?.Id+"&mode=approval";
        break;
        default:;
     }

      const encryptedId = encryptId(String(Item?.ContentId));
      sessionStorage.setItem(sessionkey, encryptedId);
      location.href=redirecturl;

    }
    // const encryptedId = encryptId(String(Item?.ContentId));

    // sessionStorage.setItem("announcementId", encryptedId);

    // location.href="https://officeindia.sharepoint.com/sites/SPFXDemo/SitePages/AddAnnouncement.aspx"+"?requestid="+Item?.Id+"&mode=approval";


  };


  const handleFromSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, Status: string) => {

    e.preventDefault();


    const postPayload = {

      Remark: formData.Remark,

      Status: Status,
      TriggerUpdateFlow:true

    };

    console.log(postPayload);

    const postResult = await updateItemApproval(postPayload, sp, currentItem.Id);

    if (postResult) {

      setTimeout(() => {

        window.location.reload()

      }, 1000);


    }

  }


  return (

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

            marginTop: "0.5rem",

          }}

        >

          <div className="container-fluid paddb">

            <div className="row" style={{ paddingLeft: "0.5rem" }}>

              <div className="col-lg-6">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

            </div>

            {

              !isActivedata && (

                <div className="card cardCss mt-4">

                  <div className="card-body">

                    <div id="cardCollpase4" className="collapse show">

                      <div className="table-responsive pt-0">

                        <table

                          className="mtable table-centered table-nowrap table-borderless mb-0"

                          style={{ position: "relative" }}

                        >

                          <thead>

                            <tr>

                              <th

                                style={{

                                  borderBottomLeftRadius: "10px",

                                  minWidth: "40px",

                                  maxWidth: "40px",

                                  borderTopLeftRadius: "10px",

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

                                      placeholder="Filter by Requested By"

                                      onChange={(e) =>

                                        handleFilterChange(e, "RequestedBy")

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

                                  borderBottomRightRadius: "10px",

                                  borderTopRightRadius: "10px",

                                  textAlign: "center",

                                  verticalAlign: "top",

                                }}

                              >

                                <div className="d-flex flex-column bd-highlight ">

                                  <div

                                    className="d-flex  pb-2"

                                    style={{ justifyContent: "space-between" }}

                                  >

                                    <span>Action</span>{" "}

                                    {/* <span

                        onClick={() => handleSortChange("Category")}

                      >

                        <FontAwesomeIcon icon={faSort} />{" "}

                      </span> */}

                                  </div>

                                  {/* <div className=" bd-highlight">

                      <input

                        type="text"

                        placeholder="Filter by Requested By"

                        onChange={(e) =>

                          handleFilterChange(e, "Category")

                        }

                        className="inputcss"

                        style={{ width: "100%" }}

                      />

                    </div> */}

                                </div>

                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {currentData.length === 0 ? (

                              <div

                                className="no-results"

                                style={{

                                  display: "flex",

                                  justifyContent: "center",

                                }}

                              >

                                No results found

                              </div>

                            ) : (

                              currentData.map((item: any, index: number) => (

                                <tr


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

                                    {item.RequestID}

                                  </td>

                                  <td

                                    style={{ minWidth: "120px", maxWidth: "120px" }}

                                  >

                                    {item.ProcessName}

                                  </td>

                                  <td

                                    style={{ minWidth: "100px", maxWidth: "100px" }}

                                  >

                                    {item?.Requester?.Title}

                                  </td>

                                  <td

                                    style={{ minWidth: "100px", maxWidth: "100px" }}

                                  >

                                    {new Date(item?.Created).toLocaleDateString()}

                                  </td>

                                  <td

                                    style={{ minWidth: "80px", maxWidth: "80px" }}

                                  >

                                    {item?.Status}

                                  </td>

                                  <td

                                    style={{ minWidth: "50px", maxWidth: "50px" }}

                                    className="fe-eye font-18"

                                  >

                                    {/* <a href="my-approval-form.html"><i className="fe-eye font-18"></i> </a> */}


                                    {/* <img

                        onClick={() =>

                          handleRedirect(item.RedirectionLink)

                        }

                        style={{

                          minWidth: "20px",

                          maxWidth: "20px",

                          marginLeft: "15px",

                          cursor: "pointer",

                        }}

                        src={require("../assets/eye.png")}

                        className="fe-eye font-18"

                        alt={item.Title || "Untitled"}

                      /> */}

                                    <Eye onClick={(e) =>

                                      handleRedirect(e, item)

                                    }

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

                      </div>


                      {currentData.length > 0 ? (

                        <nav className="pagination-container">

                          <ul className="pagination">

                            <li

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

                              <li

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


                            <li

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

              )

            }

            {

              isActivedata == true && ContentData.length > 0 && currentItem != null &&

              (

                <div className="row mt-4">

                  <div className="col-12">

                    <div className="card">

                      <div className="card-body">

                        <h4 className="header-title mb-0">{ContentData[0].Title}</h4>

                        <p className="sub-header">{currentItem.EntityName}</p>


                        <div className="row">

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Company / Department:</label>

                              <div><span className="text-muted font-14">{currentItem.EntityName}</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Date of Request:</label>

                              <div><span className="text-muted font-14">{currentItem.Created}</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Status:</label>

                              <div><span className="text-muted font-14">{currentItem.Status}</span></div>

                            </div>

                          </div>

                          <div className="col-lg-6">

                            <div className="mb-0">

                              <label className="form-label text-dark font-14">Content:</label>

                              <div>

                                <span className="text-muted font-14">

                                  {ContentData[0].Title || ContentData[0].EventName}

                                </span>

                              </div>

                            </div>

                          </div>

                          <div className="col-lg-6">

                            <div className="mb-0">

                              <label className="form-label text-dark font-14">Overview:</label>

                              <div>

                                <span className="text-muted font-14">

                                  {ContentData[0].Overview}

                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {

                      ContentData[0]?.Description != null && (

                        <div className="card">

                          <div className="card-body">

                            <h4 className="header-title mb-0">Description</h4>

                            <p className="sub-header">

                              <div

                                dangerouslySetInnerHTML={{ __html: ContentData[0].Description }}

                              ></div>


                            </p>

                          </div>

                        </div>

                      )

                    }


                    {/* card three */}


                    {/* <div className="card">

                      <div className="card-body">

                        <h4 className="header-title mb-0">Finance Manager's Comment</h4>

                        <p className="sub-header">

                          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

                        </p>


                        <div className="row">

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Name:</label>

                              <div><span className="text-muted font-14">XYX</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Date:</label>

                              <div><span className="text-muted font-14">01-10-2023</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Signature:</label>

                              <div><span className="text-muted font-14">XYX</span></div>

                            </div>

                          </div>

                          <div className="col-lg-12">

                            <div className="mb-0">

                              <label className="form-label text-dark font-14">FM's Remark and Recommendation:</label>

                              <div>

                                <span className="text-muted font-14">

                                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.

                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div> */}


                    {/* card four */}


                    {/* <div className="card">

                      <div className="card-body">

                        <h4 className="header-title mb-0">GM's Approval</h4>

                        <p className="sub-header">

                          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

                        </p>


                        <div className="row">

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Name:</label>

                              <div><span className="text-muted font-14">XYX</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Date:</label>

                              <div><span className="text-muted font-14">01-10-2023</span></div>

                            </div>

                          </div>

                          <div className="col-lg-4">

                            <div className="mb-3">

                              <label className="form-label text-dark font-14">Signature:</label>

                              <div><span className="text-muted font-14">XYX</span></div>

                            </div>

                          </div>

                          <div className="col-lg-12">

                            <div className="mb-0">

                              <label className="form-label text-dark font-14">GM's Remark and Recommendation:</label>

                              <div>

                                <span className="text-muted font-14">

                                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.

                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div> */}


                    {/* card five */}


                 {

                  currentItem.Status == "Submitted" &&(

                    <div className="card">

                    <div className="card-body">

                      {/* <h4 className="header-title mb-0">GCFO's Approval</h4> */}

                      {/* <p className="sub-header">

                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.

                      </p> */}


                      <div className="row">

                        {/* <div className="col-lg-4">

                          <div className="mb-3">

                            <label className="form-label text-dark font-14">Approved:</label> <br />

                            <div className="form-check form-check-inline">

                              <input

                                type="radio"

                                id="customRadio1"

                                name="customRadio"

                                className="form-check-input"

                                checked={approved === 'yes'}

                                onChange={() => setApproved('yes')}

                              />

                              <label className="form-check-label" htmlFor="customRadio1">Yes</label>

                            </div>

                            <div className="form-check form-check-inline">

                              <input

                                type="radio"

                                id="customRadio2"

                                name="customRadio"

                                className="form-check-input"

                                checked={approved === 'no'}

                                onChange={() => setApproved('no')}

                              />

                              <label className="form-check-label" htmlFor="customRadio2">No</label>

                            </div>

                          </div>

                        </div> */}


                        {/* <div className="col-lg-4">

                          <div className="mb-3">

                            <label className="form-label text-dark font-14">Date:</label>

                            <div><span className="text-muted font-14">01-10-2023</span></div>

                          </div>

                        </div> */}


                        {/* <div className="col-lg-4">

                          <div className="mb-3">

                            <label className="form-label text-dark font-14">Signature:</label>

                            <div><span className="text-muted font-14">XYX</span></div>

                          </div>

                        </div> */}


                        {/* <div className="col-lg-12">

                          <div className="mb-3">

                            <label className="form-label text-dark font-14">GCFO's Remarks:</label>

                            <div>

                              <span className="text-muted font-14">

                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.

                              </span>

                            </div>

                          </div>

                        </div> */}


                        {

                          currentItem.Status == "Submitted" && (<div className="col-lg-12">

                            <div className="mb-0" >

                              <label htmlFor="example-textarea" className="form-label text-dark font-14">Remarks:</label>

                              <textarea className="form-control" id="example-textarea" rows={5} name="Remark" value={formData.Remark}

                                onChange={(e) => onChange(e.target.name, e.target.value)}></textarea>

                            </div>

                          </div>)

                        }


                      </div>

                      {


                        currentItem.Status == "Submitted" && (

                          <div className="row mt-3">

                            <div className="col-12 text-center">

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-success waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Approved')}>

                                  <i className="fe-check-circle me-1"></i> Approve

                                </button>

                              </a>

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-warning waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Rework')}>

                                  <i className="fe-corner-up-left me-1"></i> Rework

                                </button>

                              </a>

                              <a href="my-approval.html">

                                <button type="button" className="btn btn-danger waves-effect waves-light m-1" onClick={(e) => handleFromSubmit(e, 'Reject')}>

                                  <i className="fe-x-circle me-1"></i> Reject

                                </button>

                              </a>

                              <button type="button" className="btn btn-light waves-effect waves-light m-1">

                                <i className="fe-x me-1"></i> Cancel

                              </button>

                            </div>

                          </div>

                        )

                      }


                    </div>

                  </div>

                  )

                 }   

               


                  </div>

                </div>

              )

            }


          </div>

        </div>

      </div>

    </div>

  );

};


const MyApproval: React.FC<IMyApprovalProps> = (props) => (

  <Provider>

    <MyApprovalContext props={props} />

  </Provider>

);

export default MyApproval;



