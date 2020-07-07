const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT a.idAluno, a.nome, a.idade, a.idTurma, t.nome as turma '
        + ' FROM alunos a inner join turmas t on a.idTurma = t.idTurma '
        + ' where a.ativo = 1 order by a.idAluno', function(err, rows, fields) {
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
    const idAluno = req.sanitize('id').escape();
    const post = { idAluno: idAluno };
    // https://dev.mysql.com/doc/refman/5.6/en/string-functions.html#function_from-base64
    // https://stackoverflow.com/questions/1504962/how-to-remove-new-line-characters-from-data-rows-in-mysql
    connect.con.query('SELECT idAluno, nome, idade, REPLACE(REPLACE(TO_BASE64(foto), \'\\r\', \'\'), \'\\n\', \'\') as foto, idTurma FROM alunos WHERE ? order by idAluno', post, function(err, rows, fields) {
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
    //console.log(req.body);
    const nome = req.sanitize('nome').escape();
    const idade = req.sanitize('idade').escape();
    // https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
    const foto = req.body.foto;
    const idTurma = req.sanitize('idTurma').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("idade", "Insira uma idade válida").isNumeric();
    req.checkBody("idTurma", "Insira um IdTurma válido").isNumeric();
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        // https://stackoverflow.com/questions/14042599/storing-base64-encoded-data-as-blob-or-text-datatype
        // https://stackoverflow.com/questions/25951251/nodejs-mysql-insert-blob
        // https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error
        var fotoBin = Buffer.from(foto, 'base64')
        if (nome != "NULL"  && typeof(nome) != "undefined") {
            const post = { nome: nome, idade: idade, foto: fotoBin, idTurma: idTurma, ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO alunos SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${rows.insertId} inserido com sucesso`);
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err.sqlMessage);
                    let msg = jsonMessages.db.dbError
                    msg.message.pt += ` ${err.sqlMessage}`
                    res.status(jsonMessages.db.dbError.status).send(msg);
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
    const idade = req.sanitize('idade').escape();
    // https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
    const foto = req.body.foto;
    const idTurma = req.sanitize('idTurma').escape();
    const idAluno = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkBody("idade", "Insira uma idade válida").isNumeric();
    req.checkBody("idTurma", "Insira um IdTurma válido").isNumeric();
    req.checkParams("id", "Insira um ID de aluno válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        // https://stackoverflow.com/questions/25951251/nodejs-mysql-insert-blob
        // https://stackoverflow.com/questions/23097928/node-js-throws-btoa-is-not-defined-error
        // https://stackoverflow.com/questions/43487543/writing-binary-data-using-node-js-fs-writefile-to-create-an-image-file
        var fotoBin = Buffer.from(foto, 'base64')
        
        if (idAluno != "NULL" && typeof(nome) != 'undefined' &&  typeof(idAluno) != 'undefined') {
            const update = [nome, idade, fotoBin, idTurma, idAluno];
            const query = connect.con.query('UPDATE alunos SET nome =?, idade=?, foto=?, idTurma=? WHERE idAluno=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idAluno} atualizado com sucesso`);
                    res.status(jsonMessages.db.successUpdate.status).send(jsonMessages.db.successUpdate);
                }
                else {
                    console.log(err.sqlMessage);
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
    const idAluno = req.sanitize('id').escape();
    const update = [0, idAluno];
    const query = connect.con.query('UPDATE alunos SET activo = ? WHERE idAluno=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idAluno} desativado com sucesso`);
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
    const idAluno = req.sanitize('id').escape();
    const update = idAluno;
    const query = connect.con.query('DELETE FROM alunos WHERE idAluno=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idAluno} apagado com sucesso`);
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
