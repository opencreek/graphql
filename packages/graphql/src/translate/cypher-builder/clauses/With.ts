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

import type { CypherEnvironment } from "../Environment";
import { Projection, ProjectionColumn } from "../sub-clauses/Projection";
import { compileCypherIfExists } from "../utils/utils";
import { Clause } from "./Clause";
import { WithOrder } from "./mixins/WithOrder";
import { WithReturn } from "./mixins/WithReturn";
import { applyMixins } from "./utils/apply-mixin";

export class With extends Clause {
    private projection: Projection;

    constructor(...columns: Array<"*" | ProjectionColumn>) {
        super();
        this.projection = new Projection(columns);
    }

    public addColumns(...columns: Array<"*" | ProjectionColumn>): void {
        this.projection.addColumns(columns);
    }

    public getCypher(env: CypherEnvironment): string {
        const projectionStr = this.projection.getCypher(env);
        const orderByStr = compileCypherIfExists(this.orderByStatement, env, { prefix: "\n" });
        const returnStr = compileCypherIfExists(this.returnStatement, env, { prefix: "\n" });

        return `WITH ${projectionStr}${orderByStr}${returnStr}`;
    }
}

export interface With extends WithOrder, WithReturn {}

applyMixins(With, [WithOrder, WithReturn]);
