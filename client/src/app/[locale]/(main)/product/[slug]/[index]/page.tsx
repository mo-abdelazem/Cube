import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import { getTranslations } from "next-intl/server";
type Props = {
  params: {
    slug: string;
    index: number;
  };
};

export default async function ProductPage({ params }: Props) {
  const t = await getTranslations('HomePage');
  
  const { slug, index } = await params;
  const res = await fetch(`http://localhost:3001/api/v1/products/${slug}`, {
    cache: "no-store",
  });

  const product = await res.json();

  const { translations, variants, category, images } = product;
  const selectedVariant = variants[index];
  console.log(selectedVariant.images)
  return (
    <main className="max-w-[1024px] mx-auto my-8 mb-16 px-6 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 items-start">
      {/* Product Images */}
      <section className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
          {/* Replace with dynamic image */}
          <Image
            src={selectedVariant.images?.[0]?.url || "/images/no-image.webp"} // Replace with correct image URL logic
            alt={translations?.find((trans: any) => trans.language === 'en')?.name || 'Product Image'}
            width={500}
            height={700}
            className="w-full h-auto object-contain aspect-[1/1.4] bg-[#fafafa] rounded-xl"
          />
        </div>

        <div className="mt-4 flex gap-3 justify-start">
          {selectedVariant.images?.map((image: any, index: number) => (
            <div
              key={index}
              className="w-16 h-16 p-1.5 rounded-xl border-2 border-transparent bg-gray-50 hover:border-green-300 hover:shadow-md cursor-pointer"
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index}`}
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
          {translations?.find((trans: any) => trans.language === 'en')?.name}
        </h1>
        <div className="flex gap-1.5 items-center text-yellow-400 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
            </svg>
          ))}
          <span className="ml-1 text-gray-400 font-normal">({product.reviewCount} reviews)</span>
        </div>

        <div className="flex gap-3 items-baseline">
          <div className="text-green-500 text-3xl font-bold">${product.basePrice}</div>
          <div className="text-orange-500 font-semibold text-sm">26% Off</div>
          <div className="line-through text-gray-400 font-semibold text-lg">$59.99</div>
        </div>

        <p className="text-gray-500 text-[15px] max-w-lg leading-relaxed">
          {translations?.find((trans: any) => trans.language === 'en')?.description}
        </p>

        <div className="text-sm text-gray-700 flex items-center gap-3 mt-4">
          <span className="text-gray-400">Size / Weight:</span>
          <div className="flex gap-2 ml-1">
            {variants?.map((variant: any, i: number) => (
              <button
                key={i}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm bg-gray-50 hover:border-green-400 hover:bg-green-100"
              >
                {variant.options?.[0]?.translations?.find((opt: any) => opt.language === 'en')?.value || 'Default Size'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-3 items-center flex-wrap">
          <QuantitySelector defaultValue={1} stock={selectedVariant.stock} />

          <button className="flex items-center gap-2 bg-green-500 text-white px-4 h-10 font-semibold text-base rounded-lg shadow-md hover:bg-green-600">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {t('Add to cart')}
          </button>
        </div>

        <dl className="text-sm grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700 font-semibold max-w-[460px]">
          <div>
            <dt>Type:</dt>
            <dd><a href="#" className="text-green-500">Organic</a></dd>
          </div>
          <div>
            <dt>SKU:</dt>
            <dd>{product.sku}</dd>
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
            <dd><a href="#" className="text-green-500">{variants?.[0]?.stock} Items In Stock</a></dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
