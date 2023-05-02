import React from 'react';
import {View, Text} from 'react-native';
import {Book} from '../routes/types';
import BookCoverArt from './book-cover-art';

type Props = {
  book: Book;
};

const SearchResults: React.FC<Props> = ({book}) => {
  return (
    <View className="mx-4 flex-row">
      <View className="w-20">
        <BookCoverArt coverArtUrl={book.coverArtUrl} />
      </View>
      <View className="w-2" />
      <View className="flex-1 py-4">
        <Text className="text-base font-semi text-zinc-700">{book.title}</Text>
      </View>
    </View>
  );
};

export default SearchResults;
