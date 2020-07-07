let isNew = true

//***********************************************************************************************************************/
//ARRAY COM LISTA DE TIPOS CURSOS PROFISSIONAIS

//***********************************************************************************************************************/
 window.onload = () => {
    const btnLogout = document.getElementById("logout")
    // "logout" da área privada do back-office
    btnLogout.addEventListener("click", function() {
      // Teste
      window.location.replace("../index.html")  
    });
  

    // References to HTML objects   
    const tblCP = document.getElementById("tblCP")
    const frmCP = document.getElementById("frmCP")
  

//***********************************************************************************************************************/
//FORMULÁRIO DE TIPOS DE CURSOS PROFISSIONAIS 

//***********************************************************************************************************************/
    frmCP.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNome = document.getElementById("txtNome").value
        const txtCodigo = document.getElementById("txtCodigo").value
        const txtTotalHoras = document.getElementById("txtTotalHoras").value
        let txtIdCursoProfissional = document.getElementById("txtIdCursoProfissional").value
        console.log(txtIdCursoProfissional)

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona Curso Profissional
            response = await fetch(`${urlBase}/cursosProfissionais`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtNome}&codigo=${txtCodigo}&totalHoras=${txtTotalHoras}&ativo=1`
            })
            const newCursoProfissionalId = response.headers.get("Location")
            await trataResposta(response);
      } else {
            // Atualiza
            response = await fetch(`${urlBase}/cursosProfissionais/${txtIdCursoProfissional}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtNome}&codigo=${txtCodigo}&totalHoras=${txtTotalHoras}&ativo=1`
            })
            await trataResposta(response);
        }
        isNew = true
        renderCP()
    })



    const renderCP = async () => {
        frmCP.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='5'>Lista de Tipos de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-38'>Código</th>              
                    <th class='w-10'>Total Horas</th>              
                    <th class='w-10'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        
        const response = await fetch(`${urlBase}/cursosProfissionais`)
        const cursos = await response.json()
        let i = 1
        for (const curso of cursos) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${curso.nome}</td>
                    <td>${curso.codigo}</td>
                    <td>${curso.totalHoras}</td>
                    <td>
                        <i id='${curso.idCursoProfissional}' class='fas fa-eye ver'></i>
                        <i id='${curso.idCursoProfissional}' class='fas fa-edit edit'></i>
                        <i id='${curso.idCursoProfissional}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblCP.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const curso of cursos) {
                    if (curso.idCursoProfissional == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdCursoProfissional").value = curso.idCursoProfissional
                        document.getElementById("txtNome").value = curso.nome
                        document.getElementById("txtCodigo").value = curso.codigo
                        document.getElementById("txtTotalHoras").value = curso.totalHoras
                        scroll(0,0)
                    }
                }
            })
        }


        // Gerir o clique no ícone de Ver        
        const btnVer = document.getElementsByClassName("ver")
        for (let i = 0; i < btnVer.length; i++) {
            btnVer[i].addEventListener("click", () => {
                for (const curso of cursos) {
                    if (curso.idCursoProfissional == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.location="lista-disciplinas.html?idCurso=" + curso.idCursoProfissional;
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
                }).then(async (result) => {
                    if (result.value) {
                        let idCursoProfissional = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            const response = await fetch(`${urlBase}/cursosProfissionais/del/${idCursoProfissional}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O curso profissional foi removido do sistema.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderCP()
                    }
                })
            })
        }
    }
    renderCP()
}