import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, type NestExpressApplication } from '@nestjs/platform-express';
import express, { type Express } from 'express';
import { type HttpsFunction, onRequest } from 'firebase-functions/v2/https';

import { AppModule } from './app.module';

// Create an Express server
const server: Express = express();

// Define a function to create a NestJS server within an Express instance
export const createNestServer = async (expressInstance: express.Express) => {
  // Create an ExpressAdapter with the Express instance
  const adapter = new ExpressAdapter(expressInstance);

  // Create a NestJS app using the AppModule and the adapter
  const app = await NestFactory.create<NestExpressApplication>(AppModule, adapter, {});

  app.enableCors();
  return app.init();
};

// Create the NestJS server and log the status
createNestServer(server)
  .then(() => console.log('Nest Ready')) // Log a success message
  .catch((err) => console.error('Nest broken', err)); // Log error message

// Export the Express server as a Firebase cloud function
export const api: HttpsFunction = onRequest(server);
