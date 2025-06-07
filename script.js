let murales = [];
let muralActual = 0;

// Estructura vacía de un mural
function crearMuralVacio() {
  return {
    imagenes: Array(6).fill().map(() => ({ src: '', texto: '' }))
  };
}

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem('muralesSanrio', JSON.stringify(murales));
  localStorage.setItem('indiceActual', muralActual);
}

// Cargar desde localStorage
function cargarDatos() {
  const dataGuardada = localStorage.getItem('muralesSanrio');
  const indiceGuardado = localStorage.getItem('indiceActual');

  if (dataGuardada) {
    murales = JSON.parse(dataGuardada);
    muralActual = parseInt(indiceGuardado) || 0;
  } else {
    murales = [crearMuralVacio()];
    muralActual = 0;
  }

  mostrarMural();
}

function mostrarMural() {
  const contenedor = document.getElementById('mural-container');
  contenedor.innerHTML = '';

  const mural = murales[muralActual];

  mural.imagenes.forEach((imgObj, i) => {
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'imagen-contenedor';
    contenedorImagen.style.position = 'relative';

    // Imagen
    const imagen = document.createElement('img');
    imagen.src = imgObj.src || 'https://via.placeholder.com/150x150.png?text=+';
    imagen.className = 'imagen-mural';
    imagen.onclick = () => subirImagen(i);

    // Texto
    const texto = document.createElement('input');
    texto.type = 'text';
    texto.value = imgObj.texto;
    texto.placeholder = 'Escribe algo lindo...';
    texto.className = 'texto-imagen';
    texto.oninput = () => {
      mural.imagenes[i].texto = texto.value;
      guardarDatos();
    };

    // Botón de eliminar ❌
    const eliminarBtn = document.createElement('button');
    eliminarBtn.innerHTML = '❌';
    eliminarBtn.className = 'boton-eliminar';
    eliminarBtn.onclick = (e) => {
      e.stopPropagation(); // Evita que se dispare el evento de subir imagen
      mural.imagenes[i] = { src: '', texto: '' };
      mostrarMural();
    };

    contenedorImagen.appendChild(eliminarBtn);
    contenedorImagen.appendChild(imagen);
    contenedorImagen.appendChild(texto);
    contenedor.appendChild(contenedorImagen);
  });

  guardarDatos();
}

// Subir imagen
function subirImagen(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = e => {
    const archivo = e.target.files[0];
    const lector = new FileReader();

    lector.onload = () => {
      murales[muralActual].imagenes[index].src = lector.result;
      mostrarMural();
    };

    if (archivo) {
      lector.readAsDataURL(archivo);
    }
  };

  input.click();
}

// Crear nuevo mural
document.getElementById('btnNuevo').onclick = () => {
  murales.push(crearMuralVacio());
  muralActual = murales.length - 1;
  mostrarMural();
};

// Eliminar mural
document.getElementById('btnEliminar').onclick = () => {
  if (murales.length > 1) {
    murales.splice(muralActual, 1);
    muralActual = Math.max(0, muralActual - 1);
    mostrarMural();
  } else {
    alert("Debe haber al menos un mural.");
  }
};

// Navegar
document.getElementById('btnAnterior').onclick = () => {
  if (muralActual > 0) {
    muralActual--;
    mostrarMural();
  }
};

document.getElementById('btnSiguiente').onclick = () => {
  if (muralActual < murales.length - 1) {
    muralActual++;
    mostrarMural();
  }
};


function generarConfetti() {
  const colores = ['#f8b1d5', '#ffedf7', '#ffe0f0', '#ffd6f5', '#fbc4e4'];
  const container = document.querySelector('.confetti-container');

  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
    confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
    confetti.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(confetti);
  }
}

// Inicialización
window.onload = () => {
  cargarDatos();
  generarConfetti();
};
