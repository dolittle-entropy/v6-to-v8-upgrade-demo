using Dolittle.SDK.Events;

namespace Events;

[EventType("9a722c3f-6e11-4406-ac12-277173381fde")]
public record CustomerStatusChanged(string CustomerId, string Status);
