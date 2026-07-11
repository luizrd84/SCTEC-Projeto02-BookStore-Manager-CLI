import AutorController from "../controllers/AutorController";
import { rl } from "../utils/ConsoleUtils";

class TerminalController { 


    constructor(
        private autorControle: AutorController
    ) {
        //constructor
    }      
    


    async inicializarConsole() {

        while (true) {

            console.clear();

            console.log("Bem vindo a Pokédex");
            console.log("O que você deseja fazer?")
            console.log("==== MENU ====");
            
            const opcao = await rl.question(`
            1 - Autores
            2 - Livros
            3 - Clientes
            4 - Empréstimos
            5 - Sair
            Escolha: `);


             switch(opcao){
                case "1": 
                    await this.autorControle.inicializarMenuAutor();
                    break;
                case "5":
                    rl.close();
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");
              
            }       

        }       
    }

    /*
    private rl = readline.createInterface({
        input,
        output
    });

    listarCatalogo(): void { 
        this.catalogo.listar();
    } 

    limparCatalogo(): void {
        this.catalogo.limparCatalogo();
        console.log("Catálogo limpo com sucesso.");
    }

    async buscarPokemon(nomeOuId: string): Promise<PokemonResumo | null> { 
        
        if(nomeOuId === "" || nomeOuId === null) {
            return null;
        }

        try {
            const busca = await this.service.buscarPokemon(nomeOuId);
            if (busca !== null) {
                this.adicionarAoCatalogo(busca);
            }        

            return busca;
        } catch (erro) {
            console.log(erro);
            return null;
        }            
    }
 
    async perguntarQualPokemonExcluir(): Promise<string> {
        return await this.rl.question("Digite o número do pokémon que deseja excluir: ");
    }

    async perguntarQualPokemonBuscar(): Promise<string> {
        return await this.rl.question("Digite o nome ou número do Pokémon que deseja buscar: ");
    }

    fechar(): void {
        this.rl.close();
    }

    adicionarAoCatalogo(pokemon: PokemonResumo): PokemonResumo[] | null { 
        if(pokemon === null) {
            throw new CustomError("[ERRO] Dados inválidos.");
        }

        return this.catalogo.adicionar(pokemon);            
    }

    removerDoCatalogo( id: number ): PokemonResumo[] | null {
        return this.catalogo.remover(id);
    }
  

    //isso poderia ser separado... o resto não
    async inicializarConsole() {

        console.log("Bem vindo a Pokédex");
        console.log("O que você deseja fazer?")


        while (true) {

            const opcao = await this.rl.question(`
            1 - Buscar Pokémon
            2 - Listas os Pokémons pesquisados
            3 - Remover um Pokémon da lista
            4 - Limpar lista
            5 - Sair
            Escolha: `);

            switch(opcao) {
                case "1" : 
                    const busca = await this.perguntarQualPokemonBuscar();
                    await this.buscarPokemon(busca);                    
                    continue;
                case "2" : 
                    this.listarCatalogo();
                    break;
                case "3" :
                    const excluir = await this.perguntarQualPokemonExcluir();
                    const numero = Number(excluir);
                    if(Number.isInteger(numero)) {
                        await this.removerDoCatalogo(numero);
                    } else {
                        console.log("Entrada inválida!");
                    }
                    break;
                case "4" :
                    this.limparCatalogo();
                    break;
                case "5" :
                    console.log("Até logo.");
                    this.fechar();
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");
            }                
        }             

    } */
    
}

export default TerminalController;


/*

class CatalogoPokemon { 
    private pokemons: PokemonResumo[] = []; 
    private textFormatter = new TextFormatter();
    

    adicionar(pokemon: PokemonResumo): PokemonResumo[] | null { 
        const jaExiste = this.pokemons.some((item) => {
            return item.id === pokemon.id             
        }); 
        
        if (jaExiste) { 
            console.log(`[AVISO] ${pokemon.nome} já está no catálogo.`); 
            return null; 
        } 
        
        this.pokemons.push(pokemon); 
        console.log(`[OK] ${pokemon.nome} adicionado ao catálogo.`); 

        return this.pokemons;
    } 
    
    listar(): void { 
        if (this.pokemons.length === 0) {
            console.log("[AVISO] Catálogo vazio."); 
            return; 
        } 

        console.log("[Exibindo os pokémons registrados no catálogo]");
        
        this.pokemons.forEach((pokemon) => { 
            console.log(this.textFormatter.getBoxedPokemon(pokemon));
        }); 
    } 
    
    remover(id: number): PokemonResumo[] | null { 
        const existe = this.pokemons.some((pokemon) => {
            return pokemon.id === id            
        })        
        
        if (!existe) { 
            console.log("[AVISO] Nenhum Pokémon encontrado com esse ID."); 
            return null; 
        } 
        
        this.pokemons = this.pokemons.filter((pokemon) => {
            return pokemon.id !== id            
        }); 
        
        console.log("[OK] Pokémon removido do catálogo."); 

        return this.pokemons;
    } 

    limparCatalogo() {
        this.pokemons = [];
    }

}

export default CatalogoPokemon;
*/