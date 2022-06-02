const globalConf = require("../../jest.config.base");

module.exports = {
    ...globalConf,
    displayName: "@opencreek/neo4j-graphql",
    roots: ["<rootDir>/packages/graphql/src/", "<rootDir>/packages/graphql/tests/"],
    coverageDirectory: "<rootDir>/packages/graphql/coverage/",
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/packages/graphql/tsconfig.json",
        },
    },
};
