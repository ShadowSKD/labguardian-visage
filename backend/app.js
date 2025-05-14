const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const alertRoutes = require('./routes/alertRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const os = require('os')

/**
 * Retrieves the preferred IPv4 address of the machine based on specified adapter names
 * or falls back to the first usable non-internal IPv4 address.
 *
 * @returns {string} The preferred IPv4 address, or 'localhost' if no suitable address is found.
 *
 * @description
 * This function first attempts to find an IPv4 address from a list of preferred network
 * adapter names (e.g., 'Wi-Fi', 'Ethernet'). If none are found, it falls back to searching
 * all network interfaces for the first usable IPv4 address that is:
 * - Not internal (i.e., not a loopback address).
 * - Not a link-local address (e.g., 169.x.x.x).
 * - Not part of specific excluded ranges (e.g., 192.168.254.x, 192.168.255.x).
 *
 * If no suitable address is found, the function returns 'localhost'.
 */
function getPreferredIPv4() {
  const interfaces = os.networkInterfaces()
  const preferredNames = ['Wi-Fi', 'Ethernet'] // update based on your actual adapter names
  
  for (const name of preferredNames) {
    const ifaceList = interfaces[name]
    if (!ifaceList) continue
    
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address
      }
    }
  }

  // Fallback: first usable non-VMware, non-Bluetooth, non-link-local
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === 'IPv4' &&
        !iface.internal &&
        !iface.address.startsWith('169.') &&
        !iface.address.startsWith('192.168.254.') &&
        !iface.address.startsWith('192.168.255.')
      ) {
        return iface.address
      }
    }
  }

  return 'localhost'
}

const localIP = getPreferredIPv4()
console.log(`✅ Local IP: ${localIP}`)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // ✅ add Vite dev server origin
  `http://${localIP}:5173`,
  `http://${localIP}:3000`,
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

app.options('*', cors())

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running:`)
  console.log(`   Local:            http://localhost:${PORT}`)
  console.log(`   On Your Network:  http://${localIP}:${PORT} (If not hosted on docker)`)
  console.log(`   On Your Network:  http:${process.env.FRONTEND_URL.split(':')[1]}:${PORT} (If hosted on docker)`)
})


// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
}
);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

  

