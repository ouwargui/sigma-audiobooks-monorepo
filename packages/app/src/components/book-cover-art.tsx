import React from 'react';
import {View, Image} from 'react-native';

type Props = {
  coverArtUrl: string;
};

const BookCoverArt: React.FC<Props> = ({coverArtUrl}) => {
  return (
    <View className="w-36 aspect-[9/16] rounded-xl overflow-hidden">
      <Image className="w-full h-full" source={{uri: coverArtUrl}} />
    </View>
  );
};

export default BookCoverArt;
