# Panduan Deploy GranblueParty ke Vercel

## Prasyarat
- Akun [Vercel](https://vercel.com) (gratis)
- Akun [Supabase](https://supabase.com) (gratis)
- Akun [GitHub](https://github.com) (untuk connect ke Vercel)
- Node.js terinstall di lokal

---

## Step 1: Setup Database di Supabase

1. Buka https://supabase.com → buat akun → **New project**
2. Pilih nama project, set password database, pilih region terdekat (Southeast Asia)
3. Tunggu ~2 menit sampai project siap
4. Buka **Settings → Database** → copy connection string format ini:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Di lokal, edit `WikiParser/config/config.ini` dengan credential Supabase
6. Jalankan WikiParser untuk buat tabel dan isi data:
   ```bash
   cd WikiParser
   pip install -r requirements.txt
   python database.py --create
   python database.py --update
   ```

---

## Step 2: Push ke GitHub

1. Buat repo baru di GitHub (public atau private)
2. Push project ini:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Vercel ready"
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```

---

## Step 3: Deploy API ke Vercel

1. Buka https://vercel.com → **Add New Project**
2. Import repo GitHub kamu
3. Di halaman konfigurasi:
   - **Root Directory**: `API`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build` (atau kosongkan)
   - **Output Directory**: kosongkan
4. Buka tab **Environment Variables**, tambahkan:

   | Key | Value |
   |-----|-------|
   | `DB_HOST` | `db.XXXXX.supabase.co` |
   | `DB_PORT` | `5432` |
   | `DB_NAME` | `postgres` |
   | `DB_USER` | `postgres` |
   | `DB_PASSWORD` | password Supabase kamu |
   | `JWT_SECRET` | string random 64 karakter (generate di https://generate-secret.vercel.app/64) |
   | `FRONTEND_URL` | (isi nanti setelah deploy frontend) |

5. Klik **Deploy**
6. Setelah deploy, copy URL API kamu, contoh: `https://gbf-api.vercel.app`

---

## Step 4: Deploy Frontend ke Vercel

1. Kembali ke Vercel → **Add New Project** → import repo yang sama
2. Di halaman konfigurasi:
   - **Root Directory**: `Frontend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist`
3. Tambahkan **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `VUE_APP_API_URL` | URL API dari Step 3, contoh: `https://gbf-api.vercel.app` |
   | `NODE_ENV` | `production` |

4. Klik **Deploy**
5. Copy URL Frontend kamu, contoh: `https://gbf-frontend.vercel.app`

---

## Step 5: Update CORS di API

1. Buka project API di Vercel → **Settings → Environment Variables**
2. Update atau tambahkan:
   ```
   FRONTEND_URL = https://gbf-frontend.vercel.app
   ```
3. Klik **Redeploy** di Vercel API project

---

## Step 6: Test

Buka URL frontend kamu dan test:
- [ ] Halaman beranda tampil
- [ ] Calc Evoker & GW bekerja
- [ ] Register akun berhasil
- [ ] Login berhasil
- [ ] My Collection bisa disimpan
- [ ] Party Builder bisa share

---

## Troubleshooting

### Frontend 404 saat refresh halaman
Pastikan `Frontend/vercel.json` ada dan berisi rewrite ke `index.html`.

### API CORS error
Pastikan `FRONTEND_URL` di env vars API sudah tepat (tanpa trailing slash).

### Database connection error
- Cek credential Supabase di env vars
- Pastikan Supabase project masih aktif (free tier tidak expired)
- Coba koneksi manual: `psql postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres`

### Build Frontend gagal
- Pastikan `NODE_ENV=production` di-set di env vars Vercel
- Cek log build untuk error spesifik

---

## Update Data Game (WikiParser)

WikiParser tetap dijalankan **secara lokal** untuk update data:

```bash
cd WikiParser
python parse.py -d        # fetch data terbaru dari gbf.wiki
python parse.py --all     # parse dan update ke DB
```

Karena data masuk ke Supabase cloud, perubahan langsung live di production.

---

## Biaya

| Komponen | Layanan | Tier | Biaya |
|----------|---------|------|-------|
| Frontend | Vercel | Hobby (Free) | **$0** |
| API | Vercel | Hobby (Free) | **$0** |
| Database | Supabase | Free | **$0** |
| **Total** | | | **$0/bulan** |

> Vercel Hobby tier: 100GB bandwidth/bulan, unlimited deployments.  
> Supabase Free: 500MB database, 2 projects, 50,000 MAU auth.
