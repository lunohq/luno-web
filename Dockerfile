FROM node:5.10.1

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --loglevel error
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000
CMD ["npm", "run", "start"]
