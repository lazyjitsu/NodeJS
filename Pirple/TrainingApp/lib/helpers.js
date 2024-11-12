// Utility for various tasks

// Depencies
var crypto = require("crypto");
var config = require("./config");
var querystring = require("querystring");
var https = require("https");

var helpers = {};

// sha256 built into node so it's convenient
helpers.hash = function (str) {
  if (typeof str === "string" && str.length > 0) {
    var hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};
// the reason wy we're writing this json parser is because the native one will throw an error and crash if not valid,
// we want to continue and give user a chance to submit a valid payload
helpers.parseJsonToObject = function (str) {
  try {
    var obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {}; // return an empty object
  }
};

helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // define all the possible characters;
    var possibleChars = "abcdefghijklmnopqrstuvwxyz0123456789";

    var str = "";
    var randomCharacter;

    for (i = 1; i <= strLength; i++) {
      randomCharacter = possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
      str += randomCharacter;
    }
    return str;
  } else {
    return false;
  }
};
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Validate parameters
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (phone && msg) {
    // Configure the request payload
    var payload = {
      From: config.twilio.fromPhone,
      //From: "1113334444",
      To: "+1" + phone,
      Body: msg,
    };
    // Not using JSON.stringify() because we're doing this for a more traditional API!
    var stringPayload = querystring.stringify(payload);

    // Configure the request details
    var requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // <-- this is not a normal JSON API, its traditional
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    var req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request. AFTER the req.end() runs, this function will be ran!
      var status = res.statusCode;
      // Callback successfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was " + status);
      }
    });

    // Bind to the error event so it doesn't get thrown. We don't want the error to kill the thread!!

    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request. This means the same thing as ending off the request.
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};
module.exports = helpers;
