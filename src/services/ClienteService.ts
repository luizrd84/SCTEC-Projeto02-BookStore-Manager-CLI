import { ClienteRepository } from "../repositories/ClienteRepository";
import { Cliente } from "../models/Cliente";

class ClienteService {

    constructor(
        private clienteRepository: ClienteRepository
    ) {
        //constructor
    }   

    async cadastrar(cliente: Cliente): Promise<Cliente | null> {
        if(cliente.nome === null || cliente.email === null || cliente.telefone === null || cliente.criado_em === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const clienteExistente = await this.clienteRepository.verificaSeNomeJaExiste(cliente.nome);

        if(clienteExistente) {
            console.log("Já existe um cliente com esse nome.");
            return null;
        }

        return await this.clienteRepository.cadastrar(cliente);
    }

    async listar(): Promise<Cliente[]> {
        return await this.clienteRepository.listar();
    }

    async buscarPorNome(nome: string): Promise<Cliente[]>  {
        const cliente = await this.clienteRepository.buscarPorNome(nome);

        return cliente;
    }

    async buscarPorId(id: number): Promise<Cliente | null>  {
        const cliente = await this.clienteRepository.buscarPorId(id);

        if (!cliente) {            
            return null;
        }

        return cliente;
    }

    async alterar(cliente: Cliente): Promise<Cliente | null>  {
        if(cliente.id === null || cliente.email === null || cliente.telefone === null || cliente.criado_em === null) {
            console.log("Dados inválidos.");
            return null;
        }

        const clienteExistente = await this.clienteRepository.verificaSeNomeJaExiste(cliente.nome);

        if(clienteExistente) {
            if(clienteExistente.id !== cliente.id) {
                console.log("Já existe um cliente com esse nome.");
                return null;
            }
        }

        return await this.clienteRepository.alterar(cliente);
    }

    async excluir(id: number): Promise<void> {
        const idExiste = await this.buscarPorId(id);

        if(idExiste === null) {
            console.log("Não foi encontrado nenhum cliente com esse ID.");
            return;
        }


        await this.clienteRepository.excluir(id);
    }
}

export default ClienteService;
