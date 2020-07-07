let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE MÓDULOS

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
    const selDisciplinas = document.getElementById("selDisciplinas")
    const selCursos = document.getElementById("selCursos")
    const tblModulos = document.getElementById("tblModulos")
    const frmModulos = document.getElementById("frmModulos")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmModulos.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtNome = document.getElementById("txtNome").value
        const txtNumero = document.getElementById("txtNumero").value
        const txtAnoCurso = document.getElementById("txtAnoCurso").value
        const txtTotalHoras = document.getElementById("txtTotalHoras").value
        const txtLimiteFaltas = document.getElementById("txtLimiteFaltas").value
        //const txtDisciplina = document.getElementById("txtDisciplina").value
        const idDisciplina = selDisciplinas.options[selDisciplinas.selectedIndex].value
        let txtIdModulo = document.getElementById("txtIdModulo").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            response = await fetch(`${urlBase}/modulos`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `nome=${txtNome}&numero=${txtNumero}&anoCurso=${txtAnoCurso}&horas=${txtTotalHoras}&limiteFaltas=${txtLimiteFaltas}&idDisciplina=${idDisciplina}&ativo=1`
            })
            const newDisciplinaId = response.headers.get("Location")
            await trataResposta(response);
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/modulos/${txtIdModulo}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `nome=${txtNome}&numero=${txtNumero}&anoCurso=${txtAnoCurso}&horas=${txtTotalHoras}&limiteFaltas=${txtLimiteFaltas}&idDisciplina=${idDisciplina}&ativo=1`
            })
            await trataResposta(response);

        }
        isNew = true
        renderModulos()
    })



    const renderModulos = async () => {
        frmModulos.reset()
        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='7'>Lista de Módulos de uma Disciplina de um Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-35'>Curso</th>
                    <th class='w-25'>Componente/Disciplina</th>              
                    <th class='w-20'>Número-Nome</th>
                    <th class='w-5'>Ano Curso</th>              
                    <th class='w-10'>Total Horas/Limite Faltas</th>                                  
                    <th class='w-5'>Alterar</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selCursos.innerHTML = await getCursos()
        selComponentes.innerHTML = await getComponentes()
        selDisciplinas.innerHTML = await getDisciplinas()

        const response = await fetch(`${urlBase}/modulos`)
        const modulos = await response.json()
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
                    <td>
                        <i id='${modulo.idModulo}' class='fas fa-edit edit'></i>
                        <i id='${modulo.idModulo}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
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
                        
                        // Find disciplina in select
                        let selDisciplina = document.getElementById("selDisciplinas").options
                        selectTextOption(selDisciplina, modulo.disciplina)
                        //document.getElementById("txtDisciplina").value = modulo.disciplina                        
                        document.getElementById("txtNumero").value = modulo.numero
                        document.getElementById("txtNome").value = modulo.nome
                        document.getElementById("txtAnoCurso").value = modulo.anoCurso                        
                        document.getElementById("txtTotalHoras").value = modulo.totalHoras
                        document.getElementById("txtLimiteFaltas").value = modulo.limiteFaltas       
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
                        let idModulo = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            console.log(idModulo);
                            const response = await fetch(`${urlBase}/modulos/del/${idModulo}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O módulo foi removido do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderModulos()
                    }
                })
            })
        }
    }
    renderModulos()
}