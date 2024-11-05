import React, { useContext, useEffect, useRef, useState } from "react";

import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { PostComponent } from '../../../CustomJSComponents/SocialFeedPost/PostComponent'
import classNames from 'classnames'
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

  getCurrentUser,

  getCurrentUserProfile,

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
// import { GroupTeamPost } from "./GroupTeamPost";

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

const GroupandTeamDetailsContext = ({ props }: any) => {

  const sp: SPFI = getSP();

  console.log(sp, "sp");

  const siteUrl = props.siteUrl;

  const elementRef = React.useRef<HTMLDivElement>(null);

  const [CurrentUser, setCurrentUser]: any[] = useState([]);

  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [ArrDetails, setArrDetails] = useState([]);
  const [GroupData, setGroupData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("");

  const [copySuccess, setCopySuccess] = useState("");

  const { useHide }: any = React.useContext(UserContext);
  const [activeMainTab, setActiveMainTab] = useState("feed");
  const [hideCreatePost, setHideCreatePost] = useState(true)
  const [HideShowPost, setHideShowPost] = useState(false)
  const { setHide }: any = context;

  // Load comments from localStorage on mount
useEffect(() => {
  getGroup()
  getpostdata()
  // ApiLocalStorageData();
})
const getGroup = async () => {
  // debugger
  const groupData = 
  
  await sp.web.lists
  .getByTitle("ARGGroupandTeam")
  .items.select("*,Author/Title,Author/ID,GroupName,GroupType,InviteMemebers/Id")
  .expand("Author,InviteMemebers")
  .orderBy("Created", false)
  .getAll()
  .then((res) => {
    // debugger
    console.log("--------group", res);
    setGroupData(res)

    // // Filter items based on GroupType and InviteMembers
    //  arr = res.filter(item => 
    //   // Include public groups or private groups where the current user is in the InviteMembers array
    //   item.GroupType === "All" || 
    //   (item.GroupType === "Selected Members" && item.InviteMemebers && item.InviteMemebers.some((member:any) => member.Id === CurrentUser))
    // );
  }
)
 
  .catch((error) => {
    console.error("Error fetching data: ", error);
  });

  const ids = window.location.search;
  //  alert(ids)
  const originalString = ids;
  // alert(originalString)
  const idNum2 :any = originalString.substring(1);
  // alert(idNum2)
  const getgroup =   await sp.web.lists
  .getByTitle("ARGGroupandTeam")
  .items.getById(idNum2).select("*,InviteMemebers/Id,InviteMemebers/Title,InviteMemebers/EMail,GroupType").expand("InviteMemebers")()
  .then((res) => {
    // arr=res;
    console.log(res , ":response")
    // debugger
    console.log("res------",res)
    setArrDetails(res)
  })
  .catch((error) => {
    console.log("Error fetching data: ", error);
  });
}
const getpostdata =async()=>{
  console.log("ARGGroupandTeamComments get data")
  try {

    let newPost: any[] = []

    await sp.web.lists

      .getByTitle("ARGGroupandTeamComments") // SharePoint list name

      .items.select("*,GroupTeamComments/Id,GroupTeamComments/Comments,GroupTeamsImages/Id,GroupTeamLikes/Id,Author/Id,Author/Title")

      .expand("GroupTeamComments,GroupTeamsImages,GroupTeamLikes ,Author").orderBy("Created", false)().then((item: any) => {

        console.log(item, 'ihhh');

        if (item.length > 0) {

          item.map((ele: any) => {
             console.log(ele, "ele data")
            let newPosts = {

              Contentpost: ele.Comments,

              SocialFeedImagesJson: ele.GroupTeamImagesJson,

              Created: ele.Created,

              userName: ele.Author?.Title,

              userAvatar: ele.userAvatar,

              likecount: 0,

              commentcount: 0,

              // comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],

              Id: ele.Id,

              SocialFeedUserLikesJson: ele?.UserLikesJSON != null ? JSON.parse(ele?.UserLikesJSON) : []

            };

            newPost.push(newPosts)

          }



          )

          const updatedPosts = [newPost, ...posts];

          setPosts(updatedPosts[0]);

        }




      })

    // setStoredPosts(items.map((item) => item.Title));
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
}
console.log(ArrDetails , "ArrDetails")

const CreatePostTab = () => {

  debugger

  setHideCreatePost(true)

  setHideShowPost(false)

}
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

};
const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  // const files = Array.from(e.target.files || []); // Ensure files is an array of type File[]
  // let uploadedImages: any[] = [];
  // let ImagesIds: any[] = [];
  // for (const file of files) {
  //   try {
  //     // Assuming uploadFileToLibrary is your custom function to upload files
  //     const uploadedImage = await uploadFileToLibrary(file, sp, "SocialFeedImages");

  //     uploadedImages.push(uploadedImage); // Store uploaded image data
  //     console.log(uploadedImage, 'Uploaded file data');
  //   } catch (error) {
  //     console.log("Error uploading file:", file.name, error);
  //   }
  // }



  // // Set state after uploading all images

  // setImages(flatArray(uploadedImages)); // Store all uploaded images

  // setUploadFile(flatArray(uploadedImages)); // Optional: Track the uploaded file(s) in another state

};
  useEffect(() => {

    // const savedComments = localStorage.getItem('comments');

    // if (savedComments) {

    //   setComments(JSON.parse(savedComments));

    // }

    ApiLocalStorageData();

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

  }, []);

  const ApiLocalStorageData = async () => {

    debugger;

 

    //Get the Id parameter

    const ids = window.location.search;

    const originalString = ids;

    const idNum = originalString.substring(1);

    // const queryString = decryptId(Number(updatedString));

 

    // setArrDetails(await getGroupTeamDetailsById(sp, Number(idNum)));

  };

 

  const ApICallData = async () => {

    setCurrentUser(await getCurrentUser(sp,siteUrl));

    setCurrentUserProfile(await getCurrentUserProfile(sp,siteUrl));

 

    let initialComments: any[] = [];

    const ids = window.location.search;

    const originalString = ids;

    const idNum = originalString.substring(1);

    sp.web.lists

      .getByTitle("ARGGroupandTeamComments")

      .items.select("*,GroupandTeam/Id")

      .expand("GroupandTeam")
      .filter(`GroupandTeamId eq ${Number(idNum)}`).orderBy("Created",false)()
      .then((result: any) => {

        console.log(result, "ARGGroupandTeamComments");

 

        initialComments = result;

        setComments(

          initialComments.map((res) => ({

            Id: res.Id,

            UserName: res.UserName,

            AuthorId: res.AuthorId,

            Comments: res.Comments,

            Created: new Date(res.Created).toLocaleString(), // Formatting the created date

            UserLikesJSON:

              res.UserLikesJSON != "" &&

              res.UserLikesJSON != null &&

              res.UserLikesJSON != undefined

                ? JSON.parse(res.UserLikesJSON)

                : [], // Default to empty array if null

            UserCommentsJSON:

              res.UserCommentsJSON != "" &&

              res.UserCommentsJSON != null &&

              res.UserCommentsJSON != undefined

                ? JSON.parse(res.UserCommentsJSON)

                : [], // Default to empty array if null

            userHasLiked: res.userHasLiked,

            UserProfile: res.UserProfile,

            // Initialize as false

          }))

        );

 

        // getUserProfilePicture(CurrentUser.Id,sp).then((url) => {

        //   if (url) {

        //     console.log("Profile Picture URL:", url);

        //   } else {

        //     console.log("No profile picture found.");

        //   }

        // });

      });

  };

 

  // Load comments from localStorage on component mount

  // useEffect(() => {

  //   const storedComments = localStorage.getItem('comments');

  //   if (storedComments) {

  //     setComments(JSON.parse(storedComments));

  //   }

  // }, []);

 

  // Save comments to localStorage whenever comments state changes

  // useEffect(() => {

  //   localStorage.setItem('comments', JSON.stringify(comments));

  // }, [comments]);

 

  const copyToClipboard = (Id:number) => {

    const link = `${siteUrl}/SitePages/GroupandTeamDetails.aspx?${Id}`;

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

      .getByTitle("ARGGroupandTeamComments")

      .items.add({

        UserName: CurrentUser.Title,

        Comments: newComment,

        UserLikesJSON: "",

        UserCommentsJSON: "",

        userHasLiked: false,

        // GroupandTeamId: ArrDetails[0].Id,

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

 

        console.log("Item added successfully:", newItem);

      });

 

    // setComments((prevComments) => [...prevComments, newCommentData]);

  };

 

  // Add a like to a comment

  const handleLikeToggle = async (commentIndex: number) => {

    const updatedComments = [...comments];

 

    const comment = updatedComments[commentIndex];

 

    // Check if the user has already liked the comment

 

    const userLikeIndex = comment.UserLikesJSON.findIndex(

      (like: Like) => like.UserName === CurrentUser.Title // Replace with actual username property

    );

 

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

 

              console.log("Like count updated successfully:", newItem);

            });

        });

    }

  };

 

  // Add a reply to a comment

  const handleAddReply = async (commentIndex: number, replyText: string) => {

    debugger;

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

          .then((ress: any) => {

            console.log(ress, "ressress");

            setComments(updatedComments);

          });

      });

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

  // console.log(ArrDetails, "console.log(ArrDetails)");

  const sendanEmail = () => {

    window.open("https://outlook.office.com/mail/inbox");

  };

  return (

    // <div id="wrapper" ref={elementRef}>

    //   <div className="app-menu" id="myHeader">

    //     <VerticalSideBar _context={sp} />

    //   </div>

    //   <div className="content-page">

    //       <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>

    //     <div

    //       className="content"

    //       style={{ marginLeft: `${!useHide ? "240px" : "80px"}`, marginTop:'1rem' }}

    //     >

    //       <div className="container-fluid  paddb">

    //         <div className="row">

    //           <div className="col-lg-3">

    //             <CustomBreadcrumb Breadcrumb={Breadcrumb} />

    //           </div>

    //         </div>

    //         {ArrDetails.length > 0

    //           ? ArrDetails.map((item: any) => {

    //               return (

    //                 <>

    //                   <div className="row mt-4">

    //                     <p className="d-block mt-2 text-dark  font-28">

    //                       {item.GroupName}

    //                     </p>

    //                     <div className="row mt-2">

    //                       <div className="d-flex">

    //                         <p className="mb-2 mt-1 newsvg font-14 d-flex">

    //                           <span className="pe-2 text-nowrap mb-0 d-inline-block" style={{fontSize:'14px'}}>

    //                             <Calendar size={16} />

    //                             {moment(item.Created).format("DD-MMM-YYYY")}

    //                             &nbsp; &nbsp;|

    //                           </span>

    //                           <span

    //                             className="text-nowrap mb-0 d-inline-block"

    //                             onClick={sendanEmail} style={{fontSize:'14px'}}

    //                           >

    //                             <Share size={16} /> Share by email &nbsp; 

    //                             &nbsp;|&nbsp;

    //                           </span>

    //                           <span

    //                             className="text-nowrap mb-0 d-inline-block"

    //                             onClick={() => copyToClipboard(item.Id)} style={{fontSize:'14px'}}

    //                           >

    //                             <Link size={16} /> Copy link &nbsp; &nbsp;

    //                             {copySuccess && <span className="text-success">{copySuccess}</span>}

    //                           </span>
    //                           <span style={{fontSize:'14px'}}>&nbsp; &nbsp; |{item.GroupType}</span>
    //                           <span style={{ display: 'flex', gap: '0.2rem',fontSize:'14px' }}> &nbsp; &nbsp;|
    //                           {
    //                             item?.InviteMemebers?.length > 0 && item?.InviteMemebers.map((item1: any, index: 0) => {

    //                               return (
    //                                 <>
    //                                   {item1.EMail ? <span style={{ margin: index == 0 ? '0 0 0 0' : '0 0 0px -12px' }} data-tooltip={item.Title}><img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item1.EMail}`} className="attendeesImg" /> <span data-tooltip={item.Title}></span></span> :
    //                                     <span> <AvtarComponents Name={item1.Title} data-tooltip={item.Title}/> </span>
    //                                   }
    //                                 </>
    //                               )
    //                             })
    //                           }
    //                         </span>
    //                         </p>

    //                       </div>

    //                     </div>

    //                   </div>

    //                   <div className="row ">

    //                     <p

    //                       style={{ lineHeight: "22px" }}

    //                       className="d-block text-muted mt-0 font-14"

    //                     >

    //                       {/* {item.GroupName} */}

    //                     </p>

    //                   </div>

 

    //                   <div className="row mt-2">

    //                     <p

    //                       style={{ lineHeight: "22px" }}

    //                       className="d-block text-muted mt-2 mb-0 font-14"

    //                     >

    //                       <div

    //                         dangerouslySetInnerHTML={{

    //                           __html: item.GroupDescription,

    //                         }}

    //                       ></div>

    //                     </p>

    //                   </div>

    //                 </>

    //               );

    //             })

    //           : null}

    //         {/* <div className="row">

    //           {

    //             ArrDetails.length > 0 ? ArrDetails.map((item: any) => {

    //               return (

    //                 <h4>{item.Title}</h4>

    //               )

    //             }) : null

    //           }

 

    //         </div> */}

    //         <div className="col-lg-8">

    //           <div className=" flex-wrap align-items-center justify-content-end mt-3 mb-3 p-0">

    //             {/* Button to trigger modal */}

    //             <button

    //               type="button"

    //               data-bs-toggle="modal"

    //               data-bs-target="#discussionModal"

    //               className="btn rounded-pill1 btn-secondary waves-effect waves-light"

    //             >

    //               <i className="fe-plus-circle"></i> Add New Post

    //             </button>

    //           </div>

 

    //           {/* Bootstrap Modal */}

    //           <div

    //             className="modal fade bd-example-modal-lg"

    //             id="discussionModal"

    //             tabIndex={-1}

    //             aria-labelledby="exampleModalLabel"

    //             aria-hidden="true"

    //             data-target=".bd-example-modal-lg"

    //           >

    //             <div className="modal-dialog modal-lg ">

    //               <div className="modal-content">

    //                 <div className="modal-header d-block">

    //                   <h5 className="modal-title" id="exampleModalLabel">

    //                     Add a Post

    //                   </h5>

    //                   <button

    //                     type="button"

    //                     className="btn-close"

    //                     data-bs-dismiss="modal"

    //                     aria-label="Close"

    //                   ></button>

    //                 </div>

    //                 <div className="modal-body">

    //                   <div className="row" style={{ paddingLeft: "0.5rem" }}>

    //                     <div className="col-md-6">

    //                       <div

    //                         className=""

    //                         style={{

    //                           width: "200%",

                             

    //                         }}

    //                       >

    //                         <div

    //                           className="card-body"

    //                           style={{ padding: "1rem 0.9rem" }}

    //                         >

    //                           {/* New comment input */}

    //                           <h4 className="mt-0 mb-3 text-dark fw-bold font-16">

    //                             Comments

    //                           </h4>

    //                           <div className="mt-3">

    //                             <textarea

    //                               id="example-textarea"

    //                               className="form-control text-dark form-control-light mb-2"

    //                               value={newComment}

    //                               onChange={(e) =>

    //                                 setNewComment(e.target.value)

    //                               }

    //                               placeholder="Add a new comment..."

    //                               rows={3}

    //                               style={{ borderRadius: "unset" }}

    //                             />

    //                             <button

    //                               className="btn btn-primary mt-2"

    //                               onClick={handleAddComment}

    //                               disabled={loading} // Disable button when loading

    //                               data-bs-dismiss="modal"

    //                             >

    //                               {loading ? "Submitting..." : "Add Comment"}{" "}

    //                               {/* Change button text */}

    //                             </button>

    //                           </div>

    //                         </div>

    //                       </div>

    //                     </div>

    //                   </div>

    //                 </div>

    //               </div>

    //             </div>

    //           </div>

    //         </div>

 

    //         <div className="row" style={{ paddingLeft: "0.5rem" }}>

    //           {comments.map((comment, index) => (

    //             <div className="col-xl-6">

    //               <CommentCard

    //                 key={index}

    //                 commentId={index}

    //                 username={comment.UserName}

    //                 Commenttext={comment.Comments}

    //                 Comments={comments}

    //                 Created={comment.Created}

    //                 likes={comment.UserLikesJSON}

    //                 replies={comment.UserCommentsJSON}

    //                 userHasLiked={comment.userHasLiked}

    //                 CurrentUserProfile={CurrentUserProfile}

    //                 onAddReply={(text) => handleAddReply(index, text)}

    //                 onLike={() => handleLikeToggle(index)} // Pass like handler

    //               />

    //             </div>

    //           ))}

    //         </div>

    //       </div>

    //     </div>

    //   </div>

    // </div>
    <div id="wrapper" ref={elementRef}>

    <div

      className="app-menu"

      id="myHeader">

      <VerticalSideBar _context={sp} />

    </div>

    <div className="content-page">

        <HorizontalNavbar  _context={sp} siteUrl={siteUrl}/>

      <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop:'1rem' }}>

        <div className="container-fluid  paddb">

          <div className="row" style={{ paddingLeft: '0.5rem' }}>

            <div className="col-lg-3">

              <CustomBreadcrumb Breadcrumb={Breadcrumb} />

            </div>

          </div>

          <div className="row mt-3">

            <div className="col-md-3 mobile-w1">
              <div className="row">

                <div style={{ display: 'flex', gap: '1rem' }}>

                  {/* <img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`}

                    className="rounded-circlecss img-thumbnail avatar-xl" style={{

                      borderRadius: '5rem', height: '3rem',

                      width: '3rem'

                    }} /> */}

                  <span style={{

                    whiteSpace: 'nowrap',

                    display: 'flex',

                    alignItems: 'center'

                  }}>
                    {/* {ArrDetails[0].GroupName} */}
                  
                  </span>

                </div>

              </div>
              <div className="row mt-3">
              {/* {ArrDetails[0].GroupDescription} */}
                </div>     
              
            </div>

            <div className="col-md-6 mobile-w2">

              {activeMainTab === "feed" && (

                <>

                  <div className="card cardcss" style={{ borderRadius: '20px' }}>

                    <div className="post-form">

                      <ul className="navcss nav-tabs nav-bordered">

                        <li className="nav-itemcss">

                          <a className={classNames('nav-linkcss px-4 py-3', { active: hideCreatePost && !HideShowPost })} onClick={CreatePostTab}>Create Post</a>

                        </li>

                        <li className="nav-itemcss">

                          {/* <a className={classNames('nav-linkcss px-4 py-3', { active: HideShowPost && !hideCreatePost })} onClick={ShowPost}>My Post</a> */}

                        </li>

                      </ul>

                      {
                      hideCreatePost &&

                        <div className="tab-content pt-0">

                          <div className="tab-pane p-3 active show">

                            <div className="border rounded">

                              <form onSubmit={handleSubmit} className="comment-area-box">

                                <textarea

                                  className="form-control border-0 resize-none textareacss"

                                  placeholder="Write A Post In This Group..."

                                  // value={Contentpost}

                                  rows={4}

                                  // onChange={(e) => setContent(e.target.value)}

                                />

                                <div className="p-2 bg-light d-flex justify-content-between align-items-center">

                                  {/* <label>

                                <input

                                  type="file"

                                  multiple

                                  accept="image/*"

                                  onChange={handleImageChange}

                                  style={{ display: 'none' }}

                                />

                                Upload Image

                              </label> */}

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

                                  <div className="image-preview mt-2">

                                    {/* <div className="grid-container">

                                  {SocialFeedImagesJson.map((image: any, index) => {

                                    const imageUrl = mergeAndRemoveDuplicates(siteUrl, image.fileUrl);

                                    const className = index === 0 ? 'large-image' : 'small-image'; // First image as large, rest as small



                                    return (

                                      <div key={index} className={`grid-item ${className}`}>

                                        <img src={imageUrl} alt={`Social feed ${index}`} />

                                      </div>

                                    );

                                  })}

                                </div> */}

                                    {/* {SocialFeedImagesJson.map((image: any, index) => {

                                      var imageUrl = mergeAndRemoveDuplicates(siteUrl, image.fileUrl)

                                      console.log(imageUrl);



                                      return (

                                        <><img key={index} src={imageUrl} alt={`preview-${index}`} style={{ width: '100px', marginRight: '10px' }} />



                                        </>

                                      )

                                    }



                                    )} */}

                                  </div>

                                  <button type="submit" className="btn btn-sm btn-success font-121">

                                    <FontAwesomeIcon icon={faPaperPlane} /> Post

                                  </button>

                                </div>

                              </form>

                            </div>

                          </div>

                        </div>

                      }

                    </div>

                  </div>

                  {posts.length > 0 && hideCreatePost && !HideShowPost &&

                    <div className="feed">

                      {posts.length > 0 ? posts.map((post, index) => (

                        <PostComponent 

                          key={index}

                          sp={sp}

                          siteUrl={siteUrl}

                          // currentUserName={currentUsername}

                          // currentEmail={currentEmail}

                          post={{

                            userName: post.userName,

                            Created: post.Created,

                            Contentpost: post.Contentpost,

                            SocialFeedImagesJson: post.SocialFeedImagesJson,

                            userAvatar: post.userAvatar,

                            likecount: post.likecount,

                            commentcount: post.commentcount,

                            comments: post?.comments != null ? post.comments : [],

                            postId: post.Id,

                            SocialFeedUserLikesJson: post.SocialFeedUserLikesJson

                          }}



                        />

                      )) : null}

                    </div>

                  }

                  {/* Post Feed */}
                  
                  {/* {postsME.length > 0 && !hideCreatePost && HideShowPost &&
                    <div className="feed">
                      {postsME.map((post, index) =>
                      {
                        console.log(postsME,'postsME');
                        return(
                          <PostComponent
                            key={index}
                            sp={sp}
                            siteUrl={siteUrl}
                            currentUserName={currentUsername}
                            currentEmail={currentEmail}
                            post={{
                              userName: post.userName,
                              Created: post.Created,
                              Contentpost: post.Contentpost,
                              SocialFeedImagesJson: post.SocialFeedImagesJson,
                              userAvatar: post.userAvatar,
                              likecount: post.likecount,
                              commentcount: post.commentcount,
                              comments: post?.comments != null ? post.comments : [],
                              postId: post.Id,
                              SocialFeedUserLikesJson: post.SocialFeedUserLikesJson
                            }}
                          />
                        )
                      } 
                     )}
                    </div>

                  } */}

                </>

              )}

           

            </div>

            <div className="col-md-3 mobile-w3">

              <div className="card mobile-5" style={{ borderRadius: "1rem" }}>

                <div className="card-body pb-3 gheight">



                  <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }}>

                    Group Owner



                  </h4>

                </div>

              </div>



              <div className="card mobile-6" style={{ borderRadius: "1rem" }}>

                <div className="card-body pb-3 gheight">

                  <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }}>

                    Group you Follow

                  
                  </h4>

                  <div className="inbox-widget mt-4">

                    {GroupData.map((item: any, index: 0) => (

                      <div

                        key={index}

                        className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between mb-3"

                      >

                        {/* <div className="col-sm-2 ">

                          <a>

                            <img

                              src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.EMail}`}

                              className="rounded-circle"

                              width="50"

                              alt={user.name}

                            />

                          </a>

                        </div> */}

                        <div className="col-sm-8">

                          <a>

                            <p className="fw-bold font-14 mb-0 text-dark namcss" style={{ fontSize: '14px' }}>

                              {item.GroupName}

                            </p>

                          </a>

                       

                        </div>

                        <div className="col-sm-2 txtr">
                        <button>Join</button>
                          {/* <PlusCircle size={20} color='#008751' /> */}

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div >

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