import React, { useEffect, useState } from 'react'

import Provider from '../../../GlobalContext/provider';

import { getSP } from '../loc/pnpjsConfig';

import { SPFI } from '@pnp/sp/presets/all';

import { getCurrentUser, getCurrentUserProfile, getCurrentUserProfileEmail, getuserprofilepic } from '../../../APISearvice/CustomService';

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

import { getAllAnnouncementnonselected, getAnnouncementDetailsById, TimeFormat } from '../../../APISearvice/AnnouncementsService';

import { Calendar, Link, Share } from 'react-feather';

import moment from 'moment';

import UserContext from '../../../GlobalContext/context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Reply {

  Id: number;

  AuthorId: number,

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

  AuthorId: number,

  Count: number;

  Created: string;

}



interface Comment {

  Id: number

  UserName: string;

  AuthorEmail: string,
  SPSPicturePlaceholderState:string; 

  AuthorId: number,

  Comments: string;

  Created: string;

  UserLikesJSON: Like[];
  LikesCount: any;

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
 const [SPSPicturePlaceholderState, setSPSPicturePlaceholderState]= useState(null);
  const [CurrentUserProfile, setCurrentUserProfile]: any[] = useState("")

  const siteUrl = props.siteUrl;
  const videositeurl = props.siteUrl?.split("/sites")[0];
  const [copySuccess, setCopySuccess] = useState('');

  const [NewsId, setId] = useState(0)

  const { useHide }: any = React.useContext(UserContext);

  const context = React.useContext(UserContext);

