using Dolittle.SDK;
using Dolittle.SDK.Aggregates;
using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Handling;
using Dolittle.SDK.Events.Store;
using Dolittle.SDK.Events.Store.Builders;
using Events;

namespace Reactions;

[EventHandler("91b3442f-0516-449e-9d56-5cdda260ea84", inScope: "3610abbd-96cf-4bb0-9a11-f2aa79074bbc")]
public class CustomerStatusElevator
{
    const decimal GoldUpgradeAmount = 2000;

    readonly IEventStore _eventStore;
    readonly ILogger _logger;

    public CustomerStatusElevator(IEventStore eventStore, ILogger<CustomerStatusElevator> logger)
    {
        _eventStore = eventStore;
        _logger = logger;
    }

    public Task Handle(CustomerTotalSpendingChanged @event, EventContext context)
    {
        if (@event.PreviousSpentAmount < GoldUpgradeAmount && @event.SpentAmount >= GoldUpgradeAmount)
        {
            _logger.LogInformation("Upgrading customer {CustomerId} to gold status, {Amount} they have spent !", @event.CustomerId, @event.SpentAmount);
            return _eventStore.CommitPublicEvent(new CustomerStatusChanged(@event.CustomerId, "gold"), context.EventSourceId);
        }

        return Task.CompletedTask;
    }
}