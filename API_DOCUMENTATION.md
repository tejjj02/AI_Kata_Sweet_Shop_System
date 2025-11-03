# 🍬 Sweet Shop REST API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Sweets
**GET** `/sweets`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Chocolate Bar",
      "category": "chocolate",
      "price": 2.50,
      "quantity": 100
    }
  ]
}
```

---

### 2. Get Sweet by ID
**GET** `/sweets/:id`

**Example:** `GET /sweets/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Chocolate Bar",
    "category": "chocolate",
    "price": 2.50,
    "quantity": 100
  }
}
```

---

### 3. Create New Sweet
**POST** `/sweets`

**Request Body:**
```json
{
  "name": "Dark Chocolate",
  "category": "chocolate",
  "price": 3.50,
  "quantity": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet created successfully",
  "data": {
    "id": 4,
    "name": "Dark Chocolate",
    "category": "chocolate",
    "price": 3.50,
    "quantity": 50
  }
}
```

---

### 4. Update Sweet
**PUT** `/sweets/:id`

**Example:** `PUT /sweets/1`

**Request Body:**
```json
{
  "name": "Updated Chocolate",
  "category": "chocolate",
  "price": 4.00,
  "quantity": 80
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sweet updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Chocolate",
    "category": "chocolate",
    "price": 4.00,
    "quantity": 80
  }
}
```

---

### 5. Delete Sweet
**DELETE** `/sweets/:id`

**Example:** `DELETE /sweets/1`

**Response:**
```json
{
  "success": true,
  "message": "Sweet deleted successfully"
}
```

---

### 6. Search by Category
**GET** `/sweets/search/category/:category`

**Example:** `GET /sweets/search/category/chocolate`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### 7. Search by Name
**GET** `/sweets/search/name/:name`

**Example:** `GET /sweets/search/name/Chocolate`

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [...]
}
```

---

### 8. Search by Price Range
**GET** `/sweets/search/price?min=X&max=Y`

**Example:** `GET /sweets/search/price?min=2.00&max=5.00`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### 9. Purchase Sweet
**POST** `/sweets/:id/purchase`

**Example:** `POST /sweets/1/purchase`

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchased 10 units successfully",
  "data": {
    "id": 1,
    "name": "Chocolate Bar",
    "quantity": 90
  }
}
```

---

### 10. Restock Sweet
**POST** `/sweets/:id/restock`

**Example:** `POST /sweets/1/restock`

**Request Body:**
```json
{
  "quantity": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Restocked 50 units successfully",
  "data": {
    "id": 1,
    "name": "Chocolate Bar",
    "quantity": 150
  }
}
```

---

### 11. Check Stock Status
**GET** `/sweets/:id/stock`

**Example:** `GET /sweets/1/stock`

**Response:**
```json
{
  "success": true,
  "inStock": true,
  "message": "Sweet is in stock"
}
```

---

## Testing with cURL

### Get all sweets
```bash
curl http://localhost:3000/api/sweets
```

### Create a sweet
```bash
curl -X POST http://localhost:3000/api/sweets \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Sweet","category":"candy","price":1.99,"quantity":100}'
```

### Purchase a sweet
```bash
curl -X POST http://localhost:3000/api/sweets/1/purchase \
  -H "Content-Type: application/json" \
  -d '{"quantity":10}'
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
