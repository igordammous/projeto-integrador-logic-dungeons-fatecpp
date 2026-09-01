// ========================
// LEVEL DATA
// ========================
// Tiles: 0=empty, 1=wall, 2=target, 3=box(in grid init only), 5=vine, 7=ice, 8=button, 9=door
// Vines (5): box entering a vine tile gets stuck. Need 1 extra push to break free.

// ========================
// SPRITES (pixel art)
// ========================
// Convenção de nomes de arquivo — coloque os PNGs em /sprites/ com esses nomes:
//   floor_<artType>.png / wall_<artType>.png  -> chão e parede de CADA MUNDO
//   box_<artType>.png                          -> "bloco" (caixa empurrável) de CADA MUNDO
//   player.png                                 -> PERSONAGEM (único, usado em todos os mundos)
// artType de cada mundo está definido em WORLDS / WORLDS_EXPERT (earth, vine, ice, door, master, tutorial)
// Se um arquivo não existir ou não carregar, o jogo automaticamente usa o desenho vetorial
// original como reserva (ver spriteReady/drawSprite) — não precisa remover nada daqui.
const SPRITE_FILES = {
  // Chão e parede por mundo
  floor_earth:    'sprites/floor_earth.png',
  wall_earth:     'sprites/wall_earth.png',
  floor_vine:     'sprites/floor_vine.png',
  wall_vine:      'sprites/wall_vine.png',
  floor_ice:      'sprites/floor_ice.png',
  wall_ice:       'sprites/wall_ice.png',
  floor_door:     'sprites/floor_door.png',
  wall_door:      'sprites/wall_door.png',
  floor_master:   'sprites/floor_master.png',
  wall_master:    'sprites/wall_master.png',
  floor_tutorial: 'sprites/floor_tutorial.png', // Mundo Tutorial Expert
  wall_tutorial:  'sprites/wall_tutorial.png',

  // Bloco (caixa empurrável) — mesmo sprite (estrela) em todos os mundos
  box_earth:      'star.png',
  box_vine:       'star.png',
  box_ice:        'star.png',
  box_door:       'star.png',
  box_master:     'star.png',
  box_tutorial:   'star.png',
};
const sprites = {};

// Personagem — sprite direcional (um PNG por direção, trocado conforme o movimento)
const playerSprites = { baixo: new Image(), cima: new Image(), direita: new Image(), esquerda: new Image() };
playerSprites.baixo.src    = 'baixo.png';
playerSprites.cima.src     = 'cima.png';
playerSprites.direita.src  = 'direita.png';
playerSprites.esquerda.src = 'esquerda.png';
let playerFacing = 'baixo';
let spritesLoaded = false; // vira true quando TODAS as imagens terminaram de tentar carregar (sucesso ou erro)
(function loadSprites(){
  const keys = Object.keys(SPRITE_FILES);
  let loaded = 0;
  keys.forEach(k=>{
    const img = new Image();
    img.onload  = ()=>{ loaded++; if(loaded===keys.length){ spritesLoaded = true; renderGame(); } };
    img.onerror = ()=>{ loaded++; if(loaded===keys.length){ spritesLoaded = true; renderGame(); } };
    img.src = SPRITE_FILES[k];
    sprites[k] = img;
  });
})();

// true somente se ESSA imagem específica carregou com sucesso (evita desenhar imagem quebrada)
function spriteReady(key){
  const img = sprites[key];
  return !!(img && img.complete && img.naturalWidth > 0);
}

// Desenha o sprite se existir/carregou; retorna true se desenhou.
// Se retornar false, quem chamou deve continuar com o desenho vetorial de reserva.
function drawSprite(ctx, key, px, py, w, h){
  if (!spriteReady(key)) return false;
  ctx.drawImage(sprites[key], px, py, w, h);
  return true;
}

// Descobre o artType (tema visual) do mundo pelo índice, na lista de mundos ativa (normal ou expert)
function getArtTypeForWorld(wi){
  const list = (typeof getActiveWorlds === 'function') ? getActiveWorlds() : WORLDS;
  const w = list && list[wi];
  return (w && w.artType) || 'earth';
}

const WORLDS = [
  {
    id: 0, name: "Mundo Básico", sub: "Tutorial de Movimento",
    icon: "🌍", color: "#16a34a", bg: "#0a1a0a",
    artType: "earth"
  },
  {
    id: 1, name: "Mundo das Vinhas", sub: "Vinhas que Prendem a Caixa",
    icon: "🌿", color: "#16a34a", bg: "#071a07",
    artType: "vine"
  },
  {
    id: 2, name: "Mundo Gelado", sub: "Superfícies Escorregadias",
    icon: "❄️", color: "#22d3ee", bg: "#0a1520",
    artType: "ice"
  },
  {
    id: 3, name: "Interruptores", sub: "Botões e Portas",
    icon: "🚪", color: "#f97316", bg: "#1a0e00",
    artType: "door"
  },
  {
    id: 4, name: "Mundo Mestre", sub: "O Desafio Final",
    icon: "💀", color: "#ef4444", bg: "#1a0505",
    artType: "master"
  }
];

// W1: Basic tutorial levels
const LEVEL_DATA = [
  // WORLD 1 - Basic
  [ // 1-1: Simple push
    { w:7, h:5, playerStart:[1,2],
      grid:[
        [1,1,1,1,1,1,1],
        [1,0,0,0,1,0,1],
        [1,0,4,3,1,2,1],
        [1,0,0,0,1,0,1],
        [1,1,1,1,1,1,1]
      ], par:3 }
  ],
  [ // 1-2
    { w:8, h:6, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,0,1],
        [1,0,1,0,0,0,0,1],
        [1,0,0,3,0,0,0,1],
        [1,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1]
      ], par:6 }
  ],
  [ // 1-3
    { w:9, h:7, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,0,2,0,1],
        [1,0,0,3,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:7 }
  ],
  [ // 1-4
    { w:9, h:7, playerStart:[1,2],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,2,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,3,0,1,0,3,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,0,2,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:10 }
  ],
  [ // 1-5
    { w:10, h:8, playerStart:[2,4],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,2,0,2,0,0,1],
        [1,0,0,0,0,1,0,0,0,1],
        [1,0,3,0,0,0,3,0,0,1],
        [1,0,0,0,1,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:12 }
  ],

  // WORLD 2 - Vines (5=vine, box needs 2 pushes to move through: first push sticks, second breaks free)
  [ // 2-1: Single vine intro
    { w:9, h:7, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,1,0,0,0,2,0,1],
        [1,0,3,5,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:5 }
  ],
  [ // 2-2: Two vines, navigate around
    { w:9, h:7, playerStart:[1,1],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,1,0,5,0,0,0,1],
        [1,0,3,0,0,0,0,0,1],
        [1,0,0,0,5,0,0,0,1],
        [1,0,0,0,0,0,2,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:8 }
  ],
  [ // 2-3: Vine corridor
    { w:10, h:8, playerStart:[1,6],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,2,0,0,0,1],
        [1,0,1,1,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,5,5,5,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,3,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:10 }
  ],
  [ // 2-4: Two boxes, both have vines blocking path
    { w:10, h:8, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,2,0,0,1],
        [1,0,1,0,1,1,0,1,0,1],
        [1,0,0,3,5,5,3,0,0,1],
        [1,0,1,0,0,0,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:12 }
  ],
  [ // 2-5: Vine maze
    { w:11, h:9, playerStart:[1,7],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,0,2,0,0,1],
        [1,0,1,0,1,5,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,5,1,0,0,0,1,5,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,3,0,5,1,0,1,5,0,3,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ], par:16 }
  ],

  // WORLD 3 - Ice (7=ice)
  [ // 3-1
    { w:9, h:7, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,1,7,7,7,2,0,1],
        [1,0,0,3,0,0,0,0,1],
        [1,0,1,7,7,7,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:4 }
  ],
  [ // 3-2
    { w:9, h:7, playerStart:[1,1],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,7,7,7,7,7,7,1,1],
        [1,0,0,3,0,0,0,0,1],
        [1,7,7,7,7,0,7,1,1],
        [1,0,0,0,0,2,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:7 }
  ],
  [ // 3-3
    { w:10, h:8, playerStart:[1,6],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,2,0,0,0,0,0,0,0,1],
        [1,7,7,1,7,7,7,7,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,7,7,1,7,7,7,7,0,1],
        [1,0,0,0,0,0,0,1,0,1],
        [1,0,3,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:9 }
  ],
  [ // 3-4
    { w:10, h:8, playerStart:[8,6],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,2,0,2,0,0,0,0,1],
        [1,0,7,7,7,1,7,7,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,7,1,7,7,7,1,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,3,0,3,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:11 }
  ],
  [ // 3-5
    { w:11, h:9, playerStart:[5,7],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,2,0,0,0,0,0,2,0,1],
        [1,0,7,7,1,7,7,1,7,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,7,1,7,7,7,1,7,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,7,7,7,1,7,7,7,0,1],
        [1,0,3,0,0,0,3,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ], par:15 }
  ],

  // WORLD 4 - Buttons/Doors (8=button, 9=door)
  [ // 4-1
    { w:9, h:7, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,1,9,0,2,0,0,1],
        [1,0,3,0,0,0,0,0,1],
        [1,0,0,8,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:6, doorLinks:[[3,2]], buttonLinks:[[3,4]] }
  ],
  [ // 4-2
    { w:9, h:7, playerStart:[1,1],
      grid:[
        [1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,1],
        [1,0,8,1,9,0,2,0,1],
        [1,0,0,1,0,0,0,0,1],
        [1,0,3,1,0,0,0,0,1],
        [1,0,0,8,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1]
      ], par:7, doorLinks:[[4,2]], buttonLinks:[[2,2],[3,5]] }
  ],
  [ // 4-3
    { w:10, h:8, playerStart:[1,6],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,2,0,0,0,0,1],
        [1,0,1,9,0,9,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,8,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,3,0,0,0,8,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:9, doorLinks:[[3,2],[5,2]], buttonLinks:[[4,4],[6,6]] }
  ],
  [ // 4-4
    { w:10, h:8, playerStart:[1,3],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,2,0,0,0,1],
        [1,0,1,9,1,9,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,8,1,0,1,8,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,3,0,0,0,3,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:12, doorLinks:[[3,2],[5,2]], buttonLinks:[[2,4],[6,4]] }
  ],
  [ // 4-5
    { w:11, h:9, playerStart:[5,7],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,2,0,2,0,2,0,0,0,1],
        [1,0,9,1,9,1,9,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,8,1,8,1,8,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,3,0,3,0,3,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ], par:16, doorLinks:[[2,2],[4,2],[6,2]], buttonLinks:[[2,4],[4,4],[6,4]] }
  ],

  // WORLD 5 - Master (all mechanics: ice, buttons, doors, vines)
  [ // 5-1
    { w:10, h:8, playerStart:[1,6],
      grid:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,2,0,0,0,0,1],
        [1,0,1,9,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,7,7,8,7,5,0,0,1],
        [1,0,0,0,0,0,0,0,0,1],
        [1,0,3,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1]
      ], par:10, doorLinks:[[3,2]], buttonLinks:[[4,4]] }
  ],
  [ // 5-2
    { w:11, h:9, playerStart:[1,7],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,2,0,2,0,0,0,1],
        [1,0,1,9,0,1,9,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,7,5,7,0,7,5,7,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,8,0,0,1,0,8,0,0,1],
        [1,0,3,0,0,0,0,3,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ], par:14, doorLinks:[[3,2],[6,2]], buttonLinks:[[2,6],[7,6]] }
  ],
  [ // 5-3
    { w:11, h:9, playerStart:[5,7],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1],
        [1,0,2,0,0,0,0,0,2,0,1],
        [1,0,9,0,1,0,1,0,9,0,1],
        [1,0,0,5,0,0,0,5,0,0,1],
        [1,0,7,7,1,7,1,7,7,0,1],
        [1,0,0,0,0,0,0,0,0,0,1],
        [1,0,8,0,1,0,1,0,8,0,1],
        [1,0,3,0,0,0,0,0,3,0,1],
        [1,1,1,1,1,1,1,1,1,1,1]
      ], par:16, doorLinks:[[2,2],[8,2]], buttonLinks:[[2,6],[8,6]] }
  ],
  [ // 5-4
    { w:12, h:10, playerStart:[6,8],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,0,2,0,0,0,1],
        [1,0,1,9,1,0,1,9,1,0,0,1],
        [1,0,0,0,0,5,0,0,0,0,0,1],
        [1,0,7,1,7,7,7,1,7,0,0,1],
        [1,0,0,0,0,5,0,0,0,0,0,1],
        [1,0,1,8,1,0,1,8,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,3,0,0,0,0,3,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1]
      ], par:18, doorLinks:[[3,2],[7,2]], buttonLinks:[[3,6],[7,6]] }
  ],
  [ // 5-5 EPIC FINAL
    { w:13, h:11, playerStart:[6,9],
      grid:[
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,2,0,0,0,0,2,0,0,0,1],
        [1,0,1,9,1,0,0,1,9,1,0,0,1],
        [1,0,0,0,0,5,0,0,0,0,0,0,1],
        [1,0,7,1,7,7,1,7,7,1,7,0,1],
        [1,0,0,0,0,5,0,0,0,0,0,0,1],
        [1,0,1,8,1,0,0,1,8,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,7,7,5,0,0,5,7,7,0,0,1],
        [1,0,3,0,0,0,0,0,3,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1]
      ], par:22, doorLinks:[[3,2],[8,2]], buttonLinks:[[3,6],[8,6]] }
  ]
];

