const { readdirSync } = require("fs");
const { resolve } = require("path");
const Collection = require("../../../classes/Collection").Collection;
const ascii = require("ascii-table");
//const ControllerBuilder = require("../../../classes/ControllerBuilder");
let table = new ascii("Controllers");
table.setHeading("Category", "Controllers", "Load status");

module.exports = (server) => {
    server.controller = new Collection();
    server.aliases = new Collection();
    readdirSync(resolve(__dirname, "../controllers/")).forEach(dir => {
        readdirSync(resolve(__dirname, `../controllers/${dir}/`)).forEach(version => {
            const files = readdirSync(resolve(__dirname, `../controllers/${dir}/${version}/`)).filter(file => file.endsWith(".js"));

            for (let file of files) {
                let pull = require(`../controllers/${dir}/${version}/${file}`);
                pull.category = pull.category ? pull.category : dir;
                pull.version = pull.version ? pull.version : version;
                //pull = new ControllerBuilder(pull)
                if (pull.name) {
                    server.controller.set(pull.name.toLowerCase(), pull);

                    table.addRow(pull.category, file, '✅');
                } else {
                    table.addRow(pull.category, file, `❌  -> missing a help.name, or help.name is not a string.`);
                    continue;
                }

                if (pull.aliases && Array.isArray(pull.aliases))
                    pull.aliases.forEach(alias => server.aliases.set(alias.toLowerCase(), pull.name.toLowerCase()));
            }
        });

        console.log(table.toString());
        // Routes are now ready
        return "READY";
    });
}