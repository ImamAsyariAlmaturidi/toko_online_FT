# Toko Online

## Pendahuluan

Proyek ini adalah aplikasi toko online yang menggunakan Node.js dan PostgreSQL sebagai database. Dokumentasi ini akan membantu Anda untuk memulai dan menjalankan proyek ini.

## Langkah-langkah Instalasi

1. **Clone Repository**
   Clone repository ini ke dalam komputer Anda:

   ```bash
   git clone <repository-url>
   cd toko_online
   ```

2. **Install Dependencies**
   Jalankan perintah berikut untuk menginstall semua dependensi yang diperlukan:

   ```bash
   npm install
   ```

3. **Konfigurasi File `.env`**
   Buat file `.env` berdasarkan file `.env.example` yang tersedia di dalam proyek. Sesuaikan konfigurasi sesuai dengan kebutuhan Anda, terutama untuk koneksi database PostgreSQL.

4. **Konfigurasi Database**
   Pastikan Anda telah mengatur database PostgreSQL sesuai dengan konfigurasi di file `.env`.

5. **Inisialisasi Database**
   Untuk membuat database, jalankan perintah berikut:

   ```bash
   npx sequelize-cli db:create
   ```

6. **Migrasi Database**
   Untuk menjalankan migrasi database, gunakan perintah berikut:

   ```bash
   npx sequelize-cli db:migrate
   ```

7. **Seeding Database**
   Jika Anda ingin mengisi database dengan data awal (seeding), jalankan perintah berikut:
   ```bash
   npx sequelize-cli db:seed:all
   ```

## Menjalankan Proyek

Setelah semua langkah di atas selesai, Anda dapat menjalankan proyek dengan perintah:

```bash
npm start
```

Proyek akan berjalan pada port yang telah Anda tentukan di file `.env`.

## Catatan

- Pastikan PostgreSQL telah terinstall dan berjalan di komputer Anda.
- Jika ada kendala, periksa kembali konfigurasi di file `.env` dan log error yang muncul.

Selamat mencoba!

## API Dokumentasi

### 1. Login

**Endpoint:**  
`POST /api/auth/login`

**Deskripsi:**  
Endpoint ini digunakan untuk login ke dalam aplikasi.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

- **200 OK**

```json
{
  "access_token": "string"
}
```

- **401 Unauthorized**

```json
{
  "error": "Invalid email or password"
}
```

---

### 2. CRUD Produk

#### a. Tambah Produk

**Endpoint:**  
`POST /api/products/`

**Deskripsi:**  
Endpoint ini digunakan untuk menambahkan produk baru ke dalam sistem.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body (Form Data):**

- `name` (string) - Nama produk.
- `description` (string) - Deskripsi produk.
- `stock` (integer) - Jumlah stok produk.
- `price` (number) - Harga produk.
- `image` (file) - Gambar produk (harus diupload).

**Response:**

- **201 Created**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": "integer",
    "name": "string",
    "description": "string",
    "stock": "integer",
    "price": "number",
    "image_url": "string"
  }
}
```

- **400 Bad Request**

```json
{
  "error": "Invalid input data"
}
```

- **401 Unauthorized**

```json
{
  "error": "Unauthorized"
}
```

---

#### b. Lihat Semua Produk

**Endpoint:**  
`GET /api/products/`

**Deskripsi:**  
Endpoint ini digunakan untuk mendapatkan daftar semua produk.

**Headers:**

**Response:**

- **200 OK**

```json
[
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "stock": "integer",
    "price": "number",
    "image_url": "string"
  }
]
```

---

#### c. Lihat Detail Produk

**Endpoint:**  
`GET /api/products/{id}`

**Deskripsi:**  
Endpoint ini digunakan untuk mendapatkan detail produk berdasarkan ID.

**Headers:**

**Response:**

- **200 OK**

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "stock": "integer",
  "price": "number",
  "image_url": "string"
}
```

- **404 Not Found**

```json
{
  "error": "Product not found"
}
```

---

#### d. Update Produk

**Endpoint:**  
`PUT /api/products/{id}`

**Deskripsi:**  
Endpoint ini digunakan untuk memperbarui data produk berdasarkan ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body (Form Data):**

- `name` (string) - Nama produk.
- `description` (string) - Deskripsi produk.
- `stock` (integer) - Jumlah stok produk.
- `price` (number) - Harga produk.
- `image` (file) - Gambar produk (opsional).

**Response:**

- **200 OK**

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": "integer",
    "name": "string",
    "description": "string",
    "stock": "integer",
    "price": "number",
    "image_url": "string"
  }
}
```

- **400 Bad Request**

```json
{
  "error": "Invalid input data"
}
```

- **404 Not Found**

```json
{
  "error": "Product not found"
}
```

- **401 Unauthorized**

```json
{
  "error": "Unauthorized"
}
```

---

#### e. Hapus Produk

**Endpoint:**  
`DELETE /api/products/{id}`

**Deskripsi:**  
Endpoint ini digunakan untuk menghapus produk berdasarkan ID.

**Headers:**

**Response:**

- **200 OK**

```json
{
  "message": "Product deleted successfully"
}
```

- **404 Not Found**

```json
{
  "error": "Product not found"
}
```

### 3. CRUD Orders

#### a. Tambah Order

**Endpoint:**  
`POST /api/orders/`

**Deskripsi:**  
Endpoint ini digunakan untuk membuat order baru.

**Headers:**

**Request Body:**

- `cart_items` (array of objects) - Daftar produk yang dipesan, setiap item memiliki properti berikut:
  - `product_id` (integer) - ID produk.
  - `quantity` (integer) - Jumlah produk yang dipesan.
- `customer_name` (string) - Nama pelanggan.
- `phone` (string) - Nomor telepon pelanggan.
- `address` (string) - Alamat pengiriman.
- `payment_status` (string) - Status pembayaran (`pending`, `paid`, atau `failed`).

**Response:**

- **201 Created**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": "integer",
    "cart_items": [
      {
        "product_id": "integer",
        "quantity": "integer"
      }
    ],
    "total_price": "number",
    "customer_name": "string",
    "phone": "string",
    "address": "string",
    "payment_status": "string",
    "midtrans_order_id": "string"
  }
}
```

- **400 Bad Request**

```json
{
  "error": "Invalid input data"
}
```

---

#### b. Lihat Semua Order

**Endpoint:**  
`GET /api/orders/`

**Deskripsi:**  
Endpoint ini digunakan untuk mendapatkan daftar semua order.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

- **200 OK**

```json
[
  {
    "id": "integer",
    "cart_items": [
      {
        "product_id": "integer",
        "quantity": "integer"
      }
    ],
    "total_price": "number",
    "customer_name": "string",
    "phone": "string",
    "address": "string",
    "payment_status": "string",
    "midtrans_order_id": "string"
  }
]
```

---

#### c. Lihat Detail Order

**Endpoint:**  
`GET /api/orders/{id}`

**Deskripsi:**  
Endpoint ini digunakan untuk mendapatkan detail order berdasarkan ID.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

- **200 OK**

```json
{
  "id": "integer",
  "cart_items": [
    {
      "product_id": "integer",
      "quantity": "integer"
    }
  ],
  "total_price": "number",
  "customer_name": "string",
  "phone": "string",
  "address": "string",
  "payment_status": "string",
  "midtrans_order_id": "string"
}
```

- **404 Not Found**

```json
{
  "error": "Order not found"
}
```
