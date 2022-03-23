import { DolittleClient } from '@dolittle/sdk';
import { EventContext } from '@dolittle/sdk.events';
import { eventHandler, handles } from '@dolittle/sdk.events.handling';
import { TenantId } from '@dolittle/sdk.execution';
import { CustomerOrders } from '../Domain';
import { CustomerStatusChanged } from '../Events';

@eventHandler('f153aa97-424f-46fe-b5c3-3fff817def6c', {inScope: '72d0b47f-909a-431a-a65c-eed2c4c22567'})
export class CustomerStatusElevator {

    constructor(readonly _client: DolittleClient) { }
    
    @handles(CustomerStatusChanged)
    handleStatusChanged(event: CustomerStatusChanged, context: EventContext) {
        return this._client
        .aggregates.forTenant(TenantId.development)
        .get(CustomerOrders, event.CustomerId)
            .perform(_ => _.updateCustomerStatus(event.Status));
    }
}