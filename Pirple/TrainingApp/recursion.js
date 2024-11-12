const { stripVTControlCharacters } = require("util");

const reverseString = (str) => {
  // What is the base case?
  if (str.length == 0) {
    return "";
  }

  return reverseString(str.substring(1)) + str.charAt(0);
  // What is the smallest amount of work I can do in ea. interation?
};

console.log(reverseString("semster"));

// divide by 2 and save the remainder

const decToBinary = (dec, result) => {
  if (dec == 0) return result;

  result = (dec % 2) + result;
  return decToBinary(dec / 2, result);
};

console.log(decToBinary(233, null));
