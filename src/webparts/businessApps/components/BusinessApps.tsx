//import * as React from 'react';
//import styles from './ArgAutomation.module.scss';
import { IBusinessAppsProps } from './IBusinessAppsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import React, { useEffect, useState } from "react";
import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../discussionForum/components/DiscussionForum.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import CustomCarousel from "../../../CustomJSComponents/carousel/CustomCarousel";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import FeatherIcon from "feather-icons-react";
import "./BusinessApps.scss";
import Swal from "sweetalert2";
import { Dropdown } from "react-bootstrap";
// import "../../../APISearvice/MediaDetailsServies"
import { fetchAutomationCategory, fetchARGAutomationdata, getCategory, addItem } from "../../../APISearvice/BusinessAppsService";
//import { IMediagalleryProps } from "./IMediagalleryProps";
import { encryptId } from "../../../APISearvice/CryptoService";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { Image } from "react-feather";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import ModalStructure, { ModalSize } from '../../../GlobalContext/ModalStructure';
let siteID: any;
let response: any;
const HelloWorldContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  // console.log(sp, "sp");
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  // console.log("This function is called only once", useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    // console.log("This function is called only once", useHide);

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

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mediagallerycategory, setAutomationDepartment] = useState<any[]>([]);
  const [mediagallerydata, setAutomationData] = useState<any[]>([]);
  const [filteredMediaItems, setFilteredMediaItems] = useState<any[]>([]);
  const [CategoryData, setCategoryData] = React.useState([]);
  const [ImagepostArr1, setImagepostArr1] = React.useState([]);
  const [ImagepostArr, setImagepostArr] = React.useState([]);
  const [thumbnailfile, setthumbnailfile] = React.useState<File>();
  const [showModal, setShowModal] = React.useState(false);
  const [showModalstr, setShowModalstr] = React.useState(false);
  const [AppNameErr, setAppNameErr] = useState("");
  const [CategoryErr, setCategoryErr] = useState("");
  const [ImageErr, setImageErr] = useState("");
  const [LinkErr, setLinkErr] = useState("");
  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(e.target.value);
  };

  const handleTabClick = (tab: string, Id: number) => {
    setActiveTab(tab.toLowerCase());
  };


  useEffect(() => {
    ApiCall();
  }, [])

  useEffect(() => {

    if (activeTab === "all") {
      setFilteredMediaItems(mediagallerydata);
    } else {
      // Find the selected category based on activeTab
      const selectedCategory = mediagallerycategory.find(
        (category) => category.CategoryName.toLowerCase() === activeTab
      );
      { console.log("filteredMediaItemsselectedCategory", filteredMediaItems, activeTab, selectedCategory, mediagallerydata) }
      if (selectedCategory) {
        // Filter items based on the selected category's ID
        const filteredItems = mediagallerydata.filter(
          (item) => item.CategoryId === selectedCategory.ID
        );
        setFilteredMediaItems(filteredItems);
      } else {
        // If no category matches, show no items
        setFilteredMediaItems([]);
      }
      { console.log("filteredMediaItemsafter", filteredMediaItems) }
    }
  }, [activeTab, mediagallerydata, mediagallerycategory]);
  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    redirectionlink: "",
    image: "",
    subtitle: "",
  });
  const validateForm = () => {
    debugger
    const { title, subtitle, image, redirectionlink, category } =
      formData;
    setAppNameErr("");
    setImageErr("");
    setLinkErr("");
    setCategoryErr("");
    //const { description } = richTextValues;
    let valid = true;
    if (!title) {
      setAppNameErr("Appname is required!")
      //Swal.fire("Error", "title is required!", "error");
      valid = false;
    } else if (ImagepostArr1.length == 0) {
      //Swal.fire("Error", "image is required!", "error");
      setImageErr("Image is required!")
      valid = false;
    }
    else if (!category) {
      //Swal.fire("Error", "Category is required!", "error");
      setCategoryErr("Category is required!")
      valid = false;
    } else if (!redirectionlink) {
      //Swal.fire("Error", "redirectionlink is required!", "error");
      setLinkErr("Redirection Link is required!")
      valid = false;
    }

    return valid;
  };
  const handleFormSubmit = async () => {
    debugger
    if (validateForm()) {
      let postPayload = {}
      const assets = await sp.web.lists.ensureSiteAssetsLibrary();
      const fileItem = await assets.rootFolder.files.addChunked(thumbnailfile.name, thumbnailfile, data => {
        console.log(`progress`, data);
      }, true);

      // bare minimum; probably you'll want other properties as well
      const img = {
        "serverRelativeUrl": fileItem.data.ServerRelativeUrl
      };
      postPayload = {
        Title: formData.title,
        SubTitle: formData.subtitle,
        Image: JSON.stringify(img),
        CategoryId: Number(formData.category),
        RedirectionLink: formData.redirectionlink,

      };


      const postResult = await addItem(postPayload, sp);
      const postId = postResult?.data?.ID;
      if (!postId) {
        console.error("Post creation failed.");
        return;
      }
      setTimeout(async () => {
        setFormData({
          title: "",
          category: "",
          redirectionlink: "",
          image: "",
          subtitle: "",
        });
        dismissModal()
      }, 2000);
      ApiCall()
    }
    // if (validateForm()) {
    //   Swal.fire({
    //     title: "Do you want to save?",
    //     showConfirmButton: true,
    //     showCancelButton: true,
    //     confirmButtonText: "Save",
    //     cancelButtonText: "Cancel",
    //     icon: "warning",
    //   }).then(async (result) => {

    //     if (result.isConfirmed) {

    //       let bannerImageArray: any = {};
    //       let galleryIds: any[] = [];
    //       let documentIds: any[] = [];
    //       let galleryArray: any[] = [];
    //       let documentArray: any[] = [];

    //       debugger;
    //       let postPayload = {}
    //       // Create Post


    //       //const file: File = evt.target.files[0];

    //       // upload to the root folder of site assets in this demo
    //       const assets = await sp.web.lists.ensureSiteAssetsLibrary();
    //       const fileItem = await assets.rootFolder.files.addChunked(thumbnailfile.name, thumbnailfile, data => {
    //         console.log(`progress`, data);
    //       }, true);

    //       // bare minimum; probably you'll want other properties as well
    //       const img = {
    //         "serverRelativeUrl": fileItem.data.ServerRelativeUrl,
    //       };
    //       postPayload = {
    //         Title: formData.title,
    //         SubTitle: formData.subtitle,
    //         Image: JSON.stringify(img),
    //         CategoryId: Number(formData.category),
    //         RedirectionLink: formData.redirectionlink,

    //       };


    //       const postResult = await addItem(postPayload, sp);
    //       const postId = postResult?.data?.ID;
    //       if (!postId) {
    //         console.error("Post creation failed.");
    //         return;
    //       }
    //       // Upload Gallery Images
    //       // if (ImagepostArr.length > 0) {
    //       //   for (const file of ImagepostArr[0]?.files) {
    //       //     const uploadedGalleryImage = await uploadFileToLibrary(
    //       //       file,
    //       //       sp,
    //       //       "DiscussionForumGallery"
    //       //     );
    //       //     galleryIds = galleryIds.concat(
    //       //       uploadedGalleryImage.map((item: { ID: any }) => item.ID)
    //       //     );
    //       //     galleryArray.push(uploadedGalleryImage);
    //       //   }
    //       // }

    //       setAutomationData(await fetchARGAutomationdata(sp));
    //       Swal.fire("Item Added successfully", "", "success");
    //       setTimeout(async () => {
    //         setFormData({
    //           title: "",
    //           category: "",
    //           redirectionlink: "",
    //           image: "",
    //           subtitle: "",
    //         });
    //         dismissModal()
    //       }, 2000);
    //     }
    //   });

    // }
  };
  const handleSearch: React.ChangeEventHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeTab != "all")
      setActiveTab("all");
    let txtSearch = (document.getElementById('searchInput') as HTMLInputElement).value;
    if (txtSearch.length > 1) {

      const filteredApps = mediagallerydata.filter((app: any) =>
        app.Title.toLowerCase().includes(txtSearch.toLowerCase())
      );

      setFilteredMediaItems(filteredApps);
    }

    else {
      ApiCall();
    }
  }
  const dismissModal = () => {
    setShowModal(false);
    setShowModalstr(false);
    // const modalElement = document.getElementById('discussionModal');
    // modalElement.classList.remove('show');
    // modalElement.style.display = 'none';
    // modalElement.setAttribute('aria-hidden', 'true');
    // modalElement.removeAttribute('aria-modal');
    // modalElement.removeAttribute('role');
    // const modalBackdrop = document.querySelector('.modal-backdrop');
    // if (modalBackdrop) {
    //   modalBackdrop.remove();
    // }
  };

  const ApiCall = async () => {
    let listTitle = 'ARGBusinessApps'
    let CurrentsiteID = props.context.pageContext.site.id;
    siteID = CurrentsiteID;
    response = await sp.web.lists.getByTitle(listTitle).select('Id')();
    const CategoryArr = await fetchAutomationCategory(sp);
    setShowModal(false)
    setCategoryData(CategoryArr);
    setAutomationDepartment(CategoryArr);
    const GalleryData = await fetchARGAutomationdata(sp);
    console.log("CategoryArrCategoryArr", CategoryArr, "GalleryData", GalleryData)
    setAutomationData(GalleryData)
  };

  const visibleCategories = mediagallerycategory.slice(0, 5);
  const overflowCategories = mediagallerycategory.slice(5);

  const siteUrl = props.siteUrl;

  const GotoNextPage = (item: any) => {
    console.log("item-->>>>", item)
    debugger
    window.location.href = item.Url;
    // const encryptedId = encryptId(String(item.ID));
    // sessionStorage.setItem("mediaId", encryptedId);
    // sessionStorage.setItem("dataID", item.Id)
    // window.location.href = `${siteUrl}/SitePages/Mediadetails.aspx`;
  };
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Business App",
      "ChildComponentURl": `${siteUrl}/SitePages/BusinessApps.aspx`
    }
  ]
  const handleRedirect = (link: any) => {
    console.log(link, "----link");
    window.location.href = link;
  };
  const onChange = async (name: string, value: string) => {

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,

    }));

    if (name == "Type") {
      setCategoryData(await getCategory(sp, Number(value))); // Category
    }

  };
  const setShowModalFunc = (bol: boolean, name: string) => {
    // setShowModal(bol);
    // setShowImgTable(true);

  };

  const showmodalstructure = (it: boolean) => {
    debugger
    setShowModalstr(it)
  }
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
      const thumbnailfile: File = event.target.files[0];
      setthumbnailfile(thumbnailfile);
      if (libraryName === "Gallery") {
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
          }
        } else {
          Swal.fire("only image can be uploaded");
        }
      }
    }
  };
  const Businessform = (
    <div className="modal-dialog modal-lg ">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            New Business App
          </h5>
        </div>
        <div className="modal-body">
          <form className="row">
            <div className="col-lg-4">
              <div className="mb-3">
                <label htmlFor="topic" className="form-label">
                  Application Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter App name"
                  className="form-control inputcss"

                  value={formData.title}
                  onChange={(e) =>
                    onChange(e.target.name, e.target.value)
                  }
                />
                <span style={{ color: "red" }}> {AppNameErr}</span>
              </div>
            </div>

            <div className="col-lg-4">
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
                <span style={{ color: "red" }}> {CategoryErr}</span>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <label
                      htmlFor="discussionGallery"
                      className="form-label"
                    >
                      Thumbnail{" "}
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
                      "SiteAssets"
                    )
                  }
                />
                <span style={{ color: "red" }}> {ImageErr}</span>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="mb-3">
                <label htmlFor="overview" className="form-label">
                  Redirection Link <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control inputcss"
                  id="redirectionlink"
                  placeholder="Enter Redirection link"
                  name="redirectionlink"
                  style={{ height: "90px" }}
                  value={formData.redirectionlink}
                  onChange={(e) =>
                    onChange(e.target.name, e.target.value)
                  }
                ></textarea>
                <span style={{ color: "red" }}> {LinkErr}</span>
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
  )
  return (
    <div id="wrapper" ref={elementRef}>
      <div
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '0rem' }}>
          <div className="container-fluid paddb">
            <div className="row">
              <div className="col-lg-7">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>
              <div className="col-lg-5">
                <div className="align-items-center justify-content-end mt-3">
                  <form className="align-items-center justify-content-start">
                    <label htmlFor="searchInput" className="visually-hidden">
                      Search
                    </label>
                    <div className="me-1 position-relative">
                      <input
                        type="search"
                        className="form-control my-1 my-md-0"
                        id="searchInput"
                        placeholder="Search by App Name..."
                        onChange={handleSearch}
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


                  </form>
                </div>
              </div>

            </div>
            <div className="row mt-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div  className="text-center filter-menu d-flex justify-content-center">
                          {/* Main tabs */}

                          <a
                            style={{ textDecoration: 'unset' }}
                            className={`filter-menu-item ${activeTab === "all" ? "active" : ""
                              }`}
                            onClick={() => handleTabClick("all", 0)}
                          >
                            All
                          </a>


                          {visibleCategories.map((category) => (

                            <a
                              key={category.ID}
                              style={{ textDecoration: 'unset' }}
                              className={`filter-menu-item ${activeTab ===
                                (category.CategoryName
                                  ? category.CategoryName.toLowerCase()
                                  : "")
                                ? "active"
                                : ""
                                }`}
                              onClick={() =>
                                handleTabClick(category.CategoryName.toLowerCase(), category.ID)

                              }
                            >
                              {category.CategoryName || "Unknown Category"}
                            </a>

                          ))}

                          {/* Dropdown for extra tabs */}
                          {overflowCategories.length > 0 && (
                            <Dropdown className="filter-menu-item">
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                className="filter-menu-item btsxx" style={{ background: '#fff' }}
                              >
                                More
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="filter-menu-item">
                                {overflowCategories.map((category) => (
                                  <Dropdown.Item
                                    key={category.ID}

                                    className={`filter-menu-item ${activeTab ===
                                      (category.CategoryName
                                        ? category.CategoryName.toLowerCase()
                                        : "")
                                      ? "active"
                                      : ""
                                      }`}
                                    onClick={() =>
                                      handleTabClick(
                                        category.CategoryName.toLowerCase(), category.ID

                                      )
                                    }
                                  >
                                    {category.CategoryName ||
                                      "Unknown Category"}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row   filterable-content ">
              {filteredMediaItems.length == 0 &&
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>

                  <p className="font-14 text-muted text-center">No Business App found </p>

                </div>
              }
              {filteredMediaItems.map((item) => {
                const imageData = item.Image ? JSON.parse(item.Image) : null;
                let siteIdAl = '338f2337-8cbb-4cd1-bed1-593e9336cd0e,e2837b3f-b207-41eb-940b-71c74da3d214';
                let listIDAl = '8dcfeaca-69f6-484b-b1aa-a31085726174';
                let listIDUAT = 'c291ee97-e81e-40d3-8735-6b169303831e';
                let siteIDUAT = '9237fda3-7d32-4ee0-abca-1268fc460cfc';
                //let siteId = siteUrl.toLowerCase().includes('alrostmani') ? siteIdAl : '02993535-33e8-44d1-9edf-0d484e642ea1,d9374a3d-ae79-4d2a-8d36-d48f86e3201e';
                //let listID = siteUrl.toLowerCase().includes('alrostmani') ? listIDAl : '729bbd2a-ade1-448b-be41-d9ea695e7407';
                let siteId = siteID;
                let listID = response.Id;
                let img1 = imageData && imageData.fileName ? `${siteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize` : ""
<<<<<<< HEAD
                let img = imageData && imageData.serverRelativeUrl ? `https://officeindia.sharepoint.com${imageData.serverRelativeUrl}` : img1
=======
                let img = imageData && imageData.serverRelativeUrl ? `https://alrostamanigroupae.sharepoint.com${imageData.serverRelativeUrl}` : img1
>>>>>>> c29a133774f0b44995c1a43744c9ec2d240513e5
                const imageUrl = imageData
                  //? `${siteUrl}/SiteAssets/Lists/ea596702-57db-4833-8023-5dcd2bba46e3/${imageData.fileName}`
                  //? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                  ? img
                  : require("../assets/userimg.png");
                { console.log("imageData", imageData, imageUrl, item, siteUrl, img) }
                // const imageUrl = imageData
                //   //? `${siteUrl}/SiteAssets/Lists/ea596702-57db-4833-8023-5dcd2bba46e3/${imageData.fileName}`
                //   ? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                //   : require("../assets/userimg.png");
                // { console.log("imageData", imageData, imageUrl,item) } // Fallback if no image
                //const arrjson = item.MediaGalleryJSON ? JSON.parse(item.MediaGalleryJSON) : null
                return (
                  <div className="col-md-6 col-xl-3" >
                    <div className="widget-rounded-circle card hri90" >
                      <div className="card-body" >
                      <div style={{ cursor: 'pointer' }} className="row">
                          <div className="col-3 newim">
                          <a href="javascript:void(0);" target="_blank" onClick={() => handleRedirect(item.RedirectionLink)}>  <div style={{ background: '#fff', width: '45px', height: '45px' }}
                              className="avatar-lg d-flex justify-content-center align-items-center rounded-circle bg-soft-primary border-primary border">
                              <img style={{ width: '25px', marginTop: '1px' }} src={imageUrl} />
                            </div> </a>
                          </div>
                          <div className="col-9 newim2 d-flex justify-content-left align-items-center">
                            <div>

                            <a href="javascript:void(0);" target="_blank" onClick={() => handleRedirect(item.RedirectionLink)}> <p style={{ marginBottom: '5px' }} className="text-dark twolinewrap mb-156 linr56 font-16 hovertext  mt90">{item.Title}</p></a>
                              <p className="text-muted mb-0 font-12 twolinewrap  mt90">{item.SubTitle}</p>
                            </div> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {console.log("showmodalhj", showModalstr)}

      <ModalStructure
        isModalOpen={showModalstr}
        modalTitle={"Add New Business"}
        modalHeader={""}
        modalBody={Businessform}
        modalSize={ModalSize.Medium}
        cancelAction={(refresh?: boolean) => dismissModal()}
        customModalClass='modalbackgroundcolor'
      ></ModalStructure>

    </div>

  );
};

const BusinessApps: React.FC<IBusinessAppsProps> = (props) => (

  <Provider>
    <HelloWorldContext props={props} />

  </Provider>

)

export default BusinessApps;



