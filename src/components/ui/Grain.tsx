/**
 * A whisper of texture over the near-white ground.
 *
 * On the old dark palette this was heavy film grain plus a dark vignette. On
 * light glass both would read as dirt — Apple's surfaces are clean. What's left
 * is a very faint noise (1.5%, multiply) that stops large flat areas of #F5F5F7
 * from banding on cheap panels, and nothing else. No vignette.
 *
 * Pure SVG, no JavaScript, no image request, and it never repaints because it
 * never moves.
 */
export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.015] mix-blend-multiply"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
