import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import express from 'express';
import { CustomerOrders } from './Domain';
import { CustomerPaidForOrder, CustomerPlacedOrder, CustomerStatusChanged, CustomerTotalSpendingChanged } from './Events';

const asyncHandler = (callback: (req: express.Request, res: express.Response) => Promise<void>) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => callback(req, res).catch(err => {
        res.status(500);
        res.end(err.message);
    });

const client = Client
    .forMicroservice('68abba17-2818-49e8-8e4c-2021daaff327')
    .withRuntimeOn('localhost', 50063)
    .withEventTypes(_ => _
        .register(CustomerTotalSpendingChanged)
        .register(CustomerPaidForOrder)
        .register(CustomerPlacedOrder)
        .register(CustomerStatusChanged))
    .build();

const app = express();


client.eventStore.forTenant(TenantId.development)
    .commit({ hello: 'world' }, '2d87a9ef-096e-4227-9c5c-2bf7e4be07d6', 'd5f886ce-9a39-4154-b569-a697afb115a2');

app.get('/', (req, res) => res.end('Hello world'));
app.post('/customerorders/order', asyncHandler(async (req, res) => {
    const customerId = req.query.customer;
    const amount = Number.parseFloat(req.query.amount as string);
    await client
        .aggregateOf<CustomerOrders>(CustomerOrders, customerId as string, _ => _.forTenant(TenantId.development))
        .perform(_ => _.placeOrder(amount));
    res.end('Thanks!');
}));

app.post('/customerorders/pay', asyncHandler(async (req, res) => {
    const customerId = req.query.customer;
    const amount = Number.parseFloat(req.query.amount as string);
    await client
        .aggregateOf<CustomerOrders>(CustomerOrders, customerId as string, _ => _.forTenant(TenantId.development))
        .perform(_ => _.payForOrder(amount));
    res.end('Nice!');
}));

app.listen(8001, () => console.log('Listening on port 8001'));
