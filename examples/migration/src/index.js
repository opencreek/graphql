const { ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@opencreek/neo4j-graphql");

const driver = require("./driver");
const typeDefs = require("./type-definitions");

const neo4jGraphQL = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({ schema: neo4jGraphQL.schema });

server.listen().then(({ url }) => {
    console.log(`@opencreek/neo4j-graphql API ready at ${url}`);
});
