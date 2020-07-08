const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT t.idTurma, t.nome, t.anoLetivo, t.anoCurso, t.idCursoProfissional, cp.codigo as curso '
        + ' FROM turmas t inner join cursosProfissionais cp on t.idCursoProfissional = cp.idCursoProfissional '
        //+ ' FROM turmas t natural join cursosProfissionais cp '
        + ' where t.ativo = 1 '
        + ' order by t.idTurma', function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registos lidos com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}

function readID(req, res) {
    const idTurma = req.sanitize('id').escape();
    const post = { idTurma: idTurma };
    connect.con.query('SELECT t.idTurma, t.nome, t.anoLetivo, t.anoCurso, t.idCursoProfissional, cp.codigo as curso '
        + ' FROM turmas t inner join cursosProfissionais cp on t.idCursoProfissional = cp.idCursoProfissional '
        + ' where ? ' , 
        post, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            console.log(post);
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registo lido com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}


function save(req, res) {
    console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const anoLetivo = req.sanitize('anoLetivo');
    const anoCurso = req.sanitize('anoCurso').escape();
    const idCurso = req.sanitize('idCurso').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("anoLetivo", "Insira um ano letivo válido (AAAA/AAAA)").matches(/^[0-9\-/&#x2F; ]+$/i);
    req.checkBody("anoCurso", "Insira um Ano Curso válido").isNumeric();
    req.checkBody("idCurso", "Insira um IdCurso válido").isNumeric();
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL"  && typeof(nome) != "undefined") {
            const post = { nome: nome, anoLetivo: anoLetivo, anoCurso: anoCurso, idCursoProfissional: idCurso, ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO turmas SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${rows.insertId} inserido com sucesso`);
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else {
            res.status(jsonMessages.db.requiredData.status).end(jsonMessages.db.requiredData);
        }
    }
}

function update(req, res) {
    console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const anoLetivo = req.sanitize('anoLetivo').escape();
    const anoCurso = req.sanitize('anoCurso').escape();
    const idCurso = req.sanitize('idCurso').escape();
    const idTurma = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("anoLetivo", "Insira um ano letivo válido (AAAA/AAAA)").matches(/^[0-9\-/&#x2F; ]+$/i);
    req.checkBody("anoCurso", "Insira um Ano Curso válido").isNumeric();
    req.checkBody("idCurso", "Insira um IdCurso válido").isNumeric();
    req.checkParams("id", "Insira um ID de Turma válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idTurma != "NULL" && typeof(nome) != 'undefined' &&  typeof(idTurma) != 'undefined') {
            const update = [nome, anoLetivo.replace('&#x2F;', '/'), anoCurso, idCurso, idTurma];
            const query = connect.con.query('UPDATE turmas SET nome =?, anoLetivo =?, anoCurso =?, idCursoProfissional =? WHERE idTurma=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idTurma} atualizado com sucesso`);
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function deleteL(req, res) {
    //console.log(req.body);
    const idTurma = req.sanitize('id').escape();
    const update = [0, idTurma];
    const query = connect.con.query('UPDATE turmas SET ativo = ? WHERE idTurma=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idTurma} desativado com sucesso`);
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);

            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function deleteF(req, res) {
    //console.log(req.body);
    const idTurma = req.sanitize('id').escape();
    const update = idTurma;
    const query = connect.con.query('DELETE FROM turmas WHERE idTurma=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idTurma} apagado com sucesso`);
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function saveProfessor(req, res) {
    //receber os dados do formulário que são enviados por post
    req.sanitize('idProfessor').escape();
    req.sanitize('idTurma').escape();
    req.checkParams("idProfessor", "Insira um ID Professor válido.").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idProfessor = req.params.idProfessor;
        const idTurma = req.params.idTurma;
        const nome = req.body.nomeProfessor;
        if (idProfessor != "NULL" && idTurma != "NULL" && typeof(idProfessor) != 'undefined' && typeof(idTurma) != 'undefined') {
            const post = { idProfessor: idProfessor, idTurma: idTurma };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO professoresTemTurmas SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    if (err.code == "ER_DUP_ENTRY") {
                        res.status(jsonMessages.db.duplicatedRecord.status).send(jsonMessages.db.duplicatedRecord);
                    }
                    else
                        res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function readProfessores(req, res) {
    const idTurma = req.sanitize('idTurma').escape();
    const params = [ idTurma ];
        connect.con.query('SELECT p.idProfessor, p.nome, pt.idTurma, t.nome as turma, t.anoLetivo, t.anoCurso, t.idCursoProfissional '
        + ' FROM professores p inner join professoresTemTurmas pt on pt.idProfessor = p.idProfessor '
        + ' inner join turmas t on t.idTurma = pt.idTurma '
        + ' where t.ativo = 1 and pt.idTurma =? '
        + ' order by p.idProfessor', params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registos lidos com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}

function deleteProfessor(req, res) {
    //console.log(req.body);
    const idProfessor = req.sanitize('idProfessor').escape();
    const idTurma = req.sanitize('idTurma').escape();
    req.checkParams("idProfessor", "Insira um ID Professor válido.").isNumeric();
    req.checkParams("idTurma", "Insira um ID Turma válido.").isNumeric();
    const update = [idTurma, idProfessor];
    const query = connect.con.query('DELETE FROM professoresTemTurmas WHERE idTurma=? AND idProfessor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idTurma} apagado com sucesso`);
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function readAlunos(req, res) {
    const idTurma = req.sanitize('idTurma').escape();
    const params = [ idTurma ];
        connect.con.query('SELECT a.idAluno, a.nome, a.idade, a.idTurma, t.nome as turma, t.anoLetivo, t.anoCurso, t.idCursoProfissional, cp.codigo as curso '
        + ' FROM alunos a inner join turmas t on a.idTurma = t.idTurma inner join cursosProfissionais cp on t.idCursoProfissional = cp.idCursoProfissional '
        + ' where t.ativo = 1 and a.idTurma =? '
        + ' order by a.idAluno', params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registos lidos com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}

function readDisciplinas(req, res) {
    const idTurma = req.sanitize('idTurma').escape();
    const params = [ idTurma ];
        connect.con.query('SELECT d.idDisciplina, d.nome, d.totalHoras, t.idTurma, t.nome as turma, t.anoLetivo, t.anoCurso, t.idCursoProfissional, cp.codigo as curso, c.nome as componente '
        + ' FROM turmas t inner join cursosProfissionais cp on t.idCursoProfissional = cp.idCursoProfissional '
        + ' inner join disciplinas d on d.idCursoProfissional = cp.idCursoProfissional '
        + ' inner join componentes c on c.idComponente = d.idComponente '
        + ' where t.ativo = 1 and t.idTurma =? '
        + ' order by d.idDisciplina', params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registos lidos com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}

function readModulos(req, res) {
    const idTurma = req.sanitize('idTurma').escape();
    const params = [ idTurma ];
        connect.con.query('SELECT m.idModulo, m.nome, m.horas, t.idTurma, t.nome as turma, t.anoLetivo, t.anoCurso, t.idCursoProfissional, cp.codigo as curso, c.nome as componente '
        + ' FROM turmas t inner join cursosProfissionais cp on t.idCursoProfissional = cp.idCursoProfissional '
        + ' inner join disciplinas d on d.idCursoProfissional = cp.idCursoProfissional '
        + ' inner join modulos m on m.idDisciplina = d.idDisciplina'
        + ' inner join componentes c on c.idComponente = d.idComponente '
        + ' where t.ativo = 1 and t.idTurma =? '
        + ' order by m.idModulo', params, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                console.log(`${rows.length} Registos lidos com sucesso (BD)`);
                res.send(rows);
            }
        }
    });
}

module.exports = {
    read: read,
    readID: readID,
    save: save,
    update: update,
    deleteL: deleteL,
    deleteF: deleteF,
    saveProfessor: saveProfessor,
    readAlunos: readAlunos,
    readDisciplinas: readDisciplinas,
    readModulos: readModulos,
    readProfessores: readProfessores,
    deleteProfessor: deleteProfessor,
};
