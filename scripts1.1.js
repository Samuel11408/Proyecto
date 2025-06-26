let graficaEncuentro;
let animacionEncuentro = null;

function resetearEncuentro() {
    document.getElementById("velocidad1").value = "";
    document.getElementById("posicion1").value = "";
    document.getElementById("velocidad2").value = "";
    document.getElementById("posicion2").value = "";
    document.getElementById("resultadoEncuentro").innerText = "";

    if (graficaEncuentro) {
        graficaEncuentro.destroy();
        graficaEncuentro = null;
    }
}

function convertirVelocidad(valor, unidad) {
    return unidad === 'km/h' ? valor / 3.6 : valor;
}

function convertirPosicion(valor, unidad) {
    return unidad === 'km' ? valor * 1000 : valor;
}


function calcularEncuentro() {
    let v1 = document.getElementById("velocidad1").value;
    let x1 = document.getElementById("posicion1").value;
    let v2 = document.getElementById("velocidad2").value;
    let x2 = document.getElementById("posicion2").value;

    const unidadV1 = document.getElementById("unidadVelocidad1").value;
    const unidadV2 = document.getElementById("unidadVelocidad2").value;
    const unidadX1 = document.getElementById("unidadPosicion1").value;
    const unidadX2 = document.getElementById("unidadPosicion2").value;

    
    if (v1 === "" || x1 === "" || v2 === "" || x2 === "") {
        document.getElementById("resultadoEncuentro").innerText = "Faltan datos para graficar hay que calcular primero el encuentro";
        clearCanvas(); 
        return;
    }

    
    v1 = parseFloat(v1);
    x1 = parseFloat(x1);
    v2 = parseFloat(v2);
    x2 = parseFloat(x2);

 
    if (isNaN(v1) || isNaN(x1) || isNaN(v2) || isNaN(x2)) {
        document.getElementById("resultadoEncuentro").innerText = "Llenar con valores que sean válidos";
        clearCanvas(); 
        return;
    }

    
    v1 = convertirVelocidad(v1, unidadV1);
    v2 = convertirVelocidad(v2, unidadV2);
    x1 = convertirPosicion(x1, unidadX1);
    x2 = convertirPosicion(x2, unidadX2);

    if (v1 === v2) {
        if (x1 === x2) {
            document.getElementById("resultadoEncuentro").innerText = "Los objetos se mueven juntos, van en la misma posición y velocidad";
            clearCanvas(); 
        } else {
            document.getElementById("resultadoEncuentro").innerText = "Los objetos nunca se van a encontrar, tienen la misma velocidad pero posiciones diferentes";
            clearCanvas(); 
        }
        return;
    }

    const t = (x2 - x1) / (v1 - v2);

    if (t < 0) {
        document.getElementById("resultadoEncuentro").innerText = "Los objetos no se van a encontrar nunca";
        clearCanvas(); 
        return;
    }

    const xEncuentro = x1 + v1 * t;

    document.getElementById("resultadoEncuentro").innerText =
        `Se encontrarán en t = ${t.toFixed(2)} s\n` +
        `Posición de encuentro: ${xEncuentro.toFixed(2)} m`;


}

function graficarEncuentro() {
    // 1) Lectura y conversión de datos
    let v1 = parseFloat(document.getElementById('velocidad1').value);
    let v2 = parseFloat(document.getElementById('velocidad2').value);
    let x1 = parseFloat(document.getElementById('posicion1').value);
    let x2 = parseFloat(document.getElementById('posicion2').value);
    const unidadV1 = document.getElementById('unidadVelocidad1').value;
    const unidadV2 = document.getElementById('unidadVelocidad2').value;
    const unidadX1 = document.getElementById('unidadPosicion1').value;
    const unidadX2 = document.getElementById('unidadPosicion2').value;

    if ([v1, v2, x1, x2].some(isNaN)) {
        alert("Faltan datos válidos para graficar.");
        return;
    }
    v1 = convertirVelocidad(v1, unidadV1);
    v2 = convertirVelocidad(v2, unidadV2);
    x1 = convertirPosicion(x1, unidadX1);
    x2 = convertirPosicion(x2, unidadX2);

    // 2) Calculo del tiempo de encuentro
    const tEncuentro = (x2 - x1) / (v1 - v2);
    if (tEncuentro < 0) {
        alert("Los objetos no se cruzarán en el tiempo dado.");
        return;
    }

    // 3) Inicializar (o destruir) la gráfica
    if (graficaEncuentro) graficaEncuentro.destroy();
    const ctx = document.getElementById('graficaEncuentro').getContext('2d');

    graficaEncuentro = new Chart(ctx, {
        type: 'scatter',   // scatter + line tension para trazos suaves
        data: {
            datasets: [
                {
                    label: 'Objeto 1',
                    data: [], 
                    showLine: true,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Objeto 2',
                    data: [],
                    showLine: true,
                    borderColor: 'green',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Encuentro',
                    data: [],
                    backgroundColor: 'blue',
                    pointRadius: 8,
                    showLine: false
                }
            ]
        },
        options: {
            animation: false,
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Tiempo (s)' }
                },
                y: {
                    title: { display: true, text: 'Posición (m)' }
                }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 4) Animación: añadimos un punto cada tick
    const pasos = 100;
    let paso = 0;
    const intervalo = setInterval(() => {
        const t = (tEncuentro / pasos) * paso;
        const y1 = x1 + v1 * t;
        const y2 = x2 + v2 * t;

        // Añadimos un nuevo punto a cada dataset
        graficaEncuentro.data.datasets[0].data.push({ x: t, y: y1 });
        graficaEncuentro.data.datasets[1].data.push({ x: t, y: y2 });
        graficaEncuentro.update('none'); // 'none' para sin animación interna

        paso++;
        if (paso > pasos) {
            clearInterval(intervalo);
            // Marcamos el punto de encuentro al final
            graficaEncuentro.data.datasets[2].data.push({
                x: tEncuentro,
                y: x1 + v1 * tEncuentro
            });
            graficaEncuentro.update();
        }
    }, 30); // cada 30 ms sale un nuevo punto
}

