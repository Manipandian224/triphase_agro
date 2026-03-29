
export interface Plant {
  id: string;
  name: string;
  description: string;
  image: string;
  growth: {
    total_duration: string;
    stages: {
      name: string;
      duration: string;
    }[];
  };
  care: {
    water: string;
    sunlight: string;
    temperature: string;
    fertilizer: string;
  };
}
