import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Polyline from '@mapbox/polyline';

const clientId = "20906"
const clientSecret = "a54ffe91af74c2e3fefcd3fe794159a1c120f136"
const accessToken = '37338812d9b76451f38f8c296616f94149881d15'
const baseUrl = "https://www.strava.com/oauth/token"
const requestUrl = "https://www.strava.com/api/v3/"

mapboxgl.accessToken = 'pk.eyJ1IjoiZWxsZW5kb3duIiwiYSI6ImNqOWV4b2h5dDJncTQycXJ3MGtqN3F2Z2QifQ.mMMY_S1H4Rp1CdbWH0p0rQ';

const mapStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0
}

export default class MapView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      access_token: null,
      activityId: null,
      mapActivity: null,
      polyline: null,
      start_latitude: null,
      start_longitude: null,
      coordinates: null
    }
  }

  componentDidMount() {
    const map = new mapboxgl.Map({container: this.mapContainer, style: 'mapbox://styles/ellendown/cj9kd47io0l442rlp7z6n8oz3', zoom: 0});
    // AsyncStorage.getItem('access_token').then((token) => {
    //   this.setState({access_token: token})
    // });
    // localStorage.getItem('activityId').then((id) => {
    //   let realId = parseInt(id)
    //   this.setState({activityId: realId})
    // this._getMapInfo().done()
    this._getMapInfo()
    // this.getPolyLine()
  }

  _getMapInfo = async() => {
    let options = {
      method: 'GET',
      body: null,
      headers: {
        'Authorization': 'Bearer ' + '37338812d9b76451f38f8c296616f94149881d15'
      }
    }
    let result = await fetch(requestUrl + 'activities/' + '1252340841' + '?include_all_efforts=false', options)
    .then((data) => data.json())
    .then((responseData) => {
      let points = Polyline.decode(responseData.map.summary_polyline)
      let coordinates = points.map((point, index) => {
        return [point[1],  point[0]]
      })
      this.setState({coordinates: coordinates})
      const map = new mapboxgl.Map({container: this.mapContainer, style: 'mapbox://styles/ellendown/cj9kd47io0l442rlp7z6n8oz3', zoom: 0});
      map.jumpTo({'center': this.state.coordinates[0], 'zoom': 18});
      map.setPitch(70);
      // this.panToRoute()
      //
      let i = 0;
      let timer = window.setInterval(function() {
        console.log('ho', coordinates);

        if (i < coordinates.length) {
        coordinates.push(coordinates[i]);
          // map.getSource('trace').setData(coord);
        map.panTo(coordinates[i]);
        i++;
        } else {
          window.clearInterval(timer);
        }
      }, 10);
      })
  }


  // panToRoute() {
  //   var i = 0;
  //   if (i < coordinates.length) {
  //   coordinates.push(coordinates[i]);
  //     // map.getSource('trace').setData(coord);
  //   map.panTo(coordinates[i]);
  //   i++;
  //
  // }


  render() {

    const coordinates = this.state.coordinates


    return (
      <div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={mapStyle}/>
      </div>
    );
  }
}
