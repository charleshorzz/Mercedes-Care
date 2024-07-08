import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import car3 from "../assets/image3.png";

const About = () => {
  return (
    <div className="bg-black">
      <TextParallaxContent
        imgUrl={car3}
        subheading="Regular maintenance by our specialists for retaining the safety, reliability and value of your Mercedes-Benz."
        heading="Mercedes-Benz Maintenance Services"
      ></TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 1;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div className="">
      <div className="relative h-[100vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
        <a
          href="/login"
          className="absolute bottom-12 left-[40rem] border-secondary border rounded-full bg-[#00A19B] py-3 px-8 text-center text-base font-medium text-white hover:bg-[#006e4f] disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 transition-all duration-150 cursor-pointer z-10 font-alata"
        >
          Make your appointment now
        </a>
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className=""
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-24 top-[3rem] flex h-screen w-full flex-col  text-white"
    >
      <div className="text-5xl font-semibold w-[30rem] leading-tight mb-4 font-alata">
        {heading}
      </div>
      <p className="text-lg text-gray-300 w-[30rem] font-alata">{subheading}</p>
    </motion.div>
  );
};

export default About;
