/**
 * This file is part of the Sandy Andryanto Online Store Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.official@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

module.exports = {

  tableName: 'orders_details',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',

  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    order: {
      model: 'order'
    },
    inventory: {
      model: 'productinventory'
    },
    price: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    qty: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'int unsigned'
    },
    total: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
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
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt']);
  }

};

