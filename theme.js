// Recebe atualizações de tema claro/escuro do index.html enquanto esta
// página já está aberta dentro do iframe (troca em tempo real, sem
// precisar recarregar). O tema inicial já vem via ?theme= na URL,
// aplicado por um script inline no <head> antes do CSS carregar.
window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "mc-theme") {
    document.documentElement.setAttribute("data-theme", event.data.theme);
  }
});

// Evita que o scroll do mouse altere o valor de campos numéricos
// quando o cursor passa por cima deles (comportamento padrão do navegador).
document.addEventListener(
  "wheel",
  function (event) {
    const el = document.activeElement;
    if (el && el.tagName === "INPUT" && el.type === "number") {
      el.blur();
    }
  },
  { passive: true }
);

// Quando esta página roda dentro de um iframe (as calculadoras dentro do
// index.html), avisa o pai da altura real do conteúdo para o iframe crescer
// junto (sem barra de rolagem própria), inclusive quando o resultado
// aparece/some após clicar em "Calcular".
if (window.parent && window.parent !== window) {
  const reportHeight = function () {
    const altura = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    window.parent.postMessage({ type: "mc-resize", height: altura }, "*");
  };

  window.addEventListener("load", reportHeight);
  document.addEventListener("DOMContentLoaded", reportHeight);

  if (window.ResizeObserver) {
    new ResizeObserver(reportHeight).observe(document.body);
  } else {
    // Fallback para navegadores sem ResizeObserver.
    setInterval(reportHeight, 400);
  }
}
