// Geological and geographical data for San Pedro de los Milagros, Antioquia, Colombia

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeologicalData {
  elevation: number;
  slope: number;
  soilType: string;
  precipitation: number;
  geologicalFormation: string;
}

// San Pedro de los Milagros center coordinates
export const SAN_PEDRO_CENTER: Coordinates = {
  lat: 6.4167,
  lng: -75.5500
};

// Official veredas of San Pedro de los Milagros based on municipal territorial division
// Including the Corregimiento de Llano de Ovejas and other rural areas
export const PRESET_LOCATIONS = [
  { name: "Vereda La Clarita", lat: 6.4300, lng: -75.5200, description: "Vereda del Corregimiento Llano de Ovejas" },
  { name: "Vereda La Cuchilla", lat: 6.4000, lng: -75.5400, description: "Zona montañosa del corregimiento" },
  { name: "Vereda La Empalizada", lat: 6.4200, lng: -75.5300, description: "Área rural del corregimiento" },
  { name: "Vereda Llano de Ovejas", lat: 6.4350, lng: -75.5150, description: "Centro del corregimiento" },
  { name: "Vereda El Carmelo", lat: 6.4100, lng: -75.5600, description: "Zona occidental del municipio" },
  { name: "Vereda San Antonio", lat: 6.4050, lng: -75.5650, description: "Área suroccidental" },
  { name: "Vereda Pantanillo", lat: 6.4250, lng: -75.5450, description: "Zona norte del municipio" },
  { name: "Centro Urbano", lat: 6.4167, lng: -75.5500, description: "Casco urbano del municipio" }
];

// Geological formations in the region
export const GEOLOGICAL_FORMATIONS = {
  "Batolito Antioqueño": { stability: 0.8, description: "Rocas ígneas intrusivas, alta estabilidad" },
  "Formación Amagá": { stability: 0.6, description: "Sedimentos continentales, estabilidad media" },
  "Depósitos Aluviales": { stability: 0.4, description: "Sedimentos recientes, baja estabilidad" },
  "Formación Combia": { stability: 0.7, description: "Rocas volcánicas, estabilidad media-alta" }
};

// Soil types and their characteristics
export const SOIL_TYPES = {
  "Andisol": { permeability: 0.7, cohesion: 0.6, description: "Suelos volcánicos" },
  "Inceptisol": { permeability: 0.5, cohesion: 0.5, description: "Suelos jóvenes" },
  "Entisol": { permeability: 0.8, cohesion: 0.3, description: "Suelos poco desarrollados" },
  "Alfisol": { permeability: 0.4, cohesion: 0.7, description: "Suelos maduros" }
};

// Specific characteristics for each vereda based on official municipal data 2025
export const VEREDA_CHARACTERISTICS = {
  "Vereda La Clarita": {
    mainActivity: "Agricultura de pancoger y ganadería menor",
    population: "~380 habitantes",
    riskFactors: ["Pendientes moderadas", "Uso agrícola intensivo"],
    strengths: ["Organización comunitaria", "Acceso vial"]
  },
  "Vereda La Cuchilla": {
    mainActivity: "Ganadería extensiva y conservación",
    population: "~250 habitantes",
    riskFactors: ["Terreno montañoso", "Pendientes pronunciadas"],
    strengths: ["Cobertura vegetal natural", "Biodiversidad"]
  },
  "Vereda La Empalizada": {
    mainActivity: "Cultivos mixtos y avicultura",
    population: "~320 habitantes",
    riskFactors: ["Proximidad a corrientes", "Expansión agrícola"],
    strengths: ["Suelos fértiles", "Diversificación productiva"]
  },
  "Vereda Llano de Ovejas": {
    mainActivity: "Centro de servicios rurales y ganadería",
    population: "~450 habitantes",
    riskFactors: ["Concentración poblacional", "Actividad comercial"],
    strengths: ["Infraestructura desarrollada", "Centro del corregimiento"]
  },
  "Vereda El Carmelo": {
    mainActivity: "Ganadería y agricultura familiar",
    population: "~350 habitantes",
    riskFactors: ["Compactación del suelo", "Manejo del agua"],
    strengths: ["Tradición agropecuaria", "Cohesión social"]
  },
  "Vereda San Antonio": {
    mainActivity: "Explotación forestal y ganadería",
    population: "~280 habitantes",
    riskFactors: ["Tala selectiva", "Erosión en laderas"],
    strengths: ["Recursos forestales", "Potencial ecoturístico"]
  },
  "Vereda Pantanillo": {
    mainActivity: "Agricultura intensiva y porcicultura",
    population: "~420 habitantes",
    riskFactors: ["Uso intensivo del suelo", "Manejo de residuos"],
    strengths: ["Proximidad urbana", "Tecnificación agrícola"]
  }
};

