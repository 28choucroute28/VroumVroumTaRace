# Étape 1 : Utiliser une image de base légère
FROM nginx:alpine

# Étape 2 : Copier les fichiers de l'application dans le répertoire par défaut d'Nginx
COPY . /usr/share/nginx/html

# Étape 3 : Exposer le port 80
EXPOSE 80

