// Configuration Firebase (Remplace avec tes propres clés de projet Firebase)
const firebaseConfig = {
    apiKey: " AIzaSyDzi4YFVsVOiCzylmuHwi_kmM0vnlFNMuM ",
    authDomain: " portfolio-cms-2b5ef.firebaseapp.com",
    projectId: " portfolio-cms-2b5ef ",
    storageBucket: "portfolio-cms-2b5ef.firebasestorage.app ",
    messagingSenderId: "618275140022",
    appId: "1:618275140022 :web :976b714748fb412c9d9117"
};

// Initialisation de Firebase via CDN (importé dans les fichiers HTML)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
