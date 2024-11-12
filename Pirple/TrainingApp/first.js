// Dependencies
//const { readdirSync } = require("fs");
var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  // Get and Parse URL. note 'true' means to call the query string module (see docs if u care)
  // IOW: myParsedUrl.query will be set as if it was sent to the query string module.Like using 2 mods at once!!
  var myParsedUrl = url.parse(req.url, true);

  // Extract Path
  var path = myParsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");
  // Respond
  //res.end("hello Mikeeo");

  // Output Path
  console.log("Trimmed path is: ", trimmedPath);
  // Get Query String
  var queryObj = myParsedUrl.query;

  console.log("Query used is: ", queryObj.salas);

  // Get the HTTP Method
  console.log("Method used is: ", req.method.toLowerCase());

  // Get & Print headers
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
      payload: buffer,
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
    //   res.end("The End Bro!");
  });
});

//server.listen(3300, () => {
server.listen(config.port, () => {
  //console.log("The server is listening on 3300");
  //console.log(`The server is listening on ${config.port}`);
  console.log(
    "The server is listening on " +
      config.port +
      " in " +
      config.envName +
      " mode"
  );
});

var handlers = {};

handlers.sample = function (data, cb) {
  // Callback a hattp status code, and a payload
  cb(406, { name: "Sample son!!" });
};

// Not found handler
handlers.notFound = function (data, cb) {
  cb(404);
};
handlers.sem = function (data, cb) {
  cb(200, { city: "Lettuce Capitol Lopez!!" });
};
var router = {
  sample: handlers.sample,
  sem: handlers.sem,
};
