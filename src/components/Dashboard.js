import React, {Component} from 'react';
import {Feed, Icon, Grid, Image} from 'semantic-ui-react'
import StackGrid from "react-stack-grid";

import './styles/Dashboard.css'

import butterflyBlue from '../assets/butterflyBlue.png'
import apex1 from '../assets/apex1.png'
import apex2 from '../assets/apex2.png'
import apex3 from '../assets/apex3.png'
import apex4 from '../assets/apex4.png'
import apex5 from '../assets/apex5.png'
import apex6 from '../assets/apex6.png'
import apex7 from '../assets/apex7.png'
import apex8 from '../assets/apex8.png'
import mapBGImg from '../assets/mapBGImg.png'

const clientId = "20906"
const clientSecret = "a54ffe91af74c2e3fefcd3fe794159a1c120f136"
const accessToken = '37338812d9b76451f38f8c296616f94149881d15'
const baseUrl = "https://www.strava.com/oauth/token"
const requestUrl = "https://www.strava.com/api/v3/"

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
    console.log(this.state);
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
          polyline: activity.map.summary_polyline,
        }
      })
      this.setState({activities: list})
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
      let listFollowers = responseData.map(followerActvitity => {
        // console.log(responseData.id);
        return {
          id: followerActvitity.id,
          athleteName1: followerActvitity.athlete.firstname,
          athleteName2: followerActvitity.athlete.lastname,
          photo: followerActvitity.athlete.profile,
          name: followerActvitity.name,
          distance: followerActvitity.distance,
          type: followerActvitity.type,
          start_date: followerActvitity.start_date,
          polyline: followerActvitity.map.summary_polyline
        }
      })
      this.setState({followerActivities: listFollowers})
    }).catch((error) => {
      console.error(error);
    });
  }


  _navToMapView = (id) => {
    let stringId = JSON.stringify(id)
    this.setState({selectedActvity: id})
    this.saveActivityId('activityId', stringId)
    this.props.history.push('/mapview')
  }

  renderIcon = (type) => {
    if (type === 'Run') {
      return "child"
    } else if (type === 'Ride') {
      return "bicycle"
    } else if (type === 'Swim') {
      return 'fa fa-swim fa-2x'
    }
  }

  renderDistance = (distance) => {
    if (distance) {
      var miles = distance * 0.000621371
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

  // <Grid.Column width={12} className='gridImages'>
  //   <Grid columns='equal'>
  //     <Grid.Row column={4}>
  //       <Grid.Column>
  //         <Image  className='gridImage1'src={apex1}/>
  //       </Grid.Column>
  //       <Grid.Column >
  //         <Image className='gridImage va1'src={apex2}/>
  //       </Grid.Column>
  //       <Grid.Column>
  //         <Image className='gridImage1' src={apex3}/>
  //       </Grid.Column>
  //       <Grid.Column className='gridImage' >
  //         <Image className='gridImage va1'src={apex4}/>
  //       </Grid.Column>
  //     </Grid.Row>
  //     <Grid.Row column={4}>
  //       <Grid.Column >
  //         <Image className='gridImage' src={apex5}/>
  //       </Grid.Column>
  //       <Grid.Column >
  //         <Image className='gridImage1' src={apex6}/>
  //       </Grid.Column>
  //       <Grid.Column className='gridImage' >
  //         <Image  className='gridImage' src={apex7}/>
  //       </Grid.Column>
  //       <Grid.Column >
  //         <Image  className='gridImage1' src={apex8}/>
  //       </Grid.Column>
  //     </Grid.Row>
  //   </Grid>
  // </Grid.Column>

  render() {
    console.log(this.state.followerActivities);
    return (
      <div className="bodyDash">
        <div className="headerContainer">
          <div className="logoImage">
            <img className="topButterfly" src={butterflyBlue}/>
          </div>
        </div>
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column width={3} className="column1">
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
                    <Feed className="activity-feed">
                      <Feed.Event key={activity.id}>
                        <Feed.Label>
                          <Icon name={this.renderIcon(activity.type)}/>
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Date>{this.renderDate(activity.start_date)}</Feed.Date>
                          <Feed.Summary>
                            {activity.name}
                          </Feed.Summary>
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  )
                })
}
              </div>
            </Grid.Column>
            <Grid.Column width={9}>
              <img className='footerImage' src={mapBGImg}/>
            </Grid.Column>
            <Grid.Column width={3} className="column1">
              <div className='follow-feed'>
                {this.state.followerActivities.map(followerActivity => {
                  return (
                    <Feed className="activity-feed">
                      <Feed.Event key={followerActivity.id}>
                        <div>
                          <Image className='followerPhoto' src={followerActivity.photo}/>
                        </div>
                        <Feed.Label>
                          <Icon name={this.renderIcon(followerActivity.type)}/>
                        </Feed.Label>
                        <Feed.Content>
                          <Feed.Date>{this.renderDate(followerActivity.start_date)}</Feed.Date>
                          <Feed.Summary>
                            <div>
                              {followerActivity.name}
                            </div>
                            <div>
                              {this.renderDistance(followerActivity.distance)}
                            </div>
                          </Feed.Summary>
                        </Feed.Content>
                      </Feed.Event>
                    </Feed>
                  )
                })
              }
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
