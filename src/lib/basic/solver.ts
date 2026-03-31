// src/lib/basic/solver.ts

import { Mode, EngineResponse } from "@/types/chat";

// -------------------------
// Extracted values map
// -------------------------

interface Values {
  [key: string]: number;
}

// -------------------------
// Helper: extract the first
// number matching a pattern
// -------------------------

function extractNum(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  if (!match) return null;
  const n = parseFloat(match[1]);
  return isNaN(n) ? null : n;
}

function inc(t: string, s: string): boolean {
  return t.includes(s);
}

// -------------------------
// Detect what the question
// is asking us to FIND
// (the unknown quantity)
// -------------------------

function detectUnknown(normalized: string): string | null {
  if (inc(normalized, "calculate the wavelength") || inc(normalized, "find the wavelength") || inc(normalized, "determine the wavelength")) return "wavelength";
  if (inc(normalized, "calculate the frequency") || inc(normalized, "find the frequency")) return "frequency";
  if (inc(normalized, "calculate the speed") || inc(normalized, "find the speed") || inc(normalized, "calculate the wave speed")) return "speed";
  if (inc(normalized, "calculate the force") || inc(normalized, "find the force")) return "force";
  if (inc(normalized, "calculate the acceleration") || inc(normalized, "find the acceleration")) return "acceleration";
  if (inc(normalized, "calculate the mass") || inc(normalized, "find the mass")) return "mass";
  if (inc(normalized, "calculate the pressure") || inc(normalized, "find the pressure")) return "pressure";
  if (inc(normalized, "calculate the density") || inc(normalized, "find the density")) return "density";
  if (inc(normalized, "calculate the volume") || inc(normalized, "find the volume")) return "volume";
  if (inc(normalized, "calculate the current") || inc(normalized, "find the current")) return "current";
  if (inc(normalized, "calculate the voltage") || inc(normalized, "find the voltage") || inc(normalized, "find the pd") || inc(normalized, "find the potential difference")) return "voltage";
  if (inc(normalized, "calculate the resistance") || inc(normalized, "find the resistance")) return "resistance";
  if (inc(normalized, "calculate the power") || inc(normalized, "find the power")) return "power";
  if (inc(normalized, "calculate the energy") || inc(normalized, "find the energy")) return "energy";
  if (inc(normalized, "calculate the kinetic energy") || inc(normalized, "find the kinetic energy") || inc(normalized, "find ke")) return "kinetic_energy";
  if (inc(normalized, "calculate the potential energy") || inc(normalized, "find the potential energy") || inc(normalized, "find pe") || inc(normalized, "find gpe")) return "potential_energy";
  if (inc(normalized, "calculate the momentum") || inc(normalized, "find the momentum")) return "momentum";
  if (inc(normalized, "calculate the efficiency") || inc(normalized, "find the efficiency")) return "efficiency";
  if (inc(normalized, "calculate the period") || inc(normalized, "find the period")) return "period";
  if (inc(normalized, "calculate the temperature") || inc(normalized, "find the temperature")) return "temperature";
  if (inc(normalized, "maximum efficiency") || inc(normalized, "carnot efficiency")) return "carnot_efficiency";
  if (inc(normalized, "maximum work") || inc(normalized, "work output")) return "work_output";
  if (inc(normalized, "calculate the wavelength") || inc(normalized, "find λ")) return "wavelength";
  if (inc(normalized, "calculate the profit") || inc(normalized, "find the profit")) return "profit";
  if (inc(normalized, "calculate the loss") || inc(normalized, "find the loss")) return "loss";
  if (inc(normalized, "calculate the interest") || inc(normalized, "find the interest")) return "interest";
  if (inc(normalized, "calculate the elasticity") || inc(normalized, "find elasticity")) return "elasticity";
  if (inc(normalized, "calculate the moles") || inc(normalized, "find the moles") || inc(normalized, "find moles")) return "moles";
  if (inc(normalized, "calculate the concentration") || inc(normalized, "find concentration")) return "concentration";
  if (inc(normalized, "calculate the ph") || inc(normalized, "find the ph")) return "ph";
  return null;
}

// -------------------------
// Context-aware value extraction
// Understands units AND nearby
// keywords to assign values
// correctly
// -------------------------

