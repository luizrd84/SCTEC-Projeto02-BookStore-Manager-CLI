import {pool} from './database/connection';

async function main() {
    const result = await pool.query('SELECT NOW()');
    console.log(result.rows[0]);


    /*
    const sql = `SELECT * FROM tb_alunos WHERE email = $1`;

    const result2 = await pool.query(sql, ['luiz@email.com']);
    if(result2 === null) {
        console.log("nada");
    } else {
        console.log(result2.rows[0]);
    }
    */
   
    pool.end();
}

main();

