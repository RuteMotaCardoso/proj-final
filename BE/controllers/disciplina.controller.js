const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT d.idDisciplina, d.nome, d.totalHoras, c.nome as componente, cp.codigo as curso '
    + ' FROM disciplinas d inner join cursosProfissionais cp on d.idCursoProfissional = cp.idCursoProfissional '
    + ' inner join componentes c on c.idComponente = d.idComponente'
    + ' where d.ativo = 1 '
    + ' order by d.idCursoProfissional, d.idDisciplina ', function(err, rows, fields) {
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
    const idDisciplina = req.sanitize('id').escape();
    const post = { idDisciplina: idDisciplina };
    connect.con.query('SELECT idDisciplina, nome, totalHoras, idComponente, idCursoProfissional FROM disciplinas WHERE ? order by idDisciplina desc', post, function(err, rows, fields) {
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
    const totalHoras = req.sanitize('totalHoras').escape();
    const idComponente = req.sanitize('idComponente').escape();
    const idCurso = req.sanitize('idCurso').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("idComponente", "Insira um Id Componente válido").isNumeric();
    req.checkBody("totalHoras", "Insira um total horas válido").isNumeric();
    req.checkBody("idCurso", "Insira um Id Curso válido").isNumeric();
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL"  && typeof(nome) != "undefined") {
            const post = { nome: nome, idComponente: idComponente, totalHoras: totalHoras, idCursoProfissional: idCurso, ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO disciplinas SET ?', post, function(err, rows, fields) {
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
    //console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const totalHoras = req.sanitize('totalHoras').escape();
    const idCurso = req.sanitize('idCurso').escape();
    const idComponente = req.sanitize('idComponente').escape();
    const idDisciplina = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("idComponente", "Insira um Id Componente válido").isNumeric();
    req.checkBody("totalHoras", "Insira um total horas válido").isNumeric();
    req.checkBody("idCurso", "Insira um IdCurso válido").isNumeric();
    req.checkParams("id", "Insira um ID de Disciplina válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idDisciplina != "NULL" && typeof(nome) != 'undefined' &&  typeof(idDisciplina) != 'undefined') {
            const update = [nome, totalHoras, idCurso, idComponente, idDisciplina];
            const query = connect.con.query('UPDATE disciplinas SET nome =?, totalHoras =?, idCursoProfissional =?, idComponente =? WHERE idDisciplina=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idDisciplina} atualizado com sucesso`);
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
    const idDisciplina = req.sanitize('id').escape();
    const update = [0, idDisciplina];
    const query = connect.con.query('UPDATE disciplinas SET ativo = ? WHERE idDisciplina=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idDisciplina} desativado com sucesso`);
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
    const idDisciplina = req.sanitize('id').escape();
    const update = idDisciplina;
    const query = connect.con.query('DELETE FROM disciplinas WHERE idDisciplina=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idDisciplina} apagado com sucesso`);
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function readModulos(req, res) {
    const idDisciplina = req.sanitize('idDisciplina').escape();
    const params = [ idDisciplina ];
        connect.con.query('SELECT m.idModulo, m.numero, m.nome, m.horas as totalHoras, m.limiteFaltas, m.anoCurso, m.idDisciplina, '
        + ' d.nome as disciplina, c.nome as componente, cp.codigo as curso '
        + ' FROM modulos m inner join disciplinas d on m.idDisciplina = d.idDisciplina '
        + ' inner join componentes c on c.idComponente = d.idComponente '
        + ' inner join cursosProfissionais cp on cp.idCursoProfissional = d.idCursoProfissional '
        + ' where m.ativo = 1 and m.idDisciplina =? '
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
    readModulos: readModulos,
};
