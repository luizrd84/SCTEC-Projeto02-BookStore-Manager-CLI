import {pool} from './database/connection';
import TerminalController from './menus/TerminalController';
import AutorController from './controllers/AutorController';
import AutorService from './services/AutorService';
import { AutorRepository } from './repositories/AutorRepository';

async function main() {
    /*const result = await pool.query('SELECT NOW()');
    console.log(result.rows[0]);
    pool.end();
    */
    /*
    const sql = `SELECT * FROM tb_alunos WHERE email = $1`;

    const result2 = await pool.query(sql, ['luiz@email.com']);
    if(result2 === null) {
        console.log("nada");
    } else {
        console.log(result2.rows[0]);
    }
    */


    //Código acima vai sair todo.


    

    const autorRepository = new AutorRepository();
    const autorService = new AutorService(autorRepository);
    const autorController = new AutorController(autorService);
    const terminal = new TerminalController(autorController);
    await terminal.inicializarConsole();

   

}

main();

/*
EXEMPLO DO POKEMON

async function main() {
    
    const catalogo = new CatalogoPokemon();
    const service = new PokeApiService();

    const controller = new TerminalController(
        service,
        catalogo
    ); 
    
    //Busca de um pokémon por nome
    console.log("Teste 1: Buscando um pokémon pelo nome 'charmander'");
    await controller.buscarPokemon("charmander");     
    //Busca de um pokémon por número
    console.log("Teste 2: Buscando um pokémon pelo número '58'");
    await controller.buscarPokemon("58");  
    //Busca em duplicidade
    console.log("Teste 3: Buscando novamente o pokémon '58' (Duplicidade)");
    await controller.buscarPokemon("58");  
    //Busca de um pokémon com nome inválido
    console.log("Teste 4: Buscando um pokémon com nome inexistente 'branch'");
    await controller.buscarPokemon("branch");        
 
    //Exibir pokémons armazenados no catálogo    
    controller.listarCatalogo();
    //Remover um pokémon que está no catálogo
    console.log("Teste 5: Removendo um pokémon com o número 4");
    controller.removerDoCatalogo(4);
    //Tentando Remover um pokémon que não está no catálogo
    console.log("Teste 6: Tentando remover um pokémon que não está na lista 9999");
    controller.removerDoCatalogo(9999);
    //Exibir pokémons armazenados no catálogo    
    controller.listarCatalogo(); 
    
    controller.inicializarConsole();
} 

main();

*/