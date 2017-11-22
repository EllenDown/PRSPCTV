import React, {Component} from 'react';
import {Feed, Icon, Grid, Image} from 'semantic-ui-react'
import StackGrid from "react-stack-grid";

import './styles/Dashboard.css'

import butterflyBlue from '../assets/butterflyBlue.png'
import blue from '../assets/blue.png'
import cartogram from '../assets/cartogram.png'
import cartoon from '../assets/cartoon.png'
import decimal from '../assets/decimal.png'
import warmSat from '../assets/warmSat.png'
import purple from '../assets/purple.png'

const clientId = "20906"
const clientSecret = "a54ffe91af74c2e3fefcd3fe794159a1c120f136"
const baseUrl = "https://www.strava.com/oauth/token"
const requestUrl = "https://www.strava.com/api/v3/"

const dateStyle = {
  color: 'rgba(255, 255, 255, 0.5)'
}

export default class AthleteDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: localStorage.getItem('code'),
      access_token: null,
      athleteFirstname: null,
      athleteLastname: null,
      athletePhoto: '',
      activities: [],
      followerActivities: []
    }
  }

  componentDidMount() {
    console.log(this.state.code);
    this._getAthleteInfo()
    this._getFollowerInfo()
  }

  async saveToken(token, value) {
    try {
      await localStorage.setItem(token, value);
    } catch (error) {
      console.error('localStorage error: ' + error.message);
    }
  }

  async saveActivityId(id, value) {
    try {
      await localStorage.setItem(id, value);
    } catch (error) {
      console.error('localStorage error: ' + error.message);
    }
  }

  async saveIdentityStatus(status, value) {
    try {
      await localStorage.setItem(status, value);
    } catch (error) {
      console.error('localStorage error: ' + error.message);
    }
  }

  _getAthleteInfo = async() => {
    let form = JSON.stringify({client_id: clientId, client_secret: clientSecret, code: this.state.code})
    let options = {
      method: 'POST',
      body: form,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let result = await fetch(baseUrl, options).then((data) => data.json()).then((responseData) => {
      this.setState({'access_token': responseData.access_token})
      this.saveToken('access_token', responseData.access_token)
      this.setState({'athleteFirstname': responseData.athlete.firstname})
      this.setState({'athleteLastname': responseData.athlete.lastname})
      this.setState({'athletePhoto': responseData.athlete.profile})
    })
    const activityList = await this._getActivityInfo();
    const followers = await this._getFollowerInfo();
  }

  _getActivityInfo() {
    let options = {
      method: 'GET',
      body: null,
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    }

    return fetch(requestUrl + 'athlete/activities?page=1', options).then((data) => data.json()).then((responseData) => {
      let list = responseData.map(activity => {
        return {
          id: activity.id,
          name: activity.name,
          distance: activity.distance,
          type: activity.type,
          start_date: activity.start_date,
          polyline: activity.map.polyline
        }
      })
      let filteredActivities = list.filter(filteredActivity => {
        return filteredActivity.polyline !== null
      })
      this.setState({activities: filteredActivities})
    }).catch((error) => {
      console.error(error);
    });
  }

  _getFollowerInfo() {
    let options = {
      method: 'GET',
      body: null,
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    }
    return fetch(requestUrl + 'activities/following', options).then((data) => data.json()).then((responseData) => {
      let listFollowers = responseData.map(followerActivity => {
        return {
          id: followerActivity.id,
          athleteName1: followerActivity.athlete.firstname,
          athleteName2: followerActivity.athlete.lastname,
          photo: followerActivity.athlete.profile,
          name: followerActivity.name,
          distance: followerActivity.distance,
          type: followerActivity.type,
          polyline: followerActivity.map.summary_polyline,
          start_date: followerActivity.start_date
        }
      })
      let filteredFollowers = listFollowers.filter(filteredFollower => {
        return filteredFollower.polyline !== null
      })
      this.setState({followerActivities: filteredFollowers})
    }).catch((error) => {
      console.error(error);
    });
  }

  _toMapView(id, e) {
    this.saveActivityId('activityId', id)
    this.saveIdentityStatus('isSelf', true)
    this.props.history.push('/mapview')
  }

  _toMapFollowView(id, e) {
    this.saveActivityId('activityId', id)
    this.saveIdentityStatus('isSelf', false)
    this.props.history.push('/mapview')
  }

  renderIcon = (type) => {
    if (type === 'Run') {
      return " directions_run "
    } else if (type === 'Ride') {
      return " directions_bike "
    }
  }

  renderDistance = (distance) => {
    if (distance) {
      var meterToMile = distance * 0.000621371
      var miles = meterToMile.toFixed(2)
      return miles + " miles"
    }
  }

  renderDate = (date) => {
    let dayDate = date.slice(0, 10).split(/\D/);
    if (dayDate[1] === '01') {
      return "January" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '02') {
      return "February" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === ' 03') {
      return "March" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '04') {
      return "April" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '05') {
      return "May" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '06') {
      return "June" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '07') {
      return "July" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '08') {
      return "August" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '09') {
      return "September" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '10') {
      return "October" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '11') {
      return "Novemeber" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else if (dayDate[1] === '12') {
      return "December" + " " + dayDate[2] + ',' + ' ' + dayDate[0];
    } else {
      return "Super Date that no one knows"
    }
  }

  render() {
    return (
      <div className="bodyDash">
        <div className="headerContainer">
          <div className="logoImage">
            <img className="topButterfly" src={butterflyBlue}/>
          </div>
        </div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={4} className="column1">
              <div className='userContainer'>
              <div className='dash-header'>
                <div className='image-container'>
                  <img className='dash-image' src={this.state.athletePhoto}/>
                </div>
                <div className='name-container'>
                  <div className='dash-name'>{this.state.athleteFirstname}</div>
                  <div className='dash-name'>{this.state.athleteLastname}</div>
                </div>
              </div>
              <div className='dash-feed'>
                {this.state.activities.map(activity => {
                  return (
                    <Feed className="activity-feed" onClick={(e) => this._toMapView(activity.id)}>
                      <Feed.Event key={activity.id}>
                        <Feed.Label>
                          <i class="material-icons md-36">{this.renderIcon(activity.type)}</i>
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Date style={dateStyle}>{this.renderDate(activity.start_date)}</Feed.Date>
                          <Feed.Summary>
                            <div className='activityName'>
                              {activity.name}
                            </div>
                            <div className='activityDistance'>
                              {this.renderDistance(activity.distance)}
                            </div>
                          </Feed.Summary>
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  )
                })
              }
              </div>
            </div>
            </Grid.Column>
            <Grid.Column width={9}>
              <div className='followerGridHeader'> Explore Your Friends' Adventures!</div>

            <Grid className='followerFeed'>
              {this.state.followerActivities.map(followerActivity => {
                return (
                  <Grid.Column className='follower' key={followerActivity.id} width={4} onClick={(e) => this._toMapFollowView(followerActivity.id)}>
                    <div className='followerPhotoContainer'>
                      <Image className='followerPhoto' src={followerActivity.photo}/>
                    </div>
                    <div className='followerInfoContainer'>
                      <div className='followerInfo'>
                        <div className='followerName'><i class="material-icons md-36">{this.renderIcon(followerActivity.type)}</i>
                          {followerActivity.athleteName1} {followerActivity.athleteName2}
                        </div>
                        <div className='followerDate'>
                          {this.renderDate(followerActivity.start_date)}
                        </div>
                        <div className='followActivityName'>
                          {followerActivity.name}
                        </div>
                        <div className='followDistance'>
                          {this.renderDistance(followerActivity.distance)}
                        </div>
                      </div>
                    </div>
                  </Grid.Column>
                )
              })
            }
            </Grid>
          </Grid.Column>
          <Grid.Column width={3}>
            <div className='mapPhotoContainer'>
            <Image className='mapPhoto' src={blue}/>
            <Image className='mapPhoto' src={purple}/>
            <Image className='mapPhoto' src={decimal}/>
            <Image className='mapPhoto' src={warmSat}/>
            <Image className='mapPhoto' src={cartoon}/>
          </div>
          </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
