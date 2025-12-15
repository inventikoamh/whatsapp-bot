# 🚀 QUICK START - Send Demo Messages

## ✅ WINDOWS (Current Setup) - RECOMMENDED

Your bot is ready to send! Here are the exact commands:

### Step 1: Authenticate (First time only)
```cmd
cd d:\whatsapp-bot
npm start
```
- QR code will appear
- Scan with WhatsApp on your phone
- Wait for "✅ WhatsApp Bot is ready!"
- Press Ctrl+C to stop

### Step 2: Send Demo Messages
```cmd
npm run demo
```
- Will send to your 3 numbers:
  - 6232705352 (Alice)
  - 7000128841 (Bob)
  - 7000642414 (Charlie)
- 10 second delay between each message
- Takes about 20 seconds total

---

## 🐧 LINUX/SSH ENVIRONMENT

### Initial Setup (One-time)

```bash
# 1. Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install system dependencies (for puppeteer/Chrome)
sudo apt install -y \
    gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 \
    libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
    libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
    libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 \
    libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 \
    libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
    fonts-liberation libappindicator1 libnss3 lsb-release \
    xdg-utils wget

# 3. Create project directory
mkdir -p ~/whatsapp-bot
cd ~/whatsapp-bot

# 4. Initialize project
npm init -y

# 5. Install dependencies
npm install whatsapp-web.js qrcode-terminal
```

### Transfer Your Files to Linux Server

**Option A: Using SCP (from your Windows machine)**
```cmd
# Copy entire project to Linux server
scp -r d:\whatsapp-bot/* username@server-ip:~/whatsapp-bot/
```

**Option B: Using SFTP**
```bash
# On your Windows machine
sftp username@server-ip
put -r d:\whatsapp-bot/* ~/whatsapp-bot/
```

**Option C: Manual file creation (if above fails)**
```bash
# SSH into your Linux server, then:
cd ~/whatsapp-bot

# Create each file manually using nano or vi
nano config.js       # Copy content from Windows
nano index.js        # Copy content from Windows
nano bulkSender.js   # Copy content from Windows
nano demo.js         # Copy content from Windows
nano utils.js        # Copy content from Windows
# ... etc
```

### Running on Linux

#### Method 1: With GUI/X11 Forwarding (Easier QR Display)
```bash
# SSH with X11 forwarding
ssh -X username@server-ip

cd ~/whatsapp-bot

# First time: Authenticate
npm start
# QR code will display - scan it
# Press Ctrl+C after authentication

# Send demo messages
npm run demo
```

#### Method 2: Headless (No GUI - QR in Terminal)
```bash
# SSH normally
ssh username@server-ip

cd ~/whatsapp-bot

# First time: Authenticate
npm start
# QR code appears as ASCII art in terminal
# Scan it with WhatsApp
# Press Ctrl+C after authentication

# Send demo messages
npm run demo
```

#### Method 3: Using Screen/Tmux (Keep running after disconnect)
```bash
ssh username@server-ip

# Install screen if not available
sudo apt install screen

# Start a screen session
screen -S whatsapp

cd ~/whatsapp-bot

# Authenticate (first time)
npm start
# Scan QR, wait for ready, then Ctrl+C

# Send demo
npm run demo

# Detach from screen: Ctrl+A then D
# Reattach later: screen -r whatsapp
```

---

## 📱 AUTHENTICATION PROCESS

### First Time (Both Windows & Linux):
1. Run `npm start`
2. QR code appears in terminal
3. Open WhatsApp on phone
4. Go to: **Settings → Linked Devices → Link a Device**
5. Scan the QR code
6. Wait for "✅ WhatsApp Bot is ready!"
7. Press **Ctrl+C** to stop
8. Session saved! (No need to scan again)

### Subsequent Runs:
- Just run `npm run demo` directly
- No QR code needed!

---

## 🎯 YOUR CURRENT SETUP

**Recipients:**
- 6232705352 (Alice) - Indian number
- 7000128841 (Bob) - Indian number  
- 7000642414 (Charlie) - Indian number

**Message:**
```
Hello! 👋

This is a test message.

Have a great day!
```

**Settings:**
- Delay: 10 seconds between messages
- Total time: ~20 seconds
- Auto-formats to +91 (India) country code

---

## ⚡ EXACT COMMANDS TO COPY-PASTE

### Windows (NOW):
```cmd
cd d:\whatsapp-bot
npm run demo
```

### Linux SSH:
```bash
# First time only
ssh username@your-server-ip
cd ~/whatsapp-bot
npm start
# [Scan QR code, then Ctrl+C]

# Send messages
npm run demo
```

---

## 📊 What You'll See

```
⏳ Initializing WhatsApp client...
📱 Scan QR code when it appears...

✅ WhatsApp client ready!

============================================================
  WHATSAPP BULK SENDER - COMPLETE DEMO
============================================================

🎯 DEMO 1: Simple Message

📨 Starting bulk message sending...
📊 Total recipients: 3
⏱️  Delay between messages: 10 seconds

✅ [1/3] Sent to Alice (6232705352)
⏳ Waiting 10 seconds before next message...
✅ [2/3] Sent to Bob (7000128841)
⏳ Waiting 10 seconds before next message...
✅ [3/3] Sent to Charlie (7000642414)

=================================
📊 BULK MESSAGING SUMMARY
=================================
✅ Successfully sent: 3/3
❌ Failed: 0/3
=================================
```

---

## ⚠️ IMPORTANT NOTES

### For Linux SSH:
- ✅ QR code displays as ASCII art (works in terminal)
- ✅ No GUI needed
- ✅ Use screen/tmux to keep running
- ⚠️ Make sure puppeteer dependencies are installed
- ⚠️ Session files are saved in `~/whatsapp-bot/session/`

### Security:
- 🔒 Never share your `session/` folder
- 🔒 Use SSH keys, not passwords
- 🔒 Consider firewall rules

---

## 🐛 TROUBLESHOOTING

### QR Code not showing (Linux):
```bash
# Check terminal supports Unicode
echo $TERM
# Should be xterm-256color or similar

# Or try in a screen session
screen -S whatsapp
npm start
```

### Permission errors (Linux):
```bash
sudo chown -R $USER:$USER ~/whatsapp-bot
chmod -R 755 ~/whatsapp-bot
```

### Puppeteer errors (Linux):
```bash
# Reinstall with chromium
npm install puppeteer --unsafe-perm=true
```

### Numbers not formatted correctly:
- Edit `bulkSender.js` line 80
- Change country code from '91' to yours

---

## 🎉 READY TO GO!

**On Windows (Your current machine):**
```cmd
npm run demo
```

**On Linux SSH:**
```bash
ssh user@server
cd ~/whatsapp-bot
npm run demo
```

That's it! Your messages will be sent! 🚀
