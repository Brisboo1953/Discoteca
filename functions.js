let discos = [];
let carrito = [];

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

  iniciarLogin();
});

function mostrarDiscos(lista) {
  let contenedor = document.getElementById("discos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    let d = lista[i];

    let card = document.createElement("div");
    card.className = "card";

    let img = document.createElement("img");
    img.src = d.imagen;
    img.width = 200;

    let nombre = document.createElement("h2");
    nombre.innerText = d.nombre;

    let fecha = document.createElement("p");
    fecha.innerText = "Lanzamiento: " + d.fecha;

    let desc = document.createElement("p");
    desc.innerText = d.descripcion;

    let precio = document.createElement("p");
    precio.className = "precio";
    precio.innerText = "$" + d.precio;

    let btn = document.createElement("button");
    btn.innerText = "Agregar 🛒";
    btn.onclick = function () {
      agregarCarrito(d.nombre, d.precio);
    };

    let fav = document.createElement("span");
    fav.style.fontSize = "24px";
    fav.style.cursor = "pointer";
    fav.innerText = esFavorito(d.nombre) ? "❤️" : "🤍";

    fav.onclick = function () {
      toggleFavorito(d);
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

function ordenarMenorMayor() {
  discos.sort(function (a, b) {
    return a.precio - b.precio;
  });
  mostrarDiscos(discos);
}

function ordenarMayorMenor() {
  discos.sort(function (a, b) {
    return b.precio - a.precio;
  });
  mostrarDiscos(discos);
}

function agregarCarrito(nombre, precio) {
  carrito.push({ nombre: nombre, precio: precio });
  mostrarCarrito();
}

function mostrarCarrito() {
  let lista = document.getElementById("lista-carrito");
  let total = document.getElementById("total");
  if (!lista || !total) return;

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
  let favs = JSON.parse(localStorage.getItem("favoritos"));
  if (!favs) favs = [];

  let pos = -1;
  for (let i = 0; i < favs.length; i++) {
    if (favs[i].nombre === disco.nombre) {
      pos = i;
    }
  }

  if (pos >= 0) {
    favs.splice(pos, 1);
  } else {
    favs.push(disco);
  }

  localStorage.setItem("favoritos", JSON.stringify(favs));
}

function esFavorito(nombre) {
  let favs = JSON.parse(localStorage.getItem("favoritos"));
  if (!favs) return false;

  for (let i = 0; i < favs.length; i++) {
    if (favs[i].nombre === nombre) return true;
  }
  return false;
}

function mostrarFavoritos() {
  let cont = document.getElementById("favoritos");
  if (!cont) return;

  let favs = JSON.parse(localStorage.getItem("favoritos")) || [];
  cont.innerHTML = "";

  favs = favs.filter(d =>
    d &&
    d.nombre &&
    d.imagen &&
    d.precio !== undefined
  );

  localStorage.setItem("favoritos", JSON.stringify(favs));

  if (favs.length === 0) {
    cont.innerHTML = "<p>No hay favoritos </p>";
    return;
  }

  for (let i = 0; i < favs.length; i++) {
    let d = favs[i];

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${d.imagen}" width="200">
      <h2>${d.nombre}</h2>
      ${d.fecha ? `<p>Lanzamiento: ${d.fecha}</p>` : ""}
      <p class="precio">$${d.precio}</p>
    `;

    cont.appendChild(card);
  }
}

function iniciarLogin() {
  let user = document.getElementById("usuario");
  let pass = document.getElementById("password");
  let btnLogin = document.getElementById("btnLogin");
  let btnLogout = document.getElementById("btnLogout");
  let msg = document.getElementById("mensajeLogin");

  if (!btnLogin || !btnLogout || !msg) return;

  function actualizar() {
    if (localStorage.getItem("sesion")) {
      msg.innerText = "Sesión iniciada ✔️";
      btnLogin.style.display = "none";
      btnLogout.style.display = "inline-block";
    } else {
      msg.innerText = "No has iniciado sesión";
      btnLogin.style.display = "inline-block";
      btnLogout.style.display = "none";
    }
  }

  btnLogin.onclick = function () {
    if (user.value === "" || pass.value === "") {
      msg.innerText = "Completa los campos";
      return;
    }
    localStorage.setItem("sesion", user.value);
    actualizar();
  };

  btnLogout.onclick = function () {
    localStorage.removeItem("sesion");
    actualizar();
  };

  actualizar();
}
