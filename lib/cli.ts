import * as commander from "commander";
import { GridVisClient } from "./Client";

commander
    .version("1.0.0")
    .arguments("<URL>")
    .option("-u, --username <username>", "Specify username [admin]", "admin")
    .option("-p, --password <password>", "Specify password [Janitza]", "Janitza")
    .parse(process.argv);

async function main() {
    if (typeof commander.args[0] === "undefined") {
        console.log("No URL specified");
        commander.outputHelp();
        process.exit(1);
    }
    const client = new GridVisClient({
        password: commander.password,
        url: commander.args[0],
        username: commander.username,
    });
    console.log(await client.fetchGridVisVersion());
    console.log(await client.projects.list());
}

main();
