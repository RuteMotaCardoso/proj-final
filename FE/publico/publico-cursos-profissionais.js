let isNew = true

 window.onload = () => {

    // References to HTML objects   
    const tblCP = document.getElementById("tblCP")
    const frmCP = document.getElementById("frmCP")
  

//***********************************************************************************************************************/
//FORMULÁRIO DE TIPOS DE CURSOS PROFISSIONAIS 
//***********************************************************************************************************************/

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
                    <th class='w-10'>Detalhe</th>              
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
                    </td>
                </tr>
            `
            i++
        }
        strHtml += "</tbody>"
        tblCP.innerHTML = strHtml


        //***********************************************************************************************************************/
        //VER DETALHE   --> Lista Disciplinas

        //***********************************************************************************************************************/
        // Gerir o clique no ícone de Ver        
        const btnVer = document.getElementsByClassName("ver")
        for (let i = 0; i < btnVer.length; i++) {
            btnVer[i].addEventListener("click", () => {
                for (const curso of cursos) {
                    if (curso.idCursoProfissional == btnVer[i].getAttribute("id")) {  //não mudar
                        document.location="publico-lista-disciplinas.html?idCurso=" + curso.idCursoProfissional;
                        return false;
                    }
                }
            })
        }
    }
    renderCP()
}