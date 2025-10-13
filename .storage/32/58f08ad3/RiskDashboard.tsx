import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Mountain, Droplets, TreePine, Users, Activity } from 'lucide-react';
import { GeologicalData, getVeredaInfo } from '@/lib/geoData';
import { RiskAnalysis, calculateRisk } from '@/lib/riskCalculator';
import EnhancedPDFExport from './EnhancedPDFExport';
import AdvancedRiskSimulation from './AdvancedRiskSimulation';

interface RiskDashboardProps {
  lat: number;
  lng: number;
  veredaName: string;
  geologicalData: GeologicalData;
  riskAssessment: RiskAnalysis;
}

export default function RiskDashboard({ 
  lat, 
  lng, 
  veredaName, 
  geologicalData, 
  riskAssessment 
}: RiskDashboardProps) {
  const veredaInfo = getVeredaInfo(veredaName);
  
  // Convert RiskAnalysis to RiskAssessment format for PDF export
  const riskForPDF = calculateRisk(geologicalData);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'muy bajo': return 'bg-green-500';
      case 'bajo': return 'bg-green-400';
      case 'medio': return 'bg-yellow-500';
      case 'alto': return 'bg-orange-500';
      case 'muy alto': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFactorIcon = (factor: string) => {
    if (factor.includes('pendiente') || factor.includes('terreno')) return <Mountain className="h-4 w-4" />;
    if (factor.includes('agua') || factor.includes('lluvia')) return <Droplets className="h-4 w-4" />;
    if (factor.includes('vegetal') || factor.includes('forestal')) return <TreePine className="h-4 w-4" />;
    if (factor.includes('población') || factor.includes('habitantes')) return <Users className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analysis">Análisis de Riesgo</TabsTrigger>
          <TabsTrigger value="simulation">Simulación Avanzada</TabsTrigger>
          <TabsTrigger value="export">Informe Profesional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="space-y-6">
          {/* Risk Level Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Evaluación de Riesgo - {veredaName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Nivel de Riesgo:</span>
                  <Badge className={`${getRiskColor(riskAssessment.riskLevel)} text-white px-4 py-2 text-lg`}>
                    {riskAssessment.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Porcentaje de Riesgo</span>
                    <span className="font-medium">{riskAssessment.overallRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.overallRisk} className="h-3" />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Interpretación:</strong> Riesgo {riskAssessment.riskLevel.toLowerCase()} de deslizamiento basado en condiciones geológicas y ambientales actuales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle>Factores de Riesgo Detallados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Riesgo por Pendiente:</span>
                    <span className="text-sm font-bold">{riskAssessment.factors.slopeRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.factors.slopeRisk} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Riesgo por Precipitación:</span>
                    <span className="text-sm font-bold">{riskAssessment.factors.precipitationRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.factors.precipitationRisk} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Riesgo por Suelo:</span>
                    <span className="text-sm font-bold">{riskAssessment.factors.soilRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.factors.soilRisk} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Riesgo Geológico:</span>
                    <span className="text-sm font-bold">{riskAssessment.factors.geologicalRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.factors.geologicalRisk} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Riesgo por Elevación:</span>
                    <span className="text-sm font-bold">{riskAssessment.factors.elevationRisk}%</span>
                  </div>
                  <Progress value={riskAssessment.factors.elevationRisk} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geological Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-blue-600" />
                Datos Geológicos y Ambientales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Elevación:</span>
                    <span className="text-sm">{geologicalData.elevation} m.s.n.m.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pendiente:</span>
                    <span className="text-sm">{geologicalData.slope}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precipitación:</span>
                    <span className="text-sm">{geologicalData.precipitation} mm/año</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tipo de Suelo:</span>
                    <span className="text-sm">{geologicalData.soilType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Formación Geológica:</span>
                    <span className="text-sm text-xs">{geologicalData.geologicalFormation}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vereda Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Información de la Vereda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Población Estimada</p>
                    <p className="text-lg font-semibold">{veredaInfo.population}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actividad Principal</p>
                    <p className="text-sm">{veredaInfo.mainActivity}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Factores de Riesgo Identificados:</h4>
                  <div className="space-y-2">
                    {veredaInfo.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {getFactorIcon(factor)}
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-600 mb-2">Fortalezas de la Vereda:</h4>
                  <div className="space-y-2">
                    {veredaInfo.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <TreePine className="h-4 w-4 text-green-500" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Recomendaciones de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskAssessment.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-orange-600">{index + 1}</span>
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation">
          <AdvancedRiskSimulation 
            originalData={geologicalData}
            veredaName={veredaName}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generar Informe Técnico Profesional</CardTitle>
              <p className="text-sm text-muted-foreground">
                Genere un informe PDF profesional de 5 páginas con gráficos, análisis comparativo, 
                recomendaciones detalladas y contactos de emergencia para {veredaName}.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h4 className="font-medium mb-3 text-green-800">📊 El informe profesional incluye:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>✅ Portada oficial con branding municipal</li>
                      <li>✅ Resumen ejecutivo con gráficos de riesgo</li>
                      <li>✅ Análisis detallado con tablas técnicas</li>
                      <li>✅ Plan de acción por fases temporales</li>
                      <li>✅ Análisis estadístico y comparativo</li>
                    </ul>
                    <ul className="text-sm space-y-1 text-green-700">
                      <li>✅ Contactos de emergencia completos</li>
                      <li>✅ Certificación técnica oficial</li>
                      <li>✅ Visualizaciones de factores de riesgo</li>
                      <li>✅ Tendencias históricas y proyecciones</li>
                      <li>✅ Formato profesional para presentaciones</li>
                    </ul>
                  </div>
                </div>
                
                <EnhancedPDFExport
                  lat={lat}
                  lng={lng}
                  veredaName={veredaName}
                  geologicalData={geologicalData}
                  riskLevel={riskForPDF.level}
                  riskPercentage={riskForPDF.percentage}
                />
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Tip:</strong> Este informe es ideal para presentaciones ante el Concejo Municipal, 
                    solicitudes de presupuesto para obras de mitigación, y documentación oficial de proyectos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}