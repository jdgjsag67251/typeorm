import { getMetadataArgsStorage } from "../globals"
import { GeneratedMetadataArgs } from "../metadata-args/GeneratedMetadataArgs"

/**
 * Marks a column to generate a value on entity insertion.
 * There are four types of generation strategy - increment, uuid, ulid and rowid (cockroachdb only).
 * Increment uses a number which increases by one on each insertion.
 * Uuid generates a special UUID token.
 * Ulid generates a special ULID token.
 * Rowid supports only in CockroachDB and uses `unique_rowid()` function
 *
 * Note, some databases do not support non-primary generation columns.
 */
export function Generated(
    strategy: "increment" | "uuid" | "ulid" | "rowid" = "increment",
): PropertyDecorator {
    return function (object: Object, propertyName: string) {
        getMetadataArgsStorage().generations.push({
            target: object.constructor,
            propertyName: propertyName,
            strategy: strategy,
        } as GeneratedMetadataArgs)
    }
}