// ========================
// DIFFICULTY SYSTEM
// ========================
// 'easy' | 'normal' | 'expert'
let currentDifficulty = 'normal';

// EASY MODE levels — shorter grids, fewer puzzles, gradual intro of mechanics
const LEVEL_DATA_EASY = [
  // WORLD 1 - Basic (easy: very short intro)
  [ { w:6, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1],[1,0,0,1,0,1],[1,4,3,0,2,1],[1,0,0,1,0,1],[1,1,1,1,1,1]], par:2 } ],
  [ { w:6, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1],[1,0,0,0,0,1],[1,0,3,0,2,1],[1,0,0,0,0,1],[1,1,1,1,1,1]], par:3 } ],
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,3,1,0,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:5 } ],
  [ { w:7, h:6, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,2,0,0,1],[1,0,3,0,0,0,1],[1,0,0,0,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:5 } ],
  [ { w:8, h:6, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,1],[1,0,1,0,2,0,0,1],[1,0,0,3,0,0,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]], par:6 } ],

  // WORLD 2 - Vines (easy: single vine obstacle)
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,3,5,0,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:4 } ],
  [ { w:7, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1],[1,0,0,2,0,0,1],[1,0,0,0,0,0,1],[1,0,1,5,0,0,1],[1,0,3,0,0,0,1],[1,1,1,1,1,1,1]], par:5 } ],
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,1],[1,0,1,0,0,0,0,1],[1,0,5,0,1,0,0,1],[1,0,3,0,0,0,0,1],[1,1,1,1,1,1,1,1]], par:6 } ],
  [ { w:8, h:6, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1],[1,0,0,2,0,2,0,1],[1,0,1,0,1,0,0,1],[1,0,0,3,5,3,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]], par:8 } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,2,0,2,0,0,1],[1,0,1,0,1,0,1,0,1],[1,0,0,5,0,5,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,3,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1]], par:10 } ],

  // WORLD 3 - Ice (easy: short ice run)
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,3,7,7,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:3 } ],
  [ { w:7, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1],[1,0,0,2,0,0,1],[1,0,7,7,7,0,1],[1,0,0,0,0,0,1],[1,0,3,0,0,0,1],[1,1,1,1,1,1,1]], par:4 } ],
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,2,0,2,0,0,1],[1,0,7,7,7,7,0,1],[1,0,0,0,0,0,0,1],[1,0,3,0,3,0,0,1],[1,1,1,1,1,1,1,1]], par:6 } ],
  [ { w:8, h:6, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1],[1,7,7,1,7,7,0,1],[1,0,0,3,0,0,0,1],[1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1]], par:5 } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,2,0,2,0,0,1],[1,0,7,7,1,7,7,0,1],[1,0,0,0,0,0,0,0,1],[1,0,7,1,7,7,1,0,1],[1,0,3,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1]], par:8 } ],

  // WORLD 4 - Doors (easy: 1 button 1 door simple)
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,3,9,0,2,1],[1,0,0,8,0,0,1],[1,1,1,1,1,1,1]], par:5, doorLinks:[[3,2]], buttonLinks:[[3,3]] } ],
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1],[1,0,1,9,0,0,0,1],[1,0,0,0,0,0,0,1],[1,0,3,0,8,0,0,1],[1,1,1,1,1,1,1,1]], par:6, doorLinks:[[3,2]], buttonLinks:[[4,4]] } ],
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,1],[1,0,9,0,9,0,0,1],[1,0,0,0,0,0,0,1],[1,0,3,8,0,0,0,1],[1,1,1,1,1,1,1,1]], par:7, doorLinks:[[2,2],[4,2]], buttonLinks:[[3,4]] } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,1],[1,0,1,9,0,9,1,0,1],[1,0,0,0,0,0,0,0,1],[1,0,8,1,0,1,8,0,1],[1,0,3,0,0,0,3,0,1],[1,1,1,1,1,1,1,1,1]], par:9, doorLinks:[[3,2],[5,2]], buttonLinks:[[2,4],[6,4]] } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,2,0,2,0,0,0,1],[1,0,9,1,9,0,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,8,1,8,0,0,0,1],[1,0,3,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:11, doorLinks:[[2,2],[4,2]], buttonLinks:[[2,4],[4,4]] } ],

  // WORLD 5 - Master (easy: 1 mechanic combo per level)
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1],[1,0,1,9,0,0,0,1],[1,0,0,7,7,5,0,1],[1,0,3,0,8,0,0,1],[1,1,1,1,1,1,1,1]], par:8, doorLinks:[[3,2]], buttonLinks:[[4,4]] } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,0,1],[1,0,1,9,0,0,0,0,1],[1,0,0,0,5,0,0,0,1],[1,0,7,7,8,7,0,0,1],[1,0,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:9, doorLinks:[[3,2]], buttonLinks:[[4,4]] } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,2,0,0,2,0,0,1],[1,0,9,1,1,9,0,0,1],[1,0,0,5,5,0,0,0,1],[1,0,7,7,0,7,0,0,1],[1,0,3,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1]], par:11, doorLinks:[[2,2],[5,2]], buttonLinks:[[3,3],[4,3]] } ],
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,2,0,0,1],[1,0,1,9,1,1,9,1,0,1],[1,0,0,0,5,5,0,0,0,1],[1,0,7,7,0,0,7,7,0,1],[1,0,0,0,8,8,0,0,0,1],[1,0,3,0,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:13, doorLinks:[[3,2],[6,2]], buttonLinks:[[4,5],[5,5]] } ],
  [ { w:10, h:8, playerStart:[5,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,0,0,2,0,1],[1,0,9,1,0,0,1,9,0,1],[1,0,0,0,5,5,0,0,0,1],[1,0,7,1,7,7,1,7,0,1],[1,0,0,0,8,8,0,0,0,1],[1,0,3,0,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:14, doorLinks:[[2,2],[7,2]], buttonLinks:[[4,5],[5,5]] } ],
];

// NORMAL MODE levels — same worlds as original but with enhanced, more complex layouts
// requiring full use of the world's mechanics
const LEVEL_DATA_NORMAL = [
  // WORLD 1 - Basic (more strategic pushing, walls forcing detours)
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,1],[1,0,1,0,1,0,0,1],[1,0,0,0,0,0,0,1],[1,0,0,3,1,0,0,1],[1,1,1,1,1,1,1,1]], par:5 } ],
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,1],[1,0,1,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1],[1,0,0,3,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:7 } ],
  [ { w:9, h:7, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,2,0,1],[1,0,0,0,3,0,0,0,1],[1,0,1,0,1,1,1,0,1],[1,0,0,0,0,0,2,0,1],[1,1,1,1,1,1,1,1,1]], par:9 } ],
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,2,0,0,1],[1,0,1,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,1,1,0,1,1],[1,0,0,3,0,0,3,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:12 } ],
  [ { w:11, h:9, playerStart:[2,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,2,0,0,0,1],[1,0,1,1,0,1,0,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,1,0,1,0,1,0,1,0,1],[1,0,0,3,0,0,0,3,0,0,1],[1,0,1,0,1,1,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:14 } ],

  // WORLD 2 - Vines (normal: must use vine tension to position box, multiple vines on path)
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,1],[1,0,1,5,0,1,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,1,0,5,0,1,0,1],[1,0,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:8 } ],
  [ { w:9, h:7, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,2,0,1],[1,0,1,5,0,5,0,1,1],[1,0,3,0,0,0,0,0,1],[1,0,0,5,1,5,0,0,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:11 } ],
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,0,0,1],[1,0,1,0,5,5,0,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,5,1,0,0,1,5,0,1],[1,0,0,0,0,0,0,0,0,1],[1,3,0,5,1,1,5,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:13 } ],
  [ { w:10, h:8, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,2,0,0,1],[1,0,1,0,5,5,0,1,0,1],[1,0,3,0,0,0,0,3,0,1],[1,0,0,5,1,1,5,0,0,1],[1,0,1,0,0,0,0,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:14 } ],
  [ { w:11, h:9, playerStart:[5,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,0,0,0,2,0,1],[1,0,0,5,1,5,5,1,5,0,1],[1,0,1,0,0,0,0,0,0,1,1],[1,0,0,5,1,0,1,5,0,0,1],[1,0,1,0,0,0,0,0,1,0,1],[1,3,0,5,0,1,0,5,0,3,1],[1,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:18 } ],

  // WORLD 3 - Ice (normal: ice slides force routing, boxes must be positioned precisely)
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,1],[1,0,1,7,7,7,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,7,7,1,7,0,0,1],[1,0,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:7 } ],
  [ { w:9, h:7, playerStart:[1,1], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,7,7,7,0,7,7,0,1],[1,0,0,3,0,0,0,0,1],[1,7,7,0,7,7,7,0,1],[1,0,0,0,0,0,2,0,1],[1,1,1,1,1,1,1,1,1]], par:8 } ],
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,0,0,0,1],[1,7,7,1,7,7,7,7,0,1],[1,0,0,0,0,0,0,0,0,1],[1,7,7,1,7,7,0,7,0,1],[1,0,0,0,0,0,0,1,0,1],[1,0,3,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:10 } ],
  [ { w:10, h:8, playerStart:[8,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,2,0,2,0,0,0,0,1],[1,0,7,7,7,1,7,7,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,7,1,7,7,7,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,3,0,3,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:12 } ],
  [ { w:11, h:9, playerStart:[5,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,0,0,0,2,0,1],[1,0,7,7,1,7,7,1,7,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,7,1,7,7,7,1,7,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,7,7,7,1,7,7,7,0,1],[1,0,3,0,0,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:16 } ],

  // WORLD 4 - Doors (normal: must push box onto button, then pass through door to reach target)
  [ { w:9, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,1],[1,0,1,9,0,0,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,1,0,8,0,0,0,1],[1,0,3,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:7, doorLinks:[[3,2]], buttonLinks:[[4,4]] } ],
  [ { w:9, h:7, playerStart:[1,1], grid:[[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,0,8,1,9,0,2,0,1],[1,0,0,1,0,0,0,0,1],[1,0,3,1,0,0,0,0,1],[1,0,0,8,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]], par:9, doorLinks:[[4,2]], buttonLinks:[[2,2],[3,5]] } ],
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,0,1],[1,0,1,9,0,9,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,1,1,8,1,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,3,0,0,0,8,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:11, doorLinks:[[3,2],[5,2]], buttonLinks:[[4,4],[6,6]] } ],
  [ { w:10, h:8, playerStart:[1,3], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,2,0,0,0,1],[1,0,1,9,1,9,1,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,8,1,0,1,8,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,3,0,0,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:13, doorLinks:[[3,2],[5,2]], buttonLinks:[[2,4],[6,4]] } ],
  [ { w:11, h:9, playerStart:[5,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,2,0,2,0,0,0,1],[1,0,9,1,9,1,9,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,8,1,8,1,8,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,0,3,0,3,0,3,0,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:17, doorLinks:[[2,2],[4,2],[6,2]], buttonLinks:[[2,4],[4,4],[6,4]] } ],

  // WORLD 5 - Master normal (all mechanics combined, heavier)
  [ { w:10, h:8, playerStart:[1,6], grid:[[1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,0,0,1],[1,0,1,9,0,0,0,0,0,1],[1,0,0,5,0,0,0,0,0,1],[1,0,7,7,8,7,5,0,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,3,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1]], par:11, doorLinks:[[3,2]], buttonLinks:[[4,4]] } ],
  [ { w:11, h:9, playerStart:[1,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,2,0,2,0,0,0,1],[1,0,1,9,0,1,9,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,7,5,7,0,7,5,7,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,8,0,0,1,0,8,0,0,1],[1,0,3,0,0,0,0,3,0,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:15, doorLinks:[[3,2],[6,2]], buttonLinks:[[2,6],[7,6]] } ],
  [ { w:11, h:9, playerStart:[5,7], grid:[[1,1,1,1,1,1,1,1,1,1,1],[1,0,2,0,0,0,0,0,2,0,1],[1,0,9,0,1,0,1,0,9,0,1],[1,0,0,5,0,0,0,5,0,0,1],[1,0,7,7,1,7,1,7,7,0,1],[1,0,0,0,0,0,0,0,0,0,1],[1,0,8,0,1,0,1,0,8,0,1],[1,0,3,0,0,0,0,0,3,0,1],[1,1,1,1,1,1,1,1,1,1,1]], par:17, doorLinks:[[2,2],[8,2]], buttonLinks:[[2,6],[8,6]] } ],
  [ { w:12, h:10, playerStart:[6,8], grid:[[1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,2,0,0,0,1],[1,0,1,9,1,0,1,9,1,0,0,1],[1,0,0,0,0,5,0,0,0,0,0,1],[1,0,7,1,7,7,7,1,7,0,0,1],[1,0,0,0,0,5,0,0,0,0,0,1],[1,0,1,8,1,0,1,8,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1],[1,0,3,0,0,0,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1]], par:19, doorLinks:[[3,2],[7,2]], buttonLinks:[[3,6],[7,6]] } ],
  [ { w:13, h:11, playerStart:[6,9], grid:[[1,1,1,1,1,1,1,1,1,1,1,1,1],[1,0,0,2,0,0,0,0,2,0,0,0,1],[1,0,1,9,1,0,0,1,9,1,0,0,1],[1,0,0,0,0,5,0,0,0,0,0,0,1],[1,0,7,1,7,7,1,7,7,1,7,0,1],[1,0,0,0,0,5,0,0,0,0,0,0,1],[1,0,1,8,1,0,0,1,8,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,7,7,5,0,0,5,7,7,0,0,1],[1,0,3,0,0,0,0,0,3,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1]], par:23, doorLinks:[[3,2],[8,2]], buttonLinks:[[3,6],[8,6]] } ],
];

// EXPERT MODE — Tutorial world (world 0) + same levels as normal but arrow keys disabled
// Tutorial world teaches command-based movement
const EXPERT_TUTORIAL_LEVELS = [
  // Tutorial 1: Move right — walk to reach the box and push it to target
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,4,0,3,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:99,
      tutorialMsg:'👋 Bem-vindo ao Modo Expert! Selecione "MOVER" e digite "direita" para se mover. Empurre a caixa até o alvo verde!' } ],
  // Tutorial 2: Move with box
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,4,3,0,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:99,
      tutorialMsg:'📦 Agora empurre a caixa! Mova o personagem em direção à caixa para empurrá-la. Use "mover direita" repetidamente.' } ],
  // Tutorial 3: Grab
  [ { w:7, h:5, playerStart:[1,2], grid:[[1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,4,3,0,2,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:99,
      tutorialMsg:'🤝 Aprenda a SEGURAR! Fique ao lado da caixa, selecione "SEGURAR" e envie. Depois mova com "mover" para arrastar a caixa.' } ],
  // Tutorial 4: Multi-direction
  [ { w:7, h:7, playerStart:[1,5], grid:[[1,1,1,1,1,1,1],[1,0,0,2,0,0,1],[1,0,1,0,1,0,1],[1,0,0,0,0,0,1],[1,0,1,3,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]], par:99,
      tutorialMsg:'⬆️ Pratique todas as direções! Use "mover cima", "mover baixo", "mover esquerda" e "mover direita" para alcançar o alvo.' } ],
  // Tutorial 5: Full challenge
  [ { w:8, h:6, playerStart:[1,4], grid:[[1,1,1,1,1,1,1,1],[1,0,0,0,2,0,0,1],[1,0,1,0,0,1,0,1],[1,0,0,0,0,0,0,1],[1,0,3,0,1,0,0,1],[1,1,1,1,1,1,1,1]], par:99,
      tutorialMsg:'🏁 Desafio final do tutorial! Use tudo que aprendeu para colocar a caixa no alvo. Boa sorte!' } ],
];

// Expert uses LEVEL_DATA_NORMAL for worlds 1-5, but world 0 is tutorial
function getLevelData(wi, li) {
  if (currentDifficulty === 'easy') {
    return LEVEL_DATA_EASY[wi * 5 + li];
  } else if (currentDifficulty === 'normal') {
    return LEVEL_DATA_NORMAL[wi * 5 + li];
  } else if (currentDifficulty === 'expert') {
    if (wi === 0) return EXPERT_TUTORIAL_LEVELS[li];
    return LEVEL_DATA_NORMAL[(wi - 1) * 5 + li]; // shift worlds by 1
  }
  return LEVEL_DATA[wi * 5 + li];
}

// Expert worlds config (tutorial world prepended)
const WORLDS_EXPERT = [
  { id: 0, name: "Tutorial Expert", sub: "Aprenda os Comandos de Texto", icon: "📖", color: "#a855f7", bg: "#0f0a1a", artType: "tutorial" },
  ...WORLDS.slice(0, 4) // worlds 1-4 (no master in expert — too many levels)
];
let currentScreen = 'title';
let currentWorld = 0;
let currentLevel = 0;
let gameState = null;
let moves = 0;
let saveData = {};
let settings = { music: true, sfx: true, volMusic: 0.7, volSfx: 0.8 };
let audioCtx = null;
let musicNodes = {};
let devMode = false;
let grabbedBox = null;   // reference to the box currently being held
let grabMode = false;    // whether grab mode is toggled on
let expertAction = 'mover'; // 'mover' | 'segurar' — active action in Expert mode

// ========================
// SAVE/LOAD
// ========================
function loadSave() {
  try {
    const raw = localStorage.getItem('puzzleverse_save');
    if (raw) saveData = JSON.parse(raw);
    else saveData = { worlds: [{ unlocked: true, levels: [{}, {}, {}, {}, {}] }] };
  } catch(e) {
    saveData = { worlds: [{ unlocked: true, levels: [{},{},{},{},{}] }] };
  }
  // Ensure all worlds/levels exist
  for (let w = 0; w < 5; w++) {
    if (!saveData.worlds) saveData.worlds = [];
    if (!saveData.worlds[w]) saveData.worlds[w] = { unlocked: w === 0, levels: [{},{},{},{},{}] };
    if (!saveData.worlds[w].levels) saveData.worlds[w].levels = [{},{},{},{},{}];
    for (let l = 0; l < 5; l++) {
      if (!saveData.worlds[w].levels[l]) saveData.worlds[w].levels[l] = {};
    }
  }
  try {
    const rawSettings = localStorage.getItem('puzzleverse_settings');
    if (rawSettings) settings = { ...settings, ...JSON.parse(rawSettings) };
  } catch(e) {}
  applySettings();
}
function persistSave() {
  localStorage.setItem('puzzleverse_save', JSON.stringify(saveData));
  localStorage.setItem('puzzleverse_settings', JSON.stringify(settings));
}
function getStars(worldIdx, levelIdx) {
  return (saveData.worlds[worldIdx]?.levels[levelIdx]?.stars) || 0;
}
function setLevelComplete(worldIdx, levelIdx, starsEarned) {
  const prev = getStars(worldIdx, levelIdx);
  if (starsEarned > prev) saveData.worlds[worldIdx].levels[levelIdx].stars = starsEarned;
  saveData.worlds[worldIdx].levels[levelIdx].done = true;

  // Unlock next level
  if (levelIdx < 4) {
    saveData.worlds[worldIdx].levels[levelIdx + 1].unlocked = true;
  } else {
    // Unlock next world
    if (worldIdx < 4) {
      if (!saveData.worlds[worldIdx + 1]) saveData.worlds[worldIdx + 1] = { unlocked: true, levels: [{unlocked:true},{},{},{},{}] };
      saveData.worlds[worldIdx + 1].unlocked = true;
      saveData.worlds[worldIdx + 1].levels[0].unlocked = true;
    }
  }
  // Always unlock first level of current world
  saveData.worlds[worldIdx].levels[0].unlocked = true;
  persistSave();
}
function isLevelUnlocked(w, l) {
  if (devMode) return true; // Dev mode: all levels unlocked
  if (l === 0) return saveData.worlds[w]?.unlocked || false;
  return saveData.worlds[w]?.levels[l]?.unlocked || saveData.worlds[w]?.levels[l]?.done || false;
}

// ========================
// AUDIO ENGINE
// ========================
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  startMusic();
}
function startMusic() {
  if (!settings.music || !audioCtx) return;
  stopMusic();
  const master = audioCtx.createGain();
  master.gain.value = settings.volMusic * 0.4;
  master.connect(audioCtx.destination);
  musicNodes.master = master;

  // Ambient tense melody using oscillators
  const bpm = 72;
  const beat = 60 / bpm;
  let t = audioCtx.currentTime + 0.1;

  function scheduleNote(freq, duration, startTime, type = 'sine', vol = 0.15) {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(vol, startTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(g);
    g.connect(master);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Bass drone
  const bassNotes = [55, 55, 61.7, 58.3, 55, 52, 58.3, 55];
  const melodyNotes = [220, 246.9, 261.6, 293.6, 261.6, 246.9, 220, 196];
  const harmNotes = [110, 110, 130.8, 116.5, 110, 104, 116.5, 110];

  function playLoop() {
    if (!settings.music) return;
    let lt = audioCtx.currentTime + 0.1;
    for (let i = 0; i < 8; i++) {
      scheduleNote(bassNotes[i], beat * 1.8, lt + i * beat, 'sawtooth', 0.08);
      scheduleNote(melodyNotes[i], beat * 0.9, lt + i * beat, 'sine', 0.12);
      scheduleNote(harmNotes[i], beat * 1.8, lt + i * beat + beat * 0.5, 'triangle', 0.06);
    }
    musicNodes.loopTimeout = setTimeout(playLoop, (beat * 8 - 0.2) * 1000);
  }
  playLoop();
}
function stopMusic() {
  if (musicNodes.loopTimeout) clearTimeout(musicNodes.loopTimeout);
  if (musicNodes.master) {
    try { musicNodes.master.gain.setValueAtTime(0, audioCtx.currentTime); } catch(e){}
    musicNodes.master = null;
  }
}
function playSfx(type) {
  if (!settings.sfx || !audioCtx) return;
  const t = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.value = settings.volSfx * 0.5;
  master.connect(audioCtx.destination);

  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.connect(g);
  g.connect(master);

  if (type === 'move') {
    osc.frequency.value = 440; osc.type = 'square';
    g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.08);
    osc.start(t); osc.stop(t+0.1);
  } else if (type === 'push') {
    osc.frequency.value = 280; osc.type = 'sawtooth';
    g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.12);
    osc.start(t); osc.stop(t+0.15);
  } else if (type === 'win') {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o2 = audioCtx.createOscillator();
      const g2 = audioCtx.createGain();
      o2.connect(g2); g2.connect(master);
      o2.frequency.value = freq; o2.type = 'sine';
      const st = t + i * 0.12;
      g2.gain.setValueAtTime(0.2, st); g2.gain.exponentialRampToValueAtTime(0.001, st+0.3);
      o2.start(st); o2.stop(st+0.4);
    });
    return;
  } else if (type === 'portal') {
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(600, t+0.15);
    osc.type = 'sine';
    g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.18);
    osc.start(t); osc.stop(t+0.2);
  } else if (type === 'ice') {
    osc.frequency.value = 800; osc.type = 'triangle';
    g.gain.setValueAtTime(0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.2);
    osc.start(t); osc.stop(t+0.25);
  } else if (type === 'button') {
    osc.frequency.value = 660; osc.type = 'square';
    g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.15);
    osc.start(t); osc.stop(t+0.2);
  }
}
function applySettings() {
  document.getElementById('toggle-music').className = 'toggle' + (settings.music ? ' on' : '');
  document.getElementById('toggle-sfx').className = 'toggle' + (settings.sfx ? ' on' : '');
  document.getElementById('vol-music').value = settings.volMusic * 100;
  document.getElementById('vol-sfx').value = settings.volSfx * 100;
  document.getElementById('vol-music-val').textContent = Math.round(settings.volMusic * 100);
  document.getElementById('vol-sfx-val').textContent = Math.round(settings.volSfx * 100);
  if (musicNodes.master) musicNodes.master.gain.value = settings.volMusic * 0.4;
}
function toggleMusic() {
  settings.music = !settings.music;
  if (settings.music) { startMusic(); } else { stopMusic(); }
  persistSave(); applySettings();
}
function toggleSfx() {
  settings.sfx = !settings.sfx;
  persistSave(); applySettings();
}
function setMusicVol(v) {
  settings.volMusic = v / 100;
  document.getElementById('vol-music-val').textContent = v;
  if (musicNodes.master) musicNodes.master.gain.value = settings.volMusic * 0.4;
  persistSave();
}
function setSfxVol(v) {
  settings.volSfx = v / 100;
  document.getElementById('vol-sfx-val').textContent = v;
  persistSave();
}
function resetProgress() {
  if (!confirm('Resetar todo o progresso? Não pode ser desfeito!')) return;
  saveData = { worlds: [{ unlocked: true, levels: [{unlocked:true},{},{},{},{}] }] };
  persistSave();
  closeSettings();
  showScreen('title');
}

