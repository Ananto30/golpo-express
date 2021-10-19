# Golpo Express

[![DeepScan grade](https://deepscan.io/api/teams/15735/projects/18961/branches/477973/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15735&pid=18961&bid=477973)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Ananto30/golpo-express.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Ananto30/golpo-express/context:javascript)

This is the Express (Node.js) backend of the current [golpo project](https://github.com/Ananto30/golpo). Old app - [golpo13.herokuapp.com](http://golpo13.herokuapp.com/) New app - [golpo2.herokuapp.com](https://golpo2.herokuapp.com)

But there are things we are changing from the current Golpo. We will use Golpo as a link sharing platform. And it will be free for eveyone! Future plan involves link management (collection of links and sorting) and sharing collection.

So here is our plan -

## Change plan

### Backend

*   Verify post is only a link.
*   Extract meta data from link and save them in the database.
*   Do not allow to share the same link in 24 hours.
*   Add like count and people who liked the post.
*   Add follow functionality.

### Frontend

*   Convert from React to Svelte.
*   Separate page for chats and user chat. (Chats are list of users who I have chat with in the past and UserChat is a single user chatting interface)
*   Profile edit page or modal.
*   Send message to user button and modal.

## Run the project

Run docker for mongodb -

```
docker-compose up -d
```

Set env variables -

```
set -o allexport; source .env; set +o allexport;
```

(*see config.js for all env variables*)

Run the server -

```
npm install
npm start
```

To get some demo data run this -

```
npm run bootstrap
```

Here is the Postman collection - [Golpo Postman](https://documenter.getpostman.com/view/3713915/UUy4d5aV)

## Express tasks

Here are the tasks - [Hacktoberfest](https://github.com/Ananto30/golpo-express/issues?q=is%3Aissue+is%3Aopen+label%3AHacktoberfest)

(Tasks are being added daily)

**Feel free to enhance code and make express better!** 😃

**Please test before creating PR** 🙏

## Svelte tasks

Visit the Svelte repo - [github.com/ananto30/golpo-svelte](https://github.com/Ananto30/golpo-svelte)
