import { GeologicalData, GEOLOGICAL_FORMATIONS, SOIL_TYPES } from './geoData';

export interface RiskAnalysis {
  overallRisk: number; // 0-100 percentage
  riskLevel: 'Muy Bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
  factors: {
    slopeRisk: number;
    elevationRisk: number;
    soilRisk: number;
    precipitationRisk: number;
    geologicalRisk: number;
  };
  recommendations: string[];
}

export interface RiskAssessment {
  level: string;
  percentage: number;
  description: string;
  recommendations: string[];
}

export function calculateLandslideRisk(geoData: GeologicalData): RiskAnalysis {
  // Calculate individual risk factors (0-1 scale)
  
  // Slope risk: higher slopes = higher risk
  const slopeRisk = Math.min(1, geoData.slope / 45);
  
  // Elevation risk: very high or very low elevations can be riskier
  const elevationRisk = geoData.elevation > 2500 ? 0.7 : 
                       geoData.elevation < 2000 ? 0.6 : 0.3;
  
  // Soil risk based on soil type characteristics
  const soilData = SOIL_TYPES[geoData.soilType as keyof typeof SOIL_TYPES];
  const soilRisk = soilData ? (1 - soilData.cohesion) * soilData.permeability : 0.5;
  
  // Precipitation risk: more rain = higher risk
  const precipitationRisk = Math.min(1, Math.max(0, (geoData.precipitation - 1500) / 1000));
  
  // Geological formation risk
  const geoFormation = GEOLOGICAL_FORMATIONS[geoData.geologicalFormation as keyof typeof GEOLOGICAL_FORMATIONS];
  const geologicalRisk = geoFormation ? (1 - geoFormation.stability) : 0.5;
  
  // Weighted overall risk calculation
  const weights = {
    slope: 0.35,
    elevation: 0.15,
    soil: 0.20,
    precipitation: 0.15,
    geological: 0.15
  };
  
  const overallRisk = Math.round((
    slopeRisk * weights.slope +
    elevationRisk * weights.elevation +
    soilRisk * weights.soil +
    precipitationRisk * weights.precipitation +
    geologicalRisk * weights.geological
  ) * 100);
  
  // Determine risk level
  let riskLevel: RiskAnalysis['riskLevel'];
  if (overallRisk < 20) riskLevel = 'Muy Bajo';
  else if (overallRisk < 40) riskLevel = 'Bajo';
  else if (overallRisk < 60) riskLevel = 'Medio';
  else if (overallRisk < 80) riskLevel = 'Alto';
  else riskLevel = 'Muy Alto';
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (slopeRisk > 0.6) {
    recommendations.push("Considerar obras de estabilización de taludes");
  }
  if (precipitationRisk > 0.6) {
    recommendations.push("Implementar sistemas de drenaje adecuados");
  }
  if (soilRisk > 0.6) {
    recommendations.push("Realizar estudios geotécnicos detallados");
  }
  if (geologicalRisk > 0.6) {
    recommendations.push("Evaluar la estabilidad de la formación geológica");
  }
  if (overallRisk > 60) {
    recommendations.push("Se recomienda evaluación profesional antes de construcción");
  }
  if (recommendations.length === 0) {
    recommendations.push("Zona con condiciones favorables para desarrollo");
  }
  
  return {
    overallRisk,
    riskLevel,
    factors: {
      slopeRisk: Math.round(slopeRisk * 100),
      elevationRisk: Math.round(elevationRisk * 100),
      soilRisk: Math.round(soilRisk * 100),
      precipitationRisk: Math.round(precipitationRisk * 100),
      geologicalRisk: Math.round(geologicalRisk * 100)
    },
    recommendations
  };
}

