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

import Node, { NodeConstructor } from "./Node";
import { ContextBuilder } from "../../tests/utils/builders/context-builder";
import { NodeBuilder } from "../../tests/utils/builders/node-builder";

describe("Node", () => {
    const defaultContext = new ContextBuilder().instance();

    test("should construct", () => {
        // @ts-ignore
        const input: NodeConstructor = {
            name: "Movie",
            cypherFields: [],
            enumFields: [],
            primitiveFields: [],
            scalarFields: [],
            temporalFields: [],
            unionFields: [],
            interfaceFields: [],
            objectFields: [],
            interfaces: [],
            otherDirectives: [],
            pointFields: [],
            relationFields: [],
        };

        // @ts-ignore
        expect(new Node(input)).toMatchObject({ name: "Movie" });
    });

    test("should return labelString from node name", () => {
        const node = new NodeBuilder({
            name: "Movie",
        }).instance();

        expect(node.getLabelString(defaultContext)).toBe(":Movie");
    });

    test("should return labels from node name", () => {
        const node = new NodeBuilder({
            name: "Movie",
        }).instance();

        expect(node.getLabels(defaultContext)).toEqual(["Movie"]);
    });

    test("should return plural with underscores", () => {
        const node = new NodeBuilder({
            name: "super_movie",
        }).instance();

        expect(node.plural).toBe("super_movies");
    });

    describe("NodeDirective", () => {
        test("should return labels updated with jwt values from Context", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    label: "$jwt.movielabel",
                })
                .instance();

            const context = new ContextBuilder()
                .with({
                    jwt: {
                        movielabel: "Movie",
                    },
                    myKey: "key",
                })
                .instance();

            const labels = node.getLabels(context);
            const labelString = node.getLabelString(context);

            expect(labels).toEqual(["Movie"]);
            expect(labelString).toBe(":`Movie`");
        });

        test("should return labels updated with context values from Context", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    label: "$context.myKey",
                })
                .instance();

            const context = new ContextBuilder()
                .with({
                    myKey: "Movie",
                })
                .instance();

            const labels = node.getLabels(context);
            const labelString = node.getLabelString(context);

            expect(labels).toEqual(["Movie"]);
            expect(labelString).toBe(":`Movie`");
        });

        test("should return additional labels updated with jwt values from Context", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    label: "Film",
                    additionalLabels: ["$jwt.movielabel"],
                })
                .instance();

            const context = new ContextBuilder()
                .with({
                    jwt: {
                        movielabel: "Movie",
                    },
                    myKey: "key",
                })
                .instance();

            const labels = node.getLabels(context);
            const labelString = node.getLabelString(context);

            expect(labels).toEqual(["Film", "Movie"]);
            expect(labelString).toBe(":`Film`:`Movie`");
        });
        test("should return true if it is a global node", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    global: true,
                })
                .instance();
            const isGlobalNode = node.isGlobalNode();
            expect(isGlobalNode).toBe(true);
        });
        test("should convert the a db id to a global relay id with the main label name", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    global: true,
                    idField: "title",
                })
                .instance();

            const value = "keanu@thematrix.com";

            const relayId = node.toGlobalId(value);

            expect(node.fromGlobalId(relayId)).toEqual({
                field: "title",
                value,
            });
        });
        test("should convert a relay id to an object of { field: string, value: string | number }", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    global: true,
                    idField: "title",
                })
                .instance();

            const value = "carrie-anne@thematrix.com";

            const relayId = node.toGlobalId(value);

            expect(node.fromGlobalId(relayId)).toMatchObject({ field: "title", value });
        });

        test("should properly convert a relay id to an object when the id has a colon in the name", () => {
            const node = new NodeBuilder({
                name: "Film",
            })
                .withNodeDirective({
                    global: true,
                    idField: "title",
                })
                .instance();

            const value = "2001: A Space Odyssey";

            const relayId = node.toGlobalId(value);

            expect(node.fromGlobalId(relayId)).toMatchObject({ field: "title", value });
        });
    });
});
