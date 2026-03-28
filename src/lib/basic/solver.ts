// src/lib/basic/solver.ts
// Handles calculation-type questions.
// Parses physics and maths problems,
// extracts values, solves step by step,
// and returns a worked answer.

import { Mode, EngineResponse } from "@/types/chat";

// -------------------------
// Solver result
// -------------------------

export interface SolverResult {
  solved: boolean;
  content: string;
}

// -------------------------
// Value extraction helpers
// Extracts numeric values + units
// from a natural language query
// -------------------------

interface ExtractedValues {
  [key: string]: number;
}

function extractNumber(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  if (!match) return null;
  const num = parseFloat(match[1]);
  return isNaN(num) ? null : num;
}

function extractValues(normalized: string): ExtractedValues {
  const values: ExtractedValues = {};

  // Frequency — Hz
  const freq =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*(?:hz|khz|mhz)/) ??
    extractNumber(normalized, /frequency\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /f\s*=\s*(\d+(?:\.\d+)?)/);
  if (freq !== null) {
    // Convert kHz and MHz
    if (normalized.includes("khz")) values.frequency = freq * 1000;
    else if (normalized.includes("mhz")) values.frequency = freq * 1_000_000;
    else values.frequency = freq;
  }

  // Wavelength — m
  const wl =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*m\b/) ??
    extractNumber(normalized, /wavelength\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /λ\s*=\s*(\d+(?:\.\d+)?)/);
  if (wl !== null) values.wavelength = wl;

  // Mass — kg
  const mass =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*kg/) ??
    extractNumber(normalized, /mass\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /m\s*=\s*(\d+(?:\.\d+)?)/);
  if (mass !== null) values.mass = mass;

  // Velocity / speed — m/s
  const vel =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*m\/s/) ??
    extractNumber(normalized, /(?:velocity|speed)\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /u\s*=\s*(\d+(?:\.\d+)?)/);
  if (vel !== null) values.velocity = vel;

  // Force — N
  const force =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*n\b/) ??
    extractNumber(normalized, /force\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /f\s*=\s*(\d+(?:\.\d+)?)/);
  if (force !== null && values.force === undefined) values.force = force;

  // Area — m²
  const area =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*m[²2]/) ??
    extractNumber(normalized, /area\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (area !== null) values.area = area;

  // Volume — m³ or L
  const vol =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*(?:m[³3]|litre|liter|l\b)/) ??
    extractNumber(normalized, /volume\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (vol !== null) values.volume = vol;

  // Density — kg/m³
  const dens =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*kg\/m/) ??
    extractNumber(normalized, /density\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (dens !== null) values.density = dens;

  // Height — m
  const height =
    extractNumber(normalized, /height\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /h\s*=\s*(\d+(?:\.\d+)?)/);
  if (height !== null) values.height = height;

  // Time — s
  const time =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*s\b/) ??
    extractNumber(normalized, /time\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /t\s*=\s*(\d+(?:\.\d+)?)/);
  if (time !== null) values.time = time;

  // Current — A
  const current =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*a\b/) ??
    extractNumber(normalized, /current\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /i\s*=\s*(\d+(?:\.\d+)?)/);
  if (current !== null) values.current = current;

  // Voltage — V
  const voltage =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*v\b/) ??
    extractNumber(normalized, /voltage\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /v\s*=\s*(\d+(?:\.\d+)?)/);
  if (voltage !== null) values.voltage = voltage;

  // Resistance — Ω
  const resistance =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*(?:ohm|ω|Ω)/) ??
    extractNumber(normalized, /resistance\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /r\s*=\s*(\d+(?:\.\d+)?)/);
  if (resistance !== null) values.resistance = resistance;

  // Spring constant — N/m
  const springK =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*n\/m/) ??
    extractNumber(normalized, /(?:spring constant|k)\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (springK !== null) values.springConstant = springK;

  // Extension — m
  const ext =
    extractNumber(normalized, /extension\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /extended?\s+by\s+(\d+(?:\.\d+)?)/);
  if (ext !== null) values.extension = ext;

  // Acceleration — m/s²
  const acc =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*m\/s[²2]/) ??
    extractNumber(normalized, /acceleration\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /a\s*=\s*(\d+(?:\.\d+)?)/);
  if (acc !== null) values.acceleration = acc;

  // Gravity constant g
  if (
    normalized.includes("g = 10") ||
    normalized.includes("g=10")
  ) values.g = 10;
  else if (
    normalized.includes("g = 9.8") ||
    normalized.includes("g=9.8")
  ) values.g = 9.8;
  else values.g = 10; // default

  // Distance — m
  const dist =
    extractNumber(normalized, /distance\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /d\s*=\s*(\d+(?:\.\d+)?)/);
  if (dist !== null) values.distance = dist;

  // Radius — m
  const radius =
    extractNumber(normalized, /radius\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/) ??
    extractNumber(normalized, /r\s*=\s*(\d+(?:\.\d+)?)/);
  if (radius !== null && values.radius === undefined) values.radius = radius;

  // Temperature — °C or K
  const temp =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*°?c\b/) ??
    extractNumber(normalized, /temperature\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (temp !== null) values.temperature = temp;

  // Pressure — Pa or kPa
  const pressure =
    extractNumber(normalized, /(\d+(?:\.\d+)?)\s*(?:pa|kpa)/) ??
    extractNumber(normalized, /pressure\s+(?:of|is|=)?\s*(\d+(?:\.\d+)?)/);
  if (pressure !== null) {
    values.pressure = normalized.includes("kpa") ? pressure * 1000 : pressure;
  }

  return values;
}

