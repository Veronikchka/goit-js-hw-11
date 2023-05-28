const axios = require('axios').default;

const URL = 'https://pixabay.com/api/';
const KEY = '36823643-547512f951138cf3ddb199c68';

export async function fetchImages(name, page, per_page) {
  try {
    const response = await axios.get(
      `${URL}?key=${KEY}&q=${name}&page=${page}&per_page=${per_page}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}