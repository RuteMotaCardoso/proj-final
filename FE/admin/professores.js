let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE PROFESSORES

//***********************************************************************************************************************/

 window.onload = () => {
    const btnLogout = document.getElementById("logout")
    // "logout" da área privada do back-office
    btnLogout.addEventListener("click", function() {
      // Teste
      window.location.replace("../index.html")  
    });
  

    // References to HTML objects   
    const tblProfessores = document.getElementById("tblProfessores")
    const frmProfessores = document.getElementById("frmProfessores")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmProfessores.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNome = document.getElementById("txtNome").value

        let txtIdProfessor = document.getElementById("txtIdProfessor").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        // https://stackoverflow.com/questions/45160097/parse-posting-uploaded-file-image-to-backend

        let fotob64 = document.getElementById("base64").value
        //console.log(fotob64)
        if (isNew) {
            // Adiciona
             response = await fetch(`${urlBase}/professores`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: `{"nome":"${txtNome}","foto":"${fotob64}","ativo":"1"}`,
                json: true,
            })
            // console.log(`{"nome":"${txtNome}","foto":"${fotob64}","ativo":"1"}`)
            const newProfessorId = response.headers.get("Location")
            const newProfessor = await response.json()

            if (newProfessor.msg != "success" )
                console.error(newProfessor.msg)
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/professores/${txtIdProfessor}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "PUT",
                body: `{"nome":"${txtNome}","foto":"${fotob64}","ativo":"1"}`,
                json: true,
            })
            // console.log(`{"nome":"${txtNome}","foto":"${fotob64}","ativo":"1"}`)
            const newProfessor = await response.json()
            if (newProfessor.msg != "success" )
                console.error(newProfessor.msg)
       }
        isNew = true
        renderProfessores()
    })



    const renderProfessores = async () => {
        frmProfessores.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='3'>Lista de Professores de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-10'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const response = await fetch(`${urlBase}/professores`)
        const professores = await response.json()
        let i = 1
        for (const professor of professores) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${professor.nome}</td>
                    <td>
                        <i id='${professor.idProfessor}' class='fas fa-edit edit'></i>
                        <i id='${professor.idProfessor}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblProfessores.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", async () => {
                isNew = false
                for (const professor of professores) {
                    if (professor.idProfessor == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdProfessor").value = professor.idProfessor
                        document.getElementById("txtNome").value = professor.nome
                        //document.getElementById("foto").src = professor.foto.data    
                        
                        const response = await fetch(`${urlBase}/professores/${professor.idProfessor}`)
                        const prof = await response.json()
                        // https://stackoverflow.com/questions/19952621/is-it-ok-to-remove-newline-in-base64-encoding
                        //var base64 = prof[0].foto.replaceAll("\n", "")
                        var base64 = prof[0].foto
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
                        let idProfessor = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            const response = await fetch(`${urlBase}/professores/del/${idProfessor}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O professor foi removido da lista dos cursos profissionais.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                    renderProfessores()
                    }
                })
            })
        }
    }
    renderProfessores()
}