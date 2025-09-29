import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import { UserProfile, Post } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { DEFAULT_AVATAR } from '../constants';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!userId) {
        navigate('/');
        return;
    };
    
    setLoading(true);

    const fetchProfileData = async () => {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as UserProfile;
            setProfile(userData);
            setDisplayName(userData.displayName);
            setBio(userData.bio);
        } else {
            console.log("No such user!");
        }
    };
    
    const fetchUserPosts = async () => {
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId));
        const postsSnapshot = await getDocs(postsQuery);
        const userPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(userPosts);
    };

    Promise.all([fetchProfileData(), fetchUserPosts()]).then(() => setLoading(false));

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
        if(doc.exists()) {
            setProfile(doc.data() as UserProfile);
        }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, navigate]);

  const handleEditSave = async () => {
      if (!currentUser || !profile || currentUser.uid !== profile.uid) return;

      setIsUpdating(true);
      let newPhotoURL = profile.photoURL;

      if (newProfilePic) {
          const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
          await uploadBytes(storageRef, newProfilePic);
          newPhotoURL = await getDownloadURL(storageRef);
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
          displayName,
          bio,
          photoURL: newPhotoURL
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
            displayName,
            photoURL: newPhotoURL
        });
      }
      
      setNewProfilePic(null);
      setIsUpdating(false);
      setIsEditing(false);
  };
  
  if (loading) {
    return <div className="flex justify-center mt-12"><LoadingSpinner /></div>;
  }

  if (!profile) {
    return <p className="text-center text-gray-500 mt-12">User not found.</p>;
  }

  const isCurrentUserProfile = currentUser?.uid === profile.uid;

  return (
    <div>
        <div className="flex items-center p-4 md:p-8 border-b mb-8">
            <img 
                src={profile.photoURL || DEFAULT_AVATAR}
                alt={profile.displayName}
                className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover mr-6 md:mr-12"
            />
            <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl font-light">{profile.displayName}</h1>
                    {isCurrentUserProfile && !isEditing && (
                        <button onClick={() => setIsEditing(true)} className="px-3 py-1 text-sm font-semibold border rounded">Edit Profile</button>
                    )}
                </div>
                <p className="text-gray-600">{profile.bio || "No bio yet."}</p>
                 <div className="flex space-x-6 mt-3 text-sm text-gray-800">
                    <span><span className="font-semibold">{posts.length}</span> posts</span>
                </div>
            </div>
        </div>

        {isEditing && (
             <div className="p-4 md:p-8 mb-8 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Display Name</label>
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewProfilePic(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleEditSave} disabled={isUpdating} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300">
                            {isUpdating ? <LoadingSpinner /> : 'Save Changes'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-md">Cancel</button>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map(post => (
                <div key={post.id} className="aspect-square bg-gray-200">
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    </div>
  );
};

export default ProfilePage;
