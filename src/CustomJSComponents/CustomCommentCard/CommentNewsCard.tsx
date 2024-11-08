import { faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { Heart, MessageSquare, ThumbsUp, User } from "react-feather";
import "./Commentscard.scss";
import "../../CustomCss/mainCustom.scss"
import moment from "moment";
// Define types for reply and comment structures
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
// CommentCard component to render individual comments and their replies
export const CommentNewsCard: React.FC<{
  commentId: number;
  username: string;
  Commenttext: string;
  Comments: any;
  Created: string;
  likes: Like[];
  replies: Reply[];
  userHasLiked: boolean;
  CurrentUserProfile: string;
  loadingLike:boolean;
  onAddReply: (text: string) => void;
  onLike: () => void;
  loadingReply:boolean;
}> = ({ commentId, username, Commenttext, Comments, Created, likes, replies, userHasLiked, CurrentUserProfile,loadingLike, onAddReply, onLike,loadingReply }) => {
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for replies
  console.log(Comments, 'Comments');
 
  const handleAddReply = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (newReply.trim() === '') return;
 
    // setLoading(true); // Set loading to true
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate an async operation
    onAddReply(newReply);
    setNewReply('');
    setLoading(false); // Reset loading state
  };
 
 
  return (
    <div className="card team-fedd" style={{ border: '1px solid #54ade0', borderRadius: '20px', boxShadow: '0 3px 20px #1d26260d' }}>
      <div className="card-body nose mx-2 mb-2 mt-2" style={{ padding: '1rem 0.9rem' }}>
        <div className="row">
          <div className="d-flex align-items-start">
            <img
              className="me-2 mt-0 avatar-sm rounded-circle"
              src={Comments[0].UserProfile}
              alt="User"
            />
 
            {/* <User /> */}
            <div className="w-100 mt-0">
              <h5 className="mt-0 font-16 fw600 mb-0 text-dark fw-bold">
                {/* <a href="#" className="text-dark fw-bold font-14"> */}
                {username}
                {/* </a> */}
              </h5>
              <p className="text-muted font-12 mt-3">
                <small>{Created}</small>
              </p>
            </div>
          </div>
 
          <p className="mt-2">{Commenttext}</p>
 
          <div className="mt-0 mb-2 d-flex" style={{gap:'2rem'}}>
          <div  onClick={!loading ? onLike : undefined}  className="btn btn-sm btn-link text-muted ps-0" style={{
              fontSize: '0.765625rem',  pointerEvents: loading ? 'none' : 'auto',  opacity: loading ? 0.5 : 1,
              textDecoration: 'unset' 
            }} >
              {
                likes.length > 0 ? <FontAwesomeIcon icon={faThumbsUp} className="text-primary" size='xl' /> : <ThumbsUp size={15} />
              }
              {/* Add heart icon here */}
              {/* <FontAwesomeIcon icon={faHeart} className="text-primary" />  */}
              {` ${likes.length} Likes`}
            </div>
            <div style={{display:'flex',fontSize:'0.765625rem' ,alignItems:'center',gap:'0.2rem'}}>
            <MessageSquare size={12}/>  {replies.length} Replies
            </div>
            {/* <button onClick={onLike} className="btn btn-sm btn-link text-muted ps-0">
              <i className="mdi mdi-heart text-primary"></i> {likes.length} Likes
            </button> */}
          </div>
        </div>
        {/* Render replies */}
        <div style={{ display: 'block' }}>
          <div className="row">
            <div className=" ">
              {replies.map((reply, index) => (
                <div key={index} className="UserReplycss p-2 d-flex " style={{ width: '100%', display: 'flex' }}>
                  <div>
                    <img
                      className="me-2 mt-0 avatar-sm rounded-circle"
                      src={reply.UserProfile}
                      alt="User"
                    />
                  </div>
                  <div className="w-100 mt-0">
                    <h6 className="font-14 fw600">{reply.UserName}</h6>
                    <p className="mb-0 para-width  text-muted ng-binding"  style={{wordBreak:'break-all'}}>{reply.Comments}</p>
                    <p className="text-muted font-12 mt-3">
                      <small>{moment(reply.Created).format("DD-MMM-YYYY HH:mm")}</small>
                    </p>
 
                  </div>
                </div>
 
              ))}
            </div>
          </div>
          <div className="row mt-4" style={{ display: 'block' }}>
            <div className=" align-items-start mt-1">
              <div className="w-100">
                <div className="d-flex align-items-start">
                  <div className="al nice me-2">
 
                    <img src={CurrentUserProfile} className="w30 avatar-sm rounded-circle" alt="user" />
                  </div>
                  {/* <input
                    type="text"
                    className="form-control ht form-control-sm"
                    placeholder="Reply to comment..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                  /> */}
                    <textarea
                    className="form-control ht form-control-sm"
                    placeholder="Reply to comment..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    disabled={loadingReply}
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); // Prevents a new line
                        handleAddReply(e); // Calls the function to add a reply
                      }
                    }}
                  />
                </div>
 
                {/* <button
              className="btn btn-primary mt-2"
              onClick={handleAddReply}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Reply'}
            </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 