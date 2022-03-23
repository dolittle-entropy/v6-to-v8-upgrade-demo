import { aggregateRoot, AggregateRoot, on } from '@dolittle/sdk.aggregates';
import { EventSourceId } from '@dolittle/sdk.events';

import { CustomerPaidForOrder, CustomerPlacedOrder, CustomerStatusChanged, CustomerTotalSpendingChanged } from '../Events';

export enum CustomerStatus {
    Wood = 'wood',
    Gold = 'gold',
}

@aggregateRoot('e5b17be9-4873-4526-99a1-76a5c31c0dad')
export class CustomerOrders extends AggregateRoot {
    private _status = CustomerStatus.Wood;
    private _unpaidAmount = 0;
    private _spentAmount = 0;

    constructor(eventSourceId: EventSourceId) {
        super(eventSourceId);
    }

    placeOrder(amount: number) {
        if (!this.customerIsAllowedToSpend(amount)) {
            throw new Error(`You have already reached the limit of what you can spend before paying. The unpaid amount is ${this._unpaidAmount}`);
        }
        this.apply(new CustomerPlacedOrder(this.eventSourceId.toString(), amount));
    }

    payForOrder(amount: number) {
        if (this._unpaidAmount < amount) {
            throw new Error(`You're paying too much, unpaid amount is ${this._unpaidAmount}`);
        }
        this.apply(new CustomerPaidForOrder(this.eventSourceId.toString(), amount));
        this.applyPublic(new CustomerTotalSpendingChanged(this.eventSourceId.toString(), this._spentAmount, this._spentAmount+amount));
    }

    updateCustomerStatus(status: string) {
        this.apply(new CustomerStatusChanged(this.eventSourceId.toString(), status))
    }

    private customerIsAllowedToSpend(amount: number): boolean {
        switch (this._status) {
            case CustomerStatus.Gold:
                return (this._unpaidAmount + amount) <= 10000;
            default:
                return (this._unpaidAmount + amount) <= 1000;
        }
    }

    @on(CustomerPlacedOrder)
    onPlacedOrder(event: CustomerPlacedOrder) {
        this._unpaidAmount += event.OrderAmount;
    }

    @on(CustomerPaidForOrder)
    onPaidForOrder(event: CustomerPaidForOrder) {
        this._unpaidAmount -= event.Amount;
        this._spentAmount += event.Amount;
    }

    @on(CustomerStatusChanged)
    onStatusChanged(event: CustomerStatusChanged) {
        this._status = event.Status as CustomerStatus;
    }
}