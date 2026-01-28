function iniciarSesion(usuario, password) {
    localStorage.setItem("usuariosesion", usuario);
  }
  
  function haySesion() {
    return localStorage.getItem("usuariosesion") !== null;
  }
  
  function cerrarSesion() {
    localStorage.removeItem("usuariosesion");
  }
  
  const inputUsuario = document.getElementById("usuario");
  const inputPassword = document.getElementById("password");
  const btnLogin = document.getElementById("btnLogin");
  const btnLogout = document.getElementById("btnLogout");
  const mensajeLogin = document.getElementById("mensajeLogin");
  
  if (btnLogin) {
    btnLogin.addEventListener("click", function () {
      if (inputUsuario.value === "" || inputPassword.value === "") {
        mensajeLogin.textContent = "Completa usuario y contraseña";
        return;
      }
  
      iniciarSesion(inputUsuario.value, inputPassword.value);
      mensajeLogin.textContent = "Sesión iniciada";
      mostrarEstadoSesion();
    });
  }
  
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      cerrarSesion();
      mensajeLogin.textContent = "Sesión cerrada";
      mostrarEstadoSesion();
    });
  }
  
  function mostrarEstadoSesion() {
    if (!inputUsuario || !btnLogin || !btnLogout) return;
  
    if (haySesion()) {
      inputUsuario.style.display = "none";
      inputPassword.style.display = "none";
      btnLogin.style.display = "none";
      btnLogout.style.display = "inline";
    } else {
      inputUsuario.style.display = "inline";
      inputPassword.style.display = "inline";
      btnLogin.style.display = "inline";
      btnLogout.style.display = "none";
    }
  }
  
  mostrarEstadoSesion();
  
  let carrito = [];
  
  const iconoCarrito = document.getElementById("icono-carrito");
  const carritoDiv = document.getElementById("carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  
  if (iconoCarrito) {
    iconoCarrito.onclick = function () {
      carritoDiv.classList.toggle("mostrar");
    };
  }
  
  function actualizarCarrito() {
    if (!listaCarrito) return;
  
    listaCarrito.innerHTML = "";
    let suma = 0;
  
    for (let i = 0; i < carrito.length; i++) {
      const li = document.createElement("li");
      li.textContent = carrito[i].nombre + " - $" + carrito[i].precio;
      listaCarrito.appendChild(li);
      suma += carrito[i].precio;
    }
  
    total.textContent = "Total: $" + suma;
  }
  
  function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
  }
  
  const contenedorDiscos = document.getElementById("discos");
  
  if (contenedorDiscos) {
    fetch("discos.json")
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (discos) {
        for (let i = 0; i < discos.length; i++) {
          const disco = discos[i];
  
          const card = document.createElement("article");
          card.className = "card";
  
          card.innerHTML =
            '<img src="' + disco.imagen + '" width="200" height="250">' +
            "<h2>" + disco.nombre + "</h2>" +
            '<p class="precio">Precio: $' + disco.precio + "</p>" +
            "<p>Fecha de lanzamiento: " + disco.fecha + "</p>" +
            "<p>" + disco.descripcion + "</p>" +
            '<button class="btn">Comprar</button>';
  
          const boton = card.querySelector(".btn");
          boton.onclick = function () {
            carrito.push({
              nombre: disco.nombre,
              precio: disco.precio
            });
            actualizarCarrito();
          };
  
          contenedorDiscos.appendChild(card);
        }
      });
  }
  