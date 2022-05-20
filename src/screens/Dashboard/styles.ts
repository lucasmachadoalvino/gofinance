import styled from "styled-components/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import {
  getBottomSpace,
  getStatusBarHeight,
} from "react-native-iphone-x-helper";
import { FlatList } from "react-native";
import { DataListProps } from ".";
import { BorderlessButton } from "react-native-gesture-handler";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  height: ${RFPercentage(42)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  margin-top: ${getStatusBarHeight() + 28}px;
`;

export const Photo = styled.Image`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: 10px;
`;

export const User = styled.View`
  margin-left: 17px;
`;

export const UserGreeting = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;

export const UserName = styled.Text`
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const LogoutButton = styled(BorderlessButton)``;

export const Icon = styled(Feather)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(24)}px;
`;

export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  padding: 0 24px;
  position: absolute;
  margin-top: ${RFPercentage(20)}px;
`;

export const Transactions = styled.View`
  flex: 1;
  padding: 0 24px;
  margin-top: ${RFPercentage(12)}px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text_dark};
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 16px;
`;

export const TransactionList = styled(
  FlatList as new () => FlatList<DataListProps>
).attrs({
  showsVerticalScrollIndicator: false,
})`
  padding-bottom: ${getBottomSpace()}px;
`;

export const LoadContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
