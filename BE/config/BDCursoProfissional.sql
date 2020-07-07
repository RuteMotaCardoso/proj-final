create database bdcursoprofissional;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema bdcursoprofissional
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bdcursoprofissional
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bdcursoprofissional` DEFAULT CHARACTER SET latin1 COLLATE latin1_general_ci ;
USE `bdcursoprofissional` ;

-- Clean up Database
/*
drop table avaliacoes_modulos;
drop table modulos;
drop table avaliacoes_disciplinas;
drop table disciplinas;
drop table componentes;
drop table alunos;
drop table professores_tem_turmas;
drop table professores;
drop table turmas;
drop table cursos_profissionais;
*/

-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NULL DEFAULT NULL,
  `apelido` VARCHAR(255) NULL DEFAULT NULL,
  `username` TEXT NULL DEFAULT NULL,
  `tipo` TEXT NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `sobre` TEXT NULL DEFAULT NULL,
  `last_login` DATETIME NULL DEFAULT NULL,
  `status` ENUM('active', 'inactive') NULL DEFAULT 'active',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 20
DEFAULT CHARACTER SET = latin1
COLLATE = latin1_general_ci;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`cursos_profissionais`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`cursosProfissionais` (
  `idCursoProfissional` INT AUTO_INCREMENT,
  `codigo` VARCHAR(45) NULL,
  `nome` VARCHAR(100) NULL,
  `totalHoras` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idCursoProfissional`),
  UNIQUE INDEX `id_UNIQUE` (`idCursoProfissional` ASC) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) ,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) )
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`cursosProfissionais` CHANGE `nome` `nome` VARCHAR(100) NULL;
-- ALTER TABLE `bdcursoprofissional`.`cursosProfissionais` ADD `totalHoras` INT NOT NULL;

