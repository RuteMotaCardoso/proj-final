const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');
//função de leitura que retorna o resultado no callback
function readCursoProfissional(req, res) {
    const query = connect.con.query('SELECT idCursoProfissional, codigo, nome, totalHoras FROM cursosProfissionais where ativo = 1 order by idCursoProfissional', function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function readCursoProfissionalID(req, res) {
    const idCurso = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCurso };
    const query = connect.con.query('SELECT idCursoProfissional, codigo, nome, totalHoras FROM cursosProfissionais where ? order by idCursoProfissional', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveCursoProfissional(req, res) {
    console.log(req.body);
    const codigo = req.sanitize('codigo').escape();
    const nome = req.sanitize('nome').escape();
    const totalHoras = req.sanitize('totalHoras').escape();
    req.checkBody("codigo", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("totalHoras", "Insira um total horas válido").isNumeric();
    const errors = req.validationErrors();    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome != "NULL"  && typeof(nome) != "undefined") {
            const post = { codigo: codigo, nome: nome, totalHoras: totalHoras, ativo: 1 };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO cursosProfissionais SET ?', post, function(err, rows, fields) {
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

function updateCursoProfissional(req, res) {
    console.log(req.body);
    const codigo = req.sanitize('codigo').escape();
    const nome = req.sanitize('nome').escape();
    const totalHoras = req.sanitize('totalHoras').escape();
    const idCurso = req.sanitize('id').escape();
    req.checkBody("codigo", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("nome", "Insira apenas texto").matches(/^[0-9a-zÀ-ú\-º ]+$/i);
    req.checkBody("totalHoras", "Insira um total horas válido").isNumeric();
    req.checkParams("id", "Insira um ID de Curso válido").isNumeric();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (idCurso != "NULL" && typeof(nome) != 'undefined' &&  typeof(idCurso) != 'undefined') {
            const update = [codigo, nome, totalHoras, idCurso];
            const query = connect.con.query('UPDATE cursosProfissionais SET codigo =?, nome =?, totalHoras =? WHERE idCursoProfissional=?', update, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(`Registo ${idCurso} atualizado com sucesso`);
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

function deleteLCursoProfissional(req, res) {
    //console.log(req.body);
    const idCurso = req.sanitize('id').escape();
    const update = [0, idCurso];
    const query = connect.con.query('UPDATE cursosProfissionais SET ativo = ? WHERE idCursoProfissional=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idCurso} desativado com sucesso`);
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);

            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function deleteFCursoProfissional(req, res) {
    //console.log(req.body);
    const idCurso = req.sanitize('id').escape();
    const update = idCurso;
    const query = connect.con.query('DELETE FROM cursosProfissionais WHERE idCursoProfissional=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            console.log(`Registo ${idCurso} apagado com sucesso`);
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}


function readDisciplinas(req, res) {
    const idCurso = req.sanitize('idCurso').escape();
    const params = [ idCurso ];
        connect.con.query('SELECT d.idDisciplina, d.nome, d.totalHoras, c.nome as componente, cp.codigo as curso '
    + ' FROM disciplinas d inner join cursosProfissionais cp on d.idCursoProfissional = cp.idCursoProfissional '
    + ' inner join componentes c on c.idComponente = d.idComponente'
    + ' where d.ativo = 1 and d.idCursoProfissional =? '
    + ' order by d.idCursoProfissional, d.idDisciplina ', params, function(err, rows, fields) {
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

function readParticipant(req, res) {
    const idCursoProfissional = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCursoProfissional };
    const query = connect.con.query('SELECT distinct idParticipant, nomeParticipante FROM conf_participant where ? order by idParticipant desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveParticipant(req, res) {
    //receber os dados do formulário que são enviados por post
    req.sanitize('idparticipant').escape();
    req.sanitize('idCurso').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idParticipant = req.params.idparticipant;
        const idCurso = req.params.idCurso;
        const nome = req.body.nomeparticipant;
        if (idParticipant != "NULL" && idCurso != "NULL" && typeof(idParticipant) != 'undefined' && typeof(idCurso) != 'undefined') {
            const post = { idParticipant: idParticipant, idCursoProfissional: idCurso, nomeParticipante: nome };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO conf_participant SET ?', post, function(err, rows, fields) {
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

function deleteCursoProfissionalParticipant(req, res) {
    //criar e executar a query de leitura na BD
    req.sanitize('idparticipant').escape();
    req.sanitize('idCurso').escape();
    req.sanitize('nomeparticipant').escape();
    req.checkParams("idparticipant", "Insira um email válido.").isEmail();
    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        const idCursoProfissional = req.params.idCurso;
        const idparticipant = req.params.idparticipant;
        const params = [idCursoProfissional, idparticipant];
        const query = connect.con.query('DELETE FROM conf_participant where idCursoProfissional = ? and idParticipant = ?', params, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
            }
            else {
                console.log(err);
                res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
            }
        });
    }
}

function readCursoProfissionalSponsor(req, res) {
    const idCursoProfissional = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCursoProfissional };
    const query = connect.con.query('SELECT distinct sponsor.idSponsor, nome, logo,categoria, link, active FROM sponsor, conf_sponsor where ? order by idSponsor desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            console.log(err);
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveCursoProfissionalSponsor(req, res) {
    //receber os dados do formuário que são enviados por post
    const idSponsor = req.sanitize('idsponsor').escape();
    const idCurso = req.sanitize('idCurso');
    if (idSponsor != "NULL" && idCurso != "NULL" && typeof(idSponsor) != 'undefined' && typeof(idCurso) != 'undefined') {
        const post = { idSponsor: idSponsor, idCursoProfissional: idCurso };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_sponsor SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteCursoProfissionalSponsor(req, res) {
    //criar e executar a query de leitura na BD
    const idSponsor = req.sanitize('idsponsor').escape();
    const idCurso = req.sanitize('idCurso').escape();
    const params = [idCurso, idSponsor];
    const query = connect.con.query('DELETE FROM conf_sponsor where idCursoProfissional = ? and idSponsor = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}

function readCursoProfissionalSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCurso };
    const query = connect.con.query('SELECT distinct a.idSpeaker, nome, foto, bio,link, filiacao, linkedin,twitter,facebook, cargo, active FROM speaker a, conf_speaker b where a.idSpeaker = b.idSpeaker  and ? order by idSpeaker desc', post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveCursoProfissionalSpeaker(req, res) {
    //receber os dados do formuário que são enviados por post
    const idCurso = req.sanitize('idCurso').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    if (idSpeaker != "NULL" && idCurso != "NULL" && typeof(idSpeaker) != 'undefined' && typeof(idCurso) != 'undefined') {
        const post = { idSpeaker: idSpeaker, idCursoProfissional: idCurso };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_speaker SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteCursoProfissionalSpeaker(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const idSpeaker = req.sanitize('idspeaker').escape();
    const params = [idCurso, idSpeaker];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_speaker where idCursoProfissional = ? and idSpeaker = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}


// Professor
function readCursoProfissionalProfessor(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCurso };
    const query = connect.con.query(
        'SELECT idMembro, nome, instituto, pais, active '
        + ' FROM professores mc  '
        + ' WHERE mc.IdMembro in (select idMembro from conf_Professor where ?) ' 
        + ' order by mc.idMembro desc', 
        post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveCursoProfissionalProfessor(req, res) {
    //receber os dados do formuário que são enviados por post
    const idCurso = req.sanitize('idCurso').escape();
    const idMembro = req.sanitize('idMembro').escape();
    if (idMembro != "NULL" && idCurso != "NULL" && typeof(idMembro) != 'undefined' && typeof(idCurso) != 'undefined') {
        const post = { idMembro: idMembro, idCursoProfissional: idCurso };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_Professor SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteCursoProfissionalProfessor(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const idMembro = req.sanitize('idMembro').escape();
    const params = [idCurso, idMembro];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_Professor where idCursoProfissional = ? and idMembro = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}



// Voluntario
function readCursoProfissionalVoluntario(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const post = { idCursoProfissional: idCurso };
    const query = connect.con.query(
        'SELECT idVoluntario, nome, email, cargo, habilitacao, lingua, idTipoTarefa, active '
        + ' FROM voluntario v  '
        + ' WHERE v.idVoluntario in (select idVoluntario from conf_voluntario where ?) ' 
        + ' order by v.idVoluntario desc', 
        post, function(err, rows, fields) {
        console.log(query.sql);
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}

function saveCursoProfissionalVoluntario(req, res) {
    //receber os dados do formuário que são enviados por post
    const idCurso = req.sanitize('idCurso').escape();
    const idVoluntario = req.sanitize('idVoluntario').escape();
    if (idVoluntario != "NULL" && idCurso != "NULL" && typeof(idVoluntario) != 'undefined' && typeof(idCurso) != 'undefined') {
        const post = { idVoluntario: idVoluntario, idCursoProfissional: idCurso };
        //criar e executar a query de gravação na BD para inserir os dados presentes no post
        const query = connect.con.query('INSERT INTO conf_voluntario SET ?', post, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
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

function deleteCursoProfissionalVoluntario(req, res) {
    //criar e executar a query de leitura na BD
    const idCurso = req.sanitize('idCurso').escape();
    const idVoluntario = req.sanitize('idVoluntario').escape();
    const params = [idCurso, idVoluntario];
    console.log(params);
    const query = connect.con.query('DELETE FROM conf_voluntario where idCursoProfissional = ? and idVoluntario = ?', params, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}


//exportar as funções
module.exports = {
    readCursoProfissional: readCursoProfissional,
    readCursoProfissionalID: readCursoProfissionalID,
    saveCursoProfissional: saveCursoProfissional,
    updateCursoProfissional: updateCursoProfissional,
    deleteFCursoProfissional: deleteFCursoProfissional,
    deleteLCursoProfissional: deleteLCursoProfissional,
    readDisciplinas: readDisciplinas,
    readParticipant: readParticipant,
    saveParticipant: saveParticipant,
    readSponsor: readCursoProfissionalSponsor,
    saveSponsor: saveCursoProfissionalSponsor,
    readSpeaker: readCursoProfissionalSpeaker,
    saveSpeaker: saveCursoProfissionalSpeaker,
    readProfessor: readCursoProfissionalProfessor,
    saveProfessor: saveCursoProfissionalProfessor,
    deleteProfessor: deleteCursoProfissionalProfessor,
    readVoluntario: readCursoProfissionalVoluntario,
    saveVoluntario: saveCursoProfissionalVoluntario,
    deleteVoluntario: deleteCursoProfissionalVoluntario,

    deleteSpeaker: deleteCursoProfissionalSpeaker,
    deleteSponsor: deleteCursoProfissionalSponsor,
    deleteParticipant: deleteCursoProfissionalParticipant
};
