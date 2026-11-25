import * as React from "react";
import { ShieldCheck, Wind, Droplets, Layers } from "lucide-react";

export function TechnicalAnatomySection() {
  const specs = [
    {
      icon: Layers,
      code: "SPEC 01",
      title: "850+ Fill Power RDS Down",
      metric: "90/10 Loft Ratio",
      description: "Ethically harvested goose down with highest warmth-to-weight loft. Micro-clusters trap air pockets to create an impenetrable thermal barrier down to -35°C.",
    },
    {
      icon: Droplets,
      code: "SPEC 02",
      title: "20,000mm Toray Membrane",
      metric: "Non-PFC DWR Finish",
      description: "Micro-porous Japanese outer shell engineered in Fukui. Completely repels freezing rain, blowing powder, and sleet while allowing body vapor to escape.",
    },
    {
      icon: Wind,
      code: "SPEC 03",
      title: "Ultrasonic Welded Baffles",
      metric: "Zero Stitch Holes",
      description: "Eliminates needle punctures through precision heat-welding. Prevents down migration, wind penetration, and seam-bridge cold spots.",
    },
    {
      icon: ShieldCheck,
      code: "SPEC 04",
      title: "Vibram Arctic Grip",
      metric: "Wet-Ice Friction",
      description: "Advanced polymer compound formulated specifically for wet black ice and frozen cobblestones, providing confident footing in severe sub-zero conditions.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAFBFD] border-y border-[#EAEAEA] text-[#111]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3 mb-16">
          <span className="text-2xs font-mono uppercase tracking-[0.24em] text-[#888] block">
            Cold Science & Material Discipline
          </span>
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-[#111] uppercase leading-tight">
            Engineering Sub-Zero Equilibrium
          </h2>
          <p className="text-xs sm:text-sm text-[#666] leading-relaxed">
            Every garment in the archival collection is constructed as a closed thermal system, 
            combining natural insulating down with advanced Japanese waterproof textiles.
          </p>
        </div>

        {/* 4 Technical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {specs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.code}
                className="bg-white border border-[#EAEAEA] p-7 flex flex-col justify-between space-y-6 hover:border-[#111] transition-all duration-300 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-4">
                    <Icon className="h-6 w-6 text-[#111] stroke-[1.5]" />
                    <span className="font-mono text-2xs text-[#888] tracking-widest">{item.code}</span>
                  </div>

                  <div>
                    <h3 className="font-sans text-base font-bold text-[#111] uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-[#2B3D2E] font-semibold block mt-1">
                      {item.metric}
                    </span>
                  </div>

                  <p className="text-xs text-[#666] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0F0F0] text-[0.65rem] font-mono uppercase tracking-widest text-[#999]">
                  Certified Testing Protocol
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
