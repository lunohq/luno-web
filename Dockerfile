FROM node:5.10.1

WORKDIR /app
ADD . /app

EXPOSE 3000
CMD ["npm", "run", "start"]
