let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE Turmas

//***********************************************************************************************************************/
 window.onload = () => {
    const btnLogout = document.getElementById("logout")
    // "logout" da área privada do back-office
    btnLogout.addEventListener("click", function() {
      // Teste
      window.location.replace("../index.html")  
    });
  

    // References to HTML objects   
    const selCursos = document.getElementById("selCursos")
    const tblTurmas = document.getElementById("tblTurmas")
    const frmTurmas = document.getElementById("frmTurmas")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmTurmas.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtAnoLetivo = encodeURIComponent(document.getElementById("txtAnoLetivo").value)
        //const txtCurso = document.getElementById("txtCurso").value
        const selCurso = document.getElementById("selCursos")
        const idCurso = selCurso.options[selCurso.selectedIndex].value
        const txtAnoCurso = document.getElementById("txtAnoCurso").value
        const txtNome = document.getElementById("txtNome").value

        let txtIdTurma = document.getElementById("txtIdTurma").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            response = await fetch(`${urlBase}/turmas`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtNome}&anoLetivo=${txtAnoLetivo}&anoCurso=${txtAnoCurso}&idCurso=${idCurso}&ativo=1`
            })
            const newTurmaId = response.headers.get("Location")
            await trataResposta(response);
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/turmas/${txtIdTurma}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtNome}&anoLetivo=${txtAnoLetivo}&anoCurso=${txtAnoCurso}&idCurso=${idCurso}&ativo=1`
            })
            //console.log(`nome=${txtNome}&anoLetivo=${txtAnoLetivo}&anoCurso=${txtAnoCurso}&idCurso=${idCurso}&ativo=1`)
            await trataResposta(response);
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
                    <th class='w-10'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selCursos.innerHTML = await getCursos()

        const response = await fetch(`${urlBase}/turmas`)
        const turmas = await response.json()
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
                        <i id='${turma.idTurma}' class='fas fa-graduation-cap aval'></i>
                        <i id='${turma.idTurma}' class='fas fa-fw fa-user prof'></i>
                        <i id='${turma.idTurma}' class='fas fa-edit edit'></i>
                        <i id='${turma.idTurma}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblTurmas.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const turma of turmas) {
                    if (turma.idTurma == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdTurma").value = turma.idTurma
                        document.getElementById("txtAnoLetivo").value = turma.anoLetivo
                       
                        // Find curso in select
                        let selCurso = document.getElementById("selCursos").options
                        selectTextOption(selCurso, turma.curso)                        
                        //document.getElementById("txtCurso").value = turma.curso
                        document.getElementById("txtAnoCurso").value = turma.anoCurso
                        document.getElementById("txtNome").value = turma.nome

                        scroll(0,0)
                    }
                }
            })
        }



        // Gerir o clique no ícone de Ver        
        const btnVer = document.getElementsByClassName("ver")
        for (let i = 0; i < btnVer.length; i++) {
            btnVer[i].addEventListener("click", () => {
                for (const turma of turmas) {
                    if (turma.idTurma == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.location="lista-alunos.html?idTurma=" + turma.idTurma;
                        return false;
                    }
                }
            })
        }

        // Gerir o clique no ícone de Avaliações        
        const btnAval = document.getElementsByClassName("aval")
        for (let i = 0; i < btnAval.length; i++) {
            btnAval[i].addEventListener("click", () => {
                for (const turma of turmas) {
                    if (turma.idTurma == btnAval[i].getAttribute("id")) {  //não mudar
                        document.location="modulos-avaliacao.html?idTurma=" + turma.idTurma;
                        return false;
                    }
                }
            })
        }

        // Gerir o clique no ícone de Avaliações        
        const btnProf = document.getElementsByClassName("prof")
        for (let i = 0; i < btnProf.length; i++) {
            btnProf[i].addEventListener("click", () => {
                for (const turma of turmas) {
                    if (turma.idTurma == btnProf[i].getAttribute("id")) {  //não mudar
                        document.location="professores-turmas.html?idTurma=" + turma.idTurma;
                        return false;
                    }
                }
            })
        }
        

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
                        let idTurma = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            const response = await fetch(`${urlBase}/turmas/del/${idTurma}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'A turma foi removida do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                    }
                    renderTurmas()
                })
            })
        }
    }
    renderTurmas()
}