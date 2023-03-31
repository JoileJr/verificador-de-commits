const form = document.querySelector("form");

form.addEventListener('submit', function(event){
    event.preventDefault();
    const repositorio = document.querySelector("#repositorio").value;
    const dataInicial = document.querySelector("#dataInicial").value;
    const dataFinal = document.querySelector("#dataFinal").value;

    buscarCommits(repositorio, dataInicial, dataFinal);
    buscarForks(repositorio);
    buscarStars(repositorio);
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
    let autorCommit = '';
    let mensagemCommit = '';

    commits.forEach(element => {
        const dataCommit = element.commit.author.date.substr(0, 10);
        autorCommit = element.commit.author.name
        mensagemCommit = element.commit.message
        console.log(autorCommit)
        if(commitsPorDia[dataCommit]){
            commitsPorDia[dataCommit].quantidade++;
        } else{
            commitsPorDia[dataCommit] = {quantidade: 1, data: dataCommit}
        }
    });

    const commitsPorDiaArray = Object.keys(commitsPorDia).map(dataCommit => {
        return { data: dataCommit, quantidade: commitsPorDia[dataCommit].quantidade}
    });

    mostrarTela(commitsPorDiaArray, `${autorCommit}`, `${mensagemCommit}`);
}

function mostrarTela(commits, autorCommit, mensagemCommit){
    const dados = document.querySelector("#dados");

    commits.forEach( element=> {
        const tr = document.createElement("tr");
        const data = document.createElement("td");
        const quantidade = document.createElement("td");
        const autor = document.createElement("td");
        const mensagem = document.createElement("td");
        mensagem.innerHTML = mensagemCommit
        autor.innerHTML = autorCommit;
        data.innerHTML = element.data;
        quantidade.innerHTML = element.quantidade;
        dados.appendChild(tr);
        tr.appendChild(autor);
        tr.appendChild(mensagem);
        tr.appendChild(data);
        tr.appendChild(quantidade);
    });
}


        