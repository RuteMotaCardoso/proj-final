let isNew = true

 window.onload = () => {
    // References to HTML objects   
    const tblDisciplinas = document.getElementById("tblDisciplinas")
    const frmDisciplinas = document.getElementById("frmDisciplinas")

    const renderDisciplinas = async () => {
        frmDisciplinas.reset()
        
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
        const idTurma = getParameterByName("idTurma")
        console.log(idTurma)

        const response = await fetch(`${urlBase}/turmas/${idTurma}/disciplinas`)
        let disciplinas 
        if (response.status == 404){
            strHtml += `
            <tr>
                <td>Não existem resultados</td>
            </tr>
            `
        }
        else {
            disciplinas = await response.json()

            // TODO: Ir buscar o nome por Id em vez do 1º
            document.getElementById("txtTurma").innerHTML = disciplinas[0].turma
            document.getElementById("txtCurso").innerHTML = disciplinas[0].curso

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
                                document.location="publico-lista-turma-modulos.html?idDisciplina=" + disc.idDisciplina + "&idTurma=" + disc.idTurma;
                                return false;
                            }
                        }
                    })
                }
        
   }
    renderDisciplinas()
}