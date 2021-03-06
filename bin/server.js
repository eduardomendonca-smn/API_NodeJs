const app = require("../src/app");
const debug = require("debug")("nodeapi:server");
const http = require("http");
var express = require("express");
var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");
//const webconfig = require('../webconfig');

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log("Servidor rodando em http://localhost:" + port);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe" + port : "Port" + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + "require elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + "is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

/*app.listen(webconfig.portApi, () => {
    console.log(`[${webconfig.nameApi}] rodando em: ${webconfig.urlApi}:${webconfig.portApi}`)
});*/

var schema = buildSchema(`
  type Produto {
    ss: String
    eduardo: [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!";
  },
  eduardo: () => {
    return [1, 2, 3, 4].map(_ => 1 + Math.floor(Math.random() * 6));
  }
};

var ap = express();
ap.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
ap.listen(4000);
console.log("Running a GraphQL API server at localhost:4000/graphql");
