
// Função para adicionar o link nos botões de compartilhamento na página de post.
function compartilhamentoLinks () {
  document.querySelector("#whatsappLink").href = `whatsapp://send?text="${window.location.href}"`;
  document.querySelector("#twitterLink").href =  "https://twitter.com/intent/tweet?text="+ window.location.href;
  document.querySelector("#facebookLink").href = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
  document.querySelector("#linkdinLink").href =  "https://www.linkedin.com/shareArticle?mini=true&url=" + window.location.href;
  document.querySelector("#whatsappLink1").href = `whatsapp://send?text="${window.location.href}"`;
  document.querySelector("#twitterLink1").href =  "https://twitter.com/intent/tweet?text="+ window.location.href;
  document.querySelector("#facebookLink1").href = "https://www.facebook.com/sharer/sharer.php?u=" + window.location.href;
  document.querySelector("#linkdinLink1").href =  "https://www.linkedin.com/shareArticle?mini=true&url=" + window.location.href;
}

compartilhamentoLinks();