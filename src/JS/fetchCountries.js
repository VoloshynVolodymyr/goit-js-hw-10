const BASE_URL = 'https://restcountries.com/v2';
const options = 'fields=name,capital,population,flags,languages';

export default function fetchCountries(name){
return fetch(`${BASE_URL}/name/${name}?${options}`)
.then(response => {
    if (!response.ok) {throw new Error('404 not found');}

    return response.json();
  });
}