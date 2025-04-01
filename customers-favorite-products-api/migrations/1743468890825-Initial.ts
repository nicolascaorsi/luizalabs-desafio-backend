import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1743468890825 implements MigrationInterface {
  name = 'Initial1743468890825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."PRODUCTS_EXTERNAL_ID"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "externalId"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES_PRODUCT"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "PK_PRODUCTS"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "PK_PRODUCTS" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES" PRIMARY KEY ("customerId")
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP COLUMN "productId"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD "productId" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES" PRIMARY KEY ("customerId", "productId")
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES_PRODUCT" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES_PRODUCT"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES" PRIMARY KEY ("customerId")
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP COLUMN "productId"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD "productId" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites" DROP CONSTRAINT "PK_CUSTOMERS_FAVORITES"
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES" PRIMARY KEY ("customerId", "productId")
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP CONSTRAINT "PK_PRODUCTS"
        `);
    await queryRunner.query(`
            ALTER TABLE "products" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "id" SERIAL NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD CONSTRAINT "PK_PRODUCTS" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "customers_favorites"
            ADD CONSTRAINT "PK_CUSTOMERS_FAVORITES_PRODUCT" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "products"
            ADD "externalId" character varying NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "PRODUCTS_EXTERNAL_ID" ON "products" ("externalId")
        `);
  }
}
