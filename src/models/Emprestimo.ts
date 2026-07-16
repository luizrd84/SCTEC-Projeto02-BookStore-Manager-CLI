export interface Emprestimo {
    id?: number;
    data_emprestimo: Date;
    data_prevista_devolucao: Date;
    data_devolucao?: Date | null;
    cliente_id: number;
}