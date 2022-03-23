import { eventType } from '@dolittle/sdk.events';

@eventType('5b2ca920-a149-4ed2-9955-d881f5499927')
export class CustomerPlacedOrder {
    constructor(
        readonly CustomerId: string,
        readonly OrderAmount: number,
    ) { }
}
