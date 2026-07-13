import {pool} from './database/connection';
import TerminalController from './menus/TerminalController';
import AutorController from './controllers/AutorController';
import AutorService from './services/AutorService';
import { AutorRepository } from './repositories/AutorRepository';
import LivroController from './controllers/LivroController';
import LivroService from './services/LivroService';
import { LivroRepository } from './repositories/LivroRepository';

async function main() {    

    const autorRepository = new AutorRepository();
    const autorService = new AutorService(autorRepository);
    const autorController = new AutorController(autorService);

    const livroRepository = new LivroRepository();
    const livroService = new LivroService(livroRepository);
    const livroController = new LivroController(livroService);

    const terminal = new TerminalController(
        autorController, livroController
    );
    await terminal.inicializarConsole();

   

}

main();
