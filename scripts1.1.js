let graficaEncuentro;

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
    if (unidad === 'km/h') {
        return valor / 3.6; // convierte km/h a m/s
    }
    return valor; // ya está en m/s
}

function convertirPosicion(valor, unidad) {
    if (unidad === 'km') {
        return valor * 1000; // convierte km a m
    }
    return valor; // ya está en m
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
    let v1 = parseFloat(document.getElementById('velocidad1').value);
    let v2 = parseFloat(document.getElementById('velocidad2').value);
    let x1 = parseFloat(document.getElementById('posicion1').value);
    let x2 = parseFloat(document.getElementById('posicion2').value);

    const unidadVelocidad1 = document.getElementById('unidadVelocidad1').value;
    const unidadVelocidad2 = document.getElementById('unidadVelocidad2').value;
    const unidadPosicion1 = document.getElementById('unidadPosicion1').value;
    const unidadPosicion2 = document.getElementById('unidadPosicion2').value;

    if (isNaN(v1) || isNaN(v2) || isNaN(x1) || isNaN(x2)) {
        alert("Faltan datos para graficar hay que calcular primero el encuentro");
        return;
    }

    v1 = convertirVelocidad(v1, unidadVelocidad1);
    v2 = convertirVelocidad(v2, unidadVelocidad2);
    x1 = convertirPosicion(x1, unidadPosicion1);
    x2 = convertirPosicion(x2, unidadPosicion2);

    let tiempoEncuentro = (x2 - x1) / (v1 - v2);

    if (tiempoEncuentro < 0) {
        alert("Los objetos no se cruzarán en el tiempo");
        return;
    }

    const pasos = 50;
    let tiempos = [];
    let posiciones1 = [];
    let posiciones2 = [];

    for (let i = 0; i <= pasos; i++) {
        let t = (tiempoEncuentro / pasos) * i;
        tiempos.push(t);
        posiciones1.push(x1 + v1 * t);
        posiciones2.push(x2 + v2 * t);
    }

    if (graficaEncuentro) {
        graficaEncuentro.destroy();
    }

    const ctx = document.getElementById('graficaEncuentro').getContext('2d');
    graficaEncuentro = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [
                {
                    label: "Objeto 1",
                    data: posiciones1,
                    borderColor: 'red',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: "Objeto 2",
                    data: posiciones2,
                    borderColor: 'green',
                    borderWidth: 2,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: "Tiempo (s)" }
                },
                y: {
                    title: { display: true, text: "Posición (m)" }
                }
            }
        }
    });
}
