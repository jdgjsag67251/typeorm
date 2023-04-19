import "reflect-metadata"
import { expect } from "chai"
import { ulid } from "ulid"
import { DataSource } from "../../../../src/data-source/DataSource"
import {
    closeTestingConnections,
    createTestingConnections,
    reloadTestingDatabases,
} from "../../../utils/test-utils"
import { Post } from "./entity/Post"
import { Question } from "./entity/Question"

describe.only("ulid-mysql", () => {
    let connections: DataSource[]
    before(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["mysql"],
        })
    })
    beforeEach(() => reloadTestingDatabases(connections))
    after(() => closeTestingConnections(connections))

    it("should persist ulid correctly when it is generated non primary column", () =>
        Promise.all(
            connections.map(async (connection) => {
                const postRepository = connection.getRepository(Post)
                const questionRepository = connection.getRepository(Question)
                const queryRunner = connection.createQueryRunner()
                const postTable = await queryRunner.getTable("post")
                const questionTable = await queryRunner.getTable("question")
                await queryRunner.release()

                const post = new Post()
                await postRepository.save(post)
                const loadedPost = await postRepository.findOneBy({ id: 1 })
                expect(loadedPost!.ulid).to.be.exist
                postTable!
                    .findColumnByName("ulid")!
                    .type.should.be.equal("varchar")

                const post2 = new Post()
                const generatedUlid = ulid()
                post2.ulid = generatedUlid
                await postRepository.save(post2)
                const loadedPost2 = await postRepository.findOneBy({ id: 2 })
                expect(loadedPost2!.ulid).to.equal(generatedUlid)

                const question = new Question()
                question.ulid = generatedUlid
                const savedQuestion = await questionRepository.save(question)
                const loadedQuestion = await questionRepository.findOne({
                    where: {
                        id: savedQuestion.id,
                    },
                })
                expect(loadedQuestion!.id).to.be.exist
                expect(loadedQuestion!.ulid).to.be.exist
                expect(loadedQuestion!.ulid).to.equal(generatedUlid)
                questionTable!
                    .findColumnByName("id")!
                    .type.should.be.equal("varchar")
                questionTable!
                    .findColumnByName("ulid")!
                    .type.should.be.equal("varchar")

                const question2 = new Question()
                const idUlid = ulid()
                const ulidUlid = ulid()
                question2.id = idUlid
                question2.ulid = ulidUlid
                await questionRepository.save(question2)
                const loadedQuestion2 = await questionRepository.findOne({
                    where: {
                        id: idUlid,
                    },
                })
                expect(loadedQuestion2!.id).to.equal(idUlid)
                expect(loadedQuestion2!.ulid).to.equal(ulidUlid)
            }),
        ))

    it("should set generated ulid in the model after save", () =>
        Promise.all(
            connections.map(async (connection) => {
                const question = new Question()
                question.ulid = ulid()
                await connection.manager.save(question)
                expect(question!.id).to.exist
                expect(question!.ulid).to.exist
                expect(question!.ulid).to.exist
            }),
        ))
})
