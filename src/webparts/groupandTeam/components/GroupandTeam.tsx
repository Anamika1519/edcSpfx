import React, { useState } from "react";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";

import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import { IGroupandTeamProps } from "./IGroupandTeamProps";

import Provider from "../../../GlobalContext/provider";

import { getSP } from "../loc/pnpjsConfig";

import UserContext from "../../../GlobalContext/context";

import { useMediaQuery } from "react-responsive";

import { Users } from "react-feather";

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "../../../CustomCss/mainCustom.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";

import "../components/Group.scss";

import Swal from "sweetalert2";

import {

  getCategory,

  getChoiceFieldOption,

  getCurrentUser,

  getEntity,

} from "../../../APISearvice/CustomService";

import {

  uploadFile,

  uploadFileToLibrary,

} from "../../../APISearvice/MediaService";

import { GetCategory } from "../../../APISearvice/DiscussionForumService";

import {

  addItem,

  fetchUserInformationList,

  getGroupTeam,

  getGroupTeamByID,

  getType,

  updateGroupFollowItem,

  updateItem,

  updateGroupUnFollowItem

} from "../../../APISearvice/GroupTeamService";

import * as XLSX from "xlsx";

import { getNews } from "../../../APISearvice/NewsService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCloudArrowUp, faPaperclip } from "@fortawesome/free-solid-svg-icons";

import { decryptId } from "../../../APISearvice/CryptoService";

import { SPFI } from "@pnp/sp/presets/all";

import { Multiselect } from 'multiselect-react-dropdown';

