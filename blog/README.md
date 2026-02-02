O [blog](http://blog.sifsoft.com.br/) da **SIFSoft** utiliza tecnologias como Javascript, css e html, além de alguns frameworks como por exemplo os [ícones do bootstrap](https://icons.getbootstrap.com/).

### Lista de postagens

As postagens são acessadas através da api em django rest framework, todas as alterações e criação dos post ocorrem fora do ambiente do blog, através do site de administração.

### Postagens

As postagens são carregadas a partir de uma página template em html, no qual os dados são visualizados dinamicamente através dos slug da página, assim oferece acesso apenas com o link aos posts, sem a necessidade de ir à primeira página do blog para escolher um. O sistema de comentários utiliza o projeto open source [Giscus](https://giscus.app/pt), que utiliza as discussões do github permitindo os usuários comentarem através do github.
