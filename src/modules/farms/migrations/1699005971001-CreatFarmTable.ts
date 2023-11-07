import { MigrationInterface, QueryRunner } from "typeorm"

export class  CreatFarmTable1699005971001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "farm" (
              "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
              "name" varchar NOT NULL, 
              "size" float NOT NULL,
              "yield" float NOT NULL,
              "userId" uuid NOT NULL,
              "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
              "updatedAt" TIMESTAMP DEFAULT now(), 
              CONSTRAINT "PK_FARM_ID" PRIMARY KEY ("id")
            )`,
        );
        await queryRunner.query(
            `ALTER TABLE "farm"
                ADD CONSTRAINT "FK_FARM_USER_ID" 
                FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_FARM_USER_ID"`);
        await queryRunner.query(`DROP TABLE "farm"`);
    }

}
