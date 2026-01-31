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
  tableName: 'products_wishlists',
  migrate: process.env.MIGRATION_STRATEGY || 'safe',
  attributes: {
    id : {
      type: 'number',
      columnType: 'bigint unsigned',
      autoIncrement: true
    },
    product: {
      model: 'product',
      required: true
    },
    user: {
      model: 'user',
      required: true
    }
  }
};
