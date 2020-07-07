# Projeto Final 

## Introdução
Este projeto é um exercício meramente académico, uma vez que tive de abreviar e simplificar muitos aspetos,  em termos de Base de dados (não torná-la tão modular e complexa) e para evitar um número muito elevado de ecrãs e dados. Também se evitou neste projeto toda a problemática de gestão de dados históricos.

Mesmo considerando esta simplificação, 11 ecrãs na área privada, para além da Landing page e das listagens disponibilizadas no front-office (7 ecrãs "públicos" de consulta).

De forma semelhante, também ao nível da Base de dados existem 10 tabelas com entidades com múltiplas relações. Nas entidades tentou reduzir-se os seus dados ao mínimo indispensável, por exemplo, o professor só tem o nome e a foto.

Não obstante, o site permite realizar a prova de conceito pretendida.

## Estrutura do site
O site tem como ponto inicial a Landing Page da "EP do Futuro", seguindo o modelo do projeto WebConference. Na área de gestão privada, estão disponíveis os ecrãs para gerir os Cursos Profissionais, os Professores, os Alunos, as Disciplinas, os Módulos, as Turmas e as Avaliações. Na parte pública, estão disponíveis as listagens de consulta pública, sem capacidade de edição de dados, nomeadamente a consulta dos Cursos Profissionais e das Avaliações.

Foi introduzido um tipo de ecrã diferente, apenas com a lista de dados para consulta (). Dada a natureza hierárquica da estrutura dos dados, houve também necessidade das listas permitirem consulta dos detalhes (podendo ser sublistas de entidades). De referir que existem vários níveis de profundidade e navegação (por exemplo: Curso -> Disciplina -> Módulo, ou no Front-Office, Turma -> Disciplina -> Módulo -> Avaliação).

A estrutura do site e navegação permitem o acesso a alguns ecrãs por vários caminhos, existindo alguma redundância o que é positivo para a utilização do site. A navegação e os ecrãs estão disponíveis na pasta Site.

## Dificuldades
* A autenticação consumiu bastante tempo, sem grandes sucessos. Conseguiu registar-se utilizadores (via REST API), mas não se conseguiu registar todos os dados (por exemplo, Tipo), o que permitiria distinguir os utilizadores consoante o seu perfil. Inicialmente ponderei a existência de 5 perfis: visitante (anónimo), professor, aluno, coordenador de curso e secretaria. Com base no tipo de utilizador, poderiam ser apresentadas operações ou opções específicas ao seu perfil.
* Outro aspeto que requereu investimento e pesquisa foi o carregamento de dados dinâmicos para as dropdowns (selects). Sendo alimentadas a partir das tabelas da Base de dados, e para evitar a replicação deste código nos vários ecrãs, optou-se por concentrar estes métodos num ficheiro javascript comum (common.js), onde foram colocadas todas as funções comuns. Esta funcionalidade não se restringe ao carregamento inicial da dropdown, mas recupera a seleção escolhida quando o registo é editado (por exemplo, quando se edita uma disiciplina, é selecionado o curso associado na dropdown). Porém, o passo seguinte e desejável seria o carregamento de uma drop down filtrar outra dropdown hierárquica, por exemplo, escolhendo uma componente de formação apresentar apenas as disciplinas deste componente.
* Tal como refereido anteriormente, o número de entidades, ecrãs, tabelas e dados foi um aspeto que não sendo difícil, tornou todo o proceso de criação e ajuste do site muito mais demorado.
* O principal aspeto que consumiu mais tempo, acabaou por revelar-se o carregamento e apresentação das imagens dos professores e alunos. Optou-se por não utilizar um URL como src da imagem, considerando que tal elemento não será público. Como tal, foi necessário investigar bastante os mecanismos de leitura de imagens (dados binários), apresentação no ecrã, codificação dos mesmos para envio para o backend (base64), descodificação dos dados no backend para binário e gravação na BD. Foi um processo moroso, que obrigou a compreender melhor como são lidos, transmitidos e guardados os dados, sendo muitas vezes necessário fazer e analisar os logs, gravar em disco os dados, e analisar/comparar tipos de ficheiros antes e depois do envio. Foi também necessário melhorar a informação devolvida nos erros para facilitar o debug (por exemplo, concluindo que o tipo de dados blob apenas suporta 64KB, obrigando a utilizar um mediumblob). 

## Aspetos de melhoria
* As cores das páginas de listas poderiam ter sido personalizadas para diferenciar do site Webconference, tendo-se investido e tido o cuidado de personalizar a imagem e o texto da Landing Page, bem como os ícones (font-awesome) utilizados no site, tanto ao nível do Front Office, como do Back Office.
* Poderia ser implementada paginação nas listas mais longas, bem como mecanismos de validação de regras semânticas e cálculos automáticos (faltas vs limite de faltas, médias).
* Dado o elevado número de ecrãs, e tudo o que os alimenta (consultas a tabelas, fazendo joins entre as entidades, carregamento de dados dinâmicos), não foi possível investir numa componente de calendário de testes e/ou aulas, o que constitui um possível fator de melhoria.


## Elementos de Entrega
* Ficheiros de Back-end e Front-end
* Modelo de dados (mwb, png, sql) da BDCursoProfissional
* Imagens (site)
* "Scripts" teste RESTer (BE/assets/rester-export-postman.json)
* URL BE Heroku (https://proj-final-curso-profissional.herokuapp.com/)



## Git
- https://docs.github.com/pt/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line
git init
git pull --allow-unrelated-histories origin master
git add .
git commit -m "Commit inicial Heroku"
git remote add origin https://github.com/RuteMotaCardoso/proj-final.git
git remote -v
git push origin master

## Heroku (npm install -> package e lock)
- https://stackoverflow.com/questions/51678095/syntax-error-when-start-heroku-open
- https://devcenter.heroku.com/articles/heroku-cli-commands
- https://stackoverflow.com/questions/5977234/how-can-i-push-a-part-of-my-git-repo-to-heroku
npm install
heroku login
heroku create
#heroku buildpacks:set heroku/nodejs
heroku apps:create proj-final-curso-profissional
- https://stackoverflow.com/questions/18406721/heroku-does-not-appear-to-be-a-git-repository
heroku git:remote -a proj-final-curso-profissional
-git push heroku master
git subtree push --prefix BE heroku master

heroku ps:scale web=1
heroku logs --tail

- BD MySql
mysqldump.exe -h localhost -u root -p bdcursoprofissional > \wamp64\www\WebAvançada\BE\config\backupBDCP.sql
heroku addons:create jawsdb
heroku config:get JAWSDB_URL
mysqldump -h remoteHost -u remoteUser -premotePass remoteDBName < \wamp64\www\WebAvançada\BE\config\backupBDCP.sql

npm install
heroku local
heroku open cool
