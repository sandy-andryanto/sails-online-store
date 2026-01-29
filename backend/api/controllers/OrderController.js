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

    list: async function (req, res) {

        let user = req.user
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;
        let total = await Order.count({ user: user.id });
        let offset = ((page-1)*limit)
        let sort = req.query.order || "id"
        let orderDir = req.query.dir || "desc"
        let filter = { user: user.id  }

        if(req.query.search)
        {   
            const search = req.query.search
            filter = {
                ...filter,
                 or: [
                    { invoiceNumber:   { contains: search } }
                ]
            }
        }

        let list = await Order.find(filter)
            .limit(limit)
            .skip(offset)
            .sort(`${sort} ${orderDir}`);

        const payload = {
            list: list,
            total_all: total,
            total_filtered: list.length,
            limit: limit
        }

        return res.json(payload);
        
    },

    view: async function (req, res) {

        const id = req.param('id');
        const user = req.user;
        const order = await Order.findOne({user: user.id, id: id}).populate('payment')
       

        if(order === undefined)
        {
            return res.status(400).json({ message: `These current order do not match our records.` });
        }

        const payments = await Payment.find({ status: 1 })
        const billing = await OrderBilling.find({ order: id })
        const cart = await sails.sendNativeQuery(`
            SELECT 
                p.id,
                p.image,
                p.name,
                o.price,
                o.qty,
                o.total
            FROM orders_details o
            INNER JOIN products_inventories inv ON inv.id = o.inventory
            INNER JOIN products p ON p.id = inv.product
            WHERE o.order = ${order.id}
            GROUP BY p.id, p.image, p.name, o.price, o.qty, o.total
        `);

        const payloadBilling =  billing.reduce((obj, item) => {
            obj[item.name] = item.description;
            return obj;
        }, {});

        const payload = {
            cart: cart.rows,
            order: order,
            billing: payloadBilling,
            payments: payments,
            user: user
        };

        return res.json(payload);
    },

    billing: async function (req, res) {

       
        const user = req.user;
        const order = await Order.findOne({user: user.id, status: 0});

        if(order === undefined)
        {
            return res.status(400).json({ message: `These current order do not match our records.` });
        }

        const payments = await Payment.find({ status: 1 })
        const cart = await sails.sendNativeQuery(`
            SELECT 
                p.id,
                p.image,
                p.name,
                o.price,
                o.qty,
                o.total
            FROM orders_details o
            INNER JOIN products_inventories inv ON inv.id = o.inventory
            INNER JOIN products p ON p.id = inv.product
            WHERE o.order = ${order.id}
            GROUP BY p.id, p.image, p.name, o.price, o.qty, o.total
        `);

        const payload = {
            cart: cart.rows,
            order: order,
            payments: payments,
            user: user
        };

        return res.json(payload);
    },

    product: async function (req, res) {

        const user = req.user
        const order = await Order.findOne({user: user.id, status: 0});
        const orderId = order === undefined ? 0 : order.id;
        const cart = await sails.sendNativeQuery(`
            SELECT 
                p.id,
                p.image,
                p.name,
                o.price,
                o.qty,
                o.total
            FROM orders_details o
            INNER JOIN products_inventories inv ON inv.id = o.inventory
            INNER JOIN products p ON p.id = inv.product
            WHERE o.order = ${orderId}
            GROUP BY p.id, p.image, p.name, o.price, o.qty, o.total
        `);

        const wishlist = await User.findOne({ id: user.id }).populate('products');
        const payload = {
            order: order,
            cart: cart.rows,
            wishlist: wishlist.products
        };
        return res.json(payload);
    },

    listReview: async function (req, res) {

        const id = req.param('id');
        const payload = await sails.sendNativeQuery(`
          SELECT
            CONCAT( u.first_name, ' ', u.last_name ) reviewer,
            CEIL((
                p.rating / ( SELECT COALESCE ( MAX( sub.rating ), p.rating ) FROM products_reviews sub WHERE sub.product = ${id} ) 
                ) * 100 
            ) percentage,
            CEIL((
                ((
                    p.rating / ( SELECT COALESCE ( MAX( sub.rating ), p.rating ) FROM products_reviews sub WHERE sub.product = ${id} ) 
                    ) * 100 
                ) 
                )/ 20 
            ) rating_index,
            p.rating,
            p.review,
            p.created_at 
            FROM
            products_reviews p
            INNER JOIN users u ON u.id = p.user 
            WHERE
            p.product = ${id}
            ORDER BY p.id DESC
        `);
        return res.json(payload.rows);
    },

   
    add: async function (req, res) {

        const user = req.user
        const product = req.param('id');
        const size = req.body.size;
        const colour = req.body.colour;
        const today = new Date();
        const ymd = today.getFullYear().toString()
           + String(today.getMonth() + 1).padStart(2, '0')
           + String(today.getDate()).padStart(2, '0');

        const index = Math.floor(Math.random() * 1001);
        const inventoryQuery = await ProductInventory.find({ product: product, size: size,  colour: colour })
        const inventory = inventoryQuery[0]

        let order = await Order.findOne({ status: 0, user: user.id })
    
        if(order === undefined)
        {
            order = await Order.create({
                user: user.id,
                invoiceNumber: `${ymd}${index}`,
                invoiceDate: new Date(),
                status: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }).fetch()
        }
        
        const orderDetail = await OrderDetail.findOne({ order: order.id, inventory: inventory.id })
        const productModel = await Product.findOne({ id: product })

        if(orderDetail === undefined)
        {
            await OrderDetail.create({
                order: order.id,
                inventory: inventory.id,
                price: productModel.price,
                qty: req.body.qty,
                total: (req.body.qty * productModel.price),
                status: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
        else
        {
            const newQty = orderDetail.qty + req.body.qty
            await Authentication.updateOne({ 
                id: orderDetail.id
             }).set({  
                price: productModel.price,
                qty: newQty,
                total: (newQty * productModel.price),
                updatedAt: new Date(),
            })
        }

        const orderCart = await OrderCart.findOne({ order: order.id, product: product })

        if(orderCart === undefined){
            await OrderCart.create({
                order: order.id, 
                product: product 
            })
        }

        const bills = await OrderDetail.find({ order: order.id })
        
        let totalItem = parseInt(0)
        let subtotal = parseFloat(0)
        let taxes = parseFloat(0)
        let discount = parseFloat(0)
        let shipment = parseFloat(0)

        for (const bill of bills) {
            totalItem = parseInt(totalItem) + parseInt(bill.qty);
            subtotal = parseFloat(subtotal) + parseFloat(bill.total);
        }

        const discountSetting = await Setting.findOne({ keyName: 'discountValue' })
        const taxesSettng = await Setting.findOne({ keyName: 'taxesValue' })
        const shipmentSetting = await Setting.findOne({ keyName: 'totalShipment' })

        if(discountSetting !== undefined){
            discount = subtotal * (parseFloat(discountSetting.keyValue) / 100)
        }

        if(taxesSettng !== undefined){
            taxes = subtotal * (parseFloat(taxesSettng.keyValue) / 100)
        }

        if(shipmentSetting !== undefined){
            shipment = parseFloat(shipmentSetting.keyValue)
        }

        const totalPaid = (subtotal + taxes + shipment) - discount;

        await Order.updateOne({ 
            id: order.id
        }).set({  
            totalItem: totalItem,
            subtotal: subtotal,
            totalDiscount: discount,
            totalTaxes: taxes,
            totalShipment: shipment,
            totalPaid: totalPaid,
            updatedAt: new Date(),
        })

        await Activity.create({
            user: user.id,
            event: "Add Cart",
            subject: "Add Product To Cart",
            description: "Your has been added product to cart.",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.json({ message: "Your cart has been added." });
    },

    wishlist: async function (req, res) {
        
        const user = req.user
        const product = req.param('id');
        const wishlist = await ProductWhishlist.findOne({ user: user.id, product: product })

        if(wishlist === undefined)
        {
            await ProductWhishlist.create({
                user: user.id, 
                product: product
            })
        }

        await Activity.create({
            user: user.id,
            event: "Add Wishlist",
            subject: "Add Product To Wishlist",
            description: "Your has been added product to your wishlist.",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.json({ message: "Your product has been added to wishlist." });

    },

    detail: async function (req, res) {

        const user = req.user;
        const id = req.param('id');
        const order = await Order.findOne({ id: id, user: user.id })
        const details = await OrderDetail.find({ order: id });
        const payments = await Payment.find({ status: 1 }).sort('name asc');

        const payload = {
            order: order,
            details: details,
            payments: payments
        };

        return res.json(payload);
    },  

    cancel: async function (req, res) {

        const user = req.user;
        const id = req.param('id');
        await OrderDetail.destroy({ order: id });
        await OrderCart.destroy({ order: id });
        await OrderBilling.destroy({ order: id });
        await Order.destroy({ id: id });

        await Activity.create({
            user: user.id,
            event: "Cancel Order",
            subject: "Canceling Current Order",
            description: "Your has been canceling current order.",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.json({ message: "Your order has been removed." });
    },

    review: async function (req, res) {

        const user = req.user;
        const product = req.param('id');
        const rating = req.body.rating;
        const review = req.body.review;
        const productModel = await Product.findOne({ id: product })
        
        await ProductReview.create({
            user: user.id,
            product: product,
            rating: rating,
            review: review,
            status: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await Activity.create({
            user: user.id,
            event: `Create new review`,
            subject: `Add review to ${productModel.name}`,
            description: `Your has been added new review to ${productModel.name} .`,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.json({ message: "Your reivew has been added." });

    },

    checkout: async function (req, res) {

        const user = req.user;
        const id = req.param('id');
        // Update order
        await Order.updateOne({ 
            id: id,
            user: user.id
        }).set({  
            payment: req.body.payment,
            status: 1, 
            updatedAt: new Date()
        })

        // Create billing
        const billing = await OrderBilling.find({ order: id })

        if(billing.length === 0)
        {
            const inputBilling = req.body.billing;
            for (const [key, value] of Object.entries(inputBilling)) {
                await OrderBilling.create({
                    order: id,
                    name: key,
                    description: value,
                    status: 1, 
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            }
        }

        // Update Inventories, Product, Whislist
        const details = await OrderDetail.find({ order: id })

        for (const detail of details) {

            // update inventory
            const inv_id = detail.inventory;
            const inv = await ProductInventory.findOne({ id: inv_id });
            const newStock = inv.stock - detail.qty;
            await ProductInventory.updateOne({ id: inv_id }).set({ stock: newStock, status: 1, updatedAt: new Date() });

            // update product
            const product_id = inv.product;
            const product = await Product.findOne({ id: product_id });
            const newTotalOrder = product.totalOrder + detail.qty;
            await Product.updateOne({ id: product_id }).set({ totalOrder: newTotalOrder, status: 1, updatedAt: new Date() });
            await ProductWhishlist.destroy({ product: product_id, user: user.id });
        }

         await Activity.create({
            user: user.id,
            event: "Checkout Order",
            subject: "Completed Checkout Current Order",
            description: "Your order has been finished.",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return res.json({ message: 'Your order has been completed.' });
    },

    cart: async function (req, res) {
        
        const now = new Date();
        const id = req.param('id');
        const product  = await Product.find({ id: id }).populate('categories')
        const images = await ProductImage.find({ product: id }).sort('sort asc')
       

        const sizes = await sails.sendNativeQuery(`
            SELECT s.id, s.name
            FROM sizes s
            INNER JOIN products_inventories p ON p.size = s.id
            WHERE p.stock > 0 AND p.product = ${id}
            GROUP BY s.id, s.name
            ORDER BY s.id, s.name
        `);

       const colours = await sails.sendNativeQuery(`
            SELECT c.id, c.name
            FROM colours c
            INNER JOIN products_inventories p ON p.colour = c.id
            WHERE p.stock > 0 AND p.product = ${id}
            GROUP BY c.id, c.name
            ORDER BY c.id, c.name
        `);

        const stocks = await ProductInventory.find({ product: id })
        const topProduct = await Product.find({ status: 1 }).limit(1).sort('totalRating desc');

        const related = await Product.find({ status: 1, id: { '!=' : id }, publishedAt: { '<=': now } })
            .populate('categories')
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
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index,
                    totalRating: Math.ceil(((parseFloat(item.totalRating) / parseFloat(topProduct[0].totalRating)) * 100) / 20)
                }
            }else{
                return {
                     ...item,
                    priceOld: priceOld,
                    newest: newest === index,
                    discount: discount === index
                }
            }
        }

        const productRelated = related.map((item, index) => productMapped((related.length + 1), item, index));
        const productPayload = product.map((item, index) => productMapped(1, item, index));

        const payload = {
            product: productPayload[0],
            images: images,
            related: productRelated,
            sizes: sizes.rows,
            colours: colours.rows,
            stocks: stocks
        }

        return res.json(payload);
    },


}