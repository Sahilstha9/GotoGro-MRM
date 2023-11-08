
/**
 * product is an instance of the express router.
 * We use it to define our routes.
 * The router will be added as a middleware and will take control of requests starting with path /product.
 * @type {function}
 * @param {Server} server
 * @return {Router} userRoutes
 */
const route = (server) => {
    const routes = require("express").Router();
    // This will help to convert the id from string to ObjectId for the _id.
    const objectId = server.mongoDb.ObjectId;

    this.totalRevenuePerProduct = function (req, res) {
        let filter = {}
        // Filters product id in query, type = objectId
        if (req.query.product) filter["products.id"] = new objectId(req.query.product);

        // Filters member id in query, type = objectId
        if (req.query.member) filter["member_id"] = new objectId(req.query.member);

        // Filters sale records created after this time, type = timestamp
        if (req.query.after) filter["_id"] = {$gte: new objectId(Number(req.query.after) / 1000)};

        // Filters sale records created before this time, type = timestamp
        if (req.query.before) filter["_id"] = {$lte: new objectId(Number(req.query.before) / 1000)};

        server.mongoConnection.collection("sale").aggregate([
            {$match: filter},
            {$unwind: "$products"},
            {
                $lookup: {
                    from: "product",
                    localField: "products.id",
                    foreignField: "_id",
                    as: "products.id"
                }
            },
            {$unwind: "$products.id"},
            {
                $group: {
                    _id: "$products.id._id",
                    name: {$first: "$products.id.name"},
                    totalSold: {$sum: {$multiply: ["$products.qty", "$products.id.price"]}},
                    saleQuantity: {$sum: "$products.qty"}
                }
            }
        ]).toArray((err, items) => res.json(items))
    }.bind(this);
   

   

    


    routes.get("/totalRevenuePerProduct", this.totalRevenuePerProduct)
    
    return routes;  
};


module.exports = {
    name: "reports",
    route: (server) => route(server)
};