// environment file
require("dotenv").config({ path: "./config.env" });

// get driver connection
const Server = require("./classes/Server.js");
const server = new Server(
    {
      port: process.env.SERVER_PORT || 5000
    });

/*server.once('ready',  server => {

});*/

require("./core/loadModuleListeners")(server);
server.start();