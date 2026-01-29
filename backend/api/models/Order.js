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

  tableName: 'orders',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',

  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    user: {
      model: 'user'
    },
    payment: {
      model: 'payment'
    },
    invoiceNumber: {
      columnName: 'invoice_number',
      type: 'string',
      columnType: 'varchar(100)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    invoiceDate: {
      columnName: 'invoice_date',
      type: 'ref',
      columnType: 'datetime',
      autoMigrations: { index: true }
    },
    totalItem: {
      type: 'number',
      columnName: 'total_item',
      defaultsTo: 0,
      columnType: 'int unsigned'
    },
    subtotal: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    totalDiscount: {
      type: 'number',
      columnName: 'total_discount',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    totalTaxes: {
      type: 'number',
      columnName: 'total_taxes',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    totalShipment: {
      type: 'number',
      columnName: 'total_shipment',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    totalPaid: {
      type: 'number',
      columnName: 'total_paid',
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
    billings: {
      collection: 'orderbilling',
      via: 'order'
    },
    orderDetail: {
      collection: 'orderdetail',
      via: 'order'
    },
    products: {
      collection: 'product',
      via: 'order',
      through: 'ordercart'
    }
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt']);
  }

};

