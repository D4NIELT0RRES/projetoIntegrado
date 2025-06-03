CREATE DATABASE db_gestao_receita;

USE db_gestao_receita;

-- Tabela de usuários:
CREATE TABLE tbl_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(70) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(13) NOT NULL,
    palavra_chave VARCHAR(25) NOT NULL,
    foto_perfil VARCHAR(255),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Trigger para padronização de dados
DELIMITER // 
CREATE TRIGGER before_usuario_insert
BEFORE INSERT ON tbl_usuario
FOR EACH ROW
BEGIN
    -- Converte e-mail para minúsculas
    SET NEW.email = LOWER(NEW.email);
END//
DELIMITER ;
/*
-- Teste
INSERT INTO tbl_usuario (nome_usuario, email, senha, palavra_chave, foto_perfil)
VALUES (
    'gabriel.soares', 
    'gabriel@gmail.com', 
    'basquete',
    'james harden',
    'nada'
);
*/

SELECT * FROM tbl_usuario;  -- Retorna todos os registros da tabela de usuários

DESC tbl_usuario;  -- Mostra a estrutura (colunas e tipos) da tabela de usuários

SHOW TABLES;  -- Lista todas as tabelas do banco de dados atual

SELECT * FROM tbl_usuario WHERE nome_usuario = 'Gabriel Souza';  -- Busca usuário com nome exato "Gabriel Souza"

SELECT * FROM tbl_usuario WHERE email = 'gabriel@souza.com.br';  -- Busca usuário com o e-mail informado

SELECT * FROM tbl_usuario WHERE email = "gabriel@souza.com.br" AND senha = "Senh@829";  -- Verifica se existe um usuário com esse e-mail e senha

SELECT * FROM tbl_usuario ORDER BY id DESC LIMIT 1;  -- Retorna o último usuário cadastrado (com maior ID)

SELECT * FROM tbl_usuario WHERE nome_usuario = 'israel' ORDER BY id DESC LIMIT 1;  -- Busca o último usuário com nome "israel"

UPDATE tbl_usuario 
SET senha = 'anajulia' 
WHERE email = 'gabriel@souza.com.br' 
AND palavra_chave = '0511';  -- Atualiza a senha do usuário com o e-mail e palavra-chave correspondentes

SELECT ROW_COUNT() AS linhas_afetadas;  -- Retorna o número de linhas afetadas pelo último UPDATE





-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- RECEITA --
-- Tabela de Receitas:
CREATE TABLE tbl_receita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    tempo_preparo VARCHAR(10) NOT NULL,
    foto_receita VARCHAR(255),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descricao VARCHAR(150) NOT NULL,
    modo_preparo TEXT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT FK_Usuario_Receita
        FOREIGN KEY (id_usuario)
        REFERENCES tbl_usuario(id)
);


-- Trigger para padronização de dados
DELIMITER //
CREATE TRIGGER before_receita_insert
BEFORE INSERT ON tbl_receita
FOR EACH ROW
BEGIN
    -- Converte o título para maiúsculas
    SET NEW.titulo = UPPER(NEW.titulo);
END//
DELIMITER ;


/*
-- Teste
INSERT INTO tbl_receita (titulo, tempo_preparo, foto_receita, descricao, modo_preparo, id_usuario)
VALUES (
    'bolo de cenoura com calda de chocolate',
    '45 min',
    'bolo_cenoura.jpg',
    'Um delicioso bolo de cenoura com calda',
    '1. Misture os ingredientes... 2. Asse por 40 minutos...',
    1
);
*/
select * from tbl_receita;
desc tbl_receita;
delete from tbl_receita where id > 0;
drop table tbl_receita;
SELECT * FROM tbl_receita WHERE titulo = '${receita.titulo}' ORDER BY id DESC LIMIT 1

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- INGREDIENTE --
-- Tabela de ingredientes:
CREATE TABLE tbl_ingrediente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
-- Trigger para padronização de dados
DELIMITER //
CREATE TRIGGER before_ingrediente_insert
BEFORE INSERT ON tbl_ingrediente
FOR EACH ROW
BEGIN
    -- Converte o nome para maiúsculas
    SET NEW.nome = UPPER(NEW.nome);
