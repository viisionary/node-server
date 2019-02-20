FROM node:11.5.0

#ARG NODE_ENV=production
#ENV NODE_ENV=$NODE_ENV

# Set a working directory
#WORKDIR /usr/src/app

#RUN npm i -g npx

COPY package.json yarn.lock .babelrc ./
RUN yarn install --no-cache --frozen-lockfile --production=false

COPY src ./src
#RUN chown -R root:root src tools

#RUN npx babel src --out-dir build --copy-files
#WORKDIR ./build
CMD [ "node", "./src/bin/start.js" ]
