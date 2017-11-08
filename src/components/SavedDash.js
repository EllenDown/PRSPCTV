//start from 249

<Grid.Column width={9}>
  <img className='footerImage' src={mapBGImg}/>
</Grid.Column>
<Grid.Column width={9}>
  <img className='footerImage' src={mapBGImg}/>
</Grid.Column>
<Grid.Column width={3} className="column2">
  <div className='follow-feed'>
    {this.state.followerActivities.map(followerActivity => {
      return (
        <Feed className="activity-feed" onClick={(e) => this._toMapFollowView(followerActivity.id)}>
          <Feed.Event key={followerActivity.id}>
            <div>
              <Image className='followerPhoto' src={followerActivity.photo}/>
            </div>
            <Feed.Label>
              <i class="material-icons md-36">{this.renderIcon(followerActivity.type)}</i>
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
