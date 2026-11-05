"use client";

import React from 'react';

const ResponsiveHeroBanner: React.FC<{ 
    children?: React.ReactNode,
    greetingNode?: React.ReactNode
}> = ({
    children,
    greetingNode
}) => {
    return (
        <section 
            className="w-full min-w-0 max-w-full relative flex flex-col items-center justify-center gap-2"
        >
            {greetingNode && (
                <div className="relative w-full min-w-0 z-50">
                    {greetingNode}
                </div>
            )}

            {children && (
                <div className="relative z-10 w-full max-w-4xl">
                    {children}
                </div>
            )}
        </section>
    );
};

export default ResponsiveHeroBanner;
