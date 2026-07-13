interface RouteTransitionOverlayProps {
  visible: boolean;
}

export function RouteTransitionOverlay({ visible }: RouteTransitionOverlayProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity ease-in-out ${
        visible ? 'opacity-100 duration-300 pointer-events-auto' : 'opacity-0 duration-500 pointer-events-none'
      }`}
      style={{ backgroundColor: '#FFFBF5' }}
    >
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-500 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        <img src="/logo.png" alt="Window Seat" className="h-12 w-12 object-contain animate-pulse" />
        <span
          className="text-3xl font-bold animate-pulse"
          style={{ fontFamily: 'Caveat, cursive', color: '#3D2C2C' }}
        >
          Window Seat
        </span>
      </div>
    </div>
  );
}
