const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonFilePath = __dirname + "/../assets/";
const jsonMessages = require(jsonMessagesPath + "bd");
const connect = require('../config/connectMySQL');

function read(req, res) {
    connect.con.query('SELECT ma.idProfessor, ma.idAluno, ma.idModulo, ma.avaliacao, ma.faltas, ma.dataAvaliacao, ma.aprovado, '
        + ' a.nome as aluno, p.nome as professor, d.nome as disciplina, m.nome as modulo '
        + ' FROM avaliacoesModulos ma inner join modulos m on ma.idModulo = m.idModulo '
        + ' inner join disciplinas d on m.idDisciplina = d.idDisciplina '
        + ' inner join alunos a on a.idAluno = ma.idAluno inner join professores p on p.idProfessor = ma.idProfessor '
        + ' where ma.ativo = 1 '
        + ' order by m.idDisciplina, m.idModulo, ma.idAluno', 
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

function readIDTurma(req, res) {
    const idTurma = req.sanitize('idTurma').escape();
    const post = [ idTurma ];
    // https://stackoverflow.com/questions/51899725/mysql-fetch-date-without-timezone-offset
    connect.con.query('SELECT ma.idProfessor, ma.idAluno, ma.idModulo, ma.avaliacao, ma.faltas, date(ma.dataAvaliacao) as dataAvaliacao, ma.aprovado, '
        + ' a.nome as aluno, p.nome as professor, d.nome as disciplina, m.nome as modulo '
        + ' FROM avaliacoesModulos ma inner join modulos m on ma.idModulo = m.idModulo '
        + ' inner join disciplinas d on m.idDisciplina = d.idDisciplina '
        + ' inner join alunos a on a.idAluno = ma.idAluno inner join turmas t on t.idTurma = a.idTurma'
        + ' inner join professores p on p.idProfessor = ma.idProfessor '
        + ' where ma.ativo = 1 and a.idTurma = ? '
        + ' order by m.idDisciplina, m.idModulo, ma.idAluno', post,
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

function save(req, res) {
    console.log(req.body);
    //receber os dados do formulário que são enviados por post
    const idProfessor = req.sanitize('idProfessor').escape();
    const idAluno = req.sanitize('idAluno').escape();
    const avaliacao = req.sanitize('avaliacao').escape();
    const faltas = req.sanitize('faltas').escape();
    const dataAvaliacao = req.sanitize('dataAvaliacao').escape();
    const aprovado = req.sanitize('aprovado').escape();
    const idModulo = req.sanitize('idModulo').escape();
    req.checkBody("idModulo", "Insira um ID módulo válido.").isNumeric();
    //req.checkBody("idModulo", "Insira um ID Modulo válido.").isNumeric();
    req.checkBody("idProfessor", "Insira um ID Professor válido.").isNumeric();
    req.checkBody("idAluno", "Insira um ID Aluno válido.").isNumeric();
    req.checkBody("avaliacao", "Insira avaliação válida").isNumeric();
    req.checkBody("faltas", "Insira nº faltas válida").isNumeric();
    //req.checkBody("dataAvaliacao", "Insira uma data válida").matches(/^([0-2][0-9]|(3)[0-1])([\/-])(((0)[0-9])|((1)[0-2]))([\/-])\d{4}$/i);
    req.checkBody("dataAvaliacao", "Insira uma data válida").isISO8601('yyyy-mm-dd')
    req.checkBody("aprovado", "Insira valor aprovado válido").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        console.log(idModulo);
        //const idProfessor = req.body.idProfessor;
        if (idProfessor != "NULL" && idAluno != "NULL" && typeof(avaliacao) != 'undefined' && typeof(faltas) != 'undefined' && typeof(dataAvaliacao) != 'undefined' && typeof(aprovado) != 'undefined') {
            const post = { idProfessor: idProfessor, idAluno: idAluno, idModulo: idModulo, avaliacao: avaliacao, faltas: faltas, dataAvaliacao: dataAvaliacao, aprovado: aprovado };
            //criar e executar a query de gravação na BD para inserir os dados presentes no post
            const query = connect.con.query('INSERT INTO avaliacoesModulos SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    res.status(jsonMessages.db.successInsert.status).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    if (err.code == "ER_DUP_ENTRY") {
                        res.status(jsonMessages.db.duplicateEmail.status).send(jsonMessages.db.duplicateEmail);
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


function update(req, res) {
    console.log(req.body);
    //receber os dados do formulário que são enviados por post
    const idProfessor = req.sanitize('idProfessor').escape();
    const idAluno = req.sanitize('idAluno').escape();
    const avaliacao = req.sanitize('avaliacao').escape();
    const faltas = req.sanitize('faltas').escape();
    const dataAvaliacao = req.sanitize('dataAvaliacao').escape();
    const aprovado = req.sanitize('aprovado').escape();
    const idModulo = req.sanitize('idModulo').escape();
    req.checkBody("idModulo", "Insira um ID módulo válido.").isNumeric();
    //req.checkBody("idModulo", "Insira um ID Modulo válido.").isNumeric();
    req.checkBody("idProfessor", "Insira um ID Professor válido.").isNumeric();
    req.checkBody("idAluno", "Insira um ID Aluno válido.").isNumeric();
    req.checkBody("avaliacao", "Insira avaliação válida").isNumeric();
    req.checkBody("faltas", "Insira nº faltas válida").isNumeric();
    //req.checkBody("dataAvaliacao", "Insira uma data válida").matches(/^([0-2][0-9]|(3)[0-1])([\/-])(((0)[0-9])|((1)[0-2]))([\/-])\d{4}$/i);
    req.checkBody("dataAvaliacao", "Insira uma data válida").isISO8601('yyyy-mm-dd')
    req.checkBody("aprovado", "Insira aprovado válido").isNumeric();

    const errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        console.log(idModulo);
        //const idProfessor = req.body.idProfessor;
        if (idProfessor != "NULL" && idAluno != "NULL" && typeof(avaliacao) != 'undefined' && typeof(faltas) != 'undefined' && typeof(dataAvaliacao) != 'undefined' && typeof(aprovado) != 'undefined') {
            const update = [avaliacao, faltas, dataAvaliacao, aprovado, idProfessor, idAluno, idModulo];
            const query = connect.con.query('UPDATE avaliacoesModulos SET avaliacao =?, faltas =?, dataAvaliacao =? WHERE idProfessor =?, idAluno =?, idModulo =?', update, function(err, rows, fields) {
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

module.exports = {
    read: read,
    readIDTurma: readIDTurma,
    save: save,
    update: update,
    //deleteL: deleteL,
    //deleteF: deleteF,
};