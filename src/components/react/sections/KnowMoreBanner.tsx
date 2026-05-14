import React from 'react';

const KnowMoreBanner: React.FC = () => {
    return (
        <div
            className="relative z-30 min-h-[180px] sm:min-h-[240px] md:min-h-[280px] overflow-visible flex flex-col
            items-center justify-center px-4 sm:pt-30 sm:pb-10 sm:px-6 mb-6"
        >
            {/* Background - Using gradient similar to other sections */}
            <div
                className="absolute inset-0 w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://uploads.backendservices.in/storage/internship/artifex/images/177867472587677.jpg')`,
                    height: '100%',
                }}
            ></div>

            {/* Content */}
            <div className="relative z-10 text-black text-center w-full
            max-w-[1000px] px-2 sm:px-4">
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold font-display leading-tight"
                >
                    Learn More About This Topic 
                </h1>
                <p
                    className="text-base sm:text-xl font-body mt-3 sm:mt-4 text-black/60"
                >
                    Dive Deep into Assam's Rich Manuscript Heritage
                </p>
            </div>
        </div>
    );
};

export default KnowMoreBanner;