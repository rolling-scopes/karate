FROM node:6.10

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install -g serverless@1.9.0

RUN npm install

CMD ["sls", "deploy"]