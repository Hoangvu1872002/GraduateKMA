import {useIsFocused} from '@react-navigation/native';
import {Cake, SearchNormal1, Sort} from 'iconsax-react-native';
// import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
// import eventAPI from '../../apis/eventApi';
import {
  CircleComponent,
  ContainerComponent,
  // ListEventComponent,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {EventModel} from '../../models/EventModel';
import {globalStyles} from '../../styles/globalStyles';

import AntDesign from 'react-native-vector-icons/AntDesign';
import LoadingModal from '../../modals/LoadingModal';

const eventBaseUrl = '/get-events?title=';

const SearchEvents = ({navigation, route}: any) => {
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<EventModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVisibleModalFilter, setIsVisibleModalFilter] = useState(false);

  // useEffect(() => {
  //   handleSearchEvent(eventBaseUrl);
  // }, []);

  // useEffect(() => {
  //   if (route.params) {
  //     setIsVisibleModalFilter(true);
  //   }
  // }, [route.params]);

  // useEffect(() => {
  //   if (searchKey) {
  //     const hangeChangeSearchValue = debounce(handleSearchWithTitle, 500);

  //     hangeChangeSearchValue();
  //   }
  // }, [searchKey]);

  // const handleSearchWithTitle = () => {
  //   handleSearchEvent(`${eventBaseUrl}?title=${searchKey}`);
  // };

  // const handleSearchEvent = async (api: string) => {
  //   setIsSearching(true);
  //   try {
  //     const res = await eventAPI.HandleEvent(api);

  //     setResults(res.data && res.data.length > 0 ? res.data : []);
  //     setIsSearching(false);
  //   } catch (error) {
  //     console.log(error);
  //     setIsSearching(false);
  //   }
  // };

  return (
    <ContainerComponent back title="Search">
      <SectionComponent>
        <RowComponent>
          <RowComponent styles={{flex: 1}}>
            <SearchNormal1
              variant="TwoTone"
              color={appColors.primary}
              size={20}
            />
            <View
              style={{
                width: 1,
                backgroundColor: appColors.primary,
                marginHorizontal: 10,
                height: 20,
              }}
            />
            <TextInput
              placeholder="Search"
              value={searchKey}
              onChangeText={val => setSearchKey(val)}
              style={[globalStyles.text, {flex: 1}]}
            />
            {searchKey && (
              <TouchableOpacity onPress={() => setSearchKey('')}>
                <AntDesign name="close" size={16} color={appColors.gray} />
              </TouchableOpacity>
            )}
            <SpaceComponent width={16} />
          </RowComponent>
          <TagComponent
            bgColor={appColors.primary}
            onPress={() => setIsVisibleModalFilter(true)}
            label="Filters"
            icon={
              <CircleComponent size={20} color={appColors.white}>
                <Sort size={16} color={appColors.primary} />
              </CircleComponent>
            }
          />
        </RowComponent>
      </SectionComponent>

      {/* <ListEventComponent items={results} /> */}

      <LoadingModal visible={isSearching} />
      {/* <ModalFilterEvents
        visible={isVisibleModalFilter}
        onClose={() => setIsVisibleModalFilter(false)}
        onFilter={vals => handleSearchEvent(vals)}
      /> */}
    </ContainerComponent>
  );
};

export default SearchEvents;
