let contadorVectores = 0;

const colores = ["blue", "green", "red", "orange", "purple", "brown", "teal", "pink", "cyan", "magenta"];

function agregarVector() {
    const contenedor = document.getElementById("contenedorVectores");

    const vectorDiv = document.createElement("div");
    vectorDiv.classList.add("vector");
    vectorDiv.innerHTML = `
        <h3>Fuerza ${contadorVectores + 1}</h3>
        <label>Fuerza (N): <input type="number" step="any" id="magnitud${contadorVectores}"></label>
        <label>Ángulo (°): <input type="number" step="any" id="angulo${contadorVectores}"></label>
        <label>Dirección: 
        <select id="direccion${contadorVectores}">
            <option value="N">N</option>
            <option value="NE">NE</option>
            <option value="E">E</option>
            <option value="SE">SE</option>
            <option value="S">S</option>
            <option value="SO">SO</option>
            <option value="O">O</option>
            <option value="NO">NO</option>
        </select>

        </label>
        <hr>
    `;
    contenedor.appendChild(vectorDiv);
    contadorVectores++;
}

function resetearVectores() {
    document.getElementById("contenedorVectores").innerHTML = "";

    contadorVectores = 0;

    const canvas = document.getElementById("graficaVectores");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const resultados = document.getElementById("resultadosAngulos");
    if (resultados) resultados.innerHTML = "";
}

function graficarVectores() {
    const canvas = document.getElementById("graficaVectores");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const vectores = [];

    for (let i = 0; i < contadorVectores; i++) {
        const magnitud = parseFloat(document.getElementById(`magnitud${i}`).value);
        let angulo = parseFloat(document.getElementById(`angulo${i}`).value);
        const direccion = document.getElementById(`direccion${i}`).value;

        if (isNaN(magnitud) || isNaN(angulo)) continue;

        const rad = angulo * (Math.PI / 180);
        let x = magnitud * Math.cos(rad);
        let y = magnitud * Math.sin(rad);

        switch (direccion) {
    case 'N':
        x = 0;
        y = magnitud;
        break;
    case 'S':
        x = 0;
        y = -magnitud;
        break;
    case 'E':
        x = magnitud;
        y = 0;
        break;
    case 'O':
        x = -magnitud;
        y = 0;
        break;
    case 'NE':
        x = magnitud * Math.cos(rad);
        y = magnitud * Math.sin(rad);
        break;
    case 'SE':
        x = magnitud * Math.cos(rad);
        y = -magnitud * Math.sin(rad);
        break;
    case 'SO':
        x = -magnitud * Math.cos(rad);
        y = -magnitud * Math.sin(rad);
        break;
    case 'NO':
        x = -magnitud * Math.cos(rad);
        y = magnitud * Math.sin(rad);
        break;
}

        vectores.push({ x, y });

        const color = colores[i % colores.length];
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, -y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        const angle = Math.atan2(-y, x);
        const arrowSize = 10;
        const tipX = x;
        const tipY = -y;

        const leftX = tipX - arrowSize * Math.cos(angle - Math.PI / 6);
        const leftY = tipY - arrowSize * Math.sin(angle - Math.PI / 6);
        const rightX = tipX - arrowSize * Math.cos(angle + Math.PI / 6);
        const rightY = tipY - arrowSize * Math.sin(angle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        const offsetLabel = 15;
        const labelX = tipX + offsetLabel * Math.cos(angle);
        const labelY = tipY + offsetLabel * Math.sin(angle);

        ctx.fillStyle = color;
        ctx.font = "bold 14px Arial";
        ctx.fillText(`F${i + 1}`, labelX, labelY);
    }

    const squareSize = 10; 
    ctx.fillStyle = 'black';
    ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);

    let resultadosHTML = "";

    for (let i = 0; i < vectores.length; i++) {
        for (let j = i + 1; j < vectores.length; j++) {
            const v1 = vectores[i];
            const v2 = vectores[j];

            const dot = v1.x * v2.x + v1.y * v2.y;
            const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
            const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);

            if (mag1 === 0 || mag2 === 0) continue;

            let cosTheta = dot / (mag1 * mag2);
            cosTheta = Math.max(-1, Math.min(1, cosTheta));

            const angle = Math.acos(cosTheta);
            const angleDeg = angle * (180 / Math.PI);
            resultadosHTML += `<p>El ángulo entre F${i + 1} y F${j + 1} es: <strong>${angleDeg.toFixed(2)}°</strong></p>`;
        }
    }

    document.getElementById("resultadosAngulos").innerHTML = resultadosHTML;
}
