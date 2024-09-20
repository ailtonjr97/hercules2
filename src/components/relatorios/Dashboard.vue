<template>
  <div class="app-container">
    <!-- Barra lateral esquerda -->
    <div class="sidebar sidebar-left">
      <ul class="sidebar-menu">
        <li>
          <a href="#">
            <i class="icon home-icon"></i>
            <span>Home</span>
            <p>This Is A Sub Title</p>
          </a>
        </li>
        <!-- Outros itens... -->
      </ul>
    </div>

    <!-- Conteúdo principal -->
    <div class="main-content">
      <popup v-if="popup"></popup>
      <div class="row" style="width: 99.8%; height: 50vh;">
        <div class="col d-flex justify-content-center align-items-center">
          <img style="width: 80%;" src="/images/LOGO-FIBRACEM-5.webp" alt="Logo-Fibra">
        </div>
        <div class="col d-flex justify-content-center align-items-center">
          <img style="width: 80%;" src="/images/totvs_logo.jpg" alt="Logo-TOTVS">
        </div>
      </div>
      <div class="row justify-content-center" style="width: 99.8%; margin-top: 20px;">
        <div class="col-12 text-center">
          <h2>Bem-vindo ao sistema ruim do integrador entre a Fibracem e o TOTVS.</h2>
          <button class="button-8 mt-2" @click="copyToClipboard()">Clique aqui para copiar seu Token de acesso.</button>
        </div>
      </div>
    </div>

    <!-- Barra lateral direita -->
    <div class="sidebar sidebar-right">
      <ul class="sidebar-menu">
        <li>
          <a href="#">
            <i class="icon home-icon"></i>
            <span>Right Menu</span>
            <p>This Is A Right Menu Sub Title</p>
          </a>
        </li>
        <!-- Outros itens para a barra direita -->
      </ul>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: space-between;
}

/* Barra lateral esquerda */
.sidebar-left {
  position: fixed;
  left: 0;
}

/* Barra lateral direita */
.sidebar-right {
  position: fixed;
  right: 0;
}

/* Estilo aprimorado para ambas as barras laterais */
.sidebar {
  width: 250px;
  background-color: #f4f4f4; /* Cor de fundo suave */
  height: 100vh;
  padding: 20px;
  overflow-y: auto;
  border-radius: 10px; /* Bordas arredondadas */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombras para um efeito moderno */
  border: none; /* Remover borda */
  transition: background-color 0.3s ease; /* Transição suave ao passar o mouse */
}

.sidebar:hover {
  background-color: #eaeaea; /* Mudar cor ao passar o mouse */
}

.main-content {
  margin-left: 250px;
  margin-right: 250px; /* Ajustar para o espaço da barra direita */
  padding: 20px;
  width: calc(100% - 500px); /* 250px para cada barra */
  height: 100vh;
  overflow-y: auto;
}

/* Estilo para o menu */
.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 20px;
}

.sidebar-menu a {
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px; /* Bordas arredondadas nos links */
  transition: background-color 0.3s ease; /* Transição suave */
}

.sidebar-menu a:hover {
  background-color: #ddd; /* Efeito de hover nos links */
}

.sidebar-menu a i {
  font-size: 24px;
  margin-right: 15px;
}

.sidebar-menu a span {
  font-weight: bold;
}

.sidebar-menu a p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

/* Estilos adicionais para ícones */
.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
}

.home-icon {
  background-image: url('/path/to/home-icon.png');
}

/* Definir outros ícones... */
</style>