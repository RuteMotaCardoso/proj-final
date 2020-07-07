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
    const selDisciplinas = document.getElementById("selDisciplinas")
    const selModulos = document.getElementById("selModulos")
    const selAlunos = document.getElementById("selAlunos")
    const selProfessores = document.getElementById("selProfessores")
    const selAprovado = document.getElementById("selAprovado")
    const tblAvaliacoes = document.getElementById("tblAvaliacoes")
    const frmAvaliacoes = document.getElementById("frmAvaliacoes")
  

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmAvaliacoes.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtIdTurma = document.getElementById("txtIdTurma").value
        const txtTurma = document.getElementById("txtTurma").value
        //const txtNome = document.getElementById("txtNome").value
        //const txtIdade = document.getElementById("txtIdade").value
        const idAluno = selAlunos.options[selAlunos.selectedIndex].value
        const idProfessor = selProfessores.options[selProfessores.selectedIndex].value
        const idDisciplina = selDisciplinas.options[selDisciplinas.selectedIndex].value
        const idModulo = selModulos.options[selModulos.selectedIndex].value
        const txtAvaliacao = document.getElementById("txtAvaliacao").value
        const txtFaltas = document.getElementById("txtFaltas").value
        const txtDataAvaliacao = document.getElementById("txtDataAvaliacao").value
        //const txtAprovado = document.getElementById("txtAprovado").value
        const valAprovado = selAprovado.options[selAprovado.selectedIndex].value

        console.log(txtDataAvaliacao.value)
        //let txtIdAluno = document.getElementById("txtIdAluno").value

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            response = await fetch(`${urlBase}/modulosAvaliacoes`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                body: `idProfessor=${idProfessor}&idAluno=${idAluno}&idModulo=${idModulo}&avaliacao=${txtAvaliacao}&faltas=${txtFaltas}&dataAvaliacao=${txtDataAvaliacao}&aprovado=${valAprovado}&ativo=1`
            })
            const newTurmaId = response.headers.get("Location")
            await trataResposta(response);
        } else {
            // Atualiza
            response = await fetch(`${urlBase}/modulosAvaliacoes`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "PUT",
                body: `idProfessor=${idProfessor}&idAluno=${idAluno}&idModulo=${idModulo}&avaliacao=${txtAvaliacao}&faltas=${txtFaltas}&dataAvaliacao=${txtDataAvaliacao}&aprovado=${valAprovado}&ativo=1`
            })
            //console.log(`nome=${txtNome}&anoLetivo=${txtAnoLetivo}&anoCurso=${txtAnoCurso}&idCurso=${idCurso}&ativo=1`)
            await trataResposta(response);
        }
        isNew = true
        renderAlunos()
    })



    const renderAlunos = async () => {
        frmAvaliacoes.reset()

    // TODO: Ir buscar o nome por Id em vez do 1º
    const idTurma = getParameterByName("idTurma")
    console.log(idTurma)

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
                <tr><th class='w-100 text-center bg-warning' colspan='9'>Lista de Avaliações da Turma do Curso Profissional</th></tr>
                <tr class='bg-info'>
                    <th class='w-2'>#</th>
                    <th class='w-20'>Disciplina</th>
                    <th class='w-20'>Módulo</th>     
                    <th class='w-20'>Aluno</th>              
                    <th class='w-5'>Avaliação</th>              
                    <th class='w-10'>Data</th>              
                    <th class='w-5'>Faltas</th>              
                    <th class='w-5'>Aprovado</th>          
                    <th class='w-10'>Opções</th>         
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        selAlunos.innerHTML = await getAlunos()
        selProfessores.innerHTML = await getProfessores()
        selDisciplinas.innerHTML = await getDisciplinas()
        selModulos.innerHTML = await getModulos()

        const response = await fetch(`${urlBase}/modulosAvaliacoes/${idTurma}`)
        const avaliacoes = await response.json()

        let i = 1
        for (const avaliacao of avaliacoes) {
            strHtml += `
                <tr>
                    <td>${i}</td>
                    <td>${avaliacao.disciplina}</td>
                    <td>${avaliacao.modulo}</td>
                    <td>${avaliacao.aluno}</td>
                    <td>${avaliacao.avaliacao}</td>
                    <td>${avaliacao.dataAvaliacao.split("T")[0]}</td>
                    <td>${avaliacao.faltas}</td>
                    <td>${converteSimNao(avaliacao.aprovado)}</td>
                    <td>
                        <i id='${avaliacao.idAluno}' class='fas fa-edit edit'></i>
                        <i id='${avaliacao.idAluno}' class='fas fa-trash-alt remove'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblAvaliacoes.innerHTML = strHtml



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