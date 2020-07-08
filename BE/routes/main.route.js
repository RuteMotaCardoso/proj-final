const router = require('express').Router();
const controllerCursoProfissional = require('../controllers/cursoProfissional.controller.js');
const controllerComponente = require('../controllers/componente.controller.js');
const controllerDisciplina = require('../controllers/disciplina.controller.js');
const controllerModulo = require('../controllers/modulo.controller.js');
const controllerModuloAvaliacao = require('../controllers/moduloAvaliacao.controller.js');
const controllerTurma = require('../controllers/turma.controller.js');
const controllerProfessor = require('../controllers/professor.controller.js');
const controllerAluno = require('../controllers/aluno.controller.js');
const controllerMail = require('../controllers/mail.controller.js');
const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "login");
router.get('/', function(req, res) {
    res.send("CursosProfissionais");
    res.end();
});

router.get('/cursosProfissionais', controllerCursoProfissional.readCursoProfissional);
router.get('/cursosProfissionais/:id', controllerCursoProfissional.readCursoProfissionalID);
router.post('/cursosProfissionais/', isLoggedIn, controllerCursoProfissional.saveCursoProfissional);
router.put('/cursosProfissionais/:id', isLoggedIn, isLoggedIn, controllerCursoProfissional.updateCursoProfissional);
router.put('/cursosProfissionais/del/:id', isLoggedIn, controllerCursoProfissional.deleteLCursoProfissional);
router.delete('/cursosProfissionais/:id', isLoggedIn, controllerCursoProfissional.deleteFCursoProfissional);

router.get('/cursosProfissionais/:idCurso/professor/', controllerCursoProfissional.readProfessor);
router.post('/cursosProfissionais/:idCurso/professor/:idMembro', isLoggedIn, controllerCursoProfissional.saveProfessor);
router.delete('/cursosProfissionais/:idCurso/professor/:idMembro', controllerCursoProfissional.deleteProfessor);
router.get('/cursosProfissionais/:idCurso/disciplinas/', controllerCursoProfissional.readDisciplinas);

router.get('/componentes/', controllerComponente.read);
router.get('/componentes/:id', controllerComponente.readID);

router.get('/disciplinas/', controllerDisciplina.read);
router.get('/disciplinas/:id', controllerDisciplina.readID);
router.post('/disciplinas/', isLoggedIn, controllerDisciplina.save);
router.put('/disciplinas/:id', isLoggedIn, isLoggedIn, controllerDisciplina.update);
router.put('/disciplinas/del/:id', isLoggedIn, controllerDisciplina.deleteL);
router.delete('/disciplinas/:id', isLoggedIn, controllerDisciplina.deleteF);
router.get('/disciplinas/:idDisciplina/modulos/', controllerDisciplina.readModulos);

router.get('/modulos/', controllerModulo.read);
router.get('/modulos/:id', controllerModulo.readID);
router.post('/modulos/', isLoggedIn, controllerModulo.save);
router.put('/modulos/:id', isLoggedIn, isLoggedIn, controllerModulo.update);
router.put('/modulos/del/:id', isLoggedIn, controllerModulo.deleteL);
router.delete('/modulos/:id', isLoggedIn, controllerModulo.deleteF);

router.get('/modulosAvaliacoes/', controllerModuloAvaliacao.read);
router.get('/modulosAvaliacoes/:idTurma', controllerModuloAvaliacao.readIDTurma);
router.post('/modulosAvaliacoes/', isLoggedIn, controllerModuloAvaliacao.save);
router.put('/modulosAvaliacoes/:id', isLoggedIn, isLoggedIn, controllerModuloAvaliacao.update);
router.put('/modulosAvaliacoes/del/:id', isLoggedIn, controllerModuloAvaliacao.deleteL);
router.delete('/modulosAvaliacoes/:id', isLoggedIn, controllerModuloAvaliacao.deleteF);

router.get('/turmas/', controllerTurma.read);
router.get('/turmas/:id', controllerTurma.readID);
router.post('/turmas/', isLoggedIn, controllerTurma.save);
router.put('/turmas/:id', isLoggedIn, isLoggedIn, controllerTurma.update);
router.put('/turmas/del/:id', isLoggedIn, controllerTurma.deleteL);
router.delete('/turmas/:id', isLoggedIn, controllerTurma.deleteF);
router.post('/turmas/:idTurma/professores/:idProfessor', isLoggedIn, controllerTurma.saveProfessor);
router.put('/turmas/:idTurma/professores/del/:idProfessor', isLoggedIn, controllerTurma.deleteProfessor);
router.get('/turmas/:idTurma/professores/', controllerTurma.readProfessores);
router.get('/turmas/:idTurma/alunos/', controllerTurma.readAlunos);
router.get('/turmas/:idTurma/disciplinas/', controllerTurma.readDisciplinas);
router.get('/turmas/:idTurma/modulos/', controllerTurma.readModulos);

router.get('/professores/', controllerProfessor.read);
router.get('/professores/:id', controllerProfessor.readID);
router.post('/professores/', isLoggedIn, controllerProfessor.save);
router.put('/professores/:id', isLoggedIn, isLoggedIn, controllerProfessor.update);
router.put('/professores/del/:id', isLoggedIn, controllerProfessor.deleteL);
router.delete('/professores/:id', isLoggedIn, controllerProfessor.deleteF);

router.get('/alunos/', controllerAluno.read);
router.get('/alunos/:id', controllerAluno.readID);
router.post('/alunos/', isLoggedIn, controllerAluno.save);
router.put('/alunos/:id', isLoggedIn, isLoggedIn, controllerAluno.update);
router.put('/alunos/del/:id', isLoggedIn, controllerAluno.deleteL);
router.delete('/alunos/:id', isLoggedIn, controllerAluno.deleteF);

router.post('/contacts/emails', controllerMail.send);

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        /*  res.status(jsonMessages.login.unauthorized.status).send(jsonMessages.login.unauthorized);*/
        return next();
    }
}
