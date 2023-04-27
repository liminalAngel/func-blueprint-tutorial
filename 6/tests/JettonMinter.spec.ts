import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('JettonMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonMinter');
    });

    let blockchain: Blockchain;
    let jettonMinter: SandboxContract<JettonMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonMinter = blockchain.openContract(JettonMinter.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonMinter are ready to use
    });
});
