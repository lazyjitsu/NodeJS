// Recurse & DFS since only DFS works with Recursion!
const graph = {
  Apples: ["Barrry", "Carrots"],
  Barrry: ["Apples", "Diamonds"],
  Carrots: ["elephants", "Apples"],
  Diamonds: ["Barrry", "Franky"],
  elephants: ["Carrots"],
  Franky: ["Diamonds"],
};
const aCyclicGraph = {
  f: ["g", "i"],
  g: ["h"],
  h: [],
  i: ["g", "k"],
  j: ["i"],
  k: [],
};

const visited = new Set();
const hasPath = (graph, source, dest) => {
  if (source == dest) {
    console.log("SRC ", source, " Dest: ", dest);
    return "sem";
  }
  if (!visited.has(source)) {
    visited.add(source);
    console.log("Exploring ", source);
    for (let neighbor of graph[source]) {
      console.log("compare ", neighbor, " with ", dest);
      if (hasPath(graph, neighbor, dest) == "sem") {
        console.log(neighbor, "has a path to ", dest);
        return "sem";
      }
    }
  }

  return false;
};
// for (let k in graph) {
//   for (let n of graph[k]) {
//     console.log(n);
//   }
// }
//console.log(hasPath(aCyclicGraph, "f", "k"));
console.log(hasPath(graph, "Apples", "Franky"));
