const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE MÓDULOS

//***********************************************************************************************************************/
var modulos = [
    {"idModulo":1,"nomeTurma":"10º F","numero":"P1","nome":"Lusíadas","anoCurso":"1º ano","totalHoras":"100","limiteFaltas":"10","disciplina":"Português","componente":"Sociocultural","curso":"Técnico de Gestão Equipamentos","active":null},
    {"idModulo":2,"nomeTurma":"10º F","numero":"P2","nome":"Fernando Pessoa","anoCurso":"1º ano","totalHoras":"30","limiteFaltas":"3","disciplina":"Português","componente":"Sociocultural","curso":"Técnico de Gestão Equipamentos","active":null},
    {"idModulo":3,"nomeTurma":"10º F","numero":"I1","nome":"Familiy","anoCurso":"1º ano","totalHoras":"10","limiteFaltas":"1","disciplina":"Inglês","componente":"Sociocultural","curso":"Técnico de Gestão Equipamentos","active":null},
    {"idModulo":4,"nomeTurma":"10º F","numero":"I2","nome":"Holidays","anoCurso":"2º ano","totalHoras":"25","limiteFaltas":"3","disciplina":"Inglês","componente":"Científica","curso":"Técnico de Línguas","active":null}
]


 window.onload = () => {

    // References to HTML objects   
    const tblModulos = document.getElementById("tblModulos")
    const frmModulos = document.getElementById("frmModulos")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmModulos.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNomeTurma = document.getElementById("txtNomeTurma").value
        const txtCurso = document.getElementById("txtCurso").value
        const txtComponente = document.getElementById("txtComponente").value
        const txtDisciplina = document.getElementById("txtDisciplina").value
        const txtNumero = document.getElementById("txtNumero").value
        const txtNome = document.getElementById("txtNome").value
        const txtAnoCurso = document.getElementById("txtAnoCurso").value
        const txtTotalHoras = document.getElementById("txtTotalHoras").value
        const txtLimiteFaltas = document.getElementById("txtLimiteFaltas").value
        let txtIdModulo = document.getElementById("txtIdModulo").value
        if (txtIdModulo === "")
            txtIdModulo = modulos.length+1;


        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            const newModulos = {
                "nomeTurma":txtNomeTurma,
                "idModulo":txtIdModulo,
                "curso":txtCurso,
                "componente":txtComponente,                
                "disciplina":txtDisciplina,
                "numero":txtNumero,
                "nome":txtNome,
                "anoCurso":txtAnoCurso,
                "totalHoras":txtTotalHoras,
                "limiteFaltas":txtLimiteFaltas
             };
             modulos.push(newModulos);
        } else {
            // Atualiza
            const newModulos= {
                "nomeTurma":txtNomeTurma,                
                "idModulo":txtIdModulo,
                "curso":txtCurso,
                "componente":txtComponente,                
                "disciplina":txtDisciplina,
                "numero":txtNumero,
                "nome":txtNome,
                "anoCurso":txtAnoCurso,
                "totalHoras":txtTotalHoras,
                "limiteFaltas":txtLimiteFaltas
               };
            let posEditar = modulos.findIndex(x => x.idModulo == txtIdModulo);
            modulos[posEditar] = newModulos;
        }
        isNew = true
        renderModulos()
    })



    const renderModulos = async () => {
        frmModulos.reset()


        // TODO: Ir buscar o nome por Id em vez do 1º
        document.getElementById("txtDisciplina").innerHTML = modulos[0].disciplina
        document.getElementById("txtTurma").innerHTML = modulos[0].nomeTurma
        document.getElementById("txtCurso").innerHTML = modulos[0].curso
        
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='7'>Lista de Módulos de uma Disciplina de um Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-35'>Curso</th>
                    <th class='w-25'>Componente/Disciplina</th>              
                    <th class='w-20'>Número-Nome</th>
                    <th class='w-5'>Ano Curso</th>              
                    <th class='w-10'>Total Horas/Limite Faltas</th>                                    
                    <th class='w-10'>Detalhe</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const modulo = modulos;
        let i = 1
        for (const modulo of modulos) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${modulo.curso}</td>
                    <td>
                        ${modulo.componente}/${modulo.disciplina}
                    </td>
                    <td>
                        ${modulo.numero}-${modulo.nome}
                    </td>
                    <td>${modulo.anoCurso}</td>
                    <td>
                        ${modulo.totalHoras}/${modulo.limiteFaltas}
                    </td>
                    <td>
                        <i id='${modulo.idModulo}' class='fas fa-eye ver'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblModulos.innerHTML = strHtml



       //***********************************************************************************************************************/
        //Ver LISTA Módulos  

        //***********************************************************************************************************************/
           // Gerir o clique no ícone de Ver        
           const btnVer = document.getElementsByClassName("ver")
           for (let i = 0; i < btnVer.length; i++) {
               btnVer[i].addEventListener("click", () => {
                   for (const modulo of modulos) {
                       if (modulo.idModulo == btnVer[i].getAttribute("id")) {  //não mudar
                           document.location="publico-lista-turma-modulo-av.html?idDisciplina=" + modulo.idDisciplina + "nomeTurma=" + modulo.nomeTurma + "curso=" + modulo.curso+ "nome=" + modulo.nome;
                           return false;
                       }
                   }
               })
           }


    }
    renderModulos()
}