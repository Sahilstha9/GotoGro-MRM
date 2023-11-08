const fs = require("fs");
const path = require("path");

const getFilenames = (filePath) =>
    fs
        .readdirSync(path.resolve(__dirname, filePath))
        .map((filename) => filename.replace(/\.[^/.]+$/, ""));

const getHandlerFilePath = (moduleName) => `../modules/${moduleName}/handlers`;

const getHandlers = (handlerFilePath) =>
    getFilenames(handlerFilePath).map((handlerName) => ({
        handlerName,
        handler: require(`${handlerFilePath}/${handlerName}`),
    }));

const groupByHandlerName = (handlerMap, { handlerName, handler }) => {
    (handlerMap[handlerName] = handlerMap[handlerName] || []).push(handler);
    return handlerMap;
};

module.exports = () => {
    const a = getFilenames("../modules")
        .map(getHandlerFilePath)
        .flatMap(getHandlers)
        .reduce(groupByHandlerName, { ready: [] });
    console.log("--------------------------------")
    console.log(a);
    console.log("--------------------------------")
    return a;

}