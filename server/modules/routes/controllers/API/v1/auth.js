const express = require("express");


/**
 * recordRoutes is an instance of the express router.
 * We use it to define our routes.
 * The router will be added as a middleware and will take control of requests starting with path /record.
 * @type {Router}
 */
const authRoutes = express.Router();

// This will help us connect to the database
//const dbo = require("../../db/conn");

// This will help to convert the id from string to ObjectId for the _id.
//const ObjectId = require("mongodb").ObjectId;

const auth = {};




//authRoutes.post('/signup', auth.signup);
//authRoutes.post('/signin', auth.signin);

module.exports = {
    name: "auth",
    class: authRoutes,
    disabled: true
};