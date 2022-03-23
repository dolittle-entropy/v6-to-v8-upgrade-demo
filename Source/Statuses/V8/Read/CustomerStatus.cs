
using Dolittle.SDK.Projections;
using Events;

namespace Read;

[Projection("9ce60f78-79f3-4937-aa35-d49373ee77b2")]
public class CustomerStatus
{
    public string Status = "wood";

    [KeyFromEventSource]
    public void On(CustomerStatusChanged @event, ProjectionContext context)
    {
        Status = @event.Status;
    }
}