END//
DELIMITER ;
/*
-- Teste
INSERT INTO tbl_ingrediente (nome) VALUES ('POLVILHO DOCE');
INSERT INTO tbl_ingrediente (nome) VALUES ('QUEIJO MINAS');
INSERT INTO tbl_ingrediente (nome) VALUES ('OVO');
*/
select * from tbl_ingrediente;
desc tbl_ingrediente;
delete from tbl_ingrediente where id > 0;
drop table tbl_ingrediente;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- QUANTIDADE --
-- Tabela de quantidade:
CREATE TABLE tbl_quantidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
-- Trigger para padronização de dados
DELIMITER //
CREATE TRIGGER before_quantidade_insert
BEFORE INSERT ON tbl_quantidade
FOR EACH ROW
BEGIN
    -- Converte o nome para maiúsculas
    SET NEW.nome = UPPER(NEW.nome);
END//
DELIMITER ;
/*
-- Teste
INSERT INTO tbl_quantidade (nome) VALUES ('500 GRAMAS DE');
INSERT INTO tbl_quantidade (nome) VALUES ('1 COLHER DE');
INSERT INTO tbl_quantidade (nome) VALUES ('2 UNIDADES DE');
*/
select * from tbl_quantidade;
desc tbl_quantidade;
delete from tbl_quantidade where id > 0;
drop table tbl_quantidade;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- CLASSIFICACAO --
-- Tabela de classificacao:
CREATE TABLE tbl_classificacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);
-- Trigger para padronização de dados
DELIMITER //
CREATE TRIGGER before_classificacao_insert
BEFORE INSERT ON tbl_classificacao
FOR EACH ROW
BEGIN
    -- Converte o nome para maiúsculas
    SET NEW.nome = UPPER(NEW.nome);
END//
DELIMITER ;
/*
-- Teste
INSERT INTO tbl_classificacao (nome) VALUES ('MUITO FÁCIL');
INSERT INTO tbl_classificacao (nome) VALUES ('FÁCIL');
INSERT INTO tbl_classificacao (nome) VALUES ('MÉDIO');
INSERT INTO tbl_classificacao (nome) VALUES ('DIFÍCIL');
*/
select * from tbl_classificacao;
desc tbl_classificacao;
delete from tbl_classificacao where id > 0;
drop table tbl_classificacao;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- RECEITA_INGREDIENTE_QUANTIDADE --
-- Tabela de receita_ingrediente_quantidade:
create table tbl_receita_ingrediente_quantidade (
  id int primary key auto_increment,
  id_receita int,
    foreign key(id_receita) references tbl_receita(id),
  id_ingrediente int,
    foreign key(id_ingrediente) references tbl_ingrediente(id),
  id_quantidade int,
    foreign key(id_quantidade) references tbl_quantidade(id)
);
/*
-- Teste
INSERT INTO tbl_receita_ingrediente_quantidade (id_receita, id_ingrediente, id_quantidade)
VALUES
(1, 1, 1), -- 500g de polvilho doce
(1, 2, 2), -- 1 colher de queijo minas
(1, 3, 3); -- 2 ovos
*/
-- Consulta para verificar os relacionamentos
SELECT
    r.titulo AS receita,
    q.nome AS quantidade,
    i.nome AS ingrediente
FROM
    tbl_receita_ingrediente_quantidade riq
JOIN
    tbl_receita r ON riq.id_receita = r.id
JOIN
    tbl_quantidade q ON riq.id_quantidade = q.id
JOIN
    tbl_ingrediente i ON riq.id_ingrediente = i.id
WHERE
    riq.id_receita = 1;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- RECEITA_CLASSIFICAÇAO --
-- Tabela de receita_classificacao:
create table tbl_receita_classificacao (
  id int primary key auto_increment,
  id_receita int,
    foreign key(id_receita) references tbl_receita(id),
  id_classificacao int,
    foreign key(id_classificacao) references tbl_classificacao(id)
);
/*
-- Teste
INSERT INTO tbl_receita_classificacao (id_receita, id_classificacao)
VALUES
(1, 6), -- muito facil
(1, 7), -- facil
(1, 8); -- medio
*/
-- Consulta para verificar os relacionamentos
SELECT
    r.titulo AS receita,
    c.nome AS classificacao
FROM
    tbl_receita_classificacao riq
JOIN
    tbl_receita r ON riq.id_receita = r.id
JOIN
    tbl_classificacao c ON riq.id_classificacao = c.id
WHERE
    riq.id_receita = 1;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- 
