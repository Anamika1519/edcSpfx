import React, { useEffect, useRef } from "react";
import { useState } from "react";

import "../../CustomJSComponents/SocialFeedPost/PostComponent.scss"

import { addActivityLeaderboard, addNotification, getCurrentUserNameId } from "../../APISearvice/CustomService";

import { Heart, Menu, MessageSquare, MoreHorizontal, MoreVertical, Share, Share2, ThumbsUp } from "react-feather";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { Carousel, Modal, Spinner } from "react-bootstrap";

import moment from "moment";

import Swal from "sweetalert2";

export const PostComponent = ({ key, sp, siteUrl, currentUsername, CurrentUser, currentEmail, editload, post }: any) => {
    const [loadingReply, setLoadingReply] = useState<boolean>(false);
    const [loadingLike, setLoadingLike] = useState<boolean>(false);

    const [liked, setLiked] = useState(post.userHasLiked);

    const [likesCount, setLikesCount] = useState(post.likecount || 0);

    const [CommentsCount, setCommentsCount] = useState(post.commentcount || 0);
    // const [gcomments, setGComments] = useState(post.gcomments || []);

    const [posts, setPosts] = useState([post]);

    const [comments, setComments] = useState(post.comments || []);

    const [SocialFeedImagesJson, setImages] = useState([]);

    const [authorId, setAuthorId] = useState(0);

    const [editedContent, setEditedContent] = useState(post.Contentpost);

    const [newComment, setNewComment] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    const isPostAuthor = post.userName === currentUsername;

    const [copySuccess, setCopySuccess] = useState('');

    const [IsCall, setIsCall] = useState(true)
    const [showMore, setShowMore] = useState(false);
    const menuRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [loading, setLoading] = useState(false); // To show loading spinner


    const [displayedCount, setDisplayedCount] = useState(3);
    useEffect(() => {
        //initializeData();
        
        GetId()

        if (typeof (post.SocialFeedImagesJson) == 'string') {

            if (post.SocialFeedImagesJson != null && post.SocialFeedImagesJson != undefined && post.SocialFeedImagesJson != "") {

                setImages(JSON.parse(post.SocialFeedImagesJson))

            }
        }
        const initializeData = async () => {
            if (IsCall) {
                // const userId = await getCurrentUserNameId(sp);
                setAuthorId(CurrentUser.Id);
                setIsCall(false)
                fetchInitialLikeData(CurrentUser.Id);
            }
 
 
        };
 
        initializeData(); 
        
        const handleClickOutside = (event: { target: any; }) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpenshare(false);
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

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


    const GetId = async () => {

        setAuthorId(await getCurrentUserNameId(sp))

        // fetchInitialLikeData();

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

            // window.location.reload()
            editload && editload()
            setEditedContent(editedContent);



        } catch (error) {

            console.error('Error updating post:', error);

        }

    };

    const fetchInitialLikeData = async (userId: number) => {

        const postId = post.postId;



        await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author")

            .filter(`ARGSocialFeedPostsId eq ${postId} and AuthorId eq ${userId}`)().then(async (ele: any) => {

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

    const fetchInitialGroupLikeData = async (userId: number) => {

        const postId = post.postId;
        await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author")
            .filter(`ARGSocialFeedPostsId eq ${postId} and AuthorId eq ${userId}`)().then(async (ele: any) => {
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

        // await sp.web.lists.getByTitle('ARGGroupandTeamComments').items.select("*,Author/Id,Author/Title").expand("Author")
        //     .filter(`GroupandTeamId eq ${postId}`)().then(async (ele: any) => {
        //         if (ele.length > 0)
        //             setGComments(ele);
        //     })



    };
    const handleShowMore = () => {
        setDisplayedCount((prevCount) => prevCount + 3); // Show 3 more comments
    };

    // Handle "Show Less" button click
    const handleShowLess = () => {
        setDisplayedCount(3); // Reset to initial 3 comments
    };
    const fetchPosts = async () => {

        try {

            const fetchedPosts = await sp.web.lists.getByTitle('ARGSocialFeed').items.getAll();

            setPosts(fetchedPosts);

        } catch (error) {

            console.error("Error fetching posts:", error);

        }

    };

    const handleLike = async (e: any, liked: boolean) => {
        debugger
        e.preventDefault();
        setLoadingLike(true)
        try {
            const updatedLikeStatus = !liked;
            const updatedLikesCount = updatedLikeStatus ? likesCount + 1 : likesCount - 1;

            // Optimistically update the UI state
            setLiked(updatedLikeStatus);
            setLikesCount(updatedLikesCount);

            // setAuthorId(await getCurrentUserNameId(sp))
            const postId = post.postId;
            debugger
            await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.select("*,Author/Id").expand("Author").filter(`ARGSocialFeedPostsId eq ${postId} and AuthorId eq ${authorId}`).top(1)().then(async (ele: any) => {
                console.log(ele, 'ele');
                debugger
                if (ele.length > 0) {
                    var likePosts = {
                        ARGSocialFeedPostsId: postId,
                        userHasLiked: !ele[0].userHasLiked
                    }
                    await sp.web.lists.getByTitle('ARGSocialFeedPostsUserLikes').items.getById(ele[0].Id).delete().then(async (ele1: any) => {
                        console.log(ele1);

                        await addActivityLeaderboard(sp, "Unlike on Post");

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
                        console.log(ele1);
                        await addActivityLeaderboard(sp, "Likes on Post");
                        let notifiedArr = {

                            ContentId: post.postId,

                            NotifiedUserId: post.postAuthorId,

                            ContentType0: "Likes on Post",

                            ContentName: post.Contentpost,

                            ActionUserId: CurrentUser.Id,

                            DeatilPage: "SocialFeed",

                            ReadStatus: false,

                            ContentCommentId: postId,

                            ContentComment: post.Contentpost

                        }
                        const nofiArr = await addNotification(notifiedArr, sp)
                        console.log(nofiArr, 'nofiArr');
                    })
                }
            })
        }
        catch (error) {
            console.error('Error toggling like:', error);
        }
        finally {
            setLoadingLike(false); // Enable the button after the function completes
        }
    };



    const handleSaveOnEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveEdit(e)
        }
    };


    const handleAddComment = async (e: { preventDefault: () => void; }) => {
        setLoadingReply(true);
        try {
            e.preventDefault();

            if (newComment.trim()) {
                const updatedComments = [...comments, { text: newComment, user: "You" }];
                // Update local state with new comment
                setComments(updatedComments);
                setNewComment('');

                try {
                    const postId = post.postId;// Assuming postId is correctly passed as a prop
                    console.log("Post ID:", postId);

                    const existingPost = await sp.web.lists.getByTitle('ARGSocialFeed').items.getById(postId)();

                    if (!existingPost) {
                        throw new Error("Post not found");
                    }
                    // Parse existing comments (if any)
                    const existingComments = existingPost.SocialFeedCommentsJson ? JSON.parse(existingPost.SocialFeedCommentsJson) : [];

                    // Create a new comment object

                    const newComments = [...existingComments, { text: newComment, user: post.userName }];

                    const commentsBody = {
                        Comments: newComment,  // Assuming Comments is the correct field name
                        ARGSocialFeedId: postId,
                        UserImage: `${siteUrl}/_layouts/15/userphoto.aspx?size=M&accountname=${currentEmail}`
                    };

                    const commentResponse = await sp.web.lists.getByTitle('ARGSocialFeedComments').items.add(commentsBody);
                    console.log('Comment added:', commentResponse);
                    await sp.web.lists.getByTitle('ARGSocialFeedComments').items.select("*,Author/Id,Author/Title").expand("Author")
                        .filter(`ARGSocialFeedId eq ${postId}`)().then(async (ele: any) => {
                            if (ele.length > 0)
                                await addActivityLeaderboard(sp, "Comments on Post");
                            setCommentsCount(ele.length)
                            setComments(ele);
                            if (CurrentUser.Id != existingPost.AuthorId) {

                                let notifiedArr = {

                                    ContentId: postId,

                                    NotifiedUserId: existingPost.AuthorId,

                                    ContentType0: "Comment on post",

                                    ContentName: existingPost.Contentpost,

                                    ActionUserId: CurrentUser.Id,

                                    DeatilPage: "SocialFeed",

                                    ReadStatus: false,

                                    ContentCommentId: commentResponse.data.Id,

                                    ContentComment: newComment,

                                    CommentOnReply: ""

                                }

                                const nofiArr = await addNotification(notifiedArr, sp)

                                console.log(nofiArr, 'nofiArr');

                            }
                        })
                } catch (error) {
                    console.log("Error updating comments in SharePoint: ", error);
                }
            }
        }
        catch (error) {
            console.error('Error toggling Reply:', error);
        }
        finally {
            setLoadingReply(false); // Enable the button after the function completes
        }
    };



    const mergeAndRemoveDuplicates = (str: string, str1: string) => {
        let url = str1;

        let thirdSlashIndex = url.indexOf(
            "/",
            url.indexOf("/", url.indexOf("/") + 1) + 1
        );
        let updatedUrl = url.substring(thirdSlashIndex);

        console.log("check the url--->>", updatedUrl); // Output: /SocialFeedImages/announcement-5.jpg

        return str + updatedUrl; // Concatenate directly if str1 starts with a slash

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
//chhaya
                    editload && editload()
 
                } catch (error) {
 
                }
            }
        }).catch()
        {
        }
    };

    const copyToClipboard = (e?: React.MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();
        const link = `${siteUrl}/SitePages/SocialFeed.aspx`;
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

        // window.open("https://outlook.office365.com/mail/deeplink/compose?subject=Share%20Info&body=");
        const subject = "Post Title -" + item.Contentpost;
        const body = 'Here is the link to the Post:' + `${siteUrl}/SitePages/SocialFeed.aspx`;
        const office365MailLink = `https://outlook.office.com/mail/deeplink/compose?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(office365MailLink, '_blank');
        //const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open the link to launch the default mail client (like Outlook)
        //window.location.href = mailtoLink;
        
    };

    const handleToggleImages = () => {
        // setShowMore((prevShowMore) => !prevShowMore);
        setShowModal(true); // Open the modal
        setCurrentImageIndex(0); // Reset the carousel to the first image
      };
    const sendanEmailStop = () => {
        setIsMenuOpenshare(false);
    }
    const displayedImages = showMore
        ? SocialFeedImagesJson
        : SocialFeedImagesJson.slice(0, 3);

    console.log(post.userHasLiked, '{liked}');

    return (
        <div className="post">
            <div className="post-header">
                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <div className="flex-shrink-0">
                        <img src={post.userAvatar} alt="user avatar" className="avatar" />
                    </div>
                    <div className="flex-grow-1 ">
                        <p className="pt-2 mb-1" style={{ marginBottom: 'unset' }}>
                            <strong>{post.userName}</strong>  </p>
                        <p style={{
                            fontSize: '0.75rem',
                            fontWeight: '400',
                            color: '#6c757d'
                        }}>
                            {moment(post.Created).fromNow()}
                        </p>
                    </div>
                    {/* Post Content */}
                    <div className="post-content">
                        {(
                            <><>
                            </>
                            {CurrentUser.Id === post.AutherId && (
                            <div className="post-actions">
                                    <div className="menu-toggle" onClick={toggleMenu}>
                                        <MoreVertical size={20} />
                                    </div>
                                    {isMenuOpen && (
                                        <div className="dropdown-menucsspost" ref={menuRef}>
                                            <button onClick={(e) => handleEditClick(e)} disabled={post.AutherId != CurrentUser.Id}>Edit</button>
                                            <button onClick={(e) => handleDeletePost(e, post.postId)} disabled={post.AutherId != CurrentUser.Id}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            )}
                                </>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content" onClick={() => sendanEmailStop()}>
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={10}
                        className="edit-post-textarea"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevents the new line in textarea
                                handleSaveOnEnter(e); // Calls the function to add comment
                            }
                        }}
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
                      style={{
                        width: "100%",
                        height: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setShowModal(true); // Open the modal
                        setCurrentImageIndex(index); // Pass the clicked image index
                      }}
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Carousel
              activeIndex={currentImageIndex} // Show the clicked image first
              onSelect={(selectedIndex) => setCurrentImageIndex(selectedIndex)}
            >
              {SocialFeedImagesJson.map((item: any, index: number) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={mergeAndRemoveDuplicates(siteUrl, item.fileUrl)} // Use your image URL merge function
                    alt={`Slide ${index}`}
                    style={{ height: "auto", objectFit: "contain" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Modal.Body>
        </Modal>

            {/* Post Interactions */}

            <div className="post-interactions mt-3 mb-3">
                <div className="likes hovertext" onClick={!loadingLike ? (e) => handleLike(e, liked) : undefined}  >
                    {liked ? <FontAwesomeIcon icon={faThumbsUp} fontSize={25} color="#1fb0e5" /> : <ThumbsUp size={20} color="gray" />}
                    <span>{likesCount} Likes</span>{liked}
                </div>
                <span className="likes"><MessageSquare size={20} /> {CommentsCount} Comments</span>
                <div className="post-actions likes hovertext">
                    <div className="menu-toggle" onClick={toggleMenushare}>
                        <Share2 size={20} /><span className="sahrenew"> Share</span>
                    </div>
                    {isMenuOpenshare && (
                        <div className="dropdown-menucsspost" ref={menuRef}>
                            <button onClick={(e) => sendanEmail(post)}>Share by email</button>
                            <button onClick={(e) => copyToClipboard(e)}>Copy link</button>
                            {copySuccess && <span className="text-success">{copySuccess}</span>}
                        </div>
                    )}
                </div>
            </div>


            {comments.length > 0
                ? comments.slice(0, displayedCount).map((comment: any, index: React.Key) => (
                    <div key={index} className="d-flex align-items-start commentss">
                        <div className="flex-shrink-0">
                            <img
                                src={comment.UserImage}
                                alt="user avatar"
                                className="commentsImg"
                            />
                        </div>
                        <div className="flex-grow-1 ms-2">
                            <p className="mb-1 fw-bold">{comment?.Author?.Title}</p>
                            <p
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: "400",
                                    color: "#6c757d",
                                    marginBottom: "0px",
                                }}
                            >
                                {comment.Comments}
                            </p>
                        </div>
                    </div>
                ))
                : ""}

            <div className="mt-3">
                {/* Show More button */}
                {comments.length > displayedCount && (
                    <div
                        //   type="button"
                        onClick={handleShowMore}
                    // className="btn btn-primary me-2"
                    >
                        Show More
                    </div>
                )}

                {/* Show Less button */}
                {displayedCount > 3 && (
                    <div
                        onClick={handleShowLess}
                    // className="btn btn-secondary"
                    >
                        Show Less
                    </div>
                )}
            </div>
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
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    disabled={loadingReply}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevents the new line in textarea
                            handleAddComment(e); // Calls the function to add comment
                        }
                    }}
                />
                {/* <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                /> */}
            </form>
        </div>

    );

};