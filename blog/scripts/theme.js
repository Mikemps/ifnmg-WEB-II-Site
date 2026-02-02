const NOME_ARQUIVO = "theme.json";

// Variável para guardar o valor do tema atual selecionado.
let tema = 0;
let giscusFrame;

// Função para escrever no arquivo do modo salvo.
function salvaModo(objeto) {
  let objJson = JSON.stringify(objeto);
  localStorage.setItem(NOME_ARQUIVO, objJson);
}

// Função para ler o arquivo que guarda o modo salvo.
function lerArquivoRanque() {
  let objSalvo = localStorage.getItem(NOME_ARQUIVO);
  return JSON.parse(objSalvo);
}

// Função para mudar o tema conforme o valor do checkbox ao ser clicado.
function theme(valor) {  
  if (valor == 0) {
    document.getElementById("btnMode").value = 1;
    document.getElementById("btnMode").innerHTML =
      "<i class='bi bi-brightness-high-fill theme' id='modeD' title='Modo Claro.'></i>";
    document.getElementById("conteiner").className = "dark";
    tema = 0;

    setThemeComentarios();

    // passagem do tema pelo link
    themeLink("linkHome");
    themeLink("linkDocs");
    themeLink("linkInicio");
    themeLink("linkEquipe");
    themeLink("linkSobre");

  } else if (valor == 1) {
    document.getElementById("btnMode").value = 0;
    document.getElementById("btnMode").innerHTML =
      "<i class='bi bi-moon-stars-fill theme' id='modeC' title='Modo Escuro.'></i>";
    document.getElementById("conteiner").className = "light";
    tema = 1;
    setThemeComentarios();

    // passagem do tema pelo link
    themeLink("linkHome");
    themeLink("linkDocs");
    themeLink("linkInicio")
    themeLink("linkEquipe");
    themeLink("linkSobre");
    
    if (linkDocs.href.includes("?mode=dark"))
      linkDocs.href = linkDocs.href.replace("?mode=dark", "?mode=light");
    else if (!linkDocs.href.includes("?mode="))
      linkDocs.href = linkDocs.href + "?mode=light";
  }
  salvaModo(tema);
}

function themeLink(idLink){
  const link = document.getElementById(idLink);
  if(tema == 1){
    if (link.href.includes("?mode=dark"))
      link.href = link.href.replace("?mode=dark", "?mode=light");
    else if (!link.href.includes("?mode="))
      link.href = link.href + "?mode=light";
  }else{
    if (link.href.includes("?mode=light"))
      link.href = link.href.replace("?mode=light", "?mode=dark");
    else if (!link.href.includes("?mode="))
      link.href = link.href + "?mode=dark";
  }
}
// Função para iniciar o tema salvo no localstorage, ao abrir a página se houver.
window.onload = function () {
  const url = window.location.href;
  tema = lerArquivoRanque();
  if (tema == null) {
    tema = 1;
  }
  // if para pegar o thema pelo link
  if (url.includes("?mode=dark")) {
    tema = 0;
    window.location.href = url.replace("?mode=dark", "");
  } else if (url.includes("?mode=light")) {
    tema = 1;
    window.location.href = url.replace("?mode=light", "");
  }
  
  theme(tema);

  setInterval(function () {
    document.getElementById("navbar").style.transition = "0.5s ease-in-out";
    document.getElementById("conteiner").style.transition = "0.5s ease-in-out";
  }, 700);

  if(url.includes("/post"))
    getArtigoSlug();

  setThemeComentarios();
};

// Função para mudar o tema dos comentários conforme o tema do site ativo.
function setThemeComentarios() {
  const url = window.location.href;
  if(url.includes("/post/?")){
    if (!giscusFrame) giscusFrame = document.querySelector("iframe.giscus-frame");
    if (giscusFrame != null) {
        if (tema == 1) {
          giscusFrame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: "light_tritanopia" } } },
            "https://giscus.app"
          );
        } else {
          giscusFrame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: "transparent_dark" } } },
            "https://giscus.app"
          );
        }
    }
}
}
