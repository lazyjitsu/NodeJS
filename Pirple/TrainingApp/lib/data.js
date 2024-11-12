var fs = require("fs");
var path = require("path");
const helpers = require("./helpers");

//Container
var lib = {};

lib.baseDir = path.join(__dirname, "/../data");

//Write the data to file
lib.create = function (dir, file, data, cb) {
  // open the file         lib.baseDir + "/" + dir + "/"

  fs.open(
    lib.baseDir + "/" + dir + "/" + file + ".json",
    "wx",
    function (err, fd) {
      if (!err && fd) {
        var stringData = JSON.stringify(data);

        // write & close fd/file
        fs.writeFile(fd, stringData, function (err) {
          if (!err) {
            fs.close(fd, function (err) {
              if (!err) {
                cb(false); // false is a good thing here.. we would like error to be false aka no error
              } else {
                cb("Error closing file!");
              }
            });
          } else {
            cb("Error writing to new file!!");
          }
        });
      } else {
        cb("Could not create new file, it may already exist");
      }
    }
  );
};

lib.read = function (dir, file, cb) {
  fs.readFile(
    lib.baseDir + "/" + dir + "/" + file + ".json",
    "utf8",
    function (err, data) {
      if (!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        cb(false, parsedData);
      } else {
        cb(err, data); //else return data as u received it w/out being json parsed
      }
    }
  );
};
// Update data in a file
lib.update = function (dir, file, data, callback) {
  // Open the file for writing. 'r+' generates an error if file doesn't exist
  fs.open(
    lib.baseDir + "/" + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing existing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open file for updating, it may not exist yet");
      }
    }
  );
};
// Delete a file
lib.delete = function (dir, file, callback) {
  // Unlink the file from the filesystem
  var target = lib.baseDir + "\\" + dir + "\\" + file + ".json";
  //  fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {

  fs.unlink(target, function (err) {
    callback(err);
  });
};

module.exports = lib;
