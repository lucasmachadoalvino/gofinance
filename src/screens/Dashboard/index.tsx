import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Content,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import { Types } from "../../global/interfaces/interfaces";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  value: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensive: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const { sigInOut, user } = useAuth();

  const theme = useTheme();

  async function loadTransactions() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensiveSum = 0;

    function getLastTransactionDate(collection: DataListProps[], type: Types) {
      const collectionFiltered = collection.filter(
        (transaction: DataListProps) => transaction.type == type
      );

      if (collectionFiltered.length === 0) {
        return 0;
      }
      const lastTransactions = new Date(
        Math.max.apply(
          Math,
          collectionFiltered.map((transaction: DataListProps) =>
            new Date(transaction.date).getTime()
          )
        )
      );

      const month = lastTransactions.getMonth();

      return `${lastTransactions.getDate()} do ${month}`;
    }

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        if (item.type == Types.positive) {
          entriesSum += Number(item.amount);
        } else {
          expensiveSum += Number(item.amount);
        }

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      Types.positive
    );

    const lastTransactionExpansives = getLastTransactionDate(
      transactions,
      Types.negative
    );

    const totalInterval = `01 a ${lastTransactionExpansives}`;

    setHighlightData({
      entries: {
        value: entriesSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastTransactionEntries
          ? `ultima entrada dia ${lastTransactionEntries}`
          : "Não ha transacoes",
      },
      expensive: {
        value: expensiveSum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: lastTransactionExpansives
          ? `ultima entrada dia ${lastTransactionExpansives} `
          : "Não ha transacoes",
      },
      total: {
        value: (entriesSum - expensiveSum).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setTransactions(transactionsFormatted);

    setIsLoading(false);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <Content>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Ola,</UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={sigInOut}>
                <Icon name="power" />
              </LogoutButton>
            </Content>
          </Header>

          <HighlightCards>
            <HighlightCard
              title={"Entradas"}
              amount={highlightData.entries.value}
              lastTransaction={highlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title={"Saidas"}
              amount={highlightData.expensive.value}
              lastTransaction={highlightData.expensive.lastTransaction}
              type={"down"}
            />
            <HighlightCard
              title={"Total"}
              amount={highlightData.total.value}
              lastTransaction={highlightData.total.lastTransaction}
              type={"total"}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>
            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
