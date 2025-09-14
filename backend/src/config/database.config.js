
// database.config.js
// Centralized MongoDB configuration for Mongoose

const config = {
  development: {
    uri: process.env.MONGO_URI_DEV || "mongodb://localhost:27017/talent_hub_dev",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  production: {
    uri: process.env.MONGO_URI_PROD, // must be set in env
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  test: {
    uri: process.env.MONGO_URI_TEST || "mongodb://localhost:27017/talent_hub_test",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];
