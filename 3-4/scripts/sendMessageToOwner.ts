import { Address, toNano } from 'ton-core';
import { Main } from '../wrappers/Main';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smc address'));

    const main = provider.open(Main.createFromAddress(address));

    await main.sendMessageToOwner(provider.sender(), {
        value: toNano('0.05')
    });

    ui.write('Succesfully transfered!');
}