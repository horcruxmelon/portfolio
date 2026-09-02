"use client";

import { useState } from "react";
import Image from "next/image";
import { activities, type Activity } from "../data/activities";
import Reveal from "./Reveal";

function ActivityCard({ activity }: { activity: Activity }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`group relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl outline outline-1 outline-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#a855f7]/30 hover:outline-[#a855f7]/50 sm:h-48 ${activity.gradient}`}
    >
      {!imgError && (
        <Image
          src={activity.image}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
      <div className="relative flex h-full flex-col justify-end p-3 sm:p-5">
        <h3 className="text-sm font-bold text-white drop-shadow sm:text-lg">
          {activity.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/90 drop-shadow sm:text-sm">
          {activity.description}
        </p>
      </div>
    </div>
  );
}

export default function ActivitiesSection() {
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-10 sm:px-10">
      <Reveal>
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#c084fc] drop-shadow">
            02 — life
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white drop-shadow-lg sm:text-4xl">
            Beyond Code
          </h2>
          <p className="mt-1 text-white/70 drop-shadow">Marathons, and the NCC.</p>
        </div>
      </Reveal>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:gap-4">
        {activities.map((activity, i) => (
          <Reveal key={activity.title} delay={i * 80}>
            <ActivityCard activity={activity} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
