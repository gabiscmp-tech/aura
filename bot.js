const mineflayer = require('mineflayer');

// Configurações do seu servidor
const botOptions = {
    host: 'enx-cirion-24.enx.host', // Endereço limpo (sem a porta)
    port: 10016,                     // Porta em linha separada
    username: 'VoxBot_24h',          // Nome do bot no servidor
    version: '1.21.1'                // Versão do seu servidor
};

function createBot() {
    const bot = mineflayer.createBot(botOptions);

    // Quando o bot logar com sucesso
    bot.on('login', () => {
        console.log(`[${new Date().toLocaleTimeString()}] Bot logado com sucesso!`);
    });

    // Chat log (opcional: para você ver o que acontece no server pelo console)
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`${username}: ${message}`);
    });

    // Sistema Anti-AFK (faz o bot pular a cada 5 minutos)
    setInterval(() => {
        if (bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 1000);
        }
    }, 300000);

    // Reconexão automática em caso de erro ou kick
    bot.on('end', () => {
        console.log('Conexão perdida. Tentando reconectar em 30 segundos...');
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => {
        console.log('Erro no bot:', err);
    });
}

createBot();