// ========================
// SCREEN TRANSITIONS
// ========================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    if (!s.classList.contains('hidden')) {
      s.classList.add('disintegrate');
      setTimeout(() => { s.classList.add('hidden'); s.classList.remove('disintegrate'); }, 600);
    }
  });
  setTimeout(() => {
    const el = document.getElementById('screen-' + id);
    el.classList.remove('hidden');
    void el.offsetWidth;
    el.style.animation = 'fadeIn 0.5s ease both';
    setTimeout(() => el.style.animation = '', 600);
  }, 300);
  currentScreen = id;
}

// ========================
// WORLD SELECT RENDER
// ========================
function renderWorldSelect() {
  const grid = document.getElementById('worlds-grid');
  grid.innerHTML = '';

  const activeWorlds = getActiveWorlds();

  // Show difficulty badge in worlds header
  const diffLabels = { easy: '🌿 FÁCIL', normal: '⚔️ NORMAL', expert: '💀 EXPERT' };
  const diffColors = { easy: '#4ade80', normal: '#fbbf24', expert: '#ef4444' };
  const hdrSub = document.querySelector('#screen-worlds .worlds-header p');
  if (hdrSub) {
    hdrSub.innerHTML = `Escolha sua aventura &nbsp;<span style="padding:2px 10px;border-radius:12px;font-size:0.8rem;font-weight:700;background:rgba(255,255,255,0.06);color:${diffColors[currentDifficulty]}">${diffLabels[currentDifficulty]}</span>`;
  }

  activeWorlds.forEach((world, wi) => {
    const unlocked = devMode ? true : (saveData.worlds[wi]?.unlocked || (wi === 0));
    const totalStars = (saveData.worlds[wi]?.levels || []).reduce((s, l) => s + (l.stars || 0), 0);

    const card = document.createElement('div');
    card.className = 'world-card' + (unlocked ? '' : ' locked');
    card.innerHTML = `
      <div class="world-art" id="wart-${wi}">
        <canvas id="wcanvas-${wi}" width="280" height="160"></canvas>
        <span class="world-icon">${world.icon}</span>
        ${unlocked ? '' : '<div class="world-lock">🔒</div>'}
      </div>
      <div class="world-info">
        <h3 style="color:${world.color}">${world.name}</h3>
        <p>${world.sub}</p>
        <div class="world-stars">${'⭐'.repeat(Math.floor(totalStars/3))}${'☆'.repeat(Math.max(0, 5-Math.floor(totalStars/3)))}</div>
      </div>
    `;
    if (unlocked) {
      card.addEventListener('click', () => {
        initAudio();
        currentWorld = wi;
        renderLevelSelect(wi);
        showScreen('levels');
      });
    }
    grid.appendChild(card);

    // Draw world art
    setTimeout(() => drawWorldArt(wi, world), 50);
  });
}

