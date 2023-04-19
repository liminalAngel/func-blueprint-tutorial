import { Address, beginCell, DictionaryValue } from "ton-core";

export type CollectionMint = {
    amount: bigint;
    index: number;
    ownerAddress: Address;
    content: string;
};

export const MintValue: DictionaryValue<CollectionMint> = {
    serialize(src, builder) {
        const nftContent = beginCell();
        nftContent.storeBuffer(Buffer.from(src.content));

        const nftMessage = beginCell();

        nftMessage.storeAddress(src.ownerAddress);
        nftMessage.storeRef(nftContent);

        builder.storeCoins(src.amount);
        builder.storeRef(nftMessage);
    },

    parse() {
        return {
            amount: 0n,
            index: 0,
            content: '',
            ownerAddress: new Address(0, Buffer.from([]))
        }
    }
};