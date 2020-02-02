# gridvis-client
[![NPM version](https://img.shields.io/npm/v/@hg8496/gridvis-client.svg)](https://www.npmjs.com/package/@hg8496/gridvis-client)
[![Build Status](https://travis-ci.org/hg8496/gridvis-client.svg?branch=master)](https://travis-ci.org/hg8496/gridvis-client)
[![Coverage Status](https://coveralls.io/repos/github/hg8496/gridvis-client/badge.svg?branch=master)](https://coveralls.io/github/hg8496/gridvis-client?branch=master)

A node js library to access the Janitza GridVis REST interface.

```typescript
import { GridVisClient } from '@hg8496/gridvis-client';

async function main() {
    const client = new GridVisClient({url: ""});
    return await client.fetchGridVisVersion();
}

main().then((version) => {
    console.log(version)
});
```

## CLI
A cli is also included. To obtain some information or statistics.
To see statistic of last months events for a given device call:
```bash
$ gridvis-client events https://gridvis-energy.com DemoProject 92 -s NAMED_LastYear -e NAMED_LastYear
VoltageUnder: 7

```