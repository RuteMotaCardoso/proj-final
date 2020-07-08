let isNew = true

 window.onload = () => {

    // References to HTML objects   
    const tblAvaliacoes = document.getElementById("tblAvaliacoes")
    const frmAvaliacoes = document.getElementById("frmAvaliacoes")
  
    const renderAvaliacoes = async () => {
        frmAvaliacoes.reset()

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
        const idTurma = getParameterByName("idTurma")
        console.log(idTurma)
        const idModulo = getParameterByName("idModulo")
        console.log(idModulo)

        const response = await fetch(`${urlBase}/modulosAvaliacoes/${idTurma}`)
        let modulosAvaliacoes 
        if (response.status == 404){
            strHtml += `
            <tr>
                <td>Não existem resultados</td>
            </tr>
            `
        }
        else {
            modulosAvaliacoes = await response.json()

            const respTurma = await fetch(`${urlBase}/turmas/${idTurma}`)
            const turma = await respTurma.json()

            // TODO: Ir buscar o nome por Id em vez do 1º
            document.getElementById("txtTurma").innerHTML = turma[0].nome
            document.getElementById("txtCurso").innerHTML = turma[0].curso
            document.getElementById("txtDisciplina").innerHTML = modulosAvaliacoes[0].disciplina
            document.getElementById("txtModulo").innerHTML = modulosAvaliacoes[0].modulo

            // Filtrar por idMódulo!!
            let i = 1
            const modulosAvaliacoesFilter = modulosAvaliacoes.filter(a => a.idModulo == idModulo)
            //console.log("LEN:" + modulosAvaliacoesFilter.length)
            //console.log(modulosAvaliacoesFilter)
            for (const aval of modulosAvaliacoesFilter) {
                console.log(aval.idModulo)
                strHtml += `
                    <tr>
                        <td>${i}</td>
                        <td>${aval.aluno}</td>
                        <td>${aval.faltas}</td>
                        <td>${aval.avaliacao}</td>
                        <td>${aval.dataAvaliacao.split("T")[0]}</td>
                        <td>${converteSimNao(aval.aprovado)}</td>
                    </tr>
                `
                i++
            }
        }
        strHtml += "</tbody>"
        tblAvaliacoes.innerHTML = strHtml


    }
    renderAvaliacoes()
}