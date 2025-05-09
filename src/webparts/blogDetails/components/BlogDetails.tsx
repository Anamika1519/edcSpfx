import React, { useContext, useEffect, useRef, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { SPFI } from "@pnp/sp/presets/all";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
// import "../components/announcementdetails.scss";
import Provider from "../../../GlobalContext/provider";
import HorizontalNavbar from "../../horizontalNavBar/components/HorizontalNavBar";
// import 'react-comments-section/dist/index.css';
import { CommentCard } from "../../../CustomJSComponents/CustomCommentCard/CommentCard";
import {
  addActivityLeaderboard,
  addNotification,
  getCurrentUser,
  getCurrentUserProfile,
  getCurrentUserProfileEmail,
  getuserprofilepic
} from "../../../APISearvice/CustomService";
import { Calendar, Link, Share } from "react-feather";
import moment from "moment";
import UserContext from "../../../GlobalContext/context";
import context from "../../../GlobalContext/context";
import { IBlogDetailsProps } from "./IBlogDetailsProps";
import { getAllBlogsnonselected, getBlogDetailsById } from "../../../APISearvice/BlogService";
import { getSP } from "../loc/pnpjsConfig";
import { TimeFormat } from "../../../APISearvice/AnnouncementsService";
import { getMyRequestBlog, updateItemApproval } from "../../../APISearvice/ApprovalService";
import { WorkflowAction } from "../../../CustomJSComponents/WorkflowAction/WorkflowAction";
import { WorkflowAuditHistory } from "../../../CustomJSComponents/WorkflowAuditHistory/WorkflowAuditHistory";
import { CONTENTTYPE_Blogs, LIST_TITLE_MyRequest } from "../../../Shared/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { getUrlParameterValue } from "../../../Shared/Helper";
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
const BlogDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const siteUrl = props.siteUrl;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
   const [SPSPicturePlaceholderState, setSPSPicturePlaceholderState]= useState(null);
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
  const [ArrtopBlogs, setArrtopBlogs]: any[] = useState([]);
  const [pageValue, setpage] = React.useState("");
  const [showComment, setshowComment] = useState<boolean>(true);
  const [showAppRemark, setshowAppRemark] = useState<boolean>(false);
  const [ApprovalRequestItem, setApprovalRequestItem] = React.useState(null);
  const [formData, setFormData] = React.useState({
    Remarks: "",

  });
  // Load comments from localStorage on mount
  useEffect(() => {
    // const savedComments = localStorage.getItem('comments');
    // if (savedComments) {
    //   setComments(JSON.parse(savedComments));
    // }
    let page = getUrlParameterValue('page');
    setpage(page);
    ApiLocalStorageData();
    // getApiData()
    ApICallData();
    // getApiData()
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
  const ApiLocalStorageData = async () => {
    debugger;

    //Get the Id parameter
    // const ids = window.location.search;
    // const originalString = ids;
    // const idNum = originalString.substring(1);
    var ids = null;
    //Get the Id parameter
    // const ids = window.location.search;
    if (window.location.search.includes("&page=MyRequest") || window.location.search.includes("&page=MyApproval")) {
      // Extract the ID using a regular expression
      const match = window.location.search.match(/^\?(\d+)&page=(MyRequest|MyApproval)$/);
      if (match) {
        ids = match[1]; // Capture group 1 contains the ID
      }
    }
    else {
      ids = window.location.search.substring(1);
    }
    const originalString = ids;
    // const idNum = originalString.substring(1);
    const idNum = originalString;
    // const queryString = decryptId(Number(updatedString));
    const blogDetail = await getBlogDetailsById(sp, Number(idNum));

    let myrequestdata = await getMyRequestBlog(sp, blogDetail[0]);
    if (myrequestdata) {
      setApprovalRequestItem(myrequestdata[0]);
    }
    // sp.web.lists.getByTitle('ARGMyRequest').items.getById(Number(idNum))().then(itm => {
    //   setApprovalRequestItem(itm);
    // })
    if (myrequestdata.length > 0 && myrequestdata[0].Status == "Pending") {
      setshowAppRemark(true);
    }
    if (blogDetail[0].Status != "Approved") {
      setshowComment(false);
    } else {
      getApiData()
    }
    setArrDetails(blogDetail)

    console.log("ArrDetails[0]", ArrDetails[0], blogDetail);
    if (blogDetail) {
      let Blogsdata = await getAllBlogsnonselected(sp, Number(idNum), blogDetail[0]?.BlogCategory != null ? blogDetail[0]?.BlogCategory.ID : null);
      setArrtopBlogs(Blogsdata);
    }
  };
  const getApiData = () => {
    let initialComments: any[] = [];
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    let initialArray: any[] = [];
    let arrLike = {}
    let likeArray: any[] = []
    sp.web.lists
      .getByTitle("ARGBlogComments")
      .items.select("*,ARGBlogs/Id,Author/ID,Author/Title,Author/EMail,Author/SPSPicturePlaceholderState")
      .expand("ARGBlogs,Author")
      .filter(`ARGBlogsId eq ${Number(idNum)}`)()
      .then(async (result: any) => {
        console.log(result, "ARGBlogComments");

        initialComments = result;
        for (var i = 0; i < initialComments.length; i++) {
          await sp.web.lists
            .getByTitle("ARGBlogUserLikes")
            .items.filter(`BlogsCommentsId eq ${Number(initialComments[i].Id)}`).select("ID,AuthorId,UserName,Like,Created")()
            .then((result1: any) => {
              console.log(result1, "ARGBlogUserLikesLikes");
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
                AuthorEmail: initialComments[i].Author.EMail,
                SPSPicturePlaceholderState : initialComments[i].Author.SPSPicturePlaceholderState,
                Comments: initialComments[i].Comments,
                Created: initialComments[i].Created,  // Formatting the created date
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
        setComments(initialArray.sort((a, b) => b.Created - a.Created));
        //setComments(initialArray);
      });
  }
  const ApICallData = async () => {
    debugger;
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));

    const profileemail = await getCurrentUserProfileEmail(sp);
    setSPSPicturePlaceholderState( await getuserprofilepic(sp,profileemail));
  };

  const copyToClipboard = (Id: number) => {
    const link = `${siteUrl}/SitePages/BlogDetails.aspx?${Id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy link');
      });
  };
  const NavigatetoEvents = () => {
    window.location.href = `${siteUrl}/SitePages/Blogs.aspx`;
  };
  const gotoNewsDetails = (valurArr: any) => {
    debugger;
    localStorage.setItem("EventId", valurArr.Id);
    localStorage.setItem("EventArr", JSON.stringify(valurArr));
    setTimeout(() => {
      window.location.href = `${siteUrl}/SitePages/BlogDetails.aspx?${valurArr.Id}`;
    }, 1000);
  };
  // Add a new comment
  const handleAddComment = async () => {
    debugger
    if (newComment.trim() === "") return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sp.web.lists
      .getByTitle("ARGBlogComments")
      .items.add({
        UserName: CurrentUser.Title,
        Comments: newComment,
        UserLikesJSON: "",
        UserCommentsJSON: "",
        userHasLiked: false,
        ARGBlogsId: ArrDetails[0].Id,
        UserProfile: CurrentUserProfile,
      })
      .then(async (ress: any) => {
        console.log(ress, "ressress");
        await addActivityLeaderboard(sp, "Comments on Blog");
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
        getApiData();
        // setComments((prevComments) => [...prevComments, newCommentData1]);
        let notifiedArr = {
          ContentId: ArrDetails[0].Id,
          NotifiedUserId: ArrDetails[0].AuthorId,
          ContentType0: "Comment",
          ContentName: ArrDetails[0].Title,
          ActionUserId: CurrentUser.Id,
          DeatilPage: "BlogDetails",
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
          .getByTitle("ARGBlogUserLikes")
          .items.add({
            UserName: CurrentUser.Title, // Replace with actual username
            Like: true,
            // ARGBlogsCommentsId: comment.Id,
            BlogsCommentsId: comment?.Id,
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
            await addActivityLeaderboard(sp, "Likes on Blog");
            // Update the corresponding SharePoint list
            await sp.web.lists
              .getByTitle("ARGBlogComments")
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
                  DeatilPage: "BlogDetails",
                  ReadStatus: false
                }
                const nofiArr = await addNotification(notifiedArr, sp)
                console.log(nofiArr, 'nofiArr');
              });
          });
      } else {
        // User already liked, proceed to unlike (remove like)
        const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like

        await sp.web.lists
          .getByTitle("ARGBlogUserLikes")
          .items.getById(userLikeId)
          .delete()
          .then(async () => {
            console.log("Removed Like");

            // Remove the like from the comment's UserLikesJSON array
            updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);
            await addActivityLeaderboard(sp, "Unlike on Blog");
            // Update the corresponding SharePoint list
            await sp.web.lists
              .getByTitle("ARGBlogComments")
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
                  DeatilPage: "BlogDetails",
                  ReadStatus: false
                }
                const nofiArr = await addNotification(notifiedArr, sp)
                console.log(nofiArr, 'nofiArr');
              });
          });
      }

    }
    catch (error) {
      setLoadingReply(false);
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
        .getByTitle("ARGBlogUserComments")
        .items.add({
          UserName: CurrentUser.Title, // Replace with actual username
          Comments: replyText,
          ARGBlogsCommentsId: updatedComments[commentIndex].Id,
          // EventsCommentsId: updatedComments[commentIndex].Id,
        })
        .then(async (ress: any) => {
          console.log(ress, "ressress");
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
            .getByTitle("ARGBlogComments")
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
                DeatilPage: "BlogDetails",
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
      ChildComponent: "Blog Details",
      ChildComponentURl: `${siteUrl}/SitePages/Blogs.aspx`,
    },
  ];
  //#endregion
  console.log(ArrDetails, "console.log(ArrDetails)");
  const sendanEmail = (item: any) => {
    // window.open("https://outlook.office.com/mail/inbox");

    //const subject = "Blog Title-" + item.Title;
    //const body = 'Here is the link to the Blog:' + `${siteUrl}/SitePages/BlogDetails.aspx?${item.Id}`;

    //const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the link to launch the default mail client (like Outlook)
    // window.location.href = mailtoLink;

    //const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const subject = "Thought You’d Find This Interesting!";
    const body = 'Hi,' +
        'I came across something that might interest you: ' +
        `<a href="${siteUrl}/SitePages/BlogDetails.aspx?${item.Id}"></a>`
    const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`;

    window.open(office365MailLink, '_blank');
  };

  const handleUpdateStatus = async (statusnew: string) => {
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    // const queryString = decryptId(Number(updatedString));
    const blogDetail = await getBlogDetailsById(sp, Number(idNum));


    let myrequestdata = await getMyRequestBlog(sp, blogDetail[0]);

    const postPayload = {
      Remark: formData.Remarks,
      Status: statusnew

    };

    //console.log(postPayload);

    const postResult = await updateItemApproval(
      postPayload,
      sp,
      myrequestdata[0].ID
    );

    setTimeout(() => {
      window.location.reload();
    }, 100);


  }

  const onChange = async (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };
  const handleCancel = () => {

    debugger
    if (pageValue == "MyRequest") {
      window.location.href = `${siteUrl}/SitePages/MyRequests.aspx`;
    } else if (pageValue == "MyApproval") {
      window.location.href = `${siteUrl}/SitePages/MyApprovals.aspx`;
    }
    //window.location.href = `${siteUrl}/SitePages/MediaGalleryMaster.aspx`;

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
          style={{ marginLeft: `${!useHide ? "240px" : "80px"}`, marginTop: '0rem' }}
        >
          <div className="container-fluid  paddb">
            <div className="row " >
              <div className="col-lg-8">
                <div className="row " >
                  <div className="col-lg-3">
                    <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                  </div>
                </div>
                {ArrDetails.length > 0
                  ? ArrDetails.map((item: any) => {
                    const BlogGalleryJSON =
                      item.BlogGalleryJSON == undefined ||
                        item.BlogGalleryJSON == null
                        ? ""
                        : JSON.parse(item.BlogGalleryJSON);
                    console.log(BlogGalleryJSON);
                    return (
                      <>
                        <div
                          className="row mt-3"

                        >
                          <p className="d-block mt-2 mb-0 font-28" >
                            {item.Title}
                          </p>
                          <div className="row mt-2">
                            <div className="col-md-12 col-xl-12">
                              <p className="mb-2 mt-1 text-dark newt6 font-14 d-block">
                                <span className="pe-2 text-nowrap mb-0 d-inline-block">
                                  <Calendar size={14} />{" "}
                                  {moment(item.Created).format("DD-MMM-YYYY")}{" "}
                                  &nbsp; &nbsp; &nbsp;|
                                </span>
                                <span className="text-nowrap hovertext mb-0 d-inline-block" onClick={() => sendanEmail(item)} >
                                  <Share size={14} /> Share by email &nbsp; &nbsp;
                                  &nbsp;|&nbsp; &nbsp; &nbsp;
                                </span>
                                <span
                                  className="text-nowrap hovertext mb-0 d-inline-block"
                                  onClick={() => copyToClipboard(item.Id)}
                                >
                                  <Link size={14} /> Copy link &nbsp; &nbsp;
                                  &nbsp;
                                  {copySuccess && <span className="text-success">{copySuccess}</span>}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row " >
                          <p
                            style={{ lineHeight: '22px', fontSize: '15px' }}
                            className="d-block text-dark mt-2"
                          >
                            {item.Overview}
                          </p>
                        </div>
                        <div
                          className="row internalmedia filterable-content mt-3"

                        >
                          {BlogGalleryJSON.length > 0 ? (
                            BlogGalleryJSON.map((res: any) => {
                              return (
                                <div className="col-sm-6 col-xl-4 filter-item all web illustrator">
                                  <div
                                    className="gal-box">
                                    <a style={{ cursor: 'auto' }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#centermodal"
                                      className="image-popup mb-2"
                                      title="Screenshot-1"
                                    >
                                      <img
                                        src={`https://edcadae.sharepoint.com${res.fileUrl}`}
                                        className="img-fluid imgcssscustom"
                                        alt="work-thumbnail"
                                        data-themekey="#"
                                        style={{ width: "100%", height: "100%", cursor: 'auto', objectFit: "cover", borderRadius: "13px" }}
                                      />
                                    </a>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </div>
                        <div
                          className="row mt-2"

                        >
                          <p
                            style={{ lineHeight: '22px', fontSize: '15px' }}
                            className="d-block text-dark newtextc mt-2 mb-0"
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.Description,
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
                {showComment &&
                  <div className="row mt-4" >

                    <div className="col-md-12">
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
                            Comments
                          </h4>
                          <div className="mt-3">
                            <textarea
                              id="example-textarea"
                              className="form-control text-dark form-control-light mb-2"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Type your comment here..."
                              rows={3}
                              style={{ borderRadius: "unset" }}
                            />
                            <button
                              className="btn btn-primary mt-2"
                              onClick={handleAddComment}
                              disabled={loading} // Disable button when loading
                            >
                              <FontAwesomeIcon style={{ float: 'left', margin: "7px 6px 0px 0px" }} icon={faPaperPlane} />
                              {loading ? "Submitting..." : "Add Comment"}{" "}
                              {/* Change button text */}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                }
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
                        Action="Blog"
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
             
              <div className="col-lg-4 widthnew">
                <div style={{ position: 'sticky', top: '90px' }} className="card  postion8">
                  <div className="card-body">
                    <h4 className="header-title text-dark  fw-bold mb-0">
                      <span style={{ fontSize: '20px' }}>Related Latest Blogs</span>    <a className="font-11 btn btn-primary  waves-effect waves-light view-all cursor-pointer" href="#" onClick={NavigatetoEvents} style={{ float: 'right', lineHeight: '18px' }}>View All</a></h4>
                    {console.log("Arrtopblogsss", ArrtopBlogs)}
                    {ArrtopBlogs && ArrtopBlogs.map((res: any) => {
                      return (
                        <div className="mainevent mt-2">
                          <div className="bordernew">
                            <h3 className="twolinewrap font-16  text-dark fw-bold hovertext mb-2 cursor-pointer" style={{ cursor: "pointer" }} onClick={() => gotoNewsDetails(res)}>{res.Title}</h3>
                            <p style={{ lineHeight: '22px', fontSize: '15px' }} className="text-muted twolinewrap">{res.Overview}</p>
                            <div className="row">
                              <div className="col-sm-12"> <span style={{ marginTop: "4px" }} className="date-color font-12 float-start  mb-1 ng-binding"><i className="fe-calendar"></i> {moment(res.Created).format("DD-MMM-YYYY")}</span>  &nbsp; &nbsp; &nbsp; <span className="font-12" style={{ color: '#009157', fontWeight: '600' }}>  </span></div>

                            </div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>


              </div>

              {pageValue !== "" &&
                <div className="col-lg-4">
                  <div className="text-left butncss">
                    <button type="button" className="btn cancel-btn waves-effect waves-light m-1" style={{ fontSize: '0.875rem' }} onClick={handleCancel}>
                      <img src={require('../../../Assets/ExtraImage/xIcon.svg')} style={{ width: '1rem' }}
                        className='me-1' alt="x" />
                      Cancel
                    </button>
                  </div>
                </div>
              }

              {/* ******* changes */}
              {/* {showAppRemark == true &&<div><div>
              
              <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                          Remarks <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          id="Remarks"
                          name="Remarks"
                          placeholder='Enter Remarks'
                           className="form-control inputcss"
                          //className={`form-control inputcs ${(!ValidDraft) ? "border-on-error" : ""} ${(!ValidSubmit) ? "border-on-error" : ""}`}
                          value={formData.Remarks}
                          onChange={(e) => onChange(e.target.name, e.target.value)}
                          

                        />
                      </div>
                       <button type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => handleUpdateStatus("Approved")} 
                             // Disable button when loading
                          >
                            Approve
                          </button>

                          <button type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => handleUpdateStatus("Rejected")} 
                             // Disable button when loading
                          >
                            Reject
                          </button>

                          <button type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => handleUpdateStatus("Rework")} 
                             // Disable button when loading
                          >
                            Rework
                          </button>

                          </div> 
                          

                          </div>
             } */}

              {/* ******* changes */}
              {
                //let forrework=ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0;
                (ApprovalRequestItem) || (ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0) ? (
                  <WorkflowAction currentItem={ApprovalRequestItem} ctx={props.context} ContentType={LIST_TITLE_MyRequest}
                    DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                    DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                  //  DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                  />
                ) : (<div></div>)
              }
              {/* {
                               <WorkflowAuditHistory ContentItemId={editID} ContentType={CONTENTTYPE_Blogs} ctx={props.context} />
                             } */}
              {/* ******* changes */}
              {/* <WorkflowAction currentItem={ApprovalRequestItem} ctx={props.context}
                                   DisableApproval={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                                   DisableCancel={ApprovalRequestItem && ApprovalRequestItem.IsRework == 'Yes' && ApprovalRequestItem.LevelSequence != 0}
                                 //  DisableReject={ApprovalRequestItem && ApprovalRequestItem.IsRework=='Yes'&& ApprovalRequestItem.LevelSequence!=0}
                                 /> */}


            </div>



          </div>
        </div>
      </div>
    </div>
  );
};

const BlogDetails: React.FC<IBlogDetailsProps> = (props) => {
  return (
    <Provider>
      <BlogDetailsContext props={props} />
    </Provider>
  );
};
export default BlogDetails;