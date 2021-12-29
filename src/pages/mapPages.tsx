import React from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  StandaloneSearchBox,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { REACT_APP_GOOGLE_API_KEY } from "../App";
import "./mapPages.css";
import { useState } from "react";

export interface MapPageProps {}

const MapPage = () => {
  const [map, setMap] = React.useState<google.maps.Map>();
  const [searchBoxA, setSearchBoxA] =
    React.useState<google.maps.places.SearchBox>();
  const [searchBoxB, setSearchBoxB] =
    React.useState<google.maps.places.SearchBox>();
  const [pointA, setPointA] = React.useState<google.maps.LatLngLiteral>();
  const [pointB, setPointB] = React.useState<google.maps.LatLngLiteral>();
 

  const [origin, setOrigin] = React.useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [destination, setDestination] =
    React.useState<google.maps.LatLngLiteral | null>(null);

  const [response, setResponse] =
    React.useState<google.maps.DistanceMatrixResponse | null>(null);

  const position = {
    lat: -27.590824,
    lng: -48.551262,
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onLoadA = (ref: google.maps.places.SearchBox) => {
    setSearchBoxA(ref);
  };

  const onLoadB = (ref: google.maps.places.SearchBox) => {
    setSearchBoxB(ref);
  };

  const onPlacesChangedA = () => {
    const places = searchBoxA!.getPlaces();
    console.log(places);
    const place = places![0];
    const location = {
      lat: place?.geometry?.location?.lat() || 0,
      lng: place?.geometry?.location?.lng() || 0,
    };
    setPointA(location);
    setOrigin(null);
    setDestination(null);
    setResponse(null);
    map?.panTo(location);
  };

  const onPlacesChangedB = () => {
    const places = searchBoxB!.getPlaces();
    console.log(places);
    const place = places![0];
    const location = {
      lat: place?.geometry?.location?.lat() || 0,
      lng: place?.geometry?.location?.lng() || 0,
    };
    setPointB(location);
    setOrigin(null);
    setDestination(null);
    setResponse(null);
    map?.panTo(location);
  };

  const traceRoute = () => {
    if (pointA && pointB) {
      setOrigin(pointA);
      setDestination(pointB);
    }
  };

  

  const placeA = searchBoxA?.getPlaces();
  const placeB = searchBoxB?.getPlaces();
  let wayPointsList = [];

  //Algoritmo A*
  const bairro = [
    {
      nome: "Barra da Tijuca, Rio de Janeiro - RJ, Brasil",
      longitude: -23.000382,
      latitude: -43.365886,
    },
    {
      nome: "Recreio dos Bandeirantes, Rio de Janeiro - RJ, Brasil",

      longitude: -23.015789,
      latitude: -43.464011,
    },
    {
      nome: "Cidade de Deus, Rio de Janeiro - RJ, Brasil",
      longitude: -22.946157,
      latitude: -43.369686,
    },
    {
      nome: "Madureira, Rio de Janeiro - RJ, Brasil",
      longitude: -22.874423,
      latitude: -43.337647,
    },
    {
      nome: "Leme, Rio de Janeiro - RJ, Brasil",
      longitude: -22.963802,
      latitude: -43.170001,
    },
    {
      nome: "Centro, Rio de Janeiro - RJ, Brasil",
      longitude: -22.907853,
      latitude: -43.18459,
    },
    {
      nome: "São João de Meriti, RJ, Brasil",
      longitude: -22.790544,
      latitude: -43.399189,
    },
  ];


  function EuclidianDist(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dist = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** (1 / 2) * 111.194444;
    return dist;
  }
  function heuristica(x1: number, y1: number, xO: number, yO: number) {
    const dist = ((x1 - xO) ** 2 + (y1 - yO) ** 2) ** (1 / 2) * 111.194444;
    return Number(dist.toFixed(3));
  }

  if (placeA && placeB) {
    const origemName = placeA[0]?.formatted_address;
    const destinoName = placeB[0]?.formatted_address;

    console.log(origemName, destinoName)

    const destino = destinoName;
    const way = [origemName];
    let bairroAtual = way[0];

    

    let DestinoIndex = bairro
      .map((bairro) => bairro.nome === destino)
      .indexOf(true);

    let InitialLocalIndex = bairro
      .map((bairro) => bairro.nome === way[0])
      .indexOf(true);

    let factor = [];
    let nodes = [];
    let raioAnalisys = 15;
    let proximoBairroIndex = InitialLocalIndex;
    let proximoBairro = "";

    while (!way.includes(destino)) {
      for (let i = 0; i < bairro.length; i++) {
        if (
          EuclidianDist(
            bairro[proximoBairroIndex].longitude,
            bairro[proximoBairroIndex].latitude,
            bairro[i].longitude,
            bairro[i].latitude
          ) < raioAnalisys &&
          bairro[i].nome !== bairroAtual
        ) {
          factor.push(
            EuclidianDist(
              bairro[proximoBairroIndex].longitude,
              bairro[proximoBairroIndex].latitude,
              bairro[i].longitude,
              bairro[i].latitude
            ) +
              heuristica(
                bairro[i].longitude,
                bairro[i].latitude,
                bairro[DestinoIndex].longitude,
                bairro[DestinoIndex].latitude
              )
          );

          nodes.push(i);
        }
      }
      proximoBairro = bairro[nodes[factor.indexOf(Math.min(...factor))]].nome;

      way.push(proximoBairro);
      bairroAtual = proximoBairro;
      proximoBairroIndex = nodes[factor.indexOf(Math.min(...factor))];

      factor = [];
      nodes = [];
      
    }
   
    
    for (let i = 1; i < way.length -1; i++) {
      wayPointsList.push(way[i]);
        }

         
      }

    //Algoritmo A*\\
  
  let wayLocation = [
    {
      location: "barra da tijuca, rio de janeiro",
      stopover: false,
    },
  ];

  
  for (let i =0; i< wayPointsList.length; i++) {

      wayLocation.push({
        location: wayPointsList[i]!,
        stopover: false,
      },);
    
  }
  wayLocation.shift()
  console.log(wayLocation);

  const directionsServiceOptions =
    // @ts-ignore
    React.useMemo<google.maps.DirectionsRequest>(() => {
      return {
        origin,
        destination,
        waypoints: wayLocation,
        travelMode: "DRIVING",
      };
    }, [origin, destination]);

  const directionsCallback = React.useCallback((res) => {
    if (res !== null && res.status === "OK") {
      setResponse(res);
    } else {
      console.log(res);
    }
  }, []);

  const directionsRendererOptions = React.useMemo<any>(() => {
    return {
      directions: response,
    };
  }, [response]);

  return (
    <div className="map">
      <LoadScript
        googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={position}
          zoom={15}
        >
          <div className="address">
            <StandaloneSearchBox
              onLoad={onLoadA}
              onPlacesChanged={onPlacesChangedA}
            >
              <input
                className="addressField"
                placeholder="Digite o endereço inicial"
               
              />
            </StandaloneSearchBox>
            <StandaloneSearchBox
              onLoad={onLoadB}
              onPlacesChanged={onPlacesChangedB}
            >
              <input
                className="addressField"
                placeholder="Digite o endereço final"
              />
            </StandaloneSearchBox>
            <button onClick={traceRoute}>Traçar rota</button>
          </div>

          {!response && pointA && <Marker position={pointA} />}
          {!response && pointB && <Marker position={pointB} />}

          {origin && destination && (
            <DirectionsService
              options={directionsServiceOptions}
              callback={directionsCallback}
            />
          )}

          {response && directionsRendererOptions && (
            <DirectionsRenderer options={directionsRendererOptions} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapPage;
