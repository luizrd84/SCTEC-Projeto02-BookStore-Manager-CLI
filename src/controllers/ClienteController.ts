import { rl } from "../utils/ConsoleUtils";
import ClienteService from "../services/ClienteService";
import { Cliente } from "../models/Cliente";
import { aguardarEnter } from "../utils/ConsoleUtils";
import { ClientBase } from "pg";

class ClienteController { 

    constructor(        
        private clienteService: ClienteService
    ) {
        //constructor
    }         
   
    async inicializarMenuCliente() {

        while (true) {
            console.clear();
            
            console.log("=========== Cadastro de Clientes ===========");
            console.log("=========== Selecione uma das opções: =====")            
            
            const opcao = await rl.question(`
            1 - Cadastrar Cliente
            2 - Alterar Cliente
            3 - Deletar Cliente
            4 - Listar Clientes
            5 - Buscar Cliente
            6 - Voltar
            Escolha: `);

            switch(opcao){
                case "1": 
                    await this.cadastrar();
                    break;
                case "2":
                    await this.alterar();
                    break;
                case "3":
                    await this.excluir();
                    break;
                case "4":
                    await this.listar();
                    break;
                case "5":
                    await this.buscar();
                    break;
                case "6":
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");   
            }     
        }       
    }

    private async cadastrar() { 

        let nomeValido = false;
        let nomeTexto;        
        while (nomeValido !== true) {
            nomeTexto = await rl.question("Digite o nome do cliente: ");
            if(nomeTexto.length > 4) {
                nomeValido = true;
            } else {
                console.log("Nome inválido, digite novamente.");
            }            
        }

        let emailValido = false;
        let emailTexto;        
        while (emailValido !== true) {
            emailTexto = await rl.question("Digite o email do cliente: ");
            if(this.verificaEmailValido(emailTexto)) {
                emailValido = true;
            } else {
                console.log("E-mail inválido, digite novamente.");
            }            
        }

        let telefoneValido = false;
        let telefoneTexto;        
        while (telefoneValido !== true) {
            telefoneTexto = await rl.question("Digite o telefone do cliente com o DDD (apenas números): ");
            if(this.verificaTelefoneValido(telefoneTexto)) {
                telefoneValido = true;
            } else {
                console.log("Telefone inválido, digite novamente.");
            }            
        }
   
        const cliente: Cliente = {  
            nome: nomeTexto!,
            email: emailTexto!,
            telefone: this.formatarTelefone(telefoneTexto!),
            criado_em: new Date()
        };
        
        try {
            await this.clienteService.cadastrar(cliente);
            console.log("Cliente cadastrado com sucesso!");
        } catch (error) {
            console.log(error);            
        }
        await aguardarEnter();
    }

    verificaEmailValido(email: string): boolean {
        const partes = email.split("@");

        if (partes.length !== 2) {
            return false;
        }

        const [usuario, dominio] = partes;

        return usuario!.length > 0 &&
            dominio!.includes(".") &&
            dominio!.indexOf(".") > 0 &&
            !dominio!.endsWith(".");
    }

    verificaTelefoneValido(telefone: string): boolean {
        if (!/^\d+$/.test(telefone)) {
            return false; 
        }

        return telefone.length === 10 || telefone.length === 11;
    }

    formatarTelefone(telefone: string): string {
        const ddd = telefone.slice(0, 2);

        if (telefone.length === 10) {
            const parte1 = telefone.slice(2, 6);
            const parte2 = telefone.slice(6);

            return `(${ddd}) ${parte1}-${parte2}`;
        }

        const parte1 = telefone.slice(2, 7);
        const parte2 = telefone.slice(7);

        return `(${ddd}) ${parte1}-${parte2}`;
    }

    private async listar() { 
        const clientes = await this.clienteService.listar();

        if (clientes.length === 0) {
            console.log("Nenhum cliente foi encontrado.");
            await aguardarEnter();
            return;
        }

        console.log("Clientes cadastrados:");
        clientes.forEach((cliente) => {
            console.log(`ID: ${cliente.id}, Nome: ${cliente.nome}, E-mail: ${cliente.email}, Telefone: ${cliente.telefone}, Criado em: ${cliente.criado_em.toLocaleDateString("pt-BR")}
            ----------------------------`);
        });

        await aguardarEnter();
    }

