import { AutorRepository } from "../repositories/AutorRepository";
import { Autor } from "../models/Autor";

class AutorService {

    constructor(
        private autorRepository: AutorRepository
    ) {
        //constructor
    }   

    async cadastrar(autor: Autor) {

        //Validações. 
        // - Ver se não tem já no banco, etc

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
            throw new Error("Autor não encontrado.");
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
