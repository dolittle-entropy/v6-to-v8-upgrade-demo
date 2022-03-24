import { DolittleClient } from '@dolittle/sdk';
import { IAggregateOf } from '@dolittle/sdk.aggregates';
import { PartitionedFilterResult } from '@dolittle/sdk.events.filtering';
import { TenantId } from '@dolittle/sdk.execution';
import { dolittle, inject } from '@dolittle/sdk.extensions.express';
import { IProjectionOf } from '@dolittle/sdk.projections';
import express from 'express';

import { CustomerOrders } from './Domain';
import './Reactions';  
import { Customer } from './Read';

(async () => {
    const client = await DolittleClient
        .setup(_ => _
            .withFilters(_ => _
                .createPublic('43413d9d-fcf0-48eb-a97d-6098afb7acb0').handle(() => new PartitionedFilterResult(true, '00000000-0000-0000-0000-000000000000')))
            .withEventHorizons(_ => _
                .forTenant(TenantId.development, _ => _
                    .fromProducerMicroservice('e8d79976-c518-4a58-953f-c883b615d229')
                    .fromProducerTenant(TenantId.development)
                    .fromProducerStream('b28ac505-f6b3-408b-9537-7dcf99967f12')
                    .fromProducerPartition('00000000-0000-0000-0000-000000000000')
                    .toScope('72d0b47f-909a-431a-a65c-eed2c4c22567'))))
        .connect(_ => _
            .withRuntimeOn('localhost', 50063));

    const app = express();

    app.use(dolittle(client))

    app.get('/', (req, res) => res.end('Hello world'));
    app.post('/customerorders/order', inject(IAggregateOf.for(CustomerOrders))(async (req, res, next, customerOrders) => {
        try {
            const customerId = req.query.customer as string;
            const amount = Number.parseFloat(req.query.amount as string);
            await customerOrders
                .get(customerId)
                .perform(_ => _.placeOrder(amount));
            res.end('Thanks!');
        } catch (error: any) {
            res.status(500);
            res.end(error.message);
        }
    }));

    app.post('/customerorders/pay', inject(IAggregateOf.for(CustomerOrders))(async (req, res, next, customerOrders) => {
        try {
            const customerId = req.query.customer as string;
            const amount = Number.parseFloat(req.query.amount as string);
            await customerOrders
                .get(customerId)
                .perform(_ => _.payForOrder(amount));
            res.end('Nice!');   
        } catch (error: any) {
            res.status(500);
            res.end(error.message);
        }
    }));

    app.get('/customerorders/:customer', inject(IProjectionOf.for(Customer))(async (req, res, next, customer) => {
        const customerId = req.params.customer as string;
        res.end(JSON.stringify(await customer.get(customerId), undefined, 4));
    }));

    app.get('/customerorders', inject(IProjectionOf.for(Customer))(async (req, res, next, customer) => {
        var customers = await customer.getAll();
        let result: {[key: string]: any} = {};
        for (const customer of customers) {
            result[customer.Id] = customer;
        }
        res.end(JSON.stringify(result, undefined, 4));
    }));

    app.listen(8001, () => console.log('Listening on port 8001'));

})();