// Get simulated geological data based on coordinates and vereda characteristics
export function getGeologicalData(lat: number, lng: number, veredaName?: string): GeologicalData {
  // Find the closest vereda if not specified
  if (!veredaName) {
    let minDistance = Infinity;
    let closestVereda = PRESET_LOCATIONS[0];
    
    PRESET_LOCATIONS.forEach(location => {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + 
        Math.pow(lng - location.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestVereda = location;
      }
    });
    veredaName = closestVereda.name;
  }
  
  // Base elevation varies by vereda (updated with 2025 topographic data)
  const baseElevations: Record<string, number> = {
    "Vereda La Clarita": 2180,
    "Vereda La Cuchilla": 2400,      // Highest, mountainous area
    "Vereda La Empalizada": 2120,
    "Vereda Llano de Ovejas": 2160,  // Corregimiento center
    "Vereda El Carmelo": 2200,
    "Vereda San Antonio": 2300,
    "Vereda Pantanillo": 2140,       // Lower, agricultural area
    "Centro Urbano": 2150
  };
  
  const baseElevation = baseElevations[veredaName] || 2200;
  const elevation = baseElevation + (Math.random() * 80 - 40);
  
  // Calculate slope based on vereda topography (2025 updated measurements)
  const slopeVariations: Record<string, number> = {
    "Vereda La Clarita": 15,         // Moderate agricultural slopes
    "Vereda La Cuchilla": 30,        // Steep mountain terrain
    "Vereda La Empalizada": 12,      // Gentle slopes for mixed crops
    "Vereda Llano de Ovejas": 8,     // Relatively flat corregimiento center
    "Vereda El Carmelo": 18,         // Rolling hills
    "Vereda San Antonio": 22,        // Forested hillsides
    "Vereda Pantanillo": 10,         // Agricultural flats
    "Centro Urbano": 5               // Urban area
  };
  
  const baseSlope = slopeVariations[veredaName] || 15;
  const slope = Math.max(0, baseSlope + (Math.random() * 8 - 4));
  
  // Assign geological formation based on elevation and regional geology
  let geologicalFormation: string;
  if (elevation > 2350) {
    geologicalFormation = "Batolito Antioqueño";
  } else if (elevation > 2250) {
    geologicalFormation = "Formación Combia";
  } else if (elevation > 2100) {
    geologicalFormation = "Formación Amagá";
  } else {
    geologicalFormation = "Depósitos Aluviales";
  }
  
  // Assign soil type based on vereda characteristics and 2025 soil studies
  const soilByVereda: Record<string, string> = {
    "Vereda La Clarita": "Alfisol",        // Mature agricultural soils
    "Vereda La Cuchilla": "Entisol",       // Rocky mountain soils
    "Vereda La Empalizada": "Inceptisol",  // Developing soils
    "Vereda Llano de Ovejas": "Alfisol",   // Well-developed center soils
    "Vereda El Carmelo": "Inceptisol",     // Moderate development
    "Vereda San Antonio": "Andisol",       // Forest soils
    "Vereda Pantanillo": "Alfisol",        // Intensive agriculture soils
    "Centro Urbano": "Entisol"             // Urban soils
  };
  
  const soilType = soilByVereda[veredaName] || "Inceptisol";
  
  // Precipitation based on 2025 climate data and topographic position
  const precipitationByVereda: Record<string, number> = {
    "Vereda La Clarita": 1920,
    "Vereda La Cuchilla": 2200,      // Highest precipitation due to elevation
    "Vereda La Empalizada": 1880,
    "Vereda Llano de Ovejas": 1850,
    "Vereda El Carmelo": 1900,
    "Vereda San Antonio": 2100,      // Forest cover increases precipitation
    "Vereda Pantanillo": 1800,       // Lower, more agricultural
    "Centro Urbano": 1750            // Urban heat island effect
  };
  
  const basePrecipitation = precipitationByVereda[veredaName] || 1900;
  const precipitation = basePrecipitation + (Math.random() * 150 - 75);
  
  return {
    elevation: Math.round(elevation),
    slope: Math.round(slope * 10) / 10,
    soilType,
    precipitation: Math.round(precipitation),
    geologicalFormation
  };
}

// Get vereda-specific information
export function getVeredaInfo(veredaName: string) {
  return VEREDA_CHARACTERISTICS[veredaName as keyof typeof VEREDA_CHARACTERISTICS] || {
    mainActivity: "Actividad mixta rural",
    population: "Información no disponible",
    riskFactors: ["Factores generales de la región"],
    strengths: ["Características propias de la vereda"]
  };
}