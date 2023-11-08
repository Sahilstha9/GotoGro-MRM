const cors = require("cors");
const express = require("express");
const compression = require("compression");
const helmet = require('helmet');

module.exports = (server) => {
    const app = server.app;

    app.use(compression()); //Compress all routes
    app.use(helmet());

    app.use(cors());
    app.use(express.json());

    app.set('trust proxy', 1);

    app.use(function (request, response, next) {
        if (process.env.NODE_ENV !== 'development' && !request.secure) {
            return response.redirect("https://" + request.headers.host + request.url)
        }
        next()
    });

    require("../helpers/loadControllers")(server);
    server.controller.forEach((controller) => {
        if (!controller.disabled) {
            app.use(`/${controller.category}/${controller.version}/${controller.name}`, controller.route(server));
        }
    })

    console.log("routes: ready");
};
