import firebase from 'firebase/compat/app';

export interface Photo {
  id?: string; // Document ID from Firestore
  name: string;
  url: string; // URL to the image in Firebase Storage
  uploadedAt: firebase.firestore.Timestamp; // Timestamp of when the photo was uploaded
  albumId?: string; // Optional: to group photos into albums
} 