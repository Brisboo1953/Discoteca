let discos = [];
let carrito = [];

function usuarioActual() {
  return localStorage.getItem("usuario");
}

document.addEventListener("DOMContentLoaded", function () {

  fetch("discos.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      discos = data;

      if (document.getElementById("discos")) {
        mostrarDiscos(discos);
      }

      if (document.getElementById("favoritos")) {
        mostrarFavoritos();
      }
    });

  let icono = document.getElementById("icono-carrito");
  if (icono) {
    icono.onclick = function () {
      document.getElementById("carrito").classList.toggle("mostrar");
    };
  }

  let btnLogin = document.getElementById("btnLogin");
  let btnLogout = document.getElementById("btnLogout");
  let mensaje = document.getElementById("mensajeLogin");

  if (btnLogin) {
    btnLogin.onclick = function () {
      let user = document.getElementById("usuario").value;
      let pass = document.getElementById("password").value;

      if (user === "" || pass === "") {
        mensaje.innerText = "Completa todos los campos";
        return;
      }

      localStorage.setItem("usuario", user);
      mensaje.innerText = "Sesión iniciada ✔️";
      btnLogin.style.display = "none";
      btnLogout.style.display = "block";
    };
  }

  if (btnLogout) {
    btnLogout.onclick = function () {
      localStorage.removeItem("usuario");
      mensaje.innerText = "Sesión cerrada";
      btnLogin.style.display = "block";
      btnLogout.style.display = "none";
    };
  }
});

function mostrarDiscos(lista) {
  let contenedor = document.getElementById("discos");
  contenedor.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    let disco = lista[i];

    let card = document.createElement("div");
    card.className = "card";

    let img = document.createElement("img");
    img.src = disco.imagen;
    img.width = 200;

    let nombre = document.createElement("h2");
    nombre.innerText = disco.nombre;

    let fecha = document.createElement("p");
    fecha.innerText = "Lanzamiento: " + disco.fecha;

    let desc = document.createElement("p");
    desc.innerText = disco.descripcion;

    let precio = document.createElement("p");
    precio.className = "precio";
    precio.innerText = "$" + disco.precio;

    let btn = document.createElement("button");
    btn.innerText = "Agregar 🛒";
    btn.onclick = function () {
      agregarCarrito(disco.nombre, disco.precio);
    };

    let fav = document.createElement("span");
    fav.style.fontSize = "24px";
    fav.style.cursor = "pointer";
    fav.innerText = esFavorito(disco.nombre) ? "💜" : "🤍";

    fav.onclick = function () {
      toggleFavorito(disco);
      mostrarDiscos(discos);
    };

    card.appendChild(img);
    card.appendChild(nombre);
    card.appendChild(fecha);
    card.appendChild(desc);
    card.appendChild(precio);
    card.appendChild(btn);
    card.appendChild(fav);

    contenedor.appendChild(card);
  }
}

function agregarCarrito(nombre, precio) {
  carrito.push({ nombre: nombre, precio: precio });
  mostrarCarrito();
}

function mostrarCarrito() {
  let lista = document.getElementById("lista-carrito");
  let total = document.getElementById("total");

  lista.innerHTML = "";
  let suma = 0;

  for (let i = 0; i < carrito.length; i++) {
    let li = document.createElement("li");
    li.innerText = carrito[i].nombre + " - $" + carrito[i].precio;
    lista.appendChild(li);
    suma += carrito[i].precio;
  }

  total.innerText = "Total: $" + suma;
}

function vaciarCarrito() {
  carrito = [];
  mostrarCarrito();
}

function toggleFavorito(disco) {
  let user = usuarioActual();
  if (!user) {
    alert("Inicia sesión primero");
    return;
  }

  let key = "favoritos_" + user;
  let favoritos = JSON.parse(localStorage.getItem(key));

  if (!favoritos) {
    favoritos = [];
  }

  let pos = -1;
  for (let i = 0; i < favoritos.length; i++) {
    if (favoritos[i].nombre === disco.nombre) {
      pos = i;
    }
  }

  if (pos >= 0) {
    favoritos.splice(pos, 1);
  } else {
    favoritos.push(disco);
  }

  localStorage.setItem(key, JSON.stringify(favoritos));
}

function esFavorito(nombre) {
  let user = usuarioActual();
  if (!user) return false;

  let favoritos = JSON.parse(
    localStorage.getItem("favoritos_" + user)
  );

  if (!favoritos) return false;

  for (let i = 0; i < favoritos.length; i++) {
    if (favoritos[i].nombre === nombre) {
      return true;
    }
  }
  return false;
}

function mostrarFavoritos() {
  let cont = document.getElementById("favoritos");
  if (!cont) return;

  let user = usuarioActual();
  if (!user) {
    cont.innerHTML = "<p>Inicia sesión para ver favoritos</p>";
    return;
  }

  let favs = JSON.parse(
    localStorage.getItem("favoritos_" + user)
  );

  cont.innerHTML = "";

  if (!favs || favs.length === 0) {
    cont.innerHTML = "<p>No hay favoritos</p>";
    return;
  }

  for (let i = 0; i < favs.length; i++) {
    let d = favs[i];

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${d.imagen}" width="200">
      <h2>${d.nombre}</h2>
      <p>Lanzamiento: ${d.fecha}</p>
      <p>${d.descripcion}</p>
      <p class="precio">$${d.precio}</p>
    `;

    cont.appendChild(card);
  }
}

function ordenarMenorMayor() {
  let copia = discos.slice(); 
  copia.sort(function (a, b) {
    return a.precio - b.precio;
  });
  mostrarDiscos(copia);
}

function ordenarMayorMenor() {
  let copia = discos.slice();
  copia.sort(function (a, b) {
    return b.precio - a.precio;
  });
  mostrarDiscos(copia);
}

