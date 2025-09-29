import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post as PostType, Comment as CommentType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Heart, MessageCircle } from 'lucide-react';
import { DEFAULT_AVATAR } from '../constants';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');

  const hasLiked = user ? likes.includes(user.uid) : false;

  useEffect(() => {
    const commentsQuery = query(collection(db, `posts/${post.id}/comments`), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommentType));
      setComments(fetchedComments);
    });
    return () => unsubscribe();
  }, [post.id]);

  const handleLike = async () => {
    if (!user) return;
    const postRef = doc(db, 'posts', post.id);
    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid)
      });
      setLikes(likes.filter(uid => uid !== user.uid));
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid)
      });
      setLikes([...likes, user.uid]);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    await addDoc(collection(db, `posts/${post.id}/comments`), {
      authorId: user.uid,
      authorName: user.displayName,
      authorPhotoURL: user.photoURL,
      text: newComment,
      timestamp: serverTimestamp(),
    });

    setNewComment('');
  };

  const timeAgo = (timestamp: Timestamp): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp.toDate().getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm mb-6">
      <div className="flex items-center p-4">
        <img src={post.authorPhotoURL || DEFAULT_AVATAR} alt={post.authorName} className="w-8 h-8 rounded-full mr-3" />
        <Link to={`/profile/${post.authorId}`} className="font-semibold text-sm">{post.authorName}</Link>
      </div>
      
      <img src={post.imageUrl} alt={post.caption} className="w-full" />
      
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={handleLike} className="flex items-center space-x-1">
            <Heart className={`w-6 h-6 ${hasLiked ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
          </button>
          <MessageCircle className="w-6 h-6 text-gray-700" />
        </div>
        
        <p className="font-semibold text-sm mb-2">{likes.length} likes</p>
        
        <div className="text-sm mb-2">
          <Link to={`/profile/${post.authorId}`} className="font-semibold mr-2">{post.authorName}</Link>
          <span>{post.caption}</span>
        </div>
        
        <div className="text-xs text-gray-500 uppercase">
          {post.timestamp ? timeAgo(post.timestamp) : 'Just now'}
        </div>
      </div>
      
      <div className="border-t px-4 pt-2 pb-4">
        {comments.map(comment => (
          <div key={comment.id} className="text-sm mb-1">
            <Link to={`/profile/${comment.authorId}`} className="font-semibold mr-2">{comment.authorName}</Link>
            <span>{comment.text}</span>
          </div>
        ))}

        <form onSubmit={handleAddComment} className="flex items-center mt-3">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..." 
            className="w-full text-sm border-none focus:ring-0 p-0"
          />
          <button type="submit" className="text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:text-purple-300" disabled={!newComment.trim()}>Post</button>
        </form>
      </div>
    </div>
  );
};

export default Post;
