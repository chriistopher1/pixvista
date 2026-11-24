<img width="2880" height="1344" alt="image" src="https://github.com/user-attachments/assets/f336215d-70f2-47e1-ac71-b7321d18c3c6" />
<img width="2878" height="1356" alt="image" src="https://github.com/user-attachments/assets/2df5cacc-d029-4cd5-b3ec-3d53eff113d6" />
<img width="2880" height="1356" alt="image" src="https://github.com/user-attachments/assets/47e9c9bd-cc20-4c58-9bef-2f1adb7eb4c6" />
<img width="2880" height="1344" alt="image" src="https://github.com/user-attachments/assets/e9d3fdc1-3f7d-4f11-8750-d7d32dd18421" />
<img width="2880" height="1352" alt="image" src="https://github.com/user-attachments/assets/a864fc2f-0e68-4abd-bdbc-b689ac79cd9e" />
<img width="2880" height="1352" alt="image" src="https://github.com/user-attachments/assets/65597ea4-16ab-4c6c-beee-1f3857b47bd9" />
<img width="2880" height="1352" alt="image" src="https://github.com/user-attachments/assets/f859f4b6-d052-4939-901f-bf2707172e75" />



# PixVista
PIXVISTA DEMO ( VIDEO ) : https://jumpshare.com/share/zeCIhv12CWVzNe2pnDJE
Open-source Instagram-style social media **template**. Users can register, upload posts, like/save content, and browse profiles.

**Stack:** React + Vite · Express · MySQL (XAMPP) · TanStack React Query · Tailwind CSS · shadcn/ui

---

## Features

- Sign up / sign in with JWT auth
- Create, edit, and delete posts
- Like and save posts
- Search posts and explore newest content
- User profiles with liked posts
- Images stored as **BLOBs** in MySQL (no separate file storage needed)

---

## Project structure

```
pixvista/
├── database/
│   └── schema.sql          # MySQL schema + relationship notes
├── server/                 # Express API (talks to MySQL)
│   ├── .env.example
│   └── src/
├── src/                    # React frontend
│   ├── lib/api/            # fetch helpers used by React Query
│   ├── lib/react-query/    # queries & mutations
│   └── ...
└── package.json
```

### Database relationships

```
users 1 ───< posts        (creator)
users 1 ───< likes        (who liked)
posts 1 ───< likes        (what was liked)
users 1 ───< saves        (who saved)
posts 1 ───< saves        (what was saved)
```

`likes` and `saves` are many-to-many join tables between `users` and `posts`.  
Profile and post images live in `users.image` / `posts.image` (`LONGBLOB`).

---

## Prerequisites

1. **Node.js** 18+
2. **XAMPP** (or any MySQL/MariaDB) with MySQL running
3. npm

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/chriistopher1/pixvista.git
cd pixvista
npm install
```

`npm install` also installs the API dependencies under `server/`.

### 2. Create the database

1. Start **Apache + MySQL** in XAMPP.
2. Open [phpMyAdmin](http://localhost/phpmyadmin) (or the MySQL CLI).
3. Import `database/schema.sql`  
   **or** run:

```bash
mysql -u root < database/schema.sql
```

Default XAMPP MySQL user is `root` with an empty password.

### 3. Configure environment

```bash
# Frontend
cp .env.example .env

# API
cp server/.env.example server/.env
```

Edit `server/.env` if your MySQL password or port differs:

| Variable       | Default                 | Notes                          |
|----------------|-------------------------|--------------------------------|
| `DB_HOST`      | `127.0.0.1`             | XAMPP MySQL host               |
| `DB_USER`      | `root`                  |                                |
| `DB_PASSWORD`  | *(empty)*               | Set if you use a password      |
| `DB_NAME`      | `pixvista`              | Created by `schema.sql`        |
| `JWT_SECRET`   | *(change in production)*| Used to sign auth tokens       |
| `PORT`         | `5000`                  | API port                       |
| `VITE_API_URL` | `http://localhost:5000` | Frontend → API base URL        |

### 4. Run the app

```bash
# Terminal A + B in one command
npm run dev:all
```

Or separately:

```bash
npm run dev:server   # API → http://localhost:5000
npm run dev          # UI  → http://localhost:5173
```

Open **http://localhost:5173**, create an account, and start posting.

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## How data flows

```
React UI  →  React Query hooks  →  src/lib/api  →  Express (/api/*)  →  MySQL
```

- Queries/mutations live in `src/lib/react-query/queries.ts`
- HTTP client lives in `src/lib/api/`
- Images are uploaded as multipart form data and stored as BLOBs
- Image URLs look like `/api/posts/:id/image` and `/api/users/:id/image`

---

## Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start Vite frontend only             |
| `npm run dev:server` | Start Express API only             |
| `npm run dev:all`  | Start frontend + API together        |
| `npm run build`    | Production frontend build            |
| `npm run lint`     | ESLint                               |

---

## Tips for contributors

- Keep BLOB sizes reasonable (API upload limit is **5 MB** per image).
- If large uploads fail, raise MySQL `max_allowed_packet` in `my.ini` / `my.cnf`.
- Do not commit `.env` or `server/.env` — use the `.example` files.
- Prefer extending `src/lib/api` + React Query hooks instead of calling `fetch` from components.

---

## License

MIT — use this as a learning project or a starting template for your own social app.
