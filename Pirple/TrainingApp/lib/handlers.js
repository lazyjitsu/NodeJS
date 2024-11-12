/* handlers object to deal with or dare i say, 'handle' the requests*/
// Dependencies
//const { config } = require("process");
var _data = require("./data");
var helpers = require("./helpers");
var config = require("./config");
const { isBuffer } = require("util");
var handlers = {};

handlers.sample = function (data, cb) {
  // Callback a hattp status code, and a payload
  cb(406, { name: "Sample son!!" });
};
handlers.ping = function (data, cb) {
  cb(200);
};
// Not found handler
handlers.notFound = function (data, cb) {
  cb(404);
};
handlers.sem = function (data, cb) {
  cb(200, { city: "Lettuce Capitol Lopez!!" });
};
// Users
handlers.users = function (data, cb) {
  var allowedMethods = ["post", "get", "put", "delete"];
  //console.log("User DATTTA: ", data);
  if (allowedMethods.indexOf(data.method) > -1) {
    // _users indicates a private variable/method!
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};
// Tokens
handlers.tokens = function (data, cb) {
  var allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(data.method) > -1) {
    // _users indicates a private variable/method!
    console.log("token method: ", data.method, data);
    handlers._tokens[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers.checks = function (data, cb) {
  var allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(data.method) > -1) {
    // _users indicates a private variable/method!
    console.log("token method: ", data.method, data);
    handlers._checks[data.method](data, cb);
  } else {
    cb(405);
  }
};
// Container for private methods/handlers

handlers._users = {};
// Required data: firstName,lastName,phone,pass, tosAgreement
var firstName, lastName, phone;
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out

  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  console.log("phone before: ", data.payload.phone.toString().length);
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  console.log("phone after: ", phone);
## changed to avoid github restrictions
  var passwd =
    typeof data.payload.passwd == "string" &&
    data.payload.passwd.trim().length > 0
      ? data.payload.passwd.trim()
      : false;
  var tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement == true
      ? true
      : false;
  // console.log("HIIIIIIIIIIIIIIIIII ", phone, passwd);

  if (firstName && lastName && phone && passwd && tosAgreement) {
    console.log("HIIIIIIIIIIIIIIIIII ", phone, passwd);

    // Make sure the user doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        // if there is an err, then it means the record/file doesn't exist so now we can add the user record
        // Hash the passwd
        var hashedPassword = helpers.hash(passwd);

        // Create the user object
        if (hashedPassword) {
          var userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: true,
          };

          // Store the user
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash the user's passwd." });
        }
      } else {
        // User alread exists
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fieldsjss " });
  }
};

// Users - get
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated  user accesses their object. They can't access anyone elses!
handlers._users.get = function (data, cb) {
  var phone =
    typeof data.queryObj.phone == "string" &&
    data.queryObj.phone.trim().length == 10
      ? data.queryObj.phone.trim()
      : false;
  if (phone) {
    // Get the token from the headers
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    console.log("PHONE: ", phone, token);

    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        console.log("Validdddd");
        // Lookup the user
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            console.log("PHONEvalid: ", phone, token);

            // we dont want to display the passwd to the user. dangerous
            delete data.hashedPassword;
            cb(200, data);
          } else {
            cb(404);
          }
        });
      } else {
        cb(403, { "Errorrr:": "Token is not in header or token is invalid!" });
      }
    });
  } else {
    cb(400, { Error: "Missing Required field in get fcn" });
  }
};
handlers._users.put = function (data, cb) {
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  var lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  var passwd =
    typeof data.payload.passwd == "string" &&
    data.payload.passwd.trim().length > 0
      ? data.payload.passwd.trim()
      : false;

  if (phone) {
    if (firstName || lastName || passwd) {
      var token =
        typeof data.headers.token == "string" ? data.headers.token : false;
      handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
          _data.read("users", phone, function (err, userData) {
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (passwd) {
                userData.hashedPassword = helpers.hash(passwd);
              }
              // Now update/persist to disk!
              _data.update("users", phone, userData, function (err) {
                if (!err) {
                  cb(200);
                } else {
                  console.log(err);
                  cb(500, { "Error ": "Could not update the user" });
                }
              });
            } else {
              cb(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          cb(403, { Error: "Token missing from header or invalid token" });
        }
      });
    } else {
      cb(400, { Error: "missing fields to update!!" });
    }
  } else {
    cb(400, { Error: "Missing required field dude!" });
  }
};
handlers._users.delete = function (data, callback) {
  // Check that phone number is valid
  var phone =
    typeof data.queryObj.phone == "string" &&
    data.queryObj.phone.trim().length == 10
      ? data.queryObj.phone.trim()
      : false;
  if (phone) {
    // Get token from headers
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        // Lookup the user
        _data.read("users", phone, function (err, userData) {
          if (!err && userData) {
            // Delete the user's data
            _data.delete("users", phone, function (err) {
              if (!err) {
                // Delete each of the checks associated with the user
                var userChecks =
                  typeof userData.checks == "object" &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];
                var checksToDelete = userChecks.length;
                if (checksToDelete > 0) {
                  var checksDeleted = 0;
                  var deletionErrors = false;
                  // Loop through the checks
                  userChecks.forEach(function (checkId) {
                    // Delete the check
                    _data.delete("checks", checkId, function (err) {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted++;
                      if (checksDeleted == checksToDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {
                            Error:
                              "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully.",
                          });
                        }
                      }
                    });
                  });
                } else {
                  callback(200);
                }
              } else {
                callback(500, { Error: "Could not delete the specified user" });
              }
            });
          } else {
            callback(400, { Error: "Could not find the specified user." });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header, or token is invalid.",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

handlers._tokens = {};
// Required: phone and passwd
// Optional: None
handlers._tokens.post = function (data, cb) {
  console.log("Post: ", data);
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? //data.payload.phone.toString().length == 10
        data.payload.phone.trim()
      : false;
  var passwd =
    typeof data.payload.passwd == "string" &&
    data.payload.passwd.trim().length > 0
      ? data.payload.passwd.trim()
      : false;

  if (phone && passwd) {
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        // Need to hash passwd so we can compare it to the already hashed password
        var hashedPassword = helpers.hash(passwd);
        if (hashedPassword == userData.hashedPassword) {
          var tokenId = helpers.createRandomString(20);

          var expires = Date.now() + 1000 * 60 * 60; // 1000 ms * 60 = 60 seconds * 60 = 60 minutes = 1 hr.
          var tokenObject = {
            phone: phone,
            id: tokenId,
            expires: expires,
          };
          // Now store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              cb(200, tokenObject);
            } else {
              cb(500, { Error: "Could not create token!!" });
            }
          });
        } else {
          cb(400, { Error: "Password did not match!!" });
        }
      } else {
        cb(200, userData);
      }
    });
  } else {
    cb(400, { Error: "missing required fieldss" });
  }
};

