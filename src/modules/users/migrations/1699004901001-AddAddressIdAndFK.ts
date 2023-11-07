import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressIdAndFK1699004901001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `ALTER TABLE "user"
            ADD COLUMN "addressId" uuid NOT NULL,
            ADD CONSTRAINT "FK_USER_ADDRESS_ID" 
            FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_USER_ADDRESS_ID"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressId"`);
  }
}
