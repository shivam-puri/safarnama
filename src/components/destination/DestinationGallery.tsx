import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DestinationImage } from '../../types/destination.types';

interface DestinationGalleryProps {
  images: DestinationImage[];
  altPrefix?: string;
}

export function DestinationGallery({ images = [], altPrefix = '' }: DestinationGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % images.length : null);

  if (!images.length) return null;

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const secondaryImages = images.filter(img => !img.isPrimary).slice(0, 2);

  return (
    <div>
      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-2 h-72 md:h-96 rounded-xl overflow-hidden">
        {/* Primary image - takes up 2 columns */}
        <div
          className="col-span-2 cursor-pointer overflow-hidden"
          onClick={() => openLightbox(images.indexOf(primaryImage))}
        >
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || `${altPrefix} main`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Secondary images stacked */}
        <div className="flex flex-col gap-2">
          {secondaryImages.length > 0 && secondaryImages.map((img, idx) => (
            <div
              key={idx}
              className="flex-1 cursor-pointer overflow-hidden"
              onClick={() => openLightbox(images.indexOf(img))}
            >
              <img
                src={img.url}
                alt={img.alt || `${altPrefix} ${idx + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {secondaryImages.length === 0 && (
            <div className="flex-1 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm">
              No more images
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 text-white hover:text-gray-300 p-2"
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 text-white hover:text-gray-300 p-2"
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex].url.replace('w=1200', 'w=1600')}
            alt={images[lightboxIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
