
/*
const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true });

let _db;
*/


module.exports = (server) => {
    server.mongoConnect = require("../helpers/conn")(server);
    server.auth = require("../helpers/auth")(server);
    server.auth.test();

    console.log("database: ready")
};
