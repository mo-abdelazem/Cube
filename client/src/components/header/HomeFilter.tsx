"use client";
import React from "react";
import Form from "next/form";
import { Funnel } from "lucide-react";
const HomeFilter = () => {
  return (
    <div className=" p-8 max-w-[300px] border-2 border-bg-line rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.05)] ">
      <h5 className="text-2xl font-semibold"> Fill by price</h5>
      <div className="bg-bg-line h-0.5 w-full mt-4 relative ">
        <div className=" absolute top-0 left-0 h-0.5 w-1/3 bg-secondary"></div>
      </div>

      {/* filter */}
      <Form action="/search">
        <input
          id="steps-range"
          type="range"
          min="100"
          max="1000"
          value="500"
          step="50"
          onChange={(e) => console.log(e.target.value)}
          className="w-full h-2 bg-bg-line rounded-lg  cursor-pointer border-none mt-7"
        />
      </Form>

      <div className="flex justify-between  mt-6">
        <div className="text-text-gray ">
          From: <span className="text-primary">$100</span>
        </div>

        <div className="text-text-gray ">
          To: <span className="text-primary">$,1000</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <div>
          <h5 className="my-3.5 text-text-gray font-bold">Color</h5>

          <div className="flex items-center gap-2  text-text-gray">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4  "
            />
            <label htmlFor="default-checkbox" className="">
              Hot (56)
            </label>
          </div>
          <div className="flex items-center my-3.5 gap-2 text-text-gray">
            <input
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 "
            />
            <label htmlFor="checked-checkbox" className="">
              Sale (40)
            </label>
          </div>

          <div className="flex items-center gap-2 text-text-gray">
            <input
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 "
            />
            <label htmlFor="checked-checkbox" className="">
              New (80)
            </label>
          </div>
        </div>

        <div>
          <h5 className="my-3.5 text-text-gray font-bold">Item Condition</h5>

          <div className="flex items-center gap-2  text-text-gray">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4  "
            />
            <label htmlFor="default-checkbox" className="">
              For you (25)
            </label>
          </div>
          <div className="flex items-center my-3.5 gap-2 text-text-gray">
            <input
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 "
            />
            <label htmlFor="checked-checkbox" className="">
              Refurbished (66)
            </label>
          </div>

          <div className="flex items-center gap-2 text-text-gray">
            <input
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 "
            />
            <label htmlFor="checked-checkbox" className="">
              Used (63)
            </label>
          </div>
        </div>

        <button className="flex items-center justify-center gap-1 bg-primary py-3 w-[120px] text-white rounded-lg mt-5 cursor-pointer">
          <Funnel size={13} />
          <span className=""> Filter</span>
        </button>
      </div>
    </div>
  );
};

export default HomeFilter;
