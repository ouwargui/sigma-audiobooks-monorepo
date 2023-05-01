import React, {useState} from 'react';
import {View, Image} from 'react-native';

type Props = {
  coverArtUrl: string;
};

const BookCoverArt: React.FC<Props> = ({coverArtUrl}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View className="w-full aspect-[9/16] rounded-xl overflow-hidden">
      <Image
        className="w-full h-full"
        source={{uri: coverArtUrl}}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && <View className="absolute w-full h-full bg-gray-100" />}
    </View>
  );
};

export default BookCoverArt;
