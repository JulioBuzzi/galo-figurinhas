# ⚫🟡 Galo Figurinhas 2026

Sistema fullstack de gerenciamento de figurinhas da Copa do Mundo 2026.
Tema: **Atlético Mineiro** — Preto e Dourado.

---

## 🧩 Stack

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Frontend     | Next.js 14 (App Router) + Tailwind  |
| Backend      | Java 17 + Spring Boot 3.2           |
| Banco        | PostgreSQL (Supabase)               |
| Auth         | JWT                                 |
| Deploy Front | Vercel                              |
| Deploy Back  | Render                              |

---

## 📁 Estrutura

```
├── backend/
│   └── src/main/java/com/copa2026/
│       ├── controller/   AuthController, StickerController, PostController, MatchController
│       ├── service/      AuthService, StickerService, PostService, MatchService
│       ├── repository/   UserRepository, StickerRepository, UserStickerRepository, PostRepository
│       ├── model/        User, Sticker, UserSticker, Post
│       ├── dto/          DTOs de request/response
│       ├── security/     JwtUtil, JwtAuthFilter
│       ├── config/       SecurityConfig, GlobalExceptionHandler
│       └── init/         DataInitializer (lê stickers.json → 980 figurinhas)
│   └── src/main/resources/
│       ├── application.properties
│       ├── stickers.json       ← fonte das 980 figurinhas
│       └── migration.sql       ← rode no Supabase antes do 1º deploy
│
└── frontend/
    └── src/
        ├── app/
        │   ├── login/page.tsx
        │   ├── register/page.tsx
        │   ├── dashboard/page.tsx
        │   ├── album/page.tsx
        │   ├── repetidas/page.tsx   ← página de gestão de repetidas
        │   ├── feed/page.tsx
        │   └── matches/page.tsx
        ├── components/
        │   ├── Navbar.tsx
        │   ├── StickerCard.tsx      ← 🔴 não tenho / 🟢 tenho / 🟡 repetida
        │   ├── PostCard.tsx
        │   ├── ProtectedLayout.tsx
        │   └── AuthInitializer.tsx
        ├── contexts/authStore.ts    ← Zustand
        └── lib/
            ├── api.ts               ← Axios + JWT interceptor
            ├── types.ts
            └── utils.ts
```

---

## 🗄️ Schema do Banco

```sql
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE stickers (
    id           BIGSERIAL PRIMARY KEY,
    code         VARCHAR(50)  NOT NULL UNIQUE,  -- ex: FIG-001
    name         VARCHAR(255) NOT NULL,
    team         VARCHAR(100) NOT NULL,          -- seção do álbum
    album_number INT
);

CREATE TABLE user_stickers (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id),
    sticker_id     BIGINT NOT NULL REFERENCES stickers(id),
    status         VARCHAR(20) NOT NULL DEFAULT 'NAO_TENHO', -- TENHO | NAO_TENHO
    repeated_count INT NOT NULL DEFAULT 0,                   -- qtd de cópias extras
    updated_at     TIMESTAMP,
    UNIQUE(user_id, sticker_id)
);

CREATE TABLE posts (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id),
    text       TEXT,
    created_at TIMESTAMP
);

CREATE TABLE post_wanted_stickers  (post_id BIGINT, sticker_id BIGINT);
CREATE TABLE post_offered_stickers (post_id BIGINT, sticker_id BIGINT);
```

---

## 🔌 Endpoints da API

### Auth (público)
| Método | Rota                | Descrição              |
|--------|---------------------|------------------------|
| POST   | /api/auth/register  | Cadastrar usuário      |
| POST   | /api/auth/login     | Login → retorna JWT    |

### Álbum (autenticado)
| Método | Rota                                    | Descrição                          |
|--------|-----------------------------------------|------------------------------------|
| GET    | /api/stickers                           | Lista todas as figurinhas          |
| GET    | /api/album                              | Álbum completo com status          |
| GET    | /api/album/owned                        | Só figurinhas que TENHO            |
| GET    | /api/album/progress                     | Progresso percentual + stats       |
| PUT    | /api/album/stickers/:id                 | Marca TENHO ou NAO_TENHO           |
| PATCH  | /api/album/stickers/:id/repeated?delta= | Adiciona/remove repetida (+1/-1)   |

