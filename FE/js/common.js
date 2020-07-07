const urlBase = "http://127.0.0.1:8080"

function selectTextOption(options, searchtext) {
    for (var i = 0; i < options.length; ++i) {
        if (options[i].text === searchtext) 
            options[i].selected = true;
    }
}

async function getCursos() {
    const responseCurso = await fetch(`${urlBase}/cursosProfissionais`)
    const cursos = await responseCurso.json()
    let strHtmlSel = ""
    for (const curso of cursos) {
        strHtmlSel += `
            <option value="${curso.idCursoProfissional}">${curso.codigo}</option>
        `
    }
    strHtmlSel += ""
    return strHtmlSel    
}

async function getComponentes() {
    const responseComp = await fetch(`${urlBase}/componentes`)
    const componentes = await responseComp.json()
    let strHtmlSel = ""
    for (const comp of componentes) {
        strHtmlSel += `
            <option value="${comp.idComponente}">${comp.nome}</option>
        `
    }
    return strHtmlSel
}

async function getTurmas() {
    const responseTurmas = await fetch(`${urlBase}/turmas`)
    const turmas = await responseTurmas.json()
    let strHtmlSel = ""
    for (const turma of turmas) {
        strHtmlSel += `
            <option value="${turma.idTurma}">${turma.nome}</option>
        `
    }
    return strHtmlSel
}

async function getDisciplinas() {
    const responseDisciplinas = await fetch(`${urlBase}/disciplinas`)
    const disciplinas = await responseDisciplinas.json()
    let strHtmlSel = ""
    for (const disciplina of disciplinas) {
        strHtmlSel += `
            <option value="${disciplina.idDisciplina}">${disciplina.nome}</option>
        `
    }
    return strHtmlSel
}

async function getModulos() {
    const responseModulos = await fetch(`${urlBase}/modulos`)
    const modulos = await responseModulos.json()
    let strHtmlSel = ""
    for (const modulo of modulos) {
        strHtmlSel += `
            <option value="${modulo.idModulo}">${modulo.nome}</option>
        `
    }
    return strHtmlSel
}

async function getAlunos() {
    const responseAlunos = await fetch(`${urlBase}/alunos`)
    const alunos = await responseAlunos.json()
    let strHtmlSel = ""
    for (const aluno of alunos) {
        strHtmlSel += `
            <option value="${aluno.idAluno}">${aluno.nome}</option>
        `
    }
    return strHtmlSel
}

async function getProfessores() {
    const responseProfessores = await fetch(`${urlBase}/professores`)
    const professores = await responseProfessores.json()
    let strHtmlSel = ""
    for (const professor of professores) {
        strHtmlSel += `
            <option value="${professor.idProfessor}">${professor.nome}</option>
        `
    }
    return strHtmlSel
}
function getUrlSearchParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(name);
    return myParam;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function trataResposta(response) {
    const respostaApi = await response.json();
    console.log(respostaApi);

    if (respostaApi && respostaApi.msg != "success") {
        if (respostaApi.msg == "Error") {
            swal({
                type: 'error',
                title: 'Erro',
                text: respostaApi.message.pt
            });
        }
        else {
            swal({
                type: 'error',
                title: `Erro (${respostaApi[0].value})`,
                text: `${respostaApi[0].msg} no campo ${respostaApi[0].param} `
            });
        }
        console.error(respostaApi);
    }
}

function converteSimNao(i) {
    return (i == 1) ? "Sim" : "Não";
}

/**
 * Processamento imagem de/para base64 (WebAPI)
 */
// Nao usado: https://stackoverflow.com/questions/14915058/how-to-display-binary-data-as-image-extjs-4
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

// Nao usado
var loadFile = function(event) {
    // https://www.webtrickshome.com/faq/how-to-display-uploaded-image-in-html-using-javascript
    //var image = document.getElementById('foto');
    //image.src = URL.createObjectURL(event.target.files[0]);

    // https://stackoverflow.com/questions/45160097/parse-posting-uploaded-file-image-to-backend
    // https://stackoverflow.com/questions/23986953/blob-saved-as-object-object-nodejs
    if (event.target.files && event.target.files[0]) {
        var FR= new FileReader();
        FR.addEventListener("load", function(e) {
            var dataUrl = e.target.result;
            //document.getElementById("foto").src     = dataUrl;
            console.log(dataUrl)
            //get the base64 encoded string and add it to id=b64. 
            var base64 = (dataUrl.split(';')[1]).split(',')[1];
            console.log(base64)
            //var base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
            document.getElementById("base64").value = base64;
        }); 
        FR.readAsDataURL( event.target.files[0] );
    }
};


// https://stackoverflow.com/questions/22255580/javascript-upload-image-file-and-draw-it-into-a-canvas
// https://stackoverflow.com/questions/28047792/html-canvas-scaling-image-to-fit-without-stretching/28048865
function readImage(event) {
  if (!event.target.files || !event.target.files[0]) return;

  const ctx = document.getElementById("canvas").getContext("2d");
  
  const FR = new FileReader();
  FR.addEventListener("load", (evt) => {
    var img = new Image();
    img.onload = function(){
        var ct = document.getElementById('measure'); 
        ct.appendChild(img);
        var wrh = img.width / img.height;
        var newWidth = canvas.width;
        var newHeight = newWidth / wrh;
        if (newHeight > canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * wrh;
        }
        ct.removeChild(img);
        ctx.drawImage(img,0,0, newWidth , newHeight);
    }
    var dataUrl = evt.target.result;
    img.src = dataUrl;
    var base64 = (dataUrl.split(';')[1]).split(',')[1];
    document.getElementById("base64").value = base64;
    //console.log(base64)
  });
  FR.readAsDataURL(event.target.files[0]);
}

function writeImage(data) {
    const ctx = document.getElementById("canvas").getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!data ) return;
    //console.log('writeImage')
  
    var img = new Image();
    img.onload = function(){
        var ct = document.getElementById('measure'); 
        ct.src = `data:image/png;base64,${data}`;
        ct.appendChild(img);
        //console.log(ct.id)
        var wrh = img.width / img.height;
        var newWidth = canvas.width;
        var newHeight = newWidth / wrh;
        if (newHeight > canvas.height) {
            newHeight = canvas.height;
            newWidth = newHeight * wrh;
        }
        ct.removeChild(img);
        ctx.drawImage(img,0,0, newWidth , newHeight);
    }
    // Nao usado: https://stackoverflow.com/questions/42395034/how-to-display-binary-data-as-image-in-react
    //console.log(data)
    img.src = `data:image/png;base64,${data}`;
    document.getElementById("base64").value = data;  
}

// https://stackoverflow.com/questions/18253378/javascript-blob-upload-with-formdata
// https://stackoverflow.com/questions/45239154/saving-an-image-blob/45239534
// https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded

// https://medium.com/@emeruchecole9/uploading-images-to-rest-api-backend-in-react-js-b931376b5833