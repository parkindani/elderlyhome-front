import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import axios from "axios";
import useSWR from "swr";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";

const fetcher = (url: string) =>
  axios.get(url).then((res) => res.data.OldPersonRecuperationFacility[1].row);

const Marker = ({ children }: any) => children;

const ElderlyMap = () => {
  const [bounds, setBounds] = useState<any[]>([]);
  const [zoom, setZoom] = useState(10);
  const url = "/data/data.json";
  const { data, error } = useSWR(url, fetcher);
  const homes = data && !error ? data : [];
  const points = homes.map(
    (home: {
      LICENSG_DE: string;
      BIZPLC_NM: string;
      REFINE_WGS84_LOGT: string;
      REFINE_WGS84_LAT: string;
      TOT_PSN_CNT: number;
      ENTRNC_PSN_CAPA: number;
    }) => ({
      type: "Feature",
      properties: {
        cluster: false,
        homeId: home.LICENSG_DE,
        homeName: home.BIZPLC_NM,
        currentPersonCount: home.TOT_PSN_CNT,
        personCapacity: home.ENTRNC_PSN_CAPA,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(home.REFINE_WGS84_LOGT),
          parseFloat(home.REFINE_WGS84_LAT),
        ],
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <Style>
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY! }}
          defaultCenter={{ lat: 37.5326, lng: 127.024612 }}
          defaultZoom={11}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat,
            ]);
          }}
        >
          {clusters.map((cluster, index) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount,
              homeName,
              currentPersonCount,
              personCapacity,
            } = cluster.properties;

            if (isCluster) {
              return (
                <Marker key={`cluster-${index}`} lat={latitude} lng={longitude}>
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (pointCount / points.length) * 70 * 20}px`,
                      height: `${
                        10 + (pointCount / points.length) * 70 * 20
                      }px`,
                    }}
                    onClick={() => {}}
                  >
                    <p
                      style={{
                        fontSize: `${
                          10 + (pointCount / points.length) * 40 * 20
                        }px`,
                      }}
                    >
                      {pointCount}
                    </p>
                  </div>
                </Marker>
              );
            } else {
              return (
                <Marker key={`home-${index}`} lat={latitude} lng={longitude}>
                  <button className="home-marker">
                    <div>
                      <FontAwesomeIcon icon={faHouseUser} />
                      <p>{homeName}</p>
                    </div>
                    <div>
                      <p>
                        {currentPersonCount &&
                          currentPersonCount +
                            "/" +
                            personCapacity +
                            " " +
                            Math.round(
                              (currentPersonCount / personCapacity) * 100
                            ) +
                            "%"}
                      </p>
                    </div>
                  </button>
                </Marker>
              );
            }
          })}
        </GoogleMapReact>
      </div>
    </Style>
  );
};

const Style = styled.div`
  .cluster-marker {
    color: #fff;
    background: #1978c8;
    border-radius: 50%;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .home-marker {
    background: white;
    border: green;
    min-width: 120px;
  }

  .home-marker img {
    width: 25px;
  }
`;

export default ElderlyMap;
