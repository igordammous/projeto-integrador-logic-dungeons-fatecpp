// ========================
// ACADEMIA DE CÓDIGO — DADOS E UI
// ========================
// Cada lição conecta um conceito de programação com uma mecânica do jogo.
// Estrutura:
//   TRILHAS[wi] = { world, name, color, icon, lessons: [...] }
//   lesson.quiz = { type: 'multiple' | 'code', ... }

const TRILHAS = [
    // ===== TRILHA 0 — Mundo Básico =====
    {
      world: 0,
      name: 'Fundamentos',
      icon: '🟢',
      color: '#16a34a',
      lessons: [
        {
          id: 'basico-1',
          icon: '📦',
          title: 'Variáveis e Mutação',
          concept: 'Uma <b>variável</b> é um nome que aponta para um valor. Você pode mudar esse valor a qualquer momento — isso se chama <b>reatribuição</b>. No jogo, a posição da caixa é uma variável: ela muda toda vez que você empurra.',
          code: `let caixa_x = <span class="num">3</span>;       <span class="com">// caixa está na coluna 3</span>
  caixa_x = caixa_x + <span class="num">1</span>; <span class="com">// agora vale 4</span>`,
          connection: 'Empurrar uma caixa é <b>reatribuir</b> a posição dela. Se `caixa_x = 3` e você empurra para a direita, `caixa_x` passa a valer 4.',
          quiz: {
            type: 'multiple',
            question: 'Se `caixa_x = 3` e fazemos `caixa_x = caixa_x + 1`, qual o novo valor?',
            options: ['3', '4', 'caixa_x', 'Nada'],
            correct: 1,
            explanation: 'A variável é reatribuída ao valor anterior (3) somado a 1 → 4.'
          }
        },
        {
          id: 'basico-2',
          icon: '🔀',
          title: 'Condições (if/else)',
          concept: 'Um <b>if</b> executa um bloco de código <i>somente se</i> uma condição for verdadeira. O <b>else</b> é o caminho alternativo. Isso é a base de toda decisão em programação.',
          code: `<span class="kw">if</span> (proximaCelula === <span class="str">'parede'</span>) {
    <span class="com">// não pode andar</span>
  } <span class="kw">else</span> {
    <span class="com">// pode andar</span>
  }`,
          connection: 'O jogo não deixa você atravessar paredes porque existe um <b>if</b> verificando se a célula de destino é válida.',
          quiz: {
            type: 'multiple',
            question: 'Se `proximaCelula === \'parede\'`, o que acontece?',
            options: [
              'O jogo trava',
              'O personagem anda mesmo assim',
              'O movimento é bloqueado',
              'A parede desaparece'
            ],
            correct: 2,
            explanation: 'O `if` é verdadeiro, então o movimento é bloqueado — o `else` não roda.'
          }
        },
        {
          id: 'basico-3',
          icon: '🔁',
          title: 'Repetição (while)',
          concept: 'Um <b>while</b> repete um bloco enquanto uma condição for verdadeira. Quando a condição fica falsa, o loop para. É assim que o jogo sabe quando você terminou uma fase.',
          code: `<span class="kw">while</span> (!faseCompleta) {
    lerTecla();
    mover();
  }`,
          connection: 'O jogo fica <b>rodando em loop</b> esperando você mover a caixa até o alvo. Quando todas as caixas chegam, `faseCompleta` vira verdadeiro e o loop termina.',
          quiz: {
            type: 'multiple',
            question: 'Quando o loop `while (!faseCompleta)` para?',
            options: [
              'Depois de 10 movimentos',
              'Quando `faseCompleta` vira `true`',
              'Nunca para',
              'Quando você aperta ESC'
            ],
            correct: 1,
            explanation: 'Enquanto `!faseCompleta` for `true`, o loop continua. Quando `faseCompleta` vira `true`, `!faseCompleta` vira `false` e o loop para.'
          }
        }
      ]
    },
  
    // ===== TRILHA 1 — Mundo das Vinhas =====
    {
      world: 1,
      name: 'Estado e Memória',
      icon: '🌿',
      color: '#16a34a',
      lessons: [
        {
          id: 'vinhas-1',
          icon: '🌱',
          title: 'Flags (estados booleanos)',
          concept: 'Uma <b>flag</b> é uma variável booleana (`true`/`false`) que guarda um estado. O jogo usa flags para lembrar que uma caixa está presa em uma vinha.',
          code: `box.stuck = <span class="kw">false</span>;
  <span class="com">// ao entrar na vinha:</span>
  box.stuck = <span class="kw">true</span>;`,
          connection: 'A caixa <b>lembra</b> que está presa porque o jogo guardou essa informação em uma flag. Sem ela, o jogo não saberia que a caixa precisa de um empurrão extra para soltar.',
          quiz: {
            type: 'multiple',
            question: 'Para que serve a flag `box.stuck`?',
            options: [
              'Para desenhar a caixa',
              'Para lembrar que a caixa está presa',
              'Para mover a caixa',
              'Para deletar a caixa'
            ],
            correct: 1,
            explanation: 'Flags guardam estados. `box.stuck = true` significa "esta caixa está presa em uma vinha".'
          }
        },
        {
          id: 'vinhas-2',
          icon: '🧠',
          title: 'Estado persistente',
          concept: 'Quando algo <b>persiste</b>, ele continua existindo entre ações. O estado de um objeto é o conjunto de todas as suas variáveis naquele momento.',
          code: `box = {
    x: <span class="num">3</span>,
    y: <span class="num">2</span>,
    stuck: <span class="kw">true</span>,      <span class="com">// presa!</span>
    releaseDir: <span class="str">'direita'</span> <span class="com">// direção da soltura</span>
  };`,
          connection: 'A caixa na vinha guarda <b>duas</b> informações: que está presa e em qual direção você tentou soltá-la. Isso permite que o jogo exija o mesmo movimento duas vezes seguidas.',
          quiz: {
            type: 'code',
            question: 'Complete a flag para marcar a caixa como presa:',
            template: 'box.____ = true;',
            answer: 'stuck',
            hint: 'A propriedade que usamos no jogo é "stuck".'
          }
        }
      ]
    },
  
    // ===== TRILHA 2 — Mundo Gelado =====
    {
      world: 2,
      name: 'Loops e Iteração',
      icon: '❄️',
      color: '#22d3ee',
      lessons: [
        {
          id: 'gelo-1',
          icon: '⚡',
          title: 'while sem break',
          concept: 'Um <b>while</b> pode não ter um número fixo de repetições. Ele continua enquanto a condição for verdadeira — pode ser 1 vez ou 100 vezes.',
          code: `<span class="kw">while</span> (celulaAtual === <span class="str">'gelo'</span>) {
    andarMaisUm();
  }
  <span class="com">// para automaticamente ao sair do gelo</span>`,
          connection: 'Deslizar no gelo é um <b>while</b> que só para quando você sai da célula de gelo. O número de repetições depende do tamanho da pista.',
          quiz: {
            type: 'multiple',
            question: 'No gelo, o loop `while` para quando...?',
            options: [
              'Depois de 3 repetições',
              'Ao sair da célula de gelo',
              'Ao bater em uma parede',
              'Nunca para'
            ],
            correct: 1,
            explanation: 'A condição é `celulaAtual === \'gelo\'`. Assim que você pisa em uma célula que não é gelo, o loop termina.'
          }
        },
        {
          id: 'gelo-2',
          icon: '🎯',
          title: 'Controle de fluxo',
          concept: 'Você pode combinar condições com <b>&&</b> (E) e <b>||</b> (OU). Isso permite expressar regras complexas de forma compacta.',
          code: `<span class="kw">if</span> (podeAndar && !temParede) {
    mover();
  }`,
          connection: 'No jogo, mover exige <b>duas</b> condições: a célula é válida E não tem parede. Se qualquer uma falhar, o movimento é bloqueado.',
          quiz: {
            type: 'code',
            question: 'Complete a condição para andar somente se não houver parede:',
            template: 'if (podeAndar ____ !temParede) { mover(); }',
            answer: '&&',
            hint: 'Precisamos que as duas condições sejam verdadeiras ao mesmo tempo.'
          }
        }
      ]
    },
  
    // ===== TRILHA 3 — Mundo dos Interruptores =====
    {
      world: 3,
      name: 'Eventos e Condições',
      icon: '🚪',
      color: '#f97316',
      lessons: [
        {
          id: 'portas-1',
          icon: '🔗',
          title: 'if/else aninhados',
          concept: 'Um <b>if</b> dentro de outro <b>if</b> permite decisões em cascata. Cada nível refina a condição anterior.',
          code: `<span class="kw">if</span> (pisouNoBotao) {
    <span class="kw">if</span> (portaTrancada) {
      abrirPorta();
    }
  }`,
          connection: 'Abrir uma porta exige <b>duas</b> verificações: você pisou no botão E a porta está trancada. Só então ela abre.',
          quiz: {
            type: 'multiple',
            question: 'A porta abre se você pisou no botão mas ela já estava aberta?',
            options: [
              'Sim, sempre abre',
              'Não, porque o if interno é falso',
              'Depende da cor',
              'O jogo trava'
            ],
            correct: 1,
            explanation: '`portaTrancada` seria `false`, então o `if` interno não roda — a porta já está aberta, não precisa fazer nada.'
          }
        },
        {
          id: 'portas-2',
          icon: '📡',
          title: 'Eventos e callbacks',
          concept: 'Um <b>evento</b> é algo que acontece em um momento imprevisível (ex: apertar uma tecla). Um <b>callback</b> é a função que roda quando o evento acontece.',
          code: `botao.addEventListener(<span class="str">'click'</span>, () => {
    porta.abrir();
  });`,
          connection: 'Quando você pisa no botão, o jogo dispara um <b>evento</b> que faz a porta abrir. Você não precisa checar manualmente — o callback cuida disso.',
          quiz: {
            type: 'code',
            question: 'Complete a função que roda quando o botão é pisado:',
            template: 'botao.addEventListener(\'click\', () => { ____.abrir(); });',
            answer: 'porta',
            hint: 'É o objeto que queremos abrir.'
          }
        }
      ]
    },
  
    // ===== TRILHA 4 — Mundo Mestre =====
    {
      world: 4,
      name: 'Algoritmos',
      icon: '💀',
      color: '#ef4444',
      lessons: [
        {
          id: 'mestre-1',
          icon: '🧭',
          title: 'Pensamento algorítmico',
          concept: 'Um <b>algoritmo</b> é uma sequência finita de passos que resolve um problema. Antes de codar, você descreve os passos em português.',
          code: `<span class="com">// Algoritmo: empurrar caixa até o alvo</span>
  <span class="num">1.</span> Se a caixa está à direita, mova para a esquerda dela
  <span class="num">2.</span> Empurre na direção do alvo
  <span class="num">3.</span> Repita até chegar`,
          connection: 'Vencer uma fase do Mundo Mestre exige um <b>algoritmo</b>: uma ordem específica de movimentos que resolve tudo sem travar.',
          quiz: {
            type: 'multiple',
            question: 'O que é um algoritmo?',
            options: [
              'Um tipo de variável',
              'Uma sequência finita de passos para resolver um problema',
              'Um erro de programação',
              'Um comando do jogo'
            ],
            correct: 1,
            explanation: 'Algoritmo = receita de bolo. Passos finitos que levam a um resultado.'
          }
        },
        {
          id: 'mestre-2',
          icon: '⚖️',
          title: 'Otimização e complexidade',
          concept: 'Existem <b>várias</b> soluções para o mesmo problema, mas algumas usam menos recursos. <b>Otimizar</b> é encontrar a solução mais eficiente.',
          code: `<span class="com">// Solução A: 20 movimentos</span>
  <span class="com">// Solução B: 12 movimentos  ← melhor!</span>`,
          connection: 'No jogo, o <b>par</b> de movimentos define 3 estrelas. Uma fase pode ter várias soluções — a ótima é a que usa menos movimentos.',
          quiz: {
            type: 'code',
            question: 'Complete a comparação para checar se a solução A é melhor:',
            template: 'if (movimentosA ____ movimentosB) { elogiar(A); }',
            answer: '<',
            hint: 'Menos movimentos = melhor solução.'
          }
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
    // Renderiza uma "lista" de lições dentro da tela de lesson
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
        btn.addEventListener('click', () => openLesson(ti, li));
      } else {
        btn.disabled = true;
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
      }
      list.appendChild(btn);
    });
  
    showScreen('lesson');
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
  // HOOKS DE NAVEGAÇÃO
  // ========================
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('academy-btn');
    if (btn) btn.addEventListener('click', showAcademy);
  
    const backAcademy = document.getElementById('back-to-academy');
    if (backAcademy) backAcademy.addEventListener('click', () => {
      renderAcademy();
      showScreen('academy');
    });
  
    const backTitle = document.getElementById('back-to-title-from-academy');
    if (backTitle) backTitle.addEventListener('click', () => showScreen('title'));
  });
  
  // Expõe para o HTML (onclick inline, se preferir)
  window.showAcademy = showAcademy;