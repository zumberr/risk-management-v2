import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, RotateCcw, TrendingUp, TrendingDown, Minus, Calendar, Zap, TreePine, Home, DollarSign } from 'lucide-react';
import { GeologicalData } from '@/lib/geoData';
import { calculateRisk } from '@/lib/riskCalculator';

interface AdvancedRiskSimulationProps {
  originalData: GeologicalData;
  veredaName: string;
}

interface SimulationData extends GeologicalData {
  soilSaturation: number;
  vegetationCover: number;
  humanActivity: number;
  populationDensity: number;
  infrastructureVulnerability: number;
  drainageQuality: number;
}

interface SeasonalData {
  month: string;
  precipitation: number;
  temperature: number;
  riskMultiplier: number;
}

export default function AdvancedRiskSimulation({ originalData, veredaName }: AdvancedRiskSimulationProps) {
  const [simulatedData, setSimulatedData] = useState<SimulationData>({
    ...originalData,
    soilSaturation: 50,
    vegetationCover: 70,
    humanActivity: 40,
    populationDensity: 30,
    infrastructureVulnerability: 45,
    drainageQuality: 60
  });
  
  const [originalRisk, setOriginalRisk] = useState(0);
  const [simulatedRisk, setSimulatedRisk] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedSeason, setSelectedSeason] = useState<string>('actual');
  const [economicImpact, setEconomicImpact] = useState(0);

  const seasonalData: SeasonalData[] = [
    { month: 'Enero', precipitation: 80, temperature: 22, riskMultiplier: 0.7 },
    { month: 'Febrero', precipitation: 90, temperature: 23, riskMultiplier: 0.7 },
    { month: 'Marzo', precipitation: 120, temperature: 24, riskMultiplier: 0.8 },
    { month: 'Abril', precipitation: 180, temperature: 23, riskMultiplier: 1.0 },
    { month: 'Mayo', precipitation: 220, temperature: 22, riskMultiplier: 1.2 },
    { month: 'Junio', precipitation: 160, temperature: 21, riskMultiplier: 1.0 },
    { month: 'Julio', precipitation: 140, temperature: 21, riskMultiplier: 0.9 },
    { month: 'Agosto', precipitation: 150, temperature: 22, riskMultiplier: 0.9 },
    { month: 'Septiembre', precipitation: 190, temperature: 22, riskMultiplier: 1.1 },
    { month: 'Octubre', precipitation: 240, temperature: 22, riskMultiplier: 1.3 },
    { month: 'Noviembre', precipitation: 200, temperature: 22, riskMultiplier: 1.2 },
    { month: 'Diciembre', precipitation: 120, temperature: 22, riskMultiplier: 0.8 }
  ];

  const calculateAdvancedRisk = (data: SimulationData, seasonal: boolean = false): number => {
    const baseRisk = calculateRisk(data);
    let adjustedRisk = baseRisk.percentage;

    // Soil saturation factor
    const saturationFactor = (data.soilSaturation / 100) * 0.3;
    adjustedRisk += saturationFactor * 30;

    // Vegetation cover factor (more vegetation = less risk)
    const vegetationFactor = (1 - data.vegetationCover / 100) * 0.25;
    adjustedRisk += vegetationFactor * 25;

    // Human activity factor
    const activityFactor = (data.humanActivity / 100) * 0.2;
    adjustedRisk += activityFactor * 20;

    // Infrastructure vulnerability
    const infraFactor = (data.infrastructureVulnerability / 100) * 0.15;
    adjustedRisk += infraFactor * 15;

    // Drainage quality (better drainage = less risk)
    const drainageFactor = (1 - data.drainageQuality / 100) * 0.2;
    adjustedRisk += drainageFactor * 20;

    // Population density factor
    const populationFactor = (data.populationDensity / 100) * 0.1;
    adjustedRisk += populationFactor * 10;

    // Seasonal adjustment
    if (seasonal && selectedSeason !== 'actual') {
      const seasonData = seasonalData.find(s => s.month === selectedSeason);
      if (seasonData) {
        adjustedRisk *= seasonData.riskMultiplier;
      }
    }

    return Math.min(Math.max(adjustedRisk, 0), 100);
  };

  useEffect(() => {
    if (originalData && originalData.slope !== undefined) {
      const origRisk = calculateRisk(originalData);
      setOriginalRisk(origRisk.percentage);
    }
  }, [originalData]);

  useEffect(() => {
    if (simulatedData && simulatedData.slope !== undefined) {
      const simRisk = calculateAdvancedRisk(simulatedData, selectedSeason !== 'actual');
      setSimulatedRisk(simRisk);
      
      // Calculate economic impact (simplified model)
      const riskDiff = simRisk - originalRisk;
      const baseEconomicValue = 150000000; // 150M COP estimated value
      const impactPercentage = riskDiff * 0.02; // 2% impact per risk point
      setEconomicImpact(baseEconomicValue * impactPercentage);
    }
  }, [simulatedData, selectedSeason, originalRisk]);

  const applyScenario = (scenario: string) => {
    setSelectedScenario(scenario);
    
    switch (scenario) {
      case 'sequia':
        setSimulatedData({
          ...simulatedData,
          precipitation: originalData.precipitation * 0.6,
          soilSaturation: 20,
          vegetationCover: 40,
          humanActivity: 60
        });
        break;
      case 'lluvias':
        setSimulatedData({
          ...simulatedData,
          precipitation: originalData.precipitation * 1.8,
          soilSaturation: 90,
          vegetationCover: 85,
          humanActivity: 30
        });
        break;
      case 'deforestacion':
        setSimulatedData({
          ...simulatedData,
          vegetationCover: 20,
          humanActivity: 80,
          soilSaturation: 70,
          drainageQuality: 30
        });
        break;
      case 'urbanizacion':
        setSimulatedData({
          ...simulatedData,
          humanActivity: 85,
          populationDensity: 80,
          infrastructureVulnerability: 70,
          drainageQuality: 40,
          vegetationCover: 30
        });
        break;
      case 'mejoras':
        setSimulatedData({
          ...simulatedData,
          drainageQuality: 90,
          vegetationCover: 85,
          infrastructureVulnerability: 20,
          humanActivity: 25
        });
        break;
      default:
        resetSimulation();
    }
  };

  const resetSimulation = () => {
    setSimulatedData({
      ...originalData,
      soilSaturation: 50,
      vegetationCover: 70,
      humanActivity: 40,
      populationDensity: 30,
      infrastructureVulnerability: 45,
      drainageQuality: 60
    });
    setSelectedScenario('');
    setSelectedSeason('actual');
  };

  const getRiskLevelColor = (percentage: number) => {
    if (percentage < 30) return 'bg-green-500';
    if (percentage < 60) return 'bg-yellow-500';
    if (percentage < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskLevelText = (percentage: number) => {
    if (percentage < 30) return 'BAJO';
    if (percentage < 60) return 'MEDIO';
    if (percentage < 80) return 'ALTO';
    return 'CRÍTICO';
  };

  const getRiskChangeIcon = () => {
    const diff = simulatedRisk - originalRisk;
    if (Math.abs(diff) < 2) return <Minus className="h-4 w-4" />;
    return diff > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getRiskChangeColor = () => {
    const diff = simulatedRisk - originalRisk;
    if (Math.abs(diff) < 2) return 'text-gray-500';
    return diff > 0 ? 'text-red-500' : 'text-green-500';
  };

  if (!originalData || originalData.slope === undefined) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Simulación Avanzada de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-muted-foreground">Cargando datos geológicos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          Simulación Avanzada de Escenarios de Riesgo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análisis multifactorial del riesgo de deslizamiento en {veredaName} con variables ambientales, sociales y económicas
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Factores Básicos</TabsTrigger>
            <TabsTrigger value="advanced">Factores Avanzados</TabsTrigger>
            <TabsTrigger value="seasonal">Análisis Estacional</TabsTrigger>
            <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* Risk Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Riesgo Original</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getRiskLevelColor(originalRisk)}`}>
                  {originalRisk.toFixed(1)}% - {getRiskLevelText(originalRisk)}
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Riesgo Simulado</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getRiskLevelColor(simulatedRisk)}`}>
                  {simulatedRisk.toFixed(1)}% - {getRiskLevelText(simulatedRisk)}
                </div>
                <div className={`flex items-center justify-center gap-1 mt-2 text-sm ${getRiskChangeColor()}`}>
                  {getRiskChangeIcon()}
                  {Math.abs(simulatedRisk - originalRisk).toFixed(1)}% cambio
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Impacto Económico</h3>
                <div className="text-lg font-bold text-green-700">
                  {economicImpact >= 0 ? '+' : ''}{(economicImpact / 1000000).toFixed(1)}M COP
                </div>
                <p className="text-xs text-muted-foreground">Estimado anual</p>
              </div>
            </div>

            <Separator />

            {/* Basic Controls */}
            <div className="space-y-6">
              {/* Precipitation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Precipitación Anual (mm)</Label>
                  <Badge variant="outline">{simulatedData.precipitation || 0} mm</Badge>
                </div>
                <Slider
                  value={[simulatedData.precipitation || 1800]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, precipitation: value[0]})}
                  min={800}
                  max={3500}
                  step={50}
                  className="w-full"
                />
              </div>

              {/* Slope */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Pendiente del Terreno (°)</Label>
                  <Badge variant="outline">{simulatedData.slope || 0}°</Badge>
                </div>
                <Slider
                  value={[simulatedData.slope || 15]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, slope: value[0]})}
                  min={0}
                  max={45}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Elevation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Elevación (m.s.n.m.)</Label>
                  <Badge variant="outline">{simulatedData.elevation || 0} m</Badge>
                </div>
                <Slider
                  value={[simulatedData.elevation || 2200]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, elevation: value[0]})}
                  min={2000}
                  max={2600}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-6">
              {/* Soil Saturation */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Saturación del Suelo (%)</Label>
                  <Badge variant="outline">{simulatedData.soilSaturation}%</Badge>
                </div>
                <Slider
                  value={[simulatedData.soilSaturation]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, soilSaturation: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  💧 Mayor saturación aumenta la inestabilidad del suelo
                </p>
              </div>

              {/* Vegetation Cover */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Cobertura Vegetal (%)</Label>
                  <Badge variant="outline">{simulatedData.vegetationCover}%</Badge>
                </div>
                <Slider
                  value={[simulatedData.vegetationCover]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, vegetationCover: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  🌳 Mayor cobertura vegetal estabiliza el suelo y reduce el riesgo
                </p>
              </div>

              {/* Human Activity */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Actividad Humana (%)</Label>
                  <Badge variant="outline">{simulatedData.humanActivity}%</Badge>
                </div>
                <Slider
                  value={[simulatedData.humanActivity]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, humanActivity: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  🏗️ Construcciones y modificaciones del terreno aumentan el riesgo
                </p>
              </div>

              {/* Drainage Quality */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Calidad del Drenaje (%)</Label>
                  <Badge variant="outline">{simulatedData.drainageQuality}%</Badge>
                </div>
                <Slider
                  value={[simulatedData.drainageQuality]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, drainageQuality: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  🚰 Mejor drenaje reduce significativamente el riesgo de deslizamiento
                </p>
              </div>

              {/* Infrastructure Vulnerability */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Vulnerabilidad de Infraestructura (%)</Label>
                  <Badge variant="outline">{simulatedData.infrastructureVulnerability}%</Badge>
                </div>
                <Slider
                  value={[simulatedData.infrastructureVulnerability]}
                  onValueChange={(value) => setSimulatedData({...simulatedData, infrastructureVulnerability: value[0]})}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  🏠 Infraestructura vulnerable aumenta el impacto potencial
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Análisis Estacional</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Seleccionar Mes</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actual">Condiciones Actuales</SelectItem>
                    {seasonalData.map((season) => (
                      <SelectItem key={season.month} value={season.month}>
                        {season.month} - {season.precipitation}mm
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSeason !== 'actual' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Condiciones de {selectedSeason}</h4>
                  {(() => {
                    const seasonData = seasonalData.find(s => s.month === selectedSeason);
                    return seasonData ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Precipitación:</strong> {seasonData.precipitation}mm</p>
                          <p><strong>Temperatura:</strong> {seasonData.temperature}°C</p>
                        </div>
                        <div>
                          <p><strong>Factor de riesgo:</strong> {seasonData.riskMultiplier}x</p>
                          <p><strong>Riesgo ajustado:</strong> {(simulatedRisk * seasonData.riskMultiplier).toFixed(1)}%</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Seasonal risk chart (text-based) */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Variación Anual del Riesgo</h4>
                <div className="space-y-2">
                  {seasonalData.map((season, index) => {
                    const monthRisk = simulatedRisk * season.riskMultiplier;
                    const barWidth = (monthRisk / 100) * 100;
                    return (
                      <div key={season.month} className="flex items-center gap-2">
                        <div className="w-16 text-xs">{season.month}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                          <div 
                            className={`h-4 rounded-full ${getRiskLevelColor(monthRisk).replace('bg-', 'bg-')}`}
                            style={{ width: `${Math.min(barWidth, 100)}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-xs text-right">{monthRisk.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Escenarios Predefinidos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={selectedScenario === 'sequia' ? 'default' : 'outline'}
                  onClick={() => applyScenario('sequia')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Período de Sequía</span>
                  </div>
                  <p className="text-xs text-left">Precipitación reducida 40%, baja saturación del suelo</p>
                </Button>

                <Button
                  variant={selectedScenario === 'lluvias' ? 'default' : 'outline'}
                  onClick={() => applyScenario('lluvias')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Temporada Intensa de Lluvias</span>
                  </div>
                  <p className="text-xs text-left">Precipitación aumentada 80%, alta saturación</p>
                </Button>

                <Button
                  variant={selectedScenario === 'deforestacion' ? 'default' : 'outline'}
                  onClick={() => applyScenario('deforestacion')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Impacto de Deforestación</span>
                  </div>
                  <p className="text-xs text-left">Cobertura vegetal reducida, mayor actividad humana</p>
                </Button>

                <Button
                  variant={selectedScenario === 'urbanizacion' ? 'default' : 'outline'}
                  onClick={() => applyScenario('urbanizacion')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-3 h-3" />
                    <span className="font-medium">Desarrollo Urbano</span>
                  </div>
                  <p className="text-xs text-left">Mayor densidad poblacional e infraestructura</p>
                </Button>

                <Button
                  variant={selectedScenario === 'mejoras' ? 'default' : 'outline'}
                  onClick={() => applyScenario('mejoras')}
                  className="h-auto p-4 flex flex-col items-start"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TreePine className="w-3 h-3 text-green-500" />
                    <span className="font-medium">Medidas de Mitigación</span>
                  </div>
                  <p className="text-xs text-left">Mejor drenaje, reforestación, infraestructura mejorada</p>
                </Button>

                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">Análisis de costo-beneficio disponible para cada escenario</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Scenario Analysis */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Análisis del Escenario Actual</h3>
          
          {simulatedRisk > originalRisk + 5 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Riesgo Aumentado:</strong> Las condiciones simuladas incrementan el riesgo en {(simulatedRisk - originalRisk).toFixed(1)} puntos porcentuales. 
                Impacto económico estimado: {economicImpact > 0 ? '+' : ''}{(economicImpact / 1000000).toFixed(1)}M COP anuales.
              </p>
            </div>
          )}
          
          {simulatedRisk < originalRisk - 5 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ <strong>Riesgo Reducido:</strong> Las condiciones simuladas disminuyen el riesgo en {(originalRisk - simulatedRisk).toFixed(1)} puntos porcentuales. 
                Beneficio económico estimado: {(Math.abs(economicImpact) / 1000000).toFixed(1)}M COP anuales.
              </p>
            </div>
          )}

          {Math.abs(simulatedRisk - originalRisk) <= 5 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ℹ️ <strong>Riesgo Similar:</strong> Los cambios simulados tienen un impacto mínimo en el riesgo general. 
                Variación económica: {(Math.abs(economicImpact) / 1000000).toFixed(1)}M COP anuales.
              </p>
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button 
          onClick={resetSimulation}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar Condiciones Originales
        </Button>
      </CardContent>
    </Card>
  );
}