import React, {useCallback, useEffect, useRef} from 'react';
import {AppState, FlatList, SafeAreaView} from 'react-native';
import SchemaStyles from '../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import * as ssbOP from '../../remote/ssbOP';
import {
  addPrivateUpdatesListener,
  addPublicUpdatesListener,
  connStart,
  getProfile,
  graph,
  loadMsg,
  replicationSchedulerStart,
  reqStartSSB,
  stage,
  suggestStart,
} from '../../remote/ssbOP';
import {checkMarkedMsgCB, markMsgCBByType} from '../../remote/ssb/MsgCB';
import ItemAgent from './home/ItemAgent';
import {trainProfileFeed} from '../../remote/ssbAPI';

const Home = ({
  cfg: {verbose},
  setFeedId,
  relations,
  feedDic,
  addPeerInfo,
  setFriendsGraph,
  publicMsg,
  addPublicMsg,
  setPrivateMsg,
  addFeedDic,
}) => {
  const {flex1} = SchemaStyles();

  useEffect(() => {
    // promise demo
    // foo().then(console.log).catch(console.warn);
    window.ssb ||
      reqStartSSB(ssb => {
        /******** ssb started handlers ********/
        ssbOP.ssb = window.ssb = ssb;
        setFeedId(ssb.id);
        // setup conn
        connStart(v => {
          console.log(v ? 'conn start' : 'conn started yet');
          // put online
          stage(v => console.log(v ? 'peer stage' : 'peer staged yet'));

          replicationSchedulerStart(v =>
            console.log('replicationSchedulerStart: ', v),
          );
          suggestStart(v => console.log('suggestStart: ', v));

          /******** msg handlers ********/
          addPublicUpdatesListener(key =>
            loadMsg(key, false, (err, msg) => {
              err || (checkMarkedMsgCB(msg), addPublicMsg(msg));
            }),
          );
          addPrivateUpdatesListener(key =>
            loadMsg(key, true, (err, msg) => err || setPrivateMsg(msg)),
          );

          mergeAndExecuteOfflineMsg();
        });
        /******** msg checker ********/
        markMsgCBByType('contact', () => graph(setFriendsGraph));
        markMsgCBByType('about', (_, {about}) =>
          getProfile(about, v => addPeerInfo([about, v])),
        );
      });
    /******** app state handlers ********/
    AppState.addEventListener('change', state => {
      switch (state) {
        case 'active':
          mergeAndExecuteOfflineMsg();
          break;
        case 'inactive':
          break;
      }
    });
  }, []);

  /******** mergeAndExecuteOfflineMsg ********/
  let loopIds = useRef([]);
  const mergeAndExecuteOfflineMsg = useCallback(() => {
    const [myFriends, myFollowing] = relations;
    loopIds.current = [...myFriends, ...myFollowing];
    console.log('mergeAndExecuteOfflineMsg: ', [...myFriends, ...myFollowing]);
    if (loopIds.current.length) {
      let fId = loopIds.current.shift();
      trainProfileFeed(fId, feedDic[fId], stepper);
    }
  }, [relations, feedDic]);

  const stepper = useCallback(
    idFeed => {
      const {feed} = idFeed;
      console.log('feed: ', idFeed.fId, 'add on: ', idFeed.feed);
      if (feed.length) {
        feed.forEach(checkMarkedMsgCB);
        addFeedDic(idFeed);
      }
      if (loopIds.current.length) {
        const fId = loopIds.current.shift();
        trainProfileFeed(fId, feedDic[fId], stepper);
      }
    },
    [loopIds.current, feedDic],
  );

  return (
    <SafeAreaView style={[flex1]}>
      <FlatList
        data={[...publicMsg].reverse()}
        keyExtractor={(_, index) => index}
        renderItem={info => <ItemAgent info={info} verbose={verbose} />}
      />
    </SafeAreaView>
  );
};

const msp = s => {
  return {
    cfg: s.cfg,
    feedId: s.user.feedId,
    relations: s.user.relations,
    feedDic: s.msg.feedDic,
    publicMsg: s.msg.publicMsg,
  };
};

const mdp = d => {
  return {
    setFeedId: v => d({type: 'setFeedId', payload: v}),
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
    setPublicMsg: v => d({type: 'setPublicMsg', payload: v}),
    addPublicMsg: v => {
      switch (v.messages[0].value.content.type) {
        case 'vote':
          d({type: 'setVote', payload: v.messages[0].value});
        default:
          d({type: 'addPublicMsg', payload: v});
      }
    },
    setPrivateMsg: v => d({type: 'setPrivateMsg', payload: v}),
    addPrivateMsg: v => d({type: 'addPrivateMsg', payload: v}),
    setFriendsGraph: v => d({type: 'setFriendsGraph', payload: v}),
    addFeedDic: v => d({type: 'addFeedDic', payload: v}),
  };
};

export default connect(msp, mdp)(Home);
