function first(data, cb) {
  //console.log(data, cb);
  if (data.name == "semster") {
    cb("XIV", ["EAST MARKET", "From The Fruit Stand"]);
  } else {
    cb({ freemont: "Ricardo" }, [1, 2, 3]);
  }
}
function second(data, cb) {
  if (data == "XIV") {
    cb("Dragon!!!");
  } else {
    cb("Lomas");
  }
}

first({ name: "semsterr" }, function (gang, street) {
  console.log("GANG: ", gang + 14, "and str: ", street);
  if (gang == "XIV") {
    console.log("norteno");
    second(gang, function (name) {
      if (name == "Dragon!!!") {
        console.log("Miss you caughtright!!");
      } else {
        console.log("Miss you Lomas Barrio");
      }
    });
  } else {
    console.log("not norte", gang.freemont);
  }
  let results = street.map((d) => {
    return d + " <-- salad bowl!!";
  });
  //console.log(results);
});
// pm.sendRequest(getBooks,function(err, books){
//   //use lodash's map function
//   const ids = _.map(books.json(), function(books) {
//       function(book) {
//           return book.id;
//       }
//   })
//   pm.globals.set("bookIds",ids);
// })
