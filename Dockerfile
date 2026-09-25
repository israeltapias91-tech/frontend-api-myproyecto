# Usar una imagen ligera de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero (optimiza la caché de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para iniciar Vite permitiendo conexiones externas
CMD ["npm", "run", "dev", "--", "--host"]