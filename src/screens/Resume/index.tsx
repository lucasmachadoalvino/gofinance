import React, { useCallback, useEffect, useState } from "react";
import { HistoryCard } from "../../components/HistoryCard";
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from "./styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Types } from "../../global/interfaces/interfaces";
import { categories } from "../../utils/categories";
import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, format, subMonths } from "date-fns";
import { BorderlessButton } from "react-native-gesture-handler";
import { ptBR } from "date-fns/locale";
import { ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

export interface TransactionData {
  type: Types;
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFomated: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const theme = useTheme();

  const { user } = useAuth();

  function handleDateChange(action: "next" | "prev") {
    if (action == "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === Types.negative &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensiveTotal = expensives.reduce(
      (accumulator: number, expensive: TransactionData) => {
        return accumulator + Number(expensive.amount);
      },
      0
    );

    const totalByCategories: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFomated = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

        totalByCategories.push({
          key: category.key,
          name: category.name,
          totalFomated,
          total: categorySum,
          color: category.color,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategories);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <BorderlessButton onPress={() => handleDateChange("prev")}>
              <MonthSelectIcon name={"chevron-left"} />
            </BorderlessButton>
            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>
            <BorderlessButton onPress={() => handleDateChange("next")}>
              <MonthSelectIcon name={"chevron-right"} />
            </BorderlessButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x="percent"
              y={"total"}
              colorScale={totalByCategories.map(
                (categories) => categories.color
              )}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: "bold",
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.total.toString()}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
