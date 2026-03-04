// Controle da comanda
    let numeroComanda = 1;
    let total = 0;
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const cardapio = {
        "Refeição R$7,00": 7,
        "Refeição R$10,00": 10,
        "Coca-Cola 1L": 8,
        "Coca-Cola 350ml": 4,
        "Suco de Laranja": 4,
        "H2O": 5,
        "Água Mineral": 3,
        "Carne": 0,
        "Frango": 0,
        "Calabresa": 0,
        "Arroz": 0,
        "Feijão": 0,
        "Macarrão": 0,
        "Salada": 0
    };

    function adicionarItem() {

        const nomeInput = document.getElementById("nome");
        const mesaSelect = document.getElementById("mesa");
        const clienteSpan = document.getElementById("cliente-comanda");
        const mesaSpan = document.getElementById("mesa-comanda");

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

        let valor = 0;
        let descricao = "";

        // Refeição principal
        if (cardapio[itemInput.value] !== undefined) {
            valor += cardapio[itemInput.value];
            descricao += itemInput.value;
        }

        // Checkboxes (opções e bebidas)
        const selecionados = document.querySelectorAll('input[name="opcao"]:checked');

        selecionados.forEach(opcao => {
            descricao += (descricao ? " + " : "") + opcao.value;

            if (cardapio[opcao.value] !== undefined) {
                valor += cardapio[opcao.value];
            }
        });

        if (valor === 0) {
            alert("Selecione um item válido!");
            return;
        }

        total += valor;

        const li = document.createElement("li");
        li.textContent = descricao + " = R$ " + valor.toFixed(2);

        lista.appendChild(li);
        totalSpan.textContent = total.toFixed(2);

        // Limpa campos
        itemInput.value = "";
        selecionados.forEach(op => op.checked = false);

        
    }

    function gerarNumeroComanda() {
        const numeroComandaSpan = document.getElementById("numero-comanda");
        numeroComandaSpan.textContent =
            "#" + numeroComanda.toString().padStart(4, "0");
    }

     function selecionarAcompanhamentos() {
        const acompanhamentos = document.querySelectorAll('.acomp , .carnes');

        const  todosMarcados = [...acompanhamentos].every(item =>item.checked);
        // Se todos já estão marcados, desmarca todos. Caso contrário, marca todos.
            if (todosMarcados) {
                acompanhamentos.forEach(acomp => {
                    acomp.checked = false;
                });
                return;
            }

        acompanhamentos.forEach(acomp => {
            acomp.checked = true;
        });
    }

    function selecionarcarnes() {
        const carnes = document.querySelectorAll('.item-carne input[type="checkbox"]');

        const  todosMarcados = [...carnes].every(item =>item.checked);
        // Se todos já estão marcados, desmarca todos. Caso contrário, marca todos.
            if (todosMarcados) {
                carnes.forEach(carne => {
                    carne.checked = false;
                });
                return;
            }

        carnes.forEach(carne => {
            carne.checked = true;
        });
    }

   function fecharPedido() {
    // 1. Verificação inicial: O total global é zero?
    if (total === 0) {
        alert("Nenhum item na comanda!");
        return;
    }

    // 2. Coleta os dados ANTES de limpar a tela
    const cliente = document.getElementById("cliente-comanda").textContent;
    const mesa = document.getElementById("mesa-comanda").textContent;
    const itensHTML = document.getElementById("lista-comanda").innerHTML;
    const valorFinal = total; // Salva o valor atual antes de zerar a variável global

    // 3. Cria o objeto do pedido
    const pedido = {
        numero: "#" + numeroComanda.toString().padStart(4, "0"),
        cliente: cliente,
        mesa: mesa,
        itens: itensHTML,
        total: valorFinal.toFixed(2),
        data: new Date().toLocaleString()
    };

    // 4. Salva no LocalStorage
    let pedidosExistentes = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidosExistentes.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidosExistentes));

    // 5. Feedback para o usuário
    alert("Pedido " + pedido.numero + " finalizado e salvo com sucesso!");

    // 6. Reseta o sistema para o próximo cliente
    numeroComanda++;
    total = 0; // Zera a variável global

    // Limpa a interface visual
    document.getElementById("total").textContent = "0.00";
    document.getElementById("lista-comanda").innerHTML = "";
    document.getElementById("nome").disabled = false;
    document.getElementById("mesa").disabled = false;
    document.getElementById("nome").value = "";
    document.getElementById("cliente-comanda").textContent = "-";
    document.getElementById("mesa-comanda").textContent = "-";

    // Atualiza o número visual da próxima comanda
    gerarNumeroComanda();
}
   
    // Gera número inicial ao carregar
    gerarNumeroComanda();

    function toggleMenu() {
    const menu = document.getElementById('menu-links');
    
    // O comando toggle coloca a classe se não existir, e tira se já existir
    menu.classList.toggle('aberto');
}
function limparBebidas() {
    const bebidas = document.querySelectorAll('#caixa-bebidas input[type="checkbox"]');
    bebidas.forEach(bebida => bebida.checked = false);
}

 