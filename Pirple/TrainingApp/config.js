/* Create & Export variables */
var environments = {};

environments.staging = {
  //port: 3000,
  httpPort: 3000,
  httpsPort: 3333,
  envName: "staging",
  hashingSecret: "myHashSecretssss",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006",
  },
};

environments.production = {
  //port: 5000,
  httpPort: 5000,
  httpsPort: 5333,
  envName: "production",
  hashingSecret: "myHashSecret",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
};

// set on the command line by detecting the env, if defined.
var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

var environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
