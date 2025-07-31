'use client';

import { useState } from 'react';

type Props = {
  defaultValue?: number;
  stock?: number;
};

export default function QuantitySelector({ defaultValue = 1, stock = 0 }: Props) {
  const [quantity, setQuantity] = useState(defaultValue);

  return (
    <div className="border border-green-400 rounded-lg w-[90px] h-10 flex items-center justify-between font-bold text-base bg-white">
      <button
        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
        className="text-green-500 px-2 text-lg"
      >
        -
      </button>
      <span className="mx-2">{quantity}</span>
      <button
        disabled={quantity >= stock}
        onClick={() => setQuantity((prev) => prev + 1)}
        className={`px-2 text-lg rounded transition ${quantity >= stock ? 'text-gray-300 cursor-not-allowed' : 'text-green-500 hover:text-green-600'} `}
      >
        +
      </button>
    </div>
  );
}
