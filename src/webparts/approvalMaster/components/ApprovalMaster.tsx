import { DefaultButton, IconButton, initializeIcons, Pivot, PivotItem, TextField } from '@fluentui/react';
import { Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react'
import "../components/post.scss"

// Initialize Fluent UI icons
initializeIcons();

interface Post {
  id: number;
  userName: string;
  userImage: string;
  content: string;
  images: string[];
  likes: number;
  comments: string[];
}

const sampleUserImage = "https://randomuser.me/api/portraits/men/32.jpg"; // Replace with actual user image URL

const ApprovalMaster = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  // Load saved posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const samplePost: Post = {
        id: 1,
        userName: 'Jeremy Tomlinson',
        userImage: sampleUserImage,
        content: 'Story based around the idea of time lapse, animation to post soon!',
        images: [
          'https://source.unsplash.com/random/800x600?portrait', 
          'https://source.unsplash.com/random/400x400?watch',
          'https://source.unsplash.com/random/400x400?beach'
        ],
        likes: 2000,
        comments: [],
      };
      setPosts([samplePost]);
      localStorage.setItem('posts', JSON.stringify([samplePost]));
    }
  }, []);

  // Handle like functionality
  const handleLike = (postId: number) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: liked[postId] ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    });
    setLiked({ ...liked, [postId]: !liked[postId] });
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  // Handle comment submission
  const handleCommentSubmit = (postId: number) => {
    if (newComment.trim() === '') return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    setNewComment('');
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  // Handle image preview for post creation
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imagesArray = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreview(imagesArray);
    }
  };

  // Handle post submission
  const handlePostSubmit = () => {
    const newPost: Post = {
      id: posts.length + 1,
      userName: 'Jeremy Tomlinson',
      userImage: sampleUserImage,
      content,
      images: imagePreview,
      likes: 0,
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    setContent('');
    setImagePreview([]);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} indicatorColor="primary" textColor="primary">
        <Tab label="Create Post" />
        <Tab label="My Post" />
      </Tabs>

      {tabIndex === 0 && (
        <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginTop: '20px' }}>
          <TextField
            placeholder="Write something...."
            value={content}
            onChange={(e, newValue) => setContent(newValue || '')}
            multiline
            rows={4}
            styles={{ root: { marginBottom: '10px' } }}
          />
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          <div style={{ display: 'flex', marginTop: '10px' }}>
            {imagePreview.map((image, index) => (
              <img key={index} src={image} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px', borderRadius: '5px' }} />
            ))}
          </div>
          <DefaultButton text="Post" onClick={handlePostSubmit} disabled={!content} style={{ marginTop: '10px', backgroundColor: '#28a745', color: '#fff' }} />
        </div>
      )}

      {tabIndex === 1 && posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={post.userImage} alt="User" style={{ borderRadius: '50%', width: '50px', marginRight: '10px' }} />
            <div>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{post.userName}</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#888' }}>about 2 minutes ago</p>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <p>{post.content}</p>
            <div style={{ display: 'grid', gridTemplateColumns: post.images.length > 1 ? '1fr 1fr' : '1fr', gap: '10px' }}>
              {post.images.map((image, index) => (
                <img key={index} src={image} alt={`Post ${index}`} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <div>
              <IconButton
                iconProps={{ iconName: liked[post.id] ? 'HeartFill' : 'Heart' }}
                title="Like"
                ariaLabel="Like"
                onClick={() => handleLike(post.id)}
              />
              <span>{post.likes} Likes</span>
              <IconButton
                iconProps={{ iconName: 'Comment' }}
                title="Comment"
                ariaLabel="Comment"
                disabled
              />
              <span>{post.comments.length} Comments</span>
            </div>
            <IconButton iconProps={{ iconName: 'Share' }} title="Share" ariaLabel="Share" disabled />
          </div>
          <div style={{ marginTop: '10px' }}>
            {post.comments.map((comment, index) => (
              <p key={index} style={{ fontSize: '14px', margin: '5px 0', paddingLeft: '10px', borderLeft: '2px solid #ccc' }}>
                {comment}
              </p>
            ))}
            <TextField
              placeholder="Write a comment"
              value={newComment}
              onChange={(e, newValue) => setNewComment(newValue || '')}
              styles={{ root: { marginTop: '10px' } }}
              underlined
            />
            <DefaultButton text="Post Comment" onClick={() => handleCommentSubmit(post.id)} disabled={!newComment} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovalMaster