<!--- mdformat-toc start --slug=github --->

<div align="center">

# Youtube Notification Bot

</div>

> A bot to send your youtube channel notifications to discord

## What this bot does

1. Stores Video links
2. Keeps checking for new video every 20 seconds
3. If a unstored video is found then sends notification in discord and stores it

## Prerequisites

- Node.js v12 or above
- Mongodb

## Installation

### Installing Node.js

- [Node.js](https://nodejs.org/en/download/)

# Running the bot

Clone the repo

```bash
 git clone https://github.com/CRZA5/CRZA5/youtube-notifications-bot-ts.git
 cd CRZA5/youtube-notifications-bot-ts
```

Install dependencies

- Yarn

```bash
  yarn
```

- npm

```bash
 npm install
```

Compile Typescript to JavaScript

- Yarn

```bash
  yarn build
```

- npm

```bash
 npm run build
```

Create .env file

```
MONGO_URL="your mongo uri"
TOKEN="your bot token"
NODE_ENV=development or production
```

Start the bot

```bash
 yarn start
```

## Docker

Create .env file

```
MONGO_URL="your mongo uri"
TOKEN="your bot token"
NODE_ENV=development or production
```

Pull the image

```bash
 docker pull ghcr.io/crza5/youtube-notifications-bot-ts:latest
```

Run the bot

```bash
  docker run --restart=always -d --env-file .env ghcr.io/crza5/youtube-notifications-bot-ts:latest
```

# License

[MIT](/LICENSE)
