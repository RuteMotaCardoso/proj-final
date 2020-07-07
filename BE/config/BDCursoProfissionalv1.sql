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
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`cursos_profissionais` (
  `id_curso_profissional` INT AUTO_INCREMENT,
  `codigo` VARCHAR(45) NULL,
  `nome` VARCHAR(100) NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_curso_profissional`),
  UNIQUE INDEX `id_UNIQUE` (`id_curso_profissional` ASC) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) ,
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) )
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`cursos_profissionais` CHANGE `nome` `nome` VARCHAR(100) NULL;

-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`componentes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`componentes` (
  `id_componente` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  PRIMARY KEY (`id_componente`),
  UNIQUE INDEX `id_componente_UNIQUE` (`id_componente` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`disciplinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`disciplinas` (
  `id_disciplina` INT AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `total_horas` INT NOT NULL,
  `id_componente` INT NOT NULL,
  `id_curso_profissional` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_disciplina`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) ,
  INDEX `fk_disciplinas_componentes_idx` (`id_componente` ASC) ,
  INDEX `fk_disciplinas_cursos_profissionais1_idx` (`id_curso_profissional` ASC) ,
  CONSTRAINT `fk_disciplinas_componentes`
    FOREIGN KEY (`id_componente`)
    REFERENCES `bdcursoprofissional`.`componentes` (`id_componente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_disciplinas_cursos_profissionais1`
    FOREIGN KEY (`id_curso_profissional`)
    REFERENCES `bdcursoprofissional`.`cursos_profissionais` (`id_curso_profissional`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- ALTER TABLE `bdcursoprofissional`.`disciplinas` CHANGE `nome` `nome` VARCHAR(100) NULL;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`turmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`turmas` (
  `id_turma` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `id_curso_profissional` INT NOT NULL,
  `ano_letivo` VARCHAR(45) NOT NULL,
  `ano_curso` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_turma`),
  UNIQUE INDEX `id_turma_UNIQUE` (`id_turma` ASC) ,
  INDEX `fk_turmas_cursos_profissionais1_idx` (`id_curso_profissional` ASC) ,
  CONSTRAINT `fk_turmas_cursos_profissionais1`
    FOREIGN KEY (`id_curso_profissional`)
    REFERENCES `bdcursoprofissional`.`cursos_profissionais` (`id_curso_profissional`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`professores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`professores` (
  `id_professor` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `foto` BLOB NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_professor`),
  UNIQUE INDEX `id_professor_UNIQUE` (`id_professor` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`alunos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`alunos` (
  `id_aluno` INT AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `idade` INT NOT NULL,
  `foto` BLOB NULL,
  `id_turma` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_aluno`),
  UNIQUE INDEX `id_aluno_UNIQUE` (`id_aluno` ASC) ,
  INDEX `fk_alunos_turmas1_idx` (`id_turma` ASC) ,
  CONSTRAINT `fk_alunos_turmas1`
    FOREIGN KEY (`id_turma`)
    REFERENCES `bdcursoprofissional`.`turmas` (`id_turma`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`modulos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`modulos` (
  `id_modulo` INT AUTO_INCREMENT,
  `id_disciplina` INT NOT NULL,
  `numero` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `horas` INT NOT NULL,
  `limite_faltas` INT NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_modulo`),
  UNIQUE INDEX `id_modulo_UNIQUE` (`id_modulo` ASC) ,
  INDEX `fk_modulos_disciplinas1_idx` (`id_disciplina` ASC) ,
  CONSTRAINT `fk_modulos_disciplinas1`
    FOREIGN KEY (`id_disciplina`)
    REFERENCES `bdcursoprofissional`.`disciplinas` (`id_disciplina`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`professores_tem_turmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`professores_tem_turmas` (
  `id_professor` INT NOT NULL,
  `id_turma` INT NOT NULL,
  PRIMARY KEY (`id_professor`, `id_turma`),
  INDEX `fk_professores_has_turmas_turmas1_idx` (`id_turma` ASC) ,
  INDEX `fk_professores_has_turmas_professores1_idx` (`id_professor` ASC) ,
  CONSTRAINT `fk_professores_has_turmas_professores1`
    FOREIGN KEY (`id_professor`)
    REFERENCES `bdcursoprofissional`.`professores` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professores_has_turmas_turmas1`
    FOREIGN KEY (`id_turma`)
    REFERENCES `bdcursoprofissional`.`turmas` (`id_turma`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`avaliacoes_disciplinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`avaliacoes_disciplinas` (
  `id_aluno` INT NOT NULL,
  `id_disciplina` INT NOT NULL,
  `id_professor` INT NOT NULL,
  `avaliacao_final` INT NULL,
  `concluido` TINYINT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_aluno`, `id_disciplina`, `id_professor`),
  INDEX `fk_alunos_has_disciplinas_disciplinas1_idx` (`id_disciplina` ASC) ,
  INDEX `fk_alunos_has_disciplinas_alunos1_idx` (`id_aluno` ASC) ,
  INDEX `fk_alunos_has_disciplinas_professores1_idx` (`id_professor` ASC) ,
  CONSTRAINT `fk_alunos_has_disciplinas_alunos1`
    FOREIGN KEY (`id_aluno`)
    REFERENCES `bdcursoprofissional`.`alunos` (`id_aluno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alunos_has_disciplinas_disciplinas1`
    FOREIGN KEY (`id_disciplina`)
    REFERENCES `bdcursoprofissional`.`disciplinas` (`id_disciplina`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_alunos_has_disciplinas_professores1`
    FOREIGN KEY (`id_professor`)
    REFERENCES `bdcursoprofissional`.`professores` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bdcursoprofissional`.`avaliacoes_modulos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bdcursoprofissional`.`avaliacoes_modulos` (
  `id_professor` INT NOT NULL,
  `id_aluno` INT NOT NULL,
  `id_modulo` INT NOT NULL,
  `avaliacao` INT NULL,
  `faltas` INT NULL,
  `data_avaliacao` DATE NULL,
  `aprovado` TINYINT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_professor`, `id_aluno`, `id_modulo`),
  INDEX `fk_professores_has_alunos_alunos1_idx` (`id_aluno` ASC) ,
  INDEX `fk_professores_has_alunos_professores1_idx` (`id_professor` ASC) ,
  INDEX `fk_avaliacoes_modulos_modulos1_idx` (`id_modulo` ASC) ,
  CONSTRAINT `fk_professores_has_alunos_professores1`
    FOREIGN KEY (`id_professor`)
    REFERENCES `bdcursoprofissional`.`professores` (`id_professor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professores_has_alunos_alunos1`
    FOREIGN KEY (`id_aluno`)
    REFERENCES `bdcursoprofissional`.`alunos` (`id_aluno`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_avaliacoes_modulos_modulos1`
    FOREIGN KEY (`id_modulo`)
    REFERENCES `bdcursoprofissional`.`modulos` (`id_modulo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


--
-- Data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin',NULL,NULL,'mail@mail.com','$2a$08$cl4/vg8XYx.ha.IlKc/WI.agpgfnGl9s657IKGaC8kziys4gQmji.',NULL,NULL,'active','2018-07-27 20:12:59','2018-07-27 20:12:59'),
(2,'rute','rute',NULL,NULL,'abc.def@ghi.pt', '$2a$08$/lyo909Yd56IC01ehMIBReplYME7Nqs30D2gz82F/Zu2qWT9Rscxy',NULL,NULL,'active','2020-04-29 17:29:34','2020-04-29 17:29:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Data for table `componentes`
--
INSERT INTO `componentes`(Nome) VALUES('Sociocultural'), ('Científica'), ('Técnica');

--
-- Data for table `cursos_profissionais`
--
INSERT INTO `cursos_profissionais`(codigo, Nome) VALUES('TGEI', 'Técnico(a) de Gestão de Equipamentos Informáticos');

--
-- Data for table `disciplinas`
--
INSERT INTO `disciplinas`(Nome, id_componente, total_horas, id_curso_profissional) 
VALUES('Português', 1, 200, 1), ('Inglês', 1, 200, 1), ('Área de Integração', 1, 200, 1), 
	('Tecnologias de Informação e Comunicação', 1, 200, 1), ('Educação Física', 1, 200, 1),
	('Matemática', 2, 250, 1), ('Física e Química', 2, 250, 1),
    ('Eletrónica Fundamental', 3, 275, 1), ('Instalação e Manutenção de Equipamentos Informáticos', 3, 275, 1), 
    ('(Sistemas Digitais e Arquitetura de Computadores', 3, 275, 1), ('Comunicação de Dados', 3, 275, 1);
