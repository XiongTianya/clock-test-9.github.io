import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Moon, CloudDrizzle, Wind } from 'lucide-react';
import { WeatherState } from '../types';

export const getWeatherIcon = (code: number, isDay: boolean) => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0) return isDay ? Sun : Moon; // Clear sky
  if (code >= 1 && code <= 3) return isDay ? Cloud : Moon; // Partly cloudy
  if (code >= 45 && code <= 48) return CloudFog; // Fog
  if (code >= 51 && code <= 55) return CloudDrizzle; // Drizzle
  if (code >= 61 && code <= 67) return CloudRain; // Rain
  if (code >= 71 && code <= 77) return CloudSnow; // Snow
  if (code >= 80 && code <= 82) return CloudRain; // Rain showers
  if (code >= 85 && code <= 86) return CloudSnow; // Snow showers
  if (code >= 95 && code <= 99) return CloudLightning; // Thunderstorm
  return Wind; // Default/Unknown
};

export const getWeatherDescription = (code: number): string => {
    const map: Record<number, string> = {
        0: 'Clear Sky',
        1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing Rime Fog',
        51: 'Light Drizzle', 53: 'Mod. Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Mod. Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Mod. Snow', 75: 'Heavy Snow',
        95: 'Thunderstorm'
    };
    return map[code] || 'Unknown';
};

export const fetchWeatherData = async (): Promise<Partial<WeatherState>> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Using Open-Meteo Free API
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&temperature_unit=celsius`
                );
                
                if (!response.ok) throw new Error("Weather API failed");

                const data = await response.json();
                
                resolve({
                    temperature: data.current.temperature_2m,
                    weatherCode: data.current.weather_code,
                    isDay: data.current.is_day === 1,
                    loading: false,
                    error: null
                });
            } catch (error: any) {
                resolve({ 
                    error: "Data Unavailable", 
                    loading: false,
                    temperature: null,
                    weatherCode: null
                });
            }
        }, (error) => {
            resolve({ 
                error: "Location Denied", 
                loading: false, 
                temperature: null,
                weatherCode: null
            });
        });
    });
};