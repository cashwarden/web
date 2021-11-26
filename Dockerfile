FROM nginx:stable-alpine AS production-stage

WORKDIR /srv

COPY image-files/ /

COPY dist /srv

EXPOSE 80

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
