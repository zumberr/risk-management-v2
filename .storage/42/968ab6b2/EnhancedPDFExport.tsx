import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Eye, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
  FileCheck,
  Share2
} from 'lucide-react';
import jsPDF from 'jspdf';

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

interface EnhancedPDFExportProps {
  riskData: RiskData | null;
}

const EnhancedPDFExport: React.FC<EnhancedPDFExportProps> = ({ riskData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const getRiskLevel = (risk: number): { level: string; color: string; bgColor: string } => {
    if (risk >= 70) return { level: 'Muy Alto', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' };
    if (risk >= 50) return { level: 'Alto', color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-200' };
    if (risk >= 30) return { level: 'Medio', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' };
    return { level: 'Bajo', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' };
  };

  const simulateProgress = () => {
    const steps = [10, 25, 45, 65, 80, 95, 100];
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    
    return interval;
  };

  const generatePDF = async () => {
    if (!riskData) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    
    const progressInterval = simulateProgress();

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Header with gradient effect simulation
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Análisis de Riesgo Geológico', margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('San Pedro de los Milagros, Antioquia', margin, 35);

      yPosition = 60;
      pdf.setTextColor(0, 0, 0);

      // Location Information
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📍 Información de Ubicación', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Vereda: ${riskData.vereda}`, margin + 5, yPosition);
      yPosition += 8;
      pdf.text(`Coordenadas: ${riskData.coordinates.lat.toFixed(6)}, ${riskData.coordinates.lng.toFixed(6)}`, margin + 5, yPosition);
      yPosition += 8;
      pdf.text(`Elevación: ${riskData.elevation.toFixed(1)} m`, margin + 5, yPosition);
      yPosition += 8;
      pdf.text(`Pendiente: ${riskData.slope.toFixed(1)}°`, margin + 5, yPosition);
      yPosition += 20;

      // Risk Analysis
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('⚠️ Análisis de Riesgo', margin, yPosition);
      yPosition += 15;

      const landslideLevel = getRiskLevel(riskData.landslideRisk);
      const collapseLevel = getRiskLevel(riskData.collapseRisk);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Riesgo de Deslizamiento:', margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${riskData.landslideRisk.toFixed(1)}% - ${landslideLevel.level}`, margin + 70, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'bold');
      pdf.text('Riesgo de Colapso:', margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${riskData.collapseRisk.toFixed(1)}% - ${collapseLevel.level}`, margin + 70, yPosition);
      yPosition += 20;

      // Environmental Factors
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('🌍 Factores Ambientales', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Tipo de Suelo: ${riskData.soilType}`, margin + 5, yPosition);
      yPosition += 8;
      pdf.text(`Precipitación Anual: ${riskData.precipitation.toFixed(0)} mm`, margin + 5, yPosition);
      yPosition += 20;

      // Risk Factors
      if (riskData.riskFactors.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('🔍 Factores de Riesgo Identificados', margin, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        riskData.riskFactors.forEach((factor, index) => {
          pdf.text(`• ${factor}`, margin + 5, yPosition);
          yPosition += 8;
        });
        yPosition += 10;
      }

      // Recommendations
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('💡 Recomendaciones', margin, yPosition);
      yPosition += 15;

      const recommendations = [
        'Realizar monitoreo periódico de la zona',
        'Implementar sistemas de drenaje adecuados',
        'Evitar construcciones en áreas de alto riesgo',
        'Mantener la vegetación natural para estabilizar el suelo',
        'Consultar con expertos en geotecnia antes de proyectos'
      ];

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      recommendations.forEach((rec, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(`${index + 1}. ${rec}`, margin + 5, yPosition);
        yPosition += 8;
      });

      // Footer
      const now = new Date();
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generado el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES')}`, margin, pdf.internal.pageSize.getHeight() - 10);
      pdf.text('Sistema de Análisis de Riesgo Geológico - San Pedro de los Milagros', pageWidth - margin - 100, pdf.internal.pageSize.getHeight() - 10);

      // Save the PDF
      pdf.save(`analisis-riesgo-geologico-${riskData.vereda.replace(/\s+/g, '-').toLowerCase()}-${now.toISOString().split('T')[0]}.pdf`);
      
      setLastGenerated(now);
      clearInterval(progressInterval);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const togglePreview = () => {
    setIsPreviewing(true);
    setTimeout(() => {
      setShowPreview(!showPreview);
      setIsPreviewing(false);
    }, 500);
  };

  if (!riskData) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-dashed border-2 border-gray-200 bg-gray-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-500 max-w-sm">
            Realiza un análisis de riesgo primero para generar el reporte PDF
          </p>
        </CardContent>
      </Card>
    );
  }

  const landslideLevel = getRiskLevel(riskData.landslideRisk);
  const collapseLevel = getRiskLevel(riskData.collapseRisk);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Export Card */}
      <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/10 to-emerald-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Reporte de Análisis Geológico
                </CardTitle>
                <p className="text-gray-600 mt-1">Exportación avanzada de datos de riesgo</p>
              </div>
            </div>
            {lastGenerated && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Generado {lastGenerated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Location Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Ubicación</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">Vereda: <span className="font-medium text-gray-800">{riskData.vereda}</span></p>
              <p className="text-xs text-gray-500">
                {riskData.coordinates.lat.toFixed(6)}, {riskData.coordinates.lng.toFixed(6)}
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Datos Técnicos</h3>
              </div>
              <p className="text-sm text-gray-600 mb-1">Elevación: <span className="font-medium text-gray-800">{riskData.elevation.toFixed(1)} m</span></p>
              <p className="text-sm text-gray-600">Pendiente: <span className="font-medium text-gray-800">{riskData.slope.toFixed(1)}°</span></p>
            </div>
          </div>

          {/* Risk Levels */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
              Niveles de Riesgo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 border-2 ${landslideLevel.bgColor} transition-all duration-300 hover:shadow-md`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Deslizamiento</span>
                  <Badge className={`${landslideLevel.color} bg-white/50`}>
                    {landslideLevel.level}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2 ${landslideLevel.color}">
                  {riskData.landslideRisk.toFixed(1)}%
                </div>
                <Progress value={riskData.landslideRisk} className="h-2" />
              </div>

              <div className={`rounded-xl p-4 border-2 ${collapseLevel.bgColor} transition-all duration-300 hover:shadow-md`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700">Colapso</span>
                  <Badge className={`${collapseLevel.color} bg-white/50`}>
                    {collapseLevel.level}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-2 ${collapseLevel.color}">
                  {riskData.collapseRisk.toFixed(1)}%
                </div>
                <Progress value={riskData.collapseRisk} className="h-2" />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={generatePDF}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Descargar Reporte PDF
                </>
              )}
            </Button>

            <Button
              onClick={togglePreview}
              variant="outline"
              disabled={isPreviewing}
              className="flex-1 sm:flex-none border-2 hover:bg-gray-50 transition-all duration-300"
              size="lg"
            >
              {isPreviewing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5 mr-2" />
                  {showPreview ? 'Ocultar' : 'Vista Previa'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-2 hover:bg-gray-50 transition-all duration-300"
              size="lg"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartir
            </Button>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Generando reporte...</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-3 bg-gray-100" />
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <FileCheck className="w-4 h-4" />
                <span>Procesando datos geológicos y generando análisis detallado</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && (
        <Card className="border-0 shadow-xl bg-white animate-in slide-in-from-bottom-6 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Vista Previa del Reporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={previewRef} className="bg-gray-50 rounded-lg p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Preview Header */}
              <div className="bg-blue-600 text-white p-4 rounded-lg -m-6 mb-6">
                <h1 className="text-xl font-bold">Análisis de Riesgo Geológico</h1>
                <p className="text-blue-100">San Pedro de los Milagros, Antioquia</p>
              </div>

              {/* Preview Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📍 Información de Ubicación</h3>
                  <div className="bg-white p-3 rounded border text-sm space-y-1">
                    <p><strong>Vereda:</strong> {riskData.vereda}</p>
                    <p><strong>Coordenadas:</strong> {riskData.coordinates.lat.toFixed(6)}, {riskData.coordinates.lng.toFixed(6)}</p>
                    <p><strong>Elevación:</strong> {riskData.elevation.toFixed(1)} m</p>
                    <p><strong>Pendiente:</strong> {riskData.slope.toFixed(1)}°</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">⚠️ Análisis de Riesgo</h3>
                  <div className="bg-white p-3 rounded border text-sm space-y-1">
                    <p><strong>Riesgo de Deslizamiento:</strong> {riskData.landslideRisk.toFixed(1)}% - {landslideLevel.level}</p>
                    <p><strong>Riesgo de Colapso:</strong> {riskData.collapseRisk.toFixed(1)}% - {collapseLevel.level}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🌍 Factores Ambientales</h3>
                  <div className="bg-white p-3 rounded border text-sm space-y-1">
                    <p><strong>Tipo de Suelo:</strong> {riskData.soilType}</p>
                    <p><strong>Precipitación Anual:</strong> {riskData.precipitation.toFixed(0)} mm</p>
                  </div>
                </div>

                {riskData.riskFactors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">🔍 Factores de Riesgo</h3>
                    <div className="bg-white p-3 rounded border text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        {riskData.riskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center pt-4 border-t">
                Esta es una vista previa simplificada del reporte PDF completo
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPDFExport;