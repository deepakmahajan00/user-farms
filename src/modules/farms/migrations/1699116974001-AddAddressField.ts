import { MigrationInterface, QueryRunner } from "typeorm"

export class  AddAddressField1699116974001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "farm"
                ADD COLUMN "addressId" uuid NOT NULL,
                ADD CONSTRAINT "FK_FARM_ADDRESS_ID" 
                FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP CONSTRAINT "FK_FARM_ADDRESS_ID"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "addressId"`);
    }
}
