import React, { useContext, useEffect, useRef, useState } from "react";
 
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
 
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
 
import { getSP } from "../loc/pnpjsConfig";
 
import { SPFI } from "@pnp/sp/presets/all";
 
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
 
import "bootstrap/dist/css/bootstrap.min.css";
 
import "bootstrap/dist/js/bootstrap.bundle.min.js";
 
import "../../../CustomCss/mainCustom.scss";
 
import "../../verticalSideBar/components/VerticalSidebar.scss";
 
import "../components/GroupandTeamDetails.scss";
 
import Provider from "../../../GlobalContext/provider";
 
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
 
// import 'react-comments-section/dist/index.css';
 
import { CommentCard } from "../../../CustomJSComponents/CustomCommentCard/CommentCard";
 
import "../components/GroupandTeamDetails.scss";
 
import {
  addNotification,
  getCurrentUser,
  getCurrentUserProfile,
  getCurrentUserProfileEmail,
  getuserprofilepic,
  getUserProfilePicture,
} from "../../../APISearvice/CustomService";
 
import { IGroupandTeamDetailsProps } from "./IGroupandTeamDetailsProps";
 
import { decryptId } from "../../../APISearvice/CryptoService";
 
import { Calendar, Link, Share } from "react-feather";
 
import moment from "moment";
 
import UserContext from "../../../GlobalContext/context";
 
import context from "../../../GlobalContext/context";
 
import { getGroupTeamDetailsById } from "../../../APISearvice/GroupTeamService";
import AvtarComponents from "../../../CustomJSComponents/AvtarComponents/AvtarComponents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
 
// Define types for reply and comment structures
 
interface Reply {
  Id: number;
 
  AuthorId: number;
 
  UserName: string;
  UserEmail: string;
  SPSPicturePlaceholderState:string;
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
 
const GroupandTeamDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
 
  console.log(sp, "sp");
 
  const siteUrl = props.siteUrl;
 
  const elementRef = React.useRef<HTMLDivElement>(null);
 
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
 
  const [comments, setComments] = useState<Comment[]>([]);
 
  const [newComment, setNewComment] = useState<string>("");
 const [SPSPicturePlaceholderState, setSPSPicturePlaceholderState]= useState(null);
  const [loading, setLoading] = useState<boolean>(false);
 
  const [ArrDetails, setArrDetails] = useState([]);
 
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("");
 
  const [copySuccess, setCopySuccess] = useState("");
 
  const { useHide }: any = React.useContext(UserContext);
 
  const { setHide }: any = context;
 
  // Load comments from localStorage on mount
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
 
