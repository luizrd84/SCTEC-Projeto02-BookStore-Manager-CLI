import { rl } from "../utils/ConsoleUtils";
import AutorService from "../services/AutorService";
import { Autor } from "../models/Autor";
import { aguardarEnter } from "../utils/ConsoleUtils";

class AutorController { 

    constructor(        
        private autorService: AutorService
    ) {
        //constructor
    }         
   
    async inicializarMenuAutor() {

        while (true) {
            console.clear();
            
            console.log("=========== Cadastro de Autores ===========");
            console.log("=========== Selecione uma das opções: =====")            
            
            const opcao = await rl.question(`
            1 - Cadastrar Autor
            2 - Alterar Autor
            3 - Deletar Autor
            4 - Listar Autores
            5 - Buscar Autor
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
            nomeTexto = await rl.question("Digite o nome do autor: ");
            if(nomeTexto.length > 4) {
                nomeValido = true;
            } else {
                console.log("Nome inválido, digite novamente.");
            }            
        }

        let nacionalidadeValida = false;
        let nacionalidadeTexto;        
        while (nacionalidadeValida !== true) {
            nacionalidadeTexto = await rl.question("Digite a nacionalidade do autor: ");
            if(nacionalidadeTexto.length > 4) {
                nacionalidadeValida = true;
            } else {
                console.log("Nacionalidade inválida, digite novamente.");
            }            
        }

        let dataNascValida = false;
        let dataNascTexto;   
        let data_nasc;     
        while (dataNascValida !== true) {
            dataNascTexto = await rl.question("Digite a data de nascimento do autor (DD/MM/AAAA): ");
            
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!regex.test(dataNascTexto)) {
                console.log("Formato inválido. Use DD/MM/AAAA.");
                continue;
            }

            const [dia, mes, ano] = dataNascTexto.split("/").map(Number);

            data_nasc = new Date(ano!, mes! - 1, dia);

            if (
                data_nasc.getFullYear() !== ano ||
                data_nasc.getMonth() !== mes! - 1 ||
                data_nasc.getDate() !== dia
            ) {
                console.log("Data inválida.");
                continue;
            }

            dataNascValida = true;            
        }                
 
        const autor: Autor = {  
            nome: nomeTexto!,
            nacionalidade:nacionalidadeTexto!,
            data_nasc: data_nasc!
        };
        
        try {
            await this.autorService.cadastrar(autor);
            console.log("Autor cadastrado com sucesso!");
        } catch (error) {
            console.log(error);            
        }
        await aguardarEnter();
    }

    private async listar() { 
        const autores = await this.autorService.listar();

        if (autores.length === 0) {
            console.log("Nenhum autor foi encontrado.");
            await aguardarEnter();
            return;
        }

        console.log("Autores cadastrados:");
        autores.forEach((autor) => {
            console.log(`ID: ${autor.id}, Nome: ${autor.nome}, Nacionalidade: ${autor.nacionalidade}, Data Nasc.: ${autor.data_nasc.toLocaleDateString("pt-BR")}
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
            const idTexto = await rl.question("Digite o ID do autor: ");

            const id = Number(idTexto);

            if (isNaN(id)) {
                console.log("ID inválido.");
                await aguardarEnter();
                return;
            }

            try {
                const busca = await this.autorService.buscarPorId(id);

                console.clear();
                console.log("Dados do autor pesquisado:");
                console.log(`ID: ${busca.id}, Nome: ${busca.nome}, Nacionalidade: ${busca.nacionalidade}, Data Nasc.: ${busca.data_nasc.toLocaleDateString("pt-BR")}`);          

            } catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
            await aguardarEnter();

        } else if (opcaoBusca === 2) {            
            
            let nomeValido = false;
            let nomeTexto;        
            while (nomeValido !== true) {
                nomeTexto = await rl.question("Digite o nome do autor: ");
                if(nomeTexto.length >= 3) {
                    nomeValido = true;
                } else {
                    console.log("Digite pelo menos 3 caracteres.");
                }            
            }

            try {
                const busca = await this.autorService.buscarPorNome(nomeTexto!);

                console.clear();
                console.log("Retorno da pesquisa:");

                if (busca.length === 0) {
                    console.log("Nenhum autor encontrado.");
                    await aguardarEnter();
                    return;
                }

                busca.forEach((autor) => {
                    console.log(`ID: ${autor.id}, Nome: ${autor.nome}, Nacionalidade: ${autor.nacionalidade}, Data Nasc.: ${autor.data_nasc.toLocaleDateString("pt-BR")}`);                              
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
        const idTexto = await rl.question("Digite o ID do autor que deseja alterar: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }
        
        try {
            const autorBusca = await this.autorService.buscarPorId(id);
        
            let nomeValido = false;
            let nomeTexto;        
            while (nomeValido !== true) {
                console.log(`Nome atual: ${autorBusca.nome}`);
                nomeTexto = await rl.question("Digite o novo nome: ");
                if(nomeTexto.length > 4) {
                    nomeValido = true;
                } else {
                    console.log("Nome inválido, digite novamente.");
                }            
            }

            let nacionalidadeValida = false;
            let nacionalidadeTexto;        
            while (nacionalidadeValida !== true) {
                console.log(`Nacionalidade atual: ${autorBusca.nacionalidade}`);
                nacionalidadeTexto = await rl.question("Digite a nova nacionalidade: ");
                if(nacionalidadeTexto.length > 4) {
                    nacionalidadeValida = true;
                } else {
                    console.log("Nacionalidade inválida, digite novamente.");
                }            
            }

            let dataNascValida = false;
            let dataNascTexto;   
            let data_nasc;     
            while (dataNascValida !== true) {
                console.log(`Data de Nascimento atual: ${autorBusca.data_nasc.toLocaleDateString("pt-BR")}`);
                dataNascTexto = await rl.question("Digite a nova data de nascimento (DD/MM/AAAA): ");
                
                const regex = /^\d{2}\/\d{2}\/\d{4}$/;

                if (!regex.test(dataNascTexto)) {
                    console.log("Formato inválido. Use DD/MM/AAAA.");
                    continue;
                }

                const [dia, mes, ano] = dataNascTexto.split("/").map(Number);

                data_nasc = new Date(ano!, mes! - 1, dia);

                if (
                    data_nasc.getFullYear() !== ano ||
                    data_nasc.getMonth() !== mes! - 1 ||
                    data_nasc.getDate() !== dia
                ) {
                    console.log("Data inválida.");
                    continue;
                }

                dataNascValida = true;            
            }                
    
            const autorAtualizado: Autor = {  
                id: Number(autorBusca.id),
                nome: nomeTexto!,
                nacionalidade:nacionalidadeTexto!,
                data_nasc: data_nasc!
            };
            
            try {
                await this.autorService.alterar(autorAtualizado);
                console.log("Autor atualizado com sucesso!");
            } catch (error) {
                console.log(error);            
            }

        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }

    private async excluir() {

        const idTexto = await rl.question("Digite o ID do autor que deseja excluir: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }

        try {
            await this.autorService.excluir(id);

            console.log("Autor excluído com sucesso.");
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }
    
}

export default AutorController;