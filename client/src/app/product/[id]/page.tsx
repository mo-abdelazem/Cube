import Image from "next/image";

export default function ProductPage() {
  return (
    <main className="max-w-[1024px] mx-auto my-8 mb-16 px-6 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-start">
      {/* Product Images */}
      <section className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
          <Image
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a77bacf6-64e0-4889-912b-1333e14e33d3.png"
            alt="Back packaging of Seeds of Change Organic Quinoa"
            width={500}
            height={700}
            className="w-full h-auto object-contain aspect-[1/1.4] bg-[#fafafa] rounded-xl"
          />
        </div>

        <div className="mt-4 flex gap-3 justify-start">
          {[
            "5c6e8be4-665b-4a23-8a82-a77c2adb6d0b",
            "5c1b8aec-94f5-4f2e-aaf0-6d29e98b9139",
            "55bbdc12-8259-40ae-bdb3-9be6fa625cdd",
            "8f2af89b-f55f-4ef5-8223-3dcc4877cdd4",
          ].map((id, index) => (
            <div
              key={index}
              className="w-16 h-16 p-1.5 rounded-xl border-2 border-transparent bg-gray-50 hover:border-green-300 hover:shadow-md cursor-pointer"
            >
              <Image
                src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/${id}.png`}
                alt="Thumbnail"
                width={56}
                height={56}
                className="object-contain w-14 h-14 rounded-lg bg-[#fafafa]"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Product Info */}
      <section className="flex flex-col gap-7 font-medium">
        <small className="inline-block px-3 py-1 bg-red-300 text-red-800 font-bold text-xs rounded-md w-fit uppercase shadow-sm tracking-wider">
          Sale Off
        </small>
        <h1 className="text-2xl font-bold text-slate-800 leading-snug max-w-[380px]">
          Seeds of Change<br /> Organic Quinoa, Brown
        </h1>
        <div className="flex gap-1.5 items-center text-yellow-400 text-sm">
          {Array.from({ length: 1 }).map((_, i) => (
            <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
          ))}
          <span className="ml-1 text-gray-400 font-normal">(32 reviews)</span>
        </div>

        <div className="flex gap-3 items-baseline">
          <div className="text-green-500 text-3xl font-bold">$38</div>
          <div className="text-orange-500 font-semibold text-sm">26% Off</div>
          <div className="line-through text-gray-400 font-semibold text-lg">$52</div>
        </div>

        <p className="text-gray-500 text-[15px] max-w-lg leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam rem officia, corrupti
          reiciendis minima nisi modi, quasi, odio minus dolore impedit fuga eum eligendi.
        </p>

        <div className="text-sm text-gray-700 flex items-center gap-3 mt-4">
          <span className="text-gray-400">Size / Weight:</span>
          <div className="flex gap-2 ml-1">
            {["50g", "60g", "80g", "100g", "150g"].map((size, i) => (
              <button
                key={i}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 hover:border-green-400 hover:bg-green-100"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-3 items-center flex-wrap">
          <div className="border border-green-400 rounded-lg w-[74px] h-10 flex items-center justify-center font-bold text-base bg-white">
            <button className="text-green-500 px-1 text-lg">-</button>
            <span className="mx-2">1</span>
            <button className="text-green-500 px-1 text-lg">+</button>
          </div>

          <button className="flex items-center gap-2 bg-green-500 text-white px-4 h-10 font-semibold text-base rounded-lg shadow-md hover:bg-green-600">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Add to cart
          </button>
        </div>

        <dl className="text-sm grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700 font-semibold max-w-[460px]">
          <div>
            <dt>Type:</dt>
            <dd><a href="#" className="text-green-500">Organic</a></dd>
          </div>
          <div>
            <dt>SKU:</dt>
            <dd>FWM15VKT</dd>
          </div>
          <div>
            <dt>MFG:</dt>
            <dd><a href="#" className="text-green-500">Jun 4, 2022</a></dd>
          </div>
          <div>
            <dt>Tags:</dt>
            <dd><a href="#" className="text-green-500">Snack</a>, <a href="#" className="text-green-500">Organic</a>, <a href="#" className="text-green-500">Brown</a></dd>
          </div>
          <div>
            <dt>LIFE:</dt>
            <dd><a href="#" className="text-green-500">70 days</a></dd>
          </div>
          <div>
            <dt>Stock:</dt>
            <dd><a href="#" className="text-green-500">8 Items In Stock</a></dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
