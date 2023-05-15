document.getElementById('dataFinal').valueAsDate = new Date();

const form = document.querySelector('form');
form.addEventListener('submit', function(e){
e.preventDefault();
const url = document.querySelector('#url').value;
const dataInicial = document.querySelector('#dataInicial').value;
const dataFinal = document.querySelector('#dataFinal').value;
const {usuario, repositorio} = tratarUrl(url);
const request = {
    usuario: usuario,
    repositorio: repositorio,
    dataInicial: dataInicial,
    dataFinal: dataFinal
}
    buscarCommits(request)
});

function buscarCommits(request){
    const url = `https://api.github.com/repos/${request.usuario}/${request.repositorio}/commits?since=${request.dataInicial}&until=${request.dataFinal}`
    fetch(url).then(response=>response.json()).
    then(commits => {
        contarCommits(commits, request);
    }).catch(error => {
        console.log(error);
    });
}

function salvarConsulta(consulta){
    const url = `http://localhost:8080/commits/`
    fetch(url,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(consulta)
        }).then(response => response.json()).
        then(result => {
            console.log(result);
        }).catch(error => {
        console.log(error);
    });
}

function contarCommits(commits, request){
    const commitsPorDia = {};
    commits.forEach(element => {
        console.log(commits)
        const dataCommit = element.commit.author.date.substr(0,10);
        const author = element.commit.author.name;
        const comentario = element.commit.message;
        if(commitsPorDia[dataCommit]){
            commitsPorDia[dataCommit].quantidade++;
        }else{
            commitsPorDia[dataCommit] = {quantidade:1, data:dataCommit, author:author, comentario:comentario};
        }
    });

    const repoInfo = {};

    fetch(`https://api.github.com/repos/${request.usuario}/${request.repositorio}`)
    .then(response => response.json())
    .then(data => {
        repoInfo.forksCount = data.forks_count;
        console.log(`O repositório ${request.usuario}/${request.repositorio} tem ${repoInfo.forksCount} forks.`);
        minhaFuncao(repoInfo.forksCount);
    })
    .catch(error => console.error(error));

    
    function minhaFuncao(forksCount) {
        console.log("forks:", forksCount)
    }

    const commitsPorDiaArray = Object.keys(commitsPorDia).map(dataCommit => {
        return {
            data:dataCommit, 
            quantidade:commitsPorDia[dataCommit].quantidade, 
            author: commitsPorDia[dataCommit].author, 
            message: commitsPorDia[dataCommit].comentario,
        }
    });
    const result = {
        owner: request.usuario,
        repositorio: request.repositorio,
        dataInicial: request.dataInicial,
        dataFinal: request.dataFinal,
        commitsPorDia: commitsPorDiaArray
    }
    mostrarTela(result)
    salvarConsulta(preparaBodyPost(result))

}

function mostrarTela(commits){
    criaTabela(commits)
}

function tratarUrl(url){
    const regex = /^https?:\/\/github.com\/([^/]+)\/([^/]+)/;
    const correspondencias = url.match(regex);
    if (correspondencias) {
        const usuario = correspondencias[1];
        const repositorio = correspondencias[2];
        return {
            usuario: usuario,
            repositorio: repositorio
        }
    }
    const regexSemHttps = /^github.com\/([^/]+)\/([^/]+)/;
    const correspondenciasSemHttps = url.match(regexSemHttps);
    if (correspondenciasSemHttps) {
        const usuario = correspondenciasSemHttps[1];
        const repositorio = correspondenciasSemHttps[2];
        return {
            usuario: usuario,
            repositorio: repositorio
        }
    }
    return{
        usuario: url.split("/")[0],
        repositorio: url.split("/")[1],
    }    
}

function criaTabela(dados) {
    const tabela = document.querySelector("#tabela");
    
    dados.commitsPorDia.forEach((commit) => {
    var row = tabela.insertRow(1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = formataData(commit.data);
    cell2.innerHTML = commit.quantidade;
    cell3.innerHTML = commit.author;
    cell4.innerHTML = commit.message;
    });
}

function preparaBodyPost(data){
    const owner = data.owner;
    const repository = data.repositorio;
    const dataInicial = data.dataInicial;
    const dataFinal = data.dataFinal;
    const commitsPorDia = data.commitsPorDia;

    const diffDays = Math.ceil(Math.abs(dataFinal - dataInicial) / (1000 * 60 * 60 * 24));
    
    const porcentagemDiasComCommit = commitsPorDia.length / diferencaEmDias(new Date(dataInicial), new Date(dataFinal));

    const url = `https://github.com/${owner}/${repository}`
    return {
        owner: owner,
        repositoryName: repository,
        repositoryLink: url,
        initialDate: dataInicial,
        finalDate: dataFinal,
        daysWithCommitsPercentage: porcentagemDiasComCommit,
        summary: criaResumoCommitsPorDia(data.commitsPorDia)
    }
}

function criaResumoCommitsPorDia(commitsPorDia){
    let resumo = "";
    console.log(commitsPorDia);
    commitsPorDia.forEach((commit) => {
    resumo += `Dia ${formataData(commit.data)} foram realizados ${commit.quantidade} commits. `
    })
    return resumo;
}

function formataData(dataCommit){
    const data = new Date(dataCommit);
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const ano = data.getFullYear().toString();
    const dataFormatada = `${mes}/${dia}/${ano}`;
    return dataFormatada;
}

function diferencaEmDias(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}