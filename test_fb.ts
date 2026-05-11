import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    console.log("testing connection via Node...");
    await getDocFromServer(doc(db, 'settings', 'main'));
    console.log("Success");
  } catch (err: any) {
    console.error("Failed", err.message);
  }
}
run();
