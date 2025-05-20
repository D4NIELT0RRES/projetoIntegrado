CREATE DATABASE db_gestao_receita;

USE db_gestao_receita;

-- Tabela de usuários:
CREATE TABLE tbl_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
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
    -- Converte nome de usuário para minúsculas
    SET NEW.nome_usuario = LOWER(NEW.nome_usuario);
    -- Converte e-mail para minúsculas
    SET NEW.email = LOWER(NEW.email);
END//
DELIMITER ;
/*
-- Teste
INSERT INTO tbl_usuario (nome, nome_usuario, email, senha, palavra_chave, foto_perfil)
VALUES (
    'Gabriel Soares', 
    'gabriel.soares', 
    'gabriel@gmail.com', 
    'basquete',
    'james harden',
    'nada'
);
*/

select * from tbl_usuario;
desc tbl_usuario;
drop table tbl_usuario;