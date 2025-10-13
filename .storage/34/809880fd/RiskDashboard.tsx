import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingUp, Mountain, Droplets } from 'lucide-react';

interface RiskDashboardProps {
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

const RiskDashboard: React.FC<RiskDashboardProps> = ({ riskData }) => {
  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (risk < 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return 'Bajo';
    if (risk < 60) return 'Medio';
    return 'Alto';
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Dashboard de Riesgos - {riskData.vereda}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Deslizamiento</span>
                <span className="text-sm font-bold">{riskData.landslideRisk}%</span>
              </div>
              <Progress value={riskData.landslideRisk} className="h-3" />
              <Badge className={getRiskColor(riskData.landslideRisk)}>
                {getRiskLevel(riskData.landslideRisk)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Colapso</span>
                <span className="text-sm font-bold">{riskData.collapseRisk}%</span>
              </div>
              <Progress value={riskData.collapseRisk} className="h-3" />
              <Badge className={getRiskColor(riskData.collapseRisk)}>
                {getRiskLevel(riskData.collapseRisk)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">General</span>
                <span className="text-sm font-bold">{riskData.overallRisk}%</span>
              </div>
              <Progress value={riskData.overallRisk} className="h-3" />
              <Badge className={getRiskColor(riskData.overallRisk)}>
                {getRiskLevel(riskData.overallRisk)}
              </Badge>
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Mountain className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600">Elevación</p>
                <p className="font-semibold">{riskData.elevation}m</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-green-600">Pendiente</p>
                <p className="font-semibold">{riskData.slope}°</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Droplets className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600">Precipitación</p>
                <p className="font-semibold">{riskData.precipitation}mm</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <div className="w-5 h-5 bg-orange-600 rounded-full"></div>
              <div>
                <p className="text-xs text-orange-600">Suelo</p>
                <p className="font-semibold text-xs">{riskData.soilType}</p>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          {riskData.recommendations && riskData.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Recomendaciones
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {riskData.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                      <span className="text-amber-600 font-bold">•</span>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;