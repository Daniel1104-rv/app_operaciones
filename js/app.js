document.addEventListener('DOMContentLoaded', () => {

    // 🌐 URL DEL WEBHOOK DE N8N
    const N8N_WEBHOOK_URL = "https://daniel112003.app.n8n.cloud/webhook/b5e7f13f-047e-414c-ac64-64716387491c";

    // 📡 Función para obtener la IP pública del cliente (IPv4)
    async function getPublicIP() {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            return data.ip; // Ejemplo: "187.189.88.105"
        } catch (error) {
            console.error("Error al obtener la IP pública:", error);
            return "IP desconocida";
        }
    }

    // Referencias al DOM
    const btnCalcular = document.getElementById('btnCalcular');
    const textoOperacion = document.getElementById('textoOperacion');
    const divResultado = document.getElementById('divResultado');
    const resultadoTexto = document.getElementById('resultadoTexto');
    const divError = document.getElementById('divError');
    const errorTexto = document.getElementById('errorTexto');

    const textoOriginalBtn = 'Enviar';

    btnCalcular.addEventListener('click', async () => {
        const query = textoOperacion.value;

        if (query.trim() === "") {
            alert("Escribe una operación no lo dejes vacío.");
            return;
        }

        // --- Estado de Carga ---
        divResultado.style.display = 'none';
        divError.style.display = 'none';
        btnCalcular.disabled = true;
        btnCalcular.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Procesando...
        `;

        try {
            // 🧠 Obtener la IP del cliente antes de enviar la operación
            const ipPublica = await getPublicIP();
            console.log("IP detectada:", ipPublica);

            // 🚀 Enviar al Webhook incluyendo la IP real
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    textoUsuario: query,
                    ip: ipPublica
                })
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.statusText}`);

            const data = await response.json();

            // --- Estado de Éxito ---
            btnCalcular.disabled = false;
            btnCalcular.innerHTML = textoOriginalBtn;

            // Mostrar resultado en pantalla
            resultadoTexto.innerText = data.respuestaCalculada;
            divResultado.style.display = 'block';

        } catch (error) {
            // --- Estado de Error ---
            btnCalcular.disabled = false;
            btnCalcular.innerHTML = textoOriginalBtn;

            console.error("Error:", error);
            errorTexto.innerText = 'Hubo un error al procesar la solicitud. Revisa la consola para más detalles.';
            divError.style.display = 'block';
        }
    });
});
