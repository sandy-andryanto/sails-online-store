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

    ping: async function (req, res) {
        return res.json({ status: true, message: 'Connected Established !!'});
    },

    component: async function (req, res) {

        const getSettings = await Setting.find();
        const categories = await Category.find({ status: 1 }).sort('name asc');
        const setting =  getSettings.reduce((obj, item) => {
            obj[item.keyName] = item.keyValue;
            return obj;
        }, {});

        const payload = {
            setting: setting,
            categories: categories
        }

        return res.json(payload);
    },

    page: async function (req, res) {

        const now = new Date();
        const categories = await Category.find({ status: 1, displayed: 1 }).limit(3).sort('name asc');
        const topProduct = await Product.find({ status: 1 }).limit(1).sort('totalRating desc');

        const getProducts = await Product.find({ status: 1,  publishedAt: { '<=': now } }).populate('categories')
            .limit(4)
            .sort('id desc')
        
        const getTopSelling = await Product.find({ status: 1,  publishedAt: { '<=': now } }).populate('categories')
            .limit(6)
            .sort('totalOrder desc')

        const getBestSellers = await Product.find({ status: 1,  publishedAt: { '<=': now } }).populate('categories')
            .limit(3)
            .sort('totalRating desc')

        const productMapped = (total, item, index) => {
            
            const totalProduct = total;
            const newest = Math.floor(Math.random() * totalProduct)
            const discount = Math.floor(Math.random() * totalProduct)
            const price = parseFloat(item.price);
            const priceOld = price + (price * 0.05);

            if(topProduct.length > 0){
                return {
                     ...item,
                    category: item.categories.map(cat => cat.name)[0],
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index,
                    totalRating: Math.ceil(((parseFloat(item.totalRating) / parseFloat(topProduct[0].totalRating)) * 100) / 20)
                }
            }else{
                return {
                     ...item,
                    category: item.categories.map(cat => cat.name)[0],
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index
                }
            }
        }

        const products = getProducts.map((item, index) => productMapped((getProducts.length + 1), item, index));
        const topSelling = getProducts.map((item, index) => productMapped((getTopSelling.length + 1), item, index));
        const bestSellers = getProducts.map((item, index) => productMapped((getBestSellers.length + 1), item, index));

        const payload = {
            categories: categories,
            produtcs: products,
            topSellings: topSelling,
            bestSellers: bestSellers
        }

        return res.json(payload);
    },

    send: async function (req, res) {
      
        if (!req.body.email) {
          return res.status(400).json({ message: 'The field email can not be empty!' });
        }

        await Newsletter.create({
            email: req.body.email,
            ipAddress: req.ip,
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return res.json({ message: "Your subscription request has been sent. Thank you!" });
    },

}