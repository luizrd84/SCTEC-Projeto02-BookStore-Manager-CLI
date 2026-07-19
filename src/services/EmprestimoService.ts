import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { Emprestimo } from "../models/Emprestimo";
import { LivroRepository } from "../repositories/LivroRepository";
import { EmprestimoDetalhadoDTO } from "../models/DTOs/EmprestimoDetalhadoDTO";


class EmprestimoService {

    constructor(
        private emprestimoRepository: EmprestimoRepository,
        private livroRepository: LivroRepository
    ) {
        //constructor
    }   

    async cadastrar(emprestimo: Emprestimo): Promise<Emprestimo | null> {
        if(emprestimo.data_emprestimo === null || emprestimo.cliente_id === null || emprestimo.data_prevista_devolucao === null) {
            console.log("Dados inválidos.");
            return null;
        }

        return await this.emprestimoRepository.cadastrar(emprestimo);
    }
   
    async adicionarLivro(emprestimoId: number, livroId: number) {  
        const livroExistente = await this.livroRepository.buscarPorId(livroId);

        if (!livroExistente) {
            console.log("Livro não encontrado.");
            return null;
        }

        const disponibilidade = await this.livroRepository.buscarDisponibilidadePorId(livroId);

        if (!disponibilidade || disponibilidade.disponiveis <= 0) {
            console.log("Livro indisponível para empréstimo.");
            return null;
        }

        return await this.emprestimoRepository.adicionarLivro(emprestimoId, livroId);
    }

    async devolver (emprestimo: Emprestimo): Promise<Emprestimo | null>  {
        const verificaSeNaoDevolvido = await this.buscarPorId(emprestimo.id!);

        if(verificaSeNaoDevolvido && verificaSeNaoDevolvido.data_devolucao !== null) {
            console.log("Empréstimo já foi devolvido.");
            return null;
        } 

        return await this.emprestimoRepository.devolver(emprestimo);
    }
    
    async buscarPorId(id: number): Promise<EmprestimoDetalhadoDTO | null> {
        const emprestimo = await this.emprestimoRepository.buscarPorId(id);

        if (!emprestimo) {
            return null;
        }
        
        return emprestimo;
    }

    async listar(): Promise<EmprestimoDetalhadoDTO[]> {
        return await this.emprestimoRepository.listar();
    }

    async listarPorCliente(clienteId: number): Promise<EmprestimoDetalhadoDTO[]> {
        return await this.emprestimoRepository.listarPorCliente(clienteId);
    }

    async listarPorLivro(livroId: number): Promise<EmprestimoDetalhadoDTO[]> {
        return await this.emprestimoRepository.listarPorLivro(livroId);
    }
    
    async listarEmAberto(): Promise<EmprestimoDetalhadoDTO[]>  {
        return await this.emprestimoRepository.listarEmAberto();
    }   

    async listarClientesComEmprestimosEmAberto(): Promise<EmprestimoDetalhadoDTO[]>  {
        return await this.emprestimoRepository.listarClientesComEmprestimosEmAberto();
    }   
    
    async listarEmprestimosFinalizados(): Promise<EmprestimoDetalhadoDTO[]>  {
        return await this.emprestimoRepository.listarEmprestimosFinalizados();
    }  

    async listarAtrasados(): Promise<EmprestimoDetalhadoDTO[]> {
        return await this.emprestimoRepository.listarAtrasados();
    }   

}

export default EmprestimoService;
