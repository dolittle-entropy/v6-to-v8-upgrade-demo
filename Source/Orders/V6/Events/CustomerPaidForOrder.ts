import { eventType } from '@dolittle/sdk.events';

@eventType('5b55e83b-232a-42b1-881a-71714266f9bd')
export class CustomerPaidForOrder {
    constructor(
        readonly CustomerId: string,
        readonly Amount: number,
    ) { }
}
