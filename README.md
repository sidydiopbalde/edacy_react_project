# Mon Projet - Gestion des Produits
# Aperçu
"Mon Projet" est une application web simple et intuitive pour gérer un inventaire de produits. Construite avec React, Vite, et Tailwind CSS, elle permet de se connecter, ajouter, modifier, supprimer, et consulter des produits via une interface moderne. L'application utilise une API pour les opérations CRUD et passe en mode hors ligne si l'API est indisponible.

# Fonctionnalités

Inscription : inscription avec (firstname, lastname, adresse, email, password , confirmPassword)
Connexion : Authentification via email et mot de passe.
Gestion des produits :
Liste des produits avec recherche et tri.
Ajout/Modification de produits via un formulaire modal.
Suppression de produits avec confirmation par modal.


Déconnexion : Bouton avec confirmation par modal.
Mode hors ligne : Données par défaut si l'API est inaccessible.
Design : Interface responsive .


# Prérequis

Node.js : Version 18 ou supérieure (téléchargeable sur nodejs.org).
npm : Inclus avec Node.js.
Git : Pour cloner le projet (téléchargeable sur git-scm.com).


# Installation et démarrage
1. Cloner le projet
git clone <https://github.com/sidydiopbalde/edacy_react_project>
cd mon-projet

2. Installer les dépendances
npm install

3. Configurer l'API (facultatif)
L'application communique avec une API sur http://127.0.0.1:3000 via /proxy. Assurez-vous que le backend est en marche avec ces endpoints :

POST /auth/login : Authentification.
POST /auth/register : Inscription.
GET /product : Liste des produits.
POST /product : Ajouter un produit.
PATCH /product/:id : Modifier un produit.
DELETE /product/:id : Supprimer un produit.

Note : Si l'API n'est pas disponible, l'application utilise des données par défaut.
4. Lancer l'application
npm run dev

Ouvrez http://localhost:5174 dans votre navigateur. Vous serez redirigé vers la page de connexion.
5. (Optionnel) Build pour production
npm run build
npm run preview

Prévisualisez la version production sur http://localhost:4173.

# Utilisation

# Inscriprion
Accédez à http://localhost:5174/register. pour s'inscrire
Entrez un firstname, lastname, adresse, email, password et confirmPassword.
Cliquez sur "S'inscrire" pour accéder à page de connexion.

# Connexion

Accédez à http://localhost:5174/login.
Entrez un email et mot de passe (exemple : test@gmail.com, password si l'API est mockée).
Cliquez sur "Se connecter" pour accéder à la gestion des produits.


# Gestion des produits

Voir la liste : Consultez les produits, recherchez par nom, ou triez par colonnes (code, name, price, quantity).
Ajouter un produit : Cliquez sur "Nouveau Produit", remplissez le formulaire, et validez.
Modifier un produit : Cliquez sur l'icône "Éditer" (crayon), modifiez les champs, et validez.
Supprimer un produit : Cliquez sur l'icône "Supprimer" (poubelle), confirmez via le modal, et le produit sera supprimé.
Déconnexion : Cliquez sur "Déconnexion", confirmez via le modal, et vous serez redirigé vers la page de connexion.


# Structure du projet
mon-projet/
├── src/
│   ├── backend/
│   │   └── Services/
│   │       ├── useFetch.js      # Récupère les données via API
│   │       └── useSave.js       # Gère les opérations CRUD
│   ├── components/
│   │   ├── Auth/
│   │   │   └── LoginForm.jsx    # Page de connexion
|   |   |   |__ RegisterForm.jsx
│   │   └── product/
│   │       └── ProductManager.jsx  # Gestion des produits
│   ├── App.jsx                  # Routes principales
│   ├── main.jsx                 # Point d'entrée React
│   ├── index.css                # Styles globaux (Tailwind)
├── public/                      # Fichiers statiques
├── index.html                   # Template HTML
├── vite.config.js               # Configuration Vite
├── tailwind.config.js           # Configuration Tailwind CSS
├── package.json                 # Dépendances et scripts
└── README.md                    # Documentation


# Dépendances

React & React DOM : Interface utilisateur.
Vite : Outil de build rapide.
React Router : Navigation.
Tailwind CSS : Styles.
Framer Motion : Animations.
Lucide React : Icônes.
Axios : Requêtes API.

Voir package.json pour la liste complète.

# Scripts

npm run dev : Lance le serveur de développement.
npm run build : Construit pour la production.
npm run preview : Prévisualise la build.


Résolution de problèmes
Erreur react-refresh
Si vous voyez Module not found: .../react-refresh/runtime.js :

Ajoutez ceci à vite.config.js :optimizeDeps: {
  include: ['react-refresh'],
},
resolve: {
  alias: {
    'react-refresh': path.resolve(__dirname, 'node_modules/react-refresh'),
  },
}


Supprimez le cache Vite :rm -rf node_modules/.vite
npm run dev



# API indisponible

Vérifiez que le backend tourne sur http://127.0.0.1:3000.
Sinon, mockez les réponses dans useFetch.js et useSave.js pour tester.


# Contribution

Forkez le dépôt.
Créez une branche : git checkout -b ma-fonctionnalité.
Committez : git commit -m "Ajout de ma fonctionnalité".
Poussez : git push origin ma-fonctionnalité.
Créez une Pull Request.


# Contact
Pour des questions, contactez [sididiop53@gmail.com].

