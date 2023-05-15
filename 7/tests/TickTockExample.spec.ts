import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, Dictionary, toNano } from 'ton-core';
import { TickTockExample } from '../wrappers/TickTockExample';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

describe('TickTockExample', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('TickTockExample');
    });

    let blockchain: Blockchain;
    let tickTockExample: SandboxContract<TickTockExample>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        const data = Dictionary.empty(Dictionary.Keys.Uint(256), Dictionary.Values.Address());
        data.set(Math.floor(Date.now() / 1000), randomAddress());
        data.set(Math.floor(Date.now() / 1000), randomAddress());
        data.set(Math.floor(Date.now() / 1000), randomAddress());

        tickTockExample = blockchain.openContract(TickTockExample.createFromConfig({
            dataDict: data
        }, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await tickTockExample.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tickTockExample.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tickTockExample are ready to use
    });

    it('should test tickTock', async () => {
        let res = await blockchain.runTickTock(tickTockExample.address, 'tick');
        expect(res.transactions[0].description.type).toEqual('tick-tock');

       let result = await tickTockExample.sendTickTock('tick');

       if(result.transactions[0].description.type !== 'tick-tock') 
           throw new Error('Not a tick-tock tx!');
        expect(result.transactions[0].description.isTock).toBe(false);
    });
});
