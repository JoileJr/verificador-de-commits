const form = document.querySelector("form");

form.addEventListener('submit', function(event){
    event.preventDefault();
    const repositorio = document.querySelector("#repositorio").value;
    const dataInicial = document.querySelector("#dataInicial").value;
    const dataFinal = document.querySelector("#dataFinal").value;
    const url = tratarUrl(repositorio);
    buscarCommits(url, dataInicial, dataFinal);
    buscarForks(url);
    buscarStars(url);
});

function buscarForks(repositorio){
    const url = `https://api.github.com/repos/${repositorio}/forks`;
    fetch(url).then(response => response.json()).then(forks => {
        const quantidade = forks.length;
        const container = document.querySelector("#forks-stars");
        const elemento = document.createElement("h4");
        elemento.textContent = `Forks: ${quantidade}`;
        container.appendChild(elemento);
    })
}

function buscarStars(repositorio){
    const url = `https://api.github.com/repos/${repositorio}`;
    fetch(url).then(response => response.json()).then(data => {
        const stars = data.stargazers_count;
        const container = document.querySelector("#forks-stars");
        const elemento = document.createElement("h4");
        elemento.textContent = `Stars: ${stars}`;
        container.appendChild(elemento);
    })
}

function buscarCommits(repositorio, dataInicial, dataFinal) {
    const url = `https://api.github.com/repos/${repositorio}/commits?since=${dataInicial}&until=${dataFinal}`;
    fetch(url).then(response=>response.json()).then(commits=>{
        contarCommits(commits);
        console.log(commits)
    })
}

function contarCommits(commits){
    const commitsPorDia = {};
    commits.forEach(element => {
        const dataCommit = element.commit.author.date.substr(0,10);
        const author = element.commit.author.name;
        const comentario = element.commit.message;
        if(commitsPorDia[dataCommit]){
            commitsPorDia[dataCommit].quantidade++;
        }else{
            commitsPorDia[dataCommit] = {quantidade:1, data:dataCommit, author:author, comentario:comentario};
        }
    });

    const commitsPorDiaArray = Object.keys(commitsPorDia).map(dataCommit => {
        return {data:dataCommit, quantidade:commitsPorDia[dataCommit].quantidade, author: commitsPorDia[dataCommit].author, message: commitsPorDia[dataCommit].comentario}
    });

    mostrarTela(commitsPorDiaArray)
}

function mostrarTela(commits){
    const dados = document.querySelector("#dados");
    popularTabela(commits);    
}

function popularTabela(commits){
    commits.forEach( element=> {
        const tr = document.createElement("tr");
        const autor = document.createElement("td");
        const mensagem = document.createElement("td");
        const data = document.createElement("td");
        const quantidade = document.createElement("td");
        mensagem.innerHTML = element.message;
        autor.innerHTML = element.author;
        data.innerHTML = formataData(element.data);
        quantidade.innerHTML = element.quantidade;
        dados.appendChild(tr);
        tr.appendChild(autor);
        tr.appendChild(mensagem);
        tr.appendChild(data);
        tr.appendChild(quantidade);
    });
}

function tratarUrl(url){
    const regex = /^https?:\/\/github.com\/([^/]+)\/([^/]+)/;
    const correspondencias = url.match(regex);
    if (correspondencias) {
        const usuario = correspondencias[1];
        const repositorio = correspondencias[2];
        return usuario + "/" + repositorio;
    }
    const regexSemHttps = /^github.com\/([^/]+)\/([^/]+)/;
    const correspondenciasSemHttps = url.match(regexSemHttps);
    if (correspondenciasSemHttps) {
        const usuario = correspondenciasSemHttps[1];
        const repositorio = correspondenciasSemHttps[2];
        return usuario + "/" + repositorio;
    }
    return url;
}

function formataData(dataCommit){
    const data = new Date(dataCommit);
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const ano = data.getFullYear().toString();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
}

        