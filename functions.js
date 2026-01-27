function iniciarSesion(usuario, password) {
    const datosUsuario = {
      usuario: usuario,
      password: password
    };
    localStorage.setItem("usuariosesion", JSON.stringify(datosUsuario));
  }
  
  function haySesion() {
    return localStorage.getItem("usuariosesion") !== null;
  }
  
  function obtenerUsuarioSesion() {
    const datos = JSON.parse(localStorage.getItem("usuariosesion"));
    return datos ? datos.usuario : null;
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
    btnLogin.addEventListener("click", () => {
      const usuario = inputUsuario.value.trim();
      const password = inputPassword.value.trim();
  
      if (usuario === "" || password === "") {
        mensajeLogin.textContent = "Completa usuario y contraseña";
        mensajeLogin.style.color = "red";
        return;
      }
  
      iniciarSesion(usuario, password);
      mensajeLogin.textContent = "Sesión iniciada correctamente";
      mensajeLogin.style.color = "green";
      mostrarEstadoSesion();
    });
  }
  
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      cerrarSesion();
      mensajeLogin.textContent = "Sesión cerrada";
      mensajeLogin.style.color = "black";
      mostrarEstadoSesion();
    });
  }
  
  function mostrarEstadoSesion() {
    if (!inputUsuario || !inputPassword || !btnLogin || !btnLogout) return;
  
    if (haySesion()) {
      inputUsuario.style.display = "none";
      inputPassword.style.display = "none";
      btnLogin.style.display = "none";
      btnLogout.style.display = "inline-block";
    } else {
      inputUsuario.style.display = "inline-block";
      inputPassword.style.display = "inline-block";
      btnLogin.style.display = "inline-block";
      btnLogout.style.display = "none";
    }
  }
  
  mostrarEstadoSesion();
  
  const iconoCarrito = document.getElementById("icono-carrito");
  const carrito = document.getElementById("carrito");
  const listaCarrito = document.getElementById("lista-carrito");
  const total = document.getElementById("total");
  
  let carritoProductos = [];
  
  if (iconoCarrito && carrito) {
    iconoCarrito.addEventListener("click", () => {
      carrito.classList.toggle("mostrar");
    });
  }
  
  const botonesComprar = document.querySelectorAll(".btn");
  
  botonesComprar.forEach(boton => {
    boton.addEventListener("click", () => {
      const nombre = boton.dataset.nombre;
      const precio = Number(boton.dataset.precio);
  
      carritoProductos.push({ nombre, precio });
      actualizarCarrito();
    });
  });
  
  function actualizarCarrito() {
    if (!listaCarrito || !total) return;
  
    listaCarrito.innerHTML = "";
    let suma = 0;
  
    carritoProductos.forEach(producto => {
      const li = document.createElement("li");
      li.textContent = `${producto.nombre} - $${producto.precio}`;
      listaCarrito.appendChild(li);
      suma += producto.precio;
    });
  
    total.textContent = `Total: $${suma}`;
  }
  
  function vaciarCarrito() {
    carritoProductos = [];
    actualizarCarrito();
  }
  