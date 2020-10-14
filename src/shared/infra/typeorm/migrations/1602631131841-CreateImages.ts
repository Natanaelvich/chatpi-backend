import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateImages1602631131841 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'path',
            type: 'varchar',
          },
          {
            name: 'orphanage_id',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_image_orphanage_id',
            referencedTableName: 'orphanages',
            referencedColumnNames: ['id'],
            columnNames: ['orphanage_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('images', 'fk_image_orphanage_id');
    await queryRunner.dropTable('images');
  }
}
