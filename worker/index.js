import express from 'express';
import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

// --- 1. Inicialização do Express ---
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`[Worker] Health check server listening on port ${port}`);
});

// --- 2. Inicialização do Firebase Admin ---
try {
  admin.initializeApp();
  console.log('[Worker] Firebase Admin SDK inicializado com sucesso.');
} catch (error) {
  console.error('[Worker] Erro ao inicializar Firebase Admin SDK:', error);
  process.exit(1); // Encerra se não conseguir conectar ao Firebase
}
const db = getFirestore();


// --- 3. Lógica de Conexão do WhatsApp ---
const connectionId = process.env.CONNECTION_ID;

if (!connectionId) {
  console.error('[Worker] Variável de ambiente CONNECTION_ID não definida. Encerrando...');
  process.exit(1);
}

const connectToWhatsApp = async () => {
  console.log(`[Worker] Iniciando conexão para ID: ${connectionId}`);
  const docRef = db.collection('connections').doc(connectionId);
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState(`auth_info/connection_${connectionId}`);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false, // O QR code será enviado para o Firestore
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`[Worker ${connectionId}] QR Code gerado. Atualizando Firestore...`);
        try {
          await docRef.update({
            status: 'AWAITING_QR_SCAN',
            qr_string: qr,
            updatedAt: FieldValue.serverTimestamp(),
          });
          console.log(`[Worker ${connectionId}] Firestore atualizado com QR code.`);
        } catch (error) {
          console.error(`[Worker ${connectionId}] Falha ao atualizar QR no Firestore:`, error);
        }
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        const status = DisconnectReason.loggedOut ? 'DISCONNECTED_LOGOUT' : 'DISCONNECTED';
        
        console.log(`[Worker ${connectionId}] Conexão fechada. Motivo: ${lastDisconnect.error}, Reconectar: ${shouldReconnect}`);
        
        try {
             await docRef.update({
                status: status,
                updatedAt: FieldValue.serverTimestamp(),
             });
             console.log(`[Worker ${connectionId}] Firestore atualizado para status desconectado.`);
        } catch(error) {
             console.error(`[Worker ${connectionId}] Falha ao atualizar status de desconexão no Firestore:`, error);
        }

        if (shouldReconnect) {
          console.log(`[Worker ${connectionId}] Tentando reconectar...`);
          connectToWhatsApp();
        } else {
           console.log(`[Worker ${connectionId}] Não será possível reconectar (logged out).`);
        }
      } else if (connection === 'open') {
        console.log(`[Worker ${connectionId}] Conexão aberta com sucesso.`);
        try {
          await docRef.update({
            status: 'CONNECTED',
            qr_string: null,
            connectedAt: FieldValue.serverTimestamp(),
            phoneNumber: sock.user?.id.split(':')[0] || 'N/A' // Salva o número de telefone conectado
          });
          console.log(`[Worker ${connectionId}] Firestore atualizado para status conectado.`);
        } catch (error) {
          console.error(`[Worker ${connectionId}] Falha ao atualizar status de conexão no Firestore:`, error);
        }
      }
    });

  } catch (error) {
    console.error(`[Worker ${connectionId}] Erro fatal na função connectToWhatsApp:`, error);
  }
};

// --- 4. Iniciar a execução ---
connectToWhatsApp();
