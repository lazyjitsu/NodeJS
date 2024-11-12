graph = {
  A: ["B", "C"],
  B: ["A", "E"],
  C: ["A", "D", "F"],
  D: ["C", "F", "E"],
  E: ["B", "D", "F"],
  F: [],
};
graph2 = {
  1: [5, 4, 2],
  2: [7, 6, 3],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
};
binaryTreeGraph = {
  1: [2, 3],
  2: [4, 5],
  3: [6, 7],
  4: [],
  5: [],
  6: [],
  7: [],
};

BFS = (graph, vertex) => {
  //console.log("Src VTX: ", vertex);
  let visited = new Set();
  let queue = [vertex];
  while (queue.length > 0) {
    let currentVtx = queue.shift();
    if (!visited.has(currentVtx)) {
      visited.add(currentVtx);
      console.log("Visiting: ", currentVtx);
      for (let v of graph[currentVtx]) {
        queue.push(v);
      }
    }
  }
};
DFS = (graph, vertex) => {
  //console.log("Src VTX: ", vertex);
  let visited = new Set();
  let queue = [vertex];
  while (queue.length > 0) {
    let currentVtx = queue.pop();
    if (!visited.has(currentVtx)) {
      visited.add(currentVtx);
      console.log("Visiting: ", currentVtx);
      for (let v of graph[currentVtx]) {
        queue.push(v);
      }
    }
  }
};
//BFS(graph, "A");
BFS(graph2, 1);
console.log("----------DFS---------------");
DFS(graph2, 1);
console.log("--------------BFS--------------");
BFS(binaryTreeGraph, 1);
console.log("--------------DFS--------------");
DFS(binaryTreeGraph, 1);
