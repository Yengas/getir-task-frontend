# GetirTaskFrontend
This is the Angular Frontend task for the Semih Öztürk Hackathon 2018, organized by Getir and BiTaksi. This project is deployed at Heroku at this url: [https://getir-frontend-task.herokuapp.com](https://getir-frontend-task.herokuapp.com)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yengas/getir-task-frontend)

## Objective
The objective is to send a post request to `https://getir-bitaksi-hackathon.herokuapp.com/searchRecords` with a date range and number range filter. The returned records should be displayed in a table, 10 records per page.

### Assumptions
- The fields to show in the table are `_id.key`, `_id.createdat` and `totalCount`.
- `minCount` and `maxCount` can't be non-number and `minCount` can't be greater than `maxCount`.
- `startDate` and `endDate` can't be null/non-date and `startDate` can't be greater than `endDate.`

## Stack
- [AngularJS 5](https://angular.io) with [TypeScript](https://www.typescriptlang.org) 
- [RxJS](https://github.com/ReactiveX/rxjs) for post request, input management.
- [mydaterangepicker](https://kekeh.github.io/mydaterangepicker/) for the date input.
- [Express](https://expressjs.com) for serving built production files.

## Building the project
The project can be deployed on Heroku directly by pushing the button at the top of this README.md file. The version of Angular used in this project requires node 6.9.0+. The package.json requests Node 8.9.4 engine on Heroku.

### Local
You can safely use `ng` tool commands. Use `ng serve` to start a webpack-dev-server which has hot reloading and some other cool stuff.

### Prod
Run `ng build --aot -prod` then `npm start` or `node server.js` to start serving the built files. That is all.
