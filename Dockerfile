# Install dependencies only when needed
FROM node:18-alpine3.15 AS deps
# Instalamos las dependencias de libc6-compat
RUN apk add --no-cache libc6-compat
# Vamos al directorio de la aplicación
WORKDIR /app
# Copiamos los archivos package.json y package-lock.json
COPY package.json package-lock.json ./
# Instalamos las dependencias
RUN npm install --frozen-lockfile

# Build the app with cache dependencies
FROM node:18-alpine3.15 AS builder
# Vamos al directorio de la aplicación
WORKDIR /app
# Copiamos los archivos package.json y package-lock.json
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el resto de los archivos
COPY . .
# Construimos la aplicación
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine3.15 AS runner

# Set working directory
WORKDIR /usr/src/app
# Copy all files
COPY package.json package-lock.json ./
# Instalar las dependencias
RUN npm install --production
# Copy the build files from the builder
COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app

# # Copiar el directorio y su contenido
# RUN mkdir -p ./pokedex

# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permiso para ejecutar la applicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# EXPOSE 3000

CMD [ "node","dist/main" ]