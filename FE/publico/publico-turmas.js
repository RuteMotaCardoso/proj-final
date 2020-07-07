const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE Turmas

//***********************************************************************************************************************/
var turmas = [
    {"idTurma":1,"anoLetivo":"2019/2020","curso":"Técnico de Gestão Equipamentos","anoCurso":"1º ano","nome":"10º F","active":null},
    {"idTurma":2,"anoLetivo":"2019/2020","curso":"Técnico de Gestão Equipamentos","anoCurso":"2º ano","nome":"11º H","active":null},
    {"idTurma":3,"anoLetivo":"2019/2020","curso":"Técnico de Gestão Websites","anoCurso":"1º ano","nome":"10º G","active":null},
    {"idTurma":4,"anoLetivo":"2018/2019","curso":"Técnico de Gestão Equipamentos","anoCurso":"1º ano","nome":"10º E","active":null},
    {"idTurma":5,"anoLetivo":"2019/2020","curso":"Técnico de Gestão Equipamentos","anoCurso":"1º ano","nome":"10º G","active":null}
]


 window.onload = () => {

    // References to HTML objects   
    const tblTurmas = document.getElementById("tblTurmas")
    const frmTurmas = document.getElementById("frmTurmas")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmTurmas.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtAnoLetivo = document.getElementById("txtAnoLetivo").value
        const txtCurso = document.getElementById("txtCurso").value
        const txtAnoCurso = document.getElementById("txtAnoCurso").value
        const txtNome = document.getElementById("txtNome").value

        let txtIdTurma = document.getElementById("txtIdTurma").value
        if (txtIdTurma === "")
            txtIdTurma = turmas.length+1;


        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            const newTurmas = {
                "idTurma":txtIdTurma,
                "anoLetivo":txtAnoLetivo,
                "curso":txtCurso,
                "anoCurso":txtAnoCurso,                
                "nome":txtNome
             };
             turmas.push(newTurmas);
        } else {
            // Atualiza
            const newTurmas= {
                "idTurma":txtIdTurma,
                "anoLetivo":txtAnoLetivo,
                "curso":txtCurso,
                "anoCurso":txtAnoCurso,                
                "nome":txtNome
               };
            let posEditar = turmas.findIndex(x => x.idTurma == txtIdTurma);
            turmas[posEditar] = newTurmas;
        }
        isNew = true
        renderTurmas()
    })



    const renderTurmas = async () => {
        frmTurmas.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Turmas de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Ano Letivo</th>
                    <th class='w-30'>Curso</th>
                    <th class='w-38'>Ano Curso</th>              
                    <th class='w-38'>Nome Turma</th>              
                    <th class='w-10'>Detalhe</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const turma = turmas;
        let i = 1
        for (const turma of turmas) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${turma.anoLetivo}</td>
                    <td>${turma.curso}</td>
                    <td>${turma.anoCurso}</td>
                    <td>${turma.nome}</td>
                    <td>
                        <i id='${turma.idTurma}' class='fas fa-eye ver'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblTurmas.innerHTML = strHtml


        //***********************************************************************************************************************/
        //DETALHE REGISTOS DA LISTA 

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Ver        
        const btnVer = document.getElementsByClassName("ver")
        for (let i = 0; i < btnVer.length; i++) {
            btnVer[i].addEventListener("click", () => {
                for (const turma of turmas) {
                    if (turma.idTurma == btnVer[i].getAttribute("id")) {  //não mudar
                        document.location="publico-lista-turma-disciplinas.html?idTurma=" + turma.idTurma;
                        return false;
                    }
                }
            })
        }

    }
    renderTurmas()
}