function drawWorldArt(wi, world) {
  const canvas = document.getElementById('wcanvas-' + wi);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 280, H = 160;
  ctx.clearRect(0, 0, W, H);

  if (world.artType === 'earth') {
    const grad = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, 100);
    grad.addColorStop(0, '#1a3a1a');
    grad.addColorStop(1, '#0a1a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Stars
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.5+0.1})`;
      ctx.fillRect(Math.random()*W, Math.random()*H, 1.5, 1.5);
    }
    // Planet
    ctx.save();
    ctx.beginPath();
    ctx.arc(W/2, H/2, 55, 0, Math.PI*2);
    const pgrad = ctx.createRadialGradient(W/2-15, H/2-15, 5, W/2, H/2, 55);
    pgrad.addColorStop(0, '#4ade80');
    pgrad.addColorStop(0.5, '#16a34a');
    pgrad.addColorStop(1, '#14532d');
    ctx.fillStyle = pgrad;
    ctx.fill();
    ctx.restore();
  } else if (world.artType === 'vine') {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#071a07');
    grad.addColorStop(1, '#0a2a0a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Vine tendrils
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * W;
      ctx.beginPath();
      ctx.moveTo(x, H);
      let cx = x, cy = H;
      for (let s = 0; s < 6; s++) {
        cx += (Math.random() - 0.5) * 30;
        cy -= 20 + Math.random() * 10;
        ctx.lineTo(cx, cy);
      }
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.stroke();
      // Leaves
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 8, 5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else if (world.artType === 'portal') {
    const grad = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, 100);
    grad.addColorStop(0, '#2a1040');
    grad.addColorStop(1, '#120a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Floating portals
    [[-50,-20],[50,20],[-20,40]].forEach(([dx,dy]) => {
      const x = W/2+dx, y = H/2+dy;
      for (let r = 30; r > 0; r -= 5) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(168,85,247,${(30-r)/30*0.8})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  } else if (world.artType === 'ice') {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a2030');
    grad.addColorStop(1, '#0a1520');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Ice crystals
    for (let i = 0; i < 8; i++) {
      const x = Math.random()*W, y = Math.random()*H;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random()*Math.PI);
      ctx.strokeStyle = `rgba(34,211,238,${Math.random()*0.5+0.2})`;
      ctx.lineWidth = 1.5;
      for (let a = 0; a < 6; a++) {
        ctx.save();
        ctx.rotate(a * Math.PI/3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 20 + Math.random()*10);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  } else if (world.artType === 'door') {
    ctx.fillStyle = '#1a0e00';
    ctx.fillRect(0, 0, W, H);
    // Doors pattern
    for (let i = 0; i < 6; i++) {
      const x = 20 + i*(W/6), y = H/2-30;
      ctx.fillStyle = `rgba(249,115,22,${0.2+i*0.08})`;
      ctx.fillRect(x, y, 30, 50);
      ctx.fillStyle = `rgba(251,191,36,0.6)`;
      ctx.beginPath();
      ctx.arc(x+22, y+25, 4, 0, Math.PI*2);
      ctx.fill();
    }
  } else if (world.artType === 'master') {
    const grad = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, 120);
    grad.addColorStop(0, '#3a0505');
    grad.addColorStop(1, '#0a0000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Skull-like pattern
    ctx.strokeStyle = 'rgba(239,68,68,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.arc(W/2, H/2, 20+i*8, 0, Math.PI*2);
      ctx.globalAlpha = (12-i)/24;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (world.artType === 'tutorial') {
    const grad = ctx.createRadialGradient(W/2, H/2, 10, W/2, H/2, 120);
    grad.addColorStop(0, '#1a0a30');
    grad.addColorStop(1, '#0a0515');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // Keyboard-like keys floating
    const keys = ['▲','◄','▼','►'];
    const positions = [[W/2-30,H/2-20],[W/2-55,H/2+5],[W/2-30,H/2+30],[W/2-5,H/2+5]];
    ctx.font = '18px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    keys.forEach((k, i) => {
      const [x,y] = positions[i];
      ctx.fillStyle = 'rgba(168,85,247,0.25)';
      ctx.fillRect(x-14, y-14, 28, 28);
      ctx.strokeStyle = 'rgba(168,85,247,0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x-14, y-14, 28, 28);
      ctx.fillStyle = 'rgba(200,150,255,0.8)';
      ctx.fillText(k, x, y);
    });
    // "CMD>" text
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = 'rgba(168,85,247,0.7)';
    ctx.fillText('CMD>', W/2+40, H/2);
    ctx.fillStyle = 'rgba(168,85,247,0.4)';
    ctx.fillText('_', W/2+65, H/2);
  }
}
function renderLevelSelect(wi) {
  const world = getActiveWorlds()[wi] || WORLDS[wi];
  document.getElementById('levels-world-title').textContent = world.name.toUpperCase();
  document.getElementById('levels-world-title').style.background = `linear-gradient(135deg, ${world.color}, #ff6b35)`;
  document.getElementById('levels-world-title').style.webkitBackgroundClip = 'text';
  document.getElementById('levels-world-title').style.webkitTextFillColor = 'transparent';
  document.getElementById('levels-world-sub').textContent = world.sub;

  const grid = document.getElementById('levels-grid');
  grid.innerHTML = '';

  for (let li = 0; li < 5; li++) {
    const unlocked = isLevelUnlocked(wi, li);
    const stars = getStars(wi, li);
    const done = saveData.worlds[wi]?.levels[li]?.done;

    const card = document.createElement('div');
    card.className = 'level-card' + (unlocked ? '' : ' locked') + (done ? ' completed' : '');
    card.style.animationDelay = `${li*0.05}s`;
    card.innerHTML = `
      <div class="level-num" style="color:${done ? world.color : 'var(--muted)'}">${li+1}</div>
      <div class="level-stars">${stars > 0 ? '⭐'.repeat(stars) + '☆'.repeat(3-stars) : unlocked ? '☆☆☆' : '🔒'}</div>
    `;
    if (unlocked) {
      card.addEventListener('click', () => {
        currentLevel = li;
        startLevel(wi, li);
        showScreen('game');
      });
    }
    grid.appendChild(card);
  }
}

// ========================
// GAME ENGINE
// ========================
const TILE = 56;
let canvas, ctx2d;

function getTileColor(type, worldIdx) {
  const wc = WORLDS[worldIdx].color;
  switch(type) {
    case 1: return ['#374151','#4b5563']; // wall
    case 2: return ['#14532d','#22c55e']; // target
    case 3: return ['#713f12','#fbbf24']; // box
    case 7: return ['#0e4f5a','#22d3ee']; // ice
    case 8: return ['#713f12','#fbbf24']; // button
    case 9: return ['#7c2d12','#f97316']; // door
    default: return ['#1e1e2e','#262638']; // floor
  }
}

function startLevel(wi, li) {
  canvas = document.getElementById('game-canvas');
  ctx2d = canvas.getContext('2d');

  const ld = getActiveLevelData(wi, li);
  if (!ld) { console.error('No level data for', wi, li); return; }

  moves = 0;
  document.getElementById('hud-moves').textContent = '0';

  const worldList = getActiveWorlds();
  const worldName = worldList[wi] ? worldList[wi].name : `Mundo ${wi+1}`;
  const isExpertTutorial = currentDifficulty === 'expert' && wi === 0;
  document.getElementById('hud-title').textContent = `${worldName} · FASE ${li+1}`;

  // Difficulty badge
  const badge = document.getElementById('hud-diff-badge');
  const diffLabels = { easy: 'FÁCIL', normal: 'NORMAL', expert: 'EXPERT' };
  badge.textContent = diffLabels[currentDifficulty] || '';
  badge.className = `hud-diff-badge ${currentDifficulty}`;

  // Expert mode UI toggle
  const expertArea = document.getElementById('expert-input-area');
  const normalHint = document.getElementById('game-controls-hint');
  const grabBtn = document.getElementById('btn-grab');
  if (currentDifficulty === 'expert') {
    expertArea.classList.add('active');
    normalHint.style.display = 'none';
    grabBtn.style.display = 'none';
    // Reset expert state
    expertAction = 'mover';
    setExpertAction('mover');
    document.getElementById('expert-feedback').textContent = '';
    // Tutorial message
    if (ld.tutorialMsg) {
      document.getElementById('expert-hint').textContent = ld.tutorialMsg;
    } else {
      document.getElementById('expert-hint').textContent = 'Selecione MOVER ou SEGURAR, depois digite a direção e envie.';
    }
  } else {
    expertArea.classList.remove('active');
    normalHint.style.display = '';
    grabBtn.style.display = '';
  }

  // Build mutable state
  gameState = buildState(ld, wi);
  grabbedBox = null;
  grabMode = false;
  canvas.width = ld.w * TILE;
  canvas.height = ld.h * TILE;
  renderGame();

  document.getElementById('win-overlay').classList.remove('show');
}

function buildState(ld, wi) {
  // Deep copy grid
  const grid = ld.grid.map(row => [...row]);
  // Extract player and boxes from grid
  let player = null;
  const boxes = [];
  for (let y = 0; y < ld.h; y++) {
    for (let x = 0; x < ld.w; x++) {
      if (grid[y][x] === 4) { player = {x, y}; grid[y][x] = 0; }
      else if (grid[y][x] === 3) { boxes.push({x, y, stuck: 0}); grid[y][x] = 0; }
    }
  }
  if (!player && ld.playerStart) player = {x: ld.playerStart[0], y: ld.playerStart[1]};

  // === FÍSICA: Jogador não pode nascer dentro de parede/bloco ===
  if (player) {
    const pTile = grid[player.y] && grid[player.y][player.x];
    if (pTile === 1 || pTile === 9) {
      // Encontrar posição livre mais próxima
      outer:
      for (let radius = 1; radius < Math.max(ld.w, ld.h); radius++) {
        for (let dy2 = -radius; dy2 <= radius; dy2++) {
          for (let dx2 = -radius; dx2 <= radius; dx2++) {
            if (Math.abs(dx2) !== radius && Math.abs(dy2) !== radius) continue;
            const nx = player.x + dx2, ny = player.y + dy2;
            if (nx < 0 || ny < 0 || nx >= ld.w || ny >= ld.h) continue;
            if (grid[ny][nx] === 0 || grid[ny][nx] === 2 || grid[ny][nx] === 7 || grid[ny][nx] === 5) {
              player = {x: nx, y: ny};
              break outer;
            }
          }
        }
      }
    }
  }

  // === FÍSICA: Caixa deve estar distante ≥ 1 bloco do jogador ===
  // Se caixa estiver adjacente (ou na mesma célula) ao jogador, empurra para longe
  if (player) {
    boxes.forEach(box => {
      const dist = Math.max(Math.abs(box.x - player.x), Math.abs(box.y - player.y));
      if (dist < 2) {
        // Tentar mover a caixa para uma célula livre afastada do jogador
        const dirs = [
          {dx: box.x - player.x || 1, dy: 0},
          {dx: 0, dy: box.y - player.y || 1},
          {dx: -(box.x - player.x || 1), dy: 0},
          {dx: 0, dy: -(box.y - player.y || 1)},
          {dx: 1, dy: 1}, {dx: -1, dy: 1}, {dx: 1, dy: -1}, {dx: -1, dy: -1}
        ];
        for (const {dx, dy} of dirs) {
          let nx = box.x, ny = box.y;
          // Move até achar célula livre a distância ≥ 2 do jogador
          for (let steps = 1; steps <= 5; steps++) {
            nx = box.x + dx * steps;
            ny = box.y + dy * steps;
            if (nx < 0 || ny < 0 || nx >= ld.w || ny >= ld.h) break;
            if (grid[ny][nx] !== 0 && grid[ny][nx] !== 2 && grid[ny][nx] !== 7 && grid[ny][nx] !== 5) break;
            const d2 = Math.max(Math.abs(nx - player.x), Math.abs(ny - player.y));
            if (d2 >= 2 && !boxes.some(b => b !== box && b.x === nx && b.y === ny)) {
              box.x = nx; box.y = ny;
              break;
            }
          }
          const newDist = Math.max(Math.abs(box.x - player.x), Math.abs(box.y - player.y));
          if (newDist >= 2) break;
        }
      }
    });
  }

  // Build door/button links
  const doors = {};
  const buttons = {};
  let doorLinks = ld.doorLinks || [];
  let buttonLinks = ld.buttonLinks || [];
  doorLinks.forEach(([x,y]) => { doors[`${x},${y}`] = false; });
  buttonLinks.forEach(([x,y]) => { buttons[`${x},${y}`] = false; });

  return {
    grid,
    player,
    boxes,
    wi,
    doors,
    buttons,
    doorLinks,
    buttonLinks,
    permanentButtons: new Set(),
    portals: { A: null, B: null },
    w: ld.w,
    h: ld.h
  };
}

