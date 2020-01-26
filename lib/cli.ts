#!/usr/bin/env node
import * as commander from "commander";
import { GridVisClient } from "./Client";
import { EventTypes } from "./events/IEvents";

commander
    .version("1.0.20")
    .arguments("<URL>")
    .option("-u, --username <username>", "Specify username", "admin")
    .option("-p, --password <password>", "Specify password", "Janitza")
    .option("-s, --start <time>", "Specify start time for queries", "NAMED_Today")
    .option("-e, --end <time>", "Specify nd time for queries", "NAMED_Today")
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
    const projects = await client.projects.list();
    console.log(projects);
    const devices = await client.devices.list(projects[0]);
    console.log(devices);
    console.log(await client.devices.connectionTest(projects[0], devices[0]));
    const values = await client.values.list(projects[0], devices[0]);
    const frequency = values.find(value => value.valueType.value === "Frequency");
    console.log(frequency);
    if (frequency) {
        console.log(await client.values.getValues(projects[0], devices[0], frequency, commander.start, commander.end));
    }
    console.log(await client.transients.getTransients(projects[0], devices[0], commander.start, commander.end));
    try {
        console.log(
            (
                await client.events.getEvents(
                    projects[0],
                    devices[0],
                    [EventTypes.VoltageOver, EventTypes.VoltageUnder],
                    commander.start,
                    commander.end,
                )
            ).length,
        );
    } catch (e) {
        console.log(e);
    }
}

main();
