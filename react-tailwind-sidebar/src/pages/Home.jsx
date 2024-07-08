import React, { useEffect } from "react";
import { gsap, ScrollTrigger } from "gsap/all";
import Hero from "../assets/mercedesHero.jpg";
import "../Home.css";
import About from "../components/About";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    const updateBodyHeight = () => {
      const contentHolder = document.querySelector(".content-holder");
      if (contentHolder) {
        const contentHolderHeight = contentHolder.offsetHeight;
        const imgHolderHeight = window.innerHeight;
        const totalBodyHeight = contentHolderHeight + imgHolderHeight;
        document.body.style.height = `${totalBodyHeight}px`;
      }
    };

    window.addEventListener("resize", updateBodyHeight);
    updateBodyHeight(); // Call initially to set the height

    ScrollTrigger.create({
      trigger: ".website-content",
      start: "-0.1% top",
      end: "bottom bottom",
      onEnter: () => {
        gsap.set(".website-content", { position: "absolute", top: "120%" });
      },
      onLeaveBack: () => {
        gsap.set(".website-content", { position: "fixed", top: "0" });
      },
    });

    gsap.to(".header .letters:first-child", {
      x: () => -innerWidth * 3,
      scale: 10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(".header .letters:last-child", {
      x: () => innerWidth * 3,
      scale: 10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".header",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(".img-holder", {
      rotation: 0,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      ease: "power2.inOut",
      scrollTrigger: {
        start: "top top",
        end: "+=100%",
        scrub: 1,
      },
    });

    gsap.to(".img-holder img", {
      scale: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: ".img-holder",
        start: "top top",
        end: `+=60%`,
        scrub: 1,
      },
    });

    return () => {
      window.removeEventListener("resize", updateBodyHeight);
    };
  }, []);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/userHomePage");
    }
  }, [navigate, userInfo]);

  return (
    <>
      <div className="header">
        <div className="letters">
          <div>M</div>
          <div>e</div>
          <div>r</div>
          <div>c</div>
          <div>e</div>
          <div>d</div>
        </div>
        <div className="letters">
          <div>e</div>
          <div>s</div>
          <div>-</div>
          <div>C</div>
          <div>A</div>
          <div>R</div>
          <div>E</div>
        </div>
      </div>

      <div className="website-content">
        <div className="img-holder">
          <img src={Hero} alt="hero img" />
        </div>

        <div className="content-holder">
          <About />
        </div>
      </div>
    </>
  );
};

export default Home;
