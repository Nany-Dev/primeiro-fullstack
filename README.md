Projeto Fullstack-Pagina para 2Clicks
Este projeto consiste em uma one page fullstack com o objetivo de se alinhar a demanda da empresa 2Clicks. Ja desenvolvi uma boa parte da estrutura usando html, css e js. mais para frente teram apis que carregaram as informacoes de maneiras automaticas para maior eficacia.
Frontend: Localizado em index.html, style.css e script.js
Dados: O arquivo de dados eventos json contem os dados utilizados para a parte de eventos em detaque e eventos gerais. Como não foi possivel fazer um data scraping no site da prefeitura da cidade para fazer todos os eventos serem atualizados manualmente (pois seria ilegal de acordo com as diretrizes do site oficial da prefeitura) neste arquivos foram colocados os dados dos eventos manualmente.

Estrurura requirida:
## 0. Topo 

**Elementono topo:**

- Logo ou título:
  - “Guia Viva Santana de Parnaíba & Alphaville”
- Menu com âncoras:
  - Início
  - Eventos
  - Notícias
  - Turismo
  - Mapa & Rotas
  - Comércios & Camelôs
  - Guia para Novos
  - Contato / Sobre o Projeto

Funcionalidades (front):

- Menu responsivo (hambúrguer no mobile).
- Scroll suave para cada seção (ancoras `href="#id-da-secao"` + JS).

---

## 1. HERO DA CIDADE (seção de abertura)

**Objetivo:** apresentar a cidade e o propósito do site.

Conteúdo visual:

- Imagem grande ou carrossel de imagens:
  - Centro histórico de Santana de Parnaíba
  - Alphaville à noite
  - Natureza / rio / parques
- Título grande:
  - “Viver Santana de Parnaíba & Alphaville”
- Subtítulo:
  - “Eventos, notícias, turismo, comércio local e dicas para quem mora, trabalha ou está chegando agora.”
- 2–3 botões de ação:
  - “Ver eventos de hoje”
  - “Sou novo na cidade”
  - “Explorar comércio local”

Funcionalidades front:

- Carrossel simples de fundo ou imagens trocando automaticamente.
- Botões ancorando para seções específicas (eventos, guia para novos, etc.).

---

## 2. RESUMO RÁPIDO DA CIDADE (mini-cards de destaque)

Logo após o hero, uma faixa com 3–4 cards pequenos:

- Card 1:  
  - Ícone: calendário  
  - Texto: “+X eventos cadastrados neste mês” (pode começar com número fixo)
- Card 2:
  - Ícone: mapa  
  - Texto: “Principais pontos turísticos e rotas fáceis”
- Card 3:
  - Ícone: loja  
  - Texto: “Lojas, serviços e comércio de rua”
- Card 4 (opcional):
  - Ícone: megafone  
  - Texto: “Notícias oficiais da Prefeitura em destaque”

Funcionalidade:

- Tudo estático no início; depois você pode alimentar com contagem real via JS.

---

## 3. AGENDA DE EVENTOS

Seção forte logo no começo, porque é viva.

Conteúdo visual:

- Título: “Agenda de Eventos”
- Subtítulo: “Shows, feiras, esportes, eventos culturais e ações públicas em Santana de Parnaíba & Alphaville.”

Componentes:

- **Filtros** (front apenas):
  - Mês (select)
  - Cidade / Bairro:
    - Santana de Parnaíba
    - Alphaville / Barueri
    - Região Oeste geral
  - Tipo (show, feira, infantil, esporte, palestra, etc.)
- **Bloco “Eventos em destaque”**:
  - 3–4 cards maiores com:
    - Data em destaque (ex.: “15 ABR”)
    - Título
    - Local
    - Tag de origem (Prefeitura / Sympla / Comunitário)
- **Lista geral de eventos**:
  - Cards menores em grid, carregados via JS.

Funcionalidades front:

- Filtros funcionando no front com JavaScript (mesmo com dados mock).
- Paginação simples ou botão “Ver mais”.

---

## 4. NOTÍCIAS (COM PREFEITURA EM DESTAQUE)

Seção para mostrar que você inclui **notícias oficiais** e também de portais locais.

Visual:

- Título: “Notícias da Cidade”
- Subtítulo: “Acompanhe o que está acontecendo em Santana de Parnaíba, Alphaville e região.”

Layout sugerido:

- **Coluna esquerda**:
  - 1 notícia principal com:
    - Imagem
    - Selo: “Prefeitura de Santana de Parnaíba”
    - Título
    - Resumo
    - Botão: “Ler matéria completa”
- **Coluna direita**:
  - Lista de 4–6 notícias menores:
    - Pequena imagem (ou ícone)
    - Título
    - Fonte: Prefeitura / Portal local / Câmara, etc.
    - Data

Funcionalidade front:

- Carrosselzinho lateral ou tabs “Oficiais / Mídia local”.
- No começo, você pode usar apenas cards estáticos com links reais para matérias.

---

## 5. TURISMO & PONTOS HISTÓRICOS

Seção para quem quer conhecer a cidade ou fazer passeio.

Visual:

- Título: “Turismo & Pontos Históricos”
- Subtítulo: “História, cultura e natureza em um só lugar.”

Conteúdo:

- Carrossel de cartões com:
  - Foto do ponto turístico
  - Nome
  - Descrição curta
  - Tags:
    - “Histórico”
    - “Natureza”
    - “Família”
- Exemplos:
  - Centro histórico de Santana de Parnaíba
  - Igreja Matriz
  - Praças principais
  - Rota de trilhas / parques
- Pode ter um box especial:
  - “Eventos tradicionais” (ex.: “Drama da Paixão de Cristo”) com linha do tempo.

