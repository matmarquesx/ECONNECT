const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Middleware para permitir CORS
app.use(
    cors({
        origin: 'http://localhost:3001', // Substitua pelo domínio do frontend
    })
);

// Rota para compartilhar no Facebook
app.post('/api/share', (req, res) => {
    try {
        const { platform, product } = req.body;

        if (!platform || !product) {
            return res.status(400).json({ message: 'Plataforma ou produto não especificado!' });
        }

        if (platform !== 'facebook') {
            return res.status(400).json({ message: 'Plataforma não suportada!' });
        }

        // URLs das imagens
        const productImages = {
            tomate: 'https://imgur.com/9lSfm47',
            favorita: 'https://imgur.com/wnwfp7K',
        };

        const selectedImage = productImages[product];
        if (!selectedImage) {
            return res.status(400).json({ message: 'Produto não encontrado!' });
        }

        const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedImage)}`;

        console.log(`[INFO] Compartilhando ${product} com imagem ${selectedImage}`);

        return res.json({
            message: 'Abrindo Facebook para compartilhamento!',
            shareURL: facebookShareURL,
        });
    } catch (error) {
        console.error('[ERRO] Erro na rota de compartilhamento:', error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// Rota de envio de contato
app.post('/api/contact', async (req, res) => {
    const { email, message } = req.body;
    if (!email || !message) {
        return res.status(400).json({ message: 'E-mail e mensagem são obrigatórios!' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'maatheusousa@gmail.com',
                pass: 'jqafxcigzzkkvvnu',
            },
        });

        await transporter.sendMail({
            from: 'maatheusousa@gmail.com',
            to: email,
            subject: 'Confirmação de Mensagem - Econnect',
            text: `Olá! Recebemos sua mensagem: "${message}". Em breve entraremos em contato!`,
        });

        res.json({ message: 'Mensagem enviada com sucesso! Verifique seu e-mail para confirmação.' });
    } catch (error) {
        console.error('[ERRO] Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro ao enviar mensagem. Tente novamente mais tarde.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
