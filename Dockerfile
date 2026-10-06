FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* variables at build time. The browser, not this container, calls the API,
# so the default points at the backend port published on the host.
ARG VITE_API_URL=http://localhost:5001
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

EXPOSE 5173

# Port 5173 is the only origin the backend allows through CORS. vite preview serves index.html
# for every route, so deep links survive a refresh.
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
