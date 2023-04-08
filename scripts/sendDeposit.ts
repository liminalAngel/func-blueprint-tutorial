import { Address, toNano } from 'ton-core';
import { Main } from '../wrappers/Main';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smc address'));

    const main = provider.open(Main.createFromAddress(address));

    const balanceBefore = await main.getBalance();

    await main.sendDeposit(provider.sender(), toNano('1'));

    let balanceAfter = await main.getBalance();

    let attempt = 1;
    while (balanceAfter === balanceBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        balanceAfter = await main.getBalance();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Balance increased successfully!');
}