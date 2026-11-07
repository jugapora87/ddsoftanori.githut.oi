// JAVASCRIPT: controla el menú, los consejos y el reto de preguntas.

// Menú adaptable para pantallas pequeñas.
const menuBtn = document.getElementById("menuBtn");
const enlaces = document.getElementById("enlaces");
menuBtn.addEventListener("click", function () {
  const abierto = enlaces.classList.toggle("abierto");
  menuBtn.setAttribute("aria-expanded", abierto);
});
enlaces.querySelectorAll("a").forEach(function (enlace) {
  enlace.addEventListener("click", function () {
    enlaces.classList.remove("abierto");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Consejos: cada botón muestra un mensaje diferente.
const consejos = {
  agua: "💧 Cierra la llave mientras te cepillas, toma duchas cortas y avisa si observas fugas de agua.<br> Reduce el tiempo de baño para evitar el desperdicio de agua.",
  residuos: "♻️ Separa los residuos limpios y secos aprovechables de los demás. Consulta siempre las indicaciones de recolección de tu localidad.",
  arboles: "🌳 Protege las zonas verdes, evita arrojar basura y respeta los animales y plantas de tu entorno."
};
const mensajeConsejo = document.getElementById("mensajeConsejo");
document.querySelectorAll("[data-consejo]").forEach(function (boton) {
  boton.addEventListener("click", function () {
    mensajeConsejo.textContent = consejos[boton.dataset.consejo];
  });
});

// Preguntas del reto ecológico.
const preguntas = [
  {icono:"🍌",texto:"¿Dónde clasificamos una cáscara de banano?",opciones:["Orgánico","Aprovechable / reciclable","No aprovechable"],correcta:0,explicacion:"Los restos de frutas son orgánicos y pueden aprovecharse para compostaje si hay condiciones adecuadas."},
  {icono:"📰",texto:"¿Qué hacemos con un periódico limpio y seco?",opciones:["Orgánico","Aprovechable / reciclable","No aprovechable"],correcta:1,explicacion:"El papel limpio y seco suele ser aprovechable. No lo mezcles con residuos húmedos o grasosos."},
  {icono:"🥤",texto:"¿Cómo clasificamos una botella plástica vacía y limpia?",opciones:["Orgánico","Aprovechable / reciclable","No aprovechable"],correcta:1,explicacion:"Una botella plástica limpia puede ser aprovechable, según las reglas locales de recolección."},
  {icono:"🍂",texto:"¿Cómo clasificamos las hojas secas del jardín?",opciones:["Orgánico","Aprovechable / reciclable","No aprovechable"],correcta:0,explicacion:"Las hojas secas son orgánicas y pueden servir para hacer compost."},
  {icono:"🧻",texto:"¿Dónde va un pañuelo desechable usado?",opciones:["Orgánico","Aprovechable / reciclable","No aprovechable"],correcta:2,explicacion:"Un pañuelo usado no debe mezclarse con el papel reciclable; sigue las indicaciones locales."}
];
let indice = 0, puntaje = 0, aciertos = 0, respondida = false, iniciado = false;
const quizWrap = document.getElementById("quizWrap");
const iniciar = document.getElementById("iniciarReto");
const siguiente = document.getElementById("siguiente");
const opciones = document.getElementById("opciones");

iniciar.addEventListener("click", function () {
  if (iniciado && indice === preguntas.length) reiniciarReto();
  iniciado = true;
  quizWrap.hidden = false;
  iniciar.textContent = "↻ Reiniciar reto";
  mostrarPregunta();
  quizWrap.scrollIntoView({behavior:"smooth", block:"center"});
});

function mostrarPregunta() {
  respondida = false;
  const p = preguntas[indice];
  document.getElementById("residuo").textContent = p.icono;
  document.getElementById("pregunta").textContent = p.texto;
  document.getElementById("retro").textContent = "Elige una respuesta para continuar.";
  document.getElementById("numeroPregunta").textContent = (indice + 1) + " / " + preguntas.length;
  document.getElementById("progresoTexto").textContent = "Pregunta " + (indice + 1) + " de " + preguntas.length;
  document.getElementById("barraProgreso").style.width = ((indice + 1) / preguntas.length * 100) + "%";
  siguiente.disabled = true;
  siguiente.textContent = indice === preguntas.length - 1 ? "Ver resultado →" : "Siguiente →";
  opciones.innerHTML = "";
  p.opciones.forEach(function (texto, posicion) {
    const boton = document.createElement("button");
    boton.className = "opcion";
    boton.textContent = texto;
    boton.addEventListener("click", function () { comprobar(posicion, boton); });
    opciones.appendChild(boton);
  });
}

function comprobar(seleccion, botonElegido) {
  if (respondida) return;
  respondida = true;
  const p = preguntas[indice];
  opciones.querySelectorAll("button").forEach(function (boton, posicion) {
    boton.disabled = true;
    if (posicion === p.correcta) boton.classList.add("correcta");
  });
  if (seleccion === p.correcta) {
    puntaje += 1;
    aciertos += 1;
    document.getElementById("puntaje").textContent = puntaje;
    document.getElementById("aciertos").textContent = aciertos;
    document.getElementById("retro").textContent = "¡Correcto! " + p.explicacion;
  } else {
    botonElegido.classList.add("incorrecta");
    document.getElementById("retro").textContent = "Sigue aprendiendo. " + p.explicacion;
  }
  siguiente.disabled = false;
}

siguiente.addEventListener("click", function () {
  if (!respondida) return;
  if (indice < preguntas.length - 1) {
    indice += 1;
    mostrarPregunta();
  } else {
    document.getElementById("residuo").textContent = puntaje >= 4 ? "🏆" : "🌱";
    document.getElementById("pregunta").textContent = "¡Reto terminado!";
    opciones.innerHTML = "";
    document.getElementById("retro").textContent = "Tu puntaje es " + puntaje + " de " + preguntas.length + ". " +
      (puntaje >= 4 ? "¡Excelente! Sigue cuidando el planeta." : "Repasa los consejos e inténtalo de nuevo.");
    document.getElementById("progresoTexto").textContent = "Actividad completada";
    document.getElementById("numeroPregunta").textContent = "5 / 5";
    document.getElementById("barraProgreso").style.width = "100%";
    siguiente.textContent = "Intentar de nuevo ↻";
    siguiente.onclick = reiniciarReto;
    indice = preguntas.length;
  }
});

function reiniciarReto() {
  indice = 0; puntaje = 0; aciertos = 0; iniciado = true;
  document.getElementById("puntaje").textContent = "0";
  document.getElementById("aciertos").textContent = "0";
  siguiente.onclick = null;
  mostrarPregunta();
}
