import React, { useContext, useEffect, useRef, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { IList, SPFI } from "@pnp/sp/presets/all";
import { fetchUserInformationList } from "../../../APISearvice/GroupTeamService";
import Select from 'react-select'
import Swal from "sweetalert2";
// import Select from 'react-select'
// import Multiselect from "multiselect-react-dropdown";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
let INGLOBAL : any
let currentuseridglobal : any
let isProjectCompleted: any
// import "../components/announcementdetails.scss";
import Multiselect from "multiselect-react-dropdown";
import Provider from "../../../GlobalContext/provider";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
// import 'react-comments-section/dist/index.css';
import { CommentCard } from "../../../CustomJSComponents/CustomCommentCardProject/CommentCardProject";
import {
  addNotification,
  getCurrentUser,
  getCurrentUserProfile,
} from "../../../APISearvice/CustomService";
import { Calendar, FilePlus, Link, Share } from "react-feather";
import moment from "moment";
import UserContext from "../../../GlobalContext/context";
import context from "../../../GlobalContext/context";
// import { IBlogDetailsProps } from "./IBlogDetailsProps";
// import { getBlogDetailsById, getProjectDetailsById} from "../../../APISearvice/BannerService";
import { getSP } from "../loc/pnpjsConfig";
import { IProjectDetailsProps } from "./IProjectDetailsProps";
import { getProjectDetailsById } from "../../../APISearvice/BlogService";
import "./Projects.scss";
import { Modal, Card ,Dropdown , Button} from "react-bootstrap";
import FileIcon from "../../../CustomJSComponents/FileIcon";
import { asAsync } from "@fluentui/react";
import { parse } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Define types for reply and comment structures
interface Reply {
  Id: number;
  AuthorId: number;
  UserName: string;
  Comments: string;
  Created: string;
  UserProfile: string;
}

interface Like {
  ID: number;
  like: string;
  UserName: string;
  AuthorId: number;
  Count: number;
  Created: string;
}
interface Comment {
  Id: number;
  UserName: string;
  AuthorId: number;
  Comments: string;
  Created: string;
  UserLikesJSON: Like[];
  UserCommentsJSON: Reply[];
  userHasLiked: boolean; // New property to track if the user liked this comment
  UserProfile: string;
}

let projectname :any = ""
let filemanager : any = ""
const payload: any = {};
const ProjectDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const siteUrl = props.siteUrl;
  const menuRef = useRef(null);
  const [projectallfile, setProjectallfiles] = useState([]);
  const elementRef = React.useRef<HTMLDivElement>(null);
  // const [selectedValue, setSelectedValue] = useState([]);
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
const [options, setOpions] = useState([]);

  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ArrDetails, setArrDetails] = useState([]);
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const { useHide }: any = React.useContext(UserContext);
  const [isMenuOpenshare, setIsMenuOpenshare] = useState(false);
  const { setHide }: any = context;
  const [showDropdownId, setShowDropdownId] = React.useState(null);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState([]);
  const [CurrentID, setIdNum] = useState("");
  const toggleDropdown = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
    }
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Fetch users from SharePoint when the component mounts
    const fetchUsers = async () => {
      // try {
      //   const userList = await sp.web.siteUsers();  // Fetch users from the site
      //   const userOptions = userList.map(user => ({
      //     label: user.Title,   // Display name of the user
      //     value: user.Id       // Unique user ID
      //   }));
      //   setUsers(userOptions);  // Set the options for Select and Multiselect
      // } catch (error) {
      //   console.error('Error fetching users:', error);
      // }
      try {
        // Fetch all site users and filter out groups
        const userList = await sp.web.siteUsers();
       
        // Filter users by checking the PrincipalType (1 represents Users)
        const userOptions = userList
            .filter(user => user.PrincipalType === 1)
            .map(user => ({
                label: user.Title,   // Display name of the user
                value: user.Id       // Unique user ID
            }));
   
        setUsers(userOptions);  // Set the options for Select and Multiselect
    } catch (error) {
        console.error('Error fetching users:', error);
    }
    //   try {
    //     const items = await sp.web.siteUsers()
 
    //     console.log(items, 'itemsitemsitems');
 
    //     const formattedOptions = items.map((item) => ({
    //       label: item.Title, // Adjust according to your list schema
    //       value: item.Id,
    //     }));
 
    //     setOpions(formattedOptions);
    // } catch (error) {
    //     console.error('Error fetching options:', error);
    // }
    };

    fetchUsers();
  }, []);
  // const currentUserEmailRef = useRef('');
  const getCurrrentuser=async()=>{
    const userdata = await sp.web.currentUser();

    currentUserEmailRef.current = userdata.Email;
    currentuseridglobal = userdata.Id

 
  }
  useEffect(() => {
    getCurrrentuser()

  }, []);
  // const onSelect = (selectedList:any) => {
  //   console.log(selectedList , "selectedList");
  //   setSelectedValue(selectedList);  // Set the selected users
  // };

  // const onRemove = (removedItem:any) => {
  //   setSelectedValue(prev => prev.filter(item => item.value !== removedItem.value));  // Remove the user from the selection
  // };

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


  // const [users, setUsers] = useState([]);
  // useEffect(() => {
  //   // Fetch users from SharePoint when the component mounts
  //   const fetchUsers = async () => {
  //     // try {
  //     //   const userList = await sp.web.siteUsers();  // Fetch users from the site
  //     //   const userOptions = userList.map(user => ({
  //     //     label: user.Title,   // Display name of the user
  //     //     value: user.Id       // Unique user ID
  //     //   }));
  //     //   setUsers(userOptions);  // Set the options for Select and Multiselect
  //     // } catch (error) {
  //     //   console.error('Error fetching users:', error);
  //     // }
  //     try {
       
  //       const siteUsers = await sp.web.siteUsers();
 

  //       const usersOnly = siteUsers.filter(user => user.PrincipalType === 1);
  //       const formattedOptions = usersOnly.map((item) => ({
  //         name: item.Title,
  //         id: item.Id,
  //     }));
 
  //     setUsers(formattedOptions);
  //       console.log(usersOnly, 'usersOnly');
  //       return usersOnly;
  //   } catch (error) {
  //       console.error('Error fetching users:', error);
  //   }
  //   };

  //   fetchUsers();
  // }, []);
  const currentUserEmailRef = useRef('');
  // const getCurrrentuser=async()=>{
  //   const userdata = await sp.web.currentUser();

  //   currentUserEmailRef.current = userdata.Email;
 
 
  // }
  // useEffect(() => {
  //   getCurrrentuser()

  // }, []);
  const onSelect = (selectedList:any) => {
    console.log(selectedList , "selectedList");
    setSelectedValue(selectedList);  // Set the selected users
  };

  const onRemove = (removedItem:any) => {
    setSelectedValue(prev => prev.filter(item => item.value !== removedItem.value));  // Remove the user from the selection
  };

  // Load comments from localStorage on mount
  useEffect(() => {
    // const savedComments = localStorage.getItem('comments');
    // if (savedComments) {
    //   setComments(JSON.parse(savedComments));
    // }
   
    ApiLocalStorageData();
    getApiData()
ApICallData();
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
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpenshare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    showNavbar("header-toggle", "nav-bar", "body-pd", "header");

    console.log("arrdetails--cheking", ArrDetails);

    const linkColor = document.querySelectorAll(".nav_link");

    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    }
    document.removeEventListener("mousedown", handleClickOutside);
    linkColor.forEach((l) => l.addEventListener("click", colorLink));
  }, [props]);
  //setInterval(() => {
   // getApiData()
 // }, 1000)
  const getApiData = async () => {
    let initialComments: any[] = [];
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    INGLOBAL = idNum
    let initialArray: any[] = [];
    let arrLike = {};
    let likeArray: any[] = [];
    sp.web.lists
      .getByTitle("ARGProjectComments")
      .items.select("*,ARGProject/Id ,Author/ID,Author/Title,Author/EMail")
      .expand("ARGProject , Author")
      .filter(`ARGProjectId eq ${Number(idNum)}`).orderBy("Modified" , false )()
      .then(async (result: any) => {
        console.log(result, "ARGProjectComments");

        initialComments = result;
        for (var i = 0; i < initialComments.length; i++) {
          await sp.web.lists
            .getByTitle("ARGProjectUserLikes")
            .items.filter(`ProjectCommentsId eq ${Number(initialComments[i].Id)}`).select("ID,AuthorId,UserName,Like,Created")()
            .then((result1: any) => {
              console.log(result1, "ARGProjectUserLikesLikes");
              []
              for (var j = 0; j < result1.length; j++) {
                arrLike = {
                  "ID": result1[j].Id,
                  "AuthorId": result1[j].AuthorId,
                  "UserName": result1[j].UserName,
                  "Like": result1[j].Like,
                  "Created": result1[j].Created
                }
                likeArray.push(arrLike)
              }

              let arr = {
                Id: initialComments[i].Id,
                UserName: initialComments[i].UserName,
                AuthorId: initialComments[i].AuthorId,
                Comments: initialComments[i].Comments,
                Created: new Date(initialComments[i].Created).toLocaleString(), // Formatting the created date
                UserLikesJSON: result1.length > 0 ? likeArray : []
                , // Default to empty array if null
                UserCommentsJSON:
                  initialComments[i].UserCommentsJSON != "" &&
                    initialComments[i].UserCommentsJSON != null &&
                    initialComments[i].UserCommentsJSON != undefined
                    ? JSON.parse(initialComments[i].UserCommentsJSON)
                    : [], // Default to empty array if null
                userHasLiked: initialComments[i].userHasLiked,
                UserProfile: initialComments[i].UserProfile
              }
              initialArray.push(arr);
            })

        }
        setComments(initialArray)
        // setComments(
        //   initialComments.map((res) => ({
        //     Id: res.Id,
        //     UserName: res.UserName,
        //     AuthorId: res.AuthorId,
        //     Comments: res.Comments,
        //     Created: new Date(res.Created).toLocaleString(), // Formatting the created date
        //     UserLikesJSON:
        //       res.UserLikesJSON != "" &&
        //         res.UserLikesJSON != null &&
        //         res.UserLikesJSON != undefined
        //         ? JSON.parse(res.UserLikesJSON)
        //         : [], // Default to empty array if null
        //     UserCommentsJSON:
        //       res.UserCommentsJSON != "" &&
        //         res.UserCommentsJSON != null &&
        //         res.UserCommentsJSON != undefined
        //         ? JSON.parse(res.UserCommentsJSON)
        //         : [], // Default to empty array if null
        //     userHasLiked: res.userHasLiked,
        //     UserProfile: res.UserProfile,
        //     // Initialize as false
        //   }))
        // );

        // getUserProfilePicture(CurrentUser.Id,sp).then((url) => {
        //   if (url) {
        //     console.log("Profile Picture URL:", url);
        //   } else {
        //     console.log("No profile picture found.");
        //   }
        // });
      });
  }
  const ApiLocalStorageData = async () => {


    //Get the Id parameter
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    // const queryString = decryptId(Number(updatedString));
    setIdNum(idNum);
    // setArrDetails(await getProjectDetailsById(sp, Number(idNum)));
    const projectDetails = await getProjectDetailsById(sp, Number(idNum));

// Step 2: Set the global variable with the project name or other details
setArrDetails(projectDetails); // Assuming this sets the global state or variable

// Step 3: Use the project name to fetch other details if it's stored in `projectDetails`
if (projectDetails ) {
  // Replace `fetchOtherDetailsByProjectName` with your actual function
  const additionalDetails = await fetchOtherDetailsByProjectName();

  // Do something with the additional details
  console.log(additionalDetails);
}
  };

  const ApICallData = async () => {


    setCurrentUser(await getCurrentUser(sp, siteUrl));
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));
    console.log(CurrentUserProfile, "CurrentUserProfile");
  };

  const [showModal, setShowModal] = useState(false);

  const openModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    getAllFilesForProject()
    e.preventDefault()
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false);
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

  const openprojectlibrary = ()=>{



  }
  // const copyToClipboard = (Id: number) => {
  //   const link = `${siteUrl}/SitePages/ProjectDetails.aspx?${Id}`;
  //   navigator.clipboard
  //     .writeText(link)
  //     .then(() => {
  //       setCopySuccess("Link copied!");
  //       setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
  //     })
  //     .catch((err) => {
  //       setCopySuccess("Failed to copy link");
  //     });
  // };
  // Add a new comment
  const handleAddComment = async () => {
 
    if (newComment.trim() === "") return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sp.web.lists
      .getByTitle("ARGProjectComments")
      .items.add({
        UserName: CurrentUser.Title,
        Comments: newComment,
        UserLikesJSON: "",
        UserCommentsJSON: "",
        userHasLiked: false,
        ARGProjectId: ArrDetails[0].Id,
        UserProfile: CurrentUserProfile,
      })
      .then(async (ress: any) => {
        console.log(ress, "ressress");
        const newCommentData1: Comment = {
          Id: ress.data.Id,
          UserName: ress.data.UserName,
          AuthorId: ress.data.AuthorId,
          Comments: ress.data.Comments,
          Created: new Date(ress.data.Created).toLocaleString(),
          UserLikesJSON: [],
          UserCommentsJSON: [],
          userHasLiked: false, // Initialize as false
          UserProfile: ress.data.UserProfile,
        };
        setComments((prevComments) => [...prevComments, newCommentData1]);
        let notifiedArr = {
          ContentId: ArrDetails[0].Id,
          NotifiedUserId: ArrDetails[0].AuthorId,
          ContentType0: "Comment",
          ContentName: ArrDetails[0].Title,
          ActionUserId: CurrentUser.Id,
          DeatilPage: "ProjectDetails",
          ReadStatus: false
        }
        const nofiArr = await addNotification(notifiedArr, sp)
        console.log(nofiArr, 'nofiArr');
       
        setNewComment("");
        setLoading(false);
      });

    // setComments((prevComments) => [...prevComments, newCommentData]);
  };

  // Add a like to a comment
  // const handleLikeToggle = async (commentIndex: number) => {
  //   const updatedComments = [...comments];
  //   const comment = updatedComments[commentIndex];

  //   // Check if the user has already liked the comment
  //   const userLikeIndex = comment.UserLikesJSON.findIndex(
  //     (like: Like) => like.UserName === CurrentUser.Title // Replace with actual username property
  //   );

  //   if (userLikeIndex === -1) {
  //     // User hasn't liked yet, proceed to add a like
  //     await sp.web.lists
  //       .getByTitle("ARGProjectUserLikes")
  //       .items.add({
  //         UserName: CurrentUser.Title, // Replace with actual username
  //         Like: true,
  //         // ARGBlogsCommentsId: comment.Id,
  //         ProjectCommentsId:comment?.Id,
  //         userHasLiked: true,
  //       })
  //       .then(async (ress: any) => {
  //         console.log(ress, "Added Like");

  //         // Add the new like to the comment's UserLikesJSON array
  //         const newLikeJson: Like = {
  //           ID: ress.data.Id,
  //           AuthorId: ress.data.AuthorId,
  //           UserName: ress.data.UserName, // Replace with actual username
  //           like: "yes",
  //           Created: ress.data.Created,
  //           Count: comment.UserLikesJSON.length + 1,
  //         };

  //         updatedComments[commentIndex].UserLikesJSON.push(newLikeJson);

  //         // Update the corresponding SharePoint list
  //         await sp.web.lists
  //           .getByTitle("ARGProjectComments")
  //           .items.getById(comment.Id)
  //           .update({
  //             UserLikesJSON: JSON.stringify(
  //               updatedComments[commentIndex].UserLikesJSON
  //             ),
  //             userHasLiked: true,
  //             LikesCount: comment.UserLikesJSON.length,
  //           })
  //           .then(() => {
  //             console.log("Updated comment with new like");
  //             comment.userHasLiked = true;
  //             setComments(updatedComments);
  //           });
  //       });
  //   } else {
  //     // User already liked, proceed to unlike (remove like)
  //     const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like

  //     await sp.web.lists
  //       .getByTitle("ARGProjectUserLikes")
  //       .items.getById(userLikeId)
  //       .delete()
  //       .then(async () => {
  //         console.log("Removed Like");

  //         // Remove the like from the comment's UserLikesJSON array
  //         updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);

  //         // Update the corresponding SharePoint list
  //         await sp.web.lists
  //           .getByTitle("ARGProjectComments")
  //           .items.getById(comment.Id)
  //           .update({
  //             UserLikesJSON: JSON.stringify(
  //               updatedComments[commentIndex].UserLikesJSON
  //             ),
  //             userHasLiked: false,
  //             LikesCount: comment.UserLikesJSON.length,
  //           })
  //           .then(() => {
  //             console.log("Updated comment after removing like");
  //             comment.userHasLiked = false;
  //             setComments(updatedComments);
  //           });
  //       });
  //   }
  // };
  const handleLikeToggle = async (commentIndex: number) => {
    setLoadingLike(true);
    const updatedComments = [...comments];
    const comment = updatedComments[commentIndex];

    const userLikeIndex = comment.UserLikesJSON.findIndex(
      (like: Like) => like.UserName === CurrentUser.Title
    );
try{
 
    if (userLikeIndex === -1) {
      // Add a new like
      await sp.web.lists
        .getByTitle("ARGProjectUserLikes")
        .items.add({
          UserName: CurrentUser.Title,
          Like: true,
          ProjectCommentsId: comment.Id,
          userHasLiked: true,
        })
        .then(async (res: any) => {
          const newLikeJson: Like = {
            ID: res.data.Id,
            AuthorId: res.data.AuthorId,
            UserName: res.data.UserName,
            like: "yes",
            Created: res.data.Created,
            Count: comment.UserLikesJSON.length + 1,
          };

          updatedComments[commentIndex] = {
            ...comment,
            UserLikesJSON: [...comment.UserLikesJSON, newLikeJson],
            userHasLiked: true,
          };

          setComments(updatedComments);
          let notifiedArr = {
            ContentId: ArrDetails[0].Id,
            NotifiedUserId: ArrDetails[0].AuthorId,
            ContentType0: "Like",
            ContentName: ArrDetails[0].Title,
            ActionUserId: CurrentUser.Id,
            DeatilPage: "ProjectDetails",
            ReadStatus: false
          }
          const nofiArr = await addNotification(notifiedArr, sp)
          console.log(nofiArr, 'nofiArr');
        });
    } else {
      // Remove the like
      const userLikeId = comment.UserLikesJSON[userLikeIndex].ID;

      await sp.web.lists
        .getByTitle("ARGProjectUserLikes")
        .items.getById(userLikeId)
        .delete()
        .then(async () => {
          updatedComments[commentIndex] = {
            ...comment,
            UserLikesJSON: comment.UserLikesJSON.filter(
              (_, idx) => idx !== userLikeIndex
            ),
            userHasLiked: false,
          };

          setComments(updatedComments);
          let notifiedArr = {
            ContentId: ArrDetails[0].Id,
            NotifiedUserId: ArrDetails[0].AuthorId,
            ContentType0: "UnLike",
            ContentName: ArrDetails[0].Title,
            ActionUserId: CurrentUser.Id,
            DeatilPage: "ProjectDetails",
            ReadStatus: false
          }
          const nofiArr = await addNotification(notifiedArr, sp)
          console.log(nofiArr, 'nofiArr');
        });
    }
  }
  catch (error) {
    setLoadingLike(false);
    console.error('Error toggling like:', error);
  }
  finally {
    setLoadingLike(false); // Enable the button after the function completes
  }
  };

  const openDocument = async (e: any, documentId: number) => {
    e.preventDefault()
    const document = await sp.web.lists
      .getByTitle("ProjectDocs")
      .items.getById(documentId)
      .select("FileRef")();
    window.open(document.FileRef, "_blank");
  };

  // Add a reply to a comment
  const handleAddReply = async (commentIndex: number, replyText: string) => {

    setLoadingReply(true);
    try {
    if (replyText.trim() === "") return;
    const updatedComments = [...comments];

    const comment = updatedComments[commentIndex];
    await sp.web.lists
      .getByTitle("ARGProjectUserComments")
      .items.add({
        UserName: CurrentUser.Title, // Replace with actual username
        Comments: replyText,
        ARGProjectCommentsId: updatedComments[commentIndex].Id,
        // EventsCommentsId: updatedComments[commentIndex].Id,
      })
      .then(async (ress: any) => {
        console.log(ress, "ressress");
        const newReplyJson = {
          Id: ress.data.Id,
          AuthorId: ress.data.AuthorId,
          UserName: ress.data.UserName, // Replace with actual username
          Comments: ress.data.Comments,
          Created: ress.data.Created,
          UserProfile: CurrentUserProfile,
        };
        updatedComments[commentIndex].UserCommentsJSON.push(newReplyJson);
        await sp.web.lists
          .getByTitle("ARGProjectComments")
          .items.getById(updatedComments[commentIndex].Id)
          .update({
            // UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
            UserCommentsJSON: JSON.stringify(
              updatedComments[commentIndex].UserCommentsJSON
            ),
            userHasLiked: updatedComments[commentIndex].userHasLiked,
            CommentsCount: comment.UserCommentsJSON.length + 1,
          })
          .then(async (ress: any) => {
            console.log(ress, "ressress");
            setComments(updatedComments);
            let notifiedArr = {
              ContentId: ArrDetails[0].Id,
              NotifiedUserId: ArrDetails[0].AuthorId,
              ContentType0: "Reply",
              ContentName: ArrDetails[0].Title,
              ActionUserId: CurrentUser.Id,
              DeatilPage: "ProjectDetails",
              ReadStatus: false
            }
            const nofiArr = await addNotification(notifiedArr, sp)
            console.log(nofiArr, 'nofiArr');
          });
      });
    }
    catch (error) {
      setLoadingReply(false);
      console.error('Error toggling Reply:', error);
    }
    finally {
      setLoadingReply(false); // Enable the button after the function completes
    }
  };

  const Breadcrumb = [
    {
      MainComponent: "Home",
      MainComponentURl: `${siteUrl}/SitePages/Dashboard.aspx`,
    },
    {
      ChildComponent: "Project Details",
      ChildComponentURl: `${siteUrl}/SitePages/ProjectDetails.aspx?${CurrentID}`,
    },
  ];
  //#endregion
  console.log(ArrDetails, "console.log(ArrDetails)");
  const sendanEmail = (item:any) => {
    // window.open("https://outlook.office.com/mail/inbox");
 
     const subject ="Project Title-"+ item.ProjectName;
     const body = 'Here is the link to the Project:'+ `${siteUrl}/SitePages/ProjectDetails.aspx?${item.Id}`;
 
    //const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(office365MailLink, '_blank');
    // Open the link to launch the default mail client (like Outlook)
    //window.location.href = mailtoLink;
   };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setLoading(true);
  //   const files = Array.from(e.target.files || []); // Ensure files is an array of type File[]

  //   try {
  //     // Define allowed MIME types
  //     const allowedTypes = [
  //       'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml',
  //       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       'application/pdf', 'application/vnd.ms-excel',
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  //       'text/csv', 'text/tsx'
  //     ];

  //     // Filter only the allowed file types
  //     let filteredFiles = files.filter(file => allowedTypes.includes(file.type));

  //     if (filteredFiles.length === 0) {
  //      
  //       setLoading(false);
  //       return;
  //     }

  //     // Add filtered files to state
  //     setSelectedFiles(prevFiles => [...prevFiles, ...filteredFiles]);
  //   } catch (error) {
  //     console.error('Error handling file input:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const [error, setError] = useState<string>('');  
  // Function to remove a file from the selected files array
  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setLoading(true);
  //   const files = Array.from(e.target.files || []);  // Ensure files is an array of type File[]
 
  //   try {
     
  //     const allowedTypes = [
  //       'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml',
  //       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       'application/pdf', 'application/vnd.ms-excel',
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  //       'text/csv', 'text/tsx'
  //     ];
 
  //     // Filter valid files based on MIME types
  //     const filteredFiles = files.filter(file => allowedTypes.includes(file.type));
  //     console.error('here is my filteredFiles:', filteredFiles);
  //     if (filteredFiles.length === 0) {
  //       setError("Only PNG, JPG, SVG, DOC, DOCX, PDF, EXCEL, PPT, CSV, and TSX files are allowed.");
  //       setLoading(false);
  //       return;
  //     }
 
  //     setError('');
  //     setSelectedFiles(filteredFiles);
  //   } catch (error) {
  //     console.error('Error handling file input:', error);
  //     setError('An error occurred while processing the files.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = Array.from(e.target.files || []);  // Ensure files is an array of type File[]
 
    try {
     
      const allowedTypes = [
        'image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf', 'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/csv', 'text/tsx'
      ];
 
      // Filter valid files based on MIME types
      const filteredFiles = files.filter(file => allowedTypes.includes(file.type));
 
      if (filteredFiles.length === 0) {
        setError("Only PNG, JPG, SVG, DOC, DOCX, PDF, EXCEL, PPT, CSV, and TSX files are allowed.");
        setLoading(false);
        return;
      }
 
      setError('');
      setSelectedFiles(filteredFiles);
    } catch (error) {
      console.error('Error handling file input:', error);
      setError('An error occurred while processing the files.');
    } finally {
      setLoading(false);
    }
  };
