/* Exemplos:

CREATE table tb_cursos (
id SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL UNIQUE,
carga_horaria INTEGER NOT NULL CHECK(carga_horaria > 0),
preco NUMERIC(8,2) NOT NULL CHECK(preco >=0),
ativo BOOLEAN DEFAULT TRUE,
criado_em TIMESTAMPTZ DEFAULT NOW()	
)


CREATE TABLE tb_alunos (
id SERIAL,
nome VARCHAR(150) NOT NULL,
email VARCHAR(255) NOT NULL,
data_nasc DATE,
telefone VARCHAR(20),
criado_em TIMESTAMPTZ DEFAULT NOW(),

CONSTRAINT pk_alunos PRIMARY KEY(id),
CONSTRAINT uq_email UNIQUE(email)
)


CREATE TABLE tb_matriculas (
aluno_id INTEGER NOT NULL,
curso_id INTEGER NOT NULL,
data_matricula DATE DEFAULT CURRENT_DATE,
nota_final NUMERIC (4,2),

CONSTRAINT pk_matriculas PRIMARY KEY(aluno_id, curso_id),
CONSTRAINT fk_aluno_id FOREIGN KEY(aluno_id)
REFERENCES tb_alunos(id) ON DELETE CASCADE,
CONSTRAINT fk_curso_id FOREIGN KEY(aluno_id)
REFERENCES tb_cursos(id) ON DELETE RESTRICT,
CONSTRAINT chk_nota CHECK (nota_final BETWEEN 0 AND 10)
)


INSERT INTO tb_alunos (nome, email, data_nasc, telefone, cpf)
VALUES ('Luiz', 'luiz@email.com', '1984-12-08', '47999999999', '99999999999');


*/