function extractValues(normalized: string, unknown: string | null): Values {
  const v: Values = {};

  // -------------------------------------------------------
  // SPEED / VELOCITY
  // Only extract as speed when NOT asking for speed
  // and context supports it
  // -------------------------------------------------------
  const speedMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*m\/s/) ??
    extractNum(normalized, /speed\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /velocity\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /travels?\s+at\s+(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /v\s*=\s*(\d+(?:\.\d+)?)/);
  if (speedMatch !== null && unknown !== "speed") {
    v.speed = speedMatch;
  }

  // -------------------------------------------------------
  // FREQUENCY — Hz
  // Only extract as frequency when NOT asking for frequency
  // -------------------------------------------------------
  const freqMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*khz/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*mhz/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*hz/) ??
    extractNum(normalized, /frequency\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /f\s*=\s*(\d+(?:\.\d+)?)/);
  if (freqMatch !== null && unknown !== "frequency") {
    if (inc(normalized, "khz")) v.frequency = freqMatch * 1000;
    else if (inc(normalized, "mhz")) v.frequency = freqMatch * 1_000_000;
    else v.frequency = freqMatch;
  }

  // -------------------------------------------------------
  // WAVELENGTH — m
  // Only extract as wavelength when NOT asking for wavelength
  // and context clearly says "wavelength" near the number
  // -------------------------------------------------------
  if (unknown !== "wavelength") {
    const wlMatch =
      extractNum(normalized, /wavelength\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
      extractNum(normalized, /λ\s*=\s*(\d+(?:\.\d+)?)/);
    if (wlMatch !== null) v.wavelength = wlMatch;
  }

  // -------------------------------------------------------
  // MASS — kg or g
  // -------------------------------------------------------
  const massMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*kg/) ??
    extractNum(normalized, /mass\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /a\s+(?:\w+\s+){0,3}of\s+(\d+(?:\.\d+)?)\s*kg/) ??
    extractNum(normalized, /m\s*=\s*(\d+(?:\.\d+)?)/);
  if (massMatch !== null && unknown !== "mass") v.mass = massMatch;

  // -------------------------------------------------------
  // TEMPERATURE — K or °C
  // Two temperature values (hot and cold reservoir)
  // -------------------------------------------------------
  const tempMatches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*k\b/g)];
  if (tempMatches.length >= 2) {
    v.Th = parseFloat(tempMatches[0][1]);
    v.Tc = parseFloat(tempMatches[1][1]);
  } else if (tempMatches.length === 1 && unknown !== "temperature") {
    v.temperature = parseFloat(tempMatches[0][1]);
  }

  const thMatch =
    extractNum(normalized, /hot\s+reservoir\s+(?:at|of|is)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /th\s*=\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /source\s+(?:at|of)?\s*(\d+(?:\.\d+)?)\s*k/);
  if (thMatch !== null) v.Th = thMatch;

  const tcMatch =
    extractNum(normalized, /cold\s+reservoir\s+(?:at|of|is)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /tc\s*=\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /sink\s+(?:at|of)?\s*(\d+(?:\.\d+)?)\s*k/);
  if (tcMatch !== null) v.Tc = tcMatch;

  // Celsius temperature
  const celsiusMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*°c/) ??
    extractNum(normalized, /temperature\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (celsiusMatch !== null && v.temperature === undefined) v.temperature = celsiusMatch;

  // -------------------------------------------------------
  // HEAT / ENERGY (Joules)
  // Two energy values (Qh and Qc for heat engines)
  // -------------------------------------------------------
  const jouleMatches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(?:kj|j\b)/g)];
  if (jouleMatches.length >= 2) {
    const vals = jouleMatches.map((m) => {
      const mult = normalized.slice(m.index!).startsWith(`${m[1]} kj`) ? 1000 : 1;
      return parseFloat(m[1]) * mult;
    });
    v.Qh = Math.max(...vals);
    v.Qc = Math.min(...vals);
  } else if (jouleMatches.length === 1) {
    const raw = parseFloat(jouleMatches[0][1]);
    const isKJ = normalized.slice(jouleMatches[0].index!).includes("kj");
    v.energy = raw * (isKJ ? 1000 : 1);
  }

  const qhMatch =
    extractNum(normalized, /receives?\s+(\d+(?:\.\d+)?)\s*(?:kj|j)/) ??
    extractNum(normalized, /qh\s*=\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /heat\s+(?:input|received|absorbed|supplied)\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (qhMatch !== null) v.Qh = qhMatch * (inc(normalized, "kj") ? 1000 : 1);

  const qcMatch =
    extractNum(normalized, /rejects?\s+(\d+(?:\.\d+)?)\s*(?:kj|j)/) ??
    extractNum(normalized, /qc\s*=\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /heat\s+(?:rejected|released|expelled)\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (qcMatch !== null) v.Qc = qcMatch * (inc(normalized, "kj") ? 1000 : 1);

  // -------------------------------------------------------
  // FORCE — N
  // -------------------------------------------------------
  const forceMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:kn|n)\b/) ??
    extractNum(normalized, /force\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /f\s*=\s*(\d+(?:\.\d+)?)/);
  if (forceMatch !== null && unknown !== "force") {
    v.force = inc(normalized, "kn") ? forceMatch * 1000 : forceMatch;
  }

  // -------------------------------------------------------
  // ACCELERATION — m/s²
  // -------------------------------------------------------
  const accMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*m\/s[²2]/) ??
    extractNum(normalized, /acceleration\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /a\s*=\s*(\d+(?:\.\d+)?)/);
  if (accMatch !== null && unknown !== "acceleration") v.acceleration = accMatch;

  // -------------------------------------------------------
  // VOLTAGE — V
  // -------------------------------------------------------
  const voltMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:kv|v)\b/) ??
    extractNum(normalized, /voltage\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /potential difference\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /v\s*=\s*(\d+(?:\.\d+)?)/);
  if (voltMatch !== null && unknown !== "voltage") v.voltage = voltMatch;

  // -------------------------------------------------------
  // CURRENT — A
  // -------------------------------------------------------
  const currMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:ma|a)\b/) ??
    extractNum(normalized, /current\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /i\s*=\s*(\d+(?:\.\d+)?)/);
  if (currMatch !== null && unknown !== "current") {
    v.current = inc(normalized, "ma") ? currMatch / 1000 : currMatch;
  }

  // -------------------------------------------------------
  // RESISTANCE — Ω
  // -------------------------------------------------------
  const resMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:kω|ω|ohm)/) ??
    extractNum(normalized, /resistance\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /r\s*=\s*(\d+(?:\.\d+)?)/);
  if (resMatch !== null && unknown !== "resistance") {
    v.resistance = inc(normalized, "kω") ? resMatch * 1000 : resMatch;
  }

  // -------------------------------------------------------
  // PRESSURE — Pa / kPa / atm
  // -------------------------------------------------------
  const pressMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*kpa/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*pa\b/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*atm/) ??
    extractNum(normalized, /pressure\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (pressMatch !== null && unknown !== "pressure") {
    if (inc(normalized, "kpa")) v.pressure = pressMatch * 1000;
    else if (inc(normalized, "atm")) v.pressure = pressMatch * 101325;
    else v.pressure = pressMatch;
  }

  // -------------------------------------------------------
  // VOLUME — m³ / L / mL
  // -------------------------------------------------------
  const volMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*m[³3]/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:ml|l)\b/) ??
    extractNum(normalized, /volume\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (volMatch !== null && unknown !== "volume") {
    if (inc(normalized, "ml")) v.volume = volMatch / 1000;
    else if (inc(normalized, " l ") || normalized.endsWith(" l")) v.volume = volMatch / 1000;
    else v.volume = volMatch;
  }

  // -------------------------------------------------------
  // DENSITY — kg/m³
  // -------------------------------------------------------
  const densMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*kg\/m/) ??
    extractNum(normalized, /density\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (densMatch !== null && unknown !== "density") v.density = densMatch;

  // -------------------------------------------------------
  // HEIGHT / DEPTH — m
  // -------------------------------------------------------
  const heightMatch =
    extractNum(normalized, /height\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /depth\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /h\s*=\s*(\d+(?:\.\d+)?)/);
  if (heightMatch !== null) v.height = heightMatch;

  // -------------------------------------------------------
  // TIME — s
  // -------------------------------------------------------
  const timeMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:ms|s)\b/) ??
    extractNum(normalized, /time\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /t\s*=\s*(\d+(?:\.\d+)?)/);
  if (timeMatch !== null) v.time = timeMatch;

  // -------------------------------------------------------
  // SPRING CONSTANT — N/m
  // -------------------------------------------------------
  const kMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*n\/m/) ??
    extractNum(normalized, /spring\s+constant\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /k\s*=\s*(\d+(?:\.\d+)?)/);
  if (kMatch !== null) v.springK = kMatch;

  // -------------------------------------------------------
  // EXTENSION — m or cm
  // -------------------------------------------------------
  const extMatch =
    extractNum(normalized, /extension\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /extended?\s+by\s+(\d+(?:\.\d+)?)/);
  if (extMatch !== null) {
    v.extension = inc(normalized, "cm") ? extMatch / 100 : extMatch;
  }

  // -------------------------------------------------------
  // CHARGE — C / μC / mC
  // -------------------------------------------------------
  const chargeMatches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(?:μc|mc|\bc\b)/g)];
  if (chargeMatches.length >= 2) {
    const vals = chargeMatches.map((m) => {
      const raw = parseFloat(m[1]);
      if (inc(m[0], "μc")) return raw * 1e-6;
      if (inc(m[0], "mc")) return raw * 1e-3;
      return raw;
    });
    v.q1 = vals[0];
    v.q2 = vals[1];
  } else if (chargeMatches.length === 1) {
    const raw = parseFloat(chargeMatches[0][1]);
    const c0 = chargeMatches[0][0];
    if (inc(c0, "μc")) v.charge = raw * 1e-6;
    else if (inc(c0, "mc")) v.charge = raw * 1e-3;
    else v.charge = raw;
  }

  // -------------------------------------------------------
  // DISTANCE / RADIUS — m
  // -------------------------------------------------------
  const distMatch =
    extractNum(normalized, /distance\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /radius\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /r\s*=\s*(\d+(?:\.\d+)?)/);
  if (distMatch !== null) v.distance = distMatch;

  // -------------------------------------------------------
  // FOCAL LENGTH — cm or m
  // -------------------------------------------------------
  const focalMatch =
    extractNum(normalized, /focal\s+length\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /f\s*=\s*(\d+(?:\.\d+)?)\s*cm/);
  if (focalMatch !== null) {
    v.focalLength = inc(normalized, "cm") ? focalMatch / 100 : focalMatch;
  }

  // -------------------------------------------------------
  // OBJECT DISTANCE — cm or m
  // -------------------------------------------------------
  const objMatch =
    extractNum(normalized, /object\s+(?:placed|is)?\s+(\d+(?:\.\d+)?)\s*cm/) ??
    extractNum(normalized, /object\s+distance\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (objMatch !== null) {
    v.objectDist = inc(normalized, "cm") ? objMatch / 100 : objMatch;
  }

  // -------------------------------------------------------
  // MOLES — mol
  // -------------------------------------------------------
  const molesMatch =
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*mol/) ??
    extractNum(normalized, /moles?\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /n\s*=\s*(\d+(?:\.\d+)?)/);
  if (molesMatch !== null && unknown !== "moles") v.moles = molesMatch;

  // -------------------------------------------------------
  // MOLAR MASS — g/mol
  // -------------------------------------------------------
  const molarMassMatch =
    extractNum(normalized, /molar\s+mass\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*g\/mol/);
  if (molarMassMatch !== null) v.molarMass = molarMassMatch;

  // -------------------------------------------------------
  // CONCENTRATION — mol/L or M
  // -------------------------------------------------------
  const concMatch =
    extractNum(normalized, /concentration\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*(?:mol\/l|mol\/dm|m\b)/);
  if (concMatch !== null && unknown !== "concentration") v.concentration = concMatch;

  // -------------------------------------------------------
  // pH
  // -------------------------------------------------------
  const phMatch = extractNum(normalized, /ph\s*=\s*(\d+(?:\.\d+)?)/);
  if (phMatch !== null) v.pH = phMatch;

  const hconcMatch = extractNum(normalized, /\[h\+\]\s*=\s*(\d+(?:\.\d+)?(?:\s*[×x]\s*10[-−]?\d+)?)/);
  if (hconcMatch !== null) v.Hconc = hconcMatch;

  // -------------------------------------------------------
  // ACCOUNTING / ECONOMICS
  // -------------------------------------------------------
  const costPriceMatch =
    extractNum(normalized, /cost\s+price\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /cp\s*=\s*(\d+(?:\.\d+)?)/);
  if (costPriceMatch !== null) v.costPrice = costPriceMatch;

  const sellingPriceMatch =
    extractNum(normalized, /selling\s+price\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /sp\s*=\s*(\d+(?:\.\d+)?)/);
  if (sellingPriceMatch !== null) v.sellingPrice = sellingPriceMatch;

  const principalMatch =
    extractNum(normalized, /principal\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /p\s*=\s*(\d+(?:\.\d+)?)(?=.*interest)/);
  if (principalMatch !== null) v.principal = principalMatch;

  const rateMatch =
    extractNum(normalized, /rate\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)\s*%/) ??
    extractNum(normalized, /(\d+(?:\.\d+)?)\s*%\s*(?:per|p\.a|annum)/);
  if (rateMatch !== null) v.rate = rateMatch / 100;

  const yearsMatch =
    extractNum(normalized, /(\d+)\s*years?/) ??
    extractNum(normalized, /for\s+(\d+)\s*years?/);
  if (yearsMatch !== null) v.years = yearsMatch;

  const qdMatch =
    extractNum(normalized, /quantity\s+demanded.*?(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /qd\s*=\s*(\d+(?:\.\d+)?)/);
  if (qdMatch !== null) v.qd = qdMatch;

  const qsMatch =
    extractNum(normalized, /quantity\s+supplied.*?(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /qs\s*=\s*(\d+(?:\.\d+)?)/);
  if (qsMatch !== null) v.qs = qsMatch;

  const priceMatch =
    extractNum(normalized, /price\s+(?:from|changes?\s+from)?\s*(\d+(?:\.\d+)?)/) ??
    extractNum(normalized, /p\s*=\s*(\d+(?:\.\d+)?)/);
  if (priceMatch !== null) v.price = priceMatch;

  // -------------------------------------------------------
  // DEFAULT g
  // -------------------------------------------------------
  if (inc(normalized, "g = 9.8") || inc(normalized, "g=9.8")) v.g = 9.8;
  else v.g = 10;

  return v;
}

// ============================================================
// PHYSICS SOLVERS
// ============================================================

function solveWave(v: Values, normalized: string, unknown: string | null): string | null {
  // Wavelength = v / f
  if (unknown === "wavelength" && v.speed !== undefined && v.frequency !== undefined) {
    const wl = v.speed / v.frequency;
    return `**Wave Calculation — Finding Wavelength**

**Given:**
- Speed (v) = ${v.speed} m/s
- Frequency (f) = ${v.frequency} Hz

**Formula:** v = fλ → λ = v / f

**Solution:**
λ = ${v.speed} / ${v.frequency}
λ = **${wl.toFixed(4)} m**

**Next step:** If the speed changes to 680 m/s with the same frequency, calculate the new wavelength.`;
  }

  // Speed = f × λ
  if (unknown === "speed" || (v.frequency !== undefined && v.wavelength !== undefined && unknown !== "wavelength")) {
    if (v.frequency !== undefined && v.wavelength !== undefined) {
      const spd = v.frequency * v.wavelength;
      return `**Wave Calculation — Finding Wave Speed**

**Given:**
- Frequency (f) = ${v.frequency} Hz
- Wavelength (λ) = ${v.wavelength} m

**Formula:** v = fλ

**Solution:**
v = ${v.frequency} × ${v.wavelength}
v = **${spd} m/s**

**Next step:** A sound wave in air has frequency 440 Hz. If the wave speed is 340 m/s, find the wavelength.`;
    }
  }

  // Frequency = v / λ
  if (unknown === "frequency" && v.speed !== undefined && v.wavelength !== undefined) {
    const f = v.speed / v.wavelength;
    return `**Wave Calculation — Finding Frequency**

**Given:**
- Speed (v) = ${v.speed} m/s
- Wavelength (λ) = ${v.wavelength} m

**Formula:** v = fλ → f = v / λ

**Solution:**
f = ${v.speed} / ${v.wavelength}
f = **${f.toFixed(2)} Hz**

**Next step:** Convert this frequency to kHz.`;
  }

  return null;
}

function solveHeatEngine(v: Values, normalized: string, unknown: string | null): string | null {
  const hasQh = v.Qh !== undefined;
  const hasTh = v.Th !== undefined;
  const hasTc = v.Tc !== undefined;
  const hasQc = v.Qc !== undefined;

  // Carnot efficiency
  if ((unknown === "carnot_efficiency" || unknown === "efficiency") && hasTh && hasTc) {
    const eta = (1 - v.Tc / v.Th) * 100;
    const work = hasQh ? v.Qh * (1 - v.Tc / v.Th) : null;
    return `**Heat Engine — Carnot Efficiency**

**Given:**
- Temperature of hot reservoir (Th) = ${v.Th} K
- Temperature of cold reservoir (Tc) = ${v.Tc} K${hasQh ? `\n- Heat input (Qh) = ${v.Qh} J` : ""}

**Formula:**
η = (1 − Tc/Th) × 100%

**Solution:**
η = (1 − ${v.Tc}/${v.Th}) × 100
η = (1 − ${(v.Tc / v.Th).toFixed(4)}) × 100
η = **${eta.toFixed(1)}%**${work !== null ? `

**Maximum work output:**
W = ηQh = ${eta.toFixed(1)}% × ${v.Qh} J = **${work.toFixed(1)} J**` : ""}

**Next step:** If the cold reservoir is cooled to 200 K (keeping Th = ${v.Th} K), find the new maximum efficiency.`;
  }

  // Actual efficiency from Qh and Qc
  if (hasQh && hasQc && (unknown === "efficiency" || unknown === "work_output")) {
    const W = v.Qh - v.Qc;
    const eta = (W / v.Qh) * 100;
    return `**Heat Engine — Efficiency and Work Output**

**Given:**
- Heat input (Qh) = ${v.Qh} J
- Heat rejected (Qc) = ${v.Qc} J

**Work output:** W = Qh − Qc = ${v.Qh} − ${v.Qc} = **${W} J**

**Thermal efficiency:**
η = W / Qh × 100 = ${W} / ${v.Qh} × 100 = **${eta.toFixed(1)}%**

**Next step:** Compare this efficiency with the Carnot efficiency for Th = ${v.Th ?? "?"} K and Tc = ${v.Tc ?? "?"} K.`;
  }

  return null;
}

function solveCoulomb(v: Values, normalized: string): string | null {
  if (v.q1 !== undefined && v.q2 !== undefined && v.distance !== undefined) {
    const k = 9e9;
    const F = k * v.q1 * v.q2 / (v.distance * v.distance);
    const sign = F > 0 ? "repulsive (like charges)" : "attractive (unlike charges)";
    return `**Electrostatics — Coulomb's Law**

**Given:**
- Charge q₁ = ${(v.q1 * 1e6).toFixed(2)} μC = ${v.q1} C
- Charge q₂ = ${(v.q2 * 1e6).toFixed(2)} μC = ${v.q2} C
- Distance r = ${v.distance} m

**Formula:** F = kq₁q₂ / r²
(k = 9 × 10⁹ Nm²/C²)

**Solution:**
F = (9 × 10⁹ × ${v.q1} × ${v.q2}) / (${v.distance})²
F = **${F.toExponential(3)} N**
Force is **${sign}**

**Next step:** If the distance between the charges is doubled, by what factor does the force change?`;
  }
  return null;
}

function solveKinematics(v: Values, unknown: string | null): string | null {
  const hasU = v.speed !== undefined;
  const hasA = v.acceleration !== undefined;
  const hasT = v.time !== undefined;
  const hasM = v.mass !== undefined;

  if (hasA && hasT) {
    const u = hasU ? v.speed! : 0;
    const finalV = u + v.acceleration! * v.time!;
    const s = u * v.time! + 0.5 * v.acceleration! * v.time! * v.time!;
    return `**Kinematics — SUVAT Equations**

**Given:**
- Initial velocity (u) = ${u} m/s${!hasU ? " (from rest)" : ""}
- Acceleration (a) = ${v.acceleration} m/s²
- Time (t) = ${v.time} s

**Final velocity:** v = u + at = ${u} + ${v.acceleration} × ${v.time} = **${finalV.toFixed(2)} m/s**

**Distance covered:** s = ut + ½at²
s = ${u} × ${v.time} + ½ × ${v.acceleration} × (${v.time})²
s = **${s.toFixed(2)} m**${hasM ? `

**Kinetic energy at final velocity:**
KE = ½mv² = ½ × ${v.mass} × (${finalV.toFixed(2)})² = **${(0.5 * v.mass! * finalV * finalV).toFixed(2)} J**` : ""}

**Next step:** Calculate the momentum of the object at the final velocity${hasM ? ` (mass = ${v.mass} kg)` : ""}.`;
  }
  return null;
}

function solveMechanics(v: Values, unknown: string | null, normalized: string): string | null {
  // Force = ma
  if (v.mass !== undefined && v.acceleration !== undefined && (unknown === "force" || unknown === null)) {
    const F = v.mass * v.acceleration;
    return `**Force — Newton's Second Law**

**Given:** m = ${v.mass} kg, a = ${v.acceleration} m/s²
**Formula:** F = ma
**Solution:** F = ${v.mass} × ${v.acceleration} = **${F} N**

**Next step:** If friction reduces the net force by 5 N, what is the new acceleration?`;
  }

  // Hooke's law
  if (v.springK !== undefined && v.extension !== undefined) {
    const F = v.springK * v.extension;
    const EPE = 0.5 * v.springK * v.extension * v.extension;
    return `**Hooke's Law**

**Given:** k = ${v.springK} N/m, e = ${v.extension} m
**Formula:** F = ke
**Solution:** F = ${v.springK} × ${v.extension} = **${F} N**

**Elastic PE stored:** EPE = ½ke² = ½ × ${v.springK} × (${v.extension})² = **${EPE.toFixed(4)} J**

**Next step:** If the extension is doubled, how does the stored energy change?`;
  }

  // Weight
  if (v.mass !== undefined && inc(normalized, "weight")) {
    const W = v.mass * v.g;
    return `**Weight Calculation**

**Given:** m = ${v.mass} kg, g = ${v.g} m/s²
**Formula:** W = mg
**Solution:** W = ${v.mass} × ${v.g} = **${W} N**

**Next step:** Calculate the mass of an object that weighs 500 N on Earth.`;
  }

  // Momentum
  if (v.mass !== undefined && v.speed !== undefined && (inc(normalized, "momentum") || unknown === "momentum")) {
    const p = v.mass * v.speed;
    return `**Momentum**

**Given:** m = ${v.mass} kg, v = ${v.speed} m/s
**Formula:** p = mv
**Solution:** p = ${v.mass} × ${v.speed} = **${p} kg·m/s**

**Next step:** If a ${v.mass * 2} kg object has the same momentum, what is its velocity?`;
  }

  // KE
  if (v.mass !== undefined && v.speed !== undefined && (inc(normalized, "kinetic") || unknown === "kinetic_energy")) {
    const KE = 0.5 * v.mass * v.speed * v.speed;
    return `**Kinetic Energy**

**Given:** m = ${v.mass} kg, v = ${v.speed} m/s
**Formula:** KE = ½mv²
**Solution:** KE = ½ × ${v.mass} × (${v.speed})² = **${KE} J**

**Next step:** If the speed is doubled, what happens to the kinetic energy?`;
  }

  // GPE
  if (v.mass !== undefined && v.height !== undefined && (inc(normalized, "potential") || inc(normalized, "gpe") || unknown === "potential_energy")) {
    const PE = v.mass * v.g * v.height;
    return `**Gravitational Potential Energy**

**Given:** m = ${v.mass} kg, h = ${v.height} m, g = ${v.g} m/s²
**Formula:** GPE = mgh
**Solution:** GPE = ${v.mass} × ${v.g} × ${v.height} = **${PE} J**

**Next step:** If the object falls from rest, find its speed just before hitting the ground.`;
  }

  return null;
}

function solveElectricity(v: Values, unknown: string | null): string | null {
  const hasV = v.voltage !== undefined;
  const hasI = v.current !== undefined;
  const hasR = v.resistance !== undefined;

  if (hasV && hasI && !hasR && unknown === "resistance") {
    const R = v.voltage! / v.current!;
    return `**Ohm's Law — Resistance**\n\n**Given:** V = ${v.voltage} V, I = ${v.current} A\n**Formula:** R = V/I\n**Solution:** R = ${v.voltage} / ${v.current} = **${R.toFixed(2)} Ω**\n\n**Next step:** Calculate the power dissipated using P = IV.`;
  }
  if (hasV && hasR && !hasI && unknown === "current") {
    const I = v.voltage! / v.resistance!;
    return `**Ohm's Law — Current**\n\n**Given:** V = ${v.voltage} V, R = ${v.resistance} Ω\n**Formula:** I = V/R\n**Solution:** I = ${v.voltage} / ${v.resistance} = **${I.toFixed(2)} A**\n\n**Next step:** Calculate the power consumed using P = IV.`;
  }
  if (hasI && hasR && !hasV && unknown === "voltage") {
    const V = v.current! * v.resistance!;
    return `**Ohm's Law — Voltage**\n\n**Given:** I = ${v.current} A, R = ${v.resistance} Ω\n**Formula:** V = IR\n**Solution:** V = ${v.current} × ${v.resistance} = **${V.toFixed(2)} V**\n\n**Next step:** If resistance doubles at same current, what happens to voltage?`;
  }
  if (hasV && hasI) {
    const P = v.voltage! * v.current!;
    return `**Electrical Power**\n\n**Given:** V = ${v.voltage} V, I = ${v.current} A\n**Formula:** P = IV\n**Solution:** P = ${v.current} × ${v.voltage} = **${P} W**\n\n**Next step:** How much energy does this device consume in 2 hours?`;
  }

  return null;
}

function solvePressure(v: Values, normalized: string): string | null {
  // Liquid pressure P = ρgh
  if (v.density !== undefined && v.height !== undefined && (inc(normalized, "liquid") || inc(normalized, "depth") || inc(normalized, "water") || inc(normalized, "fluid"))) {
    const P = v.density * v.g * v.height;
    return `**Liquid Pressure**\n\n**Given:** ρ = ${v.density} kg/m³, h = ${v.height} m, g = ${v.g} m/s²\n**Formula:** P = ρgh\n**Solution:** P = ${v.density} × ${v.g} × ${v.height} = **${P} Pa** (${(P / 1000).toFixed(2)} kPa)\n\n**Next step:** At what depth would this pressure double?`;
  }
  // Surface pressure P = F/A
  if (v.force !== undefined && v.distance !== undefined) {
    const area = Math.PI * v.distance * v.distance;
    const P = v.force / area;
    return `**Pressure (F/A)**\n\n**Given:** F = ${v.force} N, r = ${v.distance} m\n**Area:** A = πr² = ${area.toFixed(4)} m²\n**Formula:** P = F/A\n**Solution:** P = ${v.force} / ${area.toFixed(4)} = **${P.toFixed(2)} Pa**`;
  }
  return null;
}

function solveDensity(v: Values, unknown: string | null): string | null {
  if (v.mass !== undefined && v.volume !== undefined && unknown === "density") {
    const d = v.mass / v.volume;
    return `**Density**\n\n**Given:** m = ${v.mass} kg, V = ${v.volume} m³\n**Formula:** ρ = m/V\n**Solution:** ρ = ${v.mass} / ${v.volume} = **${d.toFixed(2)} kg/m³**\n\n**Next step:** Will this object float or sink in water (ρ_water = 1000 kg/m³)?`;
  }
  if (v.density !== undefined && v.volume !== undefined && unknown === "mass") {
    const m = v.density * v.volume;
    return `**Mass from Density**\n\n**Given:** ρ = ${v.density} kg/m³, V = ${v.volume} m³\n**Formula:** m = ρV\n**Solution:** m = ${v.density} × ${v.volume} = **${m.toFixed(2)} kg**`;
  }
  if (v.density !== undefined && v.mass !== undefined && unknown === "volume") {
    const vol = v.mass / v.density;
    return `**Volume from Density**\n\n**Given:** ρ = ${v.density} kg/m³, m = ${v.mass} kg\n**Formula:** V = m/ρ\n**Solution:** V = ${v.mass} / ${v.density} = **${vol.toFixed(4)} m³**`;
  }
  return null;
}

function solveOptics(v: Values, normalized: string): string | null {
  if (v.focalLength !== undefined && v.objectDist !== undefined) {
    const f = v.focalLength;
    const u = v.objectDist;
    const vImg = (f * u) / (u - f);
    const m = vImg / u;
    const isReal = vImg > 0;
    return `**Lens / Mirror Formula**

**Given:** f = ${(f * 100).toFixed(1)} cm, u = ${(u * 100).toFixed(1)} cm
**Formula:** 1/f = 1/u + 1/v → v = fu/(u−f)
**Solution:** v = (${f.toFixed(3)} × ${u.toFixed(3)}) / (${u.toFixed(3)} − ${f.toFixed(3)}) = **${(vImg * 100).toFixed(1)} cm**

**Image:** ${isReal ? "Real, inverted" : "Virtual, upright"}
**Magnification:** m = v/u = ${m.toFixed(2)}x (${Math.abs(m) > 1 ? "magnified" : "diminished"})

**Next step:** Describe the nature of the image formed.`;
  }
  return null;
}

function solveGasLaw(v: Values, normalized: string): string | null {
  if (inc(normalized, "boyle") || (v.pressure !== undefined && v.volume !== undefined)) {
    if (v.pressure !== undefined && v.volume !== undefined) {
      const product = v.pressure * v.volume;
      return `**Boyle's Law**

**Given:** P₁ = ${v.pressure} Pa, V₁ = ${v.volume} m³ (at constant temperature)
**Formula:** P₁V₁ = P₂V₂
**P₁V₁ = ${product.toExponential(3)}**

Provide P₂ or V₂ to find the other quantity.

**Example:** If P₂ = ${v.pressure * 2} Pa → V₂ = ${(product / (v.pressure * 2)).toFixed(4)} m³

**Next step:** A gas at 100 kPa occupies 2 L. Find its volume at 200 kPa (constant temperature).`;
    }
  }
  return null;
}

// ============================================================
// CHEMISTRY SOLVERS
// ============================================================

function solveChemistry(v: Values, normalized: string, unknown: string | null): string | null {
  // Moles = mass / molar mass
  if (v.mass !== undefined && v.molarMass !== undefined && (unknown === "moles" || inc(normalized, "moles"))) {
    const moles = (v.mass * 1000) / v.molarMass;
    return `**Moles Calculation**

**Given:** mass = ${v.mass} kg = ${v.mass * 1000} g, Molar mass = ${v.molarMass} g/mol
**Formula:** n = m / M
**Solution:** n = ${v.mass * 1000} / ${v.molarMass} = **${moles.toFixed(3)} mol**

**Next step:** How many molecules is this? (Multiply by Avogadro's number: 6.022 × 10²³)`;
  }

  // Concentration = moles / volume
  if (v.moles !== undefined && v.volume !== undefined && (unknown === "concentration" || inc(normalized, "concentration"))) {
    const c = v.moles / (v.volume * 1000);
    return `**Concentration**

**Given:** n = ${v.moles} mol, V = ${v.volume * 1000} L
**Formula:** C = n / V
**Solution:** C = ${v.moles} / ${v.volume * 1000} = **${c.toFixed(3)} mol/L**

**Next step:** Calculate the mass of solute needed to make 500 mL of this solution.`;
  }

  // pH = -log[H+]
  if (v.Hconc !== undefined && unknown === "ph") {
    const pH = -Math.log10(v.Hconc);
    return `**pH Calculation**

**Given:** [H⁺] = ${v.Hconc} mol/L
**Formula:** pH = −log₁₀[H⁺]
**Solution:** pH = −log₁₀(${v.Hconc}) = **${pH.toFixed(2)}**

**Classification:** ${pH < 7 ? "Acidic" : pH > 7 ? "Alkaline/Basic" : "Neutral"}

**Next step:** Calculate [OH⁻] using Kw = [H⁺][OH⁻] = 1 × 10⁻¹⁴`;
  }

  return null;
}

// ============================================================
// MATHEMATICS SOLVERS
// ============================================================

function solveMathematics(v: Values, normalized: string): string | null {
  // Compound interest
  if (v.principal !== undefined && v.rate !== undefined && v.years !== undefined) {
    if (inc(normalized, "compound")) {
      const amount = v.principal * Math.pow(1 + v.rate, v.years);
      const interest = amount - v.principal;
      return `**Compound Interest**

**Given:** P = ${v.principal}, r = ${(v.rate * 100).toFixed(1)}%, n = ${v.years} years
**Formula:** A = P(1 + r)ⁿ
**Solution:** A = ${v.principal} × (1 + ${v.rate})^${v.years} = **${amount.toFixed(2)}**

**Total Interest = A − P = ${amount.toFixed(2)} − ${v.principal} = **${interest.toFixed(2)}**

**Next step:** Compare this with simple interest for the same values.`;
    }

    // Simple interest
    if (inc(normalized, "simple")) {
      const I = v.principal * v.rate * v.years;
      const A = v.principal + I;
      return `**Simple Interest**

**Given:** P = ${v.principal}, R = ${(v.rate * 100).toFixed(1)}%, T = ${v.years} years
**Formula:** I = PRT
**Solution:** I = ${v.principal} × ${v.rate} × ${v.years} = **${I.toFixed(2)}**

**Total Amount = P + I = ${v.principal} + ${I.toFixed(2)} = **${A.toFixed(2)}**`;
    }
  }

  // Pythagoras
  const aMatch = extractNum(normalized, /a\s*=\s*(\d+(?:\.\d+)?)/);
  const bMatch = extractNum(normalized, /b\s*=\s*(\d+(?:\.\d+)?)/);
  if ((inc(normalized, "pythagoras") || inc(normalized, "hypotenuse")) && aMatch !== null && bMatch !== null) {
    const c = Math.sqrt(aMatch * aMatch + bMatch * bMatch);
    return `**Pythagoras' Theorem**

**Given:** a = ${aMatch}, b = ${bMatch}
**Formula:** c² = a² + b²
**Solution:** c = √(${aMatch}² + ${bMatch}²) = √(${aMatch * aMatch + bMatch * bMatch}) = **${c.toFixed(3)}**`;
  }

  // Percentage change
  const oldVal = extractNum(normalized, /(?:from|was)\s+(\d+(?:\.\d+)?)/);
  const newVal = extractNum(normalized, /(?:to|became?|is now)\s+(\d+(?:\.\d+)?)/);
  if ((inc(normalized, "percentage change") || inc(normalized, "percent change")) && oldVal !== null && newVal !== null) {
    const pct = ((newVal - oldVal) / oldVal) * 100;
    return `**Percentage Change**

**Given:** Old value = ${oldVal}, New value = ${newVal}
**Formula:** % change = (New − Old) / Old × 100
**Solution:** % change = (${newVal} − ${oldVal}) / ${oldVal} × 100 = **${pct.toFixed(2)}%** ${pct > 0 ? "(increase)" : "(decrease)"}`;
  }

  return null;
}

// ============================================================
// ACCOUNTING SOLVERS
// ============================================================

function solveAccounting(v: Values, normalized: string, unknown: string | null): string | null {
  if (v.costPrice !== undefined && v.sellingPrice !== undefined) {
    if (v.sellingPrice > v.costPrice) {
      const profit = v.sellingPrice - v.costPrice;
      const markup = (profit / v.costPrice) * 100;
      const margin = (profit / v.sellingPrice) * 100;
      return `**Profit Calculation**

**Given:** Cost Price = ${v.costPrice}, Selling Price = ${v.sellingPrice}
**Profit = SP − CP = ${v.sellingPrice} − ${v.costPrice} = **${profit.toFixed(2)}**

**Percentage Markup (on cost):** ${markup.toFixed(2)}%
**Gross Profit Margin (on sales):** ${margin.toFixed(2)}%

**Next step:** Calculate the breakeven point if fixed costs are 500 units.`;
    } else {
      const loss = v.costPrice - v.sellingPrice;
      const lossPct = (loss / v.costPrice) * 100;
      return `**Loss Calculation**

**Given:** Cost Price = ${v.costPrice}, Selling Price = ${v.sellingPrice}
**Loss = CP − SP = ${v.costPrice} − ${v.sellingPrice} = **${loss.toFixed(2)}**

**Percentage Loss:** ${lossPct.toFixed(2)}%

**Next step:** What selling price would give a 20% profit on cost price?`;
    }
  }

  return null;
}

// ============================================================
// ECONOMICS SOLVERS
// ============================================================

function solveEconomics(v: Values, normalized: string): string | null {
  // Price elasticity of demand
  if (v.qd !== undefined && v.price !== undefined && inc(normalized, "elasticity")) {
    return `**Price Elasticity of Demand**

**Formula:** PED = (% change in Qd) / (% change in Price)

Provide the change in quantity demanded and change in price to calculate elasticity.

**Example interpretation:**
- |PED| > 1: Elastic (consumers sensitive to price)
- |PED| = 1: Unitary elastic
- |PED| < 1: Inelastic (consumers not sensitive)

**Next step:** If price rises by 10% and quantity demanded falls from ${v.qd} to ${Math.round(v.qd * 0.88)}, calculate PED.`;
  }

  return null;
}

// ============================================================
// MAIN ROUTER
// ============================================================

export async function runSolver(
  query: string,
  mode: Mode
): Promise<EngineResponse> {
  const normalized = query.trim().toLowerCase();
  const unknown = detectUnknown(normalized);
  const v = extractValues(normalized, unknown);

  console.log(`[NIRA SOLVER] Unknown: ${unknown ?? "auto"}`);
  console.log("[NIRA SOLVER] Extracted values:", JSON.stringify(v));

  const attempts: Array<() => string | null> = [
    () => solveHeatEngine(v, normalized, unknown),
    () => solveWave(v, normalized, unknown),
    () => solveCoulomb(v, normalized),
    () => solveChemistry(v, normalized, unknown),
    () => solveMathematics(v, normalized),
    () => solveAccounting(v, normalized, unknown),
    () => solveEconomics(v, normalized),
    () => solveOptics(v, normalized),
    () => solveGasLaw(v, normalized),
    () => solvePressure(v, normalized),
    () => solveDensity(v, unknown),
    () => solveMechanics(v, unknown, normalized),
    () => solveElectricity(v, unknown),
    () => solveKinematics(v, unknown),
  ];

  for (const attempt of attempts) {
    const result = attempt();
    if (result) {
      return { content: result, source: "knowledge_base", mode, cached: false };
    }
  }

  // Structured guide fallback
  const content = buildCalculationGuide(normalized);
  return { content, source: "knowledge_base", mode, cached: false };
}

function buildCalculationGuide(normalized: string): string {
  if (inc(normalized, "wave") || inc(normalized, "frequency") || inc(normalized, "wavelength")) {
    return `**Wave Calculations — Formula Guide**

**Wave equation:** v = fλ
- v = wave speed (m/s)
- f = frequency (Hz)
- λ = wavelength (m)

**Rearrangements:**
- To find speed: v = f × λ
- To find frequency: f = v / λ
- To find wavelength: λ = v / f

**Next step:** Share the specific values in your question so I can solve it fully.`;
  }

  if (inc(normalized, "heat engine") || inc(normalized, "carnot") || inc(normalized, "reservoir")) {
    return `**Heat Engine — Formula Guide**

**Carnot efficiency:** η = (1 − Tc/Th) × 100%
**Actual efficiency:** η = W/Qh × 100%
**Work output:** W = Qh − Qc

All temperatures must be in Kelvin (K = °C + 273)

**Next step:** Share the values of Th, Tc, and Qh so I can solve it fully.`;
  }

  if (inc(normalized, "electrostatic") || inc(normalized, "coulomb") || inc(normalized, "charge")) {
    return `**Coulomb's Law — Formula Guide**

**F = kq₁q₂ / r²**
- k = 9 × 10⁹ Nm²/C²
- q₁, q₂ = charges in Coulombs
- r = distance in metres

Charges: 1 μC = 1 × 10⁻⁶ C, 1 mC = 1 × 10⁻³ C

**Next step:** Share the charge values and distance so I can calculate the force.`;
  }

  return `To solve this calculation, I need the specific values from your question.

**General approach for any calculation:**
1. Write down all given values with units
2. Identify the unknown quantity
3. Select the correct formula
4. Substitute and solve
5. State the answer with the correct unit

**Next step:** Share the complete question with all values and I will solve it step by step.`;
}
