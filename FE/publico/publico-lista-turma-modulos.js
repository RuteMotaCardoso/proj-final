let isNew = true

 window.onload = () => {

    // References to HTML objects   
    const tblModulos = document.getElementById("tblModulos")
    const frmModulos = document.getElementById("frmModulos")
  
    const renderModulos = async () => {
        frmModulos.reset()

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
        const idTurma = getParameterByName("idTurma")
        console.log(idTurma)
        const idDisciplina = getParameterByName("idDisciplina")
        console.log(idDisciplina)

        const response = await fetch(`${urlBase}/disciplinas/${idDisciplina}/modulos`)
        let modulos 
        if (response.status == 404){
            strHtml += `
            <tr>
                <td>Não existem resultados</td>
            </tr>
            `
        }
        else {
            modulos = await response.json()
            
            const responseT = await fetch(`${urlBase}/turmas/${idTurma}`)
            const turma = await responseT.json()
            //console.log(turma)
         
            // TODO: Ir buscar o nome por Id em vez do 1º
            document.getElementById("txtDisciplina").innerHTML = modulos[0].disciplina
            document.getElementById("txtTurma").innerHTML = turma[0].nome
            document.getElementById("txtCurso").innerHTML = modulos[0].curso 
            
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
                            document.location="publico-lista-turma-modulo-av.html?idTurma=" + idTurma + "&idModulo=" + modulo.idModulo;
                           return false;
                       }
                   }
               })
           }


    }
    renderModulos()
}