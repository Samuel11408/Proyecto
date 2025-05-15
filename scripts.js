let grafica;

function convertirVelocidad(valor, unidad) {
    return unidad === "km/h" ? valor * (1000 / 3600) : valor;
}

function convertirTiempo(valor, unidad) {
    if (unidad === "min") return valor * 60;
    if (unidad === "h") return valor * 3600;
    return valor;
}

function convertirPosicion(valor, unidad) {
    return unidad === "km" ? valor * 1000 : valor;
}

function resetearMRU() {
    document.getElementById('velocidad').value = "";
    document.getElementById('tiempo').value = "";
    document.getElementById('posicionInicial').value = "";
    document.getElementById('deltaX').value = "";

    document.getElementById('unidadVelocidad').value = "m/s";
    document.getElementById('unidadTiempo').value = "s";
    document.getElementById('unidadPosicion').value = "m";
    document.getElementById('unidadDeltaX').value = "m";

    document.getElementById('resultadoMRU').innerText = "";

    if (grafica) {
        grafica.destroy();
        grafica = null;
    }
}

function calcularMRU() {
    let v = parseFloat(document.getElementById('velocidad').value);
    let t = parseFloat(document.getElementById('tiempo').value);
    let x0 = parseFloat(document.getElementById('posicionInicial').value);
    let deltaX = parseFloat(document.getElementById('deltaX').value);

    const unidadVelocidad = document.getElementById('unidadVelocidad').value;
    const unidadTiempo = document.getElementById('unidadTiempo').value;
    const unidadPosicion = document.getElementById('unidadPosicion').value;
    const unidadDeltaX = document.getElementById('unidadDeltaX').value;

    if (!isNaN(v)) v = convertirVelocidad(v, unidadVelocidad);
    if (!isNaN(t)) t = convertirTiempo(t, unidadTiempo);
    if (!isNaN(x0)) x0 = convertirPosicion(x0, unidadPosicion);
    if (isNaN(x0)) x0 = 0; // Si no se proporciona, usar 0 por defecto
    if (!isNaN(deltaX)) deltaX = convertirPosicion(deltaX, unidadDeltaX);

    let mensaje = "";

    if (!isNaN(v) && !isNaN(t) && isNaN(deltaX)) {
        deltaX = v * t;
        document.getElementById('deltaX').value = unidadDeltaX === "km" ? (deltaX / 1000).toFixed(2) : deltaX.toFixed(2);
        const xf = x0 + deltaX;
        mensaje = `xi = ${x0.toFixed(2)} metros\nxf = ${xf.toFixed(2)} metros\nΔx = ${deltaX.toFixed(2)} metros`;
    } else if (!isNaN(v) && !isNaN(deltaX) && isNaN(t)) {
        t = deltaX / v;
        document.getElementById('tiempo').value = unidadTiempo === "min" ? (t / 60).toFixed(2) : unidadTiempo === "h" ? (t / 3600).toFixed(2) : t.toFixed(2);
        const xf = x0 + deltaX;
        mensaje = `Tiempo calculado = ${t.toFixed(2)} segundos\nxi = ${x0.toFixed(2)} metros\nxf = ${xf.toFixed(2)} metros\nΔx = ${deltaX.toFixed(2)} metros`;
    } else if (!isNaN(t) && !isNaN(deltaX) && isNaN(v)) {
        v = deltaX / t;
        document.getElementById('velocidad').value = unidadVelocidad === "km/h" ? (v * 3.6).toFixed(2) : v.toFixed(2);
        const xf = x0 + deltaX;
        mensaje = `Velocidad calculada = ${v.toFixed(2)} m/s\nxi = ${x0.toFixed(2)} metros\nxf = ${xf.toFixed(2)} metros\nΔx = ${deltaX.toFixed(2)} metros`;
    } else if (!isNaN(v) && !isNaN(t) && !isNaN(x0)) {
        const xf = x0 + v * t;
        const deltaXCalculado = xf - x0;
        mensaje = `xi = ${x0.toFixed(2)} metros\nxf = ${xf.toFixed(2)} metros\nΔx = ${deltaXCalculado.toFixed(2)} metros`;
    } else {
        mensaje = "Llenar al menos dos valores.";
    }

    document.getElementById('resultadoMRU').innerText = mensaje;
}

function graficarMRU() {
    let v = parseFloat(document.getElementById('velocidad').value);
    let tTotal = parseFloat(document.getElementById('tiempo').value);
    let x0 = parseFloat(document.getElementById('posicionInicial').value);

    const unidadVelocidad = document.getElementById('unidadVelocidad').value;
    const unidadTiempo = document.getElementById('unidadTiempo').value;
    const unidadPosicion = document.getElementById('unidadPosicion').value;

    if (isNaN(v) || isNaN(tTotal) || isNaN(x0)) {
        alert("Faltan datos para graficar: asegúrate de calcular primero MRU.");
        return;
    }

    v = convertirVelocidad(v, unidadVelocidad);
    tTotal = convertirTiempo(tTotal, unidadTiempo);
    x0 = convertirPosicion(x0, unidadPosicion);

    const pasos = 50;
    let tiempos = [];
    let posiciones = [];

    for (let i = 0; i <= pasos; i++) {
        let t = (tTotal / pasos) * i;
        tiempos.push(t);
        posiciones.push(x0 + v * t);
    }

    if (grafica) {
        grafica.destroy();
    }

    const ctx = document.getElementById('graficaMRU').getContext('2d');
    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempos,
            datasets: [{
                label: "Objeto",
                data: posiciones,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
            }]
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

