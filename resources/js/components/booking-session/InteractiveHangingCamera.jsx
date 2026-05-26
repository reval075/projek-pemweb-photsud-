import VintageHangingCamera from '@/components/booking-session/VintageHangingCamera';
import CameraFlashOverlay from '@/components/booking-session/CameraFlashOverlay';
import useShutterToBooking from '@/hooks/useShutterToBooking';

export default function InteractiveHangingCamera({
    redirectTo = '/booking',
    variant = 'light',
    showHint = true,
    className = '',
}) {
    const { isFlashing, handleShutter, disabled } = useShutterToBooking(redirectTo);

    return (
        <div className={`relative ${className}`}>
            <CameraFlashOverlay active={isFlashing} />
            <div
                className={`transition-all duration-500 ${
                    isFlashing ? 'blur-sm scale-[1.02] opacity-80' : ''
                }`}
            >
                <VintageHangingCamera
                    variant={variant}
                    onShutterClick={handleShutter}
                    disabled={disabled}
                    isFlashing={isFlashing}
                    showHint={showHint}
                />
            </div>
        </div>
    );
}
