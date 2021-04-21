import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
type AnyReactComponentProps = {
  text: string;
  lat: number;
  lng: number;
}
const AnyReactComponent  = ({ text }: AnyReactComponentProps) => <div>{text}</div>;
 

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCAKQJBl3rgofeiyxOVqpcOpNw_PZXYCTY" }}
          defaultCenter={{lat: 59.95, lng: 30.44}}
          defaultZoom={11}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}
 
export default SimpleMap;