import { Emprestimo } from "../models/Emprestimo";
import { EmprestimoLivro } from "../models/EmprestimoLivro";
import { pool } from "../database/connection";
import { EmprestimoDetalhadoDTO } from "../models/DTOs/EmprestimoDetalhadoDTO";

export class EmprestimoRepository {

    async cadastrar(emprestimo: Emprestimo): Promise<Emprestimo> {

        const sql = `
            INSERT INTO tb_emprestimo (data_emprestimo, data_prevista_devolucao, data_devolucao, cliente_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const result = await pool.query<Emprestimo>(sql, 
            [emprestimo.data_emprestimo, emprestimo.data_prevista_devolucao, emprestimo.data_devolucao, emprestimo.cliente_id]
        );

        const emprestimoSalvo = result.rows[0];

        if (!emprestimoSalvo) {
            throw new Error("Erro ao cadastrar emprestimo.");
        }

        return emprestimoSalvo;
    }

    async adicionarLivro(emprestimoId: number, livroId: number): Promise<void> {
        const sql = `
            INSERT INTO tb_emprestimo_livro (
                emprestimo_id,
                livro_id
            )
            VALUES ($1, $2);
        `;

        const result = await pool.query(sql, [emprestimoId, livroId]);

        if (result.rowCount !== 1) {
            throw new Error("Erro ao adicionar livro ao empréstimo.");
        }
    }
    

    async devolver(emprestimo: Emprestimo): Promise<Emprestimo> {

        const sql = `
            UPDATE tb_emprestimo            
            SET data_emprestimo = $1, data_prevista_devolucao = $2, data_devolucao = $3, cliente_id = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(sql, [
            emprestimo.data_emprestimo, emprestimo.data_prevista_devolucao, emprestimo.data_devolucao,
            emprestimo.cliente_id, emprestimo.id
        ]);

        return result.rows[0];
    }

    async buscarPorId(id: number): Promise<EmprestimoDetalhadoDTO  | null> {

          const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                c.id AS clienteId,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.id = $1
            GROUP BY
                e.id,
                c.nome,
                c.id,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql, [id]);

        const emprestimo = result.rows[0];

        if (!emprestimo) {
            return null;
        }

        return emprestimo;
    }


    async listar(): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY e.id;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql);

        return result.rows;
    }


    async listarPorCliente(clienteId: number): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.cliente_id = $1
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY e.data_emprestimo DESC;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql, [clienteId]);

        return result.rows;
    }


    async listarPorLivro(livroId: number): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.id IN (
                SELECT emprestimo_id
                FROM tb_emprestimo_livro
                WHERE livro_id = $1
            )
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY e.data_emprestimo DESC;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql, [livroId]);

        return result.rows;
    }


    async listarEmAberto(): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.data_devolucao IS NULL
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY
                e.data_prevista_devolucao;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql);

        return result.rows;
    }


    async listarClientesComEmprestimosEmAberto(): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.data_devolucao IS NULL
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY
                c.nome;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql);

        return result.rows;
    }




    async listarEmprestimosFinalizados(): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.data_devolucao IS NOT NULL
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY
                e.data_prevista_devolucao;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql);

        return result.rows;
    }


    async listarAtrasados(): Promise<EmprestimoDetalhadoDTO[]> {

        const sql = `
            SELECT
                e.id,
                c.nome AS cliente,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao,
                ARRAY_AGG(l.titulo ORDER BY l.titulo) AS livros
            FROM tb_emprestimo e
            JOIN tb_cliente c
                ON e.cliente_id = c.id
            JOIN tb_emprestimo_livro el
                ON e.id = el.emprestimo_id
            JOIN tb_livro l
                ON el.livro_id = l.id
            WHERE e.data_devolucao IS NULL
            AND e.data_prevista_devolucao < CURRENT_DATE
            GROUP BY
                e.id,
                c.nome,
                e.data_emprestimo,
                e.data_prevista_devolucao,
                e.data_devolucao
            ORDER BY
                e.data_prevista_devolucao;
        `;

        const result = await pool.query<EmprestimoDetalhadoDTO>(sql);

        return result.rows;
    }

    


}

