# Members Only App

### Introduction
Members Only App is an exclusive clubhouse where members can write anonymous posts. Members with "exclusive" access can see who the author of the post is, but "non-exclusive" members can only see the message. The app's main focus is on using authentication skills by providing user with different levels of access.

Members Only App is from the The Odin Project course's NodeJS Module, Project: Members Only. 

### Project Support Features
* Anyone can sign up for user access by clicking the `Sign Up` button
* A password is required for Administrator access at the time of sign up
* Administrators are able to:
  * View details of each user
  * Delete messages
* Exclusive access can be obtained after signing up by clicking the `Join the Club` button

### Installation Guide
[Click here for live demo](https://members-only-production-32d3.up.railway.app/)

#### Local Install
* Clone this repository [here](https://github.com/marefpceo/members-only)
* The main branch will be the most stable branch at any given time, so ensure you are working from it

  > *Deployment branches are specific to a deployment and based on the platform being deployed to (ie. main branch uses node version lts, glitch_deployment_branch uses node v16.14.2)*

* Run `npm install` to install all dependencies
* Create an ***.env*** file in the project's root directory and add project variables

  >`POSTGRESQL_URI`, `ADMIN_ACCESS`, `ACCESS_CODE` and `COOKIE_SECRET` are the variables currently used. Use this file to adjust or add more variables if needed.
  >
  >* `POSTGRESQL_URI` stores database connection.
  >* `ADMIN_ACCESS` stores password for administrator access
  >* `ACCESS_CODE` stores the password for exclusive access
  >* `COOKIE_SECRET` stores the secret for creating cookie sessions

### Usage
* Run `npm run serverstart` to start the application
* Open web browser and navigate to `https://localhost:3000` 

### Technologies Used
* [NodeJS](https://www.nodejs.org/) is a cross-platform, open-source JavaScript runtime environment that runs on the V8 JavaScript engine. Node.js lets developers use JavaScript to write command line tools and for server-side scripting
* [ExpressJS](https://www.expressjs.org/) is a back end web application framework for building web applications and APIs.
* [PostgreSQL](https://www.postgresql.org/) is a free and open-source relational database management system emphasizing extensibility and SQL compliance.
* [Passport](https://www.passportjs.org/) is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and more.
* [Express Validator](https://express-validator.github.io/) middleware used to validate and sanitize form input data.
* [EJS](https://ejs.co/) is a simple templating language that lets you generate HTML markup with plain JavaScript. 
