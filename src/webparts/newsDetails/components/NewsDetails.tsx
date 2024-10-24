import React, { useEffect, useState } from 'react'
import Provider from '../../../GlobalContext/provider';
import { getSP } from '../loc/pnpjsConfig';
import { SPFI } from '@pnp/sp/presets/all';
import { getCurrentUser, getCurrentUserProfile } from '../../../APISearvice/CustomService';
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar';
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar';
import { CommentNewsCard } from '../../../CustomJSComponents/CustomCommentCard/CommentNewsCard';
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../CustomCss/mainCustom.scss";
import "../../verticalSideBar/components/VerticalSidebar.scss";
import "../components/NewsDetails.scss";
import { INewsDetailsProps } from './INewsDetailsProps';
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb';
import { getAnnouncementDetailsById } from '../../../APISearvice/AnnouncementsService';
import { Calendar, Link, Share } from 'react-feather';
import moment from 'moment';
import UserContext from '../../../GlobalContext/context';
interface Reply {
  Id: number;
  AuthorId: number,
  UserName: string;
  Comments: string;
  Created: string;
  UserProfile: string;
}

interface Like {
  ID: number;
  like: string;
  UserName: string;
  AuthorId: number,
  Count: number;
  Created: string;
}

interface Comment {
  Id: number
  UserName: string;
  AuthorId: number,
  Comments: string;
  Created: string;
  UserLikesJSON: Like[];
  UserCommentsJSON: Reply[];
  userHasLiked: boolean; // New property to track if the user liked this comment
  UserProfile: string;
}
const NewsdetailsContext = ({ props }: any) => {
  const sp: SPFI = getSP();
  console.log(sp, "sp");
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [CurrentUser, setCurrentUser]: any[] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ArrDetails, setArrDetails]: any[] = useState([])
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("")
  const siteUrl = props.siteUrl;
  const [copySuccess, setCopySuccess] = useState('');
  const [NewsId,setId]=useState(0)
  const { useHide }: any = React.useContext(UserContext);
  const context = React.useContext(UserContext);
  const { setHide }: any = context;
  const Breadcrumb = [
    {
      "MainComponent": "Home",
      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`
    },
    {
      "ChildComponent": "News",
      "ChildComponentURl": `${siteUrl}/SitePages/News.aspx`
    }
  ]
  // Load comments from localStorage on mount
  useEffect(() => {
    // const savedComments = localStorage.getItem('comments');
    // if (savedComments) {
    //   setComments(JSON.parse(savedComments));
    // }
    ApiLocalStorageData()
    ApICallData()
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
    debugger
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    setId(Number(idNum))
    // const queryString = decryptId(Number(updatedString));

    setArrDetails(await getAnnouncementDetailsById(sp, Number(idNum)))
    // let arr = []
    // if (localStorage.getItem("NewsArr") != undefined && localStorage.getItem("NewsArr") != null && localStorage.getItem("NewsArr") != "") {
    //   let JsonArr = localStorage.getItem("NewsArr");
    //   arr.push(JSON.parse(JsonArr))
    //   console.log(arr, 'asssmmfmf');

    //   setArrDetails(arr)
    // }

  }

  const ApICallData = async () => {
    debugger
    setCurrentUser(await getCurrentUser(sp,siteUrl))
    setCurrentUserProfile(await getCurrentUserProfile(sp,siteUrl))

    let initialComments: any[] = []
    const ids = window.location.search;
    const originalString = ids;
    const idNum = originalString.substring(1);
    sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.select("*,AnnouncementAndNews/Id").expand("AnnouncementAndNews").filter(`AnnouncementAndNewsId eq ${Number(idNum)}`)().then((result: any) => {
      console.log(result, 'ARGAnnouncementandNewsComments');

      initialComments = result;
      setComments(initialComments.map((res) => ({
        Id: res.Id,
        UserName: res.UserName,
        AuthorId: res.AuthorId,
        Comments: res.Comments,
        Created: new Date(res.Created).toLocaleString(), // Formatting the created date
        UserLikesJSON: res.UserLikesJSON != "" && res.UserLikesJSON != null && res.UserLikesJSON != undefined ? JSON.parse(res.UserLikesJSON) : [], // Default to empty array if null
        UserCommentsJSON: res.UserCommentsJSON != "" && res.UserCommentsJSON != null && res.UserCommentsJSON != undefined ? JSON.parse(res.UserCommentsJSON) : [], // Default to empty array if null
        userHasLiked: res.userHasLiked,
        UserProfile: res.UserProfile
        // Initialize as false
      })))

      // getUserProfilePicture(CurrentUser.Id,sp).then((url) => {
      //   if (url) {
      //     console.log("Profile Picture URL:", url);
      //   } else {
      //     console.log("No profile picture found.");
      //   }
      // });
    })
  }

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

  // Add a new comment
  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.add({
      UserName: CurrentUser.Title,
      Comments: newComment,
      UserLikesJSON: "",
      UserCommentsJSON: "",
      userHasLiked: false,
      AnnouncementAndNewsId: ArrDetails[0].Id,
      UserProfile: CurrentUserProfile
    }).then((ress: any) => {
      console.log(ress, 'ressress');
      const newCommentData1: Comment = {
        Id: ress.data.Id,
        UserName: ress.data.UserName,
        AuthorId: ress.data.AuthorId,
        Comments: ress.data.Comments,
        Created: new Date(ress.data.Created).toLocaleString(),
        UserLikesJSON: [],
        UserCommentsJSON: [],
        userHasLiked: false, // Initialize as false
        UserProfile: ress.data.UserProfile
      };
      setComments((prevComments) => [...prevComments, newCommentData1]);
      setNewComment('');
      setLoading(false);
    })

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
      await sp.web.lists.getByTitle("ARGAnnouncementAndNewsUserLikes").items.add({
        UserName: CurrentUser.Title, // Replace with actual username
        Like: true,
        AnnouncementAndNewsCommentsId: comment.Id,
        userHasLiked: true
      }).then(async (ress: any) => {
        console.log(ress, 'Added Like');
  
        // Add the new like to the comment's UserLikesJSON array
        const newLikeJson: Like = {
          ID: ress.data.Id,
          AuthorId: ress.data.AuthorId,
          UserName: ress.data.UserName, // Replace with actual username
          like: "yes",
          Created: ress.data.Created,
          Count: comment.UserLikesJSON.length + 1
        };
  
        updatedComments[commentIndex].UserLikesJSON.push(newLikeJson);
  
        // Update the corresponding SharePoint list
        await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.getById(comment.Id).update({
          UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
          userHasLiked: true,
          LikesCount: comment.UserLikesJSON.length
        }).then(() => {
          console.log('Updated comment with new like');
          comment.userHasLiked = true;
          setComments(updatedComments);
        });
      });
    } else {
      // User already liked, proceed to unlike (remove like)
      const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like
  
      await sp.web.lists.getByTitle("ARGAnnouncementAndNewsUserLikes").items.getById(userLikeId).delete().then(async () => {
        console.log('Removed Like');
  
        // Remove the like from the comment's UserLikesJSON array
        updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);
  
        // Update the corresponding SharePoint list
        await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.getById(comment.Id).update({
          UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
          userHasLiked: false,
          LikesCount: comment.UserLikesJSON.length
        }).then(() => {
          console.log('Updated comment after removing like');
          comment.userHasLiked = false;
          setComments(updatedComments);
        });
      });
    }
  };
  

  // Add a reply to a comment
  const handleAddReply = async (commentIndex: number, replyText: string) => {
    debugger
    if (replyText.trim() === '') return;
    const updatedComments = [...comments];

    const comment = updatedComments[commentIndex];
    await sp.web.lists.getByTitle("ARGAnnouncementAndNewsUserComments").items.add({
      UserName: CurrentUser.Title, // Replace with actual username
      Comments: replyText,
      AnnouncementAndNewsCommentsId: updatedComments[commentIndex].Id,
    }).then(async (ress: any) => {
      console.log(ress, 'ressress');
      const newReplyJson = {
        Id: ress.data.Id,
        AuthorId: ress.data.AuthorId,
        UserName: ress.data.UserName, // Replace with actual username
        Comments: ress.data.Comments,
        Created: ress.data.Created,
        UserProfile: CurrentUserProfile
      };
      updatedComments[commentIndex].UserCommentsJSON.push(newReplyJson);
      await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.getById(updatedComments[commentIndex].Id).update({
        // UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
        UserCommentsJSON: JSON.stringify(updatedComments[commentIndex].UserCommentsJSON),
        userHasLiked: updatedComments[commentIndex].userHasLiked,
        CommentsCount: comment.UserCommentsJSON.length + 1
      }).then((ress: any) => {
        console.log(ress, 'ressress');
        setComments(updatedComments);
      })
    })

  };
  const copyToClipboard = (Id:number) => {
    const link = `${siteUrl}/SitePages/NewsDetails.aspx?${Id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopySuccess('Link copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(err => {
        setCopySuccess('Failed to copy link');
      });
  };
  const sendanEmail =()=>
    {
        window.open("https://outlook.office.com/mail/inbox");
    
    }
  return (
 <div id="wrapper" ref={elementRef}>
      <div 
        className="app-menu"
        id="myHeader">
        <VerticalSideBar _context={sp} />
      </div>
      <div className="content-page">
        <HorizontalNavbar />
        <div className="content mt-4" style={{marginLeft: `${!useHide ? '240px' : '80px'}`,marginTop:'1.5rem'}}>
          <div className="container-fluid  paddb">
            <div>
              <div className="row">
                <div className="col-lg-3">
                  <CustomBreadcrumb Breadcrumb={Breadcrumb} />
                </div>
              </div>
              {
                ArrDetails.length > 0 ? ArrDetails.map((item: any) => {
                  const AnnouncementAndNewsGallaryJSON = item.AnnouncementAndNewsGallaryJSON == undefined || item.AnnouncementAndNewsGallaryJSON == null ? ""
                    : JSON.parse(item.AnnouncementAndNewsGallaryJSON);
                  console.log(AnnouncementAndNewsGallaryJSON);
                  return (
                    <><div className="row mt-4">

                      <p  className="d-block mt-2 font-28">
                        {item.Title}
                      </p>
                      <div className="row mt-2">
                        <div className="col-md-12 col-xl-12">
                          <p className="mb-2 mt-1 d-block font-14">
                            <span className="pe-2 text-nowrap mb-0 d-inline-block">
                              <Calendar size={18} /> {moment(item.Created).format("DD-MMM-YYYY")}  &nbsp;  &nbsp;  &nbsp;|
                            </span>
                            <span className="text-nowrap mb-0 d-inline-block" onClick={sendanEmail}>
                              <Share size={18} />  Share by email &nbsp;  &nbsp;  &nbsp;|&nbsp;  &nbsp;  &nbsp;
                            </span>
                            <span className="text-nowrap mb-0 d-inline-block" onClick={() => copyToClipboard(item.Id)}>
                              <Link size={18} />    Copy link &nbsp;  &nbsp;  &nbsp;
                              {copySuccess && <span className="text-success">{copySuccess}</span>}
                            </span>


                          </p>
                           {/* {copySuccess && <p>{copySuccess}</p>} */}
                        </div>
                      </div>
                    </div>
                      <div className="row" style={{ paddingLeft: '0.5rem' }}>

                        <p style={{ lineHeight: '22px' }} className="d-block text-muted mt-2 font-14">
                          {item.Overview}
                        </p>
                      </div>
                      <div className="row internalmedia filterable-content mt-3">
                        {


                          AnnouncementAndNewsGallaryJSON.length > 0 ?
                            AnnouncementAndNewsGallaryJSON.map((res: any) => {
                              return (
                                <div className="col-sm-6 col-xl-3 filter-item all web illustrator">
                                  <div className="gal-box">
                                    <a data-bs-toggle="modal" data-bs-target="#centermodal" className="image-popup mb-2" title="Screenshot-1">
                                      <img src={`https://officeindia.sharepoint.com${res.fileUrl}`} 
                                      className="img-fluid imgcssscustom" alt="work-thumbnail" data-themekey="#" style={{ width: '100%', height: '100%' ,objectFit: 'cover',
                                        borderRadius: '15px' }} />
                                    </a>
                                  </div>
                                </div>
                              )
                            })
                            : <></>


                        }

                      </div><div className="row mt-2">
                        <p style={{ lineHeight: '22px' }} className="d-block text-muted mt-2 mb-0 font-14">
                          <div
                            dangerouslySetInnerHTML={{ __html: item.Description }}
                          ></div>
                        </p>
                      </div></>
                  )
                }) : null
              }
              {/* <div className="row">
              {
                ArrDetails.length > 0 ? ArrDetails.map((item: any) => {
                  return (
                    <h4>{item.Title}</h4>
                  )
                }) : null
              }

            </div> */}
              <div className="row  mt-2">
                <div className="col-md-6">
                  <div className="card" style={{ border: '1px solid #54ade0', borderRadius: '20px', boxShadow: '0 3px 20px #1d26260d' }}>
                    <div className="card-body" style={{ padding: '1rem 0.9rem' }}>
                      {/* New comment input */}
                      <h4 className="mt-0 mb-3 text-dark fw-bold font-16">Comments</h4>
                      <div className="mt-3">
                        <textarea id="example-textarea"
                          className="form-control text-dark form-control-light mb-2"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a new comment..."
                          rows={3} style={{ borderRadius: 'unset' }}
                        />
                        <button
                          className="btn btn-primary mt-2"
                          onClick={handleAddComment}
                          disabled={loading} // Disable button when loading
                        >

                          {loading ? 'Submitting...' : 'Add Comment'} {/* Change button text */}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
              <div className="row" style={{ paddingLeft: '0.5rem' }}>


                {/* New comment input */}

                {comments.map((comment, index) => (

                  <div className="col-xl-6">
                    <CommentNewsCard
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
    </div>
  );
};


const NewsDetails: React.FC<INewsDetailsProps> = (props) => {
  return (
    <Provider>
      <NewsdetailsContext props={props} />
    </Provider>
  );
};
export default NewsDetails;