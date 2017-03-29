FROM node:6.10

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN yarn global add serverless@1.10.0

RUN yarn

CMD ["sls", "deploy"]