import { rl } from "../utils/ConsoleUtils";
import { Emprestimo } from "../models/Emprestimo";
import EmprestimoService from "../services/EmprestimoService";
import { aguardarEnter } from "../utils/ConsoleUtils";
import ClienteService from "../services/ClienteService";
import LivroService from "../services/LivroService";
import { EmprestimoLivro } from "../models/EmprestimoLivro";

class EmprestimoController { 

    constructor(        
        private emprestimoService: EmprestimoService,
        private clienteService: ClienteService,
        private livroService: LivroService
    ) {
        //constructor
    }         
   
    async inicializarMenuEmprestimo() {

        while (true) {
            console.clear();
            
            console.log("=========== Sistema de Empréstimos ========");
            console.log("=========== Selecione uma das opções: =====")            
            
            const opcao = await rl.question(`
            1 - Cadastrar Empréstimo
            2 - Devolver Empréstimo
            3 - Buscar Empréstimo por ID
            4 - Listar Empréstimos            
            5 - Listar Empréstimos por ID do Cliente
            6 - Listar Empréstimos por ID do Livro
            7 - Listar Empréstimos em aberto
            8 - Listar Empréstimos atrasados
            9 - Voltar
            Escolha: `);

            switch(opcao){
                case "1": 
                    await this.cadastrar();
                    break;
                case "2": 
                    await this.devolver();
                    break;
                case "3":
                    await this.buscarPorId();
                    break;
                case "4":
                    await this.listar();
                    break;                
                case "5":
                    await this.listarPorCliente();
                    break;
                case "6":
                    await this.listarPorLivro();
                    break;
                case "7": 
                    await this.listarEmAberto();
                    break;
                case "8":
                    await this.listarAtrasados();
                    break;
                case "9":
                    return;
                default: 
                    console.log("Opção inválida, escolha uma das opções.");   
            }     
        }       
    }

    private async cadastrar() { 
 
        let clienteIdValido = false;
        let clienteIdTexto = "0";        
        while (clienteIdValido !== true) {
            clienteIdTexto = await rl.question("Digite o ID do autor: ");
            
            const clienteIdNumero = Number(clienteIdTexto);

            if (isNaN(clienteIdNumero)) {
                console.log("ID digitado inválido.");
                continue;
            }

            try {
                await this.clienteService.buscarPorId(clienteIdNumero);                
                clienteIdValido = true;   
            } catch (error) {
                console.log(error);            
            }                        
        }
      

        let dataEmprestimoValida = false;
        let dataEmprestimoTexto;   
        let dataEmprestimo;     
        while (dataEmprestimoValida !== true) {
            dataEmprestimoTexto = await rl.question("Digite a data do empréstimo (DD/MM/AAAA): ");
            
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!regex.test(dataEmprestimoTexto)) {
                console.log("Formato inválido. Use DD/MM/AAAA.");
                continue;
            }

            const [dia, mes, ano] = dataEmprestimoTexto.split("/").map(Number);

            dataEmprestimo = new Date(ano!, mes! - 1, dia);

            if (
                dataEmprestimo.getFullYear() !== ano ||
                dataEmprestimo.getMonth() !== mes! - 1 ||
                dataEmprestimo.getDate() !== dia
            ) {
                console.log("Data inválida.");
                continue;
            }

            dataEmprestimoValida = true;            
        }        
        

        let dataPrevistaDevolucaoValida = false;
        let dataPrevistaDevolucaoTexto;   
        let dataPrevistaDevolucao;     
        while (dataPrevistaDevolucaoValida !== true) {
            dataPrevistaDevolucaoTexto = await rl.question("Digite a data prevista para devolução (DD/MM/AAAA): ");
            
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!regex.test(dataPrevistaDevolucaoTexto)) {
                console.log("Formato inválido. Use DD/MM/AAAA.");
                continue;
            }

            const [dia, mes, ano] = dataPrevistaDevolucaoTexto.split("/").map(Number);

            dataPrevistaDevolucao = new Date(ano!, mes! - 1, dia);

            if (
                dataPrevistaDevolucao.getFullYear() !== ano ||
                dataPrevistaDevolucao.getMonth() !== mes! - 1 ||
                dataPrevistaDevolucao.getDate() !== dia || dataEmprestimo! >= dataPrevistaDevolucao
            ) {
                console.log("Data inválida.");
                continue;
            }

