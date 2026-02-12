'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';

interface ChildPhotoGalleryProps {
    images?: string[];
    childName: string;
}

export function ChildPhotoGallery({ images = [], childName }: ChildPhotoGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Mock images if none provided
    const displayImages = images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop', // Happy Child 1
        'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=800&auto=format&fit=crop', // Happy Child 2
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop', // Playing Child
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % displayImages.length);
        }, 5000); // Auto slide every 5s

        return () => clearInterval(timer);
    }, [displayImages.length]);

    return (
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg bg-gray-100">

            {/* Image Slider */}
            {displayImages.map((src, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    {/* Note: In a real app, use next/image with proper blurDataURL. 
                Using standard img for external URLs without config setup for now to avoid errors. */}
                    <img
                        src={src}
                        alt={`${childName} photo ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {/* Subtle Overlay for better text visibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                {displayImages.map((_, index) => (
                    <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                ))}
            </div>

            {/* Empty State / Add Photo Button (If no images) */}
            {images.length === 0 && (
                <div className="absolute top-4 right-4">
                    <button className="bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50 transition">
                        <Icon name="add_a_photo" size="sm" />
                    </button>
                </div>
            )}
        </div>
    );
}
