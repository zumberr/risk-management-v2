import { useState } from 'react';
import CoordinateInput from '@/components/CoordinateInput';
import MapViewer from '@/components/MapViewer';
import RiskDashboard from '@/components/RiskDashboard';
import { getGeologicalData, GeologicalData } from '@/lib/geoData';
import { calculateLandslideRisk, RiskAnalysis } from '@/lib/riskCalculator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mountain, Shield, AlertTriangle, Info, TreePine, Award } from 'lucide-react';

export default function Index() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number; veredaName?: string } | null>(null);
  const [geologicalData, setGeologicalData] = useState<GeologicalData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCoordinatesSubmit = async (lat: number, lng: number, veredaName?: string) => {
    setLoading(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const geoData = getGeologicalData(lat, lng, veredaName);
      const risk = calculateLandslideRisk(geoData);
      
      setCoordinates({ lat, lng, veredaName });
      setGeologicalData(geoData);
      setRiskAssessment(risk);
    } catch (error) {
      console.error('Error processing coordinates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mountain className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Análisis de Riesgo Geológico
                </h1>
                <p className="text-sm text-gray-600">
                  San Pedro de los Milagros, Antioquia • Proyecto Municipal 2025
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Proyecto Más Innovador</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!coordinates ? (
          /* Welcome Screen */
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <TreePine className="h-4 w-4" />
                Veredas Oficiales 2025
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Análisis de Riesgo por Veredas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sistema avanzado para evaluar el riesgo de deslizamientos en las veredas oficiales 
                de San Pedro de los Milagros, incluyendo el Corregimiento de Llano de Ovejas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Análisis Científico</h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluación basada en datos geológicos reales y formaciones del terreno
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Prevención de Riesgos</h3>
                  <p className="text-sm text-muted-foreground">
                    Identificación temprana de zonas vulnerables a deslizamientos
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Recomendaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    Medidas específicas de mitigación para cada vereda
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <CoordinateInput onCoordinatesSubmit={handleCoordinatesSubmit} loading={loading} />
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MapViewer lat={coordinates.lat} lng={coordinates.lng} />
              {geologicalData && riskAssessment && (
                <RiskDashboard
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  veredaName={coordinates.veredaName || 'Ubicación seleccionada'}
                  geologicalData={geologicalData}
                  riskAssessment={riskAssessment}
                />
              )}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => {
                  setCoordinates(null);
                  setGeologicalData(null);
                  setRiskAssessment(null);
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Analizar Nueva Vereda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}