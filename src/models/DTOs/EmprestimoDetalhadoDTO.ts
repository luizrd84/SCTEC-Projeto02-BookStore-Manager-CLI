export interface EmprestimoDetalhadoDTO {
    id: number;
    clienteid: number;
    cliente: string;
    data_emprestimo: Date;
    data_prevista_devolucao: Date;
    data_devolucao: Date | null;
    livros: string[];
}