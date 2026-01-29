/**
 * This file is part of the Sandy Andryanto Online Store Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

module.exports = {

  tableName: 'colours',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',

  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    code: {
      type: 'string',
      columnType: 'varchar(191)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    name: {
      type: 'string',
      columnType: 'varchar(255)',
      autoMigrations: { index: true },
      allowNull: false,
    },
    description: {
      type: 'string',
      columnType: 'text',
      allowNull: true,
    },
    status: {
      type: 'number',
      defaultsTo: 1,
      columnType: 'tinyint unsigned'
    },
    createdAt: {
      type: 'ref',
      required: true,
      columnName: 'created_at',
      columnType: 'datetime',
      autoMigrations: { index: true }
    },
    updatedAt: {
      type: 'ref',
      required: true,
      columnName: 'updated_at',
      columnType: 'datetime',
      autoMigrations: { index: true }
    },
    inventories: {
      collection: 'productinventory',
      via: 'colour'
    },
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt']);
  }

};

