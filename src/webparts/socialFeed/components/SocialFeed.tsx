import React, { useEffect, useRef, useState } from 'react'
import HorizontalNavbar from '../../horizontalNavBar/components/HorizontalNavBar'
import VerticalSideBar from '../../verticalSideBar/components/VerticalSideBar'
import { ISocialFeedProps } from './ISocialFeedProps'
import Provider from '../../../GlobalContext/provider'
import { getSP } from '../loc/pnpjsConfig'
import { SPFI } from '@pnp/sp/presets/all';
import UserContext from '../../../GlobalContext/context';
import "../components/SocialFeed.scss";
import "../../../CustomCss/mainCustom.scss";
import "../../../Assets/Figtree/Figtree-VariableFont_wght.ttf";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomBreadcrumb from '../../../CustomJSComponents/CustomBreadcrumb/CustomBreadcrumb'
import { Link, MoreVertical, Plus, PlusCircle, Rss, TrendingUp, User, UserPlus, Users } from 'react-feather'
import { addActivityLeaderboard, addNotification, getCurrentUser, getCurrentUserName, getCurrentUserNameId, getCurrentUserProfileEmail, getFollow, getFollowing } from '../../../APISearvice/CustomService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import classNames from 'classnames'
import { uploadFileToLibrary } from '../../../APISearvice/AnnouncementsService'
import { PostComponent } from '../../../CustomJSComponents/SocialFeedPost/PostComponent'
import { fetchBlogdatatop, fetchBookmarkBlogdata } from '../../../APISearvice/BlogService'
import AvtarComponents from '../../../CustomJSComponents/AvtarComponents/AvtarComponents'
import { fetchUserInformationList } from '../../../APISearvice/Dasborddetails'
import { getDiscussion, getDiscussionFilter, fetchTrendingDiscussionBasedOn, getOldDiscussionForum, getDiscussionComments } from '../../../APISearvice/DiscussionForumService'
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { toLower } from "lodash";

