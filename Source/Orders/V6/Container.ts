import { Client } from '@dolittle/sdk';
import { IContainer } from '@dolittle/sdk.common';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { Constructor } from '@dolittle/types';

import { CustomerStatusElevator } from './Reactions';

export class Container implements IContainer {
    static client: Client;
    
    get(service: Constructor<any>, executionContext: ExecutionContext) {
        if (Container.client === undefined)
        {
            throw new Error('The client has not been set in the Container');
        }

        if (service !== CustomerStatusElevator)
        {
            throw new Error(`The container can only make instances of ${CustomerStatusElevator.name}`)
        }
        
        return new CustomerStatusElevator(Container.client);
    }
}
