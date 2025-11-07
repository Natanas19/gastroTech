function consultarReserva() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha o e-mail e a senha para continuar.");
    return;
  }

  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reserva = reservas.find(r => r.email === email && r.senha === senha);

  if (!reserva) {
    alert("Reserva não encontrada. Verifique seus dados.");
    return;
  }

  document.body.innerHTML = `
    <div class="agradecimento">
      <h1>Reserva Localizada!</h1>
      <p>Nome: <strong>${reserva.nome}</strong></p>
      <p>Mesa(s): <strong>${reserva.mesas.join(', ')}</strong></p>
      <p>Código da reserva: <strong>${reserva.codigo}</strong></p>
      <button onclick="window.location.href='inicial.html'">Voltar ao Início</button>
    </div>
  `;
}