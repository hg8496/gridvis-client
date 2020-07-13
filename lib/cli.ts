#!/usr/bin/env node
import * as commander from "commander";
import { Command } from "commander";
import { GridVisClient } from "./Client";
import { IDevice } from "./device";
import { EventTypes, IEvent } from "./events";
import { SequenceTypes } from "./sequences/ISequence";
import { ITransient } from "./transients";
import { IValueType } from "./values";

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

async function showProject(url: string, projectName: string, command: Command) {
    console.log(await setupClient(url, command).projects.get(projectName));
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
        (dev) =>
            dev.name.indexOf(deviceIdent) >= 0 || dev.serialNr === deviceIdent || dev.id.toString() === deviceIdent,
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

async function recordings(url: string, projectName: string, deviceIdent: string, command: Command) {
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        const valDesc = await client.values.list(projectName, device);
        for (const vd of valDesc) {
            console.log(vd);
        }
    });
}

async function values(
    url: string,
    projectName: string,
    deviceIdent: string,
    value: string,
    type: string,
    timebase: string,
    command: Command,
) {
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        const valDesc = await client.values.list(projectName, device);
        for (const vd of valDesc) {
            if (vd.valueType.value === value && vd.valueType.type === type && "" + vd.timebase === timebase) {
                const vList = await client.values.getValues(projectName, device, vd, command.start, command.end);
                console.log(JSON.stringify(vList));
            }
        }
    });
}

async function onlinevalues(
    url: string,
    projectName: string,
    deviceIdent: string,
    valuesComSep: string,
    command: Command,
) {
    const vNames = valuesComSep.split(",");
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        const valTypes = await client.values.listOnline(projectName, device);
        const useValTypes = [] as IValueType[];
        for (const vt of valTypes) {
            for (const vName of vNames) {
                if (vt.value === vName) {
                    useValTypes.push(vt);
                }
            }
        }
        const result = await client.values.getOnlineValues(projectName, device, useValTypes);
        console.log(result);
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

async function sequences(url: string, projectName: string, deviceIdent: string, command: Command) {
    await deviceFinder(url, projectName, deviceIdent, command, async (client, device) => {
        let seq = await client.sequences.getSequences(
            projectName,
            device,
            SequenceTypes.Waveform,
            command.start,
            command.end,
        );
        console.log(`Waveforms: ${seq.length}`);
        seq = await client.sequences.getSequences(
            projectName,
            device,
            SequenceTypes.EffectiveValues,
            command.start,
            command.end,
        );
        console.log(`EffectiveValues: ${seq.length}`);
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

    setupDefaultArguments(program.command("version")).description("Returns GridVis version").action(version);

    setupDefaultArguments(program.command("projects")).description("List all projects").action(projects);

    setupDefaultArguments(program.command("project"))
        .description("Fetch a single project")
        .arguments("<projectName>")
        .action(showProject);

    setupDefaultArguments(program.command("devices"))
        .description("List all devices of a project")
        .arguments("<projectName>")
        .action(devices);

    addTimeOptions(
        setupDefaultArguments(program.command("events"))
            .description("Counts events of a device in a given time frame")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .action(events),
    );

    addTimeOptions(
        setupDefaultArguments(program.command("transients"))
            .description("Count transients of a device in a given time frame")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .action(transients),
    );

    addTimeOptions(
        setupDefaultArguments(program.command("sequences"))
            .description("Count sequences of a device in a given time frame")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .action(sequences),
    );

    setupDefaultArguments(program.command("recordings"))
        .description("List all recorded values of a device")
        .arguments("<projectName>")
        .arguments("<deviceNameOrSerialOrId>")
        .action(recordings);

    addTimeOptions(
        setupDefaultArguments(program.command("values"))
            .description("prints values of a device in a given time frame")
            .arguments("<projectName>")
            .arguments("<deviceNameOrSerialOrId>")
            .arguments("<value>")
            .arguments("<type>")
            .arguments("<timebase>")
            .action(values),
    );

    setupDefaultArguments(program.command("online"))
        .description("Fetch online values of a device")
        .arguments("<projectName>")
        .arguments("<deviceNameOrSerialOrId>")
        .arguments("<valuesCommaSep>")
        .action(onlinevalues);
    if (process.argv.length <= 2) {
        program.outputHelp();
        return;
    }
    await program.parseAsync(process.argv);
}

main().catch((e) => console.log(e));
