import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { JettonWallet } from '../wrappers/JettonWallet';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('JettonWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('JettonWallet');
    });

    let blockchain: Blockchain;
    let jettonWallet: SandboxContract<JettonWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        jettonWallet = blockchain.openContract(JettonWallet.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await jettonWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jettonWallet are ready to use
    });
});
