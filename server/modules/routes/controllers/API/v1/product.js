
    /**
     * product is an instance of the express router.
     * We use it to define our routes.
     * The router will be added as a middleware and will take control of requests starting with path /product.
     * @type {function}
     * @param {Server} server
     * @param collection
     * @return {Router} userRoutes
     */
    const route = (server, collection = "product") => {
        const routes = require("express").Router();
        // This will help to convert the id from string to ObjectId for the _id.
        const objectId = server.mongoDb.ObjectId;

// This section will help you get a list of all the records.
        //merge the same stocks
        this.list = function (req, res) {
            server.mongoConnection.collection(collection).aggregate(
                [{$unwind : "$stocks"},
                    {$group :
                            {
                                _id: "$_id",
                                name: {$first: "$name"},
                                life: {$first: "$life"},
                                category: {$first: "$category"},
                                price: {$last: "$price"},
                                quantity: {$sum: "$stocks.quantity"}
                            }
                    }
                ]
            ).toArray((err, items) => res.json(items));
        }.bind(this);

        this.listProductWithStock = function (req, res) {
            server.mongoConnection
                .collection(collection)
                .find({})
                .toArray((err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
        }.bind(this);

// This section will help you get a single record by id
        this.view = function (req, res) {
            let myQuery = {
                _id: new objectId(req.params.id)
            };
            server.mongoConnection
                .collection(collection)
                .findOne(myQuery, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
        }.bind(this);


        /**
         * This section will help you create a new record.
         */
        this.add = function (req, res) {
            let myObj = {
                name: req.body.name,
                category: req.body.category,
                life: Number(req.body.life),
                price: Number(req.body.price),
                stocks : []
            };

            server.mongoConnection
                .collection(collection)
                .insertOne(myObj, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
        }.bind(this);

// This section will help you update a record by id.
        this.update = function (req, res) {
            let myQuery = {_id: new objectId(req.params.id)};

            let newValues = {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    life: Number(req.body.life),
                    price: Number(req.body.price)
                },
            };
            server.mongoConnection
                .collection(collection)
                .updateOne(myQuery, newValues, (err, result) => {
                    if (err) throw err;
                    console.log(`1 ${collection} document updated`);
                    res.json(result);
                });
        }.bind(this);

// This section will help you delete a record
        this.delete = function (req, res) {
            let myQuery = {_id: new objectId(req.params.id)};

            server.mongoConnection
                .collection(collection)
                .deleteOne(myQuery, (err, result) => {
                    if (err) throw err;
                    console.log(`1 ${collection} document deleted`);
                    res.json(result);
                });
        }.bind(this);

// This section will help you add stock to the product
        this.addStock = function (req, res) {
            console.log(req.body)
            let myQuery = {_id: new objectId(req.body._id)};
            let myObj = {
                $addToSet: {
                    stocks: {
                        _id: new objectId(),
                        quantity: Number(req.body.quantity),
                        expiryDate: req.body.expiryDate
                    }
                }
            };

            server.mongoConnection
                .collection(collection)
                .updateOne(myQuery, myObj, (err, result) => {
                    if (err) throw err;
                    res.json(result);
                });
        }.bind(this);


        routes.get("/", this.listProductWithStock);
        routes.get("/:id", this.view);
        routes.post("/", this.add);
        routes.post("/stocks", this.addStock);
        routes.put("/:id", this.update);
        routes.delete("/:id", this.delete);

        return routes;
    };


module.exports = {
    name: "products",
    route: (server, collection) => route(server, collection)
};