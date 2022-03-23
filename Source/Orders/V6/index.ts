import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import express from 'express';

const client = Client
    .forMicroservice('68abba17-2818-49e8-8e4c-2021daaff327')
    .withRuntimeOn('localhost', 50063)
    .build();

const app = express();

client.eventStore.forTenant(TenantId.development)
    .commit({ hello: 'world' }, '2d87a9ef-096e-4227-9c5c-2bf7e4be07d6', 'd5f886ce-9a39-4154-b569-a697afb115a2');

app.get('/', (req, res) => res.end('Hello world'));

app.listen(8001, () => console.log('Listening on port 8001'));