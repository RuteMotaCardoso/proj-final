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
  
    // Valida máximo data atual
    document.getElementById("txtDataAvaliacao").max = new Date().toISOString().split("T")[0];

    // References to HTML objects   
    const selDisciplinas = document.getElementById("selDisciplinas")
    const selModulos = document.getElementById("selModulos")
    const selAlunos = document.getElementById("selAlunos")
    const selProfessores = document.getElementById("selProfessores")
    const selAprovado = document.getElementById("selAprovado")
    const tblAvaliacoes = document.getElementById("tblAvaliacoes")
    const frmAvaliacoes = document.getElementById("frmAvaliacoes")

    // Ir buscar o nome por Id em vez do 1º
    const idTurma = getParameterByName("idTurma")
    console.log(idTurma)
    

    // Carregamento hierárquico dos módulos com base na disciplina seleccionada
    selDisciplinas.onchange = async (result) => {
        const idDisciplina = selDisciplinas.options[selDisciplinas.selectedIndex].value
        selModulos.innerHTML = await getModulosDisciplina(idDisciplina);
    }

//***********************************************************************************************************************/
//FORMULÁRIO
//***********************************************************************************************************************/
    frmAvaliacoes.addEventListener("submit", async (event) => {
        event.preventDefault()
        const txtTurma = document.getElementById("txtTurma").value
        //const txtNome = document.getElementById("txtNome").value
        //const txtIdade = document.getElementById("txtIdade").value
        const idAluno = selAlunos.options[selAlunos.selectedIndex].value
        const idProfessor = selProfessores.options[selProfessores.selectedIndex].value
        const idModulo = selModulos.options[selModulos.selectedIndex].value
        const txtAvaliacao = document.getElementById("txtAvaliacao").value
        const txtFaltas = document.getElementById("txtFaltas").value
        const txtDataAvaliacao = document.getElementById("txtDataAvaliacao").value
        //const txtAprovado = document.getElementById("txtAprovado").value
        const valAprovado = selAprovado.options[selAprovado.selectedIndex].value
        let txtIdAvaliacao = document.getElementById("txtIdAvaliacao").value

        console.log(txtIdAvaliacao)
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
            response = await fetch(`${urlBase}/modulosAvaliacoes/${txtIdAvaliacao}`, {
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
        renderModulosAvaliacao()
    })



    const renderModulosAvaliacao = async () => {
        frmAvaliacoes.reset()

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
        selAlunos.innerHTML = await getAlunosTurma(idTurma)
        selProfessores.innerHTML = await getProfessores()
        selDisciplinas.innerHTML = await getDisciplinas()
        //selModulos.innerHTML = await getModulos()

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
                        <i id='${avaliacao.idAvaliacoesModulos}' class='fas fa-edit edit'></i>
                        <i id='${avaliacao.idAvaliacoesModulos}' class='fas fa-trash-alt remove'></i>
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
                for (const avaliacao of avaliacoes) {
                    console.log(avaliacao.idAvaliacoesModulos)
                    if (avaliacao.idAvaliacoesModulos == btnEdit[i].getAttribute("id")) {  //não mudar
                        document.getElementById("txtIdAvaliacao").value = avaliacao.idAvaliacoesModulos
                        document.getElementById("txtAvaliacao").value = avaliacao.avaliacao
                        document.getElementById("txtFaltas").value = avaliacao.faltas
                        document.getElementById("txtDataAvaliacao").value = avaliacao.dataAvaliacao.split("T")[0]
                        document.getElementById("txtAprovado").value = converteSimNao(avaliacao.aprovado)
                        // Find aluno in select
                        let selAluno = document.getElementById("selAlunos").options
                        selectTextOption(selAluno, avaliacao.aluno)
                        // Find professor in select
                        let selProfessor = document.getElementById("selProfessores").options
                        selectTextOption(selProfessor, avaliacao.professor)
                        // Find disciplina in select
                        let selDisciplina = document.getElementById("selDisciplinas").options
                        selectTextOption(selDisciplina, avaliacao.disciplina)
                        // Find modulo in select
                        let selModulo = document.getElementById("selModulos").options
                        selectTextOption(selModulo, avaliacao.modulo)
                        scroll(0,0)
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
                   for (const idAvaliacoesModulos of avaliacoes) {
                       if (idAvaliacoesModulos.idAvaliacoesModulos == btnVer[i].getAttribute("id")) {  //não mudar
                           document.location="alunos.html?idAluno=" + idAvaliacoesModulos.idAluno;
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
                        let idModuloAvaliacao = btnDelete[i].getAttribute("id")  //não mudar
                        try {
                            console.log(idModuloAvaliacao);
                            const response = await fetch(`${urlBase}/modulosAvaliacoes/del/${idModuloAvaliacao}`, {
                                method: "PUT"
                            })
                            if (response.status == 204) {
                                swal('Removido!', 'A avaliação do módulo foi removida do curso profissional.', 'success')
                            }
                        } catch (err) {
                            swal({
                                type: 'error',
                                title: 'Erro',
                                text: err
                            })
                        }
                        renderModulosAvaliacao()
                    }
                })
            })
        }
    }
    renderModulosAvaliacao()
}