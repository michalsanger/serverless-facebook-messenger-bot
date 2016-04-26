# Serverless Facebook Messenger Bot
Serverless backend for Facebook Messenger Bot

## Install

You need to have installed the [Serverless Framework](https://github.com/serverless/serverless) (version 0.5.2 or higher) and you're using Node.js v4.0+.


### 1. Init project
```
sls project install serverless-facebook-messenger-bot
```

### 2. Setup FB App
Follow [quickstart](https://developers.facebook.com/docs/messenger-platform/quickstart) but start with [Step 1](https://developers.facebook.com/docs/messenger-platform/quickstart#create_app_page) and [Step 3](https://developers.facebook.com/docs/messenger-platform/quickstart#get_page_access_token) to get Page Access Token before deploying backend.

### 3. Set variables
```
sls variables set -k PAGE_ACCESS_TOKEN
sls variables set -k VERIFY_TOKEN
```
`VERIFY_TOKEN` is used for subsciption verification.

### 4. Deploy backend app
Deploy all functions and endpoints
```
sls function deploy --all
sls endpoint deploy --all
```
Now you have public webhook URL.

### 5. Setup Webhook
Back to the [FB App Quickstart](https://developers.facebook.com/docs/messenger-platform/quickstart#setup_webhook) and verify your webhook.

### 6. Subscribe the App to the Page
```
curl -ik -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<PAGE_ACCESS_TOKEN>"
```

### 7. Send messages
Go to your Facebook Page and send a message to it. The response will come from your brand new servreless backend! See screenshots in the [Quickstart](https://developers.facebook.com/docs/messenger-platform/quickstart#receive_messages)

## Running Tests
```
npm test
```

## Develop
Want to add some logic into bot's responses? Take a look in `functions/webhook/handlers/`
