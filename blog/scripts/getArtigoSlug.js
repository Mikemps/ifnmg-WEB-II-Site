// Ícones das redes sociais do bootstrap icons.
let icons = {
  insta: '<i class="bi bi-instagram"></i>',
  face: '<i class="bi bi-facebook"></i>',
  linkedln: '<i class="bi bi-linkedin"></i>',
  github: '<i class="bi bi-github"></i>',
  twitter: '<i class="bi bi-twitter"></i>',
};

// Meses do ano para escrever por extenso.
let meses = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

// Função para buscar o post na api pelo link do site (slug), e colocar os dados na página.
async function getArtigoSlug() {
  let url = window.location.href;
  let slug = url.split("post/?")[1];
  if(slug == "" || !url.includes("post/?")){
    slug = "-"
  }else{
    slug = slug.replace("=", "");
  }
  let api = `https://sifsoft-api-production.up.railway.app/post/${slug}/?format=json`;
  const response = await fetch(api);
  const data = await response.json();

  if (data.detail == "Não encontrado." || !data.aprovado) {
    document.getElementById("artigoID").innerHTML = `
        <div class="avisoErro">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <h1>A página que você estava procurando não foi encontrada</h1>
            <a href="/"><i class="bi bi-house-fill"></i> Inicio.</a>
        </div>
        `;
    document.getElementById("boxCompartilhar").style =
      "opacity: 0;  pointer-events: none;";
    document.getElementById("comentarios").style.display = "none";
  } else {
    let dia = data.created.slice(8, 10);
    let mes = data.created.slice(5, 7) - 1;
    let ano = data.created.slice(0, 4);
    let diaU = data.update.slice(8, 10);
    let mesU = data.update.slice(5, 7) - 1;
    let anoU = data.update.slice(0, 4);

    document.getElementById("tituloPage").innerHTML = data.titulo + ' - blog';
    document.getElementById("titulo").textContent = data.titulo;
    document.getElementById("resumo").textContent = data.resumo;
    document.getElementById("texto").innerHTML = data.texto;
    if(data.image_perfil_author == 'Sem foto'){
      document.getElementById("autor").innerHTML = `<div id='autorDados' class='perfilAutor'>
        <svg viewBox="0 0 65 65" fill="none">
          <path d="M47 19C47 27.2843 40.2843 34 32 34C23.7157 34 17 27.2843 17 19C17 10.7157 23.7157 4 32 4C40.2843 4 47 10.7157 47 19Z" fill="#217C97"/>
          <path d="M18.0863 34.4228C8.52362 36.5124 2 40.6888 2 45.5C2 45.8133 2.02766 46.1238 2.08201 46.4313C2.02865 46.6116 2 46.8024 2 47V56C2 58.2091 3.79086 60 6 60H58C60.2091 60 62 58.2091 62 56V47C62 46.8024 61.9714 46.6116 61.918 46.4313C61.9723 46.1238 62 45.8133 62 45.5C62 40.5612 55.1257 36.2913 45.1463 34.261C41.9388 36.5408 37.0176 38 31.5 38C26.1141 38 21.2965 36.6097 18.0863 34.4228Z" fill="#217C97"/>
        </svg>
      </div>`
    }else{
      document.getElementById("autor").innerHTML = `<div id='autorDados' class='perfilAutor'>
          <img src="${data.image_perfil_author}" alt="">
      </div>`
    }
    
    
    document.getElementById(
      "autorDados"
    ).innerHTML += `<p id="nomeAutor" onclick="window.open('${
      data.linkRedeSocial
    }', '_blank')"> <strong>Autor: </strong>  ${
      data.author
    } <a class='linkRede' href='${data.linkRedeSocial}' target='_blank'>${
      icons[data.iconTypeRedeSocial]
    }</a></p>`
    document.getElementById("autor").innerHTML +=`<p class='criadoPost'>Criado em ${dia} de ${meses[mes]} de ${ano}.</p>`;

    document.getElementById(
      "AtualizaçãoPost"
    ).textContent = `Atualizado em ${diaU} de ${meses[mesU]} de ${anoU}.`;

    

    if(document.querySelector('.math-tex') != null){
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    if(document.querySelector('blockquote') != null){
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.getElementsByTagName("head")[0].appendChild(script);
    }
    if(document.querySelector('pre') != null){
      for(const element of document.querySelectorAll('pre')){
        element.className = 'prettyprint';
      }
      PR.prettyPrint();
    }
    if(document.querySelector('iframe') != null){
      for(const element of document.querySelectorAll('iframe')){
        if (element.src.indexOf('youtube.com') > -1){
          element.className = 'videoYoutube';
        }
      }
      PR.prettyPrint();
    }
  }
}