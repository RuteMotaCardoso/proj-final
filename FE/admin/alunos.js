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
    const selTurmas = document.getElementById("selTurmas")
    const tblAlunos = document.getElementById("tblAlunos")
    const frmAlunos = document.getElementById("frmAlunos")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmAlunos.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNome = document.getElementById("txtNome").value
        const txtIdade = document.getElementById("txtIdade").value
        //const txtTurma = document.getElementById("txtTurma").value
        const idTurma = selTurmas.options[selTurmas.selectedIndex].value

        let txtIdAluno = document.getElementById("txtIdAluno").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        let fotob64 = document.getElementById("base64").value

        if (isNew) {
            // Adiciona
            response = await fetch(`${urlBase}/alunos`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: `{"nome":"${txtNome}","idade":"${txtIdade}","idTurma":"${idTurma}","foto":"${fotob64}","ativo":"1"}`,
                json: true,
            })
            // console.log(`{"nome":"${txtNome}","idade":"${txtIdade}","idTurma":"${idTurma}","foto":"${fotob64}","ativo":"1"}`)
            const newAlunoId = response.headers.get("Location")
            // console.log(newAlunoId)
            await trataResposta(response);
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/alunos/${txtIdAluno}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "PUT",
                body: `{"nome":"${txtNome}","idade":"${txtIdade}","idTurma":"${idTurma}","foto":"${fotob64}","ativo":"1"}`,
                json: true,
            })
            // console.log(`{"nome":"${txtNome}","idade":"${txtIdade}","idTurma":"${idTurma}","foto":"${fotob64}","ativo":"1"}`)
            await trataResposta(response);
        }
        isNew = true
        renderAlunos()
    })



    const renderAlunos = async () => {
        frmAlunos.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='5'>Lista de Alunos de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-30'>Idade</th>
                    <th class='w-38'>Turma</th>              
                    <th class='w-10'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selTurmas.innerHTML = await getTurmas()

        const response = await fetch(`${urlBase}/alunos`)
        const alunos = await response.json()
        let i = 1
        for (const aluno of alunos) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>${aluno.turma}</td>
                    <td>
                        <i id='${aluno.idAluno}' class='fas fa-edit edit'></i>
                        <i id='${aluno.idAluno}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblAlunos.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", async () => {
                isNew = false
                for (const aluno of alunos) {
                    if (aluno.idAluno == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdAluno").value = aluno.idAluno
                        document.getElementById("txtNome").value = aluno.nome
                        document.getElementById("txtIdade").value = aluno.idade

                        // Find componente in select
                        let selTurma = document.getElementById("selTurmas").options
                        selectTextOption(selTurma, aluno.turma)
                        //document.getElementById("txtTurma").value = aluno.turma

                        const response = await fetch(`${urlBase}/alunos/${aluno.idAluno}`)
                        const alu = await response.json()
                        // https://stackoverflow.com/questions/19952621/is-it-ok-to-remove-newline-in-base64-encoding
                        //var base64 = alu[0].foto.replaceAll("\n", "")
                        var base64 = alu[0].foto
                        //console.log(base64)
                        writeImage(base64)

                        // https://stackoverflow.com/questions/20549241/how-to-reset-input-type-file
                        document.getElementById("fotoFile").value = ""
                        scroll(0,0)

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
                }).then(async (result) => {
                    if (result.value) {
                        let idAluno = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            const response = await fetch(`${urlBase}/alunos/del/${idAluno}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O aluno foi removido do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderAlunos()
                    }
                })
            })
        }
    }
    renderAlunos()
}

