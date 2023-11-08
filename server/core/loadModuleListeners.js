const getModuleHandlerMap = require("./getModuleHandlerMap");

const runHandlers = (handlers, ...eventArguments) =>
    handlers.forEach((handler) => {
        //console.log("--------------------------------")
       // console.log(handler);
       // console.log("--------------------------------")
        handler(...eventArguments)

    });

module.exports = (server) => {
    process
        .on("unhandledRejection", console.error)
        .on("uncaughtException", (error) => {
            console.error(error);
            process.exit(1);
        });

    const { ready, ...moduleHandlerMap } = getModuleHandlerMap();
//console.log("--------------------------------")
     //  console.log(moduleHandlerMap);
    //  console.log("--------------------------------")
    server.once("ready", () => runHandlers(ready, server));

    Object.keys(moduleHandlerMap).forEach((handlerName) =>
        server.on(handlerName, (...eventArguments) =>
            runHandlers(moduleHandlerMap[handlerName], ...eventArguments)
        )
    );
};
