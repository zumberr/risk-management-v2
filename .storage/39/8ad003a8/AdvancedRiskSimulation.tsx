import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  Droplets, 
  Mountain,
  AlertTriangle
} from 'lucide-react';

interface AdvancedRiskSimulationProps {
  riskData: {
    landslideRisk: number;
    collapseRisk: number;
    overallRisk: number;
    elevation: number;
    slope: number;
    precipitation: number;
    vereda: string;
  };
}

const AdvancedRiskSimulation: React.FC<AdvancedRiskSimulationProps> = ({ riskData }) => {
  const [simulationParams, setSimulationParams] = useState({
    slope: riskData.slope,
    precipitation: riskData.precipitation,
    vegetation: 50, // Porcentaje de cobertura vegetal
    drainage: 50,   // Calidad del drenaje
  });

  const [simulatedRisks, setSimulatedRisks] = useState({
    landslide: riskData.landslideRisk,
    collapse: riskData.collapseRisk,
    overall: riskData.overallRisk
  });

  const [isSimulating, setIsSimulating] = useState(false);

  const calculateSimulatedRisk = async () => {
    setIsSimulating(true);
    
    // Simular tiempo de cálculo
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Algoritmo simplificado de simulación de riesgo
    const slopeRisk = Math.min(100, simulationParams.slope * 2.5);
    const precipitationRisk = Math.min(100, Math.max(0, (simulationParams.precipitation - 1000) / 20));
    const vegetationFactor = (100 - simulationParams.vegetation) / 100;
    const drainageFactor = (100 - simulationParams.drainage) / 100;
    
    const baseLandslideRisk = (slopeRisk + precipitationRisk) / 2;
    const adjustedLandslideRisk = baseLandslideRisk * (1 + vegetationFactor * 0.5 + drainageFactor * 0.3);
    
    const baseCollapseRisk = (slopeRisk * 0.8 + precipitationRisk * 0.6) / 2;
    const adjustedCollapseRisk = baseCollapseRisk * (1 + vegetationFactor * 0.3 + drainageFactor * 0.4);
    
    const overallRisk = (adjustedLandslideRisk + adjustedCollapseRisk) / 2;
    
    setSimulatedRisks({
      landslide: Math.min(100, Math.max(0, Math.round(adjustedLandslideRisk))),
      collapse: Math.min(100, Math.max(0, Math.round(adjustedCollapseRisk))),
      overall: Math.min(100, Math.max(0, Math.round(overallRisk)))
    });
    
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setSimulationParams({
      slope: riskData.slope,
      precipitation: riskData.precipitation,
      vegetation: 50,
      drainage: 50,
    });
    setSimulatedRisks({
      landslide: riskData.landslideRisk,
      collapse: riskData.collapseRisk,
      overall: riskData.overallRisk
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (risk < 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskChange = (original: number, simulated: number) => {
    const change = simulated - original;
    if (Math.abs(change) < 1) return { text: 'Sin cambio', color: 'text-gray-500' };
    if (change > 0) return { text: `+${change}%`, color: 'text-red-600' };
    return { text: `${change}%`, color: 'text-green-600' };
  };

  const getProgressBarColor = (risk: number) => {
    if (risk < 30) return 'bg-green-500';
    if (risk < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Simulación Avanzada de Riesgos</CardTitle>
              <p className="text-purple-100">
                Modifica los parámetros para ver cómo afectan los niveles de riesgo
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {riskData.vereda}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Parámetros Geológicos
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Mountain className="w-4 h-4" />
                  Pendiente: {simulationParams.slope.toFixed(1)}°
                </Label>
                <Slider
                  value={[simulationParams.slope]}
                  onValueChange={(value) => setSimulationParams({...simulationParams, slope: value[0]})}
                  max={45}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>45°</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Droplets className="w-4 h-4" />
                  Precipitación: {simulationParams.precipitation.toFixed(0)} mm/año
                </Label>
                <Slider
                  value={[simulationParams.precipitation]}
                  onValueChange={(value) => setSimulationParams({...simulationParams, precipitation: value[0]})}
                  max={3000}
                  min={500}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>500mm</span>
                  <span>3000mm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-green-600" />
              Factores de Mitigación
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  🌱 Cobertura Vegetal: {simulationParams.vegetation}%
                </Label>
                <Slider
                  value={[simulationParams.vegetation]}
                  onValueChange={(value) => setSimulationParams({...simulationParams, vegetation: value[0]})}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  🚰 Calidad del Drenaje: {simulationParams.drainage}%
                </Label>
                <Slider
                  value={[simulationParams.drainage]}
                  onValueChange={(value) => setSimulationParams({...simulationParams, drainage: value[0]})}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Control Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={calculateSimulatedRisk}
            disabled={isSimulating}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isSimulating ? (
              <>
                <Settings className="w-4 h-4 mr-2 animate-spin" />
                Calculando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Ejecutar Simulación
              </>
            )}
          </Button>
          
          <Button 
            onClick={resetSimulation}
            variant="outline"
            disabled={isSimulating}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetear
          </Button>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Resultados de la Simulación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`border-2 ${getRiskColor(simulatedRisks.landslide)}`}>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Riesgo de Deslizamiento</p>
                  <p className="text-3xl font-bold">{simulatedRisks.landslide}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(simulatedRisks.landslide)}`}
                      style={{ width: `${Math.min(simulatedRisks.landslide, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Original: {riskData.landslideRisk}%</span>
                    <span className={getRiskChange(riskData.landslideRisk, simulatedRisks.landslide).color}>
                      {getRiskChange(riskData.landslideRisk, simulatedRisks.landslide).text}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${getRiskColor(simulatedRisks.collapse)}`}>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Riesgo de Colapso</p>
                  <p className="text-3xl font-bold">{simulatedRisks.collapse}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(simulatedRisks.collapse)}`}
                      style={{ width: `${Math.min(simulatedRisks.collapse, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Original: {riskData.collapseRisk}%</span>
                    <span className={getRiskChange(riskData.collapseRisk, simulatedRisks.collapse).color}>
                      {getRiskChange(riskData.collapseRisk, simulatedRisks.collapse).text}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${getRiskColor(simulatedRisks.overall)}`}>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Riesgo General</p>
                  <p className="text-3xl font-bold">{simulatedRisks.overall}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(simulatedRisks.overall)}`}
                      style={{ width: `${Math.min(simulatedRisks.overall, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span>Original: {riskData.overallRisk}%</span>
                    <span className={getRiskChange(riskData.overallRisk, simulatedRisks.overall).color}>
                      {getRiskChange(riskData.overallRisk, simulatedRisks.overall).text}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations based on simulation */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Recomendaciones de la Simulación</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {simulationParams.vegetation < 70 && (
              <li>• Incrementar la cobertura vegetal puede reducir significativamente el riesgo</li>
            )}
            {simulationParams.drainage < 60 && (
              <li>• Mejorar el sistema de drenaje es crucial para la mitigación de riesgos</li>
            )}
            {simulationParams.slope > 25 && (
              <li>• La pendiente alta requiere medidas especiales de estabilización</li>
            )}
            {simulationParams.precipitation > 2000 && (
              <li>• La alta precipitación requiere sistemas de drenaje robustos</li>
            )}
            {simulationParams.vegetation >= 70 && simulationParams.drainage >= 60 && (
              <li>• Excelente configuración de mitigación - riesgo minimizado efectivamente</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedRiskSimulation;