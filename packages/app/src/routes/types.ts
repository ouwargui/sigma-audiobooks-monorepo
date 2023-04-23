import {AppRouter} from '@sigma-audiobooks/shared';
import {inferProcedureOutput} from '../utils/trpc';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Book = inferProcedureOutput<AppRouter['books']['getAll']>[number];

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Profile: undefined;
  Play: undefined;
};

export type RootParamList = {
  main: undefined;
  Book: Book;
};

type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootParamList>
>;

type StackScreenProps<T extends keyof RootParamList> = CompositeScreenProps<
  NativeStackScreenProps<RootParamList, T>,
  BottomTabScreenProps<TabParamList>
>;

export type HomeNavProps = TabScreenProps<'Home'>;
export type SearchNavProps = TabScreenProps<'Search'>;
export type LibraryNavProps = TabScreenProps<'Library'>;
export type ProfileNavProps = TabScreenProps<'Profile'>;
export type PlayNavProps = TabScreenProps<'Play'>;
export type BookNavProps = StackScreenProps<'Book'>;
