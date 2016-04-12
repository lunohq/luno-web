FROM node:5.10.1

ADD package.json /app/package.json
WORKDIR /app
ADD . /app

EXPOSE 3000
CMD ["npm", "run", "deploy"]