function renderGame() {
  if (!gameState) return;
  const gs = gameState;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  const t = Date.now() / 1000;
  const artType = getArtTypeForWorld(gs.wi); // tema visual do mundo atual (sprites)

  // Sync grab button visual state
  const grabBtn = document.getElementById('btn-grab');
  if (grabBtn) {
    if (grabbedBox) {
      grabBtn.classList.add('active');
      grabBtn.textContent = '✋ Soltar';
    } else {
      grabBtn.classList.remove('active');
      grabBtn.textContent = '🤝 Segurar';
    }
  }

  for (let y = 0; y < gs.h; y++) {
    for (let x = 0; x < gs.w; x++) {
      const tile = gs.grid[y][x];
      const px = x * TILE, py = y * TILE;

      // Floor — tenta sprite do mundo (floor_<artType>), senão usa o xadrez vetorial original
      if (!drawSprite(ctx2d, `floor_${artType}`, px, py, TILE, TILE)) {
        ctx2d.fillStyle = (x + y) % 2 === 0 ? '#1e1e2e' : '#262638';
        ctx2d.fillRect(px, py, TILE, TILE);
      }

      if (tile === 1) { // Wall — tenta sprite do mundo (wall_<artType>), senão usa o desenho vetorial original
        if (!drawSprite(ctx2d, `wall_${artType}`, px, py, TILE, TILE)) {
          ctx2d.fillStyle = '#374151';
          ctx2d.fillRect(px, py, TILE, TILE);
          ctx2d.fillStyle = '#4b5563';
          ctx2d.fillRect(px, py, TILE, 4);
          ctx2d.fillRect(px, py, 4, TILE);
          ctx2d.fillStyle = '#1f2937';
          ctx2d.fillRect(px, py+TILE-4, TILE, 4);
          ctx2d.fillRect(px+TILE-4, py, 4, TILE);
        }
      } else if (tile === 2) { // Target
        ctx2d.fillStyle = 'rgba(34,197,94,0.15)';
        ctx2d.fillRect(px, py, TILE, TILE);
        ctx2d.strokeStyle = '#22c55e';
        ctx2d.lineWidth = 2;
        ctx2d.strokeRect(px+6, py+6, TILE-12, TILE-12);
        ctx2d.fillStyle = '#22c55e';
        ctx2d.font = `${TILE*0.5}px serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.fillText('✦', px+TILE/2, py+TILE/2);
      } else if (tile === 5) { // Vine
        const vgrad = ctx2d.createLinearGradient(px, py, px+TILE, py+TILE);
        vgrad.addColorStop(0, '#052e16');
        vgrad.addColorStop(1, '#14532d');
        ctx2d.fillStyle = vgrad;
        ctx2d.fillRect(px, py, TILE, TILE);
        // Draw vine tendrils
        ctx2d.strokeStyle = '#16a34a';
        ctx2d.lineWidth = 2;
        // Horizontal vine
        ctx2d.beginPath();
        ctx2d.moveTo(px+2, py+TILE/2);
        ctx2d.bezierCurveTo(px+TILE*0.3, py+TILE*0.3, px+TILE*0.7, py+TILE*0.7, px+TILE-2, py+TILE/2);
        ctx2d.stroke();
        // Vertical vine
        ctx2d.beginPath();
        ctx2d.moveTo(px+TILE/2, py+2);
        ctx2d.bezierCurveTo(px+TILE*0.7, py+TILE*0.3, px+TILE*0.3, py+TILE*0.7, px+TILE/2, py+TILE-2);
        ctx2d.stroke();
        // Leaves
        ctx2d.fillStyle = '#22c55e';
        [[0.25,0.25],[0.75,0.25],[0.25,0.75],[0.75,0.75]].forEach(([lx,ly]) => {
          ctx2d.beginPath();
          ctx2d.ellipse(px+TILE*lx, py+TILE*ly, 6, 4, Math.PI*0.3, 0, Math.PI*2);
          ctx2d.fill();
        });
      } else if (tile === 6) { // unused now, keep as empty
        // nothing
      } else if (tile === 7) { // Ice
        const iceGrad = ctx2d.createLinearGradient(px, py, px+TILE, py+TILE);
        iceGrad.addColorStop(0, '#cffafe');
        iceGrad.addColorStop(1, '#a5f3fc');
        ctx2d.fillStyle = iceGrad;
        ctx2d.fillRect(px, py, TILE, TILE);
        ctx2d.fillStyle = 'rgba(255,255,255,0.3)';
        ctx2d.fillRect(px, py, TILE, 3);
        ctx2d.fillRect(px, py, 3, TILE);
        // Lightning bolt
        ctx2d.fillStyle = '#0891b2';
        ctx2d.font = `${TILE*0.45}px serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.fillText('⚡', px+TILE/2, py+TILE/2);
      } else if (tile === 8) { // Button
        const isLive = checkButton(gs, x, y);
        const isPermanent = gs.permanentButtons.has(`${x},${y}`);
        const isActive = isLive || isPermanent;
        // Permanent = deep teal glow, live = green, inactive = amber
        ctx2d.fillStyle = isPermanent ? '#0891b2' : (isLive ? '#22c55e' : '#f59e0b');
        ctx2d.beginPath();
        ctx2d.arc(px+TILE/2, py+TILE/2, TILE/2-6, 0, Math.PI*2);
        ctx2d.fill();
        if (isPermanent) {
          ctx2d.shadowColor = '#22d3ee';
          ctx2d.shadowBlur = 10;
        }
        ctx2d.fillStyle = isPermanent ? '#0e4f5a' : (isLive ? '#16a34a' : '#d97706');
        ctx2d.beginPath();
        ctx2d.arc(px+TILE/2-3, py+TILE/2-3, TILE/2-10, 0, Math.PI*2);
        ctx2d.fill();
        ctx2d.shadowBlur = 0;
        ctx2d.fillStyle = 'white';
        ctx2d.font = `${TILE*0.4}px serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        ctx2d.fillText(isPermanent ? '🔒' : (isLive ? '✓' : '○'), px+TILE/2, py+TILE/2);
      } else if (tile === 9) { // Door
        const isOpen = checkDoorOpen(gs, x, y);
        if (!isOpen) {
          ctx2d.fillStyle = '#f97316';
          ctx2d.fillRect(px+4, py+2, TILE-8, TILE-4);
          ctx2d.fillStyle = '#ea580c';
          ctx2d.fillRect(px+4, py+2, TILE-8, 6);
          ctx2d.fillStyle = '#fdba74';
          ctx2d.beginPath();
          ctx2d.arc(px+TILE-12, py+TILE/2, 4, 0, Math.PI*2);
          ctx2d.fill();
        }
      }
    }
  }

  // Boxes
  gs.boxes.forEach(box => {
    const px = box.x * TILE, py = box.y * TILE;
    const onTarget = gs.grid[box.y][box.x] === 2;
    // Bloco (caixa) — tenta sprite do mundo (box_<artType>); o anel/estrela verde de "no alvo"
    // é sempre desenhado por cima, mesmo quando o sprite é usado, para manter o feedback visual.
    const boxSpriteDrawn = drawSprite(ctx2d, `box_${artType}`, px+4, py+4, TILE-8, TILE-8);
    if (onTarget) {
      if (!boxSpriteDrawn) {
        ctx2d.fillStyle = '#854d0e';
        ctx2d.fillRect(px+4, py+4, TILE-8, TILE-8);
      }
      ctx2d.fillStyle = '#22c55e';
      ctx2d.lineWidth = 3;
      ctx2d.strokeRect(px+6, py+6, TILE-12, TILE-12);
      ctx2d.fillStyle = '#4ade80';
      ctx2d.font = `${TILE*0.5}px serif`;
      ctx2d.textAlign = 'center';
      ctx2d.textBaseline = 'middle';
      ctx2d.fillText('✦', px+TILE/2, py+TILE/2);
    } else {
      if (!boxSpriteDrawn) {
        const grad = ctx2d.createLinearGradient(px, py, px+TILE, py+TILE);
        grad.addColorStop(0, '#fbbf24');
        grad.addColorStop(1, '#d97706');
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(px+4, py+4, TILE-8, TILE-8);
        ctx2d.fillStyle = '#fde68a';
        ctx2d.fillRect(px+4, py+4, TILE-8, 5);
        ctx2d.fillRect(px+4, py+4, 5, TILE-8);
        ctx2d.fillStyle = '#92400e';
        ctx2d.fillRect(px+4, py+TILE-9, TILE-8, 5);
        ctx2d.fillRect(px+TILE-9, py+4, 5, TILE-8);
      }
      // If stuck in vine, draw vine overlay
      if (box.stuck > 0) {
        ctx2d.strokeStyle = '#16a34a';
        ctx2d.lineWidth = 3;
        ctx2d.globalAlpha = 0.85;
        ctx2d.beginPath();
        ctx2d.moveTo(px+6, py+TILE/2);
        ctx2d.bezierCurveTo(px+TILE*0.3, py+10, px+TILE*0.7, py+TILE-10, px+TILE-6, py+TILE/2);
        ctx2d.stroke();
        ctx2d.beginPath();
        ctx2d.moveTo(px+TILE/2, py+6);
        ctx2d.bezierCurveTo(px+10, py+TILE*0.3, px+TILE-10, py+TILE*0.7, px+TILE/2, py+TILE-6);
        ctx2d.stroke();
        ctx2d.fillStyle = '#22c55e';
        ctx2d.beginPath();
        ctx2d.arc(px+TILE/2, py+TILE/2, 4, 0, Math.PI*2);
        ctx2d.fill();
        ctx2d.globalAlpha = 1;
        // Shake animation if just stuck
        ctx2d.fillStyle = 'rgba(34,197,94,0.3)';
        ctx2d.fillRect(px+4, py+4, TILE-8, TILE-8);
      }
    }
  });

  // Grab chain visual
  if (grabbedBox) {
    const gx2 = grabbedBox.x * TILE + TILE/2;
    const gy2 = grabbedBox.y * TILE + TILE/2;
    const gpx = gs.player.x * TILE + TILE/2;
    const gpy = gs.player.y * TILE + TILE/2;
    ctx2d.save();
    ctx2d.strokeStyle = `rgba(255,215,0,${0.55 + 0.3 * Math.sin(t * 6)})`;
    ctx2d.lineWidth = 4;
    ctx2d.setLineDash([6, 4]);
    ctx2d.lineDashOffset = -t * 20;
    ctx2d.beginPath();
    ctx2d.moveTo(gpx, gpy);
    ctx2d.lineTo(gx2, gy2);
    ctx2d.stroke();
    ctx2d.setLineDash([]);
    ctx2d.shadowColor = '#ffd700';
    ctx2d.shadowBlur = 18 + 8 * Math.sin(t * 5);
    ctx2d.strokeStyle = '#ffd700';
    ctx2d.lineWidth = 3;
    ctx2d.strokeRect(grabbedBox.x * TILE + 2, grabbedBox.y * TILE + 2, TILE - 4, TILE - 4);
    ctx2d.shadowBlur = 0;
    ctx2d.restore();
  }

  // Player
  drawPlayer(ctx2d, gs.player.x * TILE, gs.player.y * TILE, t, gs.wi);

  requestAnimationFrame(renderGame);
}

function drawPortal(ctx, px, py, col1, col2, t) {
  const cx = px + TILE/2, cy = py + TILE/2;
  const r = TILE/2 - 4;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * 2);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(0, 0, r - i*4, 0, Math.PI*2);
    ctx.strokeStyle = i === 0 ? col1 : col2;
    ctx.lineWidth = 3 - i;
    ctx.stroke();
  }
  // Spinning particles
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = Math.cos(a) * r * 0.7;
    const y = Math.sin(a) * r * 0.7;
    ctx.fillStyle = col2;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayer(ctx, px, py, t, wi) {
  const cx = px + TILE/2, cy = py + TILE/2;
  const bob = Math.sin(t * 3) * 2;

  ctx.save();
  ctx.translate(cx, cy + bob);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, TILE/2-8, 14, 5, 0, 0, Math.PI*2);
  ctx.fill();

  // Personagem — sprite direcional conforme a direção do último movimento; se não carregou, usa o desenho vetorial original
  const facingSprite = playerSprites[playerFacing] || playerSprites.baixo;
  if (facingSprite && facingSprite.complete && facingSprite.naturalWidth > 0) {
    const size = TILE * 1.15;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(facingSprite, -size/2, -size/2, size, size);
    ctx.restore();
    return;
  }

  // Body
  const bodyGrad = ctx.createRadialGradient(-4, -6, 2, 0, 0, 18);
  bodyGrad.addColorStop(0, '#ff6b6b');
  bodyGrad.addColorStop(0.6, '#e84040');
  bodyGrad.addColorStop(1, '#b91c1c');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI*2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(-6, -4, 5, 0, Math.PI*2);
  ctx.arc(6, -4, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#1a0a0a';
  ctx.beginPath();
  ctx.arc(-5, -4, 3, 0, Math.PI*2);
  ctx.arc(7, -4, 3, 0, Math.PI*2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 2, 6, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

function checkButton(gs, bx, by) {
  // Check if player or any box is on this button (live check)
  if (gs.player.x === bx && gs.player.y === by) return true;
  return gs.boxes.some(b => b.x === bx && b.y === by);
}

function updatePermanentButtons(gs) {
  // Mark any currently-pressed button as permanently activated
  gs.buttonLinks.forEach(([bx, by]) => {
    if (checkButton(gs, bx, by)) {
      gs.permanentButtons.add(`${bx},${by}`);
    }
  });
}

function isButtonActive(gs, bx, by) {
  // Active if currently pressed OR permanently activated
  return gs.permanentButtons.has(`${bx},${by}`) || checkButton(gs, bx, by);
}

function checkDoorOpen(gs, dx, dy) {
  const key = `${dx},${dy}`;
  if (!gs.doors.hasOwnProperty(key)) return false;
  // Door opens if ANY linked button is active (permanently or currently pressed)
  return gs.buttonLinks.some(([bx, by]) => isButtonActive(gs, bx, by));
}

function isWalkable(gs, x, y) {
  if (x < 0 || y < 0 || x >= gs.w || y >= gs.h) return false;
  const tile = gs.grid[y][x];
  if (tile === 1) return false; // wall
  if (tile === 9 && !checkDoorOpen(gs, x, y)) return false; // closed door
  return true;
}

function getBoxAt(gs, x, y) {
  return gs.boxes.find(b => b.x === x && b.y === y);
}

function slideOnIce(gs, x, y, dx, dy, isBox) {
  // While on ice and can move
  let nx = x + dx, ny = y + dy;
  while (true) {
    if (!isWalkable(gs, nx, ny)) break;
    if (!isBox && getBoxAt(gs, nx, ny)) break;
    x = nx; y = ny;
    if (gs.grid[y][x] !== 7) break;
    nx = x + dx; ny = y + dy;
  }
  return {x, y};
}

function tryMove(dx, dy) {
  if (!gameState) return;
  const gs = gameState;

  // Update facing direction based on movement input (para trocar o sprite direcional)
  if (dx === 1) playerFacing = 'direita';
  else if (dx === -1) playerFacing = 'esquerda';
  else if (dy === 1) playerFacing = 'baixo';
  else if (dy === -1) playerFacing = 'cima';

  // === GRAB MODE: move player + grabbed box together ===
  if (grabbedBox) {
    const nx = gs.player.x + dx;
    const ny = gs.player.y + dy;
    const bnx = grabbedBox.x + dx;
    const bny = grabbedBox.y + dy;

    // Check bounds and walkability for player destination
    if (!isWalkable(gs, nx, ny) && !(nx === grabbedBox.x && ny === grabbedBox.y)) return;
    // Check bounds and walkability for box destination (no going out of map)
    if (bnx < 0 || bny < 0 || bnx >= gs.w || bny >= gs.h) return;
    const boxDestTile = gs.grid[bny][bnx];
    if (boxDestTile === 1) return; // box can't go into wall
    if (boxDestTile === 9 && !checkDoorOpen(gs, bnx, bny)) return; // closed door
    // Can't move box into another box
    const otherBox = gs.boxes.find(b => b !== grabbedBox && b.x === bnx && b.y === bny);
    if (otherBox) return;
    // Player moving INTO the box position is OK (they swap adjacency)
    // But if player's new position is NOT the box's current position and not walkable, block
    if (!(nx === grabbedBox.x && ny === grabbedBox.y)) {
      if (!isWalkable(gs, nx, ny)) return;
      // Also ensure no other box in player's new spot
      const boxAtPlayer = gs.boxes.find(b => b !== grabbedBox && b.x === nx && b.y === ny);
      if (boxAtPlayer) return;
    }

    // Move both
    grabbedBox.x = bnx;
    grabbedBox.y = bny;
    gs.player.x = nx;
    gs.player.y = ny;
    moves++;
    document.getElementById('hud-moves').textContent = moves;
    playSfx('push');
    updatePermanentButtons(gs);
    checkWin();
    return;
  }

  // === NORMAL MOVE ===
  const nx = gs.player.x + dx;
  const ny = gs.player.y + dy;

  if (!isWalkable(gs, nx, ny)) return;

  const box = getBoxAt(gs, nx, ny);
  if (box) {

    // Vinhas: primeira tentativa apenas solta a caixa.
    if (gs.grid[box.y][box.x] === 5) {
      const sameDir = box.releaseDir &&
        box.releaseDir.dx === dx &&
        box.releaseDir.dy === dy;

      if (!sameDir) {
        box.releaseDir = { dx, dy };
        playSfx('move');
        return;
      }

      box.releaseDir = null;
    }

    let bnx = box.x + dx, bny = box.y + dy;

    if (!isWalkable(gs, bnx, bny)) return;
    if (getBoxAt(gs, bnx, bny)) return;

    // Caixa entrando na vinha fica presa novamente
    if (gs.grid[bny] && gs.grid[bny][bnx] === 5) {
      box.releaseDir = null;
    }

    // Ice sliding for box
    if (gs.grid[bny] && gs.grid[bny][bnx] === 7) {
      const result = slideOnIce(gs, bnx, bny, dx, dy, true);
      bnx = result.x; bny = result.y;
    }

    // Portal teleport for box
    if (gs.portals.A && gs.portals.B) {
      if (bnx === gs.portals.A.x && bny === gs.portals.A.y) {
        const exit = getPortalExit(gs, 'A', dx, dy);
        if (exit) { bnx = exit.x; bny = exit.y; playSfx('portal'); }
      } else if (bnx === gs.portals.B.x && bny === gs.portals.B.y) {
        const exit = getPortalExit(gs, 'B', dx, dy);
        if (exit) { bnx = exit.x; bny = exit.y; playSfx('portal'); }
      }
    }

    box.x = bnx; box.y = bny;
    playSfx('push');
  } else {
    playSfx('move');
  }

  // Ice sliding for player
  let px = nx, py = ny;
  if (gs.grid[py][px] === 7) {
    const result = slideOnIce(gs, px, py, dx, dy, false);
    px = result.x; py = result.y;
    if (px !== nx || py !== ny) playSfx('ice');
  }

  // Portal teleport for player
  if (gs.portals.A && gs.portals.B) {
    if (px === gs.portals.A.x && py === gs.portals.A.y) {
      const exit = getPortalExit(gs, 'A', dx, dy);
      if (exit) { px = exit.x; py = exit.y; playSfx('portal'); }
    } else if (px === gs.portals.B.x && py === gs.portals.B.y) {
      const exit = getPortalExit(gs, 'B', dx, dy);
      if (exit) { px = exit.x; py = exit.y; playSfx('portal'); }
    }
  }

  gs.player.x = px;
  gs.player.y = py;
  moves++;
  document.getElementById('hud-moves').textContent = moves;

  updatePermanentButtons(gs);
  checkWin();
}

// ========================
// GRAB ABILITY
// ========================
function toggleGrab() {
  if (!gameState) return;
  const gs = gameState;

  if (grabbedBox) {
    // Release the box
    grabbedBox = null;
    grabMode = false;
    playSfx('move');
    return;
  }

  // Try to grab an adjacent box
  const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
  for (const {dx, dy} of dirs) {
    const bx = gs.player.x + dx;
    const by = gs.player.y + dy;
    const box = getBoxAt(gs, bx, by);
    if (box) {
      // Don't grab a vine-stuck box that hasn't been freed
      if (gs.grid[by][bx] === 5 && !box.releaseDir) {
        // Still grab it — player can try to pull it out
      }
      grabbedBox = box;
      grabMode = true;
      playSfx('button');
      return;
    }
  }
  // No box adjacent — just toggle off
  grabMode = false;
}

function getPortalExit(gs, which, dx, dy) {
  const src = which === 'A' ? gs.portals.A : gs.portals.B;
  const dst = which === 'A' ? gs.portals.B : gs.portals.A;
  if (!dst) return null;
  const ex = dst.x + dx, ey = dst.y + dy;
  if (isWalkable(gs, ex, ey)) return {x: ex, y: ey};
  return {x: dst.x, y: dst.y};
}

function checkWin() {
  const gs = gameState;
  const targets = [];
  for (let y = 0; y < gs.h; y++) {
    for (let x = 0; x < gs.w; x++) {
      if (gs.grid[y][x] === 2) targets.push({x, y});
    }
  }
  if (targets.length === 0) return;
  const allDone = targets.every(t => gs.boxes.some(b => b.x === t.x && b.y === t.y));
  if (allDone) triggerWin();
}

function triggerWin() {
  playSfx('win');
  const ld = getActiveLevelData(currentWorld, currentLevel);
  const par = ld ? ld.par : 999;
  let stars = 1;
  // In expert tutorial mode, always 3 stars
  if (currentDifficulty === 'expert' && currentWorld === 0) { stars = 3; }
  else if (moves <= par) stars = 3;
  else if (moves <= par * 1.5) stars = 2;

  setLevelComplete(currentWorld, currentLevel, stars);

  const overlay = document.getElementById('win-overlay');
  document.getElementById('win-moves-val').textContent = moves;

  const subs = ['Perfeito! 🎯', 'Muito bem! 💪', 'Fase completa! 🎉'];
  document.getElementById('win-sub').textContent = subs[3-stars];

  ['wstar1','wstar2','wstar3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.className = 'win-star' + (i < stars ? '' : ' empty');
    el.style.opacity = i < stars ? '1' : '0.3';
    if (i < stars) {
      setTimeout(() => el.classList.add('show'), 100 + i * 150);
    }
  });

  overlay.classList.add('show');

  // Particles
  for (let i = 0; i < 20; i++) {
    spawnParticle();
  }

  // Check if next level available
  const isLastLevel = currentLevel === 4;
  const maxWorld = getActiveWorlds().length - 1;
  const isLastWorld = currentWorld === maxWorld;
  const nextBtn = document.getElementById('btn-next');
  if (isLastLevel && isLastWorld) {
    nextBtn.textContent = '🏆 Fim do Jogo!';
    nextBtn.onclick = () => { overlay.classList.remove('show'); showScreen('worlds'); renderWorldSelect(); };
  } else if (isLastLevel) {
    nextBtn.textContent = 'Próximo Mundo →';
    nextBtn.onclick = () => {
      overlay.classList.remove('show');
      currentWorld++;
      currentLevel = 0;
      renderLevelSelect(currentWorld);
      showScreen('levels');
    };
  } else {
    nextBtn.textContent = 'Próxima Fase →';
    nextBtn.onclick = () => {
      overlay.classList.remove('show');
      currentLevel++;
      startLevel(currentWorld, currentLevel);
    };
  }
}

function spawnParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  const colors = ['#ffd700','#e84040','#a855f7','#22d3ee','#22c55e'];
  el.style.cssText = `
    width: ${4+Math.random()*8}px;
    height: ${4+Math.random()*8}px;
    background: ${colors[Math.floor(Math.random()*colors.length)]};
    left: ${30+Math.random()*40}vw;
    top: ${30+Math.random()*40}vh;
    --dx: ${(Math.random()-0.5)*400}px;
    --dy: ${(Math.random()-0.5)*400}px;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// ========================
// CONTROLS
// ========================
document.addEventListener('keydown', (e) => {
  if (currentScreen !== 'game') return;
  if (document.getElementById('win-overlay').classList.contains('show')) return;
  if (currentDifficulty === 'expert') {
    // In expert mode, only R works via keyboard — but ONLY when NOT focused on the text input
    if (e.key.toLowerCase() === 'r' && document.activeElement !== document.getElementById('expert-cmd-input')) {
      e.preventDefault();
      startLevel(currentWorld, currentLevel);
    }
    return;
  }
  const key = e.key.toLowerCase();

  switch(key) {
    case 'arrowup':
    case 'w':
      e.preventDefault();
      tryMove(0,-1);
      break;

    case 'arrowdown':
    case 's':
      e.preventDefault();
      tryMove(0,1);
      break;

    case 'arrowleft':
    case 'a':
      e.preventDefault();
      tryMove(-1,0);
      break;

    case 'arrowright':
    case 'd':
      e.preventDefault();
      tryMove(1,0);
      break;

    case 'r':
      e.preventDefault();
      startLevel(currentWorld, currentLevel);
      break;

    case 'e':
      e.preventDefault();
      toggleGrab();
      break;
  }
});

// ========================
// DEVELOPER MODE
// ========================
function openDevModal() {
  document.getElementById('dev-modal').classList.add('open');
  document.getElementById('dev-password-input').value = '';
  document.getElementById('dev-error-msg').textContent = '';
  setTimeout(() => document.getElementById('dev-password-input').focus(), 100);
}
function closeDevModal() {
  document.getElementById('dev-modal').classList.remove('open');
}
function tryDevPassword() {
  const input = document.getElementById('dev-password-input');
  const val = input.value.trim();
  if (val === '12345') {
    devMode = true;
    closeDevModal();
    document.getElementById('dev-badge').classList.add('visible');
    // Unlock all worlds/levels in saveData for consistency
    for (let w = 0; w < 5; w++) {
      if (!saveData.worlds[w]) saveData.worlds[w] = { unlocked: true, levels: [{},{},{},{},{}] };
      saveData.worlds[w].unlocked = true;
      for (let l = 0; l < 5; l++) {
        if (!saveData.worlds[w].levels[l]) saveData.worlds[w].levels[l] = {};
        saveData.worlds[w].levels[l].unlocked = true;
      }
    }
    persistSave();
    // Flash badge
    const badge = document.getElementById('dev-badge');
    badge.style.animation = 'none';
    badge.textContent = '🔧 MODO DEV ATIVO — TODAS AS FASES LIBERADAS!';
    setTimeout(() => { badge.textContent = '🔧 MODO DEV ATIVO'; }, 2500);
  } else {
    const input2 = document.getElementById('dev-password-input');
    document.getElementById('dev-error-msg').textContent = '❌ Senha incorreta!';
    input2.classList.add('error');
    input2.value = '';
    setTimeout(() => input2.classList.remove('error'), 400);
  }
}

// ========================
// UI EVENTS
// ========================
document.getElementById('earth-btn').addEventListener('click', () => {
  initAudio();
  showScreen('difficulty');
});
document.getElementById('dev-mode-btn').addEventListener('click', () => {
  initAudio();
  openDevModal();
});
document.getElementById('dev-enter-btn').addEventListener('click', tryDevPassword);
document.getElementById('dev-password-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryDevPassword();
});
document.getElementById('dev-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('dev-modal')) closeDevModal();
});
document.getElementById('settings-btn').addEventListener('click', () => {
  initAudio();
  document.getElementById('settings-modal').classList.add('open');
});
document.getElementById('back-to-title').addEventListener('click', () => showScreen('title'));
document.getElementById('back-to-title-from-diff').addEventListener('click', () => showScreen('title'));
document.getElementById('back-to-worlds').addEventListener('click', () => {
  renderWorldSelect();
  showScreen('worlds');
});
document.getElementById('back-to-levels').addEventListener('click', () => {
  renderLevelSelect(currentWorld);
  showScreen('levels');
});
document.getElementById('btn-reset').addEventListener('click', () => startLevel(currentWorld, currentLevel));
document.getElementById('btn-retry').addEventListener('click', () => {
  document.getElementById('win-overlay').classList.remove('show');
  startLevel(currentWorld, currentLevel);
});
document.getElementById('settings-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('settings-modal')) closeSettings();
});

// Expert: Enter key in command input submits
document.getElementById('expert-cmd-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); submitExpertCommand(); }
});

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('open');
}

