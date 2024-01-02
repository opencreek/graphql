const globalConf = require("../../jest.config.base");

module.exports = {
    ...globalConf,
    displayName: "@opencreek/neo4j-graphql-ogm",
    roots: ["<rootDir>/packages/ogm/src", "<rootDir>/packages/ogm/tests"],
    coverageDirectory: "<rootDir>/packages/ogm/coverage/",
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/packages/ogm/tsconfig.json",
            },
        ],
    },
};
