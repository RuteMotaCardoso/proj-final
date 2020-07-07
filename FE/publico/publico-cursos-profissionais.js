const urlBase = "https://fcawebbook.herokuapp.com"
let isNew = true


//***********************************************************************************************************************/
//ARRAY COM LISTA DE TIPOS CURSOS PROFISSIONAIS

//***********************************************************************************************************************/
var cursosProfissionais = [
    {"idCursoProfissional":1,"nome":"Técnico de Gestão de Equipamentos Informáticos","codigo":"TGEI","totalHoras":"3000","active":null},
    {"idCursoProfissional":2,"nome":"Técnico de Gestão de Websites","codigo":"TGWS","totalHoras":"3000","active":null},
    {"idCursoProfissional":3,"nome":"Técnico de Gestão de Bases de Dados","codigo":"TGBD","totalHoras":"3000","active":null},
    {"idCursoProfissional":4,"nome":"Técnico de Gestão de Redes","codigo":"TGRE","totalHoras":"3000","active":null},
]


 window.onload = () => {

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
        if (txtIdCursoProfissional === "")
            txtIdCursoProfissional = cursosProfissionais.length+1;

        // Verifica flag isNew para saber se se trata de uma adição ou de um atualização dos dados
        let response
        if (isNew) {
            // Adiciona
            const newCP = {
                "idCursoProfissional":txtIdCursoProfissional,
                "nome":txtNome,
                "codigo":txtCodigo,
                "totalHoras":txtTotalHoras
             };
             cursosProfissionais.push(newCP);
        } else {
            // Atualiza
            const newCP= {
                "idCursoProfissional":txtIdCursoProfissional,
                "nome":txtNome,
                "codigo":txtCodigo,
                "totalHoras":txtTotalHoras
             };
            let posEditar = cursosProfissionais.findIndex(x => x.idCursoProfissional == txtIdCursoProfissional);
            cursosProfissionais[posEditar] = newCP;
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
                    <th class='w-10'>Detalhe</th>              
                </tr> 
            </thead><tbody>
        `

        //***********************************************************************************************************************/
        //APRESENTAR LISTA

        //***********************************************************************************************************************/
        const cursos = cursosProfissionais;
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
                    let idCursoProfissional = btnDelete[i].getAttribute("id")  //não mudar
                    let posApagar = cursosProfissionais.findIndex(x => x.idCursoProfissional == idCursoProfissional);
                    if (posApagar >= 0) {
                        cursosProfissionais.splice(posApagar, 1);
                        swal('Removido!', 'O tipo de curso profissional foi removido da lista.', 'success')
                    } else {
                        swal('Erro!', 'O tipo de curso profissional não foi encontrado na lista.', 'error')
                    }
                    renderCP()
                })
            })
        }
    }
    renderCP()
}