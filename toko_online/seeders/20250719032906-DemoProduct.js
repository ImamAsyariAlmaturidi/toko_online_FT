"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          name: "Pensil 2B",
          description: "Pensil 2B cocok untuk ujian dan menggambar.",
          price: 2000,
          stock: 100,
          image_url:
            "https://images.unsplash.com/photo-1588776814546-ec7b3913c6cb",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Penghapus Putih",
          description: "Penghapus berkualitas yang tidak merusak kertas.",
          price: 1500,
          stock: 80,
          image_url:
            "https://images.unsplash.com/photo-1629702781238-48c6978efdbf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rautan Manual",
          description: "Rautan pensil kecil dan praktis.",
          price: 2500,
          stock: 70,
          image_url:
            "https://images.unsplash.com/photo-1601197983110-ec094c2f389f",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Buku Tulis 38 Lembar",
          description: "Buku tulis dengan garis rapi dan kertas tebal.",
          price: 5000,
          stock: 200,
          image_url:
            "https://images.unsplash.com/photo-1579033461380-adb53f9d2210",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Penggaris 30cm",
          description: "Penggaris plastik bening ukuran 30cm.",
          price: 3000,
          stock: 90,
          image_url:
            "https://images.unsplash.com/photo-1588776835423-648e9e502b8f",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tempat Pensil",
          description: "Tempat pensil kain motif minimalis.",
          price: 8000,
          stock: 60,
          image_url:
            "https://images.unsplash.com/photo-1591287982056-fbe6cfb6ebc6",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Spidol Warna",
          description: "Set spidol warna untuk menggambar dan mewarnai.",
          price: 12000,
          stock: 40,
          image_url:
            "https://images.unsplash.com/photo-1603575448764-b8df4f5ce251",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tas Sekolah Anak",
          description: "Tas sekolah anak motif kartun lucu.",
          price: 60000,
          stock: 30,
          image_url:
            "https://images.unsplash.com/photo-1609838464244-7b8cf69d5091",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tip-Ex Roller",
          description: "Tip-Ex roller untuk menghapus tulisan tinta.",
          price: 9000,
          stock: 50,
          image_url:
            "https://images.unsplash.com/photo-1592407928181-e2b1fc68caa5",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Crayon 12 Warna",
          description: "Crayon dengan warna cerah untuk anak-anak.",
          price: 15000,
          stock: 35,
          image_url:
            "https://images.unsplash.com/photo-1617032524752-dc4e31832963",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
