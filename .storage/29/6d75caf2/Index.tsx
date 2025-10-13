import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Mountain,
  Droplets,
  Layers,
  Calculator,
  FileText,
  Sparkles,
  Navigation,
  Map
} from 'lucide-react';
import RiskDashboard from '@/components/RiskDashboard';
import EnhancedPDFExport from '@/components/EnhancedPDFExport';
import AdvancedRiskSimulation from '@/components/AdvancedRiskSimulation';
import { calculateLandslideRisk } from '@/lib/riskCalculator';
import { getGeologicalData, PRESET_LOCATIONS } from '@/lib/geoData';

// Veredas reales de San Pedro de los Milagros
const VEREDAS = [
  'Vereda La Clarita', 'Vereda La Cuchilla', 'Vereda La Empalizada', 
  'Vereda Llano de Ovejas', 'Vereda El Carmelo', 'Vereda San Antonio', 
  'Vereda Pantanillo', 'Centro Urbano'
];

interface RiskData {
  coordinates: { lat: number; lng: number };
  vereda: string;
  landslideRisk: number;
  collapseRisk: number;
  overallRisk: number;
  riskLevel: string;
  elevation: number;
  slope: number;
  soilType: string;
  precipitation: number;
  recommendations: string[];
}

const Index = () => {
  const [analysisMode, setAnalysisMode] = useState<'coordinates' | 'vereda'>('coordinates');
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [selectedVereda, setSelectedVereda] = useState('');
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalysis = async () => {
    let lat: number, lng: number, veredaName: string;

    if (analysisMode === 'coordinates') {
      lat = parseFloat(coordinates.lat);
      lng = parseFloat(coordinates.lng);
      
      if (isNaN(lat) || isNaN(lng) || !selectedVereda) {
        alert('Por favor, ingresa coordenadas válidas y selecciona una vereda');
        return;
      }
      veredaName = selectedVereda;
    } else {
      if (!selectedVereda) {
        alert('Por favor, selecciona una vereda');
        return;
      }
      
      // Buscar coordenadas de la vereda seleccionada
      const veredaLocation = PRESET_LOCATIONS.find(location => location.name === selectedVereda);
      if (!veredaLocation) {
        alert('Vereda no encontrada');
        return;
      }
      
      lat = veredaLocation.lat;
      lng = veredaLocation.lng;
      veredaName = selectedVereda;
    }

    setIsAnalyzing(true);
    
    // Simular tiempo de análisis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      console.log('Iniciando análisis con:', { lat, lng, veredaName });
      
      const geoData = getGeologicalData(lat, lng, veredaName);
      console.log('Datos geológicos:', geoData);
      
      const riskAnalysis = calculateLandslideRisk(geoData);
      console.log('Análisis de riesgo:', riskAnalysis);
      
      // Calcular riesgo de colapso basado en factores geológicos
      const collapseRisk = Math.min(100, Math.max(0, 
        (geoData.slope * 1.2) + 
        ((geoData.precipitation - 1500) / 30) + 
        (geoData.elevation > 2300 ? 15 : 5) +
        Math.random() * 10
      ));
      
      // El riesgo general es el promedio ponderado
      const overallRisk = (riskAnalysis.overallRisk * 0.6) + (collapseRisk * 0.4);
      
      // Determinar nivel de riesgo
      let riskLevel = 'Bajo';
      if (overallRisk >= 70) riskLevel = 'Muy Alto';
      else if (overallRisk >= 50) riskLevel = 'Alto';
      else if (overallRisk >= 30) riskLevel = 'Medio';
      
      const newRiskData: RiskData = {
        coordinates: { lat, lng },
        vereda: veredaName,
        landslideRisk: riskAnalysis.overallRisk, // Usar overallRisk de la función
        collapseRisk: Math.round(collapseRisk),
        overallRisk: Math.round(overallRisk),
        riskLevel: riskLevel,
        elevation: geoData.elevation,
        slope: geoData.slope,
        soilType: geoData.soilType,
        precipitation: geoData.precipitation,
        recommendations: riskAnalysis.recommendations
      };
      
      console.log('Datos de riesgo finales:', newRiskData);
      setRiskData(newRiskData);
      setActiveTab('results');
    } catch (error) {
      console.error('Error en el análisis:', error);
      alert('Error al realizar el análisis. Por favor, intenta nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 70) return { level: 'Muy Alto', color: 'bg-red-500', textColor: 'text-red-600' };
    if (risk >= 50) return { level: 'Alto', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (risk >= 30) return { level: 'Medio', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { level: 'Bajo', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const handleVeredaSelect = (vereda: string) => {
    setSelectedVereda(vereda);
    if (analysisMode === 'vereda') {
      const veredaLocation = PRESET_LOCATIONS.find(location => location.name === vereda);
      if (veredaLocation) {
        setCoordinates({
          lat: veredaLocation.lat.toString(),
          lng: veredaLocation.lng.toString()
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Mountain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Análisis de Riesgo Geológico
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Sistema avanzado para evaluación de riesgos de deslizamiento y colapso en San Pedro de los Milagros, Antioquia
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Sparkles className="w-4 h-4 mr-1" />
                IA Avanzada
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <FileText className="w-4 h-4 mr-1" />
                Reportes PDF
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <TrendingUp className="w-4 h-4 mr-1" />
                Análisis en Tiempo Real
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Análisis
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Simulación
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Exportar
            </TabsTrigger>
          </TabsList>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Configuración del Análisis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Modalidad de Análisis</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        analysisMode === 'coordinates' 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setAnalysisMode('coordinates')}
                    >
                      <CardContent className="p-4 text-center">
                        <Navigation className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">Por Coordenadas</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ingresa coordenadas específicas para análisis personalizado
                        </p>
                      </CardContent>
                    </Card>

                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        analysisMode === 'vereda' 
                          ? 'ring-2 ring-green-500 bg-green-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setAnalysisMode('vereda')}
                    >
                      <CardContent className="p-4 text-center">
                        <Map className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold">Por Vereda</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Selecciona una vereda predefinida del municipio
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Analysis Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vereda" className="text-base font-medium">
                        {analysisMode === 'coordinates' ? 'Vereda de Referencia' : 'Seleccionar Vereda'}
                      </Label>
                      <Select value={selectedVereda} onValueChange={handleVeredaSelect}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Elige una vereda..." />
                        </SelectTrigger>
                        <SelectContent>
                          {VEREDAS.map((vereda) => (
                            <SelectItem key={vereda} value={vereda}>
                              {vereda}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {analysisMode === 'vereda' && selectedVereda && (
                        <p className="text-sm text-gray-500 mt-1">
                          {PRESET_LOCATIONS.find(loc => loc.name === selectedVereda)?.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {analysisMode === 'coordinates' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lat" className="text-base font-medium">Latitud</Label>
                        <Input
                          id="lat"
                          type="number"
                          step="0.000001"
                          placeholder="6.4625"
                          value={coordinates.lat}
                          onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lng" className="text-base font-medium">Longitud</Label>
                        <Input
                          id="lng"
                          type="number"
                          step="0.000001"
                          placeholder="-75.5522"
                          value={coordinates.lng}
                          onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {analysisMode === 'vereda' && selectedVereda && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Coordenadas Automáticas</h4>
                        <div className="text-sm text-green-700">
                          <p>Latitud: {coordinates.lat}</p>
                          <p>Longitud: {coordinates.lng}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || !selectedVereda || (analysisMode === 'coordinates' && (!coordinates.lat || !coordinates.lng))}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Search className="w-5 h-5 mr-2 animate-spin" />
                      Analizando riesgos geológicos...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Iniciar Análisis de Riesgo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {riskData ? (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Elevación</p>
                          <p className="text-2xl font-bold">{riskData.elevation}m</p>
                        </div>
                        <Mountain className="w-8 h-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Pendiente</p>
                          <p className="text-2xl font-bold">{riskData.slope}°</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Precipitación</p>
                          <p className="text-2xl font-bold">{riskData.precipitation}mm</p>
                        </div>
                        <Droplets className="w-8 h-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Tipo de Suelo</p>
                          <p className="text-lg font-bold">{riskData.soilType}</p>
                        </div>
                        <Layers className="w-8 h-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Analysis Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">Riesgo de Deslizamiento</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getRiskLevel(riskData.landslideRisk).textColor}`}>
                        {riskData.landslideRisk}%
                      </div>
                      <Badge className={getRiskLevel(riskData.landslideRisk).color + ' text-white'}>
                        {getRiskLevel(riskData.landslideRisk).level}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">Riesgo de Colapso</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getRiskLevel(riskData.collapseRisk).textColor}`}>
                        {riskData.collapseRisk}%
                      </div>
                      <Badge className={getRiskLevel(riskData.collapseRisk).color + ' text-white'}>
                        {getRiskLevel(riskData.collapseRisk).level}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">Riesgo General</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getRiskLevel(riskData.overallRisk).textColor}`}>
                        {riskData.overallRisk}%
                      </div>
                      <Badge className={getRiskLevel(riskData.overallRisk).color + ' text-white'}>
                        {getRiskLevel(riskData.overallRisk).level}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>

                <RiskDashboard riskData={riskData} />
              </>
            ) : (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No hay datos de análisis
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Realiza un análisis de riesgo primero para ver los resultados
                  </p>
                  <Button 
                    onClick={() => setActiveTab('analysis')}
                    variant="outline"
                  >
                    Ir a Análisis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation">
            {riskData ? (
              <AdvancedRiskSimulation riskData={riskData} />
            ) : (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Layers className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Simulación no disponible
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Realiza un análisis de riesgo primero para usar la simulación
                  </p>
                  <Button 
                    onClick={() => setActiveTab('analysis')}
                    variant="outline"
                  >
                    Ir a Análisis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            {riskData ? (
              <EnhancedPDFExport riskData={riskData} />
            ) : (
              <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Exportación no disponible
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Realiza un análisis de riesgo primero para exportar el reporte
                  </p>
                  <Button 
                    onClick={() => setActiveTab('analysis')}
                    variant="outline"
                  >
                    Ir a Análisis
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;