import React, { useEffect, useState } from "react";
import { getSP } from "../loc/pnpjsConfig";
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
import "./corporate.scss";
import { SPFI } from "@pnp/sp/presets/all";
import { ICorporateDirectoryProps } from "./ICorporateDirectoryProps";
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
const CorporateDirectoryContext = ({ props }: any) => {
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
  const [followerCount, setFollowerCount] = React.useState(0); // State to track follower count
  const [unfollowerCount, setUnfollowerCount] = React.useState(0); // State to track unfollower count
  const [isLoading, setIsLoading] = useState(false);
  const siteUrl = props.siteUrl;

  const [filters, setFilters] = React.useState({
    Name: "",
    Email: "",
    EmployeeID: "",
    Department: "",
    MobilePhone: ""
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

  // const checkIfFollowing = async (item: any) => {
  //   try {
  //     const currentUser = await sp.web.currentUser();
  //     const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
  //       .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${item.ID}`)();

  //     setFollowStatus((prevStatus) => ({
  //       ...prevStatus,
  //       [item.ID]: followRecords.length > 0,
  //     }));
  //     const followersCount = await sp.web.lists.getByTitle("ARGFollows").items
  //     .filter(`FollowedId eq ${item.ID}`)
  //     .select("Id")
  //     .getAll();

  // const followingCount = await sp.web.lists.getByTitle("ARGFollows").items
  //     .filter(`FollowerId eq ${item.ID}`)
  //     .select("Id")
  //     .getAll();

  //     // Update the counts based on follow status
  //     if (followRecords.length > 0) {
  //       setFollowerCount((prev) => prev + 1);
  //     } else {
  //       setUnfollowerCount((prev) => prev + 1);
  //     }
  //   } catch (error) {
  //     console.error("Error checking follow status:", error);
  //   }
  // }
  // Media query to check if the screen width is less than 768px


  const checkIfFollowing = async (item: any) => {

    try {
      const currentUser = await sp.web.currentUser();
      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${item.ID} or FollowedId eq ${item.ID}`)();

      debugger
      console.log(followRecords);
      if (followRecords.length) {
        item.followstatus = true
      }
      else {
        item.followstatus = false
      }

      setFollowStatus((prevStatus: any) => ({

        [item.ID]: followRecords.length > 0 ? true : false,
      }));
      debugger
      const followersCount = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowedId eq ${item.ID}`)
        .select("Id")
        .getAll();

      const followingCount = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${item.ID}`)
        .select("Id")
        .getAll();
      item.followersCount = followersCount.length
      item.followingCount = followingCount.length
      const postData = await sp.web.lists.getByTitle("ARGSocialFeed").items
        .filter(`AuthorId eq ${item.ID}`)();
      if (postData.length > 0) {
        item.postCount = postData.length;
      }
      else {
        item.postCount = 0;
      }

      setFollowerCount(followersCount.length);
      setUnfollowerCount(followingCount.length);

    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const handleSidebarToggle = (bol: boolean) => {
    setIsSidebarOpen((prevState: any) => !prevState);
    setHide(!bol);
    document.querySelector(".sidebar")?.classList.toggle("close");
  };

  const fetchUserInformationList = async () => {
    try {

      const currentUser = await sp.web.currentUser();
      const userList = await sp.web.lists
        .getByTitle("User Information List")
        .items.select("*",
          "ID",
          "Title",
          "EMail",
          "Department",
          "JobTitle",
          "Picture", "MobilePhone"
        )
        .filter(`EMail ne null and ID ne ${currentUser.Id}`)();
      console.log(userList, "userList");

      userList.forEach(element => {
        checkIfFollowing(element);
      });
      setUsersArr(userList);

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
      ChildComponent: "Corporate Directory",
      ChildComponentURl: `${siteUrl}/SitePages/CorporateDirectory.aspx`,
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
        (filters.Name === "" ||
          item?.Title.toLowerCase().includes(filters.Name.toLowerCase())) &&
        (filters.Email === "" ||
          item?.EMail.toLowerCase().includes(filters.Email.toLowerCase())) &&
        (filters.MobilePhone === '' || item?.MobilePhone.toLowerCase().includes(filters.MobilePhone.toLowerCase()))
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

  const filteredEmployeeData = applyFiltersAndSorting(usersitem);

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
  const toggleDropdownNews = () => {
    setIsOpenNews(!isOpenNews);
  };
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

  // const follow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, itemId: number) => {
  //   e.preventDefault();
  //   try {
  //     const currentUser = await sp.web.currentUser();
  //     await sp.web.lists.getByTitle("ARGFollows").items.add({
  //       FollowerId: currentUser.Id,
  //       FollowedId: itemId
  //     });

  //     setFollowStatus((prevStatus) => ({
  //       ...prevStatus,
  //       [itemId]: true,
  //     }));

  //     // Increase follower count and decrease unfollower count
  //     setFollowerCount((prev) => prev + 1);
  //     setUnfollowerCount((prev) => Math.max(prev - 1, 0));
  //   } catch (error) {
  //     console.error("Error following:", error);
  //   }
  // };
  const follow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, itemId: number) => {
    e.preventDefault();

    // Start loading state
    setIsLoading(true);

    try {
      const currentUser = await sp.web.currentUser();
      // Add follow record
      await sp.web.lists.getByTitle("ARGFollows").items.add({
        FollowerId: currentUser.Id,
        FollowedId: itemId
      });

      // Optimistic UI update
      setFollowStatus((prevStatus: any) => ({
        ...prevStatus,
        [itemId]: true,
      }));
      setFollowerCount((prev) => prev + 1);
      setUnfollowerCount((prev) => Math.max(prev - 1, 0));
      fetchUserInformationList()
    } catch (error) {
      console.error("Error following:", error);
      // Show user feedback on error
      alert("Failed to follow. Please try again.");
    } finally {
      // End loading state
      setIsLoading(false);
    }
  };
  const unfollow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, itemId: number) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const currentUser = await sp.web.currentUser();
      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${itemId}`)();

      if (followRecords.length > 0) {
        await sp.web.lists.getByTitle("ARGFollows").items.getById(followRecords[0].Id).delete();

        setFollowStatus((prevStatus: any) => ({
          ...prevStatus,
          [itemId]: false,
        }));

        // Decrease follower count and increase unfollower count
        setFollowerCount((prev) => Math.max(prev - 1, 0));
        setUnfollowerCount((prev) => prev + 1);
        fetchUserInformationList()
      }
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
    finally {
      // End loading state
      setIsLoading(false);
    }
  };
  const toggleFollow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: any) => {
    e.preventDefault();


    try {
      const currentUser = await sp.web.currentUser();
      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${item.ID}`)();

      if (followRecords.length > 0) {
        // Unfollow logic
        await sp.web.lists.getByTitle("ARGFollows").items.getById(followRecords[0].Id).delete();

        item.followstatus=true
        // Update UI state
        // setFollowStatus((prevStatus: any) => ({
        //   ...prevStatus,
        //   [itemId]: false,
        // }));
        setFollowerCount((prev) => Math.max(prev - 1, 0));
        setUnfollowerCount((prev) => prev + 1);
        fetchUserInformationList()
      } else {
        // Follow logic
        await sp.web.lists.getByTitle("ARGFollows").items.add({
          FollowerId: currentUser.Id,
          FollowedId: item.ID
        });
        item.followstatus=true
        // Update UI state
        // setFollowStatus((prevStatus: any) => ({
        //   ...prevStatus,
        //   [itemId]: true,
        // }));
        setFollowerCount((prev) => prev + 1);
        setUnfollowerCount((prev) => Math.max(prev - 1, 0));
        fetchUserInformationList()

      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      alert("Failed to toggle follow status. Please try again.");
    } finally {
   
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
            marginTop: "1.5rem",
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

                    {/* <div className="me-sm-1">
                      <select
                        style={{ width: "150px" }}
                        className="form-select my-1 my-md-0"
                      >
                        <option value="Select Entity">Select Entity</option>
                        <option value="1">Entity 1</option>
                        <option value="2">Entity 2</option>
                      </select>
                    </div>

                    <div className="me-sm-1">
                      <select
                        style={{ width: "180px" }}
                        className="form-select my-1 my-md-0"
                      >
                        <option value="Select Department">
                          Select Department
                        </option>
                        <option value="1">Department 1</option>
                        <option value="2">Department 2</option>
                      </select>
                    </div> */}

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
                        <li className="nav-itemcss">
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
                        <li className="nav-itemcss">
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
                    {usersitem.map((item) => (
                      <div className="col-lg-4 col-md-6" key={item.Title}>
                        <div
                          style={{ border: "1px solid #54ade0" }}
                          className="text-center card mb-3"
                        >
                          <div className="card-body">
                            {/* Card Content */}
                            <div className="pt-2 pb-2">
                              <a style={{ position: "relative" }}>
                                <img
                                  src={require("../assets/calling.png")}
                                  className="alignright"
                                  onClick={() =>
                                    window.open(
                                      `https://teams.microsoft.com/l/call/0/0?users=${item.EMail}`,
                                      "_blank"
                                    )
                                  }
                                  alt="Call"
                                />
                                <img
                                  src={
                                    item.Picture != null
                                      ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item.EMail}`
                                      : require("../assets/users.jpg")
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
                                  <strong>
                                    {truncateText(item.Title, 15)}
                                  </strong>
                                </a>
                              </h4>

                              <p
                                className="text-muted"
                                style={{ fontSize: "14px" }}
                              >
                                <span data-tooltip={item.EMail}>
                                  {truncateText(item.EMail, 15)} |
                                </span>
                                <span
                                  className="pl-2"
                                  style={{ color: "pink" }}
                                >
                                  {/* <a className="text-pink" > */}
                                  {truncateText(
                                    item.Department != null
                                      ? item.Department
                                      : " NA ",
                                    10
                                  )}

                                  {/* </a> */}
                                </span>
                              </p>

                              <p
                                className="text-muted"
                                style={{ fontSize: "11px" }}
                              >
                                <span data-tooltip={item.WorkPhone}>
                                  {truncateText(item.WorkPhone != null
                                    ? item.WorkPhone
                                    : " NA ", 10)}
                                </span>

                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(
                                      "https://teams.microsoft.com",
                                      "_blank"
                                    )
                                  }
                                  className="btn btn-primary btn-sm waves-effect waves-light"
                                >
                                  Message
                                </button>

                                <div>
                            
                                  <button key={item.ID}
                                    type="button" className="btn btn-light btn-sm"
                                    onClick={(e) => toggleFollow(e, item)} disabled={isLoading}

                                  >
                                   
                                    {item?.followstatus ? "Unfollow" : "Follow"}
                                  </button>
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      {item.postCount > 0 ? item.postCount : 0} {/* {item.posts} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Post
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      {item.followersCount > 0 ? item.followersCount : 0}
                                      {/* {followerCount==0?followerCount:'NA'}  {item.followers} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followers
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >

                                      {item.followingCount > 0 ? item.followingCount : 0}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followings
                                    </p>
                                  </div>
                                </div>
                              </div>
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
                                            handleSortChange("Name")
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
                                            handleFilterChange(e, "Name")
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
                                            handleSortChange("EmployeeID")
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
                                            handleFilterChange(e, "EmployeeID")
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
                                            handleSortChange("Email")
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
                                            handleFilterChange(e, "Email")
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
                                            handleSortChange("Department")
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
                                            handleFilterChange(e, "Department")
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
                                        <span>Mobile Phone</span>{" "}
                                        <span
                                          onClick={() =>
                                            handleSortChange("MobilePhone")
                                          }
                                        >
                                          <FontAwesomeIcon icon={faSort} />{" "}
                                        </span>
                                      </div>
                                      <div className=" bd-highlight">
                                        {" "}
                                        <input
                                          type="text"
                                          placeholder="Filter by Mobile Phone"
                                          onChange={(e) =>
                                            handleFilterChange(e, "MobilePhone")
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
                                          <img
                                            src={require("../assets/calling.png")}
                                            alt="Connect"
                                            onClick={() =>
                                              window.open(
                                                `https://teams.microsoft.com/l/call/0/0?users=${item.EMail}`,
                                                "_blank"
                                              )
                                            }
                                          //  onClick={() =>
                                          //   window.open(
                                          //     "https://teams.microsoft.com",
                                          //     "_blank"
                                          //   )
                                          // }
                                          />
                                        </td>
                                        <td>{item.Title}</td>
                                        <td>{item.ID}</td>
                                        <td>{item.EMail}</td>

                                        <td>
                                          {item?.Department != null
                                            ? item?.Department
                                            : "NA"}
                                        </td>
                                        <td>
                                          {item?.WorkPhone != null
                                            ? item?.WorkPhone
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

const CorporateDirectory: React.FC<ICorporateDirectoryProps> = (props) => {
  return (
    <Provider>
      <CorporateDirectoryContext props={props} />
    </Provider>
  );
};

export default CorporateDirectory;
