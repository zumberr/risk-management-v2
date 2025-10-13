import React, { useState, useEffect } from 'react';
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
  Sparkles
} from 'lucide-react';
import RiskDashboard from '@/components/RiskDashboard';
import EnhancedPDFExport from '@/components/EnhancedPDFExport';
import AdvancedRiskSimulation from '@/components/AdvancedRiskSimulation';
import { calculateRisk } from '@/lib/riskCalculator';
import { getGeoData } from '@/lib/geoData';

// Veredas reales de San Pedro de los Milagros
const VEREDAS = [
  'El Tabor', 'La Madera', 'San José', 'El Carmelo', 'La Floresta',
  'El Progreso', 'La Esperanza', 'San Antonio', 'El Rosal', 'La Pradera',
  'Monte Verde', 'El Mirador', 'La Colina', 'San Rafael', 'El Valle'
];

interface RiskData {
  coordinates: { lat: number; lng: number };
  vereda: string;
  landslideRisk: number;
  collapseRisk: number;
  elevation: number;
  slope: number;
  soilType: string;
  precipitation: number;
  riskFactors: string[];
}

const Index = () => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [selectedVereda, setSelectedVereda] = useState('');
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalysis = async () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    
    if (isNaN(lat) || isNaN(lng) || !selectedVereda) {
      alert('Por favor, ingresa coordenadas válidas y selecciona una vereda');
      return;
    }

    setIsAnalyzing(true);
    
    // Simular tiempo de análisis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const geoData = getGeoData(lat, lng);
    const risks = calculateRisk(geoData);
    
    const newRiskData: RiskData = {
      coordinates: { lat, lng },
      vereda: selectedVereda,
      landslideRisk: risks.landslideRisk,
      collapseRisk: risks.collapseRisk,
      elevation: geoData.elevation,
      slope: geoData.slope,
      soilType: geoData.soilType,
      precipitation: geoData.precipitation,
      riskFactors: risks.riskFactors
    };
    
    setRiskData(newRiskData);
    setIsAnalyzing(false);
    setActiveTab('results');
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 70) return { level: 'Muy Alto', color: 'bg-red-500', textColor: 'text-red-600' };
    if (risk >= 50) return { level: 'Alto', color: 'bg-orange-500', textColor: 'text-orange-600' };
    if (risk >= 30) return { level: 'Medio', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    return { level: 'Bajo', color: 'bg-green-500', textColor: 'text-green-600' };
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vereda" className="text-base font-medium">Seleccionar Vereda</Label>
                      <Select value={selectedVereda} onValueChange={setSelectedVereda}>
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
                    </div>
                  </div>
                  
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
                </div>

                <Separator />

                <Button 
                  onClick={handleAnalysis}
                  disabled={isAnalyzing}
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
                          <p className="text-2xl font-bold">{riskData.elevation.toFixed(0)}m</p>
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
                          <p className="text-2xl font-bold">{riskData.slope.toFixed(1)}°</p>
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
                          <p className="text-2xl font-bold">{riskData.precipitation.toFixed(0)}mm</p>
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
            <AdvancedRiskSimulation riskData={riskData} />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <EnhancedPDFExport riskData={riskData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;