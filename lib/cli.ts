#!/usr/bin/env node
import * as commander from "commander";
import { Command } from "commander";
import { GridVisClient } from "./Client";
import { IDevice } from "./device";
import { EventTypes, IEvent } from "./events/IEvent";
import { ITransient } from "./transients/ITransient";

function setupDefaultArguments(command: Command): Command {
    return command
        .arguments("<URL>")
        .option("-u, --username <username>", "Specify username", "admin")
        .option("-p, --password <password>", "Specify password", "Janitza");
}

function addTimeOptions(command: Command): Command {
    return command
        .option("-s, --start <time>", "Specify start time for queries", "NAMED_Today")
        .option("-e, --end <time>", "Specify nd time for queries", "NAMED_Today");
}

function setupClient(url: string, command: Command): GridVisClient {
    return new GridVisClient({
        password: command.password,
        url,
        username: command.username,
    });
}

async function version(url: string, command: Command) {
    console.log(await setupClient(url, command).fetchGridVisVersion());
}

async function projects(url: string, command: Command) {
    console.log(await setupClient(url, command).projects.list());
}

async function devices(url: string, projectName: string, command: Command) {
    try {
        console.log(await setupClient(url, command).devices.list(projectName));
    } catch (e) {
        console.log(e);
    }
}

async function findDevice(client: GridVisClient, projectName: string, deviceIdent: string) {
    const allDevices = await client.devices.list(projectName);
    return allDevices.find(
        dev => dev.name.indexOf(deviceIdent) >= 0 || dev.serialNr === deviceIdent || dev.id.toString() === deviceIdent,
    );
}

type DeviceCaller = (client: GridVisClient, device: IDevice) => void;

async function deviceFinder(url: string, project: string, deviceIdent: string, command: Command, caller: DeviceCaller) {
    try {
        const client = setupClient(url, command);
        const device = await findDevice(client, project, deviceIdent);
        if (device) {
            await caller(client, device);
        } else {
            console.log("Device not found");
        }
    } catch (e) {
        console.log(e);
    }
}
type Counter = Map<string, number>;

function output(counter: Counter): void {
    counter.forEach((value, type) => {
        console.log(`${type}: ${value}`);
    });
}

async function transients(url: string, projectName: string, deviceIdent: string, command: Command) {
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        const reducer = (current: Counter, trans: ITransient): Counter => {
            const counter = current.get(trans.type);
            current.set(trans.type, counter ? counter + 1 : 1);
            return current;
        };
        const typeCount = (
            await client.transients.getTransients(projectName, device, command.start, command.end)
        ).reduce<Counter>(reducer, new Map());
        output(typeCount);
    });
}

async function events(url: string, projectName: string, deviceIdent: string, command: Command) {
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        const reducer = (current: Counter, evt: IEvent): Counter => {
            const counter = current.get(evt.eventType);
            current.set(evt.eventType, counter ? counter + 1 : 1);
            return current;
        };
        output(
            (
                await client.events.getEvents(
                    projectName,
                    device,
                    [EventTypes.VoltageOver, EventTypes.VoltageUnder],
                    command.start,
                    command.end,
                )
            ).reduce<Counter>(reducer, new Map()),
        );
    });
}

async function main() {
    const program = new commander.Command();
    program.version("1.0.20");

    setupDefaultArguments(program.command("version"))
        .description("Returns GridVis version")
        .action(version);

    setupDefaultArguments(program.command("projects"))
        .description("List all projects")
        .action(projects);

    setupDefaultArguments(program.command("devices"))
        .description("List all devices of a project")
        .arguments("<projectName>")
        .action(devices);

    addTimeOptions(
        setupDefaultArguments(program.command("transients"))
            .description("Count transients of a device in a given time")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .action(transients),
    );

    addTimeOptions(
        setupDefaultArguments(program.command("events"))
            .description("Counts events of a device in a given time")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .action(events),
    );
    if (process.argv.length <= 2) {
        program.outputHelp();
        return;
    }
    await program.parseAsync(process.argv);
}

main().catch(e => console.log(e));
