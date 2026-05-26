export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  image: string;
  description: string;
  traits: string[];
  vaccinated: boolean;
  size: 'Small' | 'Medium' | 'Large';
  location: string;
}

export interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
}
