function cadastrar() {
  const nome = document.getElementById("nomeCompleto").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const mesas = JSON.parse(localStorage.getItem("mesasSelecionadas")) || [];

  if (!nome || !telefone || !email || !senha) {
    alert("Preencha todos os campos antes de continuar.");
    return;
  }

  // cria objeto reserva
  const reserva = {
    nome,
    telefone,
    email,
    senha,
    mesas,
    codigo: gerarCodigoUnico()
  };

  // obtém reservas anteriores e adiciona a nova
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  // limpa mesas temporárias
  localStorage.removeItem("mesasSelecionadas");

  // exibe mensagem de agradecimento
  mostrarAgradecimento(reserva);
}

function gerarCodigoUnico() {
  return 'GT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function mostrarAgradecimento(reserva) {
  document.body.innerHTML = `
    <div class="agradecimento">
      <h1>Reserva Confirmada!</h1>
      <p>Obrigado, <strong>${reserva.nome}</strong> 🎉</p>
      <p>Mesa reservada: <strong>${reserva.mesas.join(', ')}</strong></p>
      <p>Código da reserva: <strong>${reserva.codigo}</strong></p>
      <button onclick="window.location.href='inicial.html'">Voltar ao Início</button>
    </div>
  `;
}