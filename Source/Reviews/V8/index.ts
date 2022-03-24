import { IAggregateOf } from '@dolittle/sdk.aggregates';
import { dolittle, inject } from '@dolittle/sdk.extensions.express';
import { IProjectionOf } from '@dolittle/sdk.projections';
import express from 'express';

import { Reviews } from './Domain';
import { CustomerLatestReview, Review } from './Read';

(async () => {
    const app = express();
    app.use(dolittle(
        _ => {},
        _ => _.withRuntimeOn('localhost', 50083)));

    app.get('/', (req, res) => res.end('Hello world'));
    app.post('/customerreviews', inject(IAggregateOf.for(Reviews))(async (req, res, next, reviews) => {
        try {
            const customerId = req.query.customer as string;
            const review = req.query.review as string;
            req.body
            await reviews
                .get(customerId)
                .perform(_ => _.giveReview(review));
            res.end('Thanks!');
        } catch (error: any) {
            res.status(500);
            res.end(error.message);
        }
    }));
    
    app.get('/customerreviews/latest', inject(IProjectionOf.for(Review))(async (req, res, next, review) => {
        const reviews = await review.getAll();
        const sorted = reviews.map(({ Posted, CustomerId, IsPositive, Review}) => ({
            Posted: Date.parse(Posted as any),
            CustomerId,
            IsPositive,
            Review,
        }));
        sorted.sort((a, b) => b.Posted.valueOf() - a.Posted.valueOf());
        const latest = sorted.slice(0, 10);
        res.end(JSON.stringify(latest, undefined, 4));
    }));

    app.get('/customerreviews/:customer', inject(IProjectionOf.for(CustomerLatestReview))(async (req, res, next, review) => {
        const customerId = req.params.customer as string;
        res.end(JSON.stringify(await review.get(customerId), undefined, 4));
    }));

    app.get('/customerreviews', inject(IProjectionOf.for(Review))(async (req, res, next, review) => {
        res.end(JSON.stringify(await review.getAll(), undefined, 4));
    }));

    app.listen(8003, () => console.log('Listening on port 8003'));

})();