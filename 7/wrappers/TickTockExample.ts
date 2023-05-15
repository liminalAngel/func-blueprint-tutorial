import { SandboxContractProvider, TickOrTock } from '@ton-community/sandbox';
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode } from 'ton-core';

export type TickTockExampleConfig = {
    dataDict: Dictionary<number, Address>
};

export function tickTockExampleConfigToCell(config: TickTockExampleConfig): Cell {
    return beginCell()
        .storeDict(config.dataDict)
    .endCell();
}

export class TickTockExample implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TickTockExample(address);
    }

    static createFromConfig(config: TickTockExampleConfig, code: Cell, workchain = -1) {
        const data = tickTockExampleConfigToCell(config);
        const init = { code, data };
        return new TickTockExample(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTickTock(provider: SandboxContractProvider, which: TickOrTock) {
        return provider.tickTock(which);
    }
}
