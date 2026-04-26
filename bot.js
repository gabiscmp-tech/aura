const http = require('http');
const mineflayer = require('mineflayer');

// --- 1. SERVIDOR WEB PARA A RENDER (NÃO MEXER AQUI) ---
const webPort = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot Aura Ativo e Online\n');
}).listen(webPort, '0.0.0.0', () => {
  console.log(`[WEB] Servidor de check-in rodando na porta ${webPort}`);
});

// --- 2. CONFIGURAÇÕES DO BOT DE MINECRAFT ---
const botArgs = {
  host: 'enx-cirion-24.enx.host', 
  port: 10016,                   // <--- PORTA ATUALIZADA AQUI
  username: 'AuraBot_Vox',       
  version: '1.21.1'               
};

let bot;

function createBot() {
  console.log('[MINE] Tentando conectar na porta 10016...');
  bot = mineflayer.createBot(botArgs);

  bot.on('spawn', () => {
    console.log('[MINE] Bot entrou no servidor com sucesso!');
  });

  // SISTEMA DE RECONEXÃO
  bot.on('end', () => {
    console.log('[MINE] Desconectado. Reconectando em 30 segundos...');
    setTimeout(createBot, 30000); 
  });

  bot.on('error', (err) => {
    console.log(`[ERRO] Erro: ${err.message}`);
    if (err.code === 'ECONNREFUSED') {
       console.log('[ERRO] Conexão recusada na porta 10016. Verifique se o IP/Porta estão certos.');
    }
  });
}

createBot();