// New function for the simulation component
export function calculateRisk(data: GeologicalData): RiskAssessment {
  let riskScore = 0;
  const factors: string[] = [];

  // Slope factor (0-40 points)
  if (data.slope > 35) {
    riskScore += 40;
    factors.push('Pendiente muy pronunciada (>35°)');
  } else if (data.slope > 25) {
    riskScore += 30;
    factors.push('Pendiente pronunciada (25-35°)');
  } else if (data.slope > 15) {
    riskScore += 20;
    factors.push('Pendiente moderada (15-25°)');
  } else if (data.slope > 8) {
    riskScore += 10;
    factors.push('Pendiente suave (8-15°)');
  }

  // Precipitation factor (0-25 points)
  if (data.precipitation > 2500) {
    riskScore += 25;
    factors.push('Precipitación muy alta (>2500mm)');
  } else if (data.precipitation > 2000) {
    riskScore += 20;
    factors.push('Precipitación alta (2000-2500mm)');
  } else if (data.precipitation > 1500) {
    riskScore += 15;
    factors.push('Precipitación moderada (1500-2000mm)');
  } else if (data.precipitation > 1000) {
    riskScore += 10;
    factors.push('Precipitación baja-moderada (1000-1500mm)');
  }

  // Geological formation factor (0-20 points)
  const formation = GEOLOGICAL_FORMATIONS[data.geologicalFormation as keyof typeof GEOLOGICAL_FORMATIONS];
  if (formation) {
    const instabilityScore = (1 - formation.stability) * 20;
    riskScore += instabilityScore;
    if (instabilityScore > 15) {
      factors.push(`Formación geológica inestable (${data.geologicalFormation})`);
    } else if (instabilityScore > 10) {
      factors.push(`Formación geológica moderadamente estable (${data.geologicalFormation})`);
    }
  }

  // Soil type factor (0-15 points)
  const soil = SOIL_TYPES[data.soilType as keyof typeof SOIL_TYPES];
  if (soil) {
    const soilRisk = (soil.permeability * 0.6 + (1 - soil.cohesion) * 0.4) * 15;
    riskScore += soilRisk;
    if (soilRisk > 10) {
      factors.push(`Tipo de suelo con alta permeabilidad (${data.soilType})`);
    }
  }

  // Elevation factor (minor influence, 0-5 points)
  if (data.elevation > 2400) {
    riskScore += 5;
    factors.push('Elevación muy alta con condiciones climáticas extremas');
  } else if (data.elevation > 2200) {
    riskScore += 3;
    factors.push('Elevación alta');
  }

  // Normalize to percentage (0-100)
  const percentage = Math.min(Math.round(riskScore), 100);

  // Determine risk level and description
  let level: string;
  let description: string;
  let recommendations: string[];

  if (percentage < 30) {
    level = 'Bajo';
    description = 'El riesgo de deslizamiento es bajo. Las condiciones geológicas y ambientales son favorables para la estabilidad del terreno.';
    recommendations = [
      'Mantener sistemas de drenaje básicos',
      'Monitoreo visual periódico del terreno',
      'Conservar la vegetación existente',
      'Evitar modificaciones bruscas del terreno'
    ];
  } else if (percentage < 60) {
    level = 'Medio';
    description = 'El riesgo de deslizamiento es moderado. Se requiere atención y medidas preventivas para mantener la estabilidad.';
    recommendations = [
      'Implementar sistemas de drenaje mejorados',
      'Realizar inspecciones técnicas semestrales',
      'Fortalecer la cobertura vegetal en pendientes',
      'Establecer protocolos de monitoreo de grietas',
      'Capacitar a la comunidad en identificación de señales de riesgo'
    ];
  } else if (percentage < 80) {
    level = 'Alto';
    description = 'El riesgo de deslizamiento es alto. Se requieren medidas de mitigación inmediatas y monitoreo constante.';
    recommendations = [
      'Implementar sistemas de drenaje profesionales',
      'Realizar estudios geotécnicos detallados',
      'Instalar sistemas de monitoreo instrumental',
      'Establecer planes de evacuación y alerta temprana',
      'Restringir construcciones en zonas críticas',
      'Implementar obras de estabilización de taludes'
    ];
  } else {
    level = 'Crítico';
    description = 'El riesgo de deslizamiento es crítico. Se requiere intervención técnica inmediata y posible reubicación de infraestructura vulnerable.';
    recommendations = [
      'Evaluación geotécnica urgente por especialistas',
      'Implementación inmediata de obras de estabilización',
      'Sistema de monitoreo instrumental 24/7',
      'Plan de evacuación y alerta temprana activado',
      'Restricción total de nuevas construcciones',
      'Considerar reubicación de infraestructura crítica',
      'Coordinación con organismos de gestión del riesgo'
    ];
  }

  return {
    level,
    percentage,
    description,
    recommendations
  };
}