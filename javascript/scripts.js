// Controle da comanda

let numeroComanda = 1;
let total = 0;
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Ajustei as chaves para baterem EXATAMENTE com os valores do seu HTML
const cardapio = {
    "Refeição R$7,00": 7,
    "Refeição R$10,00": 10,
    "Coca-Cola 1L": 8,
    "Coca-Cola 350ml": 4, // Removido o R$ do nome para facilitar busca
    "Suco": 4,
    "H2O": 5,
    "Água Mineral": 3,
    "iCarne": 0, // Batendo com o value="iCarne" do seu HTML
    "Frango": 0,
    "Calabresa": 0,
    "Fígado": 0,
    "Arroz": 0,
    "Feijão": 0,
    "Macarrão": 0,
    "Salada": 0
};

function toggleMenu() {
    const menu = document.getElementById('menu-links');
    menu.classList.toggle('aberto');
    console.log("Menu clicado! Classe 'aberto' está presente?", menu.classList.contains('aberto'));
}

function adicionarItem() {
    const nomeInput = document.getElementById("nome");
    const mesaSelect = document.getElementById("mesa");
    const clienteSpan = document.getElementById("cliente-comanda");
    const mesaSpan = document.getElementById("mesa-comanda");

    // Validação básica
    if (nomeInput.value.trim() === "") {
        alert("Por favor, digite o nome do cliente.");
        return;
    }

    // Define cliente e mesa apenas na primeira vez
    if (clienteSpan.textContent === "-") {
        clienteSpan.textContent = nomeInput.value;
        mesaSpan.textContent = mesaSelect.value == "0"
            ? "Retirada"
            : "Mesa " + mesaSelect.value;

        nomeInput.disabled = true;
        mesaSelect.disabled = true;
    }

    const itemInput = document.getElementById("item");
    const lista = document.getElementById("lista-comanda");
    const totalSpan = document.getElementById("total");

    let valorItemAtual = 0;
    let descricao = "";

    // Refeição principal
    if (cardapio[itemInput.value] !== undefined) {
        valorItemAtual += cardapio[itemInput.value];
        descricao += itemInput.value;
    }

    // Checkboxes (opções, acompanhamentos e bebidas)
    const selecionados = document.querySelectorAll('input[name="opcao"]:checked');

    selecionados.forEach(opcao => {
        descricao += (descricao ? " + " : "") + opcao.value;
        if (cardapio[opcao.value] !== undefined) {
            valorItemAtual += cardapio[opcao.value];
        }
    });

    if (descricao === "") {
        alert("Selecione pelo menos um item!");
        return;
    }

    // Atualiza o total global
    total += valorItemAtual;

    // Cria o elemento da lista com botão de remover
    const li = document.createElement("li");
    li.style.marginBottom = "8px";
    li.innerHTML = `
        <span>${descricao} = <strong>R$ ${valorItemAtual.toFixed(2)}</strong></span>
        <button type="button" onclick="removerItemIndividual(this, ${valorItemAtual})" 
                style="padding: 2px 8px; background: #BC4749; margin-left: 10px; font-size: 12px;">X</button>
    `;

    lista.appendChild(li);
    totalSpan.textContent = total.toFixed(2);

    // Limpa campos para o próximo item
    itemInput.value = "";
    selecionados.forEach(op => op.checked = false);
}

// Nova função para remover apenas um item da lista
function removerItemIndividual(botao, valorItem) {
    const li = botao.parentElement;
    li.remove();
    total -= valorItem;
    if (total < 0) total = 0; // Prevenção de erro
    document.getElementById("total").textContent = total.toFixed(2);
}

function gerarNumeroComanda() {
    const numeroComandaSpan = document.getElementById("numero-comanda");
    numeroComandaSpan.textContent = "#" + numeroComanda.toString().padStart(4, "0");
}

function selecionarAcompanhamentos() {
    const acompanhamentos = document.querySelectorAll('#caixa-acompanhamentos input[type="checkbox"]');
    const todosMarcados = [...acompanhamentos].every(item => item.checked);
    acompanhamentos.forEach(acomp => acomp.checked = !todosMarcados);
}

function selecionarcarnes() {
    const carnes = document.querySelectorAll('#caixa-carnes input[type="checkbox"]');
    const todosMarcados = [...carnes].every(item => item.checked);
    carnes.forEach(carne => carne.checked = !todosMarcados);
}

function fecharPedido() {
    if (total === 0) {
        alert("Nenhum item na comanda!");
        return;
    }

    const cliente = document.getElementById("cliente-comanda").textContent;
    const mesa = document.getElementById("mesa-comanda").textContent;
    const listaHTML = document.getElementById("lista-comanda").innerHTML;

    const pedido = {
        numero: "#" + numeroComanda.toString().padStart(4, "0"),
        cliente: cliente,
        mesa: mesa,
        itens: listaHTML, // Salva o HTML para exibir igual no relatório
        total: total.toFixed(2),
        data: new Date().toLocaleString()
    };

    let pedidosExistentes = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosExistentes.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosExistentes));

    alert("Pedido " + pedido.numero + " finalizado!");

    // Reseta para o próximo
    numeroComanda++;
    limparSistema();
}

function limparSistema() {
    total = 0;
    document.getElementById("total").textContent = "0.00";
    document.getElementById("lista-comanda").innerHTML = "";
    document.getElementById("nome").disabled = false;
    document.getElementById("mesa").disabled = false;
    document.getElementById("nome").value = "";
    document.getElementById("cliente-comanda").textContent = "-";}

 