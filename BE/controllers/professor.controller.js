const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT idProfessor, nome FROM professores where ativo = 1 order by idProfessor desc', function(err, rows, fields) {
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
    const idProfessor = req.sanitize('id').escape();
    const post = { idProfessor: idProfessor };
    // https://dev.mysql.com/doc/refman/5.6/en/string-functions.html#function_from-base64
    // https://stackoverflow.com/questions/1504962/how-to-remove-new-line-characters-from-data-rows-in-mysql
    connect.con.query('SELECT idProfessor, nome, REPLACE(REPLACE(TO_BASE64(foto), \'\\r\', \'\'), \'\\n\', \'\') as foto FROM professores WHERE ? order by idProfessor desc', post, function(err, rows, fields) {
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
    // https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
    const foto = req.body.foto;
    //console.log(req.body.foto);
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
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
            const post = { nome: nome, foto: fotoBin,  ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO professores SET ?', post, function(err, rows, fields) {
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
    // https://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters
    const foto = req.body.foto;
    //console.log(req.body.foto);

    const idProfessor = req.sanitize('id').escape();
    req.checkBody("nome", "Insira apenas texto").matches(/^[a-zÀ-ú ]+$/i);
    req.checkParams("id", "Insira um ID de professor válido").isNumeric();
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

        // DEbug Img decode/write
        //console.log(foto)
        //console.log(fotoBin)
        //var fotBin = new Buffer(foto, 'base64')
        // const fs = require('fs');
        // fs.writeFile("t1.png", fotoBin, function(err) {
        //     if(err) {
        //         console.log("err", err);
        //     } else {
        //         console.log("OK!");
        //     }
        //   });   
        if (idProfessor != "NULL" && typeof(nome) != 'undefined' &&  typeof(idProfessor) != 'undefined') {
            const update = [nome, fotoBin, idProfessor];
            const query = connect.con.query('UPDATE professores SET nome =?, foto=? WHERE idProfessor=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idProfessor} atualizado com sucesso`);
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
    const idProfessor = req.sanitize('id').escape();
    const update = [0, idProfessor];
    const query = connect.con.query('UPDATE professores SET ativo = ? WHERE idProfessor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idProfessor} desativado com sucesso`);
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
    const idProfessor = req.sanitize('id').escape();
    const update = idProfessor;
    const query = connect.con.query('DELETE FROM professores WHERE idProfessor=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idProfessor} apagado com sucesso`);
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
