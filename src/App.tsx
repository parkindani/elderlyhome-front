import React, {useState, useEffect} from "react";
import GoogleMapReact from "google-map-react";
import getMarkers from "./api/marker";

type AnyReactComponentProps = {
  text: any;
  lat: any;
  lng: any;
};
const Marker = ({ text }: AnyReactComponentProps) => (
  <div>{text}</div>
);

const ElderlyMap = () => {

  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(()=> {
    let complete = false;
    async function get() {
      const result = await getMarkers();
      if (!complete) setMarkers(result);      
    }
    get();
    return () => {
      complete = true;
    };
  },[]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCAKQJBl3rgofeiyxOVqpcOpNw_PZXYCTY" }}
        defaultCenter={{ lat: 37.5326, lng: 127.024612 }}
        defaultZoom={11}
      >

        { markers !== [] ? markers.map((e,i) => {
          return <Marker lat={e.REFINE_WGS84_LAT} lng={e.REFINE_WGS84_LOGT} text={e.BIZPLC_NM} key = {i}/>
        }) : ''}
        
      </GoogleMapReact>
    </div>
  );
};

export default ElderlyMap;
