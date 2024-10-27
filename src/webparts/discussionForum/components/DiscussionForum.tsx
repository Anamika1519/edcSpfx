import React, { useState } from "react";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";

import "bootstrap/dist/css/bootstrap.min.css";

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

 

import {

  faArrowDown,

  faArrowLeft,

  faEllipsisV,

  faFileExport,

  faPencilAlt,

  faPlusCircle,

} from "@fortawesome/free-solid-svg-icons";

import * as XLSX from "xlsx";

import moment from "moment";

import {

  DeleteAnnouncementAPI,

  uploadFile,

} from "../../../APISearvice/AnnouncementsService";

import {

  addItem,

  GetCategory,
  getChoiceFieldOption,
  getDiscussionComments,

  getDiscussionForum,

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
  const [options, setOpions] = useState([ ]);
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

    // bannerImage: null,

    // announcementGallery: null,

    // announcementThumbnail: null,
    GroupType:"",
    description: "",

    overview: "",

    FeaturedAnnouncement: false,

  });

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

 

  React.useEffect(() => {

    sessionStorage.removeItem("announcementId");

    ApiCall();

  }, [useHide]);

 

  const ApiCall = async () => {

    debugger

    const announcementArr = await getDiscussionForum(sp);

    let lengArr:any;

  

      for(var i=0;i<announcementArr.length;i++)

      {

      

        lengArr = await getDiscussionComments(sp,announcementArr[i].ID)

        console.log(lengArr,'rrr');

       

        announcementArr[i].commentsLength = lengArr.arrLength,

        announcementArr[i].Users= lengArr.arrUser

      

        

      }
      fetchOptions()
    // const categorylist = await GetCategory(sp);

    setCategoryData(await GetCategory(sp));

    setEnityData(await getEntity(sp)); //Entity

    setAnnouncementData(announcementArr);

    const NewsArr = await getNews(sp);

    setNewsData(NewsArr);
    setGroupTypeData(
      await getChoiceFieldOption(sp, "ARGGroupandTeam", "GroupType")
    );
  };

 

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

 

    // Sort data

    // const sortedData = filteredData.sort((a, b) => {

    //   if (sortConfig.key) {

    //     const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';

    //     const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';

 

    //     if (aValue < bValue) {

    //       return sortConfig.direction === 'ascending' ? -1 : 1;

    //     }

    //     if (aValue > bValue) {

    //       return sortConfig.direction === 'ascending' ? 1 : -1;

    //     }

    //   }

    //   return 0;

    // });

 

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

