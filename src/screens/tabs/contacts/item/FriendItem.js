import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import SchemaStyles from '../../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import blobIdToUrl from 'ssb-serve-blobs/id-to-url';
import HeadIcon from '../../../../shared/comps/HeadIcon';
import {useNavigation, useRoute} from '@react-navigation/native';
import {findRootKey} from '../../../../store/filters/MsgFilters';
import {PeerIcons as iconDic} from '../../../../shared/Icons';

const FriendItem = ({fId, infoDic, privateMsg}) => {
  const {row, flex1, text} = SchemaStyles();
  const {textContainer, item, title, desc} = styles;
  const {name = '', description = '', image = ''} = infoDic[fId] || {},
    {replace, push} = useNavigation(),
    {name: routeName} = useRoute();

  return (
    <Pressable
      onPress={() =>
        routeName === 'FriendList'
          ? replace('MessageDetailsScreen', {
              rootKey: findRootKey(fId, privateMsg),
              recp: fId,
            })
          : push('PeerDetailsScreen', fId)
      }>
      <View style={[item, row, flex1]}>
        <HeadIcon
          image={image ? {uri: blobIdToUrl(image)} : iconDic.peerGirlIcon}
        />
        <View style={[textContainer]}>
          <Text numberOfLines={1} style={[title, text]}>
            {name || fId}
          </Text>
          {description !== '' && <Text style={[desc]}>bio: {description}</Text>}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 80,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  textContainer: {
    marginHorizontal: 15,
    marginVertical: 12,
  },
  title: {
    fontFamily: 'Helvetica',
    fontSize: 17,
    width: 240,
  },
  desc: {
    marginTop: 4,
    fontFamily: 'Helvetica',
    fontSize: 15,
    color: '#4E586E',
    width: 400,
  },
  searchBar: {marginVertical: 10},
});

const msp = s => {
  return {
    cfg: s.cfg,
    infoDic: s.info,
    privateMsg: s.private,
  };
};

const mdp = d => {
  return {};
};

export default connect(msp, mdp)(FriendItem);
