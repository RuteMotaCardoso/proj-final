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
    const tblModulos = document.getElementById("tblModulos")
    const frmModulos = document.getElementById("frmModulos")
  


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
                    <th class='w-5'>Remover</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const idDisciplina = getParameterByName("idDisciplina")
        console.log(idDisciplina)

        const response = await fetch(`${urlBase}/disciplinas/${idDisciplina}/modulos`)
        const modulos = await response.json()

        // TODO: Ir buscar o nome por Id em vez do 1º
        document.getElementById("txtDisciplina").innerHTML = modulos[0].disciplina

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
                        <i id='${modulo.idModulo}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblModulos.innerHTML = strHtml


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
                            const response = await fetch(`${urlBase}/modulos/del/${idModulo}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'O módulo foi removida da disciplina do curso profissional.', 'success')
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