-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`componentes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`componentes` (
  `idComponente` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`idComponente`),
  UNIQUE INDEX `idComponente_UNIQUE` (`idComponente` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`disciplinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`disciplinas` (
  `idDisciplina` INT AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `totalHoras` INT NOT NULL,
  `idComponente` INT NOT NULL,
  `idCursoProfissional` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idDisciplina`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) ,
  INDEX `fkDisciplinas_componentes_idx` (`idComponente` ASC) ,
  INDEX `fkDisciplinas_cursos_profissionais1_idx` (`idCursoProfissional` ASC) ,
  CONSTRAINT `fkDisciplinas_componentes`
    FOREIGN KEY (`idComponente`)
    REFERENCES `bdcursoprofissional`.`componentes` (`idComponente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkDisciplinas_cursos_profissionais1`
    FOREIGN KEY (`idCursoProfissional`)
    REFERENCES `bdcursoprofissional`.`cursosProfissionais` (`idCursoProfissional`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`disciplinas` CHANGE `nome` `nome` VARCHAR(100) NULL;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`turmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`turmas` (
  `idTurma` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `idCursoProfissional` INT NOT NULL,
  `anoLetivo` VARCHAR(45) NOT NULL,
  `anoCurso` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idTurma`),
  UNIQUE INDEX `idTurma_UNIQUE` (`idTurma` ASC) ,
  INDEX `fkTurmas_cursos_profissionais1_idx` (`idCursoProfissional` ASC) ,
  CONSTRAINT `fkTurmas_cursos_profissionais1`
    FOREIGN KEY (`idCursoProfissional`)
    REFERENCES `bdcursoprofissional`.`cursosProfissionais` (`idCursoProfissional`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`professores`
-- -----------------------------------------------------
-- https://stackoverflow.com/questions/5775571/what-is-the-maximum-length-of-data-i-can-put-in-a-blob-column-in-mysql
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`professores` (
  `idProfessor` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `foto` MEDIUMBLOB NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idProfessor`),
  UNIQUE INDEX `idProfessor_UNIQUE` (`idProfessor` ASC) )
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`professores` CHANGE `foto` `foto` MEDIUMBLOB NULL;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`alunos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`alunos` (
  `idAluno` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `idade` INT NOT NULL,
  `foto` MEDIUMBLOB NULL,
  `idTurma` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idAluno`),
  UNIQUE INDEX `idAluno_UNIQUE` (`idAluno` ASC) ,
  INDEX `fkAlunosTurmas1_idx` (`idTurma` ASC) ,
  CONSTRAINT `fkAlunosTurmas1`
    FOREIGN KEY (`idTurma`)
    REFERENCES `bdcursoprofissional`.`turmas` (`idTurma`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`alunos` CHANGE `foto` `foto` MEDIUMBLOB NULL;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`modulos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`modulos` (
  `idModulo` INT AUTO_INCREMENT,
  `idDisciplina` INT NOT NULL,
  `numero` INT NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `horas` INT NOT NULL,
  `limiteFaltas` INT NOT NULL,
  `anoCurso` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idModulo`),
  UNIQUE INDEX `id_modulo_UNIQUE` (`idModulo` ASC) ,
  INDEX `fk_modulosDisciplinas1_idx` (`idDisciplina` ASC) ,
  CONSTRAINT `fk_modulosDisciplinas1`
    FOREIGN KEY (`idDisciplina`)
    REFERENCES `bdcursoprofissional`.`disciplinas` (`idDisciplina`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- COLLATE = latin1_general_ci;
-- ALTER TABLE `bdcursoprofissional`.`modulos` ADD`anoCurso` INT NOT NULL;
-- ALTER TABLE `bdcursoprofissional`.`modulos` CHANGE `nome` `nome` VARCHAR(100) NULL;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`professoresTemTurmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`professoresTemTurmas` (
  `idProfessor` INT NOT NULL,
  `idTurma` INT NOT NULL,
  PRIMARY KEY (`idProfessor`, `idTurma`),
  INDEX `fkProfessores_hasTurmasTurmas1_idx` (`idTurma` ASC) ,
  INDEX `fkProfessores_hasTurmasProfessores1_idx` (`idProfessor` ASC) ,
  CONSTRAINT `fkProfessores_hasTurmasProfessores1`
    FOREIGN KEY (`idProfessor`)
    REFERENCES `bdcursoprofissional`.`professores` (`idProfessor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkProfessores_hasTurmasTurmas1`
    FOREIGN KEY (`idTurma`)
    REFERENCES `bdcursoprofissional`.`turmas` (`idTurma`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`avaliacoesDisciplinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`avaliacoesDisciplinas` (
  `idAluno` INT NOT NULL,
  `idDisciplina` INT NOT NULL,
  `idProfessor` INT NOT NULL,
  `avaliacaoFinal` INT NULL,
  `concluido` TINYINT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idAluno`, `idDisciplina`, `idProfessor`),
  INDEX `fkAlunos_hasDisciplinasDisciplinas1_idx` (`idDisciplina` ASC) ,
  INDEX `fkAlunos_hasDisciplinasAlunos1_idx` (`idAluno` ASC) ,
  INDEX `fkAlunos_hasDisciplinasProfessores1_idx` (`idProfessor` ASC) ,
  CONSTRAINT `fkAlunos_hasDisciplinasAlunos1`
    FOREIGN KEY (`idAluno`)
    REFERENCES `bdcursoprofissional`.`alunos` (`idAluno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkAlunos_hasDisciplinasDisciplinas1`
    FOREIGN KEY (`idDisciplina`)
    REFERENCES `bdcursoprofissional`.`disciplinas` (`idDisciplina`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkAlunos_hasDisciplinasProfessores1`
    FOREIGN KEY (`idProfessor`)
    REFERENCES `bdcursoprofissional`.`professores` (`idProfessor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`avaliacoes_modulos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`avaliacoesModulos` (
  `idProfessor` INT NOT NULL,
  `idAluno` INT NOT NULL,
  `idModulo` INT NOT NULL,
  `avaliacao` INT NULL,
  `faltas` INT NULL,
  `dataAvaliacao` DATE NULL,
  `aprovado` TINYINT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`idProfessor`, `idAluno`, `idModulo`),
  INDEX `fkProfessores_hasAlunosAlunos1_idx` (`idAluno` ASC) ,
  INDEX `fkProfessores_hasAlunosProfessores1_idx` (`idProfessor` ASC) ,
  INDEX `fk_avaliacoes_modulos_modulos1_idx` (`idModulo` ASC) ,
  CONSTRAINT `fkProfessores_hasAlunosProfessores1`
    FOREIGN KEY (`idProfessor`)
    REFERENCES `bdcursoprofissional`.`professores` (`idProfessor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fkProfessores_hasAlunosAlunos1`
    FOREIGN KEY (`idAluno`)
    REFERENCES `bdcursoprofissional`.`alunos` (`idAluno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_avaliacoes_modulos_modulos1`
    FOREIGN KEY (`idModulo`)
    REFERENCES `bdcursoprofissional`.`modulos` (`idModulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


--
-- Dados da tabela `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin',NULL,NULL,'mail@mail.com','$2a$08$cl4/vg8XYx.ha.IlKc/WI.agpgfnGl9s657IKGaC8kziys4gQmji.',NULL,NULL,'active','2018-07-27 20:12:59','2018-07-27 20:12:59'),
(2,'rute','rute',NULL,NULL,'abc.def@ghi.pt', '$2a$08$/lyo909Yd56IC01ehMIBReplYME7Nqs30D2gz82F/Zu2qWT9Rscxy',NULL,NULL,'active','2020-04-29 17:29:34','2020-04-29 17:29:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dados da tabela `componentes`
--
INSERT INTO `componentes`(Nome) VALUES('Sociocultural'), ('Científica'), ('Técnica');

--
-- Dados da tabela `cursos_profissionais`
--
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TGEI', 'Técnico(a) de Gestão de Equipamentos Informáticos', 3200);
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TGPSI', 'Técnico(a) de Gestão e Programação de Sistemas Informáticos', 3200);
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TM', 'Técnico(a) de Multimédia', 3200);
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TEAC', 'Técnico(a) de Eletrónica, Automação Comando', 3200);
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TEAC2', 'Técnico(a) de Eletrónica, Automação e Computadores', 3200);
INSERT INTO `cursosProfissionais`(codigo, Nome, totalHoras) VALUES('TET', 'Técnico(a) de Eletrónica e Telecomunicações', 3200);

--
-- Dados da tabela `professores`
--
-- select * from professores
INSERT INTO `professores`(Nome) VALUES('António Antunes');
INSERT INTO `professores`(Nome) VALUES('José Manuel');
INSERT INTO `professores`(Nome) VALUES('Albino Fidalgo');
INSERT INTO `professores`(Nome) VALUES('Bruno Beato');

--
-- Dados da tabela `turmas`
--
-- select * from turmas;
-- delete from ProfessoresTemTurmas where idProfessor = 1;
-- delete from turmas where idTurma > 0;
-- ALTER TABLE turmas AUTO_INCREMENT = 1;
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('10º F', 1, '2019/2020', 1);
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('11º H', 1, '2019/2020', 1);
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('10º G', 1, '2019/2020', 1);
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('10º E', 1, '2019/2020', 1);
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('10º I', 1, '2019/2020', 1);
INSERT INTO `turmas`(nome, idCursoProfissional, anoLetivo, anoCurso) VALUES('10º J', 1, '2019/2020', 1);

--
-- Dados da tabela `alunos`
--
-- select * from alunos
INSERT INTO `alunos`(nome, idade, idTurma) VALUES('António Antunes',16,'10º F');
INSERT INTO `alunos`(nome, idade, idTurma) VALUES('Ana Maria Andrade',17,'10º F');
INSERT INTO `alunos`(nome, idade, idTurma) VALUES('Sara Silva',15,'10º G');
INSERT INTO `alunos`(nome, idade, idTurma) VALUES('Pedro Duarte',19,'11º H');
INSERT INTO `alunos`(nome, idade, idTurma) VALUES('João Jacinto',18,'10º E');

-- Dados da tabela `disciplinas`
--
-- delete from disciplinas where idDisciplina >= 1;
INSERT INTO `disciplinas`(Nome, idComponente, totalHoras, idCursoProfissional) 
/*
VALUES('Português', 1, 200, 1), ('Inglês', 1, 200, 1), ('Área de Integração', 1, 200, 1), 
	('Tecnologias de Informação e Comunicação', 1, 200, 1), ('Educação Física', 1, 200, 1),
	('Matemática', 2, 250, 1), ('Física e Química', 2, 250, 1),
    ('Eletrónica Fundamental', 3, 275, 1), ('Instalação e Manutenção de Equipamentos Informáticos', 3, 275, 1), 
    ('Sistemas Digitais e Arquitetura de Computadores', 3, 275, 1), ('Comunicação de Dados', 3, 275, 1);
*/
VALUES    
('Português', 1, 320, 1), ('Inglês', 1, 220, 1), ('Área de Integração', 1, 220, 1), 
('Tecnologias de Informação e Comunicação', 1, 100, 1), ('Educação Física', 1, 140, 1), 
('Matemática', 2, 300, 1), ('Física e Química', 2, 200, 1),
('Eletrónica Fundamental', 3, 240, 1), ('Inst. Man. Equip. Informáticos', 3, 279, 1),
('Sist. DIg. Arq. Computadores', 3, 381, 1), ('Comunicação de Dados', 3, 200, 1),
('FCT-Formação em Contexto de Trabalho', 3, 600, 1);

--
-- Dados da tabela `modulos`
--
-- select * from modulos;
SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Português');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Textos Medievais: líricos e narrativos', 32, 3, 1),
(@idDisciplina, 2, 'Texto Dramático Vicentino/ Textos Líricos Camonianos', 33, 3, 1),
(@idDisciplina, 3, 'Textos narrativos sobre os Descobrimentos', 32, 3, 1),
(@idDisciplina, 4, 'Textos Argumentativos: Oratória Vieiriana/Texto Dramático Garrettiano', 33, 3, 1),
(@idDisciplina, 5, 'Textos Narrativos Românticos e Realistas/ Naturalistas', 34, 3, 2),
(@idDisciplina, 6, 'Textos Líricos: Antero de Quental e Cesário Verde', 33, 3, 2),
(@idDisciplina, 7, 'Textos Líricos Pessoanos', 40, 4, 2),
(@idDisciplina, 8, 'Texto Épico-Lírico e Lírica Contemporânea', 42, 4, 3),
(@idDisciplina, 9, 'Textos Narrativos Contemporâneas: conto/ romance', 41, 4, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Inglês');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Eu e o Mundo Profissional', 28, 3, 1),
(@idDisciplina, 2, 'Um Mundo de Muitas Línguas', 24, 2, 1),
(@idDisciplina, 3, 'O Mundo Tecnológico', 24, 2, 1),
(@idDisciplina, 4, 'Os Media e a Comunicação Global', 24, 2, 2),
(@idDisciplina, 5, 'Os Jovens na Era Global', 24, 2, 2),
(@idDisciplina, 6, 'O Mundo à Nossa Volta', 24, 2, 2),
(@idDisciplina, 7, 'Os Jovens e o Consumo', 24, 2, 3),
(@idDisciplina, 8, 'O Mundo do Trabalho', 24, 2, 3),
(@idDisciplina, 9, 'A Comunicação no Mundo Profissional', 24, 2, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Área de Integração');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Tema - Problema', 38, 4, 1),
(@idDisciplina, 2, 'Tema - Problema', 38, 4, 1),
(@idDisciplina, 3, 'Tema - Problema', 36, 4, 2),
(@idDisciplina, 4, 'Tema - Problema', 36, 4, 2),
(@idDisciplina, 5, 'Tema - Problema', 36, 4, 3),
(@idDisciplina, 6, 'Tema - Problema', 36, 4, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Tecnologias de Informação e Comunicação');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Folha de Cálculo', 33, 3, 1),
(@idDisciplina, 2, 'Base de Dados', 33, 3, 2),
(@idDisciplina, 3, 'Criação de Páginas Web', 34, 3, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Educação Física');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Jogos Desportivos Coletivos I', 19, 2, 1),
(@idDisciplina, 4, 'Ginástica I', 13, 1, 1),
(@idDisciplina, 7, 'Atletismo/Raquetas I', 13, 1, 1),
(@idDisciplina, 10, 'Dança I', 7, 1, 1),
(@idDisciplina, 13, 'Actividades Físicas / Contextos de Saúde I', 3, 0, 1),
(@idDisciplina, 2, 'Jogos Desportivos Coletivos II', 19, 2, 2),
(@idDisciplina, 5, 'Ginástica II', 13, 1, 2),
(@idDisciplina, 8, 'ATletismo/Raquetas II', 13, 1, 2),
(@idDisciplina, 11, 'Dança II', 7, 1, 2),
(@idDisciplina, 14, 'ACtividades Físicas / Contextos de Saúde II', 3, 0, 2),
(@idDisciplina, 3, 'Jogos Desportivos Coletivos III', 8, 1, 3),
(@idDisciplina, 6, 'Ginástica III', 7, 1, 3),
(@idDisciplina, 9, 'Actividades de Exploração da Natureza', 5, 1, 3),
(@idDisciplina, 12, 'Dança III', 5, 1, 3),
(@idDisciplina, 15, 'Actividades Físicas/ Contextos de Saúde III', 2, 0, 3),
(@idDisciplina, 16, 'Aptidão Física', 3, 0, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Matemática');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'A1 - Geometria', 36, 4, 1),
(@idDisciplina, 2, 'A2 - Funções Polinomiais', 36, 4, 1),
(@idDisciplina, 3, 'A3 - Estatistica', 27, 3, 1),
(@idDisciplina, 4, 'A4 - Funções Periódicas', 36, 4, 2),
(@idDisciplina, 5, 'A5 - Funções Racionais', 36, 4, 2),
(@idDisciplina, 6, 'A6 - Taxa de Variação', 27, 3, 2),
(@idDisciplina, 7, 'A7 - Probabilidades', 21, 2, 3),
(@idDisciplina, 8, 'A8 - Modelos Discretos', 27, 3, 3),
(@idDisciplina, 9, 'A9 - Funções de Crescimento', 27, 3, 3),
(@idDisciplina, 10, 'A10 - Optimização', 27, 3, 3);

select * from modulos;
SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Física e Química');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Q1 - Estrutura Atómica. Tabela Periódica. Ligação Química.', 18, 2, 1),
(@idDisciplina, 2, 'Q2 - Soluções.', 18, 2, 1),
(@idDisciplina, 3, 'EQ2- Coloídes e Suspensões', 6, 1, 1),
(@idDisciplina, 4, 'F1- Forças e Movimentos', 21, 2, 1),
(@idDisciplina, 5, 'E2F1- Trabalho e Energia', 6, 1, 1),
(@idDisciplina, 6, 'F3 - Luz e Fontes de Luz', 12, 1, 1),
(@idDisciplina, 7, 'E2F3- Ótica Ondulatória e Ótica Quântica', 9, 1, 2),
(@idDisciplina, 8, 'F4- Circuitos Elétricos', 18, 2, 2),
(@idDisciplina, 9, 'F5 - Termodinâmica', 21, 2, 2),
(@idDisciplina, 10, 'Q3 - Reações Químicas. Equilíbrio Químico Homogéneo.', 18, 2, 2),
(@idDisciplina, 8, 'Q4 - Equilíbrio Ácido-Base', 18, 2, 3),
(@idDisciplina, 9, 'Q5 - Equilíbrio de Oxidação-redução.', 18, 2, 3),
(@idDisciplina, 10, 'F6 - Som', 17, 2, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Eletrónica Fundamental');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Noções Básicas de Electricidade', 16, 2, 1),
(@idDisciplina, 2, 'Análise de Circuitos em Corrente Contínua', 34, 3, 1),
(@idDisciplina, 3, 'Análise de Circuitos em Corrente Alternada', 34, 3, 1),
(@idDisciplina, 4, 'Introdução aos Semicondutores e Díodos', 32, 3, 2),
(@idDisciplina, 5, 'Transístores Bipolares em Regime Estático', 17, 2, 2),
(@idDisciplina, 6, 'Amplificadores com Transístores Bipolares', 27, 3, 2),
(@idDisciplina, 7, 'Amplificadores Operacionais', 28, 3, 3),
(@idDisciplina, 8, 'Tecnologias de Electricidade', 34, 3, 3),
(@idDisciplina, 9, 'Circuitos Impressos', 18, 2, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Inst. Man. Equip. Informáticos');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Regras de segurança e ferramentas na manut. de equip. informáticos', 16, 2, 1),
(@idDisciplina, 2, 'Montagem de computadores', 44, 4, 1),
(@idDisciplina, 3, 'Estrutura e configuração de sistemas operativos monoposto', 31, 3, 1),
(@idDisciplina, 4, 'Instalação de sistemas operativos', 31, 3, 1),
(@idDisciplina, 5, 'Instalação e utilização de aplicações', 33, 3, 2),
(@idDisciplina, 6, 'Técnicas de diagnóstico e reparação de avarias', 18, 2, 2),
(@idDisciplina, 7, 'Manutenção de equipamentos', 34, 3, 2),
(@idDisciplina, 8, 'Montagem e manutenção de redes de dados', 36, 4, 3),
(@idDisciplina, 9, 'Gestão de procedimentos de manutenção', 36, 4, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Sist. Dig. Arq. Computadores');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Sistemas de Numeração', 30, 3, 1),
(@idDisciplina, 2, 'Álgebra e Lógica Booleana', 36, 4, 1),
(@idDisciplina, 3, 'Circuitos Combinatórios', 36, 4, 1),
(@idDisciplina, 4, 'Circuitos Sequenciais', 36, 4, 1),
(@idDisciplina, 5, 'Introdução à Lógica Programável', 18, 2, 1),
(@idDisciplina, 6, 'Fundamentos de Programação', 106, 11, 2),
(@idDisciplina, 7, 'Arquitectura de Computadores', 33, 3, 3),
(@idDisciplina, 8, 'Análise de Equipamentos Informáticos', 33, 3, 3),
(@idDisciplina, 9, 'Arquitectura de Microprocessadores', 20, 2, 3),
(@idDisciplina, 10, 'Programação de Microprocessadores', 33, 3, 3);

SET @idDisciplina = (Select idDisciplina from Disciplinas where nome = 'Comunicação De Dados');
INSERT INTO `modulos` (idDisciplina, numero, nome, horas,  limiteFaltas, anoCurso) VALUES 
(@idDisciplina, 1, 'Introdução às Redes e Transmissão de Dados', 18, 2, 1),
(@idDisciplina, 2, 'Caracterização de Redes e Comunicação de Dados', 27, 3, 1),
(@idDisciplina, 3, 'Protocolos de Rede', 27, 3, 1),
(@idDisciplina, 4, 'Equipamentos e Meios de Transmissão de Dados', 28, 3, 1),
(@idDisciplina, 5, 'Instalação e Configuração de Redes', 100, 10, 2);