Funcionalidades front:

- Carrossel horizontal responsivo.
- Botão “Ver no mapa” ancorando para a seção de mapa (rolagem até lá).

---

## 6. MAPA & ROTAS (INTERATIVO)

Seção central de navegação geográfica.

Visual:

- Título: “Mapa da Cidade”
- Subtítulo: “Encontre eventos, pontos turísticos, serviços e comércio de rua.”

Componentes:

- Mapa embed (Google Maps / OpenStreetMap).
- Lista de filtros (checkbox / botões):
  - [ ] Eventos
  - [ ] Pontos turísticos
  - [ ] Serviços essenciais
  - [ ] Lojas & restaurantes
  - [ ] Comércio de rua (camelôs, barracas)

Funcionalidade front (inicial):

- Mapa com marcadores fixos definidos em JS (mock).
- Ao clicar em um marcador, aparece:
  - Nome do local
  - Tipo
  - Link para mais detalhes (ancora em outra seção ou site externo).

Depois você conecta esse mapa ao back-end.

---

## 7. COMÉRCIOS & CAMELÔS

Dividido em duas subpartes para deixar claro que você inclui “todo mundo”.

### 7.1. Lojas & Serviços (formais)

Visual:

- Título: “Lojas & Serviços”
- Cards com:
  - Nome
  - Categoria (restaurante, mercado, farmácia, coworking, etc.)
  - Endereço
  - Link “Ver rota” (abre Google Maps)
  - Horário de funcionamento

### 7.2. Comércio de Rua & Pequenos Negócios (camelôs)

Visual (como o exemplo que criei):

- Título: “Comércio de Rua & Pequenos Negócios”
- Texto curto:
  - “Barracas de comida, carrinhos de lanche, pequenos bazares… quem faz a cidade acontecer nas ruas.”
- Cards com:
  - Nome / apelido
  - Categoria (comida de rua, bazar, doces, etc.)
  - Cidade/bairro
  - Horário
  - Ponto de referência (no terminal, perto da escola, praça tal)
  - Contato (WhatsApp) – se a pessoa autorizar.

Funcionalidade front:

- Grid responsivo de cards.
- Filtro simples por:
  - Cidade (Santana de Parnaíba / Alphaville)
  - Categoria (comida, bazar, etc.)

---

## 8. GUIA PARA NOVOS MORADORES

Uma área bem útil e diferente.

Visual:

- Título: “Sou Novo na Cidade”
- Subtítulo: “Passo a passo para se localizar e se sentir em casa.”

Conteúdo organizado em blocos:

- Bloco 1 – “Como se locomover”
  - Ônibus principais
  - Dica de apps
  - Áreas de maior movimento
- Bloco 2 – “Serviços essenciais”
  - Postos de saúde, hospital, UPA
  - Delegacia / GCM
  - Prefeituras / subprefeituras / Poupatempo (se tiver na região)
- Bloco 3 – “Educação”
  - Principais escolas / faculdades
  - Onde se informar sobre matrícula
- Bloco 4 – “Coleta de lixo & reciclagem”
  - Dias, regras básicas
- Bloco 5 – “Dicas da comunidade”
  - Textinho ou lista com:
    - “Melhor horário para tal lugar”
    - “Cuidado com trânsito em tal trecho”

Funcionalidade front:

- Pode ser tipo acordeão (abre/fecha).
- Pode ter uma checklist visual com caixinhas (apenas estético).

---

## 9. BLOCO “PARTICIPE / ENVIE SEU ESTABELECIMENTO / EVENTO”

Seção voltada para interação, alinhada à visão do CEO da 2Click.

Visual:

- Título: “Quer aparecer aqui?”
- Subtítulo:
  - “Se você organiza eventos, tem um negócio local ou vende na rua, pode enviar seus dados para entrar neste guia.”
- Formulário simples:
  - Tipo de cadastro: [Evento] [Loja] [Camelô / Comércio de rua]
  - Nome
  - Cidade / Bairro
  - O que oferece
  - Contato
  - (Opcional) link do Instagram / site

Funcionalidade front:

- Primeiro momento: só envia para um e-mail ou exibe um “obrigado” (sem back-end).
- Depois, você faz isso salvar em banco / planilha / API 2Click.

---

## 10. SOBRE O PROJETO & CRÉDITOS

Por fim, uma seção pequena explicando o propósito.

Visual:

- Título: “Sobre o Projeto”
- Texto:
  - Que é um protótipo/guia da cidade.
  - Que tem inspiração/integração com o app 2Click.
  - Que a ideia é dar visibilidade para todos os tipos de pessoas e negócios.
- Pequeno destaque:
  - “Feito pensando em Santana de Parnaíba & Alphaville”.
- Links:
  - Botão “Fale com a equipe” ou “Entre em contato”.

---

## 11. RODAPÉ

Elementos:

- Nome do projeto / logo.
- Direitos autorais.
- Links rápidos:
  - Início, Eventos, Comércio, Mapa, etc.
- Se quiser, ícones de redes sociais (mesmo que ainda sejam só placeholders).

---

## Funcionalidades gerais de front que você pode planejar

- Navegação com scroll suave entre seções.
- Carrosséis (hero, turismo, notícias em destaque).
- Filtros dinâmicos (eventos, comércios, camelôs).
- Mapa com marcadores (fixos primeiro, depois dinâmicos).
- Acordeões / abas em:
  - Guia para novos
  - Notícias (oficiais x mídia local)
- Tema responsivo:
  - Grid adaptando para 1 coluna em mobile, 2–3 em desktop.
- Micro animações:
  - Hover nos cards
  - Fade-in ao rolar a página (pode usar só CSS/JS simples).

