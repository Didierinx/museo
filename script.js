let murales = [];
let muralActual = 0;

function guardarDatos() {
  const datos = murales.map(mural => {
    const imagenes = Array.from(mural.querySelectorAll('.imagen-marco')).map(marco => ({
      src: marco.querySelector('img').src,
      texto: marco.querySelector('input').value
    }));
    return imagenes;
  });
  localStorage.setItem('muralesSanrio', JSON.stringify(datos));
}

function cargarDatos() {
  const datosGuardados = JSON.parse(localStorage.getItem('muralesSanrio')) || [];
  datosGuardados.forEach(muralData => {
    const mural = document.createElement('div');
    mural.classList.add('mural');
    muralData.forEach(({ src, texto }) => {
      const marco = document.createElement('div');
      marco.className = 'imagen-marco';

      const img = document.createElement('img');
      img.src = src;
      img.onclick = () => cambiarImagen(img);
      img.oncontextmenu = e => {
        e.preventDefault();
        eliminarImagen(img);
      };

      const input = document.createElement('input');
      input.type = 'text';
      input.value = texto;
      input.oninput = guardarDatos;

      marco.appendChild(img);
      marco.appendChild(input);
      mural.appendChild(marco);
    });
    document.getElementById('galeria-container').appendChild(mural);
    murales.push(mural);
  });

  if (murales.length > 0) {
    mostrarMural(0);
  } else {
    crearMural();
  }
}

function crearMural() {
  const mural = document.createElement('div');
  mural.classList.add('mural');
  murales.forEach(m => m.classList.remove('activo'));
  mural.classList.add('activo');

  for (let i = 0; i < 6; i++) {
    const marco = document.createElement('div');
    marco.className = 'imagen-marco';

    const img = document.createElement('img');
    img.src = 'https://via.placeholder.com/250x200?text=Imagen';
    img.onclick = () => cambiarImagen(img);
    img.oncontextmenu = e => {
      e.preventDefault();
      eliminarImagen(img);
    };

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Escribe un texto bonito...';
    input.oninput = guardarDatos;

    marco.appendChild(img);
    marco.appendChild(input);
    mural.appendChild(marco);
  }

  document.getElementById('galeria-container').appendChild(mural);
  murales.push(mural);
  mostrarMural(murales.length - 1);
  guardarDatos();
}

function cambiarImagen(imgElemento) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = () => {
    const archivo = input.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onload = function (e) {
        imgElemento.src = e.target.result;
        guardarDatos();
      };
      lector.readAsDataURL(archivo);
    }
  };
  input.click();
}

function eliminarImagen(imgElemento) {
  imgElemento.src = 'https://via.placeholder.com/250x200?text=Imagen';
  guardarDatos();
}

function mostrarMural(index) {
  murales.forEach((m, i) => m.classList.toggle('activo', i === index));
  muralActual = index;
}

function siguienteMural() {
  if (murales.length === 0) return;
  const siguiente = (muralActual + 1) % murales.length;
  mostrarMural(siguiente);
}

function anteriorMural() {
  if (murales.length === 0) return;
  const anterior = (muralActual - 1 + murales.length) % murales.length;
  mostrarMural(anterior);
}

function eliminarMural() {
  if (murales.length === 0) return;
  const mural = murales[muralActual];
  mural.remove();
  murales.splice(muralActual, 1);
  guardarDatos();
  if (murales.length > 0) {
    mostrarMural(muralActual % murales.length);
  } else {
    muralActual = 0;
    crearMural();
  }
}

window.onload = () => {
  cargarDatos();
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

window.onload = () => {
  cargarDatos();
  generarConfetti();
};
