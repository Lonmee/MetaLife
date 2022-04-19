import {PermissionsAndroid, Platform} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';

/**
 * Created on 22 Feb 2022 by lonmee
 */

export const localDate = timestamp => {
  const date = new Date(timestamp),
    time = date.toLocaleTimeString(),
    day = date.toLocaleDateString();
  return time + ' ' + day;
};

export const checkAndLaunchCamera = (completeHandler, isFront = false) => {
  Platform.select({
    ios: () =>
      launchCamera(
        {
          cameraType: isFront ? 'front' : 'back',
          maxHeight: 1920,
          maxWidth: 1080,
          quality: 0.88,
          mediaType: 'photo',
        },
        completeHandler,
      ),
    android: () =>
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
        .then(value =>
          value
            ? launchCamera(
                {
                  cameraType: 'front',
                  maxHeight: 1920,
                  maxWidth: 1080,
                  quality: 0.88,
                  mediaType: 'photo',
                },
                completeHandler,
              )
            : PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: 'connections.modes.bluetooth.permission_request.title',
                  message:
                    'connections.modes.bluetooth.permission_request.message',
                  buttonPositive: 'call_to_action.yes',
                  buttonNegative: 'call_to_action.no',
                },
              ).then(value =>
                value === 'granted'
                  ? launchCamera(
                      {
                        cameraType: 'front',
                        maxHeight: 1920,
                        maxWidth: 1080,
                        quality: 0.88,
                        mediaType: 'photo',
                      },
                      completeHandler,
                    )
                  : Toast.show('please grant the privacy of camera'),
              ),
        )
        .catch(Toast.show),
  })();
};

// if (mentions && mentions.length) {
//   const cache = [];
//   for (const {link, name} of mentions) {
//     cache.push(blobIdToUrl(link));
//     // Image.getSize(
//     //   blobIdToUrl(link),
//     //   (w, h) => console.log(w, h),
//     //   console.warn,
//     // );
//   }
//   // Image.queryCache(cache).then(console.log).catch(console.warn);
// }
