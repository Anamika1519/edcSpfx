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
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { toLower } from "lodash";
import Swal from "sweetalert2";

export interface IUserItem {
  displayName: string;
  mail: string;
  userPrincipalName: string;
  jobTitle: string;
  mobilePhone: string;
  companyName: string;
}
const sortArray = (array: any[], compareFn: any) => {

  const length = array.length;



  for (let i = 0; i < length - 1; i++) {

    for (let j = 0; j < length - i - 1; j++) {

      // Use the provided compare function

      if (compareFn(array[j], array[j + 1]) > 0) {

        // Swap elements

        [array[j], array[j + 1]] = [array[j + 1], array[j]];

      }

    }

  }



  return array;

}



const CorporateDirectoryContext = ({ props }: any) => {



  console.log("props 1", props);

  const sp: SPFI = getSP();

  console.log(sp, "sp");

  const [usersitem, setUsersArr] = useState<any[]>([]);
  const [usersitemcopy, setUsersitemcopy] = useState<any[]>([]);
  // const { useHide }: any = React.useContext(UserContext);

  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const { useHide }: any = React.useContext(UserContext);

  console.log("This function is called only once", useHide);

  const elementRef = React.useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { setHide }: any = context;

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [ShowPin, setShowPin] = React.useState(false);

  const [sortConfig, setSortConfig] = React.useState({

    key: "",

    direction: "ascending",

  });

  const [followerCount, setFollowerCount] = React.useState(0); // State to track follower count

  const [unfollowerCount, setUnfollowerCount] = React.useState(0); // State to track unfollower count

  const [isLoading, setIsLoading] = useState(false);

  const siteUrl = props.siteUrl;
  const [itemsToShow, setItemsToShow] = useState(8); // Initial number of items to show

  const [filters, setFilters] = React.useState({

    Name: "",

    Email: "",

    EmployeeID: "",

    Department: "",

    MobilePhone: "",

    companyName: ""

  });

  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});

  const [followStatus, setFollowStatus] = useState<Record<number, boolean>>({}); // Track follow status for each user

  const [pinStatus, setPinStatus] = useState<Record<number, boolean>>({}); // Track follow status for each user



  const [isFollowing, setIsFollowing] = useState(false); // Track follow status for each user


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


  // const fetchUserInformationList = async () => {

  //   try {


  //     const currentUser = await sp.web.currentUser();

  //     const userList = await sp.web.lists

  //       .getByTitle("User Information List")

  //       .items.select("*",

  //         "ID",

  //         "Title",

  //         "EMail",

  //         "Department",

  //         "JobTitle",

  //         "Picture", "MobilePhone"

  //       )

  //       .filter(`EMail ne null and ID ne ${currentUser.Id}`)();

  //     const initialLoadingStatus: Record<number, boolean> = {};


  //     // userList.forEach((user) => {

  //     //   initialFollowStatus[user.ID] = false;  // default follow status

  //     //   initialLoadingStatus[user.ID] = false; // default loading status

  //     //   checkIfFollowing(user); // Fetch the follow status for each user

  //     // });

  //     const initialFollowStatus: Record<number, boolean> = {};


  //     for (const user of userList) {

  //       const followRecords = await sp.web.lists.getByTitle("ARGFollows").items

  //         .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${user.ID}`)

  //         ();


  //       // If followRecords exists, set follow status as true for this user

  //       initialFollowStatus[user.ID] = followRecords.length > 0;

  //       const followersCount = await sp.web.lists.getByTitle("ARGFollows").items

  //         .filter(`FollowedId eq ${user.ID}`)

  //         .select("Id")

  //         .getAll();


  //       const followingCount = await sp.web.lists.getByTitle("ARGFollows").items

  //         .filter(`FollowerId eq ${user.ID}`)

  //         .select("Id")

  //         .getAll();

  //       user.followersCount = followersCount.length

  //       user.followingCount = followingCount.length

  //       const postData = await sp.web.lists.getByTitle("ARGSocialFeed").items

  //         .filter(`AuthorId eq ${user.ID}`)();

  //       if (postData.length > 0) {

  //         user.postCount = postData.length;

  //       }

  //       else {

  //         user.postCount = 0;

  //       }


  //       setFollowerCount(followersCount.length);

  //       setUnfollowerCount(followingCount.length);

  //     }


  //     setFollowStatus(initialFollowStatus);

  //     setFollowStatus(initialFollowStatus);


  //     setLoadingUsers(initialLoadingStatus);

  //     setUsersArr(userList);


  //   } catch (error) {

  //     console.error("Error fetching users:", error);

  //   }

  // };



  const fetchUserInformationList = async () => {

    try {

      const currentUser = await sp.web.currentUser();



      // Fetch the user list, excluding the current user

      const userListSP = await sp.web.lists

        .getByTitle("User Information List")
        .items
        .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
        .filter(`EMail ne null and ID ne ${currentUser.Id}`)

        ();

      console.log("userList", userListSP);
      // let currentWPContext:WebPartContext=props.props.context;  
      let currentWPContext: WebPartContext = props.context;
      // console.log("props",props);
      const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');
      const m265userList = await msgraphClient.api("users")
        .version("v1.0")
        .select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName")
        .get();
      // console.log("m265userList",m265userList);

      //Adding dummy companies to users for testing
      //m265userList.value=m265userList.value.map((m:any)=>{let x=m; x['companyName']='dunnycommpany'; return x;});

      let userList: any[] = [];

      userList = userListSP.map(usr => {
        let musrs = m265userList.value.filter((usr1: any) => { return toLower(usr1.mail) == toLower(usr.EMail) });
        if (musrs.length > 0) {
          usr['companyName'] = musrs[0]['companyName'];
        }
        else usr['companyName'] = 'NA';
        return usr;
      })

      //sort by title

      userList = sortArray(userList, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()))


      const initialLoadingStatus: Record<number, boolean> = {};

      const initialFollowStatus: Record<number, boolean> = {};

      const initialPinStatus: Record<number, boolean> = {};



      // Function to fetch follow status and post count for each user

      const fetchUserDetails = async (user: any) => {

        const followRecords = await sp.web.lists.getByTitle("ARGFollows").items

          .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${user.ID}`)

          .getAll();

        const pinRecords = await sp.web.lists.getByTitle("ARGPinned").items

          .filter(`PinnedById eq ${currentUser.Id} and PinnedId eq ${user.ID}`)

          .getAll();

        const MyPinnedCount = await sp.web.lists.getByTitle("ARGPinned").items

          .filter(`PinnedById eq ${currentUser.Id}`)

          .getAll();

        console.log("MyPinnedCount", MyPinnedCount.length);
        if (MyPinnedCount.length >= 4) {
          setShowPin(true)
        } else {
          setShowPin(false)
        }

        initialFollowStatus[user.ID] = followRecords.length > 0;

        initialPinStatus[user.ID] = pinRecords.length > 0;

        const followersCount = await sp.web.lists.getByTitle("ARGFollows").items

          .filter(`FollowedId eq ${user.ID}`)

          .select("Id")

          .getAll();



        const followingCount = await sp.web.lists.getByTitle("ARGFollows").items

          .filter(`FollowerId eq ${user.ID}`)

          .select("Id")

          .getAll();



        user.followersCount = followersCount.length;

        user.followingCount = followingCount.length;



        const postData = await sp.web.lists.getByTitle("ARGSocialFeed").items

          .filter(`AuthorId eq ${user.ID}`)

          .getAll();



        user.postCount = postData.length > 0 ? postData.length : 0;

      };



      // Fetch details for each user in parallel

      const userDetailsPromises = userList.map(async (user) => {

        initialLoadingStatus[user.ID] = true;  // Set loading to true initially

        await fetchUserDetails(user);  // Fetch the user details (follow status and posts)

        initialLoadingStatus[user.ID] = false;  // Set loading to false after fetch

      });



      // Wait for all user details to be fetched

      await Promise.all(userDetailsPromises);



      // Update the state with the fetched data

      setFollowStatus(initialFollowStatus);

      setPinStatus(initialPinStatus);

      setLoadingUsers(initialLoadingStatus);

      setUsersArr(userList);
      setUsersitemcopy(userList);


    } catch (error) {

      console.error("Error fetching users:", error);

    }

  };


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

  const handleUserClick = (userID: any, currentStatus: any) => {
    console.log("currentStatus", currentStatus)

    sessionStorage.setItem("selectedUserID", userID);
    sessionStorage.setItem("currentStatus", currentStatus);
    window.location.href = `${siteUrl}/SitePages/Userprofile.aspx?${userID}`;
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
        (filters.MobilePhone === '' || item?.MobilePhone.toLowerCase().includes(filters.MobilePhone.toLowerCase())) &&

        (filters.companyName === '' || ((item?.companyName) ? item?.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) : false))

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
      WorkPhone: item?.WorkPhone,
      Entity: item?.companyName != null ? item?.companyName : "NA",

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
  const handleSearch: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

    let txtSearch = (document.getElementById('searchInput') as HTMLInputElement).value;
    let filteredusers = usersitemcopy.filter(usr => {
      return usr.Title.toLowerCase().includes(txtSearch) ||
        usr.EMail.toLowerCase().includes(txtSearch) ||
        usr.Name.toLowerCase().includes(txtSearch) ||
        ((usr.Department) ? usr.Department.toLowerCase().includes(txtSearch) : false) ||
        ((usr.companyName) ? usr.companyName.toLowerCase().includes(txtSearch) : false)
    });

    setUsersArr(filteredusers);


  }

  const toggleFollow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: any) => {

    e.preventDefault();

    setLoadingUsers((prev) => ({ ...prev, [item.ID]: true })); // Set loading state for the specific user


    try {

      const currentUser = await sp.web.currentUser();

      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items

        .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${item.ID}`)();


      if (followRecords.length > 0) {

        // Unfollow logic

        await sp.web.lists.getByTitle("ARGFollows").items.getById(followRecords[0].Id).delete();

        setFollowStatus((prev) => ({ ...prev, [item.ID]: false })); // Update follow status

      } else {

        // Follow logic

        await sp.web.lists.getByTitle("ARGFollows").items.add({

          FollowerId: currentUser.Id,

          FollowedId: item.ID

        });

        setFollowStatus((prev) => ({ ...prev, [item.ID]: true })); // Update follow status

      }

    } catch (error) {

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user


      console.error("Error toggling follow status:", error);

      alert("Failed to toggle follow status. Please try again.");

    } finally {

      fetchUserInformationList()

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user



    }

  };


  const togglePin = async (e: any, item: any) => {
 
    debugger
 
    e.preventDefault();
 
    setLoadingUsers((prev) => ({ ...prev, [item.ID]: true })); // Set loading state for the specific user
 
 
    try {
 
      const currentUser = await sp.web.currentUser();
 
      const pinRecords = await sp.web.lists.getByTitle("ARGPinned").items
 
        .filter(`PinnedById eq ${currentUser.Id} and PinnedId eq ${item.ID}`)();
 
      const MyPinnedCount = await sp.web.lists.getByTitle("ARGPinned").items
 
        .filter(`PinnedById eq ${currentUser.Id}`)
 
        .getAll();
 
      console.log("MyPinnedCount", MyPinnedCount.length);
 
 
      if (pinRecords.length > 0) {
 
        // Unpin logic
 
        await sp.web.lists.getByTitle("ARGPinned").items.getById(pinRecords[0].Id).delete();
 
        setPinStatus((prev) => ({ ...prev, [item.ID]: false })); // Update [pin] status
 
      } else {
        if (MyPinnedCount.length >= 4) {
          Swal.fire("You’ve hit the limit for pinning users to the Home Screen!")
        } else {
          await sp.web.lists.getByTitle("ARGPinned").items.add({
 
            PinnedById: currentUser.Id,
 
            PinnedId: item.ID
 
          });
        }
        // pin logic
 
 
 
        setPinStatus((prev) => ({ ...prev, [item.ID]: true })); // Update pin status
 
      }
 
 
    } catch (error) {
 
      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user
 
 
      console.error("Error toggling pin status:", error);
 
      alert("Failed to toggle pin status. Please try again.");
 
    } finally {
 
      fetchUserInformationList()
 
      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user
 
 
 
    }
 
  }

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

                        placeholder="Search by name..."
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

            <div className="row corporate-directory">

              <div className="mt-3">

                {activeTab === "cardView" && (

                  // Card View Content (only displayed when "cardView" is active)

                  <div className="row card-view">

                    {console.log("usersssitem", usersitem, followStatus, pinStatus)}

                    {usersitem.slice(0, itemsToShow).map((item) => (

                      <div className="col-lg-3 col-md-4" key={item.Title}>

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

                              <p>

                                <img style={{ cursor: "pointer" }}

                                  src={pinStatus[item.ID] ? require("../assets/noun-pin-7368310.png") : require("../assets/unpin.png")}

                                  className="alignrightpin"

                                  onClick={(e) => togglePin(e, item)}


                                  alt="pin"

                                />



                              </p>

                              <h4 className="mt-2 mb-1">

                                <a onClick={() => handleUserClick(item.ID, followStatus[item.ID])}

                                  className="text-dark font-16 fw-bold"

                                  style={{

                                    textDecoration: "unset",

                                    fontSize: "20px",

                                  }}

                                >



                                  {truncateText(item.Title, 15)}



                                </a>

                              </h4>


                              <p

                                className="text-muted"

                                style={{ fontSize: "14px" }}

                              >

                                <span data-tooltip={item.EMail}>

                                  {truncateText(item.EMail, 15)} | &nbsp;

                                </span>

                                <span

                                  className="pl-2"

                                  style={{ color: "#1fb0e5" }}

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

                                <span data-tooltip={item.companyName}>

                                  {/* {truncateText(item.WorkPhone != null

                                    ? item.WorkPhone

                                    : " NA ", 10)} */}
                                  {
                                    // truncateText(item.WorkPhone != null

                                    //   ? item.WorkPhone

                                    truncateText(item.companyName != null

                                      ? item.companyName

                                      : " NA ", 25)}

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

                                    onClick={(!loadingUsers[item.ID]) ? (e) => toggleFollow(e, item) : undefined} disabled={loadingUsers[item.ID]}


                                  >

                                    {followStatus[item.ID] ? "Unfollow" : "Follow"}

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
                    {itemsToShow < usersitem.length && (
                      <div className="col-12 text-center mb-3 mt-3">
                        <button onClick={loadMore} className="btn btn-primary">
                          Load More
                        </button>
                      </div>
                    )}
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

                                  {/* <th

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

                                  </th> */}

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

                                        <span>Entity</span>{" "}

                                        <span

                                          onClick={() =>

                                            handleSortChange("companyName")

                                          }

                                        >

                                          <FontAwesomeIcon icon={faSort} />{" "}

                                        </span>

                                      </div>

                                      <div className=" bd-highlight">

                                        {" "}

                                        <input

                                          type="text"

                                          placeholder="Filter by Entity"

                                          onChange={(e) =>

                                            handleFilterChange(e, "companyName")

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

                                        {/* <td>{item.ID}</td> */}

                                        <td>{item.EMail}</td>
                                        <td>
                                          {item?.companyName != null

                                            ? item?.companyName

                                            : "NA"}


                                        </td>

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
