import { projection, on, ProjectionContext } from '@dolittle/sdk.projections';
import { ReviewGivenByCustomer } from '../Events';


@projection('cb0f1770-bef1-4c72-8530-ec14668464b3')
export class Review {
    Posted: Date = new Date(0);
    CustomerId: string = '';
    Review: string = 'Review does not exist';
    IsPositive: boolean = false;

    @on(ReviewGivenByCustomer, _ => _.keyFromProperty('ReviewId'))
    onPaidForOrder(event: ReviewGivenByCustomer, context: ProjectionContext) {
        this.CustomerId = event.CustomerId;
        this.Review = event.Review;
        this.IsPositive = event.PositiveReview;
        this.Posted = context.eventContext.occurred.toJSDate();
    }
}
