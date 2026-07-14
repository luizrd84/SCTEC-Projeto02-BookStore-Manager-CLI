import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente } from "../models/Cliente";

class ClienteService {

    constructor(
        private clienteRepository: ClienteRepository
    ) {
        //constructor
    }   

    async cadastrar(cliente: Cliente) {
        //Validações. 
        // - Ver se não tem já no banco, etc

        return await this.clienteRepository.cadastrar(cliente);
    }

    async listar() {
        return await this.clienteRepository.listar();
    }

    async buscarPorNome(nome: string) {

        const cliente = await this.clienteRepository.buscarPorNome(nome);

        return cliente;
    }

    async buscarPorId(id: number) {

        const cliente = await this.clienteRepository.buscarPorId(id);

        if (!cliente) {
            throw new Error("Cliente não encontrado.");
        }

        return cliente;
    }

    async alterar(cliente: Cliente) {

        await this.buscarPorId(cliente.id!);

        return await this.clienteRepository.alterar(cliente);
    }

    async excluir(id: number): Promise<void> {
        await this.buscarPorId(id);

        await this.clienteRepository.excluir(id);
    }

}

export default ClienteService;
