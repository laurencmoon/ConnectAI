import { useState, MouseEvent, useEffect } from "react";

export const useRipple = () => {
    const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

    const addRipple = (e: MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        
        // Calculate the relative click coordinates
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newRipple = {
            x,
            y,
            id: Date.now()
        };

        setRipples(prev => [...prev, newRipple]);
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (ripples.length > 0) {
             timeout = setTimeout(() => {
                 setRipples([]);
             }, 600); // Wait for the animation to finish
        }
        return () => clearTimeout(timeout);
    }, [ripples]);

    return { ripples, addRipple };
};