// -------------------------
// Individual solvers
// Each returns a worked solution
// or null if values are missing
// -------------------------

function solveWaveSpeed(v: ExtractedValues, query: string): string | null {
  if (v.frequency === undefined || v.wavelength === undefined) return null;
  const speed = v.frequency * v.wavelength;
  return `**Wave Speed Calculation**

**Given:**
- Frequency (f) = ${v.frequency} Hz
- Wavelength (λ) = ${v.wavelength} m

**Formula:**
v = f × λ

**Solution:**
v = ${v.frequency} × ${v.wavelength}
v = **${speed} m/s**

**Next step:** A sound wave travels at 340 m/s. If its frequency is 170 Hz, calculate its wavelength.`;
}

function solveForce(v: ExtractedValues, query: string): string | null {
  if (v.mass === undefined || v.acceleration === undefined) return null;
  const force = v.mass * v.acceleration;
  return `**Force Calculation (Newton's Second Law)**

**Given:**
- Mass (m) = ${v.mass} kg
- Acceleration (a) = ${v.acceleration} m/s²

**Formula:**
F = ma

**Solution:**
F = ${v.mass} × ${v.acceleration}
F = **${force} N**

**Next step:** If a 5 kg object decelerates from 20 m/s to rest in 4 s, find the braking force applied.`;
}

function solvePressure(v: ExtractedValues, query: string): string | null {
  if (v.force === undefined || v.area === undefined) return null;
  const pressure = v.force / v.area;
  return `**Pressure Calculation**

**Given:**
- Force (F) = ${v.force} N
- Area (A) = ${v.area} m²

**Formula:**
P = F / A

**Solution:**
P = ${v.force} / ${v.area}
P = **${pressure.toFixed(2)} Pa**

**Next step:** A hydraulic press has an input area of 0.01 m² and an output area of 0.5 m². If an input force of 100 N is applied, find the output force.`;
}

function solveDensity(v: ExtractedValues, query: string): string | null {
  // Solve for density if mass and volume given
  if (v.mass !== undefined && v.volume !== undefined) {
    const density = v.mass / v.volume;
    return `**Density Calculation**

**Given:**
- Mass (m) = ${v.mass} kg
- Volume (V) = ${v.volume} m³

**Formula:**
ρ = m / V

**Solution:**
ρ = ${v.mass} / ${v.volume}
ρ = **${density.toFixed(2)} kg/m³**

**Next step:** A block displaces 0.002 m³ of water and has a mass of 1.6 kg. Calculate its density and state whether it will float.`;
  }
  // Solve for mass if density and volume given
  if (v.density !== undefined && v.volume !== undefined) {
    const mass = v.density * v.volume;
    return `**Mass from Density Calculation**

**Given:**
- Density (ρ) = ${v.density} kg/m³
- Volume (V) = ${v.volume} m³

**Formula:**
m = ρ × V

**Solution:**
m = ${v.density} × ${v.volume}
m = **${mass.toFixed(2)} kg**

**Next step:** Calculate the volume occupied by 500 kg of oil with density 800 kg/m³.`;
  }
  return null;
}

