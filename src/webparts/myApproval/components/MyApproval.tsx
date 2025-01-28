import { escape, set } from "@microsoft/sp-lodash-subset";

import React, { useRef, useState } from "react";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

import "../components/MyApproval.scss";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
// import "./CustomTable.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";
//import "./CustomTable.scss";
import { IMyApprovalProps } from "./IMyApprovalProps";

import Provider from "../../../GlobalContext/provider";

import UserContext from "../../../GlobalContext/context";

import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { getType } from "../../../APISearvice/CustomService";
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
let currentItemID = "";
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

import { getNews } from "../../../APISearvice/NewsService";

import Swal from "sweetalert2";

import { getCategory, getEntity } from "../../../APISearvice/CustomService";

import ReactQuill from "react-quill";

import { uploadFileToLibrary } from "../../../APISearvice/MediaService";

import "react-quill/dist/quill.snow.css";

import { SPFI } from "@pnp/sp/presets/all";

// import { fetchUserInformationList } from "../../../APISearvice/GroupTeamService";

// import Multiselect from "multiselect-react-dropdown";

import { getSP } from "../loc/pnpjsConfig";

import { Eye, Edit } from "react-feather";

import {
  getDataByID,
  getMyApproval,
  getMyRequest,
  updateItemApproval,
} from "../../../APISearvice/ApprovalService";
import DMSMyApprovalAction from "./DMSApprovalAction";
import { getApprovalListsData } from "../../../APISearvice/BusinessAppsService";
import DMSMyFolderApprovalAction from "./DMSFolderApprovalAction";
let actingforuseremail: any
const MyApprovalContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const [activeComponent, setActiveComponent] = useState<string>("");
  const { useHide }: any = React.useContext(UserContext);
  const [showNestedDMSTable, setShowNestedDMSTable] = useState(false);
  const [announcementData, setAnnouncementData] = React.useState([]);

  const [myApprovalsData, setMyApprovalsData] = React.useState([]);
  const [myApprovalsDataAll, setMyApprovalsDataAll] = React.useState([]);
  const [myApprovalsDataAutomation, setMyApprovalsDataAutomation] =
    React.useState([]);
  const handleShowNestedDMSTable = () => {
    setShowNestedDMSTable(true); // Show nested table within DMS
  };
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

  const [approved, setApproved] = useState("yes");

  const [filters, setFilters] = React.useState({
    SNo: "",

    RequestID: "",

    ProcessName: "",

    RequestedBy: "",

    RequestedDate: "",

    Status: "",
    Title: "",
  });

  const [StatusTypeData, setStatusTypeData] = useState([
    { id: "Pending", name: "Pending" },
    { id: "Approved", name: "Approved" },
    { id: "Rejected", name: "Rejected" },
  ]);
  const [isOpen, setIsOpen] = React.useState(false);

  const [IsinvideHide, setIsinvideHide] = React.useState(false);
  const [Mylistdata, setMylistdata] = useState([]);
  const handleReturnToMain = (Name: any) => {
    setActiveComponent(Name); // Reset to show the main component
    console.log(activeComponent, "activeComponent updated");
  };
  // const getApprovalmasterTasklist = async () => {
  //   try {
  //     const items = await sp.web.lists
  //       .getByTitle("DMSFileApprovalTaskList")
  //       .items.select(
  //         "Log",
  //         "CurrentUser",
  //         "Remark",
  //         "LogHistory",
  //         "FileUID/FileUID",
  //         "FileUID/SiteName",
  //         "FileUID/DocumentLibraryName",
  //         "FileUID/FileName",
  //         "FileUID/RequestNo",
  //         // , "FileUID/FilePreviewUrl"
  //         "FileUID/Status",
  //         "FileUID/FolderPath",
  //         "FileUID/RequestedBy",
  //         "FileUID/Created",
  //         "FileUID/ApproveAction",
  //         "MasterApproval/ApprovalType",
  //         "MasterApproval/Level",
  //         "MasterApproval/DocumentLibraryName"
  //       )
  //       .expand("FileUID", "MasterApproval")
  //       .filter(`CurrentUser eq '${currentUserEmailRef.current}'`)();
  //     console.log(items, "DMSFileApprovalTaskList");
  //     setMylistdata(items);
  //   } catch (error) {
  //     console.error("Error fetching list items:", error);
  //   }
  // };
  // const MyDMSAPPROVALDATASTATUS = async (sp: any, value: any) => {
  //   try {
  //     const items = await sp.web.lists
  //       .getByTitle("DMSFileApprovalTaskList")
  //       .items.select(
  //         "Log",
  //         "CurrentUser",
  //         "Remark",
  //         "LogHistory",
  //         "FileUID/FileUID",
  //         "FileUID/SiteName",
  //         "FileUID/DocumentLibraryName",
  //         "FileUID/FileName",
  //         "FileUID/RequestNo",
  //         // , "FileUID/FilePreviewUrl"
  //         "FileUID/Status",
  //         "FileUID/FolderPath",
  //         "FileUID/RequestedBy",
  //         "FileUID/Created",
  //         "FileUID/ApproveAction",
  //         "MasterApproval/ApprovalType",
  //         "MasterApproval/Level",
  //         "MasterApproval/DocumentLibraryName"
  //       )
  //       .expand("FileUID", "MasterApproval")
  //       .filter(`CurrentUser eq '${currentUserEmailRef.current}' and FileUID/Status eq '${value}'`)();
  //     console.log(items, "DMSFileApprovalTaskList");
  //     setMylistdata(items);
  //   } catch (error) {
  //     console.error("Error fetching list items:", error);
  //   }
  // };
  const getUserTitleByEmail = async (userEmail: any) => {
    try {
      const user = await sp.web.siteUsers.getByEmail(userEmail)();
      return user.Title;
    } catch (error) {
      console.error("Error fetching user title:", error);
      return null;
    }
  };
  const [loading, setLoading] = useState(true);
  const [actingForUser, setSetActingForUser] = useState([]);

  const myActingfordata = async () => {
    try {
      const currentUserEmail = currentUserEmailRef.current;
      console.log("currentUserEmail myActingfordata", currentUserEmail);
      const today = new Date().toISOString();
      const delegateListItems = await sp.web.lists.getByTitle('ARGDelegateList').items.select(
        "DelegateName/EMail",
        "ActingFor/EMail",
        "ActingFor/Title",
        "DelegateName/Title",
        "StartDate",
        "EndDate",
        "Status"
      )
        .expand("DelegateName", "ActingFor")
        .filter(`ActingFor/EMail eq '${currentUserEmail}' and Status eq 'Active' and StartDate le '${today}' and EndDate ge '${today}'`)();

      console.log("delegateListItems myActingfordata", delegateListItems);

      // Extract unique ActingFor.Title and EMail values
      const uniqueTitlesAndEmails = [
        ...new Map(
          delegateListItems.map((item) => [item.DelegateName?.Title, { title: item.DelegateName?.Title, email: item.DelegateName?.EMail }])
        ).values(),
      ];

      // Set state with unique titles and emails
      setSetActingForUser(uniqueTitlesAndEmails.map((item, index) => ({ id: index.toString(), name: item.title, email: item.email })));
      console.log("setSetActingForUser", actingForUser);
      console.log("uniqueTitlesAndEmails", uniqueTitlesAndEmails);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const getApprovalmasterTasklist = async (value: any, actingfor: any) => {
    // alert(`Status value is ${value} is acting for ${actingfor} in DMS`)
    debugger
    console.log("ghjghjgjh", value, actingfor)
    try {
      // Retrieve current user email
      const currentUserEmail = currentUserEmailRef.current;

      // Fetch the ARGDelegateList items where the current user is in the ActingFor column
      const today = new Date().toISOString(); // Get today's date in YYYY-MM-DD format
      // console.log("today", today);

      // const delegateListItems = await sp.web.lists.getByTitle('ARGDelegateList').items.select(
      //   "DelegateName/EMail",
      //   "ActingFor/EMail",
      //   "ActingFor/Title",
      //   "StartDate",
      //   "EndDate",
      //   "Status"
      // )
      // .expand("DelegateName", "ActingFor")
      // .filter(`ActingFor/EMail eq '${currentUserEmail}' and Status eq 'Active' and StartDate le '${today}' and EndDate ge '${today}'`)();

      // console.log("delegateListItems", delegateListItems);

      // const additionalFilters = delegateListItems.map((item:any) => `CurrentUser eq '${item.DelegateName.EMail}'`).join(' or ');
      // const combinedFilters = `CurrentUser eq '${currentUserEmail}'${additionalFilters ? ` or (${additionalFilters})` : ''} and FileUID/Status eq '${value}'`;

      // // Fetch items from DMSFileApprovalTaskList based on the combined filters
      // const items2 = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select(
      //   "Log", "CurrentUser", "Remark", "LogHistory", "FileUID/FileUID",
      //   "FileUID/SiteName", "FileUID/DocumentLibraryName", "FileUID/FileName",
      //   "FileUID/RequestNo", "FileUID/Processname", "FileUID/Status",
      //   "FileUID/FolderPath", "FileUID/RequestedBy", "FileUID/Created",
      //   "FileUID/ApproveAction", "MasterApproval/ApprovalType", "MasterApproval/Level",
      //   "MasterApproval/DocumentLibraryName"
      // )
      // .expand("FileUID", "MasterApproval")
      // .filter(combinedFilters)
      // .orderBy("Created", false)
      // .getAll();

      // console.log(items2, "DMSFileApprovalTaskList");



      let arr = [];
      if (actingfor === "") {
        const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select(
          "Log", "CurrentUser", "Remark"
          , "LogHistory"
          , "FileUID/FileUID"
          , "FileUID/SiteName"
          , "FileUID/DocumentLibraryName"
          , "FileUID/FileName"
          , "FileUID/RequestNo"
          , "FileUID/Processname"
          //  ,"FileUID/FilePreviewUrl" 
          , "FileUID/Status"
          , "FileUID/FolderPath"
          , "FileUID/RequestedBy"
          , "FileUID/Created"
          , "FileUID/ApproveAction"
          , "MasterApproval/ApprovalType"
          , "MasterApproval/Level"
          , "MasterApproval/DocumentLibraryName"

        )
          .expand("FileUID", "MasterApproval")
          .filter(`(CurrentUser eq '${currentUserEmailRef.current}') and FileUID/Status eq '${value}'`).orderBy("Created", false).getAll();
        console.log(items, "DMSFileApprovalTaskList", value, currentUserEmailRef.current);
        items.map((item) => {
          if (item.CurrentUser !== currentUserEmailRef.current) {
            arr.push(item)
            // alert(`Delegate user ${item.CurrentUser} is acting for ${item.FileUID.FileName}`)
          }

        });
        const updatedItems = await Promise.all(items.map(async (item) => {
          const requestedbyuserTitle = await getUserTitleByEmail(item?.FileUID?.RequestedBy);
          return { ...item, RequestedByTitle: requestedbyuserTitle };
        }));
        setMylistdata(updatedItems);
      }
      if (actingfor !== "") {
        const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select(
          "Log", "CurrentUser", "Remark"
          , "LogHistory"
          , "FileUID/FileUID"
          , "FileUID/SiteName"
          , "FileUID/DocumentLibraryName"
          , "FileUID/FileName"
          , "FileUID/RequestNo"
          , "FileUID/Processname"
          //  ,"FileUID/FilePreviewUrl" 
          , "FileUID/Status"
          , "FileUID/FolderPath"
          , "FileUID/RequestedBy"
          , "FileUID/Created"
          , "FileUID/ApproveAction"
          , "MasterApproval/ApprovalType"
          , "MasterApproval/Level"
          , "MasterApproval/DocumentLibraryName"

        )
          .expand("FileUID", "MasterApproval")
          .filter(`(CurrentUser eq '${actingfor}') and FileUID/Status eq '${value}'`).orderBy("Created", false).getAll();
        console.log(items, "DMSFileApprovalTaskList");
        items.map((item) => {
          if (item.CurrentUser !== currentUserEmailRef.current) {
            arr.push(item)
            // alert(`Delegate user ${item.CurrentUser} is acting for ${item.FileUID.FileName}`)
          }

        });
        const updatedItems = await Promise.all(items.map(async (item) => {
          const requestedbyuserTitle = await getUserTitleByEmail(item?.FileUID?.RequestedBy);
          return { ...item, RequestedByTitle: requestedbyuserTitle };
        }));
        setMylistdata(updatedItems);
      }

      // const updatedItems2 = await Promise.all(items2.map(async (item) => {
      //   const requestedbyuserTitle = await getUserTitleByEmail(item?.FileUID?.RequestedBy);
      //   return { ...item, RequestedByTitle: requestedbyuserTitle };
      // }));
      // const Item2 :any = await sp.web.lists.getByTitle('DMSFolderDeligationApprovalTask').items.select(
      //   "*",
      //   "Folderdetail"	            
      //   ,"Folderdetail/SiteTitle"	       
      //   ,"Folderdetail/DocumentLibraryName"	
      //   ,"Folderdetail/CurrentUser"
      //   ,"Folderdetail/FolderPath"
      //   ,"Folderdetail/FolderName"
      //   ,"Folderdetail/ParentFolderId"
      //   ,"Folderdetail/Department"	
      //   ,"Folderdetail/Devision"	
      //   ,"Folderdetail/RequestNo"	
      //   ,"FolderMeta"	
      //   ,"FolderMeta/SiteName"	
      //   ,"FolderMeta/DocumentLibraryName"	
      //   ,"FolderMeta/ColumnName",
      //   "Folderdetail/ProcessName",
      //   "Approver"
      // ).expand("Folderdetail" ,"FolderMeta")
      // .filter(`Approver eq '${currentUserEmailRef.current}'`)();
      // console.log("Item2",Item2)
      // const normalizeItem2 = (item:any) => ({
      //   Log: item?.Log || '', // Replace with appropriate mappings
      //   CurrentUser: item?.Folderdetail?.CurrentUser || '',
      //   Remark: item?.Remark || '',
      //   LogHistory: item?.LogHistory || '',
      //   ProcessName:  item?.Folderdetail?.ProcessName,
      //   FileUID: {
      //     FileUID: item?.FolderMeta?.FileUID || item?.Folderdetail?.RequestNo,
      //     SiteName: item?.FolderMeta?.SiteName || '',
      //     DocumentLibraryName: item?.FolderMeta?.DocumentLibraryName || '',
      //     FileName: item?.FolderMeta?.FolderName || '',
      //     RequestNo: item?.Folderdetail?.RequestNo || '',
      //     Status: item?.Status || '',
      //     FolderPath: item?.Folderdetail?.FolderPath || '',
      //     RequestedBy: item?.RequestedBy || item?.Folderdetail?.CurrentUser || '',
      //     Created: item?.Created || '',
      //     ApproveAction: item?.ApproveAction || ''
      //   },
      //   MasterApproval: {
      //     ApprovalType: item?.ApprovalType || '',
      //     Level: item?.Level || '',
      //     DocumentLibraryName: item?.DocumentLibraryName || ''
      //   }
      // });
      // const normalizeItem3 = Item2.map(normalizeItem2);
      //  const CombinedItems  = [...items, ...normalizeItem3];
      //  console.log(CombinedItems , "CombinedItems")
      // setMylistdata(CombinedItems);
      // setMylistdata(updatedItems);


      // return arr = CombinedItems

    } catch (error) {
      console.error("Error fetching list items:", error);
    }
  };

  console.log(Mylistdata, "Mylistdata");
  const currentUserEmailRef = useRef("");
  const getCurrrentuser = async () => {
    const userdata = await sp.web.currentUser();
    currentUserEmailRef.current = userdata.Email;
    console.log("currentUserEmailRefhhg", currentUserEmailRef)
    getApprovalmasterTasklist('Pending', '');
    myActingfordata()
  };
  React.useEffect(() => {
    getCurrrentuser();
  }, []);

  const truncateText = (text: string, maxLength?: any) => {
    if (text) {
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    }
  };

  const getTaskItemsbyID = async (e: any, itemid: any) => {
    // currentItemID = itemid
    currentItemID = itemid;
    setActiveComponent("Approval Action");
    console.log("itemid", itemid);
    // const items = await sp.web.lists
    //   .getByTitle("DMSFileApprovalTaskList")
    //   .items.select("CurrentUser", "FileUID/FileUID", "Log")
    //   .expand("FileUID")
    //   .filter(`FileUID/RequestNo eq '${itemid}'`)();
    // console.log(items, "items");
  };
  const getTaskItemsbyID2 = async (e: any, itemid: any) => {
    // alert("Folder")
    // currentItemID = itemid
    currentItemID = itemid
    setActiveComponent('DMS Folder Approval')
    console.log("itemid", itemid)
    // const items = await sp.web.lists.getByTitle('DMSFileApprovalTaskList').items.select("CurrentUser" , "FileUID/FileUID" , "Log").expand("FileUID").filter(`FileUID/RequestNo eq '${itemid}'`)();
    //    console.log(items , "items")
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [sortConfig, setSortConfig] = React.useState({
    key: "",

    direction: "ascending",
  });

  const [formData, setFormData] = React.useState({
    Remark: "",
  });
  const handleCancel = () => {
    window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
  };
  //#region OnchangeData

  const onChange = (name: string, value: string) => {
    debugger;

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

  const [isActivedata, setisActivedata] = useState(false);

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

  //const [activeTab, setActiveTab] = useState("home1");
  const [activeTab, setActiveTab] = useState("Intranet");
  const handleTabClick = async (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);

    console.log(
      "tab",
      tab,
      myApprovalsDataAutomation,
      myApprovalsDataAll,
      myApprovalsData
    );

    if (tab == "Intranet") {
      setMyApprovalsData(myApprovalsDataAll);
    } else if (tab == "DMS") {
      setMyApprovalsData(Mylistdata);
    } else if (tab == "Automation") {
      //ApiCall("Pending");
      setMyApprovalsData(myApprovalsDataAutomation);
      //setMyApprovalsDataAutomation(myApprovalsDataAutomation);
    }
  };

  React.useEffect(() => {
    sessionStorage.removeItem("announcementId");

    ApiCall("Pending");
  }, [useHide]);

  const ApiCall = async (status: string) => {
    // if(activeTab == "Intranet"){
    let MyApprovaldata = await getMyApproval(sp, status);
    let Automationdata1 = await getApprovalListsData(sp, status);
    let typedata = await getType(sp);
    setMyApprovalsData(MyApprovaldata);
    setMyApprovalsDataAll(MyApprovaldata);
    //}
    //else if(activeTab == "Automation"){
    let Automationdata = Automationdata1.sort((a, b) => {
      return a.Created === b.Created ? 0 : a.Created ? -1 : 1;
    });
    setMyApprovalsDataAutomation(Automationdata);

    console.log("Automationdata", Automationdata);
    // }
  };

  // const FilterDiscussionData = async (optionFilter: string) => {

  //   setAnnouncementData(await getDiscussionFilterAll(sp, optionFilter));

  // };
  const handleStatusChange = async (name: string, value: string, actingfor: any) => {
    actingforuseremail = actingfor
    // alert(`Status value is ${value} is acting for ${actingfor}`)
    if (actingforuseremail === undefined || actingforuseremail === null || actingforuseremail === "") {
      // alert("acting for is undefined")
    }

    if (value === "") {
      // Show all records if no type is selected
      console.log("No status selected");
    } else {
      // Filter records based on the selected type
      let MyApprovaldata = await getMyApproval(sp, value, actingfor);
      let Automationdata = await getApprovalListsData(sp, value, actingfor);
      // let MyDMSAPPROVALDATA:any = await MyDMSAPPROVALDATASTATUS(sp, value)
      let MyDMSAPPROVALDATA: any = await getApprovalmasterTasklist(value, actingfor)
      console.log("MyDMSAPPROVALDATA", MyDMSAPPROVALDATA)
      setMyApprovalsDataAll(MyApprovaldata);
      setMyApprovalsDataAutomation(Automationdata);
      if (activeTab == "Intranet") {
        setMyApprovalsData(MyApprovaldata);
      } else if (activeTab == "DMS") {
        // alert(value)
        setMyApprovalsData(MyDMSAPPROVALDATA);
      } else if (activeTab == "Automation") {
        setMyApprovalsData(Automationdata);
        console.log("Automationdata", Automationdata);
      }
      // else if (activeTab == "Automation") {
      //   setMyApprovalsData(null);
      //   setMyApprovalsData(MyDMSAPPROVALDATA);
      //   setMyApprovalsData(Mylistdata);
      //   console.log("Automationdata", Automationdata);
      // }
    }
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

    const filteredData = data?.filter((item, index) => {
      return (
        (filters.SNo === "" || String(index + 1).includes(filters.SNo)) &&
        // (filters.Title === "" ||
        //   (activeTab == "Intranet" ? item.Title != undefined : item.ApprovalTitle != undefined) &&
        // (activeTab == "Intranet" ? item.Title : item.ApprovalTitle).toLowerCase().includes(filters.Title.toLowerCase()))
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
        (filters.RequestedDate === "" ||
          new Date(item.Created)
            .toLocaleDateString()
            .startsWith(filters.RequestedDate + "")) &&
        (filters.Title === "" ||
          (activeTab == "Automation"
            ? item?.ApprovalTitle?.toLowerCase().includes(
              filters.Title.toLowerCase()
            )
            : item?.Title?.toLowerCase().includes(
              filters.Title.toLowerCase()
            ))) &&
        (filters.RequestedBy === "" ||
          (activeTab == "Automation"
            ? item?.Author?.Title?.toLowerCase().includes(
              filters.RequestedBy.toLowerCase()
            )
            : item?.Requester?.Title?.toLowerCase().includes(
              filters.RequestedBy.toLowerCase()
            )))
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

        const aValue = a["Created"] ? new Date(a["Created"]) : "";

        const bValue = b["Created"] ? new Date(b["Created"]) : "";

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
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
  const [currentGroup, setCurrentGroup] = React.useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;
  const totalPages = Math.ceil(filteredMyApprovalData?.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);
  const [ContentData, setContentData] = React.useState<any>([]);

  const [currentItem, setCurrentItem] = React.useState<any>([]);

  // const handlePageChange = (pageNumber: any) => {
  //   if (pageNumber > 0 && pageNumber <= totalPages) {
  //     setCurrentPage(pageNumber);
  //   }
  // };
  const handleGroupChange = (direction: "next" | "prev") => {
    const newGroup = currentGroup + (direction === "next" ? 1 : -1);
    if (newGroup > 0 && newGroup <= totalGroups) {
      setCurrentGroup(newGroup);
      setCurrentPage((newGroup - 1) * pagesPerGroup + 1); // Go to the first page of the new group
    }
  };

  const handlePageChange = (pageNumber: any) => {

    if (pageNumber > 0 && pageNumber <= totalPages) {

      setCurrentPage(pageNumber);
      const newGroup = Math.ceil(pageNumber / pagesPerGroup);
      setCurrentGroup(newGroup);
    }

  };
  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredMyApprovalData?.slice(startIndex, endIndex);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
  const newsCurrentData = filteredNewsData?.slice(startIndex, endIndex);

  const [editID, setEditID] = React.useState(null);

  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);

  const siteUrl = props.siteUrl;

  const Breadcrumb = [
    {
      MainComponent: "Home",

      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },

    {
      ChildComponent: "My Approval",

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

  const handleRedirect = async (
    e: React.MouseEvent<SVGElement, MouseEvent>,
    Item: any, mode: any
  ) => {
    e.preventDefault();

    let arr = [];

    setCurrentItem(Item);



    //setisActivedata(true);

    let sessionkey = "";
    let redirecturl = "";
    if (activeTab == "Automation") {
      window.open(Item.RedirectionLink, "_blank");
      //window.location.href = `${Item.RedirectionLink}`;
    } else if (activeTab == "Intranet") {
      setContentData(await getDataByID(sp, Item?.ContentId, Item?.ContentName));

      if (Item?.ProcessName !== "Blog") {
        setisActivedata(true);
      }
      if (Item?.ProcessName) {
        switch (Item?.ProcessName) {
          case "Announcement":
            sessionkey = "announcementId";
            redirecturl =
              `${siteUrl}/SitePages/AddAnnouncement.aspx` +
              "?requestid=" +
              Item?.Id +
              "&mode=" + mode + "&page=MyApproval";
            break;
          case "News":
            sessionkey = "announcementId";
            redirecturl =
              `${siteUrl}/SitePages/AddAnnouncement.aspx` +
              "?requestid=" +
              Item?.Id +
              "&mode=" + mode + "&page=MyApproval";
            break;
          case "Event":
            sessionkey = "EventId";
            redirecturl =
              `${siteUrl}/SitePages/EventMasterForm.aspx` +
              "?requestid=" +
              Item?.Id +
              "&mode=" + mode + "&page=MyApproval";
            break;
          case "Media":
            sessionkey = "mediaId";
            redirecturl =
              `${siteUrl}/SitePages/MediaGalleryForm.aspx` +
              "?requestid=" +
              Item?.Id +
              "&mode=" + mode + "&page=MyApproval";
            break;
          case "Blog":
            sessionkey = "blogId";
            redirecturl =
              `${siteUrl}/SitePages/BlogDetails.aspx?` + Item?.ContentId + "&page=MyApproval";
            break;
          default:
        }

        const encryptedId = encryptId(String(Item?.ContentId));
        sessionStorage.setItem(sessionkey, encryptedId);
        location.href = redirecturl;
      }
    }

    // const encryptedId = encryptId(String(Item?.ContentId));

    // sessionStorage.setItem("announcementId", encryptedId);
  };

  const handleFromSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    Status: string
  ) => {
    e.preventDefault();

    const postPayload = {
      Remark: formData.Remark,

      Status: Status,
      TriggerUpdateFlow: true,
    };

    console.log(postPayload);

    const postResult = await updateItemApproval(
      postPayload,
      sp,
      currentItem.Id
    );

    if (postResult) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

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

            marginTop: "0rem",
          }}
        >
          <div className="container-fluid paddb">
            <div className="row" style={{ paddingLeft: "0.5rem" }}>
              <div className="col-md-4">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

              <div className="col-md-8">
                <div className="row">
                  <div style={{ textAlign: "center" }} className="col-md-3 newtexleft">
                    <div className="mb-0">
                      <label htmlFor="Status" className="form-label mt-2">
                        <img src={require('../assets/delegation.png')}
                          className='me-1' alt="d" />   Acting on behalf of
                      </label>
                    </div>
                  </div>
                  <div style={{ paddingLeft: '0px' }} className="col-md-4">
                    <select
                      id="Type"
                      name="Type"
                      onChange={(e) => handleStatusChange(e.target.name, 'Pending', e.target.value)}
                      className="form-select"
                      disabled={loading || actingForUser.length === 0}
                    >
                      <option value="">
                        {loading ? "Loading..." : actingForUser.length === 0 ? "No Delegation" : "Select an option"}
                      </option>
                      {actingForUser.map((item, index) => (
                        <option key={index} value={item.email}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ textAlign: "center", padding: '0px' }} className="col-md-1 newtexleft ivon">
                    <div className="mb-0">
                      <label htmlFor="Status" className="form-label newfil mt-0 mb-0">
                        <svg fill="#3c3c3c" width="23px" height="36px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#b3b3b3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12,25l6.67,6.67a1,1,0,0,0,.7.29.91.91,0,0,0,.39-.08,1,1,0,0,0,.61-.92V13.08L31.71,1.71A1,1,0,0,0,31.92.62,1,1,0,0,0,31,0H1A1,1,0,0,0,.08.62,1,1,0,0,0,.29,1.71L11.67,13.08V24.33A1,1,0,0,0,12,25ZM3.41,2H28.59l-10,10a1,1,0,0,0-.3.71V28.59l-4.66-4.67V12.67a1,1,0,0,0-.3-.71Z"></path> </g></svg>
                      </label>
                    </div>
                  </div>
                  <div style={{ paddingLeft: '0px' }} className="col-md-4 ivon2">
                    <select
                      id="Type"
                      name="Type"
                      onChange={(e) =>
                        handleStatusChange(e.target.name, e.target.value, actingforuseremail)
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
                        className="nav nav-pills navtab-bg float-end justify-content-center"
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
                            <span className="lenbg1">Intranet</span>{" "}
                            <span className="lenbg">
                              {" "}
                              {myApprovalsDataAll.length}
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
                              {Mylistdata.length}
                            </span>
                          </a>
                        </li>

                        {/* <li className="nav-item" role="presentation">
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
                              {myApprovalsDataAutomation.length}
                            </span>
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
            {(activeTab === "Intranet" ||
              activeTab === "Automation" ||
              activeTab === "DMS") && (
                <div>
                  {!isActivedata && (
                    <div className="card cardCss mt-2">
                      <div className="card-body">
                        <div id="cardCollpase4" className="collapse show">
                          <div className="table-responsive pt-0">
                            {activeTab === "Intranet" ||
                              activeTab === "Automation" ? (

                              <>
                                <table
                                  className="mtbalenew mt-0 table-centered table-nowrap table-borderless mb-0"
                                  style={{ position: "relative" }}
                                >
                                  <thead>
                                    <tr>
                                      <th
                                        style={{
                                          borderBottomLeftRadius: "0px",

                                          minWidth: "40px",

                                          maxWidth: "40px",

                                          borderTopLeftRadius: "0px",
                                        }}
                                      >
                                        <div
                                          className="d-flex pb-2"
                                          style={{ justifyContent: "space-evenly" }}
                                        >
                                          <span>S.No.</span>

                                          <span
                                            onClick={() => handleSortChange("SNo")}
                                          >
                                            <FontAwesomeIcon icon={faSort} />
                                          </span>
                                        </div>

                                        <div className="bd-highlight">
                                          <input
                                            type="text"
                                            placeholder="index"
                                            onChange={(e) =>
                                              handleFilterChange(e, "SNo")
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
                                      </th>

                                      <th
                                        style={{
                                          minWidth: "80px",
                                          maxWidth: "80px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex pb-2"
                                            style={{ justifyContent: "space-evenly" }}
                                          >
                                            <span>Request ID</span>

                                            <span
                                              onClick={() =>
                                                handleSortChange("RequestID")
                                              }
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
                                      {/* {activeTab == "Intranet" && ( */}
                                      <th
                                        style={{
                                          minWidth: "120px",
                                          maxWidth: "120px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
                                          >
                                            <span>Title</span>{" "}
                                            <span
                                              onClick={() =>
                                                handleSortChange("Title")
                                              }
                                            >
                                              <FontAwesomeIcon icon={faSort} />{" "}
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
                                      {/* )} */}
                                      <th
                                        style={{
                                          minWidth: "120px",
                                          maxWidth: "120px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
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

                                      <th
                                        style={{
                                          minWidth: "100px",
                                          maxWidth: "100px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
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
                                          minWidth: "80px",
                                          maxWidth: "80px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
                                          >
                                            <span>Requested Date</span>{" "}
                                            {/* <span
                                            onClick={() =>
                                              handleSortChange("RequestedDate")
                                            }
                                          >
                                            <FontAwesomeIcon icon={faSort} />{" "}
                                          </span> */}
                                          </div>

                                          <div className=" bd-highlight">
                                            <input
                                              type="text"
                                              placeholder="Filter by Requested Date"
                                              onChange={(e) =>
                                                handleFilterChange(
                                                  e,
                                                  "RequestedDate"
                                                )
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
                                          minWidth: "80px",
                                          maxWidth: "80px",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
                                          >
                                            <span>Status</span>{" "}
                                            {/* <span
                                            onClick={() =>
                                              handleSortChange("Status")
                                            }
                                          >
                                            <FontAwesomeIcon icon={faSort} />{" "}
                                          </span> */}
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

                                          borderBottomRightRadius: "0px",

                                          borderTopRightRadius: "0px",

                                          textAlign: "center",

                                          verticalAlign: "top",
                                        }}
                                      >
                                        <div className="d-flex flex-column bd-highlight ">
                                          <div
                                            className="d-flex  pb-2"
                                            style={{ justifyContent: "space-evenly" }}
                                          >
                                            <span>Action</span>{" "}
                                          </div>
                                        </div>
                                      </th>
                                    </tr>
                                  </thead>
                                  {console.log(
                                    "currentData",
                                    currentData,
                                    isActivedata
                                  )}
                                  <tbody>
                                    {currentData?.length === 0 ? (
                                      <div

                                        className="no-results card card-body align-items-center  annusvg text-center "

                                        style={{

                                          display: "flex",

                                          justifyContent: "center",
                                          position: 'relative',
                                          marginTop: '10px',
                                          height: '500px'

                                        }}

                                      >
                                        <svg style={{ top: '0%' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>

                                        <p className="font-14 text-muted text-center">No Approval found </p>

                                      </div>
                                    ) : (
                                      currentData?.map(
                                        (item: any, index: number) => (
                                          <tr
                                            key={index}

                                          >
                                            <td
                                              style={{
                                                minWidth: "40px",
                                                maxWidth: "40px",
                                              }}
                                            >
                                              <div
                                                style={{ marginLeft: "0px" }}
                                                className="indexdesign"
                                              >
                                                {" "}
                                                {startIndex + index + 1}
                                              </div>{" "}
                                            </td>

                                            <td
                                              style={{
                                                minWidth: "80px",

                                                maxWidth: "80px",
                                                textAlign: 'center',

                                                textTransform: "capitalize",
                                              }}
                                              title={item.RequestID}
                                            >
                                              {item.RequestID}
                                            </td>
                                            {/* {activeTab == "Intranet" && ( */}
                                            <td
                                              style={{
                                                minWidth: "120px",
                                                maxWidth: "120px",
                                              }}
                                              title={activeTab == "Intranet" ? item.Title : item.ApprovalTitle}
                                            >
                                              {activeTab == "Intranet" ? item.Title : item.ApprovalTitle}
                                            </td>
                                            {/* )} */}
                                            <td
                                              style={{
                                                minWidth: "120px",
                                                maxWidth: "120px",
                                                textAlign: 'center'
                                              }}
                                            >
                                              <span className="badge font-12 bg-info">   {item.ProcessName}</span>
                                            </td>

                                            <td
                                              style={{
                                                minWidth: "100px",
                                                maxWidth: "100px",
                                              }}
                                              title={activeTab == "Automation"
                                                ? item?.Author?.Title
                                                : item?.Requester?.Title}
                                            >
                                              {activeTab == "Automation"
                                                ? item?.Author?.Title
                                                : item?.Requester?.Title}
                                            </td>

                                            <td
                                              style={{
                                                minWidth: "80px",
                                                maxWidth: "80px",
                                                textAlign: 'center'
                                              }}
                                            >
                                              <div className="btn btn-light1">
                                                {new Date(
                                                  item?.Created
                                                ).toLocaleDateString()}
                                              </div>
                                            </td>

                                            <td
                                              style={{
                                                minWidth: "80px",
                                                maxWidth: "80px",
                                                textAlign: 'center'
                                              }}
                                            >
                                              <div className="btn btn-status">
                                                {item?.Status}
                                              </div>
                                            </td>

                                            <td
                                              style={{
                                                minWidth: "50px",
                                                maxWidth: "50px",
                                                textAlign: 'center'
                                              }}
                                              className="fe-eye font-18"
                                            >
                                              {item?.Status.toLowerCase() == "approved" || item?.Status.toLowerCase() == "rejected" ?


                                                <Eye onClick={(e) =>
                                                  handleRedirect(e, item, "view")
                                                }

                                                  style={{

                                                    minWidth: "20px",

                                                    maxWidth: "20px",



                                                    cursor: "pointer",

                                                  }} />

                                                :
                                                <Edit
                                                  onClick={(e) =>
                                                    handleRedirect(e, item, "approval")
                                                  }

                                                  style={{
                                                    minWidth: "20px",

                                                    maxWidth: "20px",

                                                    marginLeft: "0px",

                                                    cursor: "pointer",
                                                  }}
                                                />
                                              }
                                            </td>
                                          </tr>
                                        )
                                      )
                                    )}
                                  </tbody>
                                </table>

                                {currentData?.length > 0 ? (
                                  <nav className="pagination-container">
                                    <ul className="pagination">
                                      {/* <li
        className={`page-item ${currentPage === 1 ? "disabled" : ""
          }`}
      > */}
                                      <li

                                        className={`prevPage page-item ${currentGroup === 1 ? "disabled" : ""
                                          }`}
                                        onClick={() => handleGroupChange("prev")}
                                      >

                                        <a
                                          className="page-link"
                                          // onClick={() =>
                                          //   handlePageChange(currentPage - 1)
                                          // }
                                          aria-label="Previous"
                                        >
                                          «
                                        </a>
                                      </li>
                                      {Array.from(

                                        { length: endPage - startPage + 1 },

                                        (_, num) => {
                                          const pageNum = startPage + num;
                                          return (

                                            <li

                                              key={pageNum}

                                              className={`page-item ${currentPage === pageNum ? "active" : ""

                                                }`}

                                            >

                                              <a

                                                className="page-link"

                                                onClick={() =>

                                                  handlePageChange(pageNum)

                                                }

                                              >

                                                {pageNum}

                                              </a>

                                            </li>

                                          )
                                        }

                                      )}

                                      <li

                                        className={`nextPage page-item ${currentGroup === totalGroups ? "disabled" : ""

                                          }`}
                                        onClick={() => handleGroupChange("next")}
                                      >

                                        <a

                                          className="page-link"

                                          onClick={() =>

                                            handlePageChange(currentPage + 1)

                                          }

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
                              </>
                            ) : null}

                            {activeTab === "DMS" && (
                              <div>
                                {!showNestedDMSTable ? (
                                  <div>
                                    <table
                                      className="mtbalenew mt-0 table-centered table-nowrap table-borderless mb-0"
                                      style={{ position: "relative" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th
                                            style={{
                                              borderBottomLeftRadius: "0px",

                                              minWidth: "40px",

                                              maxWidth: "40px",

                                              borderTopLeftRadius: "0px",
                                            }}
                                          >
                                            <div
                                              className="d-flex pb-2"
                                              style={{
                                                justifyContent: "space-evenly",
                                              }}
                                            >
                                              <span>S.No.</span>

                                              <span
                                                onClick={() =>
                                                  handleSortChange("SNo")
                                                }
                                              >
                                                <FontAwesomeIcon icon={faSort} />
                                              </span>
                                            </div>

                                            <div className="bd-highlight">
                                              <input
                                                type="text"
                                                placeholder="index"
                                                onChange={(e) =>
                                                  handleFilterChange(e, "SNo")
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                  }
                                                }}
                                                className="inputcss"
                                                style={{ width: "100%" }}
                                              />
                                            </div>
                                          </th>

                                          <th
                                            style={{
                                              minWidth: "80px",
                                              maxWidth: "80px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Request ID</span>

                                                <span
                                                  onClick={() =>
                                                    handleSortChange("RequestID")
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />
                                                </span>
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Request ID"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "RequestID"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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
                                              minWidth: "120px",
                                              maxWidth: "120px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Title</span>

                                                <span
                                                  onClick={() =>
                                                    handleSortChange("Title")
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />
                                                </span>
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Title"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "RequestID"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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
                                              minWidth: "120px",
                                              maxWidth: "120px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex  pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Process Name</span>{" "}
                                                <span
                                                  onClick={() =>
                                                    handleSortChange(
                                                      "ProcessName"
                                                    )
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />{" "}
                                                </span>
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Process Name"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "ProcessName"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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
                                              minWidth: "100px",
                                              maxWidth: "100px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex  pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Requested By</span>{" "}
                                                <span
                                                  onClick={() =>
                                                    handleSortChange(
                                                      "RequestedBy"
                                                    )
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />{" "}
                                                </span>
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Requested By"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "RequestedBy"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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
                                              minWidth: "80px",
                                              maxWidth: "80px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex  pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Requested Date</span>{" "}
                                                {/* <span
                                                  onClick={() =>
                                                    handleSortChange(
                                                      "RequestedDate"
                                                    )
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />{" "}
                                                </span> */}
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Requested Date"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "RequestedDate"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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
                                              minWidth: "80px",
                                              maxWidth: "80px",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex  pb-2"
                                                style={{
                                                  justifyContent: "space-evenly",
                                                }}
                                              >
                                                <span>Status</span>{" "}
                                                {/* <span
                                                  onClick={() =>
                                                    handleSortChange("Status")
                                                  }
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faSort}
                                                  />{" "}
                                                </span> */}
                                              </div>

                                              <div className=" bd-highlight">
                                                <input
                                                  type="text"
                                                  placeholder="Filter by Status"
                                                  onChange={(e) =>
                                                    handleFilterChange(
                                                      e,
                                                      "Status"
                                                    )
                                                  }
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                      e.preventDefault();
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

                                              borderBottomRightRadius: "0px",

                                              borderTopRightRadius: "0px",

                                              textAlign: "center",

                                              verticalAlign: "top",
                                            }}
                                          >
                                            <div className="d-flex flex-column bd-highlight ">
                                              <div
                                                className="d-flex  pb-2"
                                                style={{
                                                  justifyContent: "space-between",
                                                }}
                                              >
                                                <span>Action</span>{" "}
                                              </div>
                                            </div>
                                          </th>
                                        </tr>
                                      </thead>
                                      {console.log(
                                        "currentData",
                                        currentData,
                                        isActivedata
                                      )}
                                      <tbody>
                                        {currentData?.length === 0 ? (
                                          <div

                                            className="no-results card card-body align-items-center  annusvg text-center "

                                            style={{

                                              display: "flex",

                                              justifyContent: "center",
                                              position: 'relative',
                                              marginTop: '10px',
                                              height: '500px'

                                            }}

                                          >
                                            <svg style={{ top: '0%' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>

                                            <p className="font-14 text-muted text-center">No Approval found </p>

                                          </div>
                                        ) : (
                                          currentData?.map(
                                            (item: any, index: number) => (
                                              <tr
                                                key={index}

                                              >
                                                <td
                                                  style={{
                                                    minWidth: "40px",
                                                    maxWidth: "40px",

                                                    backgroundColor: "transparent",

                                                  }}
                                                >
                                                  <div
                                                    style={{ marginLeft: "0px" }}
                                                    className="indexdesign"
                                                  >
                                                    {" "}
                                                    {startIndex + index + 1}
                                                  </div>{" "}
                                                </td>

                                                <td
                                                  style={{
                                                    minWidth: "80px",

                                                    maxWidth: "80px",
                                                    textAlign: 'center',

                                                    textTransform: "capitalize",
                                                  }}
                                                  title={item?.FileUID?.RequestNo}
                                                >
                                                  {item?.FileUID?.RequestNo}

                                                </td>
                                                <td
                                                  style={{
                                                    minWidth: "120px",

                                                    maxWidth: "120px",


                                                  }}
                                                  title={item?.FileUID?.FileName}
                                                >
                                                  {item?.FileUID?.FileName}
                                                </td>
                                                <td
                                                  style={{
                                                    minWidth: "120px",
                                                    maxWidth: "120px",
                                                    textAlign: 'center'
                                                  }}
                                                >
                                                  <span className="badge font-12 bg-info">  {item?.FileUID?.Processname} </span>
                                                </td>

                                                <td
                                                  style={{
                                                    minWidth: "100px",
                                                    maxWidth: "100px",
                                                  }}
                                                >
                                                  {item?.RequestedByTitle}
                                                </td>

                                                <td
                                                  style={{
                                                    minWidth: "80px", maxWidth: "80px",
                                                    // maxWidth: "100px",
                                                    textAlign: 'center'
                                                  }}
                                                >
                                                  <div className="btn btn-light1">

                                                    {/* {item?.FileUID?.Created} */}
                                                    {new Date(item?.FileUID?.Created).toLocaleString('en-US', {
                                                      month: '2-digit',
                                                      day: '2-digit',
                                                      year: 'numeric',
                                                      // hour: '2-digit',
                                                      // minute: '2-digit',
                                                      // second: '2-digit',
                                                      // hour12: true 
                                                    })}
                                                  </div>
                                                </td>

                                                <td
                                                  style={{
                                                    minWidth: "80px",
                                                    maxWidth: "80px",
                                                    textAlign: 'center'
                                                  }}
                                                >
                                                  <div className="btn btn-status">
                                                    {item?.FileUID?.Status}
                                                  </div>
                                                </td>

                                                <td
                                                  style={{
                                                    minWidth: "50px",
                                                    maxWidth: "50px",
                                                  }}
                                                  className="fe-eye font-18"
                                                >

                                                  <Edit
                                                    onClick={(e) => { getTaskItemsbyID(e, item?.FileUID?.FileUID); handleShowNestedDMSTable() }}
                                                    style={{
                                                      minWidth: "20px",

                                                      maxWidth: "20px",

                                                      marginLeft: "15px",

                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                </td>
                                              </tr>
                                            )
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                    {currentData?.length > 0 ? (
                                      <nav className="pagination-container">
                                        <ul className="pagination">
                                          {/* <li
        className={`page-item ${currentPage === 1 ? "disabled" : ""
          }`}
      > */}
                                          <li

                                            className={`prevPage page-item ${currentGroup === 1 ? "disabled" : ""
                                              }`}
                                            onClick={() => handleGroupChange("prev")}
                                          >

                                            <a
                                              className="page-link"
                                              // onClick={() =>
                                              //   handlePageChange(currentPage - 1)
                                              // }
                                              aria-label="Previous"
                                            >
                                              «
                                            </a>
                                          </li>
                                          {Array.from(

                                            { length: endPage - startPage + 1 },

                                            (_, num) => {
                                              const pageNum = startPage + num;
                                              return (

                                                <li

                                                  key={pageNum}

                                                  className={`page-item ${currentPage === pageNum ? "active" : ""

                                                    }`}

                                                >

                                                  <a

                                                    className="page-link"

                                                    onClick={() =>

                                                      handlePageChange(pageNum)

                                                    }

                                                  >

                                                    {pageNum}

                                                  </a>

                                                </li>

                                              )
                                            }

                                          )}

                                          <li

                                            className={`nextPage page-item ${currentGroup === totalGroups ? "disabled" : ""

                                              }`}
                                            onClick={() => handleGroupChange("next")}
                                          >

                                            <a

                                              className="page-link"

                                              onClick={() =>

                                                handlePageChange(currentPage + 1)

                                              }

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
                                ) : (
                                  <div>
                                    <DMSMyApprovalAction props={currentItemID} />
                                    <div className="col-sm-12 text-center">
                                      {/* <button style={{ float: 'right' }} type="button" className="btn btn-secondary" onClick={() => setShowNestedDMSTable(false)}> Back </button> */}

                                      <button type="button" className="btn cancel-btn newp waves-effect waves-light m-3" style={{ fontSize: '0.875rem' }} onClick={() => setShowNestedDMSTable(false)}>
                                        <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                                          className='me-1' alt="x" />
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* {activeTab === "DMS" ?
               (
               <div>
                    <div className="DMSMasterContainer">
                <h4 className="page-title fw-bold mb-1 font-20">My Approvals 1</h4>
                <div className="" style={{ backgroundColor: 'white', border:'1px solid #54ade0', marginTop:'20px', borderRadius:'20px', padding: '15px'}}>
                <table className="mtbalenew">
    <thead>
      <tr>
        <th
          style={{
            minWidth: '40px',
            maxWidth: '40px',
         
          }}
        >
          S.No
        </th>
        <th>Request ID</th>
        <th>Process Name</th>
        <th>Requested By</th>
        <th >Requested Date</th>
        <th style={{ minWidth: '80px', maxWidth: '80px' }}>Status</th>
        <th
          style={{
            minWidth: '70px',
            maxWidth: '70px',
         
          }}
        >
          Action
        </th>
      </tr>
    </thead>
    <tbody style={{ maxHeight: '8007px' }}>
       
      {Mylistdata.length > 0  ? Mylistdata.map((item, index) => {
      return(
        <tr>
<td style={{ minWidth: '40px', maxWidth: '40px'}}>
  <span style={{marginLeft:'5px'}} className="indexdesign">{index}</span>
  </td>
<td >{(truncateText(item.FileUID.FileUID, 22))}</td>
<td >{item?.ProcessName}</td>
<td >{(truncateText(item.FileUID.RequestedBy, 22))}</td> 
<td >
<div
  style={{
    padding: '5px',
    border: '1px solid #efefef',
    background: '#fff', fontSize:'14px',
    borderRadius: '30px',
  
  }}
  className="btn btn-light"
>
 {item.FileUID.Created}
</div>
</td>
<td style={{ minWidth: '80px', maxWidth: '80px', textAlign:'center' }}>
<div className="finish mb-0">Pending</div>
</td>
<td style={{ minWidth: '70px', maxWidth: '70px' }}>
  {item?.ProcessName === "DMS Folder Approval" ?
    (<a onClick={(e )=>getTaskItemsbyID2(e , item.FileUID.FileUID)}>
    <FontAwesomeIcon icon={faEye} />
   </a>
   ) : item?.ProcessName === "" || item?.ProcessName === null || item?.ProcessName === undefined ?    (
      <a onClick={(e )=>getTaskItemsbyID(e , item.FileUID.FileUID)}>
 <FontAwesomeIcon icon={faEye} />
</a>
    ) : null
  }

</td>
</tr>
      )

       })
       :""

}

      
   

     
    </tbody>
  </table>
        </div>
              </div>
               </div>
               ) : (
                <div>
                  {activeComponent === 'Approval Action' ? (
                    <div>
                   <button style={{float:'right'}} type="button" className="btn btn-secondary" onClick={()=>handleReturnToMain('')}> Back </button>
                  <DMSMyApprovalAction props={currentItemID}/>
                    </div>
               
                  ) : activeComponent === 'DMS Folder Approval' ? (
                    <div>
<button style={{float:'right'}} type="button" className="btn btn-secondary" onClick={()=>handleReturnToMain('')}> Back </button>
<DMSMyFolderApprovalAction props={currentItemID}/>
                    </div>
                                       
                  ) :null
                  
                  } 
             
                </div>
               
            
               )
               } */}
                          </div>


                        </div>
                      </div>
                    </div>
                  )}

                  {isActivedata == true &&
                    ContentData.length > 0 &&
                    currentItem != null && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-body">
                              <h4 className="header-title mb-0">
                                {ContentData[0].Title}
                              </h4>

                              <p className="sub-header">
                                {currentItem.EntityName}
                              </p>

                              <div className="row">
                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label className="form-label text-dark font-14">
                                      Company / Department:
                                    </label>

                                    <div>
                                      <span className="text-muted font-14">
                                        {currentItem.EntityName}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label className="form-label text-dark font-14">
                                      Date of Request:
                                    </label>

                                    <div>
                                      <span className="text-muted font-14">
                                        {currentItem.Created}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-4">
                                  <div className="mb-3">
                                    <label className="form-label text-dark font-14">
                                      Status:
                                    </label>

                                    <div>
                                      <span className="text-muted font-14">
                                        {currentItem.Status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-0">
                                    <label className="form-label text-dark font-14">
                                      Content:
                                    </label>

                                    <div>
                                      <span className="text-muted font-14">
                                        {ContentData[0].Title ||
                                          ContentData[0].EventName}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-6">
                                  <div className="mb-0">
                                    <label className="form-label text-dark font-14">
                                      Overview:
                                    </label>

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

                          {ContentData[0]?.Description != null && (
                            <div className="card">
                              <div className="card-body">
                                <h4 className="header-title mb-0">Description</h4>

                                <p className="sub-header">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: ContentData[0].Description,
                                    }}
                                  ></div>
                                </p>
                              </div>
                            </div>
                          )}

                          {currentItem.Status == "Submitted" && (
                            <div className="card">
                              <div className="card-body">
                                <div className="row">
                                  {currentItem.Status == "Submitted" && (
                                    <div className="col-lg-12">
                                      <div className="mb-0">
                                        <label
                                          htmlFor="example-textarea"
                                          className="form-label text-dark font-14"
                                        >
                                          Remarks:
                                        </label>

                                        <textarea
                                          className="form-control"
                                          id="example-textarea"
                                          rows={5}
                                          name="Remark"
                                          value={formData.Remark}
                                          onChange={(e) =>
                                            onChange(
                                              e.target.name,
                                              e.target.value
                                            )
                                          }
                                        ></textarea>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {currentItem.Status == "Submitted" && (
                                  <div className="row mt-3">
                                    <div className="col-12 text-center">
                                      <a href="my-approval.html">
                                        <button
                                          type="button"
                                          className="btn btn-success waves-effect waves-light m-1"
                                          onClick={(e) =>
                                            handleFromSubmit(e, "Approved")
                                          }
                                        >
                                          <i className="fe-check-circle me-1"></i>{" "}
                                          Approve
                                        </button>
                                      </a>

                                      <a href="my-approval.html">
                                        <button
                                          type="button"
                                          className="btn btn-warning waves-effect waves-light m-1"
                                          onClick={(e) =>
                                            handleFromSubmit(e, "Rework")
                                          }
                                        >
                                          <i className="fe-corner-up-left me-1"></i>{" "}
                                          Rework
                                        </button>
                                      </a>

                                      <a href="my-approval.html">
                                        <button
                                          type="button"
                                          className="btn btn-danger waves-effect waves-light m-1"
                                          onClick={(e) =>
                                            handleFromSubmit(e, "Reject")
                                          }
                                        >
                                          <i className="fe-x-circle me-1"></i>{" "}
                                          Reject
                                        </button>
                                      </a>

                                      <button
                                        type="button"
                                        className="btn cancel-btn waves-effect waves-light m-1"
                                        onClick={(e) => handleCancel()}
                                      >
                                        <i className="fe-x me-1"></i> Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}
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
