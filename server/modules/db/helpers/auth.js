//const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
//const jwt = require("jsonwebtoken"); // import jwt to sign tokens
require("dotenv").config();

class Authenticate {
        constructor(server) {
            this.server = server;
            //DESTRUCTURE ENV VARIABLES WITH DEFAULTS
            const { SECRET = "secret" } = process.env;
        }

        test() {
            console.log(this.server.port);
        }
        async login(req, res) {
            req.body.password = await bcrypt.hash(req.body.password, 10);

        }

       async register(req, res) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            res.json(user);
        }

    // MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
        async isLoggedIn(req, res, next) {
        try {
            // check if auth header exists
            if (req.headers.authorization) {
                // parse token from header
                const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
                if (token) {
                    const payload = await jwt.verify(token, process.env.SECRET);
                    if (payload) {
                        // store user data in request object
                        req.user = payload;
                        next();
                    } else {
                        res.status(400).json({ error: "token verification failed" });
                    }
                } else {
                    res.status(400).json({ error: "malformed auth header" });
                }
            } else {
                res.status(400).json({ error: "No authorization header" });
            }
        } catch (error) {
            res.status(400).json({ error });
        }
    };
};

module.exports = (server) => new Authenticate(server);