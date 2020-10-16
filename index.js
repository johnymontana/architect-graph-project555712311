const { makeAugmentedSchema } = require("neo4j-graphql-js");
const { ApolloServer } = require("apollo-server");
const neo4j = require("neo4j-driver");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql")).toString("utf-8");

const schema = makeAugmentedSchema({typeDefs})
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD), {encrypted: 'ENCRYPTION_ON'}
)

const server = new ApolloServer({ schema, context: { driver, neo4jDatabase: "neo4j" } });

server.listen(3000, "0.0.0.0").then(({ url }) => {
  console.log("GraphQL API ready at: ", url);
});
