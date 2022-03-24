using Dolittle.SDK;
using Dolittle.SDK.Extensions.AspNet;
using Dolittle.SDK.Events.Filters;
using Dolittle.SDK.Tenancy;
using Events;
using Reactions;
using Read;

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseDolittle(_ => _
    .WithEventHorizons(_ => _
        .ForTenant(TenantId.Development, _ => _
            .FromProducerMicroservice("68abba17-2818-49e8-8e4c-2021daaff327")
            .FromProducerTenant(TenantId.Development)
            .FromProducerStream("43413d9d-fcf0-48eb-a97d-6098afb7acb0")
            .FromProducerPartition(Guid.Empty)
            .ToScope("3610abbd-96cf-4bb0-9a11-f2aa79074bbc")))
    .WithFilters(_ => _
        .CreatePublic("b28ac505-f6b3-408b-9537-7dcf99967f12").Handle((evt, context) => Task.FromResult(new PartitionedFilterResult(true, Guid.Empty)))),
    _ => _.WithRuntimeOn("localhost", 50073));

var app = builder.Build();
app.UseDolittle();

app.MapGet("/", () => "Hello World!");

app.Run();