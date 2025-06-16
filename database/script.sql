CREATE DATABASE db_gestao_receita;

USE db_gestao_receita;

SHOW TABLES;

-- USUARIO --
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
-- Para recuperaçao de senha
UPDATE tbl_usuario 
SET senha = 'novaSenha' 
WHERE email = 'gabriel@gmail.com' 
AND palavra_chave = 'james harden';
-- Mostra quantas linhas foram alteradas (1 = sucesso, 0 = falha)
SELECT ROW_COUNT() AS linhas_afetadas;
/*
-- Teste
INSERT INTO tbl_usuario (nome_usuario, email, senha, palavra_chave, foto_perfil)
VALUES (
    'gabriel.soares', 
    'gabriel@gmail.com', 
    'basquete',
    'james harden',
    'nada.jpg'
);
*/
select * from tbl_usuario;
desc tbl_usuario;
delete from tbl_usuario where id > 0;
drop table tbl_usuario;
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

-- RECEITA --
-- Tabela de Receitas:
CREATE TABLE tbl_receita (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    tempo_preparo VARCHAR(10) NOT NULL,
    foto_receita VARCHAR(255),
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dificuldade VARCHAR(45) NOT NULL,
    modo_preparo TEXT NOT NULL,
    ingrediente TEXT NOT NULL,
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
INSERT INTO tbl_receita (titulo, tempo_preparo, foto_receita, dificuldade, modo_preparo, ingrediente, id_usuario)
VALUES (
    'bolo de cenoura com calda de chocolate',
    '45 min',
    'bolo_cenoura.jpg',
    'facil',
    '1. Misture os ingredientes... 2. Asse por 40 minutos...',
    'cenoura...'
    1
);
*/
select * from tbl_receita;
desc tbl_receita;
delete from tbl_receita where id > 0;
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
INSERT INTO tbl_classificacao (nome) VALUES ('Doce');
INSERT INTO tbl_classificacao (nome) VALUES ('Salgada');
INSERT INTO tbl_classificacao (nome) VALUES ('Sem Glutem');
INSERT INTO tbl_classificacao (nome) VALUES ('Sem Lactose');
INSERT INTO tbl_classificacao (nome) VALUES ('Vegana');
*/
select * from tbl_classificacao;
desc tbl_classificacao;
delete from tbl_classificacao where id > 0;
drop table tbl_receita;
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
(1, 1),
(1, 2), 
(1, 3); 
*/

insert into tbl_classificacao(nome) values ('Salgado');

update tbl_classificacao set  nome = 'Doce' where id = 1;

delete from tbl_classificacao where id= 1;
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
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
 SELECT
    r.*,
    GROUP_CONCAT(c.id) AS classificacao_ids,
    GROUP_CONCAT(c.nome SEPARATOR '; ') AS classificacao_nomes
FROM
    tbl_receita AS r
LEFT JOIN
    tbl_receita_classificacao AS rc ON r.id = rc.id_receita
LEFT JOIN
    tbl_classificacao AS c ON rc.id_classificacao = c.id
WHERE
    r.id_usuario = 2 -- ou remova esta linha se for selectAllReceita
GROUP BY
    r.id
ORDER BY
    r.id DESC;
SELECT
                r.*,
                GROUP_CONCAT(c.id) AS classificacao_ids,
                GROUP_CONCAT(c.nome SEPARATOR '; ') AS classificacao_nomes
            FROM
                tbl_receita AS r
            LEFT JOIN
                tbl_receita_classificacao AS rc ON r.id = rc.id_receita
            LEFT JOIN
                tbl_classificacao AS c ON rc.id_classificacao = c.id
            WHERE
                r.id_usuario = 2 -- <-- Certifique-se de que é EXATAMENTE ASSIM
            GROUP BY
                r.id
            ORDER BY
                r.id DESC;
                
                
                
                aaa