import { Entity } from "../../../../../src/decorator/entity/Entity"
import { PrimaryGeneratedColumn } from "../../../../../src/decorator/columns/PrimaryGeneratedColumn"
import { Column } from "../../../../../src/decorator/columns/Column"
import { Generated } from "../../../../../src/decorator/Generated"

@Entity()
export class Question {
    @PrimaryGeneratedColumn("ulid")
    id: string

    @Column()
    @Generated("ulid")
    ulid: string
}
