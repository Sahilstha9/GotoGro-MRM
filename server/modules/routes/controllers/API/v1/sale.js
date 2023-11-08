
    /**
     * sale is an instance of the express router.
     * We use it to define our routes.
     * The router will be added as a middleware and will take control of requests starting with path /sale.
     * @type {function}
     * @param {Server} server
     * @param {string} collection
     * @return {Router} userRoutes
     */
    const route = (server, collection = "sale") => {
        const routes = require("express").Router();
        // This will help to convert the id from string to ObjectId for the _id.
        const objectId = server.mongoDb.ObjectId;

// This section will help you get a list of all the records.
        /*  this.list = function (req, res) {
              server.mongoConnection
                  .collection(collection)
                  .find({})
                  .toArray((err, result) => {
                      if (err) throw err;
                      res.json(result);
                  });
          }.bind(this);
  */
        /**
         * Joins the sale collection with member and product
         * @type {any}
         */
        this.list = function (req, res) {
            let filter = {}
            // Filters product id in query, type = objectId
            if (req.query.product) filter["products.id"] = new objectId(req.query.product);

            // Filters member id in query, type = objectId
            if (req.query.member) filter["member_id"] = new objectId(req.query.member);

            // Filters sale records created after this time, type = timestamp
            if (req.query.after) filter["_id"] = {$gte: new objectId(Number(req.query.after) / 1000)};

            // Filters sale records created before this time, type = timestamp
            if (req.query.before) filter["_id"] = {$lte: new objectId(Number(req.query.before) / 1000)};

            //req.query.member;
            server.mongoConnection.collection("sale").aggregate([
                { $match: filter  },
                { "$unwind": "$products" },
                {
                    $lookup:
                        {
                            from: "member",
                            localField: "member_id",
                            foreignField: "_id",
                            as: "member"
                        }
                },
                {
                    $lookup:
                        {
                            from: "product",
                            localField: "products.id",
                            foreignField: "_id",
                            as: "products.data"
                        },
                },
                {
                    $unwind: "$products.data"
                },
                {
                    $unwind: "$member"
                },
                {
                    $replaceWith:
                        {
                            $setField:
                                {
                                    field: "products",
                                    input: "$$ROOT",
                                    value: {
                                                        "_id": "$products.id",
                                                        "qty": "$products.qty",
                                                        "name": "$products.data.name",
                                                        "category": "$products.data.category",
                                                        "price": "$products.data.price"
                                    }
                                }
                        }
                },
                {
                    $addFields:
                        {
                            total: {$sum:  { $multiply: ["$products.price", "$products.qty"]} }
                        }
                },
                {
                    $group: {
                        _id: "$_id",
                        products: { $push: "$$CURRENT.products"  },
                        member: { $first: "$$CURRENT.member" },
                        total: { $sum: "$$CURRENT.total" }
                    }
                },

                { $sort : { _id : -1 } },
                {
                    $project:
                        {
                            _id: 1,
                            member: 1,
                            timestamp: {$convert: {input: "$_id", to: "date"}},
                            products: 1,
                            total: 1,
                        }
                }
            ]).toArray((err, items) => res.json(items));
        }.bind(this);

        /**
         * This section will help you get a single record by id
         * @type {any}
         */
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
         * @type {any}
         */
        this.add = function (req, res) {
            let myObj = {
                member_id: new objectId(req.body.member_id),
                products: req.body.products.map(e => {
                    return {id: new objectId(e._id), qty: Number(e.qty)}
                })
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
                    member_id: new objectId(req.body.member_id),
                    products: req.body.products.map(e => {
                        return {id: new objectId(e._id), qty: Number(e.qty)}
                    })
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

/*
        db.sales.aggregate( [
            {
                $group:
                    {
                        _id: "$prodId",
                        amountSold: { $sum: { $multiply: [ "$price", "$numPurchased" ] } }
                    }
            }
        ] )
*/

        routes.get("/", this.list);
        routes.get("/:id", this.view);
        routes.post("/", this.add);
        routes.put("/:id", this.update);
        routes.delete("/:id", this.delete);

        return routes;
    };

module.exports = {
    name: "sales",
    route: (server, collection) => route(server, collection)
};