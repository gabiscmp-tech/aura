const http = require('http');
const mineflayer = require('mineflayer');

// --- 1. SERVIDOR WEB PARA A RENDER ---
const webPort = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Aura Humanoide Online\n');
}).listen(webPort, '0.0.0.0');

// --- 2. CONFIGURAÇÕES ---
const botArgs = {
  host: 'anarquiajogar.aternos.me', 
  port: 62224,
  username: '24horas', 
  version: '26.1.2' 
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('[SISTEMA] Comportamento humano iniciado.');
    mainLoop();
  });

  // --- 3. LÓGICA DE COMPORTAMENTO "HUMANO" ---
  async function mainLoop() {
    if (!bot || !bot.entity) return;

    // 1. Escolhe uma ação aleatória
    const acao = Math.random();

    if (acao < 0.6) { 
      // 60% de chance de apenas olhar para algum lugar (curiosidade)
      const yaw = (Math.random() * 360) * (Math.PI / 180);
      const pitch = ((Math.random() * 40) - 20) * (Math.PI / 180);
      await bot.look(yaw, pitch, true);
    } 
    else if (acao < 0.9) {
      // 30% de chance de andar um pouco
      const girar = (Math.random() * 360) * (Math.PI / 180);
      await bot.look(girar, 0, true);
      
      bot.setControlState('forward', true);
      
      // Chance de pular enquanto anda (muito comum em jogadores)
      if (Math.random() > 0.5) bot.setControlState('jump', true);
      
      // Anda por um tempo aleatório entre 1 e 3 segundos
      await new Promise(res => setTimeout(res, Math.random() * 2000 + 1000));
      
      bot.setControlState('forward', false);
      bot.setControlState('jump', false);
    } 
    else {
      // 10% de chance de agachar (sneak) por um tempinho
      bot.setControlState('sneak', true);
      await new Promise(res => setTimeout(res, 2000));
      bot.setControlState('sneak', false);
    }

    // Espera um tempo aleatório para a próxima ação (entre 5 e 15 segundos)
    // Isso quebra o padrão robótico de "10 em 10 segundos"
    const proximaAcao = Math.random() * 10000 + 5000;
    setTimeout(mainLoop, proximaAcao);
  }

  // RECONEXÃO
  bot.on('end', () => setTimeout(createBot, 15000));
  bot.on('error', (err) => console.log('Erro:', err.message));
}

createBot();
