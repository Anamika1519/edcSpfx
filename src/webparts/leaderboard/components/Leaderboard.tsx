import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import UserContext from "../../../GlobalContext/context";
import Provider from "../../../GlobalContext/provider";
import { useMediaQuery } from "react-responsive";
import context from "../../../GlobalContext/context";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import "./Leaderboard.scss";
import { SPFI } from "@pnp/sp/presets/all";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faFileExport,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "../../announcementmaster/components/announcementMaster.scss";
import "../../../CustomJSComponents/CustomTable/CustomTable.scss";
import { ILeaderboardProps } from './ILeaderboardProps';
import { getSP } from "../loc/pnpjsConfig";
import { getLeaderTop } from "../../../APISearvice/CustomService";
const LeaderboardContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const [usersitem, setUsersArr] = useState<any[]>([]);
  // const { useHide }: any = React.useContext(UserContext);
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { useHide }: any = React.useContext(UserContext);
  console.log("This function is called only once", useHide);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { setHide }: any = context;
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [sortConfig, setSortConfig] = React.useState({
    key: "",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = useState(false);
  const siteUrl = props.siteUrl;
  const [leaderboard, setLeaderboard] = useState([]);
  const [filters, setFilters] = React.useState({
    AuthorTitle: "",
    AuthorEMail: "",
    AuthorId: "",
    AuthorDepartment: ""
  });
 
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState<any>({}); // Track follow status for each user
 
  React.useEffect(() => {
 
    console.log("This function is called only once", useHide);
    fetchUserInformationList();
 
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
 
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };
 
  const fetchUserInformationList = async () => {
    try {
 
      setLeaderboard(await getLeaderTop(sp))
 
 
 
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
 
  const [activeTab, setActiveTab] = useState<
    "cardView" | "listView" | "calendarView"
  >("cardView");
 
  const handleTabChange = (tab: "cardView" | "listView" | "calendarView") => {
    setActiveTab(tab);
  };
 
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
 
  //#region Breadcrumb
  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Leaderboard",
      ChildComponentURl: `${siteUrl}/SitePages/Leaderboard.aspx`,
    },
  ];
  //#endregion
 
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFilters({
      ...filters,
      [field]: e.target.value,
    });
  };
 
  const handleSortChange = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
 
  const applyFiltersAndSorting = (data: any[]) => {
 
    // Filter data
    const filteredData = data.filter((item) => {
      return (
        (filters.AuthorTitle === "" ||
          item?.AuthorTitle.toLowerCase().includes(filters.AuthorTitle.toLowerCase())) &&
        (filters.AuthorEMail === "" ||
          item?.AuthorEMail.toLowerCase().includes(filters.AuthorEMail.toLowerCase())) &&
        (filters.AuthorDepartment === '' || item?.AuthorDepartment.toLowerCase().includes(filters.AuthorDepartment.toLowerCase()))
        // (filters.Department === '' || item?.Department.toLowerCase().includes(filters.Department.toLowerCase()))
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
 
  const filteredEmployeeData = applyFiltersAndSorting(leaderboard);
 
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredEmployeeData.length / itemsPerPage);
 
  const handlePageChange = (pageNumber: any) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredEmployeeData.slice(startIndex, endIndex);
  const [isOpenNews, setIsOpenNews] = React.useState(false);
 
  const handleNewsExportClick = () => {
    const exportData = currentData.map((item, index) => ({
      Name: item.Title,
      "Employee Id": item.ID,
      Email: item.EMail,
      Department: item?.Department != null ? item?.Department : "NA",
    }));
 
    exportToExcel(exportData, "Employe List");
  };
 
  const exportToExcel = (data: any[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
            marginTop: "0.2rem",
          }}
        >
          <div className="container-fluid  paddb">
            <div className="row">
              <div className="col-lg-5">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
 
              <div className="col-lg-7">
                <div className="d-flex flex-wrap align-items-center justify-content-end mt-3">
                  <form className="d-flex flex-wrap align-items-center justify-content-start">
                    <label htmlFor="searchInput" className="visually-hidden">
                      Search
                    </label>
                    <div className="me-1 position-relative">
                      <input
                        type="search"
                        className="form-control my-1 my-md-0"
                        id="searchInput"
                        placeholder="Search..."
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
 
 
                    <div
                      className="btn btn-secondary waves-effect waves-light"
                      data-bs-toggle="modal"
                      data-bs-target="#custom-modal"
                      onClick={handleNewsExportClick}
                    >
                      <FontAwesomeIcon icon={faFileExport} /> Export
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <div className="card mb-0 cardcsss">
                  <div className="card-body">
                    <div className="d-flex flex-wrap align-items-center justify-content-center">
                      <ul
                        className="navs nav-pillss navtab-bgs"
                        role="tablist"
                        style={{
                          gap: "5px",
                          display: "flex",
                          listStyle: "none",
                          marginBottom: "unset",
                        }}
                      >
                        <li className="nav-itemcss font-14">
                          <a
                            className={`nav-linkss ${activeTab === "cardView" ? "active" : ""
                              }`}
                            aria-selected={activeTab === "cardView"}
                            role="tab"
                            onClick={() => handleTabChange("cardView")}
                          >
                            Card View
                          </a>
                        </li>
                        <li className="nav-itemcss font-14">
                          <a
                            className={`nav-linkss ${activeTab === "listView" ? "active" : ""
                              }`}
                            aria-selected={activeTab === "listView"}
                            role="tab"
                            onClick={() => handleTabChange("listView")}
 
                          // onClick={() => handleTabChange("listView")}
                          // className={`nav-link ${
                          //   activeTab === "listView" ? "active" : ""
                          // }`}
                          >
                            List View
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mt-3">
                {activeTab === "cardView" && (
                  // Card View Content (only displayed when "cardView" is active)
                  <div className="row card-view">
                    {console.log("usersssitem", usersitem)}
                    {leaderboard.length > 0 && leaderboard.map((item, index) => (
                      <div className="col-lg-3 col-md-4" key={item.Id}>
                        <div
                          style={{ border: "1px solid #54ade0" }}
                          className="text-center card mb-3"
                        >
                          <div className="card-body">
                          <div className="product-price-tag positiont postion-absolute text-primary rounded-circle newc" title="Position">1</div>

                            {/* Card Content */}
                            <div className="pt-2 pb-2">
                              <a style={{ position: "relative" }}>
 
                                <img
                                  src={
 
                                    `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item.AuthorEMail}`
 
                                  }
                                  className="rounded-circlecss img-thumbnail
                                  avatar-xl"
                                  alt="profile-image"
                                  style={{ cursor: "pointer" }}
                                />
                              </a>
                              <h4 className="mt-2 mb-1">
                                <a
                                  className="text-dark font-16 fw-bold"
                                  style={{
                                    textDecoration: "unset",
                                    fontSize: "20px",
                                  }}
                                >
                               
                                    {truncateText(item.AuthorTitle, 25)}
                             
                                </a>
                              </h4>
 
                              <p
                                className="text-muted"
                                style={{ fontSize: "14px" }}
                              >
 
                                <span
                                  className="pl-2"
                                  style={{ color: "#1fb0e5" }}
                                >
                                  {/* <a className="text-pink" > */}
                                  {truncateText(
                                    item.AuthorDepartment != null
                                      ? item.AuthorDepartment
                                      : " NA ",
                                    10
                                  )}
 
                                  {/* </a> */}
                                </span>
                              </p>
                              <p style={{
                                display: 'flex',
                                justifyContent: 'center'
                              }}>
                                <a
                                  style={{ marginTop: "3px" }}
                                  href="javascript:void(0);"
                                  className="btn btn-sm btn-link text-muted ps-0 pe-0"
                                >
                                  {Array(item.Ratting)
                                    .fill(null)
                                    .map((_, index) => (
                                      <img
                                        key={index}
                                        src={require("../assets/nounachievement.png")}
                                        title="Badges"
                                        alt="badge"
                                        className="me-0 ipaddw"
                                      />
                                    ))}
                                </a>
                              </p>
                              <p style={{
                                display: 'flex',
                                justifyContent: 'center'
                              }}>
                                <span
                                  style={{
                                    padding: "5px",
                                    borderRadius: "4px",
                                    background: "#cce7dc",
                                    fontWeight: "600",
                                    color: "#008751",
                                  }}
                                  className=" font-12  float-end mt-2 mb-2"
                                >
                                  Points Earned {item.TotalPoints < 1000 ? item.TotalPoints : (item.TotalPoints / 1000).toFixed(1).replace(/\.0$/, '') + 'K'}
                                </span>
                              </p>
 
 
 
                              {/* end row */}
                            </div>
                            {/* end .padding */}
                          </div>
                        </div>
                        {/* end card */}
                      </div> // end col
                    ))}
                  </div>
                )}
 
                {activeTab === "listView" && (
                  // List View Content (only displayed when "listView" is active)
                  <div className="list-view">
                    <div className="card" style={{ height: "655px" }}>
                      <div className="card-body">
                        <div id="cardCollpase4" className="collapse show">
                          <div className="table-responsive pt-0">
                            <table
                              className="mtable table-centered table-nowrap table-borderless mb-0"
                              style={{ position: "relative" }}
                            >
                              <thead>
                                <tr>
                                  <th>
                                    Connect
                                    <div style={{ height: "47px" }}></div>
                                  </th>
                                  <th>
                                    <div className="d-flex flex-column bd-highlight ">
                                      <div
                                        className="d-flex pb-2"
                                        style={{
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {" "}
                                        <span>Name</span>{" "}
                                        <span
                                          onClick={() =>
                                            handleSortChange("AuthorTitle")
                                          }
                                        >
                                          <FontAwesomeIcon icon={faSort} />{" "}
                                        </span>
                                      </div>
                                      <div className=" bd-highlight">
                                        <input
                                          type="text"
                                          placeholder="Filter by Name"
                                          onChange={(e) =>
                                            handleFilterChange(e, "AuthorTitle")
                                          }
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
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {" "}
                                        <span>Employee ID</span>{" "}
                                        <span
                                          onClick={() =>
                                            handleSortChange("AuthorId")
                                          }
                                        >
                                          <FontAwesomeIcon icon={faSort} />{" "}
                                        </span>
                                      </div>
                                      <div className=" bd-highlight">
                                        {" "}
                                        <input
                                          type="text"
                                          placeholder="Filter by Employee ID"
                                          onChange={(e) =>
                                            handleFilterChange(e, "AuthorId")
                                          }
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
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {" "}
                                        <span>Email</span>{" "}
                                        <span
                                          onClick={() =>
                                            handleSortChange("AuthorEMail")
                                          }
                                        >
                                          <FontAwesomeIcon icon={faSort} />{" "}
                                        </span>
                                      </div>
                                      <div className=" bd-highlight">
                                        {" "}
                                        <input
                                          type="text"
                                          placeholder="Filter by Email"
                                          onChange={(e) =>
                                            handleFilterChange(e, "AuthorEMail")
                                          }
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
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        {" "}
                                        <span>Department</span>{" "}
                                        <span
                                          onClick={() =>
                                            handleSortChange("AuthorDepartment")
                                          }
                                        >
                                          <FontAwesomeIcon icon={faSort} />{" "}
                                        </span>
                                      </div>
                                      <div className=" bd-highlight">
                                        {" "}
                                        <input
                                          type="text"
                                          placeholder="Filter by Department"
                                          onChange={(e) =>
                                            handleFilterChange(e, "AuthorDepartment")
                                          }
                                          className="inputcss"
                                          style={{ width: "100%" }}
                                        />
                                      </div>
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
                                  currentData.map(
                                    (item: any, index: number) => (
                                      <tr key={index}>
                                        <td
                                          style={{
                                            minWidth: "50px",
                                            maxWidth: "50px",
                                          }}
                                        >
                                          {" "}
 
                                        </td>
                                        <td>{item.AuthorTitle}</td>
                                        <td>{item.Id}</td>
                                        <td>{item.AuthorEMail}</td>
 
                                        <td>
                                          {item?.AuthorDepartment != null
                                            ? item?.AuthorDepartment
                                            : "NA"}
                                        </td>
 
                                      </tr>
                                    )
                                  )
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
                                    onClick={() =>
                                      handlePageChange(currentPage - 1)
                                    }
                                    aria-label="Previous"
                                  >
                                    «
                                  </a>
                                </li>
                                {Array.from(
                                  { length: totalPages },
                                  (_, num) => (
                                    <li
                                      key={num}
                                      className={`page-item ${currentPage === num + 1 ? "active" : ""
                                        }`}
                                    >
                                      <a
                                        className="page-link"
                                        onClick={() =>
                                          handlePageChange(num + 1)
                                        }
                                      >
                                        {num + 1}
                                      </a>
                                    </li>
                                  )
                                )}
                                <li
                                  className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                    }`}
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
                          {/* .table-responsive */}
                        </div>{" "}
                        {/* end collapse */}
                      </div>{" "}
                      {/* end card-body */}
                    </div>{" "}
                    {/* end card */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
const Leaderboard: React.FC<ILeaderboardProps> = (props) => {
  return (
    <Provider>
      < LeaderboardContext props={props} />
    </Provider>
  );
};
 
export default Leaderboard;
 