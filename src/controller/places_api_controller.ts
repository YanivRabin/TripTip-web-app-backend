import axios from "axios";
import { Request, Response } from "express";

// #region Location with reviews

const locationsWithReviews: string[] = [
  "Eiffel Tower, Paris, France",
  "Statue of Liberty, New York City, United States",
  "Sydney Opera House, Sydney, Australia",
  "Buckingham Palace, London, United Kingdom",
  "Taj Mahal, Agra, India",
  "Grand Canyon National Park, Arizona, United States",
  "Machu Picchu, Cusco, Peru",
  "Great Wall of China, Beijing, China",
  "Colosseum, Rome, Italy",
  "Burj Khalifa, Dubai, United Arab Emirates",
  "Christ the Redeemer, Rio de Janeiro, Brazil",
  "Niagara Falls, Ontario, Canada",
  "Petra, Ma'an Governorate, Jordan",
  "Acropolis of Athens, Athens, Greece",
  "Stonehenge, Amesbury, United Kingdom",
  "Sagrada Familia, Barcelona, Spain",
  "Yellowstone National Park, Wyoming, United States",
  "Mount Everest, Himalayas, Nepal",
  "Museum of Modern Art, New York City, United States",
  "Louvre Museum, Paris, France",
  "Versailles Palace, Versailles, France",
  "St. Peter's Basilica, Vatican City",
  "Alhambra, Granada, Spain",
  "Tower Bridge, London, United Kingdom",
  "Angkor Wat, Siem Reap, Cambodia",
  "Mesa Verde National Park, Colorado, United States",
  "Forbidden City, Beijing, China",
  "Chichen Itza, Yucatan, Mexico",
  "Big Ben, London, United Kingdom",
  "Anne Frank House, Amsterdam, Netherlands",
  "Tower of London, London, United Kingdom",
  "Easter Island, Valparaiso Region, Chile",
  "Museum of Natural History, New York City, United States",
  "Sistine Chapel, Vatican City",
  "Brandenburg Gate, Berlin, Germany",
  "Santorini, Cyclades, Greece",
  "Venice Canals, Venice, Italy",
  "Yellowstone National Park, Wyoming, United States",
  "Mount Rushmore, South Dakota, United States",
  "Pyramids of Giza, Giza, Egypt",
  "Red Square, Moscow, Russia",
  "Machu Picchu, Cusco, Peru",
  "Ephesus, Izmir Province, Turkey",
  "Cappadocia, Nevsehir Province, Turkey",
  "Blue Mosque, Istanbul, Turkey",
  "Santorini, Cyclades, Greece",
  "Great Smoky Mountains National Park, North Carolina/Tennessee, United States",
  "The Shard, London, United Kingdom",
  "Empire State Building, New York City, United States",
  "Champs-Elysées, Paris, France",
  "Château de Chambord, Chambord, France",
  "Mont Saint-Michel, Normandy, France",
  "Museum of Fine Arts, Boston, United States",
  "Great Mosque of Cordoba, Cordoba, Spain",
  "Cathedral of Seville, Seville, Spain",
  "Montserrat, Catalonia, Spain",
  "Lisbon Oceanarium, Lisbon, Portugal",
  "Guggenheim Museum Bilbao, Bilbao, Spain",
  "Prague Castle, Prague, Czech Republic",
  "Charles Bridge, Prague, Czech Republic",
  "Trevi Fountain, Rome, Italy",
  "Pompeii, Pompeii, Italy",
  "Blue Lagoon, Grindavik, Iceland",
  "Gullfoss, South Region, Iceland",
  "Thingvellir National Park, South Region, Iceland",
  "Great Barrier Reef, Queensland, Australia",
  "Uluru (Ayers Rock), Northern Territory, Australia",
  "Melbourne Cricket Ground, Melbourne, Australia",
  "Royal Exhibition Building, Melbourne, Australia",
  "Great Ocean Road, Victoria, Australia",
  "Taronga Zoo, Sydney, Australia",
  "Harbour Bridge, Sydney, Australia",
  "Bondi Beach, Sydney, Australia",
  "Ayers Rock Resort, Northern Territory, Australia",
  "St. Kilda Beach, Melbourne, Australia",
  "Fitzroy Gardens, Melbourne, Australia",
  "Cape Byron Lighthouse, New South Wales, Australia",
  "Cradle Mountain, Tasmania, Australia",
  "Flinders Street Station, Melbourne, Australia",
  "Cape Tribulation, Queensland, Australia",
  "Purnululu National Park, Western Australia, Australia",
  "Kangaroo Island, South Australia, Australia",
  "Whitsunday Islands, Queensland, Australia",
  "Lake Hillier, Western Australia, Australia",
  "Coober Pedy, South Australia, Australia",
  "Great Ocean Road, Victoria, Australia",
  "Barossa Valley, South Australia, Australia",
  "Fraser Island, Queensland, Australia",
  "Wineglass Bay, Tasmania, Australia",
  "Kakadu National Park, Northern Territory, Australia",
  "Ningaloo Reef, Western Australia, Australia",
  "Daintree Rainforest, Queensland, Australia",
  "Royal Botanic Gardens Victoria, Victoria, Australia",
  "Healesville Sanctuary, Victoria, Australia",
  "Hobbiton Movie Set, Matamata, New Zealand",
  "Tongariro Alpine Crossing, North Island, New Zealand",
  "Wai-O-Tapu Thermal Wonderland, North Island, New Zealand",
  "Abel Tasman National Park, South Island, New Zealand",
  "Milford Sound, South Island, New Zealand",
  "Bay of Islands, Northland Region, New Zealand",
  "Sky Tower, Auckland, New Zealand",
  "Franz Josef Glacier, South Island, New Zealand",
  "Waitomo Glowworm Caves, North Island, New Zealand",
  "Mount Cook National Park, South Island, New Zealand",
  "Auckland Museum, Auckland, New Zealand",
  "Huka Falls, North Island, New Zealand",
  "Lake Taupo, North Island, New Zealand",
  "Rotorua, North Island, New Zealand",
  "Tasman Glacier, South Island, New Zealand",
  "Queenstown, South Island, New Zealand",
  "Hamilton Gardens, North Island, New Zealand",
  "Pohutu Geyser, North Island, New Zealand",
  "Wellington Botanic Garden, North Island, New Zealand",
  "Fiordland National Park, South Island, New Zealand",
  "Aoraki/Mount Cook, South Island, New Zealand",
  "Te Papa Museum, Wellington, New Zealand",
  "Tongariro National Park, North Island, New Zealand",
  "Punakaiki Pancake Rocks & Blowholes, South Island, New Zealand",
  "Waitangi Treaty Grounds, North Island, New Zealand",
  "Lake Wanaka, South Island, New Zealand",
  "Marlborough Sounds, South Island, New Zealand",
  "Bay of Plenty, North Island, New Zealand",
  "Napier, North Island, New Zealand",
  "Whangarei Falls, North Island, New Zealand",
  "Gisborne, North Island, New Zealand",
  "Taupo, North Island, New Zealand",
  "Lake Tekapo, South Island, New Zealand",
  "Kaikoura, South Island, New Zealand",
  "Fox Glacier, South Island, New Zealand",
  "Dunedin, South Island, New Zealand",
  "Akaroa, South Island, New Zealand",
  "Raglan, North Island, New Zealand",
  "Milford Sound, South Island, New Zealand",
  "The Remarkables, South Island, New Zealand",
  "Mount Aspiring National Park, South Island, New Zealand",
  "Aoraki/Mount Cook, South Island, New Zealand",
  "Waiheke Island, North Island, New Zealand",
  "Tiritiri Matangi Island, North Island, New Zealand",
  "Fiordland National Park, South Island, New Zealand",
  "Bay of Islands, Northland Region, New Zealand",
  "Abel Tasman National Park, South Island, New Zealand",
  "Whale Watch Kaikoura, South Island, New Zealand",
  "Cathedral Cove, North Island, New Zealand",
  "Hobbiton Movie Set, Matamata, New Zealand",
  "Wai-O-Tapu Thermal Wonderland, North Island, New Zealand",
  "Waiheke Island, North Island, New Zealand",
  "Waitomo Glowworm Caves, North Island, New Zealand",
  "Mount Taranaki, North Island, New Zealand",
  "Lake Taupo, North Island, New Zealand",
  "Queenstown, South Island, New Zealand",
  "Fox Glacier, South Island, New Zealand",
  "Doubtful Sound, South Island, New Zealand",
  "The Remarkables, South Island, New Zealand",
  "Tongariro Alpine Crossing, North Island, New Zealand",
  "Mount Cook National Park, South Island, New Zealand",
  "Lake Wanaka, South Island, New Zealand",
  "Rotorua, North Island, New Zealand",
  "Napier, North Island, New Zealand",
  "Kaikoura, South Island, New Zealand",
  "Huka Falls, North Island, New Zealand",
  "Franz Josef Glacier, South Island, New Zealand",
  "Coromandel Peninsula, North Island, New Zealand",
  "Tongariro National Park, North Island, New Zealand",
  "Milford Sound, South Island, New Zealand",
  "Lake Tekapo, South Island, New Zealand",
  "Aoraki/Mount Cook, South Island, New Zealand",
  "Mount Aspiring National Park, South Island, New Zealand",
  "Waitangi Treaty Grounds, North Island, New Zealand",
  "Cape Reinga, Northland Region, New Zealand",
  "Paihia, Northland Region, New Zealand",
  "Cathedral Cove, North Island, New Zealand",
  "Rotorua Museum, North Island, New Zealand",
  "Waikato River, North Island, New Zealand",
  "Mount Maunganui, North Island, New Zealand",
  "Wellington Botanic Garden, North Island, New Zealand",
  "Otago Peninsula, South Island, New Zealand",
  "Sky Tower, Auckland, New Zealand",
  "Hobbiton Movie Set, Matamata, New Zealand",
  "The Coromandel, North Island, New Zealand",
  "Wellington Cable Car, North Island, New Zealand",
  "Lake Taupo, North Island, New Zealand",
  "White Island, North Island, New Zealand",
  "Milford Sound, South Island, New Zealand",
  "Paihia, Northland Region, New Zealand",
  "Lake Tekapo, South Island, New Zealand",
  "Tongariro National Park, North Island, New Zealand",
  "Mount Taranaki, North Island, New Zealand",
];

// #endregion

export const getRandomLocatonWithReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const tips = await fetchTips(
      apiKey,
      locationsWithReviews[
        Math.floor(Math.random() * locationsWithReviews.length)
      ]
    );
    return res.status(200).send(tips);
  } catch {
    return res.status(400);
  }
};

// Interface for review object
interface Review {
  text: string;
}

// Function to fetch tips for a specific place
export async function fetchTips(
  apiKey: string,
  placeName: string
): Promise<string[]> {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: placeName,
          key: apiKey,
        },
      }
    );

    // Extracting place ID
    const placeId = response.data.results[0].place_id;

    // Fetching place details
    const detailsResponse = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: placeId,
          key: apiKey,
          fields: "name,reviews",
        },
      }
    );

    console.log("Details response:", detailsResponse.data);

    // Extracting tips/reviews
    const reviews: Review[] = detailsResponse.data.result.reviews;
    const tips = reviews.map((review) => review.text);

    return tips;
  } catch (error) {
    console.error("Error fetching tips:", error);
    return [];
  }
}
