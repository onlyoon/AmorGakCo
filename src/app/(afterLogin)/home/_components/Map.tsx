'use client';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { geolocation, groupData, location } from '@/app/_types/Map';
import { useEffect, useState } from 'react';
import RecommendCard from './map/RecommendCard';
import GroupCard from './map/GroupCard';

interface MapContainerProps {
  markers: location[];
}
type CardType =  "none" | "info" | "recommend";

export default function MapContainer({ markers }: MapContainerProps) {
  const [curLocation, setCurLocation] = useState<geolocation>({
    center: {
      lat: 37.54619261015808,
      lng: 126.7303762529431,
    },
    radius: 300,
    errMsg: null,
    isLoading: true,
  });
  const [card, setCard] = useState<string>('none');
  const [groupData, setGroupData] = useState<groupData>({
    hostNickname: '아모르겠고',
    hostImgUrl: 'https://fakeimg',
    beginAt: '2024-07-30T20:38:09.621499',
    endAt: '2024-07-30T23:38:09.621502',
    groupCapacity: 3,
    currentParticipants: 3,
    address: '서울특별시 종로구 신문로1가 23',
  });
  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
        },
        (err) => {
          setCurLocation((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        },
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setCurLocation((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  // 이후에 API 연동 가능할 시 주변 그룹 불러오기
  // useGetGroups(curLocation);

  return (
    <>
      <Map // 지도를 표시할 Container
        center={curLocation.center}
        style={{
          // 지도의 크기
          width: '100%',
          height: '100%',
          flex: '1',
          display: 'flex',
        }}
        level={3} // 지도의 확대 레벨
        onDragEnd={(map) => {
          const lat = map.getCenter().getLat();
          const lng = map.getCenter().getLng();
          setCurLocation((prev) => ({
            ...prev,
            center: { lat: lat, lng: lng },
            radius: 500,
          }));
        }}
        onZoomChanged={(map) => {
          const lat = map.getCenter().getLat();
          const lng = map.getCenter().getLng();
          console.log(lat, lng);
          setCurLocation((prev) => ({
            ...prev,
            center: { lat: lat, lng: lng },
            radius: 500,
          }));
        }}
      >
        {markers.map((marker: location) => (
          <MapMarker // 마커를 생성합니다
            key={marker.groupId}
            image={{
              src: `/mapMarker.svg`, // 마커이미지의 주소입니다
              size: {
                width: 24,
                height: 32,
              }, // 마커이미지의 크기입니다
              options: {
                offset: {
                  x: 27,
                  y: 69,
                }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              },
            }}
            position={{
              // 마커가 표시될 위치입니다
              lat: marker.lat,
              lng: marker.lng,
            }}
            onClick={() => {
              setCard('info');
            }}
          />
        ))}
      </Map>
      {card === 'recommend' && (
        <RecommendCard address="" title="" setCard={setCard} />
      )}
      {card === 'info' && <GroupCard groupData={groupData} setCard={setCard} />}
    </>
  );
}
