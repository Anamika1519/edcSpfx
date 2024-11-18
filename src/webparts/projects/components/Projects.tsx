// import React from 'react'

// const Projects = () => {
//   return (
//     <div>
//       project test
//     </div>
//   )
// }

// export default Projects

import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS + Popper.js
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import { encryptId } from "../../../APISearvice/CryptoService";
import { Heart, MessageSquare, Share2 } from "react-feather";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import ReactQuill from "react-quill";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Projects.scss";
// import {
//   Choicedata,
//   fetchprojectdata,
// } from "../../../APISearvice/ProjectsService";
import {
  addItem,
  Choicedata,
  DeleteProjectAPI,
  fetchprojectdata,
  updateItem,
  uploadFileToLibrary,
  XYZ,
} from "../../../APISearvice/ProjectsService";
import { Item } from "@pnp/sp/items";
// import { getSP } from "../loc/pnpjsConfig";
import Swal from "sweetalert2";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { SPFI } from "@pnp/sp/presets/all";
import { getSP } from "../loc/pnpjsConfig";
import Multiselect from "multiselect-react-dropdown";
import { fetchUserInformationList } from "../../../APISearvice/GroupTeamService";
import {
  getCurrentUserNameId,
  getUserProfilePicture,
} from "../../../APISearvice/CustomService";
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

  const headerRef = useRef(null); // Reference to the header
  const [isSticky, setIsSticky] = useState(false);
  const _sp: SPFI = getSP();

  const [Dataproject, setDataproject] = useState<any[]>([]);
  const [itemsToShow, setItemsToShow] = useState(8); // Initial number of items to show
  const [ChoiceValueOne, setChoiceValueOne] = useState<any[]>([]);
  const [DocumentpostArr, setDocumentpostArr] = React.useState([]);
  const [DocumentpostArr1, setDocumentpostArr1] = React.useState([]);
  const [ImagepostArr, setImagepostArr] = React.useState([]);
  const [ImagepostArr1, setImagepostArr1] = React.useState([]);
  const [DocumentpostIdsArr, setDocumentpostIdsArr] = React.useState([]);
  const [BnnerImagepostArr, setBannerImagepostArr] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showBannerModal, setShowBannerTable] = React.useState(false);
  const [showImgModal, setShowImgTable] = React.useState(false);
  const [showDocTable, setShowDocTable] = React.useState(false);
  const scrollContainerRef = useRef(null);
  const [CommentsCount, setCommentsCount] = useState(0);
  const [LikeCount, setLikeCount] = useState(0);
  const [IsinvideHide, setIsinvideHide] = React.useState(false);
  const [options, setOpions] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]); // Initialize selectedValue as an array
  const [userId, setUserId] = useState<any>(-1);
  const [showDropdownId, setShowDropdownId] = React.useState(null);
  const toggleDropdown = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
    }
  };

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

  const siteUrl = props.siteUrl;
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  const GotoNextPage = (item: any) => {
    console.log("item-->>>>", item);
    const encryptedId = encryptId(String(item.ID));
    // sessionStorage.setItem("mediaId", encryptedId);
    // sessionStorage.setItem("dataID", item.Id)
    window.location.href = `${siteUrl}/SitePages/ProjectDetails.aspx?${item.ID}`;
  };
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Projects",
      ChildComponentURl: `${siteUrl}/SitePages/Project.aspx`,
    },
  ];

  const [formData, setFormData] = React.useState({
    ProjectName: "",
    ProjectPriority: "",
    ProjectPrivacy: "",
    startDate: "",
    dueDate: "",
    Budget: "",
    TeamMembers: "",
    ProjectOverview: "",
    ProjectFileManager : ""
  
  });

  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };

  const onChange = (name: string, value: string) => {
    console.log("name-->>", name);
    console.log("value-->>", value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    debugger;
    window.location.href =
      "https://officeindia.sharepoint.com/sites/AlRostmani/SitePages/Project.aspx";
  };

  const saveProjectData = async (formData: {
    ProjectName: any;
    ProjectPriority: any;
    ProjectPrivacy: any;
    startDate: any;
    dueDate: any;
    Budget: any;
    ProjectOverview: any;
  }) => {
    let arrId = 0;
    try {
      await sp.web.lists
        .getByTitle("ARGProject")
        .items.add({
          ProjectName: formData.ProjectName,
          ProjectPriority: formData.ProjectPriority,
          ProjectPrivacy: formData.ProjectPrivacy,
          StartDate: formData.startDate,
          DueDate: formData.dueDate,
          Budget: formData.Budget,
          ProjectOverview: formData.ProjectOverview,
        
        })
        .then((item: any) => {
          console.log("checking the arrid ---->>>", item);
          arrId = item.data.Id;
        });

      console.log("Project data saved successfully.");


  
    } catch (error) {
      console.error("Error saving project data: ", error);
    }
    return arrId;
  };

  const handleFormSubmit = async () => {
    debugger;
    if (validateForm()) {
      // const arrId = await saveProjectData(formData);
      let postPayload = {};

      const selectedIds =
        selectedValue.length > 0 ? selectedValue.map((ele) => ele.id) : null;

      postPayload = {
        ProjectName: formData.ProjectName,
        ProjectPriority: formData.ProjectPriority,
        ProjectPrivacy: formData.ProjectPrivacy,
        StartDate: formData.startDate,
        DueDate: formData.dueDate,
        Budget: formData.Budget,
        ProjectOverview: formData.ProjectOverview,
        TeamMembersId: selectedIds,
        // ProjectFileManager : formData.ProjectFileManager,
        // ProjectStatus: "Ongoing"
        // DiscussionForumCategoryId: Number(formData.category),
      };
      const postResult = await addItem(postPayload, sp);

      const arrId = postResult?.data?.ID;
      console.log(arrId);

      // Check if arrId is valid
      // if (!arrId) {
      //   console.log(postResult);
      //   console.error("Failed to save project data, arrId is invalid.");
      //   Swal.fire("Error", "Failed to save project data", "error");
      //   return; // Exit the function if the ID is invalid
      // }

      // Reset form data

      let documentArray: any[] = [];
      let documentIds: any[] = [];

      // Check for document files
      if (DocumentpostArr[0]?.files?.length > 0) {
        for (const file of DocumentpostArr[0].files) {
          try {
            const uploadedDocument = await uploadFileToLibrary(
              file,
              sp,
              "ProjectDocs"
            );
            console.log(uploadedDocument, "Uploaded Document");

            if (Array.isArray(uploadedDocument)) {
              documentIds = documentIds.concat(
                uploadedDocument.map((item) => item.ID)
              );
              documentArray.push(
                ...uploadedDocument.filter((item) => item.ID !== 0)
              );
            }
          } catch (error) {
            console.error("Error uploading document:", error);
          }
        }
      } else {
        documentIds = DocumentpostIdsArr; // Use existing IDs
        documentArray = DocumentpostArr1;
      }

      // Prepare update payload for documents
      const updatePayload = {
        ...(documentIds.length > 0 && {
          ProjectsDocsId: documentIds,
          ProjectsDocsJSON: JSON.stringify(flatArray(documentArray)),
        }),
      };

      // Check if update payload is valid
      console.log("Update payload before update:", updatePayload);

      if (Object.keys(updatePayload).length > 0) {
        try {
          const updateResult = await updateItem(updatePayload, sp, arrId);
          console.log("Update Result:", updateResult);
          Swal.fire("Project added successfully")
          setTimeout(async () => {
            // setAnnouncementData(await getGroupTeam(sp));
            setFormData({
              ProjectName: "",
              ProjectPriority: "",
              ProjectPrivacy: "",
              startDate: "",
              dueDate: "",
              Budget: "",
              TeamMembers: "",
              ProjectOverview: "",
              ProjectFileManager: ""
            });
            // window.location.reload(); //forNow
            setDataproject(await fetchprojectdata(sp));
            setChoiceValueOne(await Choicedata(sp));
            dismissModal();
          }, 2000);
        } catch (error) {
          console.error("Error updating item:", error);
        }
      }
      else {
        Swal.fire("Project added successfully")
        setTimeout(async () => {
          // setAnnouncementData(await getGroupTeam(sp));
          setFormData({
            ProjectName: "",
            ProjectPriority: "",
            ProjectPrivacy: "",
            startDate: "",
            dueDate: "",
            Budget: "",
            TeamMembers: "",
            ProjectOverview: "",
            ProjectFileManager : ""
          });
          // window.location.reload(); //forNow
          setDataproject(await fetchprojectdata(sp));
          setChoiceValueOne(await Choicedata(sp));
          dismissModal();
        }, 2000);
      }
    }
  };
  const validateForm = () => {
    debugger

    const {
      ProjectName,
      // ProjectPriority,
      // ProjectPrivacy,
      // Budget,
      startDate,
      // dueDate,
      // ProjectOverview
    } = formData;
    let TeamMembersId: any;
    let valid = true;
    console.log(selectedValue, 'selectedValue');
    if (!ProjectName) {
      Swal.fire("Error", "Project Name is required!", "error");
      valid = false;
    }
    // else if (!ProjectPriority) {
    //   Swal.fire("Error", "Project Priority is required!", "error");
    //   valid = false;
    // }
    // else if (!ProjectPrivacy) {
    //   Swal.fire("Error", "Project Privacy is required!", "error");
    //   valid = false;
    // }
    // else if (!Budget) {
    //   Swal.fire("Error", "Budget is required!", "error");
    //   valid = false;
    // }
    else if (!startDate) {
      Swal.fire("Error", "Start Date is required!", "error");
      valid = false;
    }
    // else if (!dueDate) {
    //   Swal.fire("Error", "Due Date is required!", "error");
    //   valid = false;
    // }
    // else if (selectedValue.length == 0) {
    //   Swal.fire("Error", "Team Member is required!", "error");
    //   valid = false;
    // }
    // else if (!ProjectOverview) {
    //   Swal.fire("Error", "Project Overview is required!", "error");
    //   valid = false;
    // }
    return valid;

  };

  const dismissModal = () => {
    const modalElement = document.getElementById("discussionModal");

    // Remove Bootstrap classes and attributes manually

    modalElement.classList.remove("show");

    modalElement.style.display = "none";

    modalElement.setAttribute("aria-hidden", "true");

    modalElement.removeAttribute("aria-modal");

    modalElement.removeAttribute("role");

    // Optionally, remove the backdrop if it was added manually

    const modalBackdrop = document.querySelector(".modal-backdrop");

    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  };
  const ApiCall = async () => {
    fetchOptions();
    const res = await getCurrentUserNameId(sp);
    setUserId(res);
    setDataproject(await fetchprojectdata(sp));
    setChoiceValueOne(await Choicedata(sp));
    await XYZ(sp);
  };

  const handleDelete = (Id: any) => {
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
        DeleteProjectAPI(sp, Id).then(async () => {
          setFormData({
            ProjectName: "",
            ProjectPriority: "",
            ProjectPrivacy: "",
            startDate: "",
            dueDate: "",
            Budget: "",
            TeamMembers: "",
            ProjectOverview: "",
            ProjectFileManager:""
          });

          setDataproject(await fetchprojectdata(sp));
          Swal.fire("Deleted!", "Item has been deleted.", "success");
        });
      }
    });
  };
  const UpdatProject= (Id:any)=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close This Project!",
    }).then((result) => {
      if (result.isConfirmed) {
        sp.web.lists.getByTitle("ARGProject").items.getById(Id).update({
          ProjectStatus: "Close"
        }).then(async () => {
          setDataproject(await fetchprojectdata(sp));
          Swal.fire("Updated!", "Project status has been set to 'Close'.", "success");
        }).catch((error) => {
          console.error("Error updating project status:", error);
          Swal.fire("Error", "There was an issue updating the project status.", "error");
        });
        // DeleteProjectAPI(sp, Id).then(async () => {
        //   // setFormData({
        //   //   ProjectName: "",
        //   //   ProjectPriority: "",
        //   //   ProjectPrivacy: "",
        //   //   startDate: "",
        //   //   dueDate: "",
        //   //   Budget: "",
        //   //   TeamMembers: "",
        //   //   ProjectOverview: "",
        //   //   ProjectFileManager:""
        //   // });

        //   setDataproject(await fetchprojectdata(sp));
        //   Swal.fire("Deleted!", "Item has been deleted.", "success");
        // });
      }
    });
  }
  const handleViewDetail = (id: any) => {
    console.log("View detail action");
  };


  console.log("ChoiceValueOne data111->>>>>>", Dataproject);

  const onFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    libraryName: string,
    docLib: string
  ) => {
    debugger;
    console.log("libraryName-->>>>", libraryName);
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
            file.type === "application/Docx" || file.type === "application/Doc" ||
            file.type === "application/msword" ||
            file.type === "application/xlsx" ||
            file.type === "text/csv" ||
            file.type === "application/xlsx" ||
            file.type === "text/plain" ||
            file.type === "text/html" ||
            file.type === "application/xml" ||
            file.type === "application/vnd.ms-excel" ||
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            file.type === "text/"
        );
        console.log("docfiles check--->>>", docFiles);

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
          console.log("arr-->>>", arr);
          if (libraryName === "Gallery") {
            uloadImageFiles.push(arr);
            setImagepostArr(uloadImageFiles);
            if (ImagepostArr1.length > 0) {
              imageVideoFiles.forEach((ele) => {
                console.log("ele in if-->>>>", ele);
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
                console.log("ele in else-->>>>", ele);
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
            console.log("uloadBannerImageFiles-->>", uloadBannerImageFiles);
            setBannerImagepostArr(uloadBannerImageFiles);
          }
        } else {
          Swal.fire("only image & video can be upload");
        }
      }
    }
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
  const [activeTab, setActiveTab] = useState("home1");
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
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

  const onSelect = (
    selectedList: React.SetStateAction<any[]>,
    selectedItem: any
  ) => {
    setSelectedValue(selectedList);

    console.log("Selected item:", selectedItem, "selectedList", selectedList);
  };

  const onRemove = (
    selectedList: React.SetStateAction<any[]>,
    removedItem: any
  ) => {
    setSelectedValue(selectedList);

    console.log("Removed item:", removedItem);
  };

  const loadMore = () => {
    event.preventDefault()
    event.stopImmediatePropagation()
    setItemsToShow(itemsToShow + 8); // Increase the number by 8
  };

  return (
    <div id="wrapper" ref={elementRef}>
      <div className="app-menu" id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div
          className="content mt-2"
          style={{ marginLeft: `${!useHide ? "240px" : "80px"}` }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-4">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-8">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  {/* Button to trigger modal */}
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#discussionModal"
                    className="btn btn-secondary waves-effect waves-light"
                  >
                    <i className="fe-plus-circle"></i> New Request
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
                          Create Project
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
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor=" Project Name"
                                className="form-label"
                              >
                                Project Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                id="ProjectName"
                                name="ProjectName"
                                placeholder="Enter Project Name"
                                className="form-control inputcss"
                                value={formData.ProjectName}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {/* <div className="col-lg-4">
                            <div className="mb-3">
                              <label
                                htmlFor="Project Priority"
                                className="form-label"
                              >
                                Project Priority{" "}
                    
                              </label>
                              <select
                                className="form-select inputcss"
                                id="ProjectPriority"
                                name="ProjectPriority"
                                value={formData.ProjectPriority}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              >
                                <option>Select</option>
                              
                                {ChoiceValueOne?.map(
                                  (item: any, index: any) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div> */}

                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label
                                htmlFor="Project Privacy"
                                className="form-label"
                              >
                                Project Privacy{" "}
                             
                              </label>
                              <div
                                id="ProjectPrivacy"
                                style={{ display: "flex", gap: "5px" }}
                              >
                                <div className="form-check">
                                  <input
                                    id="ProjectPrivacyPrivate"
                                    name="ProjectPrivacy"
                                    className="form-check-input"
                                    type="radio"
                                    value="Private"
                                    checked={
                                      formData.ProjectPrivacy === "Private"
                                    }
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="ProjectPrivacyPrivate"
                                  >
                                    Private
                                  </label>
                                </div>
                                {/* <div className="form-check">
                                  <input
                                    id="ProjectPrivacyTeam"
                                    name="ProjectPrivacy"
                                    className="form-check-input"
                                    type="radio"
                                    value="Team"
                                    checked={formData.ProjectPrivacy === "Team"}
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="ProjectPrivacyTeam"
                                  >
                                    Team
                                  </label>
                                </div> */}
                                <div className="form-check">
                                  <input
                                    id="ProjectPrivacyPublic"
                                    name="ProjectPrivacy"
                                    className="form-check-input"
                                    type="radio"
                                    value="Public"
                                    checked={
                                      formData.ProjectPrivacy === "Public"
                                    }
                                    onChange={(e) =>
                                      onChange(e.target.name, e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="ProjectPrivacyPublic"
                                  >
                                    Public
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Start Date Field */}
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label htmlFor="startDate" className="form-label">
                                Start Date{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="form-control inputcss"
                                value={formData.startDate}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {/* Due Date Field */}
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label htmlFor="dueDate" className="form-label">
                                Due Date
                              </label>
                              <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className="form-control inputcss"
                                value={formData.dueDate}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label htmlFor="Budget" className="form-label">
                                Budget
                              </label>
                              <input
                                type="number"
                                id="Budget"
                                name="Budget"
                                placeholder="Enter Budget"
                                className="form-control inputcss"
                                value={formData.Budget}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
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
                                    Discussion Thumbnail{" "}

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

                          {/* {IsinvideHide && ( */}
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label
                                htmlFor="invitemembers"
                                className="form-label"
                              >
                                Select Members{" "}
                                {/* <span className="text-danger">*</span> */}
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
                          {/* <div className="col-lg-4">
                            <div className="mb-3">
                              <label
                                htmlFor="invitemembers"
                                className="form-label"
                              >
                                Project File Master{" "}
                            
                              </label>
                              <input
                                type="text"
                                id="ProjectFileManager"
                                name="ProjectFileManager"
                                placeholder="Enter Project File Manager URL"
                                className="form-control inputcss"
                                value={formData.ProjectFileManager}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              />
                            
                            </div>
                          </div> */}
                          {/* )} */}

                          <div className="col-lg-8">
                            <div className="mb-3">
                              <label
                                htmlFor="Project Overview"
                                className="form-label"
                              >
                                Project Overview{" "}
                                {/* <span className="text-danger">*</span> */}
                              </label>
                              <textarea
                                className="form-control inputcss"
                                id="ProjectOverview"
                                placeholder="Enter Project Overview"
                                name="ProjectOverview"
                                style={{ height: "166px" }}
                                value={formData.ProjectOverview}
                                onChange={(e) =>
                                  onChange(e.target.name, e.target.value)
                                }
                              ></textarea>
                            </div>
                          </div>
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
                                Create
                              </div>
                            </div>
                            <button
                              type="button"
                              className="btn btn-light waves-effect waves-light m-1"
                              style={{ fontSize: "0.875rem" }}
                              onClick={handleCancel}
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

                                onClick={() => handleTabClick("profile1")}
                                className={`nav-link ${activeTab === "profile1" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "profile1"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Owner
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("profile11")}
                                className={`nav-link ${activeTab === "profile11" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "profile11"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Member
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("Ongoing")}
                                className={`nav-link ${activeTab === "Ongoing" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "Ongoing"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Ongoing Projects
                              </a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a

                                onClick={() => handleTabClick("Close")}
                                className={`nav-link ${activeTab === "Close" ? "active" : ""
                                  }`}
                                aria-selected={activeTab === "Close"}
                                role="tab"
                                tabIndex={-1}
                              >
                                Closed Projects
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

            {activeTab === "home1" && (
              <div className="row mt-3">
                <div className="">
                  {/* Map through the projects array and display a card for each */}
                  {Dataproject.length > 0 ? (
                    <div className="row">
                      {Dataproject.slice(0, itemsToShow).map((project, index) => {
                        console.log("project>>>>>>>>>>>>>", project);
                        if (project.ProjectPrivacy == "Public") {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                          <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a onClick={() => GotoNextPage(project)}
                                      className="text-dark fw-bold font-16">
                                      {project.ProjectName}
                                    </a>
                                  </h4>
                               
                                  <a>

{
      project?.ProjectStatus === null 
      ? null // Don't display anything if ProjectStatus is null
      : (
          <a className="ongoing mb-3"
              style={{ 
                  background: project?.ProjectStatus === 'Close' ? '#008751' : '#cce7dc',
                  color: project?.ProjectStatus === 'Close' ? '#008751' : '#cce7dc',
                  padding: '5px',
                  borderRadius: '4px',
                  textDecoration: 'none'
              }}
          >
              {project?.ProjectStatus === 'Ongoing' ? 'Ongoing' : 'Close'}
          </a>
      )
}
</a>

                                  {/* Description */}
                                  <p
                                    style={{ color: "#98a6ad" }}
                                    className="date-color two-line font-14 mb-3 sp-line-2"
                                  >
                                    {project.ProjectOverview} 
                                    
                                    {/* <a
                                      href="javascript:void(0);"
                                      className="fw-bold text-muted"
                                      onClick={() => GotoNextPage(project)}
                                    >
                                      view more
                                    </a> */}
                                  </p>

                                  {/* Task info */}
                                  <p style={{display:'flex', gap:'10px'}} className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} />     <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />  <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>
                                  <div
                                    style={{
                                     
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecssnew img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'
                                            }}
                                            className="rounded-circlecssnew text-center img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                           float:"left"
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecssnew img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (project?.TeamMembersId?.includes(userId)) {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                       <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a
                                      onClick={() => GotoNextPage(project)}
                                      className="text-dark fw-bold font-16"
                                    >
                                      {project.ProjectName}
                                    </a>
                                  </h4>


                                  <p className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} />     <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />   <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>

                                  {/* Task info */}
                                  {/* <p className="mb-1 font-12">
                              <span
                                style={{ color: "#6e767e" }}
                                className="pe-2 text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-file-text text-muted"></i>
                                <b>{project.documentsCount || 0}</b> Documents
                              </span>
                              <span
                                style={{ color: "#6e767e" }}
                                className="text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-message-square text-muted"></i>
                                <b>{project. CommentsCount || 0}</b> Comments
                              </span>
                            </p> */}
                                  <div
                                    style={{
                                     
                                      position: "relative",
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                      float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecssnew img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'

                                            }}
                                            className="rounded-circlecssnew text-center img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecssnew img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else if (project?.TeamMembersId?.includes(userId) || project?.AuthorId == userId) {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a
                                      href="#"
                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                       <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"
                                        href="#"
                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"
                                        href="#"
                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a
                                      className="text-dark fw-bold font-16"   onClick={() => GotoNextPage(project)}
                                    >
                                      {project.ProjectName ||
                                        "Untitled Project"}
                                    </a>
                                  </h4>
                                  {/* <div className="finish mb-2">
                                    {project.status || "Finished"}
                                  </div> */}

                                  {/* Description */}
                                  <p
                                    style={{ color: "#98a6ad" }}
                                    className="date-color two-line font-14 mb-3 sp-line-2"
                                  >
                                    {project.ProjectOverview ||
                                      "No description available..."}{" "}
                                    {/* <a
                                      href="javascript:void(0);"
                                      className="fw-bold text-muted"
                                      onClick={() => GotoNextPage(project)}
                                    >
                                      view more
                                    </a> */}
                                  </p>

                                  {/* Task info */}
                                  <p style={{display:'flex', gap:'10px'}} className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} /> <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                   
                                   <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />    <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>
                                  <div
                                    style={{
                                     
                                    }}
                                  >
                                    <div className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecssnew img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'
                                            }}
                                            className="circlecssnewnew text-center img-thumbnail avatar-xl"
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
                                        project?.TeamMembers?.map(
                                          (id: any, idx: any) => {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    idx == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="circlecssnew img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
                                            );
                                          }
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                      {itemsToShow < Dataproject.length && (
                      <div className="col-12 text-center mb-5 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More
                        </button>
                      </div>
                    )}
                    </div>
                  ) : (
                    <p>Loading projects...</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "profile1" && (
              <div className="row mt-3">
                <div className="container">
                  {/* Map through the projects array and display a card for each */}
                  {Dataproject.length > 0 ? (
                    <div className="row">
                      {Dataproject.slice(0, itemsToShow).map((project, index) => {
                        if (project?.AuthorId == userId) {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                     <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => UpdatProject(project.Id)}
                                      >
                                        Closed Project
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a onClick={() => GotoNextPage(project)}

                                      className="text-dark fw-bold font-16"
                                    >
                                      {project.ProjectName}
                                    </a>
                                  </h4>

                                  <p className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                     
                                     <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} />  <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                    <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />
                                      <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>
                                  {/* Task info */}
                                  {/* <p className="mb-1 font-12">
                              <span
                                style={{ color: "#6e767e" }}
                                className="pe-2 text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-file-text text-muted"></i>
                                <b>{project.documentsCount || 0}</b> Documents
                              </span>
                              <span
                                style={{ color: "#6e767e" }}
                                className="text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-message-square text-muted"></i>
                                <b>{project. CommentsCount || 0}</b> Comments
                              </span>
                            </p> */}
                                  <div
                                    style={{
                                     
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="circlecssnew img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'
                                                  
                                            }}
                                            className="rounded-circlecss text-center img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                           float:"left"
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecss img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                           {itemsToShow < Dataproject.length && (
                      <div className="col-12 text-center mb-5 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More 
                        </button>
                      </div>
                    )}
                    </div>
                  ) : (
                    <p>Loading projects...</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "profile11" && (
              <div className="row mt-3">
                <div className="">
                  {/* Map through the projects array and display a card for each */}
                  {Dataproject.length > 0 ? (
                    <div className="row">
                      {Dataproject.slice(0, itemsToShow).map((project, index) => {
                        if (project?.TeamMembersId?.includes(userId)) {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                        <img className="morealign" src={require('../assets/more.png')} />
                                      {/* <i className="fe-more-horizontal- m-0 text-muted h3"></i> */}
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => UpdatProject(project.Id)}
                                      >
                                        Closed Project
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 circlecssnew">
                                    <a
                                      onClick={() => GotoNextPage(project)}
                                      className="text-dark fw-bold font-16"
                                    >
                                      {project.ProjectName ||
                                        "Untitled Project"}
                                    </a>
                                  </h4>

                                  <p className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                       <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} /> 
                                      <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                      
                                      <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />   <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>

                                  {/* Task info */}
                                  {/* <p className="mb-1 font-12">
                              <span
                                style={{ color: "#6e767e" }}
                                className="pe-2 text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-file-text text-muted"></i>
                                <b>{project.documentsCount || 0}</b> Documents
                              </span>
                              <span
                                style={{ color: "#6e767e" }}
                                className="text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-message-square text-muted"></i>
                                <b>{project. CommentsCount || 0}</b> Comments
                              </span>
                            </p> */}
                                  <div
                                    style={{
                                    
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecss img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left"
                                            }}
                                            className="rounded-circlecss img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                           float:"left"
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecss img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                      {itemsToShow < Dataproject.length && (
                      <div className="col-12 text-center mb-5 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More 
                        </button>
                      </div>
                    )}
                    </div>
                  ) : (
                    <p>Loading projects...</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "Ongoing" && (
              <div className="row mt-3">
                <div className="">
                  {/* Map through the projects array and display a card for each */}
                  {Dataproject.length > 0 ? (
                  
                    <div className="row">
                      {Dataproject.slice(0, itemsToShow).map((project, index) => {
                
                        if (project?.ProjectStatus === "Ongoing") {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a
                                      onClick={() => GotoNextPage(project)}
                                      className="text-dark fw-bold font-16"
                                    >
                                      {project.ProjectName ||
                                        "Untitled Project"}
                                    </a>
                                  </h4>

                                  

                                  <p className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                       <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} /> 
                                      <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                        <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />
                                      <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>

                                  {/* Task info */}
                                  {/* <p className="mb-1 font-12">
                              <span
                                style={{ color: "#6e767e" }}
                                className="pe-2 text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-file-text text-muted"></i>
                                <b>{project.documentsCount || 0}</b> Documents
                              </span>
                              <span
                                style={{ color: "#6e767e" }}
                                className="text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-message-square text-muted"></i>
                                <b>{project. CommentsCount || 0}</b> Comments
                              </span>
                            </p> */}
                                  <div
                                    style={{
                                    
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecss img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'
                                            }}
                                            className="rounded-circlecss img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                           float:"left"
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecss img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                      {itemsToShow < Dataproject?.length && (
                      <div className="col-12 text-center mb-5 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More 
                        </button>
                      </div>
                    )}
                    </div>
                  ) : (
                    <p>Loading projects...</p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "Close" && (
              <div className="row mt-3">
                <div className="">
                  {/* Map through the projects array and display a card for each */}
                  {Dataproject.length > 0 ? (
                    <div className="row">
                      {Dataproject.slice(0, itemsToShow).map((project, index) => {
                        if (project?.ProjectStatus === "Close") {
                          return (
                            <div key={index} className="col-lg-4 col-md-6 mb-0">
                              <div className="card project-box">
                                <div className="card-body">
                                  <div className="dropdown float-end">
                                    <a

                                      className="dropdown-toggle card-drop arrow-none"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                     <img className="morealign" src={require('../assets/more.png')} />
                                    </a>
                                    <div style={{padding:"0px", top:"15px", minWidth:"auto", textAlign:"center"}} className="dropdown-menu newheight dropdown-menu-end">
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => handleDelete(project.Id)}
                                      >
                                        Delete
                                      </a>
                                      <a
                                        className="dropdown-item font-12"

                                        onClick={() => GotoNextPage(project)}
                                      >
                                        View Detail
                                      </a>
                                    </div>
                                  </div>

                                  {/* Title */}
                                  <h4 className="mt-0 mb-1 two-line">
                                    <a
                                      onClick={() => GotoNextPage(project)}
                                      className="text-dark fw-bold font-16"
                                    >
                                      {project.ProjectName ||
                                        "Untitled Project"}
                                    </a>
                                  </h4>

                                  <p className="mb-1 font-12">
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="pe-2 text-nowrap mb-1 d-inline-block"
                                    >
                                     <img className="newimg1" src={require("../assets/projectdoc.png")} style={{ width: "12px" }} />
                                      <b>{project?.ProjectsDocsId?.length}</b> Documents
                                    </span>
                                    <span
                                      style={{ color: "#6e767e" }}
                                      className="text-nowrap mb-1 d-inline-block"
                                    >
                                       <img className="newimg2" src={require("../assets/comment.png")} style={{ width: "12px" }} />
                                      <b>{project. CommentsCount || 0}</b> Comments
                                    </span>
                                  </p>

                                  {/* Task info */}
                                  {/* <p className="mb-1 font-12">
                              <span
                                style={{ color: "#6e767e" }}
                                className="pe-2 text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-file-text text-muted"></i>
                                <b>{project.documentsCount || 0}</b> Documents
                              </span>
                              <span
                                style={{ color: "#6e767e" }}
                                className="text-nowrap mb-1 d-inline-block"
                              >
                                <i className="fe-message-square text-muted"></i>
                                <b>{project. CommentsCount || 0}</b> Comments
                              </span>
                            </p> */}
                                  <div
                                    style={{
                                    
                                      position: "relative"
                                    }}
                                  >
                                    <div style={{ display: 'flex' }} className="ml20">
                                      {project?.TeamMembers?.map(
                                        (id: any, idx: any) => {
                                          if (idx < 3) {
                                            return (
                                              <img
                                                style={{
                                                  margin:
                                                    index == 0
                                                      ? "0 0 0 0"
                                                      : "0 0 0px -12px",
                                                         float:"left"
                                                }}
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                className="rounded-circlecss img-thumbnail avatar-xl"
                                                alt="profile-image"
                                              />
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
                                                     float:"left",
                                                     display:'flex',
                                                     alignItems:'center',
                                                     justifyContent:'center'
                                            }}
                                            className="rounded-circlecss img-thumbnail avatar-xl"
                                          >
                                            +
                                          </div>
                                        </div>
                                      }
                                    </div>
                                    {showDropdownId === project.Id && (
                                      <div
                                        className=""
                                        style={{
                                          position: "absolute",
                                          zIndex: "99",
                                          background: "#fff",
                                          padding: "1rem",
                                          width: "30rem",
                                        }}
                                      >
                                        {showDropdownId === project.Id && (
                                          project?.TeamMembers?.map(
                                            (id: any, idx: any) => {
                                              return (
                                                <img
                                                  style={{
                                                    margin:
                                                      idx == 0
                                                        ? "0 0 0 0"
                                                        : "0 0 0px -12px",
                                                           float:"left"
                                                  }}
                                                  src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                                  className="rounded-circlecss img-thumbnail avatar-xl"
                                                  alt="profile-image"
                                                />
                                              );
                                            }
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                      {itemsToShow < Dataproject?.length && (
                      <div className="col-12 text-center mb-5 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More 
                        </button>
                      </div>
                    )}
                    </div>
                  ) : (
                    <p>Loading projects...</p>
                  )}
                </div>
               
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{height:'50px'}}></div>
    </div>

  );
};

const Projects = (props: any) => {
  return (
    <Provider>
      <HelloWorldContext props={props} />
    </Provider>
  );
};

export default Projects;
