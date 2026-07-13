import { LivroRepository } from "../repositories/LivroRepository";
import { Livro } from "../models/Livro";

class LivroService {

    constructor(
        private livroRepository: LivroRepository
    ) {
        //constructor
    }   

    async cadastrar(livro: Livro) {
        //Validações. 
        // - Ver se não tem já no banco, etc

        return await this.livroRepository.cadastrar(livro);
    }

    async listar() {
        return await this.livroRepository.listar();
    }

    async buscarPorTitulo(titulo: string) {

        const livro = await this.livroRepository.buscarPorTitulo(titulo);

        return livro;
    }

    async buscarPorId(id: number) {

        const livro = await this.livroRepository.buscarPorId(id);

        if (!livro) {
            throw new Error("Livro não encontrado.");
        }

        return livro;
    }

    async alterar(livro: Livro) {

        await this.buscarPorId(livro.id!);

        return await this.livroRepository.alterar(livro);
    }

    async excluir(id: number): Promise<void> {
        await this.buscarPorId(id);

        await this.livroRepository.excluir(id);
    }

}

export default LivroService;
