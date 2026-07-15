"use strict";

import cors from 'cors';
import compression from 'compression';
import crypto from 'crypto';
import debounce from 'lodash.debounce';
import express from 'express';
import fs from 'fs';
import passport from 'passport';

import models from './models';
import routes from './routes';
import config from './config';

const app = express();

// Enable CORS
const corsOrigin = config.frontend.port
  ? config.frontend.url + ':' + config.frontend.port
  : config.frontend.url;

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

// Enable gzip compression
app.use(compression());
// Passport support
app.use(passport.initialize());
import './passport-providers';

// Make a hash from the DB version, to enable proper caching
app.set('etag', false);
let dbVersion;
const dbVersionChanged = debounce(() => {
  try {
    if (fs.existsSync(config.db.versionFile)) {
      const hash = crypto.createHash('md5');
      hash.update(fs.readFileSync(config.db.versionFile));
      dbVersion = '"' + hash.digest('hex') + '"';
    } else {
      dbVersion = '"default-db-version"';
    }
  } catch (e) {
    dbVersion = '"default-db-version"';
  }
}, 500);
dbVersionChanged(); // Read once on start

// Disable fs.watch in Vercel/Production to prevent crash and lambda timeout
if (process.env.NODE_ENV !== 'production') {
  try {
    fs.watch(config.db.versionFile, dbVersionChanged);
  } catch(e) {
    // Ignore watch errors if file doesn't exist
  }
}

app.get('*', (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("ETag", dbVersion);
  next();
});

// Keep the model in the request to keep the other functions pure
app.use((req, res, next) => {
  req.context = {
    models
  };
  next();
});

// Routes for Daily Grind
app.use('/daily', routes.daily);
// Routes For Party Builder
app.use('/party', routes.party);
// GET routes for Collection Tracker
app.use('/tracker', routes.tracker);
// User creation/login route
app.use('/user', routes.user);
// Release schedule
app.use('/release', routes.release);

if (process.env.NODE_ENV === "production") {

}
else {
  app.use('/admin', routes.admin);
}

// 404 everything else
app.use((req, res) => {
  res.sendStatus(404);
});

// For local development: listen on port
// For Vercel: export app as serverless handler
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV) {
  app.listen(config.app.port, () =>
    console.log('Granblue Party REST API listening on port ' + config.app.port),
  );
}

module.exports = app;