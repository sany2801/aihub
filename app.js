// const express = require('express');
// const axios = require('axios');
// const cron = require('node-cron');
// const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const botToken = '6331468443:AAEWWCH2454XFYzJelPst3XKRFxRsLxe3Ws'; // Замените на свой токен Telegram бота
const chatId = '-1001668783078'; // Замените на ваш chat_id Telegram
console.log("wefwef")
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {

  const message = req.body.message;

  const text = ` ${message}`;

  sendTelegramMessage(text);
  res.send('Спасибо! Ваше сообщение отправлено.');
});

const openAi = new OpenAI({
  apiKey: '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', // Замените на свой API-ключ OpenAI
  dangerouslyAllowBrowser: true
});

function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
  };

  axios.post(url, payload)
    .then((response) => {
      console.log('Сообщение отправлено в Telegram:', response.data);
    })
    .catch((error) => {
      console.error('Ошибка отправки сообщения:', error);
    });
}

cron.schedule('0 * * * *', async () => {
  try {
    const openaiResponse = await openAi.chat.completions.create({
      model:"gpt-3.5-turbo-16k-0613",
      messages: [{"role": "user", "content": "Cгенерируй случайную и опсурдную новость. Полностью вымэшленную и с полным отсутствием логики. Лимит слов не должен привышать 100 слов"}],
      temperature: 0.8,
      max_tokens: 200
    })

    const aiMessage = openaiResponse.choices[0].message.content;
    sendTelegramMessage(aiMessage);
  } catch (error) {
    console.error('Ошибка отправки сообщения от OpenAI:', error);
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
