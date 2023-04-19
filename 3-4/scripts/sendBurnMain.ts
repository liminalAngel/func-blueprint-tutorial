import { Address, toNano } from 'ton-core';
import { Main } from '../wrappers/Main';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { Opcodes } from '../helpers/Opcodes';
import { createKeys } from '../helpers/keys';
import { sign } from 'ton-crypto';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Smc address'));

    const main = provider.open(Main.createFromAddress(address));

    const seqno = await main.getSeqno();
    const kp = await createKeys();

    await main.sendExtMessage({
        opCode: Opcodes.selfdestruct,
        seqno: seqno,
        signFunc: (buf) => sign(buf, kp.secretKey)
    });

    ui.write('Succesfully destructed!');
}