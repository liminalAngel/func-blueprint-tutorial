import { Address, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('JettonWallet address'));

    const jettonWallet = provider.open(JettonWallet.createFromAddress(address));

        await jettonWallet.sendBurn(provider.sender(), {
            value: toNano('0.2'),
            jettonAmount: toNano('50'),
            queryId: Date.now()
        });

    ui.write('Burned successfully!');
}