handlers._tokens.get = function (data, cb) {
  var id =
    typeof data.queryObj.id == "string" && data.queryObj.id.trim().length == 20 // should make a var to store this length.
      ? data.queryObj.id.trim()
      : false;
  if (id) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        cb(200, tokenData);
      } else {
        cb(404);
      }
    });
  } else {
    cb(400, { Error: "Missing Required field in get fcn" });
  }
};
//Required: id,extend (true|false). Note we don't want to open or let the user control amount of time to extend token, so we use
// true or false to extend using our own time.
//Optional:none
handlers._tokens.put = function (data, cb) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20 // should make a var to store this length.
      ? data.payload.id.trim()
      : false;

  var extend =
    typeof data.payload.extend == "boolean" && data.payload.extend == true // should make a var to store this length.
      ? true
      : false;

  if (id && extend) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        console.log("Bug3: ", "-->", data, "<--", Date.now(), tokenData);

        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          console.log("Put expires: ", tokenData.expires);
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              cb(200);
            } else {
              cb(500, {
                Error: "Could not update the token's expiration.",
              });
            }
          });
        }
      } else {
        cb(400, { Error: "Token already expired and cannot be extended!" });
      }
    });
  } else {
    cb(500, { Error: "Missing rquired fieldsz" });
  }
};

handlers._tokens.delete = function (data, cb) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  if (id) {
    // User lookup
    _data.read("tokens", id, function (err, data) {
      if (!err && data) {
        _data.delete("tokens", id, function (err) {
          if (!err) {
            cb(200);
          } else {
            cb(500, { Error: "Could not delete the specified token!" });
          }
        });
      } else {
        cb(400, { "Error ": "Could not find the specified token!" });
      }
    });
  } else {
    console.log("Token id doesnt exist");
    cb(400, { Errr: "Token Id doesnt exist" });
  }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.phone == phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

