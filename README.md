# Portfolio CMS Personnel - Spécialisation Cyber & Réseaux

Ce projet est un système de gestion de contenu (CMS) compact et sécurisé, développé sur mesure pour un profil étudiant en informatique.

## 🛠️ Stack Technique
- **Frontend** : HTML5, CSS3 (Custom Variables pour la gestion dynamique des thèmes), JavaScript ES6.
- **Backend / BaaS** : Firebase Firestore (Base de données NoSQL orientée documents) et Firebase Authentication.

## 🔒 Implémentation de la Sécurité
1. **Règles d'Accès Granulaires** : Les règles de sécurité Firebase (`firestore.rules`) empêchent nativement l'écriture, la modification ou la suppression de données si le jeton d'authentification (`request.auth.token.email`) ne correspond pas strictement à l'empreinte de l'administrateur spécifié.
2. **Isolation Clientèle** : L'espace public (`index.html`) est vierge de tout script d'édition ou formulaire d'injection de données, minimisant ainsi la surface d'attaque logique.
