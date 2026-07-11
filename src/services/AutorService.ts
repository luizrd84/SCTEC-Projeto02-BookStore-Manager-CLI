import { AutorRepository } from "../repositories/AutorRepository";
import { Autor } from "../models/Autor";

class AutorService {

    constructor(
        private autorRepository: AutorRepository
    ) {
        //constructor
    }   



    async cadastrar(autor: Autor) {

        //Validações. Ver se não tem já no banco, etc

        return await this.autorRepository.cadastrar(autor);

    }




    //Conferir daqui para baixo:




    async listar() {
        return await this.autorRepository.listar();
    }

    async buscarPorNome(nome: string) {

        const autor = await this.autorRepository.buscarPorNome(nome);

        return autor;
    }

    async buscarPorId(id: number) {

        const autor = await this.autorRepository.buscarPorId(id);

        if (!autor) {
            throw new Error("Autor não encontrado.");
        }

        return autor;
    }

    async alterar(autor: Autor) {

        await this.buscarPorId(autor.id!);

        /* fazer as verificações
        if (!nome.trim()) {
            throw new Error("O nome do autor é obrigatório.");
        }*/

        return await this.autorRepository.alterar(autor);
    }

    async excluir(id: number): Promise<void> {
        await this.buscarPorId(id);

        await this.autorRepository.excluir(id);
    }



}

export default AutorService;
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