            dataPrevistaDevolucaoValida = true;            
        }         
    
        const emprestimo: Emprestimo = {  
            cliente_id: Number(clienteIdTexto!),
            data_emprestimo: dataEmprestimo!,
            data_prevista_devolucao: dataPrevistaDevolucao!,
            data_devolucao: null
        };
        
        try {
            const emprestimoCadastrado = await this.emprestimoService.cadastrar(emprestimo);            
            
            let livroIdValido = false;
            let livroIdTexto = "0";        
            while (livroIdValido !== true) {
                livroIdTexto = await rl.question("Digite o ID do livro que será emprestado: ");
                
                const livroIdNumero = Number(livroIdTexto);

                if (isNaN(livroIdNumero)) {
                    console.log("ID digitado inválido.");
                    continue;
                }

                try {
                    await this.livroService.buscarPorId(livroIdNumero);                
                    livroIdValido = true;   
                } catch (error) {
                    console.log(error);            
                }                        
            }
     
            try {
                await this.emprestimoService.adicionarLivro(emprestimoCadastrado.id!, Number(livroIdTexto));
                console.log("Empréstimo cadastrado com sucesso!");
            } catch (error) {
                console.log(error);            
            }

        } catch (error) {
            console.log(error);            
        }
        await aguardarEnter(); 
        
    }



    private async listar() { 
        const emprestimos = await this.emprestimoService.listar();

        if (emprestimos.length === 0) {
            console.log("Nenhum empréstimo foi encontrado.");
            await aguardarEnter();
            return;
        }

        console.log("Empréstimos cadastrados:");
        emprestimos.forEach((emprestimo) => {

            const listaLivros = emprestimo.livros.join(", ") + ".";
            const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
            console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
            console.log("Livros: " + listaLivros);
            
        });

        await aguardarEnter();
    }

    private async devolver () {
        let emprestimoIdValido = false;
        let emprestimoIdTexto = "0";        
        let emprestimo = null;
        while (emprestimoIdValido !== true) {
            emprestimoIdTexto = await rl.question("Digite o ID do empréstimo que quer devolver: ");
            
            const emprestimoIdNumero = Number(emprestimoIdTexto);

            if (isNaN(emprestimoIdNumero)) {
                console.log("ID digitado inválido.");
                await aguardarEnter(); 
                continue;
            }

            try {
                emprestimo = await this.emprestimoService.buscarPorId(emprestimoIdNumero);         
                if(emprestimo) {
                    emprestimoIdValido = true;     
                    
                } else {
                    console.log("Empréstimo não encontrado, tente novamente.");                       
                }                       
            } catch (error) {
                console.log(error);                     
            }                        
        }

        let dataDevolucaoValida = false;
        let dataDevolucaoTexto;   
        let dataDevolucao;     
        while (dataDevolucaoValida !== true) {
            dataDevolucaoTexto = await rl.question("Digite a data de devolução do empréstimo (DD/MM/AAAA): ");
            
            const regex = /^\d{2}\/\d{2}\/\d{4}$/;

            if (!regex.test(dataDevolucaoTexto)) {
                console.log("Formato inválido. Use DD/MM/AAAA.");
                await aguardarEnter(); 
                continue;
            }

            const [dia, mes, ano] = dataDevolucaoTexto.split("/").map(Number);

            dataDevolucao = new Date(ano!, mes! - 1, dia);

            if (
                dataDevolucao.getFullYear() !== ano ||
                dataDevolucao.getMonth() !== mes! - 1 ||
                dataDevolucao.getDate() !== dia || emprestimo?.data_emprestimo! > dataDevolucao
            ) {
                console.log("Data inválida.");                 
                continue;
            }
            dataDevolucaoValida = true;            
        }                      

        const emprestimoComDevolucao: Emprestimo = {
            id: emprestimo?.id!,
            cliente_id: emprestimo?.clienteid!,
            data_emprestimo: emprestimo?.data_emprestimo!,
            data_prevista_devolucao: emprestimo?.data_prevista_devolucao!,
            data_devolucao: dataDevolucao!
        }

        try {
            await this.emprestimoService.devolver(emprestimoComDevolucao);
            console.log("Livros emprestados devolvidos com sucesso!");
        } catch (error) {
            console.log(error);                 
        }
        await aguardarEnter(); 

    }




    private async buscarPorId() { 
        
        const emprestimoIdTexto = await rl.question("Digite o ID do empréstimo: ");
        
        const emprestimoIdNumero = Number(emprestimoIdTexto);

        if (isNaN(emprestimoIdNumero)) {
            console.log("ID digitado inválido.");
            await aguardarEnter();                 
        }

        try {
            const emprestimo = await this.emprestimoService.buscarPorId(emprestimoIdNumero);         
            if(emprestimo) {                    
                const listaLivros = emprestimo.livros.join(", ") + ".";
                const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
                console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
                console.log("Livros: " + listaLivros);
                
            } else {
                console.log("Empréstimo não encontrado, tente novamente.");                       
            }                       
        } catch (error) {
            console.log(error);                     
        }   
        await aguardarEnter();                     
            
    }

    private async listarPorCliente() { 
        
        const clienteIdTexto = await rl.question("Digite o ID do cliente para listar seus empréstimos: ");
        
        const clienteIdNumero = Number(clienteIdTexto);

        if (isNaN(clienteIdNumero)) {
            console.log("ID digitado inválido.");
            await aguardarEnter();                 
        }

        try {
            const emprestimos = await this.emprestimoService.listarPorCliente(clienteIdNumero);         
            
            if(emprestimos.length > 0) {         
                emprestimos.forEach((emprestimo) => {
                    const listaLivros = emprestimo.livros.join(", ") + ".";
                    const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
                    console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
                    console.log("Livros: " + listaLivros);
                });                
                
            } else {
                console.log("Nenhum resultado encontrado.");                       
            }                       
        } catch (error) {
            console.log(error);                     
        }   
        await aguardarEnter();      
    }


    private async listarPorLivro() { 
        
        const livroIdTexto = await rl.question("Digite o ID do livro para listar seus empréstimos: ");
        
        const livroIdNumero = Number(livroIdTexto);

        if (isNaN(livroIdNumero)) {
            console.log("ID digitado inválido.");
            await aguardarEnter();                 
        }

        try {
            const emprestimos = await this.emprestimoService.listarPorLivro(livroIdNumero);         
            
            if(emprestimos.length > 0) {         
                emprestimos.forEach((emprestimo) => {
                    const listaLivros = emprestimo.livros.join(", ") + ".";
                    const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
                    console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
                    console.log("Livros: " + listaLivros);
                });                
                
            } else {
                console.log("Nenhum resultado encontrado.");                       
            }                       
        } catch (error) {
            console.log(error);                     
        }   
        await aguardarEnter();      
    }


    private async listarEmAberto() { 
      
        try {
            const emprestimos = await this.emprestimoService.listarEmAberto();         
            
            if(emprestimos.length > 0) {         
                emprestimos.forEach((emprestimo) => {
                    const listaLivros = emprestimo.livros.join(", ") + ".";
                    const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
                    console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
                    console.log("Livros: " + listaLivros);
                });                
                
            } else {
                console.log("Nenhum resultado encontrado.");                       
            }                       
        } catch (error) {
            console.log(error);                     
        }   
        await aguardarEnter();      
    }


    private async listarAtrasados() { 
      
        try {
            const emprestimos = await this.emprestimoService.listarAtrasados();         
            
            if(emprestimos.length > 0) {         
                emprestimos.forEach((emprestimo) => {
                    const listaLivros = emprestimo.livros.join(", ") + ".";
                    const devolucao = emprestimo.data_devolucao === null ? "-" : emprestimo.data_devolucao.toLocaleDateString("pt-BR");
                    console.log(`ID: ${emprestimo.id}, Cliente: ${emprestimo.cliente}, Data empréstimo: ${emprestimo.data_emprestimo.toLocaleDateString("pt-BR")}, Data prevista devolução: ${emprestimo.data_prevista_devolucao.toLocaleDateString("pt-BR")}, Data devolução: ${devolucao}`);
                    console.log("Livros: " + listaLivros);
                });                
                
            } else {
                console.log("Nenhum resultado encontrado.");                       
            }                       
        } catch (error) {
            console.log(error);                     
        }   
        await aguardarEnter();      
    }




}

export default EmprestimoController;