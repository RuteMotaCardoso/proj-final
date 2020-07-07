let isNew = true

//***********************************************************************************************************************/
//ARRAY COM LISTA DE DISCIPLINAS

//***********************************************************************************************************************/

 window.onload = () => {
    const btnLogout = document.getElementById("logout")
    // "logout" da área privada do back-office
    btnLogout.addEventListener("click", function() {
      // Teste
      window.location.replace("../index.html")  
    });
  

    // References to HTML objects   
    const selComponentes = document.getElementById("selComponentes")
    const selCursos = document.getElementById("selCursos")
    const tblDisciplinas = document.getElementById("tblDisciplinas")
    const frmDisciplinas = document.getElementById("frmDisciplinas")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmDisciplinas.addEventListener("submit", async (event) => {
        event.preventDefault()
        //const txtCurso = document.getElementById("txtCurso").value
        const idCurso = selCursos.options[selCursos.selectedIndex].value
        const txtNome = document.getElementById("txtNome").value
        //const txtComponente = document.getElementById("txtComponente").value
        const idComponente = selComponentes.options[selComponentes.selectedIndex].value
        const txtTotalHoras = document.getElementById("txtTotalHoras").value
        let txtIdDisciplina = document.getElementById("txtIdDisciplina").value

        console.log(idCurso)
        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
             response = await fetch(`${urlBase}/disciplinas`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtNome}&idComponente=${idComponente}&totalHoras=${txtTotalHoras}&idCurso=${idCurso}&ativo=1`
            })
            const newDisciplinaId = response.headers.get("Location")
            await trataResposta(response);
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/disciplinas/${txtIdDisciplina}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtNome}&idComponente=${idComponente}&totalHoras=${txtTotalHoras}&idCurso=${idCurso}&ativo=1`
            })
            await trataResposta(response);
        }
        isNew = true
        renderDisciplinas()
    })



    const renderDisciplinas = async () => {
        frmDisciplinas.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='6'>Lista de Disciplinas de Cursos Profissionais</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Curso</th>
                    <th class='w-38'>Componente</th>              
                    <th class='w-38'>Disciplina</th>              
                    <th class='w-10'>Total Horas</th>              
                    <th class='w-10'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selCursos.innerHTML = await getCursos()
        selComponentes.innerHTML = await getComponentes()
 
        const response = await fetch(`${urlBase}/disciplinas`)
        const disciplinas = await response.json()
        let i = 1
        for (const disc of disciplinas) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${disc.curso}</td>
                    <td>${disc.componente}</td>
                    <td>${disc.nome}</td>
                    <td>${disc.totalHoras}</td>
                    <td>
                        <i id='${disc.idDisciplina}' class='fas fa-eye ver'></i>
                        <i id='${disc.idDisciplina}' class='fas fa-edit edit'></i>
                        <i id='${disc.idDisciplina}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblDisciplinas.innerHTML = strHtml


        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const disc of disciplinas) {
                    if (disc.idDisciplina == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdDisciplina").value = disc.idDisciplina
                        
                        // Find curso in select
                        let selCurso = document.getElementById("selCursos").options
                        selectTextOption(selCurso, disc.curso)
                        //document.getElementById("txtCurso").value = disc.curso

                        // Find componente in select
                        let selComponente = document.getElementById("selComponentes").options
                        selectTextOption(selComponente, disc.componente)                
                        //document.getElementById("txtComponente").value = disc.componente

                        document.getElementById("txtNome").value = disc.nome
                        document.getElementById("txtTotalHoras").value = disc.totalHoras
                        scroll(0,0)
                    }
                }
            })
        }

        // Gerir o clique no ícone de Ver        
        const btnVer = document.getElementsByClassName("ver")
        for (let i = 0; i < btnVer.length; i++) {
            btnVer[i].addEventListener("click", () => {
                for (const disc of disciplinas) {
                    if (disc.idDisciplina == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.location="lista-modulos.html?idDisciplina=" + disc.idDisciplina;
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
                        let idDisciplina = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            const response = await fetch(`${urlBase}/disciplinas/del/${idDisciplina}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'A disciplina foi removido do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderDisciplinas()
                    }
                })
            })
        }
    }
    renderDisciplinas()
}