// ========================
// ACADEMIA DE CÓDIGO — DADOS E UI
// ========================
// Cada lição conecta um conceito de programação com uma mecânica do jogo.
// Estrutura:
//   TRILHAS[wi] = { world, name, color, icon, lessons: [...] }
//   lesson.quiz = { type: 'multiple' | 'code', ... }

const TRILHAS = [
  // ===== TRILHA 0 — Mundo Básico (Lógica e Instruções) =====
  {
    world: 0,
    name: 'Fundamentos',
    icon: '🟢',
    color: '#16a34a',
    lessons: [
      {
        id: 'basico-1',
        icon: '📦',
        title: 'Algoritmos e Sequência',
        concept: 'Um <b>algoritmo</b> é uma receita: uma sequência de passos simples e ordenados para resolver um problema [citation:1][citation:14]. Pense em como você faz um sanduíche. Se você passar o queijo antes de abrir o pão, a ordem está errada. O computador é como um chef que só entende a receita exata, passo a passo.',
        code: `<span class="com">// Algoritmo: Mover até o alvo</span>\n<span class="num">1.</span> Olhar para a direita\n<span class="num">2.</span> Se houver espaço, andar\n<span class="num">3.</span> Repetir`,
        connection: 'No jogo, cada fase é um problema. Você não pode simplesmente "teleportar" para o alvo. Você precisa dar comandos em sequência: "mover direita", depois "mover direita" de novo.',
        quiz: { type: 'multiple', question: 'Qual das opções abaixo é um exemplo de algoritmo do dia a dia?', options: ['Uma receita de bolo', 'Uma nuvem no céu', 'Um sonho', 'O vento'], correct: 0, explanation: 'Receitas, manuais e tutoriais são algoritmos: listas de passos para chegar a um resultado.' }
      },
      {
        id: 'basico-2',
        icon: '🔀',
        title: 'Tomada de Decisão (Condicionais)',
        concept: 'Na programação, usamos o <b>Se... Então (If/Else)</b> para tomar decisões. É como na vida real: "Se estiver chovendo, levo guarda-chuva; senão, uso óculos de sol" [citation:15]. O computador verifica uma condição e escolhe um caminho.',
        code: `<span class="kw">Se</span> (porta_estiver_fechada) {\n  Procurar_chave();\n} <span class="kw">Senão</span> {\n  Entrar();\n}`,
        connection: 'O personagem do jogo não atravessa paredes porque existe uma condição: "Se a próxima célula for parede, bloqueie o movimento". A porta do Mundo dos Interruptores só abre "Se" o botão estiver pressionado.',
        quiz: { type: 'multiple', question: 'Em um jogo, se o personagem tem 0 de vida, o que o código "Se (vida == 0) { Morrer(); }" faz?', options: ['O personagem continua andando', 'O personagem morre', 'O jogo fecha', 'O personagem ganha vida'], correct: 1, explanation: 'A condição é verdadeira (vida igual a zero), então a ação "Morrer()" é executada.' }
      },
      {
        id: 'basico-3',
        icon: '🎯',
        title: 'Entrada e Saída (I/O)',
        concept: 'Todo programa tem um ciclo: recebe dados (<b>Entrada</b>), processa e gera um resultado (<b>Saída</b>) [citation:3][citation:15]. Pense em uma calculadora: você digita "2 + 2" (Entrada), ela calcula (Processamento) e mostra "4" na tela (Saída).',
        code: `<span class="com">// Entrada</span>\ntecla = <span class="str">'direita'</span>;\n<span class="com">// Processamento</span>\nmover_personagem(tecla);\n<span class="com">// Saída (Você vê o personagem andar)</span>`,
        connection: 'No jogo, sua <b>Entrada</b> são as setas do teclado ou os comandos digitados. O <b>Processamento</b> é o motor do jogo calculando colisões. A <b>Saída</b> é o personagem se movendo na tela e alcançando o alvo.',
        quiz: { type: 'multiple', question: 'Quando você digita "mover direita" no modo Expert, isso é considerado:', options: ['Uma Saída', 'Uma Entrada', 'Um Loop', 'Um Erro'], correct: 1, explanation: 'O que o jogador envia para o sistema é sempre a Entrada. O movimento na tela é a Saída.' }
      }
    ]
  },

  // ===== TRILHA 1 — Mundo das Vinhas (Estado e Memória) =====
  {
    world: 1,
    name: 'Estado e Memória',
    icon: '🌿',
    color: '#16a34a',
    lessons: [
      {
        id: 'vinhas-1',
        icon: '🌱',
        title: 'Variáveis e Flags',
        concept: 'Uma <b>variável</b> é como uma caixa etiquetada onde guardamos um valor. Uma <b>flag</b> é uma variável especial que só guarda "Verdadeiro" ou "Falso" (Ligado/Desligado) [citation:3]. Pense no interruptor da luz: ele guarda o estado "Ligado" ou "Desligado".',
        code: `esta_preso = <span class="kw">Falso</span>;\n<span class="com">// Ao pisar na vinha:</span>\nesta_preso = <span class="kw">Verdadeiro</span>;`,
        connection: 'Quando você entra na vinha, o jogo liga a flag "esta_preso". O jogo "lembra" que você está preso e exige um segundo comando para te libertar. Se você sair da vinha, a flag volta a ser "Falso".',
        quiz: { type: 'multiple', question: 'Para que serve a flag `esta_preso` na vinha?', options: ['Para desenhar a planta', 'Para lembrar o jogo que você precisa de dois comandos', 'Para mover a caixa', 'Para apagar o personagem'], correct: 1, explanation: 'Flags guardam estados. `esta_preso = Verdadeiro` avisa ao motor que o próximo comando deve soltar você.' }
      },
      {
        id: 'vinhas-2',
        icon: '🧠',
        title: 'Estado do Jogo',
        concept: 'O <b>estado</b> é o conjunto de todas as informações do jogo naquele exato momento: a posição do jogador, a posição da caixa, se está preso, se a porta está aberta. É como um "print" da sua partida.',
        code: `jogador = {\n  x: <span class="num">3</span>,\n  y: <span class="num">2</span>,\n  preso: <span class="kw">Verdadeiro</span>\n};`,
        connection: 'Se você reiniciar a fase (apertar R), o jogo apaga o estado atual e recria o estado inicial do zero: posições originais, portas fechadas e o contador de movimentos zerado.',
        quiz: { type: 'code', question: 'Complete a flag para marcar que o jogador está preso:', template: 'jogador.____ = Verdadeiro;', answer: 'preso', hint: 'Usamos a palavra em português "preso".' }
      }
    ]
  },

  // ===== TRILHA 2 — Mundo Gelado (Loops e Fluxo) =====
  {
    world: 2,
    name: 'Loops e Fluxo',
    icon: '❄️',
    color: '#22d3ee',
    lessons: [
      {
        id: 'gelo-1',
        icon: '🔁',
        title: 'Loops (Repetição)',
        concept: 'Um <b>loop</b> (laço de repetição) faz o computador repetir uma instrução várias vezes sem você precisar escrever o mesmo código repetidamente [citation:3][citation:14]. Pense em escovar os dentes: você não pensa "escovo o dente 1, escovo o dente 2...", você faz um movimento repetitivo até terminar.',
        code: `<span class="kw">Enquanto</span> (celulaAtual == <span class="str">'gelo'</span>) {\n  andarMaisUm();\n}`,
        connection: 'Ao empurrar a caixa no gelo, o jogo entra num loop: ele repete o comando "andar" enquanto a célula for de gelo. Quando a condição falha (ele sai do gelo), o loop para automaticamente.',
        quiz: { type: 'multiple', question: 'No gelo, quando o loop `Enquanto` para?', options: ['Depois de 3 repetições', 'Ao sair da célula de gelo', 'Ao bater em uma parede', 'Nunca para'], correct: 1, explanation: 'O loop continua enquanto a condição "estou no gelo" for verdadeira. Quando você sai, a condição vira falsa e o loop para.' }
      },
      {
        id: 'gelo-2',
        icon: '⚙️',
        title: 'Condições Compostas (E / OU)',
        concept: 'Você pode juntar duas verificações usando operadores lógicos. O <b>E (&&)</b> exige que as duas condições sejam verdadeiras. O <b>OU (||)</b> exige que pelo menos uma seja verdadeira [citation:6].',
        code: `<span class="kw">Se</span> (tem_chave <span class="kw">E</span> porta_fechada) {\n  Abrir_porta();\n}`,
        connection: 'Para o personagem andar, ele precisa satisfazer duas condições: o caminho deve ser válido (não ser parede) <b>E</b> não pode ter uma caixa bloqueando o caminho. Se qualquer uma falhar, o movimento é bloqueado.',
        quiz: { type: 'code', question: 'Complete a condição para andar somente se não houver parede:', template: 'Se (podeAndar ____ !temParede) { mover(); }', answer: '&&', hint: 'Precisamos que as duas condições sejam verdadeiras ao mesmo tempo.' }
      }
    ]
  },

  // ===== TRILHA 3 — Mundo dos Interruptores (Eventos) =====
  {
    world: 3,
    name: 'Eventos e Portas',
    icon: '🚪',
    color: '#f97316',
    lessons: [
      {
        id: 'portas-1',
        icon: '🔗',
        title: 'Lógica Booleana',
        concept: 'A <b>Lógica Booleana</b> é a base dos computadores. Ela trabalha com dois valores: Verdadeiro (1) e Falso (0) [citation:12]. Um botão pode estar pressionado (Verdadeiro) ou solto (Falso). Uma porta pode estar aberta (Verdadeiro) ou fechada (Falso).',
        code: `<span class="kw">Se</span> (botao_pressionado == <span class="kw">Verdadeiro</span>) {\n  porta_aberta = <span class="kw">Verdadeiro</span>;\n}`,
        connection: 'A porta do Mundo dos Interruptores só abre quando a condição do botão é Verdadeira. Se você sair do botão, a condição se torna Falsa e a porta fecha novamente.',
        quiz: { type: 'multiple', question: 'O que acontece se a condição do botão for `Falso`?', options: ['A porta abre', 'A porta fica fechada', 'O jogo trava', 'O botão some'], correct: 1, explanation: 'O comando "Se" só executa a ação se a condição for Verdadeira. Se for Falsa, a porta continua fechada.' }
      },
      {
        id: 'portas-2',
        icon: '📡',
        title: 'Eventos e Callbacks',
        concept: 'Um <b>evento</b> é algo que acontece (como pisar no botão). Um <b>callback</b> é uma função que o jogo "chama" automaticamente quando o evento ocorre [citation:3]. É como uma campainha: você não fica olhando para a porta o tempo todo; você espera o som tocar (evento) para então atender (callback).',
        code: `botao.addEventListener(<span class="str">'pisar'</span>, () => {\n  porta.abrir();\n});`,
        connection: 'Você não precisa verificar o botão a cada segundo. O jogo usa eventos: "quando o jogador pisar no botão, execute esta ação (a porta abrir)".',
        quiz: { type: 'code', question: 'Complete a função que roda quando o botão é pisado:', template: 'botao.addEventListener(\'pisar\', () => { ____.abrir(); });', answer: 'porta', hint: 'É o objeto que queremos abrir.' }
      }
    ]
  },

  // ===== TRILHA 4 — Mundo Mestre (Algoritmos e Filas) =====
  {
    world: 4,
    name: 'Algoritmos',
    icon: '💀',
    color: '#ef4444',
    lessons: [
      {
        id: 'mestre-1',
        icon: '🧭',
        title: 'Filas (Queues) e Ordem',
        concept: 'Uma <b>fila</b> (ou Queue) é uma estrutura de dados onde o primeiro a entrar é o primeiro a sair (FIFO - First In, First Out) [citation:5][citation:11]. É como a fila do supermercado ou do cinema: quem chegou primeiro é atendido primeiro.',
        code: `fila = [<span class="str">'direita'</span>, <span class="str">'direita'</span>, <span class="str">'cima'</span>];\n<span class="com">// O jogo executa: direita, depois direita, depois cima.</span>`,
        connection: 'A nossa "Caixa de Comandos" no Modo Expert é uma fila! Ela processa o primeiro item, remove da fila e passa para o próximo com um pequeno intervalo de tempo. Você adiciona os comandos na ordem que quer que sejam executados.',
        quiz: { type: 'multiple', question: 'Em uma fila (FIFO), qual comando executa primeiro?', options: ['O último que entrou', 'O primeiro que entrou', 'O mais rápido', 'Todos juntos'], correct: 1, explanation: 'FIFO significa "First In, First Out" (Primeiro a Entrar, Primeiro a Sair). O primeiro comando adicionado é o primeiro a ser executado.' }
      },
      {
        id: 'mestre-2',
        icon: '⚖️',
        title: 'Otimização e Eficiência',
        concept: 'Um bom programador não busca apenas fazer o código funcionar, mas fazê-lo com a melhor <b>eficiência</b> possível, gastando menos recursos e tempo [citation:2]. Pense em dar instruções para alguém: você pode dizer "vire à direita, ande, vire à direita, ande..." ou simplesmente "siga em frente e vire à direita na segunda esquina".',
        code: `<span class="com">// Ruim (Muitos comandos)</span>\ndireita; direita; direita; direita;\n<span class="com">// Ótimo (Loop)</span>\nrepetir 4 vezes: direita;`,
        connection: 'No jogo, a sua <b>Nota (0 a 100)</b> é maior se você fizer menos movimentos. Além disso, no modo Expert, usar o comando de repetição evita que você digite dezenas de linhas e deixa seu algoritmo mais "limpo".',
        quiz: { type: 'code', question: 'Qual palavra-chave usamos no jogo para não repetir comandos?', template: '____ 4 vezes mover direita;', answer: 'repetir', hint: 'É o comando de loop do Modo Expert.' }
      }
    ]
  }
];
  
  // ========================
  // ESTADO E SAVE
  // ========================
  function ensureAcademySave() {
    if (!saveData.academy) {
      saveData.academy = { completedLessons: {}, quizScores: {} };
    }
    if (!saveData.academy.completedLessons) saveData.academy.completedLessons = {};
    if (!saveData.academy.quizScores) saveData.academy.quizScores = {};
  }
  
  function isLessonComplete(id) {
    ensureAcademySave();
    return !!saveData.academy.completedLessons[id];
  }
  
  function getAcademyProgress() {
    ensureAcademySave();
    const total = TRILHAS.reduce((s, t) => s + t.lessons.length, 0);
    const done = Object.keys(saveData.academy.completedLessons).filter(k => saveData.academy.completedLessons[k]).length;
    return { done, total, pct: total > 0 ? Math.round((done/total)*100) : 0 };
  }
  
  // Uma trilha está desbloqueada se o mundo correspondente está liberado
  function isTrilhaUnlocked(wi) {
    if (devMode) return true;
    if (wi === 0) return true;
    return saveData.worlds[wi]?.unlocked || false;
  }
  
  // Uma lição está desbloqueada se for a primeira OU a anterior foi concluída
  function isLessonUnlocked(trilhaIdx, lessonIdx) {
    if (devMode) return true;
    if (lessonIdx === 0) return true;
    const prevLesson = TRILHAS[trilhaIdx].lessons[lessonIdx - 1];
    return isLessonComplete(prevLesson.id);
  }
  
  // ========================
  // UI — TRILHAS
  // ========================
  function showAcademy() {
    initAudio();
    renderAcademy();
    showScreen('academy');
  }
  
  function renderAcademy() {
    ensureAcademySave();
    const grid = document.getElementById('trilhas-grid');
    if (!grid) return;
    grid.innerHTML = '';
  
    // Stats
    const stats = document.getElementById('academy-stats');
    const prog = getAcademyProgress();
    stats.innerHTML = `
      <div class="academy-stat">
        <span class="stat-val">${prog.done}/${prog.total}</span>
        <span class="stat-lbl">Lições</span>
      </div>
      <div class="academy-stat">
        <span class="stat-val">${prog.pct}%</span>
        <span class="stat-lbl">Concluído</span>
      </div>
    `;
  
    TRILHAS.forEach((trilha, ti) => {
      const unlocked = isTrilhaUnlocked(trilha.world);
      const doneCount = trilha.lessons.filter(l => isLessonComplete(l.id)).length;
      const pct = Math.round((doneCount / trilha.lessons.length) * 100);
  
      const card = document.createElement('div');
      card.className = 'trilha-card' + (unlocked ? '' : ' locked');
      card.style.setProperty('--trilha-color', trilha.color);
      card.innerHTML = `
        <span class="trilha-icon">${trilha.icon}</span>
        <div class="trilha-name">${trilha.name}</div>
        <div class="trilha-world">Mundo ${trilha.world + 1}</div>
        <div class="trilha-progress">
          <div class="trilha-progress-bar">
            <div class="trilha-progress-fill" style="width: ${pct}%"></div>
          </div>
          <div class="trilha-progress-text">${doneCount}/${trilha.lessons.length}</div>
        </div>
        ${unlocked ? '' : '<div class="trilha-lock">🔒</div>'}
      `;
  
      if (unlocked) {
        card.addEventListener('click', () => openTrilha(ti));
      }
      grid.appendChild(card);
    });
  }
  
  // ========================
  // UI — LIÇÕES DE UMA TRILHA
  // ========================
