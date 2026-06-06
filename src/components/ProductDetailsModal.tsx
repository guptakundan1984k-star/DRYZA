import React, { useState } from 'react';
import { Product } from '../types';
import { X, Check, Award, Download, ShieldCheck, Mail, Clipboard, FileText } from 'lucide-react';
import ProductPouch from './ProductPouch';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToInquiry: (product: Product) => void;
  isInInquiry: boolean;
  openBulkForm: () => void;
  loggedInCustomer?: any;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToInquiry,
  isInInquiry,
  openBulkForm,
  loggedInCustomer
}: ProductDetailsModalProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSpecs, setCopiedSpecs] = useState(false);

  // Function to simulate physical technical specification sheet download
  const handleDownloadSheet = () => {
    setDownloadSuccess(true);
    const content = `
=========================================
DRYZA SPICES - TECHNICAL SPECIFICATION SHEET
=========================================
Product Name      : ${product.name}
Category          : ${product.categoryLabel}
Country of Origin : ${product.origin}
Standard Rating   : Prime Wholesale Quality

1. DEHYDRATED ANALYTICAL SPECIFICATIONS
-----------------------------------------
Appearance/Color  : ${product.appearance}
Shelf Life        : ${product.shelfLife} (Stored correctly)
Storage Criteria  : ${product.storage}

2. APPROVED PACKAGING CONFIGURATIONS
-----------------------------------------
${product.packaging.map((pack, idx) => `[Standard Option ${idx + 1}] : ${pack}`).join('\n')}

3. REGISTERED INDUSTRIAL APPLICATIONS
-----------------------------------------
${product.applications.map((app, idx) => `- ${app}`).join('\n')}

4. REGULATORY CERTIFICATIONS & SANITATION
-----------------------------------------
Compliance Standards : ${product.qualityStandards.join(', ')}
Production Facility : ISO 22000, HACCP, Halal Certified, BRCGS AA Grade
Sulfite Treatment   : Zero synthetic preservatives added. Preserved naturally.

-----------------------------------------
For B2B wholesale enquiries, Private labeling, or Custom milling:
Email  : corporate@dryza-spices.com
Web    : www.dryza-spices.com
=========================================
Generated via Dryza Client Portal on June 2026.
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dryza_Technical_Sheet_${product.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  const copyToClipboard = () => {
    const textToCopy = `Dryza ${product.name} Specs: Appearance: ${product.appearance}, Shelf life: ${product.shelfLife}, Origin: ${product.origin}. Certified by ${product.qualityStandards.join(', ')}.`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedSpecs(true);
    setTimeout(() => setCopiedSpecs(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-md bg-stone-900/60 transition-all animate-fade-in" id="product-detail-modal">
      <div className="relative bg-[#FCFBF7] rounded-3xl max-w-3xl w-full text-stone-900 shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header Ribbon / Banner */}
        <div className="bg-emerald-900 text-stone-100 p-6 flex justify-between items-center border-b border-stone-200">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-300 font-bold">
              Dryza Technical Datasheet
            </span>
            <h2 className="text-2xl font-bold font-sans">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-250 hover:text-white hover:bg-emerald-800 rounded-full cursor-pointer transition-colors"
            id="close-modal-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Visual representation */}
            <div className="md:col-span-5 space-y-4 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-stone-50 to-stone-100/40 rounded-2xl border border-stone-200">
              <ProductPouch product={product} widthClass="w-[200px]" heightClass="h-[290px]" />
              <div className="bg-white p-3.5 rounded-xl border border-stone-200/50 flex flex-col items-center justify-center text-center font-mono w-full">
                <span className="text-stone-400 text-[10px] uppercase block">B2B Direct Pricing</span>
                <span className="text-base font-extrabold text-emerald-900 mt-1 block">
                  {loggedInCustomer?.role === 'cs' ? (product.csPricePerKgRange || product.pricePerKgRange) : product.pricePerKgRange}
                </span>
                <span className="text-[9.5px] text-stone-500 mt-0.5 block">Est. per Kg in Metric tons</span>
              </div>
            </div>

            {/* Spec definitions detail */}
            <div className="md:col-span-7 space-y-4">
              <p className="text-sm text-stone-700 leading-relaxed font-sans">
                {product.longDescription}
              </p>

              {/* Specification parameters definition table */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 font-mono text-xs shadow-inner-sm">
                <h4 className="font-sans font-bold text-stone-900 text-sm border-b border-stone-150 pb-2 flex items-center justify-between">
                  <span>Product Specifications</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-[10px] text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>{copiedSpecs ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </h4>
                
                <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 text-stone-850">
                  <span className="text-zinc-404">Appearance:</span>
                  <span className="col-span-2 font-semibold text-stone-955">{product.appearance}</span>
                  
                  <span className="text-zinc-404">Shelf Life:</span>
                  <span className="col-span-2 font-semibold text-stone-955">{product.shelfLife}</span>
                  
                  <span className="text-zinc-404">Origin Region:</span>
                  <span className="col-span-2 font-semibold text-stone-955">{product.origin}</span>

                  <span className="text-zinc-404">Ref Standards:</span>
                  <span className="col-span-2 font-semibold text-emerald-850">{product.qualityStandards.join(' / ')}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sub technical detail panels: packaging / applications / storage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Packaging options */}
            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 space-y-2.5">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-550" />
                <span>Standard Packaging Configurations</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {product.packaging.map((packStr, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-800 font-mono font-bold mt-0.5">•</span>
                    <span>{packStr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industrial Applications */}
            <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 space-y-2.5">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Recommended Applications</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {product.applications.map((appStr, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-800 font-mono font-bold mt-0.5">✔</span>
                    <span>{appStr}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Environmental storage requirements */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Preservative & Storage Conditions:</span>
              <p className="mt-1 text-amber-800 font-mono">{product.storage}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
            <button
              onClick={handleDownloadSheet}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 text-stone-100 hover:bg-black'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Technical Sheet Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Spec Sheet (.TXT)</span>
                </>
              )}
            </button>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onAddToInquiry(product);
                }}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isInInquiry
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-emerald-900 text-stone-100 hover:bg-emerald-950 font-semibold'
                }`}
              >
                <span>{isInInquiry ? 'In Cart' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={() => {
                  if (!isInInquiry) {
                    onAddToInquiry(product);
                  }
                  onClose();
                  openBulkForm();
                }}
                className="bg-amber-720 hover:bg-amber-800 text-stone-100 px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Checkout Cart
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
