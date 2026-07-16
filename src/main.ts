import {pool} from './database/connection';
import TerminalController from './menus/TerminalController';
import AutorController from './controllers/AutorController';
import AutorService from './services/AutorService';
import { AutorRepository } from './repositories/AutorRepository';
import LivroController from './controllers/LivroController';
import LivroService from './services/LivroService';
import { LivroRepository } from './repositories/LivroRepository';
import ClienteController from './controllers/ClienteController';
import ClienteService from './services/ClienteService';
import { ClienteRepository } from './repositories/ClienteRepository';
import EmprestimoController from './controllers/EmprestimoController';
import EmprestimoService from './services/EmprestimoService';
import { EmprestimoRepository } from './repositories/EmprestimoRepository';


async function main() {    

    const autorRepository = new AutorRepository();
    const autorService = new AutorService(autorRepository);
    const autorController = new AutorController(autorService);

    const livroRepository = new LivroRepository();
    const livroService = new LivroService(livroRepository);
    const livroController = new LivroController(livroService);

    const clienteRepository = new ClienteRepository();
    const clienteService = new ClienteService(clienteRepository);
    const clienteController = new ClienteController(clienteService);

    const emprestimoRepository = new EmprestimoRepository();
    const emprestimoService = new EmprestimoService(emprestimoRepository);
    const emprestimoController = new EmprestimoController(emprestimoService, clienteService, livroService);

    const terminal = new TerminalController(
        autorController, livroController, clienteController, emprestimoController
    );
    await terminal.inicializarConsole();
  

}

main();