function solveKineticEnergy(v: ExtractedValues, query: string): string | null {
  if (v.mass === undefined || v.velocity === undefined) return null;
  const ke = 0.5 * v.mass * v.velocity * v.velocity;
  return `**Kinetic Energy Calculation**

**Given:**
- Mass (m) = ${v.mass} kg
- Velocity (v) = ${v.velocity} m/s

**Formula:**
KE = ½mv²

**Solution:**
KE = ½ × ${v.mass} × (${v.velocity})²
KE = ½ × ${v.mass} × ${v.velocity * v.velocity}
KE = **${ke} J**

**Next step:** If the same object's speed doubles, calculate the new kinetic energy and compare it with the original.`;
}

function solvePotentialEnergy(v: ExtractedValues, query: string): string | null {
  if (v.mass === undefined || v.height === undefined) return null;
  const g = v.g ?? 10;
  const pe = v.mass * g * v.height;
  return `**Gravitational Potential Energy Calculation**

**Given:**
- Mass (m) = ${v.mass} kg
- Height (h) = ${v.height} m
- g = ${g} m/s²

**Formula:**
PE = mgh

**Solution:**
PE = ${v.mass} × ${g} × ${v.height}
PE = **${pe} J**

**Next step:** If the object falls from rest, calculate its velocity just before hitting the ground using energy conservation.`;
}

function solveOhmsLaw(v: ExtractedValues, query: string): string | null {
  const hasV = v.voltage !== undefined;
  const hasI = v.current !== undefined;
  const hasR = v.resistance !== undefined;

  if (hasV && hasI && !hasR) {
    const R = v.voltage! / v.current!;
    return `**Resistance Calculation (Ohm's Law)**

**Given:**
- Voltage (V) = ${v.voltage} V
- Current (I) = ${v.current} A

**Formula:**
R = V / I

**Solution:**
R = ${v.voltage} / ${v.current}
R = **${R.toFixed(2)} Ω**

**Next step:** Calculate the power dissipated in this resistor using P = IV.`;
  }

  if (hasV && hasR && !hasI) {
    const I = v.voltage! / v.resistance!;
    return `**Current Calculation (Ohm's Law)**

**Given:**
- Voltage (V) = ${v.voltage} V
- Resistance (R) = ${v.resistance} Ω

**Formula:**
I = V / R

**Solution:**
I = ${v.voltage} / ${v.resistance}
I = **${I.toFixed(2)} A**

**Next step:** Calculate the power consumed using P = IV.`;
  }

  if (hasI && hasR && !hasV) {
    const V = v.current! * v.resistance!;
    return `**Voltage Calculation (Ohm's Law)**

**Given:**
- Current (I) = ${v.current} A
- Resistance (R) = ${v.resistance} Ω

**Formula:**
V = IR

**Solution:**
V = ${v.current} × ${v.resistance}
V = **${V.toFixed(2)} V**

**Next step:** If the resistance is doubled while current remains the same, what happens to the voltage?`;
  }

  return null;
}

function solveElectricalPower(v: ExtractedValues, query: string): string | null {
  if (v.current !== undefined && v.voltage !== undefined) {
    const power = v.current * v.voltage;
    return `**Electrical Power Calculation**

**Given:**
- Current (I) = ${v.current} A
- Voltage (V) = ${v.voltage} V

**Formula:**
P = IV

**Solution:**
P = ${v.current} × ${v.voltage}
P = **${power} W**

**Next step:** Calculate the energy consumed if this device runs for 3 hours. Give your answer in both joules and kWh.`;
  }
  return null;
}

