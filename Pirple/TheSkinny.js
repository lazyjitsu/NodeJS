var http = require("http");

var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var fs = require("fs");

var httpServer = http.createServer(function (req, res) {
  var myParsedUrl = url.parse(req.url, true);

  // Extract Path
  var path = myParsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  var queryObj = myParsedUrl.query;

  console.log("Query used is: ", queryObj.salas);

  var myHeaders = req.headers;
  var method = req.method.toLowerCase();
  console.log("Headers are: ", myHeaders);

  // Get the payload, if any
  var decoder = new StringDecoder("utf-8"); //utf 8 ; most all JSON usses for API
  var buffer = "";
  // when data is emitted. sends in chunks, decode utf8, while we're receiving this stream of data (little pieces at a time)
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  // when the stream has completed, it will emit an 'end' signal which always gets called rather or not we have a payload!!
  // this is why its safe to put res.end() here!
  req.on("end", function () {
    buffer += decoder.end(); // cap off the buffer with whatever was at the end.
    // Putting handler here cause this gets called for every request, regardless of rather or not there is a payload
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    // construct the data to send
    var data = {
      trimmedPath: trimmedPath,
      queryObj: queryObj,
      method: method,
      headers: myHeaders,
      payload: helpers.parseJsonToObject(buffer),
    };
    console.log("Chosen handler: ", chosenHandler, router[trimmedPath]);
    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      // use the payload called back by te handler, or default
      payload = typeof payload == "object" ? payload : {};
      // conver payload to a sttring. this is NOT the payload we received, but the payload we're sending
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ", statusCode, payloadString);
    });
});

httpServer.listen(4444,() => {console.log('running 4444'));
//http://localhost:4444/tokens

var router = {
  sample: 	handlers.sample,
  sem: 		handlers.sem,
  ping: 	handlers.ping,
  users: 	handlers.users,
  tokens: 	handlers.tokens,
  checks: 	handlers.checks,
};

handlers.tokens = function (data, cb) {
  var allowedMethods = ["post", "get", "put", "delete"];
  if (allowedMethods.indexOf(data.method) > -1) {
    // _users indicates a private variable/method!
    console.log("token method: ", data.method, data);
    handlers._tokens[data.method](data, cb); //handlers_tokens.post is the same as referencing it as handlers._tokens[post]
  } else {
    cb(405);
  }
};

handlers._tokens.post = function (data, cb) {
  console.log("Post: ", data);
  var phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length == 10
      ? data.payload.phone.trim()
      : false;
  var password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  if (phone && password) {
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        var hashedPassword = helpers.hash(password);
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
    cb(400, { Error: "missing required fields" });
  }
};

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 