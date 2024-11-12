const graph = {
  a: ["c", "b"],
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
};
const dfs = (g, v) => {
  const stack = [v];
  let vtx = stack.pop();
  console.log(vtx);
  for (let n of g[vtx]) {
    dfs(g, n);
    //stack.push(n);
  }
};
dfs(graph, "a");
