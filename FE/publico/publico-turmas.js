let isNew = true

 window.onload = () => {

    // References to HTML objects   
    const tblTurmas = document.getElementById("tblTurmas")
    const frmTurmas = document.getElementById("frmTurmas")

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
        const response = await fetch(`${urlBase}/turmas`)
        let turmas
        if (response.status == 404){
            strHtml += `
            <tr>
                <td>Não existem resultados</td>
            </tr>
            `
        }
        else { 
            turmas = await response.json()

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