import React from "react";
import img1 from "@/assets/images/img1.png";
import img2 from "@/assets/images/img2.png";
import img3 from "@/assets/images/img3.png";
import img4 from "@/assets/images/img4.png";
import img5 from "@/assets/images/img5.png";
import Image from "next/image";
import { ShoppingCart, Star } from "lucide-react";

const ProductCard = () => {
  const myProducts = [
    {
      id: 1,
      image: img1,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Hot",
    },
    {
      id: 2,
      image: img2,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
    {
      id: 3,
      image: img3,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 4,
      image: img4,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
    {
      id: 5,
      image: img5,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 6,
      image: img3,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 7,
      image: img4,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
    {
      id: 8,
      image: img5,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 9,
      image: img1,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Hot",
    },
    {
      id: 10,
      image: img2,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
    {
      id: 11,
      image: img3,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 12,
      image: img4,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
    {
      id: 13,
      image: img5,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "New",
    },
    {
      id: 14,
      image: img1,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Hot",
    },
    {
      id: 15,
      image: img4,
      cat: "Hodo Foods",
      des: "Chobani CompleteVanilla Greek",
      by: " NestFood",
      oldPrice: "$99.50",
      new: "$54.85",
      rating: 4.5,
      state: "Sale",
    },
  ];

  return (
    <div className="mt-11">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {myProducts.map((product) => (
          <div
            key={product.id}
            className="border max-w-[230px] border-bg-line rounded-2xl p-5 relative "
          >
            <Image
              width={180}
              height={180}
              src={product.image}
              alt={product.des}
              className="w-full h-32 object-cover mb-2"
            />

            <div className="flex flex-col gap-2.5 mt-10 ">
              <p className="text-sm text-text-gray">{product.cat}</p>
              <h4 className="font-semibold">{product.des}</h4>
              <div className="flex items-center gap-1 text-amber-300">
                <Star />
                <div className="text-text-gray"> {product.rating}</div>
              </div>
              <div className="text-sm text-primary">
                <span className="text-text-gray">By</span> {product.by}
              </div>
            </div>

            <div className="flex gap-2 justify-between items-center ">
              <span className="font-semibold text-primary">{product.new}</span>
              <span className="line-through text-text-gray">
                {product.oldPrice}
              </span>

              <div className="bg-bg-cart flex items-center justify-center gap-1 text-primary px-4 py-2.5 rounded-lg cursor-pointer">
                <ShoppingCart size={16} />
                <span>Add</span>
              </div>
            </div>

            <div
              className={`absolute top-0 left-0 ${
                product.state === "Hot"
                  ? "bg-hot"
                  : product.state === "Sale"
                  ? "bg-sale"
                  : "bg-primary"
              } text-white px-5 py-2 rounded-br-[20px] rounded-tl-[10px] text-xs`}
            >
              {product.state}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
