var func1 = (data, cb) => {
  data += "ending witth from the mighty salas Bowl!!";
  cb(data);
};

function func2(data, cb) {
  data += "xiv ";
  func1(data, function (a, b) {
    console.log(data, " <-- salas east marketa!!");
    // func3(data,cb) {
    //   if(data == 'salas') {
    //     cb('salinero')
    //   }
    //}
    a += "from fcn1";
    cb(a, "from Funky Town 1");
  });
  cb("func2 seinding back this");
}
func2("Starting here...", (d, e) => {
  console.log("D: ", d, " and ", e);
});
// p ut in debugger
