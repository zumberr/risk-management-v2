import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Share, CheckCircle } from 'lucide-react';

interface EnhancedPDFExportProps {
  riskData: {
    landslideRisk: number;
    collapseRisk: number;
    overallRisk: number;
    riskLevel: string;
    elevation: number;
    slope: number;
    soilType: string;
    precipitation: number;
    vereda: string;
    recommendations?: string[];
  };
}

const EnhancedPDFExport: React.FC<EnhancedPDFExportProps> = ({ riskData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Crear contenido del PDF como texto plano
    const pdfContent = `
REPORTE TÉCNICO DE ANÁLISIS DE RIESGO GEOLÓGICO
San Pedro de los Milagros, Antioquia

==============================================

INFORMACIÓN GENERAL
- Vereda: ${riskData.vereda}
- Fecha de análisis: ${new Date().toLocaleDateString()}
- Elevación: ${riskData.elevation} m.s.n.m.
- Pendiente: ${riskData.slope}°
- Tipo de suelo: ${riskData.soilType}
- Precipitación anual: ${riskData.precipitation} mm

ANÁLISIS DE RIESGOS
- Riesgo de deslizamiento: ${riskData.landslideRisk}%
- Riesgo de colapso: ${riskData.collapseRisk}%
- Riesgo general: ${riskData.overallRisk}%
- Nivel de riesgo: ${riskData.riskLevel}

RECOMENDACIONES
${riskData.recommendations && riskData.recommendations.length > 0 
  ? riskData.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')
  : 'No hay recomendaciones específicas disponibles.'
}

==============================================
Generado por Sistema de Análisis de Riesgo Geológico
${new Date().toLocaleString()}
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte_Riesgo_${riskData.vereda.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (risk < 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Exportación de Reporte Técnico</CardTitle>
              <p className="text-indigo-100">
                Genera un reporte profesional del análisis de riesgo
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {riskData.vereda}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Report Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vista Previa del Reporte</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Vereda:</span>
                <span>{riskData.vereda}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Riesgo General:</span>
                <Badge className={getRiskColor(riskData.overallRisk)}>
                  {riskData.overallRisk}% - {riskData.riskLevel}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Elevación:</span>
                <span>{riskData.elevation} m.s.n.m.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Pendiente:</span>
                <span>{riskData.slope}°</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Report Contents */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contenido del Reporte</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">✅ Incluido en el reporte:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Información general de la vereda</li>
                <li>• Datos geológicos y ambientales</li>
                <li>• Análisis detallado de riesgos</li>
                <li>• Recomendaciones técnicas</li>
                <li>• Fecha y hora de generación</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">📊 Métricas incluidas:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Riesgo de deslizamiento: {riskData.landslideRisk}%</li>
                <li>• Riesgo de colapso: {riskData.collapseRisk}%</li>
                <li>• Riesgo general: {riskData.overallRisk}%</li>
                <li>• Precipitación: {riskData.precipitation} mm/año</li>
                <li>• Tipo de suelo: {riskData.soilType}</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Recommendations Preview */}
        {riskData.recommendations && riskData.recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recomendaciones Incluidas</h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <ul className="space-y-2">
                {riskData.recommendations.slice(0, 3).map((recommendation, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    {recommendation}
                  </li>
                ))}
                {riskData.recommendations.length > 3 && (
                  <li className="text-sm text-blue-600 italic">
                    ... y {riskData.recommendations.length - 3} recomendaciones más
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <Separator />

        {/* Generate Button */}
        <div className="space-y-4">
          <Button 
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isGenerating ? (
              <>
                <FileText className="w-5 h-5 mr-2 animate-pulse" />
                Generando reporte...
              </>
            ) : isGenerated ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Reporte generado - Generar nuevo
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Generar y Descargar Reporte
              </>
            )}
          </Button>

          {isGenerated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡Reporte generado exitosamente!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                El archivo se ha descargado automáticamente. Puedes generar un nuevo reporte si necesitas una versión actualizada.
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">ℹ️ Información adicional</h4>
          <p className="text-sm text-gray-600">
            El reporte se genera en formato de texto plano (.txt) que incluye toda la información del análisis de riesgo. 
            Este formato es compatible con cualquier editor de texto y puede ser fácilmente compartido o impreso.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPDFExport;