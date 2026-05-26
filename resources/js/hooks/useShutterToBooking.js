import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

const FLASH_MS = 580;

export default function useShutterToBooking(redirectTo = '/booking') {
    const [isFlashing, setIsFlashing] = useState(false);

    const handleShutter = useCallback(() => {
        if (isFlashing) return;
        setIsFlashing(true);
        setTimeout(() => {
            router.visit(redirectTo);
        }, FLASH_MS);
    }, [isFlashing, redirectTo]);

    return { isFlashing, handleShutter, disabled: isFlashing };
}
