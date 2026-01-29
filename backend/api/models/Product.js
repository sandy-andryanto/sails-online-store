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

  tableName: 'products',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',

  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    brand: {
      model: 'brand'
    },
    image: {
      type: 'string',
      columnType: 'varchar(255)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    sku: {
      type: 'string',
      columnType: 'varchar(45)',
      autoMigrations: { index: true },
      allowNull: false,
    },
    name: {
      type: 'string',
      columnType: 'varchar(255)',
      autoMigrations: { index: true },
      allowNull: false,
    },
    price: {
      type: 'number',
      defaultsTo: 0,
      columnType: 'decimal(18,4)'
    },
    totalOrder: {
      type: 'number',
      columnName: 'total_order',
      defaultsTo: 0,
      columnType: 'int unsigned'
    },
    totalRating: {
      type: 'number',
      columnName: 'total_rating',
      defaultsTo: 0,
      columnType: 'int unsigned'
    },
    details: {
      type: 'string',
      columnType: 'longtext',
      allowNull: true,
    },
    description: {
      type: 'string',
      columnType: 'longtext',
      allowNull: true,
    },
    status: {
      type: 'number',
      defaultsTo: 1,
      columnType: 'tinyint unsigned'
    },
    publishedAt: {
      type: 'ref',
      required: false,
      columnName: 'published_at',
      columnType: 'datetime',
      autoMigrations: { index: true }
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
    images: {
      collection: 'productimage',
      via: 'product'
    },
    productInventory: {
      collection: 'productinventory',
      via: 'product'
    },
    reviews: {
      collection: 'productreview',
      via: 'product'
    },
    categories: {
      collection: 'category',
      via: 'product',
      through: 'productcategory'
    },
    users: {
      collection: 'user',
      via: 'product',
      through: 'productwhishlist'
    },
    orders: {
      collection: 'order',
      via: 'product',
      through: 'ordercart'
    }
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt']);
  }

};

