/**
 * Describes all options for PrimaryGeneratedColumn decorator with numeric ulid strategy.
 */
export interface PrimaryGeneratedColumnULIDOptions {
    /**
     * Column name in the database.
     */
    name?: string

    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string

    /**
     * Name of the primary key constraint.
     */
    primaryKeyConstraintName?: string
}
