import React from 'react';
import { Product } from '../types';
import { Download, FileText, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import ProductPouch from './ProductPouch';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToInquiry: (product: Product, event?: React.MouseEvent) => void;
  isInInquiry: boolean;
  loggedInCustomer?: any;
  quantity?: number;
  onIncrement?: (productId: string) => void;
  onDecrement?: (productId: string) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToInquiry,
  isInInquiry,
  loggedInCustomer,
  quantity = 1,
  onIncrement,
  onDecrement
}: ProductCardProps) {
  return (
    <div className="bg-[#FAF9F5] rounded-2xl overflow-hidden border border-stone-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
      
      {/* Product Image Panel (Visual standing pouch stage) */}
      <div className="relative pt-6 pb-4 px-4 bg-gradient-to-b from-stone-50 to-stone-100 flex justify-center items-center select-none border-b border-stone-200/40 relative cursor-pointer" onClick={() => onViewDetails(product)}>
        <ProductPouch product={product} widthClass="w-[180px]" heightClass="h-[250px]" />
        
        {/* Popular / Export Grade indicator */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isPopular && (
            <span className="bg-emerald-950 text-stone-100 text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded shadow-sm">
              ★ Popular Demand
            </span>
          )}
          <span className="bg-amber-750 text-white text-[8px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded shadow-sm">
            FSSAI LIC: 21126180000120
          </span>
        </div>

        {/* Quality Standards list in bottom overlay */}
        <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-xs px-2 py-0.5 rounded text-[8px] text-stone-100 font-mono flex items-center gap-1 z-10 pointer-events-none">
          <span>Net Wt:</span>
          <span className="font-bold text-amber-300">{product.netWt || "100g"}</span>
        </div>
      </div>

      {/* Product Content info */}
      <div className="p-5 flex-1 flex flex-col space-y-3.5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 font-semibold">
            {product.categoryLabel}
          </span>
          <h3
            className="text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors cursor-pointer"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Technical highlight sheet */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-stone-100/60 rounded-xl font-mono text-[11px] text-stone-700">
          <div>
            <span className="text-stone-400 block uppercase text-[8.5px]">Price</span>
            <span className="font-extrabold text-[#D97706] text-[11px] truncate block">
              {loggedInCustomer?.role === 'cs' ? (product.csPricePerKgRange || product.pricePerKgRange) : product.pricePerKgRange}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block uppercase text-[8.5px]">Shelf Life</span>
            <span className="font-extrabold text-stone-900 truncate block">{product.shelfLife}</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-stone-200/60">
            <span className="text-stone-400 text-[8.5px] uppercase block">Standard Pack</span>
            <span className="text-stone-800 font-medium truncate block">{product.packaging[0]}</span>
          </div>
        </div>

        {/* Footer actions inside card */}
        <div className="flex items-center justify-between pt-2 gap-2 mt-auto">
          {/* Learn Specs */}
          <button
            onClick={() => onViewDetails(product)}
            className="text-stone-700 hover:text-emerald-800 bg-stone-200/50 hover:bg-emerald-50 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            id={`specs-btn-${product.id}`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Tech Sheets</span>
          </button>

          {/* Add to request list */}
          {isInInquiry ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-xl p-1 select-none" id={`qty-controls-${product.id}`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDecrement) onDecrement(product.id);
                }}
                className="w-7 h-7 flex items-center justify-center bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-lg font-black text-xs cursor-pointer transition-colors shadow-sm"
                id={`dec-btn-${product.id}`}
              >
                -
              </button>
              <span className="font-mono text-xs font-black text-emerald-950 px-1.5 min-w-[14px] text-center" id={`qty-val-${product.id}`}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onIncrement) onIncrement(product.id);
                }}
                className="w-7 h-7 flex items-center justify-center bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-lg font-black text-xs cursor-pointer transition-colors shadow-sm"
                id={`inc-btn-${product.id}`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                import('canvas-confetti').then((module) => {
                  const confetti = module.default;
                  confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { 
                      x: (rect.left + rect.width / 2) / window.innerWidth,
                      y: (rect.top + rect.height / 2) / window.innerHeight
                    },
                    colors: ['#059669', '#34d399', '#fcd34d']
                  });
                });
                onAddToInquiry(product, e);
              }}
              className="px-3 py-2 bg-emerald-400 hover:bg-emerald-500 text-stone-950 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border border-emerald-500"
              id={`add-cart-btn-${product.id}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
