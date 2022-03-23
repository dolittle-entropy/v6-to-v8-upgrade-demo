using Dolittle.SDK.Tenancy;

var builder = WebApplication.CreateBuilder(args);

var loggerFactory = LoggerFactory.Create(_ => _.AddSimpleConsole());

var dolittleClient = Dolittle.SDK.Client
    .ForMicroservice("e8d79976-c518-4a58-953f-c883b615d229")
    .WithRuntimeOn("localhost", 50073)
    .WithLogging(loggerFactory)
    .Build();

builder.Host.ConfigureServices(_ => _
    .AddSingleton(dolittleClient)
    .AddSingleton<ILoggerFactory>(loggerFactory));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

var eventStore = app.Services.GetRequiredService<Dolittle.SDK.Client>().EventStore.ForTenant(TenantId.Development);
await eventStore
    .Commit(_ => _.CreateEvent(new DumbEvent()).FromEventSource("02ce336a-cb2e-473c-9f9b-3f919070d761").WithEventType("956378bf-d972-487e-b5dc-fc90d66bc2b2"));


await Task.WhenAll(
    app.RunAsync(),
    dolittleClient.Start());

record DumbEvent();