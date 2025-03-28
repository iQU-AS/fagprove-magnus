# Handleliste-app

Et åpent prosjekt for delte handlelister med støtte for flere brukere, JWT-autentisering og visuell statistikk over kjøp. Bygget med Django + React og kjøres via Docker Compose.

## Funksjonalitet

- Registrering og innlogging med JWT
- Opprettelse og administrasjon av handlelister
- Samarbeid: del lister med andre brukere
- Merk varer som kjøpt / ikke kjøpt
- Statistikkvisning: i dag, denne uken, forrige måned
- Universell utforming og mobiltilpasning
- Sikker håndtering av tokens med HttpOnly cookies
- Deployment-klar med Docker Compose

## Komme i gang

### 1. Klon repoet

```bash
git clone https://github.com/bearmanser/fagprove-magnus.git
cd handleliste-app
```


### 3. Bygg og start via Docker

```bash
docker-compose up --build
```

- Frontend er tilgjengelig på `http://localhost:8000`
