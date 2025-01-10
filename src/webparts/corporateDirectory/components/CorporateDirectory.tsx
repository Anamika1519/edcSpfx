import React, { useEffect, useState } from "react";

import { getgraph, getSP } from "../loc/pnpjsConfig";

import "bootstrap/dist/css/bootstrap.min.css";

import "../../../CustomCss/mainCustom.scss";

import "../../verticalSideBar/components/VerticalSidebar.scss";

import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";

import UserContext from "../../../GlobalContext/context";
import { Copy } from 'react-feather';
import Provider from "../../../GlobalContext/provider";

import { useMediaQuery } from "react-responsive";

import context from "../../../GlobalContext/context";

import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";

import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
import Link from 'feather-icons-react';
import { GraphFI, graphfi, SPFx as graphSPFx } from "@pnp/graph";
import "@pnp/graph/groups";
import "@pnp/graph/members";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups/web";
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
import "./corporate.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { toLower } from "lodash";
import Swal from "sweetalert2";
import Avatar from "@mui/material/Avatar";
export interface IUserListResponse {
  value: any[]; // Adjust this type to match the structure of your list items
  "@odata.nextLink"?: string; // Define the nextLink property explicitly
}
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
  let graph: GraphFI;
  console.log(sp, "sp", graph);

  const [usersitem, setUsersArr] = useState<any[]>([]);
  const [Allusersitem, setAllUsersArr] = useState<any[]>([]);
  const [Listusersitem, setListUsersArr] = useState<any[]>([]);
  const [usersitemcopy, setUsersitemcopy] = useState<any[]>([]);
  const [M365User, setM365User] = useState<any[]>([]);
  const [AllusersInfolist, setAllusersInfolist] = useState<any[]>([]);
  const [firsttenusers, setfirsttenusers] = useState<any[]>([]);
  const [iconenable, seticonenable] = useState(true);
  const [loading, setLoading] = useState(true);
  // const { useHide }: any = React.useContext(UserContext);

  // const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const { useHide }: any = React.useContext(UserContext);

  console.log("This function is called only once", useHide);

  const elementRef = React.useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { setHide }: any = context;

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [ShowPin, setShowPin] = React.useState(false);
  const [smallestRecord, setSmallestRecord] = useState(null);
  const [sortConfig, setSortConfig] = React.useState({

    key: "",

    direction: "ascending",

  });

  const [followerCount, setFollowerCount] = React.useState(0); // State to track follower count

  const [unfollowerCount, setUnfollowerCount] = React.useState(0); // State to track unfollower count
  const [copySuccess, setCopySuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const siteUrl = props.siteUrl;
  const [itemsToShow, setItemsToShow] = useState(9); // Initial number of items to show

  const [filters, setFilters] = React.useState({

    Name: "",

    Email: "",

    EmployeeID: "",
    JobTitle: "",
    companyName: "",
    Department: "",
    MobilePhone: "",

  });

  const [loadingUsers, setLoadingUsers] = useState<Record<number, boolean>>({});

  const [followStatus, setFollowStatus] = useState<Record<number, boolean>>({}); // Track follow status for each user

  const [pinStatus, setPinStatus] = useState<Record<number, boolean>>({}); // Track follow status for each user



  const [isFollowing, setIsFollowing] = useState(false); // Track follow status for each user
  const [handlesearch, sethandlesearch] = useState(false);
  const ApiCall = async () => {

    fetchUserInformationList("onload");
  }
  React.useEffect(() => {
    graph = graphfi().using(graphSPFx(props.context));
    console.log("This function is called only once", useHide);
    ApiCall();


    //fetchAllUsers("onload");

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



  const fetchUserInformationList = async (loadVar: any) => {

    try {

      const currentUser = await sp.web.currentUser();

      let mypinnedusers: any[] = [];
      const pinRecordsnew = await sp.web.lists.getByTitle("ARGPinned").items
        .filter(`PinnedById eq ${currentUser.Id}`)
        .getAll().then((res) => {
          for (let i = 0; i < res.length; i++) {
            mypinnedusers.push(`ID eq ${res[i].PinnedId}`)
          }
        });
      console.log(mypinnedusers, 'mypinnedusers');
      let finalquery = mypinnedusers.map((x) => x).join(' or ');
      const strfilter = mypinnedusers.length > 0 ? `EMail ne null and ID ne ${currentUser.Id}  and ContentType eq 'Person' and (${finalquery})`
        : `EMail ne null and ID ne ${currentUser.Id} and ContentType eq 'Person'`

      // Fetch the user list, excluding the current user
      let nextLink: string | null = null;
      let userListSP: any[] = [];
      console.log(finalquery, 'finalquery', strfilter, "tetttt", userListSP);
      if (loadVar == "onload") {
        setLoading(true);
        userListSP = await sp.web.lists
          .getByTitle("User Information List")
          .items
          .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
          .filter(strfilter)
          .orderBy("Id", false)
          .top(4)
          ();
        let userrr = await sp.web.lists
          .getByTitle("User Information List")
          .items
          .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
          .filter(`EMail ne null and ID ne ${currentUser.Id} and ContentType eq 'Person'`)
          .orderBy("Id", false)
          .top(16 - userListSP.length)
          ();
        let userrrall = await sp.web.lists
          .getByTitle("User Information List")
          .items
          .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
          .filter(`EMail ne null and ID ne ${currentUser.Id} and ContentType eq 'Person'`)
          .orderBy("Id", false)
          .top(5000)
          ();
        setAllusersInfolist(userrrall);
        console.log("userListSP nnn", userListSP, userrr, userrrall);
        userListSP = [...userListSP, ...userrr];
      }
      else if (loadVar == "loadmore") {
        debugger
        setLoading(true);
        if (usersitem.length > 0) {
          let usersitemnew = usersitem.filter((res) => res.pinstatus == false)
          const smallest = usersitemnew.reduce((min, item) => (item.ID < min.ID ? item : min), usersitemnew[0]);

          setSmallestRecord(smallest);
          // userListSP = await sp.web.lists
          //   .getByTitle("User Information List")
          //   .items
          //   .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
          //   .filter(`ContentType eq 'Person' and EMail ne null and ID ne ${currentUser.Id} and ID lt ${smallest.ID}`)
          //   .orderBy("Id", false)
          //   .top(16)
          //   ();
          userListSP = AllusersInfolist.filter((x) => x.ID < smallest.ID && x.ID >= (smallest.ID - 16));
          console.log("smallest", smallest, userListSP, usersitem);
        }

      }
      console.log("userList", userListSP);
      let currentWPContext: WebPartContext = props.context;
      const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');

      // const m265userList = await msgraphClient.api("users")
      //   .version("v1.0")
      //   //.filter(`userPrincipalName ne '${currentUser.Email}'`)
      //   .select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName,mobile,department,officeLocation")
      //   .top(999)
      //   .get();

      // setM365User(m265userList.value);
      // //Adding dummy companies to users for testing
      // //m265userList.value=m265userList.value.map((m:any)=>{let x=m; x['companyName']='dunnycommpany'; return x;});
      // //.filter(`userPrincipalName eq '${currentUser.Email}'`)
      let userList: any[] = [];
      let AlluserList: any[] = [];
      if (loadVar == "onload" && M365User.length == 0) {
        let allusersAD = await getAllGroupMembers("onload").then((response) => {
          setM365User(response)

          userList = userListSP.map(usr => {
            let musrs = response.filter((usr1: any) => { return toLower(usr1.userPrincipalName) == toLower(usr.EMail) });
            if (musrs.length > 0) {
              usr['companyName'] = musrs[0]['companyName'];
              usr['JobTitle'] = musrs[0]['jobTitle'];
              usr['WorkPhone'] = musrs[0]['mobilePhone'];
              usr['Department'] = musrs[0]['department'];
              usr['Title'] = musrs[0]['displayName'];
              usr['EMail'] = musrs[0]['userPrincipalName'];
            }
            else usr['companyName'] = 'NA';
            return usr;
          });
        });
      } else {
        userList = userListSP.map(usr => {
          let musrs = M365User.filter((usr1: any) => { return toLower(usr1.userPrincipalName) == toLower(usr.EMail) });
          if (musrs.length > 0) {
            usr['companyName'] = musrs[0]['companyName'];
            usr['JobTitle'] = musrs[0]['jobTitle'];
            usr['WorkPhone'] = musrs[0]['mobilePhone'];
            usr['Department'] = musrs[0]['department'];
            usr['Title'] = musrs[0]['displayName'];
            usr['EMail'] = musrs[0]['userPrincipalName'];
          }
          else usr['companyName'] = 'NA';
          return usr;
        });
      }
      console.log("m265userList", M365User);

      //userList = userListSP;
      console.log("userListuserList", userList, userListSP);
      //sort by title
      //userList = sortArray(userList, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
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
        // const userrr = await msgraphClient.api("users")
        //   .version("v1.0")
        //   .select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName,mobile,department,officeLocation,businessPhones")
        //   .filter(`mail eq '${user.EMail}'`)
        //   .get()
        //   .then((res) => {
        //     console.log("musrsmusrs", res.value)
        //     if (res.value.length > 0) {
        //       user.companyName = res.value[0]['companyName'];
        //       //user.JobTitle = res.value[0]['jobTitle'];
        //       user.WorkPhone = res.value[0]['mobilePhone'];
        //       // user.Department = res.value[0]['department'];
        //       // user.Title = res.value[0]['displayName'];
        //       // user.EMail = res.value[0]['userPrincipalName'];
        //     }
        //     else
        //       user.companyName = 'NA';
        //     user.WorkPhone = 'NA';
        //     user.Department = 'NA';
        //     user.EMail = 'NA'
        //   });
        // console.log("userr test", user);
        initialFollowStatus[user.ID] = followRecords.length > 0;
        initialPinStatus[user.ID] = pinRecords.length > 0;
        user.pinstatus = pinRecords.length > 0;
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
      //let users = usersitemcopy.length > 0 ? usersitemcopy.concat(userList) : userList;
      // Fetch details for each user in parallel
      //users = sortArray(users, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
      userList = [...usersitem, ...userList];
      const userDetailsPromises = userList.map(async (user) => {
        initialLoadingStatus[user.ID] = true;  // Set loading to true initially
        await fetchUserDetails(user);  // Fetch the user details (follow status and posts)
        initialLoadingStatus[user.ID] = false;  // Set loading to false after fetc
      });

      // Wait for all user details to be fetched
      await Promise.all(userDetailsPromises);
      // Update the state with the fetched data
      setFollowStatus(initialFollowStatus);
      setPinStatus(initialPinStatus);
      let allusersnew: any;
      setLoadingUsers(initialLoadingStatus);
      setLoading(false);

      console.log("allusersbefore", usersitem, usersitemcopy, userList);
      //const uniqueArray = userList.filter((item, index) => userList.indexOf(item) === index);
      //userList = uniqueArray;
      //userList = sortArray(userList, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
      const uniqueArray = userList.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.Id === value.Id
        ))
      )
      //let newUniquearray = [...Uniquearray]
      userList = uniqueArray;
      if (loadVar == "onload") {
        let sortedData = [...userList].sort((a, b) => {
          return a.pinstatus === b.pinstatus ? 0 : a.pinstatus ? -1 : 1;
        });
        //allusersnew = userList;
        setfirsttenusers(sortedData);
        setUsersArr(sortedData);
      }
      else {
        // allusersnew = [...usersitem, ...userList];
        //userList = sortArray(userList, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
        //allusersnew = userList;
        let sortedData = [...userList].sort((a, b) => {
          return a.pinstatus === b.pinstatus ? 0 : a.pinstatus ? -1 : 1;
        });
        setUsersArr(sortedData);
        console.log("allusersnew", allusersnew, usersitem, usersitemcopy, userList, sortedData);
        //setUsersArr((prevData) => [...prevData, ...userList]);
      }
      setUsersitemcopy(allusersnew);
      console.log("allusersallusers", allusersnew, usersitem, usersitemcopy, userList);
    } catch (error) {

      console.error("Error fetching users:", error);

    }

  };
  const getAllGroupMembers = async (groupId: string): Promise<any[]> => {
    const allMembers = [];
    let nextPage = await graph.users.select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName,mobile,department,officeLocation,businessPhones").top(999).paged() // Get the first page of members
    console.log("nextpage", nextPage)
    // Add the members from the first page
    allMembers.push(...nextPage.value);

    // Continue fetching while there are more pages
    while (nextPage.hasNext) {
      nextPage = await nextPage.next();
      allMembers.push(...nextPage.value);
    }
    //let test = allMembers.filter((x) => x.mail == "Alaeddin.Sulieman@alrostamanigroup.ae")
    console.log("allMembers", allMembers)
    //alert(`All member of AD ${allMembers.length}`)
    return allMembers;
  }



  const [activeTab, setActiveTab] = useState<

    "cardView" | "listView" | "calendarView"

  >("cardView");


  const handleTabChange = async (tab: any, usersitem: any) => {
    if (tab == "listView") {

      let ListuserListSP = await sp.web.lists
        .getByTitle("User Information List")
        .items
        .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
        .filter(`ContentType eq 'Person' and EMail ne null`)
        .orderBy("Id", false)
        .top(4999)
        ();

      let userList: any[] = [];
      const fetchUserDetails = async (user: any) => {
        //userList = ListuserListSP.map(async usr => {
        let musrs = M365User.filter((usr1: any) => { return toLower(usr1.mail) == toLower(user.EMail) });
        console.log("M365UserM365User", M365User, musrs, ListuserListSP);
        if (musrs.length > 0) {
          user['companyName'] = musrs[0]['companyName'];
          user['JobTitle'] = musrs[0]['jobTitle'];
          user['WorkPhone'] = musrs[0]['mobilePhone'];
          user['Department'] = musrs[0]['department'];
          user['Title'] = musrs[0]['displayName'];
          user['EMail'] = musrs[0]['userPrincipalName'];
        }
        else user['companyName'] = 'NA';
        return user;
        // });
      };
      // let currentWPContext: WebPartContext = props.context;
      // const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');

      const userDetailsPromises = ListuserListSP.map(async (user) => {
        await fetchUserDetails(user);  // Fetch the user details (follow status and posts)
      });

      // Wait for all user details to be fetched
      await Promise.all(userDetailsPromises);

      console.log("userlistttt", userList, ListuserListSP);
      setActiveTab(tab);
      setListUsersArr(ListuserListSP);
      //setUsersArr(ListuserListSP);
    }
    else {
      setActiveTab(tab);
      setItemsToShow(16);
      fetchUserInformationList("onload");
    }

  };


  // Function to truncate text

  const truncateText = (text: string, maxLength: number) => {
    // if (text != "")
    //   return text.length > maxLength

    //     ? text.substring(0, maxLength) + "..."

    //     : text;
    return text
  };


  //#region Breadcrumb
  const IconComponent = Copy;
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

    ///sessionStorage.setItem("selectedUserID", userID);
    //sessionStorage.setItem("currentStatus", currentStatus);
    // window.location.href = `${siteUrl}/SitePages/Userprofile.aspx?${userID}`;
  };
  const handleFilterChange = (

    e: React.ChangeEvent<HTMLInputElement>,

    field: string

  ) => {
    console.log("eeeeeee", field)
    if (field == "Name") {
      setCurrentPage(1);
    }
    setFilters({

      ...filters,

      [field]: e.target.value,

    });

  };


  const handleSortChange = (key: string) => {
    console.log("keyyy", key);
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {

      direction = "descending";

    }

    setSortConfig({ key, direction });

  };


  const applyFiltersAndSorting = (data: any[]) => {

    console.log("datat on filter", data, filters.Department);
    // Filter data

    const filteredData = data.filter((item) => {

      return (

        (filters.Name === "" ||

          item?.Title.toLowerCase().includes(filters.Name.toLowerCase())) &&

        (filters.Email === "" ||

          item?.EMail.toLowerCase().includes(filters.Email.toLowerCase())) &&
        (filters.MobilePhone === '' ||
          item?.WorkPhone && item?.WorkPhone.toString().includes(filters.MobilePhone + "")) &&

        (filters.companyName === '' ||
          (item?.companyName && item?.companyName.toLowerCase().includes(filters.companyName.toLowerCase()))) &&
        (filters.Department === '' ||
          (item?.Department && item?.Department.toLowerCase().includes(filters.Department.toLowerCase()))) &&
        (filters.JobTitle === '' ||
          (item?.JobTitle && item?.JobTitle.toLowerCase().includes(filters.JobTitle.toLowerCase())))

      );

    });

    console.log("filteredDatafilteredData", filteredData, sortConfig.key);
    const sortedData = filteredData.sort((a, b) => {

      if (sortConfig.key === "SNo") {

        // Sort by index

        const aIndex = data.indexOf(a);

        const bIndex = data.indexOf(b);


        return sortConfig.direction === "ascending"

          ? aIndex - bIndex

          : bIndex - aIndex;

      }
      else if (sortConfig.key == "Email") {

        // Sort by other keys

        const aValue = a['EMail'] ? (a['EMail'].split('@')[0]).toLowerCase() : "";

        const bValue = b['EMail'] ? (b['EMail'].split('@')[0]).toLowerCase() : "";


        if (aValue < bValue) {

          return sortConfig.direction === "ascending" ? -1 : 1;

        }

        if (aValue > bValue) {

          return sortConfig.direction === "ascending" ? 1 : -1;

        }

      }
      else if (sortConfig.key == "MobilePhone") {

        // Sort by other keys

        const aValue = a['WorkPhone'] ? a['WorkPhone'].toLowerCase() : "";

        const bValue = b['WorkPhone'] ? b['WorkPhone'].toLowerCase() : "";


        if (aValue < bValue) {

          return sortConfig.direction === "ascending" ? -1 : 1;

        }

        if (aValue > bValue) {

          return sortConfig.direction === "ascending" ? 1 : -1;

        }

      }
      else if (sortConfig.key == "Name") {

        // Sort by other keys

        const aValue = a['Title'] ? a['Title'].toLowerCase() : "";

        const bValue = b['Title'] ? b['Title'].toLowerCase() : "";


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


  const filteredEmployeeData = applyFiltersAndSorting(Listusersitem);


  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentGroup, setCurrentGroup] = React.useState(1);
  const itemsPerPage = 10;
  const pagesPerGroup = 10;

  const totalPages = Math.ceil(filteredEmployeeData.length / itemsPerPage);
  const totalGroups = Math.ceil(totalPages / pagesPerGroup);

  const handleGroupChange = (direction: "next" | "prev") => {
    const newGroup = currentGroup + (direction === "next" ? 1 : -1);
    if (newGroup > 0 && newGroup <= totalGroups) {
      setCurrentGroup(newGroup);
      setCurrentPage((newGroup - 1) * pagesPerGroup + 1); // Go to the first page of the new group
    }
  };

  const handlePageChange = (pageNumber: any) => {

    if (pageNumber > 0 && pageNumber <= totalPages) {

      setCurrentPage(pageNumber);
      const newGroup = Math.ceil(pageNumber / pagesPerGroup);
      setCurrentGroup(newGroup);
    }

  };


  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredEmployeeData.slice(startIndex, endIndex);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
  const [isOpenNews, setIsOpenNews] = React.useState(false);

  const toggleDropdownNews = () => {

    setIsOpenNews(!isOpenNews);

  };

  const handleNewsExportClick = async () => {

    let ListuserListSP = await sp.web.lists
      .getByTitle("User Information List")
      .items
      .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
      .filter(`ContentType eq 'Person' and EMail ne null`)
      .orderBy("Id", false)
      .top(4999)
      ();
    setListUsersArr(ListuserListSP);
    if (Listusersitem.length > 0) {
      const exportData = Listusersitem.map((item, index) => ({

        Name: item.Title,
        Email: item.EMail,
        Entity: item?.companyName != null ? item?.companyName : "NA",
        Department: item?.Department != null ? item?.Department : "NA",
        WorkPhone: item?.WorkPhone,

      }));


      exportToExcel(exportData, "Corporate Directory List");
    }
  };
  const openTeamsChatWithMessage = (email: string) => {
    const teamsChatLink = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(email)}}`;
    window.open(teamsChatLink, "_blank");
  };
  const openEmailDialog = (email: string) => {
    const subject = "Let's Connect!";
    const body = "Hi, I’d like to discuss something important.";
    // const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    //window.location.href = mailtoLink;
    const outlook365Url = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the email in a new tab
    window.open(outlook365Url, "_blank");

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
  const copyToClipboard = (e?:any, email?: String) => {
    e?.preventDefault();
    const link = `${email}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Email copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy Email');
      });
  };
  const handleSearch = async (e: any
    //   : {
    //   target: { value: React.SetStateAction<string> };
    // }
  ) => {
    sethandlesearch(true);
    let filteredusers: any[] = [];
    if (activeTab == "listView")
      setActiveTab("cardView");
    let txtSearch: any = e.target.value;
    //(document.getElementById('searchInput') as HTMLInputElement).value;
    // filteredusers = usersitem.filter((item, index) => {
    //   return (
    //     (txtSearch === '' || item.Title.toLowerCase().includes(txtSearch.toLowerCase()))
    //   );
    // });

    let AlluserList: any[] = [];
    const currentUser = await sp.web.currentUser();
    console.log("usersitem", usersitem)
    if (e.target.value.length > 0) {
      //setUsersArr([]);
      let Allusersnew = await sp.web.lists
        .getByTitle("User Information List")
        .items
        .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
        .filter(`ContentType eq 'Person' and startswith(Title, '${txtSearch}')`)
        .orderBy("ID", false).top(16)
        ();
      console.log("uuuuuu", Allusersnew, firsttenusers);
      let currentWPContext: WebPartContext = props.context;
      const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');
      //setUsersArr(Allusersnew);
      if (Allusersnew.length > 0) {
        Allusersnew = Allusersnew.map(usr => {
          let musrs = M365User.filter((usr1: any) => { return toLower(usr1.userPrincipalName) == toLower(usr.EMail) });
          if (musrs.length > 0) {
            usr['companyName'] = musrs[0]['companyName'];
            usr['JobTitle'] = musrs[0]['jobTitle'];
            usr['WorkPhone'] = musrs[0]['mobilePhone'];
            usr['Department'] = musrs[0]['department'];
            usr['Title'] = musrs[0]['displayName'];
            usr['EMail'] = musrs[0]['userPrincipalName'];
          }
          else usr['companyName'] = 'NA';
          return usr;
        });
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
          user.pinstatus = pinRecords.length > 0;
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
        //let users = usersitemcopy.length > 0 ? usersitemcopy.concat(userList) : userList;
        // Fetch details for each user in parallel
        //users = sortArray(users, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()));
        //userList = [...usersitem, ...userList];
        const userDetailsPromises = Allusersnew.map(async (user) => {
          initialLoadingStatus[user.ID] = true;  // Set loading to true initially
          await fetchUserDetails(user);  // Fetch the user details (follow status and posts)
          initialLoadingStatus[user.ID] = false;  // Set loading to false after fetc
        });

        // Wait for all user details to be fetched
        await Promise.all(userDetailsPromises);
        // Update the state with the fetched data
        setFollowStatus(initialFollowStatus);
        setPinStatus(initialPinStatus);
        setUsersArr(Allusersnew);
        setItemsToShow(Allusersnew.length);
        setUsersArr(Allusersnew);
        setItemsToShow(Allusersnew.length);
      } else {
        setUsersArr([]);
      }
    }
    else if (e.target.value.length == 0) {
      // let useee = sortArray(usersitemcopy, (a: any, b: any) => a.Title.toLowerCase().localeCompare(b.Title.toLowerCase()))
      // setUsersArr(useee)
      sethandlesearch(false);
      setUsersArr(firsttenusers);
      //await fetchUserInformationList("onload");
    }
  }

  const toggleFollow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: any) => {

    e.preventDefault();

    setLoadingUsers((prev) => ({ ...prev, [item.ID]: true })); // Set loading state for the specific user
    //await fetchUserDetails(item);

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
      const followersCount = await sp.web.lists.getByTitle("ARGFollows").items

        .filter(`FollowedId eq ${item.ID}`)

        .select("Id")

        .getAll();



      const followingCount = await sp.web.lists.getByTitle("ARGFollows").items

        .filter(`FollowerId eq ${item.ID}`)

        .select("Id")

        .getAll();



      item.followersCount = followersCount.length;

      item.followingCount = followingCount.length;


    } catch (error) {

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user


      console.error("Error toggling follow status:", error);

      alert("Failed to toggle follow status. Please try again.");

    } finally {

      //fetchUserInformationList()

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user



    }

  };


  const togglePin = async (e: React.MouseEvent<HTMLImageElement, MouseEvent>, item: any) => {

    debugger
    seticonenable(false);
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

      }
      else {
        if (MyPinnedCount.length >= 4) {
          Swal.fire("You’ve hit the limit for pinning users to the Home Screen!")
        } else {
          await sp.web.lists.getByTitle("ARGPinned").items.add({

            PinnedById: currentUser.Id,

            PinnedId: item.ID

          });
          setPinStatus((prev) => ({ ...prev, [item.ID]: true }));
        }
        // pin logic
        // Update pin status

      }
      seticonenable(true);

    } catch (error) {

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user


      console.error("Error toggling pin status:", error);

      alert("Failed to toggle pin status. Please try again.");

    } finally {

      //fetchUserInformationList()

      setLoadingUsers((prev) => ({ ...prev, [item.ID]: false })); // End loading state for the specific user



    }

  }

  const loadMore = () => {
    debugger
    event.preventDefault()
    event.stopImmediatePropagation()


    setItemsToShow(itemsToShow + 15);
    fetchUserInformationList("loadmore") // Increase the number by 8
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

            marginTop: "0rem",

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

                    <div className="me-0 position-relative">

                      <input

                        type="search"

                        className="form-control my-1 my-md-0"

                        id="searchInput"

                        placeholder="Search by name in Card View..."
                        onChange={(e) => handleSearch(e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevents a new line
                            handleSearch(e); // Calls the function to add a reply
                          }
                        }}
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


                    {/* <div

                      className="btn btn-secondary waves-effect waves-light"

                      data-bs-toggle="modal"

                      data-bs-target="#custom-modal"

                      onClick={handleNewsExportClick}

                    >

                      <FontAwesomeIcon icon={faFileExport} /> Export

                    </div> */}

                  </form>

                </div>

              </div>

            </div>

            <div className="row mt-4">

              <div className="col-12">

                <div className="card mb-0 cardcsss">

                  <div className="card-body">

                    <div className="d-flex flex-wrap align-items-center justify-content-center">

                      <ul

                        className="navs nav-pillss navtab-bgs"

                        role="tablist"

                        style={{



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

                            onClick={() => handleTabChange("cardView", usersitem)}

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

                            onClick={() => handleTabChange("listView", usersitem)}


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
            {!loading && usersitem.length == 0 &&
              <div className='row mt-2'>
                <div style={{ height: '300px' }} className="card card-body align-items-center  annusvg text-center"
                >

                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>

                  <p className="font-14 text-muted text-center">No Users Available </p>

                </div>
              </div>
            }
            <div className="row corporate-directory">

              <div className="mt-3">

                {activeTab === "cardView" && (

                  // Card View Content (only displayed when "cardView" is active)
                  <div>
                    {loading && usersitem.length == 0 && (
                      <div className="loadernewadd">
                        <div>
                          <img
                            src={require("../../../CustomAsset/birdloader.gif")}
                            className="alignrightl"
                            alt="Loading..."
                          />
                        </div>
                        <div className="loadnewarg">
                          <span>Loading </span>{" "}
                          <span>
                            <img
                              src={require("../assets/argloader.gif")}
                              className="alignrightbird"
                              alt="Loading..."
                            />
                          </span>
                        </div>
                      </div>
                    )}
                    {
                      usersitem.length > 0
                      //!loading
                      && (
                        <div className="row card-view">
                          {console.log("usersssitem", usersitem, followStatus, pinStatus)}
                          {/* {usersitem.length == 0 && <div> No users found...</div>} */}
                          {usersitem.length > 0 && usersitem.map((item) => (

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
                                      {/* {item.Picture != null ?
                                        <img
                                          src={
                                            //item.Picture != null ? 
                                            `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item.EMail}`
                                            //: require("../assets/users.jpg")
                                          }
                                          className="rounded-circlecss img-thumbnail
                                  avatar-xl"
                                          alt="profile-image"
                                          style={{ cursor: "auto" }}
                                        />
                                        :
                                        item.EMail !== null &&
                                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                          {`${item.EMail.split('.')[0].charAt(0)}${item.EMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                        </Avatar>
                                      } */}
                                      {item.EMail !== null &&
                                        <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circlecss img-thumbnail
                                  avatar-xl">
                                          {`${item.EMail.split('.')[0].charAt(0)}${item.EMail.split('.')[1].charAt(0)}`.toUpperCase()}
                                        </Avatar>}
                                    

                                   
                                    </a>
                                    <p>

<img style={{ cursor: "pointer" }}

  src={pinStatus[item.ID] ? require("../assets/noun-pin-7368310.png") : require("../assets/unpin.png")}

  className="alignrightpin"

  onClick={(e) => iconenable ? togglePin(e, item) : ""}

  //onClick={(!loadingUsers[item.ID]) ? (e) => togglePin(e, item) : undefined}

  alt="pin"

/>



</p>
                                    <span className="mt-2 mb-1" data-tooltip={item.Title}>

                                      <h4
                                        //onClick={() => handleUserClick(item.ID, followStatus[item.ID])}

                                        className="text-dark font-16 fw-bold"

                                        style={{

                                          textDecoration: "unset",

                                          fontSize: "20px",
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'

                                        }}

                                      >



                                        {truncateText(item.Title && item.Title, 28)}



                                      </h4>

                                    </span>
<span style={{display:'flex', gap:'5px'}} className="newsvg">  {IconComponent && <IconComponent  size={14} onClick={(e) => copyToClipboard(e, item.EMail)} />}


                                    <span data-tooltip={item.EMail}>
                                  
                                      <p className="text-muted hovertext" style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden', fontSize: "14px", height: '30px',
                                        textOverflow: 'ellipsis',width:'200px'
                                      }} onClick={() =>

                                        openEmailDialog(item.EMail)

                                      } >
                                        
                                        {/* <Link size={14} /> */}
                                        {/* onClick={(e) => copyToClipboard(e, item.EMail)} */}
                                        {truncateText(item.EMail && item.EMail, 28)}

                                      </p>
                                      {copySuccess && <span className="text-success font-12">{copySuccess}</span>}

                                      {/* <span

                                      className="pl-2"

                                      style={{ color: "#1fb0e5" }}

                                    >

                                     

                                      {truncateText(

                                        item.Department != null

                                          ? item.Department

                                          : " NA ",

                                        10

                                      )}


                                     

                                    </span> */}

                                    </span>
                                    </span>
                                    <p className="text-muted"
                                      style={{
                                        fontSize: "14px", whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}

                                    >
                                      <span

                                        className="pl-2"

                                        style={{ color: "#1fb0e5" }}

                                      >



                                        {truncateText(

                                          item.Department != null

                                            ? item.Department

                                            : " NA ",

                                          28

                                        )}


                                        {/* </a> */}

                                      </span>

                                    </p>

                                    <span data-tooltip={item.companyName} >
                                      <p className="text-muted" style={{
                                        fontSize: "11px", whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}>

                                        {/* {truncateText(item.WorkPhone != null

                                    ? item.WorkPhone

                                    : " NA ", 10)} */}
                                        {
                                          // truncateText(item.WorkPhone != null

                                          //   ? item.WorkPhone

                                          truncateText(item.companyName != null

                                            ? item.companyName

                                            : " NA ", 25)}

                                      </p>


                                    </span>

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

                                            `https://teams.microsoft.com/l/chat/0/0?users=${item.EMail}`,

                                            "_blank"

                                          )

                                        }

                                        className="btn btn-primary btn-sm waves-effect waves-light"

                                      >

                                        Message

                                      </button>


                                      <div>

                                        {followStatus[item.ID] ?

                                          <button key={item.ID}

                                            type="button" className="finish"

                                            //onClick={(!loadingUsers[item.ID]) ? (e) => toggleFollow(e, item) : undefined} disabled={loadingUsers[item.ID]}
                                            onClick={(e) => toggleFollow(e, item)}

                                          >
                                            Unfollow

                                          </button> :
                                          <button key={item.ID}

                                            type="button" style={{ background: '#efefef' }} className="btn btn-primary1 text-dark btn-sm waves-effect waves-light"

                                            //onClick={(!loadingUsers[item.ID]) ? (e) => toggleFollow(e, item) : undefined} disabled={loadingUsers[item.ID]}
                                            onClick={(e) => toggleFollow(e, item)}


                                          >
                                            Follow
                                          </button>

                                        }


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

                          {loading && usersitem.length > 0 && (
                            <div className="loadernewadd">
                              <div>
                                <img
                                  src={require("../../../CustomAsset/birdloader.gif")}
                                  className="alignrightl"
                                  alt="Loading..."
                                />
                              </div>
                              <div className="loadnewarg">
                                <span>Loading </span>{" "}
                                <span>
                                  <img style={{ width: '35px' }}
                                    src={require("../assets/argloader.gif")}
                                    className="alignrightbird"
                                    alt="Loading..."
                                  />
                                </span>
                              </div>
                            </div>
                          )}
                          {itemsToShow < AllusersInfolist.length && !handlesearch && (
                            <div className="col-12 text-center mb-3 mt-3">
                              <button onClick={loadMore} className="btn btn-primary">
                                Load More
                              </button>
                            </div>
                          )}
                        </div>


                      )}
                  </div>
                )}

                {activeTab === "listView" && (

                  // List View Content (only displayed when "listView" is active)

                  <div className="list-view">

                    <div className="card mb-0" >

                      <div className="card-body">

                        <div id="cardCollpase4" className="collapse show">

                          <div className="table-responsive pt-0">

                            <table

                              className="mtbalenew table-centered table-nowrap table-borderless mb-0"

                              style={{ position: "relative" }}

                            >

                              <thead>

                                <tr>

                                  <th style={{ minWidth: '55px', maxWidth: '55px' }}>

                                    Connect

                                    <div style={{ height: "47px" }}></div>

                                  </th>

                                  <th style={{ minWidth: '100px', maxWidth: '100px' }}>

                                    <div className="d-flex flex-column bd-highlight ">

                                      <div

                                        className="d-flex pb-2"

                                        style={{

                                          justifyContent: "space-evenly",

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
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
                                          className="inputcss"

                                          style={{ width: "100%" }}

                                        />

                                      </div>

                                    </div>

                                  </th>

                                  <th

                                    style={{

                                      minWidth: "202px",

                                      maxWidth: "202px",

                                    }}

                                  >

                                    <div className="d-flex flex-column bd-highlight ">

                                      <div

                                        className="d-flex  pb-2"

                                        style={{

                                          justifyContent: "space-evenly",

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
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
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

                                          justifyContent: "space-evenly",

                                        }}

                                      >

                                        {" "}

                                        <span>Job Title</span>{" "}

                                        <span

                                          onClick={() =>

                                            handleSortChange("JobTitle")

                                          }

                                        >

                                          <FontAwesomeIcon icon={faSort} />{" "}

                                        </span>

                                      </div>

                                      <div className=" bd-highlight">

                                        {" "}

                                        <input

                                          type="text"

                                          placeholder="Filter by Job Title"

                                          onChange={(e) =>

                                            handleFilterChange(e, "JobTitle")

                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
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

                                          justifyContent: "space-evenly",

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
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
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

                                          justifyContent: "space-evenly",

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
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
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

                                          justifyContent: "space-evenly",

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
                                          max={9999999999}
                                          type="number"
                                          maxLength={10}
                                          placeholder="Filter by Mobile Phone"

                                          onChange={(res) =>

                                            handleFilterChange(res, "MobilePhone")

                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              e.preventDefault(); // Prevent the default Enter key behavior
                                              //alert("Enter key is not allowed!"); // Optional feedback for the user
                                            }
                                          }}
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

                                            minWidth: "55px",

                                            maxWidth: "55px", textAlign: 'center'

                                          }}

                                        >

                                          {" "}

                                          <img style={{ width: '18px', cursor: 'pointer' }}

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

                                        <td style={{ minWidth: '100px', maxWidth: '100px' }}> <p>{item.Title}</p> </td>

                                        {/* <td>{item.ID}</td> */}

                                        <td style={{ minWidth: '202px', maxWidth: '202px' }} data-tooltip={item.EMail}> <p>{item.EMail}</p> </td>
                                        <td style={{ minWidth: '100px', maxWidth: '100px' }} data-tooltip={item.JobTitle}><p>{item.JobTitle}</p> </td>
                                        <td style={{ minWidth: '100px', maxWidth: '100px' }} data-tooltip={item?.companyName != null

                                          ? item?.companyName

                                          : "NA"}>
                                          <p>  {item?.companyName != null

                                            ? item?.companyName

                                            : "NA"}</p>


                                        </td>

                                        <td style={{ minWidth: '100px', maxWidth: '100px' }} data-tooltip={item?.Department != null

                                          ? item?.Department

                                          : "NA"}>

                                          <p>  {item?.Department != null

                                            ? item?.Department

                                            : "NA"} </p>

                                        </td>

                                        <td style={{ minWidth: '100px', maxWidth: '100px' }} data-tooltip={item?.WorkPhone != null

                                          ? item?.WorkPhone

                                          : "NA"}>

                                          <p>  {item?.WorkPhone != null

                                            ? item?.WorkPhone

                                            : "NA"} </p>

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

                                  className={`prevPage page-item ${currentGroup === 1 ? "disabled" : ""
                                    }`}
                                  onClick={() => handleGroupChange("prev")}
                                >

                                  <a

                                    className="page-link"

                                    // onClick={() =>

                                    //   handlePageChange(currentPage - 1)

                                    // }

                                    aria-label="Previous"

                                  >

                                    «

                                  </a>

                                </li>

                                {Array.from(

                                  { length: endPage - startPage + 1 },

                                  (_, num) => {
                                    const pageNum = startPage + num;
                                    return (

                                      <li

                                        key={pageNum}

                                        className={`page-item ${currentPage === pageNum ? "active" : ""

                                          }`}

                                      >

                                        <a

                                          className="page-link"

                                          onClick={() =>

                                            handlePageChange(pageNum)

                                          }

                                        >

                                          {pageNum}

                                        </a>

                                      </li>

                                    )
                                  }

                                )}

                                <li

                                  className={`nextPage page-item ${currentGroup === totalGroups ? "disabled" : ""

                                    }`}
                                  onClick={() => handleGroupChange("next")}
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