const http = require('http');
const mineflayer = require('mineflayer');

// --- 1. SERVIDOR WEB PARA A RENDER ---
const webPort = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Aura Ativo e Online\n');
}).listen(webPort, '0.0.0.0', () => {
  console.log(`[WEB] Servidor rodando na porta ${webPort}`);
});

// --- 2. CONFIGURAÇÕES DO BOT ---
const botArgs = {
  host: 'enx-cirion-24.enx.host', 
  port: 10016,
  username: 'AuraBot_Vox', 
  version: '1.21.1' 
};

let bot;

function createBot() {
  console.log('[MINE] Conectando...');
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('[MINE] Bot online! Iniciando movimento aleatório básico...');
    
    // Inicia o loop de movimento
    setInterval(() => {
      // 1. Escolhe uma direção aleatória (gira o bot)
      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0);

      // 2. Faz o bot andar para frente
      bot.setControlState('forward', true);

      // 3. Depois de 2 segundos, ele para de andar
      setTimeout(() => {
        if (bot) bot.setControlState('forward', false);
      }, 2000);

    }, 10000); // Repete o processo a cada 10 segundos
  });

  // SISTEMA DE RECONEXÃO
  bot.on('end', () => {
    console.log('[MINE] Desconectado. Reconectando em 10 segundos...');
    setTimeout(createBot, 10000); 
  });

  bot.on('error', (err) => console.log(`[ERRO]: ${err.message}`));
}

createBot();
