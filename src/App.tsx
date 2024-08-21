import {
  MotionValue,
  motion,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { RotateCcw, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useOnClickOutside } from "usehooks-ts";

export default function App() {
  let [count, setCount] = useState(0);
  let [showConfetti, setShowConfetti] = useState(false);
  let [activePhoto, setActivePhoto] = useState<PhotoType | null>(null);

  useEffect(() => {
    if (count === 5000) {
      setShowConfetti(true);
    }
  }, [count]);

  setTimeout(() => {
    setCount(5000);
  }, 300);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setActivePhoto(null));
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActivePhoto(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <main className="relative w-full min-h-screen flex items-start md:items-center justify-center px-4 py-10">
      <div className="relative flex flex-col gap-10 md:flex-row items-center justify-center md:justify-between md:gap-2 w-full max-w-5xl">
        <div className="flex flex-col items-center justify-center">
          <motion.h3
            className="text-2xl w-full text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            Thanks for
          </motion.h3>
          <Counter value={count} />
          <motion.p
            className="text-xl w-full text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            Followers !
          </motion.p>
        </div>
        <div className="grid w-full md:w-[60%] grid-cols-2 gap-4">
          {PHOTOS.map((photo, index) => (
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
              }}
            >
              <motion.div
                className="w-full h-44 relative after:absolute after:inset-0 after:z-10 after:border-4 after:border-black/10 after:rounded-2xl bg-slte-100 cursor-pointer"
                onClick={() => setActivePhoto(photo)}
                layoutId={`photo-${photo.title}`}
              >
                <img
                  key={photo.title}
                  className="w-full h-full object-cover rounded-2xl bg-slte-100"
                  src={photo.src}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <div
            className="z-10 backdrop-blur-md inset-0 bg-back/50 w-full h-full absolute"
            ref={ref}
          ></div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activePhoto && (
          <div className="absolute flex items-center justify-center inset-0 overflow-hidden z-20 p-4">
            <motion.div
              className="relative w-full max-w-[600px] h-96 left-0 after:absolute after:inset-0 after:z-10 after:border-4 after:border-black/10 after:rounded-2xl bg-slte-100 cursor-pointer"
              layoutId={`photo-${activePhoto.title}`}
            >
              <img
                key={activePhoto.title}
                className="w-full h-full object-cover rounded-2xl bg-slte-100"
                src={activePhoto.src}
              />
            </motion.div>
            <motion.button
              className="p-3 bg-zinc-900 text-white rounded-full shadow-md active:scale-90 duration-300 transition-transform absolute top-4 right-4 z-30"
              onClick={() => setActivePhoto(null)}
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: -20,
                transition: { duration: 0.05 },
              }}
              layout
            >
              <X />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          window.location.reload();
        }}
        className="p-3 bg-zinc-900 text-white rounded-full shadow-md active:scale-90 duration-300 transition-transform absolute bottom-4 right-4"
      >
        <RotateCcw />
      </button>
      {showConfetti && <Confetti />}
    </main>
  );
}

const fontSize = 50;
const padding = 15;
const height = fontSize + padding;

function Counter({ value }: { value: number }) {
  return (
    <div
      style={{ fontSize }}
      className="flex space-x-1 overflow-hidden rounded bg-white px-2 leading-none text-gray-900 items-center justify-center"
    >
      <span className="font-semibold">+</span>
      <Digit place={1000} value={value} />
      <Digit place={100} value={value} />
      <Digit place={10} value={value} />
      <Digit place={1} value={value} />
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace);

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[...Array(10).keys()].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center font-semibold"
    >
      {number}
    </motion.span>
  );
}

type PhotoType = {
  title: string;
  src: string;
};

const PHOTOS: PhotoType[] = [
  {
    title: "Photo-1",
    src: "/photos/1.png",
  },
  {
    title: "Photo-2",
    src: "/photos/2.png",
  },
  {
    title: "Photo-3",
    src: "/photos/3.png",
  },
  {
    title: "Photo-4",
    src: "/photos/4.png",
  },
  {
    title: "Photo-5",
    src: "/photos/5.png",
  },
  {
    title: "Photo-6",
    src: "/photos/6.png",
  },
  {
    title: "Photo-7",
    src: "/photos/7.png",
  },
  {
    title: "Photo-8",
    src: "/photos/8.png",
  },
];
