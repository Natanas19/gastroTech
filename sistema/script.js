/* ============================================================
     ===================== JAVASCRIPT ============================
     ============================================================ */


/* ---------------- Variáveis globais ---------------- */

const horarios = ["10h às 11h","11h às 12h","12h às 13h","13h às 14h","14h às 15h"];

let mesasPorHorario = {};
let reservas = [];

let mesaEscolhida = null;
let horarioEscolhido = null;
let reservaAtual = null;

let selectedMesaEdit = null;

/* ---------------- Carregar do LocalStorage ---------------- */
function carregarDados() {
    mesasPorHorario = JSON.parse(localStorage.getItem("mesasPorHorario")) || {};
    reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    horarios.forEach(h => {
        if (!mesasPorHorario[h]) mesasPorHorario[h] = Array(12).fill(false);
    });
}
carregarDados();

function salvarDados() {
    localStorage.setItem("mesasPorHorario", JSON.stringify(mesasPorHorario));
    localStorage.setItem("reservas", JSON.stringify(reservas));
}

/* ---------------- Navegação SPA ---------------- */
function irPara(tela) {
    document.querySelectorAll('.container').forEach(t => t.style.display = "none");
    document.getElementById(tela).style.display = "flex";

    if (tela === "mapa") {
        document.getElementById("btnReservar").style.display = "none";
        mostrarMesas();
    }

    if (tela === "dadosReserva") {
        document.getElementById("btnEditar").style.display = reservaAtual ? "inline-block" : "none";
        document.getElementById("btnCancelar").style.display = reservaAtual ? "inline-block" : "none";
    }
}

/* ---------------- Mostrar Mesas ---------------- */
function mostrarMesas() {
    const horario = document.getElementById("horario").value;
    const div = document.getElementById("mapaMesas");
    div.innerHTML = "";
    horarioEscolhido = horario;

    const pos = [
        {x: 13, y: 12.3},{x: 26.2, y: 12.3},{x: 39.4, y: 12.3},
        {x: 64.5, y: 12.3},{x: 77.7, y: 12.3},{x: 90, y: 12.3},

        {x: 13, y: 52.5},{x: 26.2, y: 52.5},{x: 39.4, y: 52.5},
        {x: 63.6, y: 52.5},{x: 76.8, y: 52.5},{x: 90, y: 52.5},
    ];

    mesasPorHorario[horario].forEach((ocupada, i) => {
        const mesa = document.createElement("div");
        mesa.className = "mesa " + (ocupada ? "ocupada" : "disponivel");
        mesa.innerText = i + 1;
        mesa.style.left = pos[i].x + "%";
        mesa.style.top = pos[i].y + "%";

        if (!ocupada) mesa.onclick = () => selecionarMesa(i);

        div.appendChild(mesa);
    });
}

/* ---------------- Selecionar Mesa ---------------- */
function selecionarMesa(i) {
    mesaEscolhida = i;

    document.querySelectorAll("#mapaMesas .mesa").forEach(m => {
        m.style.border = "2px solid rgba(255,255,255,0.3)";
    });

    const mesas = document.querySelectorAll("#mapaMesas .mesa");
    mesas[i].style.border = "3px solid #d4af37";

    document.getElementById("btnReservar").style.display = "inline-block";
}

/* ---------------- Finalizar Reserva ---------------- */
function finalizarReserva() {
    const nome = document.getElementById("nome").value.trim();
    const emailRaw = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!nome || !emailRaw || !senha) return alert("Preencha todos os campos!");

    const email = emailRaw.toLowerCase();

    if (reservas.some(r => r.email === email))
        return alert("Já existe uma reserva com este email!");

    const codigo = "GT-" + Math.floor(100000 + Math.random()*900000);

    mesasPorHorario[horarioEscolhido][mesaEscolhida] = true;

    reservas.push({
        nome,
        email,
        emailRaw,
        senha,
        mesa: mesaEscolhida + 1,
        horario: horarioEscolhido,
        codigo
    });

    salvarDados();

    document.getElementById("msgAgradecimento").innerHTML =
        `Obrigado, <b>${nome}</b>!<br>
         Mesa: <b>${mesaEscolhida+1}</b><br>
         Horário: <b>${horarioEscolhido}</b><br>
         Código: <b>${codigo}</b>`;

             // Gerar QR Code com o código da reserva
        const canvas = document.getElementById("qrCode");
        canvas.innerHTML = "";

        QRCode.toCanvas(canvas, codigo, {
         width: 180,
        color: {
        dark: "#d4af37",
        light: "#000000"
    }
});

    irPara("agradecimento");

}

/* ---------------- Consulta de Reserva ---------------- */
function consultarReserva() {
    const email = document.getElementById("emailLogin").value.trim().toLowerCase();
    const senha = document.getElementById("senhaLogin").value.trim();

    const r = reservas.find(x => x.email === email && x.senha === senha);

    if (!r) return alert("Reserva não encontrada!");

    reservaAtual = r;

    document.getElementById("infoReserva").innerHTML =
        `Nome: <b>${r.nome}</b><br>
         Email: <b>${r.emailRaw}</b><br>
         Mesa: <b>${r.mesa}</b><br>
         Horário: <b>${r.horario}</b><br>
         Código: <b>${r.codigo}</b>`;

         // Gerar QR Code na consulta
const canvas = document.getElementById("qrConsulta");
canvas.innerHTML = "";

QRCode.toCanvas(canvas, r.codigo, {
    width: 180,
    color: {
        dark: "#d4af37",
        light: "#000000"
    }
});


    irPara("dadosReserva");
}

