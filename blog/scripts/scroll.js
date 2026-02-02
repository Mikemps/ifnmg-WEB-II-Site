// Chama a função ``scrollShandow()`` conforme se scrolla a página.
window.onscroll = function () {
  scrollShandow();
  if(document.baseURI.indexOf('#sucess') > 0){
    window.location.href = window.location.href.replace('#sucess', '#fechar');
  }
};

// Função ``scrollShandow()`` verificar qual botão do navbar será desabilitado conforme a posição do scroll.
function scrollShandow() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("navbar").style.boxShadow =
      "0px 3px 10px rgba(0, 0, 0, 0.15)";
  } else {
    document.getElementById("navbar").style.boxShadow = "none";
  }
  if(document.getElementById("compartFixoID") != null){
    if(document.getElementById("compartFixoID").getBoundingClientRect().top < (window.screen.height - 5)){
      document.getElementById("compatRelat").style.display =  "none"
    }else{
        document.getElementById("compatRelat").style.display = "flex"
    }
  }
}


