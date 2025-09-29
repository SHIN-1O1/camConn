import { Timestamp } from "firebase/firestore";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    bio: string;
    photoURL: string;
}

export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorPhotoURL: string;
    imageUrl: string;
    caption: string;
    likes: string[]; // Array of user UIDs
    timestamp: Timestamp;
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorPhotoURL: string;
    text: string;
    timestamp: Timestamp;
}
