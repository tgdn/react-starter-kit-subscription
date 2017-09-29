import React from 'react';
import { Feed, Popup } from 'semantic-ui-react';
import Moment from '../moment';

const dateFormatLong = 'ddd MMM D Y [at] HH:mm';

export default ({ message }) =>
  <Feed.Event>
    <Feed.Content>
      <Feed.Summary>
        <Popup
          trigger={
            <Feed.Date>
              <Moment fromNow>
                {message.createdAt}
              </Moment>
            </Feed.Date>
          }
          content={
            <Moment format={dateFormatLong}>
              {message.createdAt}
            </Moment>
          }
          size="mini"
          position="right center"
          inverted
        />
      </Feed.Summary>
      <Feed.Extra text>
        {message.text}
      </Feed.Extra>
    </Feed.Content>
  </Feed.Event>;