//   const uploadfileinfolder = async()=>{
//     console.log("hernter here in ")
//     console.log(selectedFiles , " Here is my selected files")
//   for (const file of selectedFiles) {

//     try {
//       console.log(`Uploading file: ${file.name}`);
//       console.log(`filemanager: ${filemanager}`);
     
//       // Reference the folder by server-relative path
//       const uploadFolder = sp.web.getFolderByServerRelativePath(`${filemanager}`);
//       console.log(uploadFolder , "uplaodfold")
//       // Upload the file using addChunked (use appropriate chunk size if needed)
//       const uploadResult = await uploadFolder.files.addChunked(file.name, file)
//       if(uploadResult){
//         await Swal.fire(
//           'Uploaded!',
//           'The file has been successfully Uploaded.',
//           'success'
//       );
//       getAllFilesForProject()
//       setSelectedFiles([])
//       }
 
//       console.log(`Upload successful for file: ${file.name}`);
//     } catch (error) {
//       console.error(`Error uploading file: ${file.name}`, error);
//     }
//   }
     

// }
const sanitizeFileName = (name:any) => {
  // Remove invalid characters
  return name.replace(/[<>:"/\\|?*%#]/g, '_'); // Replace invalid characters with an underscore
};
const uploadfileinfolder = async () => {
  console.log("Entering upload function");
   if(selectedFiles.length > 0 ){
    try {
      for (const file of selectedFiles) {
          console.log(`Uploading file: ${file.name}`);
          console.log(`filemanager: ${filemanager}`);
 
   
          const sanitizedFileName = sanitizeFileName(file.name);
          console.log(`Sanitized file name: ${sanitizedFileName}`);
 
          const uploadFolder = sp.web.getFolderByServerRelativePath(filemanager);
          console.log(uploadFolder, "uploadFolder");
 
   
          const uploadResult = await uploadFolder.files.addChunked(sanitizedFileName, file);
 
          if (uploadResult) {
              console.log(`Upload successful for file: ${file.name}`);
          }
      }
 
 
      await Swal.fire(
          'Uploaded!',
          'All files have been successfully uploaded.',
          'success'
      );
      getAllFilesForProject();
      setSelectedFiles([]);
  } catch (error) {
      console.error(`Error uploading file`, error);
  }
   }else{
    await Swal.fire(
      'File Empty!',
      'Please select Files ',
      'warning'
  );
   }

};
 

// const uploadfileinfolder = async () => {
//   console.log("Entering upload function");

//   for (const file of selectedFiles) {
//       try {
//           console.log(`Uploading file: ${file.name}`);
//           console.log(`filemanager: ${filemanager}`);

//           // Sanitize the file name
//           const sanitizedFileName = sanitizeFileName(file.name);
//           console.log(`Sanitized file name: ${sanitizedFileName}`);

//           // Reference the folder by server-relative path
//           const uploadFolder = sp.web.getFolderByServerRelativePath(filemanager.trim());
//           console.log(uploadFolder, "uploadFolder");

//           // Upload the file using addChunked (use appropriate chunk size if needed)
//           const uploadResult = await uploadFolder.files.addChunked(sanitizedFileName, file);

//           if (uploadResult) {
//               await Swal.fire(
//                   'Uploaded!',
//                   'The file has been successfully uploaded.',
//                   'success'
//               );
//               getAllFilesForProject();
//               setSelectedFiles([]);
//           }

//           console.log(`Upload successful for file: ${file.name}`);
//       } catch (error) {
//           console.error(`Error uploading file: ${file.name}`, error);
//       }
//   }
// };


  const removeFile = (fileName: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  // Function to upload files to the document library

  const[argcurrentgroupuser, setArgcurrentgroupuser] = useState([])

  const [files, setFiles] = useState([]);
  async function getAllFilesForProject() {
   
   
    console.log(filemanager, "file manager")
    const response = await sp.web.getFolderByServerRelativePath(`${filemanager}`).files();
    console.log(response, "resonse")
    setFiles(response)
    function isDocumentLibrary(filemanager:any) {
      // Check if the URL contains more than two parts after "/sites/"
      const parts = filemanager.split('/sites/')[1].split('/');
      return parts.length > 2 && !parts.includes('Forms');
  }
 
  function isSubsite(filemanager:any) {
      // Check if the URL contains exactly two parts after "/sites/"
      const parts = filemanager.split('/sites/')[1].split('/');
      return parts.length === 2;
  }
 
  // Example usage

 
  //console.log(isDocumentLibrary(docLibraryUrl)); // true
  //console.log(isSubsite(docLibraryUrl)); // false
 
 
  }


  async function  fetchOtherDetailsByProjectName() {
    console.log(projectname, "projectname")
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    try {
     
       
     
      const getargmember :IList[] = await sp.web.lists.getByTitle('ARGProject').items.filter(`ProjectName eq '${projectname}'`).select("*,TeamMembers/ID,TeamMembers/EMail,TeamMembers/Title").expand("TeamMembers")();
      console.log(getargmember, "getargmember")
      const userList = await sp.web.lists.getByTitle("User Information List").items.select("ID", "Title", "EMail", "Department", "JobTitle", "Picture").filter("EMail ne null")();
      console.log(userList, "userlist")
      setArgcurrentgroupuser(getargmember)
    } catch (error) {
     
    }
    if(projectname){
      const getargmember = await sp.web.lists.getByTitle('ARGProject')
      console.log(getargmember, "getargmember")
    }
   
  }
  const handlePreviewFile =  (fileUrl:any) => {
    window.open(fileUrl, '_blank'); // Open the file in a new tab
  };
  const Handledeletefile = async (fileid:any) => {
    try {
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
          // Fetch the file using its unique ID
          const file = await sp.web.getFileById(fileid)();

          if (file) {
              // Delete the file
              await sp.web.getFileById(fileid).delete();

              await Swal.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
              );

              getAllFilesForProject()
          } else {
             // alert("File not found.");
          }
      }
  } catch (error) {
      console.error("Error deleting file:", error);
      Swal.fire({
          title: 'Error!',
          text: 'Failed to delete file. Check the console for details.',
          icon: 'error',
          confirmButtonText: 'OK'
      });
  }
  };

const [isPopupVisible, setPopupVisible] = useState(false);
const [toggleuserpopup, Settoggleuserpopup] = useState(false);
// const [toggleuserpopup, Settoggleuserpopup] = useState(false);



// this is pop up when folder create click
const togglePopup  =async () => {
  const ids = window.location.search;
const originalString = ids;
const idNum = originalString.substring(1);


  const getdata :any= await sp.web.lists.getByTitle('ARGProject').items.getById(parseInt(idNum))()
  console.log(getdata , "get data ")

    if (getdata.FolderInProgress === null || getdata.FolderInProgress === "") {
   
      setPopupVisible(!isPopupVisible);
    } else if (getdata.FolderInProgress === "In Progress") {
   
      Swal.fire({
        title: 'Folder is in progress!',
        text: 'Please wait until the process is complete.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else if (getdata.FolderInProgress === "Completed") {

      Swal.fire({
        title: 'Folder is already created!',
        text: 'The folder has already been created.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
};


const togglevalue = (e:any) => {
  e.preventDefault()
  Settoggleuserpopup(!toggleuserpopup);
}


// const togglevalue = (e:any) => {
//   e.preventDefault()
//   Settoggleuserpopup(!toggleuserpopup);
// }
  const [name, setName] = useState('');
  const [Overview, setOverview] = useState('');

  // Create folder pop up
  const UpdateItemAndCreateFolder = async (e:any) => {
    e.preventDefault();


    if (!name || !Overview) {

      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } else {
   
      try {

        console.log('Form submitted:', { name, Overview });
        const ids = window.location.search;
        const originalString = ids;
        const idNum = originalString.substring(1);
        console.log(name, "name" , Overview , "overview")
        const updatedValues = {
 
          ProjectFolderName : name,
          FolderOverview: Overview,
          FolderInProgress: "In Progress"
        };
   
     
         await sp.web.lists.getByTitle('ARGProject').items.getById(parseInt(idNum)).update(updatedValues);
   
        Swal.fire({
          title: 'Success!',
          text: 'The form was submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setPopupVisible(!isPopupVisible);
      } catch (error) {

        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

 
  const UpdateTeamMember = async (e: any) => {
    e.preventDefault();
    if(selectedValue.length === 0){
      // Swal.fire("Error", "Please select at least one user.", "error");
      return
    }
    try {
        console.log('Form submitted:', { name, Overview });
        const ids = window.location.search;
        const originalString = ids;
        const idNum = originalString.substring(1);
        console.log(name, "name", Overview, "overview");

        // Fetch the current People Picker value (TeamMembers) from the list item
        const item = await sp.web.lists.getByTitle("ARGProject").items.getById(parseInt(idNum))
            .select("*, TeamMembers/Id, TeamMembers/EMail, TeamMembers/Title")
            .expand("TeamMembers")();
       
        console.log(item, "here is my item");

        // Current People Picker column value (TeamMembers) from the fetched item
        const existingUsers = (item as any)["TeamMembers"] || [];
        console.log(existingUsers, "existing users");

        // Format new users for the People Picker column (only LookupId values)
        const newUsers = selectedValue.map((user: { label: string, value: number }) => ({
            LookupId: user.value, // Use 'LookupId' for People Picker
        }));

        // Extract the LookupId from existing users to avoid duplication
        const existingUserLookupIds = existingUsers.map((user: { Id: number }) => user.Id);

        // Combine existing users with new users, ensuring no duplicates based on 'LookupId'
        const updatedUsers = [
            ...existingUsers.map((user: { Id: number }) => ({ LookupId: user.Id })), // Use 'Id' for existing users
            ...newUsers.filter(newUser => !existingUserLookupIds.includes(newUser.LookupId)) // Avoid duplicates by checking LookupId
        ];

        console.log(updatedUsers, "updatedUsers");

        // Prepare updated values for SharePoint item
        const updatedValues = {
            TeamMembersId: updatedUsers.map(user => user.LookupId), // Ensure it's an array
        };
       
        // Update the SharePoint item
        const updatedItem =  await sp.web.lists.getByTitle('ARGProject').items.getById(parseInt(idNum)).update(updatedValues);
        if(updatedItem){

          togglevalue(e)
 
 
               // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Users added successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
      });
      ApiLocalStorageData()
        }
       
     

        // Close popup (toggle visibility)

    } catch (error) {
        console.error('Error updating item:', error);

        // Show error message
        Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};


  const DeleteFileFromFileMaster =async (fileId:any) =>{
    try {
   
      const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'Do you really want to delete this file? This action cannot be undone.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
      });

      // Check if user confirmed
      if (result.isConfirmed) {
          // Delete the file
          await sp.web.getFileById(fileId).delete();
         
         
          await Swal.fire(
              'Deleted!',
              'The file has been deleted successfully.',
              'success'
          );
          getAllFilesForProject()
      } else {
          // Optionally handle the cancel action
          await Swal.fire(
              'Cancelled',
              'The file was not deleted.',
              'info'
          );
      }
  } catch (error) {
      console.error('Error deleting file:', error);
 
      await Swal.fire(
          'Error!',
          'There was an error deleting the file.',
          'error'
      );
  }
  }
  const handleSaveComment = async (id: number, newText: string) => {
    // Logic for saving a comment goes here
    // For example:

    await sp.web.lists
      .getByTitle("ARGProjectComments")
      .items.getById(id)
      .update({
        Comments: newText,
        ARGProjectId: Number(INGLOBAL)
      });
  };

  const handleDeleteComment = async (commentId: number) => {
    try {

      const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you really want to delete this item? This action cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete it!",
      });

      // If confirmed, proceed to delete
      if (result.isConfirmed) {
          await sp.web.lists.getByTitle("ARGProjectComments").items.getById(commentId).delete();
          getApiData();
   
          Swal.fire({
              title: "Deleted!",
              text: "The item has been successfully deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
          });
      }
  } catch (error) {
   
      Swal.fire({
          title: "Error!",
          text: `There was an issue deleting the item: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
      });
      console.error(`Error deleting item `, error);
  }
  }

//   const handleRemoveUser = async (userId: number) => {
   
//     try {
//         const itemId = argcurrentgroupuser[0]?.Id;
//      
//         if (!itemId) {
//      
//             return;
//         }

//         if (!userId) {
//        
//             return;
//         }

//         // Fetch the item with expanded TeamMembers
//         const item = await sp.web.lists
//             .getByTitle("ARGProject")
//             .items.getById(itemId)
//             .select("*, TeamMembers/Id, TeamMembers/EMail, TeamMembers/Title")
//             .expand("TeamMembers")();

//         console.log("Current item:", item);

//         // Existing users in TeamMembers field
//         const currentUsers = item.TeamMembers || [];
//         console.log("Current users in TeamMembers:", currentUsers);

//         // Filter out the user to be removed
//         const updatedUsers = currentUsers.filter((user: any) => user.Id !== userId);
//         console.log("Updated users list:", updatedUsers);

//         // Prepare the updated array of LookupIds for SharePoint
//         const updatedValues = {
//             TeamMembersId: { results: updatedUsers.map((user: any) => user.Id) },
//         };

//         // Update the SharePoint item
//         await sp.web.lists
//             .getByTitle("ARGProject")
//             .items.getById(itemId)
//             .update(updatedValues);

//      
//     } catch (error) {
//         console.error("Error removing user:", error);
//      
//     }
// };
const handleRemoveUser = async (userId: number) => {
  Swal.fire({
    title: 'Do you want to remove project member?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    icon: 'warning'
  }
  ).then(async (result) => {
    console.log(result)
    if (result.isConfirmed) {
      try {
        const ids = window.location.search;
        const idNum = ids.substring(1);

        if (!idNum) {

          return;
        }

        // Fetch the current People Picker value (TeamMembers) from the list item
        const item = await sp.web.lists.getByTitle("ARGProject").items.getById(parseInt(idNum))
          .select("*, TeamMembers/Id, TeamMembers/EMail, TeamMembers/Title")
          .expand("TeamMembers")();

        console.log(item, "here is my item");

        // Current People Picker column value (TeamMembers) from the fetched item
        const existingUsers = (item as any)["TeamMembers"] || [];
        console.log(existingUsers, "existing users");

        // Filter out the user to be removed
        const updatedUsers = existingUsers.filter((user: { Id: number }) => user.Id !== userId);

        console.log(updatedUsers, "updatedUsers after removal");

        // Prepare updated values for SharePoint item
        const updatedValues = {
          TeamMembersId: updatedUsers.map((user: { Id: number }) => user.Id), // Use 'Id' to update TeamMembers
        };

        console.log(updatedValues, "updatedValues");

        // Update the SharePoint item
        const updatedItem = await sp.web.lists.getByTitle("ARGProject").items.getById(parseInt(idNum)).update(updatedValues);

        // Show success message
        Swal.fire({
          title: "Success!",
          text: "User removed successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        ApiLocalStorageData()
      } catch (error) {
        console.error("Error removing user:", error);

        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }})
 
};

// useEffect(()=>{
//   // getAllFilesForProject()
//   const getFileCount=async()=>{
//     const response = await sp.web.getFolderByServerRelativePath(`${filemanager}`).files();
//     console.log(response, "resonse in effect ")
//     setFiles(response)
//   }
//   getFileCount();
 
// },[])

useEffect(()=>{
  // getAllFilesForProject()
  const getFileCount=async()=>{
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    const data =await getProjectDetailsById(sp, Number(idNum));
    console.log("resonse in effect  data",data);
    const response = await sp.web.getFolderByServerRelativePath(`${data[0].ProjectFileManager}`).files();
    console.log(response, "resonse in effect ")
    setFiles(response)
  }
  getFileCount();
 
},[])

  return (
    <div id="wrapper" ref={elementRef}>
      <div className="app-menu" id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div
          className="content "
          style={{
            marginLeft: `${!useHide ? "240px" : "80px"}`,
            marginTop: "0rem",
          }}
        >
          <div className="container-fluid paddb">
          {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={togglePopup}>
              &times; {/* Cross mark */}
            </button>
            <h2>Popup Form</h2>
            <form>
              <label htmlFor="name">Folder Name:</label>
              <input  type="text"
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)} />
              <br />
              <label htmlFor="Overview">Overview:</label>
              <input  type="email"
        id="Overview"
        name="Overview"
        value={Overview}
        onChange={(e) => setOverview(e.target.value)} />
              <br />
              <button type="submit" onClick={UpdateItemAndCreateFolder}>Submit</button>
            </form>
          </div>
        </div>
      )}
          {toggleuserpopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={togglevalue}>
              &times; {/* Cross mark */}
            </button>
            <h2>Add Users</h2>
            <form>
              <label htmlFor="name">Select Users </label>
                {/* React-Select component */}
                <Select
                options={users}
                value={selectedValue}
                onChange={(selectedOption:any) => onSelect(selectedOption)} // For multi-select, you'll need to handle array of options
                isMulti
              />

              {/* Multiselect component */}
              {/* <Multiselect
                options={users}  // Same options for both Select and Multiselect
                selectedValues={selectedValue}
                onSelect={onSelect} // Called when items are selected
                onRemove={onRemove} // Called when items are removed
                displayValue="label" // Display name of the user
              /> */}
              <button type="submit" onClick={UpdateTeamMember}>Submit</button>
            </form>
          </div>
        </div>
      )}
            <div className="row ">
              <div className="col-lg-8 mt-0">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
         
            </div>
            {ArrDetails.length > 0
              ? ArrDetails.map((item: any, index) => {

                console.log(item?.Author?.Email , "email" )
                console.log(item?.Author?.Title , "email" )
           
                if(item.Author.EMail === currentUserEmailRef.current){
       
                }
              //   if (item.ProjectStatus === "Completed") {
              //     var div = document.querySelector('.col-md-6.mobile-w2') as HTMLElement;
              //     if (div) {
              //         div.style.pointerEvents = 'none';
              //         div.style.opacity = '0.5'; // Optional: Makes the div look disabled
              //     } else {
              //         console.error("Element not found: .col-md-6.mobile-w2");
              //     }
              // }
             
              if (item.ProjectStatus === "Completed") {
                isProjectCompleted = "Completed"
                const div = document.querySelector('.col-md-6.mobile-w2') as HTMLElement;
                if (div) {
                    // Make all input fields and other form elements read-only
                    const formElements = div.querySelectorAll('input, textarea, select, button');
                    formElements.forEach(element => {
                        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                            (element as HTMLInputElement).readOnly = true;
                        } else if (element.tagName === 'BUTTON') {
                            (element as HTMLButtonElement).disabled = true;
                        }
                    });
           
                    // Optionally, set pointer-events to none to visually indicate disabled state
                    div.style.pointerEvents = 'none';
                    div.style.opacity = '0.5';
           
                    // Optional: Add a message indicating the section is read-only
                    const message = document.createElement('div');
                    // message.innerText = "This section is read-only.";
                    message.style.color = "red";
                    message.style.fontSize = "14px";
                    div.appendChild(message);
                } else {
                    console.error("Element not found: .col-md-6.mobile-w2");
                }
            }
             
                const ProjectsDocsJSON =
                  item.ProjectsDocsJSON == undefined ||
                    item.ProjectsDocsJSON == null
                    ? ""
                    : JSON.parse(item.ProjectsDocsJSON);
                console.log(ProjectsDocsJSON);
                { projectname = item.ProjectName}
                {filemanager = item.ProjectFileManager}
                return (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-3 mobile-w1">
                       
                      <p className="d-block mt-2 font-28">
                     
                        {item.ProjectName}
                      </p>
                      <div className="row ">
                      <p
                        style={{ lineHeight: "22px", fontSize:'15px', position:'sticky', top:'90px'}}
                        className="d-block text-dark mt-2"
                      >
                        {item.ProjectOverview}
                      </p>
                     
                    </div>
                      <div style={{ position:'sticky', top:'90px'}}  className="row mt-2">
                        <div className="col-md-12 col-xl-12">
                        <div style={{cursor:'pointer'}} className="tabcss sameh mb-2 mt-2 me-1">

                        <button type="button" className="opend"
                  onClick={(e) => openModal(e)}
                 
                >
                  {/* <FilePlus />  Documents */}
                  <FilePlus style={{marginTop:'-2px'}} />  Documents <span>[{files.length}]</span>
             
                </button>
                        </div>
                        <div className="tabcss mb-2 mt-2 me-1 newalign"> <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={14} />{" "}  Start Date:&nbsp;
                             {moment(item.StartDate).format("DD-MMM-YYYY")}{" "}
                             
                            </span>  </div>
                        <div className="tabcss mb-2 mt-2 me-1 newalign"> <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={14} />{" "} End Date:&nbsp;
                             {moment(item.DueDate).format("DD-MMM-YYYY")}{" "}
                             
                            </span>  </div>
                            <div style={{cursor:'pointer'}} className="tabcss mb-2 sameh mt-2 me-1 ">
                            <span className="text-nowrap mb-0 d-inline-block" onClick={() => isProjectCompleted ? "":sendanEmail(item)} >
                              <Share size={14} /> Share by email
                            </span>
                            </div>
                            {/* <div className="tabcss sameh mb-3 mt-2 me-1 "> */}
                            {/* <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={() => openprojectlibrary()}
                            >
                              <Link size={14} /> Copy link
                              {copySuccess && (
                                <span className="text-success">
                                  {copySuccess}
                                </span>
                              )}
                            </span> */}
                             {/* <span
                             {/* <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={togglePopup}
                            >
                             Create Folder
                             
                            </span> */}
                            </div>
                          {/* <p  style={{
                             
                              margin: "11px",
                            }}   className="mb-2 mt-1 newt6 font-14">
                           
                           
                           
                            <div
                              style={{
                             
                                position: "relative",
                              }}
                            >
                              <div style={{ display: "flex", marginTop:"-6px" }}>
                                {item?.TeamMembers?.map(
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
                                          className="rounded-circlecss pimg text-center img-thumbnail avatar-xl"
                                          alt="profile-image"
                                        />
                                      );
                                    }
                                  }
                                )}
                                {item?.TeamMembers?.length > 3 && (
                                  <div
                                    className="pimg"
                                    onClick={() => toggleDropdown(item.Id)}
                                    key={item.Id}
                                  >
                                    <div
                                      style={{
                                        textAlign: "center",
                                        margin:
                                          index == 0
                                            ? "0 0 0 0"
                                            : "0 0 0px -12px",
                                            float:"left"
                                      }}
                                      className="rounded-circlecss  text-center img-thumbnail avatar-xl"
                                    >
                                      +
                                    </div>
                                  </div>
                                )}
                              </div>
                              {showDropdownId === item.Id && (
                                <div
                                  className="card"
                                  style={{
                                    position: "absolute",
                                    zIndex: "99",
                                    background: "#fff",
                                    padding: "1rem",
                                    width: "30rem",
                                  }}
                                >
                                  {showDropdownId === item.Id &&
                                    item?.TeamMembers?.map(
                                      (id: any, idx: any) => {
                                        return (
                                          <div className="m-1 border-bottom pb-2">
                                            <img
                                              style={{}}
                                              src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                              className="rounded-circlecss img-thumbnail avatar-xl"
                                              alt="profile-image"
                                            />{" "}
                                            {id?.EMail}
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              )}
                            </div>
                          </p> */}
                        </div>
                      </div>
                     


                   

                    <div className="col-md-6 mobile-w2">
                      <div className="row mt-2">
              <div >
                <div
                  className="card"
                  style={{
                    border: "1px solid #54ade0",
                    borderRadius: "20px",
                    boxShadow: "0 3px 20px #1d26260d",
                  }}
                >
                  <div className="p-4">
                    {/* New comment input */}
                    <h4 className="mt-0 mb-3 text-dark fw-bold font-16">
                      Project Insights
                    </h4>
                    <div className="mt-3">
                      <textarea
                        id="example-textarea"
                        className="form-control text-dark  mb-0"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your Project Insights here..."
                        rows={3}
                        style={{ borderRadius: "unset" }}
                      />
                       {/* <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name}
              <button onClick={() => removeFile(file.name)} style={{ marginLeft: '10px', color: 'red' }}>❌</button>
            </li>
          ))}
        </ul> */}
                        

{/* <div>

  <Link style={{ width: "20px", height: "16px" }} onClick={() => handleImageChange} />

  <input

    type="file"

    multiple

    accept="image/*"

    onChange={handleImageChange}

    className="fs-6 w-50" aria-rowspan={5} style={{ display: 'none' }}

  />

</div> */}

  <div className="p-2 bg-light d-flex justify-content-end align-items-center">

                      <button type="button"
                        className="btn btn-primary primary1 mt-1 mb-1"
                        onClick={handleAddComment}
                        disabled={loading} // Disable button when loading
                      >
                        <FontAwesomeIcon style={{float:'left',margin:"7px 6px 0px 0px"}} icon={faPaperPlane} /> 
                        {loading ? "Submitting..." : "Post"}{" "}
                        {/* Change button text */}
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row ">
              {/* New comment input */}

              {comments.map((comment, index) => (
             
                <div className="col-xl-12" style={{ marginTop: "1rem" }}>

                   {console.log("comment json", comment)}
                  <CommentCard
                    key={index}
                    commentId={index}
                    username={comment.UserName}
                    AuthorID={comment.AuthorId}
                    Commenttext={comment.Comments}
                    Comments={comments}
                    Created={comment.Created}
                    likes={comment.UserLikesJSON}
                    replies={comment.UserCommentsJSON}
                    userHasLiked={comment.userHasLiked}
                    CurrentUserProfile={CurrentUserProfile}
                    currentuserid = {currentuseridglobal}
                    loadingLike={loadingLike}
                    Action="Project"
                    userProfile={comment?.UserProfile}
                    onAddReply={(text:any) => handleAddReply(index, text)}
                    onLike={() => isProjectCompleted ? "" :handleLikeToggle(index)} // Pass like handler
                    loadingReply={loadingReply}
                      onSaveComment={(text:any)=>handleSaveComment(comment.Id,text)}
                      ondeleteComment={()=>handleDeleteComment(comment.Id)}
                  />
                </div>
              ))}
            </div>

                      </div>

                      <div className="col-md-3 mobile-w3">

<div className="card mobile-5 mt-2"  style={{ borderRadius: "22px", position:'sticky', top:'90px' }}>
<div className="card-body pb-3 gheight">
                          {}
                          <h4 className="header-title font-16 text-dark fw-bold mb-0"  style={{ fontSize: "20px" }}>Project Owner</h4>
                         <div className="displcenter">
                          <img
          src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item?.Author?.EMail}`}
          className="rounded-circlecss68 img-thumbnail avatar-xl"
          alt="profile-image"
        /></div>
                          <h1 className="text-muted font-14 mt-1"><p className="text-dark font-16 text-center mb-2"> {item.Author.Title}</p>
                          {/* <p className="text-muted font-14 text-center mb-1">Cloud Infrastructure Alchemist</p> */}
                          <p className="text-muted font-12 text-center">{item.Author.EMail} </p>
                          </h1></div>
    </div>

<div className="card mobile-5 mt-2"  style={{ borderRadius: "22px", position:'sticky', top:'310px' }}>
  <div className="card-body pb-3 gheight">
    <h4 className="header-title font-16 text-dark fw-bold mb-3"  style={{ fontSize: "20px" }}>Project Members</h4>
    {item.Author.EMail === currentUserEmailRef.current && !isProjectCompleted && (
    <div>
     <button className="plusiconalign" onClick={(e)=>togglevalue(e)}> <img

src={require("../assets/plus.png")}

className="newplusicon" alt="add user" /> </button>
  <i className="fe-plus-circle"></i>
 
    </div>
 
)}
     {/* {argcurrentgroupuser */}
     {argcurrentgroupuser[0]?.TeamMembers?.length > 0 && argcurrentgroupuser[0]?.TeamMembers?.map(
  (id: any, idx: any) => {
    console.log(id, 'id');
    console.log(id.Id, 'id');
    // {console.log("argcurrentgroupuser[0]?.TeamMembers",argcurrentgroupuser[0]?.TeamMembers)}
    if (idx >=0 ) {
      return (
        <div className="projectmemeber">
<img
          // style={{
          //   margin:
          //     index == 0
          //       ? "0 0 0 0"
          //       : "0 0 0px -12px",
          // }}
          src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
          className="rounded-circlecss6 img-thumbnail avatar-xl"
          alt="profile-image"
        />
        <p className="mb-0">{id?.Title} </p>
        {item.Author.EMail === currentUserEmailRef.current && (
        <div>
        {/* <button onClick={()=>handleRemoveUser(id?.ID)}>Remove</button> */}

        <a onClick={()=>handleRemoveUser(id?.ID)} className="action-icon text-danger">
          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="trash-can" className="svg-inline--fa fa-trash-can " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path fill="currentColor" d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z">
            </path></svg></a>
        </div>

        )
       
        }
     
        {/* <p className="mb-0">{id?.Title} </p> */}
       
        {!isProjectCompleted &&
              <img

src={require("../assets/calling.png")}

className="alignright"

onClick={() =>

  window.open(

    `https://teams.microsoft.com/l/call/0/0?users=${id.EMail}`,

    "_blank"

  )

}

alt="Call"

/> }
        </div>
       
      );
    }
  }
)}
     {/* } */}
   
    </div>
   
    </div>

 
</div>


                    <div className="row internalmedia filterable-content mt-3">
                      <Modal show={showModal} onHide={closeModal} className="minw80">
                        <h3 style={{width:'100%', textAlign:'left',borderBottom:'0px solid #efefef',  padding:'15px', fontSize:'18px'}} className="modal-title">Documents</h3>
                        <Modal.Header closeButton style={{position:'absolute', display:'flex', gap:'20px', top:'-6px', right:'0px', borderBottom:'0px solid #ccc'}}>
  <label>
    <div>
      <div className="chosefile">
        <img
          onClick={isProjectCompleted ? null : (e:any) => handleImageChange(e)}
          src={require("../assets/cloud-computing.png")}
          style={{ width: '40px', opacity: isProjectCompleted ? '0.5' : '1', pointerEvents: isProjectCompleted ? 'none' : 'auto' }}
          alt="Check"
        />  
        <span style={{ opacity: isProjectCompleted ? '0.5' : '1' }}>Click To Upload</span>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        className="fs-6 w-50"
        aria-rowspan={5}
        style={{ display: 'none' }}
        disabled={isProjectCompleted} // Disable the file input if project is completed
      />
    </div>
  </label>
  <Button variant="success" onClick={() => uploadfileinfolder()} disabled={isProjectCompleted}>
    Upload File
  </Button>
</Modal.Header>
                        <Modal.Body>
                        <div className="file-cards row">
                        <ul className="listnew">
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name}
              <button onClick={() => removeFile(file.name)} style={{ marginLeft: '10px', color: 'red' }}>❌</button>
            </li>
          ))}
        </ul>
                         
          {files.map((file) => (
            <div className="col-lg-3">
            <Card key={file.UniqueId} style={{  marginBottom: '10px', height:'82px' }} >
              <Card.Body>
                <div className="row">
                  <div className="col-lg-2 wi8">
                  <img
                                  src={require("../assets/file.png")}
                                  style={{width:'40px'  }}
                                  alt="Check"
                                />

                  </div>

                  <div style={{paddingLeft:'13px'}} className="col-lg-9 wi81">
                  <Card.Title className="two-line text-dark font-14 mb-0">{file.Name}</Card.Title>
                  <Card.Text className="text-muted font-12">{file.Length} bytes</Card.Text>
                  </div>
           
             
                {/* Three dots dropdown menu */}
                <div className="col-lg-1 wi82">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id={`dropdown-${file.UniqueId}`} size="sm" className="newaligntext">
                    &#x22EE; {/* Ellipsis icon */}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePreviewFile(file.ServerRelativeUrl)} style={{fontSize:'12px', textAlign:'center'  }}>
                      Preview
                    </Dropdown.Item>
                    <Dropdown.Item
                    onClick={() => Handledeletefile(file.UniqueId)} disabled={isProjectCompleted}
                    // onClick={() => Handledeletefile(file.UniqueId)}
                    style={{fontSize:'12px', textAlign:'center'  }}>
                      Delete File
                    </Dropdown.Item>
                    {/* Add more options if needed */}
                  </Dropdown.Menu>
                </Dropdown>
                </div>
                </div>
               
              </Card.Body>
            </Card>
            </div>
          ))}
        </div>
                        </Modal.Body>
                          {/* {ProjectsDocsJSON.length > 0 ? (
                            ProjectsDocsJSON.map((res: any) => {
                              return (
                                <div>
                                  <div className="">
                                    <p className="font-14"

                                      onClick={(e) => openDocument(e, res.ID)}
                                    >
                                      <FileIcon fileType={res.fileType} />  {res?.fileName}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <></>
                          )} */}
                          {/* {projectallfile.length > 0 ? (
                             projectallfile.map((data)=>{
                               <h1>{data.Name}</h1>
                             })
                          ):(null)

                          } */}
                        {/* </Modal.Body>*/}
                      </Modal>
                    </div>
                    <div className="row mt-2">
                      <p
                        style={{ lineHeight: "22px" }}
                        className="d-block text-muted mt-2 mb-0 font-14"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.Description,
                          }}
                        ></div>
                      </p>
                    </div>
                      </div>
 



                     
                   
               
                 
                  </>
                );
              })
              : null}
            {/* <div className="row">
              {
                ArrDetails.length > 0 ? ArrDetails.map((item: any) => {
                  return (
                    <h4>{item.Title}</h4>
                  )
                }) : null
              }
 
            </div> */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails: React.FC<IProjectDetailsProps> = (props) => {
  return (
    <Provider>
      <ProjectDetailsContext props={props} />
    </Provider>
  );
};
export default ProjectDetails;