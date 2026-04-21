// Select the database to use.
use("warehouseDB");

//1. buat database warehouse dan buat colection untuk warehouse system
// - Products
// - Inventory
// - Orders
db.products.drop();
db.inventory.drop();
db.orders.drop();

//2. Masukkan data berikut ke dalam Colections Products dengan isi data (_id, product_name, category, price) :
// (1, 'Laptop', 'Elektronik', 999,99)
// (2, 'Meja Kursi', 'Perabot', 199,99)
// (3, 'Printer', 'Elektronik', 299,99)
// (4, 'Rak Buku', 'Perabot', 149,99)
db.products.insertMany([
  { _id: 1, product_name: "Laptop", category: "Elektronik", price: 999.99 },
  { _id: 2, product_name: "Meja Kursi", category: "Perabot", price: 199.99 },
  { _id: 3, product_name: "Printer", category: "Elektronik", price: 299.99 },
  { _id: 4, product_name: "Rak Buku", category: "Perabot", price: 149.99 },
]);

//3. Tulis query untuk menampilkan semua produk beserta nama dan harganya, diurutkan berdasarkan harga dalam urutan menaik (Asceding).

// Expected output:
// [
//   { "product_name": "Bookshelf", "price": 149.99 },
//   { "product_name": "Desk Chair", "price": 199.99 },
//   { "product_name": "Printer", "price": 299.99 },
//   { "product_name": "Laptop", "price": 999.99 }
// ]
db.products.find({}, { _id: 0, product_name: 1, price: 1 }).sort({ price: 1 });

// 4. Masukkan data berikut ke dalam Colection Inventory dengan isi data (_id, product_id, quantity, location) :

// (1, 1, 50, 'Gudang A')
// (2, 2, 30, 'Gudang B')
// (3, 3, 20, 'Gudang A')
// (4, 4, 40, 'Gudang B')

db.inventory.insertMany([
  { _id: 1, product_id: 1, quantity: 50, location: "Gudang A" },
  { _id: 2, product_id: 2, quantity: 30, location: "Gudang B" },
  { _id: 3, product_id: 3, quantity: 20, location: "Gudang A" },
  { _id: 4, product_id: 4, quantity: 40, location: "Gudang B" },
]);

// 5. Tulis Query untuk menggabungkan tabel (aggregate) Produk dan Inventaris, yang menampilkan nama produk, kuantitas, dan lokasi untuk semua produk. Expected output:
// [
//   { "product_name": "Laptop", "quantity": 50, "location": "Warehouse A" },
//   { "product_name": "Desk Chair", "quantity": 30, "location": "Warehouse B" },
//   { "product_name": "Printer", "quantity": 20, "location": "Warehouse A" },
//   { "product_name": "Bookshelf", "quantity": 40, "location": "Warehouse B" }
// ]
db.inventory.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "_id",
      as: "product_info",
    },
  },
  {
    $unwind: "$product_info",
  },
  {
    $project: {
      _id: 0,
      product_name: "$product_info.product_name",
      quantity: "$quantity",
      location: "$location",
    },
  },
]);

// 6. Perbarui harga 'Laptop' menjadi 1099.99
db.products.updateOne({ product_name: "Laptop" }, { $set: { price: 1099.99 } });

// 7. Tuliskan query untuk menghitung nilai total inventaris pada setiap gudang.
// Output yang diharapkan (setelah pembaruan harga pada pertanyaan 6)
// [
//   { "_id": "Warehouse A", "total_value": 60999.80 },
//   { "_id": "Warehouse B", "total_value": 11999.60 }
// ]

db.inventory.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "_id",
      as: "product_info",
    },
  },
  {
    $unwind: "$product_info",
  },
  {
    $group: {
      _id: "$location",
      total_value: {
        $sum: { $multiply: ["$product_info.price", "$quantity"] },
      },
    },
  },
]);

// 8. Masukkan data berikut ke dalam Colection Orders :
//   {
//     _id: 1,
//     customer_id: 101,
//     order_date: ISODate("2024-08-12"),
//     order_details: [
//       { product_id: 1, quantity: 2 },
//       { product_id: 3, quantity: 1 }
//     ]
//   },
//   {
//     _id: 2,
//     customer_id: 102,
//     order_date: ISODate("2024-08-13"),
//     order_details: [
//       { product_id: 2, quantity: 1 },
//       { product_id: 4, quantity: 2 }
//     ]
//   }

db.orders.insertMany([
  {
    _id: 1,
    customer_id: 101,
    order_date: ISODate("2024-08-12"),
    order_details: [
      { product_id: 1, quantity: 2 },
      { product_id: 3, quantity: 1 },
    ],
  },
  {
    _id: 2,
    customer_id: 102,
    order_date: ISODate("2024-08-13"),
    order_details: [
      { product_id: 2, quantity: 1 },
      { product_id: 4, quantity: 2 },
    ],
  },
]);

// 9. Tulis Query untuk menampilkan jumlah total untuk setiap pesanan, termasuk order_id, order_date, dan total_amount.
// Expected output:
// [
//   { "order_id": 1, "order_date": ISODate("2024-08-12T00:00:00Z"), "total_amount": 2499.97 },
//   { "order_id": 2, "order_date": ISODate("2024-08-13T00:00:00Z"), "total_amount": 499.97 }
// ]
db.orders.aggregate([
  { $unwind: "$order_details" },
  {
    $lookup: {
      from: "products",
      localField: "order_details.product_id",
      foreignField: "_id",
      as: "item_info",
    },
  },
  { $unwind: "$item_info" },
  {
    $group: {
      _id: "$_id",
      order_date: { $first: "$order_date" },
      total_amount: {
        $sum: { $multiply: ["$order_details.quantity", "$item_info.price"] },
      },
    },
  },
  {
    $project: {
      order_id: "$_id",
      order_date: 1,
      total_amount: 1,
      _id: 0,
    },
  },
]);

db.products.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "order_details.product_id",
      as: "order_matches",
    },
  },
  {
    $match: {
      order_matches: { $size: 0 },
    },
  },
  {
    $project: {
      _id: 0,
      product_name: 1,
      category: 1,
    },
  },
]);
