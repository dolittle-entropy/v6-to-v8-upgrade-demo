import { aggregateRoot, AggregateRoot, on } from '@dolittle/sdk.aggregates';
import { EventSourceId } from '@dolittle/sdk.events';
import { Guid } from '@dolittle/rudiments';

import { ReviewGivenByCustomer } from '../Events';


@aggregateRoot('f736eb96-7700-42cc-852c-3461d0f5b6e0')
export class Reviews extends AggregateRoot {
    private _positiveReviews = 0;
    private _negativeReviews = 0;

    constructor(eventSourceId: EventSourceId) {
        super(eventSourceId);
    }

    giveReview(review: string) {
        const isPositiveReview = this.reviewIsPositive(review);
        if (!isPositiveReview && this._negativeReviews > 0 && this._negativeReviews >= this._positiveReviews) {
            throw new Error('Don\'t be mean, you\'ve given too many negative reviews - try some positive ones for a change');
        }
        this.apply(new ReviewGivenByCustomer(this.eventSourceId.toString(), review, Guid.create().toString(), isPositiveReview));
    }

    @on(ReviewGivenByCustomer)
    onReviewGiven(event: ReviewGivenByCustomer) {
        if (event.PositiveReview) {
            this._positiveReviews ++;
        } else {
            this._negativeReviews ++;
        }
    }

    private reviewIsPositive(review: string): boolean {
        return  /\b(good|great|best|amazing|sexy|hot)\b/i.test(review);
    }
}