function solveHookesLaw(v: ExtractedValues, query: string): string | null {
  if (v.springConstant !== undefined && v.extension !== undefined) {
    const force = v.springConstant * v.extension;
    const pe = 0.5 * v.springConstant * v.extension * v.extension;
    return `**Hooke's Law Calculation**

**Given:**
- Spring constant (k) = ${v.springConstant} N/m
- Extension (e) = ${v.extension} m

**Formula:**
F = ke

**Solution:**
F = ${v.springConstant} × ${v.extension}
F = **${force} N**

**Elastic potential energy stored:**
EPE = ½ke² = ½ × ${v.springConstant} × (${v.extension})²
EPE = **${pe} J**

**Next step:** If the extension is doubled, how does the force and stored energy change?`;
  }
  return null;
}

function solveMomentum(v: ExtractedValues, query: string): string | null {
  if (v.mass !== undefined && v.velocity !== undefined) {
    const p = v.mass * v.velocity;
    return `**Momentum Calculation**

**Given:**
- Mass (m) = ${v.mass} kg
- Velocity (v) = ${v.velocity} m/s

**Formula:**
p = mv

**Solution:**
p = ${v.mass} × ${v.velocity}
p = **${p} kg·m/s**

**Next step:** If this object collides and sticks to a stationary ${v.mass * 2} kg object, calculate the common velocity after impact.`;
  }
  return null;
}

function solveLiquidPressure(v: ExtractedValues, query: string): string | null {
  // P = ρgh
  if (v.density !== undefined && v.height !== undefined) {
    const g = v.g ?? 10;
    const pressure = v.density * g * v.height;
    return `**Liquid Pressure Calculation**

**Given:**
- Density (ρ) = ${v.density} kg/m³
- Depth (h) = ${v.height} m
- g = ${g} m/s²

**Formula:**
P = ρgh

**Solution:**
P = ${v.density} × ${g} × ${v.height}
P = **${pressure} Pa** (${(pressure / 1000).toFixed(2)} kPa)

**Next step:** At what depth would the pressure be double this value?`;
  }
  return null;
}

function solveVelocityFromSUVAT(v: ExtractedValues, query: string): string | null {
  // v = u + at
  const hasU = v.velocity !== undefined;
  const hasA = v.acceleration !== undefined;
  const hasT = v.time !== undefined;

  if (hasA && hasT) {
    const u = hasU ? v.velocity! : 0;
    const finalV = u + v.acceleration! * v.time!;
    const s = u * v.time! + 0.5 * v.acceleration! * v.time! * v.time!;
    return `**Kinematics Calculation (SUVAT)**

**Given:**
- Initial velocity (u) = ${u} m/s ${!hasU ? "(from rest)" : ""}
- Acceleration (a) = ${v.acceleration} m/s²
- Time (t) = ${v.time} s

**Finding final velocity:**
v = u + at
v = ${u} + ${v.acceleration} × ${v.time}
v = **${finalV.toFixed(2)} m/s**

**Finding distance:**
s = ut + ½at²
s = ${u} × ${v.time} + ½ × ${v.acceleration} × (${v.time})²
s = **${s.toFixed(2)} m**

**Next step:** Calculate the kinetic energy of this object at the final velocity if the mass is 2 kg.`;
  }
  return null;
}

function solvePendulumPeriod(v: ExtractedValues, query: string): string | null {
  // T = 2π√(l/g)
  if (
    normalized_includes_any(query, ["pendulum", "period of", "time for"]) &&
    v.distance !== undefined
  ) {
    const g = v.g ?? 10;
    const T = 2 * Math.PI * Math.sqrt(v.distance / g);
    return `**Simple Pendulum Period Calculation**

**Given:**
- Length (l) = ${v.distance} m
- g = ${g} m/s²

**Formula:**
T = 2π√(l/g)

**Solution:**
T = 2π × √(${v.distance} / ${g})
T = 2π × √(${(v.distance / g).toFixed(4)})
T = 2π × ${Math.sqrt(v.distance / g).toFixed(4)}
T = **${T.toFixed(2)} s**

**Next step:** If the length is quadrupled, how does the period change? Explain why mass has no effect on the period.`;
  }
  return null;
}

function normalized_includes_any(text: string, keywords: string[]): boolean {
  const n = text.toLowerCase();
  return keywords.some((k) => n.includes(k));
}

