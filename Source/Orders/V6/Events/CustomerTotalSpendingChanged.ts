import { eventType } from '@dolittle/sdk.events';

@eventType('2921cfe0-3415-48ee-bfad-5564f127f1f8')
export class CustomerTotalSpendingChanged {
    constructor(
        readonly CustomerId: string,
        readonly PreviousSpentAmount: number,
        readonly SpentAmount: number,
    ) {}
}

