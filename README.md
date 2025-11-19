# 💧 Hidro-Manager: O Desafio do Gestor de Recursos

![Badge Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Badge TCC](https://img.shields.io/badge/Projeto-TCC%20Sistemas%20de%20Informação-blue)
![Badge Tecnologias](https://img.shields.io/badge/Tecnologias-HTML%20%7C%20CSS%20%7C%20JavaScript-orange)

## 🎯 Sobre o Projeto

O **Hidro-Manager** é um **Simulador Gamificado (Serious Game)** desenvolvido como Produto Final de Conclusão de Curso (TCC) em Sistemas de Informação.

O objetivo principal é criar uma ferramenta educacional e analítica que demonstre, de forma interativa, **como as decisões humanas (impacto antrópico) alteram o equilíbrio do ciclo hidrológico** em uma bacia hidrográfica simulada. O usuário assume o papel de um gestor de recursos, tomando decisões de investimento por rodada (turno) e observando as consequências ambientais, sociais e econômicas.

O foco acadêmico está na **modelagem da lógica de simulação causal** e na **eficácia da gamificação** para o ensino superior de conceitos complexos de sustentabilidade e sistemas ambientais.

## ✨ Funcionalidades (Features)

* **Simulação por Rodadas:** O jogo se desenrola em um número finito de rodadas (anos), exigindo planejamento a longo prazo.
* **Decisões Causa-e-Efeito:** O jogador interage por meio de ações com custos e impactos diretos sobre o sistema.
    * Ex: **Urbanização** (Aumento de Risco de Enchente e Diminuição da Infiltração).
    * Ex: **Reflorestamento** (Melhora da Qualidade da Água e Aumento da Infiltração).
* **Key Performance Indicators (KPIs) Hídricos:** O dashboard exibe indicadores ambientais e sociais que reagem às decisões:
    * Qualidade da Água
    * Risco de Enchente
    * Taxa de Infiltração
    * Satisfação Pública
* **Gerenciamento de Recursos:** O jogador deve equilibrar o **Orçamento** disponível, que é afetado pelas decisões de investimento e pela satisfação pública.
* **Motor de Simulação (Game Engine):** Lógica implementada em JavaScript puro para garantir que a simulação e o cálculo do impacto sejam o núcleo do projeto.

## 💻 Tecnologias Utilizadas

Este projeto foi construído com foco na portabilidade e acessibilidade web, sem a necessidade de *frameworks* de *build* complexos:

* **Frontend:** HTML5 (Estrutura) e CSS3 (Estilização do Dashboard).
* **Lógica Principal:** JavaScript (Vanilla JS) para o motor de simulação (`game.js`) e manipulação de DOM.
* **Design:** UI/UX simples e funcional para focar na leitura dos dados.

## 🚀 Como Executar o Projeto Localmente

Para rodar o Hidro-Manager em sua máquina local, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/iamvitoria/TCC]
    ```

2.  **Acesse a Pasta:**
    ```bash
    cd hidro-manager
    ```

3.  **Abra o Arquivo:**
    Simplesmente abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Firefox, Edge, etc.).

    *Nota: Como o projeto é puramente Frontend, ele não requer um servidor local (como Node.js ou Python Simple HTTP Server) para ser executado, embora o uso de um seja sempre recomendado para testes.*

## 📐 Estrutura do Código

Os arquivos principais são:

| Arquivo | Descrição |
| :--- | :--- |
| `index.html` | Estrutura HTML da interface e do Dashboard principal. |
| `style.css` | Folha de estilos para o layout do jogo. |
| `game.js` | **Contém o motor de simulação, o estado do jogo (`gameState`) e a lógica de impacto das decisões.** |

## 🤝 Contribuições (TCC)

Este projeto foi desenvolvido por **Vitória Luiza Camara** como parte do trabalho de conclusão de curso em Sistemas de Informação pela UFSM.

* **Autora:** Vitória Luiza Camara
* **Orientadora:** Lisandra Manzoni Fontoura
* **Instituição:** Universidade Federal de Santa Maria
