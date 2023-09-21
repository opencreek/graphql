const path = require("path");
const graphQLJestConfig = require("./jest.config");

module.exports = {
    ...graphQLJestConfig,
    displayName: "@opencreek/neo4j-graphql",
    globalSetup: path.join(__dirname, "jest.minimal.global-setup.js"),
    globalTeardown: undefined,
};
