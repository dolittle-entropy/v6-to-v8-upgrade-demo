import { eventType } from '@dolittle/sdk.events';

@eventType('9a722c3f-6e11-4406-ac12-277173381fde')
export class CustomerStatusChanged {
    constructor(
        readonly CustomerId: string,
        readonly Status: string,
    ) { }
}
