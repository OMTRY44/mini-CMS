rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Tout le monde peut lire le contenu du portfolio
    match /{document=**} {
      allow read: if true;
    }
    
    // Seul l'utilisateur connecté avec l'adresse mail d'administration stricte peut écrire
    match /portfolio/{document} {
      allow write: if request.auth != null && request.auth.token.email == "votre.email@gmail.com";
    }
    
    match /projects/{document} {
      allow write: if request.auth != null && request.auth.token.email == "votre.email@gmail.com";
    }
    
    match /skills/{document} {
      allow write: if request.auth != null && request.auth.token.email == "votre.email@gmail.com";
    }
    
    match /writeups/{document} {
      allow write: if request.auth != null && request.auth.token.email == "votre.email@gmail.com";
    }
  }
}