using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Filters;
using Dolittle.SDK.Tenancy;
using Events;
using Reactions;
using Read;

var builder = WebApplication.CreateBuilder(args);

var loggerFactory = LoggerFactory.Create(_ => _.AddSimpleConsole());

var dolittleClient = Dolittle.SDK.Client
    .ForMicroservice("e8d79976-c518-4a58-953f-c883b615d229")
    .WithRuntimeOn("localhost", 50073)
    .WithLogging(loggerFactory)
    .WithEventHorizons(_ => _
        .ForTenant(TenantId.Development, _ => _
            .FromProducerMicroservice("68abba17-2818-49e8-8e4c-2021daaff327")
            .FromProducerTenant(TenantId.Development)
            .FromProducerStream("43413d9d-fcf0-48eb-a97d-6098afb7acb0")
            .FromProducerPartition(Guid.Empty)
            .ToScope("3610abbd-96cf-4bb0-9a11-f2aa79074bbc")))
    .WithEventHandlers(_ => _
        .RegisterEventHandler<CustomerStatusElevator>())
    .WithEventTypes(_ => _
        .Register<CustomerStatusChanged>()
        .Register<CustomerTotalSpendingChanged>())
    .WithProjections(_ => _
        .RegisterProjection<CustomerStatus>())
    .WithFilters(_ => _
        .CreatePublicFilter("b28ac505-f6b3-408b-9537-7dcf99967f12", _ => _.Handle((evt, context) => Task.FromResult(new PartitionedFilterResult(true, Guid.Empty)))))
    .Build();

builder.Host.ConfigureServices(_ => _
    .AddSingleton(dolittleClient)
    .AddSingleton<ILoggerFactory>(loggerFactory)
    .AddTransient<CustomerStatusElevator>());

var app = builder.Build();

dolittleClient.WithContainer(new Container(app.Services));

app.MapGet("/", () => "Hello World!");

await Task.WhenAll(
    app.RunAsync(),
    dolittleClient.Start());
