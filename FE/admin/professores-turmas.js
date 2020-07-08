let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE Alunos

//***********************************************************************************************************************/
 window.onload = () => {
    const btnLogout = document.getElementById("logout")
    // "logout" da área privada do back-office
    btnLogout.addEventListener("click", function() {
      // Teste
      window.location.replace("../index.html")  
    });
  

    // References to HTML objects   
    const selProfessores = document.getElementById("selProfessores")
    const tblProfessoresTurmas = document.getElementById("tblProfessoresTurmas")
    const frmProfessoresTurmas = document.getElementById("frmProfessoresTurmas")
    // Ir buscar o nome por Id em vez do 1º
    const idTurma = getParameterByName("idTurma")
    console.log(idTurma)
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmProfessoresTurmas.addEventListener("submit", async (event) => {
        event.preventDefault()
        const idProfessor = selProfessores.options[selProfessores.selectedIndex].value
        let txtIdProfessorTurma = document.getElementById("txtIdProfessorTurma").value

        console.log(idProfessor)

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            response = await fetch(`${urlBase}/turmas/${idTurma}/professores/${idProfessor}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: ``
            })
            const newTurmaId = response.headers.get("Location")
            await trataResposta(response);
        } else {
            // TODO: Completar/rever modelo BD
            // Atualiza
            response = await fetch(`${urlBase}/turmas/${idTurma}/professores/${idProfessor}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: ``
            })
            //console.log(`nome=${txtNome}&anoLetivo=${txtAnoLetivo}&anoCurso=${txtAnoCurso}&idCurso=${idCurso}&ativo=1`)
            await trataResposta(response);
        }
        isNew = true
        renderProfessoresTurmas()
    })



    const renderProfessoresTurmas = async () => {
        frmProfessoresTurmas.reset()

    const responseT = await fetch(`${urlBase}/turmas/${idTurma}`)
    const turma = await responseT.json()

    document.getElementById("txtAnoLetivo").innerHTML = turma[0].anoLetivo
    document.getElementById("txtCurso").innerHTML = turma[0].curso
    document.getElementById("txtAnoCurso").innerHTML = turma[0].anoCurso
    document.getElementById("txtTurma").innerHTML = turma[0].nome

        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Professores da Turma do Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-20'>Turma</th>
                    <th class='w-20'>Professor</th>     
                    <th class='w-10'>Opções</th>         
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selProfessores.innerHTML = await getProfessores()

        const response = await fetch(`${urlBase}/turmas/${idTurma}/professores`)
        const professoresTurmas = await response.json()

        let i = 1
        for (const professorTurma of professoresTurmas) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${professorTurma.turma}</td>
                    <td>${professorTurma.nome}</td>
                    <td>
                        <i id='${professorTurma.idProfessor}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblProfessoresTurmas.innerHTML = strHtml



       //***********************************************************************************************************************/
        //REMOVER REGISTOS DA LISTA

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Remover        
        const btnDelete = document.getElementsByClassName("remove")
        for (let i = 0; i < btnDelete.length; i++) {
            btnDelete[i].addEventListener("click", () => {
                swal({
                    title: 'Tem a certeza?',
                    text: "Não será possível reverter a remoção!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: 'Remover'
                }).then( async (result) => {
                    if (result.value) {
                        let idProfessor = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            console.log(idProfessor);
                            const response = await fetch(`${urlBase}/turmas/${idTurma}/professores/del/${idProfessor}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O professor foi removido da turma do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderProfessoresTurmas()
                    }
                })
            })
        }
    }
    renderProfessoresTurmas()
}