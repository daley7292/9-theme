"use client";

import {
  MorphBotBackground,
  MorphTopBackground,
} from "@/components/morphBackground";
import { Hero } from "@/components/mainpage/hero";
import { Features } from "@/components/mainpage/features";
import { Bento } from "@/components/mainpage/bento";

export default function Home() {
  return (
    <>
      <MorphTopBackground />
      <MorphBotBackground />
      <Hero />
      <Features />
      <Bento />
    </>
  );
}
