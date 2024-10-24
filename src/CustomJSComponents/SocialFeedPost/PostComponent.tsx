import React, { useEffect } from "react";
import { useState } from "react";
import "../../CustomJSComponents/SocialFeedPost/PostComponent.scss"
import { getCurrentUserNameId } from "../../APISearvice/CustomService";
import { Heart, Menu, MessageSquare, MoreHorizontal, MoreVertical, Share, Share2, ThumbsUp } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import Swal from "sweetalert2";
export const PostComponent = ({ post, sp, siteUrl, currentUsername, currentEmail }: any) => {

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likecount || 0);
    const [CommentsCount, setCommentsCount] = useState(post.commentcount || 0);
    const [posts, setPosts] = useState([post]);
    const [comments, setComments] = useState(post.comments || []);
    const [SocialFeedImagesJson, setImages] = useState([]);
    const [authorId, setAuthorId] = useState(0);
    const [editedContent, setEditedContent] = useState(post.Contentpost);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const isPostAuthor = post.userName === currentUsername;
    const [copySuccess, setCopySuccess] = useState('');
    const [showMore, setShowMore] = useState(false);
    useEffect(() => {
        debugger
        if (typeof (post.SocialFeedImagesJson) == 'string') {
            if (post.SocialFeedImagesJson != null && post.SocialFeedImagesJson != undefined && post.SocialFeedImagesJson != "") {
                setImages(JSON.parse(post.SocialFeedImagesJson))
            }
        }

    }, [post, sp, siteUrl])
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMenuOpenshare, setIsMenuOpenshare] = useState(false);


    const toggleMenu = (e: any) => {
        e.preventDefault()
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleMenushare = (e: any) => {
        e.preventDefault()
        setIsMenuOpenshare(!isMenuOpen);
    };
    useEffect(() => {
        GetId()

    }, [post, sp, siteUrl]);

    const GetId = async () => {
        setAuthorId(await getCurrentUserNameId(sp))
        fetchInitialLikeData();
    }

    const handleEditClick = (e: any) => {

        setIsMenuOpen(!isMenuOpen);
        setIsEditing(true);
    };

    const handleCancelEdit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setIsEditing(false);
        setEditedContent(post.Contentpost);
    };
    const handleSaveEdit = async (e: any) => {
        //  e.preventDefault();
        const postId = post.postId;
        try {
            await sp.web.lists.getByTitle('ARGSocialFeed').items.getById(post.postId).update({
                Contentpost: editedContent
            });
            setIsEditing(false);
            window.location.reload()
            setEditedContent(editedContent);

        } catch (error) {
            console.error('Error updating post:', error);
        }
    };
    const fetchInitialLikeData = async () => {
        const postId = post.postId;

        await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author")
            .filter(`ARGSocialFeedPostsId eq ${postId} and AuthorId eq ${authorId}`)().then(async (ele: any) => {
                if (ele.length > 0)
                    setLiked(ele[0].userHasLiked);
                // setLikesCount(ele.length);
            })

        await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author")
            .filter(`ARGSocialFeedPostsId eq ${postId} and userHasLiked eq 1`)().then(async (ele: any) => {
                if (ele.length > 0)
                    setLikesCount(ele.length);
            })

        await sp.web.lists.getByTitle('ARGSocialFeedComments').items.select("*,Author/Id").expand("Author")
            .filter(`ARGSocialFeedId eq ${postId}`)().then(async (ele: any) => {
                if (ele.length > 0)
                    setCommentsCount(ele.length);
            })
        await sp.web.lists.getByTitle('ARGSocialFeedComments').items.select("*,Author/Id,Author/Title").expand("Author")
            .filter(`ARGSocialFeedId eq ${postId}`)().then(async (ele: any) => {
                if (ele.length > 0)
                    setComments(ele);
            })



    };
    const fetchPosts = async () => {
        try {
            const fetchedPosts = await sp.web.lists.getByTitle('ARGSocialFeed').items.getAll();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    const handleLike = async (e: any) => {
        debugger
        e.preventDefault();
        const updatedLikeStatus = !liked;
        const updatedLikesCount = updatedLikeStatus ? likesCount + 1 : likesCount - 1;

        // Optimistically update the UI state
        setLiked(updatedLikeStatus);
        setLikesCount(updatedLikesCount);

        // setAuthorId(await getCurrentUserNameId(sp))
        const postId = post.postId;
        debugger
        // AuthorId
        await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author").filter(`ARGSocialFeedPostsId eq ${postId} and AuthorId eq ${authorId}`).top(1)().then(async (ele: any) => {
            console.log(ele, 'ele');
            debugger

            if (ele.length > 0) {
                var likePosts = {
                    ARGSocialFeedPostsId: postId,
                    userHasLiked: !ele[0].userHasLiked
                }
                await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.getById(ele[0].Id).update(likePosts).then(async (ele1: any) => {


                })
            }
            else {
                const likePostsJson = {
                    ARGSocialFeedPostsId: postId,
                    userHasLiked: true
                }
                let likePostsJson1 = Array.isArray(likePostsJson) ? likePostsJson : [likePostsJson];
                debugger
                await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.add(likePostsJson).then(async (ele1: any) => {
                    debugger


                })
            }
        })



    };

    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveEdit(e)
        }
    };

    const handleAddComment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (newComment.trim()) {
            const updatedComments = [...comments, { text: newComment, user: "You" }];

            // Update local state with new comment
            setComments(updatedComments);
            setNewComment('');

            try {
                const postId = post.postId;// Assuming postId is correctly passed as a prop
                console.log("Post ID:", postId);

                // Fetch the existing post by ID
                const existingPost = await sp.web.lists.getByTitle('ARGSocialFeed').items.getById(postId)();

                if (!existingPost) {
                    throw new Error("Post not found");
                }

                // Parse existing comments (if any)
                const existingComments = existingPost.SocialFeedCommentsJson ? JSON.parse(existingPost.SocialFeedCommentsJson) : [];

                // Create a new comment object
                const newComments = [...existingComments, { text: newComment, user: post.userName }];

                // Add the new comment to the comments list
                const commentsBody = {
                    Comments: newComment,  // Assuming Comments is the correct field name
                    ARGSocialFeedId: postId,
                    UserImage: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`
                };

                // Save the comment to the comments list
                const commentResponse = await sp.web.lists.getByTitle('ARGSocialFeedComments').items.add(commentsBody);
                console.log('Comment added:', commentResponse);
                await sp.web.lists.getByTitle('ARGSocialFeedComments').items.select("*,Author/Id,Author/Title").expand("Author")
                    .filter(`ARGSocialFeedId eq ${postId}`)().then(async (ele: any) => {
                        if (ele.length > 0)
                            setCommentsCount(ele.length)
                        setComments(ele);
                    })

            } catch (error) {
                console.log("Error updating comments in SharePoint: ", error);
                //alert("There was an error adding your comment. Please try again.");
            }
        }
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
     
     
    const handleDeletePost = async (e: any, postId: number) => {
        e.preventDefault();
        Swal.fire({
            title: 'Do you want to delete?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            cancelButtonText: "Cancel",
            icon: 'warning'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Assuming you are using SharePoint API to delete the post
                    await sp.web.lists.getByTitle('ARGSocialFeed').items.getById(postId).delete();

                    // Remove post from UI
                    setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
                    window.location.reload()
                } catch (error) {

                }
            }
        }).catch()
        {

        }



    };
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
    const sendanEmail = () => {
        window.open("https://outlook.office.com/mail/inbox");
    };
    const handleToggleImages = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };
    const displayedImages = showMore
        ? SocialFeedImagesJson
        : SocialFeedImagesJson.slice(0, 3);
    return (
        <div className="post">
            {/* Header */}
            <div className="post-header">
                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <div className="flex-shrink-0">
                        <img src={post.userAvatar} alt="user avatar" className="avatar" />

                    </div>
                    <div className="flex-grow-1 ">
                        <p className="pt-2" style={{ marginBottom: 'unset' }}>
                            <strong>{post.userName}</strong>  </p>
                        <p style={{
                            fontSize: '0.9rem',
                            fontWeight: '400',
                            color: '#6c757d'
                        }}>
                            {moment(post.Created).format("ddd/MMM/yyyy")}
                        </p>

                    </div>
                    {/* Post Content */}
                    <div className="post-content">


                        {(
                            <><>

                            </><div className="post-actions">
                                    <div className="menu-toggle" onClick={toggleMenu}>
                                        <MoreVertical size={20} />
                                    </div>

                                    {isMenuOpen && (
                                        <div className="dropdown-menucsspost">
                                            {/* <button onClick={(e) => handleEditClick(e)}>Edit</button> */}
                                            <button onClick={(e) => handleDeletePost(e, post.postId)}>Delete</button>
                                        </div>
                                    )}
                                </div></>
                        )}

                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content">

                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={4}
                        className="edit-post-textarea"
                        onKeyDown={handleSaveOnEnter}
                    />
                ) : (
                    <p>{post.Contentpost}   {/* Edit Button */}
                    </p>
                )}
                <div className="image-preview mt-2">
                    <div className="grid-container">
                        {displayedImages.map((image: any, index) => {
                            // Merging and cleaning up the image URL if needed
                            const imageUrl = mergeAndRemoveDuplicates(siteUrl, image.fileUrl);

                            // Assign a class for larger or smaller images based on the index
                            const className = index === 0 ? "large-image" : "small-image";

                            // Check if the current image is the third one and if there are more than 3 images
                            const isThirdImage = index === 2 && SocialFeedImagesJson.length > 3 && !showMore;

                            return (
                                <div
                                    key={index}
                                    className={`grid-item ${className}`}
                                    style={{ position: "relative" }}
                                >
                                    {/* Render the image */}
                                    <img
                                        src={imageUrl}
                                        alt={`Social feed ${index}`}
                                        style={{ width: "100%", height: "auto" }}
                                    />

                                    {/* Show +X overlay if it is the third image and there are more images to show */}
                                    {isThirdImage && (
                                        <div
                                            className="more-images-overlay"
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                color: "white",
                                                fontSize: "24px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                            }}
                                            onClick={handleToggleImages} // Toggle between more or fewer images
                                        >
                                            +{SocialFeedImagesJson.length - 3}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Only display a "Show Less" message if more images are shown */}
                    {showMore && (
                        <div
                            className="show-less"
                            style={{ marginTop: "10px", cursor: "pointer" }}
                            onClick={handleToggleImages}
                        >
                            Show Less
                        </div>
                    )}
                </div>

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

            </div>

            {/* Post Interactions */}
            <div className="post-interactions mt-3 mb-3">
                <div onClick={(e) => handleLike(e)}>
                    {liked ? <FontAwesomeIcon icon={faThumbsUp} fontSize={25} color="#f1556c" /> : <ThumbsUp size={20} color="gray" />}     <span>{likesCount} Likes</span>
                </div>
                <span><MessageSquare size={20} /> {CommentsCount} Comments</span>

                <div className="post-actions">
                    <div className="menu-toggle" onClick={toggleMenushare}>
                        <Share2 size={20} /> Share
                    </div>

                    {isMenuOpenshare && (
                        <div className="dropdown-menucsspost">
                            <button onClick={(e) => sendanEmail()}>Share by email</button>
                            <button onClick={(e) => copyToClipboard(post.postId)}>Copy link</button>
                            {copySuccess && <span className="text-success">{copySuccess}</span>}
                        </div>
                    )}
                </div>

            </div>

            {comments.length > 0 ? comments.map((comment: any, index: React.Key) => (
                <div className="d-flex align-items-center commentss p-3">
                    <div className="flex-shrink-0">
                        <img src={comment.UserImage} alt="user avatar" className="commentsImg" />
                    </div>
                    <div className="flex-grow-1 ms-4">
                        <p>
                            <strong>{comment?.Author?.Title}</strong>  </p>
                        <p style={{
                            fontSize: '0.9rem',
                            fontWeight: '400',
                            color: '#6c757d'
                        }}>
                            {comment.Comments}
                        </p>

                    </div>
                </div>
            )) : ""}

            {/* <div className="post-comments">
                {comments.length > 0 ? comments.map((comment: any, index: React.Key) => (
                    <div className="comment" key={index}>
                        <img src={comment.UserImage} alt="user avatar" />
                        <p>
                            <strong>{comment?.Author?.Title}</strong>  </p>
                        <p>
                            {comment.Comments}
                        </p>

                    </div>
                )) : ""}
            </div> */}

            {/* Add a New Comment */}
            <form onSubmit={(e) => handleAddComment(e)} className="add-comment" style={{ gap: '1rem' }}>
                <img src={`${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`} alt="user avatar" className="commentsImg" />
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
            </form>
        </div>
    );
};
