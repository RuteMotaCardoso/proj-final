const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE DISCIPLINAS

//***********************************************************************************************************************/
var disciplinas = [
    {"idDisciplina":1,"nomeTurma":"10º F","nome":"Português","totalHoras":"100","componente":"Sociocultural","curso":"Técnico de Gestão Equipamentos","active":null},
    {"idDisciplina":2,"nomeTurma":"10º F","nome":"Inglês","totalHoras":"100","componente":"Sociocultural","curso":"Técnico de Gestão Equipamentos","active":null},
    {"idDisciplina":3,"nomeTurma":"10º F","nome":"Educação Física","totalHoras":"100","componente":"Sociocultural","curso":"Técnico de Gestão Websites","active":null},
    {"idDisciplina":4,"nomeTurma":"10º F","nome":"Matemática","totalHoras":"100","componente":"Científica","curso":"Técnico de Gestão Equipamentos","active":null},
]


 window.onload = () => {
    // References to HTML objects   
    const tblDisciplinas = document.getElementById("tblDisciplinas")
    const frmDisciplinas = document.getElementById("frmDisciplinas")


//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmDisciplinas.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNomeTurma = document.getElementById("txtNomeTurma").value
        const txtCurso = document.getElementById("txtCurso").value
        const txtNome = document.getElementById("txtNome").value
        const txtComponente = document.getElementById("txtComponente").value
        const txtTotalHoras = document.getElementById("txtTotalHoras").value
        let txtIdDisciplina = document.getElementById("txtIdDisciplina").value
        if (txtIdDisciplina === "")
            txtIdDisciplina = disciplinas.length+1;


        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            const newDisciplinas = {
                "nomeTurma":txtNomeTurma,
                "idDisciplina":txtIdDisciplina,
                "curso":txtCurso,
                "nome":txtNome,
                "componente":txtComponente,
                "totalHoras":txtTotalHoras
             };
             disciplinas.push(newDisciplinas);
        } else {
            // Atualiza
            const newDisciplinas= {
                "nomeTurma":txtNomeTurma,
                "idDisciplina":txtIdDisciplina,
                "curso":txtCurso,
                "nome":txtNome,
                "componente":txtComponente,
                "totalHoras":txtTotalHoras
               };
            let posEditar = disciplinas.findIndex(x => x.idDisciplina == txtIdDisciplina);
            disciplinas[posEditar] = newDisciplinas;
        }
        isNew = true
        renderDisciplinas()
    })



    const renderDisciplinas = async () => {
        frmDisciplinas.reset()
        
        
        // TODO: Ir buscar o nome por Id em vez do 1º
        document.getElementById("txtTurma").innerHTML = disciplinas[0].nomeTurma
        document.getElementById("txtCurso").innerHTML = disciplinas[0].curso

        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='5'>Lista de Disciplinas de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-38'>Componente</th>              
                    <th class='w-38'>Disciplina</th>              
                    <th class='w-10'>Total Horas</th>              
                    <th class='w-10'>Detalhe</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const disc = disciplinas;
        let i = 1
        for (const disc of disciplinas) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${disc.componente}</td>
                    <td>${disc.nome}</td>
                    <td>${disc.totalHoras}</td>
                    <td>
                        <i id='${disc.idDisciplina}' class='fas fa-eye ver'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblDisciplinas.innerHTML = strHtml


        //***********************************************************************************************************************/
        //Ver LISTA Módulos  

        //***********************************************************************************************************************/
           // Gerir o clique no ícone de Ver        
                const btnVer = document.getElementsByClassName("ver")
                for (let i = 0; i < btnVer.length; i++) {
                    btnVer[i].addEventListener("click", () => {
                        for (const disc of disciplinas) {
                            if (disc.idDisciplina == btnVer[i].getAttribute("id")) {  //não mudar
                                document.location="publico-lista-turma-modulos.html?idDisciplina=" + disc.idDisciplina + "nomeTurma=" + disc.nomeTurma + "curso=" + disc.curso;
                                return false;
                            }
                        }
                    })
                }
        
   }
    renderDisciplinas()
}