import { projection, on, ProjectionContext } from '@dolittle/sdk.projections';
import { ReviewGivenByCustomer } from '../Events';

@projection('66a3e06d-a9c8-41a4-9ffa-72fc063ddaf8')
export class CustomerLatestReview {
    IsPositive: boolean = false;
    Review: string = "No review has been given";
    Id: string = "NOTSET";

    @on(ReviewGivenByCustomer, _ => _.keyFromEventSource())
    onPaidForOrder(event: ReviewGivenByCustomer, context: ProjectionContext) {
        this.Review = event.Review;
        this.IsPositive = event.PositiveReview;
        this.Id = event.CustomerId;
    }
}
