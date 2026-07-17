import AutorController from "../controllers/AutorController";
import LivroController from "../controllers/LivroController";
import ClienteController from "../controllers/ClienteController";
import EmprestimoController from "../controllers/EmprestimoController";
import { rl } from "../utils/ConsoleUtils";

class TerminalController { 


    constructor(
        private autorController: AutorController,
        private livroController: LivroController,
        private clienteController: ClienteController,
        private emprestimoController: EmprestimoController
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
            5 - Relatórios            
            6 - Sair
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
                case "4":
                    await this.emprestimoController.inicializarMenuEmprestimo();
                    break;
                case "5":
                    await this.inicializarMenuRelatorios();
                    break;
                case "6":
                    rl.close();
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");
              
            }       

        }       
    }

    async inicializarMenuRelatorios() {

        while (true) {
            console.clear();
            
            console.log("=========== Relatórios disponíveis ========");
            console.log("=========== Selecione uma das opções: =====")            
            
            const opcao = await rl.question(`
                1 - Listar Livros disponíveis para empréstimo
                2 - Listar Livros com Empréstimo em aberto
                3 - Listar Livros com Empréstimos finalizados
                4 - Consulta disponibilidade de um Livro por ID
                5 - Listar Empréstimos por ID do Cliente
                6 - Listar Empréstimos por ID do Livro
                7 - Listar Empréstimos atrasados                
                8 - Listar Livros por ID do Autor
                9 - Listar Clientes com empréstimos ativos
                10 - Voltar
            Escolha: `);

            /*
            1 - Listar Livros disponíveis - fazer OK - é o 1
            2 - Listar Livros emprestados (Não devolvidos) - fazer - ok  é o 
            3 - Listar Livros emprestados (Devolvidos) - fazer - ok finalizados
           falta 4 - Listar Livros por ID do Autor
            5 - Listar Empréstimos por ID do Livro + quantidade
            6 - Listar Clientes com empréstimos ativos
            os que já fiz:
            6 - Livros disponíveis para empréstimo -> mesmo que o 1 acima ou esse mostra todos da biblioteca? - o outro é o listar normal
            7 - Consulta disponibilidade por ID ???? do livro deve ser, confirmar
            5 - Listar Empréstimos por ID do Cliente
            6 - Listar Empréstimos por ID do Livro
            7 - Listar Empréstimos em aberto
            8 - Listar Empréstimos atrasados
            3 - Deletar Autor
            4 - Listar Autores
            5 - Buscar Autor
            */

            switch(opcao){

                    
                case "1": 
                    await this.livroController.livrosDisponiveisParaEmprestimo();
                    break;
                case "2": 
                    await this.emprestimoController.listarEmAberto(); 
                    break;
                case "3":
                    await this.emprestimoController.listarEmprestimosFinalizados(); 
                    break;                
                case "4":
                    await this.livroController.buscarDisponibilidadePorId(); 
                    break;                    
                case "5":
                    await this.emprestimoController.listarPorCliente();
                    break;
                case "6":
                    await this.emprestimoController.listarPorLivro();
                    break;                
                case "7":
                    await this.emprestimoController.listarAtrasados();
                    break;
                case "8":
                    await this.livroController.listarLivrosPorAutorId();
                    break;
                case "9":
                    await this.emprestimoController.listarClientesComEmprestimosEmAberto();
                    break;        
                case "10":
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");   
            }     
        }       
    }
   
    
}

export default TerminalController;

