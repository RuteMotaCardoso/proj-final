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
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Módulos de uma Disciplina de um Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-35'>Curso</th>
                    <th class='w-25'>Componente/Disciplina</th>              
                    <th class='w-20'>Número-Nome</th>
                    <th class='w-5'>Ano Curso</th>              
                    <th class='w-10'>Total Horas/Limite Faltas</th>                                    
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const idDisciplina = getParameterByName("idDisciplina")
        console.log(idDisciplina)

        const response = await fetch(`${urlBase}/disciplinas/${idDisciplina}/modulos`)
        //console.log(response)
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
            // TODO: Ir buscar o nome por Id em vez do 1º
            document.getElementById("txtDisciplina").innerHTML = modulos[0].disciplina
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
                            ${modulo.totalHoras}/${modulo.limiteFaltas}</td>
                    </tr>
                `
                i++
            }
        }
        strHtml += "</tbody>"
        tblModulos.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const modulo of modulos) {
                    if (modulo.idModulo == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdModulo").value = modulo.idModulo
                        document.getElementById("txtCurso").value = modulo.curso
                        document.getElementById("txtComponente").value = modulo.componente
                        document.getElementById("txtDisciplina").value = modulo.disciplina                        
                        document.getElementById("txtNumero").value = modulo.numero
                        document.getElementById("txtNome").value = modulo.nome
                        document.getElementById("txtAnoCurso").value = modulo.anoCurso                        
                        document.getElementById("txtTotalHoras").value = modulo.totalHoras
                        document.getElementById("txtLimiteFaltas").value = modulo.limiteFaltas                        
                    }
                }
            })
        }

    }
    renderModulos()
}