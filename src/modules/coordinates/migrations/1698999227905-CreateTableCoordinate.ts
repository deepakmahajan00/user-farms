import { MigrationInterface, QueryRunner } from "typeorm"

export class  CreateTableCoordinate1698999227905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "coordinate" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "latitude" character varying NOT NULL, 
                "longitude" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP DEFAULT now(), 
                CONSTRAINT "PK_COORDINATE_ID" PRIMARY KEY ("id")
              )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "coordinate"`);
    }
}
