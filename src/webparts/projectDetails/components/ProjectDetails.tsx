import React, { useContext, useEffect, useRef, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { SPFI } from "@pnp/sp/presets/all";
import Swal from "sweetalert2";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
// import "../components/announcementdetails.scss";
import Provider from "../../../GlobalContext/provider";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
// import 'react-comments-section/dist/index.css';
import { CommentCard } from "../../../CustomJSComponents/CustomCommentCard/CommentCard";
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
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
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
  const toggleDropdown = (itemId: any) => {
    if (showDropdownId === itemId) {
      setShowDropdownId(null); // Close the dropdown if already open
    } else {
      setShowDropdownId(itemId); // Open the dropdown for the clicked item
    }
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
    let initialArray: any[] = [];
    let arrLike = {};
    let likeArray: any[] = [];
    sp.web.lists
      .getByTitle("ARGProjectComments")
      .items.select("*,ARGProject/Id")
      .expand("ARGProject")
      .filter(`ARGProjectId eq ${Number(idNum)}`)()
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
    debugger;

    //Get the Id parameter
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    // const queryString = decryptId(Number(updatedString));

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
    debugger;
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));
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
    debugger;
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
        // const handleSubmitFiles = async () => {
        //   setLoading(true);
        //   try {
        //     for (const file of selectedFiles) {
        //       try {
        //         alert("f")
        //         // Upload the file to the document library
        //         const uploadFolder = sp.web.getFolderByServerRelativePath(`/sites/SPFXDemo/ARGProjectsFiles/${projectname}`);
        //         const uploadResult = await uploadFolder.files.addChunked(file.name, file);
             
        //         const listItem = await uploadResult.file.getItem();
           
        //         (payload as any).CommentID=ress.data.Id;
        //         await listItem.update(payload);
        //         console.log(uploadResult, 'Uploaded file data');
        //       } catch (error) {
        //         console.log("Error uploading file:", file.name, error);
        //       }
        //     }
        //     alert('Files uploaded successfully!');
        //     setSelectedFiles([]); // Clear the selected files after upload
        //   } catch (error) {
        //     console.error('Error uploading files:', error);
        //   } finally {
        //     setLoading(false);
        //   }
        // };
        // handleSubmitFiles()
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
    debugger;
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
      ChildComponentURl: `${siteUrl}/SitePages/ProjectDetails.aspx`,
    },
  ];
  //#endregion
  console.log(ArrDetails, "console.log(ArrDetails)");
  const sendanEmail = () => {
    window.open("https://outlook.office.com/mail/inbox");
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
  //       alert("Only PNG, JPG, SVG, DOC, DOCX, PDF, EXCEL, PPT, CSV, and TSX files are allowed.");
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
  const uploadfileinfolder = async()=>{
      console.log("hernter here in ")
    for (const file of selectedFiles) {

      try {
        console.log(`Uploading file: ${file.name}`);
        console.log(`filemanager: ${filemanager}`);
        
        // Reference the folder by server-relative path
        const uploadFolder = sp.web.getFolderByServerRelativePath(`${filemanager}`);
        console.log(uploadFolder , "uplaodfold")
        // Upload the file using addChunked (use appropriate chunk size if needed)
        const uploadResult = await uploadFolder.files.addChunked(file.name, file)
      
        alert(uploadResult)
        console.log(`Upload successful for file: ${file.name}`);
      } catch (error) {
        console.error(`Error uploading file: ${file.name}`, error);
      }
    }
        

  }
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
  const docLibraryUrl = '/sites/SPFXDemo/ARGProjectsFiles/';
  const subsiteUrl = '/sites/SPFXDemo/test/test11';
  
  console.log(isDocumentLibrary(docLibraryUrl)); // true
  console.log(isSubsite(docLibraryUrl)); // false
  
  console.log(isDocumentLibrary(subsiteUrl)); // false
  console.log(isSubsite(subsiteUrl)); // true
  
    // try {

    //   console.log(projectname , "projectname")
    //   const response = await sp.web.getFolderByServerRelativePath(`/sites/SPFXDemo/ARGProjectsFiles/${projectname}`).files();
    //     setProjectallfiles(response)
    //     console.log(response, "response ")
    //   console.log('Files in the folder:', response);

    //   return response; // Return or handle the response as needed
    // } catch (error) {
    //   console.error('Error fetching files:', error);
    // }
    // console.log(projectallfile, "projectallfile")
  }


  async function  fetchOtherDetailsByProjectName() {
    console.log(projectname, "projectname")
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    try {
     
        
      
      const getargmember = await sp.web.lists.getByTitle('ARGProject').items.filter(`ProjectName eq '${projectname}'`).select("*,TeamMembers/ID,TeamMembers/EMail,TeamMembers/Title").expand("TeamMembers")();
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
  const handlePreviewFile = (fileUrl:any) => {
    window.open(fileUrl, '_blank'); // Open the file in a new tab
  };

const [isPopupVisible, setPopupVisible] = useState(false);




// this is pop up when folder create click 
const togglePopup  =async () => {
  const ids = window.location.search;
const originalString = ids;
const idNum = originalString.substring(1);
alert(idNum)

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
            marginTop: "1rem",
          }}
        >
          <div className="container-fluid">
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
            <div className="row ">
              <div className="col-lg-8">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            
            </div>
            {ArrDetails.length > 0
              ? ArrDetails.map((item: any, index) => {
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
                      <div className="row mt-2">
                        <div className="col-md-12 col-xl-12">
                        <div className="tabcss sameh mb-2 mt-2 me-1 activenew">

                        <button type="button" className="opend"
                  onClick={(e) => openModal(e)}
                 
                >
                  <FilePlus /> Open Document
                </button>
                        </div>
                        <div className="tabcss mb-2 mt-2 me-1 newalign"> <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={14} />{" "}
                              {moment(item.StartDate).format("DD-MMM-YYYY")}{" "}
                              
                            </span>  </div>
                            <div className="tabcss mb-2 sameh mt-2 me-1 ">
                            <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={sendanEmail}
                            >
                              <Share size={14} /> Share by email 
                            </span>
                            </div>
                            <div className="tabcss sameh mb-3 mt-2 me-1 ">
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
                             <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={togglePopup}
                            >
                             Create Folder
                             
                            </span>
                            </div>
                          <p  style={{
                              
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
                          </p>
                        </div>
                      </div>
                      


                      <div className="row ">
                      <p
                        style={{ lineHeight: "22px" }}
                        className="d-block text-muted mt-2 font-14"
                      >
                        {item.ProjectOverview}
                      </p>
                     
                    </div>
                    <div className="row internalmedia filterable-content mt-3">
                      <Modal show={showModal} onHide={closeModal} className="minw80">
                        <h3 style={{width:'100%', textAlign:'left',borderBottom:'1px solid #efefef',  padding:'15px', fontSize:'18px'}} className="modal-title">Documents</h3>
                        <Modal.Header closeButton style={{position:'absolute', right:'0px', borderBottom:'0px solid #ccc'}}>
                          {/* <Modal.Title> {ProjectsDocsJSON.length} Documents</Modal.Title> */}
                          <Button variant="success" onClick={() => uploadfileinfolder()}>
            Upload File
          </Button>
          <ul>
          {selectedFiles.map((file, index) => (
            <li key={index}>
              {file.name} 
              <button onClick={() => removeFile(file.name)} style={{ marginLeft: '10px', color: 'red' }}>❌</button>
            </li>
          ))}
        </ul>
                          <label>

<div>

  <Link style={{ width: "20px", height: "16px" }} onClick={() => handleImageChange} />

  <input

    type="file"

    multiple

    accept="image/*"

    onChange={handleImageChange}

    className="fs-6 w-50" aria-rowspan={5} style={{ display: 'none' }}

  />

</div>

</label>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="file-cards row">
                          
          {files.map((file) => (
            <div className="col-lg-4">
            <Card key={file.UniqueId} style={{  marginBottom: '10px', height:'82px' }} >
              <Card.Body>
                <div className="row">
                  <div className="col-lg-2">
                  <img
                                  src={require("../assets/file.png")}
                                  style={{width:'40px'  }}
                                  alt="Check"
                                />

                  </div>

                  <div style={{paddingLeft:'13px'}} className="col-lg-9">
                  <Card.Title className="two-line text-dark font-14 mb-1">{file.Name}</Card.Title>
                  <Card.Text className="text-muted font-12">{file.Length} bytes</Card.Text>
                  </div>
            
              
                {/* Three dots dropdown menu */}
                <div className="col-lg-1">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id={`dropdown-${file.UniqueId}`} size="sm" className="newaligntext">
                    &#x22EE; {/* Ellipsis icon */}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePreviewFile(file.ServerRelativeUrl)} style={{fontSize:'12px', textAlign:'center'  }}>
                      Preview
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
                  <div className="card-body" style={{ padding: "1rem 0.9rem" }}>
                    {/* New comment input */}
                    <h4 className="mt-0 mb-3 text-dark fw-bold font-16">
                      Comments
                    </h4>
                    <div className="mt-3">
                      <textarea
                        id="example-textarea"
                        className="form-control text-dark form-control-light mb-2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a new comment..."
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
                          <label>

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

</label>
                      <button type="button"
                        className="btn btn-primary mt-2"
                        onClick={handleAddComment}
                        disabled={loading} // Disable button when loading
                      >
                        {loading ? "Submitting..." : "Add Comment"}{" "}
                        {/* Change button text */}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row ">
              {/* New comment input */}

              {comments.map((comment, index) => (
                <div className="col-xl-12" style={{ marginTop: "1rem" }}>
                  <CommentCard
                    key={index}
                    commentId={index}
                    username={comment.UserName}
                    Commenttext={comment.Comments}
                    Comments={comments}
                    Created={comment.Created}
                    likes={comment.UserLikesJSON}
                    replies={comment.UserCommentsJSON}
                    userHasLiked={comment.userHasLiked}
                    CurrentUserProfile={CurrentUserProfile}
                    loadingLike={loadingLike}
                    Action="Project"
                    onAddReply={(text) => handleAddReply(index, text)}
                    onLike={() => handleLikeToggle(index)} // Pass like handler
                    loadingReply={loadingReply}
                  />
                </div>
              ))}
            </div>

                      </div>

                      <div className="col-md-3 mobile-w3">

<div className="card mobile-5 mt-3"  style={{ borderRadius: "22px" }}>
  <div className="card-body pb-3 gheight">
    <h4 className="header-title font-16 text-dark fw-bold mb-0"  style={{ fontSize: "20px" }}>Project Owner</h4>
    <h1 className="text-muted font-14 mt-3"><p className="text-dark font-16 text-center mb-2"> keerti jain</p>
    <p className="text-muted font-14 text-center mb-1">Cloud Infrastructure Alchemist</p>
    <p className="text-muted font-12 text-center">keertijain@officeindia.onmicrosoft.com  </p>
    </h1></div>
    </div>

<div className="card mobile-5 mt-3"  style={{ borderRadius: "22px" }}>
  <div className="card-body pb-3 gheight">
    <h4 className="header-title font-16 text-dark fw-bold mb-0"  style={{ fontSize: "20px" }}>Project Members</h4>
     {/* {argcurrentgroupuser */}
{argcurrentgroupuser[0]?.TeamMembers?.length > 0 && argcurrentgroupuser[0]?.TeamMembers?.map(
(id: any, idx: any) => {
if (idx ) {
return (
<div>
<img
// style={{
//   margin:
//     index == 0
//       ? "0 0 0 0"
//       : "0 0 0px -12px",
// }}
src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
className="rounded-circlecss img-thumbnail avatar-xl"
alt="profile-image"
/>
<p>{id?.Title} </p>
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

/>
</div>

);
}
}
)}
     {/* } */}
    
    </div>
    
    </div>

  
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
