import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowLeft, CheckCircle, Circle, Leaf, Beaker, Zap, Globe, ChevronRight, FileText, Lightbulb, Target, X, ClipboardList, Award, Trophy, Star, Flame, Brain, Sparkles } from 'lucide-react';

// Diagram Components
const LewisDotDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Lewis Dot Diagram Examples</h4>
    <div className="flex justify-around items-center flex-wrap gap-8">
      {[
        { symbol: 'H', dots: 1, name: 'Hydrogen', group: 1 },
        { symbol: 'C', dots: 4, name: 'Carbon', group: 14 },
        { symbol: 'N', dots: 5, name: 'Nitrogen', group: 15 },
        { symbol: 'O', dots: 6, name: 'Oxygen', group: 16 },
        { symbol: 'F', dots: 7, name: 'Fluorine', group: 17 },
        { symbol: 'Ne', dots: 8, name: 'Neon', group: 18 }
      ].map((element) => (
        <div key={element.symbol} className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">{element.symbol}</span>
              </div>
            </div>
            {/* Draw dots around the symbol */}
            {Array.from({ length: element.dots }).map((_, i) => {
              const angle = (i * 360) / 8 + 45; // Distribute evenly, starting from top-right
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 35 * Math.cos(rad);
              const y = 50 + 35 * Math.sin(rad);
              return (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-red-500 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                />
              );
            })}
          </div>
          <p className="text-sm font-medium text-gray-600">{element.name}</p>
          <p className="text-xs text-gray-500">{element.dots} valence e⁻</p>
          <p className="text-xs text-blue-600 font-semibold">Group {element.group}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-800 text-center">
        <span className="font-bold">Key Point:</span> The number of dots = number of valence electrons = group number (for main groups)
      </p>
    </div>
  </div>
);

const PhotosynthesisDiagram = () => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Photosynthesis Equation</h4>
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Reactants */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6CO₂</p>
            <p className="text-xs">Carbon Dioxide</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Air</p>
      </div>

      <div className="text-4xl text-gray-400">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6H₂O</p>
            <p className="text-xs">Water</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Soil</p>
      </div>

      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
          <p className="text-white text-2xl">☀️</p>
        </div>
        <p className="text-xs text-gray-600 mt-1">Sunlight Energy</p>
      </div>

      <div className="text-4xl text-green-600">→</div>

      {/* Products */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-2xl font-bold">C₆H₁₂O₆</p>
            <p className="text-xs">Glucose</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Sugar (Food)</p>
      </div>

      <div className="text-4xl text-gray-400">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6O₂</p>
            <p className="text-xs">Oxygen</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released to Air</p>
      </div>
    </div>

    <div className="mt-6 bg-green-100 rounded-lg p-4">
      <p className="text-sm text-green-800 text-center">
        <span className="font-bold">Key Point:</span> Plants use sunlight energy to convert CO₂ and water into glucose (their food) and oxygen (which we breathe)!
      </p>
    </div>
  </div>
);

const CellRespirationDiagram = () => (
  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Cellular Respiration Equation</h4>
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Reactants */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-2xl font-bold">C₆H₁₂O₆</p>
            <p className="text-xs">Glucose</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Food</p>
      </div>

      <div className="text-4xl text-gray-400">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6O₂</p>
            <p className="text-xs">Oxygen</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">From Air</p>
      </div>

      <div className="text-4xl text-red-600">→</div>

      {/* Products */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6CO₂</p>
            <p className="text-xs">Carbon Dioxide</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released to Air</p>
      </div>

      <div className="text-4xl text-gray-400">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-cyan-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">6H₂O</p>
            <p className="text-xs">Water</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">Released</p>
      </div>

      <div className="text-4xl text-gray-400">+</div>

      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg mb-2">
          <div className="text-white">
            <p className="text-3xl font-bold">ATP</p>
            <p className="text-xs">Energy</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">For Life!</p>
      </div>
    </div>

    <div className="mt-6 bg-red-100 rounded-lg p-4">
      <p className="text-sm text-red-800 text-center">
        <span className="font-bold">Key Point:</span> Opposite of photosynthesis! Organisms break down glucose with oxygen to release energy (ATP) for living.
      </p>
    </div>
  </div>
);

const FoodChainDiagram = () => (
  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Terrestrial Food Chain Example</h4>
    
    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
      {/* Grass */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-green-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🌾</span>
        </div>
        <p className="font-bold text-green-800">Grass</p>
        <p className="text-xs text-gray-600">Producer</p>
        <p className="text-xs text-green-600 font-bold mt-1">10,000 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Grasshopper */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦗</span>
        </div>
        <p className="font-bold text-yellow-800">Grasshopper</p>
        <p className="text-xs text-gray-600">Primary Consumer</p>
        <p className="text-xs text-yellow-600 font-bold mt-1">1,000 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Mouse */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐭</span>
        </div>
        <p className="font-bold text-orange-800">Mouse</p>
        <p className="text-xs text-gray-600">Secondary Consumer</p>
        <p className="text-xs text-orange-600 font-bold mt-1">100 kcal</p>
      </div>

      <div className="text-3xl text-gray-600">→</div>

      {/* Snake */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-red-500 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐍</span>
        </div>
        <p className="font-bold text-red-800">Snake</p>
        <p className="text-xs text-gray-600">Tertiary Consumer</p>
        <p className="text-xs text-red-600 font-bold mt-1">10 kcal</p>
      </div>
    </div>

    <div className="bg-amber-100 rounded-lg p-4">
      <p className="text-sm text-amber-800 text-center">
        <span className="font-bold">Energy Flow:</span> Notice how only 10% of energy transfers to each level (10,000 → 1,000 → 100 → 10)
      </p>
    </div>
  </div>
);

const AquaticFoodChainDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Aquatic Food Chain Example</h4>
    
    <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
      {/* Phytoplankton */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-green-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦠</span>
        </div>
        <p className="font-bold text-green-800">Phytoplankton</p>
        <p className="text-xs text-gray-600">Producer</p>
        <p className="text-xs text-green-600 font-bold mt-1">50,000 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Small Fish */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐠</span>
        </div>
        <p className="font-bold text-yellow-800">Small Fish</p>
        <p className="text-xs text-gray-600">Primary Consumer</p>
        <p className="text-xs text-yellow-600 font-bold mt-1">5,000 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Medium Fish */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-orange-400 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🐟</span>
        </div>
        <p className="font-bold text-orange-800">Medium Fish</p>
        <p className="text-xs text-gray-600">Secondary Consumer</p>
        <p className="text-xs text-orange-600 font-bold mt-1">500 kcal</p>
      </div>

      <div className="text-3xl text-blue-600">→</div>

      {/* Shark */}
      <div className="text-center">
        <div className="w-32 h-32 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg mb-2">
          <span className="text-6xl">🦈</span>
        </div>
        <p className="font-bold text-blue-100">Shark</p>
        <p className="text-xs text-blue-200">Tertiary Consumer</p>
        <p className="text-xs text-blue-100 font-bold mt-1">50 kcal</p>
      </div>
    </div>

    <div className="bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-800 text-center">
        <span className="font-bold">Ocean Food Chain:</span> Starts with microscopic phytoplankton that use sunlight to make food through photosynthesis
      </p>
    </div>
  </div>
);

const NitrogenCycleDiagram = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">The Nitrogen Cycle</h4>
    <div className="relative h-96">
      <svg viewBox="0 0 500 400" className="w-full h-full">
        {/* Atmosphere */}
        <rect x="200" y="10" width="100" height="60" rx="10" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <text x="250" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1E40AF">Atmosphere</text>
        <text x="250" y="55" textAnchor="middle" fontSize="12" fill="#1E40AF">N₂ Gas (78%)</text>

        {/* Soil/Plants */}
        <rect x="50" y="150" width="100" height="60" rx="10" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <text x="100" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#15803D">Plants</text>
        <text x="100" y="195" textAnchor="middle" fontSize="11" fill="#15803D">Proteins</text>

        {/* Soil */}
        <rect x="200" y="200" width="100" height="60" rx="10" fill="#D97706" stroke="#92400E" strokeWidth="2"/>
        <text x="250" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#78350F">Soil</text>
        <text x="250" y="235" textAnchor="middle" fontSize="11" fill="#78350F">NH₃, NO₃⁻</text>
        <text x="250" y="250" textAnchor="middle" fontSize="10" fill="#78350F">(Bacteria)</text>

        {/* Animals */}
        <rect x="350" y="150" width="100" height="60" rx="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
        <text x="400" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#92400E">Animals</text>
        <text x="400" y="195" textAnchor="middle" fontSize="11" fill="#92400E">Proteins</text>

        {/* Decomposers */}
        <rect x="200" y="320" width="100" height="60" rx="10" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
        <text x="250" y="345" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#5B21B6">Decomposers</text>
        <text x="250" y="365" textAnchor="middle" fontSize="10" fill="#5B21B6">(Bacteria/Fungi)</text>

        {/* Arrows and labels */}
        
        {/* Nitrogen Fixation */}
        <defs>
          <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
          </marker>
          <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>
          <marker id="arrowhead3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
          </marker>
        </defs>

        {/* Fixation: Atmosphere to Soil */}
        <path d="M 230 70 L 230 200" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="190" y="130" fontSize="11" fill="#15803D" fontWeight="bold">Fixation</text>
        <text x="180" y="145" fontSize="9" fill="#15803D">(Lightning/</text>
        <text x="180" y="157" fontSize="9" fill="#15803D">Bacteria)</text>

        {/* Assimilation: Soil to Plants */}
        <path d="M 200 230 L 150 210" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="150" y="225" fontSize="10" fill="#15803D" fontWeight="bold">Assimilation</text>

        {/* Consumption: Plants to Animals */}
        <path d="M 150 180 L 350 180" stroke="#F59E0B" strokeWidth="3" fill="none" markerEnd="url(#arrowhead3)"/>
        <text x="230" y="170" fontSize="11" fill="#92400E" fontWeight="bold">Eaten</text>

        {/* Death/Waste: Animals to Decomposers */}
        <path d="M 400 210 L 300 320" stroke="#7C3AED" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="340" y="270" fontSize="10" fill="#5B21B6" fontWeight="bold">Death/Waste</text>

        {/* Death/Waste: Plants to Decomposers */}
        <path d="M 100 210 L 200 320" stroke="#7C3AED" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="140" y="280" fontSize="10" fill="#5B21B6" fontWeight="bold">Death/Waste</text>

        {/* Ammonification: Decomposers to Soil */}
        <path d="M 250 320 L 250 260" stroke="#D97706" strokeWidth="3" fill="none" markerEnd="url(#arrowhead1)"/>
        <text x="260" y="295" fontSize="10" fill="#92400E" fontWeight="bold">Ammonification</text>

        {/* Denitrification: Soil to Atmosphere */}
        <path d="M 270 200 L 270 70" stroke="#3B82F6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead2)"/>
        <text x="280" y="130" fontSize="10" fill="#1E40AF" fontWeight="bold">Denitrification</text>
      </svg>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
      <div className="bg-green-100 rounded-lg p-2">
        <span className="font-bold text-green-800">Fixation:</span>
        <p className="text-green-700">N₂ → NH₃ (bacteria/lightning)</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-2">
        <span className="font-bold text-orange-800">Nitrification:</span>
        <p className="text-orange-700">NH₃ → NO₂⁻ → NO₃⁻ (bacteria)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-2">
        <span className="font-bold text-purple-800">Ammonification:</span>
        <p className="text-purple-700">Dead matter → NH₄⁺</p>
      </div>
      <div className="bg-blue-100 rounded-lg p-2">
        <span className="font-bold text-blue-800">Denitrification:</span>
        <p className="text-blue-700">NO₃⁻ → N₂ (back to air)</p>
      </div>
    </div>
  </div>
);

const DensityComparisonDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Density Comparison - Floating vs Sinking</h4>
    
    <div className="grid md:grid-cols-2 gap-6">
      {/* Object Floats */}
      <div className="bg-white rounded-xl p-4 border-2 border-blue-300">
        <h5 className="text-center font-bold text-blue-800 mb-4">Object Floats ⬆️</h5>
        <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg border-2 border-blue-400">
          {/* Water level */}
          <div className="absolute top-0 left-0 right-0 h-3/4 bg-blue-400/30 border-b-2 border-blue-500"></div>
          
          {/* Floating object */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-20 h-20 bg-yellow-400 rounded-lg border-2 border-yellow-600 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <p className="text-xs font-bold">Wood</p>
              <p className="text-xs">0.6 g/cm³</p>
            </div>
          </div>
          
          {/* Water label */}
          <div className="absolute bottom-4 right-4 text-blue-800 font-bold text-sm">
            Water: 1.0 g/cm³
          </div>
        </div>
        <div className="mt-3 bg-green-100 rounded-lg p-3">
          <p className="text-sm text-green-800 text-center">
            <span className="font-bold">0.6 &lt; 1.0</span><br/>
            Object density &lt; Water density<br/>
            = FLOATS! 🎈
          </p>
        </div>
      </div>

      {/* Object Sinks */}
      <div className="bg-white rounded-xl p-4 border-2 border-red-300">
        <h5 className="text-center font-bold text-red-800 mb-4">Object Sinks ⬇️</h5>
        <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-300 rounded-lg border-2 border-blue-400">
          {/* Water level */}
          <div className="absolute top-0 left-0 right-0 h-3/4 bg-blue-400/30 border-b-2 border-blue-500"></div>
          
          {/* Sinking object */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gray-600 rounded-lg border-2 border-gray-800 flex items-center justify-center shadow-lg">
            <div className="text-center text-white">
              <p className="text-xs font-bold">Rock</p>
              <p className="text-xs">2.5 g/cm³</p>
            </div>
          </div>
          
          {/* Water label */}
          <div className="absolute bottom-4 right-4 text-blue-800 font-bold text-sm">
            Water: 1.0 g/cm³
          </div>
        </div>
        <div className="mt-3 bg-red-100 rounded-lg p-3">
          <p className="text-sm text-red-800 text-center">
            <span className="font-bold">2.5 &gt; 1.0</span><br/>
            Object density &gt; Water density<br/>
            = SINKS! ⚓
          </p>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-indigo-100 rounded-lg p-4">
      <p className="text-sm text-indigo-800 text-center">
        <span className="font-bold">Rule:</span> If object density is less than liquid density → floats. If greater → sinks!
      </p>
    </div>
  </div>
);

const IonDiagram = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ion Formation Examples</h4>
    
    {/* Cation Example - Sodium */}
    <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
      <h5 className="text-lg font-bold text-gray-800 mb-4 text-center">Cation (Positive Ion) - Sodium</h5>
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Neutral Sodium */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Neutral Sodium (Na)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">11p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">12n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="25" fill="none" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="85" cy="60" r="3" fill="#3B82F6"/>
            <circle cx="35" cy="60" r="3" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="#10B981" strokeWidth="2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 40 * Math.cos(rad);
              const y = 60 + 40 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="3" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 1 electron */}
            <circle cx="60" cy="60" r="55" fill="none" stroke="#F59E0B" strokeWidth="2"/>
            <circle cx="115" cy="60" r="3" fill="#F59E0B"/>
          </svg>
          <p className="text-xs text-gray-600 mt-2">11 protons, 11 electrons</p>
          <p className="text-xs text-gray-600">Charge: 0 (neutral)</p>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <div className="text-4xl text-red-500">→</div>
          <p className="text-xs text-red-600 font-bold mt-1">Loses 1e⁻</p>
        </div>

        {/* Sodium Ion */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Sodium Ion (Na⁺)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">11p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">12n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="25" fill="none" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="85" cy="60" r="3" fill="#3B82F6"/>
            <circle cx="35" cy="60" r="3" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="40" fill="none" stroke="#10B981" strokeWidth="2"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 40 * Math.cos(rad);
              const y = 60 + 40 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="3" fill="#10B981"/>;
            })}
            
            {/* No third shell - lost the electron! */}
          </svg>
          <p className="text-xs text-gray-600 mt-2">11 protons, 10 electrons</p>
          <p className="text-xs font-bold text-red-600">Charge: +1 (cation)</p>
          <div className="mt-2 inline-block bg-red-100 px-3 py-1 rounded-full">
            <p className="text-xs text-red-700 font-bold">11p⁺ - 10e⁻ = +1</p>
          </div>
        </div>
      </div>
    </div>

    {/* Anion Example - Chlorine */}
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h5 className="text-lg font-bold text-gray-800 mb-4 text-center">Anion (Negative Ion) - Chlorine</h5>
      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Neutral Chlorine */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Neutral Chlorine (Cl)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">17p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">18n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="80" cy="60" r="2.5" fill="#3B82F6"/>
            <circle cx="40" cy="60" r="2.5" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="35" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 35 * Math.cos(rad);
              const y = 60 + 35 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 7 electrons */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 50 * Math.cos(rad);
              const y = 60 + 50 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#F59E0B"/>;
            })}
          </svg>
          <p className="text-xs text-gray-600 mt-2">17 protons, 17 electrons</p>
          <p className="text-xs text-gray-600">Charge: 0 (neutral)</p>
        </div>

        {/* Arrow */}
        <div className="text-center">
          <div className="text-4xl text-green-500">→</div>
          <p className="text-xs text-green-600 font-bold mt-1">Gains 1e⁻</p>
        </div>

        {/* Chloride Ion */}
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-600 mb-3">Chloride Ion (Cl⁻)</p>
          <svg viewBox="0 0 120 120" className="w-32 h-32 mx-auto">
            {/* Nucleus */}
            <circle cx="60" cy="60" r="12" fill="#DC2626"/>
            <text x="60" y="58" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">17p⁺</text>
            <text x="60" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">18n⁰</text>
            
            {/* Shell 1: 2 electrons */}
            <circle cx="60" cy="60" r="20" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="80" cy="60" r="2.5" fill="#3B82F6"/>
            <circle cx="40" cy="60" r="2.5" fill="#3B82F6"/>
            
            {/* Shell 2: 8 electrons */}
            <circle cx="60" cy="60" r="35" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 35 * Math.cos(rad);
              const y = 60 + 35 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#10B981"/>;
            })}
            
            {/* Shell 3: 8 electrons (gained 1!) */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 50 * Math.cos(rad);
              const y = 60 + 50 * Math.sin(rad);
              return <circle key={i} cx={x} cy={y} r="2.5" fill="#F59E0B"/>;
            })}
          </svg>
          <p className="text-xs text-gray-600 mt-2">17 protons, 18 electrons</p>
          <p className="text-xs font-bold text-green-600">Charge: -1 (anion)</p>
          <div className="mt-2 inline-block bg-green-100 px-3 py-1 rounded-full">
            <p className="text-xs text-green-700 font-bold">17p⁺ - 18e⁻ = -1</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6 bg-purple-100 rounded-lg p-4">
      <div className="space-y-2 text-sm text-purple-800">
        <p><span className="font-bold">Cations (+):</span> Form when atoms LOSE electrons. More protons than electrons. Metals form cations.</p>
        <p><span className="font-bold">Anions (-):</span> Form when atoms GAIN electrons. More electrons than protons. Non-metals form anions.</p>
        <p><span className="font-bold">Why?</span> Atoms want a full outer shell (8 electrons = stable). Easier to lose 1-2 electrons or gain 1-2 electrons than move 5-6!</p>
      </div>
    </div>
  </div>
);

const BohrDiagram = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Bohr Diagram - Oxygen (8 protons, 8 neutrons, 8 electrons)</h4>
    <div className="flex justify-center">
      <div className="relative w-80 h-80">
        {/* Nucleus */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-lg z-10">
          <div className="text-center text-white">
            <div className="text-xs font-bold">8p⁺</div>
            <div className="text-xs font-bold">8n⁰</div>
          </div>
        </div>
        
        {/* First shell (2 electrons) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-3 border-blue-300"></div>
        {[0, 180].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 20 * Math.cos(rad);
          const y = 50 + 20 * Math.sin(rad);
          return (
            <div
              key={`shell1-${i}`}
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            />
          );
        })}
        
        {/* Second shell (6 electrons) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-3 border-green-300"></div>
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 35 * Math.cos(rad);
          const y = 50 + 35 * Math.sin(rad);
          return (
            <div
              key={`shell2-${i}`}
              className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            />
          );
        })}
        
        {/* Labels */}
        <div className="absolute -right-12 top-1/3 text-xs font-semibold text-blue-600">Shell 1: 2e⁻</div>
        <div className="absolute -right-12 bottom-1/4 text-xs font-semibold text-green-600">Shell 2: 6e⁻</div>
      </div>
    </div>
  </div>
);

const EnergyPyramid = () => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Energy Pyramid (10% Energy Transfer)</h4>
    <div className="flex flex-col items-center gap-3">
      {[
        { level: 'Tertiary Consumers', energy: '54.7 kcal', width: 'w-32', color: 'from-red-400 to-red-500' },
        { level: 'Secondary Consumers', energy: '547 kcal', width: 'w-48', color: 'from-orange-400 to-orange-500' },
        { level: 'Primary Consumers', energy: '5,467 kcal', width: 'w-64', color: 'from-yellow-400 to-yellow-500' },
        { level: 'Producers', energy: '54,670 kcal', width: 'w-80', color: 'from-green-400 to-green-500' }
      ].map((tier, i) => (
        <div key={i} className={`${tier.width} h-16 bg-gradient-to-r ${tier.color} rounded-lg shadow-lg flex items-center justify-center text-white flex-col`}>
          <div className="font-bold text-sm">{tier.level}</div>
          <div className="text-xs">{tier.energy}</div>
        </div>
      ))}
    </div>
    <div className="mt-6 text-center">
      <div className="inline-block bg-blue-100 rounded-lg px-4 py-2">
        <p className="text-sm font-semibold text-blue-800">⚡ Only 10% of energy passes to the next level</p>
        <p className="text-xs text-blue-600 mt-1">90% lost as heat, movement, and waste</p>
      </div>
    </div>
  </div>
);

const CarbonCycle = () => (
  <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">The Carbon Cycle</h4>
    <div className="relative h-80">
      {/* Central cycle */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Atmosphere */}
        <circle cx="200" cy="60" r="40" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <text x="200" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E40AF">Atmosphere</text>
        <text x="200" y="75" textAnchor="middle" fontSize="10" fill="#1E40AF">CO₂</text>
        
        {/* Plants */}
        <circle cx="80" cy="150" r="40" fill="#86EFAC" stroke="#22C55E" strokeWidth="2"/>
        <text x="80" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#15803D">Plants</text>
        <text x="80" y="165" textAnchor="middle" fontSize="10" fill="#15803D">(Producers)</text>
        
        {/* Animals */}
        <circle cx="320" cy="150" r="40" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2"/>
        <text x="320" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400E">Animals</text>
        <text x="320" y="165" textAnchor="middle" fontSize="10" fill="#92400E">(Consumers)</text>
        
        {/* Soil/Decomposers */}
        <circle cx="200" cy="240" r="40" fill="#A78BFA" stroke="#7C3AED" strokeWidth="2"/>
        <text x="200" y="240" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#5B21B6">Soil</text>
        <text x="200" y="255" textAnchor="middle" fontSize="10" fill="#5B21B6">Decomposers</text>
        
        {/* Arrows with labels */}
        {/* Photosynthesis */}
        <path d="M 180 90 L 100 130" stroke="#22C55E" strokeWidth="2" fill="none" markerEnd="url(#arrowgreen)"/>
        <text x="130" y="105" fontSize="9" fill="#15803D" fontWeight="bold">Photosynthesis</text>
        
        {/* Respiration from plants */}
        <path d="M 100 110 L 180 70" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="120" y="85" fontSize="9" fill="#1E40AF" fontWeight="bold">Respiration</text>
        
        {/* Consumption */}
        <path d="M 120 150 L 280 150" stroke="#F59E0B" strokeWidth="2" fill="none" markerEnd="url(#arroworange)"/>
        <text x="190" y="145" fontSize="9" fill="#92400E" fontWeight="bold">Eaten</text>
        
        {/* Respiration from animals */}
        <path d="M 300 110 L 220 70" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="250" y="85" fontSize="9" fill="#1E40AF" fontWeight="bold">Respiration</text>
        
        {/* Death/Waste */}
        <path d="M 310 190 L 220 220" stroke="#7C3AED" strokeWidth="2" fill="none" markerEnd="url(#arrowpurple)"/>
        <text x="270" y="210" fontSize="9" fill="#5B21B6" fontWeight="bold">Death/Waste</text>
        
        {/* Decomposition */}
        <path d="M 180 220 L 180 100" stroke="#3B82F6" strokeWidth="2" fill="none" markerEnd="url(#arrowblue)"/>
        <text x="150" y="160" fontSize="9" fill="#1E40AF" fontWeight="bold">Decomposition</text>
        
        {/* Arrow markers */}
        <defs>
          <marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
          </marker>
          <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>
          <marker id="arroworange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B" />
          </marker>
          <marker id="arrowpurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#7C3AED" />
          </marker>
        </defs>
      </svg>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
      <div className="bg-green-100 rounded-lg p-2">
        <span className="font-bold text-green-800">Photosynthesis:</span>
        <p className="text-green-700">CO₂ + H₂O → C₆H₁₂O₆ + O₂</p>
      </div>
      <div className="bg-blue-100 rounded-lg p-2">
        <span className="font-bold text-blue-800">Respiration:</span>
        <p className="text-blue-700">C₆H₁₂O₆ + O₂ → CO₂ + H₂O</p>
      </div>
    </div>
  </div>
);

