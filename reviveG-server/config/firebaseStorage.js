import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";
import serviceAccount from "./netflixo-9e172-firebase-adminsdk-sy1bk-b60fcd24d1.json" assert { type: "json" };

dotenv.config();


// const serviceAccount = {
//    type: process.env.FIREBASE_TYPE,
//    project_id: process.env.PROJECT_ID,
//    private_key_id: process.env.PRIVATE_KEY_ID,
//    private_key: process.env.PRIVATE_KEY,
//    client_email: process.env.CLIENT_EMAIL,
//    client_id: process.env.CLIENT_ID,
//    auth_uri: "https://accounts.google.com/o/oauth2/auth",
//    token_uri: "https://oauth2.googleapis.com/token",
//    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//    universe_domain: "googleapis.com",
// };

initializeApp({
   credential: cert(serviceAccount),
   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = getStorage().bucket();

export default storage;
