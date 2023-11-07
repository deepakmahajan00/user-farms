import { MigrationInterface, QueryRunner } from "typeorm"

export class  CreateTableAddress1698999720462 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "address" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
              "street" character varying NOT NULL, 
              "city" character varying NOT NULL,
              "country" character varying NOT NULL,
              "coordinateId" uuid NOT NULL,
              "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
              "updatedAt" TIMESTAMP DEFAULT now(), 
              CONSTRAINT "PK_ADDRESS_ID" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `ALTER TABLE "address" 
                ADD CONSTRAINT "FK_COORDINATE_ID" 
                FOREIGN KEY ("coordinateId") REFERENCES "coordinate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_COORDINATE_ID"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
