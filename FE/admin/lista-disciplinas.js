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
                    <th class='w-10'>Opções</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const idCurso1 = getUrlSearchParameter("idCurso")
        console.log(idCurso1)
        const idCurso2 = getParameterByName("idCurso")
        console.log(idCurso2)

        const response = await fetch(`${urlBase}/cursosProfissionais/${idCurso2}/disciplinas`)
        const disciplinas = await response.json()
        // TODO: Ir buscar o nome por Id em vez do 1º
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
                        <i id='${disc.idDisciplina}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
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