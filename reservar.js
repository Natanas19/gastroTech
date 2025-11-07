const mesas = document.querySelectorAll('.mesa');
const botaoCadastrar = document.getElementById('cadastrar');

// alterna entre disponível e ocupada
mesas.forEach(mesa => {
  mesa.addEventListener('click', () => {
    mesa.classList.toggle('ocupada');
    verificarMesasOcupadas();
  });
});

function verificarMesasOcupadas() {
  const algumaOcupada = Array.from(mesas).some(m => m.classList.contains('ocupada'));
  botaoCadastrar.style.display = algumaOcupada ? 'block' : 'none';
}

function cadastrarReserva() {
  const ocupadas = Array.from(mesas)
    .filter(m => m.classList.contains('ocupada'))
    .map(m => m.textContent);

  if (ocupadas.length === 0) {
    alert('Selecione ao menos uma mesa antes de continuar.');
    return;
  }

  // salva mesas selecionadas no localStorage
  localStorage.setItem('mesasSelecionadas', JSON.stringify(ocupadas));

  // vai para o cadastro
  window.location.href = "cadastro.html";
}