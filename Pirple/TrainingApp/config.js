/* Create & Export variables */
var environments = {};

environments.staging = {
  //port: 3000,
  httpPort: 3000,
  httpsPort: 3333,
  envName: "staging",
  hashingSecretNotMe: "myHashStuff",
  maxChecks: 5,
  twilio: {
    AuthToken: "somestuff",
    fromPhone: "+15005550006",
  },
};

environments.production = {
  //port: 5000,
  httpPort: 5000,
  httpsPort: 5333,
  envName: "production",
  hashingSecret: "myHashSect",
  maxChecks: 5,
  twilio: {
    accountSid: "some sid",
    authToken: "some token",
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
