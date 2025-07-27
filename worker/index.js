import express from 'express';
import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

// --- 1. Inicialização do Express ---
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Worker is running.' });
});

app.listen(PORT, () => {
  console.log(`✅ [Worker] Servidor de health check escutando na porta ${PORT}`);
});

// --- 2. Inicialização do Firebase Admin ---
try {
  admin.initializeApp();
  console.log('✅ [Worker] Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('🔥 [Worker] Erro ao inicializar o Firebase Admin SDK:', error);
  process.exit(1); // Encerra se não conseguir conectar ao Firebase
}
const db = getFirestore();

// --- 3. Lógica de Conexão do WhatsApp ---
const connectionId = process.env.CONNECTION_ID;

if (!connectionId) {
  console.error('🔥 [Worker] Variável de ambiente CONNECTION_ID não definida. Encerrando.');
  process.exit(1);
}

const connectToWhatsApp = async () => {
  console.log(`[Worker] Iniciando conexão para o ID: ${connectionId}`);
  const docRef = db.collection('connections').doc(connectionId);

  try {
    const { state, saveCreds } = await useMultiFileAuthState(`auth_info/connection_${connectionId}`);
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false // O QR Code será enviado para o Firestore
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`[Worker][${connectionId}] QR Code gerado. Atualizando Firestore...`);
        try {
          await docRef.update({
            status: 'AWAITING_QR_SCAN',
            qr_string: qr,
            updatedAt: FieldValue.serverTimestamp()
          });
          console.log(`✅ [Worker][${connectionId}] Firestore atualizado com o QR Code.`);
        } catch (e) {
          console.error(`🔥 [Worker][${connectionId}] Falha ao salvar QR Code no Firestore:`, e);
        }
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(`[Worker][${connectionId}] Conexão fechada. Motivo: ${lastDisconnect.error?.message}. Deve reconectar: ${shouldReconnect}`);
        
        try {
          await docRef.update({
            status: 'DISCONNECTED',
            updatedAt: FieldValue.serverTimestamp(),
          });
        } catch (e) {
          console.error(`🔥 [Worker][${connectionId}] Falha ao atualizar status para DISCONNECTED:`, e);
        }

        if (shouldReconnect) {
          console.log(`[Worker][${connectionId}] Tentando reconectar...`);
          connectToWhatsApp();
        } else {
          console.log(`[Worker][${connectionId}] Não será possível reconectar (deslogado).`);
        }
      } else if (connection === 'open') {
        console.log(`[Worker][${connectionId}] Conexão aberta com sucesso.`);
        try {
          await docRef.update({
            status: 'CONNECTED',
            qr_string: null,
            connectedAt: FieldValue.serverTimestamp(),
            phoneNumber: sock.user?.id.split(':')[0] || null
          });
          console.log(`✅ [Worker][${connectionId}] Firestore atualizado para status CONNECTED.`);
        } catch (e) {
          console.error(`🔥 [Worker][${connectionId}] Falha ao atualizar status para CONNECTED:`, e);
        }
      }
    });

  } catch (error) {
    console.error(`🔥 [Worker][${connectionId}] Erro fatal na função connectToWhatsApp:`, error);
  }
};

// --- 4. Iniciar a Execução ---
connectToWhatsApp();