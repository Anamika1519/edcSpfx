import { faEllipsisV, faHeart, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { SPFI } from "@pnp/sp/presets/all";
import { getSP } from "../../webparts/blogDetails/loc/pnpjsConfig";
import { Heart, MessageSquare, ThumbsUp, User } from "react-feather";
import "../CustomCommentCard/Commentscard.scss";
import "../../CustomCss/mainCustom.scss"
import moment from "moment";
import Swal from "sweetalert2";
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
// export const CommentCard: React.FC<{
//   commentId: number;
//   username: string;
//   Commenttext: string;
//   Comments: any;
//   Created: string;
//   likes: Like[];
//   replies: Reply[];
//   userHasLiked: boolean;
//   CurrentUserProfile: string;
//   loadingLike:boolean;
//   Action: string;
//   onAddReply: (text: string) => void;
//   loadingReply:boolean;
//   onLike: () => void;
// }> = ({ commentId, username, Commenttext, Comments, Created, likes, replies, userHasLiked, CurrentUserProfile,loadingLike, Action, onAddReply, onLike ,loadingReply}) => {
//   const [newReply, setNewReply] = useState('');
//   const [loading, setLoading] = useState(false); // Loading state for replies
//   console.log(Comments, 'Comments');

//   const handleAddReply = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     e.preventDefault()
//     if (newReply.trim() === '') return;

//     // setLoading(true); // Set loading to true
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate an async operation
//     onAddReply(newReply);
//     setNewReply('');
//     setLoading(false); // Reset loading state
//   };
//   // const handleKeyDown = (e: any) => {
//   //   if (e.key === "Enter") {
//   //     e.prevent.default();
//   //     console.log("Enter key pressed");
//   //     handleAddReply();
//   //   }
//   // }
//   // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//   //   if (e.key === "Enter") {
//   //     e.preventDefault(); // Prevent the default form submission
//   //     handleAddReply(e);
//   //   }
//   // };

//   return (
//     <div className="card team-fedd" style={{ border: '1px solid #54ade0', borderRadius: '20px', boxShadow: '0 3px 20px #1d26260d' }}>
//       <div className="card-body" style={{ padding: '15px' }}>
//         <div className="row">
//           <div className="d-flex align-items-start">
//             <img
//               className="me-2 mt-0 avatar-sm rounded-circle"
//               src={Comments[0].UserProfile}
//               alt="User"
//             />

//             {/* <User /> */}
//             <div className="w-100 mt-0">
//               <h5 className="mt-0 font-16 fw600 mb-0 text-dark fw-bold">
//                 {/* <a href="#" className="text-dark fw-bold font-14"> */}
//                 {username}
//                 {/* </a> */}
//               </h5>
//               <p className="text-muted font-12 mt-0">
//                 <small>{Created}</small>
//               </p>
//             </div>
//           </div>

//           <p className="mt-2" >{Commenttext}</p>

//           <div className="mt-0 mb-2 d-flex" style={{ gap: '2rem' }}>
//             <div  onClick={!loadingLike ? onLike : undefined}  className="btn btn-sm btn-link text-muted ps-0" style={{
//               fontSize: '0.765625rem',display: 'flex', gap:'5px', alignItems:'center',  pointerEvents: loadingLike ? 'none' : 'auto',  opacity: loadingLike ? 0.5 : 1,
//               textDecoration: 'unset' 
//             }} >
//               {
//                 likes.length > 0 ? <FontAwesomeIcon icon={faThumbsUp} className="text-primary" size='xl' /> : <ThumbsUp size={15} />
//               }
//               {/* Add heart icon here */}
//               {/* <FontAwesomeIcon icon={faHeart} className="text-primary" />  */}
//               {` ${likes.length} Likes`}
//             </div>
//             <div style={{ display: 'flex', fontSize: '0.765625rem',gap:'5px', alignItems:'center'}}>
//               <MessageSquare size={15} />  {replies.length} Replies
//             </div>
//             {/* <button onClick={onLike} className="btn btn-sm btn-link text-muted ps-0">
//               <i className="mdi mdi-heart text-primary"></i> {likes.length} Likes
//             </button> */}
//           </div>
//         </div>
//         {/* Render replies */}
//         <div style={{ display: 'block' }} >
//           <div className="row commentheight">
//             <div className=" ">
//               {replies.map((reply, index) => (
//                 <div key={index} className="UserReplycss p-2 d-flex " style={{ width: '100%', display: 'flex' }}>
//                   <div>
//                     <img
//                       className="me-2 mt-0 avatar-sm rounded-circle"
//                       src={reply.UserProfile}
//                       alt="User"
//                     />
//                   </div>
//                   <div className="w-100 mt-0">
//                     <h6 className="font-14 fw600">{reply.UserName}</h6>
//                     <p className="mb-0 para-width  text-muted ng-binding" style={{ wordBreak: 'break-all' }}>{reply.Comments}</p>
//                     <p className="text-muted font-12 mt-3">
//                       <small> {moment(reply.Created).format("DD-MMM-YYYY HH:mm")}</small>
//                     </p>

//                   </div>
//                 </div>

//               ))}
//             </div>
//           </div>
//           <div className="row mt-4" style={{ display: 'block' }}>
//             <div className=" align-items-start mt-1">
//               <div className="w-100">
//                 <div className="d-flex align-items-start">
//                   <div className="al nice me-2">

//                     <img src={CurrentUserProfile} className="w30 avatar-sm rounded-circle" alt="user" />
//                   </div>
//                   <textarea
//                     className="form-control ht form-control-sm"
//                     placeholder="Reply to Post..."
//                     value={newReply}
//                     onChange={(e) => setNewReply(e.target.value)}
//                     disabled={loadingReply}
//                     rows={3}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' && !e.shiftKey) {
//                         e.preventDefault(); // Prevents a new line
//                         handleAddReply(e); // Calls the function to add a reply
//                       }
//                     }}
//                   />
//                   {/* <textarea
//                     className="form-control ht form-control-sm"
//                     placeholder="Reply to comment..."
//                     value={newReply}
//                     onChange={(e) => setNewReply(e.target.value)}
//                     disabled={loading}
//                   /> */}
//                 </div>

//                 {/* <button
//               className="btn btn-primary mt-2"
//               onClick={handleAddReply}
//               disabled={loading}
//             >
//               {loading ? 'Submitting...' : 'Reply'}
//             </button> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// normal update but create
export const CommentCard: React.FC<{
  commentId: number;
  AuthorID: number;
  currentuserid: number;
  username: string;
  Commenttext: string;
  Comments: any;
  Created: string;
  likes: Like[];
  replies: Reply[];
  userHasLiked: boolean;
  CurrentUserProfile: string;
  loadingLike: boolean;
  Action: string;
  onAddReply: (text: string) => void;
  loadingReply: boolean;
  onLike: () => void;
  onSaveComment: (id: number, newText: string) => Promise<void>; // Function to save edited comment
  ondeleteComment: () => void;
}> = ({
  commentId,
  AuthorID,
  currentuserid,
  username,
  Commenttext,
  Comments,
  Created,
  likes,
  replies,
  userHasLiked,
  CurrentUserProfile,
  loadingLike,
  Action,
  onAddReply,
  onLike,
  loadingReply,
  onSaveComment,
  ondeleteComment
}) => {
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [editedText, setEditedText] = useState(Commenttext); // Editable text state
  const sp: SPFI = getSP();
  // const [editedReply, setEditedReply] = useState(reply.Comments);
  const currentUserEmailRef = useRef('');
  const getCurrrentuser=async()=>{
    const userdata = await sp.web.currentUser();
    // alert(userdata)
    currentUserEmailRef.current = userdata.Email;
    alert(`ID in card: ${userdata}`)
    // alert(currentUserEmailRef.current)
 
  }
  useEffect(() => {
    getCurrrentuser()

  }, []);
  const handleAddReply = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (newReply.trim() === '') return;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    onAddReply(newReply);
    setNewReply('');
    setLoading(false);
  };

  const handleSaveComment = async (commentId:any, editedText:any) => {
    setLoading(true);
    alert(`CurrentUserProfile ${CurrentUserProfile}`)
    alert(commentId = editedText)
    await onSaveComment(commentId, editedText); // Call the save function passed as a prop
    setIsEditing(false);
    setLoading(false);
  };
  const Handledeletecomment = async ()=>{
    await ondeleteComment();
  }
 
const CheckCurrentuser = (Author:any)=>{
  alert(Author)
  alert(CurrentUserProfile)
  if(Author == CurrentUserProfile){
    
  }
  setIsEditing(true)
}
  return (
    <div className="card team-fedd" style={{ border: '1px solid #54ade0', borderRadius: '20px', boxShadow: '0 3px 20px #1d26260d' }}>
      <div className="card-body" style={{ padding: '15px' }}>
        <div className="row">
          <div className="d-flex align-items-start">
            <img
              className="me-2 mt-1 avatar-sm rounded-circle"
              src={Comments[0].UserProfile}
              alt="User"
            />
            <div className="w-100 mt-0">
              <h5 className="mt-0 font-16 fw600 mb-0 text-dark fw-bold">
                {username}
              </h5>
              <p className="text-muted font-12 mt-0">
                {/* <small>{Created}</small> */}
                <small> {moment(Created).format("DD-MMM-YYYY")}</small>
              </p>
            </div>
            {/* {currentuserid === AuthorID && (
                <div className="dropdown mt-2 me-2 font-18">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="text-muted cursor-pointer"
                  style={{ cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                       onClick={() => Handledeletecomment()}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )} */}
          </div>
       {console.log(Comments, 'Comments')} {console.log("Comments [0]" , Comments[0])}
          {/* Editable CommentText */}
          {currentuserid === AuthorID}
          
          {isEditing ? (
            <div>

              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="form-control"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveComment(Comments, editedText);
                  }
                }}
              />
              <button
                className="btn btn-primary mb-3 btn-sm mt-2"
                onClick={()=>handleSaveComment(Comments, editedText )}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            </div>
          ) : (
            // <p className="mt-2 d-flex justify-content-between">
            //   {editedText}
            //   <FontAwesomeIcon
            //     icon={faEdit}
            //     className="text-muted cursor-pointer"
            //     onClick={() => CheckCurrentuser(AuthorID)}
            //     style={{ cursor: 'pointer' }}
            //   />
            // </p>
            <p className="mt-2 d-flex justify-content-between" style={{ whiteSpace: "pre-wrap" }}>
            {editedText}
            {currentuserid === AuthorID && (
                <div className="dropdown newdrop">
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  className="text-muted cursor-pointer"
                  style={{ cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                       onClick={() => Handledeletecomment()}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          
          </p>
          )}

          <div className="mt-0 mb-2 d-flex" style={{ gap: '2rem' }}>
            <div onClick={!loadingLike ? onLike : undefined} className="btn btn-sm btn-link text-muted ps-0" style={{
              fontSize: '0.765625rem', display: 'flex', gap: '5px', alignItems: 'center', pointerEvents: loadingLike ? 'none' : 'auto', opacity: loadingLike ? 0.5 : 1,
              textDecoration: 'unset'
            }}>
              {likes.length > 0 ? <FontAwesomeIcon icon={faThumbsUp} className="text-primary" size='xl' /> : <ThumbsUp size={15} />}
              {` ${likes.length} Likes`}
            </div>
            <div style={{ display: 'flex', fontSize: '0.765625rem', gap: '5px', alignItems: 'center' }}>
              <MessageSquare size={15} /> {replies.length} Replies
            </div>
          </div>
        </div>

        {/* Render replies */}
        <div style={{ display: 'block' }}>
          <div className="row commentheight">
            <div className="">
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
                    <p className="mb-2 para-width  text-muted ng-binding" style={{ wordBreak: 'break-all', fontSize:'15px', paddingRight:'22px' }}>{reply.Comments}</p>
                    {/* <p className="mb-0 para-width text-muted ng-binding" style={{ wordBreak: 'break-all' }}>{reply.Comments}</p> */}
                    {/* {isEditing ? (
        <div>
          <input
            type="text"
            value={editedReply}
            onChange={handleChange}
            className="form-control"
          />
          <button onClick={handleSaveClick} className="btn btn-success btn-sm">Save</button>
          <button onClick={handleCancelClick} className="btn btn-secondary btn-sm">Cancel</button>
        </div>
      ) : (
        <p
          className="mb-0 para-width text-muted ng-binding"
          style={{ wordBreak: 'break-all' }}
          onClick={handleEditClick} // Click to enable edit mode
        >
          {reply.Comments}
        </p>
      )} */}
                    <p className="text-muted font-12 mt-3">
                      <small> {moment(reply.Created).format("DD-MMM-YYYY")}</small>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="row mt-4" style={{ display: 'block' }}>
            <div className="align-items-start mt-1">
              <div className="w-100">
                <div className="d-flex align-items-start">
                  <div className="al nice me-2">
                    <img src={CurrentUserProfile} className="w30 avatar-sm rounded-circle" alt="user" />
                  </div>
                  <textarea
                    className="form-control ht form-control-sm"
                    placeholder="Reply to Post..."
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};








// update with lookup
interface CommentCardProps {
  commentId: number;
  username: string;
  Commenttext: string;
  Created: string;
  ARGProjectId: number; // Current ARGProjectId value
  lookupItemId: number; // ID of the lookup item
  CurrentUserProfile: string;
}



