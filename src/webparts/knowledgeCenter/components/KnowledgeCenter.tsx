import React, { useEffect, useState } from "react";
import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import CustomCarousel from "../../../CustomJSComponents/carousel/CustomCarousel";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import FeatherIcon from "feather-icons-react";
import "./KnowledgeCenter.scss";
import { Dropdown } from "react-bootstrap";
// import "../../../APISearvice/MediaDetailsServies"
import { fetchKnowledgeCentercategory, fetchARGKnowledgeCenterdata } from "../../../APISearvice/MediaDetailsServies";
import { IKnowledgeCenterProps } from "./IKnowledgeCenterProps";
import { encryptId } from "../../../APISearvice/CryptoService";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { Image } from "react-feather";
import Multiselect from 'multiselect-react-dropdown';
import { WorkflowAction } from '../../../CustomJSComponents/WorkflowAction/WorkflowAction';
import { getUrlParameterValue } from '../../../Shared/Helper';
import { FormSubmissionMode } from '../../../Shared/Interfaces';
import { WorkflowAuditHistory } from '../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory';
import { CONTENTTYPE_Media, LIST_TITLE_MediaGallery, LIST_TITLE_EventMaster } from '../../../Shared/Constants';
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
  const [ApprovalMode, setApprovalMode] = React.useState(false);
  const [ApprovalRequestItem, setApprovalRequestItem] = React.useState(null);
  const [InputDisabled, setInputDisabled] = React.useState(false);
  const [ValidDraft, setValidDraft] = React.useState(true);
  const [ValidSubmit, setValidSubmit] = React.useState(true);
  const [loading, setLoading] = useState(true);

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
  const [mediagallerycategory, setMediaGalleryCategory] = useState<any[]>([]);
  const [knowledgecenterdata, setKnowledgeCenterData] = useState<any[]>([]);
  const [filteredMediaItems, setFilteredMediaItems] = useState<any[]>([]);

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
      setFilteredMediaItems(knowledgecenterdata);
      setLoading(false);
    } else {
      // Find the selected category based on activeTab
      const selectedCategory = mediagallerycategory.find(
        (category) => category.CategoryName.toLowerCase() === activeTab
      );

      if (selectedCategory) {
        // Filter items based on the selected category's ID
        const filteredItems = knowledgecenterdata.filter(
          (item) => item.MediaGalleryCategoryId === selectedCategory.ID
        );
        setFilteredMediaItems(filteredItems);

      } else {
        // If no category matches, show no items
        setFilteredMediaItems([]);

      }
      setLoading(false);
    }
  }, [activeTab, knowledgecenterdata, mediagallerycategory]);

  const ApiCall = async () => {
    let listTitle = 'ARGKnowledgeCenter'
    let CurrentsiteID = props.context.pageContext.site.id;
    siteID = CurrentsiteID;
    response = await sp.web.lists.getByTitle(listTitle).select('Id')();
    const CategoryArr = await fetchKnowledgeCentercategory(sp);
    setMediaGalleryCategory(CategoryArr);
    const GalleryData = await fetchARGKnowledgeCenterdata(sp);
    setKnowledgeCenterData(GalleryData)
  };

  const visibleCategories = mediagallerycategory.slice(0, 5);
  const overflowCategories = mediagallerycategory.slice(5);

  const siteUrl = props.siteUrl;

  const GotoNextPage = (item: any) => {
    // console.log("item-->>>>",item)
    const encryptedId = encryptId(String(item.ID));
    sessionStorage.setItem("mediaId", encryptedId);
    sessionStorage.setItem("dataID", item.Id)
    window.location.href = `${siteUrl}/SitePages/Mediadetails.aspx?${item.Id}`;
  };
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "Knowledge Center",
      "ChildComponentURl": `${siteUrl}/SitePages/KnowledgeCenter.aspx`
    }
  ]
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
              <div className="col-lg-4">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>
              {/* <div className="col-lg-8">
                  <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                    <form className="d-flex align-items-center justify-content-start">
                      <input
                        type="search"
                        className="form-control my-1 my-md-0"
                        id="searchInput"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </form>
                  </div>
                </div> */}
            </div>

            <div className="row mt-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="text-center filter-menu d-flex justify-content-center">
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
                                <span className="me-2">More</span> <div className="icont"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
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
            {!loading && filteredMediaItems.length == 0 &&
              <div className='row mt-0'>
                <div style={{ height: '300px' }} className="card card-body align-items-center  annusvg text-center"
                >

                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>

                  <p className="font-14 text-muted text-center">No Media Available </p>

                </div>
              </div>
            }
            <div className="row filterable-content ">
              {loading && (
                <div className="loadernewadd">
                  <div>
                    <img style={{ width: '60px' }}
                      src={require("../../../CustomAsset/birdloader.gif")}
                      className="alignrightl"
                      alt="Loading..."
                    />
                  </div>
                  <div className="loadnewarg">
                    <span>Loading </span>{" "}
                    <span>
                      <img style={{ width: '35px' }}
                        src={require("../../../CustomAsset/argloader.gif")}
                        className="alignrightbird"
                        alt="Loading..."
                      />
                    </span>
                  </div>
                </div>
              )}

              {!loading && filteredMediaItems.length > 0 && (
                filteredMediaItems.map((item) => {
                  const imageData = item.Image ? JSON.parse(item.Image) : null;
                  let siteId = siteID;
                let listID = response.Id;
                let img1 = imageData && imageData.fileName ? `${siteUrl}/_api/v2.1/sites('${siteId}')/lists('${listID}')/items('${item.ID}')/attachments('${imageData.fileName}')/thumbnails/0/c400x400/content?prefer=noredirect%2Cclosestavailablesize` : ""
                let img = imageData && imageData.serverRelativeUrl ? `https://officeIndia.sharepoint.com${imageData.serverRelativeUrl}` : img1
                const imageUrl = imageData
                  //? `${siteUrl}/SiteAssets/Lists/ea596702-57db-4833-8023-5dcd2bba46e3/${imageData.fileName}`
                  //? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                  ? img
                  : require("../assets/userimg.png");
                  // const imageUrl = imageData
                  //   ? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                  //   : require("../../../Assets/ExtraImage/userimg.png"); // Fallback if no image
                  const arrjson = item.MediaGalleryJSON ? JSON.parse(item.MediaGalleryJSON) : null
                  return (
                    <div
                      key={item.ID}
                      className="col-sm-6 col-xl-3 filter-item all web illustrator "
                    >
                      <div className="gal-box" onClick={() => GotoNextPage(item)} style={{ background: '#fff' }}>
                        <a

                          className="image-popup" style={{}}
                          title={`Screenshot of ${item.Title || "Untitled"}`}
                        >
                          <img
                            // src={
                            //   item.Image && item.Image.serverRelativeUrl
                            //     ? item.Image.serverRelativeUrl
                            //     : require("../../../Assets/ExtraImage/userimg.png") // Default image
                            // }
                            src={imageUrl}
                            className="img-fluid"
                            alt={item.Title || "Untitled"}
                          />
                        </a>
                        <div className="gall-info">
                          <h4 className="font-16 twolinewrap hovertext mb-0 text-dark fw-bold mt-0">
                            {item.Title || "Untitled"}
                          </h4>
                          <div className="mb-1 mt-1 row">
                            <span className="font-14" style={{ borderRadius: "4px", color: '#1fb0e5', fontWeight: '600' }}>
                              {item.MediaGalleryCategory?.CategoryName}
                            </span>
                          </div>
                          {/* <a href="#">
                            <span className="text-muted font-14 mt-2 ms-0">
                             <Image size={15} />&nbsp;{arrjson?.length} &nbsp; Photos
                            </span>
                          </a> */}
                          <div className=" row">
                            <a
                            // href="media-internal.html"
                            >
                              <div
                                style={{
                                  height: "35px",
                                  lineHeight: "20px",
                                }}
                                className="btn btn-primary w-100 rounded-pill font-14 mt-2" onClick={() => GotoNextPage(item)}
                              >
                                View Album
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

const KnowledgeCenter: React.FC<IKnowledgeCenterProps> = (props) => (

  <Provider>
    <HelloWorldContext props={props} />
  </Provider>

)

export default KnowledgeCenter;
