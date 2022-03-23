using Dolittle.SDK.DependencyInversion;
using ExecutionContext = Dolittle.SDK.Execution.ExecutionContext;

public class Container : IContainer
{
    readonly IServiceProvider _provider;
    public Container(IServiceProvider provider)
        => _provider = provider;

    public object Get(Type service, ExecutionContext context)
        => _provider.GetService(service)!;

    public T Get<T>(ExecutionContext context)
        where T : class
        => _provider.GetService<T>()!;
}