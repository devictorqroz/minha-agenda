const btHome = document.querySelector("#bt-home");
const btCadastrar = document.querySelector("#bt-cadastrar");
const btSalvar = document.querySelector("#bt-salvar");
const btListar = document.querySelector("#bt-listar");

const filtroPesquisa = document.querySelector("#filtro-pesquisa");
const campoPesquisar = document.querySelector("#campo-pesquisar");

const agenda = document.querySelector(".agenda");
const formulario = document.querySelector("form");
const listaExibicao = document.querySelector(".lista-exibicao");

let listaDeContatos = localStorage.getItem("listaDeContatos");

try {
    listaDeContatos = JSON.parse(listaDeContatos);
} finally {
    if (!listaDeContatos) {
        listaDeContatos = [];
    }
}

// Funções **********************************

function exibirMenuCadastro() {
    formulario.classList.remove("hidden");
    agenda.classList.remove("hidden");
}

function limparMenuCadastro() {
    formulario.reset();
    formulario.nome.focus();
}

function exibirAgenda() {
    if (agenda.classList.contains("hidden")) {
        agenda.classList.toggle("hidden");
    }
}

function salvarLista() {
    localStorage.setItem("listaDeContatos", JSON.stringify(listaDeContatos));
}

function ordenarLista() {
    listaDeContatos.sort(function (a, b) {
        const contatoA = a.nome.toUpperCase();
        const contatoB = b.nome.toUpperCase();

        if (contatoA < contatoB) {
            return -1;
        }
        if (contatoA > contatoB) {
            return 1;
        }
        return 0;
    });
}

function listarContatos(filtro = "", pesquisa = "") {
    exibirAgenda();
    ordenarLista();
    listaExibicao.innerHTML = "";
    listaDeContatos.forEach((contato, id) => {
        const nomeContato = contato.nome.toUpperCase();
        const telefoneContato = contato.telefone.toUpperCase();
        const emailContato = contato.email.toUpperCase();
        const filtroUpper = filtro.toUpperCase();
        const pesquisaUpper = pesquisa.toUpperCase();

        if (
            (filtroUpper === "NOME" &&
                nomeContato.indexOf(pesquisaUpper) !== -1) ||
            (filtroUpper === "TELEFONE" &&
                telefoneContato.indexOf(pesquisaUpper) !== -1) ||
            (filtroUpper === "EMAIL" &&
                emailContato.indexOf(pesquisaUpper) !== -1) ||
            pesquisaUpper === ""
        ) {
            let itemContato = document.createElement("li");
            itemContato.classList.add("contato-lista");
            itemContato.innerHTML = ` Nome: ${contato.nome} | 
          Telefone: ${contato.telefone} | 
          Email: ${contato.email} |
          <button id="bt-editar" onClick="editarContato(${id})">
          <i class="fa-solid fa-pen"></i>
          </button>
          <button id="bt-excluir" onClick="excluirContato(${id})">
          <i class="fa-solid fa-xmark"></i>
          </button>   
        `;

            listaExibicao.appendChild(itemContato);
        }
    });
}

function editarContato(id) {
    if (formulario.classList.contains("hidden")) {
        formulario.classList.toggle("hidden");
    }
    formulario.id.value = id;
    formulario.nome.value = listaDeContatos[id].nome;
    formulario.telefone.value = listaDeContatos[id].telefone;
    formulario.email.value = listaDeContatos[id].email;
}

function excluirContato(id) {
    listaDeContatos.splice(id, 1);
    salvarLista();
    listarContatos();
}

// Eventos ********************************

btCadastrar.addEventListener("click", () => {
    exibirMenuCadastro();
    limparMenuCadastro();
});

formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    let novoContato = new Object();
    novoContato.nome = this.nome.value;
    novoContato.telefone = this.telefone.value;
    novoContato.email = this.email.value;

    if (this.id.value !== "" && this.id.value >= 0) {
        listaDeContatos[this.id.value] = novoContato;
    } else {
        listaDeContatos.push(novoContato);
    }

    salvarLista();

    this.reset();
    this.id.value = null;

    listarContatos();
});

btHome.addEventListener("click", () => {
    agenda.classList.add("hidden");
    formulario.classList.add("hidden");
});

btListar.addEventListener("click", () => {
    listarContatos();
});

filtroPesquisa.addEventListener("change", () => {
    listarContatos(filtroPesquisa.value, campoPesquisar.value);
});

campoPesquisar.addEventListener("keyup", () => {
    listarContatos(filtroPesquisa.value, campoPesquisar.value);
});
