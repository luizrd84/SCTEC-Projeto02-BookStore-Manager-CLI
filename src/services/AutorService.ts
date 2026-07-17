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
            return null;
        }

        return autor;
    }

    async alterar(autor: Autor) {
        await this.buscarPorId(autor.id!);

        return await this.autorRepository.alterar(autor);
    }

    async excluir(id: number): Promise<void> {
        await this.buscarPorId(id);

        await this.autorRepository.excluir(id);
    }

}

export default AutorService;
