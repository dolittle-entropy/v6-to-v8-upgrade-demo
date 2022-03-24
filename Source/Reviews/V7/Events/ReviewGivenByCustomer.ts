import { eventType } from '@dolittle/sdk.events';

@eventType('e04bf8b7-21ac-460e-9ef2-992f0e5ae17c')
export class ReviewGivenByCustomer {
    constructor(
        readonly CustomerId: string,
        readonly Review: string,
        readonly ReviewId: string,
        readonly PositiveReview: boolean
    ) { }
}
