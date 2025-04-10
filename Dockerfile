FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le projet
COPY . .

# Exposer le bon port (modifie si besoin)
EXPOSE 5173

# Activer le hot-reload
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Lancer l'application
CMD ["npm", "run", "dev"]