console.log(announcementData,'announcementData');

 

  const exportToExcel = (data: any[], fileName: string) => {

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const fetchOptions = async () => {
    try {
        const items = await fetchUserInformationList(sp);
        console.log(items,'itemsitemsitems');
        
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
  console.log('Selected item:', selectedItem,'selectedList',selectedList);
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

  const topicPosts = [

    {

      ID: 1,

      Title: "Testing 123",

      Description: "test for desc....",

      Category: "Business Reports",

      Users: [

        {

          name: "Mat Helme",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

        {

          name: "Michael Zenaty",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

        {

          name: "James Anderson",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

      ],

      Replies: 6,

      Views: 2,

      Activity: "about 9 days ago",

    },

    {

      ID: 2,

      Title: "Hi SA System Account",

      Description: "SA System Account SA System Account SA...",

      Category: "Announcement of Government",

      Users: [

        {

          name: "Mat Helme",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

        {

          name: "Michael Zenaty",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

        {

          name: "James Anderson",

          avatar: require("../../../Assets/ExtraImage/userimg.png"),

        },

      ],

      Replies: 4,

      Views: 0,

      Activity: "about 13 days ago",

    },

    {

      ID: 1,

      Title: "Testing 123",

      Description: "test for desc....",

      Category: "Business Reports",

      Users: [

        { name: "Mat Helme", avatar: "assets/images/users/user-1.jpg" },

        { name: "Michael Zenaty", avatar: "assets/images/users/user-2.jpg" },

        { name: "James Anderson", avatar: "assets/images/users/user-3.jpg" },

      ],

      Replies: 6,

      Views: 2,

      Activity: "about 9 days ago",

    },

    {

      ID: 2,

      Title: "Hi SA System Account",

      Description: "SA System Account SA System Account SA...",

      Category: "Announcement of Government",

      Users: [

        { name: "Mat Helme", avatar: "assets/images/users/user-1.jpg" },

        { name: "Michael Zenaty", avatar: "assets/images/users/user-2.jpg" },

        { name: "James Anderson", avatar: "assets/images/users/user-3.jpg" },

      ],

      Replies: 4,

      Views: 0,

      Activity: "about 13 days ago",

    },

  ];

  const handleChangeCheckBox = (name: string, value: string | boolean) => {

    setFormData((prevValues) => ({

      ...prevValues,

      [name]: value === true ? true : false, // Ensure the correct boolean value is set for checkboxes

    }));

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
    } else if(name == "GroupType") {
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

    const { topic, Type, category, entity, overview, FeaturedAnnouncement } =

      formData;

    const { description } = richTextValues;

    let valid = true;

 

    if (!topic) {

      Swal.fire("Error", "Topic is required!", "error");

      valid = false;

    }  else if (!entity) {

      Swal.fire("Error", "Entity is required!", "error");

      valid = false;

    }

    else if (!category) {

      Swal.fire("Error", "Category is required!", "error");

      valid = false;

    }

    //else if (!overview) {

    //   Swal.fire('Error', 'Overview is required!', 'error');

    //   valid = false;

    // } else if (!description) {

    //   Swal.fire('Error', 'Description is required!', 'error');

    //   valid = false;

    // } else if (!FeaturedAnnouncement) {

    //   Swal.fire('Error', 'Featured Announcement is required!', 'error');

    //   valid = false;

    // }

 

    return valid;

  };

 

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

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: "warning",

        }).then(async (result) => {

          console.log(result);

          if (result.isConfirmed) {
            const selectedIds =
            selectedValue.length > 0
              ? selectedValue.map((ele) => ele.id)
              : null;
            //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

            debugger;

            let bannerImageArray: any = {};

            let galleryIds: any[] = [];

            let documentIds: any[] = [];

            let galleryArray: any[] = [];

            let documentArray: any[] = [];

 

            // formData.FeaturedAnnouncement === "on"?  true :false;

 

            // Upload Banner Images

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

              debugger;

              // if (!postId) {

              //   console.error("Post creation failed.");

              //   return;

              // }

 

              // Upload Gallery Images

              // Upload Gallery Images

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

                console.log(documentIds, "documentIds");

                console.log(galleryIds, "galleryIds");

                // Update Post with Gallery and Document Information

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

              // if (!postId) {

              //   console.error("Post creation failed.");

              //   return;

              // }

 

              // Upload Gallery Images

              // Upload Gallery Images

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

              setFormData({ topic: "",

                category: "",

                entity: "",

                Type: "",
                GroupType:"",
                // announcementGallery: null,

                // announcementThumbnail: null,

                description: "",

                overview: "",

                FeaturedAnnouncement: false,});

              setDocumentpostArr1([]);

              setDocumentpostArr([]);

               setImagepostArr([])

               setImagepostArr1([])

               ApiCall()

              dismissModal()

            }, 2000);

          }

        });

      } else {

        Swal.fire({

          title: "Do you want to save?",

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Save",

          cancelButtonText: "Cancel",

          icon: "warning",

        }).then(async (result) => {

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

          if (result.isConfirmed) {

            debugger;

            let bannerImageArray: any = {};

            let galleryIds: any[] = [];

            let documentIds: any[] = [];

            let galleryArray: any[] = [];

            let documentArray: any[] = [];

 

            // formData.FeaturedAnnouncement === "on"?  true :false;

 

            // Upload Banner Images

            // if (

            //   BnnerImagepostArr.length > 0 &&

            //   BnnerImagepostArr[0]?.files?.length > 0

            // ) {

            //   for (const file of BnnerImagepostArr[0].files) {

            //     //  const uploadedBanner = await uploadFile(file, sp, "Documents", Url);

            //     bannerImageArray = await uploadFile(

            //       file,

            //       sp,

            //       "Documents",
            //       "https://officeindia.sharepoint.com"
            //     );

            //   }

            // }

            debugger;

            // Create Post

            const postPayload = {

              Topic: formData.topic,

              Overview: formData.overview,

              Description: richTextValues.description,

              EntityId: Number(formData.entity),

              DiscussionForumCategoryId: Number(formData.category),

            };

            console.log(postPayload);

 

            const postResult = await addItem(postPayload, sp);

            const postId = postResult?.data?.ID;

            debugger;

            if (!postId) {

              console.error("Post creation failed.");

              return;

            }

 

            console.log(

              ImagepostArr,

              "ImagepostArr",

              ImagepostArr1,

              "ImagepostArr1",

              DocumentpostArr1,

              "DocumentpostArr1",

              DocumentpostArr,

              "DocumentpostArr"

            );

 

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

 

            // Update Post with Gallery and Document Information

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

            // Swal.fire("Item added successfully", "", "success");

            // sessionStorage.removeItem("bannerId");

            setAnnouncementData(await getDiscussionForum(sp));

            setTimeout(async () => {

            

              setFormData({ topic: "",

                category: "",

                entity: "",

                Type: "",
                GroupType:"",
                description: "",

                overview: "",

                FeaturedAnnouncement: false,});

              setDocumentpostArr1([]);

              setDocumentpostArr([]);

               setImagepostArr([])

               setImagepostArr1([])

              // ApiCall()

               window.location.reload() //forNow

              dismissModal()

            }, 2000);

          }

        });

      }

    }

  };

  const dismissModal = () => {

    const modalElement = document.getElementById('discussionModal');

   

    // Remove Bootstrap classes and attributes manually

    modalElement.classList.remove('show');

    modalElement.style.display = 'none';

    modalElement.setAttribute('aria-hidden', 'true');

    modalElement.removeAttribute('aria-modal');

    modalElement.removeAttribute('role');

 

    // Optionally, remove the backdrop if it was added manually

    const modalBackdrop = document.querySelector('.modal-backdrop');

    if (modalBackdrop) {

      modalBackdrop.remove();

    }

  };

  const handleCancel = () => {

    debugger;

    window.location.href =
      "https://officeindia.sharepoint.com/sites/AlRostmani/SitePages/Blogs.aspx";
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

            marginLeft: `${!useHide ? "240px" : "80px"}`, marginTop:'0.5rem'

          }}

        >

          <div className="container-fluid paddb">

            <div className="row" style={{ paddingLeft: "0.5rem" }}>

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

                        ></button>

                      </div>

                      <div className="modal-body">

                        <form className="row">

                          <div className="col-lg-3">

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

                          {/* <div className="col-lg-3">

                            <div className="mb-3">

                              <label htmlFor="Type" className="form-label">

                                Type <span className="text-danger">*</span>

                              </label>

                              <select

                                className="form-select inputcss"

                                id="Type"

                                name="Type"

                                value={formData.Type}

                                onChange={(e) =>

                                  onChange(e.target.name, e.target.value)

                                }

                              >

                                <option>Select</option>

                                {TypeData.map((item, index) => (

                                  <option key={index} value={item.id}>

                                    {item.name}

                                  </option>

                                ))}

                              </select>

                            </div>

                          </div> */}

                          <div className="col-lg-3">

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

 

                          <div className="col-lg-3">

                            <div className="mb-3">

                              <label htmlFor="entity" className="form-label">

                                Entity <span className="text-danger">*</span>

                              </label>

                              <select

                                className="form-select inputcss"

                                id="entity"

                                name="entity"

                                value={formData.entity}

                                onChange={(e) =>

                                  onChange(e.target.name, e.target.value)

                                }

                              >

                                <option value="">Select</option>

                                {EnityData.map((item, index) => (

                                  <option key={index} value={item.id}>

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

                                    htmlFor="bannerImage"

                                    className="form-label"

                                  >

                                    Banner Image{" "}

                                    <span className="text-danger">*</span>

                                  </label>

                                </div>

                                <div>

                                  <div>

                                    {

                                      BnnerImagepostArr[0] != false &&

                                      BnnerImagepostArr.length > 0 &&

                                      BnnerImagepostArr != undefined

                                        ? BnnerImagepostArr.length == 1 && (

                                            <a style={{ fontSize: "0.875rem" }}>

                                              <FontAwesomeIcon

                                                icon={faPaperclip}

                                              />

                                              1 file Attached

                                            </a>

                                          )

                                        : ""

                                      // || BnnerImagepostArr.length > 0 && BnnerImagepostArr[0].files.length > 1 &&

                                      // (<a onClick={() => setShowModalFunc(true, "bannerimg")} style={{ fontSize: '0.875rem' }}>

                                      //   <FontAwesomeIcon icon={faPaperclip} /> {BnnerImagepostArr[0].files.length} files Attached

                                      // </a>)

                                    }

                                  </div>

                                </div>

                              </div>

                              <input

                                type="file"

                                id="bannerImage"

                                name="bannerImage"

                                className="form-control inputcss"

                                onChange={(e) =>

                                  onFileChange(e, "bannerimg", "Document")

                                }

                              />

                            </div>

                          </div> */}

                          <div className="col-lg-4">
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

                          </div>

                          <div className="col-lg-4">
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
                            </div>

                          <div className="col-lg-4">
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
                          <div className="col-lg-9">

                            <div className="mb-3">

                              <label htmlFor="overview" className="form-label">

                                Overview <span className="text-danger">*</span>

                              </label>

                              <textarea

                                className="form-control inputcss"

                                id="overview"

                                placeholder="Enter Overview"

                                name="overview"

                                style={{ height: "90px" }}

                                value={formData.overview}

                                onChange={(e) =>

                                  onChange(e.target.name, e.target.value)

                                }

                              ></textarea>

                            </div>

                          </div>

 

                          <div className="col-lg-12">

                            <div className="mb-3">

                              <label

                                htmlFor="description"

                                className="form-label"

                              >

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

                          </div>

                          {/* <div className="col-lg-2">

                            <div className="mb-3">

                              <label

                                htmlFor="FeaturedAnnouncement"

                                className="form-label"

                              >

                                Featured Announcement{" "}

                                <span className="text-danger">*</span>

                              </label>

                              <br />

                              <div className="form-check">

                                <input

                                  type="checkbox"

                                  id="FeaturedAnnouncement"

                                  name="FeaturedAnnouncement"

                                  checked={formData.FeaturedAnnouncement}

                                  onChange={(e) =>

                                    handleChangeCheckBox(

                                      e.target.name,

                                      e.target.checked

                                    )

                                  }

                                  className="form-check-input inputcss"

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

                              minWidth: "50px",

                              maxWidth: "50px",

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

                          <th style={{ minWidth: "180px", maxWidth: "180px" }}>

                            <div className="d-flex flex-column bd-highlight ">

                              <div

                                className="d-flex pb-2"

                                style={{ justifyContent: "space-between" }}

                              >

                                {" "}

                                <span>Title</span>{" "}

                                <span onClick={() => handleSortChange("Title")}>

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

                                  className="inputcss"

                                  style={{ width: "100%" }}

                                />

                              </div>

                            </div>

                          </th>

                          <th style={{ minWidth: "150px", maxWidth: "150px" }}>

                            <div className="d-flex flex-column bd-highlight ">

                              <div

                                className="d-flex  pb-2"

                                style={{ justifyContent: "space-between" }}

                              >

                                {" "}

                                <span>Overview</span>{" "}

                                <span

                                  onClick={() => handleSortChange("Overview")}

                                >

                                  <FontAwesomeIcon icon={faSort} />{" "}

                                </span>

                              </div>

                              <div className=" bd-highlight">

                                {" "}

                                <input

                                  type="text"

                                  placeholder="Filter by Overview"

                                  onChange={(e) =>

                                    handleFilterChange(e, "Overview")

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

                                {" "}

                                <span>Category</span>{" "}

                                <span

                                  onClick={() => handleSortChange("Category")}

                                >

                                  <FontAwesomeIcon icon={faSort} />{" "}

                                </span>

                              </div>

                              <div className=" bd-highlight">

                                {" "}

                                <input

                                  type="text"

                                  placeholder="Filter by Category"

                                  onChange={(e) =>

                                    handleFilterChange(e, "Category")

                                  }

                                  className="inputcss"

                                  style={{ width: "100%" }}

                                />

                              </div>

                            </div>

                          </th>

                          <th style={{ minWidth: "70px", maxWidth: "70px" }}>

                            <div className="d-flex flex-column bd-highlight ">

                              <div

                                className="d-flex  pb-2"

                                style={{ justifyContent: "space-between" }}

                              >

                                <span>Users</span>

                             

                              </div>

                              <br />

                              <div className=" bd-highlight">

                               

                              </div>

                            </div>

                          </th>

                          <th style={{ minWidth: "50px", maxWidth: "50px",  borderBottomRightRadius: "10px",

                              borderTopRightRadius: "10px",textAlign: "center" }}>

                            <div className="d-flex flex-column bd-highlight ">

                              <div

                                className="d-flex  pb-2"

                                style={{ justifyContent: "space-between" }}

                              >

                                <span>Reply</span>

                             

                              </div>

                              <br />

                              <div className=" bd-highlight">

                               

                              </div>

                            </div>

                          </th>

                     

                          {/* <th

                            style={{

                              textAlign: "center",

                              borderBottomRightRadius: "10px",

                              borderTopRightRadius: "10px",

                            }}

                          >

                            {" "}

                             <div className="d-flex flex-column bd-highlight pb-2">

                              <div

                                className="d-flex  pb-2"

                                style={{ justifyContent: "space-between" }}

                              >

                                {" "}

                                <span>Action</span>{" "}

                                <div className="dropdown">

                                  <FontAwesomeIcon

                                    icon={faEllipsisV}

                                    onClick={toggleDropdown}

                                    size="xl"

                                  />

                                </div>

                              </div>

                              <div className=" bd-highlight">

                                {" "}

                                <div

                                  id="myDropdown"

                                  className={`dropdown-content ${

                                    isOpen ? "show" : ""

                                  }`}

                                >

                                  <div onClick={handleExportClick} className="">

                                    <FontAwesomeIcon icon={faFileExport} />{" "}

                                    Export

                                  </div>

                                </div>

                              </div>

                            </div>

                          

                          </th> */}

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

                              onClick={() => handleClick(item.Id)}

                              key={index}

                              style={{cursor:"pointer"}}

                            >

                              <td

                                style={{

                                  minWidth: "50px",

                                  maxWidth: "50px",

                                }}

                              >

                                {startIndex + index + 1}

                              </td>

                              <td  style={{ minWidth: "180px", maxWidth: "180px" }}>{item.Topic}</td>

                              <td  style={{ minWidth: "150px", maxWidth: "150px" }}>{item.Overview}</td>

                              <td  style={{ minWidth: "100px", maxWidth: "100px" }}>

                                {item?.DiscussionForumCategory?.CategoryName}

                              </td>

                              <td  style={{ minWidth: "70px", maxWidth: "70px" }}>

                                {

                                  item?.Users?.length>0?item?.Users.map((res: any,index:0)=>

                                  {

                                    return(

                                      <img  style={{ margin: index==0 ? '0 0 0 0' : '0 0 0px -12px' }}

                                      src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${res}`}

                                      className="rounded-circlecss img-thumbnail avatar-xl"

                                      alt="profile-image"

                                    />

                                    )

                                  }

                                  ):null

                                }

                             

                              </td>

                              <td  style={{ minWidth: "50px", maxWidth: "50px" }}>

                                {item.commentsLength}

                              </td>

                           

                              {/* <td

                                style={{

                                  minWidth: "50px",

                                  maxWidth: "50px",

                                }}

                                className="ng-binding"

                              >

                                <div

                                  className="d-flex pb-2"

                                  style={{ justifyContent: "space-around" }}

                                >

                                  <span>

                                    {" "}

                                    <a

                                      className="action-icon text-primary"

                                      onClick={() => EditAnnouncement(item.ID)}

                                    >

                                      <FontAwesomeIcon icon={faEdit} />

                                    </a>

                                  </span>{" "}

                                  <span>

                                    <a

                                      className="action-icon text-danger"

                                      onClick={() =>

                                        DeleteAnnouncement(item.ID)

                                      }

                                    >

                                      <FontAwesomeIcon icon={faTrashAlt} />

                                    </a>

                                  </span>

                                </div>

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

                          className={`page-item ${

                            currentPage === 1 ? "disabled" : ""

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

                            className={`page-item ${

                              currentPage === num + 1 ? "active" : ""

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

                          className={`page-item ${

                            currentPage === totalPages ? "disabled" : ""

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