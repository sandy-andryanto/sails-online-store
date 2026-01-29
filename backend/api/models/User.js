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

  tableName: 'users',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',
  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      columnType: 'varchar(180)',
      autoMigrations: { index: true }
    },
    phone: {
      type: 'string',
      required: false,
      unique: true,
      columnType: 'varchar(180)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    password: {
      type: 'string',
      required: true,
      autoMigrations: { index: true }
    },
    image: {
      type: 'string',
      columnType: 'varchar(255)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    firstName: {
      type: 'string',
      columnName: 'first_name',
      columnType: 'varchar(64)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    lastName: {
      type: 'string',
      columnName: 'last_name',
      columnType: 'varchar(64)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    gender: {
      type: 'string',
      columnType: 'varchar(2)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    country: {
      type: 'string',
      columnType: 'varchar(180)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    city: {
      type: 'string',
      columnType: 'varchar(180)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    status: {
      type: 'number',
      defaultsTo: 1,
      columnType: 'tinyint unsigned'
    },
    zipCode: {
      columnName: 'zip_code',
      type: 'string',
      columnType: 'varchar(100)',
      autoMigrations: { index: true },
      allowNull: true,
    },
    address: {
      type: 'string',
      columnType: 'text',
      allowNull: true,
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
    // Relations
    activities: {
      collection: 'activity',
      via: 'user'
    },
    authentications: {
      collection: 'authentication',
      via: 'user'
    },
    reviews: {
      collection: 'productreview',
      via: 'user'
    },
    orders: {
      collection: 'order',
      via: 'user'
    },
    products: {
      collection: 'product',
      via: 'user',
      through: 'productwhishlist'
    }
  },

  customToJSON: function() {
    return _.omit(this, ['createdAt', 'updatedAt', 'password']);
  }

};

