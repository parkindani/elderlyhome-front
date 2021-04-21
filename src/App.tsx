import React, {useState} from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import axios from 'axios';
import useSWR from 'swr'


const fetcher = (url: string) => axios.get(url).then(res => res.data.OldPersonRecuperationFacility[1].row);

const Marker = ({ children }: any) => children;

const ElderlyMap = () => {

  const [bounds, setBounds] = useState<any[]>([]);
  const [zoom, setZoom] = useState(10);
  const url = "/data/data.json";
  const {data, error} = useSWR(url, fetcher);
  const homes = data && ! error ? data : [];
  const points = homes.map((home: { LICENSG_DE: string; BIZPLC_NM: string; REFINE_WGS84_LOGT: string; REFINE_WGS84_LAT: string; }) => ({
    type: "Feature",
    properties: { cluster: false, homeId: home.LICENSG_DE, homeName: home.BIZPLC_NM },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(home.REFINE_WGS84_LOGT),
        parseFloat(home.REFINE_WGS84_LAT)
      ]
    }
  }));


  const {clusters, supercluster} = useSupercluster({
    points,
    bounds,
    zoom,
    options: {radius: 75, maxZoom: 20}
  })

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCAKQJBl3rgofeiyxOVqpcOpNw_PZXYCTY" }}
        defaultCenter={{ lat: 37.5326, lng: 127.024612 }}
        defaultZoom={11}
        onChange={({zoom, bounds}) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ])
        }}
      >

        {
          clusters.map((cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount,
              homeName
            } = cluster.properties;

            if (isCluster) {
              return (
                <Marker
                key={`cluster-${index}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {}}
                >
                  {pointCount}
                </div>
              </Marker>
              );
            }

            return (
              <Marker
                key={`crime-${index}`}
                lat={latitude}
                lng={longitude}
              >
                <button className="crime-marker">
                  <p>{homeName}</p>
                </button>
              </Marker>
            );

          })
        }
        
      </GoogleMapReact>
    </div>
  );
};

export default ElderlyMap;
