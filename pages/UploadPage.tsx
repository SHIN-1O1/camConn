import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { UploadCloud } from 'lucide-react';

const UploadPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !user) return;

    setUploading(true);

    try {
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
        imageUrl: imageUrl,
        caption: caption,
        likes: [],
        timestamp: serverTimestamp(),
      });

      navigate('/');
    } catch (error) {
      console.error("Error uploading post: ", error);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="file-upload" className="cursor-pointer">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-lg border" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100">
                <UploadCloud className="w-12 h-12 mb-2" />
                <span className="font-semibold">Click to upload an image</span>
              </div>
            )}
          </label>
          <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
        
        <div>
          <textarea 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!image || uploading}
          className="w-full flex justify-center items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 disabled:bg-purple-300"
        >
          {uploading ? <LoadingSpinner /> : 'Share Post'}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
