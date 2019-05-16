import {GridVisClient, Configuration} from './Client';

const client = new GridVisClient({ url: "https://gvh.cstolz.de", password: "JanitzaCS"});

async function main() {
    console.log(await client.fetchGridVisVersion())
}
main();
