import { Autor } from "../models/Autor";
import { pool } from "../database/connection";

export class AutorRepository {

    async cadastrar(autor: Autor): Promise<Autor> {

        const sql = `
            INSERT INTO tb_autor (nome, nacionalidade, data_nasc)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await pool.query<Autor>(sql, 
            [autor.nome, autor.nacionalidade, autor.data_nasc]
        );

        const autorSalvo = result.rows[0];

        if (!autorSalvo) {
            throw new Error("Erro ao cadastrar autor.");
        }

        return autorSalvo;
    }

    async listar(): Promise<Autor[]> {

        const sql = `
            SELECT *
            FROM tb_autor
            ORDER BY nome
        `;

        const result = await pool.query(sql);

        return result.rows;
    }

    async buscarPorId(id: number): Promise<Autor | null> {

        const sql = `
            SELECT *
            FROM tb_autor
            WHERE id = $1
        `;

        const result = await pool.query(sql, [id]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    async alterar(autor: Autor): Promise<Autor> {

        const sql = `
            UPDATE tb_autor
            SET nome = $1, nacionalidade = $2, data_nasc = $3
            WHERE id = $4
            RETURNING *
        `;

        const result = await pool.query(sql, [
            autor.nome, autor.nacionalidade, autor.data_nasc, autor.id
        ]);

        return result.rows[0];
    }

    async excluir(id: number): Promise<void> {

        const sql = `
            DELETE FROM tb_autor
            WHERE id = $1
        `;

        await pool.query(sql, [id]);
    }

    async buscarPorNome(nome: string): Promise<Autor[]> {

        const sql = `
            SELECT *
            FROM tb_autor
            WHERE nome ILIKE $1
            ORDER BY nome
        `;

        const result = await pool.query<Autor>(sql, [`%${nome}%`]);

        return result.rows;
    }

}