  useEffect(() => {

  
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
    await sp.web.lists
 
      .getByTitle("ARGGroupandTeamComments")
 
      .items.select("*,GroupandTeam/Id,Author/ID,Author/Title,Author/EMail,Author/SPSPicturePlaceholderState")
 
      .expand("GroupandTeam,Author")
      .filter(`GroupandTeamId eq ${Number(idNum)}`)
      .orderBy("Created", false)()
      .then(async (result: any) => {
        console.log(result, "ARGGroupandTeamComments");

        initialComments = result;
 
        for (var i = 0; i < initialComments.length; i++) {
          await sp.web.lists
            .getByTitle("ARGGroupandTeamUserLikes")
            .items.filter(
              `GroupandTeamCommentsId eq ${Number(initialComments[i].Id)}`
            )
            .select("ID,AuthorId,UserName,Like,Created")()
            .then((result1: any) => {
              console.log(result1, "ARGEventsUserLikes");
              likeArray=[]
              for (var j = 0; j < result1.length; j++) {
                arrLike = {
                  ID: result1[j].Id,
                  AuthorId: result1[j].AuthorId,
                  UserName: result1[j].UserName,
                  Like: result1[j].Like,
                  Created: result1[j].Created,
                };
                likeArray.push(arrLike);
              }
 
              let arr = {
                Id: initialComments[i].Id,
                UserName: initialComments[i].UserName,
                AuthorId: initialComments[i].AuthorId,
                AuthorEmail: initialComments[i].Author.EMail,
                SPSPicturePlaceholderState : initialComments[i].Author.SPSPicturePlaceholderState,
                // AuthorEmail: "",
                // SPSPicturePlaceholderState : "",
                Comments: initialComments[i].Comments,
                Created: initialComments[i].Created, // Formatting the created date
                UserLikesJSON: result1.length>0?likeArray:[], // Default to empty array if null
                UserCommentsJSON:
                  initialComments[i].UserCommentsJSON != "" &&
                  initialComments[i].UserCommentsJSON != null &&
                  initialComments[i].UserCommentsJSON != undefined
                    ? JSON.parse(initialComments[i].UserCommentsJSON)
                    : [], // Default to empty array if null
                userHasLiked: initialComments[i].userHasLiked,
                UserProfile: initialComments[i].UserProfile,
              };
              initialArray.push(arr);
            });
        }
        setComments(initialArray);

        // setComments(
 
        //   initialComments.map((res) => ({
 
        //     Id: res.Id,
 
        //     UserName: res.UserName,
 
        //     AuthorId: res.AuthorId,
 
        //     Comments: res.Comments,
 
        //     Created: new Date(res.Created).toLocaleString(), // Formatting the created date
 
        //     UserLikesJSON:
 
        //       res.UserLikesJSON != "" &&
 
        //       res.UserLikesJSON != null &&
 
        //       res.UserLikesJSON != undefined
 
        //         ? JSON.parse(res.UserLikesJSON)
 
        //         : [], // Default to empty array if null
 
        //     UserCommentsJSON:
 
        //       res.UserCommentsJSON != "" &&
 
        //       res.UserCommentsJSON != null &&
 
        //       res.UserCommentsJSON != undefined
 
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

    setArrDetails(await getGroupTeamDetailsById(sp, Number(idNum)));
  };

  const ApICallData = async () => {
    setCurrentUser(await getCurrentUser(sp, siteUrl));
 
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));

    const profileemail = await getCurrentUserProfileEmail(sp);
    setSPSPicturePlaceholderState( await getuserprofilepic(sp,profileemail));
    
  };

  const copyToClipboard = (Id: number) => {
    const link = `${siteUrl}/SitePages/GroupandTeamDetails.aspx?${Id}`;

    navigator.clipboard
      .writeText(link)

      .then(() => {
        setCopySuccess("Link copied!");

        setTimeout(() => setCopySuccess(""), 2000); // Clear message after 2 seconds
      })

      .catch((err) => {
        setCopySuccess("Failed to copy link");
      });
  };
 
  // Add a new comment
 
  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
 
    setLoading(true);
 
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await sp.web.lists
 
      .getByTitle("ARGGroupandTeamComments")
 
      .items.add({
        UserName: CurrentUser.Title,
 
        Comments: newComment,
 
        UserLikesJSON: "",
 
        UserCommentsJSON: "",
 
        userHasLiked: false,
 
        GroupandTeamId: ArrDetails[0].Id,
 
        UserProfile: CurrentUserProfile,
      })
 
      .then(async (ress: any) => {
        console.log(ress, "ressress");
 
        const newCommentData1: Comment = {
          Id: ress.data.Id,
 
          UserName: ress.data.UserName,
 
          AuthorId: ress.data.AuthorId,
 
          Comments: ress.data.Comments,
 
          Created: ress.data.Created,
 
          UserLikesJSON: [],
 
          UserCommentsJSON: [],
 
          userHasLiked: false, // Initialize as false
 
          UserProfile: ress.data.UserProfile,
        };
 
        setComments((prevComments) => [...prevComments, newCommentData1]);
 
        setNewComment("");
        setLoading(false);
 
        const ids = window.location.search;

        const originalString = ids;

        const idNum = originalString.substring(1);

        let a = {
          RepliesCount: 1,
        };

        const newItem = await sp.web.lists
 
          .getByTitle("ARGGroupandTeam")
 
          .items.getById(Number(idNum))
 
          .update(a);
          let notifiedArr = {
            ContentId: ArrDetails[0].Id,
            NotifiedUserId: ArrDetails[0].AuthorId,
            ContentType0: "Comment",
            ContentName: ArrDetails[0].Title,
            ActionUserId: CurrentUser.Id,
            DeatilPage: "GroupandTeamDetails",
            ReadStatus: false
          }
          const nofiArr = await addNotification(notifiedArr, sp)
          console.log(nofiArr, 'nofiArr');
        console.log("Item added successfully:", newItem);
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
try{
    if (userLikeIndex === -1) {
      // User hasn't liked yet, proceed to add a like

      await sp.web.lists
 
        .getByTitle("ARGGroupandTeamUserLikes")
 
        .items.add({
          UserName: CurrentUser.Title, // Replace with actual username

          Like: true,

          GroupandTeamCommentsId: comment.Id,

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

          // Update the corresponding SharePoint comment list

          await sp.web.lists
 
            .getByTitle("ARGGroupandTeamComments")
 
            .items.getById(comment.Id)
 
            .update({
              UserLikesJSON: JSON.stringify(
                updatedComments[commentIndex].UserLikesJSON
              ),

              userHasLiked: true,

              LikesCount: updatedComments[commentIndex].UserLikesJSON.length,
            })
 
            .then(async () => {
              console.log("Updated comment with new like");

              comment.userHasLiked = true;

              setComments(updatedComments);

              // Update the total likes for the announcement/news post

              const ids = window.location.search;

              const originalString = ids;

              const idNum = originalString.substring(1); // Extract the ID from query string

              const likeUpdateBody = {
                LikeCounts: updatedComments[commentIndex].UserLikesJSON.length,
              };

              const newItem = await sp.web.lists
 
                .getByTitle("ARGGroupandTeam")
 
                .items.getById(Number(idNum))
 
                .update(likeUpdateBody);
                if(CurrentUser.Id!=ArrDetails[0].AuthorId)
                  {
                    let notifiedArr = {
                      ContentId: ArrDetails[0].Id,
                      NotifiedUserId: ArrDetails[0].AuthorId,
                      ContentType0: "Like on comment on GroupandTeam",
                      ContentName: ArrDetails[0].Title,
                      ActionUserId: CurrentUser.Id,
                      DeatilPage: "GroupandTeamDetails",
                      ReadStatus: false,
                      ContentComment:updatedComments[commentIndex].Comments,
                      ContentCommentId:updatedComments[commentIndex].Id,
                      CommentOnReply:""
                    }
                    const nofiArr = await addNotification(notifiedArr, sp)
                    console.log(nofiArr, 'nofiArr');
                  }
              console.log("Like count updated successfully:", newItem);
            });
        });
    } else {
      // User already liked, proceed to unlike (remove like)

      const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like

      await sp.web.lists
 
        .getByTitle("ARGGroupandTeamUserLikes")
 
        .items.getById(userLikeId)
 
        .delete()
 
        .then(async () => {
          console.log("Removed Like");

          // Remove the like from the comment's UserLikesJSON array

          updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);

          // Update the corresponding SharePoint comment list

          await sp.web.lists
 
            .getByTitle("ARGGroupandTeamComments")
 
            .items.getById(comment.Id)
 
            .update({
              UserLikesJSON: JSON.stringify(
                updatedComments[commentIndex].UserLikesJSON
              ),

              userHasLiked: false,

              LikesCount: updatedComments[commentIndex].UserLikesJSON.length,
            })
 
            .then(async () => {
              console.log("Updated comment after removing like");

              comment.userHasLiked = false;

              setComments(updatedComments);

              // Update the total likes for the announcement/news post

              const ids = window.location.search;

              const originalString = ids;

              const idNum = originalString.substring(1);

              const likeUpdateBody = {
                LikeCounts: updatedComments[commentIndex].UserLikesJSON.length,
              };

              const newItem = await sp.web.lists
 
                .getByTitle("ARGGroupandTeam")
 
                .items.getById(Number(idNum))
 
                .update(likeUpdateBody);
                let notifiedArr = {
                  ContentId: ArrDetails[0].Id,
                  NotifiedUserId: ArrDetails[0].AuthorId,
                  ContentType0: "UnLike",
                  ContentName: ArrDetails[0].Title,
                  ActionUserId: CurrentUser.Id,
                  DeatilPage: "GroupandTeamDetails",
                  ReadStatus: false
                }
                const nofiArr = await addNotification(notifiedArr, sp)
              console.log("Like count updated successfully:", newItem);
            });
        });
    }
  }
  catch (error) {
    console.error('Error toggling like:', error);
    setLoadingLike(false);
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
 
      .getByTitle("ARGGroupandTeamUserComments")
 
      .items.add({
        UserName: CurrentUser.Title, // Replace with actual username
 
        Comments: replyText,
 
        GroupandTeamCommentsId: updatedComments[commentIndex].Id,
      })
 
      .then(async (ress: any) => {
        console.log(ress, "ressress");
      //  var SPSPicturePlaceholderState =await getuserprofilepic(sp,CurrentUser.Email);
        const newReplyJson = {
          Id: ress.data.Id,
 
          AuthorId: ress.data.AuthorId,
 
          UserName: ress.data.UserName, // Replace with actual username
          UserEmail :CurrentUser.Email,
          SPSPicturePlaceholderState : SPSPicturePlaceholderState,
 
          Comments: ress.data.Comments,
 
          Created: ress.data.Created,
 
          UserProfile: CurrentUserProfile,
        };
 
        updatedComments[commentIndex].UserCommentsJSON.push(newReplyJson);
 
        await sp.web.lists
 
          .getByTitle("ARGGroupandTeamComments")
 
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
            
            if(CurrentUser.Id!=ArrDetails[0].AuthorId)
              {
                let notifiedArr = {
                  ContentId: ArrDetails[0].Id,
                  NotifiedUserId: ArrDetails[0].AuthorId,
                  ContentType0: "Reply on comment on GroupandTeam",
                  ContentName: ArrDetails[0].Title,
                  ActionUserId: CurrentUser.Id,
                  DeatilPage: "GroupandTeamDetails",
                  ReadStatus: false,
                  ContentComment:updatedComments[commentIndex].Comments,
                  ContentCommentId:updatedComments[commentIndex].Id,
                  CommentOnReply:newReplyJson.Comments
                }
                const nofiArr = await addNotification(notifiedArr, sp)
                console.log(nofiArr, 'nofiArr');
              }
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
      ChildComponent: "Team ",
 
      ChildComponentURl: `${siteUrl}/SitePages/GroupandTeam.aspx`,
    },
  ];
 
  //#endregion
 
  console.log(ArrDetails, "console.log(ArrDetails)");
 
  const sendanEmail = (item:any) => {
    // window.open("https://outlook.office.com/mail/inbox");
  
    //  const subject ="Group Title-"+ item.GroupName;
    //  const body = 'Here is the link to the group:'+ `${siteUrl}/SitePages/GroupandTeamDetails.aspx?${item.Id}`;
  
   // const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
    // Open the link to launch the default mail client (like Outlook)
    //window.location.href = mailtoLink;
    //const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const subject = "Thought You’d Find This Interesting!";
    const body = 'Hi,' +
        'I came across something that might interest you: ' +
        `<a href="${siteUrl}/SitePages/GroupandTeamDetails.aspx?${item.Id}"></a>`
    const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`;

    window.open(office365MailLink, '_blank');
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
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
 
            {ArrDetails.length > 0
              ? ArrDetails.map((item: any) => {
                  return (
                    <>
                      <div className="row mt-4">
                        <p className="d-block mt-2 text-dark  font-28">
                          {item.GroupName}
                        </p>

                        <div className="row mt-2">
                          <div className="d-flex">
                            <p className="mb-2 mt-1 newsvg font-14 d-flex">
                              <span
                                className="pe-2 text-nowrap mb-0 d-inline-block"
                                style={{ fontSize: "14px" }}
                              >
                                <Calendar size={16} />
                                {moment(item.Created).format("DD-MMM-YYYY")}
                                &nbsp; &nbsp;|
                              </span>
                              <span className="text-nowrap mb-0 d-inline-block"  onClick={() => sendanEmail(item)} style={{ fontSize: "14px" }}>
                              
                                <Share size={16} /> Share by email &nbsp;
                                &nbsp;|&nbsp;
                              </span>

                              <span
                                className="text-nowrap mb-0 d-inline-block"
                                onClick={() => copyToClipboard(item.Id)}
                                style={{ fontSize: "14px" }}
                              >
                                <Link size={16} /> Copy link &nbsp; &nbsp;
                                {copySuccess && (
                                  <span className="text-success">
                                    {copySuccess}
                                  </span>
                                )}
                              </span>
                              <span style={{ fontSize: "14px" }}>
                                &nbsp; &nbsp; |{item.GroupType}
                              </span>
                              <span
                                style={{
                                  display: "flex",
                                  gap: "0.2rem",
                                  fontSize: "14px",
                                }}
                              >
                                {" "}
                                &nbsp; &nbsp;|
                                {item?.InviteMemebers?.length > 0 &&
                                  item?.InviteMemebers.map(
                                    (item1: any, index: 0) => {
                                      return (
                                        <>
                                          {item1.EMail ? (
                                            <span
                                              style={{
                                                margin:
                                                  index == 0
                                                    ? "0 0 0 0"
                                                    : "0 0 0px -12px",
                                              }}
                                              data-tooltip={item.Title}
                                            >
                                              {/* <img
                                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`}
                                                className="attendeesImg"
                                              /> */}
                                               {/* {item1.SPSPicturePlaceholderState == 0 ?
                                                          <img
                                                            src={

                                                              `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`

                                                            }
                                                            className="rounded-circle"
                                                            width="50"
                                                            alt={item1.Title}
                                                          />
                                                          :
                                                          item1.EMail !== null &&item1.EMail !== "" &&
                                                          <Avatar sx={{ bgcolor: 'primary.main' }} className="rounded-circle avatar-xl">
                                                            {`${item1.EMail?.split('.')[0].charAt(0)}${item1.EMail?.split('.')[1].charAt(0)}`.toUpperCase()}
                                                          </Avatar>
                                                        } */}
                                              {" "}
                                              <span
                                                data-tooltip={item.Title}
                                              ></span>
                                            </span>
                                          ) : (
                                            <span>
                                              {" "}
                                              <AvtarComponents
                                                Name={item1.Title}
                                                data-tooltip={item.Title}
                                              />{" "}
                                            </span>
                                          )}
                                        </>
                                      );
                                    }
                                  )}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row ">
                        <p
                          style={{ lineHeight: "22px" }}
                          className="d-block text-muted mt-0 font-14"
                        >
                          {/* {item.GroupName} */}
                        </p>
                      </div>

                      <div className="row mt-2">
                        <p
                          style={{ lineHeight: "22px" }}
                          className="d-block text-muted mt-2 mb-0 font-14"
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: item.GroupDescription,
                            }}
                          ></div>
                        </p>
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
 
            <div className="col-lg-8">
              <div className=" flex-wrap align-items-center justify-content-end mt-3 mb-3 p-0">
                {/* Button to trigger modal */}
 
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#discussionModal"
                  className="btn rounded-pill1 btn-secondary waves-effect waves-light"
                >
                  <i className="fe-plus-circle"></i> Add New Post
                </button>
              </div>

              {/* Bootstrap Modal */}
 
              <div
                className="modal fade bd-example-modal-lg"
                id="discussionModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                data-target=".bd-example-modal-lg"
              >
                <div className="modal-dialog modal-lg ">
                  <div className="modal-content">
                    <div className="modal-header d-block">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Add a Post
                      </h5>
 
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
 
                    <div className="modal-body">
                      <div className="row" style={{ paddingLeft: "0.5rem" }}>
                        <div className="col-md-6">
                          <div
                            className=""
                            style={{
                              width: "200%",
                            }}
                          >
                            <div
                              className="card-body"
                              style={{ padding: "1rem 0.9rem" }}
                            >
                              {/* New comment input */}
 
                              <h4 className="mt-0 mb-3 text-dark fw-bold font-16">
                                Comments
                              </h4>
 
                              <div className="mt-3">
                                <textarea
                                  id="example-textarea"
                                  className="form-control text-dark form-control-light mb-2"
                                  value={newComment}
                                  onChange={(e) =>
                                    setNewComment(e.target.value)
                                  }
                                  placeholder="Add a new comment..."
                                  rows={3}
                                  style={{ borderRadius: "unset" }}
                                />
 
                                <button
                                  className="btn btn-primary mt-2"
                                  onClick={handleAddComment}
                                  disabled={loading} // Disable button when loading
                                  data-bs-dismiss="modal"
                                >
                                  <FontAwesomeIcon style={{float:'left',margin:"7px 6px 0px 0px"}} icon={faPaperPlane} /> 
                                  {loading ? "Submitting..." : "Add Comment"}{" "}
                                  {/* Change button text */}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row" style={{ paddingLeft: "0.5rem" }}>
              {comments.map((comment, index) => (
                <div className="col-xl-6">
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
                    Action="Group"
                    onAddReply={(text) => handleAddReply(index, text)}
                    onLike={() => handleLikeToggle(index)} // Pass like handler
                    loadingReply={loadingReply}
                    mainArray={ArrDetails}
                    CurrentUserEmail = {CurrentUser.Email}
                    CurrSPSPicturePlaceholderState ={SPSPicturePlaceholderState}
                    siteUrl = {siteUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupandTeamDetails: React.FC<IGroupandTeamDetailsProps> = (props) => {
  return (
    <Provider>
      <GroupandTeamDetailsContext props={props} />
    </Provider>
  );
};

export default GroupandTeamDetails;
