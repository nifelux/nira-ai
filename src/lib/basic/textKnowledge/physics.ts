// src/lib/basic/textKnowledge/physics.ts
// Covers: WAEC, NECO, JAMB, Cambridge O-Level, South African NSC,
// East African (KNEC, UNEB, NECTA), Francophone African curricula

import { KnowledgeEntry } from "@/types/chat";

export const physicsEntries: KnowledgeEntry[] = [

  // ============================================================
  // MEASUREMENTS AND UNITS
  // ============================================================

  {
    keywords: [
      "measurement", "what is measurement", "SI units", "fundamental quantities",
      "derived quantities", "basic units", "physics units", "international system of units",
    ],
    mode: "study",
    answer: `Physics depends on accurate measurement. The International System of Units (SI) provides a global standard.

**Fundamental Quantities and their SI Units:**
- Length — metre (m)
- Mass — kilogram (kg)
- Time — second (s)
- Electric current — ampere (A)
- Temperature — kelvin (K)
- Amount of substance — mole (mol)
- Luminous intensity — candela (cd)

**Derived quantities** are formed by combining fundamental quantities. Examples: speed (m/s), force (kg·m/s² = newton), pressure (N/m² = pascal).

**Prefixes to know:**
- Mega (M) = 10⁶, Kilo (k) = 10³, Centi (c) = 10⁻², Milli (m) = 10⁻³, Micro (μ) = 10⁻⁶, Nano (n) = 10⁻⁹

**Next step:** List five derived quantities and write their SI units using only the seven fundamental units.`,
  },

  {
    keywords: [
      "significant figures", "precision", "accuracy", "precision vs accuracy",
      "errors in measurement", "random error", "systematic error", "parallax error",
    ],
    mode: "study",
    answer: `Accuracy and precision are both important in measurement but they mean different things.

**Accuracy** means how close a measurement is to the true value.
**Precision** means how consistent repeated measurements are with each other.

**Types of errors:**
- **Systematic error:** consistently off in one direction. Caused by faulty equipment or poor technique. Cannot be reduced by repeating.
- **Random error:** unpredictable scatter of readings. Reduced by taking multiple readings and averaging.
- **Parallax error:** reading a scale at an angle — avoided by reading at eye level.

**Significant figures rules:**
- All non-zero digits are significant
- Zeros between significant digits are significant
- Leading zeros are not significant
- Trailing zeros after a decimal point are significant

**Next step:** Measure the length of your pen five times and calculate the average and range of error.`,
  },

  {
    keywords: [
      "vernier caliper", "micrometer screw gauge", "how to read vernier caliper",
      "how to read micrometer", "measuring instruments", "zero error",
    ],
    mode: "study",
    answer: `Different measuring instruments are used depending on the precision required.

**Metre rule:** Measures to the nearest millimetre (0.1 cm precision).

**Vernier caliper:** Measures to 0.01 cm (0.1 mm). Reading = main scale reading + (vernier division that aligns × least count). Least count = 0.01 cm.

**Micrometer screw gauge:** Measures to 0.001 cm (0.01 mm). Reading = sleeve reading + thimble reading. Least count = 0.01 mm.

**Zero error:** Close the jaws completely. If the zero does not align, record the zero error and subtract from all readings. Positive zero error: thimble zero is above reference line. Negative zero error: thimble zero is below reference line.

**Next step:** Practice reading three vernier caliper diagrams until you can obtain the correct reading in under 30 seconds.`,
  },

  // ============================================================
  // SCALARS AND VECTORS
  // ============================================================

  {
    keywords: [
      "scalar", "vector", "scalar and vector", "difference between scalar and vector",
      "scalar quantities", "vector quantities", "examples of scalars", "examples of vectors",
      "resolving vectors", "components of a vector",
    ],
    mode: "study",
    answer: `Physical quantities are classified as either scalar or vector.

**Scalar quantities** have magnitude only. Examples: mass, distance, speed, temperature, time, energy, pressure, density, work.

**Vector quantities** have both magnitude and direction. Examples: displacement, velocity, acceleration, force, weight, momentum, electric field, magnetic flux density.

**Key distinctions:**
- Distance is scalar; displacement is vector
- Speed is scalar; velocity is vector

**Vector addition:**
- Same direction: add magnitudes
- Opposite directions: subtract magnitudes
- At an angle: use the parallelogram law or triangle law. Resultant by Pythagoras when perpendicular.

**Resolving vectors:** A vector F at angle θ to the horizontal:
- Horizontal component = F cosθ
- Vertical component = F sinθ

**Resultant of two perpendicular vectors:** R = √(Fx² + Fy²), θ = tan⁻¹(Fy/Fx)

**Next step:** A force of 10 N acts at 30° to the horizontal. Calculate its horizontal and vertical components.`,
  },

  // ============================================================
  // MOTION (KINEMATICS)
  // ============================================================

  {
    keywords: [
      "kinematics", "equations of motion", "uniform acceleration",
      "distance", "displacement", "speed", "velocity", "acceleration",
      "uniform motion", "SUVAT equations",
    ],
    mode: "study",
    answer: `Kinematics describes motion without considering the forces that cause it.

**Key definitions:**
- **Distance:** total path length (scalar)
- **Displacement:** shortest distance from start to end with direction (vector)
- **Speed** = Distance / Time (scalar)
- **Velocity** = Displacement / Time (vector)
- **Acceleration** = Change in velocity / Time = (v − u) / t

**Equations of motion (uniform acceleration — SUVAT):**
1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as
4. s = ½(u + v)t

Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement.

**Free fall:** Object falling under gravity only. a = g = 10 m/s² (downward). At maximum height, v = 0.

**Types of motion:** uniform, non-uniform, linear, circular, oscillatory, random.

**Next step:** A car starts from rest and accelerates at 3 m/s². Calculate its velocity and distance covered after 5 s.`,
  },

  {
    keywords: [
      "velocity time graph", "distance time graph", "displacement time graph",
      "graph of motion", "area under velocity time graph",
      "gradient of distance time graph", "how to interpret motion graphs",
    ],
    mode: "study",
    answer: `Motion graphs are a powerful way to analyse and describe motion visually.

**Distance-time graph:**
- Gradient (slope) = speed
- Horizontal line = object at rest
- Straight diagonal line = uniform speed
- Curved line = changing speed (acceleration or deceleration)

**Velocity-time graph:**
- Gradient = acceleration (positive slope = acceleration, negative slope = deceleration)
- Area under the graph = displacement (distance if always positive)
- Horizontal line = uniform velocity (zero acceleration)

**How to find area under v-t graph:**
- Rectangle: base × height
- Triangle: ½ × base × height
- Trapezium: ½ × (sum of parallel sides) × height

**Acceleration-time graph:**
- Area under graph = change in velocity

**Next step:** Sketch a velocity-time graph for a ball thrown vertically upward that reaches maximum height and falls back to its starting point.`,
  },

  {
    keywords: [
      "projectile motion", "projectile", "trajectory", "horizontal projectile",
      "range of projectile", "time of flight", "maximum height projectile",
      "parabolic path",
    ],
    mode: "study",
    answer: `Projectile motion occurs when a body is launched into the air and moves under gravity alone (ignoring air resistance).

**Key principle:** Horizontal and vertical motions are completely independent.

**Horizontal motion:** No horizontal force, so horizontal velocity (uₓ) is constant.
- Horizontal distance: x = uₓt

**Vertical motion:** Gravity acts downward (g = 10 m/s²).

**For a projectile launched at angle θ with speed u:**
- Horizontal component: uₓ = u cosθ
- Vertical component: uᵧ = u sinθ
- Time of flight: T = 2u sinθ / g
- Maximum height: H = u² sin²θ / 2g
- Horizontal range: R = u² sin2θ / g
- Maximum range at θ = 45°

**For a horizontal projectile from height h:**
- Time to reach ground: t = √(2h/g)
- Horizontal range: R = uₓ × t
- Velocity on impact: v = √(uₓ² + (gt)²)

**Next step:** A ball is kicked at 20 m/s at 30° above horizontal. Calculate the time of flight, maximum height, and range.`,
  },

  {
    keywords: [
      "circular motion", "centripetal force", "centripetal acceleration",
      "angular velocity", "period", "frequency circular",
      "uniform circular motion", "banking of roads",
    ],
    mode: "study",
    answer: `Uniform circular motion involves constant speed but changing direction, meaning constant acceleration toward the centre.

**Definitions:**
- **Period (T):** time for one revolution
- **Frequency (f):** f = 1/T
- **Angular velocity (ω):** ω = 2π/T = 2πf (rad/s)
- **Linear speed:** v = ωr = 2πr/T

**Centripetal acceleration:** a = v²/r = ω²r (directed toward centre)

**Centripetal force:** F = mv²/r = mω²r (always toward the centre)

**Sources of centripetal force:**
- Tension in a string (ball on string)
- Friction (car on a bend)
- Gravity (satellite in orbit)
- Normal reaction (ball in a bowl)
- Magnetic force (charged particle in a field)

**Conical pendulum:** Ball on a string moves in a horizontal circle. T cosθ = mg, T sinθ = mv²/r.

**Banking of roads:** Roads banked at angle θ allow vehicles to navigate bends without relying on friction: tanθ = v²/rg.

**Next step:** A 0.5 kg ball is swung horizontally at radius 1.2 m making 3 revolutions per second. Calculate the centripetal force.`,
  },

  // ============================================================
  // NEWTON'S LAWS OF MOTION
  // ============================================================

  {
    keywords: [
      "newton's laws", "newton's first law", "newton's second law", "newton's third law",
      "law of inertia", "inertia", "F = ma", "action and reaction",
      "state newton's laws of motion",
    ],
    mode: "study",
    answer: `Newton's three laws of motion form the foundation of classical mechanics.

**First Law (Law of Inertia):**
A body remains at rest or in uniform motion in a straight line unless acted upon by a resultant external force. Inertia is the resistance of a body to change in its state of motion.

**Second Law:**
The resultant force on a body is proportional to the rate of change of its momentum and acts in the direction of the change. For constant mass: F = ma.
- F in Newtons, m in kg, a in m/s².

**Third Law:**
For every action force, there is an equal and opposite reaction force. These forces act on different bodies.
- A rocket expels gas backward (action) → gas pushes rocket forward (reaction).
- A book on a table pushes down on the table → table pushes up on the book.

**Momentum (p):** p = mv. Unit: kg·m/s.
**Impulse:** FΔt = Δp = m(v − u). Unit: Ns = kg·m/s.

**Application:** Airbags increase the time of collision, reducing the force on the passenger while the same change in momentum occurs.

**Next step:** State one real-life example illustrating each of Newton's three laws and explain the physics.`,
  },

  {
    keywords: [
      "friction", "types of friction", "static friction", "kinetic friction",
      "limiting friction", "coefficient of friction", "advantages of friction",
      "disadvantages of friction", "reducing friction", "friction formula",
    ],
    mode: "study",
    answer: `Friction is the force that opposes relative motion between two surfaces in contact.

**Types of friction:**
- **Static friction:** resists the start of motion. Maximum value = limiting friction.
- **Kinetic (sliding) friction:** resists ongoing motion. Slightly less than limiting friction.
- **Rolling friction:** friction when a body rolls. Much less than sliding friction.
- **Fluid friction (drag/viscosity):** in liquids and gases.

**Laws of friction:**
1. Friction is proportional to normal reaction (F ∝ N)
2. Friction is independent of area of contact (for same material)
3. Kinetic friction is independent of speed
4. Friction depends on nature of surfaces

**Coefficient of friction (μ):** μ = F/N.
- μs (static) ≥ μk (kinetic)

**Advantages:** walking, braking, writing, striking matches, holding objects.
**Disadvantages:** wear, energy loss as heat, machine efficiency reduction.

**Reducing friction:** lubrication, ball bearings, streamlining, polishing, rollers, magnetic levitation.

**Next step:** A block of mass 5 kg requires a force of 20 N to slide on a surface. Find the coefficient of kinetic friction (g = 10 m/s²).`,
  },

  // ============================================================
  // EQUILIBRIUM AND STATICS
  // ============================================================

  {
    keywords: [
      "equilibrium", "conditions for equilibrium", "moment", "torque",
      "principle of moments", "couple", "centre of gravity", "stability",
      "types of equilibrium", "stable unstable neutral",
    ],
    mode: "study",
    answer: `A body is in equilibrium when neither its translational nor rotational state changes.

**Two conditions for equilibrium:**
1. Sum of all forces in any direction = 0 (ΣF = 0)
2. Sum of all moments about any point = 0 (Στ = 0)

**Moment of a force:** Moment = Force × perpendicular distance from pivot. Unit: Nm.

**Principle of Moments:** For a body in equilibrium: sum of clockwise moments = sum of anticlockwise moments.

**Centre of gravity (CG):** The point through which the weight of a body appears to act.
- For regular shapes: geometric centre
- Found experimentally by suspending from multiple points

**Types of equilibrium:**
- **Stable:** CG rises when displaced; returns to original position. Low CG, wide base.
- **Unstable:** CG falls when displaced; falls further. High CG, narrow base.
- **Neutral:** CG neither rises nor falls; stays in new position.

**Couple:** Two equal, parallel, opposite forces whose lines of action are different. Net force = 0 but produces pure rotation. Torque of couple = F × d (perpendicular distance between forces).

**Next step:** A uniform beam of 4 m is balanced on a pivot at its centre. A 30 N weight is placed 1 m from the pivot on one side. Find the weight needed 1.5 m from the pivot on the other side.`,
  },

  // ============================================================
  // WORK, ENERGY AND POWER
  // ============================================================

  {
    keywords: [
      "work", "energy", "power", "work done", "kinetic energy", "potential energy",
      "conservation of energy", "work energy theorem", "efficiency",
    ],
    mode: "study",
    answer: `Work, energy, and power are closely related quantities that describe how forces change the motion of objects.

**Work:** W = F × d × cosθ. Work is done only when a force produces displacement.
- Unit: Joule (J). If F ⊥ d, no work is done.

**Kinetic Energy (KE):** Energy of motion. KE = ½mv².

**Gravitational Potential Energy (PE):** PE = mgh. Depends on height above reference level.

**Elastic Potential Energy:** Energy stored in a deformed spring. EPE = ½ke².

**Conservation of mechanical energy:** In the absence of friction, KE + PE = constant.
- As PE decreases, KE increases (falling body).

**Work-Energy Theorem:** Net work done = change in kinetic energy. W_net = ½mv² − ½mu².

**Power:** Rate of doing work. P = W/t = Fv. Unit: Watt (W). 1 W = 1 J/s.
1 horsepower (hp) = 746 W.

**Efficiency:** η = (useful energy output / total energy input) × 100%.
Energy is always conserved overall — efficiency refers to useful output only.

**Next step:** A 2 kg ball falls from 5 m height. Find its speed just before impact using energy conservation.`,
  },

  // ============================================================
  // SIMPLE MACHINES
  // ============================================================

  {
    keywords: [
      "simple machines", "lever", "pulley", "inclined plane", "wheel and axle",
      "screw", "wedge", "mechanical advantage", "velocity ratio", "efficiency of machine",
    ],
    mode: "study",
    answer: `Simple machines multiply force or change direction of force, making work easier.

**Key definitions:**
- **Mechanical Advantage (MA):** MA = Load / Effort. Ratio > 1 means force multiplication.
- **Velocity Ratio (VR):** VR = Distance effort moves / Distance load moves. Always ≥ 1.
- **Efficiency:** η = (MA / VR) × 100%. Always less than 100% due to friction.

**Classes of levers:**
- Class 1: Fulcrum between effort and load. MA can be > or < 1. Examples: scissors, see-saw, crowbar.
- Class 2: Load between effort and fulcrum. MA always > 1. Examples: wheelbarrow, nutcracker, bottle opener.
- Class 3: Effort between fulcrum and load. MA always < 1 (speed/range multiplier). Examples: tweezers, forceps, fishing rod, human arm.

**Pulley systems:**
- Single fixed pulley: VR = 1 (changes direction only)
- Single movable pulley: VR = 2
- Block and tackle with n rope segments supporting movable block: VR = n

**Inclined plane:** VR = length / height = 1/sinθ.

**Screw:** VR = 2πl / p (l = handle length, p = pitch).

**Wheel and axle:** VR = radius of wheel / radius of axle.

**Next step:** A pulley system has VR = 5 and efficiency = 80%. If the load is 400 N, find the effort needed.`,
  },

  // ============================================================
  // GRAVITATION
  // ============================================================

  {
    keywords: [
      "gravity", "gravitation", "newton's law of gravitation", "gravitational force",
      "gravitational field strength", "acceleration due to gravity",
      "weight vs mass", "satellite", "orbital motion", "escape velocity",
    ],
    mode: "study",
    answer: `Gravitation is the universal attractive force between any two masses.

**Newton's Law of Universal Gravitation:**
F = Gm₁m₂/r²
G = 6.67 × 10⁻¹¹ Nm²/kg², m = masses (kg), r = separation (m).

**Gravitational field strength (g):** g = GM/r². At Earth's surface: g ≈ 10 m/s².

**Weight:** W = mg. Weight depends on g and varies with location. Mass is constant everywhere.

**Variation of g:**
- Increases slightly at the poles (Earth is flatter, closer to centre)
- Decreases with altitude (further from centre)
- Decreases with depth below the surface

**Satellite motion:** Gravitational force provides centripetal force.
mv²/r = GMm/r² → v = √(GM/r)

**Orbital period (Kepler's Third Law):** T² = 4π²r³/GM.

**Geostationary satellite:** Period = 24 hours. Orbits above the equator at ~36,000 km. Appears stationary relative to Earth. Used for TV broadcasting and weather satellites.

**Escape velocity:** v_escape = √(2GM/R) ≈ 11.2 km/s for Earth.

**Next step:** Explain why astronauts are weightless in orbit even though gravity still acts on them.`,
  },

  // ============================================================
  // ELASTICITY
  // ============================================================

  {
    keywords: [
      "elasticity", "hooke's law", "spring constant", "elastic limit",
      "elastic deformation", "plastic deformation", "young's modulus",
      "stress", "strain", "extension spring", "springs in series parallel",
    ],
    mode: "study",
    answer: `Elasticity is the property of a material that causes it to return to its original shape after a deforming force is removed.

**Hooke's Law:** Extension is directly proportional to the applied force, provided the elastic limit is not exceeded.
F = ke (k = spring constant in N/m, e = extension in m)

**Elastic limit:** The maximum force beyond which permanent deformation occurs.

**Elastic potential energy:** E = ½ke² = ½Fe.

**Young's Modulus (E):** For solid materials.
E = Stress / Strain = (F/A) / (ΔL/L₀)
Unit: Pa (N/m²). High Young's modulus = stiff material.

**Stress:** Force per unit area. Stress = F/A (Pa).
**Strain:** Fractional extension. Strain = ΔL/L₀ (no units).

**Springs in series:** 1/k_total = 1/k₁ + 1/k₂. Total spring constant decreases; same force, larger extension.
**Springs in parallel:** k_total = k₁ + k₂. Total spring constant increases; same extension, larger force.

**Elastic vs Plastic deformation:**
- Elastic: material returns to original shape (within elastic limit)
- Plastic: permanent deformation (beyond elastic limit)

**Next step:** A spring of constant 200 N/m is extended by a 5 N force. Find the extension and elastic PE stored.`,
  },

  // ============================================================
  // PRESSURE
  // ============================================================

  {
    keywords: [
      "pressure", "what is pressure", "pressure formula", "pressure in liquids",
      "atmospheric pressure", "barometer", "manometer", "pascal's principle",
      "pressure and depth", "hydraulic press", "Pascal",
    ],
    mode: "study",
    answer: `Pressure is the force acting perpendicularly per unit area of a surface.

**Pressure:** P = F/A. Unit: Pascal (Pa) = N/m².

**Pressure in liquids:** P = ρgh (ρ = density, g = gravitational field strength, h = depth).
- Pressure increases with depth and density
- Acts equally in all directions at the same depth
- Independent of the shape of the container (hydrostatic paradox)

**Atmospheric pressure:** ~101,325 Pa = 760 mmHg = 1 atm.
- Decreases with altitude (less air above)
- Measured by a mercury barometer

**Manometer:** Measures pressure difference between a gas and atmosphere using a U-tube of liquid.

**Pascal's Principle:** Pressure applied to an enclosed fluid is transmitted equally in all directions throughout the fluid. Basis of hydraulic systems.

**Hydraulic press:** F₁/A₁ = F₂/A₂ → F₂ = F₁ × (A₂/A₁). Small effort → large force by using area difference.

**Applications:** car brakes, hydraulic jacks, aircraft controls, dentist's chair.

**Next step:** Calculate the pressure at the bottom of a pool 2.5 m deep (ρ_water = 1000 kg/m³, g = 10 m/s²).`,
  },

  // ============================================================
  // ARCHIMEDES' PRINCIPLE AND FLOTATION
  // ============================================================

  {
    keywords: [
      "archimedes principle", "upthrust", "buoyancy", "flotation",
      "law of flotation", "apparent weight", "relative density",
      "why does ice float", "density and flotation", "why ships float",
    ],
    mode: "study",
    answer: `Archimedes' Principle explains why objects feel lighter when submerged in a fluid.

**Archimedes' Principle:** When a body is wholly or partially immersed in a fluid, it experiences an upthrust equal to the weight of fluid displaced.

Upthrust = ρ_fluid × V_displaced × g

**Apparent weight:** Weight in air − Upthrust.

**Law of Flotation:** A floating body displaces its own weight of fluid.
- If weight > upthrust: object sinks
- If weight = upthrust: object floats
- If weight < upthrust: object rises

**Relative Density (R.D.):**
RD = Density of substance / Density of water = Weight in air / Loss of weight in water.
No units. If RD > 1: sinks in water. If RD < 1: floats.

**Why ships float:** Average density of ship (steel + air inside) < density of water → displaces enough water for upthrust = weight.

**Submarine:** Adjusts buoyancy by pumping water in or out of ballast tanks.

**Why ice floats:** Density of ice (917 kg/m³) < density of liquid water (1000 kg/m³). This anomalous behaviour of water protects aquatic life in winter.

**Next step:** A stone weighs 8 N in air and 5 N when fully submerged. Find the upthrust, volume, and density.`,
  },

  // ============================================================
  // SIMPLE HARMONIC MOTION
  // ============================================================

  {
    keywords: [
      "simple harmonic motion", "SHM", "pendulum", "period of pendulum",
      "spring-mass system", "oscillation", "amplitude", "frequency of oscillation",
      "what is SHM", "restoring force",
    ],
    mode: "study",
    answer: `Simple Harmonic Motion (SHM) is periodic motion where acceleration is proportional to displacement and directed toward the equilibrium position.

**Definition:** a = −ω²x (acceleration is always opposite to displacement)

**Key quantities:**
- **Amplitude (A):** maximum displacement from equilibrium
- **Period (T):** time for one complete oscillation (s)
- **Frequency (f):** oscillations per second (Hz). f = 1/T
- **Angular frequency (ω):** ω = 2πf = 2π/T (rad/s)

**Simple pendulum:**
T = 2π√(l/g)
Period depends only on length and g — not on mass or amplitude (for small angles < 15°).

**Spring-mass system:**
T = 2π√(m/k)
Period depends on mass and spring constant.

**Energy in SHM:**
- At equilibrium: maximum KE, zero PE
- At maximum displacement: zero KE, maximum PE
- Total energy = ½kA² = ½mω²A² = constant

**Displacement:** x = A cos(ωt) or A sin(ωt)
**Velocity:** v = ±ω√(A² − x²). Maximum at x = 0: v_max = ωA.
**Acceleration:** a = −ω²x. Maximum at x = A: a_max = ω²A.

**Next step:** Find the period of a pendulum of length 0.4 m on Earth (g = 10 m/s²) and on the Moon (g = 1.6 m/s²).`,
  },

  // ============================================================
  // WAVES
  // ============================================================

  {
    keywords: [
      "waves", "types of waves", "transverse waves", "longitudinal waves",
      "wave properties", "amplitude", "wavelength", "frequency",
      "wave speed", "wave equation", "crest", "trough",
    ],
    mode: "study",
    answer: `A wave is a periodic disturbance that transfers energy from one place to another without net transfer of matter.

**Types of waves:**
- **Transverse:** vibration perpendicular to direction of travel. Features: crests (peaks) and troughs. Examples: light, electromagnetic waves, waves on strings.
- **Longitudinal:** vibration parallel to direction of travel. Features: compressions and rarefactions. Example: sound.
- **Mechanical waves:** require a medium (sound, water waves).
- **Electromagnetic waves:** do not require a medium (light, radio waves).

**Key wave quantities:**
- **Amplitude (A):** maximum displacement from rest. Related to energy.
- **Wavelength (λ):** distance between two successive identical points in phase. Unit: m.
- **Frequency (f):** waves passing a point per second. Unit: Hz.
- **Period (T):** time for one complete wave. T = 1/f.
- **Wave speed (v):** v = fλ (wave equation)

**Progressive (travelling) waves:** Transfer energy; all points oscillate with the same amplitude.

**Stationary (standing) waves:** Formed by superposition of two identical waves in opposite directions. Have nodes (zero amplitude) and antinodes (maximum amplitude). No net energy transfer.

**Next step:** A wave of frequency 250 Hz has a wavelength of 1.4 m. Calculate the wave speed.`,
  },

  {
    keywords: [
      "reflection of waves", "refraction of waves", "diffraction", "interference",
      "principle of superposition", "constructive interference",
      "destructive interference", "wave phenomena",
    ],
    mode: "study",
    answer: `Waves display characteristic behaviours when they meet boundaries, obstacles, or other waves.

**Reflection:** Wave bounces back from a boundary. Speed, frequency, and wavelength are unchanged. Angle of incidence = angle of reflection.

**Refraction:** Wave changes speed (and wavelength) when entering a new medium. Frequency remains constant. Causes change of direction (except when entering at 90°).

**Diffraction:** Wave bends around obstacles or spreads through gaps. Most noticeable when gap width ≈ wavelength. This is why sound bends around corners but visible light does not (wavelength too small).

**Interference:** When two waves meet, the resultant displacement = algebraic sum of individual displacements (Principle of Superposition).
- **Constructive:** waves in phase → amplitudes add → bright fringes/louder sound.
- **Destructive:** waves 180° out of phase → amplitudes cancel → dark fringes/silence.

**Conditions for sustained interference:**
- Coherent sources (same frequency and constant phase relationship)
- Similar amplitudes

**Young's double slit:** Demonstrates interference of light. Fringe spacing: w = λD/d (D = distance to screen, d = slit separation).

**Next step:** Explain why you can hear sound around a corner but cannot see light around the same corner.`,
  },

  // ============================================================
  // SOUND
  // ============================================================

  {
    keywords: [
      "sound", "sound waves", "speed of sound", "echo", "reverberation",
      "pitch", "loudness", "quality", "ultrasound", "resonance",
      "frequency and pitch", "properties of sound",
    ],
    mode: "study",
    answer: `Sound is a longitudinal mechanical wave that requires a material medium for propagation.

**Characteristics of sound:**
- **Pitch:** determined by frequency. Higher frequency = higher pitch. Human hearing range: 20 Hz to 20,000 Hz.
- **Loudness (Intensity):** proportional to amplitude squared. Unit: decibel (dB).
- **Timbre (Quality):** determined by waveform — distinguishes instruments at the same pitch.

**Speed of sound:**
- In air at 0°C: ~330 m/s. At 20°C: ~340 m/s.
- Sound travels faster in: denser/stiffer media. Speed: solids > liquids > gases.
- Increases with temperature in gases.

**Echo:** Reflected sound heard distinctly from original. Needs minimum distance of ~17 m (time gap ≥ 0.1 s).
Echo distance = (v × t) / 2.

**Reverberation:** Persistence of sound due to multiple reflections. Can be reduced with sound-absorbing materials.

**Ultrasound (> 20 kHz):** Used in medical sonography (scanning unborn babies), sonar, echo sounding, cleaning, non-destructive testing of metals.

**Resonance:** A body vibrates with maximum amplitude when driven at its natural frequency. A column of air in a tube resonates when its length is a whole number of half-wavelengths (or odd number of quarter-wavelengths with one closed end).

**Next step:** A cliff is 510 m away. Calculate the time before an echo is heard (speed of sound = 340 m/s).`,
  },

  // ============================================================
  // LIGHT
  // ============================================================

  {
    keywords: [
      "light", "reflection of light", "laws of reflection", "refraction of light",
      "snell's law", "refractive index", "total internal reflection",
      "critical angle", "optical fibres",
    ],
    mode: "study",
    answer: `Light is a transverse electromagnetic wave travelling at 3 × 10⁸ m/s in a vacuum.

**Laws of Reflection:**
1. Angle of incidence = angle of reflection (i = r)
2. Incident ray, reflected ray, and normal are all in the same plane

**Refraction:** Change of direction when light passes between media of different optical densities. Frequency remains constant; speed and wavelength change.

**Snell's Law:** n₁ sinθ₁ = n₂ sinθ₂
Refractive index: n = sin i / sin r = speed in vacuum / speed in medium = real depth / apparent depth.

**Total Internal Reflection (TIR):**
Occurs when:
1. Light travels from a denser to a less dense medium
2. Angle of incidence exceeds the critical angle (C)

sin C = 1/n (n = refractive index of denser medium relative to less dense)

**Applications of TIR:**
- **Optical fibres:** light trapped by TIR — used in telecommunications and endoscopy. Allows high-bandwidth data transmission with very low loss.
- **Prisms:** in binoculars, periscopes (replace mirrors with prisms — less light loss)
- **Diamonds:** high n (≈ 2.42) gives very small critical angle — internal TIR produces brilliance

**Next step:** The refractive index of glass is 1.5. Calculate the critical angle and state what happens if light hits the glass-air boundary at 45°.`,
  },

  {
    keywords: [
      "mirrors", "plane mirror", "concave mirror", "convex mirror",
      "image in mirror", "focal length mirror", "uses of curved mirrors",
      "mirror formula", "magnification mirror", "curved mirrors",
    ],
    mode: "study",
    answer: `Mirrors reflect light to form images. The type of image depends on the mirror type and object position.

**Plane mirror image properties:** Virtual, upright, same size, laterally inverted. Image distance = object distance (behind mirror).

**Concave mirror (converging):** Focal length positive. Centre of curvature C, focal point F.
- Object beyond C: real, inverted, smaller (camera)
- Object at C: real, inverted, same size
- Object between C and F: real, inverted, larger (projector)
- Object inside F: virtual, upright, magnified (shaving/makeup mirror)
Uses: reflecting telescope, solar cooker, car headlights, satellite dishes.

**Convex mirror (diverging):** Focal length negative. Always produces virtual, upright, smaller image. Wider field of view.
Uses: car rear-view mirror, shop security mirror, road junction mirror.

**Mirror formula:** 1/f = 1/u + 1/v
(Real-is-positive convention: real distances positive, virtual negative.)

**Magnification:** m = −v/u = image height / object height.
|m| > 1: magnified. |m| < 1: diminished. Negative m: inverted.

**Radius of curvature:** r = 2f.

**Next step:** An object is 30 cm from a concave mirror of focal length 20 cm. Find image position and state whether it is real or virtual.`,
  },

  {
    keywords: [
      "lenses", "convex lens", "concave lens", "converging lens", "diverging lens",
      "lens formula", "focal length lens", "magnification lens",
      "uses of lenses", "power of lens", "defects of vision", "myopia", "hyperopia",
    ],
    mode: "study",
    answer: `Lenses refract light at two surfaces to form images.

**Convex (converging) lens:** Thicker at centre. Converges parallel rays to the principal focus.
- Object beyond 2F: real, inverted, smaller (camera, eye)
- Object at 2F: real, inverted, same size
- Object between F and 2F: real, inverted, larger (projector)
- Object inside F: virtual, upright, magnified (magnifying glass)

**Concave (diverging) lens:** Thinner at centre. Always produces virtual, upright, smaller image.
Uses: correcting myopia.

**Lens formula:** 1/f = 1/u + 1/v
**Magnification:** m = v/u
**Power:** P = 1/f (f in metres). Unit: Dioptre (D). Converging lens: positive. Diverging: negative.

**Defects of vision:**
- **Myopia (short-sight):** image forms in front of retina. Corrected by concave lens.
- **Hyperopia (long-sight/hypermetropia):** image forms behind retina. Corrected by convex lens.
- **Presbyopia:** loss of accommodation with age. Bifocal lenses.
- **Astigmatism:** uneven cornea curvature. Cylindrical lenses.

**Compound microscope:** Two converging lenses (objective and eyepiece) to produce high magnification.
**Astronomical telescope:** Two converging lenses separated by f_objective + f_eyepiece for normal adjustment.

**Next step:** A convex lens of focal length 15 cm has an object placed 20 cm from it. Calculate image distance and magnification.`,
  },

  {
    keywords: [
      "dispersion of light", "prism", "spectrum", "colours of light",
      "rainbow", "ROYGBIV", "electromagnetic spectrum",
      "uses of electromagnetic spectrum",
    ],
    mode: "study",
    answer: `White light is a mixture of all colours of the visible spectrum, each with a different wavelength and frequency.

**Dispersion by a prism:** Different colours have different refractive indices in glass, causing them to separate. Violet refracts most (highest n), red refracts least (lowest n).

**Order of colours in spectrum (ROYGBIV):**
Red, Orange, Yellow, Green, Blue, Indigo, Violet.
Red has longest wavelength (~700 nm); violet has shortest (~400 nm).

**Rainbow:** Sunlight dispersed by spherical raindrops acting as combined prisms and mirrors.

**Electromagnetic (EM) spectrum (increasing frequency):**
Radio → Microwaves → Infrared → Visible → Ultraviolet → X-rays → Gamma rays.
All travel at 3 × 10⁸ m/s in a vacuum.

**Applications:**
- Radio waves: broadcasting, communication
- Microwaves: mobile phones, cooking, satellite communication
- Infrared: remote controls, thermal imaging, night vision, physiotherapy
- Visible light: sight, photography, optical fibres
- Ultraviolet: sterilisation, fluorescence, detecting forgeries, tanning
- X-rays: medical imaging, security scanning, crystallography
- Gamma rays: cancer radiotherapy, food sterilisation, industrial thickness testing

**Next step:** Arrange in order of increasing wavelength: X-rays, microwaves, infrared, visible light, gamma rays.`,
  },

  // ============================================================
  // HEAT AND THERMODYNAMICS
  // ============================================================

  {
    keywords: [
      "heat", "temperature", "difference between heat and temperature",
      "thermometer", "celsius", "kelvin", "fahrenheit", "temperature conversion",
      "thermal equilibrium",
    ],
    mode: "study",
    answer: `Heat and temperature are distinct physical quantities that are often confused.

**Temperature:** Measure of the average kinetic energy of particles. Determines direction of heat flow. SI unit: Kelvin (K).

**Heat:** Thermal energy transferred from a higher to a lower temperature region. Measured in joules (J).

**Zeroth Law of Thermodynamics:** If two systems are each in thermal equilibrium with a third, they are in thermal equilibrium with each other. This is the basis of thermometry.

**Temperature scales:**
- Celsius: 0°C = ice point, 100°C = steam point.
- Kelvin (absolute): T(K) = T(°C) + 273. 0 K = absolute zero (−273°C).
- Fahrenheit: °F = 9/5 × °C + 32.

**Thermometers and their thermometric properties:**
- Mercury-in-glass: expansion of mercury
- Clinical: range 35–42°C, narrow bore, constriction holds reading
- Thermocouple: EMF generated at junction — high temperature ranges
- Resistance thermometer (platinum): resistance change with temperature
- Constant-volume gas thermometer: most accurate

**Fixed points:** Lower (ice point, 0°C) and upper (steam point, 100°C) used for calibration.

**Next step:** Convert 37°C to Kelvin and Fahrenheit. Convert 300 K to Celsius.`,
  },

  {
    keywords: [
      "thermal expansion", "expansion of solids liquids gases", "linear expansivity",
      "anomalous expansion of water", "bimetallic strip", "applications of expansion",
      "expansion joints",
    ],
    mode: "study",
    answer: `Most materials expand when heated as particles gain kinetic energy and vibrate with greater amplitude.

**Linear expansion (solids):**
ΔL = αL₀ΔT → L = L₀(1 + αΔT)
α = linear expansivity (°C⁻¹ or K⁻¹), L₀ = original length, ΔT = temperature change.

**Area expansion:** β ≈ 2α. Volume expansion: γ ≈ 3α.

**Expansion of liquids:** Real (absolute) expansion vs apparent expansion. Real expansion = Apparent expansion + expansion of container.

**Anomalous expansion of water:**
Water contracts when heated from 0°C to 4°C, then expands above 4°C. Maximum density at 4°C. This property:
- Allows ice to float (less dense than liquid water)
- Ensures aquatic life survives cold winters (water at 4°C sinks to the bottom, fish survive)

**Bimetallic strip:** Two metals with different linear expansivities bonded together. When heated, the metal with higher expansivity expands more, causing the strip to curve toward the less expansive metal. Applications: thermostats, fire alarms, electric irons, bimetallic thermometers.

**Engineering applications:**
- Gaps between railway tracks prevent buckling
- Expansion joints in bridges and concrete roads
- Shrink-fitting of metal wheels onto axles
- Overhead power cables sag in summer (expanded)

**Next step:** A steel rail is 20 m long at 20°C. If α = 12 × 10⁻⁶ /°C, find its length at 40°C.`,
  },

  {
    keywords: [
      "specific heat capacity", "latent heat", "specific latent heat",
      "latent heat of fusion", "latent heat of vaporisation",
      "calorimetry", "Q = mcΔT", "change of state", "cooling curve",
    ],
    mode: "study",
    answer: `Thermal energy calculations require understanding of specific heat capacity and latent heat.

**Specific Heat Capacity (c):** Heat energy to raise 1 kg of substance by 1°C (or 1 K).
Q = mcΔT. Unit: J/(kg·°C) or J/(kg·K).
Water: c = 4200 J/kg°C (explains coastal climate moderation, coolant in engines).

**Thermal (Heat) Capacity:** Heat to raise temperature of an entire object by 1°C. C = mc. Unit: J/°C.

**Latent Heat:** Heat energy absorbed/released during a change of state at constant temperature. Temperature does not change during state change because energy goes into breaking/forming intermolecular bonds.

**Specific Latent Heat of Fusion (Lf):** Energy per kg to melt a solid at its melting point.
Q = mLf. Water: Lf = 3.36 × 10⁵ J/kg.

**Specific Latent Heat of Vaporisation (Lv):** Energy per kg to vaporise a liquid at its boiling point.
Q = mLv. Water: Lv = 2.26 × 10⁶ J/kg.

**Cooling/Heating curves:** Flat portions indicate phase changes (constant temperature while latent heat is absorbed or released).

**Calorimetry:** Method of measuring heat exchange. In an insulated calorimeter: Heat lost = Heat gained.

**Next step:** Calculate the total heat needed to convert 0.5 kg of ice at −20°C to steam at 100°C.`,
  },

  {
    keywords: [
      "heat transfer", "conduction", "convection", "radiation",
      "good conductors heat", "bad conductors heat", "vacuum flask",
      "sea breeze land breeze", "greenhouse effect",
    ],
    mode: "study",
    answer: `Heat is transferred by three mechanisms: conduction, convection, and radiation.

**Conduction:** Transfer through a material by particle-to-particle vibration without bulk movement. Primary mechanism in solids.
- Free electrons in metals greatly enhance conduction (good conductors: copper, aluminium, iron).
- Poor conductors/insulators: wood, glass, plastic, air, rubber.
- Thermal conductivity: copper > aluminium > iron > glass > air.

**Convection:** Transfer through fluid by bulk movement of heated fluid (density changes).
- Hot fluid → less dense → rises. Cool fluid → denser → sinks → convection current.
- Natural convection: sea breeze (day: land heats faster, air rises; sea breeze blows from sea to land). Land breeze at night.
- Forced convection: fans, pumps.

**Radiation:** Transfer by electromagnetic waves (infrared). No medium required.
- All bodies above absolute zero radiate.
- Dark, matt surfaces: best absorbers and emitters.
- Light, shiny surfaces: best reflectors, poor absorbers/emitters.
- Stefan-Boltzmann Law: P = εσT⁴ (ε = emissivity, σ = 5.67 × 10⁻⁸ W/m²K⁴).

**Vacuum flask:** Reduces all three mechanisms:
- Vacuum between double walls → no conduction/convection
- Silvered walls → minimises radiation

**Greenhouse effect:** Earth's atmosphere transmits solar radiation but partially absorbs IR re-emitted by Earth. CO₂, CH₄, water vapour are greenhouse gases. Enhanced greenhouse effect → global warming.

**Next step:** Explain why white clothes are preferred in hot climates and dark clothes in cold climates.`,
  },

  // ============================================================
  // GAS LAWS
  // ============================================================

  {
    keywords: [
      "gas laws", "boyle's law", "charles law", "pressure law", "gay-lussac's law",
      "general gas equation", "ideal gas equation", "PV = nRT",
      "kinetic theory of gases",
    ],
    mode: "study",
    answer: `The gas laws describe how the pressure, volume, and temperature of a fixed mass of ideal gas are related.

**Boyle's Law:** At constant temperature: P ∝ 1/V → P₁V₁ = P₂V₂.
(Isothermal process)

**Charles' Law:** At constant pressure: V ∝ T → V₁/T₁ = V₂/T₂.
(T must be in Kelvin! Isobaric process.)

**Pressure Law (Gay-Lussac's Law):** At constant volume: P ∝ T → P₁/T₁ = P₂/T₂.
(T in Kelvin. Isochoric process.)

**General gas equation:** P₁V₁/T₁ = P₂V₂/T₂.

**Ideal Gas Equation:** PV = nRT.
P in Pa, V in m³, n = moles, R = 8.314 J/mol·K, T in K.
Also: PV = NkT (N = number of molecules, k = Boltzmann constant = 1.38 × 10⁻²³ J/K).

**Kinetic theory of an ideal gas (assumptions):**
1. Gas consists of identical, point-sized molecules.
2. Molecules move in random directions with a range of speeds.
3. All collisions are perfectly elastic.
4. No intermolecular forces (except during collision).
5. Time of collision is negligible compared to time between collisions.

**Pressure from kinetic theory:** P = ⅓ρ<c²> = Nm<c²>/3V.
Average KE of a molecule = ³/₂kT.

**Next step:** A gas occupies 2 L at 27°C and 100 kPa. Find its volume at 127°C and 200 kPa.`,
  },

  // ============================================================
  // CURRENT ELECTRICITY
  // ============================================================

  {
    keywords: [
      "electric current", "ohm's law", "resistance", "potential difference",
      "voltage", "emf", "series circuit", "parallel circuit", "Kirchhoff",
      "internal resistance",
    ],
    mode: "study",
    answer: `Current electricity involves the controlled flow of electric charge through conductors.

**Electric current (I):** Rate of flow of charge. I = Q/t. Unit: Ampere (A).
Conventional current flows from + to −; electron flow is opposite.

**Potential difference (V):** Work done per unit charge moved between two points. V = W/Q. Unit: Volt (V).

**Resistance (R):** Opposition to current flow. Unit: Ohm (Ω).

**Ohm's Law:** V = IR (at constant temperature). A linear I-V graph confirms ohmic behaviour.

**Resistors in series:** R_total = R₁ + R₂ + R₃. Same current, voltages add.
**Resistors in parallel:** 1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Same voltage, currents add.

**EMF (ε):** Total energy per unit charge supplied by a source. ε = V + Ir (V = terminal voltage, r = internal resistance). When I → 0: V → ε.

**Kirchhoff's First Law (Junction Rule):** ΣI entering = ΣI leaving (conservation of charge).
**Kirchhoff's Second Law (Loop Rule):** ΣV around any closed loop = 0 (conservation of energy).

**Wheatstone Bridge:** Circuit for accurate resistance measurement. Balanced when: R₁/R₂ = R₃/R₄ (no current through galvanometer).

**Next step:** Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel. Find total resistance. What current flows from a 12 V battery with negligible internal resistance?`,
  },

  {
    keywords: [
      "electrical power", "electrical energy", "joule heating",
      "fuse", "circuit breaker", "earthing", "household electricity",
      "kilowatt-hour", "electricity cost", "safety in electricity",
    ],
    mode: "study",
    answer: `Understanding electrical power and energy is essential for both problem-solving and everyday safety.

**Electrical power:** P = IV = I²R = V²/R. Unit: Watt (W).

**Electrical energy:** E = Pt = IVt. Unit: Joule (J) or kilowatt-hour (kWh).
1 kWh = 3.6 × 10⁶ J.
Cost of electricity = Energy (kWh) × rate per kWh.

**Joule's Law (Heating effect):** H = I²Rt. Heat is generated when current flows through a resistance. Used in: heaters, irons, light bulb filaments, electric cookers.

**Safety devices:**
- **Fuse:** thin wire melts when current exceeds rated value. Connected in LIVE wire. Always use correct rating.
- **Circuit breaker:** electromagnetic switch; trips when overloaded. Resets easily.
- **Earth wire (green-yellow):** connects casing to earth. Prevents electric shock if casing becomes live.
- **RCD (Residual Current Device):** detects imbalance between live and neutral currents (as small as 30 mA); disconnects instantly.
- **Double insulation:** no earth wire needed if appliance has plastic casing. Marked ⬚⬚.

**Household wiring (three-pin plug):**
- Live (Brown): high potential, carries current
- Neutral (Blue): return path, near zero potential
- Earth (Green-Yellow): safety

**Next step:** A 1200 W kettle is used for 10 minutes daily for 30 days. Calculate energy in kWh and cost at ₦100/kWh.`,
  },

  {
    keywords: [
      "resistivity", "factors affecting resistance", "ohmic conductor",
      "non-ohmic conductor", "thermistor", "light dependent resistor",
      "LDR", "semiconductor",
    ],
    mode: "study",
    answer: `Resistance depends on the material type, its dimensions, and temperature.

**Resistivity (ρ):** An intrinsic property of the material. R = ρL/A.
Unit: Ω·m. Low ρ = good conductor. High ρ = insulator.

**Factors affecting resistance:**
- Length: R ∝ L (longer wire, more resistance)
- Cross-sectional area: R ∝ 1/A (thicker wire, less resistance)
- Material: different ρ values
- Temperature: metals increase R with temperature (positive temperature coefficient). Semiconductors decrease R with temperature (negative temperature coefficient).

**Ohmic conductors:** Constant resistance. V-I graph is a straight line through the origin. Example: metal wire at constant temperature.

**Non-ohmic conductors:**
- **Filament lamp:** resistance increases as temperature rises (non-linear I-V curve)
- **Diode:** very low resistance in forward bias; very high in reverse bias
- **Thermistor (NTC):** resistance decreases with temperature. Used in temperature sensors, thermostats.
- **LDR (Light Dependent Resistor):** resistance decreases with increasing light intensity. Used in light sensors, automatic street lights.

**Superconductivity:** Below a critical temperature, some materials show zero resistance. Used in MRI machines, maglev trains, particle accelerators.

**Next step:** Explain why the resistance of a filament lamp measured when cold differs from when the lamp is on.`,
  },

  // ============================================================
  // MAGNETISM
  // ============================================================

  {
    keywords: [
      "magnetism", "magnetic poles", "properties of magnets",
      "types of magnets", "ferromagnetic", "domain theory",
      "making a magnet", "demagnetising",
    ],
    mode: "study",
    answer: `Magnetism is a fundamental force arising from moving electric charges and the spin of electrons.

**Properties of magnets:**
- Two poles: North (N) and South (S). Like poles repel; unlike poles attract.
- Magnetic poles cannot be isolated — cutting always creates two new poles.
- Magnets attract ferromagnetic materials.

**Magnetic materials:**
- **Ferromagnetic:** strongly attracted (iron, nickel, cobalt, steel). Form permanent magnets.
- **Paramagnetic:** weakly attracted (aluminium, platinum, oxygen).
- **Diamagnetic:** weakly repelled (copper, water, bismuth).

**Permanent magnets:** Steel (hard magnetic material) — difficult to magnetise but retains magnetism.
**Temporary magnets:** Soft iron — easily magnetised and demagnetised. Used in electromagnets.

**Domain theory:** Atoms act as tiny magnets due to electron spin. In magnetic materials, groups of atoms align forming domains. Unmagnetised: domains point randomly (cancel). Magnetised: domains align in same direction.

**Magnetising methods:**
- Stroking with a permanent magnet (single touch method)
- Placing in a solenoid carrying DC
- Hammering while aligned with Earth's field

**Demagnetising methods:**
- Heating to Curie temperature (iron: ~768°C)
- Hammering randomly
- Placing in a solenoid carrying AC (gradually reduced to zero)

**Next step:** Explain why soft iron is preferred for electromagnets and steel for permanent magnets.`,
  },

  {
    keywords: [
      "magnetic field due to current", "right hand rule", "solenoid",
      "electromagnet", "force on current in magnetic field",
      "motor effect", "BIL formula", "Fleming's left hand rule",
    ],
    mode: "study",
    answer: `A current-carrying conductor produces a magnetic field and experiences a force in an external magnetic field.

**Magnetic field of a straight wire:** Concentric circles around the wire. Direction: right-hand grip rule (thumb = current direction; fingers = field direction).

**Magnetic field of a solenoid:** Resembles a bar magnet. Right-hand grip rule: curl fingers in direction of current in coils; thumb points to North pole.

**Electromagnet:** Solenoid with a soft iron core. Increasing current, turns, or using a better core material increases magnetic strength. Soft iron core intensifies field. Widely used in: electric bells, relays, transformers, MRI machines.

**Force on a current-carrying conductor in a magnetic field:**
F = BIL sinθ
B = magnetic flux density (T), I = current (A), L = length in field (m), θ = angle between I and B.
Maximum when θ = 90° (conductor perpendicular to field). Zero when parallel to field.

**Direction: Fleming's Left-Hand Rule:**
- **F**irst finger = field direction (B)
- **Se**cond finger = conventional current direction (I)
- **Th**umb = direction of force/motion (F)

**Electric motor:** Uses force on current-carrying coil in a magnetic field to produce rotation. Split-ring commutator reverses current every half-turn to maintain rotation in one direction.

**Next step:** A wire 0.5 m long carries 4 A at right angles to a 0.3 T magnetic field. Find the force on it.`,
  },

  // ============================================================
  // ELECTROMAGNETIC INDUCTION
  // ============================================================

  {
    keywords: [
      "electromagnetic induction", "faraday's law", "lenz's law",
      "induced EMF", "induced current", "generator", "transformer",
      "AC generator", "DC generator", "alternating current",
    ],
    mode: "study",
    answer: `Electromagnetic induction is the generation of an EMF when the magnetic flux through a circuit changes.

**Faraday's Law:** The magnitude of the induced EMF is proportional to the rate of change of magnetic flux linkage.
ε = −N × dΦ/dt (N = turns, Φ = magnetic flux = BA)

**Lenz's Law:** The induced current flows in a direction to oppose the change causing it. (Conservation of energy.) This gives the negative sign in Faraday's law.

**Factors increasing induced EMF:**
- Increasing speed of relative motion
- Stronger magnet (larger B)
- More turns in the coil
- Using iron core (concentrates flux)

**AC Generator:** Coil rotates in a magnetic field. EMF = NBAω sinωt (sinusoidal). Slip rings maintain contact and allow AC output.

**DC Generator:** Uses a split-ring commutator to produce pulsating DC.

**Transformer:** Changes AC voltage levels using mutual induction.
Vₛ/Vₚ = Nₛ/Nₚ and Vₛ/Vₚ = Iₚ/Iₛ (ideal transformer, 100% efficiency).
- Step-up: Nₛ > Nₚ → increases voltage, decreases current.
- Step-down: Nₛ < Nₚ → decreases voltage, increases current.
Efficiency = (Iₛ Vₛ / Iₚ Vₚ) × 100%.

**Why transformers need AC:** DC produces constant flux — no change, no induced EMF. AC continuously changes → continuously changing flux → sustained EMF.

**National grid:** Power transmitted at very high voltage (low current) to reduce I²R losses. Step-up transformers at power station, step-down at end user.

**Next step:** A step-up transformer has 200 primary turns and 2000 secondary turns. If 240 V AC is applied, find the output voltage and current ratio.`,
  },

  // ============================================================
  // CAPACITORS
  // ============================================================

  {
    keywords: [
      "capacitor", "capacitance", "energy stored in capacitor",
      "capacitors in series", "capacitors in parallel",
      "uses of capacitors", "dielectric",
    ],
    mode: "study",
    answer: `A capacitor stores electric charge and energy in an electric field between two conducting plates.

**Capacitance (C):** C = Q/V. Unit: Farad (F). Practical units: μF (10⁻⁶ F), pF (10⁻¹² F).

**Parallel plate capacitor:** C = ε₀εᵣA/d.
- C increases with: larger plate area (A), smaller separation (d), dielectric material (εᵣ > 1).

**Dielectric:** Insulating material between plates. Increases C by reducing effective electric field. Examples: air, paper, mica, ceramic.

**Energy stored:** E = ½CV² = ½QV = Q²/2C. Unit: Joule.

**Capacitors in parallel:** C_total = C₁ + C₂ + C₃. (Same voltage; charges add.) Use when you want larger capacitance.

**Capacitors in series:** 1/C_total = 1/C₁ + 1/C₂ + 1/C₃. (Same charge; voltages add.) Total capacitance is less than the smallest individual capacitor.

**Charging and discharging:**
- Charging: V = V₀(1 − e^(−t/RC)), Q = Q₀(1 − e^(−t/RC))
- Discharging: V = V₀e^(−t/RC), Q = Q₀e^(−t/RC)
- Time constant: τ = RC (time for charge to reach 63% of maximum when charging, or fall to 37% when discharging).

**Uses:** Smoothing rectified DC, timing circuits, flash photography, radio tuning, defibrillators, filters.

**Next step:** Two capacitors of 4 μF and 6 μF are connected in series across 12 V. Find total capacitance, total charge, and voltage across each.`,
  },

  // ============================================================
  // ELECTRONICS
  // ============================================================

  {
    keywords: [
      "electronics", "diode", "transistor", "rectification",
      "semiconductor", "p-type", "n-type", "p-n junction",
      "half wave rectification", "full wave rectification", "logic gates",
    ],
    mode: "study",
    answer: `Electronics involves controlling electric current using semiconductor devices.

**Semiconductors:** Conductivity between conductors and insulators. Silicon (Si) and germanium (Ge) are most common.
- **n-type:** doped with pentavalent atoms (e.g. phosphorus) — extra free electrons are majority carriers.
- **p-type:** doped with trivalent atoms (e.g. boron) — positive "holes" are majority carriers.

**p-n junction diode:** Allows current in one direction only.
- Forward biased: p to +, n to − → conducts (threshold ~0.6 V for silicon).
- Reverse biased: very high resistance, negligible current (until breakdown voltage).

**Rectification:** Converting AC to DC.
- Half-wave: one diode — uses only positive half-cycles. Pulsating DC.
- Full-wave bridge: four diodes in bridge → uses both half-cycles. Smoother DC.
- Smoothing: capacitor in parallel with load reduces ripple.

**Transistor (BJT):** NPN or PNP. Three terminals: Base (B), Collector (C), Emitter (E).
- Small base current (IB) controls large collector current (IC). IC = hFE × IB.
- As switch: small signal turns large current on/off.
- As amplifier: small input signal → large output signal.

**Logic gates:**
- AND: Y = 1 only if A = 1 AND B = 1
- OR: Y = 1 if A = 1 OR B = 1 (or both)
- NOT: Y = opposite of A
- NAND = AND + NOT; NOR = OR + NOT; XOR: Y = 1 if inputs differ

**Next step:** Draw the truth table for a NAND gate and show how a NAND gate can be used to construct a NOT gate.`,
  },

  // ============================================================
  // ATOMIC AND NUCLEAR PHYSICS
  // ============================================================

  {
    keywords: [
      "atomic structure", "nucleus", "proton", "neutron", "electron",
      "atomic number", "mass number", "isotopes", "nuclide notation",
      "electron shells", "Bohr model",
    ],
    mode: "study",
    answer: `The atom has a tiny, dense nucleus surrounded by electrons in quantised energy levels.

**Atomic structure:**
- **Nucleus:** protons (positive charge, +e) and neutrons (neutral). Contains almost all the mass.
- **Electrons:** orbit the nucleus in discrete energy levels (shells). Charge = −e.

**Key definitions:**
- **Atomic number (Z):** number of protons. Defines the element.
- **Mass number (A):** protons + neutrons (nucleons).
- **Neutron number:** N = A − Z.

**Nuclide notation:** ᴬZX — A above Z before symbol X.

**Isotopes:** Same element (same Z), different mass numbers (different N). Same chemical properties, different physical properties. Example: ¹²₆C, ¹³₆C, ¹⁴₆C.

**Bohr model:**
- Electrons occupy fixed circular orbits of fixed energy.
- An electron absorbs a photon to jump to a higher level (excitation).
- An electron emits a photon when falling to a lower level.
- Energy of photon: E = hf = hc/λ.
- Hydrogen energy levels: Eₙ = −13.6/n² eV.

**Electron configuration rule:** Shell 1: max 2 electrons. Shell 2: max 8. Shell 3: max 8 (up to Ca).

**Line emission spectra:** Each element produces a unique set of spectral lines — like a fingerprint. Used in spectroscopy to identify elements.

**Next step:** Write the electron configuration of sodium (Z = 11) and explain why it has one electron in its outermost shell.`,
  },

  {
    keywords: [
      "radioactivity", "alpha decay", "beta decay", "gamma radiation",
      "half-life", "radioactive decay", "nuclear equation",
      "properties of alpha beta gamma", "uses of radioactivity",
      "background radiation",
    ],
    mode: "study",
    answer: `Radioactivity is the spontaneous, random emission of radiation from unstable atomic nuclei.

**Properties of the three types:**

| Property | Alpha (α) | Beta (β) | Gamma (γ) |
|---|---|---|---|
| Nature | ²₄He nucleus | Fast electron (β⁻) or positron (β⁺) | EM wave (photon) |
| Charge | +2 | −1 (β⁻) or +1 (β⁺) | 0 |
| Penetration | Stopped by paper/few cm air | Stopped by ~3 mm aluminium | Reduced by several cm lead |
| Ionising power | Highest | Moderate | Lowest |
| Deflection | Toward −ve plate | Toward +ve plate (β⁻) | Not deflected |

**Nuclear equations:**
- Alpha: ᴬZX → ᴬ⁻⁴Z₋₂Y + ⁴₂He (A decreases by 4, Z decreases by 2)
- Beta-minus: ᴬZX → ᴬZ₊₁Y + ⁰₋₁e + v̄ (A unchanged, Z increases by 1)
- Gamma: no change in A or Z — just energy release

**Half-life (t½):** Time for half the radioactive nuclei to decay. N = N₀(½)^(t/t½).
A = A₀(½)^(t/t½) where A = activity (decays per second).

**Background radiation:** Natural radiation from: cosmic rays, radon gas, rocks (granite), food, medical procedures. About 85% from natural sources.

**Uses of radioactivity:**
- Alpha: smoke detectors (Americium-241)
- Beta: measuring paper/metal thickness; treating eye cancer
- Gamma: cancer radiotherapy (Co-60); sterilising medical equipment; food preservation; tracing leaks in pipes; non-destructive testing
- Carbon-14 dating: t½ = 5730 years — dating organic remains up to ~50,000 years
- Uranium/potassium-argon dating: for very old rocks

**Safety measures:** Lead shielding, distance, short exposure times, protective clothing, dosimeters.

**Next step:** A radioactive sample has half-life 4 days and initial activity 1600 Bq. Find activity after 12 days.`,
  },

  {
    keywords: [
      "nuclear fission", "nuclear fusion", "chain reaction", "nuclear energy",
      "mass defect", "binding energy", "E = mc2", "nuclear reactor",
      "nuclear power station",
    ],
    mode: "study",
    answer: `Nuclear reactions convert tiny amounts of mass into enormous amounts of energy.

**Einstein's Mass-Energy Equivalence:** E = mc². (c = 3 × 10⁸ m/s)
Even a small mass converts to vast energy.

**Mass defect (Δm):** The mass of a nucleus is always less than the sum of its separate nucleons. This "missing" mass is the binding energy: E = Δmc².

**Binding energy per nucleon:** Energy needed to completely separate one nucleon from the nucleus. Iron-56 (Fe-56) has the highest binding energy per nucleon — most stable nucleus. Elements below Fe can release energy by fusion; elements above Fe can release energy by fission.

**Nuclear Fission:** A heavy nucleus splits into two medium-sized nuclei when struck by a slow (thermal) neutron, releasing energy + 2 or 3 neutrons.
²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3¹₀n + energy (~200 MeV)
A chain reaction results if sufficient fissile material is present (critical mass).

**Nuclear reactor components:**
- **Fuel:** enriched uranium (U-235) pellets
- **Moderator:** slows neutrons (water, heavy water, graphite)
- **Control rods:** absorb neutrons to control reaction rate (boron or cadmium). Fully inserted = shut down.
- **Coolant:** removes heat from core (water, CO₂, liquid sodium) → drives steam turbines
- **Biological shielding:** thick concrete and lead absorb radiation

**Nuclear Fusion:** Light nuclei combine to form a heavier nucleus, releasing more energy per kg than fission.
²₁H + ³₁H → ⁴₂He + ¹₀n + 17.6 MeV
Requires temperature of ~10⁸ K (plasma state). Powers stars including the Sun. Fuel (hydrogen isotopes) is virtually unlimited. No long-lived radioactive waste. ITER project working toward practical fusion reactors.

**Comparison Fission vs Fusion:**
- Fission: used in power stations today; produces radioactive waste; uses uranium.
- Fusion: used in H-bombs; potential clean energy; uses hydrogen isotopes; not yet commercially viable.

**Next step:** Explain why a critical mass is needed for a nuclear chain reaction and how control rods prevent a reactor from going supercritical.`,
  },

  // ============================================================
  // PHOTOELECTRIC EFFECT AND QUANTUM PHYSICS
  // ============================================================

  {
    keywords: [
      "photoelectric effect", "photon", "work function", "threshold frequency",
      "Einstein photoelectric equation", "quantum physics",
      "wave-particle duality", "Planck's constant",
    ],
    mode: "study",
    answer: `The photoelectric effect demonstrates the particle nature of light and is the foundation of quantum physics.

**Photoelectric effect:** When light above a threshold frequency falls on a metal surface, electrons (photoelectrons) are emitted immediately.

**Observations that classical wave theory CANNOT explain:**
1. No emission below threshold frequency (regardless of intensity)
2. KE of emitted electrons depends on frequency, not intensity
3. Increasing intensity increases number of electrons (not their KE)
4. Emission is instantaneous

**Einstein's explanation (photon model):**
Light consists of photons, each with energy E = hf.
One photon ejects one electron.

**Einstein's Photoelectric Equation:**
hf = φ + ½mv²_max
- h = Planck's constant = 6.63 × 10⁻³⁴ J·s
- f = frequency of incident light
- φ = work function = minimum energy to remove an electron = hf₀
- ½mv² = maximum KE of emitted photoelectron

**Threshold frequency (f₀):** Minimum frequency for emission. hf₀ = φ → f₀ = φ/h.

**Stopping potential (V₀):** Voltage needed to stop the fastest electrons. eV₀ = ½mv²_max.

**Wave-particle duality:** Light behaves as waves (interference, diffraction) and as particles (photoelectric effect, Compton scattering). Matter also shows wave behaviour: de Broglie wavelength λ = h/mv.

**Applications:** Solar cells, photodiodes, CCDs in cameras, photomultiplier tubes, burglar alarms.

**Next step:** Light of frequency 8 × 10¹⁴ Hz falls on a metal surface with work function 3.0 × 10⁻¹⁹ J. Calculate the maximum KE of emitted electrons and the stopping potential.`,
  },

  // ============================================================
  // X-RAYS
  // ============================================================

  {
    keywords: [
      "X-rays", "production of X-rays", "properties of X-rays",
      "uses of X-rays", "X-ray tube", "medical X-rays", "X-ray diffraction",
    ],
    mode: "study",
    answer: `X-rays are high-frequency electromagnetic waves produced when fast electrons are rapidly decelerated.

**Production (X-ray tube):**
1. Cathode heated → thermionic emission of electrons
2. High voltage (30–150 kV) accelerates electrons toward the anode (tungsten target)
3. Electrons rapidly decelerate on striking anode → X-rays produced (Bremsstrahlung radiation)
4. Most electron energy → heat (hence anode is cooled by rotating disc or water cooling)
5. Tube is evacuated to prevent collisions

**Maximum X-ray frequency:** hf_max = eV (all electron energy into one photon).

**Properties of X-rays:**
- Travel at speed of light in straight lines
- Not deflected by electric or magnetic fields
- Ionise matter
- Affect photographic film and cause fluorescence
- Penetrate soft tissue but absorbed by bone and metal
- Cause damage to living cells (mutagenic, carcinogenic)

**Soft X-rays:** Lower energy, less penetrating.
**Hard X-rays:** Higher energy, more penetrating.

**Uses:**
- Medical: diagnosing bone fractures, chest infections, dental problems
- CT (Computed Tomography) scan: multiple X-ray images from different angles → 3D cross-sections
- Cancer radiotherapy (high-energy X-rays)
- Industrial: detecting cracks in metals, welding inspection
- Security: airport luggage scanning
- Scientific: X-ray crystallography (determining crystal/DNA structure — Watson & Crick/Rosalind Franklin)

**Next step:** Explain why X-rays can show bone structure clearly in medical imaging but cannot easily distinguish between different types of soft tissue.`,
  },

  // ============================================================
  // SURFACE TENSION AND VISCOSITY
  // ============================================================

  {
    keywords: [
      "surface tension", "cohesion", "adhesion", "capillarity",
      "viscosity", "terminal velocity", "Stokes law",
      "meniscus", "why water forms droplets",
    ],
    mode: "study",
    answer: `Surface tension and viscosity are properties arising from intermolecular forces in liquids.

**Surface tension:** The property of a liquid surface that makes it behave like a stretched elastic membrane. Caused by unbalanced cohesive forces on surface molecules.

**Cohesion:** Attractive forces between like molecules (e.g. water–water).
**Adhesion:** Attractive forces between unlike molecules (e.g. water–glass).

**Manifestations of surface tension:**
- Spherical water droplets (minimum surface area for a given volume)
- Insects walking on water (water striders)
- Soap films, water meniscus in capillary

**Capillarity:** Rise or fall of liquid in a narrow tube.
- Water in glass: adhesion > cohesion → concave meniscus → liquid rises. h = 2γcosθ/(ρgr).
- Mercury in glass: cohesion > adhesion → convex meniscus → liquid is depressed.

**Surfactants (detergents/soap):** Reduce surface tension by disrupting cohesive bonds. Allows water to wet surfaces better.

**Viscosity (η):** Resistance of a fluid to flow. Thick fluids (honey, oil) have high viscosity. Viscosity of liquids decreases with temperature; viscosity of gases increases with temperature.

**Terminal velocity:** When a sphere falls through a viscous fluid, drag force increases until: Weight = Upthrust + Viscous drag (Stokes' Law: F = 6πηrv). At this point, acceleration = 0 and terminal velocity is reached.

**Next step:** Explain why a small steel ball takes longer to reach terminal velocity in oil than in water.`,
  },

  // ============================================================
  // MOMENTUM AND COLLISIONS
  // ============================================================

  {
    keywords: [
      "momentum", "conservation of momentum", "collision",
      "elastic collision", "inelastic collision", "impulse",
      "law of conservation of momentum", "recoil",
    ],
    mode: "study",
    answer: `Momentum is the product of mass and velocity — a vector quantity central to analysing collisions.

**Momentum:** p = mv. Unit: kg·m/s or N·s.

**Impulse:** Change in momentum. J = FΔt = Δp = m(v − u).
Impulse-momentum theorem: a large force for a short time = small force for long time.
This is the principle behind airbags (increase Δt → reduce F) and crumple zones.

**Law of Conservation of Momentum:** In the absence of external forces, total momentum of a system is constant.
m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂

**Types of collisions:**
- **Elastic:** both momentum AND kinetic energy conserved. Bodies separate. Rarely occurs in practice (ideal billiard balls, atomic/subatomic particles).
- **Inelastic:** momentum conserved; KE is NOT conserved (lost as heat, sound, deformation). Most real collisions.
- **Perfectly inelastic:** bodies stick together. Maximum KE loss. Common velocity: v = (m₁u₁ + m₂u₂)/(m₁ + m₂).

**Conditions for elastic collision:**
m₁(u₁ − v₁) = m₂(v₂ − u₂) and u₁ + v₁ = u₂ + v₂.

**Recoil:** Gun firing a bullet. Initial momentum = 0. After: m_bullet × v_bullet + m_gun × v_gun = 0 → gun recoils backward.

**Next step:** A 2 kg trolley moving at 5 m/s collides and joins with a stationary 3 kg trolley. Find their common velocity and the kinetic energy lost.`,
  },

  // ============================================================
  // ENERGY SOURCES
  // ============================================================

  {
    keywords: [
      "energy sources", "renewable energy", "non-renewable energy",
      "solar energy", "wind energy", "hydroelectric", "fossil fuels",
      "biomass", "geothermal", "energy in Africa", "nuclear energy",
    ],
    mode: "study",
    answer: `Energy sources are either renewable (naturally replenished) or non-renewable (finite).

**Non-renewable sources:**
- **Fossil fuels:** Coal, crude oil, natural gas. Formed from compressed organic matter over millions of years. High energy density. Major producers of CO₂ → climate change.
- **Nuclear fuel (uranium/plutonium):** Enormous energy from fission. Finite resource. Produces radioactive waste.

**Renewable sources:**

**Solar energy:** Photovoltaic cells convert sunlight to electricity. Solar thermal systems heat water directly. Africa receives among the highest solar radiation globally — enormous untapped potential. Cost of solar PV falling rapidly.

**Wind energy:** Kinetic energy of wind drives turbines. Good coastal and highland regions in Africa (South Africa, Morocco, Kenya, Ethiopia).

**Hydroelectric power (HEP):** Gravitational PE of water drives turbines. Major African installations: Aswan High Dam (Egypt), Kariba Dam (Zambia/Zimbabwe), Akosombo Dam (Ghana), Grand Ethiopian Renaissance Dam (Ethiopia), Grand Inga (DRC potential). Clean but depends on rainfall and has ecological impacts.

**Biomass:** Burning wood, charcoal, agricultural waste, animal dung. Most widely used energy source in rural Africa. Contributes to deforestation if not managed sustainably. Biogas from organic waste is a cleaner alternative.

**Geothermal:** Heat from Earth's interior. Kenya leads in Africa — geothermal provides ~45% of Kenya's electricity. Significant potential along the East African Rift Valley.

**Tidal and wave energy:** Limited development in Africa. Potential along South African and West African coasts.

**Africa's energy challenges:**
- ~600 million people lack electricity access (mostly sub-Saharan Africa)
- Heavy reliance on biomass for cooking → indoor air pollution
- Rapid electrification using solar mini-grids and off-grid systems
- ECOWAS, SADC, East African Power Pool working toward regional integration

**Next step:** Discuss the advantages and disadvantages of hydroelectric power compared to solar power for electricity generation in East Africa.`,
  },

  // ============================================================
  // ELECTROSTATICS
  // ============================================================

  {
    keywords: [
      "electrostatics", "electric charge", "static electricity",
      "coulomb's law", "electric field", "electric potential",
      "electrification by friction", "types of charge", "conductors insulators static",
    ],
    mode: "study",
    answer: `Electrostatics is the study of stationary electric charges and the forces between them.

**Types of charge:** Positive (protons) and negative (electrons). Like charges repel; unlike charges attract.

**Basic law of electrostatics:** Like charges repel; unlike charges attract each other.

**Electrification by friction:** When two materials are rubbed together, electrons transfer from one to the other. The one gaining electrons becomes negatively charged; the one losing electrons becomes positively charged. Examples: plastic rod on dry hair, rubber balloon on wool.

**Conductors:** Allow free movement of electrons. Examples: metals, graphite, salt solutions.
**Insulators:** Restrict charge movement. Examples: plastic, glass, rubber, dry wood.

**Coulomb's Law:** The electrostatic force between two point charges is proportional to the product of the charges and inversely proportional to the square of the distance between them.
F = kQ₁Q₂/r² where k = 9 × 10⁹ Nm²/C².

**Electric field (E):** Force per unit positive charge. E = F/Q = kQ/r² for a point charge.
Unit: N/C or V/m. Field lines point from positive to negative charges.

**Electric potential (V):** Work done per unit positive charge moved from infinity to that point. V = kQ/r. Unit: Volt (V).

**Earthing (grounding):** Connecting a charged body to earth allows charges to flow to/from earth — discharges the body.

**Van de Graaff generator:** Accumulates large static charge on a dome. Demonstrates high-voltage electrostatics effects.

**Lightning:** Natural electrostatic discharge between charged clouds and earth. Lightning conductor (pointed metal rod connected to earth) provides a safe path for discharge.

**Next step:** Two charges of +3 μC and −5 μC are placed 0.3 m apart. Calculate the electrostatic force between them and state whether it is attractive or repulsive.`,
  },

  // ============================================================
  // CURRENT AND ALTERNATING CURRENT
  // ============================================================

  {
    keywords: [
      "alternating current", "AC", "DC", "direct current",
      "frequency of AC", "peak voltage", "RMS voltage",
      "peak current", "RMS current", "AC vs DC",
    ],
    mode: "study",
    answer: `Electric current can be either direct (DC) or alternating (AC), each with distinct properties.

**Direct Current (DC):** Current flows in one direction only. Produced by batteries and DC generators. Used in electronic devices, charging batteries.

**Alternating Current (AC):** Current continuously reverses direction. Produced by AC generators. Mains supply in most of Africa is 50 Hz (in some areas 60 Hz). Form: sinusoidal.

**AC voltage:** V = V₀ sinωt. V₀ = peak voltage. ω = 2πf.
**AC current:** I = I₀ sinωt. I₀ = peak current.

**RMS (Root Mean Square) values:** The equivalent DC values for the same power dissipation.
- V_rms = V₀/√2 ≈ 0.707 V₀
- I_rms = I₀/√2 ≈ 0.707 I₀

**Mains supply in Africa:**
- Most countries: 220–240 V RMS, 50 Hz (Nigeria, Kenya, South Africa, Ghana, etc.)
- Some: 110–120 V, 60 Hz (parts of North Africa with US influence)

**Power in AC circuits:** P = V_rms × I_rms × cosφ (cosφ = power factor; = 1 for purely resistive circuits).
P = ½V₀I₀ for purely resistive load.

**Why AC is used for power transmission:**
- Easy to step voltage up and down using transformers
- High voltage → low current → less I²R power loss in transmission cables
- More economical over long distances

**Next step:** The mains voltage in Nigeria is 240 V RMS, 50 Hz. Find the peak voltage and the peak current drawn by a 1200 W appliance.`,
  },

  // ============================================================
  // GRAVITATIONAL, ELECTRIC AND MAGNETIC FIELDS
  // ============================================================

  {
    keywords: [
      "field", "gravitational field", "electric field comparison",
      "magnetic field comparison", "field lines", "field strength",
      "radial field", "uniform field",
    ],
    mode: "study",
    answer: `Physics describes forces acting at a distance through the concept of fields.

**Gravitational field:**
- Exists around any mass
- Always attractive
- Field strength g = GM/r² (N/kg or m/s²)
- Field lines: radially inward toward the mass
- Uniform near Earth's surface

**Electric field:**
- Exists around any electric charge
- Can be attractive or repulsive (unlike charges attract, like repel)
- Field strength E = kQ/r² = F/Q (N/C)
- Field lines: from + to −; radial for point charges; uniform between parallel plates
- Uniform field between parallel plates: E = V/d

**Magnetic field:**
- Exists around magnets and current-carrying conductors
- Neither attractive nor repulsive in the simple sense — exerts force on moving charges and current-carrying conductors
- Field strength B (Tesla)
- Field lines: from N to S outside magnet; never cross; closer lines = stronger field

**Comparing fields:**
| Property | Gravitational | Electric | Magnetic |
|---|---|---|---|
| Acts on | Mass | Charge | Moving charge / current |
| Can be shielded? | No | Yes (Faraday cage) | Partially |
| Attractive or repulsive | Attractive only | Both | Neither directly |

**Faraday cage:** A conducting enclosure that shields its interior from external electric fields. Used to protect sensitive electronics.

**Next step:** Explain why a gravitational field is always attractive while an electric field can be both attractive and repulsive.`,
  },

  // ============================================================
  // THERMODYNAMICS LAWS
  // ============================================================

  {
    keywords: [
      "first law of thermodynamics", "second law of thermodynamics",
      "internal energy", "thermodynamic processes", "heat engine",
      "Carnot engine", "entropy", "thermal efficiency",
    ],
    mode: "study",
    answer: `Thermodynamics governs the relationship between heat, work, and internal energy.

**Internal Energy (U):** Total kinetic and potential energy of all particles in a substance. Increases with temperature.

**First Law of Thermodynamics:** Energy is conserved.
ΔU = Q − W
Where: ΔU = change in internal energy, Q = heat added to system (+) or removed (−), W = work done by system (+) or on system (−).

**Thermodynamic processes:**
- **Isothermal:** Constant temperature. ΔU = 0 → Q = W.
- **Adiabatic:** No heat exchange (Q = 0). ΔU = −W.
- **Isobaric:** Constant pressure.
- **Isochoric (Isovolumetric):** Constant volume. W = 0 → ΔU = Q.

**Second Law of Thermodynamics:**
Heat flows spontaneously from hot to cold, never the reverse. It is impossible to convert heat entirely into work without any other effect. Entropy of an isolated system tends to increase.

**Heat engine:** Converts heat to work. Operates between hot source (T_H) and cold sink (T_C).
Thermal efficiency: η = W/Q_H = 1 − Q_C/Q_H

**Carnot efficiency (maximum theoretical):** η_Carnot = 1 − T_C/T_H (temperatures in Kelvin). No real engine achieves Carnot efficiency.

**Entropy (S):** Measure of disorder. ΔS = Q/T. Increases in all natural processes.

**Next step:** A heat engine receives 5000 J from a hot reservoir at 600 K and rejects heat to a cold reservoir at 300 K. Find the maximum efficiency and maximum work output.`,
  },

];
