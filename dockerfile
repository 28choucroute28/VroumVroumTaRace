# Étape 1 : Utiliser une image de base légère
FROM nginx:alpine

# Étape 2 : Copier les fichiers de l'application dans le répertoire par défaut d'Nginx
COPY index.html /usr/share/nginx/html/index.html
COPY compare.html /usr/share/nginx/html/compare.html
COPY compare.js /usr/share/nginx/html/compare.js

# Étape 3 : Exposer le port 80
EXPOSE 80
