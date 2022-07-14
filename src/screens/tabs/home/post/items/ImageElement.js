import {Linking} from 'react-native';
import Text from '../../../../../shared/comps/ComText';
import useSchemaStyles from '../../../../../shared/UseSchemaStyles';
import React from 'react';
import FastImage from 'react-native-fast-image';

/**
 * Created on 29 Apr 2022 by lonmee
 *
 */

export default ({index, link, url, verbose = false}) => {
  const {text} = useSchemaStyles();
  return (
    <>
      <FastImage
        style={[
          {
            width: 200,
            height: 200,
            borderRadius: 10,
            alignSelf: index % 2 ? 'flex-end' : 'flex-start',
          },
        ]}
        source={{uri: url}}
      />
      {verbose && (
        <Text>
          <Text style={[text]}>{'link: \n'}</Text>
          <Text style={[{color: 'yellow'}]}>{link}</Text>
          <Text style={[text]}>{'\nurl: \n'}</Text>
          <Text style={[{color: 'pink'}]} onPress={() => Linking.openURL(url)}>
            {url}
          </Text>
        </Text>
      )}
    </>
  );
};
