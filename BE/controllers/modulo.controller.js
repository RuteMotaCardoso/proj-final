const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT m.idModulo, m.numero, m.nome, m.horas as totalHoras, m.limiteFaltas, m.anoCurso, m.idDisciplina, '
        + ' d.nome as disciplina, c.nome as componente, cp.codigo as curso '
        + ' FROM modulos m inner join disciplinas d on m.idDisciplina = d.idDisciplina '
        + ' inner join componentes c on c.idComponente = d.idComponente '
        + ' inner join cursosProfissionais cp on cp.idCursoProfissional = d.idCursoProfissional '
        + ' where m.ativo = 1 '
        + ' order by m.idDisciplina, m.idModulo', 
        function(err, rows, fields) {
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
    const idModulo = req.sanitize('id').escape();
    const post = { idModulo: idModulo };
    connect.con.query('SELECT idModulo, numero, nome, horas, limiteFaltas, anoCurso, idDisciplina FROM modulos WHERE ? order by idModulo desc', post, function(err, rows, fields) {
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
    const numero = req.sanitize('numero').escape();
    const horas = req.sanitize('horas').escape();
    const limiteFaltas = req.sanitize('limiteFaltas').escape();
    const anoCurso = req.sanitize('anoCurso').escape();
    const idDisciplina = req.sanitize('idDisciplina').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("numero", "Insira numero válido").isNumeric();
    req.checkBody("horas", "Insira horas válido").isNumeric();
    req.checkBody("limiteFaltas", "Insira total Faltas válido").isNumeric();
    req.checkBody("anoCurso", "Insira um Ano Curso válido").isNumeric();
    req.checkBody("idDisciplina", "Insira um idDisciplina válido").isNumeric();
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL"  && typeof(nome) != "undefined") {
            const post = { nome: nome, numero: numero, horas: horas, limiteFaltas: limiteFaltas, anoCurso: anoCurso, idDisciplina: idDisciplina, ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO modulos SET ?', post, function(err, rows, fields) {
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
    const numero = req.sanitize('numero').escape();
    const horas = req.sanitize('horas').escape();
    const limiteFaltas = req.sanitize('limiteFaltas').escape();
    const anoCurso = req.sanitize('anoCurso').escape();
    const idDisciplina = req.sanitize('idDisciplina').escape();
    const idModulo = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("numero", "Insira numero válido").isNumeric();
    req.checkBody("horas", "Insira horas válido").isNumeric();
    req.checkBody("limiteFaltas", "Insira total Faltas válido").isNumeric();
    req.checkBody("anoCurso", "Insira um Ano Curso válido").isNumeric();
    req.checkBody("idDisciplina", "Insira um idDisciplina válido").isNumeric();
    req.checkParams("id", "Insira um ID de Modulo válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idModulo != "NULL" && typeof(nome) != 'undefined' &&  typeof(idModulo) != 'undefined') {
            const update = [nome, numero, horas, limiteFaltas, anoCurso, idDisciplina, idModulo];
            const query = connect.con.query('UPDATE modulos SET nome =?, numero =?, horas =?, limiteFaltas =?, anoCurso =?, idDisciplina =? WHERE idModulo=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idModulo} atualizado com sucesso`);
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
    const idModulo = req.sanitize('id').escape();
    const update = [0, idModulo];
    const query = connect.con.query('UPDATE modulos SET ativo = ? WHERE idModulo=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idModulo} desativado com sucesso`);
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
    const idModulo = req.sanitize('id').escape();
    const update = idModulo;
    const query = connect.con.query('DELETE FROM modulos WHERE idModulo=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idModulo} apagado com sucesso`);
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
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
};