function solveIdealGas(v: ExtractedValues, query: string): string | null {
  // P1V1/T1 = P2V2/T2
  if (
    normalized_includes_any(query, ["gas", "boyle", "charles", "pressure law"]) &&
    v.pressure !== undefined &&
    v.volume !== undefined &&
    v.temperature !== undefined
  ) {
    const T1K = v.temperature + 273;
    return `**General Gas Law Calculation**

**Given (Initial state):**
- Pressure (P₁) = ${v.pressure} Pa
- Volume (V₁) = ${v.volume} m³
- Temperature (T₁) = ${v.temperature}°C = ${T1K} K

**Formula:**
P₁V₁ / T₁ = P₂V₂ / T₂

To find a specific unknown, you need two of the three final state values. Provide the second pressure or temperature to solve completely.

**Key conversions to remember:**
- Temperature: T(K) = T(°C) + 273
- Standard atmospheric pressure ≈ 101,325 Pa ≈ 101 kPa

**Next step:** A gas at 27°C and 100 kPa occupies 2 L. Find its volume at 127°C and 200 kPa.`;
  }
  return null;
}

// -------------------------
// Keyword-based solver router
// Tries each solver in order
// and returns the first match
// -------------------------

function routeToSolver(
  normalized: string,
  values: ExtractedValues,
  query: string
): string | null {
  // Wave speed
  if (
    normalized_includes_any(normalized, ["wave", "frequency", "wavelength", "wave speed"]) &&
    values.frequency !== undefined &&
    values.wavelength !== undefined
  ) {
    return solveWaveSpeed(values, query);
  }

  // Hooke's law / spring
  if (
    normalized_includes_any(normalized, ["spring", "hooke", "extension"]) ||
    values.springConstant !== undefined
  ) {
    const r = solveHookesLaw(values, query);
    if (r) return r;
  }

  // Electrical power
  if (
    normalized_includes_any(normalized, ["power", "electrical", "watt"]) &&
    values.current !== undefined &&
    values.voltage !== undefined
  ) {
    const r = solveElectricalPower(values, query);
    if (r) return r;
  }

  // Ohm's law
  if (
    normalized_includes_any(normalized, ["ohm", "current", "voltage", "resistance", "circuit"])
  ) {
    const r = solveOhmsLaw(values, query);
    if (r) return r;
  }

  // Liquid pressure
  if (
    normalized_includes_any(normalized, ["liquid", "water", "pressure", "depth", "submerged"]) &&
    values.density !== undefined &&
    values.height !== undefined
  ) {
    const r = solveLiquidPressure(values, query);
    if (r) return r;
  }

  // Pressure (F/A)
  if (
    normalized_includes_any(normalized, ["pressure"]) &&
    values.force !== undefined &&
    values.area !== undefined
  ) {
    const r = solvePressure(values, query);
    if (r) return r;
  }

  // Potential energy
  if (
    normalized_includes_any(normalized, ["potential energy", "gravitational", "height", "mgh"]) &&
    values.mass !== undefined &&
    values.height !== undefined
  ) {
    const r = solvePotentialEnergy(values, query);
    if (r) return r;
  }

  // Kinetic energy
  if (
    normalized_includes_any(normalized, ["kinetic energy", "ke", "½mv"]) &&
    values.mass !== undefined &&
    values.velocity !== undefined
  ) {
    const r = solveKineticEnergy(values, query);
    if (r) return r;
  }

  // Momentum
  if (
    normalized_includes_any(normalized, ["momentum", "impulse"]) &&
    values.mass !== undefined &&
    values.velocity !== undefined
  ) {
    const r = solveMomentum(values, query);
    if (r) return r;
  }

  // Force (F = ma)
  if (
    normalized_includes_any(normalized, ["force", "newton", "acceleration"]) &&
    values.mass !== undefined &&
    values.acceleration !== undefined
  ) {
    const r = solveForce(values, query);
    if (r) return r;
  }

  // Density
  if (normalized_includes_any(normalized, ["density", "mass", "volume"])) {
    const r = solveDensity(values, query);
    if (r) return r;
  }

  // Pendulum period
  if (normalized_includes_any(normalized, ["pendulum", "period"])) {
    const r = solvePendulumPeriod(values, query);
    if (r) return r;
  }

  // SUVAT kinematics
  if (
    normalized_includes_any(normalized, ["accelerat", "velocity", "speed", "distance", "time"]) &&
    values.acceleration !== undefined &&
    values.time !== undefined
  ) {
    const r = solveVelocityFromSUVAT(values, query);
    if (r) return r;
  }

  // Gas law
  const gasResult = solveIdealGas(values, query);
  if (gasResult) return gasResult;

  return null;
}

