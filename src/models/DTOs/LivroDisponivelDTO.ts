export interface LivroDisponivelDTO {
    id: number;
    titulo: string;
    autor: string;
    ano_publicacao: number;
    quantidade: number;
    disponiveis: number;
}