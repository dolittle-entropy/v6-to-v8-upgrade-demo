using Dolittle.SDK.Events;

namespace Events;

[EventType("2921cfe0-3415-48ee-bfad-5564f127f1f8")]
public record CustomerTotalSpendingChanged(string CustomerId, decimal PreviousSpentAmount, decimal SpentAmount);