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

  tableName: 'products_inventories',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',

  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    product: {
      model: 'product'
    },
    size: {
      model: 'size'
    },
    colour: {
      model: 'colour'
    },
    stock: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'int unsigned'
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
    orderDetail: {
      collection: 'orderdetail',
      via: 'inventory'
    },
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt']);
  }

};

