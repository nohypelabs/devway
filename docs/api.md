---
sidebar_position: 10
---
# API Documentation

Base URL: `https://api.nohypelabs.com/v1`

## Authentication
Bearer token via `Authorization: Bearer <token>`

## Endpoints

### GET /api/products
List semua produk.

**Response:**
```json
{
  "data": [
    { "id": "1", "name": "Buku Wajib Developer", "price": 100000 }
  ]
}
```

### POST /api/products
Buat produk baru.

**Body:**
```json
{
  "name": "Buku Baru",
  "price": 100000
}
```

**Response:**
```json
{
  "data": { "id": "2", "name": "Buku Baru", "price": 100000 }
}
```

> Untuk detail arsitektur, baca `01-BACKEND.md` dan `03-ADVANCED.md`.
