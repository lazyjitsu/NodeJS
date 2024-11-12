// Graph Practice
// Iterative:
// const DFS = (graph, source) => {
//   const stack = [source];
//   // let a = [source];
//   const visited = new Set();
//   while (stack.length > 0) {
//     let vertex = String(stack.pop());
//     if (!visited.has(vertex)) {
//       console.log("Process: ", vertex);
//       //console.log(graph[vertex]);
//       vertex = String(vertex);
//       visited.add(vertex);
//       for (let n of graph[vertex]) {
//         n = String(n.trim());
//         //console.log("Push:", n);
//         stack.push(n);
//         //  a.push(n);
//       }
//     }
//   }
// };

const BFS = (graph, vtx) => {
  // const queue = [v];
  //const vtx = String(queue.shift());
  console.log(vtx);
  vtx = String(vtx);
  for (let node of graph[vtx]) {
    BFS(graph, String(node));
    //console.log(node);
  }
};

const explorer = (graph, vertex) => {
  for (let v of graph[v]) {
    queue.push(v);
  }
};
const graph2 = {
  a: ["c", "b"],
  b: ["d"],
  c: ["e"],
  d: ["f"],
  e: [],
  f: [],
};
const graph = {
  A: ["B", "C"],
  B: ["A", "E"],
  C: ["A", "D", "F"],
  D: ["C", "F", "E"],
  E: ["B", "D", "F"],
  F: [],
};

//DFS(graph, "A");
//DFS(graph2, "a");
//BFS(graph, "A");
//
BFS(graph2, "a");
