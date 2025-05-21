import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private photosCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private storage: Storage) {
    this.photosCollection = collection(this.firestore, 'photos');
  }

  getPhotos(): Observable<Photo[]> {
    return collectionData(this.photosCollection, { idField: 'id' }) as Observable<Photo[]>;
  }

  uploadPhoto(file: File, photoName: string): Observable<string | number | undefined> {
    const filePath = `photos/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Return an observable of the upload progress or the download URL upon completion
    return new Observable(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          observer.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const photoData: Omit<Photo, 'id'> = {
            name: photoName || file.name,
            url: downloadURL,
            uploadedAt: serverTimestamp() as any // Firestore will set the server timestamp
          };
          try {
            await addDoc(this.photosCollection, photoData);
            observer.next(downloadURL); // Or some success indicator
            observer.complete();
          } catch (error) {
            console.error('Error saving photo metadata:', error);
            observer.error(error);
          }
        }
      );
    });
  }
}
