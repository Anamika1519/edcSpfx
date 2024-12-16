import React, { useState } from "react";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { filter } from "lodash";
import "../../../CustomCss/mainCustom.scss";
import "../components/DiscussionForum.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import { IDiscussionForumProps } from "./IDiscussionForumProps";
import Provider from "../../../GlobalContext/provider";
import { getSP } from "../loc/pnpjsConfig";
import UserContext from "../../../GlobalContext/context";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPaperclip,
  faSort,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import * as XLSX from "xlsx";
import moment from "moment";
import {
  DeleteAnnouncementAPI,
  uploadFile,
} from "../../../APISearvice/AnnouncementsService";
import {
  addItem,
  get7DaysDiscussionForum,
  GetCategory,
  getChoiceFieldOption,
  getDiscussionComments,
  getDiscussionFilter,
  getDiscussionFilterAll,
  getDiscussionForum,
  getDiscussionMe,
  getDiscussionMeAll,
  getOldDiscussionForum,
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
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import context from "react-bootstrap/esm/AccordionContext";


const DiscussionForumContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const [announcementData, setAnnouncementData] = React.useState([]);
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
  const [showDropdownId, setShowDropdownId] = React.useState(null);
  const [AllDiscussionItems, setAllDiscussionItems] = React.useState([]);
  type UserEntityData = {
    companyName: string;
  };

  const [CurrentUserEnityData, setCurrentUserEnityData] = React.useState<UserEntityData | null>(null);

  const [options, setOpions] = useState([]);
  const [filters, setFilters] = React.useState({
    SNo: "",
    Topic: "",
    Overview: "",
    Category: "",
    Type: "",
    Status: "",
    SubmittedDate: "",
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
  const [DiscussionData, setDiscussion] = useState([])
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
    if (tab == "home1") {

       const announcementAllArr = await getDiscussionForum(sp);
       console.log("Alldiscu",announcementAllArr);
       let lengArr: any;
      // setAnnouncementData(announcementArr)
      // for (var i = 0; i < announcementArr.length; i++) {
      //   lengArr = await getDiscussionComments(sp, announcementArr[i].ID)
      //   console.log(lengArr, 'rrr');
      //   announcementArr[i].commentsLength = lengArr.commentsLength; // Number of comments
      //   announcementArr[i].likesCount = lengArr.totalLikes;         // Number of likes
      //   announcementArr[i].repliesCount = lengArr.totalRepliesCount;

      //     announcementArr[i].Users = lengArr.arrUser,
      //     announcementArr[i].CreatedDate = lengArr.CreatedDate
      // }
      setAnnouncementData(AllDiscussionItems);
    }
    else if (tab == "lastsevenDays") {

      const announcementArr = await get7DaysDiscussionForum(sp);
      let lengArr: any;
      for (var i = 0; i < announcementArr.length; i++) {
        lengArr = await getDiscussionComments(sp, announcementArr[i].ID)
        console.log(lengArr, 'rrr 7');
        announcementArr[i].commentsLength = lengArr.arrLength,
          announcementArr[i].likesCount = lengArr.totalLikes;         // Number of likes
        announcementArr[i].repliesCount = lengArr.totalRepliesCount;
        announcementArr[i].Users = lengArr.arrUser
        announcementArr[i].CreatedDate = lengArr.CreatedDate
      }
      setAnnouncementData(announcementArr)
    }
    else {
      const announcementArr = await getOldDiscussionForum(sp);
      let lengArr: any;
      for (var i = 0; i < announcementArr.length; i++) {
        lengArr = await getDiscussionComments(sp, announcementArr[i].ID)
        console.log(lengArr, 'rrr old',announcementArr[i]);
        announcementArr[i].commentsLength = lengArr.arrLength,
          announcementArr[i].likesCount = lengArr.totalLikes;         // Number of likes
        announcementArr[i].repliesCount = lengArr.totalRepliesCount;
        announcementArr[i].Users = lengArr.arrUser,
          announcementArr[i].CreatedDate = lengArr.CreatedDate
      }
      let filteredarray = [];
       filteredarray = announcementArr.filter((x) => (
        x.likesCount + x.repliesCount + x.commentsLength )
       
       > 10)
      if(filteredarray .length >0){
        setAnnouncementData(filteredarray.sort((a, b) => b.likesCount - a.likesCount))
      } else {
        setAnnouncementData(filteredarray)
      }
      console.log("filteredarray",filteredarray,announcementArr)
      
    }
  };

  React.useEffect(() => {

    sessionStorage.removeItem("announcementId");
    ApiCall();
    // if (activeTab == "home1") {
    //   setAnnouncementData(announcementData)
    // }

  }, [useHide]);

  const ApiCall = async () => {
    let useremail = await sp.web.getUserById(94);
    console.log("useremail", useremail);
    const announcementArr = await getDiscussionForum(sp);
    setActiveTab('home1');
    let lengArr: any;
    if(announcementArr.length>0){
    for (var i = 0; i < announcementArr.length; i++) {
      lengArr = await getDiscussionComments(sp, announcementArr[i].ID)
      console.log(lengArr, 'rrr');
      announcementArr[i].commentsLength = lengArr.arrLength,
        announcementArr[i].likesCount = lengArr.totalLikes;         // Number of likes
      announcementArr[i].repliesCount = lengArr.totalRepliesCount;
      announcementArr[i].Users = lengArr.arrUser

    }
  }
    fetchOptions()
    // const categorylist = await GetCategory(sp);
    setCategoryData(await GetCategory(sp));
    setEnityData(await getEntity(sp)); //Entity
    setAnnouncementData(announcementArr);
    setAllDiscussionItems(announcementArr);
    const NewsArr = await getNews(sp);
    setNewsData(NewsArr);
    setGroupTypeData(
      await getChoiceFieldOption(sp, "ARGDiscussionForum", "GroupType")
    );

    // Fetch current user data
    const currentUserData = await GetEntity(sp);


    setCurrentUserEnityData(currentUserData); // Set the user data

    setFormData((prevState) => ({
      ...prevState,
      entity: currentUserData.companyName || "", // Use companyName or fallback to empty string
    }));

    // Assuming you have a setCurrentUser function

  };

  const GetEntity = async (_sp: SPFI): Promise<UserEntityData | null> => {
    try {
      const currentWPContext: WebPartContext = props.context;
      const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');
      const currentUserData = await msgraphClient.api("/me")
        .version("v1.0")
        .select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName")
        .get();

      console.log("Current User Data: ", currentUserData);
      console.log("Current User's companyName : ", currentUserData.companyName);

      // Map and return data in the expected structure
      return {
        companyName: currentUserData.companyName,

      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };


  const FilterDiscussionData = async (optionFilter: string) => {
    setAnnouncementData(await getDiscussionFilterAll(sp, optionFilter))
  }
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };

  const applyFiltersAndSorting = (data: any[]) => {
    // Filter data
    const filteredData = data.filter((item, index) => {
      return (
        (filters.SNo === "" || String(index + 1).includes(filters.SNo)) &&
        (filters.Topic === "" ||
          item.Topic.toLowerCase().includes(filters.Topic.toLowerCase())) &&
        (filters.Overview === "" ||
          item.Overview.toLowerCase().includes(
            filters.Overview.toLowerCase()
          )) &&
        (filters.Category === "" ||
          item?.DiscussionForumCategory?.CategoryName.toLowerCase().includes(
            filters.Category.toLowerCase()
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
      } else if(sortConfig.key == "Category"){
        const aValue = a["DiscussionForumCategory"].CategoryName ? a["DiscussionForumCategory"].CategoryName.toLowerCase() : "";
        const bValue = b["DiscussionForumCategory"].CategoryName ? b["DiscussionForumCategory"].CategoryName.toLowerCase() : "";
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

  const filteredAnnouncementData = applyFiltersAndSorting(announcementData);
  const filteredNewsData = applyFiltersAndSorting(newsData);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAnnouncementData.length / itemsPerPage);

  const handlePageChange = (pageNumber: any) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAnnouncementData.slice(startIndex, endIndex);
  console.log("check the data of comment of like", currentData)
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
      ChildComponent: "Discussion Forum",
      ChildComponentURl: `${siteUrl}/SitePages/DiscussionForum.aspx`,
    },
  ];
  console.log(announcementData, 'announcementData');


  const exportToExcel = (data: any[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const fetchOptions = async () => {
    try {
      const items = await fetchUserInformationList(sp);
      console.log(items, 'itemsitemsitems');

      const formattedOptions = items.map((item: { Title: any; Id: any; }) => ({
        name: item.Title, // Adjust according to your list schema
        id: item.Id,
      }));
      setOpions(formattedOptions);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
  const onSelect = (selectedList: React.SetStateAction<any[]>, selectedItem: any) => {
    setSelectedValue(selectedList);
    console.log('Selected item:', selectedItem, 'selectedList', selectedList);
  }

  const onRemove = (selectedList: React.SetStateAction<any[]>, removedItem: any) => {
    setSelectedValue(selectedList);
    console.log('Removed item:', removedItem);
  }
  const handleExportClick = () => {

    const exportData = currentData.map((item, index) => ({
      "S.No.": startIndex + index + 1,
      Topic: item.Topic,
      Overview: item.Overview,
      DiscussionForumCategory: item?.DiscussionForumCategory?.CategoryName,
      Type: item?.AnnouncementandNewsTypeMaster?.TypeMaster,
      Status: item.Status,
      "Submitted Date": item.Created,
    }));

    exportToExcel(exportData, "Announcements");
  };

  const EditAnnouncement = (id: any) => {
    const encryptedId = encryptId(String(id));
    sessionStorage.setItem("announcementId", encryptedId);
    window.location.href = `${siteUrl}/SitePages/AddAnnouncement.aspx`;
  };

  const handleSortChange = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const GotoAdd = (url: string) => {
    sessionStorage.removeItem("announcementId");
    window.location.href = url;
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
      UserGet()
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
    console.log(users, 'users')
  }

  // const exportData = currentData.map((item, index) => ({

  //   "S.No.": startIndex + index + 1,

  //   Title: item.Title,

  //   Overview: item.Overview,

  //   Category: item?.Category?.Category,

  //   Type: item?.AnnouncementandNewsTypeMaster?.TypeMaster,

  //   Status: item.Status,

  //   "Submitted Date": item.Created,

  // }));



  const DeleteAnnouncement = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteAnnouncementAPI(sp, id).then(() => {
          ApiCall();
          Swal.fire("Deleted!", "Item has been deleted.", "success");
        });
      }
    });
  };

  const onChange = async (name: string, value: string) => {

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,

    }));

    if (name == "Type") {
      setCategoryData(await getCategory(sp, Number(value))); // Category
    }
    if (name == "GroupType" && value != "Public") {
      setIsinvideHide(true);
    } else if (name == "GroupType") {
      setIsinvideHide(false);
    }
  };

  const onFileChange = async (

    event: React.ChangeEvent<HTMLInputElement>,

    libraryName: string,

    docLib: string

  ) => {

    debugger;

    event.preventDefault();
    let uloadDocsFiles: any[] = [];
    let uloadDocsFiles1: any[] = [];
    let uloadImageFiles: any[] = [];
    let uloadImageFiles1: any[] = [];
    let uloadBannerImageFiles: any[] = [];
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      if (libraryName === "Docs") {

        const docFiles = files.filter(
          (file) =>
            file.type === "application/pdf" ||
            file.type === "application/msword" ||
            file.type === "application/xsls" ||
            file.type === "text/csv" ||
            file.type === "text/csv" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            file.type === "text/"
        );

        if (docFiles.length > 0) {
          const arr = {
            files: docFiles,
            libraryName: libraryName,
            docLib: docLib,
          };
          uloadDocsFiles.push(arr);
          setDocumentpostArr(uloadDocsFiles);
          if (DocumentpostArr1.length > 0) {
            //  uloadDocsFiles1.push(DocumentpostArr1)
            docFiles.forEach((ele) => {
              let arr1 = {
                ID: 0,
                Createdby: "",
                Modified: "",
                fileUrl: "",
                fileSize: ele.size,
                fileType: ele.type,
                fileName: ele.name,
              };
              DocumentpostArr1.push(arr1);
            });
            setDocumentpostArr1(DocumentpostArr1);
          } else {
            docFiles.forEach((ele) => {
              let arr1 = {
                ID: 0,
                Createdby: "",
                Modified: "",
                fileUrl: "",
                fileSize: ele.size,
                fileType: ele.type,
                fileName: ele.name,
              };
              uloadDocsFiles1.push(arr1);
            });
            setDocumentpostArr1(uloadDocsFiles1);
          }
        } else {
          Swal.fire("only document can be upload");
        }
      }

      if (libraryName === "Gallery" || libraryName === "bannerimg") {
        const imageVideoFiles = files.filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/")
        );

        if (imageVideoFiles.length > 0) {
          const arr = {
            files: imageVideoFiles,
            libraryName: libraryName,
            docLib: docLib,
          };

          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setImagepostArr(uloadImageFiles);
            if (ImagepostArr1.length > 0) {
              imageVideoFiles.forEach((ele) => {
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl: "",
                  fileSize: ele.size,
                  fileType: ele.type,
                  fileName: ele.name,
                };
                ImagepostArr1.push(arr1);
              });
              setImagepostArr1(ImagepostArr1);
            } else {
              imageVideoFiles.forEach((ele) => {
                let arr1 = {
                  ID: 0,
                  Createdby: "",
                  Modified: "",
                  fileUrl: "",
                  fileSize: ele.size,
                  fileType: ele.type,
                  fileName: ele.name,
                };
                uloadImageFiles1.push(arr1);
              });
              setImagepostArr1(uloadImageFiles1);
            }
          } else {
            uloadBannerImageFiles.push(arr);
            setBannerImagepostArr(uloadBannerImageFiles);
          }
        } else {
          Swal.fire("only image & video can be upload");
        }
      }
    }
  };


  const validateForm = () => {
    console.log("formData",formData);
    const { topic, Type, category, entity, overview, FeaturedAnnouncement ,GroupType } =
      formData;
    const { description } = richTextValues;
    let valid = true;
    if (!topic) {
      // Swal.fire("Error", "Topic is required!", "error");
      valid = false;
    } else if (!entity) {
      // Swal.fire("Error", "Entity is required!", "error");
      valid = false;
    }
    else if (!category) {
      // Swal.fire("Error", "Category is required!", "error");
      valid = false;
    }else if(!GroupType){
      valid=false;
    }else if(!overview){
      valid=false;
    }else if(GroupType === "Private"){
      // console.log("selectedValue",selectedValue);
      if(selectedValue.length === 0){
        valid=false;
      }
    }
    if(!valid){
      Swal.fire("Error", "Please fill in the mandatory fields!", "error");
    }
    return valid;
  };
  // const validateForm = () => {
  //   const { topic, Type, category, entity, overview, FeaturedAnnouncement } =
  //     formData;
  //   const { description } = richTextValues;
  //   let valid = true;
  //   if (!topic) {
  //     Swal.fire("Error", "Topic is required!", "error");
  //     valid = false;
  //   } else if (!entity) {
  //     Swal.fire("Error", "Entity is required!", "error");
  //     valid = false;
  //   }
  //   else if (!category) {
  //     Swal.fire("Error", "Category is required!", "error");
  //     valid = false;
  //   }

  //   return valid;
  // };

  const setShowModalFunc = (bol: boolean, name: string) => {
    if (name == "bannerimg") {
      setShowModal(bol);
      setShowBannerTable(true);
      setShowImgTable(false);
      setShowDocTable(false);
    } else if (name == "Gallery") {
      setShowModal(bol);
      setShowImgTable(true);
      setShowBannerTable(false);
      setShowDocTable(false);
    } else {
      setShowModal(bol);
      setShowDocTable(true);
      setShowBannerTable(false);
      setShowImgTable(false);
    }
  };

  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };

  const handleFormSubmit = async () => {
    if (validateForm()) {
      if (editForm) {
        Swal.fire({
          title: "Do you want to update?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: "warning",
        }).then(async (result) => {
          console.log(result);
          if (result.isConfirmed) {
            const selectedIds =
              selectedValue.length > 0
                ? selectedValue.map((ele) => ele.id)
                : null;

            debugger;
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];
            if (
              BnnerImagepostArr.length > 0 &&
              BnnerImagepostArr[0]?.files?.length > 0
            ) {
              for (const file of BnnerImagepostArr[0].files) {
                //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);
                bannerImageArray = await uploadFile(
                  file,
                  sp,
                  "Documents",
                  "https://officeindia.sharepoint.com"
                );
              }
            } else {
              bannerImageArray = null;
            }
            debugger;

            if (bannerImageArray != null) {
              // Create Post
              const postPayload = {
                Topic: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                GroupType: formData.GroupType,
                DiscussionForumCategoryId: Number(formData.category),
                InviteMemebersId: selectedIds,
              };
              console.log(postPayload);
              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;

              if (ImagepostArr[0]?.files?.length > 0) {
                for (const file of ImagepostArr[0].files) {
                  const uploadedGalleryImage = await uploadFileToLibrary(
                    file,
                    sp,
                    "DiscussionForumGallery"
                  );
                  galleryIds = galleryIds.concat(
                    uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                  );
                  if (ImagepostArr1.length > 0) {
                    ImagepostArr1.push(uploadedGalleryImage[0]);
                    const updatedData = ImagepostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    debugger;
                    console.log(updatedData, "updatedData");
                    galleryArray = updatedData;
                    //galleryArray.push(ImagepostArr1);
                    ImagepostIdsArr.push(galleryIds[0]); //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr;
                  } else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              } else {
                galleryIds = ImagepostIdsArr;
                galleryArray = ImagepostArr1;
              }
              // Upload Documents

              if (DocumentpostArr[0]?.files?.length > 0) {
                for (const file of DocumentpostArr[0].files) {
                  const uploadedDocument = await uploadFileToLibrary(
                    file,
                    sp,
                    "DiscussionForumDocs"
                  );

                  documentIds = documentIds.concat(
                    uploadedDocument.map((item: { ID: any }) => item.ID)
                  );
                  if (DocumentpostArr1.length > 0) {
                    DocumentpostArr1.push(uploadedDocument[0]);
                    const updatedData = DocumentpostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    documentArray = updatedData;
                    // documentArray.push(DocumentpostArr1)
                    DocumentpostIdsArr.push(documentIds[0]); //.push(DocumentpostIdsArr)
                    documentIds = DocumentpostIdsArr;
                  } else {
                    documentArray.push(uploadedDocument);
                  }
                }
              } else {
                documentIds = DocumentpostIdsArr;
                documentArray = DocumentpostArr1;
              }

              if (galleryArray.length > 0) {
                let ars = galleryArray.filter((x) => x.ID == 0);
                if (ars.length > 0) {
                  for (let i = 0; i < ars.length; i++) {
                    galleryArray.slice(i, 1);
                  }
                }
              }
              if (documentArray.length > 0) {
                let arsdoc = documentArray.filter((x) => x.ID == 0);
                if (arsdoc.length > 0) {
                  for (let i = 0; i < arsdoc.length; i++) {
                    documentArray.slice(i, 1);
                  }
                }
              }
              const updatePayload = {
                ...(galleryIds.length > 0 && {
                  DiscussionForumGalleryId: galleryIds,
                  DiscussionForumGalleryJSON: JSON.stringify(
                    flatArray(galleryArray)
                  ),
                }),
                ...(documentIds.length > 0 && {
                  DiscussionForumDocsId: documentIds,
                  DiscussionForumDocsJSON: JSON.stringify(
                    flatArray(documentArray)
                  ),
                }),
              };

              if (Object.keys(updatePayload).length > 0) {

                const updateResult = await updateItem(

                  updatePayload,

                  sp,

                  editID

                );

                console.log("Update Result:", updateResult);

              }

            } else {
              // Create Post
              const postPayload = {
                Topic: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                GroupType: formData.GroupType,
                DiscussionForumCategoryId: Number(formData.category),
                InviteMemebersId: selectedIds,
              };
              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger;
              if (ImagepostArr[0]?.files?.length > 0) {

                for (const file of ImagepostArr[0].files) {

                  const uploadedGalleryImage = await uploadFileToLibrary(
                    file,
                    sp,
                    "DiscussionForumGallery"
                  );



                  galleryIds = galleryIds.concat(
                    uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                  );
                  if (ImagepostArr1.length > 0) {
                    ImagepostArr1.push(uploadedGalleryImage[0]);
                    const updatedData = ImagepostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    galleryArray = updatedData;
                    // galleryArray.push(ImagepostArr1);
                    ImagepostIdsArr.push(galleryIds[0]); //galleryIds.push(ImagepostIdsArr)
                    galleryIds = ImagepostIdsArr;
                  } else {
                    galleryArray.push(uploadedGalleryImage);
                  }
                }
              } else {
                galleryIds = ImagepostIdsArr;
                galleryArray = ImagepostArr1;
              }



              // Upload Documents

              if (DocumentpostArr[0]?.files?.length > 0) {
                for (const file of DocumentpostArr[0].files) {
                  const uploadedDocument = await uploadFileToLibrary(
                    file,
                    sp,
                    "DiscussionForumDocs"
                  );
                  documentIds = documentIds.concat(
                    uploadedDocument.map((item: { ID: any }) => item.ID)
                  );
                  if (DocumentpostArr1.length > 0) {
                    DocumentpostArr1.push(uploadedDocument[0]);
                    const updatedData = DocumentpostArr1.filter(
                      (item) => item.ID !== 0
                    );
                    console.log(updatedData, "updatedData");
                    documentArray = updatedData;
                    // documentArray.push(DocumentpostArr1)
                    DocumentpostIdsArr.push(documentIds[0]); //.push(DocumentpostIdsArr)
                    documentIds = DocumentpostIdsArr;
                  } else {
                    documentArray.push(uploadedDocument);
                  }
                }
              } else {
                documentIds = DocumentpostIdsArr;
                documentArray = DocumentpostArr1;
              }
              if (galleryArray.length > 0) {
                let ars = galleryArray.filter((x) => x.ID == 0);
                if (ars.length > 0) {
                  for (let i = 0; i < ars.length; i++) {
                    galleryArray.slice(i, 1);
                  }
                }
              }

              if (documentArray.length > 0) {
                let arsdoc = documentArray.filter((x) => x.ID == 0);
                if (arsdoc.length > 0) {
                  for (let i = 0; i < arsdoc.length; i++) {
                    documentArray.slice(i, 1);
                  }
                }
              }
              console.log(documentIds, "documentIds");
              console.log(galleryIds, "galleryIds");
              // Update Post with Gallery and Document Information

              const updatePayload = {
                ...(galleryIds.length > 0 && {
                  AnnouncementAndNewsGallaryId: galleryIds,
                  AnnouncementAndNewsGallaryJSON: JSON.stringify(
                    flatArray(galleryArray)
                  ),
                }),
                ...(documentIds.length > 0 && {
                  AnnouncementsAndNewsDocsId: documentIds,
                  AnnouncementAndNewsDocsJSON: JSON.stringify(
                    flatArray(documentArray)
                  ),
                }),
              };
              if (Object.keys(updatePayload).length > 0) {
                const updateResult = await updateItem(
                  updatePayload,
                  sp,
                  editID
                );
                console.log("Update Result:", updateResult);
              }
            }
            Swal.fire("Item update successfully", "", "success");
            sessionStorage.removeItem("announcementId");
            setTimeout(() => {
              setFormData({
                topic: "",
                category: "",
                entity: "",
                Type: "",
                GroupType: "",
                description: "",
                overview: "",
                FeaturedAnnouncement: false,
              });

              setDocumentpostArr1([]);
              setDocumentpostArr([]);
              setImagepostArr([])
              setImagepostArr1([])
              ApiCall()
              dismissModal()

            }, 2000);
          }
        });
      }
      else {

        Swal.fire({
          title: "Do you want to save?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
          icon: "warning",
        }).then(async (result) => {

          if (result.isConfirmed) {
            const selectedIds =
              selectedValue.length > 0
                ? selectedValue.map((ele) => ele.id)
                : null;
            let bannerImageArray: any = {};
            let galleryIds: any[] = [];
            let documentIds: any[] = [];
            let galleryArray: any[] = [];
            let documentArray: any[] = [];

            debugger;
            let postPayload = {}
            // Create Post
            if (selectedIds) {
              postPayload = {
                Topic: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                GroupType: formData.GroupType,
                DiscussionForumCategoryId: Number(formData.category),
                InviteMemebersId: selectedIds,
                ARGDiscussionStatus: "Ongoing",
                DiscussionInProgress: "In Progress",
                DiscussionFileManager: `/sites/AlRostmaniSpfx2/ARGDiscussionFiles/${formData.topic}`,
                DiscussionFolderName: formData.topic
              };
            }
            else {
              postPayload = {
                Topic: formData.topic,
                Overview: formData.overview,
                Description: richTextValues.description,
                EntityId: Number(formData.entity),
                GroupType: formData.GroupType,
                DiscussionForumCategoryId: Number(formData.category),
                ARGDiscussionStatus: "Ongoing",
                DiscussionInProgress: "In Progress",
                DiscussionFileManager: `/sites/AlRostmaniSpfx2/ARGDiscussionFiles/${formData.topic}`,
                DiscussionFolderName: formData.topic
              };
            }

            const postResult = await addItem(postPayload, sp);

            const postId = postResult?.data?.ID;
            if (!postId) {
              console.error("Post creation failed.");
              return;
            }
            // Upload Gallery Images
            if (ImagepostArr.length > 0) {
              for (const file of ImagepostArr[0]?.files) {
                const uploadedGalleryImage = await uploadFileToLibrary(
                  file,
                  sp,
                  "DiscussionForumGallery"
                );
                galleryIds = galleryIds.concat(
                  uploadedGalleryImage.map((item: { ID: any }) => item.ID)
                );
                galleryArray.push(uploadedGalleryImage);
              }
            }

            // Upload Documents
            if (DocumentpostArr.length > 0) {

              for (const file of DocumentpostArr[0]?.files) {

                const uploadedDocument = await uploadFileToLibrary(
                  file,
                  sp,
                  "DiscussionForumDocs"
                );
                documentIds = documentIds.concat(
                  uploadedDocument.map((item: { ID: any }) => item.ID)
                );
                documentArray.push(uploadedDocument);
              }
            }

            const updatePayload = {
              ...(galleryIds.length > 0 && {
                DiscussionForumGalleryId: galleryIds,
                DiscussionForumGalleryJSON: JSON.stringify(
                  flatArray(galleryArray)
                ),
              }),

              ...(documentIds.length > 0 && {
                DiscussionForumDocsId: documentIds,
                DiscussionForumDocsJSON: JSON.stringify(
                  flatArray(documentArray)
                ),
              }),
            };


            if (Object.keys(updatePayload).length > 0) {

              const updateResult = await updateItem(updatePayload, sp, postId);
              console.log("Update Result:", updateResult);

            }

            setAnnouncementData(await getDiscussionForum(sp));
            Swal.fire("Item Added successfully", "", "success");
            setTimeout(async () => {
              setFormData({
                topic: "",
                category: "",
                entity: "",
                Type: "",
                GroupType: "",
                description: "",
                overview: "",
                FeaturedAnnouncement: false,
              });
              setSelectedValue([])
              setDocumentpostArr1([]);
              setDocumentpostArr([]);
              setImagepostArr([])
              setImagepostArr1([])
              dismissModal()
            }, 2000);
          }
        });
      }
    }
  };

  const dismissModal = () => {
    const modalElement = document.getElementById('discussionModal');
    modalElement.classList.remove('show');
    modalElement.style.display = 'none';
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    modalElement.removeAttribute('role');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  };

  const handleCancel = () => {
    window.location.href =
      "https://officeindia.sharepoint.com/sites/AlRostmaniSpfx2/SitePages/Blogs.aspx";
  };

  const formats = [
    "header",
    "height",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "color",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
    "size",
  ];

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [
        {
          color: [
            "#000000",
            "#e60000",
            "#ff9900",
            "#ffff00",
            "#008a00",
            "#0066cc",
            "#9933ff",
            "#ffffff",
            "#facccc",
            "#ffebcc",
            "#ffffcc",
            "#cce8cc",
            "#cce0f5",
            "#ebd6ff",
            "#bbbbbb",
            "#f06666",
            "#ffc266",
            "#ffff66",
            "#66b966",
            "#66a3e0",
            "#c285ff",
            "#888888",
            "#a10000",
            "#b26b00",
            "#b2b200",
            "#006100",
            "#0047b2",
            "#6b24b2",
            "#444444",
            "#5c0000",
            "#663d00",
            "#666600",
            "#003700",
            "#002966",
            "#3d1466",
            "custom-color",
          ],
        },
      ],
    ],
  };

  const handleClick = (id: any) => {
    console.log(id, "----id");
    window.location.href = `${SiteUrl}/SitePages/DiscussionForumDetail.aspx?${id}`;
  };
  const shouldDisableOption = (item: any) => {
    // Example condition: disable the option if it's already selected or based on another condition
    return item.name === formData.entity || item.name === 'CompanyNameToDisable';
  };
  const toggleDropdown1 = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
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
            marginLeft: `${!useHide ? "240px" : "80px"}`, marginTop: '-5px'
          }}
        >
          <div className="container-fluid paddb">
          <div className="row" style={{paddingLeft:'0.5rem'}}>
              <div className="col-lg-6">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>

              <div className="col-lg-6">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  {/* Button to trigger modal */}
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#discussionModal"
                    className="btn font-12 btn-secondary waves-effect waves-light"
                  >
                    <i className="fe-plus-circle"></i> Start New Discussion
                  </button>
                </div>
                {/* Bootstrap Modal */}
                <div
                  className="modal fade bd-example-modal-lg"
                  id="discussionModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  data-target=".bd-example-modal-lg"
                >
                  <div className="modal-dialog modal-lg ">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          New Discussion
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                        </button>
                      </div>
                      <div className="modal-body">
                        <form className="row">
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="topic" className="form-label">
                                Topic <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="topic"
                                name="topic"
                                placeholder="Enter Topic"
                                className="form-control inputcss"
                                value={formData.topic}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="category" className="form-label">
                                Category <span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select inputcss"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              >
                                <option>Select</option>
                                {CategoryData.map((item, index) => (
                                  <option key={index} value={item.Id}>
                                    {item.CategoryName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="entity" className="form-label">
                                Entity <span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select inputcss"
                                id="entity"
                                name="entity"
                                value={formData.entity}
                                onChange={(e) => onChange(e.target.name, e.target.value)}
                              >
                                {CurrentUserEnityData && (
                                  <option value={CurrentUserEnityData.companyName}>
                                    {CurrentUserEnityData.companyName}
                                  </option>
                                )}
                                {EnityData.map((item, index) => (
                                  <option
                                    key={index}
                                    value={item.name}
                                    disabled={item.name === 'CompanyNameToDisable'} // Disable option based on condition
                                  >
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* <div className="col-lg-4">
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <label
                                    htmlFor="discussionGallery"
                                    className="form-label"
                                  >
                                    Discussion Gallery{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div>
                                  {(ImagepostArr1.length > 0 &&
                                    ImagepostArr1.length == 1 && (
                                      <a
                                        onClick={() =>
                                          setShowModalFunc(true, "Gallery")
                                        }
                                        style={{ fontSize: "0.875rem" }}
                                      >
                                        <FontAwesomeIcon icon={faPaperclip} />{" "}
                                        {ImagepostArr1.length} file Attached
                                      </a>
                                    )) ||
                                    (ImagepostArr1.length > 0 &&
                                      ImagepostArr1.length > 1 && (

                                        <a

                                          onClick={() =>

                                            setShowModalFunc(true, "Gallery")

                                          }

                                          style={{ fontSize: "0.875rem" }}

                                        >

                                          <FontAwesomeIcon icon={faPaperclip} />{" "}

                                          {ImagepostArr1.length} files Attached

                                        </a>

                                      ))}
                                </div>
                              </div>
                              <input
                                type="file"
                                id="discussionforumGallery"
                                name="discussionforumGallery"
                                className="form-control inputcss"
                                multiple
                                onChange={(e) =>
                                  onFileChange(
                                    e,
                                    "Gallery",
                                    "DiscussionForumGallery"
                                  )
                                }
                              />
                            </div>
                          </div> */}

                          {/* <div className="col-lg-4">
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <label
                                    htmlFor="discussionThumbnail"
                                    className="form-label"
                                  >
                                    Discussion Document{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div>
                                  {(DocumentpostArr1.length > 0 &&
                                    DocumentpostArr1.length == 1 && (
                                      <a
                                        onClick={() =>
                                          setShowModalFunc(true, "docs")
                                        }
                                        style={{ fontSize: "0.875rem" }}
                                      >
                                        <FontAwesomeIcon icon={faPaperclip} />{" "}
                                        {DocumentpostArr1.length} file Attached
                                      </a>
                                    )) ||
                                    (DocumentpostArr1.length > 0 &&
                                      DocumentpostArr1.length > 1 && (
                                        <a
                                          onClick={() =>
                                            setShowModalFunc(true, "docs")
                                          }
                                          style={{ fontSize: "0.875rem" }}
                                        >
                                          <FontAwesomeIcon icon={faPaperclip} />{" "}
                                          {DocumentpostArr1.length} files
                                          Attached
                                        </a>
                                      ))}
                                </div>
                              </div>
                              <input
                                type="file"
                                id="discussionforumThumbnail"
                                name="discussionforumThumbnail"
                                className="form-control inputcss"
                                multiple
                                onChange={(e) =>
                                  onFileChange(e, "Docs", "DiscussionForumDocs")
                                }
                              />
                            </div>
                          </div> */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label htmlFor="Type" className="form-label">
                                Private or Public{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select
                                className="form-select inputcss"
                                id="Type"
                                name="GroupType"
                                value={formData.GroupType}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              >
                                <option>Select</option>
                                {GrouTypeData.map((item, index) => {
                                  console.log("item-->>", item);
                                  return (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                          {IsinvideHide && (
                            <div className="col-lg-12">
                              <div className="mb-3">
                                <label
                                  htmlFor="invitemembers"
                                  className="form-label"
                                >
                                  Invite Members{" "}
                                  <span className="text-danger">*</span>
                                </label>

                                <Multiselect
                                  options={options}
                                  selectedValues={selectedValue}
                                  onSelect={onSelect}
                                  onRemove={onRemove}
                                  displayValue="name"
                                />
                              </div>
                            </div>
                          )}
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label htmlFor="overview" className="form-label">
                                Discussion  Overview <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control inputcss"
                                id="overview"
                                placeholder="Enter discussion overview here"
                                name="overview"
                                style={{ minHeight: "120px", maxHeight: "120px" }}
                                value={formData.overview}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              ></textarea>
                            </div>
                          </div>

                          {/* <div className="col-lg-12">
                            <div className="mb-3">
                              <label
                                htmlFor="description"
                                className="form-label">
                                Description{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div
                                style={{
                                  display: "contents",
                                  justifyContent: "start",
                                  width: "100px",
                                }}
                              >
                                <ReactQuill
                                  theme="snow"
                                  modules={modules}
                                  formats={formats}
                                  placeholder={"Write your content ..."}
                                  value={richTextValues.description}
                                  onChange={(content) => {
                                    setRichTextValues((prevValues) => ({
                                      ...prevValues,
                                      ["description"]: content,
                                    }));
                                  }}
                                  style={{
                                    width: "100%",
                                    fontSize: "6px",
                                    height: "100px",
                                  }}
                                />
                              </div>
                            </div>
                          </div> */}

                          <div className="text-center butncss mt-5">
                            <div
                              className="btn btn-success waves-effect waves-light m-1"
                              style={{ fontSize: "0.875rem" }}
                              onClick={handleFormSubmit}
                            >
                              <div
                                className="d-flex"
                                style={{
                                  justifyContent: "space-around",
                                  width: "70px",
                                }}
                              >
                                <img
                                  src={require("../../../Assets/ExtraImage/checkcircle.svg")}
                                  style={{ width: "1rem" }}
                                  alt="Check"
                                />{" "}
                                Submit
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-light waves-effect waves-light m-1"
                              style={{ fontSize: "0.875rem" }}
                              onClick={dismissModal}
                            >
                              <img
                                src={require("../../../Assets/ExtraImage/xIcon.svg")}
                                style={{ width: "1rem" }}
                                className="me-1"
                                alt="x"
                              />
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4" style={{paddingLeft:'0.5rem'}}>
              <div className="col-12">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="row justify-content-between">
                      <div className="col-md-12">
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                          <ul
                            className="nav nav-pills navtab-bg float-end"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("home1")}
                                className={`nav-link ${activeTab === "home1" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "home1"}
                                role="tab"
                              >
                                All
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("lastsevenDays")}
                                className={`nav-link ${activeTab === "lastsevenDays" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "lastsevenDays"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Latest
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("OldDays")}
                                className={`nav-link ${activeTab === "OldDays" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "OldDays"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Trending
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
            <div className="card cardCss mt-2 mb-0">
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
                              borderBottomLeftRadius: "0px",
                              minWidth: "50px",
                              maxWidth: "50px",
                              borderTopLeftRadius: "0px",
                            }}
                          >
                            <div
                              className="d-fle"
                              style={{ justifyContent: "space-between" }}
                            >
                              <span>S.No.</span>
                              <span onClick={() => handleSortChange("SNo")}>
                                <FontAwesomeIcon icon={faSort} />
                              </span>
                            </div>
                            {/* <div className="bd-highlight">
                              <input
                                type="text"
                                placeholder="index"
                                onChange={(e) => handleFilterChange(e, "SNo")}
                                className="inputcss"
                                style={{ width: "100%" }}
                              />
                            </div> */}
                          </th>
                          <th style={{ minWidth: "130px", maxWidth: "130px" }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div
                                className="d-flex"
                                style={{ justifyContent: "space-between" }}
                              >
                                <span>Title</span>
                                <span onClick={() => handleSortChange("Title")}>
                                  <FontAwesomeIcon icon={faSort} />
                                </span>
                              </div>
                              {/* <div className=" bd-highlight">
                                <input
                                  type="text"
                                  placeholder="Filter by Title"
                                  onChange={(e) =>
                                    handleFilterChange(e, "Title")
                                  }
                                  className="inputcss"
                                  style={{ width: "100%" }}
                                />
                              </div> */}
                            </div>
                          </th>
                          <th style={{ minWidth: "130px", maxWidth: "130px" }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div
                                className="d-flex"
                                style={{ justifyContent: "space-between" }}
                              >
                                <span>Overview</span>{" "}
                                <span
                                  onClick={() => handleSortChange("Overview")}
                                >
                                  <FontAwesomeIcon icon={faSort} />{" "}
                                </span>
                              </div>
                              {/* <div className=" bd-highlight">
                                <input
                                  type="text"
                                  placeholder="Filter by Overview"
                                  onChange={(e) =>
                                    handleFilterChange(e, "Overview")
                                  }
                                  className="inputcss"
                                  style={{ width: "100%" }}
                                />
                              </div> */}
                            </div>
                          </th>

                          <th style={{ minWidth: "100px", maxWidth: "100px" }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div
                                className="d-flex "
                                style={{ justifyContent: "space-between" }}
                              >
                                <span>Category</span>{" "}
                                <span
                                  onClick={() => handleSortChange("Category")}
                                >
                                  <FontAwesomeIcon icon={faSort} />{" "}
                                </span>
                              </div>
                              {/* <div className=" bd-highlight">
                                <input
                                  type="text"
                                  placeholder="Filter by Category"
                                  onChange={(e) =>
                                    handleFilterChange(e, "Category")
                                  }
                                  className="inputcss"
                                  style={{ width: "100%" }}
                                />
                              </div> */}
                            </div>
                          </th>
                          <th style={{ minWidth: "100px", maxWidth: "100px" }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div
                                className="d-flex "
                                style={{ justifyContent: "space-between" }}
                              >
                                <span>Status</span>{" "}
                                <span
                                  onClick={() => handleSortChange("ARGDiscussionStatus")}
                                >
                                  <FontAwesomeIcon icon={faSort} />{" "}
                                </span>
                              </div>

                            </div>
                          </th>
                          <th style={{ minWidth: "100px", maxWidth: "100px" }}>
                            <div className="d-flex flex-column bd-highlight ">
                              <div
                                className="d-flex "
                                style={{ justifyContent: "space-between" }}
                              >
                                <span>Type</span>{" "}
                                <span
                                  onClick={() => handleSortChange("GroupType")}
                                >
                                  <FontAwesomeIcon icon={faSort} />{" "}
                                </span>
                              </div>

                            </div>
                          </th>
                          <th style={{ minWidth: "110px", maxWidth: "110px" }}>
                            <div className=" ">
                              <div
                                className=""

                              >
                                <span>Owner</span>
                              </div>

                            </div>
                          </th>

                          <th style={{
                            minWidth: "60px", maxWidth: "60px", textAlign: "center"
                          }}>
                            <div className=" ">
                              <div className=""

                              >
                                <span>Replies</span>
                              </div>

                            </div>
                          </th>
                          <th style={{
                            minWidth: "50px", maxWidth: "50px", textAlign: "center"
                          }}>
                            <div className=" ">
                              <div
                                className=" "

                              >
                                <span>Likes</span>
                              </div>

                            </div>
                          </th>
                          <th style={{
                            minWidth: "75px", maxWidth: "75px", textAlign: "center"
                          }}>
                            <div className=" ">
                              <div>
                                <span>Response</span>
                              </div>


                            </div>
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody>
                      {console.log("currentDatacurrentData",currentData)}
                        {currentData.length === 0 ? (
                          <div
                            className="no-results"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}>
                            No results found
                          </div>
                        ) : (
                          
                          currentData.map((item: any, index: number) => (

                            <tr

                              key={index}
                             >
                              <td
                                style={{
                                  minWidth: "50px",
                                  maxWidth: "50px"                                 
                                }}>

                                <span className="indexdesign">  {startIndex + index + 1}</span>
                              </td>
                              <td style={{ minWidth: "130px", maxWidth: "130px", textTransform: 'capitalize', cursor: "pointer" }} onClick={() => handleClick(item.Id)}><span className="text-info bordertesth">{item.Topic}</span></td>
                              <td style={{ minWidth: "130px", maxWidth: "130px" }}>{item.Overview}</td>
                              <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                                {item?.DiscussionForumCategory?.CategoryName}
                              </td>
                              <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                                {item?.ARGDiscussionStatus}
                              </td>
                              <td style={{ minWidth: "100px", maxWidth: "100px" }}>
                                {item?.GroupType}
                              </td>
                              <td style={{ minWidth: "110px", maxWidth: "110px" }}>
                                <img
                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item?.Author?.EMail}`}
                                  className="rounded-circlenu img-thumbnail avatar-xl"
                                  alt="profile-image"
                                />
                                {item?.Author?.Title}
                                {/* <div
                                  style={{
                                  
                                    position: "relative",
                                   
                                  }}
                                >
                                  <div style={{ display: "flex" }} className="newimage5">
                                    {item?.InviteMemebers?.map(
                                      (id: any, idx: any) => {
                                        if (idx < 3) {
                                          return (
                                            <img
                                              style={{
                                                margin:
                                                  index == 0
                                                    ? "0 0 0 0"
                                                    : "0 0 0px -12px",
                                              }}
                                              src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                              className="rounded-circlecss img-thumbnail avatar-xl"
                                              alt="profile-image"
                                            /> 
                                          );
                                        }
                                      }
                                    )}
                                    {item?.InviteMemebers?.length > 3 && (
                                      <div style={{marginTop:'7px'}}
                                        className=""
                                        // onClick={() => toggleDropdown1(item.Id)}
                                        key={item.Id}
                                      >
                                        <div
                                          style={{
                                            textAlign: "center",
                                            margin:
                                              index == 0
                                                ? "0 0 0 0"
                                                : "0 0 0px -12px",
                                          }}
                                          className=""
                                        >
                                         <span className="mt-2"> &nbsp;+ 3 more</span> 
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  {showDropdownId === item.Id && (
                                    <div
                                    // ref={menuRef}
                                      className=""
                                      style={{
                                        position: "fixed",
                                        
                                        zIndex: "99",
                                        background: "#fff",
                                        padding: "1rem",
                                        width: "20rem",
                                      }}
                                    >
                                      {showDropdownId === item.Id &&
                                        item?.InviteMemebers?.map(
                                          (id: any, idx: any) => {
                                            return (
                                              <div className="m-1">
                                                <img
                                                  style={{}}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecss img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />{" "}
                                                {id?.EMail}
                                              </div>
                                            );
                                          }
                                        )}
                                    </div>
                                  )}
                                </div> */}
                              </td>
                              {/* Replies Count */}
                              <td style={{ minWidth: "60px", maxWidth: "60px" }}>
                                <img style={{ width: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }}
                                  src={require("../assets/noun-reply.png")}

                                  alt="Check"
                                /> {item.repliesCount ? item.repliesCount : 0}
                              </td>

                              {/* Likes Count */}
                              <td style={{ minWidth: "50px", maxWidth: "50px" }}>
                                <img style={{ width: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} src={require("../assets/glike.png")} alt="Check" /> {Number(item.likesCount) > 0 ? item.likesCount : 0}
                              </td>

                              {/* Comments Count */}
                              <td style={{ minWidth: "75px", maxWidth: "75px", textAlign: "center" }}>
                                <img style={{ width: '16px', verticalAlign: 'text-bottom', marginRight: '5px' }} src={require("../assets/ccomment.png")} alt="Check" />  {Number(item.commentsLength) > 0 ? item.commentsLength : 0}
                              </td>

                              {/* <td style={{ minWidth: "80px", maxWidth: "80px" }}>
                              
                                {moment(item.Created).format("DD-MMM-YYYY")}
                              </td> */}
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
                            }`}>
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
                            }`}>
                          <a
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-label="Next">
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
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscussionForum: React.FC<IDiscussionForumProps> = (props) => (
  <Provider>
    <DiscussionForumContext props={props} />
  </Provider>
);
export default DiscussionForum;