import Swal from 'sweetalert2'
interface Post {
  text: string;
  images: string[];
}
const SocialFeedContext = ({ props }: any) => {
  const siteUrl = props.siteUrl;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const sp: SPFI = getSP();
  const { useHide }: any = React.useContext(UserContext);
  const context = React.useContext(UserContext);
  const { setHide }: any = context;
  console.log(sp, "sp");
  const [posts, setPosts] = useState([]);
  const [postsME, setPostsME] = useState([]);

  const [Contentpost, setContent] = useState('');
  const [SocialFeedImagesJson, setImages] = useState<string[]>([]);
  const [hideCreatePost, setHideCreatePost] = useState(true)
  const [HideShowPost, setHideShowPost] = useState(false)
  const [currentEmail, setCurrentEmail] = useState("")
  const [CurrentUser, setCurrentUser] = useState<any>([])

  const [currentId, setCurrentID] = useState<any>(0)
  const [CurrentData, setCurrentData] = useState<any>([])

  const [currentUsername, setCurrentUserName] = useState("")
  const [UploadedFile, setUploadFile] = useState([])
  const [ImageIds, setImageIds] = useState([])
  const [blogdata, setblogdata] = useState([])
  const [FollowingUser, setFollowingUsers] = useState<any[]>([]);
  const [FollowUser, setFollowUsers] = useState<any[]>([]);
  const [usersitem, setUsersArr] = useState<any[]>([]);
  const [followwerLength, setfollowwerLength] = useState(0); // Start with 10 posts
  const [followingLength, setFollowingListLength] = useState(0); // Start with 10 posts
  const [followStatus, setFollowStatus] = React.useState<{ [key: number]: boolean }>({}); // Track follow status for each user

  const [followerList, setFollowerList] = React.useState<any[]>([]); // List of users following the current user
  const [followingList, setFollowingList] = React.useState<any[]>([]); // List of users the current user is following
  const [isMenuOpenshare, setIsMenuOpenshare] = useState(false);
  const [DiscussionData, setDiscussion] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [Loading1, setLoading1] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState('');
  const [activeMainTab, setActiveMainTab] = useState("feed");
  const [loadingReply, setLoadingReply] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  const [Currentusercompany, setCurrentusercompany] = useState("");
  const [IsCall, setIsCall] = useState(true);
  const [CurrentDataAll, setCurrentDataAll] = useState<any>([])

  const menuRef = useRef(null);
  useEffect(() => {
    // Load posts from localStorage when the component mounts
    // const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    // console.log(storedPosts);
    fetchUserInformationList();
    // setPosts(storedPosts);
    getAllAPI();

    const handleClickOutside = (event: { target: any; }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpenshare(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [props]);
  const getAllAPI = async () => {
    setCurrentEmail(await getCurrentUserProfileEmail(sp))
    setCurrentUser(await getCurrentUser(sp))

    // const currentData = filteredEmployeeData.slice(0, 10);
    if (IsCall) {
      const cuurentID = await getCurrentUserNameId(sp);
      setCurrentID(cuurentID)
      setIsCall(false)
    }

    setCurrentUserName(await getCurrentUserName(sp))
    //setblogdata(await fetchBlogdatatop(sp))
    setblogdata(await fetchBookmarkBlogdata(sp))
    //setUsersArr(await fetchUserInformationList(sp))

    fetchPosts();
    fetchFollowingList()

    FilterDiscussionData()
    // setFollowUsers(await getFollow(sp))
    // setFollowingUsers(await getFollowing(sp))


  }
  const fetchUserInformationList = async () => {
    try {
      const currentUser = await sp.web.currentUser();
      let FollowedIds: any[] = [];
      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${currentUser.Id}`)
        .getAll().then((x) => {
          for (let i = 0; i < x.length; i++) {
            FollowedIds.push(`ID ne ${x[i].FollowedId}`)
          }
        });
      console.log(FollowedIds, 'FollowedIds');
      let finalquery = FollowedIds.map((x) => x).join(' and ');

      console.log(finalquery, 'finalquery');

      const strfilter = FollowedIds.length > 0 ? `EMail ne null and ID ne ${currentUser.Id} and ${finalquery} and ContentType eq 'Person'` : `EMail ne null and ID ne ${currentUser.Id} and ContentType eq 'Person'`

      const userListSP = await sp.web.lists
        .getByTitle("User Information List")
        .items
        .select("ID", "Title", "EMail", "Department", "JobTitle", "Picture", "MobilePhone", "WorkPhone", "Name")
        // .filter(`EMail ne null and ID ne ${currentUser.Id} and ${finalquery}`) // content tyep eq person
        .filter(strfilter) // content tyep eq person
        ();
      // console.log("userList",userListSP);
      // let currentWPContext:WebPartContext=props.props.context;  
      let currentWPContext: WebPartContext = props.context;
      // console.log("props",props);
      const msgraphClient: MSGraphClientV3 = await currentWPContext.msGraphClientFactory.getClient('3');
      const m265userList = await msgraphClient.api("users")
        .version("v1.0")
        .select("displayName,mail,jobTitle,mobilePhone,companyName,userPrincipalName")
        .get();
      // console.log("m265userList",m265userList);

      //Adding dummy companies to users for testing
      //m265userList.value=m265userList.value.map((m:any)=>{let x=m; x['companyName']='dunnycommpany'; return x;});

      let userList: any[] = [];

      userList = userListSP.map(usr => {
        let musrs = m265userList.value.filter((usr1: any) => { return toLower(usr1.mail) == toLower(usr.EMail) });
        if (musrs.length > 0) {
          usr['companyName'] = musrs[0]['companyName'];
        }
        else usr['companyName'] = 'NA';
        return usr;
      });
      let CurrentUserDetails: any[] = [];
      CurrentUserDetails = userListSP.map(usr => {
        let musrs = m265userList.value.filter((usr1: any) => { return toLower(usr1.mail) == toLower(currentUser.Email) });
        if (musrs.length > 0) {
          setCurrentusercompany(musrs[0]['companyName'])
        }
      });

      setUsersArr(userList);
      const filteredEmployeeData = await applyFiltersAndSorting(userList, Currentusercompany);
      setCurrentData(filteredEmployeeData.slice(0, 5));
      setCurrentDataAll(filteredEmployeeData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const applyFiltersAndSorting = (data: any[], companyName: string) => {
    console.log("datatta", data, companyName)
    const filteredData = data.filter((item) => {
      return (
        (companyName === '' || ((item?.companyName) ? item?.companyName.toLowerCase().includes(companyName.toLowerCase()) : false))
      );
    });
    return filteredData;
  };



  const FilterDiscussionData = async () => {
    const announcementArr = await getOldDiscussionForum(sp);
    let lengArr: any;
    for (var i = 0; i < announcementArr.length; i++) {
      lengArr = await getDiscussionComments(sp, announcementArr[i].ID)
      console.log(lengArr, 'rrr old social feed', announcementArr[i]);
      announcementArr[i].commentsLength = lengArr.arrLength,
        announcementArr[i].likesCount = lengArr.totalLikes;         // Number of likes
      announcementArr[i].repliesCount = lengArr.totalRepliesCount;
      announcementArr[i].Users = lengArr.arrUser,
        announcementArr[i].CreatedDate = lengArr.CreatedDate
    }
    let filteredarray = [];
    filteredarray = announcementArr.filter((x) => (
      x.likesCount + x.repliesCount + x.commentsLength)

      > 10)
    if (filteredarray.length > 0) {
      setDiscussion(filteredarray.sort((a, b) => b.likesCount - a.likesCount))
    }
    console.log("filteredarray social feed", filteredarray);
    //setDiscussion(await getDiscussionFilter(sp))    
  }
  // Function to get list of users following the current user
  const fetchFollowerList = async () => {
    try {
      const currentUser = await sp.web.currentUser();
      const followers = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowedId eq ${currentUser.Id}`)
        .expand("Follower")
        .select("Follower/Title", "Follower/EMail", "Follower/Department", "Follower/ID")();
      followers.forEach(element => {
        checkIfFollower(element);
      });

      setFollowerList(followers.map(f => f.Follower));

    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  // Function to get list of users the current user is following
  const fetchFollowingList = async () => {
    let checkLength: any[] = [];
    try {
      const currentUser = await sp.web.currentUser();
      const followings = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${currentUser.Id}`)
        .expand("Followed")
        .select("Followed/Title", "Followed/EMail", "Followed/Department", "Followed/ID")();
      followings.forEach(element => {
        checkIfFollowing(element);
      });

      setFollowingList(followings.map(f => f.Followed));
      checkLength = followings.map(f => f.Followed)
      setFollowingListLength(checkLength.length)
    } catch (error) {
      console.error("Error fetching followings:", error);
    }
  };
  const checkIfFollowing = async (item: any) => {
    try {
      const currentUser = await sp.web.currentUser();
      if (item.ID != null && item.ID != undefined) {
        const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
          .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${item.ID}`)();

        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [item.ID]: followRecords.length > 0,
        }));
      }
      // Update the counts based on follow status

    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }
  const checkIfFollower = async (item: any) => {
    try {
      const currentUser = await sp.web.currentUser();
      if (item.ID != null && item.ID != undefined) {
        const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
          .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${item.ID}`)();

        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [item.ID]: followRecords.length > 0,
        }));
      }
      // Update the counts based on follow status

    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    setLoading1(true);
    try {
      const files = Array.from(e.target.files || []); // Ensure files is an array of type File[]
      let uploadedImages: any[] = [];
      let ImagesIds: any[] = [];
      for (const file of files) {
        try {
          // Assuming uploadFileToLibrary is your custom function to upload files
          const uploadedImage = await uploadFileToLibrary(file, sp, "SocialFeedImages");

          uploadedImages.push(uploadedImage); // Store uploaded image data
          console.log(uploadedImage, 'Uploaded file data');
        } catch (error) {
          console.log("Error uploading file:", file.name, error);
        }
      }



      // Set state after uploading all images

      setImages(flatArray(uploadedImages)); // Store all uploaded images

      setUploadFile(flatArray(uploadedImages)); // Optional: Track the uploaded file(s) in another state
    }
    catch (error) {
      setLoading1(false);
      console.error('Error toggling like:', error);
    }
    finally {
      setLoading1(false); // Enable the button after the function completes
    }
  };

  //#region flatArray

  const flatArray = (arr: any[]): any[] => {

    return arr.reduce((acc, val) => acc.concat(val), []);

  };

  //#endregion

  console.log(followingList, 'followingList', followerList, 'followerList');



  // [{"Contentpost":"th","SocialFeedImagesJson":[],"Created":"12:54:59 AM","userName":"Jeremy Tomlinson","userAvatar":"https://via.placeholder.com/50","likecount":0,"commentcount":0,"shares":0,"SocialFeedCommentsJson":[],"SocialFeedUserLikes":[]}]

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

  //   debugger

  //   e.preventDefault();

  //   setIsSubmitting(true);  // Start submitting



  //   if (Contentpost.trim() || SocialFeedImagesJson.length) {

  //     const newPost = {

  //       Contentpost,

  //       SocialFeedImagesJson,

  //       Created: new Date().toLocaleTimeString(),

  //       userName: currentUsername,

  //       userAvatar: 'https://via.placeholder.com/50',

  //       likecount: 0,

  //       commentcount: 0,

  //       shares: 0,

  //     };



  //     const updatedPosts = [newPost, ...posts];

  //     setPosts(updatedPosts);

  //     localStorage.setItem('posts', JSON.stringify(updatedPosts));



  //     // Clear fields

  //     setContent('');

  //     setImages([]);

  //     setIsSubmitting(false);  // End submitting

  //   } else {

  //     //alert("Please add some content or upload images before submitting.");

  //     setIsSubmitting(false);

  //   }

  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form default behavior
    debugger;

    if (!Contentpost.trim() && SocialFeedImagesJson.length === 0) {
      // Validation message when both fields are empty
      setValidationMessage("Please type something or upload an image.");
      setTimeout(() => setValidationMessage(""), 3000); // Clear message after 3 seconds
      return;
    }

    setLoading(true);
    try {
      let ImagesIdss: any[] = [];
      setIsSubmitting(true); // Start submitting
      let newPostss: any;

      const newPost = {
        Contentpost,
        SocialFeedImagesJson,
        Created: new Date().toLocaleTimeString(),
        userName: currentUsername,
        userAvatar: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`,
        likecount: 0,
        commentcount: 0,
        shares: 0,
      };
      ImagesIdss = ImagesIdss.concat(
        SocialFeedImagesJson.map((item: any) => item.ID)
      );
      setImageIds(ImagesIdss);
      try {
        await sp.web.lists
          .getByTitle("ARGSocialFeed")
          .items.add({
            Contentpost,
            SocialFeedImagesJson: JSON.stringify(SocialFeedImagesJson),
            UserName: currentUsername,
            userAvatar: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`,
            likecount: 0,
            commentcount: 0,
            SocialFeedImagesId: ImagesIdss,
          })
          .then(async (ele: any) => {
            newPostss = {
              Contentpost,
              SocialFeedImagesJson,
              Created: new Date().toLocaleTimeString(),
              userName: currentUsername,
              userAvatar: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`,
              likecount: 0,
              commentcount: 0,
              shares: 0,
              Id: ele.data.Id,
            };

            const updatedPosts = [newPostss, ...posts];
            await addActivityLeaderboard(sp, "Post By User");
            setPosts(updatedPosts);
            localStorage.setItem("posts", JSON.stringify(updatedPosts));
            fetchPosts();
            const notifiedArr = {
              ContentId: ele.data.Id,
              NotifiedUserId: ele.data.AuthorId,
              ContentType0: "Post By User",
              ContentName: ele.data.Contentpost,
              ActionUserId: CurrentUser.Id,
              DeatilPage: "SocialFeed",
              ReadStatus: false,
            };
            await addNotification(notifiedArr, sp);
          });

        // Clear fields
        setContent("");
        setImages([]);
        setLoading(false);
      } catch (error) {
        console.error("Error adding post to SharePoint: ", error);
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error toggling Reply:", error);
    }
  };


  const ShowPost = () => {

    debugger

    setHideCreatePost(false)

    setHideShowPost(true)
    fetchPostsMe();

  }

  const CreatePostTab = () => {

    debugger

    setHideCreatePost(true)

    setHideShowPost(false)
    fetchPosts()
  }

  const [post, setPost] = useState("");

  const [storedPosts, setStoredPosts] = useState([]);



  // Fetch posts from SharePoint when the component loads

  // Fetch posts from SharePoint list

  const fetchPosts = async () => {

    let followersCheck: any[] = []

    try {
      const currentUser = await sp.web.currentUser();
      const followers = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowedId eq ${currentUser.Id}`)
        .expand("Follower")
        .select("Follower/Title", "Follower/EMail", "Follower/Department", "Follower/ID")();
      console.log(followers, 'followers');

      followers.forEach(element => {
        checkIfFollower(element);
      });

      console.log(followers, "followers");

      followersCheck = followers.map(f => f.Follower)

      setfollowwerLength(followersCheck.length)
      if (followersCheck.length > 0) {//chhaya
        followersCheck.forEach(async element => {
          try {

            let newPost: any[] = []
            let filterQuery = followersCheck.length > 0 ? `AuthorId eq ${element.ID} or AuthorId eq ${currentUser.Id}` : `AuthorId eq ${element.ID}`;
            await sp.web.lists

              .getByTitle("ARGSocialFeed") // SharePoint list name

              .items.select("*,SocialFeedImages/Id,SocialFeedUserLikes/Id,Author/Id,Author/Title")

              .expand("SocialFeedImages,SocialFeedUserLikes,Author").filter(filterQuery).orderBy("Created", false)().then((item: any) => {

                console.log(item, 'ihhh');

                if (item.length > 0) {

                  item.map((ele: any) => {

                    let newPosts = {

                      Contentpost: ele.Contentpost,

                      SocialFeedImagesJson: ele.SocialFeedImagesJson,

                      Created: ele.Created,
                      AutherId: ele.Author?.Id,
                      userName: ele.Author?.Title,

                      userAvatar: ele.userAvatar,

                      likecount: 0,

                      commentcount: 0,

                      comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],

                      Id: ele.Id,

                      SocialFeedUserLikesJson: ele?.SocialFeedUserLikesJson != null ? JSON.parse(ele?.SocialFeedUserLikesJson) : []

                    };

                    newPost.push(newPosts)

                  }



                  )

                  const updatedPosts = [newPost, ...posts];
                  console.log(updatedPosts);

                  setPosts(updatedPosts[0]);

                }




              })
            //setVisibleCount(newPost.length)

            // setStoredPosts(items.map((item) => item.Title));
          } catch (error) {
            console.log("Error fetching posts:", error);
          }

        });
      }//chhaya
      else {
        try {

          let newPost: any[] = []

          await sp.web.lists

            .getByTitle("ARGSocialFeed") // SharePoint list name

            .items.select("*,SocialFeedImages/Id,SocialFeedUserLikes/Id,Author/Id,Author/Title")

            .expand("SocialFeedImages,SocialFeedUserLikes,Author").filter(`AuthorId eq ${currentUser.Id}`).orderBy("Created", false)().then((item: any) => {

              console.log(item, 'ihhh');

              if (item.length > 0) {

                item.map((ele: any) => {

                  let newPosts = {

                    Contentpost: ele.Contentpost,

                    SocialFeedImagesJson: ele.SocialFeedImagesJson,

                    Created: ele.Created,
                    AutherId: ele.Author?.Id,
                    userName: ele.Author?.Title,

                    userAvatar: ele.userAvatar,

                    likecount: 0,

                    commentcount: 0,

                    comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],

                    Id: ele.Id,

                    SocialFeedUserLikesJson: ele?.SocialFeedUserLikesJson != null ? JSON.parse(ele?.SocialFeedUserLikesJson) : []

                  };

                  newPost.push(newPosts)

                }



                )

                const updatedPosts = [newPost, ...posts];
                console.log(updatedPosts);

                setPosts(updatedPosts[0]);

              }




            })
          //setVisibleCount(newPost.length)

          // setStoredPosts(items.map((item) => item.Title));
        } catch (error) {
          console.log("Error fetching posts:", error);
        }
      }//chhaya


    } catch (error) {
      console.error("Error fetching followers:", error);
    }
    // checkIfFollower(element);


    // console.log(followers, followers);

    // setFollowerList(followers.map(f => f.Follower));



  };

  const fetchPostsMe = async () => {
    const cuurentID = await getCurrentUserNameId(sp);
    let followersCheck: any[] = []
    try {

      const followers = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowedId eq ${cuurentID}`)
        .expand("Follower")
        .select("Follower/Title", "Follower/EMail", "Follower/Department", "Follower/ID")();
      console.log(followers, 'followers');

      followers.forEach(element => {
        checkIfFollower(element);
      });

      console.log(followers, "followers");

      followersCheck = followers.map(f => f.Follower)
      if (followersCheck.length > 0) {//chhaya
        followersCheck.forEach(async element => {
          try {
            let newPost: any[] = []
            console.log(currentId, 'currentId["Id"]');
            let filterQuery = followersCheck.length > 0 ? `AuthorId eq ${element.ID} or AuthorId eq ${cuurentID}` : `AuthorId eq ${element.ID}`;

            await sp.web.lists
              .getByTitle("ARGSocialFeed") // SharePoint list name
              .items.select("*,SocialFeedComments/Id,SocialFeedComments/Comments,SocialFeedImages/Id,SocialFeedUserLikes/Id,Author/Id,Author/Title")
              .expand("SocialFeedComments,SocialFeedImages,SocialFeedUserLikes,Author")
              .filter(`AuthorId eq ${cuurentID}`).orderBy("Created", false)().then((item: any) => {
                console.log(item, 'ihhhpostsME');

                if (item.length > 0) {
                  item.map((ele: any) => {
                    let newPosts = {
                      Contentpost: ele.Contentpost,
                      SocialFeedImagesJson: ele.SocialFeedImagesJson,
                      Created: ele.Created,
                      AutherId: ele.Author?.Id,
                      userName: ele.Author?.Title,
                      userAvatar: ele.userAvatar,
                      likecount: 0,
                      commentcount: 0,
                      comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],
                      Id: ele.Id,
                      SocialFeedUserLikesJson: ele?.SocialFeedUserLikesJson != null ? JSON.parse(ele?.SocialFeedUserLikesJson) : []
                    };
                    newPost.push(newPosts)
                  }

                  )
                  const updatedPosts = [newPost, ...posts];
                  console.log(updatedPosts, 'updatedPosts');

                  setPostsME(updatedPosts[0]);
                  console.log(updatedPosts);
                }



              })

            // setStoredPosts(items.map((item) => item.Title));

          } catch (error) {

            console.log("Error fetching posts:", error);

          }
        })
      }//chhaya
      else {//chhaya
        try {
          let newPost: any[] = []
          console.log(currentId, 'currentId["Id"]');
          //   let filterQuery = followersCheck.length > 0 ? `AuthorId eq ${element.ID} or AuthorId eq ${cuurentID}` : `AuthorId eq ${element.ID}`;

          await sp.web.lists
            .getByTitle("ARGSocialFeed") // SharePoint list name
            .items.select("*,SocialFeedComments/Id,SocialFeedComments/Comments,SocialFeedImages/Id,SocialFeedUserLikes/Id,Author/Id,Author/Title")
            .expand("SocialFeedComments,SocialFeedImages,SocialFeedUserLikes,Author").filter(`AuthorId eq ${cuurentID}`).orderBy("Created", false)().then((item: any) => {
              console.log(item, 'ihhhpostsME');

              if (item.length > 0) {
                item.map((ele: any) => {
                  let newPosts = {
                    Contentpost: ele.Contentpost,
                    SocialFeedImagesJson: ele.SocialFeedImagesJson,
                    Created: ele.Created,
                    AutherId: ele.Author?.Id,
                    userName: ele.Author?.Title,
                    userAvatar: ele.userAvatar,
                    likecount: 0,
                    commentcount: 0,
                    comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],
                    Id: ele.Id,
                    SocialFeedUserLikesJson: ele?.SocialFeedUserLikesJson != null ? JSON.parse(ele?.SocialFeedUserLikesJson) : []
                  };
                  newPost.push(newPosts)
                }

                )
                const updatedPosts = [newPost, ...posts];
                console.log(updatedPosts, 'updatedPosts');

                setPostsME(updatedPosts[0]);
                console.log(updatedPosts);
              }



            })

          // setStoredPosts(items.map((item) => item.Title));

        } catch (error) {

          console.log("Error fetching posts:", error);

        }
      }//chhaya

    } catch (error) {

      console.log("Error fetching posts:", error);

    }

  };



  // Handle input change

  const handlePostChange = (e: { target: { value: React.SetStateAction<string> } }) => {

    setPost(e.target.value);

  };


  const handlePostSubmit = async () => {

    const newPost = post.trim();

    if (newPost) {

      try {

        // Add new post to SharePoint list

        await sp.web.lists

          .getByTitle("Posts") // SharePoint list name

          .items.add({

            Title: newPost, // Adding the post content to the "Title" field

          });



        // Refresh the list of posts after adding

        fetchPosts();

        setPost(""); // Clear the input field

      } catch (error) {

        console.log("Error adding post:", error);

      }

    }

  };

  const Breadcrumb = [

    {

      "MainComponent": "Home",

      "MainComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`

    },

    {

      "ChildComponent": "Social Feed",

      "ChildComponentURl": `${siteUrl}/SitePages/Dashboard.aspx`

    }

  ]

  const copyToClipboard = (Id: number) => {

    const link = `${siteUrl}/SitePages/SocialFeed.aspx?${Id}`;

    navigator.clipboard.writeText(link)

      .then(() => {

        setCopySuccess('Link copied!');

        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds

      })

      .catch(err => {

        setCopySuccess('Failed to copy link');

      });

  };

  const mergeAndRemoveDuplicates = (str: string, str1: string) => {



    let url = str1;



    // Find the position of the third occurrence of "/"



    let thirdSlashIndex = url.indexOf(

      "/",

      url.indexOf("/", url.indexOf("/") + 1) + 1

    );



    // Get the substring after the third occurrence of "/"



    let updatedUrl = url.substring(thirdSlashIndex);



    console.log("check the url--->>", updatedUrl); // Output: /SocialFeedImages/announcement-5.jpg





    return str + updatedUrl; // Concatenate directly if str1 starts with a slash

    //}

  };
  const gotoBlogsDetails = (valurArr: any) => {
    localStorage.setItem("NewsId", valurArr.Id)
    localStorage.setItem("NewsArr", JSON.stringify(valurArr))
    setTimeout(() => {
      window.location.href = `${siteUrl}/SitePages/BlogDetails.aspx?${valurArr.Id}`;
    }, 1000);
  }
  const GotoNextPageone = (item: any, pagename: string) => {

    console.log("item-->>>>", item)



    window.location.href = `${siteUrl}/SitePages/${pagename}.aspx`;

  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = (e: any) => {

    e.preventDefault()

    setIsMenuOpen(!isMenuOpen);

  };
  const handleTabClick = (tab: React.SetStateAction<string>) => {

    setActiveMainTab(tab);
    if (tab == "following") {
      fetchFollowingList()
    }
    else {
      fetchFollowerList()
    }
  };

  const truncateText = (text: string, maxLength: number) => {

    if (text != null) {

      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;



    }

  };
  const follow = async (e: any, itemId: number) => {
    e.preventDefault();
    try {
      const currentUser = await sp.web.currentUser();
      await sp.web.lists.getByTitle("ARGFollows").items.add({
        FollowerId: currentUser.Id,
        FollowedId: itemId
      });
      let UnFolloweduserID = CurrentDataAll.filter((x: any) => { return x.ID != itemId });

      setCurrentData(UnFolloweduserID.slice(0, 5));
      setCurrentDataAll(UnFolloweduserID);
      console.log("UnFolloweduser", CurrentDataAll, CurrentData, UnFolloweduserID);

      //fetchUserInformationList()
      Swal.fire("User followed successfully", "", "success");
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [itemId]: true,
      }));
      fetchFollowingList()
      // Increase follower count and decrease unfollower count

    } catch (error) {
      console.error("Error following:", error);
    }
  };
  const navigatetoDiscussionForum = (id: any) => {
    debugger
    console.log(id, "----id discussion");
    window.location.href = `${siteUrl}/SitePages/DiscussionForumDetail.aspx?${id}`;
  };
  const unfollow = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, itemId: number) => {
    e.preventDefault();
    try {
      const currentUser = await sp.web.currentUser();
      const followRecords = await sp.web.lists.getByTitle("ARGFollows").items
        .filter(`FollowerId eq ${currentUser.Id} and FollowedId eq ${itemId}`)();

      if (followRecords.length > 0) {
        await sp.web.lists.getByTitle("ARGFollows").items.getById(followRecords[0].Id).delete();

        setFollowStatus((prevStatus) => ({
          ...prevStatus,
          [itemId]: false,
        }));


      }
    } catch (error) {
      console.error("Error unfollowing:", error);
    }
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

          <div className="container-fluid paddb">

            <div className="row" style={{paddingLeft:'0.5rem'}}>

              <div className="col-lg-3">

                <CustomBreadcrumb Breadcrumb={Breadcrumb} />

              </div>

            </div>

            <div className="row mt-3">

              <div className="col-md-3 mobile-w1">
                <div className='psonew'>
                  <div className="row">

                    <div style={{ display: 'flex', gap: '0.1rem' }}>

                      <img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`}

                        className="rounded-circlecss img-thumbnail avatar-xl" style={{

                          borderRadius: '5rem', height: '3rem',

                          width: '3rem'

                        }} />

                      <span style={{

                        whiteSpace: 'nowrap',

                        display: 'flex',

                        alignItems: 'center'

                      }}>{currentUsername}</span>

                    </div>

                  </div>

                  <div className="row mt-3">

                    <div>

                      <div>

                        <div

                          className={`tabcss mb-2 mt-2 me-1 ${activeMainTab === "feed" ? "activenew" : ""

                            }`}

                          onClick={() => handleTabClick("feed")}

                          style={{ cursor: "pointer" }}

                        >

                          <span>

                            <Rss />{" "}

                          </span>{" "}

                          Feed

                        </div>

                        <div

                          className={`tabcss mb-2 mt-2 me-1 ${activeMainTab === "followers" ? "activenew" : ""

                            }`}

                          onClick={() => handleTabClick("followers")}

                          style={{ cursor: "pointer" }}

                        >

                          {" "}

                          <span>

                            <UserPlus />{" "}

                          </span>{" "}

                          Followers ({followwerLength})

                        </div>{" "}

                        <div className={`tabcss mb-2 mt-2 me-1 ${activeMainTab === "following" ? "activenew" : ""

                          }`} onClick={() => handleTabClick("following")} style={{ cursor: "pointer" }} >
                          <span><Users /> </span> Following ({followingLength})</div>

                      </div>

                    </div>


                    <div className='mt-4'>
                      <h4 className='font-14 mb-3 uppercase'>Bookmarked Blogs</h4>
                      {

                        blogdata.length > 0 ? blogdata.map((item: any) => {

                          return (

                            <div className="row mt-1 bbokmark" style={{ gap: '0.5rem', cursor: 'pointer' }}><div className="col-md-1" onClick={() => gotoBlogsDetails(item)}>

                              <span className="newbg"> <AvtarComponents Name={item.Title} /> </span>

                            </div>

                              <div className="col-md-10">

                                <span style={{ cursor: 'pointer' }} onClick={() => gotoBlogsDetails(item)} className="title-ellipsis hovertext font-14">{item.Title}</span>

                              </div></div>

                          )

                        }) : null

                      }

                    </div>




                  </div>
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

                            <a className={classNames('nav-linkcss px-4 py-3', { active: HideShowPost && !hideCreatePost })} onClick={ShowPost}>My Post</a>

                          </li>

                        </ul>

                        {hideCreatePost &&

                          <div className="tab-content pt-0">

                            <div className="tab-pane p-3 active show">

                              <div className="border rounded">

                                <form onSubmit={handleSubmit} className="comment-area-box">

                                  <textarea

                                    className="form-control border-0 resize-none textareacss"

                                    placeholder="Type your post here..."

                                    value={Contentpost}

                                    rows={4}

                                    onChange={(e) => setContent(e.target.value)}

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

                                        <Link className='hovertext' style={{ width: "20px", height: "16px" }} onClick={() => handleImageChange} />

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
                                      {Loading1 ? (
                                        <div className="spinner-border text-primary" role="status">
                                          <span className="sr-only">Loading...</span>
                                        </div>
                                      ) : (
                                        SocialFeedImagesJson.map((image: any, index) => {
                                          var imageUrl = mergeAndRemoveDuplicates(siteUrl, image.fileUrl);
                                          console.log(imageUrl);

                                          return (
                                            <img
                                              key={index}
                                              src={imageUrl}
                                              alt={`preview-${index}`}
                                              style={{
                                                width: "100px",
                                                marginRight: "10px",
                                              }}
                                            />
                                          );
                                        })
                                      )}
                                    </div>

                                    <button type="submit" className="btn btn-sm btn-primary font-121" disabled={Loading}>

                                      <FontAwesomeIcon icon={faPaperPlane} /> Post

                                    </button>

                                  </div>

                                </form>
                                {validationMessage && <p className="validation-message">{validationMessage}</p>}
                              </div>

                            </div>

                          </div>

                        }

                      </div>

                    </div>
                    {/* {posts.length > 0 && hideCreatePost && !HideShowPost && (//chhaya
                      <div className="feed">
                        {Loading ? (//chhaya
                          // Show loader when loading is true
                          <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          // Render posts when loading is false
                          posts.length > 0//chhaya
                            ? posts.map((post, index) => (
                              <PostComponent
                                key={index}
                                sp={sp}
                                siteUrl={siteUrl}
                                currentUserName={currentUsername}
                                CurrentUser={CurrentUser}
                                currentEmail={currentEmail}
                                editload={fetchPosts}
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
                                  AutherId: post.AutherId,
                                  SocialFeedUserLikesJson: post.SocialFeedUserLikesJson,
                                }}
                              />
                            ))
                            : null
                        )}
                      </div>
                    )} */}
                    {hideCreatePost && !HideShowPost && ( // Check hideCreatePost and HideShowPost
                      <div className="feed">
                        {posts.length === 0 ? ( // Check if no posts are available at the very beginning
                          <div className="no-posts-message">
                            <p>No posts available</p>
                          </div>
                        ) : (
                          Loading ? (
                            // Show loader when loading is true
                            <div className="spinner-border text-primary" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            // Render posts when loading is false
                            posts.map((post, index) => (
                              <PostComponent
                                key={index}
                                sp={sp}
                                siteUrl={siteUrl}
                                currentUserName={currentUsername}
                                CurrentUser={CurrentUser}
                                currentEmail={currentEmail}
                                editload={fetchPosts}
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
                                  AutherId: post.AutherId,
                                  SocialFeedUserLikesJson: post.SocialFeedUserLikesJson,
                                }}
                              />
                            ))
                          )
                        )}
                      </div>
                    )}

                    {/* Post Feed */}
                    {postsME.length > 0 && !hideCreatePost && HideShowPost &&
                      <div className="feed">
                        {postsME.map((post, index) => {
                          console.log(postsME, 'postsME');
                          return (
                            <PostComponent
                              key={index}
                              sp={sp}
                              siteUrl={siteUrl}
                              currentUserName={currentUsername}
                              CurrentUser={CurrentUser}
                              currentEmail={currentEmail}
                              editload={fetchPostsMe}
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
                                AutherId: post.AutherId,
                                SocialFeedUserLikesJson: post.SocialFeedUserLikesJson
                              }}
                            />
                          )
                        }
                        )}
                      </div>

                    }

                  </>

                )}

                {activeMainTab === "followers" && (

                  <div className="row card-view">

                    {followerList.map((item) => (

                      <div className="col-lg-6 col-md-6" key={item.Title}>

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

                                      "https://teams.microsoft.com",

                                      "_blank"

                                    )

                                  }

                                  alt="Call"

                                />

                                <img

                                  src={

                                    item.Picture != null

                                      ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item.EMail}`

                                      : require("../assets//users.jpg")

                                  }

                                  className="img-thumbnail

                                 avatar-xl"

                                  alt="profile-image"

                                  style={{ cursor: "pointer", borderRadius: '1000px', width: "6rem", height: '6rem' }}

                                />

                              </a>

                              <h4 className="mt-2 mb-1">

                                <a

                                  className="text-dark font-16 fw-bold"

                                  style={{

                                    textDecoration: "unset",

                                    fontSize: "20px",

                                  }}

                                >

                                  <strong>

                                    {truncateText(item.Title, 15)}

                                  </strong>

                                </a>

                              </h4>



                              <p

                                className="text-muted"

                                style={{ fontSize: "14px" }}

                              >

                                <span data-tooltip={item.EMail}>

                                  {truncateText(item.EMail, 15)} |

                                </span>

                                <span

                                  className="pl-2"

                                  style={{ color: "pink" }}

                                >

                                  {/* <a className="text-pink" > */}

                                  {truncateText(

                                    item.Department != null

                                      ? item.Department

                                      : " NA ",

                                    10

                                  )}



                                  {/* </a> */}

                                </span>

                              </p>

                              {/* <div

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

                                      "https://teams.microsoft.com",

                                      "_blank"

                                    )

                                  }

                                  className="btn btn-primary btn-sm waves-effect waves-light"

                                >

                                  Message

                                </button>

                                <button className="btn btn-light btn-sm waves-effect" 
                                onClick={(e) => followStatus[item.ID] ? 
                                unfollow(e, item.ID) : follow(e, item.ID)}>{followStatus[item.ID] ?
                                 "Unfollow" : "Follow"}</button>


                              </div> */}

                              {/* end row */}

                            </div>

                            {/* end .padding */}

                          </div>

                        </div>

                        {/* end card */}

                      </div> // end col

                    ))}

                  </div>

                )}

                {activeMainTab === "following" && (

                  <div className="row card-view">

                    {followingList.map((item) => (

                      <div className="col-lg-6 col-md-6" key={item.Title}>

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

                                      "https://teams.microsoft.com",

                                      "_blank"

                                    )

                                  }

                                  alt="Call"

                                />

                                <img

                                  src={

                                    item.Picture != null

                                      ? `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${item.EMail}`

                                      : require("../assets//users.jpg")

                                  }

                                  className="rounded-circlecssnew img-thumbnail

                                 avatar-xl"

                                  alt="profile-image"

                                  style={{ cursor: "pointer" }}

                                />

                              </a>

                              <h4 className="mt-2 mb-1">

                                <a

                                  className="text-dark font-16 fw-bold"

                                  style={{

                                    textDecoration: "unset",

                                    fontSize: "20px",

                                  }}

                                >



                                  {truncateText(item.Title, 15)}



                                </a>

                              </h4>



                              <p

                                className="text-muted"

                                style={{ fontSize: "14px" }}

                              >

                                <span data-tooltip={item.EMail}>

                                  {truncateText(item.EMail, 15)} |

                                </span>

                                <span

                                  className="pl-2"

                                  style={{ color: "pink" }}

                                >

                                  {/* <a className="text-pink" > */}

                                  {truncateText(

                                    item.Department != null

                                      ? item.Department

                                      : " NA ",

                                    10

                                  )}



                                  {/* </a> */}

                                </span>

                              </p>

                              {/* <div

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

                                      "https://teams.microsoft.com",

                                      "_blank"

                                    )

                                  }

                                  className="btn btn-primary btn-sm waves-effect waves-light"

                                >

                                  Message

                                </button>

                                <button className="btn btn-light btn-sm waves-effect" onClick={(e) => followStatus[item.ID] ? unfollow(e, item.ID) : follow(e, item.ID)}>{followStatus[item.ID] ? "Unfollow" : "Follow"}</button>


                              </div> */}

                              {/* end row */}

                            </div>

                            {/* end .padding */}

                          </div>

                        </div>

                        {/* end card */}

                      </div> // end col

                    ))}

                  </div>

                )}

              </div>

              <div className="col-md-3 mobile-w3">

                <div className="card mobile-5" style={{ borderRadius: "1rem" }}>

                  <div className="card-body pb-3 gheight">



                    <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }} >

                      <span onClick={toggleMenu}> Trending Discussion</span>

                      <a

                        style={{ float: "right", lineHeight: "21px", right: '10px' }}

                        className="font-11 btn btn-primary  waves-effect waves-light view-all"

                        href={`${siteUrl}/SitePages/DiscussionForum.aspx`}

                      >
                        View All
                      </a>
                      {/* <div className="menu-toggle" onClick={toggleMenu}>
                        <MoreVertical size={20} />
                      </div> */}


                    </h4>

                    {

                      DiscussionData.length > 0 ? DiscussionData.map(x => {

                        return (

                          <div style={{ margin: '15px 0px 10px 0px', padding: '0px 0px 10px 0px' }} className="d-flex align-items-start border-bottom ng-scope">



                            <TrendingUp size={18} style={{ marginTop: '5px' }} color='#1faee3' /> &nbsp;

                            <div className="w-100" style={{ fontWeight: '100' }}>

                              <a className="font-14" style={{ fontSize: '14px' }}>

                                <strong className="text-dark" style={{ fontWeight: '700', cursor: 'pointer' }} onClick={() => navigatetoDiscussionForum(x.ID)}>{truncateText(x?.Topic, 10)}:</strong> &nbsp;

                                <span className="text-muted" style={{ color: '#6b6b6b' }} >
                                  {truncateText(x.Overview, 15)}


                                </span>

                              </a>



                            </div>

                          </div>

                        )

                      }

                      ) : null

                    }

                  </div>

                </div>


                {/* {console.log("currentDatacurrentData", currentData)} */}
                <div className="card mobile-6" style={{ borderRadius: "1rem", position: 'sticky', top: '90px' }}>

                  <div className="card-body pb-3 gheight">

                    <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }}>

                      <span className='padd30px'>People you may Follow</span>

                      <a

                        style={{ float: "right", lineHeight: "21px", right: '10px' }}

                        className="font-11 view-all  btn btn-primary  waves-effect waves-light"

                        onClick={(e) => GotoNextPageone(e, 'CorporateDirectory')}

                      >

                        View All

                      </a>

                    </h4>

                    <div className="inbox-widget mt-4">

                      {CurrentData.length > 0 && CurrentData.map((user: any, index: 0) => (

                        <div

                          key={index}

                          className="d-flex border-bottom heit8 align-items-start w-100 justify-content-between mb-3"

                        >

                          <div className="col-sm-2 ">

                            <a>

                              <img

                                src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${user.EMail}`}

                                className="rounded-circle"

                                width="50"

                                alt={user.Title}

                              />

                            </a>

                          </div>

                          <div className="col-sm-8">

                            <a>

                              <p className="fw-bold font-14 cursor-none mb-0 text-dark namcss" style={{ fontSize: '14px' }}>

                                {user.Title}

                              </p>

                            </a>

                            <p

                              style={{

                                color: "#6b6b6b",

                                fontWeight: "500", fontSize: '14px'

                              }}

                              className="font-12 namcss"

                            >
                              {user.jobTitle != null ? user.jobTitle : 'NA'}

                              {/* Mob: {user.mobile} */}

                            </p>

                          </div>

                          <div className="col-sm-2 txtr">

                            <PlusCircle className='hovertext' size={20} color='#008751' onClick={(e) => follow(e, user.ID)} />

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

      </div >

    </div >



  )

}




const SocialFeed: React.FC<ISocialFeedProps> = (props) => {

  return (

    <Provider>

      <SocialFeedContext props={props} />

    </Provider>

  );

};

export default SocialFeed;