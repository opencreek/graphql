/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Driver } from "neo4j-driver";
import { graphql } from "graphql";
import { gql } from "apollo-server";
import { generate } from "randomstring";
import neo4j from "../neo4j";
import { Neo4jGraphQL } from "../../../src/classes";
import { generateUniqueType } from "../../../tests/utils/graphql-types";

describe("resolve fields necessary for custom resolvers", () => {
    let driver: Driver;

    beforeAll(async () => {
        driver = await neo4j();
    });

    afterAll(async () => {
        await driver.close();
    });

    test("should resolve the correct fields", async () => {
        const session = driver.session();

        const testLog = generateUniqueType("Log");
        const testLog2 = generateUniqueType("Log2");

        const typeDefs = gql`
            type ${testLog.name} {
                id: ID!
                name: String!

                link: ${testLog2.name} @relationship(type: "LINK", direction: OUT)

                test: String! @ignore @customResolver(requiredFields: ["name", "link.test"])
            }

            type ${testLog2.name} {
                test: String!
            }
        `;

        const neoSchema = new Neo4jGraphQL({
            typeDefs,
            resolvers: {
                [testLog.name]: {
                    test: (...args) => {
                        console.dir(args);
                        return "hallo";
                    },
                },
            },
        });

        const logId = generate({
            charset: "alphabetic",
        });

        const query = `
            query {
                ${testLog.plural} {
                  test
                }
            }
        `;

        try {
            await session.run(`
                CREATE (a:${testLog.name} { id: "${logId}", name: "name" })
                CREATE (b:${testLog2.name} { test: "log2test" })

                MERGE (a)-[:LINK]->(b)

                RETURN a
            `);

            const result = await graphql({
                schema: neoSchema.schema,
                source: query,
                contextValue: { driver },
            });

            if (result.errors) {
                console.log(JSON.stringify(result.errors, null, 2));
            }

            expect(result.errors).toBeFalsy();

            console.dir(result.data);
        } finally {
            await session.close();
        }
    });
});
