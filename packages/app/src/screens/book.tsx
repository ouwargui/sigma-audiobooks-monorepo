import React from 'react';
import {View, Text} from 'react-native';
import {BookNavProps} from '../routes/types';

const Book: React.FC<BookNavProps> = ({route}) => {
  return (
    <View>
      <Text>{route.params.author}</Text>
    </View>
  );
};

export default Book;
