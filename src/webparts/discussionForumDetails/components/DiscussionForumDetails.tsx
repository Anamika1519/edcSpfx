import React, { useContext, useEffect, useRef, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { getSP } from "../loc/pnpjsConfig";
import { SPFI } from "@pnp/sp/presets/all";
import Swal from "sweetalert2";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../components/DiscussionForumDetaildetails.scss";
import Provider from "../../../GlobalContext/provider";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
// import 'react-comments-section/dist/index.css';
import { CommentCard } from "../../../CustomJSComponents/CustomCommentCard/CommentCard";
import {
  addNotification,
  getCurrentUser,
  getCurrentUserProfile,
  getUserProfilePicture,
} from "../../../APISearvice/CustomService";
// import { IAnnouncementdetailsProps } from './IAnnouncementdetailsProps';
import { decryptId } from "../../../APISearvice/CryptoService";
import { Calendar, Link, Share, FilePlus } from "react-feather";
import { Modal, Card, Dropdown, Button } from "react-bootstrap";
import moment from "moment";
import UserContext from "../../../GlobalContext/context";
import context from "../../../GlobalContext/context";
// import { IBlogDetailsProps } from './IBlogDetailsProps';
import { IDiscussionForumDetailsProps } from "./IDiscussionForumDetailsProps";
import { getDiscussionForumDetailsById } from "../../../APISearvice/DiscussionForumService";
import AvtarComponents from "../../../CustomJSComponents/AvtarComponents/AvtarComponents";
import { right } from "@popperjs/core";
// Define types for reply and comment structures
import "@pnp/sp/files"; // Required for getFileById
import "@pnp/sp/webs";  // Ensures sp.web is available
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
let filemanager: any = ""
let commentCount: any;
let likeCount: any;
let isClosed = false;
const DiscussionForumDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const siteUrl = props.siteUrl;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ArrDetails, setArrDetails] = useState([]);
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const { useHide }: any = React.useContext(UserContext);
  const { setHide }: any = context;
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
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
    showNavbar("header-toggle", "nav-bar", "body-pd", "header");

    const linkColor = document.querySelectorAll(".nav_link");

    function colorLink(this: HTMLElement) {
      if (linkColor) {
        linkColor.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    }

    linkColor.forEach((l) => l.addEventListener("click", colorLink));
  }, [props]);
  const ApiLocalStorageData = async () => {
    debugger;

    //Get the Id parameter
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    // const queryString = decryptId(Number(updatedString));

    setArrDetails(await getDiscussionForumDetailsById(sp, Number(idNum)));
  };

  //setInterval(() => {
  // getApiData()
  // }, 1000)

  const getApiData = () => {

    let initialComments: any[] = [];
    let initialArray: any[] = [];
    let arrLike = {}
    let likeArray: any[] = []
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    sp.web.lists
      .getByTitle("ARGDiscussionComments")
      .items.select("*,DiscussionForum/Id")
      .expand("DiscussionForum")
      .filter(`DiscussionForumId eq ${Number(idNum)}`)()
      .then(async (result: any) => {
        console.log(result, "ARGDiscussionComments");
        setCommentData(result);
        initialComments = result;
        for (var i = 0; i < initialComments.length; i++) {
          await sp.web.lists
            .getByTitle("ARGDiscussionUserLikes")
            .items.filter(`DiscussionForumCommentsId eq ${Number(initialComments[i].Id)}`).select("ID,AuthorId,UserName,Like,Created")()
            .then((result1: any) => {
              console.log(result1, "ARGEventsUserLikes");
              likeArray = []
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

      });
  }
  const ApICallData = async () => {
    debugger;
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));

  };

  // Load comments from localStorage on component mount
  // useEffect(() => {
  //   const storedComments = localStorage.getItem('comments');
  //   if (storedComments) {
  //     setComments(JSON.parse(storedComments));
  //   }
  // }, [props]);

  // Save comments to localStorage whenever comments state changes
  // useEffect(() => {
  //   localStorage.setItem('comments', JSON.stringify(comments));
  // }, [comments]);

  const copyToClipboard = (Id: number) => {
    const link = `${siteUrl}/SitePages/DiscussionForumDetail.aspx?${Id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy link');
      });
  };
  // Add a new comment
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sp.web.lists
      .getByTitle("ARGDiscussionComments")
      .items.add({
        UserName: CurrentUser.Title,
        Comments: newComment,
        UserLikesJSON: "",
        UserCommentsJSON: "",
        userHasLiked: false,
        DiscussionForumId: ArrDetails[0].Id,
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
        setNewComment("");
        setLoading(false);
        let notifiedArr = {
          ContentId: ArrDetails[0].Id,
          NotifiedUserId: ArrDetails[0].AuthorId,
          ContentType0: "Comment",
          ContentName: ArrDetails[0].Title,
          ActionUserId: CurrentUser.Id,
          DeatilPage: "DiscussionForumDetail",
          ReadStatus: false,
          
        }
        const nofiArr = await addNotification(notifiedArr, sp)
        console.log(nofiArr, 'nofiArr');
      });

    // setComments((prevComments) => [...prevComments, newCommentData]);
  };

  // Add a like to a comment
  const handleLikeToggle = async (commentIndex: number) => {
    setLoadingLike(true);
    const updatedComments = [...comments];
    const comment = updatedComments[commentIndex];

    // Check if the user has already liked the comment
    const userLikeIndex = comment.UserLikesJSON.findIndex(
      (like: Like) => like.UserName === CurrentUser.Title // Replace with actual username property
    );
    try {
      if (userLikeIndex === -1) {
        // User hasn't liked yet, proceed to add a like

        await sp.web.lists
          .getByTitle("ARGDiscussionUserLikes")
          .items.add({
            UserName: CurrentUser.Title, // Replace with actual username
            Like: true,
            DiscussionForumCommentsId: comment?.Id,
            userHasLiked: true,
          })
          .then(async (ress: any) => {
            console.log(ress, "Added Like");

            // Add the new like to the comment's UserLikesJSON array
            const newLikeJson: Like = {
              ID: ress.data.Id,
              AuthorId: ress.data.AuthorId,
              UserName: ress.data.UserName, // Replace with actual username
              like: "yes",
              Created: ress.data.Created,
              Count: comment.UserLikesJSON.length + 1,
            };

            updatedComments[commentIndex].UserLikesJSON.push(newLikeJson);

            // Update the corresponding SharePoint list
            await sp.web.lists
              .getByTitle("ARGDiscussionComments")
              .items.getById(comment.Id)
              .update({
                UserLikesJSON: JSON.stringify(
                  updatedComments[commentIndex].UserLikesJSON
                ),
                userHasLiked: true,
                LikesCount: comment.UserLikesJSON.length,
              })
              .then(async () => {
                console.log("Updated comment with new like");
                comment.userHasLiked = true;
                setComments(updatedComments);
                let notifiedArr = {
                  ContentId: ArrDetails[0].Id,
                  NotifiedUserId: ArrDetails[0].AuthorId,
                  ContentType0: "Like",
                  ContentName: ArrDetails[0].Title,
                  ActionUserId: CurrentUser.Id,
                  DeatilPage: "DiscussionDetails",
                  ReadStatus: false,
                  ContentComment: updatedComments[commentIndex].Comments,

                  ContentCommentId: updatedComments[commentIndex].Id,

                  CommentOnReply: ""
                }
                const nofiArr = await addNotification(notifiedArr, sp)
                console.log(nofiArr, 'nofiArr');
              });
          });
      } else {
        // User already liked, proceed to unlike (remove like)
        const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like

        await sp.web.lists
          .getByTitle("ARGDiscussionUserLikes")
          .items.getById(userLikeId)
          .delete()
          .then(async () => {
            console.log("Removed Like");

            // Remove the like from the comment's UserLikesJSON array
            updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);

            // Update the corresponding SharePoint list
            await sp.web.lists
              .getByTitle("ARGDiscussionComments")
              .items.getById(comment.Id)
              .update({
                UserLikesJSON: JSON.stringify(
                  updatedComments[commentIndex].UserLikesJSON
                ),
                userHasLiked: false,
                LikesCount: comment.UserLikesJSON.length,
              })
              .then(async () => {
                console.log("Updated comment after removing like");
                comment.userHasLiked = false;
                setComments(updatedComments);
                let notifiedArr = {
                  ContentId: ArrDetails[0].Id,
                  NotifiedUserId: ArrDetails[0].AuthorId,
                  ContentType0: "UnLike",
                  ContentName: ArrDetails[0].Title,
                  ActionUserId: CurrentUser.Id,
                  DeatilPage: "DiscussionDetails",
                  ReadStatus: false,
                  
                }
                const nofiArr = await addNotification(notifiedArr, sp)
                console.log(nofiArr, 'nofiArr');
              });
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

  // Add a reply to a comment
  const handleAddReply = async (commentIndex: number, replyText: string) => {
    debugger;
    setLoadingReply(true);
    try {
      if (replyText.trim() === "") return;
      const updatedComments = [...comments];

      const comment = updatedComments[commentIndex];
      await sp.web.lists
        .getByTitle("ARGDiscussionUserComments")
        .items.add({
          UserName: CurrentUser.Title, // Replace with actual username
          Comments: replyText,
          ARGDiscussionCommentsId: updatedComments[commentIndex].Id,
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
            .getByTitle("ARGDiscussionComments")
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
                DeatilPage: "DiscussionDetails",
                ReadStatus: false,
                ContentComment: updatedComments[commentIndex].Comments,

                ContentCommentId: updatedComments[commentIndex].Id,

                CommentOnReply: newReplyJson.Comments
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
      ChildComponent: "Discussion Forum Details ",
      ChildComponentURl: `${siteUrl}/SitePages/DiscussionForumDetail.aspx`,
    },
  ];
  //#endregion
  console.log(ArrDetails, "console.log(ArrDetails)");
  const sendanEmail = (item: any) => {
    // window.open("https://outlook.office.com/mail/inbox");

    const subject = "Dicussion link-" + item.Topic;
    const body = 'Here is the link to the Dicussion:' + `${siteUrl}/SitePages/DiscussionForumDetail.aspx?${item.Id}`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the link to launch the default mail client (like Outlook)
    window.location.href = mailtoLink;
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showDropdownId, setShowDropdownId] = React.useState(null);
  // const [files, setFiles] = useState([]);


  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string>('');
  // open modal for all file 
  const openModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    getAllFilesForProject()
    e.preventDefault()
    setShowModal(true);
  }
  const closeModal = () => setShowModal(false);
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
  const uploadfileinfolder = async () => {
    console.log("hernter here in ")
    for (const file of selectedFiles) {

      try {
        console.log(`Uploading file: ${file.name}`);
        console.log(`filemanager: ${filemanager}`);

        // Reference the folder by server-relative path
        const uploadFolder = sp.web.getFolderByServerRelativePath(`${filemanager}`);
        console.log(uploadFolder, "uplaodfold")
        // Upload the file using addChunked (use appropriate chunk size if needed)
        const uploadResult = await uploadFolder.files.addChunked(file.name, file)
        if (uploadResult) {
          await Swal.fire(
            'Uploaded!',
            'The file has been successfully Uploaded.',
            'success'
          );
          setSelectedFiles([])
          // getAllFilesForProject()
        }
        // alert(uploadResult)
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

  const [argcurrentgroupuser, setArgcurrentgroupuser] = useState([])

  const [files, setFiles] = useState([]);
  async function getAllFilesForProject() {


    console.log(filemanager, "file manager")
    const response = await sp.web.getFolderByServerRelativePath(`${filemanager}`).files();
    console.log(response, "resonse")
    setFiles(response)

  }



  const handlePreviewFile = (fileUrl: any) => {
    window.open(fileUrl, '_blank'); // Open the file in a new tab
  };

  const [isPopupVisible, setPopupVisible] = useState(false);




  // this is pop up when folder create click 
  const togglePopup = async () => {
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    alert(idNum)

    const getdata: any = await sp.web.lists.getByTitle('ARGDiscussionForum').items.getById(parseInt(idNum))()
    console.log(getdata, "get data ")

    if (getdata.DiscussionInProgress === null || getdata.DiscussionInProgress === "") {

      setPopupVisible(!isPopupVisible);
    } else if (getdata.DiscussionInProgress === "In Progress") {

      Swal.fire({
        title: 'Folder is in progress!',
        text: 'Please wait until the process is complete.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    } else if (getdata.DiscussionInProgress === "Completed") {

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
  const UpdateItemAndCreateFolder = async (e: any) => {
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
        console.log(name, "name", Overview, "overview")
        const updatedValues = {

          DiscussionFolderName: name,
          DiscussionOverview: Overview,
          DiscussionInProgress: "In Progress"
        };


        await sp.web.lists.getByTitle('ARGDiscussionForum').items.getById(parseInt(idNum)).update(updatedValues);

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
  const DeleteFileFromFileMaster = async (fileId: any) => {
    try {
      // Show confirmation alert using Swal
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
        const data = await sp.web.getFileById(fileId).delete();
        // Success alert
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
      // Show error alert
      await Swal.fire(
        'Error!',
        'There was an error deleting the file.',
        'error'
      );
    }
  }

  // Fetch comment And likes Count 
  const [commentData, setCommentData] = useState([]);
  console.log("commentData", commentData);
  const getImpressionCountDetails = () => {
    let cCount = 0;
    let lCount = 0;

    commentData.forEach((comment) => {
      if (comment.CommentsCount === null) {
        cCount++;
      } else {
        cCount += comment.CommentsCount;
      }
      if (comment.LikesCount !== null) {
        lCount += comment.LikesCount;
      }
    })
    commentCount = cCount;
    likeCount = lCount;
    console.log("commentCount", cCount);
    console.log("likeCount", lCount);
  }
  getImpressionCountDetails();

  const UpdateDiscussion = (Id: any, authorId: any, discussionStatus: any) => {
    console.log("Author Id", authorId);
    console.log("currentUserDetails", CurrentUser)
    console.log("discussionStatus", discussionStatus)
    if (authorId === CurrentUser.Id) {
      if (discussionStatus === "Close") {
        Swal.fire("Discussion Already Closed");
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Close This Discussion!",
        }).then((result) => {
          if (result.isConfirmed) {
            sp.web.lists.getByTitle("ARGDiscussionForum").items.getById(Id).update({
              ARGDiscussionStatus: "Close"
            }).then(async () => {
              // setDataproject(await fetchprojectdata(sp));
              Swal.fire("Updated!", "Discussion status has been set to 'Close'.", "success");
              getDiscussionForumDetailsById(Id)
            }).catch((error) => {
              console.error("Error updating project status:", error);
              Swal.fire("Error", "There was an issue updating the Discussion status.", "error");
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
    } else {
      Swal.fire("Access Denied", "You don't have access to close this discussion.", "warning");
    }
  }
  return (
    <div id="wrapper" ref={elementRef}>
      <div className="app-menu" id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />
        <div
          className="content "
          style={{ marginLeft: `${!useHide ? "240px" : "80px"}`, marginTop: '1rem' }}
        >
          <div className="container-fluid  paddb">
            {isPopupVisible && (
              <div className="popup">
                <div className="popup-content">
                  <button className="close-btn" onClick={togglePopup}>
                    &times; {/* Cross mark */}
                  </button>
                  <h2 className="font-16 text-dark mb-3">Popup Form</h2>
                  <form>
                    <label htmlFor="name">Folder Name:</label>
                    <input type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)} />
                    <br />
                    <label htmlFor="Overview">Overview:</label>
                    <input type="email"
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
            <div className="row" style={{ paddingLeft: "0.5rem" }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            {ArrDetails.length > 0
              ? ArrDetails.map((item: any, index: any) => {
                if (item.ARGDiscussionStatus === "Close") {
                  isClosed = true
                }
                const DiscussionForumGalleryJSON =
                  item.DiscussionForumGalleryJSON == undefined ||
                    item.DiscussionForumGalleryJSON == null
                    ? ""
                    : JSON.parse(item.DiscussionForumGalleryJSON);
                console.log(DiscussionForumGalleryJSON);
                filemanager = item.DiscussionFileManager
                return (
                  <>
                    {/* <div
               
                      className="row mt-4"
                      style={{ paddingLeft: "0.5rem" }}
                    >

<div className="col-md-3 mobile-w1">

  <div className="row mt-2">
  <p

className="d-block mt-2 font-28"
>
{item.Topic}
</p>
  <div className="tabcss mb-0- mt-2 me-1 newalign"> 
  <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={14} />{" "}
                              {moment(item.Created).format("DD-MMM-YYYY")}{" "}
                            
                            </span>

                            </div>
                            <div className="tabcss mb-0 mt-2 me-1 newalign"> 
                            <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={sendanEmail}
                            >
                              <Share size={14} /> Share by email 
                            </span>
        </div>

        <div className="tabcss mb-0 mt-2 me-1 newalign"> 
        <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={() => copyToClipboard(item.Id)}
                            >
                              <Link size={14} /> Copy link
                          
                              {copySuccess && <span className="text-success">{copySuccess}</span>}
                            </span>
          </div>
          <div className="tabcss mb-0 mt-2 me-1 newalign"> 
       <span style={{float:'left', marginTop:'-1px', marginRight:'5px'}}><img
                                  src={require("../assets/public.png")}
                                 
                                  alt="Check"
                                /></span>   <span> {item.GroupType} 
          &nbsp;</span>
            </div>

            <span style={{ display: 'flex', gap: '0.2rem' }}>
                              {
                                item?.InviteMemebers?.length > 0 && item?.InviteMemebers.map((item1: any, index: 0) => {

                                  return (
                                    <>
                                      {item1.EMail ? <span style={{ margin: index == 0 ? '0 0 0 0' : '0 0 0px -12px' }} data-tooltip={item.Title}><img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`} className="attendeesImg" /> <span data-tooltip={item.Title}></span></span> :
                                        <span> <AvtarComponents Name={item1.Title} data-tooltip={item.Title} /> </span>
                                      }
                                    </>
                                  )
                                })
                              }
                            </span>


                              

        
  </div>

  <h4 className="font-14 fw-bold text-dark mb-1 mt-3 uppercase">Discussion Overview</h4>
  <div className="row ">
                      <p
                        style={{ lineHeight: "22px" }}
                        className="d-block text-muted mt-1 font-14"
                      >
                        {item.Overview}
                      </p>
                    </div>
  </div>

  <div className="col-md-6 mobile-w2">
  <div className="row mt-4" style={{ paddingLeft: "0.5rem" }}>
              <div className="col-md-12">
                <div
                  className="card"
                  style={{
                    border: "1px solid #54ade0",
                    borderRadius: "20px",
                    boxShadow: "0 3px 20px #1d26260d",
                  }}
                >
                  <div className="card-body" style={{ padding: "1rem 0.9rem" }}>
                  
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
                      <button
                        className="btn btn-primary mt-2"
                        onClick={handleAddComment}
                        disabled={loading} 
                      >
                        {loading ? "Submitting..." : "Add Comment"}{" "}
                    
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pt-2" style={{ paddingLeft: "0.5rem" }}>
          

              {comments.map((comment, index) => (
                <div className="col-xl-12" style={{ marginTop: "0rem" }}>
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
                    Action="Discussion"
                    onAddReply={(text) => handleAddReply(index, text)}
                    onLike={() => handleLikeToggle(index)} 
                    loadingReply={loadingReply}
                  />
                </div>
              ))}
            </div>

    </div>

    <div className="col-md-3 mt-4 mobile-w3">

                      <div className="card mobile-5"  style={{ borderRadius: "22px" }}>
                        <div className="card-body pb-3 gheight">
                          <h4 className="header-title font-16 text-dark fw-bold mb-0"  style={{ fontSize: "20px" }}>Discussion Owner</h4>
                            <div style={{textAlign:'center'}} className="mt-2"> <img
                                  src={require("../assets/member.jpg")}
                                  style={{width:'4.5rem', height:'4.5rem', borderRadius:'1000px', marginTop:'15px' }}
                                  alt="Check"
                                /></div> 
                          <h1 className="text-muted font-14 mt-2"><p className="text-dark font-16 text-center mb-2"> keerti jain</p>
                          <p className="text-dark font-14 text-center mb-1">Cloud Infrastructure Alchemist</p>
                          <p className="text-muted font-12 text-center">keertijain@officeindia.onmicrosoft.com  </p>
                          </h1></div>
                          </div>
                          <div className="card mobile-5"  style={{ borderRadius: "22px" }}>
                          <div className="card-body pb-3 gheight">
                          <h4 className="header-title font-16 text-dark fw-bold mb-0"  style={{ fontSize: "20px" }}>Most Liked Replied</h4>
                                      <div className="mt-2">

                                        <div className="border-bottom-new">

                                      <div className="row">
                                            <div className="col-lg-2 mt-1">
                                            <img
                                  src={require("../assets/member.jpg")}
                                  style={{width:'2.5rem', height:'2.5rem', borderRadius:'1000px' }}
                                  alt="Check"
                                />

                                            </div>
                                            <div style={{paddingLeft:'15px'}} className="col-lg-10">
                                              <h3 className="font-16 text-dark mb-1">Mr. john</h3>
                                              <p className="text-peimary font-12" style={{color:'#1fb0e5'}}>IT Manager</p>
                                            </div>

                                            </div>


                                            </div>

                                            <div className="border-bottom-new">