    private async buscar() { 
        
        console.clear();

        console.log("=========== Seleciona o tipo de busca: =====")
                        
        const opcao = await rl.question(`
            1 - Buscar por ID
            2 - Buscar por nome            
            Escolha: `);

        const opcaoBusca = Number(opcao);

        if (isNaN(opcaoBusca)) {
            console.log("Opção inválida.");
            return;
        }

        if(opcaoBusca === 1) {
            const idTexto = await rl.question("Digite o ID do cliente: ");

            const id = Number(idTexto);

            if (isNaN(id)) {
                console.log("ID inválido.");
                await aguardarEnter();
                return;
            }

            try {
                const busca = await this.clienteService.buscarPorId(id);

                console.clear();
                console.log("Dados do cliete pesquisado:");
                console.log(`ID: ${busca.id}, Nome: ${busca.nome}, E-mail: ${busca.email}, Telefone: ${busca.telefone}, Criado em: ${busca.criado_em.toLocaleDateString("pt-BR")}`);          

            } catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
            await aguardarEnter();

        } else if (opcaoBusca === 2) {            
            
            let nomeValido = false;
            let nomeTexto;        
            while (nomeValido !== true) {
                nomeTexto = await rl.question("Digite o nome do cliente: ");
                if(nomeTexto.length >= 3) {
                    nomeValido = true;
                } else {
                    console.log("Digite pelo menos 3 caracteres.");
                }            
            }

            try {
                const busca = await this.clienteService.buscarPorNome(nomeTexto!);

                console.clear();
                console.log("Retorno da pesquisa:");

                if (busca.length === 0) {
                    console.log("Nenhum cliente encontrado.");
                    await aguardarEnter();
                    return;
                }

                busca.forEach((cliente) => {
                    console.log(`ID: ${cliente.id}, Nome: ${cliente.nome}, E-mail: ${cliente.email}, Telefone: ${cliente.telefone}, Criado em: ${cliente.criado_em.toLocaleDateString("pt-BR")}`);                              
                });                

            } catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
            await aguardarEnter();

        } else {
            console.log("Opção inválida.");
            return;
        }
    }

    private async alterar() { 
        const idTexto = await rl.question("Digite o ID do cliente que deseja alterar: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }
        
        try {
            const clienteBusca = await this.clienteService.buscarPorId(id);


            let nomeValido = false;
            let nomeTexto;        
            while (nomeValido !== true) {
                console.log(`Nome atual: ${clienteBusca.nome}`);
                nomeTexto = await rl.question("Digite o nome do cliente: ");
                if(nomeTexto.length > 4) {
                    nomeValido = true;
                } else {
                    console.log("Nome inválido, digite novamente.");
                }            
            }

            let emailValido = false;
            let emailTexto;        
            while (emailValido !== true) {
                console.log(`E-mail atual: ${clienteBusca.email}`);
                emailTexto = await rl.question("Digite o email do cliente: ");
                if(this.verificaEmailValido(emailTexto)) {
                    emailValido = true;
                } else {
                    console.log("E-mail inválido, digite novamente.");
                }            
            }

            let telefoneValido = false;
            let telefoneTexto;        
            while (telefoneValido !== true) {
                console.log(`Telefone atual: ${clienteBusca.telefone}`);
                telefoneTexto = await rl.question("Digite o telefone do cliente com o DDD (apenas números): ");
                if(this.verificaTelefoneValido(telefoneTexto)) {
                    telefoneValido = true;
                } else {
                    console.log("Telefone inválido, digite novamente.");
                }            
            }
    
            const clienteAtualizado: Cliente = {  
                id: clienteBusca.id!,
                nome: nomeTexto!,
                email: emailTexto!,
                telefone: this.formatarTelefone(telefoneTexto!),
                criado_em: clienteBusca.criado_em
            };

            
            try {
                await this.clienteService.alterar(clienteAtualizado);
                console.log("Cliente atualizado com sucesso!");
            } catch (error) {
                console.log(error);            
            }

        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }

    private async excluir() {

        const idTexto = await rl.question("Digite o ID do cliente que deseja excluir: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }

        try {
            await this.clienteService.excluir(id);

            console.log("Cliente excluído com sucesso.");
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }
    
}

export default ClienteController;