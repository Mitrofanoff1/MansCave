# Amvera Cloud — раздача готовой статики Next.js (output: export) через nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY html /usr/share/nginx/html
EXPOSE 80
