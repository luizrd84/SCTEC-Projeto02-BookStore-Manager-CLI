import AutorController from "../controllers/AutorController";
import LivroController from "../controllers/LivroController";
import ClienteController from "../controllers/ClienteController";
import { rl } from "../utils/ConsoleUtils";

class TerminalController { 


    constructor(
        private autorController: AutorController,
        private livroController: LivroController,
        private clienteController: ClienteController
    ) {
        //constructor
    }      
    


    async inicializarConsole() {

        while (true) {

            console.clear();

            console.log("========= Bem vindo à BookStore Manager CLI =========");
            console.log("========= O que você deseja fazer? ==================")
                        
            const opcao = await rl.question(`
            1 - Autores
            2 - Livros
            3 - Clientes
            4 - Empréstimos
            5 - Sair
            Escolha: `);


             switch(opcao){
                case "1": 
                    await this.autorController.inicializarMenuAutor();
                    break;
                case "2":
                    await this.livroController.inicializarMenuLivro();
                    break;
                case "3": 
                    await this.clienteController.inicializarMenuCliente();
                    break;
                case "5":
                    rl.close();
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");
              
            }       

        }       
    }
   
    
}

export default TerminalController;

