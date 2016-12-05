FROM node:5.10.1

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000
CMD ["npm", "run", "start"]
