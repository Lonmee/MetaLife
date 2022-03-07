/**
 * Created on 08 Nov 2021 by lonmee
 */
import React, {useEffect} from 'react';
import {
  Button,
  Image,
  Pressable,
  RotateZTransform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import SchemaStyles from '../../../shared/SchemaStyles';
import {connect} from 'react-redux/lib/exports';
import ControllerItem from '../../../shared/comps/ControllerItem';
import I18n from '../../../i18n/I18n';
import Section from '../../../shared/comps/Section';
import {NormalSeparator} from '../../../shared/comps/SectionSeparators';
import {ArrowImage} from '../../../shared/Icons';

const HolderIcon = require('../../../assets/image/profiles/setting_icon_add.png');

const Setting = ({navigation, darkMode, setDarkMode, lang, setLang}) => {
  const {flex1, alignItemsCenter, marginTop10} = SchemaStyles();
  useEffect(() => {
    // console.log('subscribe');
    return () => {
      // console.log('componentDidUpdate');
    };
  }, []);

  return (
    <SafeAreaView style={[flex1]}>
      <ScrollView>
        <Section style={[marginTop10, alignItemsCenter, {marginBottom: -10}]}>
          <Image source={HolderIcon} />
        </Section>
        <Section separator={NormalSeparator}>
          <Pressable
            onPress={() =>
              navigation.navigate('TextEditor', {navigation, title: 'Nickname'})
            }>
            <ControllerItem title={'Nickname'}>
              <Image source={ArrowImage} />
            </ControllerItem>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('TextEditor', {
                navigation,
                title: 'Introduction',
              });
            }}>
            <ControllerItem title={'Introduction'}>
              <Image source={ArrowImage} />
            </ControllerItem>
          </Pressable>
        </Section>
        <Section
          style={[marginTop10]}
          title={'Settings'}
          separator={NormalSeparator}>
          <ControllerItem title={'Dark mode'}>
            <Switch
              value={darkMode}
              onValueChange={() => setDarkMode(!darkMode)}
            />
          </ControllerItem>
          <ControllerItem title={'En / Zh'}>
            <Switch
              value={lang === 'en'}
              onValueChange={() => setLang(lang === 'en' ? 'zh' : 'en')}
            />
          </ControllerItem>
        </Section>
        <Section
          style={[marginTop10]}
          title={'Privacy'}
          separator={NormalSeparator}>
          <ControllerItem title={'Not allowed to view my DAO'}>
            <Switch
              value={lang === 'en'}
              onValueChange={() => setLang(lang === 'en' ? 'zh' : 'en')}
            />
          </ControllerItem>
          <ControllerItem title={'Not allowed to view my NFT'}>
            <Switch
              value={lang === 'en'}
              onValueChange={() => setLang(lang === 'en' ? 'zh' : 'en')}
            />
          </ControllerItem>
          <ControllerItem title={"Don't allow strangers to send me messages"}>
            <Switch
              value={lang === 'en'}
              onValueChange={() => setLang(lang === 'en' ? 'zh' : 'en')}
            />
          </ControllerItem>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

const msp = s => s.cfg;

const mdp = d => {
  return {
    setDarkMode: darkMode => d({type: 'setDarkMode', payload: darkMode}),
    setLang: lang => {
      d({type: 'setLang', payload: lang});
      I18n.locale = lang;
    },
  };
};

export default connect(msp, mdp)(Setting);
