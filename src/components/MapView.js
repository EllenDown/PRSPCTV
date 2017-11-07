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
      access_token: localStorage.getItem('access_token'),
      activityId: localStorage.getItem('activityId'),
      mapActivity: null,
      polyline: null,
      isSelf: localStorage.getItem('isSelf'),
      coordinates: null
    }
  }

  componentDidMount() {
    const map = new mapboxgl.Map({container: this.mapContainer, style: 'mapbox://styles/ellendown/cj9kd47io0l442rlp7z6n8oz3', zoom: 0});
    this._getMapInfo()
    console.log('get map');
  }

  _getMapInfo = async() => {
    let options = {
      method: 'GET',
      body: null,
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    }
    let result = await fetch(requestUrl + 'activities/' + this.state.activityId + '?include_all_efforts=false', options).then((data) => data.json()).then((responseData) => {
      let points
      if (this.state.isSelf === true) {
        points = Polyline.decode(responseData.map.polyline)
    } else {
        points = Polyline.decode(responseData.map.summary_polyline)
      }
      console.log(points);
      let coordinates = points.map((point, index) => {
        return [point[1], point[0]]
      })
      this.setState({coordinates: coordinates})
      const map = new mapboxgl.Map({container: this.mapContainer, style: 'mapbox://styles/ellendown/cj9n4vi9s360x2rlp0y18otvl', zoom: 0});
      map.on('load', function () {
        let data = {
          'type': 'FeatureCollection',
          'features':
            [{
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': coordinates
              }
            }]
        }

        // save full coordinate list for later
        // var coordinates = data.features[0].geometry.coordinates;

        // start by showing just the first coordinate
        // data.features[0].geometry.coordinates = [coordinates[0]];

        map.addSource('trace', { type: 'geojson', data: data });
        map.addLayer({
            "id": "trace",
            "type": "line",
            "source": "trace",
            "paint": {
                "line-color": "yellow",
                "line-opacity": 0.75,
                "line-width": 2
            }
        });

        map.jumpTo({'center': coordinates[0], 'zoom': 20});
        map.setPitch(180);
        let i = 0;
        let timer = window.setInterval(function() {
          if (i < coordinates.length) {
            data.features[0].geometry.coordinates.push(coordinates[i]);
            map.panTo(coordinates[i]);
            i++;
          } else {
            window.clearInterval(timer);
          }
        }, 500);
      })
    })
  }

    render() {
      const coordinates = this.state.coordinates

      const data = {
        'type': 'FeatureCollection',
        'features':
          [{
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': coordinates
            }
          }]
      }


      return (
        <div>
          <div ref={el => this.mapContainer = el} style={mapStyle}/>
        </div>
      );
    }
  }
