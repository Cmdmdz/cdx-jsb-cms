# Creating multi-stage build for production
FROM node:18-alpine as builder
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /strapi
COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g && yarn install --production
RUN yarn add --platform=linuxmusl sharp
ENV PATH /strapi/node_modules/.bin:$PATH
WORKDIR /strapi/app
COPY . .
RUN yarn build

# Creating final production image
FROM node:18-alpine
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /strapi
COPY --from=builder /strapi/node_modules ./node_modules

WORKDIR /strapi/app
COPY --from=builder /strapi/app ./

ENV PATH /strapi/node_modules/.bin:$PATH

RUN chown -R node:node /strapi/app
USER node
EXPOSE 1337
EXPOSE 8000
CMD ["yarn", "start"]
