import {AppRouter} from '@sigma-audiobooks/shared';
import {inferProcedureOutput} from '../utils/trpc';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type Book = inferProcedureOutput<AppRouter['books']['getAll']>[number];

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Profile: undefined;
  Play: {shouldPlay?: boolean};
};

export type RootParamList = {
  main: NavigatorScreenParams<TabParamList>;
  Book: Book;
};

export type ScreenNames = keyof TabParamList | keyof RootParamList;

type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootParamList>
>;

type StackScreenProps<T extends keyof RootParamList> = NativeStackScreenProps<
  RootParamList,
  T
>;

export type HomeNavProps = TabScreenProps<'Home'>;
export type SearchNavProps = TabScreenProps<'Search'>;
export type LibraryNavProps = TabScreenProps<'Library'>;
export type ProfileNavProps = TabScreenProps<'Profile'>;
export type PlayNavProps = TabScreenProps<'Play'>;
export type BookNavProps = StackScreenProps<'Book'>;
