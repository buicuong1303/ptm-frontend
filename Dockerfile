FROM node:12 As development

# becuase ENV cant set directly from commandline so use ARG set default ENV because ARG can set in build time
WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# fix conflict node 12 and node 14 version error node-sass
RUN npm rebuild node-sass
RUN yarn run build

FROM node:12 as production

COPY --from=development /usr/src/app/build ./build
COPY ./deployment ./
RUN yarn install