<div className="row">
      <div className="col-lg-2 mt-1">
      <img
src={require("../assets/member.jpg")}
style={{width:'2.5rem', height:'2.5rem', borderRadius:'1000px' }}
alt="Check"
/>

      </div>
      <div style={{paddingLeft:'15px'}} className="col-lg-10">
        <h3 className="font-16 text-dark mb-1">Mr. john</h3>
        <p className="text-peimary font-12" style={{color:'#1fb0e5'}}>IT Manager</p>
      </div>

      </div>


      </div>


      <div className="border-bottom-new">

<div className="row">
      <div className="col-lg-2 mt-1">
      <img
src={require("../assets/member.jpg")}
style={{width:'2.5rem', height:'2.5rem', borderRadius:'1000px' }}
alt="Check"
/>

      </div>
      <div style={{paddingLeft:'15px'}} className="col-lg-10">
        <h3 className="font-16 text-dark mb-1">Mr. john</h3>
        <p className="text-peimary font-12" style={{color:'#1fb0e5'}}>IT Manager</p>
      </div>

      </div>


      </div>

      <div className="border-bottom-new">

<div className="row">
      <div className="col-lg-2 mt-1">
      <img
src={require("../assets/member.jpg")}
style={{width:'2.5rem', height:'2.5rem', borderRadius:'1000px' }}
alt="Check"
/>

      </div>
      <div style={{paddingLeft:'15px'}} className="col-lg-10">
        <h3 className="font-16 text-dark mb-1">Mr. john</h3>
        <p className="text-peimary font-12" style={{color:'#1fb0e5'}}>IT Manager</p>
      </div>

      </div>


      </div>

         <div className="border-bottom-new">

                                      <div className="row">
                                            <div className="col-lg-2 mt-1">
                                            <img
                                  src={require("../assets/member.jpg")}
                                  style={{width:'2.5rem', height:'2.5rem', borderRadius:'1000px' }}
                                  alt="Check"
                                />

                                            </div>
                                            <div style={{paddingLeft:'15px'}} className="col-lg-10">
                                              <h3 className="font-16 text-dark mb-1">Mr. john</h3>
                                              <p className="text-peimary font-12" style={{color:'#1fb0e5'}}>IT Manager</p>
                                            </div>

                                            </div>


                                            </div>
                                      </div>
                          
                            </div>

                            </div>
                          

                        
                      </div>

                     
                      
                    </div> */}

                    {/* <div
                      className="row internalmedia filterable-content mt-0"
                      style={{ paddingLeft: "0.5rem" }}
                    >
                      {DiscussionForumGalleryJSON.length > 0 ? (
                        DiscussionForumGalleryJSON.map((res: any) => {
                          return (
                            <div className="col-sm-6 col-xl-3 filter-item all web illustrator">
                              <div
                                className="gal-box"

                              >
                                <a
                                  data-bs-toggle="modal"
                                  data-bs-target="#centermodal"
                                  className="image-popup mb-2"
                                  title="Screenshot-1"
                                >
                                  <img
                                    src={`https://officeindia.sharepoint.com${res.fileUrl}`}
                                    className="img-fluid imgcssscustom"
                                    alt="work-thumbnail"
                                    data-themekey="#"
                                    style={{ width: "100%", height: "100%" }}
                                  />
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div> */}
                    {/* <div
                      className="row mt-5"
                      style={{ paddingLeft: "0.5rem" }}
                    >
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
                    </div> */}
                    <div className="row mt-3">
                      <div className="col-md-3 mobile-w1">

                        <p className="d-block mt-2 font-28">

                          {item.Topic}
                        </p>
                        <div className="row mt-2">
                          <div className="col-md-12 col-xl-12">
                            {/* <div className="tabcss sameh mb-2 mt-2 me-1 activenew">

                        <button className="opend"
                          onClick={(e) => openModal(e)}
                 
                        >
                          <FilePlus /> Open Document
                        </button>
                        </div> */}
                            <div className="tabcss mb-2 mt-2 me-1 newalign">
                              <span className="pe-2 widtsvg text-nowrap mb-0 d-inline-block"
                                onClick={(e: any) => openModal(e)}>
                                <FilePlus size={14}  /> <span className="docu"> Open Document</span>
                              </span>
                            </div>
                            <div className="tabcss mb-2 mt-2 me-1 newalign">
                              <span className="pe-2 text-nowrap mb-0 d-inline-block">
                                <Calendar size={14} />{" "}
                                <span className="docu">  {moment(item.Created).format("DD-MMM-YYYY")}{" "}</span> 

                              </span>
                            </div>
                            <div className="tabcss mb-2 sameh mt-2 me-1 ">
                              <span className="text-nowrap mb-0 d-inline-block" onClick={() => sendanEmail(item)} >
                                <Share size={14} /> <span className="docu">Share by email</span> 
                              </span>
                            </div>
                            <div className="tabcss mb-2 sameh mt-2 me-1 ">
                              <span
                                className="text-nowrap mb-0 d-inline-block"
                                onClick={togglePopup}
                              >
                                {/* <FilePlus size={14} /> */}
                                <img src={require("../assets/createf.png")} className="alignright12"/>
                                <span className="docu"> Create Folder</span> 
                              </span>
                            </div>
                            {/* <div className="tabcss mb-2 sameh mt-2 me-1 ">
                              <span
                                className="text-nowrap mb-0 d-inline-block"
                              >
                                {item.GroupType}
                              </span>
                            </div> */}
                            <div className="tabcss mb-2 sameh mt-2 me-1 ">
                              <span
                                className="text-nowrap mb-0 d-inline-block"
                                onClick={() => UpdateDiscussion(item.Id, item.Author.ID, item.ARGDiscussionStatus)}
                              >
                                <img src={require("../assets/closed.png")} className="alignright12"/>
                              <span className="docu"> Close Discussion</span> 
                              </span>
                            </div>
                            {/* <div className="tabcss sameh mb-3 mt-2 me-1 ">
                            <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={() => copyToClipboard(item.Id)}
                            >
                              <Link size={14} /> Copy link 
                              {copySuccess && (
                                <span className="text-success">
                                  {copySuccess}
                                </span>
                              )}
                            </span>
                        </div> */}
                            <p className="mb-2 mt-1 newt6 font-14">



                              <div
                                style={{

                                  position: "relative",
                                }}
                              >
                                <div style={{ display: "flex", marginTop: "6px" }} className="ml90">
                                  {item?.InviteMemebers?.map(
                                    (id: any, idx: any) => {
                                      if (idx < 3) {
                                        return (
                                          <div className="gfg_tooltip">
                                          <img
                                            style={{
                                              margin:
                                                index == 0
                                                  ? "0 0 0 0"
                                                  : "0 0 0px -12px",
                                              float: "left"
                                            }}
                                            src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                            className="rounded-circlecss pimg text-center img-thumbnail avatar-xl"
                                            alt="profile-image"
                                          />
                                          <span className="gfg_text">
            A Computer science portal
        </span>

        </div>
                                        );
                                      }
                                    }
                                  )}
                                  {item?.InviteMemebers?.length > 3 && (
                                    <div
                                      className="pimg"
                                      // onClick={() => toggleDropdown(item.Id)}
                                      key={item.Id}
                                    >
                                      <div
                                        style={{
                                          textAlign: "center",
                                          margin:
                                            index == 0
                                              ? "0 0 0 0"
                                              : "0 0 0px -12px",
                                          float: "left"
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
                                      item?.InviteMemebers?.map(
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
                            {item.Overview}
                          </p>

                        </div>
                        {/* <div className="row internalmedia filterable-content mt-3">
                      <Modal show={showModal} onHide={closeModal}>

                        <Modal.Header closeButton>
                          <Modal.Title> {ProjectsDocsJSON.length} Documents</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {ProjectsDocsJSON.length > 0 ? (
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
                          )}

                        </Modal.Body>
                      </Modal>
                    </div> */}
                        <Modal show={showModal} onHide={closeModal} className="minw80">
                          <h3 style={{ width: '100%', textAlign: 'left', borderBottom: '1px solid #efefef', padding: '15px', fontSize: '18px' }} className="modal-title">Documents</h3>
                          <Modal.Header closeButton style={{ position: 'absolute', right: '0px', display:'flex', gap:'10px', top:'-6px', borderBottom: '0px solid #ccc' }}>
                            {/* <Modal.Title> {ProjectsDocsJSON.length} Documents</Modal.Title> */}
                            
                            
                            <ul className="listnew">
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

</label>      <Button variant="success" onClick={() => uploadfileinfolder()}>
                              Upload File
                            </Button>
                          
                           
                          </Modal.Header>
                          <Modal.Body>
                          <div className="file-cards row">
                              {/* {files.map((file) => (
            <Card key={file.UniqueId}style={{  marginBottom: '10px', height:'82px' }}>
              <Card.Body>
                <Card.Title>{file.Name}</Card.Title>
                <Card.Text>{file.Length} bytes</Card.Text>
           
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id={`dropdown-${file.UniqueId}`} size="sm">
                    &#x22EE; 
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePreviewFile(file.ServerRelativeUrl)}>
                      Preview
                    </Dropdown.Item>
              
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Body>
            </Card>
          ))} */}
                              {files.map((file) => (
                                <div className="col-lg-4">
                                  <Card key={file.UniqueId} style={{ marginBottom: '10px', height: '82px' }} >
                                    <Card.Body>
                                      <div className="row">
                                        <div className="col-lg-2">
                                          <img
                                            src={require("../assets/file.png")}
                                            style={{ width: '40px' }}
                                            alt="Check"
                                          />

                                        </div>

                                        <div style={{ paddingLeft: '13px' }} className="col-lg-9">
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
                                              <Dropdown.Item onClick={() => handlePreviewFile(file.ServerRelativeUrl)} style={{ fontSize: '12px', textAlign: 'center' }}>
                                                Preview
                                              </Dropdown.Item>
                                              <Dropdown.Item onClick={() => DeleteFileFromFileMaster(file.UniqueId)} style={{ fontSize: '12px', textAlign: 'center' }}>
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
                      <div className="col-md-6 mobile-w2" style={{
                        pointerEvents: isClosed ? 'none' : 'auto',
                        opacity: isClosed ? 0.5 : 1,
                      }}>
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
                                  <button
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
                            <div className="col-xl-12" style={{ marginTop: "0rem" }}>
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
                                Action="Discussion"
                                onAddReply={(text) => handleAddReply(index, text)}
                                onLike={() => handleLikeToggle(index)} // Pass like handler
                                loadingReply={loadingReply}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-3 mobile-w3">

                        <div className="card mobile-5 mt-2" style={{ borderRadius: "22px" }}>
                          <div className="card-body pb-3 gheight">
                            <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: "20px" }}>Discussion Owner</h4>
                            <h1 className="text-muted font-14 mt-3"><p className="text-dark font-16 text-center mb-2">{item.Author.Title}</p>
                              <p className="text-muted font-14 text-center mb-1">Cloud Infrastructure Alchemist</p>
                              <p className="text-muted font-12 text-center">{item.Author.EMail}</p>
                            </h1></div>
                        </div>

                        {/* Impression code */}
                        <div className="card mobile-5 mt-3" style={{ borderRadius: "22px" }}>
                          <div className="card-body pb-3 gheight">
                            <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: "20px" }}>Impression Count</h4>
                            <h1 className="text-muted font-14 mt-3">
                              <div className="row">
                                 <div className="col-lg-12">
                                    <div className="card1">
                                      <div className="d-flex juss">
                                    <img src={require("../assets/glike.png")} className="alignright12"/>
                                    <p className="text-muted font-14 text-center mb-1">Likes</p>
                                  
                                    </div>

                                    <span className="likecount">{likeCount}</span>


                                      </div>                                

                                    
                                    <div className="card1">
                                    <div className="d-flex juss">
                                    <img src={require("../assets/ccomment.png")} className="alignright12"/>
                                    <p className="text-muted font-14 text-center mb-1">Total Comments</p>
                                  
                                    </div>
                                      <span className="likecount">{commentCount}</span>
                                    
                                       
                                      </div>                               
                                      
                                        </div>
                                      {/* <p className="text-muted font-12 text-center">{likeCount}</p> */}

                              </div>
                              {/* <p className="text-dark font-16 text-center mb-2">{item.Author.Title}</p> */}
                              {/* <p className="text-muted font-14 text-center mb-1">Total Comments {commentCount}</p> */}
                             
                            </h1></div>
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

const DiscussionForumDetails: React.FC<IDiscussionForumDetailsProps> = (
  props
) => {
  return (
    <Provider>
      <DiscussionForumDetailsContext props={props} />
    </Provider>
  );
};
export default DiscussionForumDetails;

