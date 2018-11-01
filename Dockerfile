FROM sdelrio/docker-minimal-nginx
RUN mkdir /app
RUN mkdir -p /run/nginx
RUN rm -rf /etc/nginx/nginx.conf
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./dist /app
EXPOSE 8080
