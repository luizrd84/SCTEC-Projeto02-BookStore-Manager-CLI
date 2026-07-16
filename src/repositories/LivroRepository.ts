import { Livro } from "../models/Livro";
import { pool } from "../database/connection";
import { LivroDisponivelDTO } from "../models/DTOs/LivroDisponivelDTO";

export class LivroRepository {

    async cadastrar(livro: Livro): Promise<Livro> {

        const sql = `
            INSERT INTO tb_livro (titulo, ano_publicacao, quantidade, autor_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;         

        const result = await pool.query<Livro>(sql, 
            [livro.titulo, livro.ano_publicacao, livro.quantidade, livro.autor_id]
        );

        const livroSalvo = result.rows[0];

        if (!livroSalvo) {
            throw new Error("Erro ao cadastrar livro.");
        }

        return livroSalvo;
    }

    async listar(): Promise<Livro[]> {

        //Melhorar, buscar o nome do autor junto
        const sql = `
            SELECT *
            FROM tb_livro
            ORDER BY titulo
        `;

        const result = await pool.query(sql);

        return result.rows;
    }

    async buscarPorId(id: number): Promise<Livro | null> {

        const sql = `
            SELECT *
            FROM tb_livro
            WHERE id = $1
        `;

        const result = await pool.query(sql, [id]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    async alterar(livro: Livro): Promise<Livro> {

        const sql = `
            UPDATE tb_livro
            SET titulo = $1, ano_publicacao = $2, quantidade = $3, autor_id = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(sql, [
            livro.titulo, livro.ano_publicacao, livro.quantidade, livro.autor_id, livro.id
        ]);

        return result.rows[0];
    }

    async excluir(id: number): Promise<void> {

        const sql = `
            DELETE FROM tb_livro
            WHERE id = $1
        `;

        await pool.query(sql, [id]);
    }

    async buscarPorTitulo(titulo: string): Promise<Livro[]> {

        const sql = `
            SELECT *
            FROM tb_livro
            WHERE titulo ILIKE $1
            ORDER BY titulo
        `;

        const result = await pool.query<Livro>(sql, [`%${titulo}%`]);

        return result.rows;
    }

    
    async livrosDisponiveisParaEmprestimo(): Promise<LivroDisponivelDTO[]> {

        const sql = `
            SELECT
                l.id,
                l.titulo,
                a.nome AS autor,
                l.ano_publicacao,
                l.quantidade,
                (l.quantidade - COUNT(e.id)) AS disponiveis
            FROM tb_livro l
            LEFT JOIN tb_emprestimo_livro el
                ON l.id = el.livro_id
            LEFT JOIN tb_emprestimo e
                ON el.emprestimo_id = e.id
                AND e.data_devolucao IS NULL
            JOIN tb_autor a
                ON l.autor_id = a.id
            GROUP BY
                l.id,
                l.titulo,
                a.nome,
                l.ano_publicacao,
                l.quantidade
            HAVING
                (l.quantidade - COUNT(e.id)) > 0
            ORDER BY
                l.titulo;
        `;

        const result = await pool.query<LivroDisponivelDTO>(sql);

        return result.rows;
    }

    async buscarDisponibilidadePorId(id: number): Promise<LivroDisponivelDTO | null> {

        const sql = `
            SELECT
                l.id,
                l.titulo,
                a.nome AS autor,
                l.ano_publicacao,
                l.quantidade,
                (l.quantidade - COUNT(e.id)) AS disponiveis
            FROM tb_livro l
            LEFT JOIN tb_emprestimo_livro el
                ON l.id = el.livro_id
            LEFT JOIN tb_emprestimo e
                ON el.emprestimo_id = e.id
                AND e.data_devolucao IS NULL
            JOIN tb_autor a
                ON l.autor_id = a.id
            WHERE l.id = $1
            GROUP BY
                l.id,
                l.titulo,
                a.nome,
                l.ano_publicacao,
                l.quantidade;
        `;

        const result = await pool.query<LivroDisponivelDTO>(sql, [id]);

        const livro = result.rows[0];

        if (!livro) {
            return null;
        }

        return livro;
    }

}

