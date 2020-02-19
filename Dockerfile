FROM mhart/alpine-node:7.10.0
MAINTAINER Seah Ying Cong <yingcong@glints.com>

RUN apk add --update python g++ make
RUN npm install -g nodemon
COPY . /app
WORKDIR /app
RUN npm install --production
CMD ["npm", "start"]
