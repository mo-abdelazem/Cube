import Image from "next/image";
import React from "react";
import pro1 from "@/assets/images/pro1.png";
import pro2 from "@/assets/images/pro2.png";
import pro3 from "@/assets/images/pro3.png";
import { Star } from "lucide-react";

const HomeProduct = () => {
  return (
    <div className=" p-8 max-w-[300px] border-2 border-bg-line rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.05)]">
      <h5 className="text-2xl font-semibold"> New products</h5>
      <div className="bg-bg-line h-0.5 w-full mt-4 relative ">
        <div className=" absolute top-0 left-0 h-0.5 w-1/3 bg-secondary"></div>
      </div>

      {/* products */}

      <div className="flex flex-col  mt-7 gap-3">
        {/* 1 */}
        <div className="flex items-center justify-between gap-2    rounded-lg  cursor-pointer border-b-3 border-bg-line border-dotted pb-2.5">
          <div>
            <Image src={pro1} alt="pro1" width={80} height={80} />
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-primary text-xl">ChenCardigan</h5>
            <p className="text-text-gray">$99.50</p>
            <Star className="text-amber-300 " />
          </div>
        </div>

        {/* 2 */}
        <div className="flex items-center justify-between gap-2    rounded-lg  cursor-pointer border-b-3 border-bg-line border-dotted pb-2.5 ">
          <div>
            <Image src={pro2} alt="pro2" width={80} height={80} />
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-primary text-xl">Chen Sweater</h5>
            <p className="text-text-gray">$66</p>
            <Star className="text-amber-300 " />
          </div>
        </div>
        {/* 3 */}
        <div className="flex items-center justify-between gap-2    rounded-lg  cursor-pointer ">
          <div>
            <Image src={pro3} alt="pro3" width={80} height={80} />
          </div>
          <div className="flex flex-col gap-1">
            <h5 className="text-primary text-xl">Colorful Jacket</h5>
            <p className="text-text-gray">$25</p>
            <Star className="text-amber-300 " />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProduct;
