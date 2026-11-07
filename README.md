# Enigma dos Reinos: Jornada do Pensamento Computacional

## 1. Autor(es)

Francisco Luiz Ferreira dos Santos  
Ígor Fernandes Dammous  
Joao Vitor Alves do Nascimento Silva  
Regiane Leane Leite Golla  
Soraia Canoso Bandeira  
Vinicius Raimundo Dos Santos  

## 2. Título do Jogo

Enigma dos Reinos: Jornada do Pensamento Computacional

## 3. Objetivo Geral

Desenvolver um jogo digital educacional que promova o aprendizado de pensamento computacional, estimulando habilidades como lógica, resolução de problemas, criação de algoritmos e análise crítica, alinhado às diretrizes da BNCC.
O jogo busca proporcionar uma experiência interativa e gamificada que permita aos alunos aprender fazendo (“learning by doing”), com feedback imediato e progressão gradual de complexidade, permitindo a evolução do raciocínio lógico do aluno ao longo dos Reinos.

## 4. Habilidades BNCC Atendidas

* EF06CO02 - Elaborar algoritmos que envolvam instruções sequenciais, de repetição e de seleção
* EF06CO04 – Construir algoritmos para resolver problemas
* EF06CO05 – Identificar os recursos (entrada) e resultados (saída) definindo a solução do problema como uma relação entre entrada e saída.
* EF06CO06 – Comparar diferentes casos particulares (instâncias) de um mesmo problema, identificando as semelhanças e diferenças entre eles
* EF07CO02 - Analisar os programas (recursos e resultados) para detectar e remover erros.
* EF07CO05 – Decompor problemas em partes menores e reutilização dos recursos
* EF08CO05 – Compreender os conceitos de paralelismo, concorrência e armazenamento/processamento distribuídos

## 5. Público-Alvo

Alunos do Ensino Fundamental II, mais precisamente alunos do 6º e 7º Ano, e professores que desejam utilizar ferramentas digitais de apoio ao ensino de lógica e computação.

## 6. Descrição do Jogo

O Enigma dos Reinos é um jogo digital educacional baseado em desafios de lógica, no qual o jogador deve controlar um personagem por meio de movimentos e comandos para empurrar blocos até os objetivos.
O jogo se passa em um ambiente estruturado em grade (grid), dividido em 5 Reinos (Mundos) temáticos, onde o jogador precisa atingir objetivos como alcançar um destino, desviar de obstáculos, usar superfícies escorregadias (gelo), lidar com vinhas e ativar interruptores.

O grande diferencial do projeto é a integração com a **Academia de Código**, um módulo no menu principal que ensina conceitos reais de programação (Variáveis, Condições, Loops, Algoritmos e Eventos) conectando cada lição diretamente às mecânicas que o jogador acabou de vivenciar no jogo.

A proposta pedagógica é baseada na experimentação: o jogador cria uma solução, executa, observa o resultado e realiza ajustes, promovendo o desenvolvimento do pensamento lógico e computacional.

## 7. Mecânicas e Fases

O jogo possui 3 níveis de dificuldade (Fácil, Normal e Expert) e 5 Reinos. Cada reino possui 3 fases normais geradas proceduralmente e 1 batalha contra um Chefe.

**Mecânicas principais:**

* **Empurrar Blocos:** Desafios no estilo Sokoban (quebra-cabeça).
* **Geração Procedural com Seed:** As fases são geradas por um algoritmo de BFS (Busca em Largura) que garante que sempre haja uma solução, mas cada sessão de jogo gera um layout diferente.
* **Modo Expert (Comandos de Texto):** O jogador não usa o teclado direcional, mas sim digita comandos (`mover direita`, `segurar bloco`). Isso inclui uma **Fila de Comandos** onde é possível programar um lote de ações usando a estrutura de repetição (`repetir 4 vezes mover direita`).
* **Batalhas de Chefe:** Ao final de cada reino, o jogador enfrenta um chefe em um minigame de memória e reflexo para quebrar a barreira do alvo verde.
* **Interruptores e Portas:** Fases onde o alvo é cercado por portas que só abrem ao pisar no botão correto.

## 8. Sistema de Pontuação

O sistema é baseado em desempenho e gamificação:

* Completar a Fase.
* Resolver com menos comandos (Par de movimentos).
* Eficiência (O uso de loops no Modo Expert reduz a pontuação de comandos).
* **Sistema de Estrelas:** 1, 2 ou 3 estrelas com base no número de movimentos usados versus o "Par" da fase.
* **Progressão de Reinos:** O jogador desbloqueia o próximo Mundo ao completar a fase 3 ou ao derrotar o Chefe do Mundo atual.
* O progresso é salvo no navegador via `localStorage`, de forma isolada para cada nível de dificuldade.
* A interface mostra pontos totais, estrelas por Fase, botão de mudo global e conquistas da Academia.

## 9. Tecnologias Utilizadas

### Front-end

* HTML, CSS, JavaScript Vanilla (sem frameworks externos).
* Renderização via Canvas API para o tabuleiro e batalhas de chefe.
* Web Audio API para geração de música e efeitos sonoros em tempo real (sem arquivos de áudio externos).
* Geração procedural de fases com RNG determinístico (mulberry32) e verificação de solvabilidade via BFS.

### Estrutura

* Execução prioritariamente no navegador.
* Código modularizado em `script.js` (motor principal), `boss-fight.js` (chefes) e `academy.js` (educação).
* Documentação em HTML e Changelog detalhado.

## 10. Resultados Esperados

* Introdução eficaz ao pensamento computacional.
* Desenvolvimento de habilidades de lógica e resolução de problemas.
* Maior engajamento dos alunos com conteúdos de tecnologia.
* Ferramenta simples e utilizável em ambiente escolar (cada aluno pode ter fases diferentes na mesma máquina devido à semente de sessão).
* Base sólida para expansão futura do projeto.
* Desenvolvimento da capacidade de criar soluções mais eficientes por meio de estruturas computacionais.

## 11. Considerações Finais

A versão atual do **Enigma dos Reinos** foi projetada com foco na viabilidade técnica e pedagógica, superando a fase de MVP ao integrar mecânicas robustas de geração de fases, combate e um módulo teórico de ensino (Academia).
O projeto mantém alinhamento com a BNCC e apresenta potencial de evolução para versões mais completas, incluindo novos Reinos, expansão da narrativa (Storytelling) e recursos educacionais.
O jogo se apresenta como uma base sólida para projetos futuros e possível continuidade acadêmica ou profissional. O projeto também incorpora progressão de complexidade inspirada em jogos educacionais consolidados, permitindo uma evolução gradual do aprendizado.
