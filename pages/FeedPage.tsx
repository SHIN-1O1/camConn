import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Post as PostType } from '../types';
import Post from '../components/Post';
import LoadingSpinner from '../components/LoadingSpinner';

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as PostType));
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-12"><LoadingSpinner /></div>;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">No posts yet. Be the first to share something!</p>
      ) : (
        posts.map(post => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};

export default FeedPage;
