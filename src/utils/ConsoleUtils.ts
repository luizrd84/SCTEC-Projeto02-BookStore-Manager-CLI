import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

export const rl = readline.createInterface({
    input,
    output
});

export async function aguardarEnter() {
    await rl.question("\nPressione ENTER para continuar...");
}