// -------------------------
// Structured guide fallback
// Used when values cannot be
// extracted from the query
// -------------------------

function buildCalculationGuide(query: string, mode: Mode): string {
  const normalized = query.toLowerCase();

  if (normalized_includes_any(normalized, ["wave", "frequency", "wavelength"])) {
    return `**Wave Speed — Formula and Method**

The wave equation relates speed, frequency, and wavelength:

**Formula:** v = fλ
- v = wave speed (m/s)
- f = frequency (Hz)
- λ = wavelength (m)

**Steps to solve:**
1. Identify the values given in the question
2. Identify the unknown
3. Rearrange the formula if needed: f = v/λ or λ = v/f
4. Substitute values and calculate
5. State the unit in your answer

**Example:** f = 250 Hz, λ = 1.4 m
v = 250 × 1.4 = **350 m/s**

**Next step:** A wave of frequency 250 Hz has a wavelength of 1.4 m. Calculate the wave speed.`;
  }

  if (normalized_includes_any(normalized, ["force", "newton", "F = ma"])) {
    return `**Force — Formula and Method**

Newton's Second Law: **F = ma**
- F = force (N)
- m = mass (kg)
- a = acceleration (m/s²)

**Steps:** Identify F, m, a. Rearrange if needed. Substitute and calculate.

**Example:** m = 5 kg, a = 3 m/s² → F = 5 × 3 = **15 N**

**Next step:** A 3 kg object accelerates at 4 m/s². Calculate the net force acting on it.`;
  }

  if (normalized_includes_any(normalized, ["pressure"])) {
    return `**Pressure — Formula and Method**

**P = F/A** (solid surfaces) or **P = ρgh** (liquids)
- P = pressure (Pa), F = force (N), A = area (m²)
- ρ = density (kg/m³), g = 10 m/s², h = depth (m)

**Next step:** A force of 50 N acts on an area of 0.25 m². Calculate the pressure.`;
  }

  if (normalized_includes_any(normalized, ["density"])) {
    return `**Density — Formula and Method**

**ρ = m/V**
- ρ = density (kg/m³), m = mass (kg), V = volume (m³)

Rearranged: m = ρV or V = m/ρ

**Next step:** A liquid of mass 2 kg occupies 0.004 m³. Calculate its density.`;
  }

  if (normalized_includes_any(normalized, ["kinetic energy", "ke"])) {
    return `**Kinetic Energy — Formula and Method**

**KE = ½mv²**
- KE = kinetic energy (J), m = mass (kg), v = speed (m/s)

**Next step:** A 4 kg ball moves at 5 m/s. Calculate its kinetic energy.`;
  }

  if (normalized_includes_any(normalized, ["ohm", "voltage", "current", "resistance"])) {
    return `**Ohm's Law — Formula and Method**

**V = IR**
- V = voltage (V), I = current (A), R = resistance (Ω)

Rearranged: I = V/R or R = V/I

**Next step:** A 12 V battery drives a current through a 6 Ω resistor. Find the current.`;
  }

  return `To solve this calculation correctly, share the values given in your question and I will work through it step by step.

**General method for all physics calculations:**
1. Write down all given values with units
2. Identify the unknown quantity
3. Select the correct formula
4. Rearrange the formula for the unknown
5. Substitute values and calculate
6. State the answer with correct unit

**Next step:** Share the specific values in your question so I can solve it fully.`;
}

// -------------------------
// Main solver entry point
// -------------------------

export async function runSolver(
  query: string,
  mode: Mode
): Promise<EngineResponse> {
  const normalized = query.trim().toLowerCase();
  const values = extractValues(normalized);

  // Try to solve with extracted values
  const solved = routeToSolver(normalized, values, query);

  const content = solved ?? buildCalculationGuide(query, mode);

  return {
    content,
    source: "knowledge_base",
    mode,
    cached: false,
  };
}
