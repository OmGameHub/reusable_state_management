type DogType = {
  id: number;
  name: string;
  bred_for?: string;
  breed_group?: string;
  height: {
    imperial: string;
    metric: string;
  };
  image: {
    height: number;
    id: string;
    url: string;
    width: number;
  };
  life_span?: string;
  reference_image_id: string;
  origin?: string;
  temperament: string;
  weight: {
    imperial: string;
    metric: string;
  };
};

export default DogType