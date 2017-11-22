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

const mapStyles = ['mapbox://styles/ellendown/cj9nn4vj83hop2rnz2tbug6nl', 'mapbox://styles/ellendown/cj9qj2by107v92sph2k5hrwdf', 'mapbox://styles/ellendown/cj9n4vi9s360x2rlp0y18otvl', 'mapbox://styles/ellendown/cj9n4bmua34uw2rrrf6grfm0u', 'mapbox://styles/ellendown/cj9nn4vj83hop2rnz2tbug6nl', 'mapbox://styles/ellendown/cj9rbmckm0ygw2sp7iyq1xlae']

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
    const map = new mapboxgl.Map({container: this.mapContainer, style: 'mapbox://styles/ellendown/cj9nn4vj83hop2rnz2tbug6nl', zoom: 0});
    this._getMapInfo()
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
      let coordinates = points.map((point, index) => {
        return [point[1], point[0]]
      })
      this.setState({coordinates: coordinates})
      var randomMap = mapStyles[Math.floor(Math.random() * mapStyles.length)];
      console.log(randomMap);
      const map = new mapboxgl.Map({container: this.mapContainer, style: randomMap, zoom: 0});
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
        var coordinates2 = data.features[0].geometry.coordinates;

        // start by showing just the first coordinate
        data.features[0].geometry.coordinates = [coordinates2[0]];

        map.addSource('trace', { type: 'geojson', data: data });
        map.addLayer({
            "id": "trace",
            "type": "line",
            "source": "trace",
            "paint": {
                "line-color": "red",
                "line-opacity": 0.75,
                "line-width": 4
            }
        });

        map.jumpTo({'center': coordinates2[0], 'zoom': 14});
        map.setPitch(500);
        let i = 0;
        let timer = window.setInterval(function() {
          if (i < coordinates2.length) {
            data.features[0].geometry.coordinates.push(coordinates2[i]);
            map.getSource('trace').setData(data);
            map.panTo(coordinates2[i]);
            i++
          } else {
            window.clearInterval(timer);
          }
        }, 800);
      })
    })
  }

    render() {
      const randomMap = this.state.randomMap
      const coordinates = this.state.coordinates

      return (
        <div>
          <div ref={el => this.mapContainer = el} style={mapStyle}/>
        </div>
      );
    }
  }