/* ---------------- ADMIN LOGIN ---------------- */
function loginAdmin() {
    const u = document.getElementById("admUser").value.trim();
    const p = document.getElementById("admPass").value.trim();

    if (u === "adm" && p === "0000") {
        irPara("adminPainel");
    } else {
        alert("Credenciais inválidas!");
    }
}

/* ---------------- LISTAR RESERVAS DO ADMIN ---------------- */
function listarReservasHorario() {
    const horario = document.getElementById("adminHorarios").value;
    const div = document.getElementById("listaAdmin");

    const lista = reservas.filter(r => r.horario === horario);

    if (lista.length === 0) {
        div.innerHTML = "<br><b>Nenhuma reserva neste horário.</b>";
        return;
    }

    let html = "<br>";

    lista.forEach(r => {
        html += `• <b>${r.nome}</b> — Mesa <b>${r.mesa}</b> — Código: <b>${r.codigo}</b>
         <button style="padding:5px 10px; background:#a80000; color:white; font-size:14px;"
                 onclick="excluirUsuario('${r.email}')">Excluir Usuário</button><br><br>`;
    });

    div.innerHTML = html;
}

/* ---------------- Abrir edição ---------------- */
function abrirEdicao() {
    document.getElementById("editNome").value = reservaAtual.nome;
    document.getElementById("editHorario").value = reservaAtual.horario;

    selectedMesaEdit = reservaAtual.mesa - 1;

    mostrarMesasEdicao();
    irPara("editarReserva");
}

/* ---------------- Mostrar mesas na edição ---------------- */
function mostrarMesasEdicao() {
    const horario = document.getElementById("editHorario").value;
    const div = document.getElementById("mapaMesasEdicao");
    div.innerHTML = "";

    const pos = [
        {x: 13, y: 12.3},{x: 26.2, y: 12.3},{x: 39.4, y: 12.3},
        {x: 64.5, y: 12.3},{x: 77.7, y: 12.3},{x: 90, y: 12.3},
        {x: 13, y: 52.5},{x: 26.2, y: 52.5},{x: 39.4, y: 52.5},
        {x: 63.6, y: 52.5},{x: 76.8, y: 52.5},{x: 90, y: 52.5},
    ];

    mesasPorHorario[horario].forEach((ocupada, i) => {
        const own = (reservaAtual.horario === horario && reservaAtual.mesa - 1 === i);
        const bloqueada = ocupada && !own;

        const mesa = document.createElement("div");
        mesa.className = "mesa " + (bloqueada ? "ocupada" : "disponivel");
        mesa.innerText = i + 1;

        mesa.style.left = pos[i].x + "%";
        mesa.style.top = pos[i].y + "%";

        if (!bloqueada) {
            mesa.onclick = () => {
                document.querySelectorAll("#mapaMesasEdicao .mesa")
                    .forEach(m => m.style.border = "2px solid rgba(255,255,255,0.3)");
                mesa.style.border = "3px solid #d4af37";
                selectedMesaEdit = i;
            };
        }

        if (selectedMesaEdit === i && !bloqueada) {
            mesa.style.border = "3px solid #d4af37";
        }

        div.appendChild(mesa);
    });
}

/* ---------------- Salvar edição ---------------- */
function salvarEdicao() {
    const novoNome = document.getElementById("editNome").value.trim();
    const novoHorario = document.getElementById("editHorario").value;

    const antigoHorario = reservaAtual.horario;
    const antigaMesa = reservaAtual.mesa - 1;

    mesasPorHorario[antigoHorario][antigaMesa] = false;
    mesasPorHorario[novoHorario][selectedMesaEdit] = true;

    reservaAtual.nome = novoNome;
    reservaAtual.horario = novoHorario;
    reservaAtual.mesa = selectedMesaEdit + 1;

    salvarDados();

    alert("Reserva alterada com sucesso!");
    irPara("inicio");
}

/* ---------------- Cancelar reserva ---------------- */
function cancelarReserva() {
    const h = reservaAtual.horario;
    const m = reservaAtual.mesa - 1;

    mesasPorHorario[h][m] = false;
    reservas = reservas.filter(r => r.codigo !== reservaAtual.codigo);

    salvarDados();

    alert("Reserva cancelada!");
    irPara("inicio");
}

function excluirUsuario(email) {
    if (!confirm("Tem certeza que deseja excluir este usuário e sua reserva?")) return;

    const r = reservas.find(x => x.email === email);
    if (!r) return;

    // liberar mesa
    mesasPorHorario[r.horario][r.mesa - 1] = false;

    // remover do vetor de reservas
    reservas = reservas.filter(x => x.email !== email);

    salvarDados();

    alert("Usuário removido com sucesso!");

    // recarregar lista
    listarReservasHorario();
}

function limparSistema() {
    if (!confirm("⚠ ATENÇÃO!\n\nIsso irá excluir TODOS os usuários, reservas e liberar todas as mesas.\n\nDeseja continuar?"))
        return;

    // limpa vetores
    reservas = [];

    horarios.forEach(h => {
        mesasPorHorario[h] = Array(12).fill(false);
    });

    salvarDados();

    alert("Sistema limpo com sucesso!");

    // limpa lista do admin caso ele esteja vendo
    document.getElementById("listaAdmin").innerHTML = "";
}


/* Iniciar */
irPara("inicio");
