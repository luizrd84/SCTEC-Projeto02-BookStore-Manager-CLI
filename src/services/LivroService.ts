import { LivroRepository } from "../repositories/LivroRepository";
import { Livro } from "../models/Livro";
import { LivroDisponivelDTO } from "../models/DTOs/LivroDisponivelDTO";

class LivroService {

    constructor(
        private livroRepository: LivroRepository
    ) {
        //constructor
    }   

    async cadastrar(livro: Livro): Promise<Livro | null> {
        if(livro.titulo === null || livro.ano_publicacao === null || livro.quantidade === null || livro.autor_id === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const tituloExistente = await this.livroRepository.verificaSeTituloJaExiste(livro.titulo);

        if(tituloExistente) {
            console.log("Já existe um livro com esse título.");
            return null;
        }

        return await this.livroRepository.cadastrar(livro);
    }

    async listar(): Promise<Livro[]> {
        return await this.livroRepository.listar();
    }

    async buscarPorTitulo(titulo: string): Promise<Livro[]> {
        const livro = await this.livroRepository.buscarPorTitulo(titulo);

        return livro;
    }

    async buscarPorId(id: number): Promise<Livro | null> {
        const livro = await this.livroRepository.buscarPorId(id);

        if (!livro) {
            return null;
        }

        return livro;
    }

    async alterar(livro: Livro): Promise<Livro | null> {
        if(livro.titulo === null || livro.ano_publicacao === null || livro.quantidade === null || livro.autor_id === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const tituloExistente = await this.livroRepository.verificaSeTituloJaExiste(livro.titulo);

        if(tituloExistente) {
            if(tituloExistente.id !== livro.id) {
                console.log("Já existe um livro com esse título.");
                return null;
            }
        }

        return await this.livroRepository.alterar(livro);
    }

    async excluir(id: number): Promise<void> {
        const idExiste = await this.buscarPorId(id);

        if(idExiste === null) {
            console.log("Não foi encontrado nenhum livro com esse ID.");
            return;
        }

        await this.livroRepository.excluir(id);
    }

 
    async livrosDisponiveisParaEmprestimo(): Promise<LivroDisponivelDTO[]> {
        return await this.livroRepository.livrosDisponiveisParaEmprestimo();
    }

    async listarPorAutorId(id: number): Promise<LivroDisponivelDTO[]> {
        return await this.livroRepository.listarPorAutorId(id);
    }

    async buscarDisponibilidadePorId(id: number): Promise<LivroDisponivelDTO | null> {
        return await this.livroRepository.buscarDisponibilidadePorId(id);
    }

}

export default LivroService;
