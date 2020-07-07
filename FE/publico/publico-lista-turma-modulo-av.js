const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE Alunos

//***********************************************************************************************************************/
var alunos = [
    {"idTurma":1, "faltas":"1","avaliacao":"18","dataAvaliacao":"01/05/2020","aprovado":"Aprovado","disciplina":"Português","modulo":"Lusiadas","anoLetivo":"2019/2020","curso":"Técncio de Gestão de Equipamentos Informáticos","anoCurso":"1º ano","turma":"10º F","idAluno":1,"nome":"António Antunes","idade":"16","active":null},
    {"idTurma":1, "faltas":"18","avaliacao":"8","dataAvaliacao":"01/05/2020","aprovado":"Reprovado","disciplina":"Português","modulo":"Lusiadas","anoLetivo":"2019/2020","curso":"Técncio de Gestão de Equipamentos Informáticos","anoCurso":"1º ano","turma":"10º F","idAluno":2,"nome":"Ana Maria Andrade","idade":"17","active":null},
    {"idTurma":1, "faltas":"0","avaliacao":"13","dataAvaliacao":"01/05/2020","aprovado":"Aprovado","disciplina":"Português","modulo":"Lusiadas","anoLetivo":"2019/2020","curso":"Técncio de Gestão de Equipamentos Informáticos","anoCurso":"1º ano","turma":"10º F","idAluno":3,"nome":"Sara Silva","idade":"15","active":null},
    {"idTurma":1,"faltas":"8","avaliacao":"10","dataAvaliacao":"01/05/2020","aprovado":"Aprovado", "disciplina":"Português","modulo":"Lusiadas","anoLetivo":"2019/2020","curso":"Técncio de Gestão de Equipamentos Informáticos","anoCurso":"1º ano","turma":"10º F","idAluno":4,"nome":"Pedro Duarte","idade":"19","active":null},
    {"idTurma":1,"faltas":"3","avaliacao":"15","dataAvaliacao":"01/05/2020","aprovado":"Aprovado", "disciplina":"Português","modulo":"Lusiadas","anoLetivo":"2019/2020","curso":"Técncio de Gestão de Equipamentos Informáticos","anoCurso":"1º ano","turma":"10º F","idAluno":5,"nome":"João Jacinto","idade":"18","active":null}
]

 window.onload = () => {

    // References to HTML objects   
    const tblAlunos = document.getElementById("tblAlunos")
    const frmAlunos = document.getElementById("frmAlunos")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmAlunos.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtFaltas = document.getElementById("txtFaltas").value
        const txtAvaliacao = document.getElementById("txtAvaliacao").value        
        const txtDataAvaliacao = document.getElementById("txtDataAvaliacao").value        
        const txtAprovado = document.getElementById("txtAprovado").value        
        const txtDisciplina = document.getElementById("txtDisciplina").value
        const txtModulo = document.getElementById("txtModulo").value
        const txtIdTurma = document.getElementById("txtIdTurma").value
        const txtAnoLetivo = document.getElementById("txtAnoLetivo").value
        const txtCurso = document.getElementById("txtCurso").value
        const txtAnoCurso = document.getElementById("txtAnoCurso").value
        const txtTurma = document.getElementById("txtTurma").value
        const txtNome = document.getElementById("txtNome").value
        const txtIdade = document.getElementById("txtIdade").value

        let txtIdAluno = document.getElementById("txtIdAluno").value
        if (txtIdAluno === "")
            txtIdAluno = alunos.length+1;


        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            const newAlunos = {
                "faltas":txtFaltas,
                "avaliacao":txtAvaliacao,
                "dataAvaliacao":txtDataAvaliacao,
                "aprovado":txtAprovado,
                "disciplina":txtDisciplina,
                "modulo":txtModulo,                
                "idAluno":txtIdAluno,
                "nome":txtNome,
                "idade":txtIdade,
                "turma":txtTurma,
                "idTurma":txtIdTurma,
                "anoLetivo":txtAnoLetivo,                
                "curso":txtCurso,                
                "anoCurso":txtAnoCurso                
             };
             alunos.push(newAlunos);
        } else {
            // Atualiza
            const newAlunos= {
                "faltas":txtFaltas,
                "avaliacao":txtAvaliacao,
                "dataAvaliacao":txtDataAvaliacao,
                "aprovado":txtAprovado,
                "disciplina":txtDisciplina,
                "modulo":txtModulo,                
                "idAluno":txtIdAluno,
                "nome":txtNome,
                "idade":txtIdade,
                "turma":txtTurma,
                "idTurma":txtIdTurma,
                "anoLetivo":txtAnoLetivo,                
                "curso":txtCurso,                
                "anoCurso":txtAnoCurso                
               };
            let posEditar = alunos.findIndex(x => x.idAluno == txtIdAluno);
            alunos[posEditar] = newAlunos;
        }
        isNew = true
        renderAlunos()
    })



    const renderAlunos = async () => {
        frmAlunos.reset()

     // TODO: Ir buscar o nome por Id em vez do 1º
    document.getElementById("txtTurma").innerHTML = alunos[0].turma
    document.getElementById("txtCurso").innerHTML = alunos[0].curso
    document.getElementById("txtDisciplina").innerHTML = alunos[0].disciplina
    document.getElementById("txtModulo").innerHTML = alunos[0].modulo

        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Alunos da Turma do Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-30'>Faltas</th>     
                    <th class='w-30'>Avaliação</th>              
                    <th class='w-30'>Data de Avaliação</th>                         
                    <th class='w-30'>Aprovado</th>                                             
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const aluno = alunos;
        let i = 1
        for (const aluno of alunos) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.faltas}</td>
                    <td>${aluno.avaliacao}</td>
                    <td>${aluno.dataAvaliacao}</td>
                    <td>${aluno.aprovado}</td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblAlunos.innerHTML = strHtml


    }
    renderAlunos()
}