# Golpo Express

[![DeepScan grade](https://deepscan.io/api/teams/15735/projects/18961/branches/477973/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15735&pid=18961&bid=477973)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Ananto30/golpo-express.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Ananto30/golpo-express/context:javascript)
[![Depfu](https://badges.depfu.com/badges/5db5110e672c2d5c92ef48f20231d819/count.svg)](https://depfu.com/github/Ananto30/golpo-express?project_id=32581)

This is the Express (Node.js) backend of the [golpo.dedsec.life](https://golpo.dedsec.life). It's a rebuild and lots of new features added on top of the old app - [golpo13.herokuapp.com](http://golpo13.herokuapp.com/)

**Golpo is a link sharing platform without ads.**

But we would like to have people's opinion on what Golpo can have in future. Please share your thoughts and feature request **[here](https://github.com/Ananto30/golpo-express/discussions/categories/request-feature).**

This Hacktoberfest Golpo got a bump from the awesome contributors. Shoutout to top 5 (except me 😜) -

[alammoiz](https://github.com/alammoiz), [ayeolakenny](https://github.com/ayeolakenny), [deepanshu2506](https://github.com/deepanshu2506), [sagarchoudhary96](https://github.com/sagarchoudhary96), [Blastoise](https://github.com/Blastoise) 🙌 🚀

## Remaining tasks

*   Do not allow to share the same link in 24 hours.
*   Follow notification.
*   Chat notification.
*   Plan to move to serverless (vercel).

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
