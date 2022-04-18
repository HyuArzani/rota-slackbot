# Copyright (c) 2018-2019 AccelByte Inc. All Rights Reserved.
# This is licensed software from AccelByte Inc, for limitations
# and restrictions contact your company contract manager.

FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["yarn", "start"]