  const { setHide }: any = context;
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [ArrtopNews, setArrtopNews]: any[] = useState([]);
  let videoRef: any;
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

  }, [props]);
  //setInterval(() => {
  // getApiData()
  // }, 1000)
  const ApiLocalStorageData = async () => {

    debugger

    const ids = window.location.search;

    const originalString = ids;

    const idNum = originalString.substring(1);

    setId(Number(idNum))

    // const queryString = decryptId(Number(updatedString));
    setArrDetails(await getAnnouncementDetailsById(sp, Number(idNum)));
    let Newsdata = await getAllAnnouncementnonselected(sp, Number(idNum), 'News');
    setArrtopNews(Newsdata);
    // let arr = []

    // if (localStorage.getItem("NewsArr") != undefined && localStorage.getItem("NewsArr") != null && localStorage.getItem("NewsArr") != "") {

    //   let JsonArr = localStorage.getItem("NewsArr");

    //   arr.push(JSON.parse(JsonArr))

    //   console.log(arr, 'asssmmfmf');



    //   setArrDetails(arr)

    // }



  }

  const getApiData = async () => {


    let initialComments: any[] = []

    const ids = window.location.search;

    const originalString = ids;
    let initialArray: any[] = [];
    let arrLike = {}
    let likeArray: any[] = []
    const idNum = originalString.substring(1);
    sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items
      .select("*,AnnouncementAndNews/Id ,Author/ID,Author/Title,Author/EMail,Author/SPSPicturePlaceholderState").expand("AnnouncementAndNews,Author")
      .filter(`AnnouncementAndNewsId eq ${Number(idNum)}`).orderBy("Created", false)()
      .then(async (result: any) => {

        console.log(result, 'ARGAnnouncementandNewsComments data');



        initialComments = result;

        for (var i = 0; i < initialComments.length; i++) {
          await sp.web.lists
            .getByTitle("ARGAnnouncementandNewsUserLikes")
            .items.filter(`AnnouncementAndNewsCommentId eq ${Number(initialComments[i].Id)}`).select("ID,AuthorId,UserName,Like,Created")()
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
                AuthorEmail: initialComments[i].Author.EMail,
                SPSPicturePlaceholderState : initialComments[i].Author.SPSPicturePlaceholderState,
                Comments: initialComments[i].Comments,
                Created: initialComments[i].Created, // Formatting the created date
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
        // setComments(initialComments.map((res) => ({

        //   Id: res.Id,

        //   UserName: res.UserName,

        //   AuthorId: res.AuthorId,

        //   Comments: res.Comments,

        //   Created: new Date(res.Created).toLocaleString(), // Formatting the created date

        //   UserLikesJSON: res.UserLikesJSON != "" && res.UserLikesJSON != null && res.UserLikesJSON != undefined ? JSON.parse(res.UserLikesJSON) : [], // Default to empty array if null

        //   UserCommentsJSON: res.UserCommentsJSON != "" && res.UserCommentsJSON != null && res.UserCommentsJSON != undefined ? JSON.parse(res.UserCommentsJSON) : [], // Default to empty array if null

        //   userHasLiked: res.userHasLiked,

        //   UserProfile: res.UserProfile

        //   // Initialize as false

        // })))



        // getUserProfilePicture(CurrentUser.Id,sp).then((url) => {

        //   if (url) {

        //     console.log("Profile Picture URL:", url);

        //   } else {

        //     console.log("No profile picture found.");

        //   }

        // });

      })
  }
  useEffect(() => {
    getApiData()
  }, [])
  const ApICallData = async () => {

    debugger

    setCurrentUser(await getCurrentUser(sp, siteUrl))

    setCurrentUserProfile(await getCurrentUserProfile(sp, siteUrl))

     const profileemail = await getCurrentUserProfileEmail(sp);
      setSPSPicturePlaceholderState( await getuserprofilepic(sp,profileemail));



  }



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



  // Add a new comment
  const getvideo = (ele: any) => {
    console.log("ele", ele);
    videoRef = ele;
    //ele.pause();
  }
  const NavigatetoEvents = () => {
    window.location.href = `${siteUrl}/SitePages/News.aspx`;
  };
  const gotoNewsDetails = (valurArr: any) => {
    debugger;
    localStorage.setItem("EventId", valurArr.Id);
    localStorage.setItem("EventArr", JSON.stringify(valurArr));
    setTimeout(() => {
      window.location.href = `${siteUrl}/SitePages/NewsDetails.aspx?${valurArr.Id}`;
    }, 1000);
  };
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

        AuthorEmail: CurrentUser.Email,
        SPSPicturePlaceholderState : SPSPicturePlaceholderState,

        Comments: ress.data.Comments,

        Created:ress.data.Created,

        UserLikesJSON: [],

        UserCommentsJSON: [],
        LikesCount: 0,
        userHasLiked: false, // Initialize as false

        UserProfile: ress.data.UserProfile

      };

      setComments((prevComments) => [newCommentData1,...prevComments]);

      setNewComment('');

      setLoading(false);

    })



    // setComments((prevComments) => [...prevComments, newCommentData]);



  };



  // Add a like to a comment



  const handleLikeToggle = async (commentIndex: number) => {
    setLoadingLike(true);
    try {
      // Create a shallow copy of the comments array to maintain immutability
      const updatedComments = [...comments];
      const comment = updatedComments[commentIndex];

      // Find if the current user has already liked the specific comment
      const userLikeIndex = comment.UserLikesJSON.findIndex(
        (like: Like) => like.UserName === CurrentUser.Title
      );

      if (userLikeIndex === -1) {
        // User hasn't liked yet, proceed to add a like
        const response = await sp.web.lists.getByTitle("ARGAnnouncementAndNewsUserLikes").items.add({
          UserName: CurrentUser.Title,
          Like: true,
          AnnouncementAndNewsCommentId: comment.Id,
          userHasLiked: true
        });

        // Construct the new like object and add it to UserLikesJSON for the specific comment
        const newLikeJson: Like = {
          ID: response.data.Id,
          AuthorId: response.data.AuthorId,
          UserName: response.data.UserName,
          like: "yes",
          Created: response.data.Created,
          Count: comment.UserLikesJSON.length + 1
        };

        updatedComments[commentIndex].UserLikesJSON.push(newLikeJson);
        updatedComments[commentIndex].LikesCount = comment.UserLikesJSON.length; // Update only this comment's LikesCount

        // Update the corresponding SharePoint list for only the specific comment
        await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.getById(comment.Id).update({
          UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
          userHasLiked: true,
          LikesCount: updatedComments[commentIndex].LikesCount
        });

        updatedComments[commentIndex].userHasLiked = true; // Set like status for this comment only
        setComments(updatedComments);

      } else {
        // User already liked, proceed to unlike
        const userLikeId = comment.UserLikesJSON[userLikeIndex].ID; // Get the ID of the user's like

        // Remove the like from the SharePoint list for only the specific comment
        await sp.web.lists.getByTitle("ARGAnnouncementAndNewsUserLikes").items.getById(userLikeId).delete();

        // Remove the like from the comment's UserLikesJSON array
        updatedComments[commentIndex].UserLikesJSON.splice(userLikeIndex, 1);
        updatedComments[commentIndex].LikesCount = comment.UserLikesJSON.length; // Update only this comment's LikesCount

        // Update the corresponding SharePoint list for only the specific comment
        await sp.web.lists.getByTitle("ARGAnnouncementandNewsComments").items.getById(comment.Id).update({
          UserLikesJSON: JSON.stringify(updatedComments[commentIndex].UserLikesJSON),
          userHasLiked: false,
          LikesCount: updatedComments[commentIndex].LikesCount
        });

        updatedComments[commentIndex].userHasLiked = false; // Set like status for this comment only
        setComments(updatedComments);
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

    debugger
    setLoadingReply(true);
    try {

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

          UserEmail :CurrentUser.Email,
          SPSPicturePlaceholderState : SPSPicturePlaceholderState,

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

    }
    catch (error) {
      setLoadingReply(false);
      console.error('Error toggling Reply:', error);
    }
    finally {
      setLoadingReply(false); // Enable the button after the function completes
    }

  };

  const copyToClipboard = (Id: number) => {

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

  const sendanEmail = (item: any) => {
    // window.open("https://outlook.office.com/mail/inbox");

    //const subject = "News Title-" + item.Title;
    //const body = 'Here is the link to the news:' + `${siteUrl}/SitePages/NewsDetails.aspx?${item.Id}`;

    // const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the link to launch the default mail client (like Outlook)
    //window.location.href = mailtoLink;

    //const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const subject = "Thought You’d Find This Interesting!";
    const body = 'Hi,' +
        'I came across something that might interest you: ' +
        `<a href="${siteUrl}/SitePages/NewsDetails.aspx?${item.Id}"></a>`
    const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`;

    window.open(office365MailLink, '_blank');
  };

  return (

    <div id="wrapper" ref={elementRef}>

      <div

        className="app-menu"

        id="myHeader">

        <VerticalSideBar _context={sp} />

      </div>

      <div className="content-page">

        <HorizontalNavbar _context={sp} siteUrl={siteUrl} />

        <div className="content" style={{ marginLeft: `${!useHide ? '240px' : '80px'}`, marginTop: '0rem' }}>

          <div style={{ paddingLeft: '1.3rem', paddingRight: '2.3rem' }} className="container-fluid  paddb">
            <div className='row'>
              <div className='col-lg-8'>
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



                          <p className="d-block mt-2 font-28">

                            {item.Title}

                          </p>

                          <div className="row mt-2">

                            <div className="col-md-12 col-xl-12">

                              <p className="mb-2 mt-1 text-dark d-block font-14 eventtextnew">

                                <span className="pe-2 text-nowrap mb-0 d-inline-block">

                                  <Calendar size={18} /> {moment(item.Modified).format("DD-MMM-YYYY")}  &nbsp;  &nbsp;  &nbsp;|

                                </span>

                                <span style={{ cursor: 'pointer' }} className="text-nowrap hovertext mb-0 d-inline-block" onClick={() => sendanEmail(item)} >

                                  <Share size={18} />  Share by email &nbsp;  &nbsp;  &nbsp;|&nbsp;  &nbsp;  &nbsp;

                                </span>

                                <span style={{ cursor: 'pointer' }} className="text-nowrap hovertext mb-0 d-inline-block" onClick={() => copyToClipboard(item.Id)}>

                                  <Link size={18} />    Copy link &nbsp;  &nbsp;  &nbsp;

                                  {copySuccess && <span className="text-success">{copySuccess}</span>}

                                </span>



                              </p>

                              {/* {copySuccess && <p>{copySuccess}</p>} */}

                            </div>

                          </div>

                        </div>

                          <div className="row">



                            <p style={{ lineHeight: '22px', fontSize: '15px' }} className="d-block text-dark mt-2">

                              {item.Overview}

                            </p>

                          </div>

                          <div className="row internalmedia filterable-content mt-3">

                            {



                              AnnouncementAndNewsGallaryJSON.length > 0 ?

                                AnnouncementAndNewsGallaryJSON.map((res: any) => {
                                  { console.log("resresanewsssres", res) }
                                  return (

                                    <div className="col-sm-6 col-xl-4 filter-item all web illustrator">

                                      <div className="gal-box">

                                        <a data-bs-toggle="modal" data-bs-target="#centermodal" className="image-popup mb-2" title="Screenshot-1">
                                          {res.fileType.startsWith('video/') ?
                                            <video muted={true} id='Backendvideo' ref={getvideo} style={{
                                              width: '100%', height: '100%', objectFit: 'cover', borderRadius: '13px', cursor: 'auto',
                                            }} className="img-fluid imgcssscustom" controls={true}>
                                              <source src={(videositeurl + res.fileUrl) + "#t=5"} type="video/mp4"></source>
                                            </video> :
                                            <img src={`${videositeurl}${res.fileUrl}`}

                                              className="img-fluid imgcssscustom" alt="work-thumbnail" data-themekey="#" style={{
                                                width: '100%', height: '100%', objectFit: 'cover', cursor: 'auto', borderRadius: '13px'
                                              }} />
                                          }

                                        </a>

                                      </div>

                                    </div>

                                  )

                                })

                                : <></>



                            }



                          </div><div className="row mt-2">

                            <p style={{ lineHeight: '22px', fontSize: '15px' }} className="d-block newpara text-dark mt-2 mb-0 font-14">

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

                    <div className="col-md-12">

                      <div className="card p-4" style={{ border: '1px solid #54ade0', borderRadius: '20px', boxShadow: '0 3px 20px #1d26260d' }}>

                        <div>

                          {/* New comment input */}

                          <h4 className="mt-0 mb-3 text-dark fw-bold font-16">Comments</h4>

                          <div className="mt-3">

                            <textarea id="example-textarea"

                              className="form-control text-dark mb-0"

                              value={newComment}

                              onChange={(e) => setNewComment(e.target.value)}

                              placeholder="Add a new comment..."

                              rows={3} style={{ borderRadius: 'unset' }}

                            />
                            <div className="p-2 bg-light d-flex justify-content-end align-items-center">
                              <button

                                className="btn btn-primary mt-1 mb-1"

                                onClick={handleAddComment}

                                disabled={loading} // Disable button when loading

                              >


                                <FontAwesomeIcon style={{ float: 'left', margin: "7px 0px 0px 6px" }} icon={faPaperPlane} />
                                {loading ? 'Submitting...' : 'Post'} {/* Change button text */}

                              </button>
                            </div>
                          </div>

                        </div>

                      </div>



                    </div>



                  </div>

                  <div className="row">



                    {/* New comment input */}



                    {comments.map((comment, index) => (



                      <div className="col-xl-12 eventcommm">

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
                          loadingLike={loadingLike}

                          onAddReply={(text) => handleAddReply(index, text)}

                          onLike={() => handleLikeToggle(index)} // Pass like handler
                          loadingReply={loadingReply}
                          newsArray={ArrDetails}

                          CurrentUserEmail = {CurrentUser.Email}
                         CurrSPSPicturePlaceholderState ={SPSPicturePlaceholderState}
                        siteUrl = {siteUrl}
                        />

                      </div>



                    ))}

                  </div>

                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ position: 'sticky', top: '90px' }} className="card postion8">
                  <div className="card-body">
                    <h4 className="header-title text-dark  fw-bold mb-0">
                      <span style={{ fontSize: '20px' }}>Latest News</span>    <a className="font-11 btn btn-primary  waves-effect waves-light view-all cursor-pointer" href="#" onClick={NavigatetoEvents} style={{ float: 'right', lineHeight: '12px' }}>View All</a></h4>
                    {console.log("Arrtopneewss", ArrtopNews)}
                    {ArrtopNews && ArrtopNews.map((res: any) => {
                      return (
                        <div className="mainevent mt-2">
                          <div className="bordernew">
                            <h3 className="twolinewrap font-16 hovertext text-dark fw-bold mb-2 cursor-pointer" style={{ cursor: "pointer" }} onClick={() => gotoNewsDetails(res)}>{res.Title}</h3>
                            <p style={{ lineHeight: '20px', fontSize: '15px' }} className=" text-muted twolinewrap">{res.Overview}</p>
                            <div className="row">
                              <div className="col-sm-12"> <span style={{ marginTop: "4px" }} className="date-color font-12 float-start  mb-1 ng-binding"><i className="fe-calendar"></i> {moment(res.Modified).format("DD-MMM-YYYY")}</span>  &nbsp; &nbsp; &nbsp; <span className="font-12" style={{ color: '#009157', fontWeight: '600' }}>  </span></div>

                            </div>
                          </div>

                        </div>
                      )
                    })}

                  </div>
                </div>


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