# Feliz 6 meses ❤️

Site estático e responsivo criado como uma homenagem de seis meses de namoro, inspirado na identidade visual do arquivo `FELIZ 6 MESES.pdf`.

## Estrutura

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── audio/
│   ├── icons/
│   └── images/
│       ├── covers/
│       └── photos/
├── FELIZ 6 MESES.pdf
└── README.md
```

## Áudios

Os arquivos de áudio são opcionais e não fazem parte do projeto neste momento. Para ativar os players, adicione arquivos autorizados com estes nomes:

```text
assets/audio/until-i-found-you.mp3
assets/audio/king-of-my-heart.mp3
assets/audio/sara-perche-ti-amo.mp3
```

Os players usam `preload="none"`: nenhuma música é carregada antes de uma interação explícita.

## Executar localmente

Abra `index.html` diretamente em um navegador. Não é necessário instalar dependências ou iniciar um servidor.

## Publicar no GitHub Pages

1. Envie os arquivos para a branch principal do repositório.
2. Em **Settings → Pages**, selecione **Deploy from a branch**.
3. Escolha a branch principal e a pasta `/ (root)`.

Todos os recursos utilizam caminhos relativos e funcionam tanto em um domínio próprio quanto em um endereço no formato `usuario.github.io/nome-do-repositorio/`.

O site não utiliza analytics, rastreadores, cookies, backend ou dependências externas.
