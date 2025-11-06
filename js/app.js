const form = document.getElementById("form-op");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texto = document.getElementById("texto").value.trim();
  if (!texto) {
    msg.innerHTML = "<div class='alert alert-warning'>⚠️ Escribe una operación antes de enviar.</div>";
    return;
  }

  msg.innerHTML = "<div class='alert alert-info'>Enviando a n8n...</div>";
  const button = form.querySelector("button");
  button.disabled = true; // 🔒 Evita clics dobles

  try {
    // ✅ Webhook ACTIVADO (sin -test)
    const resp = await fetch("https://daniel112003.app.n8n.cloud/webhook/2b9c4088-7661-4e69-8aa7-b1e92945b1fb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    if (resp.ok) {
      msg.innerHTML = "<div class='alert alert-success'>✅ Operación enviada y guardada correctamente.</div>";
      form.reset();
    } else {
      msg.innerHTML = "<div class='alert alert-danger'>❌ Error al enviar. Revisa tu flujo en n8n.</div>";
    }
  } catch (err) {
    msg.innerHTML = `<div class='alert alert-danger'>⚠️ No se pudo conectar con n8n.<br>${err.message}</div>`;
  } finally {
    // 🕒 Rehabilita el botón tras 2 segundos
    setTimeout(() => (button.disabled = false), 2000);
  }
});