// ========================
// DIFFICULTY FUNCTIONS
// ========================
function selectDifficulty(diff) {
  currentDifficulty = diff;
  initAudio();
  renderWorldSelect();
  showScreen('worlds');
}

function getActiveWorlds() {
  return currentDifficulty === 'expert' ? WORLDS_EXPERT : WORLDS;
}

function getActiveLevelData(wi, li) {
  if (currentDifficulty === 'easy') {
    return LEVEL_DATA_EASY[wi * 5 + li] ? LEVEL_DATA_EASY[wi * 5 + li][0] : LEVEL_DATA[wi * 5 + li][0];
  } else if (currentDifficulty === 'normal') {
    return LEVEL_DATA_NORMAL[wi * 5 + li] ? LEVEL_DATA_NORMAL[wi * 5 + li][0] : LEVEL_DATA[wi * 5 + li][0];
  } else if (currentDifficulty === 'expert') {
    if (wi === 0) return EXPERT_TUTORIAL_LEVELS[li] ? EXPERT_TUTORIAL_LEVELS[li][0] : null;
    const nwi = wi - 1;
    return LEVEL_DATA_NORMAL[nwi * 5 + li] ? LEVEL_DATA_NORMAL[nwi * 5 + li][0] : LEVEL_DATA[nwi * 5 + li][0];
  }
  return LEVEL_DATA[wi * 5 + li][0];
}

