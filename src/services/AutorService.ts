import { AutorRepository } from "../repositories/AutorRepository";
import { Autor } from "../models/Autor";

class AutorService {

    constructor(
        private autorRepository: AutorRepository
    ) {
        //constructor
    }   

    async cadastrar(autor: Autor): Promise<Autor | null> {
        
        if(autor.data_nasc === null || autor.nome === null || autor.nacionalidade === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const autorExistente = await this.autorRepository.verificaSeNomeJaExiste(autor.nome);

        if(autorExistente) {
            console.log("Já existe um autor com esse nome.");
            return null;
        }

        return await this.autorRepository.cadastrar(autor);
    }

    async listar(): Promise<Autor[]> {
        return await this.autorRepository.listar();
    }

    async buscarPorNome(nome: string): Promise<Autor[]> {
        const autor = await this.autorRepository.buscarPorNome(nome);

        return autor;
    }

    async buscarPorId(id: number): Promise<Autor | null> {
        const autor = await this.autorRepository.buscarPorId(id);

        if (!autor) {
            return null;
        }

        return autor;
    }

    async alterar(autor: Autor): Promise<Autor | null> {
        if(autor.id === null || autor.data_nasc === null || autor.nome === null || autor.nacionalidade === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const autorExistente = await this.autorRepository.verificaSeNomeJaExiste(autor.nome);

        if(autorExistente) {
            if(autorExistente.id !== autor.id) {
                console.log("Já existe um autor com esse nome.");
                return null;
            }
        }
        
        return await this.autorRepository.alterar(autor);        
    }

    async excluir(id: number): Promise<void> {
        const idExiste = await this.buscarPorId(id);

        if(idExiste === null) {
            console.log("Não foi encontrado nenhum autor com esse ID.");
            return;
        }

        await this.autorRepository.excluir(id);
    }

}

export default AutorService;
