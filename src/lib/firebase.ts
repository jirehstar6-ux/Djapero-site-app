import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Using default initializeFirestore
export const db = initializeFirestore(app, {}, (firebaseConfig as any).firestoreDatabaseId);

// Test connectivity on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection')).catch(() => {});
  } catch (error) {
    console.warn("Firestore connection check failed (expected if offline or first boot):", error);
  }
}
testConnection();

export const auth = getAuth(app);
export const storage = getStorage(app);
