import React, { useContext, useEffect, useRef, useState } from "react";
import CustomBreadcrumb from "../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb";
import VerticalSideBar from "../../verticalSideBar/components/VerticalSideBar";
import { SPFI } from "@pnp/sp/presets/all";
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
import { Modal } from "react-bootstrap";
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
const ProjectDetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const siteUrl = props.siteUrl;
  const menuRef = useRef(null);
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
    setInterval(() => {
      ApICallData()
    }, 1000)
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
  }, []);
  const ApiLocalStorageData = async () => {
    debugger;

    //Get the Id parameter
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    // const queryString = decryptId(Number(updatedString));

    setArrDetails(await getProjectDetailsById(sp, Number(idNum)));
  };

  const ApICallData = async () => {
    debugger;
    setCurrentUser(await getCurrentUser(sp, siteUrl));
    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl));

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
  };

  const [showModal, setShowModal] = useState(false);

  const openModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
  const copyToClipboard = (Id: number) => {
    const link = `${siteUrl}/SitePages/ProjectDetails.aspx?${Id}`;
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
      .then((ress: any) => {
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
    const updatedComments = [...comments];
    const comment = updatedComments[commentIndex];

    const userLikeIndex = comment.UserLikesJSON.findIndex(
      (like: Like) => like.UserName === CurrentUser.Title
    );

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
        .then((res: any) => {
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
        });
    } else {
      // Remove the like
      const userLikeId = comment.UserLikesJSON[userLikeIndex].ID;

      await sp.web.lists
        .getByTitle("ARGProjectUserLikes")
        .items.getById(userLikeId)
        .delete()
        .then(() => {
          updatedComments[commentIndex] = {
            ...comment,
            UserLikesJSON: comment.UserLikesJSON.filter(
              (_, idx) => idx !== userLikeIndex
            ),
            userHasLiked: false,
          };

          setComments(updatedComments);
        });
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
      ChildComponent: "Project Details",
      ChildComponentURl: `${siteUrl}/SitePages/ProjectDetails.aspx`,
    },
  ];
  //#endregion
  console.log(ArrDetails, "console.log(ArrDetails)");
  const sendanEmail = () => {
    window.open("https://outlook.office.com/mail/inbox");
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
            <div className="row ">
              <div className="col-lg-8">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
              <div className="col-lg-4">

                <button
                  onClick={(e) => openModal(e)}
                  className="btn btn-secondary font-14 float-end"
                >
                  <FilePlus /> Open Document
                </button>

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
                return (
                  <>
                    <div className="row mt-3">
                      <p className="d-block mt-2 font-28">
                        {item.ProjectName}
                      </p>
                      <div className="row mt-2">
                        <div className="col-md-12 col-xl-12">
                          <p className="mb-2 mt-1 newt6 font-14 d-flex">
                            <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={14} />{" "}
                              {moment(item.StartDate).format("DD-MMM-YYYY")}{" "}
                              &nbsp; &nbsp; &nbsp;|
                            </span>
                            <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={sendanEmail}
                            >
                              <Share size={14} /> Share by email &nbsp; &nbsp;
                              &nbsp;|&nbsp; &nbsp; &nbsp;
                            </span>
                            <span
                              className="text-nowrap mb-0 d-inline-block"
                              onClick={() => copyToClipboard(item.Id)}
                            >
                              <Link size={14} /> Copy link &nbsp; &nbsp;
                              &nbsp;
                              {copySuccess && (
                                <span className="text-success">
                                  {copySuccess}
                                </span>
                              )}
                            </span>
                            <div
                              style={{
                                minWidth: "70px",
                                maxWidth: "100%",
                                position: "relative",
                              }}
                            >
                              <div style={{ display: "flex" }}>
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
                                          }}
                                          src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${id?.EMail}`}
                                          className="rounded-circlecss img-thumbnail avatar-xl"
                                          alt="profile-image"
                                        />
                                      );
                                    }
                                  }
                                )}
                                {item?.TeamMembers?.length > 3 && (
                                  <div
                                    className=""
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
                                      }}
                                      className="rounded-circlecss img-thumbnail avatar-xl"
                                    >
                                      +
                                    </div>
                                  </div>
                                )}
                              </div>
                              {showDropdownId === item.Id && (
                                <div
                                  className=""
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
                                          <div className="m-1">
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
                                    <p

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
            <div className="row mt-2">
              <div className="col-md-6">
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
                <div className="col-xl-6" style={{ marginTop: "1rem" }}>
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
                    Action="Project"
                    onAddReply={(text) => handleAddReply(index, text)}
                    onLike={() => handleLikeToggle(index)} // Pass like handler
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

const ProjectDetails: React.FC<IProjectDetailsProps> = (props) => {
  return (
    <Provider>
      <ProjectDetailsContext props={props} />
    </Provider>
  );
};
export default ProjectDetails;
