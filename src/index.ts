import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, type NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import express, { type Express } from 'express';
import { type HttpsFunction, onRequest } from 'firebase-functions/v2/https';

import { AppModule } from './app.module';

// Create a new express server
const expressServer: Express = express();

// Define an asynchronous function to initialize a NestJS module
const apiFunction = async (expressInstance: Express): Promise<void> => {
  // Create a new Nest app instance
  const api = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  // Use the compression middleware
  api.use(compression());
  // Use the validation middleware
  api.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Enable CORS
  api.enableCors({});
  // Initialize the api
  await api.init();
};

// Export a Firebase function that initializes the API function
// and then passes the request and response to the express server
export const api: HttpsFunction = onRequest(async (request, response) => {
  await apiFunction(expressServer);
  expressServer(request, response);
});
