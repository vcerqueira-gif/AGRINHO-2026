// --- SIMULADOR OPERACIONAL DE SAFRA (JAVASCRIPT COMPLETO) ---

let currentStage = 0; 
let capital = 100000;
let soloSaude = 100;
let ano = 1;

// Banco de dados de cenários complexos do simulador profissional
const cenarios = [
    {
        title: "Safra Ano 1: Preparo Inicial e Cobertura",
        desc: "O solo herdado está exposto e compactado devido a manejos antigos ruins. Qual sua primeira ação?",
        options: [
            {
                text: "Passar Arado Pesado para afofar a terra rapidamente.",
                cost: 15000, soilMod: -30, profit: 30000,
                log: "[ALERTA] Você revolveu a terra. O solo perdeu umidade drástica e microrganismos morreram."
            },
            {
                text: "Implantar cultura de cobertura (Braquiária) para gerar palhada abundante sem revolver.",
                cost: 20000, soilMod: 20, profit: 45000,
                log: "[SUCESSO] Excelente escolha! Palhada protetora criada. Estrutura biológica preservada."
            }
        ]
    },
    {
        title: "Safra Ano 1: Semeadura da Soja",
        desc: "Com o solo preparado, chega o momento crítico de inserir as sementes na área.",
        options: [
            {
                text: "Utilizar Semeadora de Discos Diretos para cortar a palhada e depositar as sementes sem perturbar o solo.",
                cost: 25000, soilMod: 10, profit: 60000,
                log: "[SUCESSO] Plantio Direto executado com precisão. Retenção hídrica máxima mantida."
            },
            {
                text: "Remover a palhada superficial manualmente para limpar a linha antes do trator convencional.",
                cost: 10000, soilMod: -15, profit: 25000,
                log: "[FALHA] Sem a proteção da palha, o sol causticante escaldou a atividade microbiana do solo."
            }
        ]
    },
    {
        title: "Safra Ano 2: Controle Biológico de Pragas",
        desc: "Sua lavoura de milho sofreu uma infestação severa de lagarta-do-cartucho. Qual o plano de manejo?",
        options: [
            {
                text: "Aplicar carga massiva de defensivo químico de amplo espectro imediatamente.",
                cost: 30000, soilMod: -20, profit: 40000,
                log: "[ALERTA] Pragas eliminadas, mas os insetos polinizadores e inimigos naturais também morreram."
            },
            {
                text: "Liberar vespinhas (Trichogramma) para controle biológico integrado (MIP).",
                cost: 15000, soilMod: 15, profit: 55000,
                log: "[SUCESSO] Equilíbrio ecológico mantido. Natureza e produtividade atuando em total simbiose."
            }
        ]
    },
    {
        title: "Safra Ano 3: Tomada de Decisão Final (Rotação)",
        desc: "Último ano da gestão. O mercado está pagando muito bem por Soja consecutiva, mas a terra pede descanso.",
        options: [
            {
                text: "Plantar soja novamente na mesma área para lucrar rápido no curto prazo.",
                cost: 40000, soilMod: -35, profit: 45000,
                log: "[ALERTA] Monocultura exauriu os nutrientes específicos. Pragas voltaram muito mais resistentes."
            },
            {
                text: "Fazer Rotação de Culturas inserindo Crotalária para fixar Nitrogênio natural na terra.",
                cost: 15000, soilMod: 30, profit: 70000,
                log: "[SUCESSO] Solo enriquecido! Bioestrutura recuperada e produtividade recorde na colheita."
            }
        ]
    }
];

// Captura de Elementos HUD
const hudAno = document.getElementById('hud-ano');
const hudMoney = document.getElementById('hud-money');
const hudSoil = document.getElementById('hud-soil');
const panelTitle = document.getElementById('decision-title');
const panelDesc = document.getElementById('decision-desc');
const optionsStack = document.getElementById('options-stack');
const logContent = document.getElementById('log-content');

function updateHUD() {
    hudAno.textContent = ano <= 3 ? `${ano}º Ano` : "Concluído";
    hudMoney.textContent = `R$ ${capital.toLocaleString('pt-BR')}`;
    hudSoil.textContent = `${soloSaude}%`;
}

function printLog(text, isSuccess) {
    const p = document.createElement('p');
    p.textContent = text;
    if (!isSuccess) p.className = "system-msg";
    logContent.appendChild(p);
    logContent.scrollTop = logContent.scrollHeight; // Auto-scroll
}

function loadScenario() {
    if (soloSaude <= 0 || capital <= 0) {
        gameOver(false);
        return;
    }

    if (currentStage >= cenarios.length) {
        gameOver(true);
        return;
    }

    // Configura o avanço dos anos de forma visual
    if(currentStage === 2) ano = 2;
    if(currentStage === 3) ano = 3;
    updateHUD();

    const cenario = cenarios[currentStage];
    panelTitle.textContent = cenario.title;
    panelDesc.textContent = cenario.desc;
    optionsStack.innerHTML = '';

    cenario.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.textContent = `${opt.text} (Custo: R$ ${opt.cost.toLocaleString('pt-BR')})`;
        btn.onclick = () => executeDecision(opt);
        optionsStack.appendChild(btn);
    });
}

function executeDecision(option) {
    capital -= option.cost;
    soloSaude += option.soilMod;
    if(soloSaude > 100) soloSaude = 100;
    capital += option.profit;

    printLog(option.log, option.soilMod > 0);
    
    currentStage++;
    setTimeout(loadScenario, 1200);
}

function gameOver(victory) {
    optionsStack.innerHTML = '';
    if (victory) {
        panelTitle.textContent = "🏆 Certificação de Agro Sustentável!";
        panelDesc.textContent = `Parabéns Engenheiro(a)! Sua fazenda prosperou. Saldo Final: R$ ${capital.toLocaleString('pt-BR')} | Saúde do Solo: ${soloSaude}%.`;
        printLog("[SISTEMA] Missão concluída com louvor. Equilíbrio perfeito entre produção e ecologia atingido.", true);
    } else {
        panelTitle.textContent = "🍂 Falência Operacional";
        panelDesc.textContent = "Suas decisões degradaram o solo ou exauriram seu fluxo de caixa de forma irreversível.";
        printLog("[CRÍTICO] Operação interrompida por colapso técnico ambiental.", false);
    }
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn-primary';
    restartBtn.style.marginTop = '1rem';
    restartBtn.textContent = 'Reiniciar Nova Gestão';
    restartBtn.onclick = () => {
        currentStage = 0; capital = 100000; soloSaude = 100; ano = 1;
        logContent.innerHTML = '';
        updateHUD();
        loadScenario();
    };
    optionsStack.appendChild(restartBtn);
}

// Inicializador
window.onload = loadScenario;