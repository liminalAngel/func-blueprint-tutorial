import { mnemonicToPrivateKey } from "ton-crypto";
import { mnemonics } from "./config";

export async function createKeys() {
    let words = Array(mnemonics); 
    return mnemonicToPrivateKey(words);
}