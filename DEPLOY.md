# 🚀 GUIA COMPLETO DE DEPLOY — Galo Figurinhas 2026
# Leia TODO antes de começar. Siga a ordem exata.

---

## 📋 RESUMO DE NOMES PARA USAR EM TUDO

| Serviço | Nome sugerido |
|---------|--------------|
| Supabase (projeto) | `galo-figurinhas` |
| GitHub (repositório) | `galo-figurinhas` |
| Render (serviço) | `galo-figurinhas-backend` |
| Vercel (projeto) | `galo-figurinhas-frontend` |

---

## ✅ PRÉ-REQUISITOS — Tenha antes de começar

- [ ] Conta no [github.com](https://github.com)
- [ ] Conta no [supabase.com](https://supabase.com)
- [ ] Conta no [render.com](https://render.com)
- [ ] Conta no [vercel.com](https://vercel.com)
- [ ] Git instalado no computador
- [ ] Node.js 18+ instalado

---

## PASSO 1 — GITHUB 🐙

### 1.1 — Crie o repositório

1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New"** (botão verde)
3. Em **Repository name** coloque: `galo-figurinhas`
4. Deixe em **Public**
5. **NÃO** marque nenhuma opção extra (sem README, sem .gitignore)
6. Clique em **"Create repository"**

### 1.2 — Suba o código

Extraia o ZIP do projeto. Abra o terminal dentro da pasta `copa2026/`:

```bash
git init
git add .
git commit -m "feat: versao inicial Galo Figurinhas 2026"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/galo-figurinhas.git
git push -u origin main
```

> Substitua `SEU_USUARIO` pelo seu usuário do GitHub.

✅ Confirme que aparece a pasta `backend/` e `frontend/` no repositório.

---

## PASSO 2 — SUPABASE (Banco de Dados) 🗄️

### 2.1 — Crie o projeto

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Em **Name** coloque: `galo-figurinhas`
4. Em **Database Password** coloque uma senha forte — **ANOTE ESSA SENHA**
   - Exemplo: `GaloFigurinhas2026!`
5. Em **Region** escolha: **South America (São Paulo)** se disponível, senão **US East**
6. Clique em **"Create new project"**
7. Aguarde ~2 minutos até aparecer **"Project is ready"**

### 2.2 — Pegue a URL de conexão

1. No menu esquerdo clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"Database"**
3. Role até **"Connection string"** → aba **"URI"**
4. Copie a URL — vai ser assim:
   ```
   postgresql://postgres:[SUA-SENHA]@db.XXXXXXXXXXX.supabase.co:5432/postgres
   ```
5. **Guarde essa URL**, vamos precisar depois

### 2.3 — Rode o SQL para criar as tabelas

1. No menu esquerdo clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie e cole TODO o conteúdo do arquivo `backend/src/main/resources/migration.sql`
4. Clique em **"Run"** (botão verde ou Ctrl+Enter)
5. Deve aparecer: `Tabelas criadas!`

### 2.4 — Monte a DATABASE_URL no formato JDBC

Pegue a URL copiada no passo 2.2 e transforme assim:

**URL original:**
```
postgresql://postgres:SUASENHA@db.XXXXXXXXXXX.supabase.co:5432/postgres
```

**URL para o Render (JDBC com pooler — porta 6543):**
```
jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?user=postgres.XXXXXXXXXXX&password=SUASENHA&sslmode=require
```

> ⚠️ O `XXXXXXXXXXX` é o ID do seu projeto (aparece na URL do Supabase).
> ⚠️ Use a porta **6543** (pooler), **NÃO** 5432. A 5432 dá erro no Render.
> ⚠️ O `user` é `postgres.XXXXXXXXXXX` (com o ID junto).

**Guarde essa URL JDBC — você vai precisar no Render.**

---

## PASSO 3 — RENDER (Backend) ⚙️

### 3.1 — Crie o serviço

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Escolha **"Build and deploy from a Git repository"**
4. Clique em **"Connect GitHub"** e autorize
5. Encontre e clique em **"galo-figurinhas"**
6. Clique em **"Connect"**

### 3.2 — Configure o serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `galo-figurinhas-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Language** | **Docker** ← IMPORTANTE! |
| **Root Directory** | `backend` |
| **Plan** | Free |

> O campo **Dockerfile Path** deixe em branco — o Render detecta automaticamente.

### 3.3 — Adicione as variáveis de ambiente

Role a página até **"Environment Variables"** e adicione **3 variáveis**:

**Variável 1:**
```
Key:   DATABASE_URL
Value: jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:6543/postgres?user=postgres.XXXXXXXXXXX&password=SUASENHA&sslmode=require
```
*(use a URL JDBC que montou no passo 2.4)*

**Variável 2:**
```
Key:   JWT_SECRET
Value: GaloAtleticoMineiro2026FigurinhasSuperSecreta
```
*(pode ser qualquer texto longo, mínimo 32 caracteres, sem espaços)*

**Variável 3:**
```
Key:   FRONTEND_URL
Value: http://localhost:3000
```
*(coloque localhost por enquanto — vamos atualizar depois com a URL do Vercel)*

### 3.4 — Faça o deploy

1. Clique em **"Create Web Service"**
2. Aguarde o build — vai demorar **5-8 minutos** na primeira vez (Docker)
3. Acompanhe os logs em tempo real
4. Quando aparecer:
   ```
   ==> Your service is live 🎉
   Available at: https://galo-figurinhas-backend.onrender.com
   ```
   O backend está no ar! ✅

### 3.5 — Anote a URL do backend

A URL vai ser algo como:
```
https://galo-figurinhas-backend.onrender.com
```
**Guarde essa URL — você vai precisar no Vercel.**

---

## PASSO 4 — VERCEL (Frontend) 🎨

### 4.1 — Crie o projeto

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New..."** → **"Project"**
3. Clique em **"Import Git Repository"**
4. Conecte com GitHub se necessário
5. Encontre **"galo-figurinhas"** e clique em **"Import"**

### 4.2 — Configure o projeto

| Campo | Valor |
|-------|-------|
| **Project Name** | `galo-figurinhas-frontend` |
| **Framework Preset** | Next.js (detecta automático) |
| **Root Directory** | Clique em "Edit" → coloque `frontend` |

### 4.3 — Adicione a variável de ambiente

Antes de clicar em Deploy, expanda **"Environment Variables"**:

```
Key:   NEXT_PUBLIC_API_URL
Value: https://galo-figurinhas-backend.onrender.com
```
*(use a URL do Render do passo 3.5)*

### 4.4 — Faça o deploy

1. Clique em **"Deploy"**
2. Aguarde ~2 minutos
3. Quando aparecer confetes 🎉 o frontend está no ar!
4. Anote a URL gerada — algo como:
   ```
   https://galo-figurinhas-frontend.vercel.app
   ```

---

## PASSO 5 — CONECTAR TUDO 🔗

Agora que temos as URLs reais, precisamos atualizar o CORS no backend.

### 5.1 — Atualize o FRONTEND_URL no Render

1. Vá no painel do Render → seu serviço
2. Clique em **"Environment"**
3. Encontre `FRONTEND_URL` e clique no lápis ✏️
4. Substitua `http://localhost:3000` pela URL real do Vercel:
   ```
   https://galo-figurinhas-frontend.vercel.app
   ```
5. Clique em **"Save Changes"**
6. O Render vai reiniciar automaticamente (~1 min)

---

## PASSO 6 — TESTE FINAL ✅

### 6.1 — Verifique se o backend está respondendo

Abra no navegador:
```
https://galo-figurinhas-backend.onrender.com/api/stickers
```
Deve aparecer um JSON com as figurinhas.

> ⚠️ Se demorar 30-60 segundos é normal — o Render hiberna no plano gratuito.

### 6.2 — Acesse o frontend e teste

Abra:
```
https://galo-figurinhas-frontend.vercel.app
```

Teste nessa ordem:
1. Clique em **"Cadastre-se"** → crie uma conta
2. Você será redirecionado para o Dashboard
3. Vá em **"Álbum"** → clique em figurinhas para marcar
4. Vá em **"Repetidas"** → use + e − para adicionar cópias
5. Vá em **"Feed"** → crie um post
6. Crie uma segunda conta → vá em **"Matches"**

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

| Erro | Causa | Solução |
|------|-------|---------|
| `Network unreachable` no Render | DATABASE_URL com porta 5432 | Use porta **6543** (pooler) |
| `Port scan timeout` no Render | App demorando para iniciar | Aguarde — pode demorar até 8 min no primeiro build |
| `CORS policy` no browser | FRONTEND_URL incorreto no Render | Cole a URL exata do Vercel |
| `ERR_FAILED` sem código | CORS bloqueando | Verifique FRONTEND_URL no Render |
| Tela de loading infinito | Backend hibernando | Acesse a URL do backend direto no navegador para acordá-lo |
| `Secret not found` no Vercel | vercel.json antigo | O vercel.json atual não tem secrets |

---

## 🔄 COMO ATUALIZAR O CÓDIGO

Quando precisar fazer mudanças:

```bash
# Na pasta do projeto
git add .
git commit -m "descricao da mudanca"
git push origin main
```

O Render e o Vercel fazem redeploy automaticamente após o push.

---

## 📌 URLS FINAIS DO PROJETO

Anote aqui quando tiver tudo no ar:

| Serviço | URL |
|---------|-----|
| Frontend | `https://_____________.vercel.app` |
| Backend  | `https://_____________.onrender.com` |
| Supabase | `https://supabase.com/dashboard/project/____________` |
