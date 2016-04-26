# Serverless Facebook Messenger Bot
Serverless backend for Facebook Messenger Bot

## Install

Init project
```
git clone git@github.com:michalsanger/serverless-facebook-messenger-bot.git
cd serverless-facebook-messenger-bot
sls project init
```

Set variables
```
sls variables set -k PAGE_ACCESS_TOKEN
sls variables set -k VERIFY_TOKEN
```

Deploy
```
sls dash deploy
```
