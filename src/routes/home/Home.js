import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Container, Message } from 'semantic-ui-react';
import Messages from 'components/Messages';

const mapStateToProps = state => ({
  rtc: state.rtc,
});

class Home extends React.Component {
  static propTypes = {
    rtc: PropTypes.shape({
      connected: PropTypes.bool.isRequired,
      connecting: PropTypes.bool.isRequired,
    }).isRequired,
  };

  render() {
    const { rtc: { connected, connecting } } = this.props;
    const socketStatusText = connected
      ? 'Connected'
      : (connecting && 'Connecting...') || 'Disconnected';

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width="16">
            <Container fluid>
              <Message
                header={socketStatusText}
                success={connected}
                error={!connected && !connecting}
                color={(connecting && 'yellow') || null}
              />
              <Messages />
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps)(Home);
