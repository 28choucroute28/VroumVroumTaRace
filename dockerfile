# Étape 1 : Utiliser une image de base légère
FROM nginx:alpine

# Étape 2 : Copier tous les fichiers nécessaires d'un coup
COPY index.html compare.html compare.js /usr/share/nginx/html/

# Étape 3 : Exposer le port 80
EXPOSE 80
