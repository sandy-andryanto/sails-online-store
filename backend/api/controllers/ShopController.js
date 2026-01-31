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

    list: async function (req, res) {

        const now = new Date();
        const topProduct = await Product.find({ status: 1 }).limit(1).sort('totalRating desc')
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const total = await Product.count({ status: 1 });
        const offset = ((page-1)*limit)

        let orderBy = req.query.order || "id"
        let orderDir = req.query.dir || "desc"

        let filter = {
            status: 1,
            publishedAt: { '<=': now }
        }


        if(req.query.brand)
        {
            const brands = req.query.brand
            filter = {
                ...filter,
                brand: brands.split(",")
            }
        }

        if(req.query.category)
        {
            let products = [];
            const categoryParam = req.query.category;
            const categoryIds = categoryParam ? categoryParam.split(',').map(Number) : [];
            const categories = await Category.find({ id: categoryIds }).populate('products');
            categories.forEach(cat => { products.push(cat.id) });

            filter = {
                ...filter,
                id: products
            }

        }

        if(req.query.priceMin && req.query.priceMax)
        {
            const minPrice = parseFloat(req.query.priceMin);
            const maxPrice = parseFloat(req.query.priceMax);

            orderBy = "price";
            orderDir = "asc";

            filter = {
                ...filter,
                price: { '>=': minPrice, '<=': maxPrice }
            }

        }


        if(req.query.search)
        {
            const search = req.query.search
            filter = {
                ...filter,
                 or: [
                    { sku:   { contains: search } },
                    { name:  { contains: search } },
                    { description:  { contains: search } }
                ]
            }
        }

        const totalFiltered = await Product.count(filter);
        const getProducts = await Product.find(filter)
            .populate('brand')
            .populate('categories')
            .limit(limit)
            .skip(offset)
            .sort(`${orderBy} ${orderDir}`);

        const productMapped = (total, item, index) => {

            const totalProduct = total;
            const newest = Math.floor(Math.random() * totalProduct)
            const discount = Math.floor(Math.random() * totalProduct)
            const price = parseFloat(item.price);
            const priceOld = price + (price * 0.05);

            if(topProduct.length > 0){
                return {
                     ...item,
                    category: item.categories.map(cat => cat.name),
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index,
                    totalRating: Math.ceil(((parseFloat(item.totalRating) / parseFloat(topProduct[0].totalRating)) * 100) / 20)
                }
            }else{
                return {
                     ...item,
                    category: item.categories.map(cat => cat.name),
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index
                }
            }
        }


        const list = getProducts.map((item, index) => productMapped((getProducts.length + 1), item, index));

        const payload = {
            list: list,
            total_all: total,
            total_filtered: totalFiltered,
            limit: limit,
            page: page,
            order: orderBy,
            sort: orderDir
        }

        return res.json(payload);
    },

    filter: async function (req, res) {

        const now = new Date();
        const topProduct = await Product.find({ status: 1 }).limit(1).sort('totalRating desc');
        const categories =  await Category.find({ status: 1 }).sort(`name asc`).populate('products');
        const brands =  await Brand.find({ status: 1 }).sort(`name asc`).populate('products');
        const getTopSelling = await Product.find({ status: 1,  publishedAt: { '<=': now } })
            .populate('categories')
            .limit(6)
            .sort('totalOrder desc')

        const getProducts = await Product.find({ status: 1,  publishedAt: { '<=': now } }).populate('categories')
            .limit(3)
            .sort('id desc')

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

        const topSelling = getProducts.map((item, index) => productMapped((getTopSelling.length + 1), item, index));
        const highProduct = await Product.find({ status: 1,  publishedAt: { '<=': now } }).sort('price desc')

        const payload = {
            categories: categories,
            brands: brands,
            tops: topSelling,
            maxPrice: highProduct[0].price
        }

        return res.json(payload);
    },

}