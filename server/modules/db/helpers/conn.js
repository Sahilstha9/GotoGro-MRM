class mongoDbConnect {
    constructor(server) {
        this.server = server;
        this.listen();
    };

    connectToServer(callback) {
        this.server.MongoClient.connect(function (err, db) {
            // Verify we got a good "db" object
            if (db)
            {
                this.server.mongoConnection = db.db("employees");
                console.log("Successfully connected to MongoDB.");
            }
            return callback(err);
        }.bind(this));
    }

    listen() {
        this.server.app.listen(this.server.port, () => {
            // perform a database connection when server starts
            this.connectToServer(function (err) {
                if (err) console.error(err);
            });
            console.log(`Server is running on port: ${this.server.port}`);
        });
    }
};

module.exports = (server) => new mongoDbConnect(server);