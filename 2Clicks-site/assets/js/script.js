// ===================== CONFIGURAÇÕES =====================

// Caminho do JSON de eventos da prefeitura (relativo ao index.html)
const EVENTOS_PREFEITURA_PATH = "eventos.json";

// ===================== VARIÁVEIS GLOBAIS =====================

let eventos = []; // todos os eventos convertidos

// ===================== UTILITÁRIOS DE DATA =====================

function extrairDiaMesDeIso(isoString) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return { dia: "--", mes: "--" };
  }
  const dia = String(d.getDate()).padStart(2, "0");
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const mes = meses[d.getMonth()] || "--";
  return { dia, mes };
}

function formatarIsoParaTexto(isoString) {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return isoString;
  }
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${h}:${m}`;
}

// ===================== CONVERSOR: PREFEITURA JSON -> FORMATO PADRÃO =====================

function converterEventoPrefeitura(e) {
  const { dia, mes } = extrairDiaMesDeIso(e.startDate);

  let tipo = "";
  if (e.tags?.includes("carnaval") || e.tags?.includes("musical")) tipo = "show";
  else if (e.tags?.includes("religioso")) tipo = "palestra";
  else tipo = "feira";

  const cidade = "santana"; // todos do JSON atual são em Santana de Parnaíba
  const enderecoMaps = `${e.location.lat},${e.location.lng}`;

  return {
    id: `pref-${e.id}`,
    titulo: e.title,
    descricao: e.description,
    dataISO: e.startDate,
    dia,
    mes,
    local: `${e.location.name} - ${e.location.city}`,
    origem: "Prefeitura de Santana de Parnaíba",
    cidade,
    bairro: e.location.address || "",
    tipo,
    enderecoMaps,
    imageUrl: e.imageUrl || ""
  };
}

// ===================== CARREGAR EVENTOS (JSON COM FETCH) =====================

async function carregarEventosPrefeitura() {
  try {
    const resposta = await fetch(EVENTOS_PREFEITURA_PATH);
    if (!resposta.ok) {
      console.error("Erro ao carregar eventos da prefeitura:", resposta.status);
      return [];
    }
    const dadosBrutos = await resposta.json();

    const convertidos = dadosBrutos.map(converterEventoPrefeitura);
    return convertidos;
  } catch (erro) {
    console.error("Falha ao buscar eventos da prefeitura:", erro);
    return [];
  }
}

// ===================== FUNÇÕES UTILITÁRIAS =====================

function gerarLinkMaps(enderecoMaps) {
  if (enderecoMaps && enderecoMaps.includes(",")) {
    const base = "https://www.google.com/maps/search/?api=1&query=";
    return base + encodeURIComponent(enderecoMaps);
  }
  const base = "https://www.google.com/maps/search/?api=1&query=";
  return base + encodeURIComponent(enderecoMaps || "");
}

function gerarLinkGoogleCalendar(evento) {
  if (!evento.dataISO) return "#";

  const inicio = evento.dataISO.replace(/[-:]/g, "").slice(0, 15) + "Z";
  const fim = inicio;

  const base = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: evento.titulo,
    dates: `${inicio}/${fim}`,
    details: evento.descricao || "",
    location: evento.enderecoMaps || ""
  });

  return `${base}&${params.toString()}`;
}

// ===================== CARROSSEL DE DESTAQUE =====================

async function renderizarCarrosselDestaque(lista) {
  const destaqueContainer = document.getElementById("eventos-destaque");
  if (!destaqueContainer) return;

  destaqueContainer.innerHTML = "";

  if (!lista || lista.length === 0) {
    destaqueContainer.innerHTML = `
      <div class="sem-eventos">
        <p>Nenhum evento em destaque no momento.</p>
        <p style="font-size: 0.9rem; margin-top: 10px;">Os próximos eventos serão exibidos aqui.</p>
      </div>
    `;
  }

  // Ordenar por data e pegar os 3 mais próximos
  const agora = new Date();
  agora.setHours(0, 0, 0, 0)
  const eventosFuturos = lista.filter(evento => {
    const dataEvento = new Date(evento.dataISO);
    return dataEvento >= agora;
  });

  if (eventosFuturos.length === 0) {
    destaqueContainer.innerHTML = `
        <div class="sem-eventos">
            <p>Nenhum evento futuro programado</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">Os próximos eventos serão exibidos aqui</p>
        </div>
    `;
    return;
  }

  // Pega os 3 eventos mais próximos
  const destaques = [...eventosFuturos]
    .sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO))
    .slice(0, 3);
  
  // Container de slides
  const slidesWrapper = document.createElement("div");
  slidesWrapper.classList.add("eventos-destaque-slides");
  destaqueContainer.appendChild(slidesWrapper);

  destaques.forEach((evento, index) => {
    const slide = document.createElement("div");
    slide.classList.add("evento-destaque-slide");
    if (index === 0) slide.classList.add("evento-destaque-slide--ativo");

    const inicioTexto = formatarIsoParaTexto(evento.dataISO);
    const TEXTO_DEST = 110;
    const desc = evento.descricao || "";
    const descCurta =
      desc.length > TEXTO_DEST ? desc.slice(0, TEXTO_DEST) + "..." : desc;

    const mapsUrl = gerarLinkMaps(evento.enderecoMaps);
    const calendarUrl = gerarLinkGoogleCalendar(evento);

    slide.innerHTML = `
      <div class="evento-destaque-slide__imagem" 
           style="background-image:url('${evento.imageUrl || ""}');">
        <div class="evento-destaque-slide__overlay">
          <div class="evento-destaque-slide__overlay-inner">
            <h4 class="evento-destaque-slide__overlay-titulo">${evento.titulo}</h4>
            <p class="evento-destaque-slide__overlay-data">${inicioTexto}</p>
            <div class="evento-destaque-slide__overlay-descricao-container">
              <p class="evento-destaque-slide__overlay-descricao">
                <span class="descricao-texto">${descCurta}</span>
                ${
                  desc.length > TEXTO_DEST
                    ? `<button class="evento-destaque-ler-mais" type="button">Ler mais</button>`
                    : ""
                }
              </p>
            </div>
            <div class="evento-destaque-slide__acoes">
              <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm">
                Salvar na agenda
              </a>
              <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
                Ver rota
              </a>
              <button class="btn btn-sm btn-secondary evento-destaque-saiba-mais">
                Ver todos os eventos
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adiciona lógica do ler mais para o slide
    if (desc.length > TEXTO_DEST) {
      const btnLerMais = slide.querySelector(".evento-destaque-ler-mais");
      const spanTexto = slide.querySelector(".descricao-texto");
      let expandido = false;

      btnLerMais.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que o clique feche ou mude o slide dependendo de outras lógicas
        expandido = !expandido;
        if (expandido) {
          spanTexto.textContent = desc;
          btnLerMais.textContent = "Ler menos";
        } else {
          spanTexto.textContent = descCurta;
          btnLerMais.textContent = "Ler mais";
        }
      });
    }

    slidesWrapper.appendChild(slide);
  });

  // Controles (setas)
  const controles = document.createElement("div");
  controles.classList.add("eventos-destaque-controles");
  controles.innerHTML = `
    <button class="prev" type="button">&#8249;</button>
    <button class="next" type="button">&#8250;</button>
  `;
  destaqueContainer.appendChild(controles);

  // Indicadores (bolinhas)
  const indicadores = document.createElement("div");
  indicadores.classList.add("eventos-destaque-indicadores");
  destaques.forEach((_, index) => {
    const dot = document.createElement("button");
    if (index === 0) dot.classList.add("ativo");
    indicadores.appendChild(dot);
  });
  destaqueContainer.appendChild(indicadores);

  // Lógica do carrossel
  const slides = Array.from(
    destaqueContainer.querySelectorAll(".evento-destaque-slide")
  );
  const dots = Array.from(
    destaqueContainer.querySelectorAll(".eventos-destaque-indicadores button")
  );
  const prevBtn = destaqueContainer.querySelector(".prev");
  const nextBtn = destaqueContainer.querySelector(".next");
  let indiceAtual = 0;
  let intervalo = null;

  function atualizarSlides(novoIndice) {
    indiceAtual = (novoIndice + slides.length) % slides.length;

    const offset = -indiceAtual * 100;
    slidesWrapper.style.transform = `translateX(${offset}%)`;

    slides.forEach((s, i) => {
      s.classList.toggle("evento-destaque-slide--ativo", i === indiceAtual);
    });
    dots.forEach((d, i) => {
      d.classList.toggle("ativo", i === indiceAtual);
    });
  }

  function proximoSlide() {
    atualizarSlides(indiceAtual + 1);
  }

  function iniciarAutoPlay() {
    pararAutoPlay();
    intervalo = setInterval(proximoSlide, 7000);
  }

  function pararAutoPlay() {
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      atualizarSlides(indiceAtual - 1);
      iniciarAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      atualizarSlides(indiceAtual + 1);
      iniciarAutoPlay();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      atualizarSlides(i);
      iniciarAutoPlay();
    });
  });

  // Pausar ao passar o mouse sobre o carrossel
  destaqueContainer.addEventListener("mouseenter", pararAutoPlay);
  destaqueContainer.addEventListener("mouseleave", iniciarAutoPlay);

  // "Ver todos os eventos" dentro do overlay
  const btnsSaibaMais = destaqueContainer.querySelectorAll(
    ".evento-destaque-saiba-mais"
  );
  btnsSaibaMais.forEach((btn) => {
    btn.addEventListener("click", () => {
      mostrarTodosEventos();
      const listaSec = document.getElementById("lista-eventos");
      if (listaSec) {
        listaSec.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  iniciarAutoPlay();
}

// ===================== LISTA COMPLETA DE EVENTOS =====================

function criarCardEventoGrade(evento) {
  const card = document.createElement("article");
  card.classList.add("evento-card");
  card.classList.add("evento-card--anim");

  const inicioTexto = formatarIsoParaTexto(evento.dataISO);
  const TEXTO_MAX = 140;
  const descricaoCompleta = evento.descricao || "";
  const precisaCortar = descricaoCompleta.length > TEXTO_MAX;
  const descricaoCurta = precisaCortar
    ? descricaoCompleta.slice(0, TEXTO_MAX) + "..."
    : descricaoCompleta;

  const mapsUrl = gerarLinkMaps(evento.enderecoMaps);
  const calendarUrl = gerarLinkGoogleCalendar(evento);

  card.innerHTML = `
    <div class="evento-card__imagem-topo">
      <img src="${evento.imageUrl || ""}" alt="${evento.titulo}" />
    </div>
    <div class="evento-card__info">
      <h4>${evento.titulo}</h4>
      <p class="evento-card__local">${evento.local}</p>
      <p class="evento-card__datas">
        <strong>Data:</strong> ${inicioTexto}
      </p>
      <p class="evento-card__descricao">
        <span class="evento-card__descricao-texto">${descricaoCurta}</span>
        ${
          precisaCortar
            ? `<button class="evento-card__ler-mais" type="button">Ler mais</button>`
            : ""
        }
      </p>
      <div class="evento-card__acoes">
        <a 
          href="${calendarUrl}" 
          class="btn btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Salvar na agenda
        </a>
        <a 
          href="${mapsUrl}" 
          class="btn btn-sm btn-outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver rota
        </a>
      </div>
    </div>
  `;

  if (precisaCortar) {
    const btnLerMais = card.querySelector(".evento-card__ler-mais");
    const spanTexto = card.querySelector(".evento-card__descricao-texto");
    let expandido = false;

    btnLerMais.addEventListener("click", () => {
      expandido = !expandido;
      if (expandido) {
        spanTexto.textContent = descricaoCompleta;
        btnLerMais.textContent = "Ler menos";
      } else {
        spanTexto.textContent = descricaoCurta;
        btnLerMais.textContent = "Ler mais";
      }
    });
  }

  return card;
}

function mostrarTodosEventos(lista = eventos) {
  const listaEventosEl = document.getElementById("lista-eventos");
  if (!listaEventosEl) return;

  listaEventosEl.innerHTML = "";

  lista.forEach((evento) => {
    const card = criarCardEventoGrade(evento);
    listaEventosEl.appendChild(card);
  });

  aplicarAnimacaoEntrada(".evento-card--anim");
}

// ===================== ANIMAÇÕES SIMPLES DE ENTRADA =====================

function aplicarAnimacaoEntrada(selector) {
  const elementos = document.querySelectorAll(selector);

  elementos.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition =
      "opacity 0.5s ease-out, transform 0.5s ease-out";

    const delay = 0.05 * index;
    el.style.transitionDelay = `${delay}s`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  });
}

// ===================== FILTROS =====================

function configurarFiltros() {
  const filtroMes = document.getElementById("filtro-mes");
  const filtroLocal = document.getElementById("filtro-local");
  const filtroTipo = document.getElementById("filtro-tipo");
  const buscaInput = document.getElementById("busca-eventos");

  function filtrarEventos() {
    const mesValor = filtroMes?.value || "";
    const localValor = filtroLocal?.value || "";
    const tipoValor = filtroTipo?.value || "";
    const buscaTexto = (buscaInput?.value || "").toLowerCase();

    const filtrados = eventos.filter((evento) => {
      const atendeMes =
        !mesValor ||
        (evento.dataISO && evento.dataISO.slice(5, 7) === mesValor);

      const atendeLocal =
        !localValor ||
        evento.cidade === localValor ||
        localValor === "regiao-oeste";

      const atendeTipo = !tipoValor || evento.tipo === tipoValor;

      const atendeBusca =
        !buscaTexto ||
        evento.titulo.toLowerCase().includes(buscaTexto) ||
        evento.descricao.toLowerCase().includes(buscaTexto) ||
        evento.local.toLowerCase().includes(buscaTexto);

      return atendeMes && atendeLocal && atendeTipo && atendeBusca;
    });

    mostrarTodosEventos(filtrados);
  }

  if (filtroMes) filtroMes.addEventListener("change", filtrarEventos);
  if (filtroLocal) filtroLocal.addEventListener("change", filtrarEventos);
  if (filtroTipo) filtroTipo.addEventListener("change", filtrarEventos);
  if (buscaInput) buscaInput.addEventListener("input", filtrarEventos);
}

// ===================== BOTÃO "VER TODOS OS EVENTOS" =====================

function configurarBotaoVerTodos() {
  const btnVer = document.querySelector(".eventos__ver-mais .btn");
  if (!btnVer) return;

  let mostrandoTudo = false;

  btnVer.addEventListener("click", () => {
    mostrandoTudo = !mostrandoTudo;
    const listaSec = document.getElementById("lista-eventos");

    if (mostrandoTudo) {
      mostrarTodosEventos(eventos);
      btnVer.textContent = "Ver menos eventos";
      if (listaSec) {
        listaSec.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      if (listaSec) {
        listaSec.innerHTML = "";
      }
      btnVer.textContent = "Ver todos os eventos";
      // Opcional: voltar para o topo da seção de eventos ao fechar
      const eventosSec = document.getElementById("eventos");
      if (eventosSec) {
        eventosSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// ===================== NAVEGAÇÃO MÁGICA =====================

function configurarNavegacaoMagica() {
  const navList = document.querySelector(".nav__list");
  const indicator = document.querySelector(".nav__indicator");
  const links = document.querySelectorAll(".nav__list a");
  const sections = document.querySelectorAll("section[id]");

  function moveIndicator(target) {
    if (!target || !indicator) return;
    const rect = target.getBoundingClientRect();
    const navRect = navList.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - navRect.left}px`;
    indicator.style.opacity = "1";
  }

  // Atualiza ao clicar
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
    });
  });

  // Atualiza ao scrollar
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
        moveIndicator(link);
      }
    });
  });

  // Inicializa na posição atual
  const activeLink = document.querySelector(".nav__list a.active");
  if (activeLink) {
    setTimeout(() => moveIndicator(activeLink), 100);
  }
}

// ===================== MINI CARROSSEL HERO =====================

function configurarMiniCarrosselHero() {
  const container = document.getElementById("hero-mini-carousel");
  if (!container) return;

  const slides = container.querySelectorAll(".mini-carousel__slide");
  let currentIndex = 0;
  let interval = null;
  let isHovered = false;

  function showNextSlide() {
    if (isHovered) return;
    
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }

  // Inicializa o primeiro slide
  if (slides.length > 0) {
    slides[0].classList.add("active");
    interval = setInterval(showNextSlide, 4000);
  }

  container.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  container.addEventListener("mouseleave", () => {
    isHovered = false;
  });
}

// ===================== INICIALIZAÇÃO =====================

document.addEventListener("DOMContentLoaded", async () => {
  const eventosPrefeitura = await carregarEventosPrefeitura();

  eventos = eventosPrefeitura;

  // ordena por data de início
  eventos.sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));

  // carrossel com 3 eventos mais próximos
  renderizarCarrosselDestaque(eventos);

  // inicialmente, não mostra lista (deixa vazia); só ao clicar em "Ver todos"
  const listaEventosEl = document.getElementById("lista-eventos");
  if (listaEventosEl) {
    listaEventosEl.innerHTML = "";
  }

  configurarFiltros();
  configurarBotaoVerTodos();
  configurarNavegacaoMagica();
  configurarMiniCarrosselHero();
});

// ===================== MINI CARROSSEL HERO =====================

function configurarMiniCarrosselHero() {
  const container = document.getElementById("hero-mini-carousel");
  if (!container) return;

  const slides = container.querySelectorAll(".mini-carousel__slide");
  if (slides.length === 0) return;

  let currentIndex = 0;
  let interval = null;
  let isHovered = false;

  function showNextSlide() {
    if (isHovered) return;
    
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("active");
  }

  // Inicializa o primeiro slide e limpa duplicatas de classes se houver
  slides.forEach((s, i) => {
    s.classList.remove("active");
    if (i === 0) s.classList.add("active");
  });
  
  if (interval) clearInterval(interval);
  interval = setInterval(showNextSlide, 3000);

  container.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  container.addEventListener("mouseleave", () => {
    isHovered = false;
  });
}