import { projection, on, ProjectionContext } from '@dolittle/sdk.projections';
import { CustomerPaidForOrder, CustomerPlacedOrder, CustomerStatusChanged } from '../Events';

@projection('e80c71b6-8ce1-47eb-801d-b63542c6c430')
export class Customer {
    TotalSpending: number = 0;
    OrdersPlaced: number = 0;
    Status: string = "wood";

    @on(CustomerPaidForOrder, _ => _.keyFromEventSource())
    onPaidForOrder(event: CustomerPaidForOrder, context: ProjectionContext) {
        this.TotalSpending += event.Amount;
    }

    @on(CustomerPlacedOrder, _ => _.keyFromEventSource())
    onPlacedOrder(event: CustomerPlacedOrder, context: ProjectionContext) {
        this.OrdersPlaced++;
    }
    
    @on(CustomerStatusChanged, _ => _.keyFromEventSource())
    onStatusChanged(event: CustomerStatusChanged, context: ProjectionContext) {
        this.Status = event.Status;
    }
}