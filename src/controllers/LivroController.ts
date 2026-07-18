import { rl } from "../utils/ConsoleUtils";
import LivroService from "../services/LivroService";
import { Livro } from "../models/Livro";
import { aguardarEnter } from "../utils/ConsoleUtils";

class LivroController { 

    constructor(        
        private livroService: LivroService
    ) {
        //constructor
    }         
   
    async inicializarMenuLivro() {

        while (true) {
            console.clear();
            
            console.log("=========== Cadastro de Livross ===========");
            console.log("=========== Selecione uma das opções: =====")            
            
            const opcao = await rl.question(`
            1 - Cadastrar Livro
            2 - Alterar Livro
            3 - Deletar Livro
            4 - Listar Livros
            5 - Buscar Livro            
            6 - Voltar
            Escolha: `);

            //6 - Livros disponíveis para empréstimo
            //7 - Consulta disponibilidade por ID 

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

        let tituloValido = false;
        let tituloTexto;        
        while (tituloValido !== true) {
            tituloTexto = await rl.question("Digite o título do livro: ");
            if(tituloTexto.length > 4) {
                tituloValido = true;
            } else {
                console.log("Título inválido, digite novamente.");
            }            
        }

        let anoPublicacaoValido = false;
        let anoPublicacaoTexto = "0";        
        while (anoPublicacaoValido !== true) {
            anoPublicacaoTexto = await rl.question("Digite o ano de publicação do livro: ");
            
            const anoNumero = Number(anoPublicacaoTexto);

            if (isNaN(anoNumero)) {
                console.log("Valor digitado inválido.");
                continue;
            }

            if(anoNumero > 9999 || anoNumero < -9999) {
                console.log("Valor digitado inválido.");
                continue;
            }

            anoPublicacaoValido = true;    
        }

        let quantidadeValida = false;
        let quantidadeTexto = "0";        
        while (quantidadeValida !== true) {
            quantidadeTexto = await rl.question("Digite a quantidade do livro disponíveis: ");
            
            const quantidadeNumero = Number(quantidadeTexto);

            if (isNaN(quantidadeNumero)) {
                console.log("Quantidade digitada inválido.");
                continue;
            }
            if(quantidadeNumero > 999 || quantidadeNumero < 0) {
                console.log("Quantidade digitada inválido.");
                continue;
            }

            quantidadeValida = true;    
        }

        let autorIdValido = false;
        let autorIdTexto = "0";        
        while (autorIdValido !== true) {
            autorIdTexto = await rl.question("Digite o ID do autor: ");
            
            const autorIdNumero = Number(autorIdTexto);

            if (isNaN(autorIdNumero)) {
                console.log("Quantidade digitada inválido.");
                continue;
            }
            autorIdValido = true;    
        }
   
        const livro: Livro = {  
            titulo: tituloTexto!,
            ano_publicacao: Number(anoPublicacaoTexto!),
            quantidade: Number(quantidadeTexto!),
            autor_id: Number(autorIdTexto)
        };
        
        try {
            const result =await this.livroService.cadastrar(livro);
            if(result !== null) {
                console.log("Livro cadastrado com sucesso!");
            }
        } catch (error) {
            console.log(error);            
        }
        await aguardarEnter();
    }

    private async listar() { 
        const livros = await this.livroService.listar();

        if (livros.length === 0) {
            console.log("Nenhum livro foi encontrado.");
            await aguardarEnter();
            return;
        }

        console.log("Livros cadastrados:");
        livros.forEach((livro) => {
            console.log(`ID: ${livro.id}, Título: ${livro.titulo}, Ano publicação: ${livro.ano_publicacao}, Quantidade: ${livro.quantidade}, ID Autor: ${livro.autor_id}`);
        });

        await aguardarEnter();
    }

    private async buscar() { 
        
        console.clear();

        console.log("=========== Seleciona o tipo de busca: =====")
                        
        const opcao = await rl.question(`
            1 - Buscar por ID
            2 - Buscar por título
            Escolha: `);

        const opcaoBusca = Number(opcao);

        if (isNaN(opcaoBusca)) {
            console.log("Opção inválida.");
            return;
        }

        if(opcaoBusca === 1) {
            const idTexto = await rl.question("Digite o ID do livro: ");

            const id = Number(idTexto);

            if (isNaN(id)) {
                console.log("ID inválido.");
                await aguardarEnter();
                return;
            }

            try {
                const busca = await this.livroService.buscarPorId(id);

                if(busca === null)  {
                    console.log("Livro não encontrado.")
                } else {
                    console.clear();
                    console.log("Dados do livro pesquisado:");
                    console.log(`ID: ${busca.id}, Título: ${busca.titulo}, Ano publicação: ${busca.ano_publicacao}, Quantidade: ${busca.quantidade}, ID do autor: ${busca.autor_id}`);          
                }
                
            } catch (error) {
                console.log(error instanceof Error ? error.message : "Erro desconhecido.");
            }
            await aguardarEnter();

        } else if (opcaoBusca === 2) {            
            
            let tituloValido = false;
            let tituloTexto;        
            while (tituloValido !== true) {
                tituloTexto = await rl.question("Digite o nome do livro: ");
                if(tituloTexto.length >= 3) {
                    tituloValido = true;
                } else {
                    console.log("Digite pelo menos 3 caracteres.");
                }            
            }

            try {
                const busca = await this.livroService.buscarPorTitulo(tituloTexto!);

                console.clear();
                console.log("Retorno da pesquisa:");

                if (busca.length === 0) {
                    console.log("Nenhum livro encontrado.");
                    await aguardarEnter();
                    return;
                }

                busca.forEach((livro) => {
                    console.log(`ID: ${livro.id}, Título: ${livro.titulo}, Ano publicação: ${livro.ano_publicacao}, Quantidade: ${livro.quantidade}, ID do Autor: ${livro.autor_id} `);                              
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
        const idTexto = await rl.question("Digite o ID do livro que deseja alterar: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }
        
        try {
            const livroBusca = await this.livroService.buscarPorId(id);
        
            if(livroBusca === null) {
                console.log("Livro não encontrado.");
            } else {
                let tituloValido = false;
                let tituloTexto;        
                while (tituloValido !== true) {
                    console.log(`Título atual: ${livroBusca.titulo}`);
                    tituloTexto = await rl.question("Digite o novo título: ");
                    if(tituloTexto.length > 3) {
                        tituloValido = true;
                    } else {
                        console.log("Título inválido, digite novamente.");
                    }            
                }

                let anoPublicacaoValido = false;
                let anoPublicacaoTexto = "0";        
                while (anoPublicacaoValido !== true) {
                    console.log(`Ano publicação atual: ${livroBusca.ano_publicacao}`);
                    anoPublicacaoTexto = await rl.question("Digite o novo ano de publicação do livro: ");
                    
                    const anoNumero = Number(anoPublicacaoTexto);

                    if (isNaN(anoNumero)) {
                        console.log("Valor digitado inválido.");
                        continue;
                    }

                    if(anoNumero > 9999 || anoNumero < -9999) {
                        console.log("Valor digitado inválido.");
                        continue;
                    }

                    anoPublicacaoValido = true;    
                }

                let quantidadeValida = false;
                let quantidadeTexto = "0";        
                while (quantidadeValida !== true) {
                    console.log(`Quantidade atual: ${livroBusca.quantidade}`);
                    quantidadeTexto = await rl.question("Digite a nova quantidade do livro disponível: ");
                    
                    const quantidadeNumero = Number(quantidadeTexto);

                    if (isNaN(quantidadeNumero)) {
                        console.log("Quantidade digitada inválido.");
                        continue;
                    }
                    if(quantidadeNumero > 999 || quantidadeNumero < 0) {
                        console.log("Quantidade digitada inválido.");
                        continue;
                    }

                    quantidadeValida = true;    
                }

                let autorIdValido = false;
                let autorIdTexto = "0";        
                while (autorIdValido !== true) {
                    console.log(`ID do autor atual: ${livroBusca.autor_id}`);
                    autorIdTexto = await rl.question("Digite o novo ID do autor: ");
                    
                    const autorIdNumero = Number(autorIdTexto);

                    if (isNaN(autorIdNumero)) {
                        console.log("ID do autor digitado inválido.");
                        continue;
                    }
                    autorIdValido = true;    
                }               
        
                const livroAtualizado: Livro = {  
                    id: Number(livroBusca.id),
                    titulo: tituloTexto!,
                    ano_publicacao: Number(anoPublicacaoTexto),
                    quantidade: Number(quantidadeTexto),
                    autor_id: Number(autorIdTexto)                
                };
                
                try {
                    const result = await this.livroService.alterar(livroAtualizado);
                    if (result !== null) {
                        console.log("Livro atualizado com sucesso!");
                    }
                } catch (error) {
                    console.log(error);            
                }
            }            

        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }

    private async excluir() {

        const idTexto = await rl.question("Digite o ID do livro que deseja excluir: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }

        try {
            const result = await this.livroService.excluir(id);

            if(result !== null) {
                console.log("Livro excluído com sucesso.");
            }             
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();
    }
    

    async listarLivrosPorAutorId() {

        const idTexto = await rl.question("Digite o ID do autor: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }

        try {
            const livros = await this.livroService.listarPorAutorId(id);

            livros.forEach((livro) => {                
                console.log(`Autor: ${livro.autor}, Título: ${livro.titulo}, Ano publicação: ${livro.ano_publicacao}, Quantidade disponível: ${livro.disponiveis} de ${livro.quantidade}`);                              
            });

        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");            
        }

        await aguardarEnter();
    }
    

    async livrosDisponiveisParaEmprestimo() {
        try {
            const livros = await this.livroService.livrosDisponiveisParaEmprestimo();

            livros.forEach((livro) => {                
                console.log(`Título: ${livro.titulo}, Autor: ${livro.autor}, Ano publicação: ${livro.ano_publicacao}, Quantidade disponível: ${livro.disponiveis} de ${livro.quantidade}`);                              
            });


        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");            
        }

        await aguardarEnter();
    }

    
    async buscarDisponibilidadePorId() {
        const idTexto = await rl.question("Digite o ID do livro que deseja verificar a disponibilidade: ");

        const id = Number(idTexto);

        if (isNaN(id)) {
            console.log("ID inválido.");
            return;
        }

        try {
            const livro = await this.livroService.buscarDisponibilidadePorId(id);

            if(livro === null ) {
                console.log("Livro não encontrado.");
            } else {
                console.log(`Título: ${livro.titulo}, Autor: ${livro.autor}, Ano publicação: ${livro.ano_publicacao}, Quantidade disponível: ${livro.disponiveis} de ${livro.quantidade}`);                              
            }           
            
        } catch (error) {
            console.log(error instanceof Error ? error.message : "Erro desconhecido.");
        }

        await aguardarEnter();    
    }


}

export default LivroController;