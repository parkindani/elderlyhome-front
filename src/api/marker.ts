import axios from "axios";

const getMarkers = async () => {
  try {
    const res = await axios.get("/data/data.json");
    return (res.data.OldPersonRecuperationFacility[1].row);
  } catch (e) {
    console.error(e);
  }
};

export default getMarkers;