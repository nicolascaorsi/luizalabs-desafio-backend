# API de Produtos Favoritos dos Clientes

Esta API faz parte do processo seletivo do LuizaLabs e tem como objetivo permitir que clientes gerenciem sua lista de produtos favoritos via API REST.

## Descricão
### Cenário
O Magalu está expandindo seus negócios e uma das novas missões do time de tecnologia é criar uma funcionalidade de Produtos Favoritos de nossos Clientes, em que os nossos aplicativos irão enviar requisições HTTP para um novo backend que deverá gerenciar nossos clientes e seus produtos favoritos.
Esta nova API REST será crucial para as ações de marketing da empresa e terá um grande volume de requisições, então tenha em mente que a preocupação com performance é algo que temos em mente constantemente.

### Requisitos
* Deve ser possível criar , atualizar , visualizar e remover Clientes
* O cadastro dos clientes deve conter apenas seu nome e endereço de e-mail
  * Um cliente não pode se registrar duas vezes com o mesmo endereço de e-mail
  * Cada cliente só deverá ter uma única lista de produtos favoritos
* Em uma lista de produtos favoritos podem existir uma quantidade ilimitada de produtos
  * Um produto não pode ser adicionado em uma lista caso ele não exista
  * Um produto não pode estar duplicado na lista de produtos favoritos de um cliente
  * A documentação da API de produtos pode ser visualizada neste link
* O dispositivo que irá renderizar a resposta fornecida por essa nova API irá apresentar o
Título, Imagem, Preço e irá utilizar o ID do produto para formatar o link que ele irá acessar .
Quando existir um review para o produto, o mesmo será exibido por este dispositivo. Não é necessário criar um frontend para simular essa renderização (foque no desenvolvimento da API).
* O acesso à api deve ser aberto ao mundo, porém deve possuir autenticação e autorização.

# Solução

## Premissas
- O token JWT é gerado por outra aplicação e esta somente é responsável por utiliza-lo, sendo assim foi disponibilziada a rota http://<api-url>auth/login para geração desse token, que recebe o email de um cliente para fazer o login, retornando o token a ser utilizado nas chamadas.

## Decisões Arquiteturais
- Produtos não podem ser excluídos do sistema;
- Tratamento otimista de erros para operações;
  - Por exemplo: se um produto for adicioando duas vezes como favorito, o servidor responde sucesso em vez de erro, mas não adiciona o item duas vezes como favorito.
- Paginação segue o mesmo modelo da API de produtos

## Pré-requisitos
- Docker e Docker Compose
- VS Code com a extensão "Remote - Containers" instalada
- Git


## Instalação

### Usando DevContainer

1. Clone o repositório:
```bash
git clone <repository-url>
cd customers-favorite-products-api
```

2. Abra o projeto no VS Code:
```bash
code .
```

3. Quando o VS Code abrir, ele detectará o arquivo `.devcontainer/devcontainer.json` e oferecerá para reabrir o projeto no container. Clique em "Reopen in Container".

4. Aguarde a construção do container e a instalação das dependências.

5. Configure as variáveis de ambiente:
   - O arquivo `.development.env` contém as variáveis de ambiente necessárias para rodar o projeto em modo de desenvolvimento.
   - Variáveis de ambiente necessárias:
     - Detalhes de conexão com o banco de dados
     - Configuração JWT (se necessário)


### Modo Desenvolvimento
```bash
npm run start:dev
```

### Modo Produção
```bash
npm run build
npm run start:prod
```


## Testes

O projeto inclui diferentes tipos de testes:

### Testes Unitários
```bash
npm run test
```

### Testes de Integração
```bash
npm run test:integration
```

### Testes End-to-End
```bash
npm run test:e2e
```

### Executar Todos os Testes
```bash
npm run test:all
```


## Migrações do Banco de Dados

### Gerar Migração
```bash
npm run migration:generate -- <nome-da-migracao>
```

### Executar Migrações
```bash
npm run migration:run
```

### Reverter Migração
```bash
npm run migration:revert
```

## Documentação da API

A documentação da API está disponível através do Swagger UI quando a aplicação estiver em execução. Acesse em:
```
http://localhost:3000/api
```


## Arquitetura e Comunicação entre Camadas

O projeto segue uma arquitetura em camadas com responsabilidades bem definidas:

### Camadas e Responsabilidades

1. **Controllers**
   - Responsáveis por receber requisições HTTP
   - Validam e transformam dados de entrada
   - Comunicam-se exclusivamente com services
   - Não contêm lógica de negócio

2. **Services**
   - Implementam a lógica de negócio
   - Recebem os doados enviados pelos controllers
   - Convertem os dados entidades do domínio
   - Comunicam-se com repositories ou outros services
   - Coordenam operações complexas

3. **Repositories**
   - Responsáveis pela persistência de dados
   - Trabalham exclusivamente com entidades do domínio
   - Isolam a camada de persistência
   - As implementações utilizam TypeORM

4. **Entidades do Domínio**
   - Representam as entidades do negócio
   - Contêm regras de validação e comportamento
   - São visíveis para todas as camadas
   - Encapsulam a lógica do domínio

### Fluxo de Dados

```
HTTP Request → Controller → Service → Repository → Banco de Dados
     ↑                 ↑          ↑          ↑
     └─────────────────┴──────────┴──────────┘
              DTOs e Entidades do Domínio
```

### Regras de Comunicação

- Controllers só se comunicam com services;
- Services se comunicam com repositories ou outros services;
- Repositories só trabalham com entidades do domínio;
- Entidades do domínio são visíveis em todas as camadas;
- DTOs são usados para transferência de dados entre controllers e services (são as classes com sufixo Request/Response), quando não é possível usar as entidades de dominio.

## Tecnologias Utilizadas
- **Framework**: NestJS (v11)
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL com TypeORM
- **Testes**: Jest com diferentes configurações para testes unitários, de integração e end-to-end
- **Documentação**: Swagger/OpenAPI
- **Ferramentas de Desenvolvimento**:
  - ESLint para linting de código
  - Prettier para formatação de código
  - Lefthook para git hooks
  - Wiremock para realizar o mock da API de produtos, uma vez que ela está fora do ar definitivamente.

## Melhorias futuras
- [ ] Utilziar um API gateway para fazer autenticação do JWT e estudar a possibilidade de fazer a autorização também, além de politicas de rate limit e cache;
- [ ] Utilizar um mecanismo de request coalesing ao se comunicar com a API de produtos, assim evitamos requisições duplicadas em paralelo;
- [ ] Implementar perfis de usuários, onde o admin pode realizar qualquer operação;
- [ ] Implementar mecanismo de atualização de produtos, hoje uma vez que as informações do produto são baixadas, elas nunca são atualizadas e informações como preço, titulo entre outras podem ser atualizadas;
- [ ] Utilizar ids externos em vez de expor os ids das entidades da base;
- [ ] Usar builders para criação de objetos para testes em vez de instanciar cada item 'na mão';
- [ ] Estudar beneficios da adoção do fastify em vez do express para aumentar a capacidade de requisições simultaneas da API;
- [ ] Traduzir mensagens de erro das validações dos campos (class-validator);
- [ ] Utilizar um exception filter do NestJS para converter os erros que ocorrem nas camadas mais internas para seus respectivos erros em HTTP, como por exemplo o erro NotFound para um erro 404.