import { Cliente } from "../models/Cliente";
import { pool } from "../database/connection";

export class ClienteRepository {
    
    
    async cadastrar(cliente: Cliente): Promise<Cliente> {

        const sql = `
            INSERT INTO tb_cliente (nome, email, telefone, criado_em)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await pool.query<Cliente>(sql, 
            [cliente.nome, cliente.email, cliente.telefone, cliente.criado_em]
        );

        const clienteSalvo = result.rows[0];

        if (!clienteSalvo) {
            throw new Error("Erro ao cadastrar cliente.");
        }

        return clienteSalvo;
    }

    async listar(): Promise<Cliente[]> {

        const sql = `
            SELECT *
            FROM tb_cliente
            ORDER BY nome
        `;

        const result = await pool.query(sql);

        return result.rows;
    }

    async buscarPorId(id: number): Promise<Cliente | null> {

        const sql = `
            SELECT *
            FROM tb_cliente
            WHERE id = $1
        `;

        const result = await pool.query(sql, [id]);

        if (result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
    }

    async alterar(cliente: Cliente): Promise<Cliente> {

        const sql = `
            UPDATE tb_cliente
            SET nome = $1, email = $2, telefone = $3, criado_em = $4
            WHERE id = $5
            RETURNING *
        `;

        const result = await pool.query(sql, [
            cliente.nome, cliente.email, cliente.telefone, cliente.criado_em, cliente.id
        ]);

        return result.rows[0];
    }

    async excluir(id: number): Promise<void> {

        const sql = `
            DELETE FROM tb_cliente
            WHERE id = $1
        `;

        await pool.query(sql, [id]);
    }

    async buscarPorNome(nome: string): Promise<Cliente[]> {

        const sql = `
            SELECT *
            FROM tb_cliente
            WHERE nome ILIKE $1
            ORDER BY nome
        `;

        const result = await pool.query<Cliente>(sql, [`%${nome}%`]);

        return result.rows;
    }


    
}

