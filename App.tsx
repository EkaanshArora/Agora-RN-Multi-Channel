import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcChannel,
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import requestCameraAndAudioPermission from './components/Permission';
import styles from './components/Style';

interface Props {}

/**
 * @property appId Used to 
 * @property token Used to join a channel
 * @property channelNameOne Channel Name for the current session
 * @property channelNameTwo Second Channel Name for the current session
 * @property joinSucceed State variable for storing success
 * @property peerIdsOne Array for storing connected peers on first channel
 * @property peerIdsTwo Array for storing connected peers on second channel
 */
interface State {
  appId: string;
  token: string | null;
  channelNameOne: string;
  channelNameTwo: string;
  joinSucceed: boolean;
  peerIdsOne: number[];
  peerIdsTwo: number[];
}

export default class App extends Component<Props, State> {
  _engine?: RtcEngine;
  _channel?: RtcChannel;

  constructor(props) {
    super(props);
    this.state = {
      appId: 'ENTER YOUR APP ID',
      token: null,                                                //using token as null for App ID without certificate
      channelNameOne: 'channel-1',
      channelNameTwo: 'channel-2',
      joinSucceed: false,
      peerIdsOne: [],
      peerIdsTwo: [],
    };
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.destroy();
  }

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  init = async () => {
    const { appId, channelNameTwo } = this.state;
    this._engine = await RtcEngine.create(appId);
    this._channel = await RtcChannel.create(channelNameTwo);
    await this._engine.enableVideo();

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._channel.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIdsOne } = this.state;
      // If new user
      if (peerIdsOne.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIdsOne: [...peerIdsOne, uid],
        });
      }
    });

    this._channel.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIdsTwo } = this.state;
      // If new user
      if (peerIdsTwo.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIdsTwo: [...peerIdsTwo, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIdsOne } = this.state;
      this.setState({
        // Remove peer ID from state array one
        peerIdsOne: peerIdsOne.filter((id) => id !== uid),
      });
    });

    this._channel.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIdsTwo } = this.state;
      this.setState({
        // Remove peer ID from state array two
        peerIdsTwo: peerIdsTwo.filter((id) => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._channel.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    let channelOptions = {
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    };

    // Join Channel One using RtcEngine object, null token and channel name
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelNameOne,
      null,
      0
    );

    // Join Channel Two using RtcChannel object, null token and channel name
    await this._channel?.joinChannel(this.state.token, null, 0, channelOptions);
  };

  /**
   * @name endCall
   * @description Function to end the call by leaving both channels
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    await this._channel?.leaveChannel();
    this.setState({ peerIdsOne: [], peerIdsTwo: [], joinSucceed: false });
  };

  /**
   * @name destroy
   * @description Function to destroy the RtcEngine and RtcChannel instances
   */
  destroy = async () => {
    await this._channel?.destroy();
    await this._engine?.destroy();
  };

  render() {
    return (
      <View style={styles.max}>
        <View style={styles.max}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity onPress={this.startCall} style={styles.button}>
              <Text style={styles.buttonText}> Start Call </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.endCall} style={styles.button}>
              <Text style={styles.buttonText}> End Call </Text>
            </TouchableOpacity>
          </View>
          {this._renderVideos()}
        </View>
      </View>
    );
  }

  _renderVideos = () => {
    const { joinSucceed } = this.state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        {this._renderRemoteVideosOne()}
        {this._renderRemoteVideosTwo()}
      </View>
    ) : null;
  };

  _renderRemoteVideosOne = () => {
    const { peerIdsOne } = this.state;
    return (
      <ScrollView
        style={{ flex: 1, borderWidth: 1 }}
        contentContainerStyle={{ paddingHorizontal: 2.5, justifyContent: 'center', alignItems:'center' }}
        horizontal={true}
      >
        <RtcLocalView.SurfaceView
          style={styles.remote}
          channelId={this.state.channelNameOne}
          renderMode={VideoRenderMode.Hidden}
        />
        {peerIdsOne.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={this.state.channelNameOne}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
              key={value}
            />
          );
        })}
      </ScrollView>
    );
  };

  _renderRemoteVideosTwo = () => {
    const { peerIdsTwo } = this.state;
    return (
      <ScrollView
        style={{ flex: 1, borderWidth: 1 }}
        contentContainerStyle={{ paddingHorizontal: 2.5, justifyContent: 'center', alignItems: 'center'}}
        horizontal={true}
      >
        {peerIdsTwo.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={this.state.channelNameTwo}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
              key={value}
            />
          );
        })}
      </ScrollView>
    );
  };
}
