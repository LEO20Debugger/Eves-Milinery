"use client";

import { useEffect } from "react";
import Image from "next/image";
import { blurProps } from "@/lib/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import type { PieceImage } from "@/content/pieces";

type Props = {
  image: PieceImage | null;
  /** Changes when the hovered row changes, which retriggers the reveal. */
  activeKey: string | null;
};

const WIDTH = 320;
const HEIGHT = 400;

/**
 * A cursor-following preview shown while a row of the collections list is
 * hovered. Mounted once by the list and fed the active piece, so only one
 * preview element ever exists and the crossfade between rows is continuous.
 *
 * The list renders a visual grid instead on touch devices, so this never
 * mounts there.
 */
export default function HoverImage({ image, activeKey }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Softer and heavier than the cursor ring, so the image trails behind it.
  const x = useSpring(mouseX, { stiffness: 90, damping: 22, mass: 0.9 });
  const y = useSpring(mouseY, { stiffness: 90, damping: 22, mass: 0.9 });

  useEffect(() => {
    // Writes two motion values and nothing else — no layout reads, no state.
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX - WIDTH / 2);
      mouseY.set(event.clientY - HEIGHT / 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block"
      style={{ x, y }}
    >
      <AnimatePresence mode="wait">
        {image && activeKey && (
          <motion.div
            key={activeKey}
            className="frame relative"
            style={{ width: WIDTH, height: HEIGHT }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.06 }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)", scale: 1.02 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes={`${WIDTH}px`}
              className="object-cover"
              {...blurProps(image.src)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
