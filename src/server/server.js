import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInvestigation } from '../core/investigator.js';
import { tinyfish } from '../core/tinyfish_client.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIR = path.resolve(__dirname, '../../client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(CLIENT_DIR));

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    tinyfish_connected: !!process.env.TINYFISH_API_KEY,
    groq_connected: !!process.env.GROQ_API_KEY,
    model: 'qwen/qwen3.8-27b'
  });
});

// 2. Live Wallet & Credit Balance (Demonstrates Paid API Credits on Hackathon Stage)
app.get('/api/wallet', async (req, res) => {
  try {
    const wallet = await tinyfish.wallet.get();
    res.json({
      success: true,
      available_balance: wallet.available_balance,
      currency: wallet.currency,
      as_of: wallet.as_of
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Server-Sent Events (SSE) Live Investigation Stream
app.get('/api/stream-investigate', async (req, res) => {
  const topic = req.query.topic;
  const targetLang = req.query.targetLang || 'ja';
  const escalate = req.query.escalate !== 'false';
  const preferLive = req.query.preferLive !== 'false';

  if (!topic) {
    return res.status(400).json({ error: 'Missing "topic" query parameter.' });
  }

  // Setup SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (eventData) => {
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  };

  try {
    sendEvent({
      stage: 'init',
      message: `Connecting to TinyFish dual-index search and verification pipeline...`,
      progress: 5
    });

    await runInvestigation({
      topic,
      targetLang,
      triggerAgentEscalation: escalate,
      preferLive,
      onProgress: (progressEvent) => {
        sendEvent(progressEvent);
      }
    });

    res.write('event: end\ndata: {}\n\n');
    res.end();
  } catch (err) {
    console.error('[SSE Server Error]:', err);
    sendEvent({
      stage: 'error',
      error: err.message
    });
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🌐 LinguaGap Server Running on http://localhost:${PORT}`);
  console.log(`  🐡 Powered by TinyFish Search, Fetch & Web Agent`);
  console.log(`======================================================\n`);
});