function openTrilha(ti) {
  const trilha = TRILHAS[ti];
  const cont = document.getElementById('lesson-container');
  cont.innerHTML = `
    <div class="lesson-top">
      <span class="lesson-icon">${trilha.icon}</span>
      <div class="lesson-title-wrap">
        <div class="lesson-title">${trilha.name}</div>
        <div class="lesson-world-tag">Mundo ${trilha.world + 1}</div>
      </div>
    </div>
    <div class="lesson-section">
      <div class="lesson-section-label">Lições</div>
      <div class="quiz-options" id="lessons-list"></div>
    </div>
  `;
  
  const list = document.getElementById('lessons-list');
  trilha.lessons.forEach((lesson, li) => {
    const unlocked = isLessonUnlocked(ti, li);
    const done = isLessonComplete(lesson.id);
    const btn = document.createElement('button');
    btn.className = 'quiz-opt' + (done ? ' correct' : '');
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '10px';
    btn.innerHTML = `
      <span style="font-size:1.2rem">${lesson.icon}</span>
      <span style="flex:1;text-align:left">${lesson.title}</span>
      <span>${done ? '✅' : (unlocked ? '▶' : '🔒')}</span>
    `;
    
    if (unlocked) {
      // Adiciona o evento de forma segura
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLesson(ti, li);
      });
    } else {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
    }
    list.appendChild(btn);
  });

  // Garante que a tela só mude se já não estivermos nela
  if (currentScreen !== 'lesson') {
    showScreen('lesson');
  }
}
  // ========================
  // UI — LIÇÃO INDIVIDUAL
  // ========================
  let currentLessonCtx = { ti: 0, li: 0, answered: false };

  function openLesson(ti, li) {
    const trilha = TRILHAS[ti];
    const lesson = trilha.lessons[li];
    currentLessonCtx = { ti, li, answered: false };
  
    const cont = document.getElementById('lesson-container');
    cont.innerHTML = `
      <div class="lesson-top">
        <span class="lesson-icon">${lesson.icon}</span>
        <div class="lesson-title-wrap">
          <div class="lesson-title">${lesson.title}</div>
          <div class="lesson-world-tag">${trilha.name} · Lição ${li + 1}</div>
        </div>
      </div>
  
      <div class="lesson-section">
        <div class="lesson-section-label">Conceito</div>
        <div class="lesson-text">${lesson.concept}</div>
      </div>
  
      <div class="lesson-section">
        <div class="lesson-section-label">Exemplo</div>
        <pre class="lesson-code">${lesson.code}</pre>
      </div>
  
      <div class="lesson-section">
        <div class="lesson-section-label">No jogo</div>
        <div class="lesson-connection">${lesson.connection}</div>
      </div>
  
      <div class="lesson-section">
        <div class="lesson-section-label">Desafio</div>
        <div class="quiz-box" id="quiz-box"></div>
      </div>
  
      <div class="lesson-nav">
        <button type="button" class="lesson-btn" id="lesson-back">← Voltar</button>
        <button type="button" class="lesson-btn primary" id="lesson-next" disabled>Próxima →</button>
      </div>
    `;
  
    renderQuiz(lesson, ti, li);
  
    document.getElementById('lesson-back').addEventListener('click', (e) => {
      e.preventDefault();
      openTrilha(ti);
    });
    document.getElementById('lesson-next').addEventListener('click', (e) => {
      e.preventDefault();
      const nextLi = li + 1;
      if (nextLi < trilha.lessons.length) {
        openLesson(ti, nextLi);
      } else {
        openTrilha(ti);
      }
    });
  
    // Só chama showScreen se a tela ainda não está visível
    const el = document.getElementById('screen-lesson');
    if (currentScreen !== 'lesson' || el.classList.contains('hidden')) {
      showScreen('lesson');
    }
  }
  
  function renderQuiz(lesson, ti, li) {
    const box = document.getElementById('quiz-box');
    const q = lesson.quiz;
    if (!q) { box.innerHTML = '<div class="lesson-text">Sem quiz.</div>'; return; }
  
    if (q.type === 'multiple') {
      box.innerHTML = `
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options" id="quiz-opts"></div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
      `;
      const opts = document.getElementById('quiz-opts');
      q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'quiz-opt';
        b.textContent = opt;
        b.addEventListener('click', () => answerMultiple(i, q, ti, li));
        opts.appendChild(b);
      });
    } else if (q.type === 'code') {
      const template = q.template;
      const parts = template.split('____');
      box.innerHTML = `
        <div class="quiz-question">${q.question}</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:'Courier New',monospace;font-size:0.95rem;background:#0a0a12;border-left:3px solid #a855f7;padding:16px;border-radius:8px;">
          <span>${parts[0]}</span>
          <input id="quiz-code-input" type="text" autocomplete="off" spellcheck="false"
            style="background:rgba(168,85,247,0.1);border:1.5px solid rgba(168,85,247,0.5);border-radius:6px;padding:6px 10px;color:#c896ff;font-family:inherit;font-size:inherit;outline:none;min-width:100px;text-align:center;"
            placeholder="...">
          <span>${parts[1] || ''}</span>
        </div>
        <div class="quiz-feedback" id="quiz-feedback"></div>
        <div class="quiz-actions">
          <button class="lesson-btn primary" id="quiz-submit">Verificar</button>
        </div>
        ${q.hint ? `<div class="lesson-text" style="margin-top:8px;font-size:0.85rem;color:#6b7280;">💡 Dica: ${q.hint}</div>` : ''}
      `;
      const input = document.getElementById('quiz-code-input');
      input.focus();
      document.getElementById('quiz-submit').addEventListener('click', () => answerCode(input.value, q, ti, li));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') answerCode(input.value, q, ti, li);
      });
    }
  }
  
  function answerMultiple(idx, q, ti, li) {
    if (currentLessonCtx.answered) return;
    currentLessonCtx.answered = true;
    const opts = document.querySelectorAll('#quiz-opts .quiz-opt');
    opts.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    const isCorrect = idx === q.correct;
    showQuizFeedback(isCorrect, q.explanation, ti, li);
  }
  
  function answerCode(value, q, ti, li) {
    if (currentLessonCtx.answered) return;
    currentLessonCtx.answered = true;
    const normalized = value.trim().toLowerCase().replace(/;/g, '');
    const expected = q.answer.toLowerCase().replace(/;/g, '');
    const isCorrect = normalized === expected;
    const input = document.getElementById('quiz-code-input');
    if (input) input.disabled = true;
    const submit = document.getElementById('quiz-submit');
    if (submit) submit.disabled = true;
    const fb = document.getElementById('quiz-feedback');
    showQuizFeedback(isCorrect, isCorrect ? 'Correto!' : `A resposta esperada era: "${q.answer}"`, ti, li);
  }
  
  function showQuizFeedback(isCorrect, msg, ti, li) {
    const fb = document.getElementById('quiz-feedback');
    fb.classList.add('show', isCorrect ? 'ok' : 'err');
    fb.innerHTML = (isCorrect ? '✅ ' : '❌ ') + msg;
  
    if (isCorrect) {
      // Marca como completo
      ensureAcademySave();
      saveData.academy.completedLessons[TRILHAS[ti].lessons[li].id] = true;
      persistSave();
      // Habilita "Próxima"
      const next = document.getElementById('lesson-next');
      if (next) next.disabled = false;
    } else {
      // Permite tentar de novo após 1.5s
      setTimeout(() => {
        currentLessonCtx.answered = false;
        const input = document.getElementById('quiz-code-input');
        if (input) { input.disabled = false; input.value = ''; input.focus(); }
        const submit = document.getElementById('quiz-submit');
        if (submit) submit.disabled = false;
        // Para múltipla escolha, recarrega os botões
        const opts = document.querySelectorAll('#quiz-opts .quiz-opt');
        if (opts.length > 0) {
          opts.forEach(b => {
            b.disabled = false;
            b.classList.remove('correct', 'wrong');
          });
        }
        fb.classList.remove('show');
      }, 1600);
    }
  }
  
// ========================
// HOOKS DE NAVEGAÇÃO (Blindados)
// ========================
function wireAcademyButtons() {
  const btn = document.getElementById('academy-btn');
  if (btn && !btn._wired) {
    btn._wired = true;
    btn.addEventListener('click', showAcademy);
  }

  const backAcademy = document.getElementById('back-to-academy');
  if (backAcademy && !backAcademy._wired) {
    backAcademy._wired = true;
    backAcademy.addEventListener('click', () => {
      renderAcademy();
      showScreen('academy');
    });
  }

  const backTitle = document.getElementById('back-to-title-from-academy');
  if (backTitle && !backTitle._wired) {
    backTitle._wired = true;
    backTitle.addEventListener('click', () => showScreen('title'));
  }
}

// Executa imediatamente se o DOM já estiver pronto, senão espera
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireAcademyButtons);
} else {
  wireAcademyButtons();
}

function showAcademy() {
  if (typeof initAudio === 'function') initAudio();
  renderAcademy();          // Preenche as trilhas
  showScreen('academy');    // Mostra a tela
}
window.showAcademy = showAcademy;