// Electricity Diagrams
const CircuitSymbolsDiagram = () => (
  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Circuit Symbols Reference</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {/* Battery/Cell */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <line x1="25" y1="10" x2="25" y2="30" stroke="#1F2937" strokeWidth="3"/>
            <line x1="35" y1="15" x2="35" y2="25" stroke="#1F2937" strokeWidth="2"/>
            <line x1="45" y1="10" x2="45" y2="30" stroke="#1F2937" strokeWidth="3"/>
            <line x1="55" y1="15" x2="55" y2="25" stroke="#1F2937" strokeWidth="2"/>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <text x="20" y="8" fontSize="10" fill="#DC2626" fontWeight="bold">+</text>
            <text x="60" y="8" fontSize="10" fill="#1F2937" fontWeight="bold">−</text>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Battery</p>
        <p className="text-xs text-gray-600">Power source</p>
      </div>

      {/* Wire */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Wire</p>
        <p className="text-xs text-gray-600">Conductor</p>
      </div>

      {/* Switch (Open) */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="30" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="30" cy="20" r="2" fill="#1F2937"/>
            <line x1="30" y1="20" x2="50" y2="10" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="50" cy="20" r="2" fill="#1F2937"/>
            <line x1="50" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Switch (Open)</p>
        <p className="text-xs text-gray-600">Breaks circuit</p>
      </div>

      {/* Bulb/Light */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <line x1="35" y1="15" x2="45" y2="25" stroke="#F59E0B" strokeWidth="2"/>
            <line x1="35" y1="25" x2="45" y2="15" stroke="#F59E0B" strokeWidth="2"/>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Light Bulb</p>
        <p className="text-xs text-gray-600">Load/Output</p>
      </div>

      {/* Resistor */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="20" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <path d="M 20 20 L 25 15 L 30 25 L 35 15 L 40 25 L 45 15 L 50 25 L 55 15 L 60 20" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <line x1="60" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Resistor</p>
        <p className="text-xs text-gray-600">Opposes current</p>
      </div>

      {/* Ammeter */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">A</text>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Ammeter</p>
        <p className="text-xs text-gray-600">Measures current</p>
      </div>

      {/* Voltmeter */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2563EB">V</text>
            <line x1="40" y1="8" x2="40" y2="3" stroke="#1F2937" strokeWidth="1.5"/>
            <line x1="40" y1="32" x2="40" y2="37" stroke="#1F2937" strokeWidth="1.5"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Voltmeter</p>
        <p className="text-xs text-gray-600">Measures voltage</p>
      </div>

      {/* Motor */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-4 mb-2 border-2 border-amber-200 h-24 flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-16">
            <line x1="10" y1="20" x2="25" y2="20" stroke="#1F2937" strokeWidth="2"/>
            <circle cx="40" cy="20" r="12" fill="none" stroke="#1F2937" strokeWidth="2"/>
            <text x="40" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">M</text>
            <line x1="55" y1="20" x2="70" y2="20" stroke="#1F2937" strokeWidth="2"/>
          </svg>
        </div>
        <p className="font-bold text-gray-800">Motor</p>
        <p className="text-xs text-gray-600">Electrical → Motion</p>
      </div>
    </div>
  </div>
);

const SeriesCircuitDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Series Circuit</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 400 250" className="w-full">
        {/* Circuit outline */}
        <rect x="50" y="50" width="300" height="150" fill="none" stroke="#3B82F6" strokeWidth="3" rx="10"/>
        
        {/* Battery */}
        <line x1="50" y1="125" x2="70" y2="125" stroke="#1F2937" strokeWidth="3"/>
        <line x1="70" y1="110" x2="70" y2="140" stroke="#1F2937" strokeWidth="4"/>
        <line x1="80" y1="115" x2="80" y2="135" stroke="#1F2937" strokeWidth="3"/>
        <text x="60" y="105" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="75" y="165" fontSize="11" fill="#1F2937" fontWeight="bold">6V</text>
        
        {/* Bulb 1 */}
        <circle cx="170" cy="60" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="165" y1="55" x2="175" y2="65" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="165" y1="65" x2="175" y2="55" stroke="#F59E0B" strokeWidth="2"/>
        <text x="155" y="95" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 1</text>
        
        {/* Bulb 2 */}
        <circle cx="270" cy="125" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="265" y1="120" x2="275" y2="130" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="265" y1="130" x2="275" y2="120" stroke="#F59E0B" strokeWidth="2"/>
        <text x="255" y="160" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 2</text>
        
        {/* Bulb 3 */}
        <circle cx="170" cy="190" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="165" y1="185" x2="175" y2="195" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="165" y1="195" x2="175" y2="185" stroke="#F59E0B" strokeWidth="2"/>
        <text x="155" y="220" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb 3</text>
        
        {/* Current arrows */}
        <defs>
          <marker id="arrowcurrent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 120 50 L 135 50" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 320 90 L 320 105" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 220 200 L 205 200" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        <path d="M 80 165 L 80 180" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent)"/>
        
        <text x="110" y="40" fontSize="10" fill="#DC2626" fontWeight="bold">I = 0.5A</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-blue-100 rounded-lg p-3">
        <p className="text-sm font-bold text-blue-800 mb-1">✓ Current</p>
        <p className="text-xs text-blue-700">Same everywhere (0.5A)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-3">
        <p className="text-sm font-bold text-purple-800 mb-1">✓ Voltage</p>
        <p className="text-xs text-purple-700">Divides: 6V = 2V + 2V + 2V</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-3">
        <p className="text-sm font-bold text-orange-800 mb-1">✓ Path</p>
        <p className="text-xs text-orange-700">One route only</p>
      </div>
      <div className="bg-red-100 rounded-lg p-3">
        <p className="text-sm font-bold text-red-800 mb-1">✗ One Fails</p>
        <p className="text-xs text-red-700">All stop working</p>
      </div>
    </div>
  </div>
);

const ParallelCircuitDiagram = () => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Parallel Circuit</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 400 280" className="w-full">
        {/* Battery */}
        <line x1="50" y1="140" x2="70" y2="140" stroke="#1F2937" strokeWidth="3"/>
        <line x1="70" y1="125" x2="70" y2="155" stroke="#1F2937" strokeWidth="4"/>
        <line x1="80" y1="130" x2="80" y2="150" stroke="#1F2937" strokeWidth="3"/>
        <text x="60" y="120" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="55" y="180" fontSize="11" fill="#1F2937" fontWeight="bold">12V</text>
        
        {/* Main lines */}
        <line x1="80" y1="140" x2="120" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="120" y1="60" x2="120" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="280" y1="60" x2="280" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="280" y1="140" x2="320" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="320" y1="140" x2="350" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="350" y1="140" x2="350" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="50" y1="220" x2="350" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        <line x1="50" y1="140" x2="50" y2="220" stroke="#3B82F6" strokeWidth="3"/>
        
        {/* Branch 1 - Top */}
        <line x1="120" y1="70" x2="160" y2="70" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="70" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="65" x2="205" y2="75" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="75" x2="205" y2="65" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="70" x2="280" y2="70" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="65" fontSize="10" fill="#1F2937" fontWeight="bold">B1</text>
        
        {/* Branch 2 - Middle */}
        <line x1="120" y1="140" x2="160" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="140" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="135" x2="205" y2="145" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="145" x2="205" y2="135" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="140" x2="280" y2="140" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="135" fontSize="10" fill="#1F2937" fontWeight="bold">B2</text>
        
        {/* Branch 3 - Bottom */}
        <line x1="120" y1="210" x2="160" y2="210" stroke="#3B82F6" strokeWidth="3"/>
        <circle cx="200" cy="210" r="15" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="195" y1="205" x2="205" y2="215" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="195" y1="215" x2="205" y2="205" stroke="#F59E0B" strokeWidth="2"/>
        <line x1="240" y1="210" x2="280" y2="210" stroke="#3B82F6" strokeWidth="3"/>
        <text x="210" y="205" fontSize="10" fill="#1F2937" fontWeight="bold">B3</text>
        
        {/* Current arrows */}
        <defs>
          <marker id="arrowcurrent2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 100 140 L 115 140" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="95" y="130" fontSize="10" fill="#DC2626" fontWeight="bold">I=3A</text>
        
        <path d="M 130 70 L 145 70" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="60" fontSize="9" fill="#DC2626">1A</text>
        
        <path d="M 130 140 L 145 140" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="130" fontSize="9" fill="#DC2626">1A</text>
        
        <path d="M 130 210 L 145 210" stroke="#DC2626" strokeWidth="1.5" fill="none" markerEnd="url(#arrowcurrent2)"/>
        <text x="130" y="200" fontSize="9" fill="#DC2626">1A</text>
        
        <text x="165" y="250" fontSize="10" fill="#2563EB" fontWeight="bold">V = 12V on each branch</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-green-100 rounded-lg p-3">
        <p className="text-sm font-bold text-green-800 mb-1">✓ Voltage</p>
        <p className="text-xs text-green-700">Same across all (12V)</p>
      </div>
      <div className="bg-purple-100 rounded-lg p-3">
        <p className="text-sm font-bold text-purple-800 mb-1">✓ Current</p>
        <p className="text-xs text-purple-700">Divides: 3A = 1A + 1A + 1A</p>
      </div>
      <div className="bg-orange-100 rounded-lg p-3">
        <p className="text-sm font-bold text-orange-800 mb-1">✓ Paths</p>
        <p className="text-xs text-orange-700">Multiple routes</p>
      </div>
      <div className="bg-green-100 rounded-lg p-3">
        <p className="text-sm font-bold text-green-800 mb-1">✓ One Fails</p>
        <p className="text-xs text-green-700">Others keep working!</p>
      </div>
    </div>
  </div>
);

const OhmsLawTriangle = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Ohm's Law Triangle</h4>
    
    <div className="flex justify-center mb-6">
      <svg viewBox="0 0 200 200" className="w-64 h-64">
        {/* Triangle */}
        <path d="M 100 20 L 180 180 L 20 180 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="4"/>
        
        {/* Dividing lines */}
        <line x1="20" y1="100" x2="180" y2="100" stroke="#6D28D9" strokeWidth="3"/>
        
        {/* Labels */}
        <text x="100" y="70" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">V</text>
        <text x="65" y="150" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">I</text>
        <text x="135" y="150" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">R</text>
      </svg>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-purple-100 rounded-xl p-4 text-center border-2 border-purple-300">
        <p className="text-sm font-bold text-purple-800 mb-2">Find Voltage</p>
        <p className="text-2xl font-bold text-purple-900 mb-1">V = I × R</p>
        <p className="text-xs text-purple-700">Cover V</p>
      </div>
      
      <div className="bg-pink-100 rounded-xl p-4 text-center border-2 border-pink-300">
        <p className="text-sm font-bold text-pink-800 mb-2">Find Current</p>
        <p className="text-2xl font-bold text-pink-900 mb-1">I = V ÷ R</p>
        <p className="text-xs text-pink-700">Cover I</p>
      </div>
      
      <div className="bg-indigo-100 rounded-xl p-4 text-center border-2 border-indigo-300">
        <p className="text-sm font-bold text-indigo-800 mb-2">Find Resistance</p>
        <p className="text-2xl font-bold text-indigo-900 mb-1">R = V ÷ I</p>
        <p className="text-xs text-indigo-700">Cover R</p>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
      <p className="font-bold mb-2">Example Problem:</p>
      <p className="text-sm mb-2">A circuit has 12V battery and 4Ω resistor. Find current.</p>
      <p className="text-sm font-mono bg-white/20 rounded p-2">I = V ÷ R = 12V ÷ 4Ω = 3A</p>
    </div>
  </div>
);

const CircuitDiagram = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Complete Circuit Components</h4>
    <div className="bg-white rounded-xl p-6 mb-4">
      <svg viewBox="0 0 500 300" className="w-full">
        {/* Main circuit rectangle */}
        <rect x="50" y="50" width="400" height="200" fill="none" stroke="#3B82F6" strokeWidth="4" rx="20"/>
        
        {/* Battery */}
        <line x1="50" y1="150" x2="80" y2="150" stroke="#1F2937" strokeWidth="3"/>
        <line x1="80" y1="130" x2="80" y2="170" stroke="#1F2937" strokeWidth="5"/>
        <line x1="95" y1="135" x2="95" y2="165" stroke="#1F2937" strokeWidth="4"/>
        <text x="60" y="120" fontSize="12" fill="#DC2626" fontWeight="bold">+</text>
        <text x="90" y="120" fontSize="12" fill="#1F2937" fontWeight="bold">−</text>
        <text x="55" y="200" fontSize="11" fill="#1F2937" fontWeight="bold">Battery</text>
        
        {/* Switch (closed) */}
        <line x1="200" y1="50" x2="220" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <circle cx="220" cy="50" r="3" fill="#1F2937"/>
        <line x1="220" y1="50" x2="240" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <circle cx="240" cy="50" r="3" fill="#1F2937"/>
        <line x1="240" y1="50" x2="260" y2="50" stroke="#1F2937" strokeWidth="3"/>
        <text x="210" y="35" fontSize="11" fill="#1F2937" fontWeight="bold">Switch</text>
        
        {/* Light Bulb */}
        <circle cx="350" cy="100" r="20" fill="none" stroke="#1F2937" strokeWidth="3"/>
        <line x1="340" y1="90" x2="360" y2="110" stroke="#F59E0B" strokeWidth="3"/>
        <line x1="340" y1="110" x2="360" y2="90" stroke="#F59E0B" strokeWidth="3"/>
        <text x="330" y="140" fontSize="11" fill="#1F2937" fontWeight="bold">Bulb</text>
        
        {/* Resistor */}
        <path d="M 350 200 L 355 195 L 360 205 L 365 195 L 370 205 L 375 195 L 380 205 L 385 195 L 390 200" 
              fill="none" stroke="#1F2937" strokeWidth="3"/>
        <text x="345" y="225" fontSize="11" fill="#1F2937" fontWeight="bold">Resistor</text>
        
        {/* Ammeter */}
        <circle cx="150" cy="150" r="15" fill="none" stroke="#DC2626" strokeWidth="3"/>
        <text x="150" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#DC2626">A</text>
        <text x="140" y="185" fontSize="11" fill="#1F2937" fontWeight="bold">Ammeter</text>
        
        {/* Arrows showing current direction */}
        <defs>
          <marker id="arrowred" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
          </marker>
        </defs>
        <path d="M 100 50 L 120 50" stroke="#DC2626" strokeWidth="2" fill="none" markerEnd="url(#arrowred)"/>
        <text x="105" y="40" fontSize="10" fill="#DC2626" fontWeight="bold">Current flow</text>
      </svg>
    </div>
    <div className="bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-800 text-center">
        <span className="font-bold">Complete Circuit:</span> All components connected in a closed loop allowing current to flow
      </p>
    </div>
  </div>
);

const StaticElectricityDiagram = () => (
  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Static Electricity - Charge Interactions</h4>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* Like Charges Repel */}
      <div className="bg-white rounded-xl p-6 border-2 border-red-200">
        <h5 className="text-center font-bold text-red-800 mb-4">Like Charges REPEL</h5>
        
        <div className="flex justify-center items-center gap-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#DC2626" strokeWidth="3" markerEnd="url(#arrowrepel1)"/>
                <defs>
                  <marker id="arrowrepel1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#DC2626" strokeWidth="3" markerEnd="url(#arrowrepel2)"/>
                <defs>
                  <marker id="arrowrepel2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#DC2626" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-8 mt-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrowrepel3)"/>
                <defs>
                  <marker id="arrowrepel3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#2563EB" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#2563EB" strokeWidth="3" markerEnd="url(#arrowrepel4)"/>
                <defs>
                  <marker id="arrowrepel4" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#2563EB" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-red-700 font-semibold mt-4">+ repels + | − repels −</p>
      </div>
      
      {/* Opposite Charges Attract */}
      <div className="bg-white rounded-xl p-6 border-2 border-green-200">
        <h5 className="text-center font-bold text-green-800 mb-4">Opposite Charges ATTRACT</h5>
        
        <div className="flex justify-center items-center gap-8 mb-8 mt-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-red-400 border-4 border-red-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">+</span>
            </div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 5 15 L 20 15" stroke="#22C55E" strokeWidth="3" markerStart="url(#arrowattract1)"/>
                <defs>
                  <marker id="arrowattract1" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                    <path d="M9,0 L9,6 L0,3 z" fill="#22C55E" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-blue-600 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">−</span>
            </div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2">
              <svg width="30" height="30">
                <path d="M 25 15 L 10 15" stroke="#22C55E" strokeWidth="3" markerStart="url(#arrowattract2)"/>
                <defs>
                  <marker id="arrowattract2" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto">
                    <path d="M9,0 L9,6 L0,3 z" fill="#22C55E" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-green-700 font-semibold mt-12">+ attracts − | − attracts +</p>
      </div>
    </div>
    
    <div className="bg-amber-100 rounded-xl p-4 border-2 border-amber-300">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <p className="font-bold text-amber-800 mb-1">Remember:</p>
          <p className="text-sm text-amber-700">Only ELECTRONS move in static electricity! Protons stay in the nucleus. When you rub a balloon on your hair, electrons transfer from your hair to the balloon.</p>
        </div>
      </div>
    </div>
  </div>
);

const PowerFormulaDiagram = () => (
  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-6">Electrical Power Formulas</h4>
    
    <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-orange-600 mb-2">P = V × I</p>
        <p className="text-gray-600">Power = Voltage × Current</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-orange-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-orange-800 mb-2">Power (P)</p>
          <p className="text-xs text-orange-700">Measured in Watts (W)</p>
          <p className="text-xs text-orange-600 mt-2">How fast energy is used</p>
        </div>
        
        <div className="bg-red-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-red-800 mb-2">Voltage (V)</p>
          <p className="text-xs text-red-700">Measured in Volts (V)</p>
          <p className="text-xs text-red-600 mt-2">Electrical "pressure"</p>
        </div>
        
        <div className="bg-yellow-100 rounded-lg p-4 text-center">
          <p className="text-sm font-bold text-yellow-800 mb-2">Current (I)</p>
          <p className="text-xs text-yellow-700">Measured in Amperes (A)</p>
          <p className="text-xs text-yellow-600 mt-2">Flow of electrons</p>
        </div>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-300">
        <p className="font-bold text-orange-800 mb-3">Example 1: Light Bulb</p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">Given: V = 120V, I = 0.5A</p>
          <p className="text-gray-700">Find: P = ?</p>
          <div className="bg-white rounded p-3 mt-2">
            <p className="font-mono text-orange-700">P = V × I</p>
            <p className="font-mono text-orange-700">P = 120V × 0.5A</p>
            <p className="font-mono font-bold text-orange-900">P = 60W</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
        <p className="font-bold text-red-800 mb-3">Example 2: Heater</p>
        <div className="space-y-2 text-sm">
          <p className="text-gray-700">Given: P = 1500W, V = 120V</p>
          <p className="text-gray-700">Find: I = ?</p>
          <div className="bg-white rounded p-3 mt-2">
            <p className="font-mono text-red-700">I = P ÷ V</p>
            <p className="font-mono text-red-700">I = 1500W ÷ 120V</p>
            <p className="font-mono font-bold text-red-900">I = 12.5A</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
      <div className="flex items-start gap-3">
        <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <p className="font-bold mb-2">Common Appliance Power:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>• LED bulb: 10W</p>
            <p>• Laptop: 50W</p>
            <p>• Microwave: 1000W</p>
            <p>• Hair dryer: 1800W</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AtomicModels = () => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
    <h4 className="text-center font-semibold text-gray-700 mb-8">Evolution of Atomic Models</h4>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* Dalton - Solid Sphere */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            <circle cx="50" cy="50" r="35" fill="#9333EA" opacity="0.8"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#7C3AED" strokeWidth="2"/>
          </svg>
        </div>
        <h5 className="font-bold text-purple-900 mb-1">Dalton (1803)</h5>
        <p className="text-xs text-purple-700">Solid Sphere</p>
        <p className="text-xs text-gray-600 mt-1">Indivisible ball</p>
      </div>

      {/* Thomson - Plum Pudding */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            <circle cx="50" cy="50" r="35" fill="#F59E0B" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="#F59E0B" strokeWidth="2"/>
            {/* Electrons scattered */}
            {[
              {x: 35, y: 35}, {x: 65, y: 35}, {x: 35, y: 50}, 
              {x: 65, y: 50}, {x: 35, y: 65}, {x: 65, y: 65},
              {x: 50, y: 42}, {x: 50, y: 58}
            ].map((pos, i) => (
              <circle key={i} cx={pos.x} cy={pos.y} r="3" fill="#DC2626"/>
            ))}
          </svg>
        </div>
        <h5 className="font-bold text-orange-900 mb-1">Thomson (1897)</h5>
        <p className="text-xs text-orange-700">Plum Pudding</p>
        <p className="text-xs text-gray-600 mt-1">Electrons in positive</p>
      </div>

      {/* Rutherford - Nuclear */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            {/* Nucleus */}
            <circle cx="50" cy="50" r="8" fill="#DC2626"/>
            <circle cx="50" cy="50" r="8" fill="none" stroke="#991B1B" strokeWidth="1"/>
            {/* Electrons orbiting */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2,2"/>
            <circle cx="80" cy="50" r="3" fill="#3B82F6"/>
            <circle cx="20" cy="50" r="3" fill="#3B82F6"/>
            <circle cx="50" cy="20" r="3" fill="#3B82F6"/>
            <circle cx="50" cy="80" r="3" fill="#3B82F6"/>
          </svg>
        </div>
        <h5 className="font-bold text-red-900 mb-1">Rutherford (1911)</h5>
        <p className="text-xs text-red-700">Nuclear Model</p>
        <p className="text-xs text-gray-600 mt-1">Dense nucleus</p>
      </div>

      {/* Bohr - Planetary */}
      <div className="text-center">
        <div className="bg-white rounded-xl p-6 shadow-md mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-24">
            {/* Nucleus */}
            <circle cx="50" cy="50" r="6" fill="#DC2626"/>
            {/* Shell 1 */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="65" cy="50" r="2.5" fill="#3B82F6"/>
            {/* Shell 2 */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="#10B981" strokeWidth="1.5"/>
            <circle cx="78" cy="50" r="2.5" fill="#10B981"/>
            <circle cx="22" cy="50" r="2.5" fill="#10B981"/>
          </svg>
        </div>
        <h5 className="font-bold text-blue-900 mb-1">Bohr (1913)</h5>
        <p className="text-xs text-blue-700">Planetary Model</p>
        <p className="text-xs text-gray-600 mt-1">Energy levels</p>
      </div>
    </div>
    <div className="mt-6 bg-blue-100 rounded-lg p-4">
      <p className="text-sm text-blue-800 text-center">
        <span className="font-bold">Evolution:</span> From solid ball → embedded electrons → nuclear center → specific orbits
      </p>
    </div>
  </div>
);

const PeriodicTableDiagram = () => {
  const elements = [
    // Period 1
    { num: 1, sym: 'H', name: 'Hydrogen', type: 'nonmetal', group: 1, period: 1 },
    { num: 2, sym: 'He', name: 'Helium', type: 'noble', group: 18, period: 1 },
    // Period 2
    { num: 3, sym: 'Li', name: 'Lithium', type: 'alkali', group: 1, period: 2 },
    { num: 4, sym: 'Be', name: 'Beryllium', type: 'alkaline', group: 2, period: 2 },
    { num: 5, sym: 'B', name: 'Boron', type: 'metalloid', group: 13, period: 2 },
    { num: 6, sym: 'C', name: 'Carbon', type: 'nonmetal', group: 14, period: 2 },
    { num: 7, sym: 'N', name: 'Nitrogen', type: 'nonmetal', group: 15, period: 2 },
    { num: 8, sym: 'O', name: 'Oxygen', type: 'nonmetal', group: 16, period: 2 },
    { num: 9, sym: 'F', name: 'Fluorine', type: 'halogen', group: 17, period: 2 },
    { num: 10, sym: 'Ne', name: 'Neon', type: 'noble', group: 18, period: 2 },
    // Period 3
    { num: 11, sym: 'Na', name: 'Sodium', type: 'alkali', group: 1, period: 3 },
    { num: 12, sym: 'Mg', name: 'Magnesium', type: 'alkaline', group: 2, period: 3 },
    { num: 13, sym: 'Al', name: 'Aluminum', type: 'metal', group: 13, period: 3 },
    { num: 14, sym: 'Si', name: 'Silicon', type: 'metalloid', group: 14, period: 3 },
    { num: 15, sym: 'P', name: 'Phosphorus', type: 'nonmetal', group: 15, period: 3 },
    { num: 16, sym: 'S', name: 'Sulfur', type: 'nonmetal', group: 16, period: 3 },
    { num: 17, sym: 'Cl', name: 'Chlorine', type: 'halogen', group: 17, period: 3 },
    { num: 18, sym: 'Ar', name: 'Argon', type: 'noble', group: 18, period: 3 },
    // Period 4
    { num: 19, sym: 'K', name: 'Potassium', type: 'alkali', group: 1, period: 4 },
    { num: 20, sym: 'Ca', name: 'Calcium', type: 'alkaline', group: 2, period: 4 },
    { num: 21, sym: 'Sc', name: 'Scandium', type: 'transition', group: 3, period: 4 },
    { num: 22, sym: 'Ti', name: 'Titanium', type: 'transition', group: 4, period: 4 },
    { num: 23, sym: 'V', name: 'Vanadium', type: 'transition', group: 5, period: 4 },
    { num: 24, sym: 'Cr', name: 'Chromium', type: 'transition', group: 6, period: 4 },
    { num: 25, sym: 'Mn', name: 'Manganese', type: 'transition', group: 7, period: 4 },
    { num: 26, sym: 'Fe', name: 'Iron', type: 'transition', group: 8, period: 4 },
    { num: 27, sym: 'Co', name: 'Cobalt', type: 'transition', group: 9, period: 4 },
    { num: 28, sym: 'Ni', name: 'Nickel', type: 'transition', group: 10, period: 4 },
    { num: 29, sym: 'Cu', name: 'Copper', type: 'transition', group: 11, period: 4 },
    { num: 30, sym: 'Zn', name: 'Zinc', type: 'transition', group: 12, period: 4 },
    { num: 31, sym: 'Ga', name: 'Gallium', type: 'metal', group: 13, period: 4 },
    { num: 32, sym: 'Ge', name: 'Germanium', type: 'metalloid', group: 14, period: 4 },
    { num: 33, sym: 'As', name: 'Arsenic', type: 'metalloid', group: 15, period: 4 },
    { num: 34, sym: 'Se', name: 'Selenium', type: 'nonmetal', group: 16, period: 4 },
    { num: 35, sym: 'Br', name: 'Bromine', type: 'halogen', group: 17, period: 4 },
    { num: 36, sym: 'Kr', name: 'Krypton', type: 'noble', group: 18, period: 4 },
    // Period 5
    { num: 37, sym: 'Rb', name: 'Rubidium', type: 'alkali', group: 1, period: 5 },
    { num: 38, sym: 'Sr', name: 'Strontium', type: 'alkaline', group: 2, period: 5 },
    { num: 39, sym: 'Y', name: 'Yttrium', type: 'transition', group: 3, period: 5 },
    { num: 40, sym: 'Zr', name: 'Zirconium', type: 'transition', group: 4, period: 5 },
    { num: 41, sym: 'Nb', name: 'Niobium', type: 'transition', group: 5, period: 5 },
    { num: 42, sym: 'Mo', name: 'Molybdenum', type: 'transition', group: 6, period: 5 },
    { num: 43, sym: 'Tc', name: 'Technetium', type: 'transition', group: 7, period: 5 },
    { num: 44, sym: 'Ru', name: 'Ruthenium', type: 'transition', group: 8, period: 5 },
    { num: 45, sym: 'Rh', name: 'Rhodium', type: 'transition', group: 9, period: 5 },
    { num: 46, sym: 'Pd', name: 'Palladium', type: 'transition', group: 10, period: 5 },
    { num: 47, sym: 'Ag', name: 'Silver', type: 'transition', group: 11, period: 5 },
    { num: 48, sym: 'Cd', name: 'Cadmium', type: 'transition', group: 12, period: 5 },
    { num: 49, sym: 'In', name: 'Indium', type: 'metal', group: 13, period: 5 },
    { num: 50, sym: 'Sn', name: 'Tin', type: 'metal', group: 14, period: 5 },
    { num: 51, sym: 'Sb', name: 'Antimony', type: 'metalloid', group: 15, period: 5 },
    { num: 52, sym: 'Te', name: 'Tellurium', type: 'metalloid', group: 16, period: 5 },
    { num: 53, sym: 'I', name: 'Iodine', type: 'halogen', group: 17, period: 5 },
    { num: 54, sym: 'Xe', name: 'Xenon', type: 'noble', group: 18, period: 5 },
    // Period 6
    { num: 55, sym: 'Cs', name: 'Cesium', type: 'alkali', group: 1, period: 6 },
    { num: 56, sym: 'Ba', name: 'Barium', type: 'alkaline', group: 2, period: 6 },
    { num: 57, sym: 'La', name: 'Lanthanum', type: 'lanthanide', group: 3, period: 6 },
    { num: 72, sym: 'Hf', name: 'Hafnium', type: 'transition', group: 4, period: 6 },
    { num: 73, sym: 'Ta', name: 'Tantalum', type: 'transition', group: 5, period: 6 },
    { num: 74, sym: 'W', name: 'Tungsten', type: 'transition', group: 6, period: 6 },
    { num: 75, sym: 'Re', name: 'Rhenium', type: 'transition', group: 7, period: 6 },
    { num: 76, sym: 'Os', name: 'Osmium', type: 'transition', group: 8, period: 6 },
    { num: 77, sym: 'Ir', name: 'Iridium', type: 'transition', group: 9, period: 6 },
    { num: 78, sym: 'Pt', name: 'Platinum', type: 'transition', group: 10, period: 6 },
    { num: 79, sym: 'Au', name: 'Gold', type: 'transition', group: 11, period: 6 },
    { num: 80, sym: 'Hg', name: 'Mercury', type: 'transition', group: 12, period: 6 },
    { num: 81, sym: 'Tl', name: 'Thallium', type: 'metal', group: 13, period: 6 },
    { num: 82, sym: 'Pb', name: 'Lead', type: 'metal', group: 14, period: 6 },
    { num: 83, sym: 'Bi', name: 'Bismuth', type: 'metal', group: 15, period: 6 },
    { num: 84, sym: 'Po', name: 'Polonium', type: 'metalloid', group: 16, period: 6 },
    { num: 85, sym: 'At', name: 'Astatine', type: 'halogen', group: 17, period: 6 },
    { num: 86, sym: 'Rn', name: 'Radon', type: 'noble', group: 18, period: 6 },
    // Period 7
    { num: 87, sym: 'Fr', name: 'Francium', type: 'alkali', group: 1, period: 7 },
    { num: 88, sym: 'Ra', name: 'Radium', type: 'alkaline', group: 2, period: 7 },
    { num: 89, sym: 'Ac', name: 'Actinium', type: 'actinide', group: 3, period: 7 },
    { num: 104, sym: 'Rf', name: 'Rutherfordium', type: 'transition', group: 4, period: 7 },
    { num: 105, sym: 'Db', name: 'Dubnium', type: 'transition', group: 5, period: 7 },
    { num: 106, sym: 'Sg', name: 'Seaborgium', type: 'transition', group: 6, period: 7 },
    { num: 107, sym: 'Bh', name: 'Bohrium', type: 'transition', group: 7, period: 7 },
    { num: 108, sym: 'Hs', name: 'Hassium', type: 'transition', group: 8, period: 7 },
    { num: 109, sym: 'Mt', name: 'Meitnerium', type: 'transition', group: 9, period: 7 },
    { num: 110, sym: 'Ds', name: 'Darmstadtium', type: 'transition', group: 10, period: 7 },
    { num: 111, sym: 'Rg', name: 'Roentgenium', type: 'transition', group: 11, period: 7 },
    { num: 112, sym: 'Cn', name: 'Copernicium', type: 'transition', group: 12, period: 7 },
    { num: 113, sym: 'Nh', name: 'Nihonium', type: 'metal', group: 13, period: 7 },
    { num: 114, sym: 'Fl', name: 'Flerovium', type: 'metal', group: 14, period: 7 },
    { num: 115, sym: 'Mc', name: 'Moscovium', type: 'metal', group: 15, period: 7 },
    { num: 116, sym: 'Lv', name: 'Livermorium', type: 'metal', group: 16, period: 7 },
    { num: 117, sym: 'Ts', name: 'Tennessine', type: 'halogen', group: 17, period: 7 },
    { num: 118, sym: 'Og', name: 'Oganesson', type: 'noble', group: 18, period: 7 },
    // Lanthanides
    { num: 58, sym: 'Ce', name: 'Cerium', type: 'lanthanide' },
    { num: 59, sym: 'Pr', name: 'Praseodymium', type: 'lanthanide' },
    { num: 60, sym: 'Nd', name: 'Neodymium', type: 'lanthanide' },
    { num: 61, sym: 'Pm', name: 'Promethium', type: 'lanthanide' },
    { num: 62, sym: 'Sm', name: 'Samarium', type: 'lanthanide' },
    { num: 63, sym: 'Eu', name: 'Europium', type: 'lanthanide' },
    { num: 64, sym: 'Gd', name: 'Gadolinium', type: 'lanthanide' },
    { num: 65, sym: 'Tb', name: 'Terbium', type: 'lanthanide' },
    { num: 66, sym: 'Dy', name: 'Dysprosium', type: 'lanthanide' },
    { num: 67, sym: 'Ho', name: 'Holmium', type: 'lanthanide' },
    { num: 68, sym: 'Er', name: 'Erbium', type: 'lanthanide' },
    { num: 69, sym: 'Tm', name: 'Thulium', type: 'lanthanide' },
    { num: 70, sym: 'Yb', name: 'Ytterbium', type: 'lanthanide' },
    { num: 71, sym: 'Lu', name: 'Lutetium', type: 'lanthanide' },
    // Actinides
    { num: 90, sym: 'Th', name: 'Thorium', type: 'actinide' },
    { num: 91, sym: 'Pa', name: 'Protactinium', type: 'actinide' },
    { num: 92, sym: 'U', name: 'Uranium', type: 'actinide' },
    { num: 93, sym: 'Np', name: 'Neptunium', type: 'actinide' },
    { num: 94, sym: 'Pu', name: 'Plutonium', type: 'actinide' },
    { num: 95, sym: 'Am', name: 'Americium', type: 'actinide' },
    { num: 96, sym: 'Cm', name: 'Curium', type: 'actinide' },
    { num: 97, sym: 'Bk', name: 'Berkelium', type: 'actinide' },
    { num: 98, sym: 'Cf', name: 'Californium', type: 'actinide' },
    { num: 99, sym: 'Es', name: 'Einsteinium', type: 'actinide' },
    { num: 100, sym: 'Fm', name: 'Fermium', type: 'actinide' },
    { num: 101, sym: 'Md', name: 'Mendelevium', type: 'actinide' },
    { num: 102, sym: 'No', name: 'Nobelium', type: 'actinide' },
    { num: 103, sym: 'Lr', name: 'Lawrencium', type: 'actinide' },
  ];

  const getColor = (type) => {
    const colors = {
      alkali: 'bg-red-400 border-red-500',
      alkaline: 'bg-orange-400 border-orange-500',
      transition: 'bg-yellow-300 border-yellow-400',
      metal: 'bg-gray-400 border-gray-500',
      metalloid: 'bg-teal-400 border-teal-500',
      nonmetal: 'bg-blue-400 border-blue-500',
      halogen: 'bg-green-400 border-green-500',
      noble: 'bg-purple-400 border-purple-500',
      lanthanide: 'bg-pink-300 border-pink-400',
      actinide: 'bg-rose-300 border-rose-400'
    };
    return colors[type] || 'bg-gray-300 border-gray-400';
  };

  const renderElement = (el, size = 'normal') => {
    const sizeClasses = size === 'small' ? 'p-1' : 'p-2';
    const textSize = size === 'small' ? 'text-xs' : 'text-xs';
    
    return (
      <div className={`${getColor(el.type)} border-2 rounded ${sizeClasses} text-center flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer min-h-[70px]`}>
        <div className={`${textSize} font-bold text-gray-800 text-[10px]`}>{el.num}</div>
        <div className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-bold text-gray-900`}>{el.sym}</div>
        {size !== 'small' && <div className="text-[9px] text-gray-700 leading-tight px-0.5">{el.name}</div>}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4">
      <h4 className="text-center font-semibold text-gray-700 mb-4">Complete Periodic Table of Elements</h4>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-400 border border-red-500"></div>
          <span className="text-gray-700">Alkali</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-400 border border-orange-500"></div>
          <span className="text-gray-700">Alkaline Earth</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-yellow-300 border border-yellow-400"></div>
          <span className="text-gray-700">Transition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-400 border border-gray-500"></div>
          <span className="text-gray-700">Post-transition</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-teal-400 border border-teal-500"></div>
          <span className="text-gray-700">Metalloid</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-blue-400 border border-blue-500"></div>
          <span className="text-gray-700">Nonmetal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-green-400 border border-green-500"></div>
          <span className="text-gray-700">Halogen</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-purple-400 border border-purple-500"></div>
          <span className="text-gray-700">Noble Gas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-pink-300 border border-pink-400"></div>
          <span className="text-gray-700">Lanthanide</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-rose-300 border border-rose-400"></div>
          <span className="text-gray-700">Actinide</span>
        </div>
      </div>

      {/* Main Periodic Table */}
      <div className="overflow-x-auto mb-4">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))', gap: '2px', minWidth: '900px'}}>
          {/* Period 1 */}
          {renderElement(elements.find(e => e.num === 1))}
          <div style={{gridColumn: 'span 16'}}></div>
          {renderElement(elements.find(e => e.num === 2))}

          {/* Period 2 */}
          {renderElement(elements.find(e => e.num === 3))}
          {renderElement(elements.find(e => e.num === 4))}
          <div style={{gridColumn: 'span 10'}}></div>
          {[5,6,7,8,9,10].map(n => renderElement(elements.find(e => e.num === n)))}

          {/* Period 3 */}
          {renderElement(elements.find(e => e.num === 11))}
          {renderElement(elements.find(e => e.num === 12))}
          <div style={{gridColumn: 'span 10'}}></div>
          {[13,14,15,16,17,18].map(n => renderElement(elements.find(e => e.num === n)))}

          {/* Period 4 */}
          {[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 5 */}
          {[37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 6 */}
          {renderElement(elements.find(e => e.num === 55))}
          {renderElement(elements.find(e => e.num === 56))}
          {renderElement(elements.find(e => e.num === 57))}
          {[72,73,74,75,76,77,78,79,80,81,82,83,84,85,86].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}

          {/* Period 7 */}
          {renderElement(elements.find(e => e.num === 87))}
          {renderElement(elements.find(e => e.num === 88))}
          {renderElement(elements.find(e => e.num === 89))}
          {[104,105,106,107,108,109,110,111,112,113,114,115,116,117,118].map(n => 
            renderElement(elements.find(e => e.num === n))
          )}
        </div>
      </div>

      {/* Lanthanides and Actinides */}
      <div className="space-y-2">
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(15, minmax(40px, 1fr))', gap: '2px', minWidth: '600px'}}>
          {[58,59,60,61,62,63,64,65,66,67,68,69,70,71].map(n => 
            renderElement(elements.find(e => e.num === n), 'small')
          )}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(15, minmax(40px, 1fr))', gap: '2px', minWidth: '600px'}}>
          {[90,91,92,93,94,95,96,97,98,99,100,101,102,103].map(n => 
            renderElement(elements.find(e => e.num === n), 'small')
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50 rounded-lg p-2 border border-red-200">
          <p className="font-bold text-red-800 mb-1">Group 1: Alkali Metals</p>
          <p className="text-red-700">Soft, highly reactive, 1 valence e⁻</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
          <p className="font-bold text-purple-800 mb-1">Group 18: Noble Gases</p>
          <p className="text-purple-700">Unreactive, full outer shell</p>
        </div>
      </div>
    </div>
  );
};

const studyLibrary = {
  lockdownTests: {
    id: 'lockdownTests',
    name: 'Test Lockdown Simulators',
    description: 'Full-length timed exams simulating real test conditions',
    icon: Award,
    color: 'red',
    gradient: 'from-red-500 to-rose-600',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-lockdown-simulator',
        title: 'Biology Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-lockdown-simulator',
        title: 'Chemistry Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'physics-lockdown-simulator',
        title: 'Physics Test Lockdown Simulator - 45 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'space-lockdown-simulator',
        title: 'Space Test Lockdown Simulator - 30 Min Timed Exam',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      }
    ]
  },
  flashcards: {
    id: 'flashcards',
    name: 'Flashcard Review',
    description: '70+ interactive flashcards across Biology & Chemistry for quick review',
    icon: Brain,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-flashcards',
        title: 'Biology Flashcards',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        flashcards: [
          { front: 'What are the three types of biodiversity?', back: 'Genetic diversity (variation within species), Species diversity (variety of species), and Ecosystem diversity (variety of ecosystems)' },
          { front: 'What does H.I.P.P.O.C stand for?', back: 'H - Habitat destruction\nI - Invasive species\nP - Pollution\nP - Population (human)\nO - Overharvesting\nC - Climate change' },
          { front: 'What is a biotic factor?', back: 'A living component of an ecosystem (plants, animals, bacteria, fungi)' },
          { front: 'What is an abiotic factor?', back: 'A non-living component of an ecosystem (sunlight, water, soil, temperature)' },
          { front: 'What is the 10% rule in energy transfer?', back: 'Only 10% of energy passes to the next trophic level. 90% is lost as heat, movement, and waste.' },
          { front: 'What is bioaccumulation?', back: 'The build-up of a substance (like a toxin) in a single organism over time' },
          { front: 'What is biomagnification?', back: 'The increase in concentration of a substance as you move up the food chain' },
          { front: 'What is photosynthesis?', back: 'The process where plants use CO₂ and water to make glucose and oxygen using sunlight\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
          { front: 'What is cellular respiration?', back: 'The process where organisms break down glucose with oxygen to release energy\nC₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
          { front: 'What is nitrogen fixation?', back: 'The conversion of atmospheric nitrogen (N₂) into ammonia (NH₃) by bacteria or lightning' },
          { front: 'What makes a species invasive?', back: 'A non-native species that causes harm by: rapid reproduction, outcompeting natives, lacking natural predators, and disrupting ecosystems' },
          { front: 'What is reforestation?', back: 'Planting trees in areas where they were previously cut down to restore ecosystems' },
          { front: 'What is bioremediation?', back: 'Adding organisms (like bacteria) that break down waste and improve soil/water quality' },
          { front: 'What are the 4 spheres of Earth?', back: 'Biosphere (living things), Atmosphere (air), Hydrosphere (water), Lithosphere (rocks/soil)' },
          { front: 'What is a sustainable ecosystem?', back: 'An ecosystem that can maintain itself over time with resources regenerating as fast as they are used' },
          { front: 'What is a producer?', back: 'An organism that makes its own food through photosynthesis (plants, algae)' },
          { front: 'What is a primary consumer?', back: 'An herbivore that eats producers (rabbits, deer, caterpillars)' },
          { front: 'What is a secondary consumer?', back: 'A carnivore that eats primary consumers (snakes, frogs, small birds)' },
          { front: 'What is a tertiary consumer?', back: 'A top predator that eats secondary consumers (eagles, sharks, wolves)' },
          { front: 'What is a decomposer?', back: 'An organism that breaks down dead matter and returns nutrients to soil (bacteria, fungi, worms)' },
          { front: 'What is mutualism?', back: 'A symbiotic relationship where both species benefit (bee and flower, clownfish and anemone)' },
          { front: 'What is commensalism?', back: 'A relationship where one benefits and the other is unaffected (bird nesting in tree)' },
          { front: 'What is parasitism?', back: 'A relationship where one benefits and the other is harmed (tick on dog, tapeworm in human)' },
          { front: 'What is an example of genetic diversity?', back: 'Different dog breeds - all are the same species (Canis familiaris) but have genetic variation' },
          { front: 'What is an example of species diversity?', back: 'A coral reef with many different fish species, corals, and marine life' },
          { front: 'What is an example of ecosystem diversity?', back: 'A region with forests, wetlands, grasslands, and lakes' },
          { front: 'Why is biodiversity important?', back: 'More diverse ecosystems are more stable, resilient to change, and provide essential services (clean air, water, food)' },
          { front: 'What is bioaugmentation?', back: 'Using bacteria or fungi to neutralize toxins and clean up pollution (like oil spills)' },
          { front: 'What is nitrification?', back: 'The conversion of ammonia (NH₃) to nitrite (NO₂⁻) and then to nitrate (NO₃⁻) by bacteria' },
          { front: 'What is denitrification?', back: 'The conversion of nitrate (NO₃⁻) back into nitrogen gas (N₂) that returns to the atmosphere' }
        ],
        notes: []
      },
      {
        id: 'physics-flashcards',
        title: 'Physics Flashcards - Electricity Concepts',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-flashcards',
        title: 'Chemistry Flashcards',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        flashcards: [
          { front: 'What are the three subatomic particles?', back: 'Protons (+1 charge, in nucleus)\nNeutrons (0 charge, in nucleus)\nElectrons (-1 charge, in shells)' },
          { front: 'What is a pure substance?', back: 'Matter with uniform composition - either an element (one type of atom) or compound (bonded elements)' },
          { front: 'What is a homogeneous mixture?', back: 'A mixture that is uniform throughout - you cannot see the individual parts (solution)' },
          { front: 'What is a heterogeneous mixture?', back: 'A mixture where you can see different parts (mechanical mixture, suspension)' },
          { front: 'What is density?', back: 'Mass per unit volume\nD = m/V\nMeasured in g/cm³ or g/mL' },
          { front: 'What is a physical property?', back: 'A characteristic you can observe WITHOUT changing the substance (color, mass, density, melting point)' },
          { front: 'What is a chemical property?', back: 'How a substance reacts with OTHER substances (combustibility, reactivity, stability)' },
          { front: 'What are 5 signs of a chemical change?', back: 'Color change, gas production, temperature change, light production, precipitate forms' },
          { front: 'Who proposed the plum pudding model?', back: 'J.J. Thomson - discovered electrons and proposed positive material with embedded electrons' },
          { front: 'Who discovered the nucleus?', back: 'Ernest Rutherford - found dense positive nucleus with electrons orbiting around it' },
          { front: 'What did Bohr contribute?', back: 'Niels Bohr proposed that electrons orbit in specific energy levels/shells (planetary model)' },
          { front: 'How do you find the number of neutrons?', back: 'Neutrons = Mass number - Atomic number' },
          { front: 'What are valence electrons?', back: 'Electrons in the outermost shell that determine chemical behavior' },
          { front: 'What is an ion?', back: 'An atom with unequal protons and electrons\nCation = positive (lost electrons)\nAnion = negative (gained electrons)' },
          { front: 'What are isotopes?', back: 'Atoms of the same element with different numbers of neutrons (same protons, different mass)' },
          { front: 'What are alkali metals?', back: 'Group 1 elements: soft, highly reactive, shiny, 1 valence electron' },
          { front: 'What are halogens?', back: 'Group 17 elements: reactive non-metals, diatomic, gain 1 electron, form salts' },
          { front: 'What are noble gases?', back: 'Group 18 elements: unreactive, full valence shell (8 electrons), stable' },
          { front: 'What is the formula for density?', back: 'D = m/V\nWhere D = density, m = mass, V = volume' },
          { front: 'Will an object float or sink?', back: 'Float if object density < liquid density\nSink if object density > liquid density' },
          { front: 'What is the atomic number?', back: 'The number of protons in an atom - this identifies the element' },
          { front: 'What is the mass number?', back: 'The total number of protons + neutrons in the nucleus' },
          { front: 'What is John Dalton known for?', back: 'Proposed atoms are indivisible solid spheres (Solid Sphere Model - 1803)' },
          { front: 'What is an element?', back: 'A pure substance made of only one type of atom (e.g., gold, oxygen, carbon)' },
          { front: 'What is a compound?', back: 'A pure substance made of two or more elements chemically bonded (e.g., H₂O, CO₂, NaCl)' },
          { front: 'What is a cation?', back: 'A positively charged ion formed when an atom LOSES electrons (e.g., Na⁺, Ca²⁺, Al³⁺)' },
          { front: 'What is an anion?', back: 'A negatively charged ion formed when an atom GAINS electrons (e.g., Cl⁻, O²⁻, N³⁻)' },
          { front: 'How many electrons fit in shell 1?', back: '2 electrons maximum' },
          { front: 'How many electrons fit in shell 2?', back: '8 electrons maximum' },
          { front: 'How many electrons fit in shell 3?', back: '8 electrons maximum (for first 20 elements)' },
          { front: 'What are metalloids?', back: 'Elements with properties between metals and non-metals (semiconductors like Silicon, Boron)' },
          { front: 'What are transition metals?', back: 'Metals in the middle of periodic table (Groups 3-12) - can form multiple ion charges' },
          { front: 'What is filtration?', back: 'Separation method that uses a filter to separate solids from liquids' },
          { front: 'What is distillation?', back: 'Separation method using different boiling points to separate liquids' },
          { front: 'What is evaporation?', back: 'Separation method where liquid evaporates leaving dissolved solid behind' },
          { front: 'Why do atoms form ions?', back: 'To achieve a stable electron configuration with a full outer shell (8 valence electrons)' },
          { front: 'What is a qualitative property?', back: 'A property described with words (color, texture, odor, luster)' },
          { front: 'What is a quantitative property?', back: 'A property measured with numbers (mass, volume, density, temperature)' },
          { front: 'What happens in a physical change?', back: 'Substance changes form but remains the same substance (melting, cutting, dissolving)' },
          { front: 'What happens in a chemical change?', back: 'New substance forms with different properties (burning, rusting, cooking)' }
        ],
        notes: []
      },
      {
        id: 'biology-expert-flashcards',
        title: 'Biology Expert Flashcards - Advanced Concepts',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'biology-ecosystems-deep',
        title: 'Advanced Ecosystems - Deep Dive Analysis',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'biology-genetics-intro',
        title: 'Introduction to Genetics & Heredity',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      }
    ]
  },
  testReview: {
    id: 'testReview',
    name: 'Test Review Guide',
    description: '10 comprehensive study guides covering everything for your tests',
    icon: Target,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-review',
        title: 'Biology Test - What You Need to Know',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Lesson 1: Biodiversity Types',
            emoji: '🌿',
            points: [
              'What are the three types of biodiversity? Provide an example of each',
              'Genetic, species, and ecosystem diversity'
            ]
          },
          {
            subtitle: 'Lesson 2: H.I.P.P.O.C Threats',
            emoji: '⚠️',
            points: [
              'Explain what each letter of H.I.P.P.O.C stands for',
              'Provide an example of each threat',
              'Describe one solution to address each threat'
            ]
          },
          {
            subtitle: 'Lesson 3: Ecosystem Factors',
            emoji: '🌍',
            points: [
              'Differentiate between biotic and abiotic factors',
              'Name 6 examples of each type',
              'Explain sustainable vs non-sustainable ecosystems',
              'Name and describe each of the 4 spheres',
              'Provide examples of interactions between spheres'
            ]
          },
          {
            subtitle: 'Lesson 4: Ecosystem Services & Types',
            emoji: '🎯',
            points: [
              'Explain what an ecosystem service is',
              'Give two examples of ecosystem services',
              'Difference between natural and artificial ecosystems',
              'Provide examples of each'
            ]
          },
          {
            subtitle: 'Lesson 5: Symbiosis & Relationships',
            emoji: '🤝',
            points: [
              'What is symbiosis?',
              'Different types of symbiotic relationships (mutualism, commensalism, parasitism)',
              'Give examples of each type'
            ]
          },
          {
            subtitle: 'Lesson 6: Food Chains & Energy',
            emoji: '🔗',
            points: [
              'What is a food chain?',
              'Practice aquatic and terrestrial food chains',
              'Include trophic levels and arrows for energy flow',
              'How much energy passes between levels? (10%)',
              'What happens to the other 90%?'
            ]
          },
          {
            subtitle: 'Lesson 7: Energy Pyramids',
            emoji: '🔺',
            points: [
              'Draw an energy pyramid for a food chain',
              'If producers have 54,670 kcal, calculate each level',
              'Explain bioaccumulation vs biomagnification',
              'Provide examples for each'
            ]
          },
          {
            subtitle: 'Lesson 8: Nutrient Cycles',
            emoji: '♻️',
            points: [
              'What are nutrients? Why are they important?',
              'Examples of reservoirs and transfer processes',
              'Outline Carbon cycle with flow diagram (reservoirs + processes)',
              'Know photosynthesis and cellular respiration (reactants + products)',
              'How do human activities affect these processes?',
              'Outline Nitrogen cycle with flow diagram'
            ]
          },
          {
            subtitle: 'Lesson 9: Invasive Species',
            emoji: '🦟',
            points: [
              'What are invasive species? What criteria defines them?',
              'Examples of invasive species',
              'For one species: origin, location where invasive, harm caused',
              'Describe strategies to control/manage invasive species'
            ]
          },
          {
            subtitle: 'Lesson 10: Climate Change & Restoration',
            emoji: '🌡️',
            points: [
              'What is climate change? Evidence that climate is changing?',
              'Worldwide impacts of climate change',
              'How to fix damaged ecosystems:',
              'Describe reforestation, bioaugmentation, and bioremediation'
            ]
          }
        ]
      },
      {
        id: 'chemistry-review',
        title: 'Chemistry Test - What You Need to Know',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Lesson 1: Safety + Lab Equipment',
            emoji: '🥽',
            points: [
              'Be familiar with WHMIS safety labels on chemical containers',
              'Know all lab safety rules',
              'Identify common lab equipment'
            ]
          },
          {
            subtitle: 'Lesson 2: Types of Matter',
            emoji: '🧪',
            points: [
              'Distinguish between pure substances and mixtures',
              'Heterogeneous mixtures: mechanical mixtures, suspensions, emulsions',
              'Homogeneous mixtures: solutions and alloys',
              'Be able to classify examples of each type'
            ]
          },
          {
            subtitle: 'Lesson 3: Properties of Matter',
            emoji: '⚖️',
            points: [
              'Distinguish chemical vs physical properties (with examples)',
              'Distinguish quantitative vs qualitative properties (with examples)',
              'Know how to solve density problems',
              'Describe how density changes when mass/volume increases or decreases',
              'Draw (plot) a line graph by hand from supplied data',
              'Use a mass vs volume graph to find density of an object'
            ]
          },
          {
            subtitle: 'Lesson 4: Physical/Chemical Changes',
            emoji: '🔬',
            points: [
              'Explain the meaning of physical change vs chemical change',
              'List evidence to look for when checking for chemical change',
              'Color change, gas production, temperature change, energy production, precipitate'
            ]
          },
          {
            subtitle: 'Lesson 5: Organization of Periodic Table',
            emoji: '📋',
            points: [
              'Identify properties and location of families: alkali metals, alkaline earth metals, halogens, noble gases',
              'List name and symbols for first 20 elements',
              'State properties of metals and non-metals',
              'Identify metals, non-metals, metalloids using Periodic Table'
            ]
          },
          {
            subtitle: 'Lesson 6: Models of the Atom',
            emoji: '🔭',
            points: [
              'Outline contributions of Dalton, Thomson, Rutherford, and Bohr',
              'Know the names of each scientist\'s atomic model',
              'Dalton: solid sphere, Thomson: plum pudding, Rutherford: nuclear, Bohr: planetary'
            ]
          },
          {
            subtitle: 'Lesson 7: Subatomic Particles + Bohr-Rutherford Diagrams',
            emoji: '⚛️',
            points: [
              'Explain electrons, protons, neutrons (charge and mass)',
              'Use periodic table to determine # of protons, neutrons, electrons',
              'Draw Bohr-Rutherford diagrams for first 20 elements',
              'Explain what an isotope is',
              'Recognize isotopes in a series of diagrams'
            ]
          },
          {
            subtitle: 'Lesson 8: Valence Electrons & Ions',
            emoji: '💫',
            points: [
              'Explain what valence electrons are',
              'Explain and draw Lewis dot diagrams for different elements',
              'Use periodic table to calculate protons, neutrons, electrons for ions',
              'Understand cations (positive) and anions (negative)'
            ]
          }
        ]
      }
    ]
  },
  practiceQuestions: {
    id: 'practiceQuestions',
    name: 'Practice Questions',
    description: '7 quizzes with 80+ questions and instant feedback',
    icon: FileText,
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=1200&h=600&fit=crop',
    isQuizSection: true,
    sections: [
      {
        id: 'biology-advanced-quiz',
        title: 'Biology Advanced Quiz - Ecosystems & Evolution',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-advanced-quiz',
        title: 'Chemistry Advanced Quiz - Chemical Reactions & Bonding',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'physics-advanced-quiz',
        title: 'Physics Advanced Quiz - Circuit Analysis & Power',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'space-advanced-quiz',
        title: 'Space Advanced Quiz - Planetary Science & Exploration',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'biology-master-quiz',
        title: 'Biology Master Quiz - Comprehensive Test Prep',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'biology-practice-1',
        title: 'Biology Practice Quiz 1 - Biodiversity & Threats',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What are the three types of biodiversity?',
            options: ['Genetic, species, ecosystem', 'Plant, animal, microbe', 'Land, water, air', 'Producer, consumer, decomposer'],
            correct: 0,
            explanation: 'The three types are genetic diversity (variation within species), species diversity (variety of species), and ecosystem diversity (variety of ecosystems).'
          },
          {
            question: 'In H.I.P.P.O.C., what does the "H" stand for?',
            options: ['Human population', 'Habitat destruction', 'Hunting', 'Hazardous waste'],
            correct: 1,
            explanation: 'H stands for Habitat Destruction - the removal of living spaces that species need to survive.'
          },
          {
            question: 'Which is an example of a biotic factor?',
            options: ['Sunlight', 'Water', 'Bacteria', 'Temperature'],
            correct: 2,
            explanation: 'Bacteria are living organisms, making them biotic factors. Sunlight, water, and temperature are abiotic (non-living) factors.'
          },
          {
            question: 'What does the "C" in H.I.P.P.O.C. represent?',
            options: ['Chemicals', 'Climate change', 'Conservation', 'Carbon emissions'],
            correct: 1,
            explanation: 'C stands for Climate Change - alterations in global weather patterns that threaten ecosystems.'
          },
          {
            question: 'Which is an example of genetic diversity?',
            options: ['Different fish species in a reef', 'Different dog breeds', 'Different ecosystems in a region', 'Different trees in a forest'],
            correct: 1,
            explanation: 'Different dog breeds are an example of genetic diversity - variation within a single species (dogs).'
          },
          {
            question: 'What does "I" stand for in H.I.P.P.O.C.?',
            options: ['Insects', 'Invasive species', 'Industrial waste', 'Ice melting'],
            correct: 1,
            explanation: 'I stands for Invasive Species - non-native organisms that cause harm to native ecosystems.'
          },
          {
            question: 'Which is an example of species diversity?',
            options: ['Different dog breeds', 'Different types of fish in a coral reef', 'Forests and grasslands', 'Tall and short oak trees'],
            correct: 1,
            explanation: 'Different types of fish in a coral reef is species diversity - variety of different species in one habitat.'
          },
          {
            question: 'What does "P" (first one) stand for in H.I.P.P.O.C.?',
            options: ['Plants', 'Pollution', 'Pesticides', 'Plastics'],
            correct: 1,
            explanation: 'The first P stands for Pollution - toxic chemicals, waste, and contaminants that harm organisms.'
          },
          {
            question: 'Which is an abiotic factor?',
            options: ['Mushrooms', 'Temperature', 'Bacteria', 'Grass'],
            correct: 1,
            explanation: 'Temperature is abiotic (non-living). Mushrooms, bacteria, and grass are all living (biotic).'
          },
          {
            question: 'What does "O" stand for in H.I.P.P.O.C.?',
            options: ['Oil spills', 'Overharvesting', 'Oxygen depletion', 'Ocean acidification'],
            correct: 1,
            explanation: 'O stands for Overharvesting - taking too many organisms (fishing, hunting, logging) faster than they can reproduce.'
          },
          {
            question: 'Which is an example of ecosystem diversity?',
            options: ['Different breeds of cats', 'Variety of birds in a forest', 'Forests, wetlands, and grasslands in a region', 'Different colored flowers'],
            correct: 2,
            explanation: 'Forests, wetlands, and grasslands represent ecosystem diversity - variety of different ecosystems in an area.'
          },
          {
            question: 'What is a sustainable ecosystem?',
            options: ['One with no predators', 'One that can maintain itself over time', 'One with only plants', 'One without humans'],
            correct: 1,
            explanation: 'A sustainable ecosystem can maintain itself over time with resources regenerating as fast as they are used.'
          }
        ],
        notes: []
      },
      {
        id: 'biology-practice-2',
        title: 'Biology Practice Quiz 2 - Energy & Food Chains',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'How much energy is transferred between trophic levels?',
            options: ['50%', '25%', '10%', '90%'],
            correct: 2,
            explanation: 'Only about 10% of energy passes to the next trophic level. The remaining 90% is lost as heat, movement, and waste.'
          },
          {
            question: 'If producers have 50,000 kcal, how much energy do primary consumers get?',
            options: ['50,000 kcal', '25,000 kcal', '5,000 kcal', '500 kcal'],
            correct: 2,
            explanation: 'Primary consumers receive 10% of the producer energy: 50,000 × 0.10 = 5,000 kcal.'
          },
          {
            question: 'What is bioaccumulation?',
            options: ['Increase up food chain', 'Build-up in one organism', 'Energy transfer', 'Nutrient cycling'],
            correct: 1,
            explanation: 'Bioaccumulation is the build-up of a substance within a single organism over time, like mercury accumulating in a fish.'
          },
          {
            question: 'What process removes CO₂ from the atmosphere?',
            options: ['Respiration', 'Photosynthesis', 'Combustion', 'Decomposition'],
            correct: 1,
            explanation: 'Photosynthesis removes CO₂ from the atmosphere as plants convert it into glucose using sunlight.'
          },
          {
            question: 'In the nitrogen cycle, what converts N₂ into ammonia?',
            options: ['Photosynthesis', 'Respiration', 'Nitrogen fixation', 'Denitrification'],
            correct: 2,
            explanation: 'Nitrogen fixation (by bacteria or lightning) converts atmospheric N₂ into ammonia (NH₃) that plants can use.'
          },
          {
            question: 'What is biomagnification?',
            options: ['Energy loss between levels', 'Toxin concentration increases up food chain', 'Population growth', 'Nutrient absorption'],
            correct: 1,
            explanation: 'Biomagnification is when toxin concentration increases as you move up the food chain. Top predators have the highest concentrations.'
          },
          {
            question: 'If primary consumers have 10,000 kcal, how much do secondary consumers get?',
            options: ['10,000 kcal', '5,000 kcal', '1,000 kcal', '100 kcal'],
            correct: 2,
            explanation: 'Secondary consumers get 10% of primary consumer energy: 10,000 × 0.10 = 1,000 kcal.'
          },
          {
            question: 'What is the correct order of a food chain?',
            options: ['Consumer → Producer → Decomposer', 'Producer → Consumer → Decomposer', 'Decomposer → Producer → Consumer', 'Consumer → Decomposer → Producer'],
            correct: 1,
            explanation: 'Food chains always start with producers (plants), then consumers (animals), and decomposers break down dead matter.'
          },
          {
            question: 'Which organism is a primary consumer?',
            options: ['Grass', 'Rabbit', 'Fox', 'Mushroom'],
            correct: 1,
            explanation: 'A rabbit is a primary consumer (herbivore) that eats producers (plants). Fox is secondary, mushroom is decomposer.'
          },
          {
            question: 'Where does energy in food chains originally come from?',
            options: ['Soil', 'Water', 'Sun', 'Air'],
            correct: 2,
            explanation: 'All energy in food chains originally comes from the sun. Plants capture solar energy through photosynthesis.'
          },
          {
            question: 'What happens to the 90% of energy that doesn\'t transfer?',
            options: ['It disappears', 'Lost as heat and waste', 'Stored in soil', 'Goes to decomposers'],
            correct: 1,
            explanation: 'The 90% is lost as heat from movement and metabolism, and through waste products. Only 10% is stored in body tissues.'
          },
          {
            question: 'Which has the most energy in an energy pyramid?',
            options: ['Top predators', 'Secondary consumers', 'Primary consumers', 'Producers'],
            correct: 3,
            explanation: 'Producers at the bottom of the pyramid have the most energy. Energy decreases as you move up each level.'
          }
        ],
        notes: []
      },
      {
        id: 'biology-practice-3',
        title: 'Biology Practice Quiz 3 - Cycles & Restoration',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which is NOT a characteristic of invasive species?',
            options: ['Native to the area', 'Rapid reproduction', 'Outcompete natives', 'Disrupt ecosystems'],
            correct: 0,
            explanation: 'Invasive species are NOT native to the area - they are introduced from elsewhere and cause harm to native ecosystems.'
          },
          {
            question: 'What is bioremediation?',
            options: ['Planting trees', 'Adding helpful organisms', 'Using bacteria to break down toxins', 'Reducing pollution'],
            correct: 1,
            explanation: 'Bioremediation involves adding species that break down waste and improve soil/water quality to restore ecosystems.'
          },
          {
            question: 'What is the photosynthesis equation (simplified)?',
            options: ['CO₂ + H₂O → Glucose + O₂', 'Glucose + O₂ → CO₂ + H₂O', 'N₂ → NH₃', 'CH₄ + O₂ → CO₂'],
            correct: 0,
            explanation: 'Photosynthesis: CO₂ + H₂O → C₆H₁₂O₆ + O₂. Plants use carbon dioxide and water to make glucose and oxygen.'
          },
          {
            question: 'What does reforestation mean?',
            options: ['Removing forests', 'Planting trees where cut down', 'Creating new forests', 'Protecting old forests'],
            correct: 1,
            explanation: 'Reforestation is planting trees in areas where they were previously cut down to restore ecosystems.'
          },
          {
            question: 'Which sphere contains all living organisms?',
            options: ['Atmosphere', 'Biosphere', 'Hydrosphere', 'Lithosphere'],
            correct: 1,
            explanation: 'The biosphere contains all living organisms on Earth - plants, animals, bacteria, and fungi.'
          },
          {
            question: 'What is cellular respiration?',
            options: ['Making oxygen', 'Breaking down glucose for energy', 'Fixing nitrogen', 'Absorbing sunlight'],
            correct: 1,
            explanation: 'Cellular respiration breaks down glucose with oxygen to release energy (ATP) that organisms need to survive.'
          },
          {
            question: 'What is the atmosphere?',
            options: ['All water on Earth', 'Layer of gases around Earth', 'All living things', 'Earth\'s crust'],
            correct: 1,
            explanation: 'The atmosphere is the layer of gases surrounding Earth, including oxygen, nitrogen, and carbon dioxide.'
          },
          {
            question: 'What is bioaugmentation?',
            options: ['Adding trees', 'Using bacteria/fungi to neutralize toxins', 'Removing invasive species', 'Filtering water'],
            correct: 1,
            explanation: 'Bioaugmentation uses bacteria or fungi to neutralize toxins and pollutants, like in the BP oil spill cleanup.'
          },
          {
            question: 'What do decomposers do?',
            options: ['Make food from sunlight', 'Eat plants', 'Break down dead organisms', 'Hunt other animals'],
            correct: 2,
            explanation: 'Decomposers break down dead plants and animals, returning nutrients to the soil for producers to use.'
          },
          {
            question: 'What is nitrification?',
            options: ['N₂ to NH₃', 'NH₃ to NO₃⁻', 'NO₃⁻ to N₂', 'N₂ to protein'],
            correct: 1,
            explanation: 'Nitrification is when bacteria convert ammonia (NH₃) to nitrite (NO₂⁻) and then to nitrate (NO₃⁻) that plants can use.'
          },
          {
            question: 'Which is an example of an invasive species in North America?',
            options: ['White-tailed deer', 'Bald eagle', 'Zebra mussels', 'Oak trees'],
            correct: 2,
            explanation: 'Zebra mussels are invasive in North American lakes. They came from Europe and outcompete native mussels.'
          },
          {
            question: 'What is denitrification?',
            options: ['Adding nitrogen to soil', 'Converting nitrate back to N₂ gas', 'Plants absorbing nitrogen', 'Bacteria dying'],
            correct: 1,
            explanation: 'Denitrification is when bacteria convert nitrate (NO₃⁻) back into nitrogen gas (N₂) that returns to the atmosphere.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-bonding-quiz',
        title: 'Chemistry Advanced Quiz - Chemical Bonding & Reactions',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        quiz: [],
        notes: []
      },
      {
        id: 'chemistry-practice-1',
        title: 'Chemistry Practice Quiz 1 - Safety & Matter',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which WHMIS symbol indicates a flammable substance?',
            options: ['Skull and crossbones', 'Flame', 'Exclamation mark', 'Test tube'],
            correct: 1,
            explanation: 'The flame symbol indicates flammable substances that catch fire easily from heat, sparks, or flames.'
          },
          {
            question: 'What type of mixture is salt water?',
            options: ['Heterogeneous', 'Homogeneous', 'Suspension', 'Mechanical'],
            correct: 1,
            explanation: 'Salt water is a homogeneous mixture (solution) - it is uniform throughout and you cannot see the individual parts.'
          },
          {
            question: 'Which is a chemical property?',
            options: ['Color', 'Density', 'Combustibility', 'Melting point'],
            correct: 2,
            explanation: 'Combustibility (ability to burn) is a chemical property because it describes how a substance reacts with other substances.'
          },
          {
            question: 'What is the difference between an element and a compound?',
            options: ['Elements are pure, compounds are mixed', 'Elements have one atom type, compounds have bonded elements', 'No difference', 'Compounds are always solid'],
            correct: 1,
            explanation: 'Elements contain only one type of atom (like oxygen), while compounds contain two or more elements chemically bonded together (like H₂O).'
          },
          {
            question: 'Which is evidence of a chemical change?',
            options: ['Melting', 'Breaking', 'Color change', 'Dissolving'],
            correct: 2,
            explanation: 'Color change is evidence of a chemical change. Melting, breaking, and dissolving are typically physical changes.'
          },
          {
            question: 'What does the skull and crossbones WHMIS symbol mean?',
            options: ['Flammable', 'Poisonous/toxic', 'Corrosive', 'Explosive'],
            correct: 1,
            explanation: 'The skull and crossbones indicates poisonous or toxic substances that can cause death or serious injury if swallowed or inhaled.'
          },
          {
            question: 'Which is a pure substance?',
            options: ['Salt water', 'Air', 'Gold', 'Trail mix'],
            correct: 2,
            explanation: 'Gold is a pure substance (element). Salt water, air, and trail mix are all mixtures.'
          },
          {
            question: 'What type of mixture is sand and water?',
            options: ['Solution', 'Homogeneous', 'Heterogeneous', 'Compound'],
            correct: 2,
            explanation: 'Sand and water is a heterogeneous mixture because you can see the different parts (sand particles in water).'
          },
          {
            question: 'Which is a physical property?',
            options: ['Flammability', 'Reactivity with acid', 'Melting point', 'Combustibility'],
            correct: 2,
            explanation: 'Melting point is a physical property - it can be observed without changing the substance. The others are chemical properties.'
          },
          {
            question: 'What is a quantitative property?',
            options: ['Color', 'Texture', 'Mass', 'Odor'],
            correct: 2,
            explanation: 'Mass is quantitative (measured with numbers). Color, texture, and odor are qualitative (descriptive).'
          },
          {
            question: 'Which safety rule is most important in the lab?',
            options: ['Wear safety goggles', 'All of them', 'Wash hands', 'Clean up spills'],
            correct: 1,
            explanation: 'All safety rules are important! They work together to keep you safe. Never skip any safety procedures.'
          },
          {
            question: 'What does H₂O represent?',
            options: ['Element', 'Mixture', 'Compound', 'Solution'],
            correct: 2,
            explanation: 'H₂O (water) is a compound - two or more elements (hydrogen and oxygen) chemically bonded together.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-2',
        title: 'Chemistry Practice Quiz 2 - Density & Properties',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'A substance has mass of 80g and volume of 20cm³. What is its density?',
            options: ['2 g/cm³', '4 g/cm³', '60 g/cm³', '100 g/cm³'],
            correct: 1,
            explanation: 'D = m/V = 80g / 20cm³ = 4 g/cm³'
          },
          {
            question: 'Will an object with density 1.5 g/cm³ float or sink in water (1.0 g/cm³)?',
            options: ['Float', 'Sink', 'Stay suspended', 'Depends on size'],
            correct: 1,
            explanation: 'The object will sink because its density (1.5 g/cm³) is greater than water\'s density (1.0 g/cm³).'
          },
          {
            question: 'Which is a qualitative property?',
            options: ['Mass', 'Color', 'Volume', 'Density'],
            correct: 1,
            explanation: 'Color is qualitative (descriptive). Mass, volume, and density are quantitative (measured with numbers).'
          },
          {
            question: 'What is the density formula?',
            options: ['D = m × V', 'D = m / V', 'D = V / m', 'D = m + V'],
            correct: 1,
            explanation: 'Density = mass / volume (D = m/V). This tells us how much mass is in a given volume.'
          },
          {
            question: 'Which separation method would you use to separate sand from water?',
            options: ['Evaporation', 'Filtration', 'Distillation', 'Magnetism'],
            correct: 1,
            explanation: 'Filtration separates solids from liquids. The filter paper catches sand while water passes through.'
          },
          {
            question: 'An object has density 0.8 g/cm³. Will it float in water (1.0 g/cm³)?',
            options: ['Yes, float', 'No, sink', 'Cannot tell', 'Depends on shape'],
            correct: 0,
            explanation: 'It will float because its density (0.8) is less than water\'s density (1.0). Objects less dense than the liquid float.'
          },
          {
            question: 'If mass increases and volume stays the same, what happens to density?',
            options: ['Increases', 'Decreases', 'Stays the same', 'Becomes zero'],
            correct: 0,
            explanation: 'Density increases. Since D = m/V, if mass goes up and volume stays the same, density must increase.'
          },
          {
            question: 'Which method separates liquids with different boiling points?',
            options: ['Filtration', 'Magnetism', 'Distillation', 'Chromatography'],
            correct: 2,
            explanation: 'Distillation separates liquids based on different boiling points. The liquid with lower boiling point evaporates first.'
          },
          {
            question: 'What is the mass of an object with density 2 g/cm³ and volume 30 cm³?',
            options: ['15g', '32g', '60g', '28g'],
            correct: 2,
            explanation: 'Rearrange D = m/V to m = D × V. So m = 2 g/cm³ × 30 cm³ = 60g'
          },
          {
            question: 'Which tool would you use to measure liquid volume?',
            options: ['Electronic balance', 'Graduated cylinder', 'Ruler', 'Thermometer'],
            correct: 1,
            explanation: 'A graduated cylinder measures liquid volume accurately. A balance measures mass, not volume.'
          },
          {
            question: 'What is evaporation used for?',
            options: ['Separating mixtures', 'Getting dissolved solid from liquid', 'Measuring density', 'Creating compounds'],
            correct: 1,
            explanation: 'Evaporation separates a dissolved solid from a liquid. The liquid evaporates and leaves the solid behind (like getting salt from salt water).'
          },
          {
            question: 'If volume increases and mass stays the same, density will:',
            options: ['Increase', 'Decrease', 'Stay the same', 'Double'],
            correct: 1,
            explanation: 'Density decreases. Since D = m/V, if volume increases while mass stays constant, density must decrease.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-3',
        title: 'Chemistry Practice Quiz 3 - Atoms & Periodic Table',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'What is the symbol for potassium?',
            options: ['P', 'Po', 'K', 'Pt'],
            correct: 2,
            explanation: 'Potassium has the symbol K (from its Latin name Kalium). It is element #19.'
          },
          {
            question: 'Which scientist proposed the plum pudding model?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 1,
            explanation: 'J.J. Thomson proposed the plum pudding model after discovering electrons - positive material with embedded electrons.'
          },
          {
            question: 'An atom has 6 protons, 6 neutrons, and 6 electrons. What element is it?',
            options: ['Nitrogen', 'Carbon', 'Oxygen', 'Boron'],
            correct: 1,
            explanation: 'The number of protons determines the element. 6 protons = Carbon (C).'
          },
          {
            question: 'How many electrons can the second shell hold?',
            options: ['2', '4', '8', '18'],
            correct: 2,
            explanation: 'The second electron shell can hold a maximum of 8 electrons.'
          },
          {
            question: 'What is an ion with more electrons than protons called?',
            options: ['Cation', 'Anion', 'Isotope', 'Neutral'],
            correct: 1,
            explanation: 'An anion is a negatively charged ion that has gained electrons (more electrons than protons).'
          },
          {
            question: 'What is the symbol for sodium?',
            options: ['S', 'So', 'Na', 'Sd'],
            correct: 2,
            explanation: 'Sodium has the symbol Na (from its Latin name Natrium). It is element #11.'
          },
          {
            question: 'How many electrons can the first shell hold?',
            options: ['1', '2', '8', '18'],
            correct: 1,
            explanation: 'The first electron shell can hold a maximum of 2 electrons.'
          },
          {
            question: 'Which scientist discovered that atoms are mostly empty space?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 2,
            explanation: 'Rutherford discovered atoms are mostly empty space with a dense nucleus through his gold foil experiment.'
          },
          {
            question: 'What determines the identity of an element?',
            options: ['Number of neutrons', 'Number of protons', 'Number of electrons', 'Atomic mass'],
            correct: 1,
            explanation: 'The number of protons (atomic number) determines which element it is. This never changes.'
          },
          {
            question: 'What are valence electrons?',
            options: ['Electrons in the nucleus', 'Electrons in the innermost shell', 'Electrons in the outermost shell', 'All electrons'],
            correct: 2,
            explanation: 'Valence electrons are in the outermost shell and determine how atoms bond and react.'
          },
          {
            question: 'An atom has 8 protons and 10 neutrons. What is its mass number?',
            options: ['8', '10', '18', '2'],
            correct: 2,
            explanation: 'Mass number = protons + neutrons = 8 + 10 = 18'
          },
          {
            question: 'Which group contains the most unreactive elements?',
            options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'],
            correct: 3,
            explanation: 'Group 18 (Noble Gases) are the most unreactive because they have full outer electron shells.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-practice-4',
        title: 'Chemistry Practice Quiz 4 - Advanced Concepts',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        quiz: [
          {
            question: 'Which group on the periodic table is most reactive?',
            options: ['Noble gases', 'Alkali metals', 'Halogens', 'Transition metals'],
            correct: 1,
            explanation: 'Alkali metals (Group 1) are the most reactive metals because they easily lose their single valence electron.'
          },
          {
            question: 'What are isotopes?',
            options: ['Same element, different electrons', 'Same element, different neutrons', 'Different elements, same mass', 'Charged atoms'],
            correct: 1,
            explanation: 'Isotopes are atoms of the same element with different numbers of neutrons (same protons, different mass).'
          },
          {
            question: 'How many valence electrons do noble gases have?',
            options: ['1', '4', '7', '8'],
            correct: 3,
            explanation: 'Noble gases have 8 valence electrons (except helium with 2), making them stable and unreactive.'
          },
          {
            question: 'What charge does a cation have?',
            options: ['Positive', 'Negative', 'Neutral', 'Variable'],
            correct: 0,
            explanation: 'A cation has a positive charge because it has lost electrons (more protons than electrons).'
          },
          {
            question: 'Which atomic model showed that atoms are mostly empty space?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 2,
            explanation: 'Rutherford\'s nuclear model showed that atoms are mostly empty space with a dense nucleus at the center.'
          },
          {
            question: 'How many valence electrons do halogens have?',
            options: ['1', '5', '7', '8'],
            correct: 2,
            explanation: 'Halogens (Group 17) have 7 valence electrons. They need to gain 1 electron to have a full outer shell.'
          },
          {
            question: 'What is the difference between mass number and atomic mass?',
            options: ['They are the same', 'Mass number is rounded, atomic mass is precise', 'Mass number includes electrons', 'No difference'],
            correct: 1,
            explanation: 'Mass number is the total protons + neutrons (whole number). Atomic mass is the average mass of all isotopes (decimal).'
          },
          {
            question: 'Which particles are in the nucleus?',
            options: ['Protons only', 'Protons and electrons', 'Protons and neutrons', 'Neutrons and electrons'],
            correct: 2,
            explanation: 'The nucleus contains protons (positive) and neutrons (neutral). Electrons orbit outside the nucleus.'
          },
          {
            question: 'How do you calculate the number of neutrons?',
            options: ['Atomic number - mass number', 'Mass number - atomic number', 'Protons + electrons', 'Atomic mass × 2'],
            correct: 1,
            explanation: 'Neutrons = Mass number - Atomic number (or Mass number - Protons)'
          },
          {
            question: 'What happens when an atom gains electrons?',
            options: ['Becomes a cation', 'Becomes an anion', 'Becomes neutral', 'Changes element'],
            correct: 1,
            explanation: 'When an atom gains electrons, it becomes negatively charged and is called an anion.'
          },
          {
            question: 'Which scientist proposed electrons orbit in specific energy levels?',
            options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'],
            correct: 3,
            explanation: 'Niels Bohr proposed that electrons orbit the nucleus in specific energy levels or shells (planetary model).'
          },
          {
            question: 'What is the atomic number?',
            options: ['Number of neutrons', 'Number of protons', 'Number of electrons in outer shell', 'Total particles'],
            correct: 1,
            explanation: 'Atomic number is the number of protons in an atom. This identifies which element it is.'
          }
        ],
        notes: []
      },
      {
        id: 'chemistry-mastery-flashcards',
        title: 'Chemistry Mastery Flashcards - Complete Review',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-reactions-advanced',
        title: 'Advanced Chemical Reactions & Equations',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      },
      {
        id: 'chemistry-lab-techniques',
        title: 'Laboratory Techniques & Procedures',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        locked: true,
        flashcards: [],
        notes: []
      }
    ]
  },
  worksheets: {
    id: 'worksheets',
    name: 'Practice Worksheets',
    description: '12 detailed worksheets with 60+ problems and step-by-step answers',
    icon: ClipboardList,
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'biology-worksheets',
        title: 'Biology Practice Worksheets',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Worksheet 1: Biodiversity & H.I.P.P.O.C',
            emoji: '📝',
            points: [
              '1. Define the three types of biodiversity and give an example of each.',
              '2. Create a diagram showing genetic diversity in dogs (3 different breeds).',
              '3. List all letters of H.I.P.P.O.C with full names and one example for each.',
              '4. Choose one H.I.P.P.O.C threat and propose 2 solutions to address it.',
              '5. Explain which H.I.P.P.O.C threat you think is most serious and why.'
            ],
            answers: [
              'Genetic diversity: variation within a species (e.g., different dog breeds) • Species diversity: variety of species in a habitat (e.g., coral reef fish) • Ecosystem diversity: variety of ecosystems in a region (e.g., forests, wetlands, grasslands)',
              'Draw three different dog breeds showing physical differences • Label traits like size, coat color, ear shape • Explain these are same species but different genes',
              'H = Habitat Destruction (deforestation) • I = Invasive Species (zebra mussels) • P = Pollution (oil spills) • P = Population/Human (urban sprawl) • O = Overharvesting (overfishing cod) • C = Climate Change (coral bleaching)',
              'Choose any threat • Example: Habitat Destruction → Solution 1: Protected areas/parks • Solution 2: Reforestation programs',
              'Answers vary • Should explain reasoning • Example: Climate change affects all ecosystems globally • Discuss long-term impacts'
            ]
          },
          {
            subtitle: 'Worksheet 2: Ecosystem Factors & Services',
            emoji: '📝',
            points: [
              '1. List 6 biotic factors and 6 abiotic factors in a forest ecosystem.',
              '2. Explain the difference between sustainable and non-sustainable ecosystems.',
              '3. Name the 4 spheres and give 2 examples for each.',
              '4. Describe 3 interactions between different spheres.',
              '5. Define ecosystem services and list one example from each category (provisioning, regulating, supporting, cultural).',
              '6. Compare natural vs artificial ecosystems with examples.'
            ],
            answers: [
              'Biotic: trees, deer, birds, insects, fungi, bacteria • Abiotic: sunlight, water, soil, air, temperature, rocks',
              'Sustainable: can maintain itself over time, resources regenerate, balanced ecosystem • Non-sustainable: resources depleted faster than replaced, imbalanced, eventually collapses',
              'Biosphere (plants, animals) • Atmosphere (air, oxygen) • Hydrosphere (oceans, rivers) • Lithosphere (rocks, soil)',
              'Example 1: Rain (atmosphere) waters plants (biosphere) • Example 2: Plants (biosphere) add oxygen to air (atmosphere) • Example 3: Rivers (hydrosphere) erode rocks (lithosphere)',
              'Ecosystem services = benefits from nature • Provisioning: food/water • Regulating: climate control • Supporting: nutrient cycling • Cultural: recreation/parks',
              'Natural: self-sustaining, biodiversity, no human maintenance (forest, coral reef) • Artificial: human-made, needs maintenance, limited diversity (farm, aquarium)'
            ]
          },
          {
            subtitle: 'Worksheet 3: Food Chains & Energy',
            emoji: '📝',
            points: [
              '1. Draw an aquatic food chain with 4 trophic levels. Label each level.',
              '2. Draw a terrestrial food chain with 4 trophic levels. Label each level.',
              '3. Add arrows to show energy flow direction in your food chains.',
              '4. Calculate: If producers have 100,000 kcal, how much energy does each level receive?',
              '5. Draw an energy pyramid for the calculation above.',
              '6. Explain where the "missing" 90% of energy goes at each level.',
              '7. Why can\'t food chains be infinitely long? Explain using energy transfer.'
            ],
            answers: [
              'Example: Phytoplankton → Small fish → Medium fish → Shark • Label: Producer → Primary consumer → Secondary consumer → Tertiary consumer',
              'Example: Grass → Grasshopper → Mouse → Snake • Label: Producer → Primary consumer → Secondary consumer → Tertiary consumer',
              'Arrows point from food source to consumer • Shows direction energy flows • Each arrow = "is eaten by"',
              'Producers: 100,000 kcal • Primary consumers: 10,000 kcal (10%) • Secondary consumers: 1,000 kcal (10%) • Tertiary consumers: 100 kcal (10%)',
              'Draw pyramid shape • Bottom largest (producers 100,000) • Each level smaller going up • Top smallest (tertiary 100)',
              '90% lost as heat from movement/metabolism • Used for life processes (breathing, moving) • Released as waste • Only 10% stored in body tissues',
              'Not enough energy left after several levels • By 4-5 levels, too little energy to support organisms • Would need massive producer base for tiny top predator population'
            ]
          },
          {
            subtitle: 'Worksheet 4: Bioaccumulation & Nutrient Cycles',
            emoji: '📝',
            points: [
              '1. Define bioaccumulation and biomagnification. Give an example of each.',
              '2. Draw a simple food chain and show how mercury concentration increases at each level.',
              '3. Draw the carbon cycle. Include: atmosphere, biosphere, lithosphere, hydrosphere.',
              '4. Label these processes on your carbon cycle: photosynthesis, respiration, combustion, decomposition, ocean uptake.',
              '5. Write the equation for photosynthesis (both word and chemical formula).',
              '6. Write the equation for cellular respiration (both word and chemical formula).',
              '7. How do humans affect the carbon cycle? List 3 ways.'
            ],
            answers: [
              'Bioaccumulation: toxin builds up in one organism over time (fish absorbs mercury from water) • Biomagnification: concentration increases up food chain (eagle has more mercury than fish it eats)',
              'Example: Plankton (0.01 ppm) → Small fish (0.1 ppm) → Large fish (1 ppm) → Bird (10 ppm) • Show concentration multiplies at each level',
              'Draw four reservoirs in boxes/circles • Atmosphere (CO₂ gas) • Biosphere (living things) • Lithosphere (fossil fuels, rocks) • Hydrosphere (dissolved CO₂ in water)',
              'Photosynthesis: CO₂ from atmosphere to plants • Respiration: CO₂ from organisms to atmosphere • Combustion: CO₂ from burning to atmosphere • Decomposition: CO₂ from dead matter to atmosphere/soil • Ocean uptake: CO₂ from atmosphere to ocean',
              'Word: Carbon dioxide + Water → Glucose + Oxygen • Chemical: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
              'Word: Glucose + Oxygen → Carbon dioxide + Water + Energy • Chemical: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
              'Burning fossil fuels (releases stored carbon) • Deforestation (less CO₂ absorbed) • Agriculture/livestock (releases methane and CO₂)'
            ]
          },
          {
            subtitle: 'Worksheet 5: Nitrogen Cycle & Restoration',
            emoji: '📝',
            points: [
              '1. Draw the nitrogen cycle with reservoirs labeled (atmosphere, soil, organisms, water).',
              '2. Label these processes: nitrogen fixation, nitrification, assimilation, ammonification, denitrification.',
              '3. Explain the role of bacteria in the nitrogen cycle.',
              '4. What are invasive species? List 3 characteristics.',
              '5. Choose one invasive species. State: origin, where it\'s invasive, harm caused, control methods.',
              '6. Define and give examples: reforestation, bioaugmentation, bioremediation.',
              '7. How does climate change affect ecosystems? List 4 impacts.'
            ],
            answers: [
              'Draw cycle showing: Atmosphere (N₂ gas) → Soil (NH₃, NO₃⁻) → Organisms (proteins) → back to atmosphere • Include arrows between reservoirs',
              'Nitrogen fixation: N₂ → NH₃ (atmosphere to soil) • Nitrification: NH₃ → NO₂⁻ → NO₃⁻ (in soil) • Assimilation: NO₃⁻ absorbed by plants • Ammonification: dead matter → NH₄⁺ • Denitrification: NO₃⁻ → N₂ (back to atmosphere)',
              'Bacteria perform most conversions • Rhizobium fixes nitrogen in plant roots • Nitrosomonas/Nitrobacter do nitrification • Decomposers do ammonification • Denitrifying bacteria return N₂ to air',
              'Invasive species: non-native organism that causes harm • Characteristics: rapid reproduction, outcompete natives, lack natural predators, disrupt food chains',
              'Example: Zebra mussels • Origin: Eastern Europe/Russia • Invasive: Great Lakes, North America • Harm: clog water pipes, outcompete native mussels, disrupt food chain • Control: drain/clean boats, chemical treatments',
              'Reforestation: planting trees where cut down (Amazon restoration) • Bioaugmentation: adding bacteria/organisms to break down toxins (oil spill cleanup) • Bioremediation: using organisms to improve soil/water quality (microbes filtering water)',
              'Rising temperatures change habitats • Extreme weather destroys ecosystems • Sea level rise floods coastal areas • Species migration/extinction • Coral bleaching • Changes in precipitation patterns'
            ]
          }
        ]
      },
      {
        id: 'chemistry-worksheets',
        title: 'Chemistry Practice Worksheets',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Worksheet 1: Lab Safety & Matter Classification',
            emoji: '📝',
            points: [
              '1. Draw 5 WHMIS symbols and explain what each one means.',
              '2. List 5 important lab safety rules.',
              '3. Create a flow chart showing how matter is classified (pure substances, mixtures, etc.).',
              '4. Classify these: salt water, gold, pizza, air, H₂O, trail mix, brass.',
              '5. For each mixture above, identify if it\'s homogeneous or heterogeneous and explain why.'
            ],
            answers: [
              'Flame (flammable) • Skull/crossbones (poisonous) • Exclamation (irritant) • Test tube on hand (corrosive) • Circle with flame (oxidizer) • Draw symbols and explain hazards',
              'Wear safety goggles • Tie back long hair • No eating/drinking • Report accidents immediately • Know location of safety equipment • Read labels before using chemicals',
              'Matter → Pure substances (elements, compounds) and Mixtures (homogeneous, heterogeneous) • Show branching diagram',
              'Salt water: homogeneous mixture • Gold: element • Pizza: heterogeneous mixture • Air: homogeneous mixture • H₂O: compound • Trail mix: heterogeneous mixture • Brass: homogeneous mixture (alloy)',
              'Salt water: homogeneous, uniform throughout • Pizza: heterogeneous, see different parts • Air: homogeneous, uniform gas mixture • Trail mix: heterogeneous, see nuts/raisins • Brass: homogeneous, metal alloy is uniform'
            ]
          },
          {
            subtitle: 'Worksheet 2: Properties & Density',
            emoji: '📝',
            points: [
              '1. List 4 qualitative physical properties and 4 quantitative physical properties.',
              '2. List 3 chemical properties with examples.',
              '3. Solve: A rock has mass 150g and volume 50cm³. Find density.',
              '4. Solve: An object has density 2.5 g/mL and mass 75g. Find volume.',
              '5. Solve: A liquid has density 0.8 g/mL and volume 200mL. Find mass.',
              '6. Will an object with density 1.5 g/cm³ float or sink in water (1.0 g/cm³)? Explain.',
              '7. Describe how to find the volume of an irregular shaped object using water displacement.'
            ],
            answers: [
              'Qualitative: color, texture, odor, luster • Quantitative: mass, volume, density, melting point',
              'Combustibility: paper burns • Reactivity with acid: metals produce hydrogen • Stability: iron rusts in oxygen',
              'D = m/V = 150g / 50cm³ = 3 g/cm³',
              'V = m/D = 75g / 2.5 g/mL = 30 mL',
              'm = D × V = 0.8 g/mL × 200mL = 160g',
              'Sink • Object density (1.5) > water density (1.0) • Objects denser than liquid sink',
              'Measure initial water level in graduated cylinder • Carefully place object in water • Measure new water level • Volume = final level - initial level'
            ]
          },
          {
            subtitle: 'Worksheet 3: Physical & Chemical Changes',
            emoji: '📝',
            points: [
              '1. Define physical change and chemical change.',
              '2. List the 5 indicators of a chemical change.',
              '3. Classify these as physical or chemical: ice melting, wood burning, cutting paper, rusting nail, dissolving sugar, cooking egg, breaking glass, baking cake.',
              '4. For each chemical change above, state which indicator(s) you would observe.',
              '5. Explain why dissolving salt in water is a physical change, not chemical.',
              '6. Give 2 examples of chemical changes that produce gas.',
              '7. Give 2 examples of chemical changes that produce heat.'
            ],
            answers: [
              'Physical: same substance, different form, usually reversible (ice → water) • Chemical: new substance forms, difficult to reverse (burning wood → ash)',
              'Color change • Gas production/bubbles • Temperature change • Light production • Precipitate forms (solid in liquid)',
              'Physical: ice melting, cutting paper, dissolving sugar, breaking glass • Chemical: wood burning, rusting nail, cooking egg, baking cake',
              'Wood burning: light, heat, gas, color change • Rusting: color change • Cooking egg: color change, temperature • Baking cake: gas (bubbles), color, temperature',
              'Salt molecules separate but don\'t change • Can evaporate water and get salt back • No new substance formed • Reversible process',
              'Vinegar + baking soda → CO₂ bubbles • Antacid tablet in water → gas bubbles',
              'Combustion (burning wood) • Hand warmer packets • Neutralization reactions'
            ]
          },
          {
            subtitle: 'Worksheet 4: Periodic Table',
            emoji: '📝',
            points: [
              '1. Fill in the table: Elements 1-20 with names and symbols.',
              '2. Where are alkali metals located? List 3 properties.',
              '3. Where are halogens located? List 3 properties.',
              '4. Where are noble gases located? Why are they unreactive?',
              '5. List 5 properties of metals and 5 properties of non-metals.',
              '6. What are metalloids? Give 3 examples.',
              '7. Using the periodic table, identify these as metal, non-metal, or metalloid: Fe, Cl, Si, Na, O, B, Cu.'
            ],
            answers: [
              'H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca • Should know names and symbols for all',
              'Group 1, left side • Soft, highly reactive, shiny, low density, form +1 ions, react with water',
              'Group 17, right side before noble gases • Reactive non-metals, diatomic molecules, form salts, gain 1 electron, poisonous/toxic',
              'Group 18, far right column • Unreactive because full valence shell (8 electrons) • Stable, don\'t need to gain/lose electrons',
              'Metals: shiny, conductive, malleable, ductile, lose electrons • Non-metals: dull, insulators, brittle, gain electrons, lower melting points',
              'Metalloids: properties between metals and non-metals, semiconductors • Examples: Silicon (Si), Boron (B), Arsenic (As), Germanium (Ge)',
              'Fe: metal • Cl: non-metal • Si: metalloid • Na: metal • O: non-metal • B: metalloid • Cu: metal'
            ]
          },
          {
            subtitle: 'Worksheet 5: Atomic Structure',
            emoji: '📝',
            points: [
              '1. Draw and label the 4 atomic models: Dalton, Thomson, Rutherford, Bohr.',
              '2. Describe the contribution of each scientist to atomic theory.',
              '3. Complete the table for these atoms: C, O, Na, Mg, Cl (protons, neutrons, electrons).',
              '4. Draw Bohr-Rutherford diagrams for: H, He, C, N, O, Na, Mg.',
              '5. What are isotopes? Draw Bohr diagrams for Carbon-12 and Carbon-14.',
              '6. An atom has 17 protons, 18 neutrons, 17 electrons. What element is it? Draw its Bohr diagram.'
            ],
            answers: [
              'Dalton: solid sphere • Thomson: plum pudding (positive with electrons) • Rutherford: nucleus with orbiting electrons • Bohr: electrons in specific shells',
              'Dalton: atoms are indivisible spheres • Thomson: discovered electrons, positive material • Rutherford: discovered nucleus, mostly empty space • Bohr: electrons in energy levels/shells',
              'C: 6p, 6n, 6e • O: 8p, 8n, 8e • Na: 11p, 12n, 11e • Mg: 12p, 12n, 12e • Cl: 17p, 18n, 17e',
              'H: 1e in shell 1 • He: 2e in shell 1 • C: 2e in shell 1, 4e in shell 2 • N: 2e, 5e • O: 2e, 6e • Na: 2e, 8e, 1e • Mg: 2e, 8e, 2e',
              'Isotopes: same element, different neutrons • C-12: 6p, 6n, 6e • C-14: 6p, 8n, 6e • Both have 2e in shell 1, 4e in shell 2',
              'Chlorine (Cl) • 17 protons = atomic number 17 • Draw: nucleus with 17p 18n, shell 1: 2e, shell 2: 8e, shell 3: 7e'
            ]
          },
          {
            subtitle: 'Worksheet 6: Valence Electrons & Ions',
            emoji: '📝',
            points: [
              '1. What are valence electrons? Why are they important?',
              '2. Draw Lewis dot diagrams for: H, C, N, O, F, Na, Mg, Al, Cl.',
              '3. How many valence electrons does each group have? Groups 1, 2, 13-18.',
              '4. Define cation and anion. Give 2 examples of each.',
              '5. An ion has 11 protons, 12 neutrons, and 10 electrons. What is its charge? What element?',
              '6. Complete the table for these ions: Na⁺, Cl⁻, Mg²⁺, O²⁻ (protons, neutrons, electrons).',
              '7. Why do atoms form ions? Explain using the concept of stability.'
            ],
            answers: [
              'Electrons in outermost shell • Determine how atoms bond and react • Atoms want full outer shell for stability',
              'H: 1 dot • C: 4 dots • N: 5 dots • O: 6 dots • F: 7 dots • Na: 1 dot • Mg: 2 dots • Al: 3 dots • Cl: 7 dots',
              'Group 1: 1 valence e⁻ • Group 2: 2 • Group 13: 3 • Group 14: 4 • Group 15: 5 • Group 16: 6 • Group 17: 7 • Group 18: 8',
              'Cation: positive ion, lost electrons (Na⁺, Ca²⁺) • Anion: negative ion, gained electrons (Cl⁻, O²⁻)',
              'Charge: +1 (11 protons - 10 electrons) • Element: Sodium (Na) because 11 protons',
              'Na⁺: 11p, 12n, 10e • Cl⁻: 17p, 18n, 18e • Mg²⁺: 12p, 12n, 10e • O²⁻: 8p, 8n, 10e',
              'Atoms form ions to achieve stable electron configuration (full outer shell) • Metals lose electrons to empty outer shell • Non-metals gain electrons to fill outer shell • Noble gas configuration is most stable'
            ]
          }
        ]
      }
    ]
  },
  biology: {
    id: 'biology',
    name: 'Biology: Sustainable Ecosystems',
    description: '9 detailed sections covering biodiversity, food chains, and ecosystem restoration',
    icon: Leaf,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'biology-definitions',
        title: 'Key Biology Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Biodiversity Terms',
            emoji: '🌿',
            points: [
              'BIODIVERSITY: Variety of life in an area (genetic, species, ecosystem)',
              'GENETIC DIVERSITY: Variation of genes within a species',
              'SPECIES DIVERSITY: Variety of different species in a habitat',
              'ECOSYSTEM DIVERSITY: Variety of ecosystems in a region',
              'SPECIES: Group of organisms that can reproduce and produce fertile offspring',
              'POPULATION: All members of one species in an area',
              'HABITAT: Natural home or environment of an organism'
            ]
          },
          {
            subtitle: 'Ecosystem Terms',
            emoji: '🌍',
            points: [
              'ECOSYSTEM: Community of living things interacting with non-living environment',
              'BIOTIC FACTOR: Living component of ecosystem (plants, animals, bacteria)',
              'ABIOTIC FACTOR: Non-living component (sunlight, water, soil, temperature)',
              'SUSTAINABLE ECOSYSTEM: Can maintain itself over time, resources regenerate',
              'BIOSPHERE: All living things on Earth',
              'ATMOSPHERE: Layer of gases surrounding Earth',
              'HYDROSPHERE: All water on Earth',
              'LITHOSPHERE: Earth\'s crust (rocks and soil)'
            ]
          },
          {
            subtitle: 'Organism Roles',
            emoji: '🔗',
            points: [
              'PRODUCER: Organism that makes own food through photosynthesis (plants)',
              'CONSUMER: Organism that eats other organisms for energy',
              'PRIMARY CONSUMER: Herbivore that eats producers (rabbit, deer)',
              'SECONDARY CONSUMER: Carnivore that eats primary consumers (snake, fox)',
              'TERTIARY CONSUMER: Top predator that eats secondary consumers (eagle, shark)',
              'DECOMPOSER: Breaks down dead matter (bacteria, fungi, worms)',
              'HERBIVORE: Eats only plants',
              'CARNIVORE: Eats only animals',
              'OMNIVORE: Eats both plants and animals'
            ]
          },
          {
            subtitle: 'Energy Flow Terms',
            emoji: '⚡',
            points: [
              'FOOD CHAIN: Linear sequence showing who eats whom',
              'FOOD WEB: Interconnected food chains in ecosystem',
              'TROPHIC LEVEL: Position in food chain (producer, primary consumer, etc.)',
              'ENERGY PYRAMID: Diagram showing energy at each trophic level',
              '10% RULE: Only 10% of energy passes to next level, 90% lost as heat',
              'BIOMASS: Total mass of living organisms in an area',
              'BIOACCUMULATION: Build-up of substance in single organism over time',
              'BIOMAGNIFICATION: Increase in toxin concentration up food chain'
            ]
          },
          {
            subtitle: 'Relationships',
            emoji: '🤝',
            points: [
              'SYMBIOSIS: Close relationship between two species',
              'MUTUALISM: Both species benefit (bee and flower)',
              'COMMENSALISM: One benefits, other unaffected (bird nesting in tree)',
              'PARASITISM: One benefits, other harmed (tick on dog)',
              'PREDATION: One organism hunts and eats another',
              'COMPETITION: Organisms compete for same limited resources'
            ]
          },
          {
            subtitle: 'Photosynthesis & Respiration',
            emoji: '🌱',
            points: [
              'PHOTOSYNTHESIS: Plants use CO₂ + water + sunlight → glucose + oxygen',
              'CELLULAR RESPIRATION: Organisms break down glucose + oxygen → CO₂ + water + ATP',
              'ATP: Energy currency of cells',
              'CHLOROPHYLL: Green pigment in plants that captures sunlight',
              'CHLOROPLAST: Organelle where photosynthesis occurs',
              'MITOCHONDRIA: Organelle where cellular respiration occurs'
            ]
          },
          {
            subtitle: 'Nutrient Cycles',
            emoji: '♻️',
            points: [
              'CARBON CYCLE: Movement of carbon through atmosphere, organisms, soil, water',
              'NITROGEN CYCLE: Movement of nitrogen through atmosphere, soil, organisms',
              'NITROGEN FIXATION: Converting N₂ gas to ammonia (by bacteria or lightning)',
              'NITRIFICATION: Converting ammonia to nitrite to nitrate (by bacteria)',
              'DENITRIFICATION: Converting nitrate back to N₂ gas (returns to atmosphere)',
              'AMMONIFICATION: Decomposers release ammonia from dead matter'
            ]
          },
          {
            subtitle: 'Threats to Biodiversity',
            emoji: '⚠️',
            points: [
              'HABITAT DESTRUCTION: Removal of living spaces (deforestation)',
              'INVASIVE SPECIES: Non-native species that cause harm',
              'POLLUTION: Harmful substances in environment (oil spills, chemicals)',
              'OVERHARVESTING: Taking organisms faster than they can reproduce',
              'CLIMATE CHANGE: Long-term changes in temperature and weather patterns',
              'EXTINCTION: Permanent loss of a species',
              'ENDANGERED: Species at risk of extinction'
            ]
          },
          {
            subtitle: 'Conservation & Restoration',
            emoji: '🌲',
            points: [
              'REFORESTATION: Planting trees where they were cut down',
              'BIOREMEDIATION: Using organisms to break down waste and improve environment',
              'BIOAUGMENTATION: Adding bacteria/fungi to neutralize toxins',
              'CONSERVATION: Protection and preservation of ecosystems',
              'SUSTAINABILITY: Meeting current needs without harming future generations',
              'BIODEGRADABLE: Can be broken down naturally by decomposers'
            ]
          }
        ]
      },
      {
        id: 'biodiversity',
        title: 'Three Types of Biodiversity',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Genetic Diversity',
            emoji: '🧬',
            points: [
              'Variation of genes within a species',
              'Example: Different breeds of dogs',
              'Why it matters: Helps species adapt and survive'
            ]
          },
          {
            subtitle: 'Species Diversity',
            emoji: '🐠',
            points: [
              'Variety of species within a habitat',
              'Example: Variety of fish species in a coral reef',
              'More species = More stable ecosystem'
            ]
          },
          {
            subtitle: 'Ecosystem Diversity',
            emoji: '🌍',
            points: [
              'Variety of ecosystems in a region',
              'Example: Forests, wetlands, grasslands in an area',
              'Different ecosystems support different life forms'
            ]
          }
        ]
      },
      {
        id: 'hippoc',
        title: 'H.I.P.P.O.C. - Threats to Biodiversity',
        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'H - Habitat Destruction',
            emoji: '🏗️',
            points: [
              'Removes living spaces for species',
              'Example: Deforestation of Amazon rainforest',
              'Species cannot survive without homes'
            ]
          },
          {
            subtitle: 'I - Invasive Species',
            emoji: '🦟',
            points: [
              'Outsiders compete with native species',
              'Example: Zebra mussels in North American lakes',
              'Disrupts natural balance'
            ]
          },
          {
            subtitle: 'P - Pollution',
            emoji: '🏭',
            points: [
              'Toxic chemicals, waste, and noise',
              'Example: Oil spills in oceans',
              'Kills or harms organisms'
            ]
          },
          {
            subtitle: 'P - Population (Human)',
            emoji: '👥',
            points: [
              'Too many people = more resources used',
              'Example: Urban sprawl reduces wildlife space',
              'Less room for native animals'
            ]
          },
          {
            subtitle: 'O - Overharvesting',
            emoji: '🎣',
            points: [
              'Taking too much (fishing/hunting/logging)',
              'Example: Overfishing of Atlantic cod',
              'Depletes species faster than recovery'
            ]
          },
          {
            subtitle: 'C - Climate Change',
            emoji: '🌡️',
            points: [
              'Alters habitats and weather patterns',
              'Example: Coral bleaching from warming seas',
              'Species struggle to adapt'
            ]
          }
        ]
      },
      {
        id: 'ecology-interactions',
        title: 'Ecological Interactions & Population Dynamics',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'factors',
        title: 'Biotic vs Abiotic Factors',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Biotic Factors (Living)',
            emoji: '🌱',
            points: [
              'Plants, animals, bacteria, fungi',
              'Algae, insects, microorganisms',
              'Note: Dying/decaying things are still biotic (e.g., decaying logs)'
            ]
          },
          {
            subtitle: 'Abiotic Factors (Non-living)',
            emoji: '☀️',
            points: [
              'Sunlight, temperature, water',
              'Soil, air, pH levels',
              'Physical and chemical components'
            ]
          }
        ]
      },
      {
        id: 'biomes-climates',
        title: 'World Biomes & Climate Zones',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'food-chains',
        title: 'Food Chains & Energy Transfer',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Terrestrial Food Chain',
            emoji: '🌾',
            points: [
              'Example: Grass → Grasshopper → Mouse → Snake',
              'Starts with plants (producers)',
              'Energy flows one direction',
              'Each level is called a trophic level'
            ],
            diagram: 'food-chain'
          },
          {
            subtitle: 'Aquatic Food Chain',
            emoji: '🌊',
            points: [
              'Example: Phytoplankton → Small fish → Medium fish → Shark',
              'Starts with microscopic organisms',
              'Same 10% energy transfer rule',
              'Top predators get very little energy'
            ],
            diagram: 'aquatic-food-chain'
          },
          {
            subtitle: 'The 10% Rule',
            emoji: '⚡',
            points: [
              'Only 10% of energy passes to next level',
              '90% lost as heat, movement, waste',
              'That is why food chains are limited in length!'
            ],
            diagram: 'energy-pyramid'
          },
          {
            subtitle: 'Energy Pyramid Example',
            emoji: '🔺',
            points: [
              'Producers: 54,670 kcal',
              'Primary consumers: 5,467 kcal (10%)',
              'Secondary consumers: 547 kcal (10%)',
              'Tertiary consumers: 54.7 kcal (10%)'
            ]
          },
          {
            subtitle: 'Key Points',
            emoji: '📌',
            points: [
              'Decomposers not included in energy pyramid',
              'Ecosystems can survive without consumers',
              'Producers are essential (initial energy source)',
              'Humans not included (can be anywhere in chain)'
            ]
          }
        ]
      },
      {
        id: 'food-webs-advanced',
        title: 'Complex Food Webs & Trophic Cascades',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'bioaccumulation',
        title: 'Bioaccumulation & Biomagnification',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Bioaccumulation',
            emoji: '🐟',
            points: [
              'Build-up of substance in organism over time',
              'Example: Mercury in fish',
              'Individual organism absorbs toxins'
            ]
          },
          {
            subtitle: 'Biomagnification',
            emoji: '🦅',
            points: [
              'Concentration increases up food chain',
              'Example: DDT in birds of prey',
              'Top predators affected most',
              'Small fish eat plankton → bigger fish eat small fish → concentration increases'
            ]
          }
        ]
      },
      {
        id: 'conservation-strategies',
        title: 'Conservation Biology & Management Strategies',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'restoration',
        title: 'Restoration Techniques',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Bio-Augmentation (Fixes)',
            emoji: '🦠',
            points: [
              'Uses bacteria/fungi to neutralize toxins',
              'Example: 2010 BP oil spill cleanup',
              'Breaks down contaminants naturally'
            ]
          },
          {
            subtitle: 'Bio-Remediation (Adds)',
            emoji: '🌿',
            points: [
              'Adding species that break down waste',
              'Improves soil quality and cleans water',
              'Example: Microbes as natural water filtration'
            ]
          },
          {
            subtitle: 'Reforestation',
            emoji: '🌲',
            points: [
              'Planting trees where they were cut',
              'Prevents soil erosion',
              'Provides food, shelter, shade for wildlife'
            ]
          }
        ]
      },
      {
        id: 'carbon-cycle',
        title: 'Carbon Cycle',
        image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Reservoirs',
            emoji: '💨',
            points: [
              'Atmosphere: CO₂ gas',
              'Biosphere: Living organisms',
              'Lithosphere: Fossil fuels, carbonate rocks',
              'Hydrosphere: Dissolved CO₂ in water'
            ]
          },
          {
            subtitle: 'Photosynthesis vs Respiration',
            emoji: '🔄',
            points: [
              'Photosynthesis: Plants absorb CO₂ → glucose',
              'Respiration: Organisms release CO₂',
              'Combustion: Burning fuels releases CO₂',
              'Decomposition: Dead matter releases CO₂',
              'Ocean uptake: Oceans absorb atmospheric CO₂'
            ],
            diagram: 'carbon-cycle'
          },
          {
            subtitle: 'Photosynthesis Equation',
            emoji: '🌱',
            points: [
              '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
              'Uses sunlight energy',
              'Produces glucose (sugar) and oxygen',
              'Only happens in plants and some bacteria'
            ],
            diagram: 'photosynthesis'
          },
          {
            subtitle: 'Cellular Respiration Equation',
            emoji: '💨',
            points: [
              'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
              'Breaks down glucose with oxygen',
              'Releases energy (ATP) for life',
              'Happens in ALL living organisms'
            ],
            diagram: 'respiration'
          }
        ]
      },
      {
        id: 'nitrogen-cycle',
        title: 'Nitrogen Cycle',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Complete Nitrogen Cycle',
            emoji: '♻️',
            points: [
              'Nitrogen moves between atmosphere, soil, and organisms',
              'Essential for proteins and DNA',
              'Bacteria do most of the work!',
              '78% of air is nitrogen gas (N₂)'
            ],
            diagram: 'nitrogen-cycle'
          },
          {
            subtitle: 'Nitrogen Fixation',
            emoji: '⚡',
            points: [
              'N₂ → ammonia (NH₃)',
              'Done by bacteria (Rhizobium) or lightning',
              'Makes nitrogen usable for plants'
            ]
          },
          {
            subtitle: 'Nitrification',
            emoji: '🔬',
            points: [
              'Ammonia → nitrite (NO₂⁻) by Nitrosomonas',
              'Nitrite → nitrate (NO₃⁻) by Nitrobacter',
              'Two-step bacterial process'
            ]
          },
          {
            subtitle: 'Assimilation & Ammonification',
            emoji: '🌱',
            points: [
              'Assimilation: Plants absorb nitrate from soil',
              'Ammonification: Decomposers release ammonium',
              'Returns nitrogen to soil'
            ]
          },
          {
            subtitle: 'Denitrification',
            emoji: '💨',
            points: [
              'Nitrate → N₂ gas',
              'By denitrifying bacteria',
              'Returns nitrogen to atmosphere'
            ]
          }
        ]
      },
      {
        id: 'nitrogen-advanced',
        title: 'Advanced Nitrogen Cycle & Applications',
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'ecology-interactions',
        title: 'Ecological Interactions & Population Dynamics',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'biomes-climates',
        title: 'World Biomes & Climate Zones',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'conservation-strategies',
        title: 'Conservation Biology & Management Strategies',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'food-webs-advanced',
        title: 'Complex Food Webs & Trophic Cascades',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry: Matter & Changes',
    description: '10 comprehensive sections on atoms, periodic table, and chemical properties',
    icon: Beaker,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'chemistry-definitions',
        title: 'Key Chemistry Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Matter & Classification',
            emoji: '🧪',
            points: [
              'MATTER: Anything that has mass and takes up space',
              'PURE SUBSTANCE: Uniform composition - element or compound',
              'ELEMENT: Pure substance made of one type of atom (gold, oxygen)',
              'COMPOUND: Two or more elements chemically bonded (H₂O, CO₂)',
              'MIXTURE: Two or more substances physically combined (not bonded)',
              'HOMOGENEOUS MIXTURE: Uniform throughout, can\'t see parts (salt water)',
              'HETEROGENEOUS MIXTURE: Can see different parts (sand and water)',
              'SOLUTION: Type of homogeneous mixture (dissolved)',
              'SUSPENSION: Heterogeneous mixture where particles settle',
              'ALLOY: Mixture of metals (brass, steel)'
            ]
          },
          {
            subtitle: 'Properties of Matter',
            emoji: '⚖️',
            points: [
              'PHYSICAL PROPERTY: Observable without changing substance (color, density)',
              'CHEMICAL PROPERTY: How substance reacts with others (flammability)',
              'QUALITATIVE: Descriptive property (color, texture, odor)',
              'QUANTITATIVE: Measurable property with numbers (mass, volume, temperature)',
              'DENSITY: Mass per unit volume (D = m/V), measured in g/cm³ or g/mL',
              'MASS: Amount of matter in object, measured in grams (g)',
              'VOLUME: Space object occupies, measured in cm³ or mL',
              'MELTING POINT: Temperature solid becomes liquid',
              'BOILING POINT: Temperature liquid becomes gas',
              'SOLUBILITY: How much solute dissolves in solvent'
            ]
          },
          {
            subtitle: 'Changes in Matter',
            emoji: '🔬',
            points: [
              'PHYSICAL CHANGE: Same substance, different form (melting ice)',
              'CHEMICAL CHANGE: New substance forms (burning wood)',
              'INDICATORS OF CHEMICAL CHANGE: Color change, gas production, temperature change, light, precipitate',
              'PRECIPITATE: Solid that forms in liquid during chemical reaction',
              'COMBUSTION: Burning - reaction with oxygen producing heat and light',
              'OXIDATION: Reaction with oxygen (rusting)',
              'REACTANTS: Substances you start with in chemical reaction',
              'PRODUCTS: New substances formed in chemical reaction'
            ]
          },
          {
            subtitle: 'Atomic Structure',
            emoji: '⚛️',
            points: [
              'ATOM: Smallest unit of element that keeps its properties',
              'NUCLEUS: Dense center of atom containing protons and neutrons',
              'PROTON: Positively charged particle in nucleus (+1 charge)',
              'NEUTRON: Neutral particle in nucleus (0 charge)',
              'ELECTRON: Negatively charged particle orbiting nucleus (-1 charge)',
              'ATOMIC NUMBER: Number of protons (identifies element)',
              'MASS NUMBER: Total protons + neutrons',
              'ISOTOPE: Same element with different number of neutrons',
              'ELECTRON SHELL: Energy level where electrons orbit',
              'VALENCE ELECTRONS: Electrons in outermost shell (determine bonding)'
            ]
          },
          {
            subtitle: 'Ions & Bonding',
            emoji: '⚡',
            points: [
              'ION: Atom with unequal protons and electrons (charged)',
              'CATION: Positive ion (lost electrons), metals form cations',
              'ANION: Negative ion (gained electrons), non-metals form anions',
              'IONIC BOND: Transfer of electrons between atoms',
              'OCTET RULE: Atoms want 8 valence electrons for stability',
              'CHARGE: Number of protons minus number of electrons'
            ]
          },
          {
            subtitle: 'Periodic Table Terms',
            emoji: '📊',
            points: [
              'PERIODIC TABLE: Chart organizing elements by properties',
              'PERIOD: Horizontal row on periodic table',
              'GROUP/FAMILY: Vertical column with similar properties',
              'ALKALI METALS (Group 1): Soft, highly reactive, 1 valence electron',
              'ALKALINE EARTH METALS (Group 2): Form +2 ions, 2 valence electrons',
              'HALOGENS (Group 17): Reactive non-metals, 7 valence electrons',
              'NOBLE GASES (Group 18): Unreactive, 8 valence electrons (stable)',
              'TRANSITION METALS: Groups 3-12, can form multiple ion charges',
              'METAL: Shiny, conductive, malleable, loses electrons',
              'NON-METAL: Dull, poor conductor, brittle, gains electrons',
              'METALLOID: Properties between metals and non-metals (silicon)'
            ]
          },
          {
            subtitle: 'Atomic Models',
            emoji: '🔭',
            points: [
              'DALTON MODEL (1803): Solid sphere, indivisible atoms',
              'THOMSON MODEL (1897): Plum pudding - positive with embedded electrons',
              'RUTHERFORD MODEL (1911): Nuclear model - dense nucleus with orbiting electrons',
              'BOHR MODEL (1913): Planetary model - electrons in specific energy levels/shells'
            ]
          },
          {
            subtitle: 'Separation Methods',
            emoji: '🔧',
            points: [
              'FILTRATION: Separating solid from liquid using filter',
              'DISTILLATION: Separating liquids by different boiling points',
              'EVAPORATION: Liquid evaporates leaving dissolved solid behind',
              'CHROMATOGRAPHY: Separating dissolved substances by movement rate',
              'MAGNETISM: Separating magnetic from non-magnetic materials'
            ]
          },
          {
            subtitle: 'Important Formulas',
            emoji: '📐',
            points: [
              'DENSITY: D = m/V (Density = mass ÷ volume)',
              'MASS: m = D × V (Mass = density × volume)',
              'VOLUME: V = m/D (Volume = mass ÷ density)',
              'NEUTRONS: N = Mass number - Atomic number',
              'CHARGE: Charge = Protons - Electrons',
              'Floating: Object floats if density < liquid density',
              'Sinking: Object sinks if density > liquid density'
            ]
          },
          {
            subtitle: 'Units & Conversions',
            emoji: '🔢',
            points: [
              'Mass: grams (g), kilograms (kg), 1 kg = 1000 g',
              'Volume: milliliters (mL), liters (L), cubic centimeters (cm³)',
              '1 mL = 1 cm³',
              'Density: g/cm³ or g/mL',
              'Temperature: Celsius (°C), Kelvin (K), °C + 273 = K',
              'AMU (atomic mass unit): Unit for atomic mass, 1 amu ≈ mass of proton/neutron'
            ]
          }
        ]
      },
      {
        id: 'chemistry-definitions-2',
        title: 'More Essential Chemistry Terms',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'States of Matter',
            emoji: '💧',
            points: [
              'SOLID: Definite shape and volume, particles tightly packed',
              'LIQUID: Definite volume but no shape, particles close but can move',
              'GAS: No definite shape or volume, particles far apart and moving fast',
              'PLASMA: Super-heated gas with charged particles (found in stars)',
              'MELTING: Solid to liquid (ice → water)',
              'FREEZING: Liquid to solid (water → ice)',
              'EVAPORATION: Liquid to gas (water → steam)',
              'CONDENSATION: Gas to liquid (steam → water)',
              'SUBLIMATION: Solid directly to gas (dry ice)',
              'DEPOSITION: Gas directly to solid (frost forming)'
            ]
          },
          {
            subtitle: 'Lab Safety',
            emoji: '🥽',
            points: [
              'SAFETY GOGGLES: Protect eyes from chemicals and broken glass',
              'LAB COAT/APRON: Protect clothing and skin',
              'FIRE EXTINGUISHER: Put out fires (know location)',
              'EYEWASH STATION: Rinse eyes if chemicals splash',
              'SAFETY SHOWER: Rinse body if large chemical spill',
              'FUME HOOD: Ventilated area for handling toxic fumes',
              'MSDS (Material Safety Data Sheet): Information about chemical hazards',
              'WHMIS: Workplace Hazardous Materials Information System (Canadian)',
              'Never eat/drink in lab, tie back long hair, report all accidents'
            ]
          },
          {
            subtitle: 'WHMIS Symbols',
            emoji: '⚠️',
            points: [
              'FLAME: Flammable materials that catch fire easily',
              'FLAME OVER CIRCLE: Oxidizers that make fires burn stronger',
              'GAS CYLINDER: Compressed gases under pressure',
              'CORROSION: Acids/bases that burn skin and eyes',
              'SKULL & CROSSBONES: Poisonous/toxic materials',
              'EXCLAMATION MARK: Irritants causing skin/eye irritation',
              'HEALTH HAZARD: Long-term health effects (cancer, breathing problems)',
              'EXPLODING BOMB: Explosives',
              'BIOHAZARD: Infectious materials',
              'ENVIRONMENT: Toxic to aquatic life and ecosystems'
            ]
          },
          {
            subtitle: 'Chemical Reactions',
            emoji: '⚗️',
            points: [
              'CHEMICAL REACTION: Process where substances change into new substances',
              'SYNTHESIS: Two or more substances combine (A + B → AB)',
              'DECOMPOSITION: Compound breaks down (AB → A + B)',
              'SINGLE REPLACEMENT: One element replaces another (A + BC → AC + B)',
              'DOUBLE REPLACEMENT: Two compounds swap parts (AB + CD → AD + CB)',
              'EXOTHERMIC: Releases energy/heat (combustion, hand warmers)',
              'ENDOTHERMIC: Absorbs energy/heat (photosynthesis, cold packs)',
              'CATALYST: Speeds up reaction without being used up',
              'ACTIVATION ENERGY: Minimum energy needed to start reaction'
            ]
          },
          {
            subtitle: 'Solutions & Concentration',
            emoji: '🧬',
            points: [
              'SOLVENT: Substance doing the dissolving (usually water)',
              'SOLUTE: Substance being dissolved (sugar, salt)',
              'CONCENTRATED: Solution with lots of solute',
              'DILUTE: Solution with little solute',
              'SATURATED: Maximum amount of solute dissolved at given temperature',
              'UNSATURATED: Can dissolve more solute',
              'SUPERSATURATED: More solute than normally possible (unstable)',
              'SOLUBLE: Able to dissolve',
              'INSOLUBLE: Unable to dissolve',
              'AQUEOUS: Dissolved in water (symbol: aq)'
            ]
          },
          {
            subtitle: 'Acids & Bases',
            emoji: '🧪',
            points: [
              'ACID: Substance with pH less than 7, tastes sour, donates H⁺ ions',
              'BASE: Substance with pH greater than 7, tastes bitter, accepts H⁺ ions',
              'NEUTRAL: pH of exactly 7 (pure water)',
              'pH SCALE: Measures acidity/basicity from 0 (very acidic) to 14 (very basic)',
              'INDICATOR: Substance that changes color in acids vs bases (litmus paper)',
              'NEUTRALIZATION: Acid + Base → Salt + Water',
              'CORROSIVE: Strong acid or base that burns/damages materials',
              'Examples of acids: HCl (hydrochloric), H₂SO₄ (sulfuric), vinegar',
              'Examples of bases: NaOH (sodium hydroxide), ammonia, soap'
            ]
          },
          {
            subtitle: 'Chemical Nomenclature',
            emoji: '📝',
            points: [
              'CHEMICAL FORMULA: Symbols showing what\'s in compound (H₂O)',
              'SUBSCRIPT: Small number showing how many atoms (H₂O has 2 hydrogen)',
              'COEFFICIENT: Number before formula showing how many molecules (2H₂O)',
              'DIATOMIC MOLECULES: Elements existing as pairs (H₂, O₂, N₂, F₂, Cl₂, Br₂, I₂)',
              'BINARY COMPOUND: Compound made of two elements (NaCl)',
              'POLYATOMIC ION: Group of atoms with charge (SO₄²⁻, NO₃⁻)',
              'MOLECULAR FORMULA: Shows actual number of atoms in molecule',
              'EMPIRICAL FORMULA: Shows simplest whole number ratio'
            ]
          },
          {
            subtitle: 'Energy in Chemistry',
            emoji: '🔥',
            points: [
              'CHEMICAL ENERGY: Energy stored in chemical bonds',
              'THERMAL ENERGY: Heat energy from particle motion',
              'KINETIC ENERGY: Energy of motion',
              'POTENTIAL ENERGY: Stored energy',
              'LAW OF CONSERVATION OF ENERGY: Energy cannot be created or destroyed',
              'LAW OF CONSERVATION OF MASS: Matter cannot be created or destroyed in chemical reactions',
              'TEMPERATURE: Measure of average kinetic energy of particles',
              'HEAT: Transfer of thermal energy from hot to cold'
            ]
          },
          {
            subtitle: 'Advanced Atomic Concepts',
            emoji: '🌟',
            points: [
              'ORBITAL: Region where electron is likely to be found',
              'QUANTUM: Smallest discrete amount of energy',
              'GROUND STATE: Lowest energy state of atom',
              'EXCITED STATE: Higher energy state when electron absorbs energy',
              'EMISSION SPECTRUM: Light given off when excited electrons return to ground state',
              'ATOMIC MASS: Weighted average mass of all isotopes',
              'RELATIVE ATOMIC MASS: Atomic mass compared to carbon-12',
              'ELECTRON CONFIGURATION: Arrangement of electrons in shells/orbitals'
            ]
          },
          {
            subtitle: 'Scientific Method & Measurement',
            emoji: '🔬',
            points: [
              'HYPOTHESIS: Testable prediction based on observations',
              'EXPERIMENT: Test to check if hypothesis is correct',
              'VARIABLE: Factor that can change in experiment',
              'CONTROL: Part of experiment that stays the same for comparison',
              'INDEPENDENT VARIABLE: What you change on purpose',
              'DEPENDENT VARIABLE: What you measure (depends on independent variable)',
              'PRECISION: How close measurements are to each other (consistency)',
              'ACCURACY: How close measurement is to true value (correctness)',
              'SIGNIFICANT FIGURES: Digits in measurement that are certain plus one estimated digit'
            ]
          }
        ]
      },
      {
        id: 'lab-equipment',
        title: 'Lab Equipment & Tools',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Measuring & Transferring',
            emoji: '📏',
            points: [
              'Graduated Cylinder: Measures liquid volume accurately',
              'Beaker: Holds and mixes liquids (less accurate measurements)',
              'Erlenmeyer Flask: For mixing, heating, and storing liquids',
              'Funnel: Transfers liquids or powders into containers'
            ]
          },
          {
            subtitle: 'Heating Equipment',
            emoji: '🔥',
            points: [
              'Portable Bunsen Burner: Heats substances with controlled flame',
              'Lighter: Ignites Bunsen burner'
            ]
          },
          {
            subtitle: 'Handling & Mixing',
            emoji: '🥄',
            points: [
              'Scoopula/Spatula: Scoops and transfers solid chemicals',
              'Stirring Rod: Stirs and mixes liquids without contamination',
              'Test Tubes: Holds small amounts of liquid for experiments'
            ]
          },
          {
            subtitle: 'Measuring & Observation',
            emoji: '⚖️',
            points: [
              'Electronic Balance/Scale: Measures mass of objects accurately',
              'Overflow Can: Measures volume by water displacement',
              'Dimple Tile: Holds small samples for mixing or observation'
            ]
          }
        ]
      },
      {
        id: 'lab-safety',
        title: 'Lab Safety & WHMIS Symbols',
        image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'General Safety Rules',
            emoji: '⚠️',
            points: [
              'Wear safety goggles when required',
              'Tie back long hair',
              'NO eating or drinking in lab',
              'Report all accidents immediately',
              'Know where safety equipment is located'
            ]
          },
          {
            subtitle: 'Key WHMIS Symbols to Know',
            emoji: '🔶',
            points: [
              'Explosive: Risk of exploding',
              'Flammable: Catches fire easily',
              'Corrosive: Burns skin and eyes',
              'Health Hazard: May cause serious health issues',
              'Environmental Hazard: Toxic to aquatic life'
            ]
          }
        ]
      },
      {
        id: 'matter',
        title: 'Classification of Matter',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Pure Substances',
            emoji: '✨',
            points: [
              'Elements: One type of atom (e.g., Gold, Oxygen)',
              'Compounds: Two+ elements bonded (e.g., H₂O, NaCl)',
              'Uniform composition throughout'
            ]
          },
          {
            subtitle: 'Homogeneous Mixtures',
            emoji: '🥤',
            points: [
              'Uniform throughout - cannot see parts',
              'Examples: Salt water, air, brass',
              'Also called solutions'
            ]
          },
          {
            subtitle: 'Heterogeneous Mixtures',
            emoji: '🥗',
            points: [
              'Can see different parts',
              'Suspensions: Particles settle (muddy water)',
              'Mechanical: Parts clearly visible (trail mix)'
            ]
          }
        ]
      },
      {
        id: 'separation',
        title: 'Separation Methods',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Common Methods',
            emoji: '🔬',
            points: [
              'Filtration: Solid from liquid (sand from water)',
              'Distillation: Different boiling points (water from salt)',
              'Evaporation: Dissolved solid from liquid (get salt)',
              'Magnetism: Magnetic from non-magnetic (iron from sand)',
              'Chromatography: Dissolved substances (separate dyes)'
            ]
          }
        ]
      },
      {
        id: 'changes',
        title: 'Physical vs Chemical Changes',
        image: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Physical Changes',
            emoji: '❄️',
            points: [
              'Same substance, different appearance',
              'Usually reversible',
              'Examples: Ice melting, cutting paper, dissolving sugar'
            ]
          },
          {
            subtitle: 'Chemical Changes - Look For',
            emoji: '🔥',
            points: [
              'Color change (iron rusting)',
              'Gas production/bubbles (vinegar + baking soda)',
              'Temperature change (hand warmers)',
              'Light production (fireworks)',
              'Precipitate forms (solid in liquid)',
              'Difficult/impossible to reverse'
            ]
          }
        ]
      },
      {
        id: 'density',
        title: 'Density Calculations',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The Formula',
            emoji: '📐',
            points: [
              'D = m/V',
              'D = Density (g/cm³ or g/mL)',
              'm = Mass (grams)',
              'V = Volume (cm³ or mL)'
            ]
          },
          {
            subtitle: 'Triangle Trick',
            emoji: '🔺',
            points: [
              'Top: m (mass)',
              'Bottom left: D (density)',
              'Bottom right: V (volume)',
              'Cover what you are solving for!'
            ]
          },
          {
            subtitle: 'Floating Rule',
            emoji: '🛟',
            points: [
              'Object floats if density < liquid density',
              'Object sinks if density > liquid density',
              'Example: Ice (0.92) floats on water (1.0)'
            ],
            diagram: 'density'
          }
        ]
      },
      {
        id: 'properties',
        title: 'Physical & Chemical Properties',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Physical Properties',
            emoji: '👁️',
            points: [
              'Qualitative: Color, texture, odor, state, luster, malleability, ductility',
              'Quantitative: Mass, volume, density, melting/boiling point, solubility',
              'Observable WITHOUT changing the substance'
            ]
          },
          {
            subtitle: 'Chemical Properties',
            emoji: '⚗️',
            points: [
              'Combustibility: Ability to burn',
              'Reactivity with acids (metals produce hydrogen gas)',
              'Stability: Reactivity with oxygen (e.g., iron rusting)',
              'How substance reacts with OTHER substances'
            ]
          }
        ]
      },
      {
        id: 'periodic-table',
        title: 'Periodic Table Organization',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Element Families',
            emoji: '👨‍👩‍👧‍👦',
            points: [
              'Alkali Metals (Group 1): Soft, highly reactive, form basic solutions',
              'Alkaline-Earth Metals (Group 2): Form +2 ions, basic oxides',
              'Halogens (Group 17): Reactive non-metals, diatomic, form salts',
              'Noble Gases (Group 18): Full valence shells, almost unreactive'
            ],
            diagram: 'periodic-table'
          },
          {
            subtitle: 'Metals vs Non-metals',
            emoji: '🔧',
            points: [
              'Metals: Shiny, conductive, malleable, lose electrons (Na, Fe, Cu)',
              'Non-metals: Dull, poor conductors, brittle, gain electrons (O, S, Cl)',
              'Metalloids: Between metals/non-metals, semiconductors (Si, B, As)'
            ]
          }
        ]
      },
      {
        id: 'periodic-trends',
        title: 'Periodic Trends & Advanced Properties',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h-400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'atomic-models',
        title: 'Atomic Models Through History',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'John Dalton (1766-1844) - The Atomic Model',
            emoji: '⚪',
            points: [
              'Matter is made of small indivisible atoms',
              'Atoms can\'t be subdivided, created or destroyed',
              'Atoms of the same element have the same properties',
              'Atoms of different elements have different properties',
              'Atoms of different elements can form compounds'
            ],
            diagram: 'atomic-models'
          },
          {
            subtitle: 'J.J. Thomson (1856-1940) - Plum Pudding Model',
            emoji: '🍮',
            points: [
              'An atom is electrically neutral (no net charge)',
              'Positive and negative charges are equal in an atom',
              'Atom is a sphere of positive charge with negative electrons embedded in it',
              'Discovered the electron'
            ]
          },
          {
            subtitle: 'Ernest Rutherford (1871-1937) - Nuclear Model',
            emoji: '🎯',
            points: [
              'Atoms are mostly empty space',
              'Most of the mass is concentrated in the center (nucleus)',
              'The nucleus is tiny, dense, and positively charged',
              'Electrons are located outside the nucleus'
            ]
          },
          {
            subtitle: 'Niels Bohr (1885-1962) - Planetary Model',
            emoji: '🪐',
            points: [
              'Electrons orbit the nucleus in specific energy levels (shells)',
              'The energy of an orbit is related to its size',
              'The lowest energy is found in the smallest orbit',
              'Electrons move between shells when gaining or losing energy',
              'Gaining energy → electrons move to farther orbits',
              'Losing energy → electrons move to closer orbits'
            ]
          }
        ]
      },
      {
        id: 'electron-configuration',
        title: 'Electron Configuration & Quantum Numbers',
        image: 'https://images.unsplash.com/photo-1635070041409-e5e34c1a6ff9?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'subatomic',
        title: 'Subatomic Particles & Bohr Diagrams',
        image: 'https://images.unsplash.com/photo-1635070041409-e5e34c1a6ff9?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'The Three Particles',
            emoji: '⚛️',
            points: [
              'Protons: Positive (+1), mass ≈ 1 amu, in nucleus',
              'Neutrons: Neutral (0), mass ≈ 1 amu, in nucleus',
              'Electrons: Negative (-1), negligible mass, in shells'
            ]
          },
          {
            subtitle: 'Using the Periodic Table',
            emoji: '📊',
            points: [
              'Atomic number = # protons = # electrons (neutral atom)',
              'Mass number ≈ atomic mass (rounded)',
              'Neutrons = Mass number - Atomic number'
            ]
          },
          {
            subtitle: 'Bohr-Rutherford Diagrams',
            emoji: '🎨',
            points: [
              'Nucleus in center (protons + neutrons)',
              '1st shell: max 2 electrons',
              '2nd shell: max 8 electrons',
              '3rd shell: max 8 electrons (for first 20 elements)'
            ],
            diagram: 'bohr'
          },
          {
            subtitle: 'Isotopes',
            emoji: '🔄',
            points: [
              'Same element, different neutron count',
              'Same protons, different mass numbers',
              'Example: Carbon-12 vs Carbon-14'
            ]
          }
        ]
      },
      {
        id: 'chemical-equations',
        title: 'Balancing Chemical Equations & Stoichiometry',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'valence-ions',
        title: 'Valence Electrons & Ions',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Valence Electrons',
            emoji: '🌟',
            points: [
              'Electrons in outermost shell',
              'Determine chemical behavior',
              'Shown in Lewis dot diagrams',
              'Group number = number of valence electrons'
            ],
            diagram: 'lewis'
          },
          {
            subtitle: 'Ions - Charged Atoms',
            emoji: '⚡',
            points: [
              'Cations: Positive (lost electrons), protons > electrons',
              'Anions: Negative (gained electrons), electrons > protons',
              'Protons NEVER change (determines element)',
              'Electrons = protons - charge',
              'Atoms form ions to get a full outer shell (stable)'
            ],
            diagram: 'ions'
          },
          {
            subtitle: 'Why Atoms Form Ions',
            emoji: '🎯',
            points: [
              'Atoms want 8 valence electrons (octet rule)',
              'Metals (Groups 1-3): Easier to LOSE 1-3 electrons → form cations (+)',
              'Non-metals (Groups 15-17): Easier to GAIN 1-3 electrons → form anions (-)',
              'Noble gases already have 8 (or 2 for He) → don\'t form ions',
              'Example: Na loses 1e⁻ → Na⁺ | Cl gains 1e⁻ → Cl⁻'
            ]
          }
        ]
      },
      {
        id: 'advanced-bonding',
        title: 'Advanced Chemical Bonding & Molecules',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'acids-bases-advanced',
        title: 'Advanced Acids, Bases & pH Calculations',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'mole-concept',
        title: 'The Mole Concept & Avogadro\'s Number',
        image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  },
  physics: {
    id: 'physics',
    name: 'Physics: Electricity',
    description: '6 comprehensive sections exploring static electricity, circuits, and electrical power',
    icon: Zap,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'definitions',
        title: 'Key Electricity Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Fundamental Concepts',
            emoji: '📚',
            points: [
              'ELECTRICITY: Flow of electric charge through a conductor',
              'CHARGE: Property of matter that causes electrical force (positive or negative)',
              'ELECTRON: Negatively charged particle that moves in electric current',
              'PROTON: Positively charged particle in nucleus (doesn\'t move)',
              'NEUTRAL: Object with equal positive and negative charges (no net charge)',
              'ION: Atom with unequal protons and electrons (charged atom)'
            ]
          },
          {
            subtitle: 'Static Electricity Terms',
            emoji: '⚡',
            points: [
              'STATIC ELECTRICITY: Build-up of electric charge on surface of objects',
              'FRICTION: Charging by rubbing two objects together (transfers electrons)',
              'CONDUCTION: Charging by direct contact with charged object',
              'INDUCTION: Charging without direct contact (nearby charged object)',
              'ELECTROSCOPE: Device used to detect electric charge',
              'GROUNDING: Connecting object to Earth to remove excess charge'
            ]
          },
          {
            subtitle: 'Current Electricity Terms',
            emoji: '🔋',
            points: [
              'CURRENT (I): Rate of flow of electric charge, measured in Amperes (A)',
              'VOLTAGE (V): Electric potential difference, electrical "pressure", measured in Volts (V)',
              'RESISTANCE (R): Opposition to flow of current, measured in Ohms (Ω)',
              'CONDUCTOR: Material that allows electricity to flow easily (copper, metals)',
              'INSULATOR: Material that resists flow of electricity (rubber, plastic, wood)',
              'AMMETER: Device that measures electric current (connected in series)',
              'VOLTMETER: Device that measures voltage (connected in parallel)'
            ]
          },
          {
            subtitle: 'Circuit Terms',
            emoji: '🔌',
            points: [
              'CIRCUIT: Complete path that allows electricity to flow',
              'CLOSED CIRCUIT: Complete loop allowing current to flow',
              'OPEN CIRCUIT: Broken path preventing current flow',
              'SHORT CIRCUIT: Unintended path with very low resistance (dangerous)',
              'LOAD: Device in circuit that uses electrical energy (bulb, motor, resistor)',
              'POWER SOURCE: Provides energy to circuit (battery, generator)',
              'SWITCH: Device to open or close a circuit'
            ]
          },
          {
            subtitle: 'Series Circuit Definitions',
            emoji: '➡️',
            points: [
              'SERIES CIRCUIT: Circuit with single path for current',
              'In series: Components connected end-to-end',
              'Current is SAME at all points in series circuit',
              'Voltage DIVIDES among components (V_total = V₁ + V₂ + V₃)',
              'Total resistance INCREASES (R_total = R₁ + R₂ + R₃)',
              'If one component fails, entire circuit stops working'
            ]
          },
          {
            subtitle: 'Parallel Circuit Definitions',
            emoji: '🔀',
            points: [
              'PARALLEL CIRCUIT: Circuit with multiple paths for current',
              'In parallel: Components connected across same two points',
              'Voltage is SAME across all branches',
              'Current DIVIDES among paths (I_total = I₁ + I₂ + I₃)',
              'Total resistance DECREASES (more paths = easier flow)',
              'If one branch fails, other branches continue working'
            ]
          },
          {
            subtitle: 'Power & Energy Terms',
            emoji: '💡',
            points: [
              'POWER (P): Rate of using electrical energy, measured in Watts (W)',
              'WATT: Unit of power (1 W = 1 Joule per second)',
              'KILOWATT: 1000 Watts (kW)',
              'ENERGY: Total amount of electrical work done, measured in Joules (J)',
              'KILOWATT-HOUR (kWh): Amount of energy used by 1 kW device in 1 hour',
              'ELECTRICAL EFFICIENCY: Ratio of useful energy output to total energy input'
            ]
          },
          {
            subtitle: 'Safety Terms',
            emoji: '⚠️',
            points: [
              'FUSE: Safety device with thin wire that melts when overloaded',
              'CIRCUIT BREAKER: Safety switch that trips/opens when too much current flows',
              'GFCI (Ground Fault Circuit Interrupter): Device that detects shorts and cuts power',
              'GROUND: Connection to Earth providing safe path for excess electricity',
              'SHOCK: Effect of electric current passing through body',
              'OVERLOAD: Too much current drawn from circuit (can cause fire)'
            ]
          },
          {
            subtitle: 'Important Formulas',
            emoji: '📐',
            points: [
              'OHM\'S LAW: V = I × R (Voltage = Current × Resistance)',
              'POWER: P = V × I (Power = Voltage × Current)',
              'POWER: P = I²R (alternate formula using resistance)',
              'POWER: P = V²/R (alternate formula)',
              'ENERGY: E = P × t (Energy = Power × time)',
              'COST: Cost = Energy (kWh) × Rate ($/kWh)'
            ]
          },
          {
            subtitle: 'Unit Conversions',
            emoji: '🔢',
            points: [
              '1 Ampere (A) = 1 Coulomb per second',
              '1 Kilowatt (kW) = 1000 Watts (W)',
              '1 Megawatt (MW) = 1,000,000 Watts',
              '1 Milliampere (mA) = 0.001 Amperes',
              '1 Kilohm (kΩ) = 1000 Ohms',
              '1 Megohm (MΩ) = 1,000,000 Ohms',
              '1 Kilowatt-hour = 3,600,000 Joules'
            ]
          }
        ]
      },
      {
        id: 'static',
        title: 'Static Electricity',
        image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'What is Static Electricity?',
            emoji: '⚡',
            points: [
              'Build-up of electric charge on the surface of objects',
              'Caused by imbalance of electrons (negative) and protons (positive)',
              'Called "static" because charges don\'t move - they stay in one place',
              'Creates a shock when you touch something metal'
            ]
          },
          {
            subtitle: 'The Law of Electric Charges',
            emoji: '🧲',
            points: [
              'Like charges REPEL (push away): + and + OR - and -',
              'Opposite charges ATTRACT (pull together): + and -',
              'Neutral objects have equal positive and negative charges',
              'Charged objects have more of one type of charge'
            ],
            diagram: 'static-electricity'
          },
          {
            subtitle: 'Three Ways to Charge Objects',
            emoji: '🔄',
            points: [
              'FRICTION: Rubbing objects transfers electrons (balloon on hair)',
              'CONDUCTION: Direct contact transfers charge (touching a charged rod)',
              'INDUCTION: Charged object nearby causes separation without touching',
              'Only ELECTRONS move - protons stay in the nucleus'
            ]
          },
          {
            subtitle: 'Electroscope',
            emoji: '🔬',
            points: [
              'Device that detects electric charge',
              'Metal leaves spread apart when charged (same charge repels)',
              'If leaves collapse, object is neutral or opposite charge',
              'Used in labs to test if objects are charged'
            ]
          },
          {
            subtitle: 'Real-World Examples',
            emoji: '🌟',
            points: [
              'Lightning: Massive static discharge between clouds and ground',
              'Balloon sticking to wall after rubbing on hair',
              'Shock when touching doorknob after walking on carpet',
              'Clothes clinging together from dryer (static cling)'
            ]
          }
        ]
      },
      {
        id: 'magnetism-electromagnetism',
        title: 'Magnetism & Electromagnetism Fundamentals',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'current',
        title: 'Current Electricity & Ohm\'s Law',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Current Electricity Basics',
            emoji: '🔋',
            points: [
              'Continuous flow of electrons through a conductor',
              'Unlike static, charges are MOVING constantly',
              'Requires a complete circuit (closed loop)',
              'Power source (battery) pushes electrons through wires'
            ],
            diagram: 'complete-circuit'
          },
          {
            subtitle: 'Three Key Terms',
            emoji: '📊',
            points: [
              'CURRENT (I): Flow of electrons, measured in Amperes (A)',
              'VOLTAGE (V): Electrical pressure/push, measured in Volts (V)',
              'RESISTANCE (R): Opposition to flow, measured in Ohms (Ω)',
              'Think: Voltage pushes, Current flows, Resistance slows'
            ]
          },
          {
            subtitle: 'Ohm\'s Law',
            emoji: '📐',
            points: [
              'Formula: V = I × R',
              'Voltage = Current × Resistance',
              'If you know any 2 values, you can find the 3rd',
              'Example: V = 12V, R = 4Ω → I = V/R = 12/4 = 3A'
            ],
            diagram: 'ohms-law'
          },
          {
            subtitle: 'Calculating with Ohm\'s Law',
            emoji: '🧮',
            points: [
              'To find Current: I = V / R',
              'To find Voltage: V = I × R',
              'To find Resistance: R = V / I',
              'Always include units in your answer!'
            ]
          },
          {
            subtitle: 'What Affects Resistance?',
            emoji: '🔌',
            points: [
              'LENGTH: Longer wire = MORE resistance',
              'THICKNESS: Thinner wire = MORE resistance',
              'MATERIAL: Copper (low) vs Rubber (high)',
              'TEMPERATURE: Hotter = MORE resistance (usually)'
            ]
          }
        ]
      },
      {
        id: 'electronics-components',
        title: 'Electronic Components & Applications',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'circuits',
        title: 'Electric Circuits',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Circuit Components',
            emoji: '🔧',
            points: [
              'BATTERY/CELL: Provides voltage (energy source)',
              'WIRES: Conduct electricity (usually copper)',
              'LOAD: Device that uses electricity (bulb, motor, resistor)',
              'SWITCH: Opens/closes circuit to control flow',
              'Must form a COMPLETE LOOP for current to flow'
            ],
            diagram: 'circuit-symbols'
          },
          {
            subtitle: 'Series Circuits',
            emoji: '➡️',
            points: [
              'ONE path for current to flow',
              'Components connected end-to-end in a line',
              'Current is SAME everywhere: I₁ = I₂ = I₃',
              'Voltage DIVIDES among components: V_total = V₁ + V₂ + V₃',
              'If one bulb breaks, ALL go out (like old Christmas lights)',
              'More bulbs = dimmer light (resistance adds up)'
            ],
            diagram: 'series-circuit'
          },
          {
            subtitle: 'Parallel Circuits',
            emoji: '🔀',
            points: [
              'MULTIPLE paths for current to flow',
              'Components connected across same two points',
              'Voltage is SAME across all branches: V₁ = V₂ = V₃',
              'Current DIVIDES among branches: I_total = I₁ + I₂ + I₃',
              'If one bulb breaks, others STAY ON (home wiring)',
              'More paths = MORE total current drawn'
            ],
            diagram: 'parallel-circuit'
          },
          {
            subtitle: 'Series vs Parallel Summary',
            emoji: '⚖️',
            points: [
              'Series: Same current, voltage divides, one path',
              'Parallel: Same voltage, current divides, multiple paths',
              'Series: One break stops everything',
              'Parallel: One break doesn\'t affect others',
              'Real homes use PARALLEL so outlets work independently'
            ]
          },
          {
            subtitle: 'Circuit Diagrams',
            emoji: '📋',
            points: [
              'Battery: Long line (+) and short line (-)',
              'Wire: Straight line',
              'Bulb/Resistor: Zigzag line or circle with X',
              'Switch: Break in line that can open/close',
              'Learn to read and draw simple circuit diagrams'
            ]
          }
        ]
      },
      {
        id: 'circuit-problem-solving',
        title: 'Circuit Problem Solving Strategies',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'power',
        title: 'Electrical Energy & Power',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'What is Electrical Power?',
            emoji: '💡',
            points: [
              'Rate at which electrical energy is used or produced',
              'Measured in Watts (W)',
              'Higher wattage = more energy used per second',
              '1000 Watts = 1 Kilowatt (kW)'
            ]
          },
          {
            subtitle: 'Power Formula',
            emoji: '⚡',
            points: [
              'Formula: P = V × I',
              'Power = Voltage × Current',
              'Example: 120V outlet, 0.5A current → P = 120 × 0.5 = 60W',
              'Can also use: P = I²R or P = V²/R (using Ohm\'s Law)'
            ],
            diagram: 'power-formula'
          },
          {
            subtitle: 'Energy vs Power',
            emoji: '🔋',
            points: [
              'POWER: How fast you use energy (Watts)',
              'ENERGY: Total amount used over time (Joules or kWh)',
              'Energy = Power × Time',
              'Example: 100W bulb for 10 hours = 1000 Wh = 1 kWh',
              'Electric bill charges for ENERGY (kWh), not power'
            ]
          },
          {
            subtitle: 'Cost of Electricity',
            emoji: '💰',
            points: [
              'Power companies charge per kilowatt-hour (kWh)',
              'To find cost: (Power in kW) × (Time in hours) × (Rate per kWh)',
              'Example: 1.5 kW heater, 8 hours, $0.12/kWh → 1.5 × 8 × 0.12 = $1.44',
              'Leaving devices on 24/7 wastes energy and money'
            ]
          },
          {
            subtitle: 'Appliance Wattage Examples',
            emoji: '🏠',
            points: [
              'LED bulb: 10W',
              'Laptop: 50W',
              'Desktop computer: 200W',
              'Microwave: 1000W (1 kW)',
              'Electric heater: 1500W (1.5 kW)',
              'Hair dryer: 1800W (1.8 kW)'
            ]
          }
        ]
      },
      {
        id: 'electrical-energy',
        title: 'Electrical Energy & Power Systems',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'safety',
        title: 'Electrical Safety',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Why Electricity is Dangerous',
            emoji: '⚠️',
            points: [
              'Electric current can disrupt your heart rhythm',
              'As little as 0.1A (100mA) through heart can be fatal',
              'High voltage can cause severe burns',
              'Electricity always takes easiest path to ground - could be through YOU'
            ]
          },
          {
            subtitle: 'Circuit Protection Devices',
            emoji: '🛡️',
            points: [
              'FUSE: Thin wire that melts if too much current flows',
              'CIRCUIT BREAKER: Switch that trips/opens if overloaded',
              'GFCI (Ground Fault): Detects shorts, shuts off in 0.025 seconds',
              'All prevent fires and electrocution from overloaded circuits'
            ]
          },
          {
            subtitle: 'Grounding',
            emoji: '⚡',
            points: [
              'Third prong on plug connects to ground (Earth)',
              'Provides safe path for excess electricity',
              'Prevents shocks if device has internal short',
              'Metal appliances (fridges, washers) MUST be grounded'
            ]
          },
          {
            subtitle: 'Safety Rules',
            emoji: '🚫',
            points: [
              'NEVER use electrical devices near water',
              'NEVER touch outlets or switches with wet hands',
              'NEVER overload outlets with too many devices',
              'NEVER touch downed power lines - call 911',
              'Replace damaged cords immediately',
              'Pull plug by the plug, not the cord'
            ]
          },
          {
            subtitle: 'What to Do in Emergencies',
            emoji: '🆘',
            points: [
              'If someone is being shocked: DON\'T TOUCH THEM',
              'Turn off power source or use non-conductive object (wood)',
              'Call 911 immediately',
              'If you see sparks or smell burning: unplug and stop using',
              'Electrical fire: NEVER use water - use fire extinguisher'
            ]
          }
        ]
      },
      {
        id: 'advanced-circuits',
        title: 'Advanced Circuit Analysis & Design',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'renewable-energy',
        title: 'Renewable Energy & Electrical Generation',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  },
  space: {
    id: 'space',
    name: 'Space: Exploration',
    description: '4 engaging sections on the solar system, space technology, and the universe',
    icon: Globe,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=600&fit=crop',
    sections: [
      {
        id: 'space-definitions',
        title: 'Key Space Science Definitions',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Solar System Basics',
            emoji: '☀️',
            points: [
              'SOLAR SYSTEM: Sun and all objects that orbit it',
              'SUN: Star at center of our solar system, provides light and heat',
              'PLANET: Large celestial body orbiting a star',
              'DWARF PLANET: Smaller celestial body that hasn\'t cleared its orbit (Pluto)',
              'MOON: Natural satellite orbiting a planet',
              'ASTEROID: Rocky object smaller than planet, mostly in asteroid belt',
              'COMET: Icy object with tail when near Sun',
              'METEOROID: Small rocky/metallic object in space',
              'METEOR: Meteoroid burning up in Earth\'s atmosphere (shooting star)',
              'METEORITE: Meteoroid that reaches Earth\'s surface'
            ]
          },
          {
            subtitle: 'Planetary Classifications',
            emoji: '🪐',
            points: [
              'INNER/TERRESTRIAL PLANETS: Mercury, Venus, Earth, Mars - rocky surfaces',
              'OUTER/GAS GIANTS: Jupiter, Saturn - made mostly of gas',
              'ICE GIANTS: Uranus, Neptune - made of ice and gas',
              'ORBIT: Path object takes around another object',
              'ROTATION: Spinning on axis (Earth rotates in 24 hours = 1 day)',
              'REVOLUTION: Orbiting around Sun (Earth revolves in 365 days = 1 year)',
              'AXIS: Imaginary line through planet\'s center (Earth tilts 23.5°)'
            ]
          },
          {
            subtitle: 'Stars & Galaxies',
            emoji: '⭐',
            points: [
              'STAR: Massive ball of gas producing light and heat through fusion',
              'GALAXY: Massive system of billions of stars, gas, and dust',
              'MILKY WAY: Our galaxy containing 200-400 billion stars',
              'CONSTELLATION: Pattern of stars as seen from Earth',
              'LIGHT-YEAR: Distance light travels in one year (9.46 trillion km)',
              'NEBULA: Cloud of gas and dust where stars are born',
              'SUPERNOVA: Massive explosion of dying star',
              'BLACK HOLE: Region with gravity so strong light can\'t escape'
            ]
          },
          {
            subtitle: 'Space Exploration',
            emoji: '🚀',
            points: [
              'SATELLITE: Object orbiting planet (natural like Moon or artificial)',
              'SPACE STATION: Large spacecraft where astronauts live and work (ISS)',
              'ROCKET: Vehicle that launches spacecraft into space',
              'SPACECRAFT: Vehicle designed for travel in space',
              'ROVER: Vehicle designed to explore surface of planets/moons',
              'TELESCOPE: Instrument to observe distant objects (Hubble)',
              'ASTRONAUT: Person trained for space travel',
              'GRAVITY: Force attracting objects toward each other'
            ]
          },
          {
            subtitle: 'Earth & Moon',
            emoji: '🌍',
            points: [
              'ATMOSPHERE: Layer of gases surrounding Earth',
              'PHASES OF MOON: Different shapes we see as Moon orbits Earth',
              'NEW MOON: Moon between Earth and Sun (can\'t see it)',
              'FULL MOON: Earth between Sun and Moon (fully lit)',
              'ECLIPSE: When one celestial body blocks light from another',
              'SOLAR ECLIPSE: Moon blocks Sun\'s light (Moon between Earth and Sun)',
              'LUNAR ECLIPSE: Earth blocks Sun\'s light to Moon (Earth\'s shadow on Moon)',
              'TIDES: Rise and fall of ocean caused by Moon\'s gravity'
            ]
          },
          {
            subtitle: 'The Universe',
            emoji: '🌌',
            points: [
              'UNIVERSE: Everything that exists - all matter, energy, space, and time',
              'BIG BANG THEORY: Theory that universe began from single point 13.8 billion years ago',
              'EXPANSION: Universe is still growing/expanding',
              'COSMIC BACKGROUND RADIATION: Leftover energy from Big Bang',
              'DARK MATTER: Invisible matter detected by gravitational effects',
              'DARK ENERGY: Mysterious force causing universe to expand faster'
            ]
          },
          {
            subtitle: 'Space Technology',
            emoji: '🛰️',
            points: [
              'SPACE PROBE: Unmanned spacecraft exploring space',
              'LANDER: Spacecraft that lands on celestial body',
              'ORBITER: Spacecraft that orbits a planet/moon',
              'GPS (Global Positioning System): Satellites for location on Earth',
              'COMMUNICATION SATELLITE: Relays signals for phones, TV, internet',
              'SPACE SHUTTLE: Reusable spacecraft (retired 2011)',
              'LAUNCH PAD: Platform where rockets take off'
            ]
          },
          {
            subtitle: 'Important Missions',
            emoji: '🏆',
            points: [
              'SPUTNIK 1 (1957): First artificial satellite (USSR)',
              'APOLLO 11 (1969): First humans on Moon (USA)',
              'VOYAGER 1 & 2 (1977): Exploring outer solar system and beyond',
              'HUBBLE SPACE TELESCOPE (1990): Orbiting telescope with deep space images',
              'MARS ROVERS: Spirit, Opportunity, Curiosity, Perseverance',
              'ISS (1998-present): International Space Station orbiting Earth'
            ]
          },
          {
            subtitle: 'Distances & Measurements',
            emoji: '📏',
            points: [
              'AU (Astronomical Unit): Earth-Sun distance = 150 million km',
              'Light-year: 9.46 trillion km',
              'Parsec: 3.26 light-years',
              'Earth to Moon: 384,400 km',
              'Sun\'s diameter: 1.4 million km (109 times Earth\'s diameter)',
              'Speed of light: 300,000 km/second',
              'Age of universe: About 13.8 billion years'
            ]
          }
        ]
      },
      {
        id: 'solar-system',
        title: 'The Solar System',
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Inner Planets (Rocky)',
            emoji: '🪨',
            points: [
              'Mercury - Closest to Sun, extreme temperatures',
              'Venus - Hottest planet, thick atmosphere',
              'Earth - Our home, only known life',
              'Mars - Red planet, has polar ice caps'
            ]
          },
          {
            subtitle: 'Outer Planets (Gas Giants)',
            emoji: '🌪️',
            points: [
              'Jupiter - Largest planet, Great Red Spot',
              'Saturn - Famous rings',
              'Uranus - Tilted on its side',
              'Neptune - Coldest planet, strong winds'
            ]
          }
        ]
      },
      {
        id: 'space-tech',
        title: 'Space Technology',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Key Milestones',
            emoji: '🚀',
            points: [
              'Sputnik 1 - First artificial satellite (1957)',
              'Apollo 11 - First moon landing (1969)',
              'Hubble Telescope - Deep space observations',
              'ISS - International Space Station'
            ]
          }
        ]
      },
      {
        id: 'universe',
        title: 'The Universe',
        image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=400&fit=crop',
        notes: [
          {
            subtitle: 'Big Stuff',
            emoji: '🌌',
            points: [
              'Our galaxy: Milky Way',
              'Contains billions of stars',
              'Big Bang Theory - Universe origin',
              'Universe still expanding'
            ]
          }
        ]
      },
      {
        id: 'chemistry-expert-worksheets',
        title: 'Chemistry Expert Worksheets - Challenge Problems',
        image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'biology-expert-worksheets',
        title: 'Biology Expert Worksheets - Advanced Applications',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      },
      {
        id: 'physics-expert-worksheets',
        title: 'Physics Expert Worksheets - Circuit Mastery',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
        locked: true,
        notes: []
      }
    ]
  }
};

// Achievement definitions
const achievements = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first section',
    icon: Star,
    color: 'from-blue-400 to-blue-600',
    requirement: (stats) => stats.sectionsCompleted >= 1
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 5 sections',
    icon: BookOpen,
    color: 'from-green-400 to-green-600',
    requirement: (stats) => stats.sectionsCompleted >= 5
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Complete 10 sections',
    icon: Brain,
    color: 'from-purple-400 to-purple-600',
    requirement: (stats) => stats.sectionsCompleted >= 10
  },
  {
    id: 'master',
    name: 'Master Student',
    description: 'Complete all sections',
    icon: Trophy,
    color: 'from-yellow-400 to-yellow-600',
    requirement: (stats) => stats.totalSections > 0 && stats.sectionsCompleted >= stats.totalSections
  },
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    description: 'Get 5 quiz questions correct',
    icon: Target,
    color: 'from-pink-400 to-pink-600',
    requirement: (stats) => stats.quizCorrect >= 5
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Complete a quiz with 100% accuracy',
    icon: Sparkles,
    color: 'from-amber-400 to-amber-600',
    requirement: (stats) => stats.perfectQuizzes >= 1
  },
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Complete 3 quizzes',
    icon: Flame,
    color: 'from-orange-400 to-orange-600',
    requirement: (stats) => stats.quizzesCompleted >= 3
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'View all subjects',
    icon: Globe,
    color: 'from-teal-400 to-teal-600',
    requirement: (stats) => stats.subjectsViewed >= stats.totalSubjects
  },
  {
    id: 'worksheet-warrior',
    name: 'Worksheet Warrior',
    description: 'Reveal 20 worksheet answers',
    icon: ClipboardList,
    color: 'from-indigo-400 to-indigo-600',
    requirement: (stats) => stats.worksheetAnswersRevealed >= 20
  },
  {
    id: 'search-expert',
    name: 'Search Expert',
    description: 'Use search 10 times',
    icon: Search,
    color: 'from-cyan-400 to-cyan-600',
    requirement: (stats) => stats.searchesPerformed >= 10
  }
];

export default function ScienceStudyLibrary() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [readSections, setReadSections] = useState(new Set());
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  
  // Split screen state
  const [splitScreenMode, setSplitScreenMode] = useState(false);
  const [leftPanel, setLeftPanel] = useState(null);
  const [rightPanel, setRightPanel] = useState(null);
  
  // Separate quiz states for each panel
  const [leftQuizState, setLeftQuizState] = useState({
    currentQuestion: 0,
    selectedAnswer: null,
    showExplanation: false,
    score: { correct: 0, total: 0 }
  });
  const [rightQuizState, setRightQuizState] = useState({
    currentQuestion: 0,
    selectedAnswer: null,
    showExplanation: false,
    score: { correct: 0, total: 0 }
  });
  
  // Dropdown state for collapsible sections
  const [expandedDefinitionNotes, setExpandedDefinitionNotes] = useState(new Set());
  
  // Flashcard state
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardStats, setFlashcardStats] = useState({ known: 0, learning: 0 });
  
  // Feature highlights visibility
  const [showFeatureHighlights, setShowFeatureHighlights] = useState(true);
  
  // Achievement tracking
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [stats, setStats] = useState({
    sectionsCompleted: 0,
    totalSections: 0,
    quizCorrect: 0,
    quizzesCompleted: 0,
    perfectQuizzes: 0,
    subjectsViewed: new Set(),
    totalSubjects: Object.keys(studyLibrary).length,
    worksheetAnswersRevealed: 0,
    searchesPerformed: 0
  });

  // Study Session Manager
  const [showStudyPlanner, setShowStudyPlanner] = useState(false);
  const [studyPlan, setStudyPlan] = useState([]);
  const [currentStudySession, setCurrentStudySession] = useState(null);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Mobile optimization mode
  const [mobileMode, setMobileMode] = useState(false);

  // Premium interest modal
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // L.Y.N.E AI Assistant Widget state
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m L.Y.N.E (Logical Yield Neural Engine), your AI study companion. Ask me anything about your science topics - I can explain concepts, create practice questions, or help you understand difficult material!' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Timer effect for study sessions
  useEffect(() => {
    let interval;
    if (isTimerRunning && currentStudySession) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentStudySession]);

  // Calculate efficient study time based on content
  const calculateStudyTime = (section) => {
    // Quiz sections - quick practice and review
    if (section.quiz && section.quiz.length > 0) {
      const questionsCount = section.quiz.length;
      // 1 minute per question (efficient: read, answer, check explanation)
      return Math.max(Math.ceil(questionsCount * 1), 10); // minimum 10 minutes
    }
    
    // Flashcard sections - focused memorization
    if (section.flashcards && section.flashcards.length > 0) {
      const cardsCount = section.flashcards.length;
      // Quick review: 20 seconds per card (one focused pass)
      return Math.ceil(cardsCount * 0.33); // ~20 sec each
    }
    
    // Notes/reading sections - efficient scanning and key points
    if (section.notes && section.notes.length > 0) {
      let totalTime = 0;
      
      section.notes.forEach(note => {
        const pointsCount = note.points.length;
        
        // Definition sections - skim and highlight key terms
        if (section.id.includes('definitions')) {
          // 20 seconds per definition (quick read)
          totalTime += pointsCount * 0.33;
        }
        // Worksheet sections - attempt key problems
        else if (section.id.includes('worksheet')) {
          // 1.5 minutes per problem (quick attempt + answer check)
          totalTime += pointsCount * 1.5;
        }
        // Regular content sections - read for understanding
        else {
          // 30 seconds per point (efficient reading)
          totalTime += pointsCount * 0.5;
        }
        
        // Add minimal time for diagrams (visual learners absorb quickly)
        if (note.diagram) {
          totalTime += 2; // 2 minutes to review each diagram
        }
      });
      
      // Add small buffer for focus
      return Math.ceil(totalTime * 1.1); // 10% buffer
    }
    
    return 15; // default fallback
  };

  // Add function to add section to study plan
  const addToStudyPlan = (subject, section) => {
    const estimatedTime = calculateStudyTime(section);
    const newItem = {
      id: `${subject.id}-${section.id}-${Date.now()}`,
      subject,
      section,
      estimatedTime,
      completed: false
    };
    setStudyPlan([...studyPlan, newItem]);
  };

  // Remove from study plan
  const removeFromStudyPlan = (itemId) => {
    setStudyPlan(studyPlan.filter(item => item.id !== itemId));
  };

  // Start study session
  const startStudySession = (item) => {
    setCurrentStudySession(item);
    setStudyTimer(0);
    setIsTimerRunning(true);
  };

  // End study session
  const endStudySession = () => {
    if (currentStudySession) {
      const updatedPlan = studyPlan.map(item => 
        item.id === currentStudySession.id ? { ...item, completed: true } : item
      );
      setStudyPlan(updatedPlan);
    }
    setCurrentStudySession(null);
    setIsTimerRunning(false);
    setStudyTimer(0);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play welcome sound on mount
  useEffect(() => {
    // Create AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Function to play a note
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    // Play a cheerful welcome melody (C-E-G-C chord arpeggio)
    const now = audioContext.currentTime;
    playNote(523.25, now, 0.15);        // C5
    playNote(659.25, now + 0.1, 0.15);  // E5
    playNote(783.99, now + 0.2, 0.15);  // G5
    playNote(1046.50, now + 0.3, 0.3);  // C6 (longer)
    
    // Cleanup
    return () => {
      audioContext.close();
    };
  }, []);

  // Calculate total sections on mount
  useEffect(() => {
    const total = Object.values(studyLibrary).reduce((sum, subject) => sum + subject.sections.length, 0);
    setStats(prev => ({ ...prev, totalSections: total }));
  }, []);

  // Check for new achievements whenever stats change
  useEffect(() => {
    achievements.forEach(achievement => {
      if (!unlockedAchievements.has(achievement.id) && achievement.requirement(stats)) {
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 5000);
      }
    });
  }, [stats, unlockedAchievements]);

  // AI Assistant handler
  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiThinking) return;

    const userMessage = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiThinking(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a helpful Grade 9 science tutor for Appleby College students. The student is studying Biology (biodiversity, ecosystems, food chains), Chemistry (matter, atoms, periodic table), Physics (electricity, circuits), and Space. 

Be encouraging, clear, and concise. Use analogies when helpful. If asked for practice questions, create them. If explaining concepts, break them down simply.

Student question: ${userMessage}`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;

      setAiMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try asking your question again!' 
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleDefinitionNote = (sectionId, noteIndex) => {
    const key = `${sectionId}-${noteIndex}`;
    const newExpanded = new Set(expandedDefinitionNotes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedDefinitionNotes(newExpanded);
  };

  const toggleRead = (sectionId) => {
    const newRead = new Set(readSections);
    if (newRead.has(sectionId)) {
      newRead.delete(sectionId);
      setStats(prev => ({ ...prev, sectionsCompleted: prev.sectionsCompleted - 1 }));
    } else {
      newRead.add(sectionId);
      setStats(prev => ({ ...prev, sectionsCompleted: prev.sectionsCompleted + 1 }));
    }
    setReadSections(newRead);
  };

  const toggleAnswer = (noteIndex, pointIndex) => {
    const key = `${noteIndex}-${pointIndex}`;
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(key)) {
      newRevealed.delete(key);
      setStats(prev => ({ ...prev, worksheetAnswersRevealed: Math.max(0, prev.worksheetAnswersRevealed - 1) }));
    } else {
      newRevealed.add(key);
      setStats(prev => ({ ...prev, worksheetAnswersRevealed: prev.worksheetAnswersRevealed + 1 }));
    }
    setRevealedAnswers(newRevealed);
  };

  const startQuiz = (section) => {
    setCurrentQuiz(section);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore({ correct: 0, total: 0 });
    setAnsweredQuestions([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz.quiz[currentQuestion].correct;
    setShowExplanation(true);
    setAnsweredQuestions([...answeredQuestions, { 
      questionIndex: currentQuestion, 
      selectedAnswer, 
      isCorrect 
    }]);
    if (isCorrect) {
      setQuizScore({ ...quizScore, correct: quizScore.correct + 1, total: quizScore.total + 1 });
      setStats(prev => ({ ...prev, quizCorrect: prev.quizCorrect + 1 }));
    } else {
      setQuizScore({ ...quizScore, total: quizScore.total + 1 });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Quiz completed
      const isPerfect = quizScore.correct + 1 === currentQuiz.quiz.length;
      setStats(prev => ({ 
        ...prev, 
        quizzesCompleted: prev.quizzesCompleted + 1,
        perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
      }));
      setCurrentQuiz(null);
      setSelectedSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    if (value.trim().length > 0) {
      setStats(prev => ({ ...prev, searchesPerformed: prev.searchesPerformed + 1 }));
      
      const results = [];
      const searchLower = value.toLowerCase();
      
      Object.values(studyLibrary).forEach(subject => {
        subject.sections.forEach(section => {
          // Check section title
          if (section.title.toLowerCase().includes(searchLower)) {
            results.push({
              type: 'section',
              subject: subject,
              section: section,
              title: section.title,
              match: 'Section Title',
              relevance: section.title.toLowerCase().indexOf(searchLower) === 0 ? 3 : 2
            });
          }
          
          // Check note subtitles and content
          section.notes.forEach(note => {
            if (note.subtitle.toLowerCase().includes(searchLower)) {
              results.push({
                type: 'note',
                subject: subject,
                section: section,
                title: `${section.title} - ${note.subtitle}`,
                match: 'Topic',
                relevance: note.subtitle.toLowerCase().indexOf(searchLower) === 0 ? 3 : 2
              });
            }
            
            // Check points for matches
            note.points.forEach(point => {
              if (point.toLowerCase().includes(searchLower)) {
                results.push({
                  type: 'content',
                  subject: subject,
                  section: section,
                  title: `${section.title} - ${note.subtitle}`,
                  preview: point.substring(0, 80) + (point.length > 80 ? '...' : ''),
                  match: 'Content',
                  relevance: 1
                });
              }
            });
          });
        });
      });
      
      // Sort by relevance and remove duplicates
      const uniqueResults = [];
      const seen = new Set();
      
      results
        .sort((a, b) => b.relevance - a.relevance)
        .forEach(result => {
          const key = `${result.section.id}-${result.type}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueResults.push(result);
          }
        });
      
      setSearchResults(uniqueResults.slice(0, 8)); // Limit to 8 results
      setShowSearchDropdown(uniqueResults.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchResultClick = (result) => {
    if (splitScreenMode && !leftPanel) {
      setLeftPanel({ subject: result.subject, section: result.section, type: 'notes' });
    } else if (splitScreenMode && !rightPanel) {
      setRightPanel({ subject: result.subject, section: result.section, type: 'notes' });
    } else {
      setSelectedSubject(result.subject);
      setSelectedSection(result.section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSearchTerm('');
    setShowSearchDropdown(false);
    setStats(prev => ({ 
      ...prev, 
      subjectsViewed: new Set([...prev.subjectsViewed, result.subject.id])
    }));
  };

  const openInSplitScreen = (subject, section, type = 'notes') => {
    setSplitScreenMode(true);
    if (!leftPanel) {
      setLeftPanel({ subject, section, type });
    } else if (!rightPanel) {
      setRightPanel({ subject, section, type });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSplitScreen = () => {
    setSplitScreenMode(false);
    setLeftPanel(null);
    setRightPanel(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlashcardKnown = () => {
    setFlashcardStats(prev => ({ ...prev, known: prev.known + 1 }));
    handleNextFlashcard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFlashcardLearning = () => {
    setFlashcardStats(prev => ({ ...prev, learning: prev.learning + 1 }));
    handleNextFlashcard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFlashcard = () => {
    if (currentFlashcard < selectedSection.flashcards.length - 1) {
      setCurrentFlashcard(currentFlashcard + 1);
      setIsFlipped(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Flashcards completed
      setCurrentFlashcard(0);
      setIsFlipped(false);
      setSelectedSection(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(currentFlashcard - 1);
      setIsFlipped(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Achievement notification popup
  const AchievementPopup = ({ achievement }) => {
    if (!achievement) return null;
    
    const Icon = achievement.icon;
    
    return (
      <div className="fixed top-4 right-4 z-50 animate-bounce">
        <div className={`bg-gradient-to-r ${achievement.color} rounded-2xl shadow-2xl p-6 text-white max-w-sm border-4 border-white`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Achievement Unlocked!</p>
              </div>
              <h3 className="text-xl font-bold">{achievement.name}</h3>
              <p className="text-white/90 text-sm">{achievement.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Premium Interest Modal Component
  const PremiumInterestModal = () => {
    if (!showPremiumModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-2xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Unlock Premium</h2>
                    <p className="text-white/90">Get full access to advanced content</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                What's Included in Premium?
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Advanced Quiz Library</h4>
                    <p className="text-sm text-gray-600">4 premium quizzes with 50+ advanced questions personally crafted by Dean</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Exclusive Flashcard Sets</h4>
                    <p className="text-sm text-gray-600">50+ additional flashcards with expert explanations</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Detailed Study Guides</h4>
                    <p className="text-sm text-gray-600">Comprehensive summaries and exam-ready cheat sheets</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Personal Updates by Dean</h4>
                    <p className="text-sm text-gray-600">Continuously updated with new features and content as you study</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-rose-200">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Direct Support Access</h4>
                    <p className="text-sm text-gray-600">Get help directly from Dean for any questions or improvements</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Custom Study Tools</h4>
                    <p className="text-sm text-gray-600">Advanced features tailored specifically for Appleby students</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1">One-time payment</p>
                  <p className="text-4xl font-bold">Affordable Price</p>
                  <p className="text-white/90 mt-2">Lifetime access • No subscriptions • Pay once, use forever</p>
                  <p className="text-white/80 text-sm mt-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">Personally maintained and updated by Dean Concepcion</span>
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Trophy className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Why Premium is Worth It</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Continuously evolving:</span> Dean personally adds new quizzes, diagrams, and study tools based on student feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Appleby-specific:</span> Content tailored exactly to the Grade 9 Appleby curriculum and teaching style</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Direct creator access:</span> Get personalized help and request specific features from Dean himself</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold mt-0.5">•</span>
                      <span><span className="font-semibold">Advanced AI features:</span> Premium unlocks enhanced L.Y.N.E AI capabilities for deeper explanations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Interested in Premium?</h3>
                  <p className="text-gray-600 mb-4">
                    Contact <span className="font-bold text-blue-600">Dean Concepcion</span> for pricing details and to unlock your premium access.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="mailto:2029089@appleby.on.ca?subject=Premium%20Access%20Inquiry%20-%20Grade%209%20Science%20Study%20Library&body=Hi%20Dean,%0D%0A%0D%0AI'm%20interested%20in%20upgrading%20to%20premium%20access%20for%20the%20Grade%209%20Science%20Study%20Library.%0D%0A%0D%0APlease%20send%20me%20more%20details%20about%20pricing%20and%20how%20to%20unlock%20the%20premium%20content.%0D%0A%0D%0AThank%20you!"
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact Dean
                    </a>
                    
                    <button
                      onClick={() => setShowPremiumModal(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Study Planner Modal Component
  const StudyPlannerModal = () => {
    if (!showStudyPlanner) return null;

    const totalTime = studyPlan.reduce((sum, item) => sum + item.estimatedTime, 0);
    const completedTime = studyPlan.filter(item => item.completed).reduce((sum, item) => sum + item.estimatedTime, 0);
    const progressPercent = totalTime > 0 ? (completedTime / totalTime) * 100 : 0;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Study Session Planner</h2>
                  <p className="text-white/80">Organize your study time efficiently</p>
                </div>
              </div>
              <button
                onClick={() => setShowStudyPlanner(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress Bar */}
            {studyPlan.length > 0 && (
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Overall Progress</span>
                  <span className="text-sm">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span>{completedTime} / {totalTime} minutes completed</span>
                  <span>{studyPlan.filter(i => i.completed).length} / {studyPlan.length} items</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {studyPlan.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Study Sessions Planned</h3>
                <p className="text-gray-500 mb-4">Add sections from the library to create your study schedule</p>
                <button
                  onClick={() => setShowStudyPlanner(false)}
                  className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
                >
                  Browse Library
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {studyPlan.map((item, index) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      item.completed
                        ? 'bg-green-50 border-green-200'
                        : currentStudySession?.id === item.id
                        ? 'bg-blue-50 border-blue-300 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Session Number */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                          item.completed
                            ? 'bg-green-500 text-white'
                            : currentStudySession?.id === item.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-800 mb-1">{item.section.title}</h3>
                              <p className="text-sm text-gray-600">{item.subject.name}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                                item.completed
                                  ? 'bg-green-100 text-green-700'
                                  : currentStudySession?.id === item.id
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {item.estimatedTime} min
                              </div>
                            </div>
                          </div>

                          {/* Timer for current session */}
                          {currentStudySession?.id === item.id && (
                            <div className="bg-blue-100 rounded-lg p-3 mb-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-blue-800">Time Elapsed:</span>
                                <span className="text-2xl font-bold text-blue-600">{formatTime(studyTimer)}</span>
                              </div>
                              <div className="mt-2 w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full transition-all"
                                  style={{ 
                                    width: `${Math.min((studyTimer / (item.estimatedTime * 60)) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {!item.completed && currentStudySession?.id !== item.id && (
                              <button
                                onClick={() => startStudySession(item)}
                                className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
                              >
                                Start Session
                              </button>
                            )}
                            
                            {currentStudySession?.id === item.id && (
                              <>
                                <button
                                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                                >
                                  {isTimerRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button
                                  onClick={endStudySession}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedSubject(item.subject);
                                setSelectedSection(item.section);
                                setShowStudyPlanner(false);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
                            >
                              View
                            </button>
                            
                            {!item.completed && currentStudySession?.id !== item.id && (
                              <button
                                onClick={() => removeFromStudyPlan(item.id)}
                                className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {studyPlan.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm('Clear all study sessions?')) {
                      setStudyPlan([]);
                      setCurrentStudySession(null);
                      setIsTimerRunning(false);
                    }
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  Clear All
                </button>
                <div className="text-sm text-gray-600">
                  Total estimated study time: <span className="font-bold text-gray-800">{totalTime} minutes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Achievements modal
  const AchievementsModal = () => {
    if (!showAchievements) return null;
    
    const unlockedCount = unlockedAchievements.size;
    const totalCount = achievements.length;
    const progress = (unlockedCount / totalCount) * 100;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Achievements</h2>
              </div>
              <button
                onClick={() => setShowAchievements(false)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/90">Progress: {unlockedCount} of {totalCount}</p>
                <p className="font-bold">{Math.round(progress)}%</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map(achievement => {
                const isUnlocked = unlockedAchievements.has(achievement.id);
                const Icon = achievement.icon;
                
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-6 border-2 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUnlocked
                          ? `bg-gradient-to-r ${achievement.color}`
                          : 'bg-gray-300'
                      }`}>
                        <Icon className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-lg font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                            {achievement.name}
                          </h3>
                          {isUnlocked && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                        {!isUnlocked && (
                          <p className="text-xs text-gray-400 mt-2">🔒 Locked</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Split Screen Rendering Component
  const renderPanelContent = (panel, panelSide) => {
    if (!panel) {
      return (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="font-semibold">Select content to view here</p>
            <p className="text-sm mt-2">Click any section or quiz to open</p>
          </div>
        </div>
      );
    }

    const { subject, section, type } = panel;
    
    // Get the correct quiz state for this panel
    const quizState = panelSide === 'left' ? leftQuizState : rightQuizState;
    const setQuizState = panelSide === 'left' ? setLeftQuizState : setRightQuizState;
    
    // Close button for the panel
    const closePanel = () => {
      if (panelSide === 'left') {
        setLeftPanel(null);
        setLeftQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
      } else {
        setRightPanel(null);
        setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
      }
      
      // If both panels are empty, exit split screen
      if ((panelSide === 'left' && !rightPanel) || (panelSide === 'right' && !leftPanel)) {
        setSplitScreenMode(false);
      }
    };

    if (type === 'quiz' && section.quiz) {
      // Mini quiz view for split screen
      const question = section.quiz[quizState.currentQuestion];
      const quizProgress = ((quizState.currentQuestion + 1) / section.quiz.length) * 100;
      
      return (
        <div className="h-full overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
            <button
              onClick={closePanel}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Question {quizState.currentQuestion + 1} of {section.quiz.length}</p>
              <p className="text-sm font-bold text-gray-800">{quizState.score.correct}/{quizState.score.total}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${subject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${quizProgress}%` }}
              />
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h4>

          <div className="space-y-2 mb-4">
            {question.options.map((option, idx) => {
              let buttonStyle = 'border-gray-200 bg-white hover:border-gray-400';
              
              if (quizState.showExplanation) {
                if (idx === question.correct) {
                  buttonStyle = 'border-green-500 bg-green-50';
                } else if (idx === quizState.selectedAnswer) {
                  buttonStyle = 'border-red-500 bg-red-50';
                }
              } else if (quizState.selectedAnswer === idx) {
                buttonStyle = 'border-blue-500 bg-blue-50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!quizState.showExplanation) {
                      setQuizState({ ...quizState, selectedAnswer: idx });
                    }
                  }}
                  disabled={quizState.showExplanation}
                  className={`w-full p-3 text-left text-sm rounded-lg border-2 transition-all ${buttonStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {quizState.showExplanation && (
            <div className="p-3 rounded-lg mb-4 bg-blue-50 border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-800 mb-1">
                {quizState.selectedAnswer === question.correct ? '✓ Correct!' : 'Explanation:'}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          )}

          {!quizState.showExplanation ? (
            <button
              onClick={() => {
                const isCorrect = quizState.selectedAnswer === question.correct;
                setQuizState({
                  ...quizState,
                  showExplanation: true,
                  score: {
                    correct: isCorrect ? quizState.score.correct + 1 : quizState.score.correct,
                    total: quizState.score.total + 1
                  }
                });
                if (isCorrect) {
                  setStats(prev => ({ ...prev, quizCorrect: prev.quizCorrect + 1 }));
                }
              }}
              disabled={quizState.selectedAnswer === null}
              className={`w-full py-2 bg-gradient-to-r ${subject.gradient} text-white rounded-lg font-semibold text-sm disabled:opacity-50`}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={() => {
                if (quizState.currentQuestion < section.quiz.length - 1) {
                  setQuizState({
                    ...quizState,
                    currentQuestion: quizState.currentQuestion + 1,
                    selectedAnswer: null,
                    showExplanation: false
                  });
                } else {
                  // Quiz completed
                  const isPerfect = quizState.score.correct + 1 === section.quiz.length;
                  setStats(prev => ({ 
                    ...prev, 
                    quizzesCompleted: prev.quizzesCompleted + 1,
                    perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes
                  }));
                  closePanel();
                }
              }}
              className={`w-full py-2 bg-gradient-to-r ${subject.gradient} text-white rounded-lg font-semibold text-sm`}
            >
              {quizState.currentQuestion < section.quiz.length - 1 ? 'Next →' : 'Finish'}
            </button>
          )}
        </div>
      );
    }

    // Notes view for split screen
    const isWorksheet = subject.id === 'worksheets';
    
    return (
      <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
          <button
            onClick={closePanel}
            className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {section.notes.map((note, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className={`bg-gradient-to-r ${subject.gradient} p-3`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <h4 className="text-lg font-bold text-white">{note.subtitle}</h4>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-2">
                  {note.points.map((point, pointIdx) => (
                    <div key={pointIdx}>
                      <div className="flex items-start gap-2">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${subject.gradient} flex-shrink-0`} />
                        <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                      </div>
                      
                      {isWorksheet && note.answers && note.answers[pointIdx] && (
                        <div className="ml-4 mt-1">
                          <button
                            onClick={() => toggleAnswer(idx, pointIdx)}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                          >
                            {revealedAnswers.has(`${idx}-${pointIdx}`) ? '▼ Hide' : '▶ Answer'}
                          </button>
                          
                          {revealedAnswers.has(`${idx}-${pointIdx}`) && (
                            <div className="mt-1 p-2 bg-teal-50 border-l-2 border-teal-500 rounded-r text-xs">
                              {note.answers[pointIdx].split(' • ').map((item, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <span className="text-teal-600">•</span>
                                  <span className="text-gray-700">{item}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {note.diagram && (
                  <div className="mt-4 text-xs">
                    {note.diagram === 'lewis' && <LewisDotDiagram />}
                    {note.diagram === 'bohr' && <BohrDiagram />}
                    {note.diagram === 'energy-pyramid' && <EnergyPyramid />}
                    {note.diagram === 'carbon-cycle' && <CarbonCycle />}
                    {note.diagram === 'atomic-models' && <AtomicModels />}
                    {note.diagram === 'periodic-table' && <PeriodicTableDiagram />}
                    {note.diagram === 'ions' && <IonDiagram />}
                    {note.diagram === 'circuit-symbols' && <CircuitSymbolsDiagram />}
                    {note.diagram === 'series-circuit' && <SeriesCircuitDiagram />}
                    {note.diagram === 'parallel-circuit' && <ParallelCircuitDiagram />}
                    {note.diagram === 'ohms-law' && <OhmsLawTriangle />}
                    {note.diagram === 'static-electricity' && <StaticElectricityDiagram />}
                    {note.diagram === 'power-formula' && <PowerFormulaDiagram />}
                    {note.diagram === 'complete-circuit' && <CircuitDiagram />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Split screen mode
  if (splitScreenMode) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        <AchievementPopup achievement={newAchievement} />
        <AchievementsModal />
        
        {/* L.Y.N.E AI Assistant Widget */}
        {showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-blue-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {!showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Split Screen Study Mode</h1>
                <p className="text-xs text-slate-300">View notes and quizzes side by side</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSplitScreenMode(false);
                  setLeftPanel(null);
                  setRightPanel(null);
                  setSelectedSubject(null);
                  setSelectedSection(null);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Library
              </button>
              
              <button
                onClick={closeSplitScreen}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Exit Split View
              </button>
            </div>
          </div>
        </div>

        {/* Content browser sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar for browsing content */}
          <div className="w-80 bg-white border-r-2 border-gray-300 overflow-y-auto p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Browse Content</h3>
            
            <div className="space-y-4">
              {Object.values(studyLibrary).map(subject => (
                <div key={subject.id} className="border-2 border-gray-200 rounded-xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${subject.gradient} p-3`}>
                    <div className="flex items-center gap-2">
                      <subject.icon className="w-5 h-5 text-white" />
                      <h4 className="font-bold text-white text-sm">{subject.name}</h4>
                    </div>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    {subject.sections.map(section => (
                      <button
                        key={section.id}
                        onClick={() => {
                          // Skip flashcards and locked sections in split screen
                          if (section.flashcards && section.flashcards.length > 0) {
                            return;
                          }
                          if (section.locked) {
                            return;
                          }
                          
                          const panelData = { subject, section, type: section.quiz ? 'quiz' : 'notes' };
                          if (!leftPanel) {
                            setLeftPanel(panelData);
                            setLeftQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          } else if (!rightPanel) {
                            setRightPanel(panelData);
                            setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          } else {
                            // Replace right panel if both are filled
                            setRightPanel(panelData);
                            setRightQuizState({ currentQuestion: 0, selectedAnswer: null, showExplanation: false, score: { correct: 0, total: 0 } });
                          }
                        }}
                        disabled={section.flashcards && section.flashcards.length > 0 || section.locked}
                        className={`w-full text-left p-2 text-sm rounded-lg transition-colors ${
                          section.locked
                            ? 'opacity-50 cursor-not-allowed blur-sm'
                            : section.flashcards && section.flashcards.length > 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {section.quiz ? (
                            <FileText className="w-4 h-4 text-indigo-500" />
                          ) : section.flashcards && section.flashcards.length > 0 ? (
                            <Brain className="w-4 h-4 text-cyan-500" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                          )}
                          <span className="text-gray-700 text-xs">{section.title}</span>
                          {section.flashcards && section.flashcards.length > 0 && (
                            <span className="ml-auto text-xs text-gray-400">(Full screen only)</span>
                          )}
                          {section.locked && (
                            <span className="ml-auto text-xs text-gray-400">(Premium)</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel */}
            <div className="flex-1 border-r-2 border-gray-300 overflow-hidden">
              {renderPanelContent(leftPanel, 'left')}
            </div>

            {/* Right Panel */}
            <div className="flex-1 overflow-hidden">
              {renderPanelContent(rightPanel, 'right')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flashcard interface
  if (selectedSection && selectedSection.flashcards && selectedSection.flashcards.length > 0) {
    const flashcard = selectedSection.flashcards[currentFlashcard];
    const progress = ((currentFlashcard + 1) / selectedSection.flashcards.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* L.Y.N.E AI Assistant Widget */}
        {showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-blue-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {!showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setSelectedSection(null);
                setCurrentFlashcard(0);
                setIsFlipped(false);
                setFlashcardStats({ known: 0, learning: 0 });
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Flashcards
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedSection.title}</h2>
                <p className="text-gray-600">Card {currentFlashcard + 1} of {selectedSection.flashcards.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-green-600">Known: {flashcardStats.known}</p>
                    <p className="text-xs text-yellow-600">Learning: {flashcardStats.learning}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedSubject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Flashcard */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-96 cursor-pointer perspective-1000 mb-6"
              style={{ perspective: '1000px' }}
            >
              <div 
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of card */}
                <div 
                  className={`absolute w-full h-full bg-gradient-to-br ${selectedSubject.gradient} rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-4 font-semibold uppercase tracking-wide">Question</p>
                    <h3 className="text-3xl font-bold text-white leading-relaxed">{flashcard.front}</h3>
                    <p className="text-white/70 mt-6 text-sm">Click to reveal answer</p>
                  </div>
                </div>

                {/* Back of card */}
                <div 
                  className="absolute w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center p-8 backface-hidden border-4 border-gray-200"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4 font-semibold uppercase tracking-wide">Answer</p>
                    <h3 className="text-2xl font-semibold text-gray-800 leading-relaxed whitespace-pre-line">{flashcard.back}</h3>
                    <p className="text-gray-400 mt-6 text-sm">Click to flip back</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and response buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePreviousFlashcard}
                disabled={currentFlashcard === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
              >
                ← Previous
              </button>

              {isFlipped && (
                <div className="flex gap-3">
                  <button
                    onClick={handleFlashcardLearning}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all"
                  >
                    Still Learning
                  </button>
                  <button
                    onClick={handleFlashcardKnown}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all"
                  >
                    I Know This!
                  </button>
                </div>
              )}

              <button
                onClick={handleNextFlashcard}
                disabled={currentFlashcard === selectedSection.flashcards.length - 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 transition-all"
              >
                Next →
              </button>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-6 text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-bold">Study Tip</h3>
            </div>
            <p className="text-white/90">
              Flashcards work best with spaced repetition. Review cards you marked "Still Learning" more frequently!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  if (currentQuiz) {
    const question = currentQuiz.quiz[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    const progress = ((currentQuestion + 1) / currentQuiz.quiz.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* L.Y.N.E AI Assistant Widget */}
        {showAIAssistant && (
          <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-blue-200 flex flex-col z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <Sparkles className="w-5 h-5" />
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">L.Y.N.E</h3>
                  <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                  <p className="text-xs text-white/70">Your AI Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAISubmit(e);
                    }
                  }}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                  disabled={isAiThinking}
                />
                <button
                  onClick={handleAISubmit}
                  disabled={!aiInput.trim() || isAiThinking}
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>Send</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* L.Y.N.E AI Assistant Toggle Button */}
        {!showAIAssistant && (
          <button
            onClick={() => setShowAIAssistant(true)}
            className="fixed bottom-6 right-6 group z-50"
          >
            <div className="relative">
              {/* Pulsing ring */}
              <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
              
              {/* Main button */}
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                  Chat with L.Y.N.E
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </button>
        )}
        
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setCurrentQuiz(null);
                setSelectedSection(null);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Exit Quiz
            </button>
            
            <button
              onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'quiz')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              Open Split View
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentQuiz.title}</h2>
                <p className="text-gray-600">Question {currentQuestion + 1} of {currentQuiz.quiz.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Score</p>
                <p className="text-2xl font-bold text-gray-800">{quizScore.correct}/{quizScore.total}</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className={`bg-gradient-to-r ${selectedSubject.gradient} h-2 rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>

            <div className="space-y-3 mb-6">
              {question.options.map((option, idx) => {
                let buttonStyle = 'border-gray-200 bg-white hover:border-gray-400';
                
                if (showExplanation) {
                  if (idx === question.correct) {
                    buttonStyle = 'border-green-500 bg-green-50';
                  } else if (idx === selectedAnswer) {
                    buttonStyle = 'border-red-500 bg-red-50';
                  }
                } else if (selectedAnswer === idx) {
                  buttonStyle = 'border-blue-500 bg-blue-50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${buttonStyle} ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showExplanation && idx === question.correct
                          ? 'border-green-500 bg-green-500'
                          : showExplanation && idx === selectedAnswer
                          ? 'border-red-500 bg-red-500'
                          : selectedAnswer === idx
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {((showExplanation && idx === question.correct) || (!showExplanation && selectedAnswer === idx)) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showExplanation && idx === selectedAnswer && idx !== question.correct && (
                          <X className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                  <Lightbulb className={`w-6 h-6 flex-shrink-0 ${isCorrect ? 'text-green-600' : 'text-blue-600'}`} />
                  <div>
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                      {isCorrect ? '✓ Correct!' : 'Explanation:'}
                    </p>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {!showExplanation ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className={`w-full py-3 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`w-full py-3 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
              >
                {currentQuestion < currentQuiz.quiz.length - 1 ? 'Next Question →' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Section view
  if (selectedSection && selectedSubject) {
    const section = selectedSection;
    const isRead = readSections.has(section.id);
    const hasQuiz = section.quiz && section.quiz.length > 0;
    const isWorksheet = selectedSubject.id === 'worksheets';

    // If this is a quiz section, show quiz interface
    if (hasQuiz && !currentQuiz) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {/* L.Y.N.E AI Assistant Widget */}
          {showAIAssistant && (
            <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-blue-200 flex flex-col z-50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                    <Sparkles className="w-5 h-5" />
                    <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">L.Y.N.E</h3>
                    <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                    <p className="text-xs text-white/70">Your AI Study Companion</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIAssistant(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAISubmit(e);
                      }
                    }}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                    disabled={isAiThinking}
                  />
                  <button
                    onClick={handleAISubmit}
                    disabled={!aiInput.trim() || isAiThinking}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {isAiThinking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      <>Send</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* L.Y.N.E AI Assistant Toggle Button */}
          {!showAIAssistant && (
            <button
              onClick={() => setShowAIAssistant(true)}
              className="fixed bottom-6 right-6 group z-50"
            >
              <div className="relative">
                {/* Pulsing ring */}
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
                
                {/* Main button */}
                <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                    Chat with L.Y.N.E
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </button>
          )}
          
          <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedSection(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to {selectedSubject.name}
              </button>
              
              <button
                onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'quiz')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                Open Split View
              </button>
            </div>

            <div className="relative h-64 rounded-2xl overflow-hidden mb-6 shadow-xl">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedSubject.gradient} opacity-60`} />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl font-bold text-white mb-2">{section.title}</h1>
                <p className="text-white/90 text-lg">{section.quiz.length} practice questions</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Practice?</h2>
                <p className="text-gray-600 mb-8">
                  Test your knowledge with {section.quiz.length} practice questions. 
                  Each question includes detailed explanations to help you learn!
                </p>
                <button
                  onClick={() => startQuiz(section)}
                  className={`px-8 py-4 bg-gradient-to-r ${selectedSubject.gradient} text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5`}
                >
                  Start Practice Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {selectedSubject.name}
            </button>
            
            <button
              onClick={() => openInSplitScreen(selectedSubject, selectedSection, 'notes')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              Open Split View
            </button>
          </div>

          <div className={`relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br ${selectedSubject.gradient} border-2 border-gray-200`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{section.title}</h1>
                {section.quiz && section.quiz.length > 0 && (
                  <p className="text-white/90 text-sm">{section.quiz.length} practice questions</p>
                )}
                {section.flashcards && section.flashcards.length > 0 && (
                  <p className="text-white/90 text-sm">{section.flashcards.length} flashcards</p>
                )}
                {section.notes && section.notes.length > 0 && !section.quiz && !section.flashcards && (
                  <p className="text-white/90 text-sm">{section.notes.length} topics to review</p>
                )}
              </div>
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <selectedSubject.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="mb-6 flex justify-end">
            <button
              onClick={() => toggleRead(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isRead
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {isRead ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              {isRead ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>

          {/* Add to Study Plan button */}
          <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg">Quick Study Time</p>
                  <p className="text-white/80 text-sm">
                    {calculateStudyTime(section)} minutes • 
                    {section.quiz ? ' Efficient quiz practice' : 
                     section.flashcards ? ' Focused card review' : 
                     section.id.includes('definitions') ? ' Skim key terms' :
                     section.id.includes('worksheet') ? ' Key problems only' :
                     ' Essential concepts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  addToStudyPlan(selectedSubject, section);
                  setShowStudyPlanner(true);
                }}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Add to Study Plan
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {section.notes.map((note, idx) => {
              // Check if this is a collapsible section (electricity or definitions)
              const isDefinitionSection = section.id === 'biology-definitions' || 
                                         section.id === 'chemistry-definitions' || 
                                         section.id === 'chemistry-definitions-2' ||
                                         section.id === 'space-definitions';
              const isElectricitySection = selectedSubject?.id === 'physics' && section.id !== 'definitions';
              const isCollapsible = isDefinitionSection || isElectricitySection;
              
              const noteKey = `${section.id}-${idx}`;
              const isExpanded = expandedDefinitionNotes.has(noteKey);
              
              return (
                <div key={idx} className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all border-2 ${
                  isExpanded ? 'border-blue-200 shadow-xl' : 'border-gray-100 hover:border-gray-200'
                }`}>
                  <div 
                    className={`bg-gradient-to-r ${selectedSubject.gradient} p-5 relative overflow-hidden ${isCollapsible ? 'cursor-pointer hover:opacity-95' : ''} transition-all`}
                    onClick={() => isCollapsible && toggleDefinitionNote(section.id, idx)}
                  >
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
                          <span className="text-3xl">{note.emoji}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">{note.subtitle}</h2>
                      </div>
                      {isCollapsible && (
                        <div className={`w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center transition-all ${
                          isExpanded ? 'bg-white/30' : ''
                        }`}>
                          <ChevronRight className={`w-5 h-5 text-white transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      )}
                    </div>
                    
                    {isCollapsible && !isExpanded && (
                      <div className="mt-2 relative z-10">
                        <p className="text-white/80 text-sm">
                          Click to expand • {note.points.length} {note.points.length === 1 ? 'term' : 'terms'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {(!isCollapsible || isExpanded) && (
                    <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                      <div className="space-y-3">
                        {note.points.map((point, pointIdx) => (
                          <div key={pointIdx}>
                            <div className="flex items-start gap-3 group p-3 rounded-lg hover:bg-white transition-all">
                              <div className={`mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r ${selectedSubject.gradient} flex-shrink-0 shadow-sm`} />
                              <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-900 transition-colors">
                                {point}
                              </p>
                            </div>
                            
                            {/* Show answer button for worksheets */}
                            {isWorksheet && note.answers && note.answers[pointIdx] && (
                              <div className="ml-5 mt-2">
                                <button
                                  onClick={() => toggleAnswer(idx, pointIdx)}
                                  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-all flex items-center gap-2 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 rounded-lg shadow-sm"
                                >
                                  {revealedAnswers.has(`${idx}-${pointIdx}`) ? (
                                    <>
                                      <span className="text-sm">▼</span>
                                      Hide Answer
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm">▶</span>
                                      Reveal Answer
                                    </>
                                  )}
                                </button>
                                
                                {revealedAnswers.has(`${idx}-${pointIdx}`) && (
                                  <div className="mt-2 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-500 rounded-r-xl shadow-md">
                                    <div className="space-y-2">
                                      {note.answers[pointIdx].split(' • ').map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 p-2 bg-white/60 rounded-lg">
                                          <span className="text-teal-600 font-bold">•</span>
                                          <span className="text-gray-800 text-sm leading-relaxed">{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {note.diagram && (
                        <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-inner">
                          {note.diagram === 'lewis' && <LewisDotDiagram />}
                          {note.diagram === 'bohr' && <BohrDiagram />}
                          {note.diagram === 'energy-pyramid' && <EnergyPyramid />}
                          {note.diagram === 'carbon-cycle' && <CarbonCycle />}
                          {note.diagram === 'atomic-models' && <AtomicModels />}
                          {note.diagram === 'periodic-table' && <PeriodicTableDiagram />}
                          {note.diagram === 'ions' && <IonDiagram />}
                          {note.diagram === 'photosynthesis' && <PhotosynthesisDiagram />}
                          {note.diagram === 'respiration' && <CellRespirationDiagram />}
                          {note.diagram === 'food-chain' && <FoodChainDiagram />}
                          {note.diagram === 'aquatic-food-chain' && <AquaticFoodChainDiagram />}
                          {note.diagram === 'nitrogen-cycle' && <NitrogenCycleDiagram />}
                          {note.diagram === 'density' && <DensityComparisonDiagram />}
                          {note.diagram === 'circuit-symbols' && <CircuitSymbolsDiagram />}
                          {note.diagram === 'series-circuit' && <SeriesCircuitDiagram />}
                          {note.diagram === 'parallel-circuit' && <ParallelCircuitDiagram />}
                          {note.diagram === 'ohms-law' && <OhmsLawTriangle />}
                          {note.diagram === 'static-electricity' && <StaticElectricityDiagram />}
                          {note.diagram === 'power-formula' && <PowerFormulaDiagram />}
                          {note.diagram === 'complete-circuit' && <CircuitDiagram />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-8 bg-gradient-to-r ${selectedSubject.gradient} rounded-2xl p-6 text-white`}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-6 h-6" />
              <h3 className="text-xl font-bold">Study Tip</h3>
            </div>
            <p className="text-white/90">
              Try explaining these concepts to someone else or writing them out from memory. 
              This helps solidify your understanding!
            </p>
          </div>

          {/* Exit button at bottom */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to {selectedSubject.name}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Subject view
  if (selectedSubject) {
    const subject = selectedSubject;
    const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
    const progress = (completedCount / subject.sections.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-5xl mx-auto p-4 md:p-6">
          <button
            onClick={() => setSelectedSubject(null)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>

          <div className={`relative rounded-xl overflow-hidden mb-6 bg-gradient-to-br ${subject.gradient} border-2 border-gray-200`}>
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">{subject.name}</h1>
                <p className="text-white/90 text-sm">
                  {subject.sections.length} sections • {completedCount} completed
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <subject.icon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="relative z-10 px-6 pb-4">
              <div className="bg-white/20 backdrop-blur rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-4 ${mobileMode ? 'grid-cols-1' : ''}`}>
            {subject.sections.map((section) => {
              const isRead = readSections.has(section.id);
              const hasQuiz = section.quiz && section.quiz.length > 0;
              const hasFlashcards = section.flashcards && section.flashcards.length > 0;
              const isLocked = section.locked;
              
              return (
                <div
                  key={section.id}
                  onClick={() => !isLocked && setSelectedSection(section)}
                  className={`bg-white rounded-xl overflow-hidden ${isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-lg'} group transition-all border-2 border-gray-100 ${!isLocked && 'hover:border-gray-300'} relative`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Premium</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`relative h-24 bg-gradient-to-br ${subject.gradient} p-4 overflow-hidden ${isLocked ? 'blur-sm' : ''}`}>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                    <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
                    
                    <div className="relative z-10 flex items-start justify-between h-full">
                      <h3 className="text-sm font-bold text-white pr-2 line-clamp-2 leading-tight">{section.title}</h3>
                      {!isLocked && isRead && (
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-3 ${isLocked ? 'blur-sm' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {hasQuiz && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded-md">
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span className="text-xs font-medium text-indigo-700">{section.quiz.length} questions</span>
                        </div>
                      )}
                      {hasFlashcards && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 rounded-md">
                          <Brain className="w-3 h-3 text-cyan-600" />
                          <span className="text-xs font-medium text-cyan-700">{section.flashcards.length} cards</span>
                        </div>
                      )}
                      {!hasQuiz && !hasFlashcards && section.notes && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-md">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-700">{section.notes.length} topics</span>
                        </div>
                      )}
                      {isLocked && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-md">
                          <Award className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-700">Premium</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{isLocked ? 'Locked' : isRead ? 'Completed' : 'Not started'}</span>
                      {!isLocked && <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium CTA Banner at bottom of subject view */}
          {subject.sections.some(s => s.locked) && (
            <div className="mt-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Interested in Premium Content?</h3>
                  </div>
                  <p className="text-white/90 text-lg mb-2">
                    Unlock advanced quizzes, exclusive flashcards, and detailed study guides
                  </p>
                  <p className="text-white/80 mb-2">
                    <span className="font-bold">Affordable one-time payment</span> • No subscriptions • Lifetime access
                  </p>
                  <p className="text-white/90 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Personally updated with new features by Dean Concepcion</span>
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowPremiumModal(true)}
                    className="px-8 py-4 bg-white text-amber-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                  >
                    Learn More
                  </button>
                  <p className="text-white/80 text-xs text-center">
                    Contact Dean for pricing details
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Introduction modal
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
            {/* Animated sound wave decoration */}
            <div className="absolute top-0 right-0 opacity-20">
              <div className="flex gap-1 items-end h-16">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-emerald-400 to-blue-500 rounded-t animate-pulse"
                    style={{
                      height: `${30 + Math.random() * 40}px`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '1s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center animate-bounce">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome to Your Study Library!</h1>
                <p className="text-slate-300">Grade 9 Science • Appleby College</p>
                <p className="text-slate-400 text-sm mt-1">Created by Dean Concepcion</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Why This Was Made
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This interactive study library was created by <span className="font-semibold">Dean Concepcion</span> specifically to help Grade 9 students at Appleby College prepare for their Science tests more effectively. Instead of scattered notes across different pages, everything is organized in one place with clear sections, visual aids, and practice questions tailored to the Appleby curriculum.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're reviewing for Biology's ecosystem concepts, Chemistry's atomic structure, or tackling practice questions, this tool makes studying more organized and less overwhelming—designed with Appleby Grade 9 students in mind.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-500" />
                How to Use This Library
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Browse Subjects</h3>
                    <p className="text-gray-700 text-sm">Click on any subject card (Biology, Chemistry, etc.) to view all the topics inside.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Study Sections</h3>
                    <p className="text-gray-700 text-sm">Each section has visual notes with key points. Mark sections as complete to track your progress!</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Practice & Review</h3>
                    <p className="text-gray-700 text-sm">Try the Test Review Guide and Practice Questions sections to test your knowledge with instant feedback.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Search Anything</h3>
                    <p className="text-gray-700 text-sm">Use the search bar to quickly find specific topics, concepts, or keywords across all subjects.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Use AI Assistant & Study Planner</h3>
                    <p className="text-gray-700 text-sm">Ask L.Y.N.E AI for help (blue sparkle button), and use the Study Planner to schedule sessions with automatic time tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Track Your Progress</h3>
                    <p className="text-gray-700 text-sm">Mark sections complete, unlock achievements, and use split screen mode for efficient multi-tasking while studying.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-6 text-white mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Pro Tips for Efficient Studying</h3>
                  <div className="space-y-2 text-white/90 text-sm">
                    <p>💡 <strong>Study Planner:</strong> Click "+ Add to Plan" on sections to build your custom schedule with time estimates</p>
                    <p>🤖 <strong>AI Help:</strong> Stuck? Ask L.Y.N.E AI (blue sparkle button) to explain concepts or create practice questions</p>
                    <p>📱 <strong>Split Screen:</strong> Use dual-panel view to reference notes while taking quizzes simultaneously</p>
                    <p>🏆 <strong>Achievements:</strong> Unlock all 10 badges by completing sections and maintaining study streaks</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIntro(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Let's Get Started! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main library view
  const subjects = Object.values(studyLibrary);

  // Filter subjects and sections based on search
  const filteredSubjects = subjects.filter(subject => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Search in subject name and description
    if (subject.name.toLowerCase().includes(searchLower)) return true;
    
    // Search in section titles
    const hasMatchingSection = subject.sections.some(section => 
      section.title.toLowerCase().includes(searchLower)
    );
    if (hasMatchingSection) return true;
    
    // Search in section notes content
    const hasMatchingContent = subject.sections.some(section =>
      section.notes.some(note =>
        note.subtitle.toLowerCase().includes(searchLower) ||
        note.points.some(point => point.toLowerCase().includes(searchLower))
      )
    );
    if (hasMatchingContent) return true;
    
    return false;
  });

  // Feature highlights section
  const FeatureHighlights = () => (
    <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 relative">
      <button
        onClick={() => setShowFeatureHighlights(false)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-sm border border-gray-200"
        title="Close guide"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Quick Start Guide</h2>
          <p className="text-sm text-gray-600">Learn about the powerful features available</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Feature 1: AI Assistant */}
        <div className="bg-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800">L.Y.N.E AI Assistant</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Chat with AI for explanations, practice questions, and help
          </p>
          <div className="text-xs text-blue-600 font-semibold">
            → Click the blue sparkle button (bottom-right corner)
          </div>
        </div>

        {/* Feature 2: Study Planner */}
        <div className="bg-white rounded-xl p-4 border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-bold text-gray-800">Study Session Planner</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Build custom study sessions with time tracking
          </p>
          <div className="text-xs text-indigo-600 font-semibold">
            → Click "+ Add to Plan" or "Study Planner" in header
          </div>
        </div>

        {/* Feature 3: Split Screen */}
        <div className="bg-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
            </div>
            <h3 className="font-bold text-gray-800">Split Screen Mode</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            View quizzes and notes side by side for efficient studying
          </p>
          <div className="text-xs text-purple-600 font-semibold">
            → Click "Open Split View" on any section
          </div>
        </div>

        {/* Feature 4: Achievements */}
        <div className="bg-white rounded-xl p-4 border-2 border-yellow-100 hover:border-yellow-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-800">Unlock Achievements</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Earn badges as you complete sections and quizzes
          </p>
          <div className="text-xs text-yellow-600 font-semibold">
            → Study to unlock all 10 achievements!
          </div>
        </div>

        {/* Feature 5: Flashcards */}
        <div className="bg-white rounded-xl p-4 border-2 border-cyan-100 hover:border-cyan-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-gray-800">Interactive Flashcards</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            70+ cards with flip animation for memorization
          </p>
          <div className="text-xs text-cyan-600 font-semibold">
            → Click to flip, mark as "Known" or "Learning"
          </div>
        </div>

        {/* Feature 6: Smart Search */}
        <div className="bg-white rounded-xl p-4 border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5 text-green-500" />
            <h3 className="font-bold text-gray-800">Smart Search</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Find topics instantly across all subjects
          </p>
          <div className="text-xs text-green-600 font-semibold">
            → Type keywords like "density" or "biodiversity"
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Pro Study Tips</p>
            <p className="text-sm text-white/90 mb-2">
              • Use the <span className="font-bold">Study Planner</span> to organize sessions with automatic time tracking
            </p>
            <p className="text-sm text-white/90 mb-2">
              • Ask <span className="font-bold">L.Y.N.E AI</span> to explain tricky concepts or create custom practice questions
            </p>
            <p className="text-sm text-white/90">
              • Enable <span className="font-bold">Split Screen</span> to quiz yourself while referencing notes simultaneously
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AchievementPopup achievement={newAchievement} />
      <AchievementsModal />
      <StudyPlannerModal />
      <PremiumInterestModal />
      
      {/* AI Assistant Widget */}
      {showAIAssistant && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border-2 border-blue-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                <Sparkles className="w-5 h-5" />
                <div className="absolute inset-0 rounded-full bg-white/10 animate-ping"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg">L.Y.N.E</h3>
                <p className="text-xs text-white/90 font-semibold">Logical Yield Neural Engine</p>
                <p className="text-xs text-white/70">Your AI Study Companion</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIAssistant(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isAiThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAISubmit(e);
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm"
                disabled={isAiThinking}
              />
              <button
                onClick={handleAISubmit}
                disabled={!aiInput.trim() || isAiThinking}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {isAiThinking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>Send</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* L.Y.N.E AI Assistant Toggle Button */}
      {!showAIAssistant && (
        <button
          onClick={() => setShowAIAssistant(true)}
          className="fixed bottom-6 right-6 group z-50"
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-75"></div>
            
            {/* Main button */}
            <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl">
                Chat with L.Y.N.E
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </button>
      )}
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Science Study Library
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-semibold backdrop-blur">
                        Grade 9
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-semibold backdrop-blur">
                        Appleby College
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                  <Trophy className="w-5 h-5" />
                  <span>Achievements</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                    {unlockedAchievements.size}/{achievements.length}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-2xl p-1 shadow-2xl">
                  <div className="bg-slate-900/80 backdrop-blur rounded-xl px-6 py-3">
                    <p className="text-white font-black text-xl md:text-2xl tracking-wide text-center">
                      🔌 Plug In. 📚 Study Smart. 🚀 Succeed Fast.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 text-lg max-w-3xl">
                Your complete science companion with <span className="text-emerald-400 font-bold">70+ flashcards</span>, 
                <span className="text-blue-400 font-bold"> 80+ quiz questions</span>, and 
                <span className="text-purple-400 font-bold"> interactive diagrams</span>
              </p>
              
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <div>
                    <p className="text-3xl font-bold text-white">{readSections.size}</p>
                    <p className="text-xs text-slate-400">Sections Completed</p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-slate-700"></div>
                
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div>
                    <p className="text-3xl font-bold text-white">{unlockedAchievements.size}</p>
                    <p className="text-xs text-slate-400">Achievements Unlocked</p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-slate-700"></div>
                
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.quizCorrect}</p>
                    <p className="text-xs text-slate-400">Quiz Questions Correct</p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-slate-700"></div>
                
                <button
                  onClick={() => setShowStudyPlanner(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur border border-white/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-bold">Study Planner</p>
                    <p className="text-xs text-slate-300">{studyPlan.length} sessions</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur border border-white/20 relative group"
                  title="Dark Mode (Premium)"
                >
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-sm font-bold">Dark Mode</p>
                    <p className="text-xs text-yellow-300 font-semibold">Premium</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur border border-white/20 relative group"
                  title="Mobile/Desktop Mode (Premium)"
                >
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-bold">View Mode</p>
                      <p className="text-xs text-yellow-300 font-semibold">Premium</p>
                    </div>
                  </>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics, concepts, keywords..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchTerm && setShowSearchDropdown(true)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-800 bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowSearchDropdown(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-600">
                  Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full p-4 text-left hover:bg-blue-50 border-b border-gray-100 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${result.subject.gradient} flex items-center justify-center flex-shrink-0`}>
                      <result.subject.icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">
                          {result.match}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {result.subject.name}
                        </span>
                      </div>
                      
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                        {result.title}
                      </p>
                      
                      {result.preview && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {result.preview}
                        </p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {showFeatureHighlights ? (
          <FeatureHighlights />
        ) : (
          <button
            onClick={() => setShowFeatureHighlights(true)}
            className="mb-8 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Show Quick Start Guide</span>
          </button>
        )}

        {searchTerm && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-blue-800">
              <span className="font-semibold">Found {filteredSubjects.length} subject(s)</span> matching "{searchTerm}"
            </p>
          </div>
        )}

        {filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
            <p className="text-gray-500">Try searching for different keywords like "biodiversity", "density", or "atoms"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Quiz & Practice Features Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Practice & Test Preparation</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
              </div>

              <div className={`grid gap-6 ${
                mobileMode 
                  ? 'grid-cols-1' 
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredSubjects.filter(subject => subject.isQuizSection).map((subject) => {
                  const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
                  const progress = (completedCount / subject.sections.length) * 100;

                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setStats(prev => ({ 
                          ...prev, 
                          subjectsViewed: new Set([...prev.subjectsViewed, subject.id])
                        }));
                      }}
                      className={`bg-white rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-300 ${
                        mobileMode ? 'w-full' : ''
                      }`}
                    >
                      <div className={`relative bg-gradient-to-br ${subject.gradient} p-5 overflow-hidden ${
                        mobileMode ? 'h-24' : 'h-32'
                      }`}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex items-start justify-between h-full">
                          <div className="flex-1">
                            <h2 className={`font-bold text-white mb-1 ${
                              mobileMode ? 'text-lg' : 'text-xl'
                            }`}>{subject.name}</h2>
                            <p className="text-white/90 text-xs">{subject.sections.length} sections</p>
                          </div>
                          <div className={`rounded-lg bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform ${
                            mobileMode ? 'w-10 h-10' : 'w-12 h-12'
                          }`}>
                            <subject.icon className={`text-white ${
                              mobileMode ? 'w-5 h-5' : 'w-6 h-6'
                            }`} />
                          </div>
                        </div>
                      </div>

                      <div className={mobileMode ? 'p-3' : 'p-4'}>
                        <p className={`text-gray-600 mb-3 ${
                          mobileMode ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'
                        }`}>{subject.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{completedCount}/{subject.sections.length} complete</span>
                          <span className="font-bold text-gray-700">{Math.round(progress)}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${subject.gradient} h-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Study Notes & Content Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Study Notes & Content</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
              </div>

              <div className={`grid gap-6 ${
                mobileMode 
                  ? 'grid-cols-1' 
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredSubjects.filter(subject => !subject.isQuizSection).map((subject) => {
                  const completedCount = subject.sections.filter(s => readSections.has(s.id)).length;
                  const progress = (completedCount / subject.sections.length) * 100;

                  return (
                    <div
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setStats(prev => ({ 
                          ...prev, 
                          subjectsViewed: new Set([...prev.subjectsViewed, subject.id])
                        }));
                      }}
                      className={`bg-white rounded-xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border-2 border-gray-100 hover:border-gray-300 ${
                        mobileMode ? 'w-full' : ''
                      }`}
                    >
                      <div className={`relative bg-gradient-to-br ${subject.gradient} p-5 overflow-hidden ${
                        mobileMode ? 'h-24' : 'h-32'
                      }`}>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                        
                        <div className="relative z-10 flex items-start justify-between h-full">
                          <div className="flex-1">
                            <h2 className={`font-bold text-white mb-1 ${
                              mobileMode ? 'text-lg' : 'text-xl'
                            }`}>{subject.name}</h2>
                            <p className="text-white/90 text-xs">{subject.sections.length} sections</p>
                          </div>
                          <div className={`rounded-lg bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform ${
                            mobileMode ? 'w-10 h-10' : 'w-12 h-12'
                          }`}>
                            <subject.icon className={`text-white ${
                              mobileMode ? 'w-5 h-5' : 'w-6 h-6'
                            }`} />
                          </div>
                        </div>
                      </div>

                      <div className={mobileMode ? 'p-3' : 'p-4'}>
                        <p className={`text-gray-600 mb-3 ${
                          mobileMode ? 'text-xs line-clamp-2' : 'text-sm line-clamp-2'
                        }`}>{subject.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{completedCount}/{subject.sections.length} complete</span>
                          <span className="font-bold text-gray-700">{Math.round(progress)}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${subject.gradient} h-full transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Special Thanks Section */}
        <div className="mt-12 mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl px-8 py-4 border-2 border-amber-200">
            <p className="text-sm text-gray-600 mb-1">Special Thanks to Our Sponsors</p>
            <div className="flex items-center gap-3 justify-center flex-wrap">
              <span className="text-lg font-bold text-amber-600">⭐</span>
              <span className="font-bold text-gray-800">Aland Cai</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-gray-800">Derek Zhu</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-gray-800">Max James</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-gray-800">Yoshi Imaizumi</span>
              <span className="text-gray-400">•</span>
              <span className="font-bold text-gray-800">Lachlan McGuire</span>
              <span className="text-lg font-bold text-amber-600">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}