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

import type { CypherASTNode } from "../CypherASTNode";
import type { CypherEnvironment } from "../Environment";
import type { PropertyRef } from "../PropertyRef";
import { SubClause } from "./SubClause";

// TODO: Remove label
export type RemoveInput = Array<PropertyRef>;

export class RemoveClause extends SubClause {
    private removeInput: RemoveInput;

    constructor(parent: CypherASTNode | undefined, removeInput: RemoveInput) {
        super(parent);
        this.removeInput = removeInput;
    }

    public getCypher(env: CypherEnvironment): string {
        const propertiesToDelete = this.removeInput.map((e) => e.getCypher(env));
        return `REMOVE ${propertiesToDelete.join(",")}`;
    }
}
