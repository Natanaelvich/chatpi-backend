import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class FixRefreshTokenNameColumn1598892395786
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_tokens',
      'resfresh_token',
      new TableColumn({
        name: 'refresh_token',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user_tokens',
      'refresh_token',
      new TableColumn({
        name: 'resfresh_token',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
