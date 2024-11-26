const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rotas
// 1. Compartilhar em redes sociais
app.post('/api/share', (req, res) => {
    const { platform } = req.body;
    if (!platform) {
        return res.status(400).json({ message: 'Plataforma não especificada!' });
    }

    // Simula compartilhamento (integrações reais variam por API de cada plataforma)
    console.log(`Compartilhando na plataforma: ${platform}`);
    return res.json({ message: `Compartilhado com sucesso no ${platform}!` });
});

// 2. Enviar mensagem de contato
app.post('/api/contact', async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ message: 'E-mail e mensagem são obrigatórios!' });
    }

    try {
        // Configurar o transporte de e-mail
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Troque pelo serviço utilizado
            auth: {
                user: 'seuemail@gmail.com', // Substitua pelo seu e-mail
                pass: 'suasenha'           // Substitua pela senha do e-mail (use senhas de app)
            }
        });

        // Enviar e-mail de confirmação ao usuário
        await transporter.sendMail({
            from: 'seuemail@gmail.com',
            to: email,
            subject: 'Mensagem Recebida - Econnect',
            text: `Olá! Recebemos sua mensagem: "${message}". Em breve entraremos em contato!`
        });

        // Responder sucesso
        res.json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro ao enviar mensagem. Tente novamente mais tarde.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
