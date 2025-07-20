import React from "react";
import cat1 from "@/assets/images/cat1.png";
import cat2 from "@/assets/images/cat2.png";
import cat3 from "@/assets/images/cat3.png";
import cat4 from "@/assets/images/cat4.png";
import cat5 from "@/assets/images/cat5.png";
import Image from "next/image";

const HeaderCat = () => {
  return (
    <div className=" p-8 max-w-[300px] border-2 border-bg-line rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.05)]">
      <h5 className="text-2xl font-semibold"> Category</h5>
      <div className="bg-bg-line h-0.5 w-full mt-4 relative ">
        <div className=" absolute top-0 left-0 h-0.5 w-1/3 bg-secondary"></div>
      </div>

      {/* categories */}
      <div className="flex flex-col gap-3.5 mt-7 ">
        {/* 1 */}
        <div className="flex items-center justify-between gap-2  border border-bg-line px-4 py-2.5 rounded-lg  cursor-pointer">
          <Image src={cat1} alt="cat1" width={30} height={30} />
          <p>Milks & Dairies</p>
          <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            3
          </div>
        </div>
        {/* 2 */}
        <div className="flex items-center justify-between gap-2  border border-bg-line px-4 py-2.5 rounded-lg  cursor-pointer">
          <Image src={cat2} alt="cat2" width={30} height={30} />
          <p>Clothing</p>
          <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            4
          </div>
        </div>
        {/* 2 */}
        <div className="flex items-center justify-between gap-2  border border-bg-line px-4 py-2.5 rounded-lg  cursor-pointer">
          <Image src={cat3} alt="cat3" width={30} height={30} />
          <p>Pet Foods</p>
          <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            7
          </div>
        </div>
        {/* 2 */}
        <div className="flex items-center justify-between gap-2  border border-bg-line px-4 py-2.5 rounded-lg  cursor-pointer">
          <Image src={cat4} alt="cat4" width={30} height={30} />
          <p>Baking material</p>
          <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            5
          </div>
        </div>
        {/* 2 */}
        <div className="flex items-center justify-between gap-2  border border-bg-line px-4 py-2.5 rounded-lg  cursor-pointer">
          <Image src={cat5} alt="cat5" width={30} height={30} />
          <p>Fresh Fruit</p>
          <div className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center font-semibold">
            10
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCat;
