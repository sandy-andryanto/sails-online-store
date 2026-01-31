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

const plainPassword = 'Qwerty123!';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');


async function createUser(){

  const total = await User.count();

  if(total === 0)
  {
    const max = 10;

    for(let i = 1; i <= max; i++)
    {
      let token = faker.string.uuid();
      let genderName = faker.person.sex().toLowerCase();
      let firstName = faker.person.firstName({ sex: genderName });

      let userData = {
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        password: bcrypt.hashSync(plainPassword, 10),
        firstName: firstName,
        lastName: faker.person.lastName(),
        gender: genderName === 'male' ? 'M' : 'F',
        country: faker.location.country(),
        address: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        status: 1,
        city: faker.location.city(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let user = await User.create(userData).fetch();

      await Authentication.create({
        user: user.id,
        type: 'email',
        credential: userData.email,
        token: token,
        status: 2,
        expiredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    }

  }

}

async function createSetting(){

  const total = await Setting.count();

  if(total === 0)
  {
    const settings = [
      { key: 'aboutSection', value: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.' },
      { key: 'comLocation', value: 'West Java, Indonesia' },
      { key: 'comPhone', value: '+62-898-921-8470' },
      { key: 'comEmail', value: 'sandy.andryanto.official@gmail.com' },
      { key: 'comCurrency', value: 'USD' },
      { key: 'installed', value: 1 },
      { key: 'discountActive', value: 1 },
      { key: 'discountValue', value: 5 },
      { key: 'discountStart', value: new Date().toISOString() },
      { key: 'discountEnd', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { key: 'taxesValue', value: 10 },
      { key: 'totalShipment', value: 50 }
    ];

    for (const setting of settings) {
      await Setting.create({
        keyName: setting.key,
        keyValue: setting.value,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

  }

}

async function createCategories(){

  const total = await Category.count();

  if(total === 0)
  {
    const categories = [
      {
        'name':'Laptop',
        'image':'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product01.png',
        'displayed': 1,
      },
      {
        'name':'Smartphone',
        'image':'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product02.png',
        'displayed': 1,
      },
      {
        'name':'Camera',
        'image':'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product03.png',
        'displayed': 1,
      },
      {
        'name':'Accessories',
        'image':'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product04.png',
        'displayed': 0,
      },
      {
        'name':'Others',
        'image':'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product05.png',
        'displayed': 0,
      }
    ];

    for (const category of categories) {
      await Category.create({
        displayed: category.displayed,
        name: category.name,
        image: category.image,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

  }

}


async function createBrands(){

  const total = await Brand.count();

  if(total === 0)
  {
    const brands = ['Samsung', 'LG', 'Sony', 'Apple', 'Microsoft'];
    for (const brand of brands) {
      await Brand.create({
        name: brand,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

}


async function createColours(){

  const total = await Colour.count();

  if(total === 0)
  {
    const colors = [
      { name: 'Red', value: '#FF0000' },
      { name: 'Blue', value: '#0000FF' },
      { name: 'Yellow', value: '#FFFF00' },
      { name: 'Black', value: '#000000' },
      { name: 'White', value: '#FFFFFF' },
      { name: 'Dark Gray', value: '#666' },
      { name: 'Light Gray', value: '#AAA' }
    ];

    for (const color of colors) {
      await Colour.create({
        name: color.name,
        code: color.value,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

  }

}


async function createPayment(){

  const total = await Payment.count();

  if(total === 0)
  {
    const payments = ['Direct Bank Transfer', 'Cheque Payment', 'Paypal System'];
    for (const payment of payments) {
      await Payment.create({
        name: payment,
        description: faker.lorem.paragraphs(3),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

}


async function createSize(){

  const total = await Size.count();

  if(total === 0)
  {
    const sizes = ['11 to 12 Inches', '13 to 14 Inches', '15 to 16 Inches', '17 to 18 Inches'];
    for (const size of sizes) {
      await Size.create({
        name: size,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

}


async function createProduct(){

  const total = await Product.count();

  if(total === 0)
  {
    const colours = await Colour.find();
    const sizes = await Size.find();

    const images = [
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product01.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product02.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product03.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product04.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product05.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product06.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product07.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product08.png',
      'https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product09.png'
    ];

    for (const [index] of images.entries()) {

      let imageProduct = images[Math.floor(Math.random() * images.length)];
      let categoryQuery = await Category.find();
      let categories = categoryQuery.sort(() => Math.random() - 0.5).slice(0, 3);
      let userQuery = await User.find();
      let reviewers = userQuery.sort(() => Math.random() - 0.5).slice(0, 3);
      let brandQuery = await Category.find();
      let brand = brandQuery.sort(() => Math.random() - 0.5).slice(0, 3);
      let num = index + 1;
      let totalOrder = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      let price = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      let totalRating = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      let rating = Math.floor(Math.random() * 101);

      let productData = {
        brand: brand[0].id,
        image: imageProduct,
        sku: `P00${num}`,
        name: `Product ${num}`,
        price: price,
        totalOrder: totalOrder,
        totalRating: totalRating,
        details: faker.lorem.paragraphs(3),
        description: faker.lorem.paragraphs(3),
        status: 1,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      let product = await Product.create(productData).fetch();

      for(const category of categories){
        await ProductCategory.create({
          category: category.id,
          product: product.id
        });
      }

      for (const reviewer of reviewers) {
        await ProductReview.create({
          product: product.id,
          user: reviewer.id,
          rating: rating,
          review: faker.lorem.paragraphs(1),
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      for(let i = 0; i < 3; i++){
        let image = Math.floor(Math.random() * 9);
        let path = images[image];
        await ProductImage.create({
          product: product.id,
          path: path,
          sort: (i + 1),
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      for(const colour of colours)
      {
        for(const size of sizes)
        {
          let stock = Math.floor(Math.random() * 51);
          await ProductInventory.create({
            product: product.id,
            size: size.id,
            colour: colour.id,
            stock: stock,
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

    }


  }

}


module.exports.bootstrap = async function(done) {
  await createUser();
  await createSetting();
  await createCategories();
  await createBrands();
  await createColours();
  await createPayment();
  await createSize();
  await createProduct();
  require('dotenv').config();
  return done();
};
