-- CRIAÇÃO DAS TABELAS
CREATE TABLE tb_autor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(50) NOT NULL,
    data_nasc DATE
);

CREATE TABLE tb_livro (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL UNIQUE,
    ano_publicacao SMALLINT,
    quantidade INTEGER NOT NULL CHECK (quantidade >= 0),
    autor_id INTEGER NOT NULL,
    CONSTRAINT FK_autor_id FOREIGN KEY (autor_id) REFERENCES tb_autor (id) ON DELETE CASCADE
);

CREATE TABLE tb_cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tb_emprestimo (
    id SERIAL PRIMARY KEY,
    data_emprestimo DATE NOT NULL,
    data_prevista_devolucao DATE NOT NULL,
    data_devolucao DATE,
    cliente_id INTEGER NOT NULL,
    CONSTRAINT FK_cliente_id FOREIGN KEY (cliente_id) REFERENCES tb_cliente (id) ON DELETE CASCADE,
    CONSTRAINT CK_datas CHECK (
        data_prevista_devolucao >= data_emprestimo
    ),
    CONSTRAINT CK_data_devolucao CHECK (
        data_devolucao IS NULL
        OR data_devolucao >= data_emprestimo
    )
);

CREATE TABLE tb_emprestimo_livro (
    emprestimo_id INTEGER NOT NULL,
    livro_id INTEGER NOT NULL,
    CONSTRAINT PK_emprestimo_livro PRIMARY KEY (emprestimo_id, livro_id),
    CONSTRAINT FK_emprestimo_id FOREIGN KEY (emprestimo_id) REFERENCES tb_emprestimo (id) ON DELETE CASCADE,
    CONSTRAINT FK_livro_id FOREIGN KEY (livro_id) REFERENCES tb_livro (id) ON DELETE CASCADE
);

-- INCLUSÃO DE DADOS:

-- AUTORES
INSERT INTO
    tb_autor (
        nome,
        nacionalidade,
        data_nasc
    )
VALUES (
        'Machado de Assis',
        'Brasileiro',
        '1839-06-21'
    ),
    (
        'J. K. Rowling',
        'Britânica',
        '1965-07-31'
    ),
    (
        'George Orwell',
        'Britânico',
        '1903-06-25'
    ),
    (
        'J. R. R. Tolkien',
        'Britânico',
        '1892-01-03'
    ),
    (
        'Monteiro Lobato',
        'Brasileiro',
        '1882-04-18'
    );

-- LIVROS
INSERT INTO
    tb_livro (
        titulo,
        ano_publicacao,
        quantidade,
        autor_id
    )
VALUES ('Dom Casmurro', 1899, 5, 1),
    (
        'Memórias Póstumas de Brás Cubas',
        1881,
        4,
        1
    ),
    ('Quincas Borba', 1891, 3, 1),
    ('Helena', 1876, 2, 1),
    (
        'Harry Potter e a Pedra Filosofal',
        1997,
        6,
        2
    ),
    (
        'Harry Potter e a Câmara Secreta',
        1998,
        5,
        2
    ),
    (
        'Harry Potter e o Prisioneiro de Azkaban',
        1999,
        4,
        2
    ),
    (
        'Harry Potter e o Cálice de Fogo',
        2000,
        3,
        2
    ),
    ('1984', 1949, 5, 3),
    (
        'A Revolução dos Bichos',
        1945,
        5,
        3
    ),
    (
        'Na Pior em Paris e Londres',
        1933,
        2,
        3
    ),
    (
        'Dias na Birmânia',
        1934,
        2,
        3
    ),
    ('O Hobbit', 1937, 6, 4),
    (
        'A Sociedade do Anel',
        1954,
        5,
        4
    ),
    ('As Duas Torres', 1954, 5, 4),
    (
        'O Retorno do Rei',
        1955,
        5,
        4
    ),
    (
        'Sítio do Picapau Amarelo',
        1920,
        4,
        5
    ),
    (
        'Reinações de Narizinho',
        1931,
        3,
        5
    ),
    (
        'Caçadas de Pedrinho',
        1933,
        3,
        5
    ),
    (
        'Emília no País da Gramática',
        1934,
        2,
        5
    );

-- CLIENTES
INSERT INTO
    tb_cliente (nome, email, telefone)
VALUES (
        'João Silva',
        'joao@email.com',
        '47999990001'
    ),
    (
        'Maria Souza',
        'maria@email.com',
        '47999990002'
    ),
    (
        'Carlos Oliveira',
        'carlos@email.com',
        '47999990003'
    ),
    (
        'Ana Pereira',
        'ana@email.com',
        '47999990004'
    ),
    (
        'Pedro Santos',
        'pedro@email.com',
        '47999990005'
    ),
    (
        'Fernanda Lima',
        'fernanda@email.com',
        '47999990006'
    ),
    (
        'Lucas Costa',
        'lucas@email.com',
        '47999990007'
    ),
    (
        'Juliana Rocha',
        'juliana@email.com',
        '47999990008'
    );

-- EMPRÉSTIMOS
INSERT INTO
    tb_emprestimo (
        data_emprestimo,
        data_prevista_devolucao,
        data_devolucao,
        cliente_id
    )
VALUES (
        '2026-07-01',
        '2026-07-15',
        NULL,
        1
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        1
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        1
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        2
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        2
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        2
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        3
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        3
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        3
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        4
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        4
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        4
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        5
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        5
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        5
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        6
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        6
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        6
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        7
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        7
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        7
    ),
    (
        '2026-07-01',
        '2026-07-15',
        NULL,
        8
    ),
    (
        '2026-07-02',
        '2026-07-16',
        NULL,
        8
    ),
    (
        '2026-07-03',
        '2026-07-17',
        NULL,
        8
    );

-- RELAÇÃO EMPRÉSTIMO x LIVRO
INSERT INTO
    tb_emprestimo_livro (emprestimo_id, livro_id)
VALUES (1, 1),
    (2, 5),
    (3, 9),
    (4, 13),
    (5, 17),
    (6, 2),
    (7, 6),
    (8, 10),
    (9, 14),
    (10, 18),
    (11, 3),
    (12, 7),
    (13, 11),
    (14, 15),
    (15, 19),
    (16, 4),
    (17, 8),
    (18, 12),
    (19, 16),
    (20, 20),
    (21, 1),
    (22, 5),
    (23, 9),
    (24, 13);