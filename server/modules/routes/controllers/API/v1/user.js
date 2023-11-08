    /**
     * user is an instance of the express router.
     * We use it to define our routes.
     * The router will be added as a middleware and will take control of requests starting with path /user.
     * @type {function}
     * @param {Server} server
     * @param {string} collection
     * @return {Router} userRoutes
     */
   const route = (server, collection = "user") => {
        const routes = require("express").Router();
        // This will help to convert the id from string to ObjectId for the _id.
        const objectId = server.mongoDb.ObjectId;

// This section will help you get a list of all the records.
        this.list = function (req, res) {
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
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: req.body.role,
                username: req.body.username,
                password: req.body.password
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
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    role: req.body.role,
                    username: req.body.username,
                    password: req.body.password
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

        routes.get("/", this.list);
        routes.get("/:id", this.view);
        routes.post("/", this.add);
        routes.put("/:id", this.update);
        routes.delete("/:id", this.delete);

        return routes;
    }

    module.exports = {
        name: "users",
        route: (server, collection) => route(server, collection)
    };