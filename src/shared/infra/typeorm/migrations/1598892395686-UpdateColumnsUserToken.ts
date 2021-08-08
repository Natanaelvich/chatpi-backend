import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateColumnsUserToken1598892395686
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user_tokens',
      new TableColumn({
        name: 'resfresh_token',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'user_tokens',
      new TableColumn({
        name: 'expires_date',
        type: 'date',
        isNullable: true,
      }),
    );
    await queryRunner.dropColumn('user_tokens', 'token');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_tokens', 'resfresh_token');
    await queryRunner.dropColumn('user_tokens', 'expires_date');
    await queryRunner.addColumn(
      'user_tokens',
      new TableColumn({
        name: 'token',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
