let numeroParqueos = 10;
let horaApertura = '08:00';
let horaCierre = '20:00';
const placasOcupadas = {};

function configurarParqueadero() {
    horaApertura = document.getElementById('horaApertura').value;
    horaCierre = document.getElementById('horaCierre').value;
    numeroParqueos = parseInt(document.getElementById('numeroParqueos').value);

    document.getElementById('horarioApertura').textContent = horaApertura;
    document.getElementById('horarioCierre').textContent = horaCierre;
    document.getElementById('numeroParqueosInfo').textContent = numeroParqueos;

    const parqueaderoDiv = document.getElementById('parqueadero');
    parqueaderoDiv.innerHTML = '';

    for (let i = 1; i <= numeroParqueos; i++) {
        const espacio = document.createElement('div');
        espacio.className = 'espacio';
        espacio.dataset.espacio = i;
        espacio.textContent = `Espacio ${i}`;
        parqueaderoDiv.appendChild(espacio);
    }

    updatePlateList();
}

function ocuparEspacio() {
    const placa = document.getElementById('placaIngreso').value.toUpperCase();
    if (placa === "" || placasOcupadas[placa]) {
        alert("Ingrese una placa válida o que no esté ya ocupada.");
        return;
    }

    const espacio = document.querySelector('.espacio:not(.ocupado)');
    if (espacio) {
        espacio.classList.add('ocupado');
        espacio.textContent = placa;
        placasOcupadas[placa] = espacio.dataset.espacio;

        const carAnimation = document.createElement('div');
        carAnimation.className = 'car-animation';
        espacio.appendChild(carAnimation);

        setTimeout(() => {
            carAnimation.remove();
        }, 1000);

        updatePlateList();
    } else {
        alert("No hay espacios disponibles.");
    }
}

function salirEspacio() {
    const placa = document.getElementById('placaSalida').value.toUpperCase();
    if (!placasOcupadas[placa]) {
        alert("La placa no está en el parqueadero.");
        return;
    }

    const espacioNum = placasOcupadas[placa];
    const espacio = document.querySelector(`.espacio[data-espacio="${espacioNum}"]`);
    if (espacio) {
        espacio.classList.remove('ocupado');
        espacio.textContent = `Espacio ${espacioNum}`;
        delete placasOcupadas[placa];
        updatePlateList();
    }
}

function updatePlateList() {
    const listaPlacasContenido = document.getElementById('listaPlacasContenido');
    listaPlacasContenido.innerHTML = '';
    for (const placa in placasOcupadas) {
        const li = document.createElement('li');
        li.textContent = `Placa: ${placa}`;
        listaPlacasContenido.appendChild(li);
    }
}

function togglePlateList() {
    const listaPlacas = document.getElementById('listaPlacas');
    listaPlacas.style.display = listaPlacas.style.display === 'none' ? 'block' : 'none';
}