// ========================
// EXPERT COMMAND SYSTEM
// ========================
function setExpertAction(action) {
  expertAction = action;
  const btnMover   = document.getElementById('btn-action-mover');
  const btnSegurar = document.getElementById('btn-action-segurar');
  btnMover.className   = 'expert-action-btn' + (action === 'mover'   ? ' selected-mover'   : '');
  btnSegurar.className = 'expert-action-btn' + (action === 'segurar' ? ' selected-segurar' : '');
  setExpertFeedback(`Ação selecionada: ${action.toUpperCase()}. Agora digite a direção.`, 'ok');
  document.getElementById('expert-cmd-input').focus();
}

function setExpertFeedback(msg, type) {
  const el = document.getElementById('expert-feedback');
  el.textContent = msg;
  el.className = 'expert-feedback ' + (type || '');
}

function submitExpertCommand() {
  if (!gameState || currentDifficulty !== 'expert') return;
  if (document.getElementById('win-overlay').classList.contains('show')) return;

  const input = document.getElementById('expert-cmd-input');
  const raw = input.value.trim().toLowerCase();
  input.value = '';

  const VALID_DIRS = { 'direita': [1,0], 'esquerda': [-1,0], 'cima': [0,-1], 'baixo': [0,1] };

  if (expertAction === 'segurar') {
    // "segurar" command — toggle grab. Direction word triggers grab attempt, then can move.
    if (!VALID_DIRS[raw] && raw !== '') {
      setExpertFeedback(`❌ Direção inválida: "${raw}". Use: direita, esquerda, cima ou baixo.`, 'err');
      shakeInput();
      return;
    }
    // If no text — try grabbing adjacent box
    if (raw === '') {
      const gs = gameState;
      if (grabbedBox) {
        grabbedBox = null;
        grabMode = false;
        setExpertFeedback('✋ Bloco solto.', 'ok');
        playSfx('move');
        return;
      }
      // Try to grab adjacent
      const dirs = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
      let grabbed = false;
      for (const {dx,dy} of dirs) {
        const bx = gs.player.x + dx, by = gs.player.y + dy;
        const box = getBoxAt(gs, bx, by);
        if (box) { grabbedBox = box; grabMode = true; grabbed = true; playSfx('button'); break; }
      }
      if (!grabbed) {
        setExpertFeedback('❌ Nenhuma caixa adjacente para segurar!', 'err');
        shakeInput();
      } else {
        setExpertFeedback('🤝 Bloco segurado! Agora selecione MOVER para arrastá-lo.', 'ok');
      }
      return;
    }
    // With direction: try grab in that direction
    const [dx, dy] = VALID_DIRS[raw];
    const gs = gameState;
    const bx = gs.player.x + dx, by = gs.player.y + dy;
    const box = getBoxAt(gs, bx, by);
    if (!box) {
      setExpertFeedback('❌ Não há caixa nessa direção para segurar!', 'err');
      shakeInput();
      return;
    }
    if (grabbedBox === box) {
      grabbedBox = null; grabMode = false;
      setExpertFeedback('✋ Bloco solto.', 'ok');
      playSfx('move');
    } else {
      grabbedBox = box; grabMode = true;
      setExpertFeedback(`🤝 Bloco segurado à ${raw}! Use MOVER para arrastá-lo.`, 'ok');
      playSfx('button');
    }
    return;
  }

  // expertAction === 'mover'
  if (!VALID_DIRS[raw]) {
    setExpertFeedback(`❌ Direção inválida: "${raw}". Use: direita, esquerda, cima ou baixo.`, 'err');
    shakeInput();
    return;
  }

  const [dx, dy] = VALID_DIRS[raw];
  const prevMoves = moves;
  tryMove(dx, dy);
  if (moves > prevMoves) {
    setExpertFeedback(`✅ Moveu para ${raw}.`, 'ok');
  } else {
    setExpertFeedback(`⛔ Não foi possível mover para ${raw}. Há um obstáculo.`, 'err');
  }
}

function shakeInput() {
  const inp = document.getElementById('expert-cmd-input');
  inp.classList.add('error');
  setTimeout(() => inp.classList.remove('error'), 400);
}

// ========================
// INIT
// ========================
loadSave();

// Ensure first world/level unlocked
if (!saveData.worlds[0]) saveData.worlds[0] = { unlocked: true, levels: [{unlocked:true},{},{},{},{}] };
saveData.worlds[0].unlocked = true;
saveData.worlds[0].levels[0].unlocked = true;
persistSave();
<<<<<<<< HEAD:script.js
========
</script>
</body>
</html>
>>>>>>>> 3376faf119652d06686978f1f2e4ec01752345a8:index.html
