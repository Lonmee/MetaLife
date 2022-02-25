/**
 * Created on 17 Feb 2022 by lonmee
 */
import React from 'react';
import {
  Image,
  ImageResizeModeStatic,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import {localDate} from '../../../../utils';
import PostMsgPanel from './PostMsgPannel';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import {PeerIcons} from '../../../../shared/Icons';

const PostItem = ({
  item: {
    value: {author, timestamp, content},
  },
  peerInfoDic,
}) => {
  const {row, flex1, text, placeholderTextColor, justifySpaceBetween} =
      SchemaStyles(),
    {container, textContainer, contentContainer, panel} = styles;

  const {
      name = author.substring(0, 10),
      description = '',
      image = '',
    } = peerInfoDic[author] || {},
    {text: cText, mentions = null} = content;
  if (mentions && mentions.length) {
    const cache = [];
    for (const {link, name} of mentions) {
      cache.push(blobIdToUrl(link));
      // Image.getSize(
      //   blobIdToUrl(link),
      //   (w, h) => console.log(w, h),
      //   console.warn,
      // );
    }
    Image.queryCache(cache).then(console.log).catch(console.warn);
  }
  return (
    <View style={[row, container]}>
      <HeadIcon
        image={image ? {uri: blobIdToUrl(image)} : PeerIcons.peerIcon}
      />
      <View style={[textContainer]}>
        <Text>
          <Text style={[text]}>{name}</Text>
          <Text style={[placeholderTextColor]}>
            {'\n' + localDate(timestamp)}
          </Text>
        </Text>
        <Text style={[text, contentContainer]}>{cText}</Text>
        {mentions &&
          mentions.map(({link, name}, i) => (
            <Image
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 10,
                alignSelf: i % 2 ? 'flex-end' : 'flex-start',
              }}
              // resizeMethod={'scale'}
              // resizeMode={'center'}
              height={200}
              width={200}
              key={name}
              source={{uri: blobIdToUrl(link)}}
            />
          ))}
        <PostMsgPanel style={[row, flex1, justifySpaceBetween, panel]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    paddingTop: 10,
  },
  panel: {
    paddingTop: 15,
    paddingEnd: 10,
  },
});

const msp = s => {
  return {
    cfg: s.cfg,
    peerInfoDic: s.contacts.peerInfoDic,
  };
};

const mdp = d => {
  return {
    addPeerInfo: v => d({type: 'addPeerInfo', payload: v}),
  };
};

export default connect(msp, mdp)(PostItem);
