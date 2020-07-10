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
                        <i id='${aluno.idAluno}' class='fas fa-eye ver'></i>
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblAlunos.innerHTML = strHtml



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

    }
    renderAlunos()
}