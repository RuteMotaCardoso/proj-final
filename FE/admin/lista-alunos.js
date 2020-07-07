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
    const tblAlunos = document.getElementById("tblAlunos")
    const frmAlunos = document.getElementById("frmAlunos")
  


    const renderAlunos = async () => {
        frmAlunos.reset()

    // TODO: Ir buscar o nome por Id em vez do 1º
    const idTurma = getParameterByName("idTurma")
    console.log(idTurma)

    const responseT = await fetch(`${urlBase}/turmas/${idTurma}`)
    const turma = await responseT.json()
    console.log(turma)

    document.getElementById("txtAnoLetivo").innerHTML = turma[0].anoLetivo
    document.getElementById("txtCurso").innerHTML = turma[0].curso
    document.getElementById("txtAnoCurso").innerHTML = turma[0].anoCurso
    document.getElementById("txtTurma").innerHTML = turma[0].nome

        //***********************************************************************************************************************/
        //FORMATAR TABELA DE APRESENTAÇÃO DA LISTA

        //***********************************************************************************************************************/
        let strHtml = `
            <thead >
                <tr><th class='w-100 text-center bg-warning' colspan='4'>Lista de Alunos da Turma do Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-30'>Nome</th>
                    <th class='w-30'>Idade</th>     
                    <th class='w-10'>Opções</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const responseA = await fetch(`${urlBase}/turmas/${idTurma}/alunos`)
        const alunos = await responseA.json()

        const aluno = alunos;
        let i = 1
        for (const aluno of alunos) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>
                        <i id='${aluno.idAluno}' class='fas fa-edit edit'></i>
                        <i id='${aluno.idAluno}' class='fas fa-eye ver'></i>
                        <i id='${aluno.idAluno}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblAlunos.innerHTML = strHtml



        //***********************************************************************************************************************/
        //EDITAR REGISTOS DA LISTA   --> colocar dados no formulário --> lançar avaliação!

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Editar        
        const btnEdit = document.getElementsByClassName("edit")
        for (let i = 0; i < btnEdit.length; i++) {
            btnEdit[i].addEventListener("click", () => {
                isNew = false
                for (const aluno of alunos) {
                    if (aluno.idAluno == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtNome").value = aluno.nome
                    }
                }
            })
        }



        //***********************************************************************************************************************/
        //Ver Aluno

        //***********************************************************************************************************************/
           // Gerir o clique no ícone de Ver        
           const btnVer = document.getElementsByClassName("ver")
           for (let i = 0; i < btnVer.length; i++) {
               btnVer[i].addEventListener("click", () => {
                   for (const aluno of alunos) {
                       if (aluno.idAluno == btnVer[i].getAttribute("id")) {  //não mudar
                           document.location="alunos.html?idAluno=" + aluno.idAluno;
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
                }).then( () => {
                    let idAluno = btnDelete[i].getAttribute("id")  //não mudar
                    let posApagar = alunos.findIndex(x => x.idAluno == idAluno);
                    if (posApagar >= 0) {
                        alunos.splice(posApagar, 1);
                        swal('Removido!', 'O aluno foi removido da turma do curso profissional.', 'success')
                    } else {
                        swal('Erro!', 'O aluno não foi encontrado na turma do curso profissional.', 'error')
                    }
                    renderAlunos()
                })
            })
        }
    }
    renderAlunos()
}