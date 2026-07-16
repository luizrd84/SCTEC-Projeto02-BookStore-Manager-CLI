import { EmprestimoRepository } from "../repositories/EmprestimoRepository";
import { Emprestimo } from "../models/Emprestimo";


class EmprestimoService {

    constructor(
        private emprestimoRepository: EmprestimoRepository
    ) {
        //constructor
    }   

    async cadastrar(emprestimo: Emprestimo) {
        //Validações. 
        // - Ver se não tem já no banco, etc

        return await this.emprestimoRepository.cadastrar(emprestimo);
    }
   
    async adicionarLivro(emprestimoId: number, livroId: number) {        
        return await this.emprestimoRepository.adicionarLivro(emprestimoId, livroId);
    }

    async devolver (emprestimo: Emprestimo) {

        await this.buscarPorId(emprestimo.id!);

        return await this.emprestimoRepository.devolver(emprestimo);
    }
    
    async buscarPorId(id: number) {
        return await this.emprestimoRepository.buscarPorId(id);
    }

    async listar() {
        return await this.emprestimoRepository.listar();
    }

    async listarPorCliente(clienteId: number) {
        return await this.emprestimoRepository.listarPorCliente(clienteId);
    }

    async listarPorLivro(livroId: number) {
        return await this.emprestimoRepository.listarPorLivro(livroId);
    }
    
    async listarEmAberto()  {
        return await this.emprestimoRepository.listarEmAberto();
    }    

    async listarAtrasados() {
        return await this.emprestimoRepository.listarAtrasados();
    }   


}

export default EmprestimoService;
