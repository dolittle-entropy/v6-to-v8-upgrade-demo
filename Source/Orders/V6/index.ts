import { Client } from '@dolittle/sdk';
import { TenantId } from '@dolittle/sdk.execution';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';
import express from 'express';

import { CustomerOrders } from './Domain';
import { CustomerPaidForOrder, CustomerPlacedOrder, CustomerStatusChanged, CustomerTotalSpendingChanged } from './Events';
import { CustomerStatusElevator } from './Reactions';
import { Container } from './Container';
import { Customer } from './Read';

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
    .withFilters(_ => _
        .createPublicFilter('43413d9d-fcf0-48eb-a97d-6098afb7acb0', _ => _.handle(() => new PartitionedFilterResult(true, '00000000-0000-0000-0000-000000000000'))))
    .withEventHorizons(_ => _
        .forTenant(TenantId.development, _ => _
            .fromProducerMicroservice('e8d79976-c518-4a58-953f-c883b615d229')
            .fromProducerTenant(TenantId.development)
            .fromProducerStream('b28ac505-f6b3-408b-9537-7dcf99967f12')
            .fromProducerPartition('00000000-0000-0000-0000-000000000000')
            .toScope('72d0b47f-909a-431a-a65c-eed2c4c22567')))
    .withEventHandlers(_ => _
        .register(CustomerStatusElevator))
    .withProjections(_ => _
        .register(Customer))
    .withContainer(new Container())
    .build();

Container.client = client;

const app = express();

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

app.get('/customerorders/:customer', asyncHandler(async (req, res) => {
    const customerId = req.params.customer;
    var customer = await client
        .projections.forTenant(TenantId.development).get(Customer, customerId);
    res.end(JSON.stringify(customer.state, undefined, 4));
    
}))
app.listen(8001, () => console.log('Listening on port 8001'));