const GroupandTeamcontext = ({ props }: any) => {

  const sp: SPFI = getSP();

  const { useHide }: any = React.useContext(UserContext);

  const context = React.useContext(UserContext);

  const { setUseId, useId }: any = context;

  const [groupsData, setGroupsData] = React.useState([]);

  const [tempgroupsData, settempGroupsData] = React.useState([]);


  const elementRef = React.useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const [bannersData, setBannersData] = React.useState([]);

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });



  const [newsData, setNewsData] = React.useState([]);

  const [GrouTypeData, setGroupTypeData] = React.useState([]);

  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);

  const [DocumentpostArr, setDocumentpostArr] = React.useState([]);

  const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);

  const [ImagepostArr, setImagepostArr] = React.useState([]);

  const [ImagepostArr1, setImagepostArr1] = React.useState([]);

  const [TypeData, setTypeData] = React.useState([]);



  const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);



  const [EnityData, setEnityData] = React.useState([]);

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



  const toggleDropdown = () => {

    setIsOpen(!isOpen);

  };

  const [sortConfig, setSortConfig] = React.useState({

    key: "",

    direction: "ascending",

  });

  const [formData, setFormData] = React.useState<any>({

    GroupName: "",

    category: "",

    entity: "",

    GroupType: "",

    // bannerImage: null,

    // announcementGallery: null,

    // announcementThumbnail: null,

    GroupDescription: "",

    overview: "",

    FeaturedAnnouncement: false,

  });

  const SiteUrl = props.siteUrl;

  const [CategoryData, setCategoryData] = React.useState([]);
  const [activeTab, setActiveTab] = useState("allgroups");

  const [showModal, setShowModal] = React.useState(false);

  const [showDocTable, setShowDocTable] = React.useState(false);

  const [showImgModal, setShowImgTable] = React.useState(false);

  const [showBannerModal, setShowBannerTable] = React.useState(false);

  const [currentUser, setCurrentUser] = React.useState(null);

  const [editForm, setEditForm] = React.useState(false);

  const [announcementData, setAnnouncementData] = React.useState([]);

  const [contactData, setContact] = React.useState([]);

  const [IsinvideHide, setIsinvideHide] = React.useState(false);



  const [Url, setBaseUrl] = React.useState("");

  const [richTextValues, setRichTextValues] = React.useState<{

    [key: string]: string;

  }>({});



  React.useEffect(() => {

    sessionStorage.removeItem("announcementId");

    ApiCall();
    addItem;
  }, [useHide]);

  const [isToggled, setIsToggled] = useState(false);

  const handleFollow = async (groupItem: any, e: any, value: string) => {
    debugger;
    e.stopPropagation();
    let updatedFollowers;
    let existingFollowers: any = groupItem.GroupFollowersId || [];
    if (value === "follow") {
      document.getElementById(value + groupItem.Id).innerText = "Unfollow";
      document.getElementById(value + groupItem.Id).classList.remove('btn-blue');
      document.getElementById(value + groupItem.Id).classList.add('btn-red');
      updatedFollowers = [...existingFollowers, currentUser.Id];
      const updatedata = {
        GroupFollowersId: updatedFollowers
      }
      const updateResult = await updateGroupFollowItem(updatedata, sp, groupItem.Id);

    }
    else if (value === "unfollow") {
      document.getElementById(value + groupItem.Id).innerText = "follow";
      document.getElementById(value + groupItem.Id).classList.remove('btn-red');
      document.getElementById(value + groupItem.Id).classList.add('btn-blue');
      let indexToRemove = existingFollowers.indexOf(currentUser.Id);
      if (indexToRemove > -1) {
        existingFollowers.splice(indexToRemove, 1);
      }
      updatedFollowers = existingFollowers;
      const updatedata = {
        GroupFollowersId: updatedFollowers
      }
      const updateResult = await updateGroupUnFollowItem(updatedata, sp, groupItem.Id);

    }
  }
  const handleTabClick = async (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
    debugger;
    if (tab === "allgroups") {
      const allGroups = await getGroupTeam(sp);
      const filteredGroups = allGroups.filter(item => {
          if (item.GroupType === "Selected Members") {
              // Check if current user is in InviteMemebers
             // alert(`currentuser id ${currentUser.Id}`)
              return item.InviteMemebers.some((invitee:any) => invitee.Id === currentUser.Id || item.Author.ID === currentUser);
          }
          return true;
      });
      setGroupsData(filteredGroups);
  } 
   else if (tab === "groupsyoucreated") {
      const res = groupsData.filter(item =>
        // Include public groups or private groups where the current user is in the InviteMembers array
        item.Author.Title == currentUser.Title);
      setGroupsData(res);
      if (res.length < 0) {
        const res = tempgroupsData.filter(item =>
          // Include public groups or private groups where the current user is in the InviteMembers array
          item.Author.Title == currentUser.Title);
        setGroupsData(res);
      }
    }
    else if (tab === "groupsyoufollow") {

      const res = groupsData.filter(item =>
        // Include public groups or private groups where the current user is in the InviteMembers array
        item.GroupFollowersId == currentUser.Id);
      setGroupsData(res);
    }
    settempGroupsData(await getGroupTeam(sp));
  };
  const ApiCall = async () => {

    // await addItem(sp);

    // await getGroupTeam(sp);

    fetchOptions()
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    const announcementArr = await getGroupTeam(sp);

    // const categorylist = await GetCategory(sp);

    // setCategoryData(await GetCategory(sp));

    setEnityData(await getEntity(sp)); //Entity

    setGroupTypeData(

      await getChoiceFieldOption(sp, "ARGGroupandTeam", "GroupType")

    );

    console.log("announcementArr----------", announcementArr);

    setGroupsData(announcementArr);

    // setAnnouncementData(announcementArr);

    const NewsArr = await getNews(sp);

    setNewsData(NewsArr);

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

          Swal.fire("only document can be uploaded");

        }

      }

      // if (libraryName === "Gallery" || libraryName === "bannerimg") {

      //   const imageVideoFiles = files.filter(

      //     (file) =>

      //       file.type.startsWith("image/") || file.type.startsWith("video/")

      //   );



      //   if (imageVideoFiles.length > 0) {

      //     const arr = {

      //       files: imageVideoFiles,

      //       libraryName: libraryName,

      //       docLib: docLib,

      //     };

      //     if (libraryName === "Gallery") {

      //       uloadImageFiles.push(arr);

      //       setImagepostArr(uloadImageFiles);

      //       if (ImagepostArr1.length > 0) {

      //         imageVideoFiles.forEach((ele) => {

      //           let arr1 = {

      //             ID: 0,

      //             Createdby: "",

      //             Modified: "",

      //             fileUrl: "",

      //             fileSize: ele.size,

      //             fileType: ele.type,

      //             fileName: ele.name,

      //           };

      //           ImagepostArr1.push(arr1);

      //         });

      //         setImagepostArr1(ImagepostArr1);

      //       } else {

      //         imageVideoFiles.forEach((ele) => {

      //           let arr1 = {

      //             ID: 0,

      //             Createdby: "",

      //             Modified: "",

      //             fileUrl: "",

      //             fileSize: ele.size,

      //             fileType: ele.type,

      //             fileName: ele.name,

      //           };

      //           uloadImageFiles1.push(arr1);

      //         });

      //         setImagepostArr1(uloadImageFiles1);

      //       }

      //     } else {

      //       uloadBannerImageFiles.push(arr);

      //       setBannerImagepostArr(uloadBannerImageFiles);

      //     }

      //   } else {

      //     Swal.fire("only image & video can be upload");

      //   }

      // }

    }

  };



  const getDescription = (des: any) => {

    // You can fetch this from an API, or return dynamic content.

    return des;

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

    // debugger;



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

  const [placeholder, setPlaceholder] = useState("Select")
  const currentData = filteredAnnouncementData.slice(startIndex, endIndex);

  const newsCurrentData = filteredNewsData.slice(startIndex, endIndex);

  const [editID, setEditID] = React.useState(null);

  const [ImagepostIdsArr, setImagepostIdsArr] = React.useState([]);

  const [options, setOpions] = useState([



  ]);

  const [selectedValue, setSelectedValue] = useState([]); // Initialize selectedValue as an array

  const fetchOptions = async () => {

    // try {

    //   const items = await fetchUserInformationList(sp);

    //   console.log(items, 'itemsitemsitems');



    //   const formattedOptions = items.map((item: { Title: any; Id: any; }) => ({

    //     name: item.Title, // Adjust according to your list schema

    //     id: item.Id,

    //   }));

    //   setOpions(formattedOptions);

    // } catch (error) {

    //   console.error('Error fetching options:', error);

    // }
    try {
      const items = await sp.web.siteUsers
          .filter("PrincipalType eq 1")();

      console.log(items, 'itemsitemsitems');

      const formattedOptions = items.map((item) => ({
          name: item.Title, // Adjust according to your list schema
          id: item.Id,
      }));

      setOpions(formattedOptions);
  } catch (error) {
      console.error('Error fetching options:', error);
  }

  };

  const onSelect = (selectedList: React.SetStateAction<any[]>, selectedItem: any) => {
    if(selectedList.length > 0){
      setPlaceholder("");
    }else{
      setPlaceholder("Select");
    }
    setSelectedValue(selectedList);

    console.log('Selected item:', selectedItem, 'selectedList', selectedList);

  }



  const onRemove = (selectedList: React.SetStateAction<any[]>, removedItem: any) => {
    if(selectedList.length > 0){
      setPlaceholder("");
    }else{
      setPlaceholder("Select");
    }
    setSelectedValue(selectedList);

    console.log('Removed item:', removedItem);

  }

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


  const onChange = async (name: string, value: string) => {

    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "GroupType" && value != "All") {
      setIsinvideHide(true);

    } else if (name == "GroupType") {

      setIsinvideHide(false);
    }
  };
  const validateForm = () => {
    debugger

    const {
      GroupName,
      GroupType,
      category,
      overview,
      FeaturedAnnouncement,
      inviteMemebrs,
      GroupDescription,

    } = formData;

    let valid = true;

    if (!GroupName) {
      Swal.fire("Error", "Group Name is required!", "error");
      valid = false;
    }
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

  const members = [

    { value: "member1", label: "Member 1" },

    { value: "member2", label: "Member 2" },

    { value: "member3", label: "Member 3" },

    { value: "member4", label: "Member 4" },

  ];
  const handleFormSubmit = async () => {
    if (validateForm()) {

      if (editForm) {

        Swal.fire({

          title: "Are you sure you want to create group?",

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
            let arr: any[] = [];
            // Update the list item with the user ID
            // await sp.web.lists.getByTitle("ARGEventMaster").items.getById(Item.Id).update(
            //   {
            //     AttendeesId: arr,
            //   }
            // ).then(res=>
            // {
            //   console.log("People Picker field updated successfully!");
            //   ApiLocalStorageData()
            // }
            // )
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
              let postPayload: any = {};
              if (formData.GroupType != "All") {
                postPayload = {
                  GroupName: formData.GroupName,
                  Overview: formData.overview,
                  GroupDescription: formData.GroupDescription,
                  GroupType: formData.GroupType,
                  InviteMemebersId: selectedIds,
                };
              } else {
                postPayload = {
                  GroupName: formData.GroupName,
                  Overview: formData.overview,
                  GroupDescription: formData.GroupDescription,
                  GroupType: formData.GroupType,
                };

              }
              console.log(postPayload);



              const postResult = await updateItem(postPayload, sp, editID);

              const postId = postResult?.data?.ID;

              debugger;





              // Upload Documents

              if (DocumentpostArr[0]?.files?.length > 0) {

                for (const file of DocumentpostArr[0].files) {

                  const uploadedDocument = await uploadFileToLibrary(

                    file,

                    sp,

                    "GroupTeamsDocs"

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

              // if (galleryArray.length > 0) {

              //   let ars = galleryArray.filter((x) => x.ID == 0);

              //   if (ars.length > 0) {

              //     for (let i = 0; i < ars.length; i++) {

              //       galleryArray.slice(i, 1);

              //     }

              //   }

              // }

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

                // ...(galleryIds.length > 0 && {

                //   GroupTeamGalleryId: galleryIds,



                //   GroupTeamGalleryJSON: JSON.stringify(flatArray(galleryArray)),

                // }),

                ...(documentIds.length > 0 && {

                  GroupTeamsDocsId: documentIds,

                  GroupTeamsDocsJSON: JSON.stringify(flatArray(documentArray)),

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

              let postPayload: any = {}
              if (formData.GroupType != "All") {
                postPayload = {

                  GroupName: formData.GroupName,

                  Overview: formData.overview,

                  GroupDescription: formData.GroupDescription,

                  // EntityId: Number(formData.entity),

                  GroupType: formData.GroupType,

                  InviteMemebersId: selectedIds

                  // DiscussionForumCategoryId: Number(formData.category),

                };

              }

              else {

                postPayload = {

                  GroupName: formData.GroupName,

                  Overview: formData.overview,

                  GroupDescription: formData.GroupDescription,

                  // EntityId: Number(formData.entity),

                  GroupType: formData.GroupType,

                  // DiscussionForumCategoryId: Number(formData.category),

                };

              }

              console.log(postPayload);

              const postResult = await updateItem(postPayload, sp, editID);
              const postId = postResult?.data?.ID;
              debugger;

              // Upload Documents

              if (DocumentpostArr[0]?.files?.length > 0) {

                for (const file of DocumentpostArr[0].files) {

                  const uploadedDocument = await uploadFileToLibrary(

                    file,

                    sp,

                    "GroupTeamsDocs"

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

              // if (galleryArray.length > 0) {

              //   let ars = galleryArray.filter((x) => x.ID == 0);

              //   if (ars.length > 0) {

              //     for (let i = 0; i < ars.length; i++) {

              //       galleryArray.slice(i, 1);

              //     }

              //   }

              // }

              debugger;

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

              debugger;

              const updatePayload = {

                // ...(galleryIds.length > 0 && {

                //   AnnouncementAndNewsGallaryId: galleryIds,



                //   AnnouncementAndNewsGallaryJSON: JSON.stringify(

                //     flatArray(galleryArray)

                //   ),

                // }),

                ...(documentIds.length > 0 && {

                  GroupTeamsDocsId: documentIds,

                  GroupTeamsDocsJSON: JSON.stringify(flatArray(documentArray)),

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

            Swal.fire("Congratulations! You are IN: Join the conversation with Group Members", "", "success");

            setFormData([]);

            setDocumentpostArr1([]);

            setDocumentpostArr([]);



            sessionStorage.removeItem("announcementId");

            setTimeout(() => {

              window.location.href = `${siteUrl}/SitePages/GroupandTeam.aspx`;

            }, 2000);

          }

        });

      } else {

        Swal.fire({

          title: "Are you sure you want to create group?",

          showConfirmButton: true,

          showCancelButton: true,

          confirmButtonText: "Yes",

          cancelButtonText: "No",

          icon: "warning",

        }).then(async (result) => {

          //console.log("Form Submitted:", formValues, bannerImages, galleryImages, documents);

          if (result.isConfirmed) {

            const selectedIds = selectedValue.length > 0 ? selectedValue.map(ele => ele.id) : null;

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

            // Create Post

            let postPayload: any = {}
            if (formData.GroupType != "All") {
              debugger
              postPayload = {

                GroupName: formData.GroupName,

                GroupDescription: formData.GroupDescription,

                EntityId: Number(formData.entity),

                GroupType: formData.GroupType,

                InviteMemebersId: selectedIds

                // DiscussionForumCategoryId: Number(formData.category),

              };

            }

            else {

              postPayload = {

                GroupName: formData.GroupName,

                GroupDescription: formData.GroupDescription,

                EntityId: Number(formData.entity),

                GroupType: formData.GroupType,

                // DiscussionForumCategoryId: Number(formData.category),

              };

            }

            console.log("postPayload-->>>", postPayload);



            const postResult = await addItem(sp, postPayload);

            console.log("post Result-->>>", postResult);

            const postId = postResult?.data?.ID;

            if (!postId) {

              console.error("Post creation failed.");

              return;

            }



            // console.log(

            //   ImagepostArr,

            //   "ImagepostArr",

            //   ImagepostArr1,

            //   "ImagepostArr1",

            //   DocumentpostArr1,

            //   "DocumentpostArr1",

            //   DocumentpostArr,

            //   "DocumentpostArr"

            // );



            // Upload Gallery Images

            // if (ImagepostArr.length > 0) {

            //   for (const file of ImagepostArr[0]?.files) {

            //     const uploadedGalleryImage = await uploadFileToLibrary(

            //       file,

            //       sp,

            //       "GroupTeamGallery"

            //     );



            //     galleryIds = galleryIds.concat(

            //       uploadedGalleryImage.map((item: { ID: any }) => item.ID)

            //     );

            //     galleryArray.push(uploadedGalleryImage);

            //   }

            // }



            // Upload Documents

            if (DocumentpostArr.length > 0) {

              for (const file of DocumentpostArr[0]?.files) {

                const uploadedDocument = await uploadFileToLibrary(

                  file,

                  sp,

                  "GroupTeamsDocs"

                );

                documentIds = documentIds.concat(

                  uploadedDocument.map((item: { ID: any }) => item.ID)

                );

                documentArray.push(uploadedDocument);

              }

            }



            // Update Post with Gallery and Document Information

            const updatePayload = {

              // ...(galleryIds.length > 0 && {

              //   GroupTeamGalleryId: galleryIds,

              //   GroupTeamGalleryJSON: JSON.stringify(flatArray(galleryArray)),

              // }),

              ...(documentIds.length > 0 && {

                GroupTeamsDocsId: documentIds,

                GroupTeamsDocsJSON: JSON.stringify(flatArray(documentArray)),

              }),

            };



            if (Object.keys(updatePayload).length > 0) {

              const updateResult = await updateItem(updatePayload, sp, postId);

              console.log("Update Result:", updateResult);

            }

            Swal.fire("Congratulations! Groups created successfully", "", "success");

            setFormData([]);

            setDocumentpostArr1([]);

            setDocumentpostArr([]);

            setGroupsData(await getGroupTeam(sp));

            settempGroupsData(await getGroupTeam(sp));
            // sessionStorage.removeItem("bannerId");

            setTimeout(async () => {

              // setAnnouncementData(await getGroupTeam(sp));

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



  const flatArray = (arr: any[]): any[] => {

    return arr.reduce((acc, val) => acc.concat(val), []);

  };



  // const handleCancel = () => {

  //   // Get the modal instance using Bootstrap's Modal API

  //   const modal = bootstrap.Modal.getInstance(

  //     document.getElementById("discussionModal")

  //   );



  //   // Close the modal

  //   modal.hide();

  // };

  const handleClick = (id: any) => {

    console.log(id, "----id");

    window.location.href = `${SiteUrl}/SitePages/GroupandTeamDetails.aspx?${id}`;

  };

  const initialFormData = {

    GroupName: "",

    category: "",

    entity: "",

    GroupType: "",

    GroupDescription: "",

    overview: "",

    FeaturedAnnouncement: false,

  };

  const renderContent = (groupItem: any) => {
    if (groupItem.GroupFollowersId === null) {
      return <div id={"follow" + groupItem.ID}
        onClick={(e) => handleFollow(groupItem, e, "follow")}
        className="btn-light font-14 rounded-pill text-primary waves-effect fw-bold waves-light btn-lightcss btn-blue">
        Follow
      </div>

    } else {
      return <div id={"unfollow" + groupItem.ID}
        onClick={(e) => handleFollow(groupItem, e, "unfollow")}
        className="btn-light font-14 rounded-pill text-primary waves-effect fw-bold waves-light btn-lightcss btn-red">
        UnFollow
      </div>
    }
  };

  const siteUrl = props.siteUrl;

  //#region Breadcrumb

  const Breadcrumb = [

    {

      MainComponent: "Home",

      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,

    },

    {

      ChildComponent: "Groups",

      ChildComponentURl: `${siteUrl}/SitePages/GroupandTeam.aspx`,

    },

  ];

  //#endregion


  
  return (

    <div id="wrapper" ref={elementRef}>

      <div className="app-menu" id="myHeader">

        <VerticalSideBar _context={sp} />

      </div>

      <div className="content-page">

        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />

        <div

          className="content"

          style={{ marginLeft: `${!useHide ? "240px" : "80px"}` }}

        >

          <div className="container-fluid  paddb">

            <div className="row">

              <div className="col-lg-3">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

              <div className="col-lg-9">

                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">

                  {/* Button to trigger modal */}

                  <button

                    type="button"

                    data-bs-toggle="modal"

                    data-bs-target="#discussionModal"

                    className="btn btn-secondary font-14 waves-effect waves-light"

                  >

                    <i className="fe-plus-circle"></i> Create New Group

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

                        <h5 className="modal-title m-0" id="exampleModalLabel">

                          Create New Group

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
                          {/* <div className="col-lg-6">
                            <div className="mb-3">

                              <div className="d-flex justify-content-between align-items-center">

                                <div>

                                  <label

                                    htmlFor="discussionThumbnail"

                                    className="form-label"

                                  >

                                    Upload a Docs{" "}

                                 

                                  </label>

                                </div>

                                <div className="d-flex align-items-center">

                                  <FontAwesomeIcon

                                    icon={faCloudArrowUp}

                                    className="me-2"

                                  />

                                  {(DocumentpostArr1.length > 0 &&

                                    DocumentpostArr1.length === 1 && (

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

                                id="groupteamThumbnail"

                                name="groupteamThumbnail"

                                className="form-control inputcss"

                                multiple

                                onChange={(e) =>

                                  onFileChange(e, "Docs", "GroupTeamsDocs")

                                }

                              />

                            </div>
                          </div> */}



                          <div className="col-lg-6">

                            <div className="mb-3">

                              <label htmlFor="topic" className="form-label">

                                Group Name{" "}

                                <span className="text-danger">*</span>

                              </label>

                              <input

                                type="text"

                                id="GroupName"

                                name="GroupName"

                                placeholder="Enter Group Name"

                                className="form-control inputcss"

                                value={formData.GroupName}

                                onChange={(e) =>

                                  onChange(e.target.name, e.target.value)

                                }

                              />

                            </div>

                          </div>

                          <div className="col-lg-6">

                            <div className="mb-3">

                              <label htmlFor="Type" className="form-label">
                                Visible to  {" "}


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

                          {/* <div className="col-lg-6">

                            <div className="mb-3">

                              <label htmlFor="entity" className="form-label">

                                Department{" "}

             

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

                          </div> */}

                          {IsinvideHide && (

                            <div className="col-lg-12">

                              <div className="mb-3">

                                <label

                                  htmlFor="invitemembers"

                                  className="form-label"

                                >
                                  Select Members{" "}
                                  <span className="text-danger">*</span>

                                </label>

                                {/* <Multiselect

                                  options={options}

                                  selectedValues={selectedValue}

                                  onSelect={onSelect}

                                  onRemove={onRemove}

                                  displayValue="name"

                                /> */}
                                  <Multiselect
                options={options}
                selectedValues={selectedValue}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="name"
                // showCheckbox={true}
                placeholder={placeholder} // Change the placeholder text
                avoidHighlightFirstOption={true} // Option to avoid highlighting the first option by default
                customCloseIcon={<span>&times;</span>} // Custom icon for removing selected items
                closeIcon="cancel" // Close icon for clearing selections
            />

                              </div>

                            </div>

                          )}



                          <div className="col-lg-12">

                            <div className="mb-3">

                              <label

                                htmlFor="GroupDescription"

                                className="form-label"

                              >
                                Group Objective{" "}

                              </label>

                              <textarea

                                className="form-control inputcss"

                                id="GroupDescription"

                                placeholder="Enter Description"

                                name="GroupDescription"

                                rows={3}

                                style={{ height: '120px' }}

                                value={formData.GroupDescription}

                                onChange={(e) =>

                                  onChange(e.target.name, e.target.value)

                                }

                              ></textarea>

                            </div>

                          </div>

                          <div className="text-center butncss">

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

                                Create

                              </div>

                            </div>

                            <button

                              type="button"

                              className="btn btn-light waves-effect waves-light m-1"

                              style={{ fontSize: "0.875rem" }}

                              data-bs-dismiss="modal"

                            // onClick={handleCancel}

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

            <div className="col-12 mt-3">
              <div className="card mb-0">
                <div className="card-body">
                  <div className="row justify-content-between">
                    <div className="col-md-12">
                      <div className="d-flex flex-wrap align-items-center justify-content-center">
                        <ul className="nav nav-pills navtab-bg float-end" role="tablist">
                          <li className="nav-item" role="presentation">
                            <a onClick={() => handleTabClick("allgroups")}
                              className={`nav-link ${activeTab === "allgroups" ? "active" : ""
                                }`}
                              aria-selected={activeTab === "allgroups"} role="tab">All</a>
                          </li>
                          <li className="nav-item" role="presentation">
                            <a onClick={() => handleTabClick("groupsyoucreated")}
                              className={`nav-link ${activeTab === "groupsyoucreated" ? "active" : ""
                                }`}
                              aria-selected={activeTab === "groupsyoucreated"} role="tab" tabIndex={-1}>Groups You Created</a>
                          </li>
                          <li className="nav-item" role="presentation">
                            <a onClick={() => handleTabClick("groupsyoufollow")}
                              className={`nav-link ${activeTab === "groupsyoufollow" ? "active" : ""
                                }`}
                              aria-selected={activeTab === "groupsyoufollow"} role="tab" tabIndex={-1}>Groups You Follow</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {activeTab === "allgroups" && (
              <div className="row mt-4">

                {groupsData.map((groupItem: any, index: number) => (

                  <div

                    key={index}

                    className="col-lg-6 col-xl-3 position-relative ng-scope" onClick={() => handleClick(groupItem.ID)}

                  >

                    <div

                      style={{ background: "#12a8de", color: "#fff" }}

                      className="card heightcard"

                    >







                      <div>{renderContent(groupItem)}</div>
                      <div className="card-body">

                        <a key={index}>

                          <div className="bg">
                            <img src={require("../assets/backteam.png")} />



                          </div>

                          <h4

                            style={{ lineHeight: "26px", float: "left", color: "#fff", textTransform: 'capitalize' }}

                            className="card-title fw-bold font-20 mb-1 mt-0"

                          >
                            {groupItem.GroupName.length > 50
                              ? `${groupItem.GroupName.substring(0, 47)}...`
                              : groupItem.GroupName}{" "}
                            ({groupItem.GroupType})

                          </h4>

                        </a>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

            {activeTab === "groupsyoucreated" && (
              <div className="row mt-4">

                {groupsData.map((groupItem: any, index: number) => (

                  <div

                    key={index}

                    className="col-lg-6 col-xl-3 position-relative ng-scope" onClick={() => handleClick(groupItem.ID)}

                  >

                    <div

                      style={{ background: "#12a8de", color: "#fff" }}

                      className="card heightcard"

                    >






                      <div>{renderContent(groupItem)}</div>

                      <div className="card-body">

                        <a key={index}>

                          <div className="bg">
                            <img src={require("../assets/backteam.png")} />



                          </div>

                          <h4

                            style={{ lineHeight: "26px", float: "left", color: "#fff", textTransform: 'capitalize' }}

                            className="card-title fw-bold font-20 mb-1 mt-0"

                          >

                            {groupItem.GroupName.length > 50
                              ? `${groupItem.GroupName.substring(0, 47)}...`
                              : groupItem.GroupName}{" "}
                            ({groupItem.GroupType})

                          </h4>

                        </a>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

            {activeTab === "groupsyoufollow" && (
              <div className="row mt-4">

                {groupsData.map((groupItem: any, index: number) => (

                  <div

                    key={index}

                    className="col-lg-6 col-xl-3 position-relative ng-scope" onClick={() => handleClick(groupItem.ID)}

                  >

                    <div

                      style={{ background: "#12a8de", color: "#fff" }}

                      className="card heightcard"

                    >




                      <div>{renderContent(groupItem)}</div>



                      <div className="card-body">

                        <a key={index}>

                          <div className="bg">
                            <img src={require("../assets/backteam.png")} />



                          </div>

                          <h4

                            style={{ lineHeight: "26px", float: "left", color: "#fff", textTransform: 'capitalize' }}

                            className="card-title fw-bold font-20 mb-1 mt-0"

                          >

<p style={{ lineHeight: '20px' }} className="font-12 text-muted twolinewrap">
{groupItem.GroupName}</p> ({groupItem.GroupType})

                          </h4>

                        </a>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}
          </div>

        </div>

      </div>

    </div>

  );

};

const GroupandTeam: React.FC<IGroupandTeamProps> = (props) => {

  return (

    <Provider>

      <GroupandTeamcontext props={props} />

    </Provider>

  );

};

export default GroupandTeam;