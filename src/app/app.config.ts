import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({ projectId: "loveframe-bbbaf", appId: "1:283730050151:web:77cc92055304b836c928c2", storageBucket: "loveframe-bbbaf.firebasestorage.app", apiKey: "AIzaSyDPqJB3-Kv_0zjUMpq90yTapT0cXHS5Hn0", authDomain: "loveframe-bbbaf.firebaseapp.com", messagingSenderId: "283730050151" })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage())
  ]
};
