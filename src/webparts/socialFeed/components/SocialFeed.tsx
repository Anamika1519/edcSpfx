import React, { useEffect, useState } from 'react'
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
import { Link, Plus, PlusCircle, Rss, TrendingUp, User, UserPlus, Users } from 'react-feather'
import { getCurrentUserName, getCurrentUserProfileEmail } from '../../../APISearvice/CustomService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import classNames from 'classnames'
import { uploadFileToLibrary } from '../../../APISearvice/AnnouncementsService'
import { PostComponent } from '../../../CustomJSComponents/SocialFeedPost/PostComponent'
import { fetchBlogdatatop } from '../../../APISearvice/BlogService'
import AvtarComponents from '../../../CustomJSComponents/AvtarComponents/AvtarComponents'
import { fetchUserInformationList } from '../../../APISearvice/Dasborddetails'
import { getDiscussion } from '../../../APISearvice/DiscussionForumService'

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
  const [Contentpost, setContent] = useState('');
  const [SocialFeedImagesJson, setImages] = useState<string[]>([]);
  const [hideCreatePost, setHideCreatePost] = useState(true)
  const [HideShowPost, setHideShowPost] = useState(false)
  const [currentEmail, setCurrentEmail] = useState("")
  const [currentUsername, setCurrentUserName] = useState("")
  const [UploadedFile, setUploadFile] = useState([])
  const [ImageIds, setImageIds] = useState([])
  const [blogdata, setblogdata] = useState([])
  const [usersitem, setUsersArr] = useState<any[]>([]);
  const [DiscussionData, setDiscussion] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [activeMainTab, setActiveMainTab] = useState("feed");


  useEffect(() => {
    // Load posts from localStorage when the component mounts
    // const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    // console.log(storedPosts);

    // setPosts(storedPosts);
    getAllAPI()

  }, []);
  const getAllAPI = async () => {
    setCurrentEmail(await getCurrentUserProfileEmail(sp))
    setCurrentUserName(await getCurrentUserName(sp))
    setblogdata(await fetchBlogdatatop(sp))
    setUsersArr(await fetchUserInformationList(sp))
    setDiscussion(await getDiscussion(sp))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };
  //#region flatArray
  const flatArray = (arr: any[]): any[] => {
    return arr.reduce((acc, val) => acc.concat(val), []);
  };
  //#endregion
  console.log(SocialFeedImagesJson, 'SocialFeedImagesJson');

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
    e.preventDefault();
    let ImagesIds: any[] = [];
    setIsSubmitting(true);  // Start submitting
    let newPostss: any
    if (Contentpost.trim() || SocialFeedImagesJson.length) {
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

      ImagesIds = ImagesIds.concat(SocialFeedImagesJson.map((item: any) => item.ID));
      setImageIds(ImagesIds)
      try {
        // Add the new post to SharePoint List
        await sp.web.lists.getByTitle('ARGSocialFeed').items.add({
          Contentpost: Contentpost,  // Use the Contentpost for the title (or a different field if necessary)
          SocialFeedImagesJson: JSON.stringify(SocialFeedImagesJson),  // Store the images as JSON string
          UserName: currentUsername,
          userAvatar: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`,
          likecount: 0,
          commentcount: 0,
          SocialFeedImagesId: ImageIds

          // Shares: 0
        }).then((ele: any) => {
          console.log(ele);

          newPostss = {
            Contentpost,
            SocialFeedImagesJson,
            Created: new Date().toLocaleTimeString(),
            userName: currentUsername,
            userAvatar: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`,
            likecount: 0,
            commentcount: 0,
            shares: 0,
            Id: ele.data.Id
          };
          const updatedPosts = [newPostss, ...posts];
          setPosts(updatedPosts);
          fetchPosts()
          localStorage.setItem('posts', JSON.stringify(updatedPosts));
        }
        );

        // If the SharePoint request is successful, update the state and local storage


        // Clear fields
        setContent('');
        setImages([]);
      } catch (error) {
        console.log("Error adding post to SharePoint: ", error);
        //alert("There was an error submitting your post. Please try again.");
      } finally {
        setIsSubmitting(false);  // End submitting
      }
    } else {
      //alert("Please add some content or upload images before submitting.");
      setIsSubmitting(false);
    }
  };

  const ShowPost = () => {
    debugger
    setHideCreatePost(false)
    setHideShowPost(true)

  }
  const CreatePostTab = () => {
    debugger
    setHideCreatePost(true)
    setHideShowPost(false)
  }
  const [post, setPost] = useState("");
  const [storedPosts, setStoredPosts] = useState([]);

  // Fetch posts from SharePoint when the component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from SharePoint list
  const fetchPosts = async () => {
    try {
      let newPost: any[] = []
      await sp.web.lists
        .getByTitle("ARGSocialFeed") // SharePoint list name
        .items.select("*,SocialFeedComments/Id,SocialFeedComments/Comments,SocialFeedImages/Id,SocialFeedUserLikes/Id,Author/Id,Author/Title")
        .expand("SocialFeedComments,SocialFeedImages,SocialFeedUserLikes,Author").orderBy("Created", false)().then((item: any) => {
          console.log(item, 'ihhh');
          if (item.length > 0) {
            item.map((ele: any) => {
              let newPosts = {
                Contentpost: ele.Contentpost,
                SocialFeedImagesJson: ele.SocialFeedImagesJson,
                Created: ele.Created,
                userName: ele.Author?.Title,
                userAvatar: ele.userAvatar,
                likecount: 0,
                commentcount: 0,
                // comments: ele?.SocialFeedCommentsJson != null ? JSON.parse(ele?.SocialFeedCommentsJson) : [],
                Id: ele.Id,
                SocialFeedUserLikesJson: ele?.SocialFeedUserLikesJson != null ? JSON.parse(ele?.SocialFeedUserLikesJson) : []
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
  };

  // Handle input change
  const handlePostChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setPost(e.target.value);
  };

  // Handle form submission and save to SharePoint list
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
    debugger;
    let url = str1;
 
    // Find the position of the third occurrence of "/"
 
    let thirdSlashIndex = url.indexOf(
      "/",
      url.indexOf("/", url.indexOf("/") + 1) + 1
    );
 
    // Get the substring after the third occurrence of "/"
 
    let updatedUrl = url.substring(thirdSlashIndex);
 
    console.log("check the url--->>",updatedUrl); // Output: /SocialFeedImages/announcement-5.jpg
 
   
    return str + updatedUrl; // Concatenate directly if str1 starts with a slash
    //}
  };
 
 
  const GotoNextPageone = (item: any, pagename: string) => {
    console.log("item-->>>>", item)

    window.location.href = `${siteUrl}/SitePages/${pagename}.aspx`;
  };

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveMainTab(tab);
  };

  const truncateText = (text: string, maxLength: number) => {
    if(text!=null)
    {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

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
        <HorizontalNavbar />
        <div className="content mt-4" style={{ marginLeft: `${!useHide ? '240px' : '80px'}` }}>
          <div className="container-fluid  paddb">
            <div className="row pt-2 " style={{ paddingLeft: '0.5rem' }}>
              <div className="col-lg-3">
                <CustomBreadcrumb Breadcrumb={Breadcrumb} />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3 mobile-w1">
                <div className="row">
                  <div style={{ display: 'flex', gap: '1rem' }}>
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
                        Followers
                      </div>{" "}
                      <div className={`tabcss mb-2 mt-2 me-1 ${activeMainTab === "following" ? "activenew" : ""
                        }`} onClick={() => handleTabClick("following")} style={{ cursor: "pointer" }} > <span><Users /> </span> Following</div>
                    </div>
                  </div>


                  <div className='mt-3'>
                    {
                      blogdata.length > 0 ? blogdata.map((item: any) => {
                        return (
                          <div className="row mt-1" style={{ gap: '0.5rem' }}><div className="col-md-1">
                            <span> <AvtarComponents Name={item.Title} /> </span>
                          </div>
                            <div className="col-md-2">
                              <span className="title-ellipsis">{item.Title}</span>
                            </div></div>
                        )
                      }) : null
                    }
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
                                    placeholder="Write something..."
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
                                      {SocialFeedImagesJson.map((image: any, index) => {
                                        var imageUrl = mergeAndRemoveDuplicates(siteUrl, image.fileUrl)
                                        console.log(imageUrl);

                                        return (
                                          <><img key={index} src={imageUrl} alt={`preview-${index}`} style={{ width: '100px', marginRight: '10px' }} />

                                          </>
                                        )
                                      }

                                      )}
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
                        )) : null}
                      </div>
                    }
                    {/* Post Feed */}
                    {posts.length > 0 && !hideCreatePost && HideShowPost &&
                      <div className="feed">
                        {posts.map((post, index) => (
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
                        ))}
                      </div>
                    }
                  </>
                )}
                {activeMainTab === "followers" && (
                  <div className="row card-view">
                    {usersitem.map((item) => (
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
                                  className="rounded-circlecss img-thumbnail 
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
                              <div
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
                                <button
                                  type="button"
                                  className="btn btn-light btn-sm waves-effect"
                                >
                                  Follow
                                </button>
                              </div>
                              <div className="row mt-2">
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.posts} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Post
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.followers} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followers
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.followings} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followings
                                    </p>
                                  </div>
                                </div>
                              </div>
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
                    {usersitem.map((item) => (
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
                                  className="rounded-circlecss img-thumbnail 
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
                              <div
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
                                <button
                                  type="button"
                                  className="btn btn-light btn-sm waves-effect"
                                >
                                  Follow
                                </button>
                              </div>
                              <div className="row mt-2">
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.posts} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Post
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.followers} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followers
                                    </p>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="mt-3">
                                    <h4
                                      className="fw-bold font-14"
                                      style={{
                                        fontSize: "0.80rem",
                                        color: "#343a40",
                                      }}
                                    >
                                      NA {/* {item.followings} */}
                                    </h4>
                                    <p className="mb-0 text-muted text-truncate">
                                      Followings
                                    </p>
                                  </div>
                                </div>
                              </div>
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

                    <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }}>
                      Trending Discussion
                      <a
                        style={{ float: "right" }}
                        className="font-11 btn btn-primary  waves-effect waves-light view-all"
                        onClick={(e) => GotoNextPageone(e, "DiscussionForum")}
                      >
                        View All
                      </a>
                    </h4>
                    {
                      DiscussionData.length > 0 ? DiscussionData.map(x => {
                        return (
                          <div style={{ margin: '15px 0px 10px 0px', padding: '0px 0px 10px 0px' }} className="d-flex align-items-start border-bottom ng-scope">

                            <TrendingUp size={18} style={{ marginTop: '5px' }} color='#1faee3' /> &nbsp;
                            <div className="w-100" style={{ fontWeight: '100' }}>
                              <a className="font-14" style={{ fontSize: '14px' }}>
                                <strong className="text-dark" style={{ fontWeight: '700' }}>{x?.DiscussionForumCategory?.CategoryName}:</strong> &nbsp;
                                <span className="text-muted" style={{ color: '#6b6b6b' }}>
                                  {x.Topic}
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

                <div className="card mobile-6" style={{ borderRadius: "1rem" }}>
                  <div className="card-body pb-3 gheight">
                    <h4 className="header-title font-16 text-dark fw-bold mb-0" style={{ fontSize: '20px' }}>
                      People you Follow
                      <a
                        style={{ float: "right" }}
                        className="font-11 view-all  btn btn-primary  waves-effect waves-light"
                        onClick={(e) => GotoNextPageone(e, 'CorporateDirectory')}
                      >
                        View All
                      </a>
                    </h4>
                    <div className="inbox-widget mt-4">
                      {usersitem.map((user: any, index: 0) => (
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
                                alt={user.name}
                              />
                            </a>
                          </div>
                          <div className="col-sm-8">
                            <a>
                              <p className="fw-bold font-14 mb-0 text-dark namcss" style={{ fontSize: '14px' }}>
                                {user.Title}| {user.Department != null ? user.Department : 'NA'}
                              </p>
                            </a>
                            <p
                              style={{
                                color: "#6b6b6b",
                                fontWeight: "500", fontSize: '14px'
                              }}
                              className="font-12 namcss"
                            >
                              NA
                              {/* Mob: {user.mobile} */}
                            </p>
                          </div>
                          <div className="col-sm-2 txtr">
                            <PlusCircle size={20} color='#008751' />
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


