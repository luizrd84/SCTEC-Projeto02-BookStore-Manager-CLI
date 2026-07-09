import fs from 'fs/promises';
import path from 'path';
import { pool } from './connection';

async function createSchema() {
    try {
        const filePath = path.join(__dirname, 'schema.sql');

        const sql = await fs.readFile(filePath, 'utf-8');

        await pool.query(sql);

        console.log('Banco criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar schema:', error);
    } finally {
        await pool.end();
    }
}

createSchema();