handlers._checks = {};
// checks: post
// required data: protocol, url, method, success code, timeout
// optional: none
handlers._checks.post = function (data, cb) {
  console.log("Checks Post data: ", data);
  var protocol =
    typeof data.payload.protocol == "string" &&
    ["http", "https"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  var url =
    typeof data.payload.url == "string" && data.payload.url.length > 0
      ? data.payload.url
      : false;
  var method =
    typeof data.payload.method == "string" &&
    ["post", "put", "get", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  var successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  var timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 == 0 && // need it to be a whole number
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;
  console.log("Checkssssssssssssssss: ", data.payload.successCodes);

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // We don't want just anybody logging in so we need to validate token
    var token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    // Now lookup user by reading the token from the token file
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        var userPhone = tokenData.phone;
        // Now that we have the phone, use that to look up the user since we store the user data by phone #
        _data.read("users", userPhone, function (err, userData) {
          if (!err && userData) {
            var userChecks =
              typeof userData.checks == "object" &&
              userData.checks instanceof Array
                ? userData.checks
                : [];
            // Verify the user has less than max checks
            if (userChecks.length < config.maxChecks) {
              // Create random id for the check
              var checkId = helpers.createRandomString(20);
              // Create the check object and include the user's phone. Recall the phone is how we identify the user.
              // We're going to store ea. check with a reference to its creator and we're also going to make sure these creators
              // have a reference on their object to ea. of their checks. This is a NoSQL way of storing things!! This is now how
              // you would do it with a relational db but with mongo db and generally key/value stores, this is how its usually done
              // Now create the check object and include the phone
              var checkObject = {
                id: checkId,
                userPhone: userPhone,
                protocol: protocol,
                url: url,
                method: method,
                successCodes: successCodes,
                timeoutSeconds: timeoutSeconds,
              };

              // Save the object
              _data.create("checks", checkId, checkObject, function (err) {
                if (!err) {
                  // Add the check id to the user's object!
                  userData.checks = userChecks;
                  userData.checks.push(checkId);
                  // Save the data
                  _data.update("users", userPhone, userData, function (err) {
                    if (!err) {
                      // Return the data about the new checks to the caller
                      cb(200, checkObject);
                    } else {
                      cb(500, {
                        Error: "Couldn't updatte the user with the new check",
                      });
                    }
                  });
                } else {
                  cb(500, { Error: "Could not create the new check" });
                }
              });
            } else {
              cb(400, {
                Error: "User alredy has max checks ('+config.maxChecks+')",
              });
            }
          } else {
          }
        });
      } else {
        cb(403);
      }
    });
  } else {
    cb(400, { "Error ": "Missing required inputs, or inputs are invaliddd" });
  }
};

handlers._checks.get = function (data, callback) {
  // Check that id is valid
  console.log("Here: ", data);
  var id =
    typeof data.queryObj.id == "string" && data.queryObj.id.trim().length == 20
      ? data.queryObj.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        // Get the token that sent the request
        var token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        console.log("This is check data", checkData);
        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          function (tokenIsValid) {
            if (tokenIsValid) {
              // Return check data
              callback(200, checkData);
            } else {
              callback(403, { Errl: "noe" });
            }
          }
        );
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field, or field invalid" });
  }
};

// Checks: put
// Required data: id
// Optional data: protocol, method, url, successCodes, timeoutSeconds (one must be sent)
handlers._checks.put = function (data, cb) {
  var id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  // Check for the optional data
  var protocol =
    typeof data.payload.protocol == "string" &&
    ["http", "https"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  var url =
    typeof data.payload.url == "string" && data.payload.url.length > 0
      ? data.payload.url
      : false;
  var method =
    typeof data.payload.method == "string" &&
    ["post", "put", "get", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;
  var successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  var timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 == 0 && // need it to be a whole number
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 15
      ? data.payload.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup th chek
      _data.read("checks", id, function (err, checkData) {
        if (!err && checkData) {
          var token =
            typeof data.headers.token == "string" ? data.headers.token : false;
          // Verify that the given token is valid and belongs to the user who created the check
          console.log("This is check data", checkData);
          handlers._tokens.verifyToken(
            token,
            checkData.userPhone,
            function (tokenIsValid) {
              if (tokenIsValid) {
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }
                // Store the new update(s)
                _data.update("checks", id, checkData, function (err) {
                  if (!err) {
                    cb(200);
                  } else {
                    cb(500, { Error: "Could not updatte the check!" });
                  }
                });
              } else {
                cb(403);
              }
            }
          );
        } else {
          cb(400, { Error: "Check ID did not exist" });
        }
      });
    } else {
      cb(400, { Error: "Missing fields to update" });
    }
  } else {
    cb(400, { Error: "Missing required Id" });
  }
};
// Checks: delete
// Required data: id
// Optional data: none
handlers._checks.delete = function (data, callback) {
  // Check that id is valid
  var id =
    typeof data.queryObj.id == "string" && data.queryObj.id.trim().length == 20
      ? data.queryObj.id.trim()
      : false;
  if (id) {
    // Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        // Get the token that sent the request
        var token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          function (tokenIsValid) {
            if (tokenIsValid) {
              // Delete the check data
              _data.delete("checks", id, function (err) {
                if (!err) {
                  // Lookup the user's object to get all their checks
                  _data.read(
                    "users",
                    checkData.userPhone,
                    function (err, userData) {
                      if (!err) {
                        var userChecks =
                          typeof userData.checks == "object" &&
                          userData.checks instanceof Array
                            ? userData.checks
                            : [];

                        // Remove the deleted check from their list of checks
                        var checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // Re-save the user's data
                          userData.checks = userChecks;
                          _data.update(
                            "users",
                            checkData.userPhone,
                            userData,
                            function (err) {
                              if (!err) {
                                callback(200);
                              } else {
                                callback(500, {
                                  Error: "Could not update the user.",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            Error:
                              "Could not find the check on the user's object, so could not remove it.",
                          });
                        }
                      } else {
                        callback(500, {
                          Error:
                            "Could not find the user who created the check, so could not remove the check from the list of checks on their user object.",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, { Error: "Could not delete the check data." });
                }
              });
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(400, { Error: "The check ID specified could not be found" });
      }
    });
  } else {
    callback(400, { Error: "Missing valid id" });
  }
};

// Export

module.exports = handlers;
