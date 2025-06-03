/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {enableLayoutAnimations} from 'react-native-reanimated';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs(true);

enableLayoutAnimations(false);

AppRegistry.registerComponent(appName, () => App);