### Posts (autenticado)
| Método | Rota            | Descrição         |
|--------|-----------------|-------------------|
| GET    | /api/posts      | Feed global       |
| GET    | /api/posts/mine | Meus posts        |
| POST   | /api/posts      | Criar post        |
| DELETE | /api/posts/:id  | Deletar meu post  |

### Matches (autenticado)
| Método | Rota         | Descrição                   |
|--------|--------------|-----------------------------|
| GET    | /api/matches | Matches ordenados por score |

---

## ⚡ Rodando Localmente

### Pré-requisitos
- Java 17+, Maven 3.8+, Node.js 18+

### Backend
```bash
cd backend

# Edite application.properties com sua URL do Supabase
# spring.datasource.url=jdbc:postgresql://db.XXX.supabase.co:5432/postgres?...

mvn spring-boot:run
# → http://localhost:8080
# → Carrega 980 figurinhas automaticamente na primeira execução
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edite: NEXT_PUBLIC_API_URL=http://localhost:8080

npm install
npm run dev
# → http://localhost:3000
```

---

## 🚀 Deploy em Produção

### Passo 1 — Supabase (banco)
Execute o arquivo `backend/src/main/resources/migration.sql`
no **SQL Editor** do Supabase para limpar dados antigos e adicionar
a coluna `repeated_count`.

### Passo 2 — Render (backend)

| Campo          | Valor                                   |
|----------------|-----------------------------------------|
| Root Directory | `backend`                               |
| Build Command  | `mvn clean package -DskipTests`         |
| Start Command  | `java -jar target/copa2026-backend-1.0.0.jar` |
| Java Version   | `17`                                    |

**Variáveis de ambiente no Render:**
```
DATABASE_URL  = jdbc:postgresql://db.SEU_ID.supabase.co:5432/postgres?user=postgres&password=SENHA&sslmode=require
JWT_SECRET    = sua_chave_secreta_longa_256bits_minimo
FRONTEND_URL  = https://SEU-APP.vercel.app
```

### Passo 3 — Vercel (frontend)

| Campo          | Valor      |
|----------------|------------|
| Root Directory | `frontend` |
| Framework      | Next.js    |

**Variável de ambiente no Vercel:**
```
NEXT_PUBLIC_API_URL = https://galo-figurinhas-backend.onrender.com
```

### Passo 4 — Atualize o CORS
Após o Vercel gerar a URL final, volte no Render e atualize
`FRONTEND_URL` com a URL exata do Vercel (sem barra final).

---

## 🔒 Variáveis de Ambiente

| Variável              | Onde    | Descrição                     |
|-----------------------|---------|-------------------------------|
| `DATABASE_URL`        | Backend | URL JDBC do PostgreSQL        |
| `JWT_SECRET`          | Backend | Chave para assinar JWT        |
| `FRONTEND_URL`        | Backend | URL do frontend (CORS)        |
| `NEXT_PUBLIC_API_URL` | Frontend| URL do backend                |

---

## 🎮 Funcionalidades

1. **Cadastro / Login** com JWT persistido no localStorage
2. **Álbum** — 980 figurinhas, clique para marcar ✅ / desmarcar ❌
   - 🔴 Borda vermelha = não tenho
   - 🟢 Borda verde = tenho
   - 🟡 Borda dourada = tenho com repetidas
3. **Repetidas** — página dedicada com controle `+` e `−` por figurinha
4. **Feed** — posts globais com figurinhas procuradas / para troca
5. **Matches** — algoritmo que cruza álbuns e sugere trocas por score

---

## 🐛 Troubleshooting

| Problema | Solução |
|---|---|
| Backend não conecta no banco | Verifique `jdbc:postgresql://` + `?sslmode=require` |
| CORS bloqueado | `FRONTEND_URL` deve bater exatamente com URL do Vercel |
| 980 figurinhas não carregaram | Rode o `migration.sql` no Supabase e reinicie o backend |
| Cold start lento no Render | Normal no plano free — primeira req. demora ~30s |
| JWT expirado | Interceptor do Axios já redireciona para `/login` |
