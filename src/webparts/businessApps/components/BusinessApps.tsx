//import * as React from 'react';
//import styles from './ArgAutomation.module.scss';
import { IBusinessAppsProps } from './IBusinessAppsProps';
import { escape } from '@microsoft/sp-lodash-subset';
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
import "./BusinessApps.scss";
import { Dropdown } from "react-bootstrap";
// import "../../../APISearvice/MediaDetailsServies"
import { fetchAutomationDepartment, fetchARGAutomationdata } from "../../../APISearvice/BusinessAppsService";
//import { IMediagalleryProps } from "./IMediagalleryProps";
import { encryptId } from "../../../APISearvice/CryptoService";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { Image } from "react-feather";

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
        (category) => category.DepartmentName.toLowerCase() === activeTab
      );
      { console.log("filteredMediaItemsselectedCategory", filteredMediaItems, activeTab, selectedCategory, mediagallerydata) }
      if (selectedCategory) {
        // Filter items based on the selected category's ID
        const filteredItems = mediagallerydata.filter(
          (item) => item.ARGAutomationDepartmentId === selectedCategory.ID
        );
        setFilteredMediaItems(filteredItems);
      } else {
        // If no category matches, show no items
        setFilteredMediaItems([]);
      }
      { console.log("filteredMediaItemsafter", filteredMediaItems) }
    }
  }, [activeTab, mediagallerydata, mediagallerycategory]);

  const ApiCall = async () => {
    const CategoryArr = await fetchAutomationDepartment(sp);

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
                                (category.DepartmentName
                                  ? category.DepartmentName.toLowerCase()
                                  : "")
                                ? "active"
                                : ""
                                }`}
                              onClick={() =>
                                handleTabClick(category.DepartmentName.toLowerCase(), category.ID)

                              }
                            >
                              {category.DepartmentName || "Unknown Category"}
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
                                      (category.DepartmentName
                                        ? category.DepartmentName.toLowerCase()
                                        : "")
                                      ? "active"
                                      : ""
                                      }`}
                                    onClick={() =>
                                      handleTabClick(
                                        category.DepartmentName.toLowerCase(), category.ID

                                      )
                                    }
                                  >
                                    {category.DepartmentName ||
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

              {filteredMediaItems.map((item) => {
                const imageData = item.Image ? JSON.parse(item.Image) : null;
                const imageUrl = imageData
                  //? `${siteUrl}/SiteAssets/Lists/ea596702-57db-4833-8023-5dcd2bba46e3/${imageData.fileName}`
                  ? `${imageData.serverUrl}${imageData.serverRelativeUrl}`
                  : require("../assets/userimg.png");
                { console.log("imageData", imageData, imageUrl,item) } // Fallback if no image
                //const arrjson = item.MediaGalleryJSON ? JSON.parse(item.MediaGalleryJSON) : null
                return (
                  <div className="col-md-6 col-xl-3" >
                    <div className="widget-rounded-circle card" >
                      <div className="card-body" >
                        <div className="row" onClick={() => handleRedirect(item.RedirectionLink)}>
                          <div className="col-4">
                            <div style={{ background: '#fff',width:'45px',height:'45px' }}
                              className="avatar-lg d-flex justify-content-center align-items-center rounded-circle bg-soft-primary border-primary border">
                              <img style={{ width: '30px' }} src={imageUrl} />
                            </div>
                          </div>
                          <div className="col-8 d-flex justify-content-left align-items-center">
                            <div>

                              <p style={{ marginBottom: '0px' }}  className="text-dark mb-156 font-16 text-truncate mt90">{item.Title}</p>
                              <p className="text-muted mb-0 font-12 text-truncate mt90">{item.SubTitle}</p>
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
    </div>

  );
};

const BusinessApps: React.FC<IBusinessAppsProps> = (props) => (

  <Provider>
    <HelloWorldContext props={props} />
  </Provider>

)

export default BusinessApps;



