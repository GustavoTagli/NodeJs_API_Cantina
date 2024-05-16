# Cantina da Graça - API

O projeto Cantina da Graça - API é uma aplicação backend que suporta as funcionalidades do sistema Cantina da Graça, oferecendo uma série de recursos para gerenciar produtos, categorias, pedidos e administração da cantina. Utilizando tecnologias modernas e práticas de desenvolvimento, a API proporciona uma experiência eficiente e segura tanto para os clientes quanto para os administradores da cantina.

## Descrição

A API Cantina da Graça oferece funcionalidades semelhantes às da aplicação frontend, permitindo o gerenciamento de produtos, categorias, pedidos e administração da cantina. Além das funcionalidades básicas, a API inclui recursos adicionais, como autenticação utilizando JWT (JSON Web Tokens), comunicação em tempo real com Socket.IO para acompanhamento de pedidos, integração com a API do Google para upload de imagens para o Google Drive e um cron schedule para deletar pedidos expirados.

## Tecnologias Utilizadas

- **Node.js:** Plataforma de desenvolvimento server-side baseada no motor JavaScript V8 do Chrome.
- **Express:** Framework web rápido, flexível e minimalista para Node.js.
- **Typescript:** Linguagem de programação que adiciona tipagem estática ao JavaScript, aumentando a produtividade e robustez do código.
- **Prisma:** ORM (Object-Relational Mapping) moderno para Node.js e TypeScript.
- **googleapis:** Biblioteca para interação com APIs do Google, utilizada para integração com o Google Drive.
- **multer:** Middleware para manipulação de dados de formulário multipart/form-data, utilizado para upload de arquivos.
- **node-cron:** Biblioteca para agendamento de tarefas baseado em cronjobs no Node.js.
- **socket.io:** Biblioteca para comunicação em tempo real entre cliente e servidor, utilizado para acompanhar pedidos em tempo real.
- **bcrypt:** Biblioteca para hash de senhas, utilizada para criptografar senhas de usuário.

## Como Executar o Projeto

1. Clone o repositório do projeto.
2. Instale as dependências utilizando npm ou yarn.
3. Configure as variáveis de ambiente, especialmente a URL do banco de dados.
4. Execute o servidor com o comando `npm start` ou `yarn start`.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

Este é um resumo do backend da aplicação Cantina da Graça. Para mais informações sobre o projeto frontend, consulte o [README](https://github.com/GustavoTagli/NextJs_CantinaDaGraca) correspondente.
