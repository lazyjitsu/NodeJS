const bfs = (graph, source) => {
  var queue = [source];
  let visited = new Set();
  while (queue.length > 0) {
    let current = String(queue.shift());
    console.log("Current: ", current);
    visited.add(String(current));
    // current = stack.pop();
    console.log("Process: ", current, visited);
    console.log(graph[current]);
    if (visited.has(String(current))) {
      for (let n of graph[current]) {
        console.log("N: ", n);
        // n = String(n);
        queue.push(n);
      }
    }

    // for (let neighbor of graph[current]) {
    //   console.log("stacking ", neighbor);
    //   queue.push(String(neighbor));
    // }
  }
};
const graph = {
  a: ["b", "c"],
  b: ["d"],
  c: ["e"],
  d: ["f"],
  e: [],
  f: [],
};
const graph2 = {
  a: ["b", "c"],
  b: ["a", "e"],
  c: ["a", "d", "f"],
  d: ["c", "f", "e"],
  e: ["b", "d", "f"],
  f: [],
};

bfs(graph2, "a");
// let arr = [];
// for (let n in graph2) {
//   console.log("ene: ", n, graph2[n]);
//   for (let o of graph2[n]) {
//     arr.push(o);
//   }
// }
//console.log(arr);
