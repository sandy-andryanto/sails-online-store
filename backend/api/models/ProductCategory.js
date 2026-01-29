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
  tableName: 'products_categories',
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
    category: {
      model: 'category',
      required: true
    }
  }
};
