# User-Farm API using NodeJs, ExpressJS, NestJs, TypeOrm, Auth, Migrations and Tests

This application will give you idea, of how to use NodeJs, ExpressJs, Auth and TypeOrm to build code, API and Tests.
This application gives you relation of User and Farms.

Good luck!

## Installation

- Install [NodeJS](https://nodejs.org/en/) lts or latest version
- Install [Docker](https://www.docker.com/get-started/)

- In root dir run `npm install`
- In root dir run `docker compose up -d` to run Postgres and PgAdmin docker images for local development
- Create a .env file with the content from .env.dev

## Database

Postgres database will be available on http://localhost:5440

PgAdmin UI will be available on http://localhost:80

Connect to PgAdmin UI using:

- login in the UI (username: `postgres@gmail.com`, password: `postgres`)
- host: `host.docker.internal`
- port: `5440`
- username/password/maintenance database:`postgres`

## Running the app

Make sure to run the migrations before running the app (see Migrations section below)

### Development:

- To start the project in dev mode, run `npm run start:dev`

### Production:

- To build the project, run `npm run build`
- To start the project in prod mode, run `npm run start:prod`

### Testing:

- Please note the tests setup will use env vars from `.env.test`

- To run all tests once, run `npm run test`
- To run all tests and watch for changes `npm run test:watch`
- To run single test file and watch for changes `npm run test:watch -- src/modules/auth/tests/auth.service.spec.ts`

### Lint:

- To run the lint, run `npm run lint`

Application runs on [localhost:3000](http://localhost:3000) by default.

## Migrations

Migration scripts:

- `npm run migration:generate --path=moduleName --name=InitialMigration` - automatically generates migration files with
  schema changes made
- `npm run migration:create --path=moduleName --name=CreateTableUsers` - creates new empty migration file
- `npm run migration:run` - runs migration
- `npm run migration:revert` - reverts last migration
- `npm run migration:show` - shows the list of migrations
- you can also use `npm run test:migration:run`, `npm run test:migration:show` and `npm run test:migration:revert` to
  manage testing database

## Swagger

Swagger will be available on http://localhost:3000/docs by default

You can find swagger documentation [here](https://swagger.io/docs/specification/about/)

## Rate limiting in Node.js and NestJS to prevent abuse of your API by limiting the number of requests made by a client within a certain timeframe

One of the popular package for rate limiting is express-rate-limit.

Here's how you we can implement rate limiting:
- First, install the express-rate-limit package using npm : `npm install express-rate-limit`
- Create a rate-limiting middleware in your application. For example, you can create a file named `rate-limit.middleware.ts`:
	```
  import { NestMiddleware, Injectable } from '@nestjs/common';
	import * as rateLimit from 'express-rate-limit';

	@Injectable()
	export class RateLimitMiddleware implements NestMiddleware {
	  use(req: any, res: any, next: () => void) {
		const limiter = rateLimit({
		  windowMs: 10000, // 10 seconds
		  max: 10, // limit each IP to 100 requests per windowMs
		  message: 'Too many requests, please try again later.',
		});
		limiter(req, res, next);
	  }
	}
  ```
  In this example, the rate limit is set to 10 requests per 10 seconds for each IP address. Adjust the windowMs and max properties according to your requirements.
- Register the RateLimitMiddleware in your application module app module:
	```
  import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
	import { RateLimitMiddleware } from './rate-limit.middleware';

	@Module({
	  // Your module configuration
	})
	export class AppModule implements NestModule {
	  configure(consumer: MiddlewareConsumer) {
		consumer.apply(RateLimitMiddleware).forRoutes('*');
	  }
	}
  ```
	This configuration will apply the rate-limiting middleware to all routes ('*') in your NestJS application. Requests that exceed the rate limit will receive a response with a status code of 429 and the message 'Too many requests, please try again later.'