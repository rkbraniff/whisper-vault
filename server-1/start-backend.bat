@echo off
echo Starting WhisperVault Backend Server...
cd /d "C:\Users\rfpau\whispervault\server-1"

REM Set all required environment variables
set DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza18yX2xncGhSM1VCX255akZUNG9vX2EiLCJhcGlfa2V5IjoiMDFLMFBRVE1YMllCNFZQRVZSTVNWUVNGRVMiLCJ0ZW5hbnRfaWQiOiIxYjhlYzg0MTViNTUwYmM3ODc3ZDI3MWJlOWU5N2RkZWQzY2JmMTc1YjkyM2IwMjhmZDMyYTc5MmM5MzVjZGE0IiwiaW50ZXJuYWxfc2VjcmV0IjoiNDllMTdiZTMtMjgxMy00OTQxLTliODItZTY3OGZiYTQ1ZWM2In0.UcZfBq4rIZECPJjXzdofMmxi-x-el0_9x6mDQcp6ksM
set JWT_SECRET=SwLHj5lMJ96CkbJnU5mbif+G+EpY7Q+xvV7AnUexnzgg9wz8yXDgObsJWVUfP1Ul
set PORT=4000
set CLIENT_ORIGIN=http://localhost:5173
set TOTP_ISSUER=WhisperVault
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=rfpaustian@gmail.com
set SMTP_PASS=yvbs aqrv pall gsni
set EMAIL_FROM=WhisperVault ^<rfpaustian@gmail.com^>

echo Environment variables set. Starting server...
node "C:\Users\rfpau\whispervault\server-1\dist\index.js"
