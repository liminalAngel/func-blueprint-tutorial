import { toNano } from 'ton-core';
import { TickTockExample } from '../wrappers/TickTockExample';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const tickTockExample = provider.open(TickTockExample.createFromConfig({}, await compile('TickTockExample')));

    await tickTockExample.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(tickTockExample.address);

    // run methods on `tickTockExample`
}
